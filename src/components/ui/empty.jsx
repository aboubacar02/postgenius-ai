import { cn } from '../../lib/utils'

function Empty({ className, children, ...props }) {
  return (
    <div
      data-slot="empty"
      className={cn('relative flex w-full flex-col gap-8 p-10', className)}
      {...props}
    >
      {children}
    </div>
  )
}

function EmptyHeader({ className, ...props }) {
  return (
    <div data-slot="empty-header" className={cn('mx-auto flex flex-col items-center gap-2 text-center', className)} {...props} />
  )
}

function EmptyMedia({ className, children, ...props }) {
  return (
    <div
      data-slot="empty-media"
      className={cn(
        'relative flex size-11 items-center justify-center overflow-hidden rounded-full border-2 border-transparent bg-muted',
        'group-data-hovered/empty:bg-muted-60',
        '[&>svg]:size-5 [&>svg]:text-muted-foreground',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function EmptyTitle({ className, ...props }) {
  return <h3 data-slot="empty-title" className={cn('text-base font-medium', className)} {...props} />
}

function EmptyDescription({ className, ...props }) {
  return (
    <p data-slot="empty-description" className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
}

export { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription }