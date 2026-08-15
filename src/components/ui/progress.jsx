import { cn } from '../../lib/utils'

function Progress({ className, value = 0, gradient = false, ...props }) {
  return (
    <div data-slot="progress" className={cn('flex flex-wrap gap-3', className)} {...props}>
      <div
        className="relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted"
        data-slot="progress-track"
      >
        <div
          className={cn(
            'h-full transition-all',
            gradient ? 'bg-gradient-to-r from-primary to-cyan-400' : 'bg-primary'
          )}
          data-slot="progress-indicator"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

function ProgressLabel({ className, ...props }) {
  return <div className={cn('text-sm font-medium', className)} {...props} />
}

function ProgressValue({ className, ...props }) {
  return <div className={cn('ml-auto text-sm text-muted-foreground tabular-nums', className)} {...props} />
}

export { Progress, ProgressLabel, ProgressValue }