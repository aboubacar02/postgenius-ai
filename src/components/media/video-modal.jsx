import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

export function VideoModal({ video, onClose }) {
  const iframeRef = useRef(null)

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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Close button — top right */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
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

      {/* THE PLAYER — centered, fills available space */}
      <div className="relative flex w-full max-w-5xl flex-1 items-center justify-center px-4" onClick={(e) => e.stopPropagation()}>
        {hasVideo ? (
          <iframe
            ref={iframeRef}
            key={video.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full rounded-2xl border-0 bg-black"
            style={{ maxHeight: 'calc(100vh - 140px)', aspectRatio: '16/9' }}
          />
        ) : (
          <div className={`flex aspect-video w-full max-w-5xl items-center justify-center rounded-2xl bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'}`}>
            <span className="text-8xl">{video.icon || '🎬'}</span>
          </div>
        )}
      </div>

      {/* Meta bar below */}
      <div className="mt-3 flex items-center gap-3 px-4 pb-4 text-sm text-white/60">
        {video.channel && <span>{video.channel}</span>}
        {video.views && <><span className="text-white/30">·</span><span>{video.views}</span></>}
        {video.publishedAt && <><span className="text-white/30">·</span><span>{video.publishedAt}</span></>}
      </div>
    </div>
  )
}
