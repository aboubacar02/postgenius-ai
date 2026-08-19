import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const buttonVariants = {
  variants: {
    variant: {
      default:
        'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] hover:shadow-[0_0_32px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98]',
      outline:
        'border border-white/[0.12] bg-white/[0.03] text-pg-text hover:bg-white/[0.06] hover:border-cyan-400/40 hover:shadow-[0_0_16px_rgba(56,189,248,0.12)]',
      secondary: 'bg-white/[0.05] text-pg-text hover:bg-white/[0.08]',
      ghost: 'hover:bg-white/[0.05] text-pg-text',
      destructive:
        'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-8 gap-1.5 px-3 text-sm',
      xs: 'h-6 gap-1 px-2 text-xs',
      sm: 'h-7 gap-1 px-2.5 text-[13px]',
      lg: 'h-9 gap-1.5 px-4 text-sm',
      icon: 'size-8',
      'icon-sm': 'size-7'
    }
  }
}

export function Button({
  className,
  variant = 'default',
  size = 'default',
  type = 'button',
  loading = false,
  render,
  ...props
}) {
  const v = buttonVariants.variants
  const cls = cn(
    'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none',
    'focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50',
    v.variant[variant],
    v.size[size],
    loading && 'pointer-events-none cursor-wait',
    className
  )

  if (loading) {
    return (
      <span className={cls} aria-busy="true" aria-disabled="true">
        <Loader2 className="size-4 animate-spin" />
        <span className="sr-only">Chargement…</span>
      </span>
    )
  }

  if (render) {
    return (
      <render.type
        {...render.props}
        type={type}
        className={cls}
        {...props}
      />
    )
  }
  return (
    <button type={type} data-slot="button" className={cls} {...props} />
  )
}

export { buttonVariants }
