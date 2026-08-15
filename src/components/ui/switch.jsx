import { cn } from '../../lib/utils'

function Switch({ className, checked = false, onCheckedChange, id, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      data-checked={checked || undefined}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring-50',
        'h-[18.4px] w-[32px]',
        checked ? 'bg-primary' : 'bg-input-80',
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none block rounded-full bg-background transition-transform"
        style={{ width: 16, height: 16, transform: checked ? 'translateX(14px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

export { Switch }