import { NavLink } from 'react-router-dom'
import { Clapperboard, Flame, Gauge, History, LayoutDashboard, Sparkles, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'

export function BottomNav() {
  const { t } = useI18n()
  const NAV_ITEMS = [
    { href: '/', label: t('nav.studio'), icon: LayoutDashboard, end: true },
    { href: '/generateur', label: t('nav.create'), icon: Sparkles },
    { href: '/faceless', label: t('nav.faceless'), icon: Clapperboard },
    { href: '/score-viral', label: t('nav.score'), icon: Gauge },
    { href: '/historique', label: t('nav.history'), icon: History },
    { href: '/tendances', label: t('nav.trending'), icon: Flame },
    { href: '/tarifs', label: t('nav.wallet'), icon: Wallet }
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] bg-pg-surface/95 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-14 max-w-[600px] items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 transition-all duration-150',
                  isActive
                    ? 'text-primary'
                    : 'text-pg-muted hover:text-pg-text'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                  )}
                  <Icon
                    className="size-5 transition-colors"
                    strokeWidth={isActive ? 2.2 : 1.6}
                  />
                  <span
                    className={cn(
                      'text-[9px] uppercase tracking-wider transition-all',
                      isActive ? 'font-semibold text-primary' : 'font-medium'
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
