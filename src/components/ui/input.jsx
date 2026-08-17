import { cn } from '../../lib/utils'

function Input({ className, type = 'text', ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'h-8 w-full min-w-0 rounded-md border border-input bg-card px-2.5 py-1 text-base transition-colors outline-none',
        'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring-50',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:bg-card',
        'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
        'md:text-sm',
        'hover:border-input-60',
        className
      )}
      {...props}
    />
  )
}

export { Input }
