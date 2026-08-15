import { useState } from 'react'
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '../components/ui/field'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../components/ui/empty'
import { Progress } from '../components/ui/progress'
import { ScoreGauge } from '../components/score/score-gauge'
import { useApp } from '../lib/app-context'

const EXAMPLES = [
  "Personne ne te dira ça sur l'algorithme TikTok, alors je le fais.",
  "J'ai testé 47 hooks. Voici les 3 qui ont vraiment marché.",
  'Comment faire du contenu.'
]

export default function ScorePage() {
  const { analyze } = useApp()
  const [hook, setHook] = useState('')
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  async function doAnalyze(text) {
    const value = text ?? hook
    if (!value.trim()) return
    if (text) setHook(text)
    setAnalyzing(true)
    try {
      setResult(await analyze(value))
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Analyse
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Score viral d&apos;un hook
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Colle ta première phrase et obtiens un score sur 100, basé sur 5 piliers : la rétention du
          hook (3s), le pic d&apos;émotion, le SEO TikTok/Reels, la force du CTA et le rythme de
          lecture.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="glass premium-edge">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">Ton hook</CardTitle>
            <CardDescription>La phrase que tu prononces dans les 3 premières secondes.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="hook-input" className="sr-only">
                  Hook à analyser
                </FieldLabel>
                <Textarea
                  id="hook-input"
                  value={hook}
                  onChange={(e) => setHook(e.target.value)}
                  placeholder="Ex : Personne ne te dira ça sur…"
                  rows={4}
                  className="resize-none"
                />
                <FieldDescription>{hook.length} caractères — vise moins de 90.</FieldDescription>
              </Field>
            </FieldGroup>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Exemples
              </span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => doAnalyze(ex)}
                  className="max-w-[220px] truncate rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary-40 hover:text-primary"
                  title={ex}
                >
                  {ex}
                </button>
              ))}
            </div>

            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => doAnalyze()}
              disabled={!hook.trim() || analyzing}
            >
              <Sparkles data-icon="inline-start" />
              {analyzing ? 'Analyse…' : 'Analyser le hook'}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass premium-edge">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">Résultat</CardTitle>
            <CardDescription>Décomposition du score par facteur.</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <Empty className="border-none py-6">
                <EmptyHeader>
                  <EmptyMedia>
                    <Lightbulb />
                  </EmptyMedia>
                  <EmptyTitle>Aucune analyse encore</EmptyTitle>
                  <EmptyDescription>
                    Écris un hook ou choisis un exemple pour voir son score.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="flex flex-col items-center gap-2">
                  <ScoreGauge score={result.score} />
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {result.aiScore != null && (
                      <span className="rounded-full border border-primary-30 bg-primary-10 px-2 py-0.5 font-mono text-[10px] text-primary">
                        IA {result.aiScore}
                      </span>
                    )}
                    <span className="font-mono text-[10px]">Facteurs locaux {result.localScore}</span>
                  </div>
                </div>

                {result.analysis && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border-60 bg-secondary-40 p-4">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      <Sparkles className="size-3 text-primary" />
                      Analyse de l&apos;IA
                    </span>
                    <p className="text-sm leading-relaxed text-foreground-90">{result.analysis}</p>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {result.metrics.map((factor) => (
                    <div key={factor.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{factor.label}</span>
                        <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                          {factor.aiScore != null && (
                            <span className="text-primary">IA {factor.aiScore}</span>
                          )}
                          <span>
                            {factor.points}/{factor.max}
                          </span>
                        </span>
                      </div>
                      <Progress value={(factor.points / factor.max) * 100} gradient className="h-1.5" />
                      <p className="text-xs leading-relaxed text-muted-foreground">{factor.detail}</p>
                    </div>
                  ))}
                </div>

                {result.rewriteTips.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-primary-30 bg-primary-10 p-4">
                    <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-primary">
                      <span className="flex items-center gap-1.5">
                        <Lightbulb className="size-3" />
                        Passer de 65 à 95
                      </span>
                    </span>
                    <ul className="flex flex-col gap-2">
                      {result.rewriteTips.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm leading-relaxed">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span className="text-foreground-90">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}