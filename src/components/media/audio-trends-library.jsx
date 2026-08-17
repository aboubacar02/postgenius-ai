import { useEffect, useRef, useState } from 'react'
import { Check, Download, Flame, Music, Pause, Play, Sparkles, Volume2, Waves } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from '../ui/sonner'
import { cn } from '../../lib/utils'

const VIRAL_AUDIO_TRACKS = [
  {
    id: 'synthwave',
    title: 'Dark Synthwave Drive (Retrowave)',
    genre: 'Cyberpunk & Tech',
    bpm: '124 BPM',
    duration: '0:32',
    tags: ['#tech', '#cyberpunk', '#velocity'],
    frequency: 220,
    type: 'sawtooth'
  },
  {
    id: 'lofi',
    title: 'Lofi Chill Sunset & Coffee',
    genre: 'Storytime & Lifestyle',
    bpm: '85 BPM',
    duration: '0:30',
    tags: ['#lifestyle', '#chill', '#storytime'],
    frequency: 180,
    type: 'sine'
  },
  {
    id: 'phonk',
    title: 'Phonk Velocity Drift',
    genre: 'Motivation & Gym Fitness',
    bpm: '132 BPM',
    duration: '0:28',
    tags: ['#fitness', '#motivation', '#phonk'],
    frequency: 140,
    type: 'square'
  },
  {
    id: 'cinematic',
    title: 'Cinematic Tension & Bass Drop',
    genre: 'Business & Cliffhanger',
    bpm: '110 BPM',
    duration: '0:35',
    tags: ['#business', '#mindset', '#suspense'],
    frequency: 110,
    type: 'triangle'
  },
  {
    id: 'upbeat',
    title: 'Upbeat Future Bass Pop',
    genre: 'Tutoriel & How-To',
    bpm: '120 BPM',
    duration: '0:30',
    tags: ['#tutoriel', '#astuce', '#positive'],
    frequency: 260,
    type: 'sine'
  }
]

export function AudioTrendsLibrary() {
  const [activeTrackId, setActiveTrackId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)

  function stopAudio() {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
        oscillatorRef.current.disconnect()
      } catch {}
      oscillatorRef.current = null
    }
    setIsPlaying(false)
    setActiveTrackId(null)
  }

  function playTrack(track) {
    if (activeTrackId === track.id && isPlaying) {
      stopAudio()
      return
    }

    stopAudio()

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Synth audio preview
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = track.type || 'sine'
      osc.frequency.setValueAtTime(track.frequency || 220, ctx.currentTime)

      // Frequency modulation for rhythm
      const lfo = ctx.createOscillator()
      lfo.frequency.setValueAtTime(4, ctx.currentTime)
      const lfoGain = ctx.createGain()
      lfoGain.gain.setValueAtTime(20, ctx.currentTime)
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      lfo.start()

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 30)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      oscillatorRef.current = osc
      gainNodeRef.current = gain

      setActiveTrackId(track.id)
      setIsPlaying(true)

      // Auto stop after 30s
      setTimeout(() => {
        if (activeTrackId === track.id) stopAudio()
      }, 30000)
    } catch (e) {
      toast.error('Aperçu audio non supporté sur ce navigateur.')
    }
  }

  useEffect(() => {
    return () => stopAudio()
  }, [])

  // Create downloadable audio WAV blob
  function downloadTrack(track) {
    setDownloadingId(track.id)
    try {
      const sampleRate = 44100
      const durationSec = 30
      const numChannels = 2
      const numSamples = sampleRate * durationSec
      const buffer = new ArrayBuffer(44 + numSamples * numChannels * 2)
      const view = new DataView(buffer)

      // RIFF header
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i))
        }
      }
      writeString(0, 'RIFF')
      view.setUint32(4, 36 + numSamples * numChannels * 2, true)
      writeString(8, 'WAVE')
      writeString(12, 'fmt ')
      view.setUint32(16, 16, true)
      view.setUint16(20, 1, true)
      view.setUint16(22, numChannels, true)
      view.setUint32(24, sampleRate, true)
      view.setUint32(28, sampleRate * numChannels * 2, true)
      view.setUint16(32, numChannels * 2, true)
      view.setUint16(34, 16, true)
      writeString(36, 'data')
      view.setUint32(40, numSamples * numChannels * 2, true)

      // Fill PCM audio samples
      let offset = 44
      const freq = track.frequency || 220
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate
        const sample = Math.sin(2 * Math.PI * freq * t) * 0.4 * Math.sin(2 * Math.PI * 4 * t)
        const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff
        view.setInt16(offset, intSample, true)
        view.setInt16(offset + 2, intSample, true)
        offset += 4
      }

      const blob = new Blob([buffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `postgenius-${track.id}-audio-viral.wav`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`🎵 Piste « ${track.title} » téléchargée avec succès !`)
    } catch (e) {
      toast.error('Erreur lors du téléchargement de la piste.')
    } finally {
      setTimeout(() => setDownloadingId(null), 1200)
    }
  }

  return (
    <div className="glow-card glass premium-edge rounded-3xl p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-fuchsia-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]">
            <Music className="size-4.5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground md:text-xl">
              Bibliothèque de Sons & Musiques Tendance
            </h2>
            <p className="text-xs text-muted-foreground">
              Morceaux libres de droits optimisés pour booster l'énergie et la rétention
            </p>
          </div>
        </div>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary">
          Licence 100% Libre / CapCut Ready
        </span>
      </div>

      {/* Audio Tracks List */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {VIRAL_AUDIO_TRACKS.map((t) => {
          const active = activeTrackId === t.id && isPlaying
          return (
            <div
              key={t.id}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-300',
                active
                  ? 'border-primary bg-primary/15 shadow-[0_0_25px_rgba(139,92,246,0.35)] ring-1 ring-primary'
                  : 'border-white/10 bg-card-60 hover:border-white/20 hover:bg-card/80'
              )}
            >
              {/* Top Track Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                    {t.title}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {t.genre} • {t.bpm}
                  </span>
                </div>

                <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/80">
                  {t.duration}
                </span>
              </div>

              {/* Middle Wave Visualizer */}
              <div className="my-3 flex items-center justify-between h-8 rounded-xl bg-black/40 px-3 border border-white/5">
                <div className="flex items-end gap-1 h-5 w-full">
                  {[4, 10, 16, 8, 14, 20, 12, 18, 9, 15, 7, 19, 13, 8, 16, 11].map((h, i) => (
                    <span
                      key={i}
                      className={cn(
                        'flex-1 rounded-full transition-all duration-150',
                        active ? 'bg-primary animate-pulse' : 'bg-white/20'
                      )}
                      style={{
                        height: active ? `${Math.max(4, (h * (i % 2 === 0 ? 1.2 : 0.8))) }px` : `${h}px`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                <Button
                  size="sm"
                  variant={active ? 'default' : 'outline'}
                  onClick={() => playTrack(t)}
                  className={cn(
                    'gap-1.5 rounded-xl text-xs font-bold transition-all',
                    active
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]'
                      : 'border-white/10 hover:bg-white/10'
                  )}
                >
                  {active ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                  <span>{active ? 'Pause' : 'Écouter'}</span>
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadTrack(t)}
                  className="gap-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground hover:bg-white/10"
                >
                  <Download className="size-3.5" />
                  <span>MP3</span>
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
