import { cn } from '../../lib/utils'

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex w-full min-h-16 rounded-lg border border-input bg-card px-2.5 py-2 text-base transition-colors outline-none',
        'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring-50',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-card',
        'md:text-sm',
        'hover:border-input-60',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
