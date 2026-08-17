import { useState } from 'react'
import {
  Clapperboard,
  Flame,
  Layers,
  Mic,
  Music,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Wand2,
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

const BGM_TRACKS = [
  { id: 'synthwave', name: 'Dark Synthwave Drive', bpm: '124 BPM' },
  { id: 'lofi', name: 'Lofi Chill Study', bpm: '85 BPM' },
  { id: 'cinematic', name: 'Cinematic Tension Drop', bpm: '110 BPM' },
  { id: 'none', name: 'Sans Musique de Fond', bpm: '—' }
]

export function MultiTrackTimeline({
  scenes = [],
  activeSceneIdx = 0,
  onSelectScene,
  playing,
  onTogglePlay,
  elapsed = 0,
  totalDuration = 30,
  brolls = {},
  onRegenerateBroll
}) {
  const [bgmTrack, setBgmTrack] = useState('synthwave')
  const [bgmVolume, setBgmVolume] = useState(25) // 0 - 100
  const [sfxEnabled, setSfxEnabled] = useState(true)

  const progressPct = totalDuration > 0 ? Math.min(100, (elapsed / totalDuration) * 100) : 0

  return (
    <div className="border border-white/[0.06] bg-pg-surface rounded-xl p-5 flex flex-col gap-4">
      {/* Timeline Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Layers className="size-4" />
          </span>
          <div>
            <h3 className="font-heading text-sm font-bold text-pg-text">
              Timeline Multipiste Studio
            </h3>
            <p className="text-[11px] text-pg-muted">
              Voix-off, B-roll vidéo, musique de fond et mixage sonore
            </p>
          </div>
        </div>

        {/* BGM & Audio Controls */}
        <div className="flex items-center gap-3">
          {/* Track selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs">
            <Music className="size-3.5 text-primary" />
            <select
              value={bgmTrack}
              onChange={(e) => setBgmTrack(e.target.value)}
              className="bg-transparent font-mono text-xs font-semibold text-pg-text outline-none cursor-pointer"
            >
              {BGM_TRACKS.map((t) => (
                <option key={t.id} value={t.id} className="bg-pg-surface text-pg-text">
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Volume slider */}
          {bgmTrack !== 'none' && (
            <div className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-xs font-mono">
              <Volume2 className="size-3.5 text-pg-muted" />
              <input
                type="range"
                min="0"
                max="100"
                value={bgmVolume}
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                className="w-16 accent-primary"
              />
              <span className="w-7 text-[10px] text-primary">{bgmVolume}%</span>
            </div>
          )}

          {/* SFX Toggle */}
          <button
            type="button"
            onClick={() => setSfxEnabled((s) => !s)}
            className={cn(
              'rounded-xl border px-2.5 py-1 text-xs font-mono transition-all',
              sfxEnabled
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-white/[0.06] bg-white/[0.04] text-pg-muted'
            )}
          >
            SFX {sfxEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Tracks Container */}
      <div className="relative flex flex-col gap-2 overflow-x-auto pb-2 timeline-track-grid">
        {/* Scrubber Playhead Line */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 z-20 w-[2px] bg-cyan-400 scrubber-head transition-all duration-100"
          style={{ left: `${progressPct}%` }}
        >
          <div className="size-3 -translate-x-[5px] -translate-y-1 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
        </div>

        {/* TRACK 1: B-Roll Video Scenes */}
        <div className="flex items-center gap-3">
          <span className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold text-pg-muted uppercase">
            <Clapperboard className="size-3.5 text-cyan-400" /> B-Roll
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {scenes.map((s, idx) => {
              const active = activeSceneIdx === idx
              const brollUrl = brolls[idx]
              return (
                <div
                  key={idx}
                  onClick={() => onSelectScene(idx)}
                  className={cn(
                    'group relative flex h-14 cursor-pointer items-center justify-between overflow-hidden rounded-xl border p-2 transition-all',
                    active
                      ? 'border-cyan-500/30 bg-cyan-500/10'
                      : 'border-white/[0.06] bg-white/[0.04] hover:border-white/[0.06]'
                  )}
                >
                  {brollUrl && (
                    <img
                      src={brollUrl}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                    />
                  )}
                  <div className="relative z-10 flex flex-col">
                    <span className="font-mono text-[10px] font-bold text-cyan-400">
                      Scène {idx + 1}
                    </span>
                    <span className="text-[11px] font-semibold text-white line-clamp-1">
                      {s.imageKeyword || 'Cinematic visual'}
                    </span>
                  </div>

                  <span className="relative z-10 rounded bg-black/50 px-1.5 py-0.5 font-mono text-[9px] text-white/80 backdrop-blur-sm">
                    {Math.round(totalDuration / Math.max(1, scenes.length))}s
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* TRACK 2: Voiceover Narration */}
        <div className="flex items-center gap-3">
          <span className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold text-pg-muted uppercase">
            <Mic className="size-3.5 text-primary" /> Voix-off
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {scenes.map((s, idx) => {
              const active = activeSceneIdx === idx
              return (
                <div
                  key={idx}
                  onClick={() => onSelectScene(idx)}
                  className={cn(
                    'flex h-10 cursor-pointer items-center justify-between rounded-xl border px-3 transition-all',
                    active
                      ? 'border-primary/30 bg-primary/5 text-primary'
                      : 'border-white/[0.06] bg-white/[0.04] text-pg-muted hover:bg-white/[0.04]'
                  )}
                >
                  {/* Mini waveform bars */}
                  <div className="flex items-end gap-[2px] h-4">
                    {[6, 12, 8, 14, 10, 16, 7, 13].map((h, i) => (
                      <span
                        key={i}
                        className={cn(
                          'w-[2px] rounded-full transition-all',
                          active ? 'bg-primary animate-pulse' : 'bg-white/20'
                        )}
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-pg-text truncate max-w-[130px]">
                    « {s.narration?.slice(0, 24)}... »
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* TRACK 3: Background Music */}
        <div className="flex items-center gap-3">
          <span className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold text-pg-muted uppercase">
            <Music className="size-3.5 text-amber-400" /> Musique
          </span>
          <div className="flex-1 h-7 rounded-xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-between px-3">
            <span className="text-[11px] font-mono font-semibold text-amber-400">
              🎵 {BGM_TRACKS.find((t) => t.id === bgmTrack)?.name}
            </span>
            <span className="font-mono text-[10px] text-amber-400/50">
              Audio Ducking Auto (-40% lors de la voix)
            </span>
          </div>
        </div>

        {/* TRACK 4: Sound FX */}
        <div className="flex items-center gap-3">
          <span className="flex w-24 shrink-0 items-center gap-1.5 font-mono text-[11px] font-bold text-pg-muted uppercase">
            <Zap className="size-3.5 text-rose-400" /> Effets SFX
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {['💥 Whoosh Transition', '✨ Hook Bell Pop', '⚡ Impact Drop'].map((cue, i) => (
              <div
                key={i}
                className="h-6 rounded-lg border border-rose-500/20 bg-rose-500/10 flex items-center px-2 text-[10px] font-mono font-bold text-rose-400"
              >
                {cue}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
