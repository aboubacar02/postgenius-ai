import { NavLink } from 'react-router-dom'
import { Flame, Gauge, History, LayoutDashboard, Settings, Sparkles, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { GradientAvatar } from '../media/gradient-avatar'
import { useApp } from '../../lib/app-context'

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { href: '/generateur', label: 'Générateur', icon: Sparkles },
  { href: '/score-viral', label: 'Score viral', icon: Gauge },
  { href: '/historique', label: 'Historique', icon: History },
  { href: '/tendances', label: 'Tendances', icon: Flame },
  { href: '/tarifs', label: 'Tarifs', icon: Wallet },
  { href: '/parametres', label: 'Paramètres', icon: Settings }
]

export function SidebarNav() {
  const { user, creditsUsed, creditsTotal } = useApp()
  const display = user || { name: 'Camille Aubert', email: 'camille.aubert@postgenius.ai', initials: 'CA', plan: 'Starter' }

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-sidebar-80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary-15 text-primary">
          <Sparkles className="size-4" />
        </div>
        <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
          PostGenius <span className="text-primary">AI</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring-50',
                  isActive
                    ? 'bg-accent-active text-accent-fg'
                    : 'hover:bg-muted-60 hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={cn(
                      'size-4 shrink-0 transition-colors',
                      isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="glass mx-3 mb-3 rounded-xl p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Crédits du jour
          </span>
          <span className="font-mono text-[11px] text-foreground">
            {Math.min(creditsUsed, creditsTotal)}/{creditsTotal}
          </span>
        </div>
        <Progress value={(creditsUsed / creditsTotal) * 100} className="h-1.5" />
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Réinitialisation à minuit
        </p>
      </div>

      <div className="flex items-center gap-2.5 border-t border-border px-4 py-3.5">
        <GradientAvatar initials={display.initials} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">{display.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{display.email}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {user ? display.plan : 'Invité'}
        </Badge>
      </div>
    </aside>
  )
}