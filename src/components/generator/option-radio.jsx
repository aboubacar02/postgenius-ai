import { cn } from '../../lib/utils'

export function OptionRadio({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const on = option.value === value
        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-all',
              on
                ? 'border-primary-40 bg-primary-10 text-foreground'
                : 'border-input bg-background-40 text-muted-foreground hover:bg-white/5'
            )}
          >
            <span
              className={cn(
                'flex size-4 shrink-0 items-center justify-center rounded-full border',
                on ? 'border-primary' : 'border-muted-foreground'
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full',
                  on ? 'bg-primary' : 'bg-transparent'
                )}
              />
            </span>
            <input
              type="radio"
              className="sr-only"
              checked={on}
              onChange={() => onChange(option.value)}
            />
            <span className="font-medium text-foreground">{option.label}</span>
            {option.hint && <span className="ml-auto text-xs text-muted-foreground">{option.hint}</span>}
          </label>
        )
      })}
    </div>
  )
}
