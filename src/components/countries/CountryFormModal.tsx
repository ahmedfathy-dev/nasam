import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import {
  currencyOptions,
  emptyCountryForm,
  methodsSummaryLabel,
  type CountryFormValues,
  type CountryMethod,
  type ManagedCountry,
} from '../../data/countriesData'
import { createMethodDraft } from '../../services/countryService'
import FormSelect from '../ui/FormSelect'
import './CountryFormModal.css'

type CountryFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initial?: ManagedCountry | null
  loading?: boolean
  onClose: () => void
  onSubmit: (values: CountryFormValues) => void
}

function CountryFormModal({ open, mode, initial, loading, onClose, onSubmit }: CountryFormModalProps) {
  const titleId = useId()
  const [values, setValues] = useState<CountryFormValues>(emptyCountryForm())
  const [errors, setErrors] = useState<{ name?: string; currencyCode?: string; methods?: string }>({})
  const [draftMethod, setDraftMethod] = useState('')
  const [editingMethodId, setEditingMethodId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (mode === 'edit' && initial) {
      setValues({
        name: initial.name,
        currencyCode: initial.currencyCode,
        status: initial.status,
        methods: initial.methods.map((method) => ({ ...method })),
      })
    } else {
      setValues(emptyCountryForm())
    }
    setErrors({})
    setDraftMethod('')
    setEditingMethodId(null)
  }, [open, mode, initial])

  const summary = useMemo(() => methodsSummaryLabel(values.methods), [values.methods])

  if (!open) return null

  function updateMethod(id: string, patch: Partial<CountryMethod>) {
    setValues((current) => ({
      ...current,
      methods: current.methods.map((method) => (method.id === id ? { ...method, ...patch } : method)),
    }))
  }

  function removeMethod(id: string) {
    setValues((current) => ({
      ...current,
      methods: current.methods.filter((method) => method.id !== id),
    }))
  }

  function addMethod() {
    const name = draftMethod.trim()
    if (!name) return
    if (values.methods.some((method) => method.name.toLowerCase() === name.toLowerCase())) {
      setErrors((current) => ({ ...current, methods: 'هذه الطريقة مضافة مسبقًا' }))
      return
    }
    setValues((current) => ({
      ...current,
      methods: [...current.methods, createMethodDraft(name)],
    }))
    setDraftMethod('')
    setErrors((current) => ({ ...current, methods: undefined }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors: typeof errors = {}
    if (!values.name.trim()) nextErrors.name = 'هذا الحقل مطلوب'
    if (!values.currencyCode) nextErrors.currencyCode = 'هذا الحقل مطلوب'
    if (!values.methods.some((method) => method.name.trim())) {
      nextErrors.methods = 'أضف طريقة تحويل واحدة على الأقل'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSubmit({
      ...values,
      name: values.name.trim(),
      methods: values.methods
        .map((method) => ({ ...method, name: method.name.trim() }))
        .filter((method) => method.name),
    })
  }

  return (
    <div
      className="co-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onClose()
      }}
    >
      <section className="co-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} dir="rtl">
        <header className="co-modal-head">
          <div>
            <h2 id={titleId}>{mode === 'edit' ? 'تعديل الدولة' : 'إضافة دولة جديدة'}</h2>
            <p>حدّد بيانات الدولة وعملتها وطرق التحويل المتاحة بها</p>
          </div>
          <button type="button" className="co-modal-close" aria-label="إغلاق" disabled={loading} onClick={onClose}>
            <X size={15} />
          </button>
        </header>

        <form className="co-modal-body" onSubmit={handleSubmit} noValidate>
          <section className="co-modal-section">
            <h3>البيانات الأساسية</h3>
            <div className="co-modal-grid">
              <label className="co-field">
                <span>اسم الدولة <b>*</b></span>
                <input
                  value={values.name}
                  placeholder="مصر"
                  disabled={loading}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, name: event.target.value }))
                    setErrors((current) => ({ ...current, name: undefined }))
                  }}
                />
                {errors.name && <small className="co-error">{errors.name}</small>}
              </label>

              <label className="co-field">
                <span>العملة المحلية <b>*</b></span>
                <FormSelect
                  className="co-select"
                  ariaLabel="العملة المحلية"
                  searchable
                  value={values.currencyCode}
                  disabled={loading}
                  onChange={(value) => {
                    setValues((current) => ({ ...current, currencyCode: value }))
                    setErrors((current) => ({ ...current, currencyCode: undefined }))
                  }}
                  options={currencyOptions.map((item) => ({ label: item.label, value: item.code }))}
                />
                <em className="co-hint">تُستخدم في تسجيل الحوالات واحتساب قيمتها بالدولار</em>
                {errors.currencyCode && <small className="co-error">{errors.currencyCode}</small>}
              </label>
            </div>
          </section>

          <section className="co-modal-section">
            <h3>طرق التحويل المتاحة</h3>
            <p className="co-section-hint">خاصة بهذه الدولة — تظهر عند تسجيل حوالة بعد اختيار الدولة</p>

            <div className="co-methods-list">
              {values.methods.map((method, index) => (
                <div className={`co-method-row ${method.active ? 'is-active' : 'is-paused'}`} key={method.id}>
                  <span className="co-method-index">{String(index + 1).padStart(2, '0')}</span>
                  {editingMethodId === method.id ? (
                    <input
                      className="co-method-edit-input"
                      value={method.name}
                      disabled={loading}
                      autoFocus
                      onChange={(event) => updateMethod(method.id, { name: event.target.value })}
                      onBlur={() => setEditingMethodId(null)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          setEditingMethodId(null)
                        }
                      }}
                    />
                  ) : (
                    <strong className="co-method-name">{method.name}</strong>
                  )}
                  <span className={`co-method-state ${method.active ? 'is-on' : 'is-off'}`}>
                    {method.active ? 'مفعلة' : 'موقوفة'}
                  </span>
                  <button
                    type="button"
                    className={`co-switch ${method.active ? 'is-on' : ''}`}
                    role="switch"
                    aria-checked={method.active}
                    aria-label={`تبديل حالة ${method.name}`}
                    disabled={loading}
                    onClick={() => updateMethod(method.id, { active: !method.active })}
                  >
                    <i />
                  </button>
                  <div className="co-method-actions">
                    <button
                      type="button"
                      className="co-icon-btn"
                      aria-label={`تعديل ${method.name}`}
                      disabled={loading}
                      onClick={() => setEditingMethodId(method.id)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="co-icon-btn is-danger"
                      aria-label={`حذف ${method.name}`}
                      disabled={loading}
                      onClick={() => removeMethod(method.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="co-add-method">
              <input
                value={draftMethod}
                placeholder="اسم طريقة التحويل، مثال: Orange Cash"
                disabled={loading}
                onChange={(event) => setDraftMethod(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addMethod()
                  }
                }}
              />
              <button type="button" className="co-add-method-btn" disabled={loading || !draftMethod.trim()} onClick={addMethod}>
                <Plus size={14} />
                إضافة طريقة
              </button>
            </div>
            {errors.methods && <small className="co-error">{errors.methods}</small>}
          </section>

          <section className="co-modal-section">
            <h3>حالة الدولة</h3>
            <div className="co-status-segment" role="group" aria-label="حالة الدولة">
              <button
                type="button"
                className={values.status === 'active' ? 'is-active' : ''}
                disabled={loading}
                onClick={() => setValues((current) => ({ ...current, status: 'active' }))}
              >
                مفعلة · Active
              </button>
              <button
                type="button"
                className={values.status === 'paused' ? 'is-active is-paused' : ''}
                disabled={loading}
                onClick={() => setValues((current) => ({ ...current, status: 'paused' }))}
              >
                موقوفة · Inactive
              </button>
            </div>
            <p className="co-section-hint">الدولة الموقوفة لا تظهر ضمن الدول المتاحة عند تسجيل حوالة جديدة</p>
          </section>

          <footer className="co-modal-foot">
            <span className="co-methods-summary">{summary}</span>
            <div className="co-modal-actions">
              <button type="submit" className="co-save" disabled={loading}>
                {loading ? 'جاري الحفظ...' : 'حفظ الدولة'}
              </button>
              <button type="button" className="co-cancel" disabled={loading} onClick={onClose}>
                إلغاء
              </button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default CountryFormModal
