import { useEffect, useState } from 'react'
import { Bookmark, Heart, MessageCircle, Music2, Share2 } from 'lucide-react'
import { cn } from '../../lib/utils'

function getCaptions(item) {
  const result = item?.result
  if (Array.isArray(result?.subtitles) && result.subtitles.length) return result.subtitles
  if (Array.isArray(result?.script) && result.script.length) return result.script
  return []
}

const FALLBACK_CAPTIONS = [
  'Personne ne te dira ça…',
  'Alors je le fais pour toi.',
  'Voici le secret en 3 étapes.',
  'Abonne-toi pour la partie 2.'
]

export function PhoneMockup({ item }) {
  const captions = getCaptions(item)
  const lines = captions.length ? captions : FALLBACK_CAPTIONS
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    setIdx(0)
    const id = setInterval(() => setIdx((i) => (i + 1) % lines.length), 2400)
    return () => clearInterval(id)
  }, [lines.length])

  const progress = ((idx + 1) / lines.length) * 100

  return (
    <div className="relative hidden w-[300px] shrink-0 lg:block">
      <div className="absolute -inset-8 rounded-full bg-primary-20 blur-3xl" />
      <div className="premium-edge relative rounded-[2.4rem] border border-foreground-20 bg-black p-2.5 shadow-2xl">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[1.8rem] bg-[radial-gradient(circle_at_70%_20%,#7c3aed_0%,#0e0e14_55%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_85%,rgba(34,211,238,0.28),transparent_55%)]" />

          {/* Barre de temps (format vertical) */}
          <div className="absolute top-2 right-3 left-3 flex gap-1">
            {lines.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
                <div
                  className={cn('h-full bg-white', i < idx ? 'w-full' : i === idx ? 'w-1/3 animate-pulse' : 'w-0')}
                  style={i === idx ? { transition: 'width 0.6s linear' } : undefined}
                />
              </div>
            ))}
          </div>

          {/* Sous-titre central style CapCut */}
          <div key={idx} className="caption-in absolute top-1/3 right-4 left-4">
            <p className="text-center text-lg leading-snug font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {lines[idx]}
            </p>
          </div>

          {/* Barre latérale d'actions (UI TikTok) */}
          <div className="absolute right-2.5 bottom-24 flex flex-col items-center gap-3.5 text-white">
            <div className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-[10px] font-bold ring-2 ring-black">
              PG
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Heart className="size-6 fill-white" />
              <span className="text-[10px] font-semibold">12,4 k</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <MessageCircle className="size-6 fill-white" />
              <span className="text-[10px] font-semibold">892</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Share2 className="size-6 fill-white" />
              <span className="text-[10px] font-semibold">1,2 k</span>
            </div>
            <Bookmark className="size-6" />
          </div>

          {/* Bas : handle + son */}
          <div className="absolute right-4 bottom-6 left-4">
            <p className="text-[13px] font-bold text-white drop-shadow">
              @creator · {item?.title || 'Votre prochain hit'}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-white/90">
              <Music2 className="size-3.5" />
              <span className="truncate text-[10px]">son viral — extrait original</span>
              <span className="feed-eq ml-1 text-white">
                <span />
                <span />
                <span />
                <span />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
