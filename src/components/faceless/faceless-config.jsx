import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '../ui/button'
import { NICHES } from '../../lib/niches'
import { cn } from '../../lib/utils'

export function FacelessConfig({ topic, setTopic, niche, setNiche, duration, setDuration, gender, setGender, voiceStyle, setVoiceStyle, onGenerate, busy }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-pg-muted">Sujet de la video</span>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="ex: Les 3 erreurs fatales en bourse a 20 ans..."
            className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-pg-text placeholder:text-pg-subtle outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="eyebrow text-pg-muted">Niche</span>
          <div className="flex flex-wrap gap-1.5">
            {NICHES.map((n) => (
              <button
                key={n.name}
                type="button"
                onClick={() => setNiche(n.name)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                  niche === n.name
                    ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                    : 'border-white/10 bg-white/[0.03] text-pg-muted hover:bg-white/[0.06]'
                )}
              >
                {n.emoji} {n.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="eyebrow text-pg-muted">Duree</span>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-pg-text outline-none"
            >
              <option value={15}>15s (Fast)</option>
              <option value={30}>30s (Viral)</option>
              <option value={60}>60s (Profond)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="eyebrow text-pg-muted">Voix</span>
            <select
              value={`${gender}-${voiceStyle}`}
              onChange={(e) => { const [g, s] = e.target.value.split('-'); setGender(g); setVoiceStyle(s) }}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 text-sm font-semibold text-pg-text outline-none"
            >
              <option value="male-energetic">Homme Ener</option>
              <option value="female-energetic">Femme Ener</option>
              <option value="male-calm">Homme Calme</option>
              <option value="female-calm">Femme Calme</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5 justify-end">
            <Button
              onClick={onGenerate}
              disabled={busy}
              className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-sm shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              <span>{busy ? 'Generation...' : 'Generer'}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
