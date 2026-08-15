import { cn } from '../../lib/utils'

const buttonVariants = {
  variants: {
    variant: {
      default:
        'bg-primary text-primary-foreground border-t border-white/15 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:bg-primary-80 hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]',
      outline:
        'border border-border bg-transparent text-foreground hover:border-primary-40 hover:bg-primary-10 hover:text-primary',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-muted-60',
      ghost: 'hover:bg-muted hover:text-foreground',
      destructive:
        'bg-destructive-10 text-destructive hover:bg-destructive-20',
      link: 'text-primary underline-offset-4 hover:underline'
    },
    size: {
      default: 'h-8 gap-1.5 px-2.5 text-sm',
      xs: 'h-6 gap-1 px-2 text-xs',
      sm: 'h-7 gap-1 px-2.5 text-[0.8rem]',
      lg: 'h-9 gap-1.5 px-2.5 text-sm',
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
  render,
  ...props
}) {
  const v = buttonVariants.variants
  const cls = cn(
    'group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none',
    'focus-visible:ring-2 focus-visible:ring-ring-50 disabled:pointer-events-none disabled:opacity-50',
    'hover:-translate-y-px active:translate-y-0 active:scale-[0.97]',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    v.variant[variant],
    v.size[size],
    className
  )
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