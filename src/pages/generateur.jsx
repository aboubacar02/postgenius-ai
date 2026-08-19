import { useEffect, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Info, Loader2, Sparkles, Tv, Zap } from 'lucide-react'
import { toast } from '../components/ui/sonner'
import { GeneratorForm } from '../components/generator/generator-form'
import { ResultsPanel } from '../components/generator/results-panel'
import { TeleprompterModal } from '../components/generator/teleprompter-modal'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { AuthModal } from '../components/auth/auth-modal'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'

const DEFAULT_INPUT = {
  network: 'tiktok',
  tone: 'storytelling',
  format: 'hook-histoire',
  duration: 30,
  audience: 'grand-public',
  cta: 'abonne',
  topic: ''
}

export default function GeneratorPage() {
  const { user, generate, creditsLeft, creditsTotal } = useApp()
  const { t } = useI18n()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [prompterOpen, setPrompterOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const resultsRef = useRef(null)

  useEffect(() => {
    const formatParam = searchParams.get('format') || location.state?.format
    const topicParam = searchParams.get('topic') || location.state?.topic
    if (formatParam || topicParam) {
      setInput((prev) => ({
        ...prev,
        format: formatParam || prev.format,
        topic: topicParam || prev.topic
      }))
      if (formatParam) {
        toast.info(`✨ Format viral sélectionné : ${formatParam}`)
      }
    }
  }, [searchParams, location.state])

  const canGenerate = input.topic.trim().length > 0 && creditsLeft > 0 && !loading
  const creditsPct = creditsTotal ? Math.round((creditsLeft / creditsTotal) * 100) : 0

  async function runGeneration(options = {}) {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    
    if (input.topic.trim().length === 0) {
      toast.error(t('generator.describeTopic'))
      return
    }
    setLoading(true)
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)

    try {
      const script = await generate(
        {
          network: input.network,
          tone: input.tone,
          format: input.format,
          duration: input.duration,
          audience: input.audience,
          cta: input.cta,
          topic: input.topic
        },
        options
      )
      setResult(script)
      toast.success(t('generator.success'))
    } catch (err) {
      if (err.message === 'crédits') {
        toast.error(t('generator.noCreditsToast'))
      } else {
        toast.error(err.message || t('generator.failToast'))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 pb-16 pt-4 sm:px-8">
      {/* Header */}
      <div className="reveal mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </span>
          <span className="eyebrow text-primary">
            Studio IA Canvas & Rétention
          </span>
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          <span className="text-gradient">{t('generator.title')}</span>
        </h1>
        <p className="text-[15px] text-pg-muted">
          {t('generator.subtitle')}
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="reveal-1 grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <GeneratorForm value={input} onChange={setInput} />
        </div>

        {/* Action Panel Sticky */}
        <div className="lg:col-span-4">
          <div className="border border-white/[0.08] bg-white/[0.03] backdrop-blur-md sticky top-24 flex flex-col gap-5 rounded-xl p-5 shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="size-4.5" />
                </span>
                <h2 className="font-heading text-lg font-bold text-pg-text">
                  {t('generator.ready')}
                </h2>
              </div>
              <p className="text-xs leading-relaxed text-pg-muted">
                {t('generator.cost')}
              </p>
            </div>

            {/* Credits Counter */}
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-pg-muted">
                  <Zap className="size-3.5 text-warning" />
                  {t('generator.credits')}
                </span>
                <span className="font-mono text-pg-text">
                  {creditsLeft} / {creditsTotal}
                </span>
              </div>
              <Progress value={creditsPct} className="h-1.5" />
            </div>

            {/* Dominant Generate Button */}
            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="h-14 w-full gap-2.5 rounded-2xl bg-primary text-base font-bold text-white transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-40 disabled:hover:scale-100"
                disabled={!canGenerate}
                onClick={() => runGeneration()}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    <span>Génération en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    <span>{t('generator.generate')}</span>
                  </>
                )}
              </Button>
              <p className="text-center text-xs text-pg-muted">                {input.topic.trim().length === 0
                  ? t('generator.describeFirst')
                  : creditsLeft <= 0
                    ? t('generator.noCredits')
                    : `${input.topic.length} / 280 caractères`}
              </p>
            </div>

            {/* Pro Tip */}
            <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/10 p-3.5">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" />
              <p className="text-xs leading-relaxed text-pg-muted">
                {t('generator.tipText')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="reveal-2 mt-12" ref={resultsRef}>
        {(result || loading) && (
          <div className="reveal mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-col gap-1">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-pg-text sm:text-3xl">
                {t('generator.resultsTitle')}
              </h2>
              <p className="text-sm text-pg-muted">
                {t('generator.resultsSubtitle')}{' '}
                <span className="font-semibold text-pg-text">
                  {input.network === 'tiktok'
                    ? 'TikTok'
                    : input.network === 'reels'
                      ? 'Instagram Reels'
                      : 'YouTube Shorts'}
                </span>
              </p>
            </div>

            {result && (
              <Button
                variant="outline"
                onClick={() => setPrompterOpen(true)}
                className="gap-2 rounded-xl border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 shadow-sm"
              >
                <Tv className="size-4" />
                <span>Mode Teleprompter Pro</span>
              </Button>
            )}
          </div>
        )}
        <ResultsPanel
          result={result}
          loading={loading}
          onRegenerate={() => runGeneration({ recharge: true })}
        />
      </div>

      {/* Teleprompter Fullscreen Modal */}
      <TeleprompterModal
        script={result}
        open={prompterOpen}
        onClose={() => setPrompterOpen(false)}
      />
      
      {/* Auth Modal for Gated Action */}
      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
    </>
  )
}
