import { useEffect, useRef, useState } from 'react'
import { toast } from '../components/ui/sonner'
import { useI18n } from '../lib/i18n'
import {
  pickEdgeVoice,
  generateFacelessScript,
  fetchBrollVideo,
  fetchNarration
} from '../services/faceless'

const FALLBACK_PHOTOS = [
  '1486406146926-c627a92ad1ab',
  '1611974789855-9c2a0a7236a3',
  '1551836022-d5d88e9218df',
  '1518770660439-4636190af475',
  '1618005182384-a83a8bd57fbe',
  '1542751371-adc38448a05e'
]

const DEFAULT_SCRIPT = {
  title: 'Le secret des millionnaires a 25 ans',
  niche: 'Business',
  scenes: [
    { caption: '99% des gens ignorent cette regle fondamentale sur l\u2019argent.', narration: 'Quatre-vingt-dix-neuf pour cent des gens ignorent cette regle fondamentale sur l\u2019argent.', visual: 'Homme marchant dans un bureau moderne', imageKeyword: 'luxury finance modern business', wordImages: ['luxury', 'finance', 'money'] },
    { caption: 'Ce n\u2019est pas le travail acharne qui compte, mais le levier.', narration: 'Ce n\u2019est pas le travail acharne qui compte, mais le levier que vous utilisez.', visual: 'Graphiques boursiers sur ecran', imageKeyword: 'trading analytics success laptop', wordImages: ['trading', 'analytics', 'success'] },
    { caption: 'Appliquez ceci des aujourd\u2019hui pour multiplier vos resultats par dix.', narration: 'Appliquez ceci des aujourd\u2019hui pour multiplier vos resultats par dix.', visual: 'Poignee de main et succes', imageKeyword: 'entrepreneur victory celebration', wordImages: ['entrepreneur', 'victory', 'celebration'] }
  ],
  hashtags: ['#business', '#mindset', '#success', '#viral', '#motivation']
}

export function useFacelessState() {
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
  const [musicTrack, setMusicTrack] = useState(null)
  const [musicSearching, setMusicSearching] = useState(false)
  const audioRef = useRef(null)
  const videoRef = useRef(null)

  const scene = script?.scenes?.[activeIdx] || script?.scenes?.[0]
  const voiceId = pickEdgeVoice(gender, voiceStyle)
  const sceneCount = script?.scenes?.length || 0
  const sceneDur = sceneCount ? (duration / sceneCount).toFixed(1) : '0'
  const activeMedia = medias[activeIdx]
  const hasVideo = !!activeMedia?.videoUrl

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

  useEffect(() => {
    if (!scene || medias[activeIdx]) return
    const kw = (scene.wordImages && scene.wordImages.length > 0) ? scene.wordImages[0] : (scene.imageKeyword || niche || 'cinematic')
    fetchBrollVideo(kw)
      .then((d) => setMedias((m) => ({ ...m, [activeIdx]: { videoUrl: d.videoUrl, imageUrl: d.imageUrl || d.url, credit: d.credit, duration: d.duration } })))
      .catch(() => setMedias((m) => ({ ...m, [activeIdx]: { videoUrl: null, imageUrl: `https://images.unsplash.com/photo-${FALLBACK_PHOTOS[activeIdx % FALLBACK_PHOTOS.length]}?w=1080&auto=format&fit=crop&q=80`, credit: null } })))
  }, [scene, activeIdx, medias, niche])

  useEffect(() => {
    if (!isGenerated || !script?.scenes) return
    script.scenes.forEach((s, i) => {
      if (medias[i]) return
      const kw = (s.wordImages && s.wordImages.length > 0) ? s.wordImages[0] : (s.imageKeyword || niche || 'cinematic')
      fetchBrollVideo(kw)
        .then((d) => setMedias((m) => ({ ...m, [i]: { videoUrl: d.videoUrl, imageUrl: d.imageUrl || d.url, credit: d.credit, duration: d.duration } })))
        .catch(() => setMedias((m) => ({ ...m, [i]: { videoUrl: null, imageUrl: `https://images.unsplash.com/photo-${FALLBACK_PHOTOS[i % FALLBACK_PHOTOS.length]}?w=1080&auto=format&fit=crop&q=80`, credit: null } })))
    })
  }, [isGenerated, script, niche])

  async function handleGenerate() {
    if (!topic.trim()) { toast.error(t('faceless.topicRequired')); return }
    setBusy(true); stopAudio(); setNarrations({}); setMedias({}); setActiveIdx(0)
    try {
      const data = await generateFacelessScript({ topic: topic.trim(), niche, duration })
      setScript(data); setIsGenerated(true)
      toast.success('Script & scenes generes !')
    } catch (err) { toast.error(err.message || t('generator.failToast')) } finally { setBusy(false) }
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
        const d = await fetchBrollVideo((s.wordImages && s.wordImages.length > 0) ? s.wordImages[0] : (s.imageKeyword || niche || 'cinematic'))
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
      audio.onended = () => { setPlaying(false); if (i < script.scenes.length - 1) playScene(i + 1) }
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

  async function downloadVoiceOff() {
    if (!sceneCount) return; setDownloading('audio')
    try {
      const narrs = await ensureAllNarrations()
      const blobs = []
      for (let i = 0; i < sceneCount; i++) {
        if (!narrs[i]) continue
        try {
          const res = await fetch(narrs[i])
          if (res.ok) blobs.push(await res.blob())
        } catch {}
      }
      if (blobs.length === 0) {
        const fullText = (script?.scenes || []).map(s => s.narration).join('\n\n')
        const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `voix-off-script-${script.title?.slice(0, 30) || 'faceless'}.txt`
        a.click(); URL.revokeObjectURL(a.href)
        toast.success('Script voix-off téléchargé (audio indisponible)')
        return
      }
      const blob = new Blob(blobs, { type: 'audio/mpeg' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `voix-off-${script.title?.slice(0, 30) || 'faceless'}.mp3`
      a.click(); URL.revokeObjectURL(a.href)
      toast.success('Voix-off MP3 telechargee !')
    } catch (err) { 
      toast.error(err.message || 'Erreur lors du téléchargement audio. Réessaie.') 
    } finally { 
      setDownloading(null) 
    }
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
    } catch { toast.error('Erreur lors du téléchargement vidéo. Réessaie.') } finally { setDownloading(null) }
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
    } catch { toast.error('Erreur lors du téléchargement des vidéos. Réessaie.') } finally { setDownloading(null) }
  }

  async function downloadFullPack() {
    if (!sceneCount) return; setDownloading('all')
    try {
      const lines = [script.title, '', ...script.scenes.map((s, i) =>
        `Scene ${i+1}\nSous-titre : ${s.caption}\nVoix off : ${s.narration}\nB-roll : ${s.visual}\n`
      ), '', 'Hashtags :', script.hashtags.join(' ')]
      const scriptBlob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
      const a0 = document.createElement('a')
      a0.href = URL.createObjectURL(scriptBlob); a0.download = `script-${script.title?.slice(0,20)}.txt`
      a0.click(); URL.revokeObjectURL(a0.href)
      await new Promise((r) => setTimeout(r, 200))

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

      await downloadVoiceOff()
      await new Promise((r) => setTimeout(r, 300))

      await downloadAllVideos()
      toast.success('Pack CapCut complet telecharge !')
    } catch { toast.error('Erreur lors du téléchargement du pack. Réessaie.') } finally { setDownloading(null) }
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

  function downloadSrt() {
    if (!script?.scenes) return
    const srtLines = []
    let cur = 0
    const sec = duration / sceneCount
    script.scenes.forEach((s, i) => {
      const start = cur; cur += sec
      const pad = (n, l = 2) => String(Math.floor(n)).padStart(l, '0')
      const fmt = (t) => `${pad(t / 3600)}:${pad((t % 3600) / 60)}:${pad(t % 60)},${String(Math.floor((t % 1) * 1000)).padStart(3, '0')}`
      srtLines.push(`${i + 1}\n${fmt(start)} --> ${fmt(cur)}\n${s.caption}\n`)
    })
    const blob = new Blob([srtLines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `sous-titres-${script.title?.slice(0, 20) || 'faceless'}.srt`
    a.click(); URL.revokeObjectURL(a.href)
    toast.success('Fichier SRT telecharge !')
  }

  async function searchMusic(query) {
    if (!query?.trim()) return
    setMusicSearching(true)
    try {
      const res = await fetch(`/api/youtube/music?q=${encodeURIComponent(query)}&max=5`)
      const data = await res.json()
      if (data.items?.length > 0) {
        setMusicTrack(data.items[0])
        toast.success(`Musique trouvee : ${data.items[0].title}`)
      } else {
        toast.error(data.error || 'Aucune musique trouvee')
      }
    } catch {
      toast.error('Recherche musicale indisponible')
    } finally {
      setMusicSearching(false)
    }
  }

  function downloadMusic() {
    if (!musicTrack) return
    const a = document.createElement('a')
    a.href = `https://www.youtube.com/watch?v=${musicTrack.youtubeId}`
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
    toast.info('Ouvre YouTube pour telecharger la musique libre de droits.')
  }

  function regenerateScene(idx) {
    const s = script?.scenes?.[idx]; if (!s) return
    setMedias((m) => { const n = { ...m }; delete n[idx]; return n })
    toast.info(`Scene ${idx+1} en cours de regeneration...`)
  }

  return {
    topic, setTopic, niche, setNiche, duration, setDuration,
    gender, setGender, voiceStyle, setVoiceStyle,
    script, isGenerated, busy, activeIdx, playing, elapsed, audioDuration,
    medias, narrations, downloading,
    musicTrack, musicSearching,
    audioRef, videoRef,
    scene, voiceId, sceneCount, sceneDur, activeMedia, hasVideo,
    handleGenerate, ensureNarration, ensureAllNarrations, ensureAllMedias,
    playScene, togglePlay, jumpTo, formatTime,
    downloadVoiceOff, downloadSceneVideo, downloadAllVideos, downloadFullPack,
    downloadSrt, exportScript, regenerateScene, setActiveIdx,
    searchMusic, downloadMusic
  }
}
