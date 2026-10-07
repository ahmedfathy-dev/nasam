import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import FormSelect from '../ui/FormSelect'
import {
  countryCurrencies,
  merchantCountries,
  merchantCurrencies,
  type MerchantFormValues,
} from '../../data/merchantsData'
import { validateMerchantForm, type MerchantFormErrors } from './validateMerchantForm'
import './MerchantUi.css'

type MerchantFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initialValues: MerchantFormValues
  loading: boolean
  onClose: () => void
  onSubmit: (values: MerchantFormValues) => void
}

function MerchantFormModal({ open, mode, initialValues, loading, onClose, onSubmit }: MerchantFormModalProps) {
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
    <div className="merchant-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onClose() }}>
      <section className="merchant-modal" role="dialog" aria-modal="true" aria-labelledby="merchant-form-title">
        <header className="merchant-modal-head">
          <div>
            <h2 id="merchant-form-title">{mode === 'create' ? 'إضافة تاجر' : 'تعديل التاجر'}</h2>
            <p>{mode === 'create' ? 'أدخل بيانات التاجر الأساسية' : 'حدّث بيانات التاجر ثم احفظ التغييرات'}</p>
          </div>
          <button type="button" className="merchant-modal-close" aria-label="إغلاق" disabled={loading} onClick={onClose}><X size={14} /></button>
        </header>

        <form className="merchant-modal-form" onSubmit={handleSubmit} noValidate>
          <label className="merchant-modal-field">
            <span>اسم التاجر <b>*</b></span>
            <input value={values.name} onChange={(event) => updateField('name', event.target.value)} placeholder="اسم التاجر" aria-invalid={Boolean(errors.name)} disabled={loading} />
            {errors.name && <small className="merchant-field-error">{errors.name}</small>}
          </label>

          <label className="merchant-modal-field">
            <span>الدولة <b>*</b></span>
            <FormSelect
              className="form-select-field merchant-modal-select"
              ariaLabel="الدولة"
              value={values.country}
              onChange={(value) => updateField('country', value)}
              options={merchantCountries.map((item) => ({ label: item, value: item }))}
            />
            {errors.country && <small className="merchant-field-error">{errors.country}</small>}
          </label>

          <label className="merchant-modal-field">
            <span>رقم الهاتف <b>*</b></span>
            <input type="tel" dir="ltr" value={values.phone} onChange={(event) => updateField('phone', event.target.value)} placeholder="+20 100 000 0000" aria-invalid={Boolean(errors.phone)} disabled={loading} />
            {errors.phone && <small className="merchant-field-error">{errors.phone}</small>}
          </label>

          <div className="merchant-modal-row">
            <label className="merchant-modal-field">
              <span>نوع العمولة <b>*</b></span>
              <FormSelect
                className="form-select-field merchant-modal-select"
                ariaLabel="نوع العمولة"
                value={values.commissionType}
                onChange={(value) => updateField('commissionType', value as MerchantFormValues['commissionType'])}
                options={[
                  { label: 'نسبة مئوية', value: 'percent' },
                  { label: 'مبلغ ثابت', value: 'fixed' },
                ]}
              />
            </label>
            <label className="merchant-modal-field">
              <span>العمولة <b>*</b></span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={values.commissionValue}
                onChange={(event) => updateField('commissionValue', event.target.value)}
                placeholder={values.commissionType === 'percent' ? '2' : '30'}
                aria-invalid={Boolean(errors.commissionValue)}
                disabled={loading}
              />
              {errors.commissionValue && <small className="merchant-field-error">{errors.commissionValue}</small>}
            </label>
          </div>

          <label className="merchant-modal-field">
            <span>العملة <b>*</b></span>
            <FormSelect
              className="form-select-field merchant-modal-select"
              ariaLabel="العملة"
              value={values.currency}
              onChange={(value) => updateField('currency', value)}
              options={merchantCurrencies.map((item) => ({ label: item, value: item }))}
            />
            {errors.currency && <small className="merchant-field-error">{errors.currency}</small>}
          </label>

          <label className="merchant-modal-field">
            <span>الحالة <b>*</b></span>
            <FormSelect
              className="form-select-field merchant-modal-select"
              ariaLabel="حالة التاجر"
              value={values.status}
              onChange={(value) => updateField('status', value as MerchantFormValues['status'])}
              options={[
                { label: 'نشط', value: 'نشط' },
                { label: 'موقوف', value: 'موقوف' },
              ]}
            />
            {errors.status && <small className="merchant-field-error">{errors.status}</small>}
          </label>

          <footer className="merchant-modal-actions">
            <button type="button" className="traders-tool-button" disabled={loading} onClick={onClose}>إلغاء</button>
            <button type="submit" className="traders-primary-button" disabled={loading}>
              {loading ? 'جاري الحفظ...' : mode === 'create' ? 'إضافة التاجر' : 'حفظ التعديلات'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MerchantFormModal
