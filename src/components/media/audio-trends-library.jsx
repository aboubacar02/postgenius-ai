import { useEffect, useRef, useState } from 'react'
import { Download, ExternalLink, Loader2, Music, RefreshCw, Search, TrendingUp, X } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from '../ui/sonner'
import { cn } from '../../lib/utils'

const TRENDING_QUERIES = [
  'musique virale tendance',
  'chanson virale TikTok',
  'son tendance réels'
]

export function AudioTrendsLibrary() {
  const [downloadingId, setDownloadingId] = useState(null)
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [musicSearch, setMusicSearch] = useState('')
  const [musicSearching, setMusicSearching] = useState(false)
  const [ytResults, setYtResults] = useState([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    loadTrending()
    const interval = setInterval(loadTrending, 30 * 60 * 1000)
    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [])

  async function loadTrending() {
    setLoading(true)
    try {
      const q = TRENDING_QUERIES[Math.floor(Math.random() * TRENDING_QUERIES.length)]
      const res = await fetch(`/api/youtube/music?q=${encodeURIComponent(q)}&max=10`)
      const data = await res.json()
      if (!mountedRef.current) return
      if (Array.isArray(data.items) && data.items.length > 0) {
        setTracks(data.items)
      } else if (data.error) {
        setTracks([])
        toast.error(data.error)
      }
    } catch {
      if (mountedRef.current) {
        setTracks([])
        toast.error('Musiques tendance indisponibles')
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
        setLastUpdate(new Date())
      }
    }
  }

  async function refreshNow() {
    await loadTrending()
    if (mountedRef.current) toast.success('Musiques tendance actualisées !')
  }

  async function searchYouTubeMusic() {
    const q = musicSearch.trim()
    if (!q || musicSearching) return
    setMusicSearching(true)
    try {
      const res = await fetch(`/api/youtube/music?q=${encodeURIComponent(q)}&max=10`)
      const data = await res.json()
      if (data.items?.length > 0) {
        setYtResults(data.items)
        toast.success(`${data.items.length} musiques trouvées !`)
      } else {
        toast.error(data.error || 'Aucun résultat')
      }
    } catch {
      toast.error('Recherche indisponible')
    } finally {
      setMusicSearching(false)
    }
  }

  function openTrack(track) {
    window.open(`https://www.youtube.com/watch?v=${track.youtubeId || track.id}`, '_blank', 'noopener,noreferrer')
  }

  function downloadTrack(track) {
    setDownloadingId(track.youtubeId || track.id)
    window.open(`https://www.youtube.com/watch?v=${track.youtubeId || track.id}`, '_blank', 'noopener,noreferrer')
    toast.success('Ouverture sur YouTube (lecture & export disponibles là-bas)')
    setTimeout(() => setDownloadingId(null), 1200)
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Music className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-zinc-100 md:text-xl">
              Musiques Tendance du Moment
            </h2>
            <p className="text-xs text-zinc-500">
              {loading ? 'Chargement des tendances…' : `${tracks.length} titres réels depuis YouTube`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">
            Mis à jour {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Button size="sm" variant="outline" onClick={refreshNow} disabled={loading} className="gap-1.5 rounded-full border-white/[0.08] bg-white/[0.04] text-xs text-zinc-500 hover:text-zinc-200">
            <RefreshCw className={cn('size-3.5', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* YouTube Music Search */}
      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); searchYouTubeMusic() }}
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-600" />
          <input
            value={musicSearch}
            onChange={(e) => setMusicSearch(e.target.value)}
            placeholder="Chercher une musique sur YouTube..."
            className="h-10 w-full rounded-full border border-white/[0.06] bg-white/[0.03] pl-9 pr-4 text-xs text-zinc-300 placeholder:text-zinc-600 outline-none transition-all focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20"
          />
        </div>
        <Button type="submit" size="sm" disabled={!musicSearch.trim() || musicSearching} className="h-11 rounded-full bg-indigo-600/80 px-4 text-xs font-semibold text-white hover:bg-indigo-500">
          {musicSearching ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />}
          YouTube
        </Button>
        {ytResults.length > 0 && (
          <Button type="button" size="sm" variant="ghost" onClick={() => setYtResults([])} className="h-11 rounded-full text-zinc-500 hover:text-zinc-200">
            <X className="size-3.5" />
          </Button>
        )}
      </form>

      {/* YouTube Results */}
      {ytResults.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <Music className="size-3" />
            Résultats YouTube — {ytResults.length} pistes
          </span>
          {ytResults.map((v, i) => (
            <button
              key={v.youtubeId || i}
              type="button"
              onClick={() => openTrack(v)}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] p-2.5 text-left transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
            >
              {v.thumbnail && (
                <img src={v.thumbnail} alt={v.title} className="size-10 shrink-0 rounded-lg object-cover" loading="lazy" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-emerald-400">{v.title}</p>
                <p className="text-[10px] text-zinc-600 truncate">{v.channel} {v.views ? `· ${v.views}` : ''} {v.duration ? `· ${v.duration}` : ''}</p>
              </div>
              <ExternalLink className="size-3.5 text-zinc-600 group-hover:text-emerald-400 shrink-0" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {loading && tracks.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-10 text-xs text-zinc-600">
            <Loader2 className="size-4 animate-spin" />
            Recherche des titres tendance…
          </div>
        )}
        {!loading && tracks.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-10 text-xs text-zinc-600">
            <Music className="size-5" />
            Aucun titre disponible pour l'instant. Réessaie ou cherche directement sur YouTube.
          </div>
        )}
        {tracks.map((track, i) => {
          const tid = track.youtubeId || track.id
          return (
            <div
              key={tid}
              className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              <span className="flex w-8 shrink-0 items-center justify-center font-mono text-sm font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-md transition-transform duration-200 group-hover:scale-105">
                {track.thumbnail ? (
                  <img src={track.thumbnail} alt={track.title} className="size-full object-cover" loading="lazy" />
                ) : (
                  <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    <Music className="size-5" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{track.title}</p>
                <p className="text-xs text-zinc-500 truncate">{track.channel}</p>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                {track.duration && (
                  <span className="font-mono text-[11px] font-bold text-zinc-500">{track.duration}</span>
                )}
                <span className="text-[11px] text-zinc-700">{track.views || 'YouTube'}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <TrendingUp className="size-3.5 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {typeof track.views === 'number' ? track.views : 'Tendance'}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="sm"
                  onClick={() => openTrack(track)}
                  className="gap-1.5 rounded-xl bg-indigo-600 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500"
                >
                  <ExternalLink className="size-3.5" />
                  Écouter
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadTrack(track)}
                  disabled={downloadingId === tid}
                  className="gap-1 rounded-xl text-xs text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06]"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}