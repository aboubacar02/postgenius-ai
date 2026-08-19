import { useEffect, useState } from 'react'
import { ArrowRight, Clock, ExternalLink, Flame, Info, Loader2, Music, Play, RefreshCw, Search, Sparkles, TrendingUp, Video, X, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Progress } from '../components/ui/progress'
import { AudioTrendsLibrary } from '../components/media/audio-trends-library'
import { VideoModal } from '../components/media/video-modal'
import { RequireAuth } from '../components/auth/require-auth'
import { useI18n } from '../lib/i18n'
import { NICHES } from '../lib/niches'
import { searchYoutube } from '../services/youtube'
import { BEST_TIMES, VIRAL_FORMATS, RESOURCES, seedFromString } from '../lib/trends-data'

const SEARCH_CONTEXT = [
  { keywords: ['tiktok', 'tik tok'], enriched: 'TikTok viral content creation tips' },
  { keywords: ['youtube', 'yt'], enriched: 'YouTube channel growth strategy viral videos' },
  { keywords: ['reels', 'instagram', 'ig'], enriched: 'Instagram Reels viral content creation tips' },
  { keywords: ['shorts', 'short'], enriched: 'YouTube Shorts viral growth strategy' },
  { keywords: ['capcut', 'montage', 'editing'], enriched: 'CapCut video editing tutorial advanced effects' },
  { keywords: ['hook', 'accroche'], enriched: 'viral hook techniques first 3 seconds retention' },
  { keywords: ['monetisation', 'money', 'revenu', 'argent'], enriched: 'content creator monetization strategy revenue' },
  { keywords: ['faceless', 'sans visage', 'anon'], enriched: 'faceless YouTube channel viral strategy no face' },
  { keywords: ['podcast', 'audio'], enriched: 'podcast viral clips repurposing strategy' },
  { keywords: ['musique', 'music', 'son'], enriched: 'viral trending music audio for content creation' },
  { keywords: ['tendance', 'trend', 'trending'], enriched: 'social media trends viral content analysis' },
  { keywords: ['script', 'écriture', 'writing'], enriched: 'viral video script writing storytelling technique' },
  { keywords: ['thumbnail', 'miniature'], enriched: 'YouTube thumbnail design click-through rate optimization' },
  { keywords: ['ia', 'artificial intelligence'], enriched: 'AI tools for content creation video generation' },
]

function enrichQuery(raw) {
  const lower = raw.toLowerCase().trim()
  for (const ctx of SEARCH_CONTEXT) {
    if (ctx.keywords.some((k) => lower.includes(k))) {
      return ctx.enriched
    }
  }
  return `${raw} content creation viral tips`
}

export default function TendancesPage() {
  const { t, lang } = useI18n()
  const [lot, setLot] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [liveMode, setLiveMode] = useState(false)
  const [liveResults, setLiveResults] = useState([])
  const [searchNotice, setSearchNotice] = useState('')

  async function runSearch() {
    const raw = searchQuery.trim()
    if (!raw || searching) return
    setSearching(true)
    setSearchNotice('')
    try {
      const enriched = enrichQuery(raw)
      const data = await searchYoutube(enriched, 12, lang)
      if (data.live && data.items.length > 0) {
        setLiveResults(data.items)
        setLiveMode(true)
      } else if (data.live) {
        setSearchNotice('Aucun résultat pour cette recherche. Essaie avec d\'autres mots-clés.')
      } else {
        setSearchNotice(data.error || 'Recherche indisponible. Vérifie la configuration API.')
      }
    } catch (err) {
      setSearchNotice('Erreur de connexion. Réessaie plus tard.')
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
    const onKey = (e) => { if (e.key === 'Escape') setActiveVideo(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeVideo])

  return (
    <RequireAuth>
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
        <h1 className="text-2xl font-black tracking-tight text-pg-text sm:text-3xl">
          <span className="text-gradient">{t('trending.title')}</span>
        </h1>
        <p className="max-w-xl text-[15px] leading-relaxed text-pg-muted">
          {t('trending.subtitle')}
        </p>
      </div>

      {/* ── Search bar ──────────────────────────────── */}
      <form
        className="reveal-1 flex gap-2"
        onSubmit={(e) => { e.preventDefault(); runSearch() }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des tutoriels, tendances, astuces virales..."
            className="h-12 w-full rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl pl-11 pr-4 text-sm text-zinc-200 placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white/[0.08] focus:shadow-lg focus:shadow-indigo-500/5"
          />
        </div>
        <Button type="submit" size="default" disabled={!searchQuery.trim() || searching} className="h-12 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-6 font-semibold text-white hover:opacity-90 shadow-lg shadow-indigo-500/20 transition-all">
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          <span className="hidden sm:inline">Rechercher</span>
        </Button>
        {liveMode && (
          <Button type="button" variant="outline" size="icon" onClick={resetSearch} aria-label="Effacer" className="h-12 w-12 rounded-full border-white/[0.08] bg-white/[0.04]">
            <X className="size-4" />
          </Button>
        )}
      </form>

      {/* Quick search chips */}
      {!liveMode && (
        <div className="reveal-2 flex flex-wrap gap-2">
          {['TikTok viral', 'CapCut montage', 'YouTube growth', 'Hook accroche', 'Faceless AI'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => { setSearchQuery(chip); }}
              className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-zinc-400 transition-all hover:border-indigo-500/30 hover:text-indigo-300 hover:bg-indigo-500/10"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {searchNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-400">
          <Info className="size-4 shrink-0" />
          {searchNotice}
        </div>
      )}

      {/* ── RESOURCES & TUTORIALS (Placed right below search bar, ready to watch) ──── */}
      {!liveMode && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <ExternalLink className="size-3.5" />
              Ressources & Formations Recommandées (Cliquez pour visionner)
            </span>
            <span className="font-mono text-xs text-zinc-500">Prêt à l'emploi</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r, i) => (
              <button
                key={r.title}
                type="button"
                onClick={() => setActiveVideo(r)}
                className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-0 text-left transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${r.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.15),transparent_60%)]" />
                  <span className="relative text-5xl transition-transform duration-300 group-hover:scale-110">{r.icon}</span>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex size-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
                      <Play className="size-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute right-3 bottom-3 rounded-lg bg-black/60 backdrop-blur-sm px-2.5 py-1 font-mono text-[11px] font-bold text-white border border-white/10">
                    {r.duration}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-indigo-400">
                    {r.title}
                  </span>
                  <span className="text-xs font-medium text-zinc-400">{r.channel}</span>
                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-500">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── SEARCH RESULTS (only when searching) ──── */}
      {liveMode && liveResults.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="reveal flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
              <Video className="size-3.5 text-emerald-400" />
              {liveResults.length} résultats en direct pour « {searchQuery} »
            </span>
            <Button size="sm" variant="ghost" onClick={resetSearch} className="gap-1 min-h-[40px] text-[11px] text-zinc-400 hover:text-white">
              <X className="size-3" /> Effacer la recherche
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveResults.map((v, i) => (
              <button
                key={v.youtubeId || i}
                type="button"
                onClick={() => setActiveVideo(v)}
                className="reveal group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-0 text-left transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                style={{ animationDelay: `${i * 50 + 100}ms` }}
              >
                <div className="relative h-44 overflow-hidden bg-zinc-900">
                  {v.thumbnail ? (
                    <img src={v.thumbnail} alt={v.title} className="size-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-900">
                      <Play className="size-10 text-zinc-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="flex size-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/30">
                      <Play className="size-6 fill-white text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-white">
                    <span className="font-mono text-xs">#{i + 1}</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {v.views && (
                      <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <Zap className="size-3" />
                        {v.views}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 p-4">
                  <span className="line-clamp-2 text-sm font-bold leading-snug text-zinc-100 transition-colors group-hover:text-indigo-400">
                    {v.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium">{v.channel}</span>
                    {v.publishedAt && <><span>·</span><span>{v.publishedAt}</span></>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── REDESIGNED TODAY'S VIRAL IDEAS & NICHES ──── */}
      <section className="flex flex-col gap-6">
        <div className="reveal flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <TrendingUp className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              {t('trending.ideasToday')}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setLot((l) => l + 1)} className="rounded-full border-white/[0.08] bg-white/[0.04] backdrop-blur-xl font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-all">
            <RefreshCw data-icon="inline-start" />
            {t('trending.newBatch')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {NICHES.map((niche, n) => {
            const seed = seedFromString(niche.name + lot)
            const offset = seed % niche.ideas.length
            const rotated = [...niche.ideas.slice(offset), ...niche.ideas.slice(0, offset)].slice(0, 4)
            const viral = 78 + (seed % 22)
            return (
              <div
                key={niche.name}
                className="reveal group relative overflow-hidden rounded-3xl border border-white/[0.09] bg-white/[0.04] backdrop-blur-2xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                style={{ animationDelay: `${n * 60 + 100}ms` }}
              >
                {/* Glowing corner orb */}
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl transition-all group-hover:bg-indigo-500/20" />

                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl ${niche.color} shadow-lg shadow-black/40`}>
                      {niche.emoji}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">{niche.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {niche.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-0.5 font-mono text-[10px] text-zinc-400">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="rounded-full border border-indigo-500/30 bg-indigo-500/20 px-3 py-1 font-mono text-xs font-black text-indigo-300 shadow-sm">
                      {viral}% 🔥
                    </span>
                    <Progress value={viral} gradient className="h-1.5 w-20" />
                  </div>
                </div>

                <div className="space-y-2">
                  {rotated.map((idea, idx) => (
                    <div
                      key={idea}
                      className="flex items-start gap-3 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3 text-sm leading-relaxed text-zinc-300 transition-all hover:bg-white/[0.06] hover:border-white/[0.08]"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 font-mono text-xs font-bold text-indigo-400 ring-1 ring-indigo-500/20">
                        {idx + 1}
                      </span>
                      <span className="line-clamp-2">{idea}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Viral Formats ──── */}
      <section className="flex flex-col gap-4">
        <span className="reveal flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Sparkles className="size-3.5 text-indigo-400" />
          {t('trending.viralFormats')}
        </span>
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
          {VIRAL_FORMATS.map((f, i) => (
            <div
              key={f.name}
              className="reveal flex shrink-0 flex-col gap-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-xl p-5 transition-all duration-300 hover:border-indigo-500/40 hover:bg-white/[0.08] hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 min-w-[200px]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-sm font-bold text-zinc-100">{f.name}</span>
              <p className="text-xs leading-relaxed text-zinc-400 line-clamp-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Best Times & Audio Library ─────── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="flex flex-col gap-4 lg:col-span-5">
          <span className="reveal flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Clock className="size-3.5 text-indigo-400" />
            {t('trending.bestTimes')}
          </span>
          <div className="grid grid-cols-1 gap-4">
            {BEST_TIMES.map((bt, i) => (
              <Card
                key={bt.platform}
                className="reveal overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl rounded-2xl transition-all duration-300 hover:border-white/[0.15] hover:shadow-2xl hover:shadow-black/30"
                style={{ animationDelay: `${i * 60 + 150}ms` }}
              >
                <CardContent className="flex flex-col gap-3 p-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-bold text-zinc-100">
                      <span className="text-xl">{bt.emoji}</span>
                      {bt.platform}
                    </span>
                    <span className="font-mono text-xs font-bold text-indigo-400">{bt.strength}/100</span>
                  </div>
                  <div className={`rounded-2xl bg-gradient-to-br px-4 py-3.5 text-center text-lg font-black text-white shadow-lg ${bt.color}`}>
                    {bt.window}
                  </div>
                  <span className="text-xs font-medium text-zinc-400">{bt.secondary}</span>
                  <p className="text-xs leading-relaxed text-zinc-500">{bt.advice}</p>
                  <Progress value={bt.strength} gradient className="h-1.5" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="reveal flex flex-col gap-4 lg:col-span-7">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Music className="size-3.5 text-indigo-400" />
            {t('trending.audioLibrary')}
          </span>
          <AudioTrendsLibrary />
        </section>
      </div>

      {/* Video modal */}
      {activeVideo && <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
    </RequireAuth>
  )
}
