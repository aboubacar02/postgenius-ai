import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Clapperboard, Flame, Gauge, History, LayoutDashboard, Sparkles, User, Wallet, X, Zap } from 'lucide-react'
import { GradientAvatar } from '../media/gradient-avatar'
import { ThemeToggle } from '../theme-toggle'
import { useApp } from '../../lib/app-context'
import { useI18n, LANGUAGES } from '../../lib/i18n'
import { cn } from '../../lib/utils'

const NAV_SECTIONS = [
  {
    title: 'nav.studio',
    items: [
      { href: '/', labelKey: 'nav.home', icon: LayoutDashboard, end: true },
      { href: '/generateur', labelKey: 'nav.create', icon: Sparkles },
      { href: '/score-viral', labelKey: 'nav.score', icon: Gauge }
    ]
  },
  {
    title: 'nav.history',
    items: [
      { href: '/historique', labelKey: 'nav.history', icon: History },
      { href: '/tendances', labelKey: 'nav.trending', icon: Flame }
    ]
  },
  {
    title: 'nav.wallet',
    items: [
      { href: '/faceless', labelKey: 'nav.faceless', icon: Clapperboard },
      { href: '/tarifs', labelKey: 'nav.wallet', icon: Wallet },
      { href: '/parametres', labelKey: 'nav.profile', icon: User }
    ]
  }
]

export function AppDrawer({ open, onOpenChange }) {
  const { user, creditsLeft, creditsTotal, plan } = useApp()
  const { t, lang, setLang } = useI18n()
  const location = useLocation()

  useEffect(() => {
    onOpenChange?.(false)
  }, [location.pathname, onOpenChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onOpenChange?.(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onOpenChange])

  if (!open) return null

  const display = user

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-xs flex-col border-r border-white/[0.06] bg-pg-background shadow-2xl">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            {display ? (
              <>
                <GradientAvatar initials={display.initials} className="size-9 text-sm" />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-pg-text">{display.name}</span>
                  <span className="text-[11px] text-pg-muted">
                    {t('topbar.plan', { plan: display.plan || 'Free' })}
                  </span>
                </div>
              </>
            ) : (
              <NavLink to="/parametres" onClick={() => onOpenChange?.(false)} className="text-sm font-semibold text-primary hover:underline">
                Se connecter
              </NavLink>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange?.(false)}
            aria-label={t('topbar.closeMenu')}
            className="inline-flex size-8 items-center justify-center rounded-md text-pg-muted hover:bg-white/[0.06] hover:text-pg-text"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-5">
              <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-pg-muted">
                {t(section.title)}
              </span>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      end={item.end}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all active:scale-95',
                          isActive
                            ? 'bg-primary-10 font-semibold text-primary'
                            : 'text-pg-muted hover:bg-white/[0.04] hover:text-pg-text'
                        )
                      }
                    >
                      <Icon className="size-4" />
                      {t(item.labelKey)}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="mb-5 px-3">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-pg-muted">
              {t('topbar.language')}
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLang(l.id)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors',
                    lang === l.id
                      ? 'border-primary-40 bg-primary-10 text-primary'
                      : 'border-white/[0.04] text-pg-muted hover:border-white/[0.12] hover:text-pg-text'
                  )}
                >
                  <span className="text-sm">{l.flag}</span>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 rounded-full border border-indigo-500/15 bg-white/[0.03] px-3 py-1.5 backdrop-blur-md">
              <Zap className="size-3.5 text-warning" />
              <span className="font-mono text-[12px] font-medium tracking-wider text-pg-muted">
                {t('topbar.credits', { used: Math.min(creditsLeft, creditsTotal), total: creditsTotal })}
              </span>
            </div>
            <ThemeToggle />
          </div>
          <NavLink
            to="/generateur"
            className={({ isActive }) =>
              cn(
                'flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-fuchsia-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-transform active:scale-[0.97]',
                isActive && 'opacity-90'
              )
            }
          >
            <Sparkles className="size-4" />
            {t('topbar.newProject')}
          </NavLink>
        </div>
      </div>
    </div>
  )
}
