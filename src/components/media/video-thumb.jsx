import { Play } from 'lucide-react'
import { cn } from '../../lib/utils'

const NETWORK_GRADIENTS = {
  tiktok: 'from-[#25F4EE] via-[#FE2C55] to-slate-950',
  reels: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
  shorts: 'from-[#FF0033] via-[#9b1c1c] to-slate-950'
}

export function VideoThumb({ title, network = 'tiktok', duration, className }) {
  return (
    <div
      className={cn(
        'group relative w-full overflow-hidden rounded-lg bg-gradient-to-br',
        NETWORK_GRADIENTS[network] || NETWORK_GRADIENTS.tiktok,
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.28),transparent_58%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,rgba(0,0,0,0.45),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/65 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/30 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <Play className="size-4 fill-white text-white" />
        </div>
      </div>
      {typeof duration === 'number' && (
        <span className="absolute right-1.5 bottom-1.5 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white">
          {duration}s
        </span>
      )}
      {title && (
        <span className="absolute bottom-1.5 left-1.5 max-w-[70%] truncate text-[10px] font-semibold text-white drop-shadow">
          {title}
        </span>
      )}
    </div>
  )
}
