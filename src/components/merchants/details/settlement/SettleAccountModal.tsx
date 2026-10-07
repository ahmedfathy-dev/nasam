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
import './SettleAccountModal.css'

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

function SettleAccountModal({ open, details, loading, onClose, onConfirm }: SettleAccountModalProps) {
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
      className="sa-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <section
        ref={dialogRef}
        className="sa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <header className="sa-modal-head">
          <div className="sa-modal-head-copy">
            <h2 id={titleId}>تسوية حساب التاجر</h2>
            <p>{details.name} · {details.country} · إغلاق دورة التحصيل الحالية وبدء دورة جديدة</p>
          </div>
          <button type="button" className="sa-close" aria-label="إغلاق" disabled={loading} onClick={onClose}>
            <X size={15} />
          </button>
        </header>

        <form id={formId} className="sa-modal-body" onSubmit={handleSubmit} noValidate>
          <SettlementSummary details={details} />

          <SettlementForm
            values={values}
            errors={touched ? errors : {}}
            currency={details.currency}
            todayRate={TODAY_EXCHANGE_RATE}
            disabled={loading}
            onChange={updateField}
          />

          <SettlementCalcBox
            expectedUsd={expectedUsd}
            actualUsd={Number.isFinite(actualUsd) ? actualUsd : 0}
            difference={difference}
          />

          <div className="sa-warning" role="note">
            <AlertTriangle size={15} />
            <p>بعد تأكيد التسوية سيتم تصفير أرقام الدورة الحالية وتحويل التحويلات المشمولة إلى «مسوّاة». لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
        </form>

        <footer className="sa-modal-foot">
          <div className="sa-foot-user">المستخدم: {CURRENT_USER} · {CURRENT_ROLE}</div>
          <div className="sa-foot-actions">
            <button type="submit" form={formId} className="sa-confirm" disabled={!isValid || loading}>
              {loading && <LoaderCircle size={14} className="sa-spinner" />}
              تأكيد التسوية
            </button>
            <button type="button" className="sa-cancel" disabled={loading} onClick={onClose}>إلغاء</button>
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
