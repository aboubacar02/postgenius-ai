import { cn } from '../../lib/utils'

const PALETTES = [
  'from-primary via-violet-500 to-fuchsia-500',
  'from-amber-400 via-rose-500 to-pink-500',
  'from-cyan-400 via-sky-500 to-blue-600',
  'from-emerald-400 via-teal-500 to-cyan-600'
]

export function GradientAvatar({ initials, className }) {
  const index = (initials.charCodeAt(0) || 0) % PALETTES.length
  return (
    <div
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ring-1 ring-white/20',
        PALETTES[index],
        className
      )}
    >
      {initials}
    </div>
  )
}
