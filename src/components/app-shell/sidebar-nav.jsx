import { NavLink } from 'react-router-dom'
import {
  ChevronsLeft,
  ChevronsRight,
  Clapperboard,
  Flame,
  Gauge,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Wallet,
  Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { Progress } from '../ui/progress'
import { GradientAvatar } from '../media/gradient-avatar'
import { useApp, isUnlimitedPlan } from '../../lib/app-context'
import { useI18n } from '../../lib/i18n'

const NAV_ITEMS = [
  { href: '/', labelKey: 'nav.home', icon: LayoutDashboard, end: true },
  { href: '/generateur', labelKey: 'nav.create', icon: Sparkles },
  { href: '/faceless', labelKey: 'nav.faceless', icon: Clapperboard },
  { href: '/score-viral', labelKey: 'nav.score', icon: Gauge },
  { href: '/historique', labelKey: 'nav.history', icon: History },
  { href: '/tendances', labelKey: 'nav.trending', icon: Flame },
  { href: '/tarifs', labelKey: 'nav.wallet', icon: Wallet },
  { href: '/parametres', labelKey: 'nav.profile', icon: Settings }
]

export function SidebarNav({ collapsed, onToggle }) {
  const { t } = useI18n()
  const { user, creditsUsed, creditsTotal, plan } = useApp()
  const display = user || { name: 'Utilisateur', email: '', initials: 'U', plan: 'Starter' }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-white/[0.07] bg-pg-surface transition-[width] duration-200 ease-[cubic-bezier(.2,.8,.2,1)] lg:flex',
        collapsed ? 'w-[72px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-white/[0.07]">
        <span className="pg-brand flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white">
          <Sparkles className="size-4" />
        </span>
        {!collapsed && (
          <span className="text-[15px] font-bold tracking-tight text-pg-text">
            PostGenius <span className="text-primary">AI</span>
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5 px-2.5 py-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              title={t(item.labelKey)}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-2 rounded-pg text-[13px] font-medium transition-all duration-150',
                  collapsed ? 'h-9 justify-center' : 'h-9 px-2.5',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isActive
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-pg-muted hover:bg-white/[0.05] hover:text-pg-text'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
                  )}
                  <Icon
                    className={cn(
                      'size-5 shrink-0 transition-colors duration-150',
                      isActive ? 'text-primary' : 'text-pg-muted group-hover:text-pg-text'
                    )}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  {!collapsed && (
                    <span className="truncate">{t(item.labelKey)}</span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Credits + User */}
      <div className="flex flex-col gap-2.5 px-2.5 pb-3">
        {!collapsed && (
          <div className="rounded-pg border border-white/[0.06] bg-white/[0.03] p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-pg-muted">
                <Zap className="size-3 text-pg-amber" />
                {t('sidebar.credits')}
              </span>
              <span className="font-mono text-[11px] font-medium text-pg-text">
                {isUnlimitedPlan(plan)
                  ? t('topbar.unlimited')
                  : `${Math.min(creditsUsed, creditsTotal)}/${creditsTotal}`}
              </span>
            </div>
            <Progress value={creditsTotal ? (Math.min(creditsUsed, creditsTotal) / creditsTotal) * 100 : 0} className="h-1.5" />
          </div>
        )}

        <div className={cn('flex items-center gap-2.5 border-t border-white/[0.07] pt-2.5', collapsed && 'justify-center')}>
          <GradientAvatar initials={display.initials} className="size-8 text-[11px]" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-pg-text">{display.name}</p>
              <p className="truncate text-[11px] text-pg-muted">{display.plan}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          aria-label={collapsed ? t('sidebar.expand') : t('sidebar.collapse')}
          className={cn(
            'flex h-8 items-center justify-center rounded-pg border border-white/[0.08] text-pg-muted transition-colors hover:bg-white/[0.05] hover:text-pg-text',
            collapsed ? 'w-full' : 'w-full gap-2'
          )}
        >
          {collapsed ? <ChevronsRight className="size-3.5" /> : (
            <>
              <ChevronsLeft className="size-3.5" />
              <span className="text-xs font-medium">{t('sidebar.collapse')}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
