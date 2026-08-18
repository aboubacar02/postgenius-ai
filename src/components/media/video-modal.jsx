import { X } from 'lucide-react'
import { Button } from '../ui/button'

export function VideoModal({ video, onClose }) {
  if (!video) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="fade-in-up w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-900 shadow-2xl shadow-black/50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient header */}
        <div className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${video.gradient || 'from-zinc-700 to-zinc-900'} overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.15),transparent_60%)]" />
          <span className="relative text-7xl">{video.icon || '🎬'}</span>
          {video.views && (
            <div className="absolute top-4 right-4 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-white border border-white/10">
              {video.views}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-lg font-bold text-zinc-100">{video.title}</span>
              <span className="text-xs text-zinc-500">
                {video.channel}
                {video.niche && <> · {video.niche}</>}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="shrink-0 rounded-xl text-zinc-500 hover:text-zinc-200"
            >
              <X className="size-4" />
            </Button>
          </div>

          {video.description && (
            <p className="text-sm leading-relaxed text-zinc-400">{video.description}</p>
          )}

          {video.youtubeId ? (
            <iframe
              key={video.id}
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="mt-2 aspect-video w-full rounded-xl border-0 bg-black"
            />
          ) : (
            <div className="mt-2 flex aspect-video items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 text-sm">
              Pas de vidéo disponible
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
