import { useEffect, useState } from 'react'
import { ArrowRight, Clock, ExternalLink, Flame, Info, Loader2, Music, Play, RefreshCw, Search, Sparkles, TrendingUp, Video, X, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { AudioTrendsLibrary } from '../components/media/audio-trends-library'
import { VideoModal } from '../components/media/video-modal'
import { useI18n } from '../lib/i18n'
import { NICHES } from '../lib/niches'
import { searchYoutube } from '../services/youtube'
import { BEST_TIMES, VIRAL_FORMATS, RESOURCES, VIRAL_VIDEOS, seedFromString } from '../lib/trends-data'

export default function TendancesPage() {
  const { t } = useI18n()
  const [lot, setLot] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const [searchNotice, setSearchNotice] = useState('')

  async function runSearch() {
    const q = searchQuery.trim()
    if (!q || searching) return
    setSearching(true)
    setSearchNotice('')
    try {
      const data = await searchYoutube(q)
      if (data.live && data.items.length > 0) {
        setLiveResults(data.items)
        setLiveMode(true)
      } else if (data.live) {
        setSearchNotice(t('trending.noResults'))
      } else {
        setSearchNotice(t('trending.noKey'))
      }
    } catch {
      setSearchNotice(t('trending.noKey'))
    } finally {
      setSearching(false)
    }
  }

  function resetSearch() {
    setLiveMode(false)
    setLiveResults([])
    setSearchQuery('')
    setSearchNotice('')
  }

  useEffect(() => {
    if (!activeVideo) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActiveVideo(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeVideo])

  return (
    <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 pb-16 pt-6 sm:px-8">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="reveal flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-lg shadow-orange-500/20">
            <Flame className="size-5" />
          </span>
          <span className="eyebrow text-orange-400">
            {t('trending.updated')}
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-pg-text sm:text-3xl">
          {t('trending.title')}
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-pg-muted">
          {t('trending.subtitle')}
        </p>
      </div>

      {/* ── Search (glass morphism, rounded-full) ──────── */}
      <form
        className="reveal-1 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); runSearch() }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('trending.searchPlaceholder')}
            className="h-11 w-full rounded-full border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-zinc-800/60 focus:shadow-lg focus:shadow-indigo-500/5"
          />
        </div>
        <Button type="submit" size="default" disabled={!searchQuery.trim() || searching} className="rounded-full bg-indigo-600 px-5 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all">
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          <span className="hidden sm:inline">{t('trending.search')}</span>
        </Button>
        {liveMode && (
          <Button type="button" variant="outline" size="icon" onClick={resetSearch} aria-label={t('trending.clearSearch')} className="rounded-full border-white/[0.08] bg-zinc-900/60">
            <X className="size-4" />
          </Button>
        )}
      </form>

      {liveMode && (
        <span className="flex w-fit items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/15 px-3 py-1 text-[10px] font-bold text-indigo-400">
          <Video className="size-3.5" />
          {t('trending.liveBadge')}
        </span>
      )}
      {searchNotice && !liveMode && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-400">
          <Info className="size-4 shrink-0" />
          {searchNotice}
        </div>
      )}

      {/* ── Viral Formats (horizontal scroll chips) ──── */}
      <section className="flex flex-col gap-4">
        <span className="reveal flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <Sparkles className="size-3.5 text-indigo-400" />
          {t('trending.viralFormats')}
        </span>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {VIRAL_FORMATS.map((f, i) => (
            <div
              key={f.name}
              className="reveal flex shrink-0 flex-col gap-2 rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl p-4 transition-all duration-300 hover:border-indigo-500/30 hover:bg-zinc-800/60 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 min-w-[160px]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="text-2xl">{f.emoji}</span>
              <span className="text-sm font-bold text-zinc-100">{f.name}</span>
              <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Viral Videos / Formats (ranked gradient cards) ──── */}
      <section className="flex flex-col gap-4">
        <div className="reveal flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <Play className="size-3.5 text-indigo-400" />
            {t('trending.videos')}
          </span>
          <span className="text-xs text-zinc-600">{t('trending.videosDesc')}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(liveMode ? liveResults : VIRAL_VIDEOS).map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVideo(v)}
              className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl p-0 text-left transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 50 + 100}ms` }}
            >
              {/* Gradient header */}
              <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${v.gradient || 'from-zinc-700 to-zinc-900'} overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.15),transparent_60%)]" />
                <span className="relative text-5xl transition-transform duration-300 group-hover:scale-110">{v.icon}</span>
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex size-14 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm ring-2 ring-white/30">
                    <Play className="size-6 fill-white text-white ml-1" />
                  </div>
                </div>
                {/* Rank pill */}
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
                  <span className="font-mono text-xs">#{i + 1}</span>
                </div>
                {v.views && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
                    <Zap className="size-3" />
                    {v.views}
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="flex flex-col gap-2 p-4">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-indigo-400">
                  {v.title}
                </span>
                {v.description && (
                  <p className="line-clamp-2 text-xs text-zinc-500 leading-relaxed">{v.description}</p>
                )}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-zinc-600">{v.channel}</span>
                  {v.niche && (
                    <span className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
                      {v.niche}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Niche Ideas (ranked horizontal cards) ─────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:col-span-8">
          <div className="reveal flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              <TrendingUp className="size-3.5 text-indigo-400" />
              {t('trending.ideasToday')}
            </span>
            <Button variant="outline" size="sm" onClick={() => setLot((l) => l + 1)} className="rounded-full border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60">
              <RefreshCw data-icon="inline-start" />
              {t('trending.newBatch')}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {NICHES.map((niche, n) => {
              const seed = seedFromString(niche.name + lot)
              const offset = seed % niche.ideas.length
              const rotated = [
                ...niche.ideas.slice(offset),
                ...niche.ideas.slice(0, offset)
              ].slice(0, 4)
              const viral = 58 + (seed % 40)
              return (
                <Card
                  key={niche.name}
                  className="reveal overflow-hidden border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
                  style={{ animationDelay: `${n * 50 + 100}ms` }}
                >
                  {/* Gradient header strip */}
                  <div className={`h-1.5 bg-gradient-to-r ${niche.color}`} />
                  <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${niche.color} shadow-lg`}>
                        {niche.emoji}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-zinc-100">{niche.name}</CardTitle>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {niche.tags.map((t) => (
                            <span key={t} className="font-mono text-[10px] text-zinc-600">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-400">
                        {viral}
                      </span>
                      <Progress value={viral} gradient className="h-1 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    <ol className="flex flex-col gap-1.5">
                      {rotated.map((idea, idx) => (
                        <li
                          key={idea}
                          className="flex items-start gap-2.5 rounded-xl px-2 py-1.5 text-sm leading-relaxed text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-zinc-300"
                        >
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-white/[0.05] font-mono text-[10px] font-bold text-zinc-600">
                            {idx + 1}
                          </span>
                          <span className="line-clamp-2">{idea}</span>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* ── Best Times Sidebar ──────────────────────── */}
        <section className="flex flex-col gap-4 lg:col-span-4">
          <span className="reveal flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            <Clock className="size-3.5 text-indigo-400" />
            {t('trending.bestTimes')}
          </span>
          <div className="grid grid-cols-1 gap-4">
            {BEST_TIMES.map((bt, i) => (
              <Card
                key={bt.platform}
                className="reveal overflow-hidden border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl rounded-2xl transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl hover:shadow-black/20"
                style={{ animationDelay: `${i * 60 + 150}ms` }}
              >
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                      <span className="text-lg">{bt.emoji}</span>
                      {bt.platform}
                    </span>
                    <span className="font-mono text-[10px] font-bold text-indigo-400">{bt.strength}/100</span>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br px-4 py-3 text-center text-lg font-bold text-white shadow-lg ${bt.color}`}>
                    {bt.window}
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500">{bt.secondary}</span>
                  <p className="text-xs leading-relaxed text-zinc-600">{bt.advice}</p>
                  <Progress value={bt.strength} gradient className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* ── Resources (gradient cards, no images) ──────── */}
      <section className="flex flex-col gap-4">
        <span className="reveal flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <ExternalLink className="size-3.5 text-indigo-400" />
          {t('trending.resources')}
        </span>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r, i) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 50 + 200}ms` }}
            >
              {/* Gradient header */}
              <div className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${r.gradient} overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.12),transparent_60%)]" />
                <span className="relative text-4xl">{r.icon}</span>
                <div className="absolute right-3 bottom-3 rounded-lg bg-black/50 backdrop-blur-sm px-2 py-0.5 font-mono text-[10px] font-bold text-white border border-white/10">
                  {r.duration}
                </div>
              </div>
              {/* Content */}
              <div className="flex flex-col gap-2 p-4">
                <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-indigo-400">
                  {r.title}
                </span>
                <span className="text-xs text-zinc-600">{r.channel}</span>
                <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">{r.desc}</p>
                <span className="flex items-center gap-1 pt-1 text-xs font-semibold text-indigo-400 transition-colors group-hover:text-indigo-300">
                  {t('trending.watch')}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Audio Trends Library ──────────────────────── */}
      <section className="reveal flex flex-col gap-4">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
          <Music className="size-3.5 text-indigo-400" />
          {t('trending.audioLibrary')}
        </span>
        <AudioTrendsLibrary />
      </section>

      {/* Video modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  )
}
