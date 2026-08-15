'use client'

import { useState } from 'react'
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '@/components/ui/field'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { Progress } from '@/components/ui/progress'
import { scoreHook, type ScoreResult } from '@/lib/generator'
import { scoreColorClass } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ScoreGauge } from '@/components/score/score-gauge'

const EXAMPLES = [
  "Personne ne te dira ça sur l'algorithme TikTok, alors je le fais.",
  "J'ai testé 47 hooks. Voici les 3 qui ont vraiment marché.",
  "Comment faire du contenu.",
]

export function ScorePageClient() {
  const [hook, setHook] = useState('')
  const [result, setResult] = useState<ScoreResult | null>(null)

  function analyze(text?: string) {
    const value = text ?? hook
    if (!value.trim()) return
    if (text) setHook(text)
    setResult(scoreHook(value))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Analyse
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-balance font-heading md:text-4xl">
          Score viral d&apos;un hook
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          Colle ta première phrase et obtiens un score sur 100, basé sur la longueur, la tension
          narrative, l&apos;adresse au spectateur et le rythme.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-border/60 bg-card/60">
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
                  onClick={() => analyze(ex)}
                  className="max-w-[220px] truncate rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  title={ex}
                >
                  {ex}
                </button>
              ))}
            </div>

            <Button
              className="mt-6 w-full sm:w-auto"
              onClick={() => analyze()}
              disabled={!hook.trim()}
            >
              <Sparkles data-icon="inline-start" />
              Analyser le hook
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/60">
          <CardHeader>
            <CardTitle className="font-heading text-lg font-semibold">Résultat</CardTitle>
            <CardDescription>Décomposition du score par facteur.</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <Empty className="border-none py-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
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
                <div className="flex justify-center">
                  <ScoreGauge score={result.score} />
                </div>

                <div className="flex flex-col gap-3">
                  {result.factors.map((factor) => (
                    <div key={factor.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{factor.label}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {factor.points}/{factor.max}
                        </span>
                      </div>
                      <Progress value={(factor.points / factor.max) * 100} className="h-1.5" />
                      <p className="text-xs leading-relaxed text-muted-foreground">{factor.detail}</p>
                    </div>
                  ))}
                </div>

                {result.suggestions.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-secondary/40 p-4">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      Suggestions
                    </span>
                    <ul className="flex flex-col gap-2">
                      {result.suggestions.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm leading-relaxed">
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                          <span className="text-muted-foreground">{s}</span>
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
