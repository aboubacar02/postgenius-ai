import { cn } from '../../lib/utils'
import { useCountUp } from '../../lib/use-count-up'

const ACCENT_STYLES = {
  primary: {
    icon: 'bg-primary/15 text-primary-light',
    value: 'text-primary-light'
  },
  cyan: {
    icon: 'bg-cyan-500/15 text-cyan-400',
    value: 'text-cyan-400'
  },
  warning: {
    icon: 'bg-amber-500/15 text-amber-400',
    value: 'text-amber-400'
  },
  success: {
    icon: 'bg-emerald-500/15 text-emerald-400',
    value: 'text-emerald-400'
  }
}

const TREND_BADGE = {
  up: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
  down: 'border-red-500/20 bg-red-500/10 text-red-400',
  neutral: 'border-white/[0.08] bg-white/[0.04] text-pg-muted'
}

export function StatCard({ label, count, suffix, icon: Icon, trend, accent = 'primary' }) {
  const animated = useCountUp(count)
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.primary

  return (
    <div className="glow-card premium-edge rounded-pg-lg p-4 transition-all duration-200 hover:shadow-pg-md">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-pg-muted">{label}</span>
          <span className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            styles.icon
          )}>
            <Icon className="size-4" />
          </span>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            'text-2xl font-extrabold tracking-tight tabular-nums',
            styles.value
          )}>
            {animated}
          </span>
          {suffix && <span className="text-sm font-medium text-pg-muted">{suffix}</span>}
        </div>

        {trend ? (
          <span className={cn(
            'flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium',
            TREND_BADGE[trend.direction] || TREND_BADGE.neutral
          )}>
            <span className="text-[9px] leading-none">
              {trend.direction === 'up' ? '\u25B2' : trend.direction === 'down' ? '\u25BC' : '\u2022'}
            </span>
            {trend.label}
          </span>
        ) : (
          <span className="text-xs text-pg-subtle">&mdash;</span>
        )}
      </div>
    </div>
  )
}
