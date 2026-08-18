import { X } from 'lucide-react'
import { Button } from '../ui/button'

export function VideoModal({ video, onClose }) {
  if (!video) return null

  const hasVideo = !!video.youtubeId

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="fade-in-up relative flex w-full max-w-4xl flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-full text-zinc-400 hover:text-white"
        >
          <X className="size-5" />
        </Button>

        {/* Player — always on top, always visible */}
        {hasVideo ? (
          <iframe
            key={video.youtubeId}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="aspect-video w-full rounded-2xl border-0 bg-black shadow-2xl shadow-black/60"
          />
        ) : (
          <div className={`flex aspect-video w-full items-center justify-center rounded-2xl bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'} shadow-2xl shadow-black/60`}>
            <span className="text-8xl">{video.icon || '🎬'}</span>
          </div>
        )}

        {/* Info bar below the player */}
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          <span className="font-bold text-zinc-100">{video.title}</span>
          <span className="text-zinc-600">·</span>
          <span>{video.channel}</span>
          {video.views && <><span className="text-zinc-600">·</span><span>{video.views}</span></>}
          {video.publishedAt && <><span className="text-zinc-600">·</span><span>{video.publishedAt}</span></>}
        </div>
      </div>
    </div>
  )
}
