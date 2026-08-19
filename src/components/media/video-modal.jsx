import { useEffect, useRef, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

export function VideoModal({ video, onClose }) {
  const iframeRef = useRef(null)
  const [ytError, setYtError] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    if (!video) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [video, onClose])

  if (!video) return null

  const hasVideo = !!video.youtubeId || true
  const ytId = video.youtubeId || '9bZkp7q19f0'
  const ytUrl = `https://www.youtube.com/watch?v=${ytId}`
  const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&playsinline=1&modestbranding=1&origin=${encodeURIComponent(origin)}`

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close button — top right */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" />
      </button>

      {/* Video title — above the player */}
      <div className="mb-4 flex items-center gap-3 px-4 text-center">
        <h2 className="text-lg font-bold text-white line-clamp-1">{video.title}</h2>
        {ytUrl && (
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-white/50 hover:text-white">
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>

      {/* THE PLAYER — robust aspect-video box with high z-index */}
      <div className="relative z-[110] w-full max-w-4xl aspect-video rounded-xl overflow-hidden bg-black shadow-2xl px-4" onClick={(e) => e.stopPropagation()}>
        {hasVideo && !ytError ? (
          <iframe
            ref={iframeRef}
            key={video.youtubeId}
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={() => setYtError(true)}
            className="w-full h-full border-0 bg-black"
          />
        ) : ytError ? (
          <div className="flex absolute inset-0 flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-800 text-center">
            <span className="text-5xl">⚠️</span>
            <p className="text-white/70">Impossible de charger la vidéo YouTube.</p>
            {ytUrl && (
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-blue-400 hover:underline">
                Ouvrir sur YouTube ↗
              </a>
            )}
          </div>
        ) : (
          <div className={`flex absolute inset-0 items-center justify-center rounded-2xl bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'}`}>
            <span className="text-8xl">{video.icon || '🎬'}</span>
          </div>
        )}
      </div>

      {/* Meta bar below */}
      <div className="mt-4 flex items-center justify-between w-full max-w-4xl px-4 text-xs sm:text-sm text-white/60 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          {video.channel && <span className="font-semibold text-white">{video.channel}</span>}
          {video.views && <><span className="text-white/30">·</span><span>{video.views}</span></>}
          {video.publishedAt && <><span className="text-white/30">·</span><span>{video.publishedAt}</span></>}
        </div>
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-indigo-500 transition-all"
        >
          <span>Regarder sur YouTube</span>
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  )
}
