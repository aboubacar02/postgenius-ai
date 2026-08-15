import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  suffix,
  icon: Icon,
  trend,
}: {
  label: string
  value: string
  suffix?: string
  icon: LucideIcon
  trend?: { direction: 'up' | 'down'; label: string }
}) {
  return (
    <Card className="border-border bg-card/60 py-0">
      <CardContent className="flex items-start justify-between gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-mono text-2xl font-medium tracking-tight text-foreground">
              {value}
            </span>
            {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
          </div>
          {trend && (
            <span
              className={cn(
                'text-xs font-medium',
                trend.direction === 'up' ? 'text-success' : 'text-destructive',
              )}
            >
              {trend.direction === 'up' ? '↑' : '↓'} {trend.label}
            </span>
          )}
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}
