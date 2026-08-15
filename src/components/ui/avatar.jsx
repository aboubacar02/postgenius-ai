import { cn } from '../../lib/utils'

function Avatar({ className, ...props }) {
  return (
    <div
      data-slot="avatar"
      className={cn('group/avatar relative flex size-8 shrink-0 rounded-full select-none', className)}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }) {
  return <img data-slot="avatar-image" className={cn('aspect-square size-full rounded-full object-cover', className)} {...props} />
}

function AvatarFallback({ className, ...props }) {
  return (
    <div
      data-slot="avatar-fallback"
      className={cn('flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }