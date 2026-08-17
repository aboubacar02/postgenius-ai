import { useState } from 'react'
import { TrendingUp, Eye } from 'lucide-react'
import { cn } from '../../lib/utils'

const DATA_SETS = {
  '7d': [
    { day: 'Lun', score: 72, views: '14.2k' },
    { day: 'Mar', score: 78, views: '28.5k' },
    { day: 'Mer', score: 81, views: '45.1k' },
    { day: 'Jeu', score: 75, views: '32.0k' },
    { day: 'Ven', score: 89, views: '84.6k' },
    { day: 'Sam', score: 94, views: '142k' },
    { day: 'Dim', score: 91, views: '118k' }
  ],
  '30d': [
    { day: 'S1', score: 68, views: '45k' },
    { day: 'S2', score: 76, views: '120k' },
    { day: 'S3', score: 85, views: '290k' },
    { day: 'S4', score: 92, views: '520k' }
  ],
  '90d': [
    { day: 'Mois 1', score: 62, views: '180k' },
    { day: 'Mois 2', score: 79, views: '640k' },
    { day: 'Mois 3', score: 93, views: '1.4M' }
  ]
}

export function RetentionAreaChart({ historyCount = 0 }) {
  const [range, setRange] = useState('7d')
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const data = DATA_SETS[range]

  const width = 500
  const height = 180
  const paddingX = 35
  const paddingY = 25

  const minScore = 50
  const maxScore = 100

  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1)
    const y = height - paddingY - ((d.score - minScore) / (maxScore - minScore)) * (height - 2 * paddingY)
    return { ...d, x, y }
  })

  const linePath = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`

  return (
    <div className="glow-card premium-edge rounded-pg-lg p-6 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <TrendingUp className="size-4" />
            </span>
            <h3 className="text-lg font-bold text-pg-text">
              Trajectoire & Vélocité Virale
            </h3>
          </div>
          <p className="text-xs text-pg-muted">
            Évolution prédictive du score viral moyen et portée estimée
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-pg border border-white/[0.06] bg-white/[0.03] p-1">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRange(r)
                setHoveredPoint(null)
              }}
              className={cn(
                'rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition-all',
                range === r
                  ? 'bg-primary text-white'
                  : 'text-pg-muted hover:text-pg-text'
              )}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex flex-col gap-4 pt-4">
        <div className="relative w-full h-[200px] overflow-hidden rounded-pg border border-white/[0.06] bg-white/[0.02] p-2">
          <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-10 pointer-events-none">
            <div className="border-b border-dashed border-white/20" />
            <div className="border-b border-dashed border-white/20" />
            <div className="border-b border-dashed border-white/20" />
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
                <stop offset="70%" stopColor="#8b5cf6" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>

            <path d={areaPath} fill="url(#areaGradient)" />
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((p, idx) => {
              const isHovered = hoveredPoint?.day === p.day
              return (
                <g key={idx} className="cursor-pointer" onMouseEnter={() => setHoveredPoint(p)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? '7' : '4.5'}
                    className={cn(
                      'transition-all duration-200',
                      isHovered
                        ? 'fill-cyan-400 stroke-pg-surface stroke-2'
                        : 'fill-primary stroke-pg-surface stroke-2'
                    )}
                  />
                  <text
                    x={p.x}
                    y={height - 6}
                    textAnchor="middle"
                    className="fill-pg-muted text-[10px] font-mono"
                  >
                    {p.day}
                  </text>
                </g>
              )
            })}
          </svg>

          {hoveredPoint && (
            <div
              className="absolute pointer-events-none rounded-pg-lg border border-white/[0.1] bg-pg-surface px-3 py-2 text-xs shadow-pg-lg animate-in fade-in zoom-in-95 duration-150"
              style={{
                left: `${(hoveredPoint.x / width) * 100}%`,
                top: `${(hoveredPoint.y / height) * 100 - 30}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="font-bold text-pg-text flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                Score : <span className="text-cyan-400 font-mono font-extrabold">{hoveredPoint.score}/100</span>
              </div>
              <div className="text-[11px] text-pg-muted flex items-center gap-1 mt-0.5">
                <Eye className="size-3 text-primary" /> Vues : <span className="font-mono text-pg-text font-semibold">{hoveredPoint.views}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/[0.06] text-center">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-pg-subtle">Pic de Score</span>
            <span className="text-base font-extrabold text-cyan-400">94 / 100</span>
          </div>
          <div className="flex flex-col border-x border-white/[0.06]">
            <span className="text-[10px] uppercase font-mono tracking-wider text-pg-subtle">Portée Estimée</span>
            <span className="text-base font-extrabold text-gradient">~520k vues</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-pg-subtle">Croissance</span>
            <span className="text-base font-extrabold text-emerald-400">+38.4%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
