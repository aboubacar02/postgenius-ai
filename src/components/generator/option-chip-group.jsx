import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

export function OptionChipGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2.5">
      {label && (
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <ToggleGroup
        value={[value]}
        onValueChange={(next) => {
          if (next[0]) onChange(next[0])
        }}
        className="w-full gap-2"
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}