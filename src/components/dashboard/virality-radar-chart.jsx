import { useState } from 'react'
import { Target } from 'lucide-react'
import { cn } from '../../lib/utils'

const PILLARS = [
  { id: 'hook', label: 'Accroche (Hook)', score: 92, angle: -90, icon: '🎣' },
  { id: 'retention', label: 'Rétention 30s', score: 81, angle: -18, icon: '⏳' },
  { id: 'story', label: 'Storytelling', score: 86, angle: 54, icon: '📖' },
  { id: 'cta', label: 'Conversion CTA', score: 89, angle: 126, icon: '🎯' },
  { id: 'sound', label: 'Dynamisme Audio', score: 84, angle: 198, icon: '🎵' }
]

export function ViralityRadarChart() {
  const [activePillar, setActivePillar] = useState(null)

  const size = 260
  const center = size / 2
  const radius = 85

  function getCoordinates(angleInDegrees, valuePercentage) {
    const angleInRadians = (angleInDegrees * Math.PI) / 180
    const r = (valuePercentage / 100) * radius
    const x = center + r * Math.cos(angleInRadians)
    const y = center + r * Math.sin(angleInRadians)
    return { x, y }
  }

  const polygonPoints = PILLARS.map((p) => {
    const coords = getCoordinates(p.angle, p.score)
    return `${coords.x},${coords.y}`
  }).join(' ')

  const overallPillarScore = Math.round(
    PILLARS.reduce((acc, p) => acc + p.score, 0) / PILLARS.length
  )

  return (
    <div className="glow-card premium-edge rounded-pg-lg p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
              <Target className="size-4" />
            </span>
            <h3 className="text-lg font-bold text-pg-text">
              Radar 5 Piliers Viraux
            </h3>
          </div>
          <p className="text-xs text-pg-muted">
            Équilibre de performance algorithmique calculé par l'IA
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-mono text-xs font-bold text-cyan-400">
          Index : {overallPillarScore}%
        </span>
      </div>

      {/* Chart + Pillars */}
      <div className="pt-4 flex flex-col items-center">
        <div className="relative w-full max-w-[260px] aspect-square flex items-center justify-center">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
            {[25, 50, 75, 100].map((lvl) => {
              const gridPts = PILLARS.map((p) => {
                const c = getCoordinates(p.angle, lvl)
                return `${c.x},${c.y}`
              }).join(' ')
              return (
                <polygon
                  key={lvl}
                  points={gridPts}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="1"
                />
              )
            })}

            {PILLARS.map((p) => {
              const end = getCoordinates(p.angle, 100)
              return (
                <line
                  key={p.id}
                  x1={center}
                  y1={center}
                  x2={end.x}
                  y2={end.y}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )
            })}

            <polygon
              points={polygonPoints}
              fill="rgba(99, 102, 241, 0.25)"
              stroke="#6366F1"
              strokeWidth="2.5"
              className="transition-all duration-300"
            />

            {PILLARS.map((p) => {
              const pt = getCoordinates(p.angle, p.score)
              const labelPt = getCoordinates(p.angle, 122)
              const isHovered = activePillar?.id === p.id
              return (
                <g
                  key={p.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => setActivePillar(p)}
                  onMouseLeave={() => setActivePillar(null)}
                >
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 4}
                    className={cn(
                      'transition-all',
                      isHovered ? 'fill-cyan-400 stroke-pg-surface stroke-2' : 'fill-primary stroke-pg-surface stroke-2'
                    )}
                  />
                  <text
                    x={labelPt.x}
                    y={labelPt.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={cn(
                      'text-[10px] font-mono font-semibold transition-colors',
                      isHovered ? 'fill-cyan-400 font-bold' : 'fill-pg-muted'
                    )}
                  >
                    {p.icon} {p.score}%
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Pillar List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full pt-3 border-t border-white/[0.06]">
          {PILLARS.map((p) => (
            <div
              key={p.id}
              className={cn(
                'flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-all border',
                activePillar?.id === p.id
                  ? 'border-cyan-400/30 bg-cyan-400/10 text-cyan-300'
                  : 'border-white/[0.06] bg-white/[0.03] text-pg-muted'
              )}
            >
              <span className="truncate">{p.icon} {p.label.split(' ')[0]}</span>
              <span className="font-mono font-bold text-pg-text">{p.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
