import { scoreColorClass, scoreLevel } from '../../lib/format'
import { cn } from '../../lib/utils'

const LEVEL_LABEL = {
  fort: 'Fort potentiel viral',
  moyen: 'Potentiel moyen',
  faible: 'Potentiel faible'
}

export function ScoreGauge({ score }) {
  const level = scoreLevel(score)
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const ringColor =
    level === 'fort' ? 'stroke-success' : level === 'moyen' ? 'stroke-warning' : 'stroke-destructive'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative flex size-40 items-center justify-center">
        <svg viewBox="0 0 160 160" className="size-40 -rotate-90">
          <circle cx="80" cy="80" r={radius} fill="none" strokeWidth="10" className="stroke-border" />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(ringColor, 'transition-[stroke-dashoffset] duration-700 ease-out')}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn('font-mono text-4xl font-semibold tabular-nums', scoreColorClass(score))}>
            {score}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">/ 100</span>
        </div>
      </div>
      <p className={cn('text-sm font-medium', scoreColorClass(score))}>{LEVEL_LABEL[level]}</p>
    </div>
  )
}