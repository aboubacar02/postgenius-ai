import { createContext, useContext } from 'react'
import { cn } from '../../lib/utils'

const ToggleContext = createContext(null)

function ToggleGroup({ className, variant = 'chip', size = 'chip', type = 'single', value, defaultValue, onValueChange, children, ...props }) {
  const current = value ?? defaultValue ?? []
  return (
    <ToggleContext.Provider value={{ variant, size, type, value: current, setValue: onValueChange }}>
      <div
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        className={cn('flex flex-row flex-wrap items-center gap-2 rounded-lg', className)}
        {...props}
      >
        {children}
      </div>
    </ToggleContext.Provider>
  )
}

const chipClass =
  'rounded-full border border-white/[0.08] bg-transparent text-pg-muted hover:border-white/[0.15] hover:text-pg-text'
const chipOnClass = 'border-primary/40 bg-primary/10 text-primary'
const cardClass =
  'rounded-xl border border-white/[0.06] bg-white/[0.03] text-pg-muted hover:border-white/[0.12] hover:text-pg-text'
const cardOnClass =
  'border-primary/40 bg-primary/15 text-primary'

function ToggleGroupItem({ className, value, variant, size, children, ...props }) {
  const ctx = useContext(ToggleContext)
  const list = Array.isArray(ctx?.value) ? ctx.value : []
  const single = ctx?.type === 'single'
  const on = single
    ? Array.isArray(ctx?.value)
      ? ctx.value.includes(value)
      : ctx?.value === value
    : list.includes(value)
  const v = variant || ctx?.variant || 'default'
  const s = size || ctx?.size || 'default'

  const base = 'group/toggle inline-flex items-center justify-center gap-1 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4'

  const variantClass =
    v === 'chip'
      ? cn(chipClass, on && chipOnClass)
      : v === 'card'
        ? cn(cardClass, on && cardOnClass)
        : v === 'outline'
          ? cn('rounded-lg border border-white/[0.08] bg-transparent hover:bg-white/[0.05] hover:text-pg-text', on && 'bg-white/[0.05]')
          : cn('rounded-lg bg-transparent hover:bg-white/[0.05] hover:text-pg-text', on && 'bg-white/[0.05]')

  const sizeClass = s === 'chip' ? 'h-8 gap-1.5 rounded-full px-3.5 text-[13px]' : s === 'card' ? 'min-h-16 flex-col items-center justify-center gap-1.5 px-3 py-3' : s === 'sm' ? 'h-7 min-w-7 px-2.5 text-[0.8rem]' : s === 'lg' ? 'h-9 min-w-9 px-2.5' : 'h-8 min-w-8 px-2.5'

  return (
    <button
      type="button"
      data-slot="toggle-group-item"
      data-value={value}
      aria-pressed={on}
      onClick={() => {
        if (!ctx?.setValue) return
        if (single) ctx.setValue(on ? [] : [value])
        else ctx.setValue(on ? list.filter((v) => v !== value) : [...list, value])
      }}
      className={cn(base, variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  )
}

export { ToggleGroup, ToggleGroupItem }
