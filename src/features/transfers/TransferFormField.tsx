import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
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
  field,
  children,
}: {
  field: Omit<TransferFormFieldProps, 'children'>
  children: ReactNode
}) {
  const { fieldKey, label, required, error, hint, wide } = field
  const hintId = useId()

  function focusControl() {
    const root = document.querySelector(`[data-field="${fieldKey}"] .transfer-field-control`)
    const control = root?.querySelector<HTMLElement>('input, textarea, button.form-select-trigger')
    control?.focus()
  }

  return (
    <div
      className={cn(
        /* `transfer-field` retained for focus helpers + DashboardPrimitives.css */
        'transfer-field grid min-w-0 grid-rows-[auto_42px_auto] content-start gap-1.5 text-[12px] font-medium text-[#3d4650]',
        wide && 'col-span-full grid-rows-[auto_auto_auto]',
      )}
      data-field={fieldKey}
    >
      <span
        className="transfer-field-label min-h-[18px] cursor-default text-[12px] font-medium leading-[18px] text-[#4a535a]"
        onClick={focusControl}
      >
        {label}{required ? <b className="font-semibold text-danger"> *</b> : null}
      </span>
      <div
        className={cn(
          'transfer-field-control h-[42px] min-w-0',
          wide && 'h-auto min-h-[84px]',
          /* Direct control styling for native inputs / textarea / FormSelect */
          '[&>input]:box-border [&>input]:h-[42px] [&>input]:w-full [&>input]:min-w-0 [&>input]:border [&>input]:border-[#e5e8ea] [&>input]:bg-[#f7f8f9] [&>input]:px-3 [&>input]:text-base [&>input]:text-[#343d44] [&>input]:outline-0 [&>input]:font-[inherit] [&>input]:rounded-sm',
          'min-[561px]:[&>input]:text-[13px]',
          '[&>input:focus]:border-green [&>input:focus]:bg-surface [&>input:focus]:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
          '[&>input.is-readonly]:cursor-default [&>input.is-readonly]:border-[#e5e8ea] [&>input.is-readonly]:bg-surface [&>input.is-readonly]:font-semibold [&>input.is-readonly]:tracking-[0.01em] [&>input.is-readonly]:text-[#3f4850]',
          '[&>input.is-readonly[dir=ltr]]:text-end',
          '[&>input[dir=ltr]:not(.is-readonly)]:text-end',
          '[&>input.is-ocr]:border-[#d7ebd2] [&>input.is-ocr]:bg-[#f3faf1]',
          '[&>textarea]:box-border [&>textarea]:h-auto [&>textarea]:min-h-[84px] [&>textarea]:w-full [&>textarea]:min-w-0 [&>textarea]:resize-y [&>textarea]:border [&>textarea]:border-[#e5e8ea] [&>textarea]:bg-[#f7f8f9] [&>textarea]:px-3 [&>textarea]:py-2.5 [&>textarea]:text-base [&>textarea]:leading-[1.5] [&>textarea]:text-[#343d44] [&>textarea]:outline-0 [&>textarea]:font-[inherit] [&>textarea]:rounded-sm',
          'min-[561px]:[&>textarea]:text-[13px]',
          '[&>textarea:focus]:border-green [&>textarea:focus]:bg-surface [&>textarea:focus]:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
          '[&>.form-select-root]:box-border [&>.form-select-root]:h-[42px] [&>.form-select-root]:w-full [&>.form-select-root]:min-w-0',
        )}
      >
        {children}
      </div>
      {hint ? (
        <em id={hintId} className="transfer-field-hint mt-0 block min-h-4 text-start text-[11px] not-italic leading-[1.45] text-[#95a0a7]">
          {hint}
        </em>
      ) : null}
      {error ? (
        <small className="transfer-field-error text-[12px] text-danger" role="alert">{error}</small>
      ) : null}
    </div>
  )
}

export default TransferFormField
