import { useState } from 'react'
import { TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { cn } from '../../lib/utils'

export function RetentionSimulatorChart({ score = 75 }) {
  // Compute retention values based on viral score
  const s = Math.max(20, Math.min(100, score))
  const at3s = Math.min(96, Math.round(55 + (s * 0.42)))
  const at10s = Math.min(90, Math.round(35 + (s * 0.45)))
  const at20s = Math.min(85, Math.round(25 + (s * 0.42)))
  const at30s = Math.min(78, Math.round(18 + (s * 0.40)))

  const points = [
    { sec: '0s', val: 100, label: 'Lancement' },
    { sec: '3s', val: at3s, label: 'Zone Swipe' },
    { sec: '10s', val: at10s, label: 'Intrigue' },
    { sec: '20s', val: at20s, label: 'Corps' },
    { sec: '30s', val: at30s, label: 'Fin & CTA' }
  ]

  // SVG dimensions
  const width = 460
  const height = 160
  const padX = 35
  const padY = 25

  const svgPoints = points.map((p, i) => {
    const x = padX + (i * (width - 2 * padX)) / (points.length - 1)
    const y = height - padY - (p.val / 100) * (height - 2 * padY)
    return { ...p, x, y }
  })

  const linePath = svgPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  )
  const areaPath = `${linePath} L ${svgPoints[svgPoints.length - 1].x} ${height - padY} L ${svgPoints[0].x} ${height - padY} Z`

  return (
    <Card className="glow-card glass premium-edge rounded-3xl p-6 flex flex-col gap-4">
      <CardHeader className="p-0 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <TrendingDown className="size-4" />
            </span>
            <CardTitle className="font-heading text-lg font-bold text-foreground">
              Simulation de Courbe de Rétention 0–30s
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Prédiction algorithmique de l'attention seconde par seconde
          </CardDescription>
        </div>

        <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-300">
          Rétention 3s : {at3s}%
        </span>
      </CardHeader>

      <CardContent className="p-0 flex flex-col gap-4">
        {/* SVG Chart */}
        <div className="relative w-full h-[180px] rounded-2xl border border-white/5 bg-background/50 p-2 overflow-hidden">
          {/* Critical 3s swipe barrier indicator */}
          <div
            className="absolute top-0 bottom-0 border-r-2 border-dashed border-amber-400/40 z-10"
            style={{ left: `${(svgPoints[1].x / width) * 100}%` }}
          >
            <span className="absolute top-2 left-1.5 font-mono text-[9px] font-bold text-amber-300 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              ⚡ Seuil Swipe (3s)
            </span>
          </div>

          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <path d={areaPath} fill="url(#retentionGrad)" />
            <path
              d={linePath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]"
            />

            {svgPoints.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4.5"
                  className="fill-rose-400 stroke-background stroke-2"
                />
                <text
                  x={p.x}
                  y={p.y - 10}
                  textAnchor="middle"
                  className="fill-foreground font-mono text-[10px] font-bold"
                >
                  {p.val}%
                </text>
                <text
                  x={p.x}
                  y={height - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[10px]"
                >
                  {p.sec}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Diagnostic Zones */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex flex-col gap-0.5 rounded-xl border border-amber-400/20 bg-amber-400/5 p-2.5">
            <span className="font-mono text-[10px] font-bold text-amber-300">0s ➔ 3s (Accroche)</span>
            <span className="text-[11px] text-foreground font-medium">
              {at3s >= 80 ? '🟢 Excellente barrière' : '⚠️ Risque de swipe élevé'}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-2.5">
            <span className="font-mono text-[10px] font-bold text-cyan-300">3s ➔ 15s (Intrigue)</span>
            <span className="text-[11px] text-foreground font-medium">
              {at10s >= 65 ? '🟢 Maintien solide' : '🟡 Creux d’attention'}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 rounded-xl border border-primary/20 bg-primary/5 p-2.5">
            <span className="font-mono text-[10px] font-bold text-primary">15s ➔ 30s (CTA)</span>
            <span className="text-[11px] text-foreground font-medium">
              {at30s >= 50 ? '🟢 Fin puissante' : '🟡 Décrochage'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
