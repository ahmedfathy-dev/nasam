import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ChevronLeft, LoaderCircle } from 'lucide-react'
import {
  getActiveCountries,
  getActivePaymentMethodsByCountry,
  checkMerchantEmailUnique,
  createMerchant,
  getMerchantById,
  updateMerchantFull,
} from '../../../services/merchantService'
import type { CatalogCountry, CatalogPaymentMethod } from '../../../data/merchantCatalog'
import { getCountryById } from '../../../data/merchantCatalog'
import { useToast } from '../../../hooks/useToast'
import ToastStack from '../ToastStack'
import CommissionSection from './CommissionSection'
import MerchantAccountSection from './MerchantAccountSection'
import MerchantBasicInfoSection from './MerchantBasicInfoSection'
import MerchantSummaryCard from './MerchantSummaryCard'
import ReceivingMethodsSection from './ReceivingMethodsSection'
import {
  emptyAddMerchantForm,
  merchantToAddForm,
  type AddMerchantFieldErrors,
  type AddMerchantFormValues,
  type CreateMerchantPayload,
} from './addMerchantTypes'
import { validateAddMerchantForm } from './validateAddMerchantForm'
import '../MerchantResponsive.css'
import './AddMerchantPage.css'

type AddMerchantPageProps = {
  mode?: 'create' | 'edit'
  merchantId?: number
  onBackToList: () => void
  onSuccess: (result: { id: number; name: string }) => void
}

function AddMerchantPage({
  mode = 'create',
  merchantId,
  onBackToList,
  onSuccess,
}: AddMerchantPageProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState<AddMerchantFormValues>(emptyAddMerchantForm())
  const [initialSnapshot, setInitialSnapshot] = useState('')
  const [errors, setErrors] = useState<AddMerchantFieldErrors>({})
  const [countries, setCountries] = useState<CatalogCountry[]>([])
  const [availableMethods, setAvailableMethods] = useState<CatalogPaymentMethod[]>([])
  const [loading, setLoading] = useState(false)
  const [booting, setBooting] = useState(true)
  const { toasts, pushToast, dismissToast } = useToast()

  const country = getCountryById(values.countryId)
  const dirty = initialSnapshot !== '' && JSON.stringify(values) !== initialSnapshot

  useEffect(() => {
    let cancelled = false
    async function boot() {
      setBooting(true)
      try {
        const activeCountries = await getActiveCountries()
        if (cancelled) return
        setCountries(activeCountries)

        if (mode === 'edit' && merchantId) {
          const merchant = await getMerchantById(merchantId)
          if (!merchant) {
            pushToast('تعذر العثور على التاجر', 'error')
            onBackToList()
            return
          }
          const next = merchantToAddForm({
            ...merchant,
            email: merchant.email ?? `${merchant.name.replace(/\s+/g, '.').toLowerCase()}@nasam.org`,
          })
          setValues(next)
          setInitialSnapshot(JSON.stringify(next))
        } else {
          const next = emptyAddMerchantForm()
          setValues(next)
          setInitialSnapshot(JSON.stringify(next))
        }
      } finally {
        if (!cancelled) setBooting(false)
      }
    }
    void boot()
    return () => { cancelled = true }
  }, [mode, merchantId, onBackToList, pushToast])

  useEffect(() => {
    let cancelled = false
    void getActivePaymentMethodsByCountry(values.countryId).then((methods) => {
      if (cancelled) return
      setAvailableMethods(methods)
      setValues((current) => {
        const validIds = new Set(methods.map((method) => method.id))
        let nextMethods = current.methods.filter((block) => validIds.has(block.methodId))
        if (!nextMethods.length && methods[0]) {
          nextMethods = [{ key: `m-${Date.now()}`, methodId: methods[0].id, accounts: [''] }]
        }
        if (JSON.stringify(nextMethods) === JSON.stringify(current.methods)) return current
        return { ...current, methods: nextMethods }
      })
    })
    return () => { cancelled = true }
  }, [values.countryId])

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty || loading) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty, loading])

  function updateField<K extends keyof AddMerchantFormValues>(key: K, value: AddMerchantFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, methods: key === 'methods' ? undefined : current.methods }))
  }

  async function onBlurEmail() {
    if (!values.email.trim()) return
    const unique = await checkMerchantEmailUnique(values.email, mode === 'edit' ? merchantId : undefined)
    if (!unique) {
      setErrors((current) => ({ ...current, email: 'هذا البريد مستخدم لحساب آخر' }))
    }
  }

  function askLeave() {
    if (dirty && !window.confirm('هناك تغييرات غير محفوظة. هل تريد المغادرة دون حفظ؟')) return
    onBackToList()
  }

  function buildPayload(): CreateMerchantPayload {
    const selected = getCountryById(values.countryId)
    const prefix = selected?.phonePrefix ?? '+20'
    const local = values.phoneLocal.trim()
    return {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: `${prefix} ${local}`.replace(/\s+/g, ' ').trim(),
      countryId: values.countryId,
      country: selected?.name ?? '',
      currency: selected?.currency ?? 'EGP',
      status: values.status,
      commission: {
        type: values.commissionType,
        value: Number(values.commissionValue),
      },
      paymentMethods: values.methods.map((block) => ({
        methodId: block.methodId,
        accounts: block.accounts.map((account) => account.trim()).filter(Boolean),
      })),
      createAccount: values.createAccount,
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const nextErrors = validateAddMerchantForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0 || nextErrors.accounts) {
      window.setTimeout(() => {
        const invalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], .am-error')
        invalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const input = formRef.current?.querySelector<HTMLInputElement>('input[aria-invalid="true"]')
        input?.focus()
      }, 0)
      return
    }

    const unique = await checkMerchantEmailUnique(values.email, mode === 'edit' ? merchantId : undefined)
    if (!unique) {
      setErrors((current) => ({ ...current, email: 'هذا البريد مستخدم لحساب آخر' }))
      return
    }

    setLoading(true)
    try {
      const payload = buildPayload()
      if (mode === 'edit' && merchantId) {
        await updateMerchantFull(merchantId, payload)
        pushToast('تم تحديث بيانات التاجر بنجاح', 'success')
        onSuccess({ id: merchantId, name: payload.name })
      } else {
        const merchant = await createMerchant(payload)
        onSuccess({ id: merchant.id, name: merchant.name })
      }
    } catch {
      pushToast('حدث خطأ أثناء الحفظ، حاول مرة أخرى', 'error')
    } finally {
      setLoading(false)
    }
  }

  const title = mode === 'edit' ? 'تعديل التاجر' : 'إضافة تاجر جديد'
  const subtitle = mode === 'edit'
    ? 'حدّث بيانات التاجر ووسائل الاستقبال ثم احفظ التغييرات'
    : 'أدخل البيانات الأساسية، إعداد العمولة، وسائل الاستقبال وحساب الدخول للتاجر'

  if (booting) {
    return <div className="add-merchant-page" dir="rtl"><div className="am-form-card" style={{ padding: 40, textAlign: 'center' }}>جاري التحميل...</div></div>
  }

  return (
    <div className="add-merchant-page" dir="rtl">
      <nav className="am-breadcrumb" aria-label="مسار الصفحة">
        <button type="button" onClick={askLeave}>التجار</button>
        <ChevronLeft size={12} />
        <strong>{title}</strong>
      </nav>

      <header className="am-header">
        <div className="am-header-copy">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <button type="button" className="am-back" onClick={askLeave}>
          <ArrowLeft size={15} />
          رجوع لقائمة التجار
        </button>
      </header>

      <div className="am-layout">
        <form ref={formRef} className="am-form-card" onSubmit={handleSubmit} noValidate>
          <div className="am-form-body">
            <MerchantBasicInfoSection
              values={values}
              errors={errors}
              countries={countries}
              phonePrefix={country?.phonePrefix ?? '+20'}
              disabled={loading}
              onChange={updateField}
              onBlurEmail={() => { void onBlurEmail() }}
            />
            <CommissionSection
              values={values}
              errors={errors}
              currency={country?.currency ?? 'EGP'}
              disabled={loading}
              onChange={updateField}
            />
            <ReceivingMethodsSection
              methods={values.methods}
              availableMethods={availableMethods}
              errors={errors}
              disabled={loading}
              onChange={(methods) => updateField('methods', methods)}
            />
            <MerchantAccountSection
              createAccount={values.createAccount}
              email={values.email}
              disabled={loading}
              onChange={(value) => updateField('createAccount', value)}
            />
          </div>

          <footer className="am-form-foot">
            <button type="submit" className="am-save" disabled={loading}>
              {loading && <LoaderCircle size={14} className="am-spinner" />}
              {mode === 'edit' ? 'حفظ التعديلات' : 'حفظ التاجر'}
            </button>
            <button type="button" className="am-cancel" disabled={loading} onClick={askLeave}>إلغاء</button>
          </footer>
        </form>

        <MerchantSummaryCard values={values} country={country} />
      </div>

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default AddMerchantPage
