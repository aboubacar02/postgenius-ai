import { useState } from 'react'
import { Sparkles, Wand2, ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const ENHANCED_PRESETS = [
  {
    type: 'Contre-Intuitif',
    badge: '💥 Choc & Rupture',
    text: (topic) => `Pourquoi 99% des gens se trompent totalement sur « ${topic || 'ce sujet'} » (et la méthode exacte qui fonctionne en 2026)`
  },
  {
    type: 'Secret / Exclusif',
    badge: '🤫 Révélation',
    text: (topic) => `Ce que les experts refusent de vous dire sur « ${topic || 'ce domaine'} » : J’ai testé pendant 30 jours pour voir la vérité.`
  },
  {
    type: 'Défi 7 Jours',
    badge: '⏱️ Défi Actionnable',
    text: (topic) => `Comment maîtriser « ${topic || 'ce sujet'} » en seulement 7 jours avec 10 minutes par jour (Guide étape par étape).`
  }
]

export function MagicPromptEnhancer({ currentTopic, onApply }) {
  const [loading, setLoading] = useState(false)
  const [enhancedOptions, setEnhancedOptions] = useState(null)

  function handleEnhance() {
    if (!currentTopic?.trim()) return
    setLoading(true)
    setTimeout(() => {
      setEnhancedOptions(
        ENHANCED_PRESETS.map((p) => ({
          ...p,
          prompt: p.text(currentTopic)
        }))
      )
      setLoading(false)
    }, 450)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleEnhance}
          disabled={loading || !currentTopic?.trim()}
          className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:border-primary/50 disabled:opacity-50"
        >
          {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Wand2 className="size-3.5" />}
          <span>✨ Améliorer le sujet avec l'IA</span>
        </button>
      </div>

      {enhancedOptions && (
        <div className="flex flex-col gap-2 rounded-2xl border border-primary/30 bg-primary/5 p-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs font-semibold text-primary">
            <span>Angles viraux générés :</span>
            <button
              type="button"
              onClick={() => setEnhancedOptions(null)}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Fermer
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {enhancedOptions.map((opt, i) => (
              <div
                key={i}
                onClick={() => {
                  onApply(opt.prompt)
                  setEnhancedOptions(null)
                }}
                className="group flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-white/10 bg-card-60 p-2.5 transition-all hover:border-primary/50 hover:bg-primary/15"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="w-fit rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
                    {opt.badge}
                  </span>
                  <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                    {opt.prompt}
                  </p>
                </div>
                <Button size="icon-sm" variant="ghost" className="shrink-0 group-hover:text-primary">
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
