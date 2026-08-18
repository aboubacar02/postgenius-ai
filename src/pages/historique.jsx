import { useMemo, useState } from 'react'
import { Download, Copy, RotateCcw, Trash2, FolderOpen, History, Search } from 'lucide-react'
import { Input } from '../components/ui/input'
import { InputGroup, InputGroupAddon } from '../components/ui/input-group'
import { Button } from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from '../components/ui/empty'
import { Tooltip } from '../components/ui/tooltip'
import { VideoThumb } from '../components/media/video-thumb'
import { NETWORKS, MARKETS } from '../lib/mock-data'
import { networkLabel, networkBadgeClass, viralBadgeClass, scoreColorClass, scoreLevel } from '../lib/format'
import { toast } from '../components/ui/sonner'
import { cn } from '../lib/utils'
import { useApp } from '../lib/app-context'
import { useI18n } from '../lib/i18n'
import { copyText, downloadText } from '../lib/copy'

const ALL = 'all'
const PAGE_SIZE = 6

const FORMAT_KEYS = {
  'hook-histoire': 'format.hookHistoire',
  tutoriel: 'format.tutoriel',
  liste: 'format.liste',
  'avant-apres': 'format.avantApres',
  'question-reponse': 'format.questionReponse'
}

function HistoryCardSkeleton({ index }) {
  return (
    <div
      className={cn('reveal flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-pg-surface p-4')}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex flex-col gap-2 px-1">
        <Skeleton className="h-3 w-1/3 rounded-full" />
        <Skeleton className="h-5 w-3/4 rounded-full" />
        <Skeleton className="h-3 w-1/2 rounded-full" />
      </div>
    </div>
  )
}

export default function HistoryPage() {
  const { history, historyLoading, generate, removeHistoryItem } = useApp()
  const { t, lang } = useI18n()
  const [query, setQuery] = useState('')
  const [network, setNetwork] = useState(ALL)
  const [limit, setLimit] = useState(PAGE_SIZE)

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

  const fmtLabel = (format) => (FORMAT_KEYS[format] ? t(FORMAT_KEYS[format]) : format)

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchesQuery = item.title.toLowerCase().includes(query.toLowerCase())
      const matchesNetwork = network === ALL || item.network === network
      return matchesQuery && matchesNetwork
    })
  }, [query, network, history])

  const visible = filtered.slice(0, limit)

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 pb-16 pt-4 sm:px-8">
      {/* Header */}
      <div className="reveal flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <History className="size-5" />
          </span>
          <span className="eyebrow text-primary">
            {t('history.badge')}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-pg-text">
          {t('history.title')}
        </h1>
        <p className="max-w-xl text-[15px] text-pg-muted">
          {t('history.subtitle')}
        </p>
      </div>

      {/* Filters */}
      <div className="reveal-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-pg-muted" />
          <input
            type="text"
            placeholder={t('history.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-white/[0.04] bg-white/[0.03] pl-9 pr-4 text-sm text-pg-text placeholder:text-pg-muted backdrop-blur-sm transition-colors focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setNetwork(ALL)}
            className={cn(
              'rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all',
              network === ALL
                ? 'border-primary/40 bg-primary/15 text-primary shadow-sm'
                : 'border-white/[0.04] bg-white/[0.02] text-pg-muted hover:border-primary/30 hover:text-pg-text'
            )}
          >
            {t('history.all')}
          </button>
          {NETWORKS.map((n) => (
            <button
              key={n.value}
              onClick={() => setNetwork(n.value)}
              className={cn(
                'rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all',
                network === n.value
                  ? 'border-primary/40 bg-primary/15 text-primary shadow-sm'
                  : 'border-white/[0.04] bg-white/[0.02] text-pg-muted hover:border-primary/30 hover:text-pg-text'
              )}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {historyLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <HistoryCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
                <Empty className="border border-white/[0.06] bg-pg-surface rounded-xl py-20 reveal">
          <EmptyHeader>
            <EmptyMedia className="flex size-16 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderOpen className="size-12" />
            </EmptyMedia>
            <EmptyTitle className="mt-3 text-base font-bold text-pg-text">
              {history.length === 0 ? t('history.emptyTitle') : t('history.noResults')}
            </EmptyTitle>
            <EmptyDescription className="max-w-xs text-xs text-pg-muted">
              {history.length === 0 ? t('history.emptyDesc') : t('history.noResultsDesc')}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats bar */}
          <div className="reveal-2 flex items-center gap-3 text-xs text-pg-muted">
            <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 font-mono font-semibold">
              {filtered.length} {filtered.length === 1 ? 'création' : 'créations'}
            </span>
            {network !== ALL && (
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-semibold text-primary">
                {networkLabel(network)}
              </span>
            )}
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((item, idx) => {
              const level = scoreLevel(item.score)
              return (
                <div
                  key={item.id}
                  className={cn(
                    'reveal group flex flex-col gap-4 overflow-hidden border border-white/[0.06] bg-pg-surface rounded-xl p-4 transition-all duration-300 hover:border-indigo-500/30 hover:shadow-sm',
                  )}
                  style={{ animationDelay: `${idx * 60 + 150}ms` }}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full overflow-hidden rounded-xl border border-white/[0.04]">
                    <VideoThumb
                      title={item.title}
                      network={item.network}
                      duration={item.duration}
                      className="aspect-video w-full rounded-none opacity-60 transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                    />
                    {/* Score badge */}
                    <span
                      className={cn(
                        'absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full border px-2.5 py-1 font-mono text-[11px] font-bold',
                        level === 'fort'
                          ? 'border-success/30 bg-success/15 text-success shadow-sm'
                          : level === 'moyen'
                            ? 'border-warning/30 bg-warning/15 text-warning'
                            : 'border-destructive/30 bg-destructive/15 text-destructive'
                      )}
                    >
                      {item.score}
                    </span>
                    {/* Duration */}
                    <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/[0.06] bg-black/60 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                      {item.duration}s
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col gap-2 px-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={cn(
                          'rounded-lg border px-2 py-0.5 text-[10px] font-bold',
                          networkBadgeClass(item.network)
                        )}
                      >
                        {networkLabel(item.network)}
                      </span>
                      {MARKETS.find((m) => m.value === item.market) && (
                        <span className="text-xs text-pg-muted">
                          {MARKETS.find((m) => m.value === item.market).flag}
                        </span>
                      )}
                      <span className="text-[11px] text-pg-muted">
                        {fmtDate(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 font-heading text-[15px] font-bold leading-snug text-pg-text transition-colors group-hover:text-indigo-400">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-pg-muted">
                      <span className="rounded-lg border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold">
                        {fmtLabel(item.format)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2 border-t border-white/[0.04] pt-3 px-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-xl border-white/[0.04] bg-white/[0.03] text-xs font-semibold"
                      onClick={() => {
                        const text = item.result?.script?.join('\n\n') || item.title
                        downloadText(text, 'script-postgenius.txt')
                        toast.success(t('history.downloaded'))
                      }}
                    >
                      <Download className="size-3.5" />
                      {t('history.download')}
                    </Button>
                    <Tooltip content={t('history.regenerate')}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-xl text-pg-muted hover:text-primary"
                        onClick={async () => {
                          const meta = item.result?._meta || {}
                          try {
                            await generate(
                              { network: meta.network || item.network, topic: item.topic || item.title, format: meta.format || item.format, duration: meta.duration || item.duration },
                              { recharge: true }
                            )
                            toast.success(t('history.regenerated'))
                          } catch {
                            toast.error(t('history.regenerateFail'))
                          }
                        }}
                      >
                        <RotateCcw className="size-3.5" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('history.copyTitle')}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-xl text-pg-muted hover:text-pg-text"
                        onClick={() => copyText(item.title).then((ok) => toast.success(ok ? t('history.titleCopied') : t('results.copyFail')))}
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </Tooltip>
                    <Tooltip content={t('history.delete')}>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="rounded-xl text-pg-muted hover:text-destructive"
                        onClick={async () => {
                          await removeHistoryItem(item.id)
                          toast.success(t('history.deleted'))
                        }}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              )
            })}
          </div>

          {limit < filtered.length && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                className="rounded-2xl border-white/[0.04] bg-white/[0.03] px-10 font-semibold shadow-sm"
              >
                {t('history.loadMore')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
