import { useState } from 'react'
import { Check, Flame, Gauge, Sparkles, Trophy, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export function HookSplitTester({ topic, onSelectHook, selectedHook }) {
  const [loading, setLoading] = useState(false)

  const subject = topic?.trim() || 'ce sujet'

  const variants = [
    {
      id: 'var-a',
      tag: 'Variante A • Curiosité Max',
      hook: `Arrêtez de perdre votre temps avec ${subject} jusqu’à ce que vous voyiez ceci.`,
      score: 95,
      retention3s: '89%',
      accent: 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
    },
    {
      id: 'var-b',
      tag: 'Variante B • Défi & Controverse',
      hook: `Personne n'a le courage de dire la vérité sur ${subject}, alors je vais le faire.`,
      score: 92,
      retention3s: '85%',
      accent: 'text-amber-400 border-amber-400/40 bg-amber-400/10'
    },
    {
      id: 'var-c',
      tag: 'Variante C • Secret de Pro',
      hook: `J’ai testé l'astuce secrète pour ${subject} pendant 30 jours, voici le résultat choquant.`,
      score: 94,
      retention3s: '87%',
      accent: 'text-fuchsia-400 border-fuchsia-400/40 bg-fuchsia-400/10'
    }
  ]

  return (
    <Card className="glow-card glass premium-edge rounded-2xl p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Gauge className="size-4" />
          </span>
          <h3 className="font-heading text-sm font-bold text-foreground">
            Moteur de Split-Testing Hooks A/B/C
          </h3>
        </div>
        <span className="font-mono text-[11px] font-bold text-primary">IA Prédictive</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {variants.map((v) => {
          const isSelected = selectedHook === v.hook
          return (
            <div
              key={v.id}
              onClick={() => onSelectHook(v.hook)}
              className={cn(
                'group flex cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all duration-200',
                isSelected
                  ? 'border-primary bg-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-primary'
                  : 'border-white/10 bg-card-60 hover:border-primary/40 hover:bg-white/5'
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className={cn('rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold', v.accent)}>
                    {v.tag}
                  </span>
                  {isSelected && <Check className="size-4 text-primary" />}
                </div>
                <p className="text-xs font-semibold leading-snug text-foreground">
                  « {v.hook} »
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[11px]">
                <span className="text-muted-foreground">Rétention 3s : <strong className="text-foreground">{v.retention3s}</strong></span>
                <span className="font-mono font-extrabold text-cyan-400">{v.score}/100</span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
