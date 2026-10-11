import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../ui/FormSelect'
import {
  countryCurrencies,
  merchantCountries,
  merchantCurrencies,
  type MerchantFormValues,
} from '../../data/merchantsData'
import { validateMerchantForm, type MerchantFormErrors } from './validateMerchantForm'
import {
  merchantFieldError,
  merchantModalActions,
  merchantModalBackdrop,
  merchantModalClose,
  merchantModalField,
  merchantModalFieldInput,
  merchantModalForm,
  merchantModalHead,
  merchantModal,
  merchantModalRow,
  tradersPrimaryButton,
  tradersToolButton,
} from './merchantTw'

type MerchantFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: MerchantFormValues
  loading: boolean
  onClose: () => void
  onSubmit: (values: MerchantFormValues) => void
}

function MerchantFormModal({ dialog }: { dialog: MerchantFormModalProps }) {
  const { open, mode, initialValues, loading, onClose, onSubmit } = dialog
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<MerchantFormErrors>({})

  useEffect(() => {
    if (open) {
      setValues(initialValues)
      setErrors({})
    }
  }, [open, initialValues])

  if (!open) return null

  function updateField<Key extends keyof MerchantFormValues>(key: Key, value: MerchantFormValues[Key]) {
    setValues((current) => {
      if (key === 'country' && typeof value === 'string') {
        return { ...current, country: value, currency: countryCurrencies[value] ?? current.currency }
      }
      return { ...current, [key]: value }
    })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateMerchantForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(values)
  }

  return (
    <div className={merchantModalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose() }}>
      <section className={merchantModal} role="dialog" aria-modal="true" aria-labelledby="merchant-form-title">
        <header className={merchantModalHead}>
          <div>
            <h2 id="merchant-form-title" className="text-[13px] font-semibold text-[#272f35]">{mode === 'create' ? 'إضافة تاجر' : 'تعديل التاجر'}</h2>
            <p className="mt-0.5 text-[9px] text-[#7e878e]">{mode === 'create' ? 'أدخل بيانات التاجر الأساسية' : 'حدّث بيانات التاجر ثم احفظ التغييرات'}</p>
          </div>
          <button type="button" className={merchantModalClose} aria-label="إغلاق" disabled={loading} onClick={onClose}><X size={14} /></button>
        </header>

        <form className={merchantModalForm} onSubmit={handleSubmit} noValidate>
          <label className={merchantModalField}>
            <span>اسم التاجر <b className="font-medium text-[#dc4848]">*</b></span>
            <input className={merchantModalFieldInput} value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="اسم التاجر" aria-invalid={Boolean(errors.name)} disabled={loading} />
            {errors.name && <small className={merchantFieldError}>{errors.name}</small>}
          </label>

          <label className={merchantModalField}>
            <span>الدولة <b className="font-medium text-[#dc4848]">*</b></span>
            <FormSelect
              field={{
                className: 'h-[30px] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] text-[8px] text-[#454e55] transition-[border-color,background-color,box-shadow] duration-150 hover:not-has-[:disabled]:border-[#cbd5dc] hover:not-has-[:disabled]:bg-white focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)] has-[[aria-invalid=true]]:border-[#d95f5f] has-[[aria-invalid=true]]:shadow-[0_0_0_3px_rgb(217_95_95_/_10%)] has-[:disabled]:border-[#e8ebee] has-[:disabled]:bg-[#f0f2f4] has-[:disabled]:text-[#9aa2a9] has-[:disabled]:shadow-none [&_.form-select-trigger]:!text-[10px]',
                ariaLabel: 'الدولة',
                value: values.country,
                invalid: Boolean(errors.country),
                onChange: (value) => updateField('country', value),
                options: merchantCountries.map((item) => ({ label: item, value: item })),
              }}
            />
            {errors.country && <small className={merchantFieldError}>{errors.country}</small>}
          </label>

          <label className={merchantModalField}>
            <span>رقم الهاتف <b className="font-medium text-[#dc4848]">*</b></span>
            <input className={merchantModalFieldInput} type="tel" dir="ltr" value={values.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+20 100 000 0000" aria-invalid={Boolean(errors.phone)} disabled={loading} />
            {errors.phone && <small className={merchantFieldError}>{errors.phone}</small>}
          </label>

          <div className={merchantModalRow}>
            <label className={merchantModalField}>
              <span>نوع العمولة <b className="font-medium text-[#dc4848]">*</b></span>
              <FormSelect
                field={{
                  className: 'h-[30px] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] text-[8px] text-[#454e55] transition-[border-color,background-color,box-shadow] duration-150 hover:not-has-[:disabled]:border-[#cbd5dc] hover:not-has-[:disabled]:bg-white focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)] has-[[aria-invalid=true]]:border-[#d95f5f] has-[[aria-invalid=true]]:shadow-[0_0_0_3px_rgb(217_95_95_/_10%)] has-[:disabled]:border-[#e8ebee] has-[:disabled]:bg-[#f0f2f4] has-[:disabled]:text-[#9aa2a9] has-[:disabled]:shadow-none [&_.form-select-trigger]:!text-[10px]',
                  ariaLabel: 'نوع العمولة',
                  value: values.commissionType,
                  onChange: (value) => updateField('commissionType', value as MerchantFormValues['commissionType']),
                  options: [
                    { label: 'نسبة مئوية', value: 'percent' },
                    { label: 'مبلغ ثابت', value: 'fixed' },
                  ],
                }}
              />
            </label>
            <label className={merchantModalField}>
              <span>العمولة <b className="font-medium text-[#dc4848]">*</b></span>
              <input
                className={merchantModalFieldInput}
                type="number"
                min="0"
                step="0.1"
                value={values.commissionValue}
                onChange={(event) => updateField('commissionValue', event.target.value)}
                placeholder={values.commissionType === 'percent' ? '2' : '30'}
                aria-invalid={Boolean(errors.commissionValue)}
                disabled={loading}
              />
              {errors.commissionValue && <small className={merchantFieldError}>{errors.commissionValue}</small>}
            </label>
          </div>

          <label className={merchantModalField}>
            <span>العملة <b className="font-medium text-[#dc4848]">*</b></span>
            <FormSelect
              field={{
                className: 'h-[30px] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] text-[8px] text-[#454e55] transition-[border-color,background-color,box-shadow] duration-150 hover:not-has-[:disabled]:border-[#cbd5dc] hover:not-has-[:disabled]:bg-white focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)] has-[[aria-invalid=true]]:border-[#d95f5f] has-[[aria-invalid=true]]:shadow-[0_0_0_3px_rgb(217_95_95_/_10%)] has-[:disabled]:border-[#e8ebee] has-[:disabled]:bg-[#f0f2f4] has-[:disabled]:text-[#9aa2a9] has-[:disabled]:shadow-none [&_.form-select-trigger]:!text-[10px]',
                ariaLabel: 'العملة',
                value: values.currency,
                invalid: Boolean(errors.currency),
                onChange: (value) => updateField('currency', value),
                options: merchantCurrencies.map((item) => ({ label: item, value: item })),
              }}
            />
            {errors.currency && <small className={merchantFieldError}>{errors.currency}</small>}
          </label>

          <label className={merchantModalField}>
            <span>الحالة <b className="font-medium text-[#dc4848]">*</b></span>
            <FormSelect
              field={{
                className: 'h-[30px] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] text-[8px] text-[#454e55] transition-[border-color,background-color,box-shadow] duration-150 hover:not-has-[:disabled]:border-[#cbd5dc] hover:not-has-[:disabled]:bg-white focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)] has-[[aria-invalid=true]]:border-[#d95f5f] has-[[aria-invalid=true]]:shadow-[0_0_0_3px_rgb(217_95_95_/_10%)] has-[:disabled]:border-[#e8ebee] has-[:disabled]:bg-[#f0f2f4] has-[:disabled]:text-[#9aa2a9] has-[:disabled]:shadow-none [&_.form-select-trigger]:!text-[10px]',
                ariaLabel: 'حالة التاجر',
                value: values.status,
                onChange: (value) => updateField('status', value as MerchantFormValues['status']),
                options: [
                  { label: 'نشط', value: 'نشط' },
                  { label: 'موقوف', value: 'موقوف' },
                ],
              }}
            />
            {errors.status && <small className={merchantFieldError}>{errors.status}</small>}
          </label>

          <footer className={merchantModalActions}>
            <button type="button" className={cn(tradersToolButton, 'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]')} disabled={loading} onClick={onClose}>إلغاء</button>
            <button type="submit" className={cn(tradersPrimaryButton, 'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]')} disabled={loading}>
              {loading ? 'جاري الحفظ...' : mode === 'create' ? 'إضافة التاجر' : 'حفظ التعديلات'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MerchantFormModal
