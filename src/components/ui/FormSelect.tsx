import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'

export type FormSelectOption = {
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
  searchable?: boolean
  invalid?: boolean
}

function FormSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
  disabled = false,
  required = false,
  searchable = false,
  invalid = false,
}: FormSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const [query, setQuery] = useState('')
  const visibleOptions = searchable && query.trim()
    ? options.filter((option) => option.label.toLowerCase().includes(query.trim().toLowerCase()))
    : options
  const selectedIndex = Math.max(0, visibleOptions.findIndex((option) => option.value === value))
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
      setActiveIndex((current) => (current + direction + visibleOptions.length) % Math.max(visibleOptions.length, 1))
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setActiveIndex(event.key === 'Home' ? 0 : Math.max(visibleOptions.length - 1, 0))
      setIsOpen(true)
      return
    }

    if ((event.key === 'Enter' || event.key === ' ') && isOpen) {
      event.preventDefault()
      const option = visibleOptions[activeIndex]
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
        aria-invalid={invalid || (required && !value) || undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-option-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => {
          setQuery('')
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
          {searchable && (
            <input
              className="form-select-search"
              value={query}
              placeholder="بحث..."
              aria-label={`بحث في ${ariaLabel}`}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => event.stopPropagation()}
            />
          )}
          {visibleOptions.map((option, index) => {
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
          {!visibleOptions.length && <div className="form-select-empty">لا نتائج</div>}
        </div>
      )}
    </div>
  )
}

export default FormSelect
