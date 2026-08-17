import { Award, Flame, Sparkles, Trophy, Zap, ShieldCheck } from 'lucide-react'
import { Progress } from '../ui/progress'

export function CreatorTierCard({ scriptCount = 12 }) {
  const currentXP = 3450
  const nextLevelXP = 5000
  const progressPct = Math.round((currentXP / nextLevelXP) * 100)

  return (
    <div className="glow-card premium-edge rounded-pg-lg p-6 flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
              <Trophy className="size-4" />
            </span>
            <h3 className="text-lg font-bold text-pg-text">
              Niveau & Rang Créateur
            </h3>
          </div>
          <p className="text-xs text-pg-muted">
            Algorithme de réputation et vélocité de production
          </p>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 font-mono text-xs font-extrabold text-amber-300">
          <ShieldCheck className="size-3.5 text-amber-400" />
          Master Lv.4
        </span>
      </div>

      <div className="pt-4 flex flex-col gap-4">
        {/* XP Progress */}
        <div className="flex flex-col gap-1.5 rounded-pg-lg border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-pg-muted flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Progression vers <strong className="text-pg-text">Rang Légendaire (Lv.5)</strong>
            </span>
            <span className="font-mono font-bold text-primary">{currentXP} / {nextLevelXP} XP</span>
          </div>
          <Progress value={progressPct} className="h-2 rounded-full" indicatorClassName="bg-gradient-to-r from-primary via-purple-500 to-amber-400" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-pg-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-pg-muted">
              <Flame className="size-3.5 text-orange-400" />
              Vélocité Hebdo
            </span>
            <span className="text-xl font-extrabold text-pg-text">
              +240% <span className="text-xs font-normal text-emerald-400">▲ record</span>
            </span>
          </div>

          <div className="flex flex-col gap-1 rounded-pg-lg border border-white/[0.06] bg-white/[0.03] p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-pg-muted">
              <Zap className="size-3.5 text-yellow-400" />
              Indice Supériorité
            </span>
            <span className="text-xl font-extrabold text-gradient">
              Top 8.5% <span className="text-xs font-normal text-pg-muted">global</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
