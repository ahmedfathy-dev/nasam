import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AlertTriangle, LoaderCircle, X } from 'lucide-react'
import {
  TODAY_EXCHANGE_RATE,
  type MerchantDetails,
  type MerchantPaymentMethod,
  type SettleAccountPayload,
} from '../../../../data/merchantDetailsData'
import SettlementCalcBox from './SettlementCalcBox'
import SettlementForm from './SettlementForm'
import SettlementSummary from './SettlementSummary'
import {
  isoToDisplayDate,
  todayIso,
  validateSettleForm,
  type SettleFormErrors,
  type SettleFormValues,
} from './settleFormTypes'
import { cn } from '@/lib/cn'

type SettleAccountModalProps = {
  open: boolean
  details: MerchantDetails
  methods: MerchantPaymentMethod[]
  loading: boolean
  onClose: () => void
  onConfirm: (payload: SettleAccountPayload) => void
}

const CURRENT_USER = 'أحمد علي'
const CURRENT_ROLE = 'Super Admin'

function SettleAccountModal({ dialog }: { dialog: SettleAccountModalProps }) {
  const { open, details, loading, onClose, onConfirm } = dialog
  const titleId = useId()
  const formId = useId()
  const dialogRef = useRef<HTMLElement>(null)
  const [values, setValues] = useState<SettleFormValues>(() => emptyValues(details))
  const [errors, setErrors] = useState<SettleFormErrors>({})
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    if (open) {
      setValues(emptyValues(details))
      setErrors({})
      setTouched(false)
    }
  }, [open, details])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !loading) onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>('button.sa-close')?.focus()
    }, 0)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, loading, onClose])

  const rate = Number(values.exchangeRate)
  const actualUsd = Number(values.transferredUsd)
  const netDue = details.cycle.netDueLocal
  const expectedUsd = rate > 0 ? netDue / rate : 0
  const difference = (Number.isFinite(actualUsd) ? actualUsd : 0) - (Number.isFinite(expectedUsd) ? expectedUsd : 0)
  const formErrors = validateSettleForm(values)
  const isValid = Object.keys(formErrors).length === 0

  function updateField<Key extends keyof SettleFormValues>(key: Key, value: SettleFormValues[Key]) {
    setValues((current) => ({ ...current, [key]: value }))
    if (touched) setErrors(validateSettleForm({ ...values, [key]: value }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    const nextErrors = validateSettleForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || loading) return
    onConfirm({
      methodFilter: 'all',
      exchangeRate: Number(values.exchangeRate),
      transferredUsd: Number(values.transferredUsd),
      reference: values.reference.trim(),
      settlementDate: isoToDisplayDate(values.settlementDateIso),
      notes: values.notes.trim(),
      processedBy: CURRENT_USER,
    })
  }

  if (!open) return null

  return (
    <div
      className="sa-backdrop fixed inset-0 z-[70] grid place-items-stretch bg-[rgb(30_43_55_/_45%)] p-0 min-[561px]:place-items-center min-[561px]:p-3 min-[1024px]:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <section
        ref={dialogRef}
        className={cn(
          'sa-modal flex max-h-[100dvh] min-h-[100dvh] w-full max-w-full flex-col overflow-hidden rounded-none border border-line bg-surface',
          'shadow-[0_20px_50px_rgb(30_45_58_/_20%)] animate-[sa-in_160ms_ease-out]',
          'min-[561px]:min-h-0 min-[561px]:max-h-[min(94dvh,900px)] min-[561px]:w-[min(640px,calc(100vw-24px))] min-[561px]:rounded-[14px]',
          'min-[1024px]:max-h-[min(96dvh,920px)] min-[1024px]:w-[min(640px,calc(100vw-32px))]',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <header className="sa-modal-head sticky top-0 z-[2] flex items-start justify-between gap-3.5 border-b border-[#edf0f2] bg-surface p-4 min-[561px]:static min-[561px]:p-[14px_16px_12px] min-[1024px]:p-[18px_22px_16px]">
          <div className="sa-modal-head-copy min-w-0">
            <h2 id={titleId} className="text-[17px] font-bold leading-[1.35] text-[#232a30] min-[561px]:text-[18px] min-[1024px]:text-xl">تسوية حساب التاجر</h2>
            <p className="mt-[5px] text-xs leading-[1.55] text-text-muted max-[560px]:[overflow-wrap:anywhere] max-[560px]:[word-break:break-word]">{details.name} · {details.country} · إغلاق دورة التحصيل الحالية وبدء دورة جديدة</p>
          </div>
          <button type="button" className="sa-close grid size-10 flex-none place-items-center rounded-[7px] border border-[#e7eaed] bg-[#f3f5f6] text-[#6d767e] hover:bg-[#eceff1] hover:text-[#202a30] min-[561px]:size-[30px]" aria-label="إغلاق" disabled={loading} onClick={onClose}>
            <X size={15} />
          </button>
        </header>

        <form id={formId} className="sa-modal-body flex min-h-0 flex-1 flex-col gap-3.5 overflow-x-hidden overflow-y-auto overscroll-contain p-4 min-[561px]:gap-3 min-[561px]:p-4 min-[1024px]:gap-3.5 min-[1024px]:px-[22px] min-[1024px]:py-[18px]" onSubmit={handleSubmit} noValidate>
          <SettlementSummary details={details} />

          <SettlementForm
            form={{
              values,
              errors: touched ? errors : {},
              currency: details.currency,
              todayRate: TODAY_EXCHANGE_RATE,
              disabled: loading,
              onChange: updateField,
            }}
          />

          <SettlementCalcBox
            expectedUsd={expectedUsd}
            actualUsd={Number.isFinite(actualUsd) ? actualUsd : 0}
            difference={difference}
          />

          <div className="sa-warning flex flex-wrap items-start gap-2 rounded-md border border-[#f1e4cf] bg-[#fffaf2] px-3.5 py-3 text-xs leading-[1.7] text-[#947240]" role="note">
            <AlertTriangle size={15} className="mt-0.5 flex-none text-[#d39a3e]" />
            <p>بعد تأكيد التسوية سيتم تصفير أرقام الدورة الحالية وتحويل التحويلات المشمولة إلى «مسوّاة». لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
        </form>

        <footer className="sa-modal-foot sticky bottom-0 z-[2] flex flex-col items-stretch gap-2.5 border-t border-[#edf0f2] bg-white px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] min-[561px]:flex-row min-[561px]:flex-wrap min-[561px]:items-center min-[561px]:justify-between min-[561px]:gap-2.5 min-[561px]:px-4 min-[561px]:py-3 min-[1024px]:px-[22px] min-[1024px]:py-3.5">
          <div className="sa-foot-user order-[-1] whitespace-normal text-[11px] text-text-muted [overflow-wrap:anywhere] min-[561px]:order-none min-[561px]:whitespace-normal min-[1024px]:whitespace-nowrap">المستخدم: {CURRENT_USER} · {CURRENT_ROLE}</div>
          <div className="sa-foot-actions flex flex-col items-stretch gap-2 min-[561px]:flex-row min-[561px]:items-center">
            <button type="submit" form={formId} className="sa-confirm inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm border border-green bg-green px-3.5 text-xs text-white hover:enabled:border-[#2f9630] hover:enabled:bg-[#2f9630] disabled:cursor-not-allowed disabled:opacity-55 min-[561px]:min-h-9 min-[561px]:w-auto" disabled={!isValid || loading}>
              {loading && <LoaderCircle size={14} className="sa-spinner animate-[sa-spin_0.8s_linear_infinite]" />}
              تأكيد التسوية
            </button>
            <button type="button" className="sa-cancel inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm border border-[#e4e9ed] bg-[#f0f1f2] px-3.5 text-xs text-[#56616c] hover:enabled:border-[#d6dade] hover:enabled:bg-[#e7e9eb] min-[561px]:min-h-9 min-[561px]:w-auto" disabled={loading} onClick={onClose}>إلغاء</button>
          </div>
        </footer>
      </section>
    </div>
  )
}

function emptyValues(details: MerchantDetails): SettleFormValues {
  const expected = details.cycle.netDueLocal / TODAY_EXCHANGE_RATE
  return {
    methodFilter: 'all',
    exchangeRate: TODAY_EXCHANGE_RATE.toFixed(2),
    transferredUsd: expected.toFixed(2),
    reference: '',
    settlementDateIso: todayIso(),
    notes: '',
  }
}

export default SettleAccountModal
