import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Type, X } from 'lucide-react'
import { Button } from '../ui/button'
import { cn } from '../../lib/utils'

export function TeleprompterModal({ script, open, onClose }) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(2) // 1 to 5
  const [fontSize, setFontSize] = useState(36) // px
  const [mirrored, setMirrored] = useState(false)
  const scrollRef = useRef(null)
  const animationRef = useRef(null)

  // Keyboard shortcut Space = Play/Pause
  useEffect(() => {
    function onKeyDown(e) {
      if (!open) return
      if (e.code === 'Space') {
        e.preventDefault()
        setPlaying((p) => !p)
      } else if (e.code === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  // Smooth autoscroll loop
  useEffect(() => {
    if (!playing || !open) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      return
    }

    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let lastTime = performance.now()
    function step(now) {
      const delta = now - lastTime
      lastTime = now
      if (scrollContainer) {
        scrollContainer.scrollTop += (speed * delta) / 30
      }
      animationRef.current = requestAnimationFrame(step)
    }

    animationRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animationRef.current)
  }, [playing, speed, open])

  if (!open || !script) return null

  // Extract plain text lines from script
  const textContent =
    typeof script === 'string'
      ? script
      : [
          script.hook,
          ...(script.body || script.scenes?.map((s) => s.narration || s.text) || []),
          script.cta
        ]
          .filter(Boolean)
          .join('\n\n')

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black text-white backdrop-blur-3xl animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-black/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-white font-bold text-xs">
            PRO
          </span>
          <span className="font-heading text-lg font-bold">Studio Teleprompter</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Speed slider */}
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono">
            <span className="text-muted-foreground">Vitesse :</span>
            <input
              type="range"
              min="0.5"
              max="6"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="w-6 text-primary font-bold">{speed}x</span>
          </div>

          {/* Font size */}
          <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-mono">
            <Type className="size-3.5 text-muted-foreground" />
            <input
              type="range"
              min="24"
              max="64"
              step="4"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="text-primary font-bold">{fontSize}px</span>
          </div>

          {/* Mirror toggle */}
          <button
            type="button"
            onClick={() => setMirrored((m) => !m)}
            className={cn(
              'rounded-xl border px-3 py-1.5 text-xs font-mono font-semibold transition-all',
              mirrored
                ? 'border-primary bg-primary/20 text-primary'
                : 'border-white/15 bg-white/5 text-muted-foreground hover:text-white'
            )}
          >
            Miroir (Vitre)
          </button>

          {/* Play/Pause Button */}
          <Button
            size="sm"
            onClick={() => setPlaying((p) => !p)}
            className="rounded-xl bg-primary px-4 font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]"
          >
            {playing ? <Pause className="size-4 mr-1.5" /> : <Play className="size-4 mr-1.5" />}
            {playing ? 'Pause [Espace]' : 'Défiler [Espace]'}
          </Button>

          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => {
              if (scrollRef.current) scrollRef.current.scrollTop = 0
            }}
            title="Revenir en haut"
          >
            <RotateCcw className="size-4" />
          </Button>

          <Button size="icon-sm" variant="ghost" onClick={onClose} aria-label="Fermer">
            <X className="size-5" />
          </Button>
        </div>
      </header>

      {/* Focus Beam / Guide Horizontal Line */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 border-y border-primary/40 bg-primary/10 py-8 backdrop-blur-[2px]">
        <div className="flex items-center justify-between px-6 text-[11px] font-mono font-bold tracking-widest text-primary/80 uppercase">
          <span>▶ LECTURE ACTIVE</span>
          <span>ZONE FOCUS EYE-CONTACT ◀</span>
        </div>
      </div>

      {/* Prompter Scrolling Area */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-8 py-48 text-center scrollbar-none teleprompter-mask',
          mirrored && 'scale-x-[-1]'
        )}
      >
        <div className="mx-auto max-w-4xl flex flex-col gap-12 font-heading font-extrabold leading-relaxed text-white">
          {textContent.split('\n\n').map((paragraph, idx) => (
            <p
              key={idx}
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}
              className="drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
