import { NavLink } from 'react-router-dom'
import { Flame, Gauge, History, LayoutDashboard, Sparkles, Wallet } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Studio', icon: LayoutDashboard, end: true },
  { href: '/generateur', label: 'Créer', icon: Sparkles },
  { href: '/score-viral', label: 'Score', icon: Gauge },
  { href: '/historique', label: 'History', icon: History },
  { href: '/tendances', label: 'Trending', icon: Flame },
  { href: '/tarifs', label: 'Wallet', icon: Wallet }
]

export function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-primary/15 bg-background/80 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex h-16 max-w-[600px] items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 rounded-xl px-3 py-1 transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                    : 'text-muted-foreground hover:text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('size-5', isActive && 'fill-current')} />
                  <span className="font-mono text-[10px] uppercase tracking-wider">{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
