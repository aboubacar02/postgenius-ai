import { useState } from 'react'
import { Info, Sparkles } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { GeneratorForm } from '../components/generator/generator-form'
import { ResultsPanel } from '../components/generator/results-panel'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { useApp } from '../lib/app-context'

const DEFAULT_INPUT = {
  network: 'tiktok',
  tone: 'storytelling',
  format: 'hook-histoire',
  duration: 30,
  audience: 'grand-public',
  cta: 'abonne',
  market: 'fr',
  topic: ''
}

export default function GeneratorPage() {
  const { generate, creditsLeft, creditsTotal } = useApp()
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const canGenerate = input.topic.trim().length > 0 && creditsLeft > 0 && !loading
  const creditsPct = creditsTotal ? Math.round((creditsLeft / creditsTotal) * 100) : 0

  async function runGeneration(options = {}) {
    if (input.topic.trim().length === 0) {
      toast.error('Décrivez votre sujet avant de générer un script.')
      return
    }
    setLoading(true)
    try {
      const script = await generate(
        {
          network: input.network,
          tone: input.tone,
          format: input.format,
          duration: input.duration,
          audience: input.audience,
          cta: input.cta,
          market: input.market,
          topic: input.topic
        },
        options
      )
      setResult(script)
      toast.success('Script généré avec succès')
    } catch (err) {
      if (err.message === 'crédits') {
        toast.error('Plus de crédits disponibles aujourd’hui — repasse demain ou passe en Pro.')
      } else {
        toast.error('Échec de la génération, veuillez réessayer.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Créez votre prochain hit
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Configurez l&apos;IA pour générer un script viral sur mesure.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <GeneratorForm value={input} onChange={setInput} />
        </div>

        <div className="lg:col-span-4">
          <div className="glass premium-edge sticky top-24 flex flex-col gap-6 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-lg font-semibold text-foreground">Prêt à générer</h2>
              <p className="text-sm text-muted-foreground">Coût estimé : 15 crédits</p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Crédits</span>
                <span className="font-mono text-foreground">
                  {creditsLeft} / {creditsTotal}
                </span>
              </div>
              <Progress value={creditsPct} className="h-1.5" />
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                size="lg"
                className="w-full"
                disabled={!canGenerate}
                onClick={() => runGeneration()}
              >
                <Sparkles data-icon="inline-start" />
                {loading ? 'Génération…' : 'Générer le script'}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                {input.topic.trim().length === 0
                  ? 'Décrivez d’abord votre sujet.'
                  : creditsLeft <= 0
                    ? 'Plus de crédits aujourd’hui.'
                    : `${input.topic.length}/280 caractères`}
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border-60 bg-muted-30 p-3.5">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                Astuce : le format « Storytelling » performe 40% mieux sur le marché français en ce
                moment.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {(result || loading) && (
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Résultats Générés
            </h2>
            <p className="text-sm text-muted-foreground">
              Script optimisé pour la viralité {input.network === 'tiktok' ? 'TikTok' : input.network === 'reels' ? 'Reels' : 'Shorts'}
            </p>
          </div>
        )}
        <ResultsPanel result={result} loading={loading} onRegenerate={() => runGeneration({ recharge: true })} />
      </div>
    </div>
  )
}
