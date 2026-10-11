import { cn } from '@/lib/cn'

type SegmentedOption = {
  label: string
  value: string
}

type SegmentedControlState = {
  value: string
  options?: SegmentedOption[]
  onChange: (value: string) => void
  ariaLabel: string
  disabled?: boolean
}

function SegmentedControl({ control }: { control: SegmentedControlState }) {
  const options = (control.options ?? []).filter((option) => option?.value)
  if (!options.length) return null
  return (
    <div
      className="am-segmented grid h-10 grid-cols-2 gap-0 rounded-sm border border-[#e5e8ea] bg-[#f3f5f6] p-[3px]"
      role="group"
      aria-label={control.ariaLabel || 'اختيار'}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(
            'rounded-[6px] border border-transparent bg-transparent text-[11px] text-[#68727a]',
            control.value === option.value && 'is-active border-green-border bg-green-soft font-bold text-green',
          )}
          disabled={control.disabled}
          onClick={() => control.onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedControl
