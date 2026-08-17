import { useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Flame,
  Gauge,
  Lightbulb,
  ListChecks,
  ShieldAlert,
  Sparkles,
  Target,
  Wand2,
  Zap
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Field, FieldLabel, FieldDescription, FieldGroup } from '../components/ui/field'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../components/ui/empty'
import { Progress } from '../components/ui/progress'
import { ScoreGauge } from '../components/score/score-gauge'
import { RetentionSimulatorChart } from '../components/score/retention-simulator-chart'
import { toast } from '../components/ui/sonner'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'
import { cn } from '../lib/utils'

const EXAMPLES = ['score.example1', 'score.example2', 'score.example3']

const WEAK_PATTERNS = [
  { regex: /salut|bonjour|coucou|hello/i, penalty: '-15 pts', reason: "Salutation inutile au début : tue l\u2019attention dès 0.5 seconde." },
  { regex: /aujourd'?hui|dans cette vid[eé]o/i, penalty: '-20 pts', reason: "Introduction lente : l\u2019algorithme favorise l\u2019entrée immédiate dans l\u2019intrigue." },
  { regex: /abonne|abonnez-vous|partagez/i, penalty: '-12 pts', reason: "Appel à l\u2019action prématuré : ne demandez rien avant d\u2019avoir délivré de la valeur." },
  { regex: /je vais vous (montrer|parler|expliquer)/i, penalty: '-18 pts', reason: "Formulation passive : préférez le choc direct ou le résultat brut." }
]

function getSubscoreBadge(ratio) {
  if (ratio >= 0.8) {
    return {
      text: '🟢 Excellent',
      cls: 'border-success-20 bg-success-10 text-success'
    }
  }
  if (ratio >= 0.5) {
    return {
      text: '🟡 À améliorer',
      cls: 'border-warning/30 bg-warning-10 text-warning'
    }
  }
  return {
    text: '🔴 À corriger',
    cls: 'border-destructive-20 bg-destructive-10 text-destructive'
  }
}

export default function ScorePage() {
  const { analyze } = useApp()
  const { t } = useI18n()
  const [hook, setHook] = useState('')
  const [result, setResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [copiedClone, setCopiedClone] = useState(null)

  const detectedWeaknesses = WEAK_PATTERNS.filter((p) => p.regex.test(hook))

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

  // Generate 5 viral clone hooks based on current topic
  const hookClones = hook.trim()
    ? [
        {
          tag: 'Contre-Intuitif',
          hook: `Pourquoi tout ce qu'on vous a raconté sur « ${hook.slice(0, 32)}... » est complètement faux.`,
          boost: '+22 pts',
          score: 94
        },
        {
          tag: "Secret d\u2019Élite",
          hook: `Le secret que 99% des gens ignorent sur « ${hook.slice(0, 30)}... » (voici la preuve).`,
          boost: '+18 pts',
          score: 92
        },
        {
          tag: 'Erreur Fatale',
          hook: `L'erreur numéro 1 qui détruit vos chances avec « ${hook.slice(0, 30)}... » en 2026.`,
          boost: '+24 pts',
          score: 95
        },
        {
          tag: 'Défi 30 Jours',
          hook: `J'ai testé « ${hook.slice(0, 32)}... » pendant 30 jours sans m'arrêter, et voici ce qui s'est passé.`,
          boost: '+16 pts',
          score: 90
        },
        {
          tag: 'Urgence Psychologique',
          hook: `Si vous faites encore « ${hook.slice(0, 30)}... », arrêtez tout de suite avant qu'il ne soit trop tard.`,
          boost: '+26 pts',
          score: 96
        }
      ]
    : []

  function copyAndTestHook(cloneText, idx) {
    setHook(cloneText)
    setCopiedClone(idx)
    doAnalyze(cloneText)
    toast.success('Hook clone appliqué et relancé pour analyse !')
    setTimeout(() => setCopiedClone(null), 2000)
  }

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 pb-16 pt-4 sm:px-8">
      {/* Header */}
      <div className="reveal flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-amber-400/20 text-amber-400">
            <Gauge className="size-3.5" />
          </span>
          <span className="eyebrow text-amber-400">
            Diagnostic & Simulateur de Rétention 0-30s
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          Score Viral & <span className="text-primary">Détecteur d'Accroche</span>
        </h1>
        <p className="text-[15px] text-pg-muted">
          Scannez vos phrases d'accroche contre les algorithmes TikTok, Reels et Shorts. Éliminez les mots faibles et prédisez la courbe de rétention.
        </p>
      </div>

      {/* Grid: Input (5) vs Results (7) */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Formulaire Hook */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Card className="border border-white/[0.06] bg-pg-surface rounded-xl p-6">
            <CardHeader className="p-0 pb-4">
              <CardTitle className="font-heading text-lg font-bold text-pg-text">
                {t('score.yourHook')}
              </CardTitle>
              <CardDescription className="text-xs text-pg-muted">
                {t('score.yourHookDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 p-0">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="hook-input" className="sr-only">
                    {t('score.hookLabel')}
                  </FieldLabel>
                  <Textarea
                    id="hook-input"
                    value={hook}
                    onChange={(e) => setHook(e.target.value)}
                    placeholder="ex: Pourquoi 99% des gens échouent en freelance en 2026..."
                    rows={4}
                    className="min-h-32 resize-none rounded-2xl border-white/[0.06] bg-pg-surface p-4 text-sm leading-relaxed text-pg-text placeholder:text-pg-muted focus-visible:border-primary"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <FieldDescription className="text-xs text-pg-muted">
                      {t('score.characters', { count: hook.length })}
                    </FieldDescription>
                    <span className="text-[11px] font-medium text-primary">
                      Idéal : 40 à 90 caractères
                    </span>
                  </div>
                </Field>
              </FieldGroup>

              {/* Weak-Word Detector Alert */}
              {detectedWeaknesses.length > 0 && (
                <div className="flex flex-col gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400">
                    <ShieldAlert className="size-4 shrink-0" />
                    <span>Mots anti-viraux détectés ({detectedWeaknesses.length})</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 text-xs text-rose-200">
                    {detectedWeaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-snug">
                        <span className="font-mono font-bold text-rose-400">{w.penalty} :</span>
                        <span>{w.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exemples rapides */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-pg-muted">
                  {t('score.examples')}
                </span>
                <div className="flex flex-col gap-1.5">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => doAnalyze(t(ex))}
                      className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.03] px-3 py-2 text-left text-xs text-pg-muted transition-all hover:border-indigo-500/40 hover:bg-white/[0.06] hover:text-pg-text"
                    >
                      <span className="truncate pr-2">« {t(ex)} »</span>
                      <Sparkles className="size-3 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                loading={analyzing}
                className="mt-2 h-12 w-full gap-2 rounded-2xl bg-primary font-bold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                onClick={() => doAnalyze()}
                disabled={!hook.trim() || analyzing}
              >
                <Sparkles className="size-4" />
                Diagnostiquer la Rétention
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard de Résultats & Courbe de Rétention */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {/* Courbe de Rétention 0-30s */}
          <RetentionSimulatorChart score={result?.score || (hook.trim() ? 75 : 82)} />

          <Card className="border border-white/[0.06] bg-pg-surface rounded-xl p-6 md:p-8">
            <CardHeader className="p-0 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-heading text-xl font-bold text-pg-text">
                    {t('score.result')}
                  </CardTitle>
              <CardDescription className="text-xs text-pg-muted">
                    Diagnostic chirurgical des 5 facteurs de rétention
                  </CardDescription>
                </div>
                {result && (
                  <span className="flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Flame className="size-3.5" />
                    Diagnostic Complet
                  </span>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {!result ? (
                <Empty className="border-none py-12">
                  <EmptyHeader>
                    <EmptyMedia className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Lightbulb className="size-7" />
                    </EmptyMedia>
                    <EmptyTitle className="mt-2 text-base font-bold">
                      {t('score.noAnalysis')}
                    </EmptyTitle>
                    <EmptyDescription className="max-w-xs text-xs text-pg-muted">
                      {t('score.noAnalysisDesc')}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="reveal flex flex-col gap-6">
                  {/* Jauge Principale */}
                  <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-pg-surface p-6">
                    <ScoreGauge score={result.score} />
                    <div className="flex items-center gap-3 pt-2 text-[11px] font-semibold uppercase tracking-wider text-pg-muted">
                      {result.aiScore != null && (
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-primary">
                          {t('score.ai', { score: result.aiScore })}
                        </span>
                      )}
                      <span className="font-mono">
                        Facteurs algorithmiques validés
                      </span>
                    </div>
                  </div>

                  {/* Sous-scores détaillés avec Badges */}
                  <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-pg-muted">
                      Sous-scores & Rétention
                    </span>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {result.metrics.map((factor) => {
                        const ratio = factor.points / factor.max
                        const badge = getSubscoreBadge(ratio)
                        return (
                          <div
                            key={factor.id}
                            className="flex flex-col gap-2 rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4 transition-colors hover:border-primary/30"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-pg-text">
                                {factor.label}
                              </span>
                              <span
                                className={cn(
                                  'rounded-full border px-2 py-0.5 font-mono text-[10px] font-bold',
                                  badge.cls
                                )}
                              >
                                {badge.text}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[11px] text-pg-muted">
                                {factor.detail}
                              </span>
                              <span className="font-mono font-bold text-primary">
                                {factor.points}/{factor.max}
                              </span>
                            </div>
                            <Progress value={ratio * 100} gradient className="h-1.5" />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* 5 Clones Viraux de Remplacement */}
                  {hookClones.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 eyebrow text-primary">
                          <Wand2 className="size-3.5" />
                          5 Clones Ultra-Viraux de Remplacement
                        </span>
                        <span className="font-mono text-[10px] text-pg-muted">1-clic pour tester</span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {hookClones.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 transition-all hover:border-primary/50"
                          >
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">
                                  {c.tag}
                                </span>
                                <span className="font-mono text-[11px] font-bold text-emerald-400">
                                  {c.boost} ({c.score}/100)
                                </span>
                              </div>
                              <p className="text-xs text-pg-text/90 font-medium">
                                « {c.hook} »
                              </p>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyAndTestHook(c.hook, i)}
                              className="shrink-0 gap-1 rounded-xl text-xs border-primary/30 text-primary hover:bg-primary/10"
                            >
                              {copiedClone === i ? <Check className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                              <span>Tester</span>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Plan d'action & Recommandations */}
                  {result.actionPlan && result.actionPlan.length > 0 && (
                    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.03] p-4.5">
                      <span className="flex items-center gap-1.5 eyebrow text-primary">
                        <ListChecks className="size-3.5" />
                        {t('score.actionPlan')}
                      </span>
                      <ul className="flex flex-col gap-2">
                        {result.actionPlan.map((s, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed sm:text-sm">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="text-pg-text/90">{s}</span>
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
    </div>
  )
}
