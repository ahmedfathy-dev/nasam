type SegmentedOption = {
  label: string
  value: string
}

type SegmentedControlProps = {
  value: string
  options: SegmentedOption[]
  onChange: (value: string) => void
  ariaLabel: string
  disabled?: boolean
}

function SegmentedControl({ value, options, onChange, ariaLabel, disabled }: SegmentedControlProps) {
  return (
    <div className="am-segmented" role="group" aria-label={ariaLabel}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={value === option.value ? 'is-active' : ''}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

export default SegmentedControl
