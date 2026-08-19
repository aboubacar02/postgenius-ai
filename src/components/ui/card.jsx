import { cn } from '../../lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        'group/card relative flex flex-col gap-4 overflow-hidden rounded-[14px] border border-white/[0.09] bg-white/[0.04] backdrop-blur-lg py-4 text-sm text-pg-text',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn('grid auto-rows-min items-start gap-1 rounded-t-lg px-4', className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return <div data-slot="card-title" className={cn('text-base leading-snug font-medium', className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <div data-slot="card-description" className={cn('text-sm text-pg-muted', className)} {...props} />
}

function CardAction({ className, ...props }) {
  return <div data-slot="card-action" className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn('px-4', className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center rounded-b-lg border-t border-white/[0.06] bg-white/[0.02] p-4', className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
