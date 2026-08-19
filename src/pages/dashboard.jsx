import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clapperboard,
  Flame,
  Gauge,
  Plus,
  Sparkles,
  Wand2
} from 'lucide-react'
import { Skeleton } from '../components/ui/skeleton'
import { VideoThumb } from '../components/media/video-thumb'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'
import { networkLabel, scoreColorClass } from '../lib/format'

const QUICK_ACTIONS = [
  { to: '/generateur', icon: Wand2, title: 'Script Generator', desc: 'Hooks & teleprompter', color: 'from-indigo-500/20 to-purple-500/10 text-indigo-400' },
  { to: '/faceless', icon: Clapperboard, title: 'Faceless Video', desc: 'Timeline & sous-titres', color: 'from-cyan-500/20 to-teal-500/10 text-cyan-400' },
  { to: '/score-viral', icon: Gauge, title: 'Score & Rétention', desc: 'Analyse mot par mot', color: 'from-amber-500/20 to-orange-500/10 text-amber-400' },
  { to: '/tendances', icon: Flame, title: 'Tendances', desc: 'Niches & idées virales', color: 'from-rose-500/20 to-pink-500/10 text-rose-400' },
]

export default function DashboardPage() {
  const { creditsLeft, creditsTotal, history, historyLoading } = useApp()
  const { t, lang } = useI18n()
  const items = history.length ? history : []
  const avgScore = items.length
    ? Math.round(items.reduce((sum, h) => sum + h.score, 0) / items.length)
    : 0
  const recent = items.slice(0, 4)

  const fmtDate = (iso) => {
    const date = new Date(iso)
    if (Number.isNaN(date.getTime())) return ''
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
            {t('dashboard.badge')}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-pg-text sm:text-3xl">
            {t('dashboard.title')}
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
            className="group relative overflow-hidden rounded-pg-lg border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
          >
            <div className="relative z-10 flex flex-col gap-3">
              <span className={`flex size-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} transition-transform duration-200 group-hover:scale-110`}>
                <item.icon className="size-5" />
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

      {/* ── Real Stats from History ──────────────────────────── */}
      {items.length > 0 && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3 reveal-2">
          <div className="rounded-pg-lg border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-200 hover:border-white/[0.16]">
            <span className="text-[12px] font-medium text-pg-muted">{t('dashboard.totalScripts')}</span>
            <span className="mt-1 block text-2xl font-extrabold tracking-tight text-indigo-400">{items.length}</span>
          </div>
          <div className="rounded-pg-lg border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-200 hover:border-white/[0.16]">
            <span className="text-[12px] font-medium text-pg-muted">{t('dashboard.avgScore') || 'Score moyen'}</span>
            <span className="mt-1 block text-2xl font-extrabold tracking-tight text-cyan-400">{avgScore}/100</span>
          </div>
          <div className="rounded-pg-lg border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-200 hover:border-white/[0.16]">
            <span className="text-[12px] font-medium text-pg-muted">{t('dashboard.creditsLeft') || 'Crédits restants'}</span>
            <span className="mt-1 block text-2xl font-extrabold tracking-tight text-emerald-400">{creditsLeft}/{creditsTotal}</span>
          </div>
        </section>
      )}

      {/* ── Recent Creations ───────────────────────────────── */}
      <section className="reveal-3 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-pg-text">
            {t('dashboard.recentCreations')}
          </h2>
          {items.length > 0 && (
            <Link
              to="/historique"
              className="flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              {t('dashboard.viewAll')}
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>

        {historyLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="aspect-[9/16] rounded-pg-lg" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <Link
            to="/generateur"
            className="group flex flex-col items-center justify-center gap-4 rounded-pg-lg border-2 border-dashed border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center transition-all duration-200 hover:border-primary/30 hover:bg-primary/5"
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
              <Plus className="size-7" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-pg-text">
                {t('dashboard.emptyTitle')}
              </span>
              <span className="text-xs text-pg-muted">
                {t('dashboard.emptyDesc')}
              </span>
            </div>
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {recent.map((item) => (
              <Link
                key={item.id}
                to="/historique"
                className="group relative aspect-[9/16] overflow-hidden rounded-pg-lg border border-white/[0.08] transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
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
            <span className="rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
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
