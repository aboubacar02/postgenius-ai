import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, Loader2, Pause, Play, RefreshCw, Send, Sparkles, Square, TrendingUp, Volume2, X } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'
import { useI18n } from '../../lib/i18n'
import { chatWithAgent } from '../../services/agent'
import { synthesizeVoice } from '../../services/gemini'
import { EDGE_VOICES, speakWithEdge } from '../../services/voice'
import { NICHES } from '../../lib/niches'

function Waveform() {
  const heights = [8, 12, 6, 14, 9]
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden="true">
      {heights.map((h, i) => (
        <span
          key={i}
          className="wave-bar w-[2px] rounded-full bg-primary"
          style={{ height: `${h}px`, animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </span>
  )
}

function Message({ role, content, state, onSpeak, onStop }) {
  const { t } = useI18n()
  const user = role === 'user'
  return (
    <div className={cn('flex w-full gap-2.5', user && 'flex-row-reverse')}>
      <span
        className={cn(
          'flex size-7 shrink-0 items-center justify-center rounded-full text-white',
          user ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600' : 'bg-primary'
        )}
      >
        {user ? <Sparkles className="size-3.5" /> : <Bot className="size-3.5" />}
      </span>
      <div
        className={cn(
          'max-w-[80%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          user
            ? 'rounded-tr-sm bg-primary text-primary-foreground'
            : 'rounded-tl-sm border border-white/[0.06] bg-white/[0.03] text-pg-text/90'
        )}
      >
        {content}
        {!user && (
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onSpeak}
              className="flex items-center gap-1.5 text-[11px] font-medium text-primary transition-colors hover:text-primary-80"
            >
              {state === 'playing' ? (
                <Pause className="size-3.5" />
              ) : state === 'paused' ? (
                <Play className="size-3.5" />
              ) : (
                <Volume2 className="size-3.5" />
              )}
              {state === 'idle' ? t('agent.listen') : t('agent.playing')}
            </button>
            {state === 'loading' && <Waveform />}
            {state !== 'idle' && (
              <button
                type="button"
                onClick={onStop}
                aria-label={t('agent.stop')}
                className="flex size-5 items-center justify-center rounded-full text-pg-muted transition-colors hover:bg-white/[0.06] hover:text-pg-text"
              >
                <Square className="size-2.5 fill-current" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function AgentWidget() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [thinking, setThinking] = useState(false)
  const [greeted, setGreeted] = useState(false)
  const [seed, setSeed] = useState(0)
  const [speech, setSpeech] = useState(null)
  const [tooltipDismissed, setTooltipDismissed] = useState(false)
  const [voiceId, setVoiceId] = useState('fr-FR-HenriNeural')
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const audioRef = useRef(null)

  function stopAll() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    audioRef.current?.pause()
    audioRef.current = null
    setSpeech(null)
  }

  function pickFrenchVoice() {
    if (!('speechSynthesis' in window)) return null
    const voices = window.speechSynthesis.getVoices()
    return (
      voices.find((v) => v.lang.toLowerCase() === 'fr-fr' && /desktop|natural|microsoft|google/i.test(v.name)) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('fr')) ||
      null
    )
  }

  function speakNative(text, index) {
    if (!('speechSynthesis' in window)) return false
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'fr-FR'
    const voice = pickFrenchVoice()
    if (voice) utter.voice = voice
    utter.rate = 1
    utter.pitch = 1
    utter.onend = stopAll
    utter.onerror = (e) => {
      if (e.error === 'canceled' || e.error === 'interrupted') return
      stopAll()
    }
    setSpeech({ index, status: 'playing', mode: 'synth' })
    window.speechSynthesis.speak(utter)
    return true
  }

  async function playAudio(text, index) {
    setSpeech({ index, status: 'loading', mode: 'audio' })
    try {
      let audio
      try {
        const { mimeType, base64 } = await synthesizeVoice(text)
        audio = new Audio(`data:${mimeType};base64,${base64}`)
      } catch {
        const url = await speakWithEdge(text, voiceId)
        audio = new Audio(url)
      }
      audioRef.current = audio
      audio.onended = stopAll
      audio.onerror = () => {
        stopAll()
        speakNative(text, index)
      }
      setSpeech({ index, status: 'playing', mode: 'audio' })
      await audio.play()
    } catch {
      stopAll()
      speakNative(text, index)
    }
  }

  function speak(text, index) {
    if (speech && speech.index === index) {
      if (speech.status === 'playing') {
        if (speech.mode === 'synth' && 'speechSynthesis' in window) {
          window.speechSynthesis.pause()
        } else {
          audioRef.current?.pause()
        }
        setSpeech({ ...speech, status: 'paused' })
      } else if (speech.status === 'paused') {
        if (speech.mode === 'synth' && 'speechSynthesis' in window) {
          window.speechSynthesis.resume()
        } else {
          audioRef.current?.play().catch(() => {})
        }
        setSpeech({ ...speech, status: 'playing' })
      }
      return
    }
    stopAll()
    playAudio(text, index)
  }

  const suggestions = useMemo(() => {
    const hourKey = Math.floor(Date.now() / 3_600_000) + seed
    const list = []
    for (let i = 0; i < 4; i++) {
      const niche = NICHES[(hourKey + i) % NICHES.length]
      const idea = niche.ideas[Math.abs(hourKey * 7 + i * 3) % niche.ideas.length]
      list.push(t('agent.suggestionTemplate', { idea: `${niche.emoji} ${idea}` }))
    }
    return list
  }, [seed, t])

  useEffect(() => {
    const id = setInterval(() => setSeed((s) => s + 1), 30 * 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!open) return
    if (!greeted) {
      setGreeted(true)
      setMessages([{ role: 'agent', content: t('agent.greeting') }])
    }
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [open, greeted, t])

  useEffect(() => {
    if (!open) stopAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!('speechSynthesis' in window)) return
    const load = () => window.speechSynthesis.getVoices()
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking, open])

  async function send(text) {
    const content = (text ?? input).trim()
    if (!content || thinking) return
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setThinking(true)
    try {
      const reply = await chatWithAgent(next)
      setMessages((m) => [...m, { role: 'agent', content: reply }])
    } catch (err) {
      const msg = err?.message?.includes('indisponible') || err?.message?.includes('network')
        ? 'Erreur de connexion. Vérifie ta connexion internet et réessaie.'
        : t('agent.error')
      setMessages((m) => [...m, { role: 'agent', content: msg }])
    } finally {
      setThinking(false)
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-x-0 bottom-24 z-[60] mx-auto flex h-[min(520px,calc(100dvh-9rem))] w-[calc(100%-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-indigo-500/20 bg-pg-background/95 shadow-[0_0_40px_rgba(139,92,246,0.25)] backdrop-blur-xl md:bottom-6 md:right-6 md:left-auto md:mx-0">
          <div className="flex items-center gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-500/15 to-indigo-500/5 px-4 py-3">
            <span className="relative flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <Bot className="size-4" />
              <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-background bg-success" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-sm font-semibold text-pg-text">{t('agent.title')}</span>
              <div className="flex items-center gap-1">
                <Volume2 className="size-3 shrink-0 text-primary" />
                <select
                  value={voiceId}
                  onChange={(e) => {
                    stopAll()
                    setVoiceId(e.target.value)
                  }}
                  aria-label={t('agent.voice')}
                  className="max-w-32 flex-1 truncate rounded-md border-white/[0.06] bg-pg-surface px-1.5 py-0.5 text-[11px] text-pg-text outline-none focus-visible:border-primary"
                >
                  {EDGE_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label} · {v.gender === 'male' ? 'M' : 'F'}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="ml-auto text-pg-muted"
              aria-label={t('topbar.closeMenu')}
              onClick={() => setOpen(false)}
            >
              <X />
            </Button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <Message
                key={i}
                role={m.role}
                content={m.content}
                state={speech?.index === i ? speech.status : 'idle'}
                onSpeak={() => speak(m.content, i)}
                onStop={() => (speech?.index === i ? stopAll() : null)}
              />
            ))}
            {thinking && (
              <div className="flex w-full items-center gap-2 text-xs text-pg-muted">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                {t('agent.thinking')}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="flex flex-col gap-2 border-t border-white/10 p-3">
            {messages.length <= 1 && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 px-0.5">
                  <TrendingUp className="size-3.5 text-primary" />
                  <span className="text-[11px] font-semibold text-pg-muted">
                    {t('agent.trendingNow')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSeed((s) => s + 1)}
                    aria-label={t('agent.refresh')}
                    className="ml-auto flex size-5 items-center justify-center rounded-full text-pg-muted transition-colors hover:bg-white/[0.06] hover:text-indigo-400"
                  >
                    <RefreshCw className="size-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 px-0.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-primary-30 bg-primary-10 px-3 py-1 text-[11px] text-primary transition-colors hover:bg-primary-15"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('agent.placeholder')}
                className="h-10 min-w-0 flex-1 rounded-lg border-white/[0.06] bg-pg-surface px-3 text-sm text-pg-text outline-none placeholder:text-pg-muted focus-visible:border-primary"
              />
              <Button type="submit" size="icon" disabled={!input.trim() || thinking} aria-label={t('agent.send')} className="shrink-0">
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-24 z-[55] flex flex-col items-end gap-2.5 md:bottom-6 md:right-6">
        {!open && !tooltipDismissed && (
          <div className="fade-in-up flex items-center gap-1.5 rounded-full border border-primary/25 bg-white/[0.06] px-3.5 py-2 text-xs font-medium text-pg-text shadow-[0_0_20px_rgba(139,92,246,0.25)] backdrop-blur">
            <Sparkles className="size-3.5 text-primary" />
            {t('agent.tooltip')}
            <button
              type="button"
              onClick={() => setTooltipDismissed(true)}
              aria-label={t('topbar.closeMenu')}
              className="ml-1 -mr-1 flex size-4 items-center justify-center rounded-full text-pg-muted transition-colors hover:bg-white/[0.06] hover:text-pg-text"
            >
              <X className="size-3" />
            </button>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setTooltipDismissed(true)
            setOpen((v) => !v)
          }}
          aria-label={t('agent.title')}
          className={cn(
            'flex size-[52px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-600 text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-transform active:scale-95',
            !open && 'fab-float'
          )}
        >
          {open ? <X className="size-5" /> : <Bot className="size-5" />}
          {!open && (
            <span className="absolute -top-0.5 -right-0.5 flex size-3">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-3 rounded-full border-2 border-background bg-success" />
            </span>
          )}
        </button>
      </div>
    </>
  )
}
