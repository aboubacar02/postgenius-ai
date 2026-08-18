import { Loader2, Pause, Play } from 'lucide-react'

export function FacelessPlayer({ activeIdx, sceneCount, sceneDur, activeMedia, hasVideo, scene, elapsed, audioDuration, playing, togglePlay, jumpTo, formatTime }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md shadow-2xl">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
        {activeMedia?.videoUrl ? (
          <video key={activeIdx} src={activeMedia.videoUrl} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline autoPlay preload="metadata" />
        ) : activeMedia?.imageUrl ? (
          <img src={activeMedia.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-6 animate-spin text-pg-subtle" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
            {String(activeIdx + 1).padStart(2, '0')}/{sceneCount}
          </span>
          <span className="rounded-full bg-violet-600/80 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
            {sceneDur}s
          </span>
        </div>

        {hasVideo && (
          <div className="absolute top-3 right-3 z-10">
            <span className="flex items-center gap-1 rounded-full bg-green-500/80 px-2 py-0.5 font-mono text-[9px] font-bold text-white backdrop-blur-sm">
              <div className="size-1.5 rounded-full bg-green-300 animate-pulse" /> MP4
            </span>
          </div>
        )}

        <div className="absolute bottom-16 left-0 right-0 z-10 px-4 text-center">
          <p className="text-sm font-bold text-white drop-shadow-lg leading-tight">{scene?.caption}</p>
        </div>

        <div className="absolute bottom-10 left-3 right-3 z-10">
          <div className="flex items-center gap-2 text-[9px] font-mono text-white/70">
            <span>{formatTime(elapsed)}</span>
            <div className="relative flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-violet-500 rounded-full transition-all" style={{ width: `${audioDuration ? (elapsed / audioDuration) * 100 : 0}%` }} />
            </div>
            <span>{formatTime(audioDuration || parseFloat(sceneDur))}</span>
          </div>
        </div>

        <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-4">
          <button onClick={() => jumpTo(Math.max(0, activeIdx - 1))} disabled={activeIdx === 0} className="text-white/60 hover:text-white disabled:opacity-30 text-xs transition-colors">
            &#9198;
          </button>
          <button onClick={togglePlay} className="flex size-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform">
            {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 ml-0.5" />}
          </button>
          <button onClick={() => jumpTo(Math.min(sceneCount - 1, activeIdx + 1))} disabled={activeIdx >= sceneCount - 1} className="text-white/60 hover:text-white disabled:opacity-30 text-xs transition-colors">
            &#9197;
          </button>
        </div>
      </div>
    </div>
  )
}
