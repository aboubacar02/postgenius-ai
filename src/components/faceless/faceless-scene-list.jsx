import { Download, FileText, Film, Image, Loader2, Pause, Play, RefreshCcw } from 'lucide-react'
import { cn } from '../../lib/utils'

export function FacelessSceneList({ script, activeIdx, playing, sceneCount, sceneDur, medias, downloading, jumpTo, togglePlay, regenerateScene, downloadSceneVideo }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
            <Film className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-pg-text">Scenes & B-Roll</h3>
            <p className="text-[11px] text-pg-subtle">{sceneCount} scenes &middot; {sceneDur}s chacune</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {script.scenes.map((s, idx) => {
          const active = activeIdx === idx
          const m = medias[idx]
          return (
            <div
              key={idx}
              onClick={() => jumpTo(idx)}
              className={cn(
                'group relative flex gap-3 rounded-xl border p-2.5 transition-all cursor-pointer',
                active
                  ? 'border-violet-500/30 bg-violet-500/[0.06]'
                  : 'border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04]'
              )}
            >
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg border border-white/[0.06]">
                {m?.videoUrl ? (
                  <video src={m.videoUrl} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                ) : m?.imageUrl ? (
                  <img src={m.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-white/[0.04]">
                    <Loader2 className="size-3.5 animate-spin text-pg-subtle" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); regenerateScene(idx) }}
                    className="flex items-center gap-1 rounded-md bg-white/20 px-2 py-1 text-[9px] font-bold text-white hover:bg-white/30"
                  >
                    <RefreshCcw className="size-2.5" /> Recharger
                  </button>
                </div>
                <span className="absolute left-1 top-1 rounded bg-black/70 px-1 py-0.5 font-mono text-[8px] font-bold text-white">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                {m?.videoUrl && (
                  <span className="absolute bottom-1 right-1 rounded bg-green-500/80 px-1 py-0.5 font-mono text-[7px] font-bold text-white">
                    MP4
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[10px] font-bold text-violet-400 uppercase">
                    Scene {idx + 1} {active && playing && <span className="text-green-400">&#9654;</span>}
                  </span>
                  <p className="text-xs font-medium text-pg-text line-clamp-1">{s.narration}</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-pg-subtle">
                  <span className="flex items-center gap-1"><Image className="size-3" />{s.imageKeyword || 'B-roll'}</span>
                  <span className="flex items-center gap-1"><FileText className="size-3" />{s.caption?.slice(0, 25)}...</span>
                </div>
              </div>

              {m?.videoUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); downloadSceneVideo(idx) }}
                  disabled={downloading === `scene-${idx}`}
                  className="self-center shrink-0 flex items-center gap-1 rounded-lg bg-white/[0.06] px-2 py-1.5 text-[9px] font-bold text-pg-muted hover:bg-white/[0.1] hover:text-pg-text transition-colors"
                >
                  {downloading === `scene-${idx}` ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
                  MP4
                </button>
              )}

              {active && (
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay() }}
                  className="self-center shrink-0 size-8 flex items-center justify-center rounded-full bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 transition-colors"
                >
                  {playing ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
