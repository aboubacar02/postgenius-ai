import { Card, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'
import { useCountUp } from '../../lib/use-count-up'

export function StatCard({ label, value, count, suffix, icon: Icon, trend }) {
  const animated = useCountUp(count ?? value)
  return (
    <Card className="glass rounded-xl p-4 sm:p-5 hover:border-primary-40">
      <CardContent className="flex flex-col gap-1.5 p-0">
        <div className="mb-1 flex items-center gap-2 text-muted-foreground">
          <Icon className="size-4 text-primary" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-heading text-2xl font-semibold tracking-tight text-primary sm:text-3xl">
            {count != null ? animated : value}
          </span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
        {trend ? (
          <span
            className={cn(
              'flex items-center gap-1 text-xs font-medium',
              trend.direction === 'up' ? 'text-primary' : 'text-destructive'
            )}
          >
            <span className="text-[10px]">{trend.direction === 'up' ? '▲' : '▼'}</span>
            {trend.label}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </CardContent>
    </Card>
  )
}
