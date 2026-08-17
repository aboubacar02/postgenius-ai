import { useState } from 'react'
import { Play } from 'lucide-react'
import { cn } from '../../lib/utils'

const THEMATIC_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&auto=format&fit=crop&q=80', // AI Abstract Purple
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=720&auto=format&fit=crop&q=80', // Tech Microchip
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=720&auto=format&fit=crop&q=80', // Business Skyline
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=720&auto=format&fit=crop&q=80', // Trading Analytics
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=720&auto=format&fit=crop&q=80', // Gaming Setup
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=720&auto=format&fit=crop&q=80', // Fitness Workout
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=720&auto=format&fit=crop&q=80'  // City Night Cinematic
]

const NETWORK_GRADIENTS = {
  tiktok: 'from-[#25F4EE]/40 via-[#FE2C55]/30 to-black',
  reels: 'from-[#F58529]/40 via-[#DD2A7B]/30 to-black',
  shorts: 'from-[#FF0033]/40 via-[#9b1c1c]/30 to-black'
}

function getDeterministicImage(str = '') {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % THEMATIC_COVERS.length
  return THEMATIC_COVERS[index]
}

export function VideoThumb({ title, image, network = 'tiktok', duration, className }) {
  const [imgLoaded, setImgLoaded] = useState(true)
  const coverUrl = image || getDeterministicImage(title || network)

  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden rounded-2xl bg-zinc-950 shadow-md transition-all duration-300',
        className
      )}
    >
      {/* Background HD Image */}
      {coverUrl && imgLoaded && (
        <img
          src={coverUrl}
          alt={title || 'Video cover'}
          onError={() => setImgLoaded(false)}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
      )}

      {/* Atmospheric Theme Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t mix-blend-multiply transition-opacity',
          NETWORK_GRADIENTS[network] || NETWORK_GRADIENTS.tiktok
        )}
      />

      {/* Dark Vignette for typography contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20 pointer-events-none" />

      {/* Central Glowing Play Icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-11 items-center justify-center rounded-full bg-black/60 ring-1 ring-white/30 backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:bg-primary group-hover:ring-primary/50 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.8)]">
          <Play className="size-4.5 fill-white text-white ml-0.5" />
        </div>
      </div>

      {/* Duration Badge */}
      {typeof duration === 'number' && (
        <span className="absolute right-2 top-2 rounded-md bg-black/75 px-2 py-0.5 font-mono text-[10px] font-bold text-white/90 backdrop-blur-md border border-white/10">
          {duration}s
        </span>
      )}
    </div>
  )
}
