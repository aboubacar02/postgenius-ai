import { useEffect, useRef, useState } from 'react'
import { Download, Music, Pause, Play, RefreshCw, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from '../ui/sonner'
import { cn } from '../../lib/utils'
import { getTrendingMusic } from '../../lib/trends-data'

const GENRE_CHORDS = {
  'Pop / K-Pop':       [523, 659, 784, 880],
  'Pop Ballad':        [440, 523, 587, 659],
  'Indie Pop':         [392, 494, 587, 659],
  'Eurodance / Phonk': [330, 415, 494, 554],
  'Hip-Hop':           [262, 311, 370, 415],
  'Pop':               [440, 523, 587, 698],
  'Pop Rock':          [330, 415, 494, 554],
  'Hip-Hop / Pop':     [294, 349, 440, 523],
}

export function AudioTrendsLibrary() {
  const [activeTrackId, setActiveTrackId] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null)
  const [tracks, setTracks] = useState(() => getTrendingMusic())
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [waveBars, setWaveBars] = useState(Array(16).fill(4))
  const ctxRef = useRef(null)
  const nodesRef = useRef([])
  const timerRef = useRef(null)
  const waveTimerRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setTracks(getTrendingMusic())
      setLastUpdate(new Date())
    }, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  function refreshNow() {
    setTracks(getTrendingMusic())
    setLastUpdate(new Date())
    toast.success('Données tendance actualisées !')
  }

  function stopAudio() {
    nodesRef.current.forEach((n) => { try { n.stop?.(); n.disconnect?.() } catch {} })
    nodesRef.current = []
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    if (waveTimerRef.current) { clearInterval(waveTimerRef.current); waveTimerRef.current = null }
    setIsPlaying(false)
    setActiveTrackId(null)
    setWaveBars(Array(16).fill(4))
  }

  function playTrack(track) {
    if (activeTrackId === track.id && isPlaying) { stopAudio(); return }
    stopAudio()

    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!ctxRef.current) ctxRef.current = new AC()
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const chords = GENRE_CHORDS[track.genre] || GENRE_CHORDS['Pop']
      const bpm = track.bpm || 120
      const beatLen = 60 / bpm
      const master = ctx.createGain()
      master.gain.setValueAtTime(0.18, ctx.currentTime)
      master.connect(ctx.destination)
      const alive = []

      // Chord pad
      function scheduleChord(start, freqs, dur) {
        freqs.forEach((f) => {
          const o = ctx.createOscillator()
          const g = ctx.createGain()
          o.type = 'sine'
          o.frequency.setValueAtTime(f, start)
          g.gain.setValueAtTime(0.001, start)
          g.gain.linearRampToValueAtTime(0.06, start + 0.05)
          g.gain.setValueAtTime(0.06, start + dur - 0.1)
          g.gain.linearRampToValueAtTime(0.001, start + dur)
          o.connect(g); g.connect(master)
          o.start(start); o.stop(start + dur)
          alive.push(o)
        })
      }

      // Bass note
      function scheduleBass(start, freq, dur) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = 'triangle'
        o.frequency.setValueAtTime(freq, start)
        g.gain.setValueAtTime(0.001, start)
        g.gain.linearRampToValueAtTime(0.15, start + 0.02)
        g.gain.setValueAtTime(0.15, start + dur - 0.05)
        g.gain.linearRampToValueAtTime(0.001, start + dur)
        o.connect(g); g.connect(master)
        o.start(start); o.stop(start + dur)
        alive.push(o)
      }

      // Kick
      function scheduleKick(start) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.frequency.setValueAtTime(150, start)
        o.frequency.exponentialRampToValueAtTime(30, start + 0.12)
        g.gain.setValueAtTime(0.3, start)
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.15)
        o.connect(g); g.connect(master)
        o.start(start); o.stop(start + 0.15)
        alive.push(o)
      }

      // Hi-hat
      function scheduleHat(start) {
        const bufSize = ctx.sampleRate * 0.05
        const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate)
        const data = buf.getChannelData(0)
        for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.3
        const src = ctx.createBufferSource()
        src.buffer = buf
        const hp = ctx.createBiquadFilter()
        hp.type = 'highpass'; hp.frequency.value = 8000
        const g = ctx.createGain()
        g.gain.setValueAtTime(0.12, start)
        g.gain.exponentialRampToValueAtTime(0.001, start + 0.05)
        src.connect(hp); hp.connect(g); g.connect(master)
        src.start(start); src.stop(start + 0.05)
        alive.push(src)
      }

      // Schedule 8 bars of music (looping)
      const barLen = beatLen * 4
      const totalBars = 10
      for (let bar = 0; bar < totalBars; bar++) {
        const barStart = ctx.currentTime + bar * barLen
        const chordIdx = bar % chords.length

        // Chord changes every 2 beats
        scheduleChord(barStart, [chords[chordIdx], chords[chordIdx] * 1.25, chords[chordIdx] * 1.5], barLen / 2)
        scheduleChord(barStart + barLen / 2, [chords[(chordIdx + 1) % chords.length], chords[(chordIdx + 1) % chords.length] * 1.25, chords[(chordIdx + 1) % chords.length] * 1.5], barLen / 2)

        // Bass on beat 1 and 3
        scheduleBass(barStart, chords[chordIdx] / 4, beatLen * 2)
        scheduleBass(barStart + beatLen * 2, chords[(chordIdx + 1) % chords.length] / 4, beatLen * 2)

        // Kick on every beat
        for (let b = 0; b < 4; b++) scheduleKick(barStart + b * beatLen)

        // Hi-hat on every half beat
        for (let h = 0; h < 8; h++) scheduleHat(barStart + h * beatLen / 2)
      }

      const totalDur = totalBars * barLen * 1000
      nodesRef.current = alive
      setActiveTrackId(track.id)
      setIsPlaying(true)

      // Waveform animation
      waveTimerRef.current = setInterval(() => {
        setWaveBars((prev) => prev.map(() => 4 + Math.floor(Math.random() * 20)))
      }, 150)

      timerRef.current = setTimeout(() => stopAudio(), Math.min(totalDur, 25000))
    } catch (e) {
      console.error('Audio error:', e)
      toast.error('Aperçu audio non supporté.')
    }
  }

  useEffect(() => () => stopAudio(), [])

  function downloadTrack(track) {
    setDownloadingId(track.id)
    try {
      const sampleRate = 44100
      const durationSec = 30
      const numChannels = 2
      const numSamples = sampleRate * durationSec
      const buffer = new ArrayBuffer(44 + numSamples * numChannels * 2)
      const view = new DataView(buffer)
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i))
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
      let offset = 44
      const chords = GENRE_CHORDS[track.genre] || GENRE_CHORDS['Pop']
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate
        const freq = chords[i % chords.length]
        const sample = Math.sin(2 * Math.PI * freq * t) * 0.3 * (1 + 0.5 * Math.sin(2 * Math.PI * 2 * t))
        const intSample = Math.max(-1, Math.min(1, sample)) * 0x7fff
        view.setInt16(offset, intSample, true)
        view.setInt16(offset + 2, intSample, true)
        offset += 4
      }
      const blob = new Blob([buffer], { type: 'audio/wav' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `postgenius-${track.id}-trending.wav`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Piste "${track.title}" téléchargée !`)
    } catch {
      toast.error('Erreur lors du téléchargement.')
    } finally {
      setTimeout(() => setDownloadingId(null), 1200)
    }
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/60 backdrop-blur-xl p-6 md:p-8 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <Music className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-bold text-zinc-100 md:text-xl">
              Musiques Tendance du Moment
            </h2>
            <p className="text-xs text-zinc-500">
              Actualisé automatiquement · {tracks.length} pistes en temps réel
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-600">
            Mis à jour {lastUpdate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <Button size="sm" variant="outline" onClick={refreshNow} className="gap-1.5 rounded-full border-white/[0.08] bg-zinc-900/60 text-xs text-zinc-500 hover:text-zinc-200">
            <RefreshCw className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tracks.map((track, i) => {
          const active = activeTrackId === track.id && isPlaying
          return (
            <div
              key={track.id}
              className={cn(
                'group flex items-center gap-4 rounded-2xl border p-3 transition-all duration-300',
                active
                  ? 'border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04]'
              )}
            >
              <span className="flex w-8 shrink-0 items-center justify-center font-mono text-sm font-bold text-zinc-600 group-hover:text-zinc-400 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className={`relative flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${track.coverGradient} text-xl shadow-md transition-transform duration-200 group-hover:scale-105`}>
                {track.emoji}
                <div className="absolute inset-0 rounded-xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="size-5 fill-white text-white ml-0.5" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{track.title}</p>
                <p className="text-xs text-zinc-500 truncate">{track.artist} · {track.genre}</p>
                <div className="flex items-center gap-2 mt-1">
                  {track.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[9px] font-mono text-zinc-600">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                <span className="font-mono text-[10px] font-bold text-zinc-600">{track.bpm} BPM</span>
                <span className="text-[10px] text-zinc-700">{track.platform}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <TrendingUp className={cn('size-3.5', track.trending >= 90 ? 'text-emerald-400' : track.trending >= 80 ? 'text-indigo-400' : 'text-zinc-500')} />
                <span className={cn('font-mono text-xs font-bold', track.trending >= 90 ? 'text-emerald-400' : track.trending >= 80 ? 'text-indigo-400' : 'text-zinc-500')}>
                  {track.trending}
                </span>
              </div>

              {/* Waveform visualizer when active */}
              {active && (
                <div className="hidden sm:flex items-end gap-[2px] h-6 shrink-0">
                  {waveBars.map((h, wi) => (
                    <div key={wi} className="w-[3px] bg-indigo-400 rounded-full transition-all duration-100" style={{ height: `${h}px` }} />
                  ))}
                </div>
              )}

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  size="sm"
                  variant={active ? 'default' : 'ghost'}
                  onClick={() => playTrack(track)}
                  className={cn(
                    'gap-1.5 rounded-xl text-xs font-semibold transition-all',
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06]'
                  )}
                >
                  {active ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => downloadTrack(track)}
                  disabled={downloadingId === track.id}
                  className="gap-1 rounded-xl text-xs text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06]"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
