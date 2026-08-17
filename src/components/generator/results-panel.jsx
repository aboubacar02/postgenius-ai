import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from '../ui/sonner'
import {
  Camera,
  Check,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Copy,
  Download,
  Gauge,
  Hash,
  ImageIcon,
  Lightbulb,
  ListChecks,
  ListVideo,
  Mic,
  MonitorPlay,
  Pause,
  Play,
  RefreshCw,
  Share2,
  Sparkles,
  Volume2,
  X
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Separator } from '../ui/separator'
import { Progress } from '../ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from '../ui/empty'
import { scoreBgClass } from '../../lib/format'
import { copyText, downloadText } from '../../lib/copy'
import { synthesizeVoice, GEMINI_VOICES } from '../../services/gemini'
import { pcmToWav, makeAudioUrl } from '../../services/audio'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'

const GENERATION_STEP_KEYS = [
  'results.steps.subject',
  'results.steps.variants',
  'results.steps.timeline',
  'results.steps.score'
]

const THUMB_GRADS = [
  'from-fuchsia-500 via-purple-600 to-slate-900',
  'from-cyan-400 via-blue-600 to-slate-900',
  'from-amber-400 via-rose-500 to-slate-900'
]

const fmtNum = (n) => new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 1 }).format(n)

function copy(text, label, t) {
  copyText(text).then((ok) => {
    if (ok) toast.success(t('results.copied', { label }))
    else toast.error(t('results.copyFail'))
  })
}

function VariantPicker({ variants, selected, onSelect }) {
  const { t } = useI18n()
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
      {variants.map((v, i) => {
        const active = i === selected
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              'flex flex-col gap-1.5 rounded-2xl border p-3 text-left transition-all',
              active
                ? 'border-primary/40 bg-primary/15 ring-1 ring-primary/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                : 'border-white/5 bg-card/40 hover:border-white/15'
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                )}
              >
                {t('results.angle', { n: i + 1 })}
              </span>
              <span className="font-mono text-xs font-medium text-primary">{v.viralScore}</span>
            </span>
            <span className="line-clamp-1 text-sm font-semibold leading-snug text-foreground">
              {v.title}
            </span>
            <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {v.angle}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function AudioPlayer({ text }) {
  const { t } = useI18n()
  const [voice, setVoice] = useState(GEMINI_VOICES[1].id)
  const [busy, setBusy] = useState(false)
  const [audioUrl, setAudioUrl] = useState(null)

  async function generate() {
    if (!text || busy) return
    setBusy(true)
    setAudioUrl(null)
    try {
      const { mimeType, base64 } = await synthesizeVoice(text, { voice, style: 'energetic' })
      let src
      if ((mimeType || '').toLowerCase().includes('l16')) {
        src = makeAudioUrl(pcmToWav(base64))
      } else {
        src = `data:${mimeType};base64,${base64}`
      }
      setAudioUrl(src)
      toast.success(t('results.audioSuccess'))
    } catch {
      toast.error(t('results.audioFail'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="glass glow-card rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Volume2 className="size-4 text-primary" />
          {t('results.voiceOff')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="h-9 flex-1 rounded-md border border-border-60 bg-card px-2.5 text-sm text-foreground outline-none focus-visible:border-primary sm:max-w-[220px]"
          >
            {GEMINI_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.emoji} {v.label} — {v.desc}
              </option>
            ))}
          </select>
          <Button onClick={generate} disabled={busy || !text}>
            {busy ? (
              <span className="flex items-center gap-2">
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('results.generatingAudio')}
              </span>
            ) : (
              <>
                <Mic data-icon="inline-start" />
                {t('results.generateAudio')}
              </>
            )}
          </Button>
        </div>
        {audioUrl && (
          <audio controls src={audioUrl} className="h-10 w-full" />
        )}
      </CardContent>
    </Card>
  )
}

function Teleprompter({ lines, open, onClose }) {
  const { t } = useI18n()
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const ref = useRef(null)

  useEffect(() => {
    if (!open || !playing || !ref.current) return
    const el = ref.current
    let raf
    const tick = () => {
      el.scrollTop += speed * 0.45
      if (el.scrollTop + el.clientHeight < el.scrollHeight - 2) {
        raf = requestAnimationFrame(tick)
      } else {
        setPlaying(false)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [open, playing, speed])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950 text-slate-50">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <MonitorPlay className="size-4 text-primary" />
          <span className="text-sm font-semibold">{t('results.teleprompter')}</span>
          <span className="hidden text-xs text-slate-400 sm:inline">
            {t('results.prompterDesc')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={t('results.prompterSlow')}
            onClick={() => setSpeed((s) => Math.max(0.4, Number((s - 0.2).toFixed(1))))}
            className="inline-flex size-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <ChevronDown className="size-4" />
          </button>
          <span className="w-14 text-center font-mono text-sm text-primary">{speed.toFixed(1)}x</span>
          <button
            type="button"
            aria-label={t('results.prompterFast')}
            onClick={() => setSpeed((s) => Math.min(3, Number((s + 0.2).toFixed(1))))}
            className="inline-flex size-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium',
              playing ? 'bg-primary text-white' : 'bg-white/10 hover:bg-white/20'
            )}
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing ? t('results.prompterPause') : t('results.prompterPlay')}
          </button>
          <button
            type="button"
            aria-label={t('results.prompterClose')}
            onClick={onClose}
            className="inline-flex size-8 items-center justify-center rounded-md bg-white/10 hover:bg-white/20"
          >
            <X className="size-4" />
          </button>
        </div>
      </header>
      <div ref={ref} className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          {lines.map((l, i) => (
            <p key={i} className="text-3xl font-medium leading-snug sm:text-4xl">
              {l}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}

const CAPTION_STYLE_KEYS = [
  { id: 'bold', key: 'results.captionBold' },
  { id: 'karaoke', key: 'results.captionKaraoke' },
  { id: 'plain', key: 'results.captionPlain' }
]

function KaraokeCaption({ text, wordIdx }) {
  const words = text.split(' ')
  return (
    <span className="text-xl font-extrabold leading-snug">
      {words.map((w, i) => {
        const done = i < wordIdx
        const now = i === wordIdx
        return (
          <span
            key={i}
            className={cn(
              'mx-0.5 transition-colors',
              now && 'rounded-md bg-primary px-1 text-white',
              done && 'text-white',
              !done && !now && 'text-white/40'
            )}
          >
            {w}
          </span>
        )
      })}
    </span>
  )
}

function CaptionStylePreview({ subtitles }) {
  const { t } = useI18n()
  const [style, setStyle] = useState('bold')
  const [idx, setIdx] = useState(0)
  const [word, setWord] = useState(0)
  const captions = subtitles.length
    ? subtitles
    : [t('results.captionFallback1'), t('results.captionFallback2'), t('results.captionFallback3')]

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % captions.length)
      setWord(0)
    }, 2800)
    return () => clearInterval(t)
  }, [captions.length])

  useEffect(() => {
    if (style !== 'karaoke') return
    const t = setInterval(() => setWord((w) => w + 1), 380)
    return () => clearInterval(t)
  }, [style, idx])

  const text = captions[idx]
  const words = text.split(' ')
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0])

  return (
    <Card className="glass glow-card rounded-3xl">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Sparkles className="size-4 text-primary" />
          {t('results.captionsPreview')}
        </CardTitle>
        <div className="flex items-center gap-1 rounded-lg border border-border-60 bg-background-40 p-1">
          {CAPTION_STYLE_KEYS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                style === s.id ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t(s.key)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex aspect-[9/16] max-h-64 w-full max-w-[150px] items-end justify-center self-center overflow-hidden rounded-2xl bg-slate-950 p-3 sm:max-h-72">
          <div className="pb-2 text-center">
            {style === 'plain' && (
              <span className="text-xl font-extrabold leading-snug text-white">{text}</span>
            )}
            {style === 'bold' && (
              <span className="text-xl font-extrabold leading-snug">
                {words.map((w, i) =>
                  w === longest && w.length >= 4 ? (
                    <span key={i} className="mx-0.5 inline-block rounded-md bg-primary px-1.5 text-white">
                      {w}
                    </span>
                  ) : (
                    <span key={i} className="mx-0.5 text-white">
                      {w}
                    </span>
                  )
                )}
              </span>
            )}
            {style === 'karaoke' && <KaraokeCaption text={text} wordIdx={word} />}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {captions.slice(0, 5).map((line, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setIdx(i)
                setWord(0)
              }}
              className={cn(
                'rounded-full border px-2.5 py-1 text-[11px] transition-colors',
                i === idx
                  ? 'border-primary-40 bg-primary-10 text-foreground'
                  : 'border-border-60 text-muted-foreground hover:border-foreground-20'
              )}
            >
              {line}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const PLATFORMS = [
  {
    id: 'tiktok',
    label: 'TikTok',
    emoji: '🎵',
    durKey: 'results.platTikTokDur',
    formatKey: 'results.platTikTokFormat',
    tags: ['#pourtoi', '#fyp', '#viral', '#tiktokfrance']
  },
  {
    id: 'reels',
    label: 'Reels',
    emoji: '📸',
    durKey: 'results.platReelsDur',
    formatKey: 'results.platReelsFormat',
    tags: ['#reels', '#instagram', '#explore', '#reelsfrance']
  },
  {
    id: 'shorts',
    label: 'YouTube Shorts',
    emoji: '▶️',
    durKey: 'results.platShortsDur',
    formatKey: 'results.platShortsFormat',
    tags: ['#shorts', '#youtubeshorts', '#fyp']
  }
]

function PlatformAdapt({ cur }) {
  const { t } = useI18n()
  const cta = cur.script?.[cur.script.length - 1] || ''

  return (
    <Card className="glass glow-card rounded-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Share2 className="size-4 text-primary" />
          {t('results.platformsTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {PLATFORMS.map((p) => {
          const caption = [
            cur.title,
            '',
            cur.hook,
            '',
            cta,
            '',
            [...cur.hashtags, ...p.tags].join(' ')
          ].join('\n')
          return (
            <div
              key={p.id}
              className="flex flex-col gap-2.5 rounded-lg border border-border-60 bg-background-40 p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <span>{p.emoji}</span>
                  {p.label}
                </span>
                <Badge variant="secondary" className="font-mono text-[10px]">
                  {t(p.durKey)}
                </Badge>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{t(p.formatKey)}</p>
              <p className="line-clamp-3 whitespace-pre-wrap rounded-md bg-card px-2.5 py-2 text-[11px] leading-relaxed text-foreground-80">
                {caption}
              </p>
              <Button variant="outline" size="sm" onClick={() => copy(caption, p.label, t)}>
                <Copy data-icon="inline-start" />
                {t('results.copyCaption')}
              </Button>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

function ViralScoreCard({ cur }) {
  const { t } = useI18n()
  const scriptText = (cur.script || []).join(' ')
  const last = cur.script?.[cur.script.length - 1] || ''

  const hook = (cur.hook || '').length <= 90
  const emotion = /(incroyable|impossible|horrible|fou|pire|meilleur|peur|gagné|perdu|détruire|choquant|honte|secret|révèle)/i.test(scriptText)
  const pacing = (cur.script || []).every((l) => l.length <= 170)
  const seo = (cur.hook || '').toLowerCase().split(' ').filter((w) => w.length > 4).length >= 3
  const cta = /(abonne|follow|commente|dis-moi|partage|sauvegarde|bio|enregistre|réponds)/i.test(last)

  const metrics = [
    { label: t('results.metricHook'), ok: hook },
    { label: t('results.metricEmotion'), ok: emotion },
    { label: t('results.metricPacing'), ok: pacing },
    { label: t('results.metricSeo'), ok: seo },
    { label: t('results.metricCta'), ok: cta }
  ]
  const pct = metrics.filter((m) => m.ok).length / metrics.length

  return (
    <Card className="glass glow-card rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Gauge className="size-4 text-primary" />
          {t('results.viralScore')}
        </CardTitle>
        <span className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-gradient-to-r from-primary/20 to-fuchsia-500/20 px-3 py-1 font-mono text-xs font-bold text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.25)]">
          {cur.viralScore}/100
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {metrics.map((m) => (
          <div key={m.label}>
            <div className="mb-1 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider">
              <span className="text-muted-foreground">{m.label}</span>
              <span className="font-bold text-foreground">{m.ok ? '100' : '70'}%</span>
            </div>
            <Progress value={m.ok ? 100 : 70} gradient className="h-1.5" />
          </div>
        ))}
        <div className="mt-2 border-t border-border-60 pt-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-15 text-cyan-400">
              <Lightbulb className="size-3.5" />
            </span>
            <div>
              <h4 className="text-sm font-medium text-foreground">{t('results.engagementTitle')}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {pct >= 0.8
                  ? t('results.engagementHigh')
                  : t('results.engagementLow')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ViralChecklist({ cur, score }) {
  const { t } = useI18n()
  const last = cur.script?.[cur.script.length - 1] || ''
  const scriptText = (cur.script || []).join(' ')

  const checks = [
    {
      label: t('results.checkHook'),
      ok: !!cur.hook && cur.hook.length <= 90
    },
    {
      label: t('results.checkCuriosity'),
      ok: /(personne|jamais|secret|erreur|tu|vous|comment|pourquoi|arrête|révèle|découvre)/i.test(cur.hook || '')
    },
    {
      label: t('results.checkEmotion'),
      ok: /(incroyable|impossible|horrible|fou|pire|meilleur|peur|gagné|perdu|détruire|choquant|honte)/i.test(scriptText)
    },
    {
      label: t('results.checkQuestion'),
      ok: /\?/.test(scriptText)
    },
    {
      label: t('results.checkCta'),
      ok: /(abonne|follow|commente|dis-moi|partage|sauvegarde|bio|enregistre|réponds)/i.test(last)
    },
    {
      label: t('results.checkSubtitles'),
      ok: (cur.subtitles || []).length >= 3
    },
    {
      label: t('results.checkPacing'),
      ok: (cur.script || []).every((l) => l.length <= 170)
    }
  ]

  const done = checks.filter((c) => c.ok).length
  const pct = Math.round((done / checks.length) * 100)

  const prediction = useMemo(() => {
    const base = Math.max(0, score - 30)
    return {
      likes: Math.round(base * 240),
      comments: Math.round(base * 17),
      shares: Math.round(base * 26)
    }
  }, [score])

  return (
    <Card className="glass glow-card rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ListChecks className="size-4 text-primary" />
          {t('results.checklist')}
        </CardTitle>
        <span className="font-mono text-xs font-medium text-primary">{done}/{checks.length}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={pct} gradient className="h-1.5" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {checks.map((c) => (
            <div
              key={c.label}
              className="flex items-start gap-2.5 rounded-lg border border-border-60 bg-background-40 p-2.5"
            >
              <span
                className={cn(
                  'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full',
                  c.ok ? 'bg-success-20 text-success' : 'bg-muted-30 text-muted-foreground'
                )}
              >
                {c.ok ? <Check className="size-3" /> : <X className="size-3" />}
              </span>
              <span className="text-xs leading-relaxed text-foreground-90">{c.label}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary">
            {t('results.engagementEstimated')}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black text-foreground">
                {fmtNum(prediction.likes)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('results.likes')}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black text-foreground">
                {fmtNum(prediction.comments)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('results.comments')}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xl font-black text-foreground">
                {fmtNum(prediction.shares)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t('results.shares')}</span>
            </div>
            <p className="ml-auto max-w-[220px] text-[11px] leading-relaxed text-muted-foreground">
              {t('results.simulation', { score })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultsPanel({ result, loading, onRegenerate }) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)
  const [vi, setVi] = useState(0)
  const [prompterOpen, setPrompterOpen] = useState(false)

  useEffect(() => {
    if (!loading) return
    setStep(0)
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, GENERATION_STEP_KEYS.length - 1)),
      1400
    )
    return () => clearInterval(id)
  }, [loading])

  useEffect(() => {
    setVi(0)
    setPrompterOpen(false)
  }, [result])

  if (loading) {
    return (
      <Card className="glass glow-card rounded-3xl">
        <CardContent className="flex flex-col gap-6 px-6 py-14">
          <div className="flex items-center justify-center">
            <div className="relative flex size-16 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/10 border-t-primary" />
              <div className="absolute inset-1 animate-spin rounded-full border-2 border-white/5 border-t-primary/50 [animation-direction:reverse] [animation-duration:2s]" />
              <Sparkles className="size-6 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 text-center">
            <p className="text-sm font-bold text-foreground">{t('results.generating')}</p>
            <p className="text-xs text-muted-foreground">
              {t('results.generatingDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {GENERATION_STEP_KEYS.map((key, i) => (
              <div
                key={key}
                className={cn(
                  'flex items-center gap-2.5 text-sm transition-opacity',
                  i > step && 'opacity-40'
                )}
              >
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full',
                    i < step
                      ? 'bg-success-20 text-success'
                      : i === step
                        ? 'bg-primary-15 text-primary'
                        : 'bg-muted-30 text-muted-foreground'
                  )}
                >
                  {i < step ? (
                    <Check className="size-3" />
                  ) : (
                    <span className="font-mono text-[10px]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </span>
                <span className={cn(i === step && 'font-medium text-foreground')}>{t(key)}</span>
              </div>
            ))}
          </div>
          <Progress value={((step + 1) / GENERATION_STEP_KEYS.length) * 100} className="h-1" />
        </CardContent>
      </Card>
    )
  }

  if (!result) {
    return (
      <Empty className="glow-card glass rounded-3xl border-none py-16">
        <EmptyMedia className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-8" />
        </EmptyMedia>
        <EmptyTitle className="mt-3 text-base font-bold">{t('results.emptyTitle')}</EmptyTitle>
        <EmptyDescription className="max-w-xs text-xs">
          {t('results.emptyDesc')}
        </EmptyDescription>
      </Empty>
    )
  }

  const variants = result.variants?.length ? result.variants : [result]
  const cur = variants[Math.min(vi, variants.length - 1)] || variants[0]
  const fullScript = cur.script.join('\n\n')
  const hooks = result.hooks?.length ? result.hooks : cur.hooks || []

  return (
    <div className="flex flex-col gap-6">
      <Card className="glass glow-card rounded-3xl">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {t('results.suggestedTitle')}
              {variants.length > 1 && ` · ${t('results.angle', { n: vi + 1 })}`}
            </span>
            <CardTitle className="text-balance font-heading text-lg leading-snug">
              {cur.title}
            </CardTitle>
            {cur.analysis && (
              <p className="mt-1 max-w-xl text-xs leading-relaxed text-muted-foreground">
                {cur.analysis}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
                scoreBgClass(cur.viralScore)
              )}
            >
              <Gauge className="size-3" />
              <span className="font-mono">{cur.viralScore}</span>
            </div>
            {cur.aiScore != null && (
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {t('results.iaLabel', { ai: cur.aiScore, local: cur.localScore })}
              </span>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Bento grid — 12 cols, like Stitch */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left column (4): Angles + Score + Voix */}
        <div className="flex flex-col gap-6 md:col-span-4">
          {variants.length > 1 && (
            <Card className="glass glow-card rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clapperboard className="size-4 text-primary" />
                  {t('results.anglesTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VariantPicker variants={variants} selected={vi} onSelect={setVi} />
              </CardContent>
            </Card>
          )}

          <ViralScoreCard cur={cur} />

          <AudioPlayer text={fullScript} />
        </div>

        {/* Right column (8): Script + Checklist */}
        <div className="flex min-w-0 flex-col gap-6 md:col-span-8">
          <Card className="glass glow-card rounded-3xl flex-1">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 border-b border-border-60">
              <CardTitle className="text-sm">{t('results.scriptComplete')}</CardTitle>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={() => setPrompterOpen(true)}>
                  <MonitorPlay data-icon="inline-start" />
                  {t('results.teleprompter')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => copy(fullScript, 'Script', t)}>
                  <Copy data-icon="inline-start" />
                  {t('results.copy')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {cur.script.map((line, i) => (
                <p key={i} className="text-sm leading-relaxed text-foreground-90">
                  {line}
                </p>
              ))}
            </CardContent>
          </Card>

          <ViralChecklist cur={cur} score={cur.viralScore} />
        </div>
      </div>

      <Card className="glass glow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="text-sm">{t('results.hooksAlt')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {hooks.map((hook, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border-60 bg-background-40 p-3"
            >
              <span className="mt-0.5 font-mono text-xs font-medium text-primary">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="flex-1 text-sm leading-relaxed text-foreground">{hook}</p>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Copier ce hook"
                onClick={() => copy(hook, 'Hook', t)}
              >
                <Copy />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <CaptionStylePreview subtitles={cur.subtitles} />

      <Card className="glass glow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ListVideo className="size-4 text-primary" />
            {t('results.timeline')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 font-mono text-[11px] uppercase text-muted-foreground">
                  {t('results.time')}
                </TableHead>
                <TableHead className="text-[11px] uppercase text-muted-foreground">
                  {t('results.sequence')}
                </TableHead>
                <TableHead className="text-[11px] uppercase text-muted-foreground">{t('results.note')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.timeline.map((row) => (
                <TableRow key={row.time}>
                  <TableCell className="font-mono text-xs text-primary">{row.time}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">
                    {row.section}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="glass glow-card rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Hash className="size-4 text-primary" />
              {t('results.hashtags')}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copier les hashtags"
              onClick={() => copy(cur.hashtags.join(' '), 'Hashtags', t)}
            >
              <Copy />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {cur.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-xs">
                {tag}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="glass glow-card rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">{t('results.subtitles')}</CardTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Copier les sous-titres"
              onClick={() => copy(cur.subtitles.join('\n'), 'Sous-titres', t)}
            >
              <Copy />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-1.5">
            {cur.subtitles.slice(0, 5).map((line, i) => (
              <p key={i} className="truncate text-xs text-muted-foreground">
                <span className="font-mono text-primary">{String(i + 1).padStart(2, '0')}</span>{' '}
                {line}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>

      <PlatformAdapt cur={cur} />

      <Card className="glass glow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Clapperboard className="size-4 text-primary" />
            {t('results.shootingSheet')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-lg border border-border-60 bg-background-40 p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <Lightbulb className="size-3.5 text-amber-400" />
              {t('results.lighting')}
            </span>
            <ul className="flex flex-col gap-1.5">
              {result.lighting.map((tip) => (
                <li key={tip} className="text-xs leading-relaxed text-muted-foreground">
                  · {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-border-60 bg-background-40 p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <Camera className="size-3.5 text-cyan-400" />
              {t('results.framing')}
            </span>
            <ul className="flex flex-col gap-1.5">
              {result.camera.map((tip) => (
                <li key={tip} className="text-xs leading-relaxed text-muted-foreground">
                  · {tip}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 rounded-lg border border-border-60 bg-background-40 p-3.5">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-foreground">
              <Clapperboard className="size-3.5 text-fuchsia-400" />
              {t('results.brolls')}
            </span>
            <ul className="flex flex-col gap-1.5">
              {result.brolls.map((tip) => (
                <li key={tip} className="text-xs leading-relaxed text-muted-foreground">
                  · {tip}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="glass glow-card rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ImageIcon className="size-4 text-primary" />
            {t('results.thumbnails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {result.thumbnailPrompts.map((prompt, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border-60 bg-background-40 p-3"
            >
              <div
                className={cn(
                  'relative flex aspect-video items-end overflow-hidden rounded-md bg-gradient-to-br p-2',
                  THUMB_GRADS[i % THUMB_GRADS.length]
                )}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.25),transparent_55%)]" />
                <span className="relative line-clamp-2 text-[10px] leading-tight font-bold text-white drop-shadow">
                  {cur.title}
                </span>
              </div>
              <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                {prompt}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="self-start"
                onClick={() => copy(prompt, 'Invite', t)}
              >
                <Copy data-icon="inline-start" />
                {t('results.copyPrompt')}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={() => copy(fullScript, 'Script', t)}
          className="rounded-2xl bg-gradient-to-r from-primary to-fuchsia-600 px-6 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]"
        >
          <Copy data-icon="inline-start" />
          {t('results.copyScript')}
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadText(fullScript, 'script-postgenius.txt')}
          className="rounded-2xl border-white/10 bg-white/5 font-semibold"
        >
          <Download data-icon="inline-start" />
          {t('results.download')}
        </Button>
        <Button
          variant="outline"
          onClick={onRegenerate}
          className="rounded-2xl border-white/10 bg-white/5 font-semibold"
        >
          <RefreshCw data-icon="inline-start" />
          {t('results.regenerate')}
        </Button>
      </div>

      <Teleprompter lines={cur.script} open={prompterOpen} onClose={() => setPrompterOpen(false)} />
    </div>
  )
}
