import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getCurrentSession, onAuthChange, signIn as realSignIn, signUp as realSignUp, signOut as realSignOut } from '../services/auth'
import {
  CREDITS_PER_DAY,
  supabase,
  getCreditsUsed,
  incrementCreditsUsed,
  saveGeneratedScript,
  fetchGeneratedScripts,
  deleteGeneratedScript,
  fetchSubscription,
  upsertSubscription
} from '../services/supabase'
import { generateScript as callGemini, analyzeHook as callAnalyze } from '../services/gemini'
import { captureReferrer } from '../services/referral'
import {
  toV0Script,
  computeViralScore
} from './generator'

export const DAILY_TOTAL = CREDITS_PER_DAY

const PLAN_LIMITS = { Starter: CREDITS_PER_DAY, Pro: 20, Studio: 500 }
const PLAN_NAMES = ['Starter', 'Pro', 'Studio']

export function isUnlimitedPlan(plan) {
  return plan === 'Studio'
}

const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

function toHistoryItem(row) {
  const r = row.result || {}
  const meta = r._meta || {}
  return {
    id: row.id,
    title: r.title || `${row.topic || 'Script'} — généré`,
    network: row.network || 'tiktok',
    format: meta.format || 'hook-histoire',
    duration: meta.duration || 30,
    createdAt: row.created_at,
    score: typeof r.viralScore === 'number' ? r.viralScore : 70,
    hashtags: Array.isArray(r.hashtags) ? r.hashtags : [],
    market: meta.market || 'fr',
    result: r,
    topic: row.topic || ''
  }
}

export function AppProvider({ children }) {
  const [session, setSession] = useState(null)
  const [creditsUsed, setCreditsUsed] = useState(0)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [plan, setPlanState] = useState(() => {
    try {
      const saved = localStorage.getItem('pg-plan')
      return PLAN_NAMES.includes(saved) ? saved : 'Starter'
    } catch {
      return 'Starter'
    }
  })
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('pg-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('pg-theme', theme)
    } catch {
      /* stockage indisponible */
    }
  }, [theme])

  const setTheme = useCallback((next) => setThemeState(next), [])

  useEffect(() => {
    captureReferrer()
  }, [])

  useEffect(() => {
    getCurrentSession().then(setSession).catch(() => {})
    const sub = onAuthChange((s) => setSession(s))
    return () => sub?.unsubscribe?.()
  }, [])

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('access_token') && supabase) {
      supabase.auth.setSession({
        access_token: new URLSearchParams(hash.slice(1)).get('access_token'),
        refresh_token: new URLSearchParams(hash.slice(1)).get('refresh_token'),
      }).then(({ data, error }) => {
        if (!error && data.session) {
          setSession(data.session)
          window.location.hash = ''
          window.location.href = window.location.pathname
        }
      })
    }
  }, [])

  const refreshQuota = useCallback(async (uid) => {
    try {
      const used = await getCreditsUsed(uid)
      setCreditsUsed(Math.max(0, used))
    } catch {
      /* table facultative */
    }
  }, [])

  const refreshHistory = useCallback(async (uid) => {
    setHistoryLoading(true)
    try {
      const rows = await fetchGeneratedScripts(uid)
      setHistory(rows.map(toHistoryItem))
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (session?.user) {
      refreshQuota(session.user.id)
      refreshHistory(session.user.id)
      fetchSubscription(session.user.id).then((sub) => {
        if (sub && PLAN_NAMES.includes(sub.plan)) {
          setPlanState(sub.plan)
          try { localStorage.setItem('pg-plan', sub.plan) } catch {}
        }
      }).catch(() => {})
    } else {
      setCreditsUsed(0)
      setHistory([])
    }
  }, [session, refreshQuota, refreshHistory])

  const user = session?.user
    ? {
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Utilisateur',
        email: session.user.email,
        initials: (session.user.email?.split('@')[0]?.slice(0, 2) || 'PG').toUpperCase(),
        plan
      }
    : null

  const creditsTotal = PLAN_LIMITS[plan] ?? DAILY_TOTAL
  const creditsLeft = Math.max(0, creditsTotal - creditsUsed)

  const upgradeToPlan = useCallback(
    async (planName) => {
      const next = PLAN_NAMES.includes(planName) ? planName : 'Starter'
      setPlanState(next)
      try {
        localStorage.setItem('pg-plan', next)
      } catch {
        /* stockage indisponible */
      }
      if (session?.user) {
        try {
          await upsertSubscription(session.user.id, { plan: next })
        } catch (e) {
          console.warn('Plan non synchronisé sur Supabase', e)
        }
      }
      return next
    },
    [session]
  )

  const generate = useCallback(
    async ({ network, topic, tone = 'storytelling', format, duration = 30, audience, cta, market = 'fr' }, { recharge = false } = {}) => {
      if (creditsLeft <= 0 && user && !recharge) {
        throw new Error('crédits')
      }
      const real = await callGemini(network, topic, tone, { format, duration, audience, cta, market })
      const result = toV0Script(real, { network, topic, duration })
      if (user) {
        try {
          if (!recharge) await incrementCreditsUsed(user.id)
          await saveGeneratedScript(user.id, network, topic, {
            ...result,
            _meta: { format, duration, network, topic, market }
          })
          await refreshQuota(user.id)
          await refreshHistory(user.id)
        } catch (e) {
          console.warn('Supabase sync skipped', e)
        }
      } else {
        if (!recharge) setCreditsUsed((c) => c + 1)
      }
      return result
    },
    [creditsLeft, user, refreshQuota, refreshHistory]
  )

  const analyze = useCallback(
    async (hook) => {
      let real = null
      try {
        real = await callAnalyze(hook)
      } catch {
        real = null
      }
      const v = computeViralScore({
        aiMetrics: real?.metrics,
        aiScore: real?.score,
        analysis: real?.analysis,
        reason: real?.reason,
        actionPlan: real?.actionPlan,
        hook
      })
      const tips =
        Array.isArray(real?.suggestions) && real.suggestions.length ? real.suggestions : v.suggestions
      return {
        ...v,
        suggestions: tips,
        rewriteTips: tips
      }
    },
    []
  )

  const removeHistoryItem = useCallback(
    async (id) => {
      if (!user) return
      try {
        await deleteGeneratedScript(user.id, id)
        await refreshHistory(user.id)
      } catch (e) {
        console.warn(e)
      }
    },
    [user, refreshHistory]
  )

  const signIn = useCallback(async (email, password) => {
    const s = await realSignIn(email, password)
    setSession(s)
    return s
  }, [])

  const signUp = useCallback(async (email, password) => {
    const data = await realSignUp(email, password)
    if (data?.session) {
      setSession(data.session)
    } else if (data?.user) {
      throw new Error('confirmation-required')
    }
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await realSignOut()
    } catch {
      /* déjà déconnecté */
    }
    setSession(null)
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        plan,
        creditsUsed,
        creditsLeft,
        creditsTotal,
        history,
        historyLoading,
        theme,
        setTheme,
        generate,
        analyze,
        upgradeToPlan,
        refreshHistory: () => user && refreshHistory(user.id),
        removeHistoryItem,
        signIn,
        signUp,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  )
}