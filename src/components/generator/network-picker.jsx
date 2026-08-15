import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'

export function NetworkPicker({ options, value, onChange }) {
  return (
    <ToggleGroup
      variant="card"
      size="card"
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onChange(next[0])
      }}
      className="grid w-full grid-cols-3 gap-3"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          className="gap-1.5 text-sm font-medium"
        >
          <span className="text-xl">{option.emoji}</span>
          <span className="text-center text-sm font-medium">{option.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
