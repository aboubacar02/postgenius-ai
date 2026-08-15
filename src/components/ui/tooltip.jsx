import { cn } from '../../lib/utils'

function Tooltip({ children, content, className }) {
  return (
    <span className="group/tippy relative inline-flex" data-slot="tooltip">
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-1.5 -translate-x-1/2 rounded-md bg-popover px-2 py-1 text-xs font-medium whitespace-nowrap text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/tippy:opacity-100',
          className
        )}
      >
        {content}
      </span>
    </span>
  )
}

export { Tooltip }