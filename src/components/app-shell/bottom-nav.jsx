import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Clapperboard, Flame, Gauge, History, LayoutDashboard, LogOut, Settings, Sparkles, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'
import { useApp } from '../../lib/app-context'

export function BottomNav() {
  const { t } = useI18n()
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const display = user || { initials: 'U' }

  const NAV_ITEMS = [
    { href: '/', label: t('nav.studio'), icon: LayoutDashboard, end: true },
    { href: '/generateur', label: t('nav.create'), icon: Sparkles },
    { href: '/faceless', label: t('nav.faceless'), icon: Clapperboard },
    { href: '/score-viral', label: t('nav.score'), icon: Gauge },
    { href: '/historique', label: t('nav.history'), icon: History },
    { href: '/tendances', label: t('nav.trending'), icon: Flame },
    { href: '/tarifs', label: t('nav.wallet'), icon: Wallet },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-zinc-900/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-[600px] items-center justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1 transition-all duration-150',
                  isActive
                    ? 'text-indigo-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  )}
                  <Icon className="size-5 transition-colors" strokeWidth={isActive ? 2.2 : 1.6} />
                  <span className={cn(
                    'text-[10px] leading-tight uppercase tracking-wider transition-all',
                    isActive ? 'font-semibold text-indigo-400' : 'font-medium'
                  )}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}

        {/* Profile button */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="relative flex min-h-[48px] min-w-[48px] flex-col items-center justify-center gap-0.5 rounded-lg px-1.5 py-1 transition-all duration-150 text-zinc-500 hover:text-zinc-300"
        >
          <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-[9px] font-bold text-white">
            {display.initials}
          </div>
          {expanded ? (
            <ChevronLeft className="size-3 text-zinc-600" />
          ) : (
            <ChevronRight className="size-3 text-zinc-600" />
          )}
        </button>
      </div>

      {/* Expanded profile panel */}
      {expanded && (
        <div className="fade-in-up mx-4 mb-2 flex flex-col gap-2 rounded-2xl border border-white/[0.06] bg-zinc-800/90 backdrop-blur-xl p-4 shadow-xl shadow-black/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white">
              {display.initials}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-100">{user?.name || 'Utilisateur'}</span>
              <span className="text-[11px] text-zinc-500">{user?.email || ''}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { navigate('/parametres'); setExpanded(false); }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
            >
              <Settings className="size-3.5" />
              Paramètres
            </button>
            <button
              type="button"
              onClick={() => { logout?.(); setExpanded(false); }}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 py-2 px-3 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
