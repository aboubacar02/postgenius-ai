import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  supabaseUrl.includes('.supabase.co') &&
  (supabaseAnonKey.startsWith('eyJ') || supabaseAnonKey.startsWith('sb_publishable'))
)

let supabase = null
if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch {
    supabase = null
  }
}

export { supabase }
export const CREDITS_PER_DAY = 5

// ── localStorage fallback ─────────────────────────────────
const LS_SCRIPTS_KEY = 'pg-generated-scripts'
const LS_CREDITS_KEY = 'pg-credits'
const LS_USER_KEY = 'pg-local-user'

function lsGetScripts() {
  try { return JSON.parse(localStorage.getItem(LS_SCRIPTS_KEY) || '[]') } catch { return [] }
}
function lsSetScripts(arr) {
  try { localStorage.setItem(LS_SCRIPTS_KEY, JSON.stringify(arr)) } catch {}
}
function lsGetCredits() {
  try {
    const data = JSON.parse(localStorage.getItem(LS_CREDITS_KEY) || '{}')
    const today = new Date().toISOString().slice(0, 10)
    if (data.date === today) return data.used || 0
    return 0
  } catch { return 0 }
}
function lsSetCredits(used) {
  try {
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem(LS_CREDITS_KEY, JSON.stringify({ date: today, used }))
  } catch {}
}

export function getLocalUser() {
  try {
    return JSON.parse(localStorage.getItem(LS_USER_KEY) || 'null')
  } catch { return null }
}
export function setLocalUser(user) {
  try {
    if (user) localStorage.setItem(LS_USER_KEY, JSON.stringify(user))
    else localStorage.removeItem(LS_USER_KEY)
  } catch {}
}

// ── Credits ───────────────────────────────────────────────

export async function getCreditsUsed(userId) {
  if (supabase) {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_used')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()
      if (error) throw error
      return data?.credits_used ?? 0
    } catch {
      return lsGetCredits()
    }
  }
  return lsGetCredits()
}

export async function incrementCreditsUsed(userId) {
  if (supabase) {
    try {
      const today = new Date().toISOString().slice(0, 10)
      const { data: existing } = await supabase
        .from('user_credits')
        .select('id, credits_used')
        .eq('user_id', userId)
        .eq('date', today)
        .maybeSingle()

      if (existing) {
        await supabase.from('user_credits').update({ credits_used: existing.credits_used + 1 }).eq('id', existing.id)
      } else {
        await supabase.from('user_credits').insert({ user_id: userId, date: today, credits_used: 1 })
      }
      return
    } catch {
      /* fallback to local */
    }
  }
  lsSetCredits(lsGetCredits() + 1)
}

// ── History ───────────────────────────────────────────────

export async function saveGeneratedScript(userId, network, topic, result) {
  if (supabase) {
    try {
      await supabase.from('generated_scripts').insert({ user_id: userId, network, topic, result })
      return
    } catch {
      /* fallback to local */
    }
  }
  const scripts = lsGetScripts()
  scripts.unshift({
    id: crypto.randomUUID(),
    user_id: userId || 'local',
    network,
    topic,
    result,
    created_at: new Date().toISOString()
  })
  if (scripts.length > 100) scripts.length = 100
  lsSetScripts(scripts)
}

export async function fetchGeneratedScripts(userId, limit = 50) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('generated_scripts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (error) throw error
      return data
    } catch {
      /* fallback to local */
    }
  }
  return lsGetScripts()
    .filter((s) => s.user_id === userId || s.user_id === 'local')
    .slice(0, limit)
}

export async function deleteGeneratedScript(userId, scriptId) {
  if (supabase) {
    try {
      await supabase.from('generated_scripts').delete().eq('user_id', userId).eq('id', scriptId)
      return
    } catch {
      /* fallback to local */
    }
  }
  lsSetScripts(lsGetScripts().filter((s) => s.id !== scriptId))
}
