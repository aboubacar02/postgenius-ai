import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Clapperboard,
  Flame,
  Gauge,
  History,
  LayoutDashboard,
  LogOut,
  LogIn,
  MoreHorizontal,
  Settings,
  Sparkles,
  Wallet,
  X
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'
import { useApp } from '../../lib/app-context'

const CORE_ITEMS = [
  { href: '/', label: 'Studio', icon: LayoutDashboard, end: true },
  { href: '/generateur', label: 'Générer', icon: Sparkles },
  { href: '/faceless', label: 'Faceless', icon: Clapperboard },
  { href: '/tendances', label: 'Tendances', icon: Flame },
]

const MORE_ITEMS = [
  { href: '/score-viral', labelKey: 'nav.score', icon: Gauge },
  { href: '/historique', labelKey: 'nav.history', icon: History },
  { href: '/tarifs', labelKey: 'nav.wallet', icon: Wallet },
  { href: '/parametres', labelKey: 'nav.settings', icon: Settings },
]

export function BottomNav() {
  const { t } = useI18n()
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef(null)
  const display = user || { initials: 'U' }

  useEffect(() => {
    if (!moreOpen) return
    function handle(e) {
      if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false)
    }
    document.addEventListener('touchstart', handle)
    document.addEventListener('mousedown', handle)
    return () => {
      document.removeEventListener('touchstart', handle)
      document.removeEventListener('mousedown', handle)
    }
  }, [moreOpen])

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-zinc-900/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-[480px] items-center justify-around px-2">
        {CORE_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-[48px] min-w-[48px] flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-all duration-150',
                  isActive
                    ? 'text-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  )}
                  <Icon className="size-5 transition-colors" strokeWidth={isActive ? 2.2 : 1.6} />
                  <span className={cn(
                    'text-[10px] leading-tight font-medium transition-all',
                    isActive ? 'font-semibold text-indigo-400' : ''
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}

        {/* More / Profile button */}
        <div ref={moreRef} className="relative flex flex-1">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              'flex min-h-[48px] w-full flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-all duration-150',
              moreOpen
                ? 'text-indigo-400'
                : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <div className="flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-[8px] font-bold text-white">
              {display.initials}
            </div>
            <span className="text-[10px] leading-tight font-medium">Plus</span>
          </button>

          {/* Overflow drawer */}
          {moreOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setMoreOpen(false)} />
              <div className="fade-in-up fixed inset-x-3 bottom-[76px] z-50 rounded-2xl border border-white/[0.06] bg-zinc-900/95 p-3 shadow-2xl shadow-black/50 backdrop-blur-xl">
                <div className="mb-2 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    {user ? (
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-xs font-bold text-white">
                        {display.initials}
                      </div>
                    ) : (
                      <div className="flex size-8 items-center justify-center rounded-full bg-white/[0.08] text-zinc-400">
                        <LogIn className="size-4" />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-zinc-100">{user?.name || 'Utilisateur'}</span>
                      <span className="text-[11px] text-zinc-500">{user?.email || 'Non connecté'}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setMoreOpen(false)} className="flex size-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-300">
                    <X className="size-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 py-2">
                  {MORE_ITEMS.map((item) => {
                    const Icon = item.icon
                    return (
                      <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={() => setMoreOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                            isActive
                              ? 'bg-indigo-500/15 text-indigo-400'
                              : 'text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200'
                          )
                        }
                      >
                        <Icon className="size-4 shrink-0" />
                        <span className="truncate">{t(item.labelKey)}</span>
                      </NavLink>
                    )
                  })}
                </div>

                <div className="border-t border-white/[0.06] pt-2">
                  {user ? (
                    <button
                      type="button"
                      onClick={() => { logout?.(); setMoreOpen(false); }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
                    >
                      <LogOut className="size-4 shrink-0" />
                      Déconnexion
                    </button>
                  ) : (
                    <NavLink
                      to="/login"
                      onClick={() => setMoreOpen(false)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10"
                    >
                      <LogOut className="size-4 shrink-0 rotate-180" />
                      Se connecter
                    </NavLink>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
