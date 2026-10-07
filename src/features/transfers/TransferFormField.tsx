import { useId, type ReactNode } from 'react'
import type { TransferFormValues } from './types'

type TransferFormFieldProps = {
  fieldKey?: keyof TransferFormValues
  label: string
  required?: boolean
  error?: string
  hint?: string
  wide?: boolean
  children: ReactNode
}

function TransferFormField({
  fieldKey,
  label,
  required,
  error,
  hint,
  wide,
  children,
}: TransferFormFieldProps) {
  const hintId = useId()

  function focusControl() {
    const root = document.querySelector(`[data-field="${fieldKey}"] .transfer-field-control`)
    const control = root?.querySelector<HTMLElement>('input, textarea, button.form-select-trigger')
    control?.focus()
  }

  return (
    <div className={`transfer-field ${wide ? 'is-wide' : ''}`} data-field={fieldKey}>
      <span className="transfer-field-label" onClick={focusControl}>
        {label}{required ? <b> *</b> : null}
      </span>
      <div className="transfer-field-control">
        {children}
      </div>
      {hint ? <em id={hintId} className="transfer-field-hint">{hint}</em> : null}
      {error ? <small className="transfer-field-error" role="alert">{error}</small> : null}
    </div>
  )
}

export default TransferFormField
