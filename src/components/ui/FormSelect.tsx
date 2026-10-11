import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export type FormSelectOption = {
  label: string
  value: string
}

/** More than three inputs travel as one object so call sites do not drill each field separately. */
export type FormSelectField = {
  value: string
  options?: FormSelectOption[] | null
  onChange: (value: string) => void
  ariaLabel: string
  className?: string
  disabled?: boolean
  required?: boolean
  searchable?: boolean
  invalid?: boolean
}

type FormSelectProps = {
  field: FormSelectField
}

function normalizeOptions(options: FormSelectField['options']) {
  if (!Array.isArray(options)) return []
  return options.filter((option): option is FormSelectOption => Boolean(option?.value) && typeof option.label === 'string')
}

function FormSelect({ field }: FormSelectProps) {
  const value = field.value ?? ''
  const options = normalizeOptions(field.options)
  const onChange = field.onChange
  const ariaLabel = field.ariaLabel || 'اختيار'
  const className = field.className ?? ''
  const disabled = Boolean(field.disabled)
  const required = Boolean(field.required)
  const searchable = Boolean(field.searchable)
  const invalid = Boolean(field.invalid)
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
    if (disabled) setIsOpen(false)
  }, [disabled])

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

  function chooseOption(option: FormSelectOption | undefined) {
    if (!option || disabled) return
    onChange(option.value)
    setQuery('')
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
    <div ref={rootRef} className={cn('form-select-root relative w-full min-w-0 has-[.form-select-menu]:z-40', className)}>
      <button
        type="button"
        className="form-select-trigger flex h-full w-full cursor-pointer items-center justify-between gap-2 rounded-[inherit] border-0 bg-transparent px-2 text-start font-[inherit] text-inherit focus-visible:!outline-none disabled:cursor-not-allowed"
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
        <span className="form-select-value min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{selectedOption?.label ?? ''}</span>
        <ChevronDown className={cn('form-select-chevron shrink-0 text-[#7f8b95] transition-[transform,color] duration-150', isOpen && 'rotate-180 text-blue')} size={13} aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          id={listId}
          className="form-select-menu absolute inset-x-0 top-[calc(100%+5px)] z-50 max-h-[min(260px,42vh)] overflow-y-auto rounded-lg border border-[#e2e8ec] bg-white p-[5px] shadow-[0_12px_30px_rgb(30_45_58_/_15%)] animate-[form-select-in_120ms_ease-out]"
          role="listbox"
          aria-label={ariaLabel}
        >
          {searchable && (
            <input
              className="form-select-search mb-1 h-8 w-full rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] px-[9px] text-[11px] text-[#46515b] outline-0"
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
                key={`${option.value}-${index}`}
                id={`${listId}-option-${index}`}
                type="button"
                className={cn(
                  'form-select-option flex min-h-8 w-full cursor-pointer items-center justify-between gap-[9px] rounded-[5px] border-0 bg-transparent px-[9px] py-1.5 text-start font-[inherit] text-[9px] text-[#46515b] transition-[background-color,color] duration-[120ms]',
                  'hover:bg-[#f1f7fa]',
                  !isSelected && 'hover:text-[#167fb9]',
                  activeIndex === index && 'is-active bg-[#f1f7fa]',
                  activeIndex === index && !isSelected && 'text-[#167fb9]',
                  isSelected && 'is-selected font-semibold text-[#247fae] [&_svg]:text-green',
                )}
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
          {!visibleOptions.length && <div className="form-select-empty px-2 py-2.5 text-center text-[11px] text-[#8b949b]">لا نتائج</div>}
        </div>
      )}
    </div>
  )
}

export default FormSelect
