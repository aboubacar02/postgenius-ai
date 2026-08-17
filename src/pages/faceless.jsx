import { useEffect, useRef, useState } from 'react'
import {
  Clapperboard,
  Download,
  FileText,
  Film,
  Headphones,
  Image,
  Info,
  Loader2,
  Music2,
  Pause,
  Play,
  PlayCircle,
  RefreshCcw,
  Sparkles,
  Video,
  Volume2
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { toast } from '../components/ui/sonner'
import { useI18n } from '../lib/i18n'
import { cn } from '../lib/utils'
import { NICHES } from './tendances'
import {
  pickEdgeVoice,
  generateFacelessScript,
  fetchBroll,
  fetchBrollVideo,
  fetchNarration
} from '../services/faceless'

const DEFAULT_SCRIPT = {
  title: 'Le secret des millionnaires a 25 ans',
  niche: 'Business',
  scenes: [
    {
      caption: '99% des gens ignorent cette regle fondamentale sur l\u2019argent.',
      narration: 'Quatre-vingt-dix-neuf pour cent des gens ignorent cette regle fondamentale sur l\u2019argent.',
      visual: 'Homme marchant dans un bureau moderne',
      imageKeyword: 'luxury finance modern business'
    },
    {
      caption: 'Ce n\u2019est pas le travail acharne qui compte, mais le levier.',
      narration: 'Ce n\u2019est pas le travail acharne qui compte, mais le levier que vous utilisez.',
      visual: 'Graphiques boursiers sur ecran',
      imageKeyword: 'trading analytics success laptop'
    },
    {
      caption: 'Appliquez ceci des aujourd\u2019hui pour multiplier vos resultats par dix.',
      narration: 'Appliquez ceci des aujourd\u2019hui pour multiplier vos resultats par dix.',
      visual: 'Poignee de main et succes',
      imageKeyword: 'entrepreneur victory celebration'
    }
  ],
  hashtags: ['#business', '#mindset', '#success', '#viral', '#motivation']
}

const FALLBACK_PHOTOS = [
  '1486406146926-c627a92ad1ab',
  '1611974789855-9c2a0a7236a3',
  '1551836022-d5d88e9218df',
  '1518770660439-4636190af475',
  '1618005182384-a83a8bd57fbe',
  '1542751371-adc38448a05e'
]

export default function FacelessPage() {
  const { t } = useI18n()
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('Tech')
  const [duration, setDuration] = useState(30)
  const [gender, setGender] = useState('male')
  const [voiceStyle, setVoiceStyle] = useState('energetic')
  const [script, setScript] = useState(DEFAULT_SCRIPT)
  const [isGenerated, setIsGenerated] = useState(false)
  const [busy, setBusy] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)

  const [medias, setMedias] = useState({})
  const [narrations, setNarrations] = useState({})
  const [downloading, setDownloading] = useState(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)

  const scene = script?.scenes?.[activeIdx] || script?.scenes?.[0]
  const voiceId = pickEdgeVoice(gender, voiceStyle)
  const sceneCount = script?.scenes?.length || 0
  const sceneDur = sceneCount ? (duration / sceneCount).toFixed(1) : '0'

  const stopAudio = () => {
    const a = audioRef.current
    if (a) { a.onended = null; a.pause(); a.currentTime = 0 }
    setPlaying(false); setElapsed(0)
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause()
      Object.values(narrations).forEach((u) => { if (u?.startsWith('blob:')) URL.revokeObjectURL(u) })
    }
  }, [narrations])

  // Fetch video/image B-roll for active scene
  useEffect(() => {
    if (!scene || medias[activeIdx]) return
    const kw = scene.imageKeyword || niche || 'cinematic'
    fetchBrollVideo(kw)
      .then((d) => {
        setMedias((m) => ({
          ...m,
          [activeIdx]: {
            videoUrl: d.videoUrl,
            imageUrl: d.imageUrl || d.url,
            credit: d.credit,
            duration: d.duration
          }
        }))
      })
      .catch(() => {
        setMedias((m) => ({
          ...m,
          [activeIdx]: {
            videoUrl: null,
            imageUrl: `https://images.unsplash.com/photo-${FALLBACK_PHOTOS[activeIdx % FALLBACK_PHOTOS.length]}?w=1080&auto=format&fit=crop&q=80`,
            credit: null
          }
        }))
      })
  }, [scene, activeIdx, medias, niche])

  // Pre-fetch all scenes on generate
  useEffect(() => {
    if (!isGenerated || !script?.scenes) return
    script.scenes.forEach((s, i) => {
      if (medias[i]) return
      const kw = s.imageKeyword || niche || 'cinematic'
      fetchBrollVideo(kw)
        .then((d) => {
          setMedias((m) => ({
            ...m,
            [i]: { videoUrl: d.videoUrl, imageUrl: d.imageUrl || d.url, credit: d.credit, duration: d.duration }
          }))
        })
        .catch(() => {
          setMedias((m) => ({
            ...m,
            [i]: { videoUrl: null, imageUrl: `https://images.unsplash.com/photo-${FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}?w=1080&auto=format&fit=crop&q=80`, credit: null }
          }))
        })
    })
  }, [isGenerated, script, niche])

  async function handleGenerate() {
    if (!topic.trim()) { toast.error(t('faceless.topicRequired')); return }
    setBusy(true); stopAudio(); setNarrations({}); setMedias({}); setActiveIdx(0)
    try {
      const data = await generateFacelessScript({ topic: topic.trim(), niche, duration })
      setScript(data); setIsGenerated(true)
      toast.success('Script & scenes generes !')
    } catch { toast.error(t('generator.failToast')) } finally { setBusy(false) }
  }

  async function ensureNarration(i) {
    if (narrations[i]) return narrations[i]
    const url = await fetchNarration(script.scenes[i].narration, voiceId)
    setNarrations((n) => ({ ...n, [i]: url }))
    return url
  }

  async function ensureAllNarrations() {
    const all = {}
    for (let i = 0; i < sceneCount; i++) all[i] = await ensureNarration(i)
    return all
  }

  async function ensureAllMedias() {
    const all = { ...medias }
    for (let i = 0; i < sceneCount; i++) {
      if (!all[i]) {
        const s = script.scenes[i]
        const d = await fetchBrollVideo(s.imageKeyword || niche || 'cinematic')
        all[i] = { videoUrl: d.videoUrl, imageUrl: d.imageUrl || d.url, credit: d.credit, duration: d.duration }
      }
    }
    setMedias(all); return all
  }

  async function playScene(i) {
    if (!script?.scenes?.[i]) return
    const audio = audioRef.current || new Audio()
    audioRef.current = audio; audio.pause()
    try {
      const url = await ensureNarration(i)
      audio.src = url; audio.currentTime = 0
      audio.onloadedmetadata = () => setAudioDuration(audio.duration || 0)
      audio.ontimeupdate = () => setElapsed(audio.currentTime)
      audio.onended = () => {
        setPlaying(false)
        if (i < script.scenes.length - 1) playScene(i + 1)
      }
      audio.onerror = () => setPlaying(false)
      setActiveIdx(i); setElapsed(0); setPlaying(true)
      await audio.play().catch(() => setPlaying(false))
    } catch { setPlaying(false) }
  }

  function togglePlay() {
    const a = audioRef.current
    if (!a?.src) { playScene(activeIdx); return }
    if (a.paused) { a.play().catch(() => {}); setPlaying(true) } else { a.pause(); setPlaying(false) }
  }

  function jumpTo(i) { stopAudio(); setActiveIdx(i) }

  function formatTime(sec) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  // ── Downloads ──
  async function downloadVoiceOff() {
    if (!sceneCount) return; setDownloading('audio')
    try {
      const narrs = await ensureAllNarrations()
      const blobs = []
      for (let i = 0; i < sceneCount; i++) {
        if (!narrs[i]) continue
        const res = await fetch(narrs[i]); blobs.push(await res.blob())
      }
      const blob = new Blob(blobs, { type: 'audio/mpeg' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `voix-off-${script.title?.slice(0, 30) || 'faceless'}.mp3`
      a.click(); URL.revokeObjectURL(a.href)
      toast.success('Voix-off MP3 telechargee !')
    } catch { toast.error('Erreur audio') } finally { setDownloading(null) }
  }

  async function downloadSceneVideo(i) {
    const m = medias[i]; if (!m?.videoUrl) { toast.info('Aucune video MP4 disponible pour cette scene'); return }
    setDownloading(`scene-${i}`)
    try {
      const res = await fetch(m.videoUrl); const blob = await res.blob()
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `scene-${i + 1}-broll.mp4`
      a.click(); URL.revokeObjectURL(a.href)
      toast.success(`Scene ${i + 1} MP4 telechargee !`)
    } catch { toast.error('Erreur video') } finally { setDownloading(null) }
  }

  async function downloadAllVideos() {
    if (!sceneCount) return; setDownloading('all-vids')
    try {
      const all = await ensureAllMedias()
      let count = 0
      for (let i = 0; i < sceneCount; i++) {
        const m = all[i]; if (!m?.videoUrl) continue
        const res = await fetch(m.videoUrl); const blob = await res.blob()
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `scene-${i + 1}-broll.mp4`
        a.click(); URL.revokeObjectURL(a.href); count++
        await new Promise((r) => setTimeout(r, 400))
      }
      toast.success(`${count} videos MP4 telechargees !`)
    } catch { toast.error('Erreur videos') } finally { setDownloading(null) }
  }

  async function downloadFullPack() {
    if (!sceneCount) return; setDownloading('all')
    try {
      // 1. Script TXT
      const lines = [script.title, '', ...script.scenes.map((s, i) =>
        `Scene ${i+1}\nSous-titre : ${s.caption}\nVoix off : ${s.narration}\nB-roll : ${s.visual}\n`
      ), '', 'Hashtags :', script.hashtags.join(' ')]
      const scriptBlob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
      const a0 = document.createElement('a')
      a0.href = URL.createObjectURL(scriptBlob); a0.download = `script-${script.title?.slice(0,20)}.txt`
      a0.click(); URL.revokeObjectURL(a0.href)
      await new Promise((r) => setTimeout(r, 200))

      // 2. SRT
      const srtLines = []; let cur = 0; const sec = duration / sceneCount
      script.scenes.forEach((s, i) => {
        const start = cur; cur += sec
        const pad = (n, l = 2) => String(Math.floor(n)).padStart(l, '0')
        const fmt = (t) => `${pad(t/3600)}:${pad((t%3600)/60)}:${pad(t%60)},${String(Math.floor((t%1)*1000)).padStart(3,'0')}`
        srtLines.push(`${i+1}\n${fmt(start)} --> ${fmt(cur)}\n${s.caption}\n`)
      })
      const srtBlob = new Blob([srtLines.join('\n')], { type: 'text/plain;charset=utf-8' })
      const a1 = document.createElement('a')
      a1.href = URL.createObjectURL(srtBlob); a1.download = `sous-titres-${script.title?.slice(0,20)}.srt`
      a1.click(); URL.revokeObjectURL(a1.href)
      await new Promise((r) => setTimeout(r, 200))

      // 3. Voice-off MP3
      await downloadVoiceOff()
      await new Promise((r) => setTimeout(r, 300))

      // 4. All video MP4s
      await downloadAllVideos()
      toast.success('Pack CapCut complet telecharge !')
    } catch { toast.error('Erreur pack') } finally { setDownloading(null) }
  }

  function exportScript() {
    if (!script) return
    const lines = [script.title, '', ...script.scenes.map((s, i) =>
      `Scene ${i+1}\nSous-titre : ${s.caption}\nVoix off : ${s.narration}\nB-roll : ${s.visual}\n`
    ), '', 'Hashtags :', script.hashtags.join(' ')]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob); a.download = 'script-faceless.txt'; a.click()
    URL.revokeObjectURL(a.href); toast.success('Script exporte !')
  }

  function regenerateScene(idx) {
    const s = script?.scenes?.[idx]; if (!s) return
    setMedias((m) => { const n = { ...m }; delete n[idx]; return n })
    toast.info(`Scene ${idx+1} en cours de regeneration...`)
  }

  const activeMedia = medias[activeIdx]
  const hasVideo = !!activeMedia?.videoUrl

  return (
    <div className="relative mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 pb-16 pt-4 sm:px-8">

      {/* ── Neon Halo Background ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 h-[350px] w-[350px] rounded-full bg-cyan-500/15 blur-[120px]" />
      </div>

      {/* ── Header ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
            <Clapperboard className="size-4.5" />
          </span>
          <span className="eyebrow text-violet-400">Faceless Studio</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-pg-text md:text-4xl">
          Video <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Faceless</span> Pack CapCut
        </h1>
        <p className="max-w-xl text-sm text-pg-muted leading-relaxed">
          Generez un script IA, telechargez les videos MP4 B-roll + la voix-off MP3, puis montez en 30 secondes dans CapCut.
        </p>
      </div>

      {/* ── Config Card ── */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-pg-muted">Sujet de la video</span>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ex: Les 3 erreurs fatales en bourse a 20 ans..."
              className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-sm font-medium text-pg-text placeholder:text-pg-subtle outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="eyebrow text-pg-muted">Niche</span>
            <div className="flex flex-wrap gap-1.5">
              {NICHES.map((n) => (
                <button
                  key={n.name}
                  type="button"
                  onClick={() => setNiche(n.name)}
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all',
                    niche === n.name
                      ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                      : 'border-white/10 bg-white/[0.03] text-pg-muted hover:bg-white/[0.06]'
                  )}
                >
                  {n.emoji} {n.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow text-pg-muted">Duree</span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-pg-text outline-none"
              >
                <option value={15}>15s (Fast)</option>
                <option value={30}>30s (Viral)</option>
                <option value={60}>60s (Profond)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="eyebrow text-pg-muted">Voix</span>
              <select
                value={`${gender}-${voiceStyle}`}
                onChange={(e) => { const [g, s] = e.target.value.split('-'); setGender(g); setVoiceStyle(s) }}
                className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-xs font-semibold text-pg-text outline-none"
              >
                <option value="male-energetic">Homme Ener</option>
                <option value="female-energetic">Femme Ener</option>
                <option value="male-calm">Homme Calme</option>
                <option value="female-calm">Femme Calme</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5 justify-end">
              <Button
                onClick={handleGenerate}
                disabled={busy}
                className="h-10 w-full gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-xs shadow-lg shadow-violet-500/20 hover:opacity-90 transition-all"
              >
                {busy ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                <span>{busy ? 'Generation...' : 'Generer'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Video Preview + Scene List ── */}
      {isGenerated && sceneCount > 0 && (
        <div className="grid gap-6 lg:grid-cols-12">

          {/* Left: Video Preview */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md shadow-2xl">
              {/* Video Player 9:16 */}
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
                {activeMedia?.videoUrl ? (
                  <video
                    key={activeIdx}
                    ref={videoRef}
                    src={activeMedia.videoUrl}
                    className="absolute inset-0 h-full w-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                  />
                ) : activeMedia?.imageUrl ? (
                  <img
                    src={activeMedia.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-6 animate-spin text-pg-subtle" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

                {/* Scene badge */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                    {String(activeIdx + 1).padStart(2, '0')}/{sceneCount}
                  </span>
                  <span className="rounded-full bg-violet-600/80 px-2.5 py-1 font-mono text-[10px] font-bold text-white backdrop-blur-sm">
                    {sceneDur}s
                  </span>
                </div>

                {/* Video type badge */}
                {hasVideo && (
                  <div className="absolute top-3 right-3 z-10">
                    <span className="flex items-center gap-1 rounded-full bg-green-500/80 px-2 py-0.5 font-mono text-[9px] font-bold text-white backdrop-blur-sm">
                      <div className="size-1.5 rounded-full bg-green-300 animate-pulse" /> MP4
                    </span>
                  </div>
                )}

                {/* Caption */}
                <div className="absolute bottom-16 left-0 right-0 z-10 px-4 text-center">
                  <p className="text-sm font-bold text-white drop-shadow-lg leading-tight">
                    {scene?.caption}
                  </p>
                </div>

                {/* Audio progress bar */}
                <div className="absolute bottom-10 left-3 right-3 z-10">
                  <div className="flex items-center gap-2 text-[9px] font-mono text-white/70">
                    <span>{formatTime(elapsed)}</span>
                    <div className="relative flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-violet-500 rounded-full transition-all"
                        style={{ width: `${audioDuration ? (elapsed / audioDuration) * 100 : 0}%` }}
                      />
                    </div>
                    <span>{formatTime(audioDuration || parseFloat(sceneDur))}</span>
                  </div>
                </div>

                {/* Play controls */}
                <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-4">
                  <button
                    onClick={() => jumpTo(Math.max(0, activeIdx - 1))}
                    disabled={activeIdx === 0}
                    className="text-white/60 hover:text-white disabled:opacity-30 text-xs transition-colors"
                  >
                    &#9198;
                  </button>
                  <button
                    onClick={togglePlay}
                    className="flex size-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 transition-transform"
                  >
                    {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 ml-0.5" />}
                  </button>
                  <button
                    onClick={() => jumpTo(Math.min(sceneCount - 1, activeIdx + 1))}
                    disabled={activeIdx >= sceneCount - 1}
                    className="text-white/60 hover:text-white disabled:opacity-30 text-xs transition-colors"
                  >
                    &#9197;
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Scene List + Exports */}
          <div className="flex flex-col gap-4 lg:col-span-7">

            {/* Scene Cards */}
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
                      {/* Thumbnail */}
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

                      {/* Content */}
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

                      {/* Download scene MP4 */}
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

                      {/* Play indicator */}
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

            {/* Export Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md shadow-2xl">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex size-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                  <Download className="size-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-pg-text">Telecharger le Pack CapCut</h3>
                  <p className="text-[11px] text-pg-subtle">Voix-off MP3 + videos MP4 B-roll synchronisees</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={downloadVoiceOff}
                  disabled={downloading === 'audio' || downloading === 'all'}
                  variant="outline"
                  className="h-12 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
                >
                  {downloading === 'audio' ? <Loader2 className="size-4 animate-spin" /> : <Headphones className="size-4" />}
                  <span>Voix-Off MP3</span>
                </Button>

                <Button
                  onClick={downloadAllVideos}
                  disabled={downloading === 'all-vids' || downloading === 'all'}
                  variant="outline"
                  className="h-12 gap-2 rounded-xl border-white/10 bg-white/[0.03] text-pg-text hover:bg-white/[0.06] font-semibold text-xs"
                >
                  {downloading === 'all-vids' ? <Loader2 className="size-4 animate-spin" /> : <Video className="size-4" />}
                  <span>Videos MP4</span>
                </Button>

                <Button
                  onClick={downloadFullPack}
                  disabled={downloading !== null}
                  className="h-12 gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 font-bold text-white text-xs shadow-lg shadow-violet-500/20 hover:opacity-90"
                >
                  {downloading === 'all' ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                  <span>Pack CapCut Complet</span>
                </Button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button onClick={exportScript} variant="ghost" size="sm" className="gap-1.5 text-pg-subtle hover:text-pg-text text-xs">
                  <FileText className="size-3.5" /> Script TXT
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CapCut Guide ── */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-950/30 p-6 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Info className="size-4.5" />
          </span>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-violet-400">Comment monter sur CapCut en 30 secondes</h3>
            <div className="grid gap-2.5 text-xs text-pg-muted leading-relaxed">
              {[
                'Telechargez la voix-off MP3 et les videos MP4 ci-dessus.',
                'Ouvrez CapCut (Mobile ou PC) et creez un Nouveau Projet.',
                "Importez les videos dans l'ordre des scenes et ajoutez le fichier audio en dessous.",
                "Dans CapCut, cliquez sur Textes > Sous-titres automatiques pour afficher les sous-titres animes.",
                'Exportez votre video en 1080p !'
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-violet-500/10 font-mono text-[10px] font-bold text-violet-400">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
