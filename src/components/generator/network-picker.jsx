import { cn } from '../../lib/utils'

export function NetworkPicker({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-3.5 text-center transition-all duration-200',
              active
                ? 'border-primary/60 bg-primary/15 text-primary ring-2 ring-primary/40 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                : 'border-border/70 bg-card/60 text-muted-foreground hover:border-primary/30 hover:bg-card hover:text-foreground'
            )}
          >
            {active && (
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
            )}
            <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
              {option.emoji}
            </span>
            <span className="text-xs font-semibold">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
