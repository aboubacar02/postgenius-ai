import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clapperboard,
  Eye,
  Flame,
  Gauge,
  Sparkles,
  TrendingUp,
  Trophy,
  Video,
  Wand2
} from 'lucide-react'
import { Skeleton } from '../components/ui/skeleton'
import { RetentionAreaChart } from '../components/dashboard/retention-area-chart'
import { ViralityRadarChart } from '../components/dashboard/virality-radar-chart'
import { CreatorTierCard } from '../components/dashboard/creator-tier-card'
import { VideoThumb } from '../components/media/video-thumb'
import { ReferralCard } from '../components/referral/referral-card'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'
import { networkLabel, scoreColorClass } from '../lib/format'

const METRICS = [
  {
    label: 'Score viral moyen',
    value: '78',
    suffix: '/100',
    change: '+12%',
    description: 'vs semaine dernière',
    color: 'indigo',
    icon: Gauge,
    points: '0,32 18,27 35,29 52,21 68,24 84,16 100,12',
  },
  {
    label: 'Vidéos générées',
    value: '14',
    suffix: '',
    change: '+3',
    description: 'cette semaine',
    color: 'cyan',
    icon: Video,
    points: '0,28 20,22 40,18 60,14 80,10 100,6',
  },
  {
    label: 'Taux de rétention',
    value: '73',
    suffix: '%',
    change: '+8%',
    description: 'moyenne 30s',
    color: 'green',
    icon: TrendingUp,
    points: '0,40 25,30 50,22 75,16 100,10',
  },
  {
    label: 'Vues totales',
    value: '2.4M',
    suffix: '',
    change: '+340K',
    description: 'ce mois',
    color: 'amber',
    icon: Eye,
    points: '0,38 20,28 40,20 60,14 80,8 100,4',
  },
]

const QUICK_ACTIONS = [
  { to: '/generateur', icon: Wand2, title: 'Script Generator', desc: 'Hooks & teleprompter', color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400' },
  { to: '/faceless', icon: Clapperboard, title: 'Faceless Video', desc: 'Timeline & sous-titres', color: 'from-cyan-500/20 to-teal-500/10 text-cyan-400' },
  { to: '/score-viral', icon: Gauge, title: 'Score & Rétention', desc: 'Analyse mot par mot', color: 'from-amber-500/20 to-orange-500/10 text-amber-400' },
  { to: '/tendances', icon: Flame, title: 'Tendances', desc: 'Niches & idées virales', color: 'from-rose-500/20 to-pink-500/10 text-rose-400' },
]

function MiniSparkline({ points, color }) {
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon
        points={`${points} 100,40 0,40`}
        fill={`url(#spark-${color})`}
      />
    </svg>
  )
}

export default function DashboardPage() {
  const { creditsLeft, creditsTotal, history, historyLoading } = useApp()
  const { t, lang } = useI18n()
  const items = history.length ? history : []
  const avgScore = items.length
    ? Math.round(items.reduce((sum, h) => sum + h.score, 0) / items.length)
    : 78
  const bestScore = items.length ? Math.max(...items.map((h) => h.score)) : 94
  const recent = items.slice(0, 4)

  const fmtDate = (iso) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return 'Recently'
    const diffMs = Date.now() - date.getTime()
    const diffHours = Math.round(diffMs / (1000 * 60 * 60))
    if (diffHours < 1) return t('format.justNow')
    if (diffHours < 24) return t('format.agoHours', { n: diffHours })
    const diffDays = Math.round(diffHours / 24)
    if (diffDays === 1) return t('format.yesterday')
    if (diffDays < 7) return t('format.agoDays', { n: diffDays })
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : lang, { day: 'numeric', month: 'short' })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-16 pt-6 sm:px-8">

      {/* ── Hero Header ─────────────────────────────────────── */}
      <section className="reveal relative">
        <div className="relative z-10 flex flex-col gap-3">
          <span className="pg-badge inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="size-3" />
            {t('dashboard.badge') || 'Dashboard'}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-pg-text sm:text-3xl">
            {t('dashboard.title') || 'Welcome back'}
          </h1>
          <p className="max-w-lg text-[15px] text-pg-muted">
            {t('dashboard.subtitle') || 'Generate scripts, produce faceless videos and maximize your algorithmic retention.'}
          </p>
        </div>
        <div className="absolute -top-20 right-0 h-[200px] w-[300px] pointer-events-none opacity-30">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px]" />
        </div>
      </section>

      {/* ── Quick Actions ────────────────────────────────────── */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 reveal-1">
        {QUICK_ACTIONS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group relative overflow-hidden rounded-pg-lg border border-white/[0.06] bg-pg-surface p-4 transition-all duration-200 hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-pg-md"
          >
            <div className="relative z-10 flex flex-col gap-3">
              <span className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} transition-transform duration-200 group-hover:scale-110`}>
                <item.icon className="size-4.5" />
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-pg-text">{item.title}</span>
                <span className="text-xs text-pg-muted">{item.desc}</span>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 size-16 rounded-full bg-white/[0.02] transition-all duration-300 group-hover:scale-150" />
          </Link>
        ))}
      </section>

      {/* ── Stats ──────────────────────────────────────────── */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 reveal-2">
        {METRICS.map((m) => {
          const Icon = m.icon
          const colorMap = {
            indigo: 'text-indigo-400',
            cyan: 'text-cyan-400',
            green: 'text-emerald-400',
            amber: 'text-amber-400',
          }
          return (
            <div
              key={m.label}
              className="group relative overflow-hidden rounded-pg-lg border border-white/[0.06] bg-pg-surface p-4 transition-all duration-200 hover:border-white/[0.12] hover:shadow-pg-md"
            >
              <div className="relative z-10">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-pg-muted">{m.label}</span>
                  <span className={`flex size-8 items-center justify-center rounded-lg bg-white/[0.05] ${colorMap[m.color]}`}>
                    <Icon className="size-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-2xl font-extrabold tracking-tight ${colorMap[m.color]}`}>{m.value}</span>
                  {m.suffix && <span className="text-sm text-pg-muted">{m.suffix}</span>}
                  <span className="pg-metric-change ml-1.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {m.change}
                  </span>
                </div>
                <span className="mt-1 block text-[11px] text-pg-subtle">{m.description}</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-12 pointer-events-none opacity-30">
                <MiniSparkline points={m.points} color={m.color} />
              </div>
            </div>
          )
        })}
      </section>

      {/* ── Data Visualization ─────────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 reveal-3">
        <div className="lg:col-span-7">
          <RetentionAreaChart historyCount={items.length} />
        </div>
        <div className="lg:col-span-5">
          <ViralityRadarChart />
        </div>
      </section>

      {/* ── Creator Tier & Referral ────────────────────────── */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 reveal-4">
        <div className="lg:col-span-6">
          <CreatorTierCard scriptCount={items.length} />
        </div>
        <div className="lg:col-span-6">
          <ReferralCard />
        </div>
      </section>

      {/* ── Recent Creations ───────────────────────────────── */}
      <section className="reveal-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-pg-text">
            {t('dashboard.recentCreations')}
          </h2>
          <Link
            to="/historique"
            className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {t('dashboard.viewAll')}
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {historyLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-pg-lg" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[
              { id: 'demo1', title: '3 IA secrets you missed in 2026', network: 'tiktok', duration: 30, score: 94 },
              { id: 'demo2', title: 'How to grow from 0 to 100k followers', network: 'reels', duration: 45, score: 88 },
              { id: 'demo3', title: 'The fatal productivity mistake', network: 'shorts', duration: 25, score: 91 },
              { id: 'demo4', title: 'Why this business is booming', network: 'tiktok', duration: 60, score: 86 }
            ].map((item) => (
              <Link
                key={item.id}
                to="/generateur"
                className="group relative aspect-[9/16] overflow-hidden rounded-pg-lg border border-white/[0.06] transition-all duration-200 hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-pg-md"
              >
                <VideoThumb
                  title={item.title}
                  network={item.network}
                  duration={item.duration}
                  className="absolute inset-0 h-full w-full rounded-none transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 pt-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                      {networkLabel(item.network)}
                    </span>
                    <span className={`font-mono text-xs font-bold ${scoreColorClass(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-emerald-400">
                    Recommended template
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {recent.map((item) => (
              <Link
                key={item.id}
                to="/historique"
                className="group relative aspect-[9/16] overflow-hidden rounded-pg-lg border border-white/[0.06] transition-all duration-200 hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-pg-md"
              >
                <VideoThumb
                  title={item.title}
                  network={item.network}
                  duration={item.duration}
                  className="absolute inset-0 h-full w-full rounded-none transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 pt-10">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm">
                      {networkLabel(item.network)}
                    </span>
                    <span className={`font-mono text-xs font-bold ${scoreColorClass(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-white/50">
                    {fmtDate(item.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
