import { CircleAlert, CircleCheck, XCircle } from 'lucide-react'
import { useCountUp } from '../../lib/use-count-up'
import { scoreColorClass, scoreLevel } from '../../lib/format'
import { cn } from '../../lib/utils'

const LEVEL_CONFIG = {
  fort: {
    label: 'Fort potentiel viral',
    badge: 'Excellent',
    badgeIcon: CircleCheck,
    glow: 'rgba(74, 222, 128, 0.35)',
    gradient: ['#4ade80', '#22d3ee']
  },
  moyen: {
    label: 'Potentiel modéré',
    badge: 'À améliorer',
    badgeIcon: CircleAlert,
    glow: 'rgba(251, 191, 36, 0.35)',
    gradient: ['#fbbf24', '#f97316']
  },
  faible: {
    label: 'Potentiel faible',
    badge: 'À corriger',
    badgeIcon: XCircle,
    glow: 'rgba(248, 113, 113, 0.35)',
    gradient: ['#f87171', '#ef4444']
  }
}

export function ScoreGauge({ score }) {
  const animated = useCountUp(score, { duration: 900 })
  const level = scoreLevel(score)
  const cfg = LEVEL_CONFIG[level] || LEVEL_CONFIG.moyen

  const radius = 68
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3.5">
      <div
        className="relative flex size-44 items-center justify-center rounded-full p-2"
        style={{
          boxShadow: `0 0 45px -10px ${cfg.glow}`
        }}
      >
        <svg viewBox="0 0 160 160" className="size-44 -rotate-90">
          <defs>
            <linearGradient id={`gauge-grad-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={cfg.gradient[0]} />
              <stop offset="100%" stopColor={cfg.gradient[1]} />
            </linearGradient>
          </defs>
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-white/10"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            stroke={`url(#gauge-grad-${score})`}
            className="transition-[stroke-dashoffset] duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn('font-heading text-5xl font-black tabular-nums tracking-tight', scoreColorClass(score))}>
            {animated}
          </span>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            / 100
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className={cn('flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-bold text-foreground', scoreColorClass(score))}>
          <cfg.badgeIcon className="size-3.5" />
          {cfg.badge}
        </span>
        <p className="text-xs font-medium text-muted-foreground">{cfg.label}</p>
      </div>
    </div>
  )
}
