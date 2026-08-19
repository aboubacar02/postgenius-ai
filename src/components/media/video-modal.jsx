import { useEffect, useRef, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

export function VideoModal({ video, onClose }) {
  const iframeRef = useRef(null)
  const [ytError, setYtError] = useState(false)

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

  const hasVideo = !!video.youtubeId
  const ytUrl = hasVideo ? `https://www.youtube.com/watch?v=${video.youtubeId}` : null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6"
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
      <div className="mb-4 flex items-center gap-3 px-4 text-center max-w-2xl">
        <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">{video.title}</h2>
        {ytUrl && (
          <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-white/50 hover:text-white">
            <ExternalLink className="size-4" />
          </a>
        )}
      </div>

      {/* THE PLAYER — robust aspect-video container */}
      <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        {hasVideo && !ytError ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl border border-white/10">
            <iframe
              ref={iframeRef}
              key={video.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setYtError(true)}
              className="absolute inset-0 size-full border-0 bg-black"
            />
          </div>
        ) : ytError ? (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-800 text-center p-6">
            <span className="text-5xl">⚠️</span>
            <p className="text-white/70">Impossible de charger la vidéo YouTube.</p>
            {ytUrl && (
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="mt-2 text-sm text-blue-400 hover:underline">
                Ouvrir sur YouTube ↗
              </a>
            )}
          </div>
        ) : (
          <div className={`flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'}`}>
            <span className="text-8xl">{video.icon || '🎬'}</span>
          </div>
        )}
      </div>

      {/* Meta bar below */}
      <div className="mt-4 flex items-center gap-3 px-4 pb-2 text-xs sm:text-sm text-white/60 flex-wrap justify-center">
        {video.channel && <span className="font-semibold text-white/80">{video.channel}</span>}
        {video.views && <><span className="text-white/30">·</span><span>{video.views}</span></>}
        {video.publishedAt && <><span className="text-white/30">·</span><span>{video.publishedAt}</span></>}
      </div>
    </div>
  )
}
