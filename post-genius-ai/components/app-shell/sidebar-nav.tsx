'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Gauge,
  History,
  LayoutDashboard,
  Settings,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CURRENT_USER, DAILY_CREDITS } from '@/lib/mock-data'

const NAV_ITEMS = [
  { href: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/generateur', label: 'Générateur', icon: Sparkles },
  { href: '/score-viral', label: 'Score viral', icon: Gauge },
  { href: '/historique', label: 'Historique', icon: History },
  { href: '/tarifs', label: 'Tarifs', icon: Wallet },
  { href: '/parametres', label: 'Paramètres', icon: Settings },
] as const

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-border bg-sidebar/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </div>
        <span className="font-heading text-[15px] font-bold tracking-tight text-foreground">
          PostGenius <span className="text-primary">AI</span>
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                active
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted/60 hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mx-3 mb-3 rounded-xl border border-border bg-card/60 p-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Crédits du jour
          </span>
          <span className="font-mono text-[11px] text-foreground">
            {DAILY_CREDITS.used}/{DAILY_CREDITS.total}
          </span>
        </div>
        <Progress value={(DAILY_CREDITS.used / DAILY_CREDITS.total) * 100} className="h-1.5" />
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          Réinitialisation dans {DAILY_CREDITS.resetsInHours}h
        </p>
      </div>

      <div className="flex items-center gap-2.5 border-t border-border px-4 py-3.5">
        <div className="flex size-8 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium text-foreground">
          {CURRENT_USER.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">{CURRENT_USER.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{CURRENT_USER.email}</p>
        </div>
        <Badge variant="secondary" className="shrink-0 text-[10px]">
          {CURRENT_USER.plan}
        </Badge>
      </div>
    </aside>
  )
}
