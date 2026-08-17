import { cn } from '../../lib/utils'

export function OptionChipGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <div className="flex flex-wrap items-center gap-2">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                'rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200',
                active
                  ? 'border-primary/60 bg-primary/15 text-primary ring-1 ring-primary/40 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                  : 'border-border/70 bg-card/60 text-muted-foreground hover:border-primary/30 hover:bg-card hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
