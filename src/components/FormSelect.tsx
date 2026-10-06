import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'

type FormSelectOption = {
  label: string
  value: string
}

type FormSelectProps = {
  value: string
  options: FormSelectOption[]
  onChange: (value: string) => void
  ariaLabel: string
  className?: string
  disabled?: boolean
  required?: boolean
}

function FormSelect({ value, options, onChange, ariaLabel, className = '', disabled = false, required = false }: FormSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(selectedIndex)

  useEffect(() => {
    if (!isOpen) return

    function closeWhenOutside(event: PointerEvent | FocusEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', closeWhenOutside)
    document.addEventListener('focusin', closeWhenOutside)
    return () => {
      document.removeEventListener('pointerdown', closeWhenOutside)
      document.removeEventListener('focusin', closeWhenOutside)
    }
  }, [isOpen])

  function chooseOption(option: FormSelectOption) {
    onChange(option.value)
    setIsOpen(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      setIsOpen(false)
      return
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        setActiveIndex(selectedIndex)
        setIsOpen(true)
        return
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((current) => (current + direction + options.length) % options.length)
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
      setIsOpen(true)
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) chooseOption(option)
    }
  }

  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  return (
    <div ref={rootRef} className={`form-select-root ${className}`.trim()}>
      <button
        type="button"
        className="form-select-trigger"
        role="combobox"
        aria-label={ariaLabel}
        aria-required={required || undefined}
        aria-invalid={required && !value ? true : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => {
          setActiveIndex(selectedIndex)
          setIsOpen((open) => !open)
        }}
        onKeyDown={handleKeyDown}
      >
        <span className="form-select-value">{selectedOption?.label ?? ''}</span>
        <ChevronDown className={`form-select-chevron ${isOpen ? 'is-open' : ''}`} size={13} aria-hidden="true" />
      </button>
      {isOpen && (
        <div id={listId} className="form-select-menu" role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value
            return (
              <button
                key={option.value}
                id={`${listId}-option-${index}`}
                type="button"
                className={`form-select-option ${isSelected ? 'is-selected' : ''} ${activeIndex === index ? 'is-active' : ''}`}
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => chooseOption(option)}
              >
                <span>{option.label}</span>
                {isSelected && <Check size={13} aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FormSelect
