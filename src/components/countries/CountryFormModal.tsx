import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { Pencil, Plus, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
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
import Modal from '../ui/Modal'

type CountryFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initial?: ManagedCountry | null
  loading?: boolean
  onClose: () => void
  onSubmit: (values: CountryFormValues) => void
}

const fieldControlClass = cn(
  'box-border h-10 w-full min-w-0 border border-[#e5e8ea] bg-[#f7f8f9] text-base text-[#454e55] font-[inherit] rounded-sm',
  'focus:border-green focus:bg-surface focus:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)] focus:outline-0',
  'min-[561px]:text-[13px]',
)

function CountryFormModal({ dialog }: { dialog: CountryFormModalProps }) {
  const { open, mode, initial, loading = false, onClose, onSubmit } = dialog
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
    <Modal
      shell={{
        backdropClassName: 'fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_38_48_/_42%)] p-4',
        panelClassName: cn(
          'flex max-h-[min(94dvh,860px)] w-[min(640px,calc(100vw-24px))] flex-col overflow-hidden border border-line bg-surface shadow-[0_22px_48px_rgb(20_32_42_/_18%)] rounded-xl',
          'animate-[co-modal-in_160ms_ease-out]',
        ),
        labelledBy: titleId,
        closeOnBackdrop: !loading,
        onClose,
      }}
    >
      <div dir="rtl" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-start justify-between gap-3 border-b border-[#edf0f2] px-5 pb-3.5 pt-[18px]">
          <div>
            <h2 id={titleId} className="text-[18px] font-bold leading-[1.35] text-[#1f272e]">
              {mode === 'edit' ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
            </h2>
            <p className="mt-1 text-[12px] leading-[1.55] text-[#7d868e]">
              حدّد بيانات الدولة وعملتها وطرق التحويل المتاحة بها
            </p>
          </div>
          <button
            type="button"
            className="grid size-[30px] flex-none place-items-center border border-[#e7eaed] bg-[#f3f5f6] text-[#6d767e] rounded-[7px] disabled:cursor-not-allowed disabled:opacity-55"
            aria-label="إغلاق"
            disabled={loading}
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </header>

        <form className="grid min-h-0 flex-1 gap-[18px] overflow-auto px-5 pb-0 pt-4" onSubmit={handleSubmit} noValidate>
          <section>
            <h3 className="mb-2.5 text-[13px] font-bold text-green">البيانات الأساسية</h3>
            <div
              className={cn(
                'grid w-full min-w-0 grid-cols-1 items-start gap-x-3.5 gap-y-3',
                'min-[561px]:grid-cols-2',
              )}
            >
              <label
                className={cn(
                  'grid min-w-0 grid-rows-[auto_auto_auto] content-start gap-1.5 text-[12px] text-[#5a636a]',
                  'min-[561px]:grid-rows-[auto_40px_auto]',
                )}
              >
                <span className="min-h-[18px] leading-[1.35]">اسم الدولة <b className="font-semibold text-danger">*</b></span>
                <input
                  className={cn(fieldControlClass, 'px-3')}
                  value={values.name}
                  placeholder="مصر"
                  disabled={loading}
                  aria-invalid={Boolean(errors.name)}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, name: event.target.value }))
                    setErrors((current) => ({ ...current, name: undefined }))
                  }}
                />
                {errors.name && <small className="text-[11px] text-danger">{errors.name}</small>}
              </label>

              <label
                className={cn(
                  'grid min-w-0 grid-rows-[auto_auto_auto] content-start gap-1.5 text-[12px] text-[#5a636a]',
                  'min-[561px]:grid-rows-[auto_40px_auto]',
                )}
              >
                <span className="min-h-[18px] leading-[1.35]">العملة المحلية <b className="font-semibold text-danger">*</b></span>
                <FormSelect
                  field={{
                    className: cn(
                      'box-border h-[30px] w-full min-w-0 rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] text-[8px] text-[#454e55]',
                      'transition-[border-color,background-color,box-shadow] duration-150',
                      'hover:not-has-[:disabled]:border-[#cbd5dc] hover:not-has-[:disabled]:bg-white',
                      'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
                      'has-[[aria-invalid=true]]:border-[#d95f5f] has-[[aria-invalid=true]]:shadow-[0_0_0_3px_rgb(217_95_95_/_10%)]',
                      'has-[:disabled]:border-[#e8ebee] has-[:disabled]:bg-[#f0f2f4] has-[:disabled]:text-[#9aa2a9] has-[:disabled]:shadow-none',
                    ),
                    ariaLabel: 'العملة المحلية',
                    searchable: true,
                    value: values.currencyCode,
                    disabled: loading,
                    invalid: Boolean(errors.currencyCode),
                    onChange: (value) => {
                      setValues((current) => ({ ...current, currencyCode: value }))
                      setErrors((current) => ({ ...current, currencyCode: undefined }))
                    },
                    options: currencyOptions.map((item) => ({ label: item.label, value: item.code })),
                  }}
                />
                <em className="text-[10px] not-italic leading-[1.45] text-[#8a9299]">تُستخدم في تسجيل الحوالات واحتساب قيمتها بالدولار</em>
                {errors.currencyCode && <small className="text-[11px] text-danger">{errors.currencyCode}</small>}
              </label>
            </div>
          </section>

          <section>
            <h3 className="mb-2.5 text-[13px] font-bold text-green">طرق التحويل المتاحة</h3>
            <p className="-mt-1 mb-2.5 text-[11px] leading-[1.6] text-[#8a9299]">
              خاصة بهذه الدولة — تظهر عند تسجيل حوالة بعد اختيار الدولة
            </p>

            <div className="grid gap-2">
              {values.methods.map((method, index) => (
                <div
                  className={cn(
                    'grid min-h-[46px] grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-2 border border-[#e8ecef] bg-surface px-2.5 py-2 rounded-[9px]',
                    'min-[561px]:grid-cols-[28px_minmax(0,1fr)_auto_auto_auto]',
                    '[grid-template-areas:"index_name_actions"_"index_state_switch"]',
                    'min-[561px]:[grid-template-areas:none]',
                  )}
                  key={method.id}
                >
                  <span className="[grid-area:index] text-[11px] font-semibold tabular-nums text-[#9aa2a8] min-[561px]:[grid-area:auto]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {editingMethodId === method.id ? (
                    <input
                      className={cn(
                        '[grid-area:name] h-8 min-w-0 border border-[#dfe4e8] bg-[#f7f8f9] px-2 text-base font-semibold text-[#2d363d] outline-0 font-[inherit] rounded-[6px]',
                        'min-[561px]:[grid-area:auto] min-[561px]:text-[13px]',
                      )}
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
                    <strong
                      className={cn(
                        '[grid-area:name] min-w-0 text-[13px] font-semibold text-[#2d363d]',
                        'min-[561px]:[grid-area:auto]',
                      )}
                    >
                      {method.name}
                    </strong>
                  )}
                  <span
                    className={cn(
                      '[grid-area:state] whitespace-nowrap text-[11px] font-semibold',
                      'min-[561px]:[grid-area:auto]',
                      method.active ? 'text-green' : 'text-[#9aa2a8]',
                    )}
                  >
                    {method.active ? 'مفعلة' : 'موقوفة'}
                  </span>
                  <button
                    type="button"
                    className={cn(
                      '[grid-area:switch] relative h-[22px] w-10 cursor-pointer rounded-full border-0 bg-[#d5dade] p-0.5',
                      'min-[561px]:[grid-area:auto]',
                      'disabled:cursor-not-allowed disabled:opacity-55',
                      method.active && 'bg-green',
                    )}
                    role="switch"
                    aria-checked={method.active}
                    aria-label={`تبديل حالة ${method.name}`}
                    disabled={loading}
                    onClick={() => updateMethod(method.id, { active: !method.active })}
                  >
                    <i
                      className={cn(
                        'absolute top-0.5 size-[18px] rounded-full bg-surface shadow-[0_1px_3px_rgb(0_0_0_/_18%)] transition-[left,right] duration-200',
                        method.active ? 'left-0.5' : 'right-0.5',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      '[grid-area:actions] inline-flex items-center justify-self-end gap-1',
                      'min-[561px]:[grid-area:auto]',
                    )}
                  >
                    <button
                      type="button"
                      className="grid size-7 place-items-center border border-[#e7eaed] bg-surface text-[#6d767e] rounded-[6px] disabled:cursor-not-allowed disabled:opacity-55"
                      aria-label={`تعديل ${method.name}`}
                      disabled={loading}
                      onClick={() => setEditingMethodId(method.id)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      className="grid size-7 place-items-center border border-[#f0c4c4] bg-[#fff7f7] text-danger rounded-[6px] disabled:cursor-not-allowed disabled:opacity-55"
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

            <div
              className={cn(
                'mt-2.5 grid grid-cols-1 gap-2 border border-dashed border-[#d7dde2] bg-[#f8f9fa] p-2.5 rounded-[9px]',
                'min-[561px]:grid-cols-[minmax(0,1fr)_auto]',
              )}
            >
              <input
                className={cn(
                  'h-[38px] min-w-0 border border-[#e5e8ea] bg-surface px-3 text-base outline-0 font-[inherit] rounded-sm',
                  'min-[561px]:text-[12px]',
                )}
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
              <button
                type="button"
                className="inline-flex min-h-[38px] cursor-pointer items-center justify-center gap-[5px] whitespace-nowrap border border-[#c8e0c2] bg-[#f3faf1] px-3 text-[12px] font-semibold text-green rounded-sm disabled:cursor-not-allowed disabled:opacity-55"
                disabled={loading || !draftMethod.trim()}
                onClick={addMethod}
              >
                <Plus size={14} />
                إضافة طريقة
              </button>
            </div>
            {errors.methods && <small className="text-[11px] text-danger">{errors.methods}</small>}
          </section>

          <section>
            <h3 className="mb-2.5 text-[13px] font-bold text-green">حالة الدولة</h3>
            <div className="grid grid-cols-2 gap-1.5 border border-[#e7eaed] bg-[#f4f6f7] p-1 rounded-md" role="group" aria-label="حالة الدولة">
              <button
                type="button"
                className={cn(
                  'min-h-10 cursor-pointer border-0 bg-transparent text-[12px] font-semibold text-[#6a737b] rounded-sm',
                  'disabled:cursor-not-allowed disabled:opacity-55',
                  values.status === 'active' && 'bg-[#eaf6e8] text-green shadow-[inset_0_0_0_1px_#c8e0c2]',
                )}
                disabled={loading}
                onClick={() => setValues((current) => ({ ...current, status: 'active' }))}
              >
                مفعلة · Active
              </button>
              <button
                type="button"
                className={cn(
                  'min-h-10 cursor-pointer border-0 bg-transparent text-[12px] font-semibold text-[#6a737b] rounded-sm',
                  'disabled:cursor-not-allowed disabled:opacity-55',
                  values.status === 'paused' && 'bg-[#fdebec] text-danger shadow-[inset_0_0_0_1px_#f0c4c4]',
                )}
                disabled={loading}
                onClick={() => setValues((current) => ({ ...current, status: 'paused' }))}
              >
                موقوفة · Inactive
              </button>
            </div>
            <p className="mt-1.5 text-[11px] leading-[1.6] text-[#8a9299]">
              الدولة الموقوفة لا تظهر ضمن الدول المتاحة عند تسجيل حوالة جديدة
            </p>
          </section>

          <footer
            className={cn(
              'sticky bottom-0 mx-[-20px] flex flex-col items-stretch justify-between gap-3 border-t border-[#edf0f2] bg-surface px-5 pb-4 pt-3.5',
              'min-[561px]:flex-row min-[561px]:items-center',
            )}
          >
            <span className="whitespace-nowrap text-[11px] text-[#8a9299]">{summary}</span>
            <div className={cn('flex flex-col items-stretch gap-2', 'min-[561px]:flex-row min-[561px]:items-center')}>
              <button
                type="submit"
                className={cn(
                  'inline-flex min-h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap border border-ink-soft bg-ink-soft px-3.5 text-[12px] font-semibold text-white rounded-sm',
                  'enabled:hover:bg-[#11171c]',
                  'disabled:cursor-not-allowed disabled:opacity-55',
                  'min-[561px]:min-h-[38px] min-[561px]:w-auto',
                )}
                disabled={loading}
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الدولة'}
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex min-h-11 w-full cursor-pointer items-center justify-center whitespace-nowrap border border-[#e4e8eb] bg-[#f0f2f3] px-3.5 text-[12px] font-semibold text-[#4f5961] rounded-sm',
                  'disabled:cursor-not-allowed disabled:opacity-55',
                  'min-[561px]:min-h-[38px] min-[561px]:w-auto',
                )}
                disabled={loading}
                onClick={onClose}
              >
                إلغاء
              </button>
            </div>
          </footer>
        </form>
      </div>
    </Modal>
  )
}

export default CountryFormModal
