import { cn } from '../../lib/utils'

function Switch({ className, checked = false, onCheckedChange, disabled = false, id, ...props }) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      data-checked={checked || undefined}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange?.(!checked)}
      className={cn(
        'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all duration-200 outline-none cursor-pointer',
        'focus-visible:ring-2 focus-visible:ring-primary/50',
        'hover:brightness-110 active:scale-95',
        'h-[18.4px] w-[32px]',
        checked ? 'bg-primary' : 'bg-white/[0.1] hover:bg-white/[0.15]',
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
        className
      )}
      {...props}
    >
      <span
        className="pointer-events-none block rounded-full bg-white shadow-sm transition-transform duration-200 ease-out"
        style={{ width: 14, height: 14, transform: checked ? 'translateX(15px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

export { Switch }
