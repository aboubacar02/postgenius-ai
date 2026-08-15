'use client'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function OptionChipGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <ToggleGroup
        value={[value]}
        onValueChange={(next) => {
          if (next[0]) onChange(next[0])
        }}
        className="w-full flex-wrap gap-2"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value} variant="chip" size="chip">
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
