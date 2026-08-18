import { X } from 'lucide-react'
import { Button } from '../ui/button'

export function VideoModal({ video, onClose }) {
  if (!video) return null

  const hasVideo = !!video.youtubeId

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fade-in-up mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className="absolute top-3 right-3 z-10">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Video player or thumbnail */}
        {hasVideo ? (
          <div className="relative w-full bg-black">
            <iframe
              key={video.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="aspect-video w-full border-0"
            />
          </div>
        ) : (
          <div className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'}`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.15),transparent_60%)]" />
            <span className="relative text-7xl">{video.icon || '🎬'}</span>
          </div>
        )}

        {/* Info */}
        <div className="flex flex-col gap-2 p-4">
          <h3 className="text-base font-bold text-zinc-100">{video.title}</h3>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>{video.channel}</span>
            {video.views && <span>· {video.views}</span>}
            {video.publishedAt && <span>· {video.publishedAt}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
