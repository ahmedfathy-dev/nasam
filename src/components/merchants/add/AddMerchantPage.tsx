import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ArrowLeft, ChevronLeft, LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/cn'
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
import { pageShell } from '../merchantTw'
import { AddMerchantFormProvider } from './addMerchantFormContext'

type AddMerchantPageProps = {
  mode?: 'create' | 'edit'
  merchantId?: number
  onBackToList: () => void
  onSuccess: (result: { id: number; name: string }) => void
}

function AddMerchantPage({ page }: { page: AddMerchantPageProps }) {
  const {
    mode = 'create',
    merchantId,
    onBackToList,
    onSuccess,
  } = page
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
    return (
      <div className={cn('add-merchant-page', pageShell, 'grid gap-4 text-text')} dir="rtl">
        <div className="am-form-card rounded-lg border border-line bg-surface p-10 text-center">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className={cn('add-merchant-page', pageShell, 'grid gap-4 text-text')} dir="rtl">
      <nav className="am-breadcrumb flex flex-wrap items-center gap-[5px] text-[11px] text-text-muted" aria-label="مسار الصفحة">
        <button type="button" className="border-0 bg-transparent font-inherit text-inherit hover:text-green" onClick={askLeave}>التجار</button>
        <ChevronLeft size={12} />
        <strong className="font-semibold text-[#4b5662]">{title}</strong>
      </nav>

      <header className="am-header flex flex-col items-stretch gap-4 min-[561px]:flex-row min-[561px]:items-start min-[561px]:justify-between">
        <div className="am-header-copy">
          <h1 className="text-[22px] font-bold leading-[1.25] text-[#1f2730] min-[561px]:text-[28px]">{title}</h1>
          <p className="mt-1.5 max-w-[520px] text-xs leading-[1.6] text-text-muted">{subtitle}</p>
        </div>
        <button
          type="button"
          className="am-back inline-flex min-h-10 w-full items-center justify-center gap-[7px] whitespace-nowrap rounded-md border border-[#e4e9ed] bg-surface px-3.5 text-xs text-[#56616c] hover:bg-[#f7f8f9] min-[561px]:w-auto"
          onClick={askLeave}
        >
          <ArrowLeft size={15} />
          رجوع لقائمة التجار
        </button>
      </header>

      <AddMerchantFormProvider
        value={{
          values,
          errors,
          countries,
          availableMethods,
          phonePrefix: country?.phonePrefix ?? '+20',
          currency: country?.currency ?? 'EGP',
          country,
          disabled: loading,
          onChange: updateField,
          onBlurEmail: () => { void onBlurEmail() },
        }}
      >
      <div className="am-layout grid grid-cols-1 items-start gap-6 min-[1024px]:grid-cols-[minmax(0,1.9fr)_minmax(280px,1fr)]">
        <form ref={formRef} className="am-form-card order-1 min-w-0 overflow-hidden rounded-lg border border-line bg-surface" onSubmit={handleSubmit} noValidate>
          <div className="am-form-body grid gap-0 px-5 pb-2 pt-[18px]">
            <MerchantBasicInfoSection />
            <CommissionSection />
            <ReceivingMethodsSection />
            <MerchantAccountSection />
          </div>

          <footer className="am-form-foot sticky bottom-0 z-[2] flex flex-col items-stretch gap-2 border-t border-[#edf0f2] bg-white px-5 py-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))] min-[561px]:flex-row min-[561px]:items-center min-[561px]:justify-start min-[561px]:gap-2">
            <button
              type="submit"
              className="am-save order-[-1] inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm border border-[#151719] bg-[#151719] px-4 text-xs text-white disabled:cursor-not-allowed disabled:opacity-60 min-[561px]:order-none min-[561px]:min-h-10 min-[561px]:w-auto"
              disabled={loading}
            >
              {loading && <LoaderCircle size={14} className="am-spinner animate-[am-spin_0.8s_linear_infinite]" />}
              {mode === 'edit' ? 'حفظ التعديلات' : 'حفظ التاجر'}
            </button>
            <button
              type="button"
              className="am-cancel inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-sm border border-[#e4e9ed] bg-[#f0f1f2] px-4 text-xs text-[#56616c] min-[561px]:min-h-10 min-[561px]:w-auto"
              disabled={loading}
              onClick={askLeave}
            >
              إلغاء
            </button>
          </footer>
        </form>

        <MerchantSummaryCard />
      </div>
      </AddMerchantFormProvider>

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default AddMerchantPage
