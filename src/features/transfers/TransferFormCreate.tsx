import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import {
  ArrowUpFromLine,
  ImagePlus,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../../components/ui/FormSelect'
import {
  transferCancelButtonClass,
  transferFormSelectClass,
  transferPrimaryButtonClass,
} from './transferFieldClasses'
import {
  clearTransferDraft,
  extractReceiptData,
  loadTransferDraft,
  saveTransferDraft,
  transferCountries,
  transferCurrencies,
  transferMerchants,
  type Transfer,
} from '../../data/transfersData'
import {
  isTransferReferenceTaken,
  markTransferReferenceUsed,
  registerTransferForMerchant,
} from '../../services/merchantService'
import { formatAmount, formatAmountDisplay, formatClockWithDate, formatReceiptDate, parseAmount } from '../../utils/format'
import TransferFormField from './TransferFormField'
import TransferFormSection from './TransferFormSection'
import TransferReceiptRow from './TransferReceiptRow'
import TransferReviewModal from './TransferReviewModal'
import { emptyTransferForm } from './transferFormDefaults'
import type { TransferFormValues, TransferOcrFields } from './types'

export type { TransferFormValues }

type TransferFormCreateProps = {
  nextNumber: string
  onCancel: () => void
  onSaved: (transfer: Transfer, notice: string) => void
  onDraftSaved: (notice: string) => void
  onError: (notice: string) => void
  onImportExcel: () => void
}

function TransferFormCreate({ screen }: { screen: TransferFormCreateProps }) {
  const { nextNumber, onCancel, onSaved, onDraftSaved, onError, onImportExcel } = screen
  const receiptInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<TransferFormValues>(() => {
    const draft = loadTransferDraft<{ form: TransferFormValues; receiptName: string }>()
    const base = draft?.form ?? emptyTransferForm(nextNumber)
    return { ...base, number: nextNumber }
  })
  const [receiptName, setReceiptName] = useState(() => loadTransferDraft<{ receiptName: string }>()?.receiptName ?? '')
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null)
  const [receiptIsImage, setReceiptIsImage] = useState(false)
  const [ocrFields, setOcrFields] = useState<TransferOcrFields>({})
  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormValues | 'receipt', string>>>({})
  const [receiptError, setReceiptError] = useState('')
  const [dirty, setDirty] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [dragging, setDragging] = useState(false)
  const initialSnapshot = useRef(JSON.stringify(emptyTransferForm(nextNumber)))

  const currency = transferCurrencies.find((item) => item.country === form.country)?.code ?? 'EGP'
  const rate = transferCurrencies.find((item) => item.code === currency)?.rate ?? 48
  const amount = parseAmount(form.amount)

  const merchants = useMemo(
    () => transferMerchants.filter((item) => item.country === form.country && item.status === 'نشط'),
    [form.country],
  )
  const merchant = merchants.find((item) => item.name === form.merchant) ?? merchants[0]
  const methods = merchant?.methods ?? []
  const method = methods.find((item) => item.name === form.method) ?? methods[0]
  const accounts = method?.accounts ?? []
  const commissionRate = merchant?.commissionType === 'percent' ? merchant.commissionValue : 0
  const commission = merchant?.commissionType === 'fixed'
    ? merchant.commissionValue
    : Math.round(amount * (commissionRate / 100))
  const netAmount = Math.max(0, amount - commission)
  const usdAmount = rate > 0 ? (netAmount / rate).toFixed(2) : '0.00'
  const rateClock = useMemo(() => formatClockWithDate(), [form.amount, form.country])

  useEffect(() => {
    setForm((current) => {
      let next = { ...current }
      if (!merchants.some((item) => item.name === next.merchant)) {
        next.merchant = merchants[0]?.name ?? ''
      }
      const nextMerchant = merchants.find((item) => item.name === next.merchant)
      const nextMethods = nextMerchant?.methods ?? []
      if (!nextMethods.some((item) => item.name === next.method)) {
        next.method = nextMethods[0]?.name ?? ''
      }
      const nextMethod = nextMethods.find((item) => item.name === next.method)
      const nextAccounts = nextMethod?.accounts ?? []
      if (!nextAccounts.includes(next.account)) {
        next.account = nextAccounts[0] ?? ''
        if (!current.receiverPhone || current.receiverPhone === current.account) {
          next.receiverPhone = next.account
        }
      }
      if (nextMethods.length === 1) next.method = nextMethods[0].name
      if (nextAccounts.length === 1) {
        next.account = nextAccounts[0]
        if (!current.receiverPhone || current.receiverPhone === current.account) {
          next.receiverPhone = nextAccounts[0]
        }
      }
      return next
    })
  }, [form.country, form.merchant, form.method, merchants])

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  useEffect(() => () => {
    if (receiptUrl) URL.revokeObjectURL(receiptUrl)
  }, [receiptUrl])

  function markDirty(next: TransferFormValues) {
    setForm(next)
    setDirty(JSON.stringify(next) !== initialSnapshot.current)
  }

  function updateField<K extends keyof TransferFormValues>(key: K, value: TransferFormValues[K]) {
    setErrors((current) => ({ ...current, [key]: undefined }))
    setOcrFields((current) => ({ ...current, [key]: false }))
    markDirty({
      ...form,
      [key]: value,
      ...(key === 'account' && (!form.receiverPhone || form.receiverPhone === form.account)
        ? { receiverPhone: value }
        : {}),
      ...(key === 'country' ? { merchant: '', method: '', account: '', receiverPhone: '' } : {}),
      ...(key === 'merchant' ? { method: '', account: '', receiverPhone: '' } : {}),
      ...(key === 'method' ? { account: '', receiverPhone: form.receiverPhone === form.account ? '' : form.receiverPhone } : {}),
    })
  }

  async function processReceipt(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowed.includes(file.type) && !/\.(jpe?g|png|pdf)$/i.test(file.name)) {
      setReceiptError('نوع الملف غير مدعوم. استخدم JPG أو PNG أو PDF')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setReceiptError('حجم الملف أكبر من 5MB')
      return
    }
    setReceiptError('')
    setReceiptName(file.name)
    if (receiptUrl) URL.revokeObjectURL(receiptUrl)
    const url = URL.createObjectURL(file)
    setReceiptUrl(url)
    setReceiptIsImage(file.type.startsWith('image/') || /\.(jpe?g|png)$/i.test(file.name))
    setExtracting(true)
    setDirty(true)
    try {
      const data = await extractReceiptData(file)
      markDirty({
        ...form,
        amount: formatAmountDisplay(data.amount),
        receiverPhone: data.receiver,
        sender: data.sender,
        reference: data.reference,
        date: data.dateTime,
        account: accounts.includes(data.receiver) ? data.receiver : form.account,
      })
      setOcrFields({
        amount: true,
        receiverPhone: true,
        sender: true,
        reference: true,
        date: true,
      })
    } finally {
      setExtracting(false)
    }
  }

  function handleReceipt(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    void processReceipt(file)
    event.target.value = ''
  }

  async function getFieldError(key: keyof TransferFormValues, value = form[key]) {
    if (key === 'country' || key === 'merchant' || key === 'method' || key === 'account' || key === 'sender' || key === 'date' || key === 'reference') {
      if (!String(value).trim()) return 'هذا الحقل مطلوب'
    }
    if (key === 'amount') {
      const parsed = parseAmount(String(value))
      if (!String(value).trim() || parsed <= 0) return 'قيمة غير صالحة'
    }
    if (key === 'reference' && String(value).trim() && await isTransferReferenceTaken(String(value))) {
      return 'رقم المرجع مستخدم من قبل'
    }
    return ''
  }

  async function validateField(key: keyof TransferFormValues, value = form[key]) {
    const message = await getFieldError(key, value)
    setErrors((current) => ({ ...current, [key]: message || undefined }))
    return message
  }

  async function validateAll() {
    const keys: Array<keyof TransferFormValues> = ['country', 'merchant', 'method', 'account', 'amount', 'reference', 'sender', 'date']
    const next: typeof errors = {}
    for (const key of keys) {
      const message = await getFieldError(key, form[key])
      if (message) next[key] = message
    }
    setErrors(next)
    return next
  }

  function focusFirstInvalid(next: typeof errors) {
    window.setTimeout(() => {
      const order: Array<keyof TransferFormValues> = ['country', 'merchant', 'method', 'account', 'amount', 'reference', 'sender', 'date']
      const first = order.find((key) => next[key])
      if (!first) return
      const field = document.querySelector<HTMLElement>(`.transfer-field[data-field="${first}"]`)
      const control = field?.querySelector<HTMLElement>('input, textarea, button.form-select-trigger')
      field?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      control?.focus()
    }, 0)
  }

  async function openReview() {
    const next = await validateAll()
    if (Object.keys(next).length) {
      focusFirstInvalid(next)
      return
    }
    setReviewOpen(true)
  }

  async function confirmSave() {
    setSaving(true)
    try {
      const transfer: Transfer = {
        number: form.number,
        date: form.date.replace(' - ', ' · ').slice(0, 14),
        country: form.country,
        merchant: form.merchant,
        sender: form.sender,
        method: form.method,
        amount: formatAmount(amount),
        currency,
        usd: `$ ${usdAmount}`,
        status: 'غير مستوفاة',
      }
      await registerTransferForMerchant({
        merchantName: form.merchant,
        id: form.number,
        date: form.date.split(' - ')[0] || form.date,
        sender: form.sender,
        method: form.method,
        receiveNumber: form.account,
        localAmount: amount,
        commission,
        currency,
        usd: Number(usdAmount),
      })
      markTransferReferenceUsed(form.reference)
      clearTransferDraft()
      setDirty(false)
      setReviewOpen(false)
      onSaved(transfer, 'تم تسجيل الحوالة بنجاح')
    } catch {
      setReviewOpen(false)
      onError('حدث خطأ أثناء التسجيل، حاول مرة أخرى')
    } finally {
      setSaving(false)
    }
  }

  function saveDraft() {
    saveTransferDraft({ form, receiptName })
    setDirty(false)
    onDraftSaved('تم حفظ المسودة')
  }

  function askCancel() {
    if (dirty && !window.confirm('هناك تغييرات غير محفوظة. هل تريد المغادرة؟')) return
    onCancel()
  }

  const brand = method?.brand ?? 'other'
  const brandLabel = method?.name ?? '—'
  const brandClass = brand === 'vodafone' ? 'is-vodafone' : brand === 'instapay' ? 'is-instapay' : brand === 'bank' ? 'is-bank' : 'is-neutral'
  const receiptPaperClass = cn(
    'mx-auto w-[min(100%,260px)] overflow-hidden border border-[#e8eaeb] bg-[#f7f8f9] pb-3 text-center rounded-md',
    brand === 'vodafone' && '[&_[data-receipt-brand]]:bg-[#e60000]',
    brand === 'instapay' && '[&_[data-receipt-brand]]:bg-blue',
    brand === 'bank' && '[&_[data-receipt-brand]]:bg-[#3f4850]',
  )

  return (
    <>
      <div
        className={cn(
          'mb-4 flex flex-col items-start justify-between gap-4 py-[7px]',
          'min-[701px]:flex-row min-[701px]:py-0',
        )}
      >
        <div>
          <nav className="mb-1.5 flex items-center gap-[5px] text-[11px] text-text-muted" aria-label="مسار الصفحة">
            <button type="button" className="cursor-pointer border-0 bg-transparent font-[inherit] text-inherit" onClick={askCancel}>الحوالات</button>
            <span aria-hidden="true">/</span>
            <strong className="font-semibold text-[#4b5662]">تسجيل حوالة جديدة</strong>
          </nav>
          <h1 className="text-[28px] font-bold text-[#1f2730]">تسجيل حوالة جديدة</h1>
          <p className="mt-1.5 max-w-[540px] text-[12px] leading-[1.6] text-text-muted">أدخل بيانات الحوالة يدويًا وأرفق صورة الإيصال كإثبات للتحويل</p>
        </div>
        <button
          type="button"
          className={cn(
            'inline-flex min-h-10 w-full cursor-pointer items-center justify-center gap-[7px] whitespace-nowrap border border-[#e4e9ed] bg-[#eef0f2] px-3.5 text-[12px] text-[#3f4850] rounded-sm',
            'min-[701px]:w-auto',
          )}
          onClick={onImportExcel}
        >
          رفع ملف Excel
          <ArrowUpFromLine size={14} />
        </button>
      </div>

      <div className={cn('grid grid-cols-1 items-start gap-6', 'min-[1025px]:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]')}>
        <form
          className="min-w-0 overflow-hidden border border-line bg-surface px-[18px] pb-0 pt-[18px] rounded-lg"
          onSubmit={(event: FormEvent) => { event.preventDefault(); void openReview() }}
          noValidate
        >
          <TransferFormSection section={{ number: '1', title: 'صورة إيصال التحويل', hint: 'الخطوة الأولى' }}>
            <input
              ref={receiptInput}
              className="absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0,0,0,0)]"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf,.pdf"
              onChange={handleReceipt}
            />
            {receiptName ? (
              <div className="flex min-h-[88px] w-full cursor-default items-center gap-3 border border-dashed border-green bg-[#f7f8f9] p-4 text-start text-[#717a80] rounded-md">
                <div className="grid h-14 w-12 content-center gap-1 rounded-sm bg-[#eceff1] px-1.5 py-2" aria-hidden="true">
                  <i className="block h-1 rounded-full bg-[#c5ccd1]" />
                  <i className="block h-1 rounded-full bg-[#c5ccd1]" />
                  <b className="block h-1 w-3/5 rounded-full bg-green" />
                </div>
                <div className="grid min-w-0 flex-1 gap-0.5">
                  <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] text-[#343d44]" title={receiptName}>{receiptName}</strong>
                  {extracting && <small>جاري قراءة الإيصال...</small>}
                </div>
                <button type="button" className="min-h-8 cursor-pointer border border-[#e4e9ed] bg-surface px-2.5 text-[11px] text-[#56616c] rounded-[7px]" onClick={() => receiptInput.current?.click()}>استبدال</button>
              </div>
            ) : (
              <button
                type="button"
                className={cn(
                  'flex min-h-[88px] w-full cursor-pointer flex-col items-center justify-center gap-1.5 border border-dashed border-green bg-[#f7f8f9] p-4 text-center text-green rounded-md',
                  dragging && 'bg-green-soft border-green',
                )}
                onClick={() => receiptInput.current?.click()}
                onDragEnter={(event) => { event.preventDefault(); setDragging(true) }}
                onDragOver={(event) => { event.preventDefault(); setDragging(true) }}
                onDragLeave={(event) => { event.preventDefault(); setDragging(false) }}
                onDrop={(event) => {
                  event.preventDefault()
                  setDragging(false)
                  const file = event.dataTransfer.files?.[0]
                  if (file) void processReceipt(file)
                }}
              >
                <ImagePlus size={22} />
                <strong className="text-[13px] text-[#454e55]">اختر صورة أو اسحبها هنا</strong>
                <small className="text-[11px] text-text-muted">JPG / PNG / PDF حتى 5MB</small>
              </button>
            )}
            {receiptError && <small className="transfer-field-error text-[12px] text-danger">{receiptError}</small>}
          </TransferFormSection>

          <TransferFormSection section={{ number: '2', title: 'الدولة والتاجر', hint: 'تظهر الخيارات حسب الدولة المختارة' }}>
            <div className={cn('grid grid-cols-1 items-start gap-3', 'min-[561px]:grid-cols-2')}>
              <TransferFormField field={{ fieldKey: 'country', label: 'الدولة', required: true, error: errors.country, hint: `العملة: ${currency} — أُخذت تلقائيًا` }}>
                <FormSelect
                  field={{
                    className: transferFormSelectClass,
                    ariaLabel: 'الدولة',
                    value: form.country,
                    invalid: Boolean(errors.country),
                    onChange: (value) => updateField('country', value),
                    options: transferCountries.map((item) => ({ label: item, value: item })),
                  }}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'merchant', label: 'التاجر', required: true, error: errors.merchant, hint: `تجار ${form.country} المفعّلون فقط (${merchants.length})` }}>
                <FormSelect
                  field={{
                    className: transferFormSelectClass,
                    ariaLabel: 'التاجر',
                    searchable: true,
                    value: form.merchant,
                    invalid: Boolean(errors.merchant),
                    onChange: (value) => updateField('merchant', value),
                    options: merchants.map((item) => ({ label: item.name, value: item.name })),
                  }}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'method', label: 'وسيلة التحويل', required: true, error: errors.method, hint: 'وسائل هذا التاجر المفعلة فقط' }}>
                <FormSelect
                  field={{
                    className: transferFormSelectClass,
                    ariaLabel: 'وسيلة التحويل',
                    value: form.method,
                    invalid: Boolean(errors.method),
                    disabled: methods.length === 0,
                    onChange: (value) => updateField('method', value),
                    options: methods.length
                      ? methods.map((item) => ({ label: item.name, value: item.name }))
                      : [{ label: 'لا توجد وسائل', value: form.method || 'none' }],
                  }}
                />
              </TransferFormField>
              <TransferFormField
                field={{
                  fieldKey: 'account',
                  label: 'رقم / حساب الاستقبال',
                  required: true,
                  error: errors.account,
                  hint: accounts.length === 0
                    ? 'لا توجد حسابات'
                    : accounts.length === 1
                      ? `للتاجر رقم واحد على ${form.method}`
                      : accounts.length === 2
                        ? `للتاجر رقمان على ${form.method}`
                        : `للتاجر ${accounts.length} أرقام على ${form.method}`,
                }}
              >
                <FormSelect
                  field={{
                    className: transferFormSelectClass,
                    ariaLabel: 'رقم / حساب الاستقبال',
                    value: form.account,
                    invalid: Boolean(errors.account),
                    disabled: accounts.length === 0,
                    onChange: (value) => updateField('account', value),
                    options: accounts.length
                      ? accounts.map((item) => ({ label: item, value: item }))
                      : [{ label: 'لا توجد حسابات', value: form.account || 'none' }],
                  }}
                />
              </TransferFormField>
            </div>
          </TransferFormSection>

          <TransferFormSection section={{ number: '3', title: 'بيانات التحويل' }}>
            <div className={cn('grid grid-cols-1 items-start gap-3', 'min-[561px]:grid-cols-2')}>
              <TransferFormField field={{ fieldKey: 'number', label: 'رقم التحويل', hint: 'يُنشأ تلقائيًا بواسطة النظام' }}>
                <input className="is-readonly" value={form.number} readOnly dir="ltr" />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'amount', label: `قيمة التحويل (${currency})`, required: true, error: errors.amount }}>
                <div
                  className={cn(
                    'transfer-amount-input flex h-[42px] w-full min-w-0 flex-row flex-nowrap items-center gap-2 border border-[#e5e8ea] bg-[#f7f8f9] px-3 text-base text-[#343d44] rounded-sm',
                    'focus-within:border-green focus-within:bg-surface focus-within:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
                    'min-[561px]:text-[13px]',
                    ocrFields.amount && 'border-[#d7ebd2] bg-[#f3faf1]',
                  )}
                  dir="ltr"
                >
                  <span className="flex-none whitespace-nowrap text-[12px] font-bold leading-none tracking-[0.02em] text-[#8a939b]">{currency}</span>
                  <input
                    className="h-full min-w-0 flex-1 border-0 bg-transparent text-end font-[inherit] font-semibold text-inherit outline-0 text-base min-[561px]:text-[13px]"
                    dir="ltr"
                    value={form.amount}
                    aria-invalid={Boolean(errors.amount)}
                    onChange={(event) => updateField('amount', event.target.value.replace(/[^\d.,]/g, ''))}
                    onBlur={() => {
                      const formatted = formatAmountDisplay(form.amount)
                      updateField('amount', formatted)
                      void validateField('amount', formatted)
                    }}
                  />
                </div>
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'reference', label: 'رقم المرجع', required: true, error: errors.reference }}>
                <input
                  className={ocrFields.reference ? 'is-ocr' : undefined}
                  dir="ltr"
                  value={form.reference}
                  aria-invalid={Boolean(errors.reference)}
                  onChange={(event) => updateField('reference', event.target.value)}
                  onBlur={() => { void validateField('reference') }}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'sender', label: 'اسم المحوّل', required: true, error: errors.sender }}>
                <input
                  className={ocrFields.sender ? 'is-ocr' : undefined}
                  value={form.sender}
                  aria-invalid={Boolean(errors.sender)}
                  onChange={(event) => updateField('sender', event.target.value)}
                  onBlur={() => { void validateField('sender') }}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'receiverPhone', label: 'رقم هاتف المستلم' }}>
                <input
                  className={ocrFields.receiverPhone ? 'is-ocr' : undefined}
                  dir="ltr"
                  value={form.receiverPhone}
                  onChange={(event) => updateField('receiverPhone', event.target.value)}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'date', label: 'تاريخ ووقت التحويل', required: true, error: errors.date }}>
                <input
                  className={ocrFields.date ? 'is-ocr' : undefined}
                  dir="ltr"
                  value={form.date}
                  placeholder="DD/MM/YYYY - HH:mm"
                  aria-invalid={Boolean(errors.date)}
                  onChange={(event) => updateField('date', event.target.value)}
                  onBlur={() => { void validateField('date') }}
                />
              </TransferFormField>
              <TransferFormField field={{ fieldKey: 'note', label: 'ملاحظات', wide: true }}>
                <textarea
                  rows={3}
                  value={form.note}
                  placeholder="اختياري"
                  onChange={(event) => updateField('note', event.target.value)}
                />
              </TransferFormField>
            </div>
          </TransferFormSection>

          <div
            className={cn(
              'sticky bottom-0 z-[2] mx-[-18px] mt-1 flex flex-col-reverse items-stretch justify-between gap-3 border-t border-[#edf0f2] bg-[#f7f8f9] px-[18px] pt-3.5 pb-[calc(14px+env(safe-area-inset-bottom,0px))]',
              'min-[561px]:flex-row min-[561px]:items-center',
              'print:hidden',
            )}
          >
            <div className={cn('flex w-full flex-col items-stretch gap-2', 'min-[561px]:w-auto min-[561px]:flex-row min-[561px]:items-center')}>
              <button type="submit" className={cn(transferPrimaryButtonClass, 'min-h-10 w-full justify-center rounded-sm text-[12px] min-[561px]:w-auto')}>مراجعة التحويل</button>
              <button type="button" className={cn(transferCancelButtonClass, 'min-h-10 w-full justify-center rounded-sm text-[12px] min-[561px]:w-auto')} onClick={askCancel}>إلغاء</button>
            </div>
            <button type="button" className="w-full cursor-pointer border-0 bg-transparent text-center text-[12px] text-[#6c747a] min-[561px]:w-auto" onClick={saveDraft}>حفظ كمسودة</button>
          </div>
        </form>

        <aside className={cn('static top-auto grid gap-3.5', 'min-[1025px]:sticky min-[1025px]:top-[76px] min-[1025px]:order-none', 'max-[1024px]:order-2')}>
          <section className="min-w-0 border border-line bg-surface p-4 rounded-lg">
            <h2 className="mb-3 text-[14px] font-bold text-[#303b46]">معاينة الإيصال</h2>
            {receiptUrl ? (
              <a className="block overflow-hidden border border-[#edf0f2] no-underline rounded-md" href={receiptUrl} target="_blank" rel="noreferrer" title="تكبير">
                {receiptIsImage ? (
                  <img className="block h-auto w-full" src={receiptUrl} alt="معاينة الإيصال" />
                ) : (
                  <span className="grid min-h-[180px] place-items-center bg-[#f7f8f9] p-4 text-center text-[12px] text-[#4a535a]">عرض ملف PDF · {receiptName}</span>
                )}
              </a>
            ) : (
              <div className={receiptPaperClass}>
                <div data-receipt-brand className="grid min-h-10 place-items-center bg-[#9aa3aa] text-[13px] font-bold text-white" dir="ltr">{brandLabel === '—' ? 'Receipt' : brandLabel}</div>
                <strong className="block px-2 pb-2 pt-3 text-[13px] font-bold text-[#303b46]">تمت العملية بنجاح</strong>
                <TransferReceiptRow label="المبلغ" value={amount ? `${formatAmount(amount, 2)} جنيه` : '—'} highlight />
                <TransferReceiptRow label="إلى" value={form.receiverPhone || form.account || '—'} highlight />
                <TransferReceiptRow label="من" value={form.sender || '—'} highlight />
                <TransferReceiptRow label="رقم العملية" value={form.reference || '—'} highlight />
                <TransferReceiptRow label="التاريخ" value={formatReceiptDate(form.date)} highlight />
                <TransferReceiptRow label="الرصيد المتبقي" value="—" />
                <small className="mt-2 block text-[10px] text-[#a1a7ab]">شكرًا لاستخدامك فودافون كاش</small>
              </div>
            )}
          </section>

          <section className="min-w-0 border border-line bg-surface p-4 rounded-lg">
            <h2 className="mb-3 text-[14px] font-bold text-[#303b46]">احتساب العمولة والصافي</h2>
            <p className="-mt-1.5 mb-3 text-[11px] text-text-muted">
              وفق إعدادات التاجر:{' '}
              {merchant
                ? merchant.commissionType === 'percent'
                  ? `${merchant.commissionValue}% نسبة مئوية`
                  : `${merchant.commissionValue} ${currency} قيمة ثابتة`
                : '—'}
            </p>
            <div className="flex justify-between gap-2 border-b border-[#f0f2f4] py-2 text-[12px] text-[#687178]"><span>قيمة التحويل</span><strong className="font-bold text-[#313a40]" dir="ltr">{amount ? `${formatAmount(amount)} ${currency}` : '—'}</strong></div>
            <div className="flex justify-between gap-2 border-b border-[#f0f2f4] py-2 text-[12px] text-[#687178]">
              <span>العمولة ({merchant?.commissionType === 'percent' ? `${commissionRate}%` : currency})</span>
              <strong className="font-bold text-danger" dir="ltr">{amount ? `− ${formatAmount(commission)} ${currency}` : '—'}</strong>
            </div>
            <div className="flex justify-between gap-2 border-b border-[#f0f2f4] py-2 text-[12px] text-[#687178]"><span>صافي المبلغ المستحق</span><strong className="font-bold text-[#313a40]" dir="ltr">{amount ? `${formatAmount(netAmount)} ${currency}` : '—'}</strong></div>

            <div className="mt-3 border border-green-border bg-[#f3faf1] p-3 rounded-md">
              <div className="flex items-start justify-between gap-2.5">
                <div className="grid gap-1.5">
                  <span className="text-[11px] text-[#5a636a]">سعر صرف الدولار وقت التسجيل</span>
                  <em className="inline-flex w-fit items-center gap-[5px] rounded-full bg-[#eaf6e8] px-2 py-[3px] text-[10px] font-bold not-italic text-green"><i className="size-1.5 rounded-full bg-current" />مباشر · API</em>
                </div>
                <strong className="text-[13px] font-bold text-[#243039]" dir="ltr">1 USD = {rate.toFixed(2)} {currency}</strong>
              </div>
              <small className="mt-2 block text-[10px] leading-[1.6] text-[#95a0a7]">{rateClock} — يُثبَّت مع الحوالة</small>
            </div>

            <div className="mt-3 flex justify-between gap-2 border-t border-[#edf0f2] pt-3 text-[12px] text-[#626b71]">
              <span>القيمة المحتسبة بالدولار</span>
              <strong className="text-[22px] font-bold text-green" dir="ltr">{amount ? `≈ $ ${usdAmount}` : '—'}</strong>
            </div>
            <small className="mt-2 block text-[10px] leading-[1.6] text-[#95a0a7]">محسوبة بسعر الصرف اللحظي وقت التسجيل. يُحفظ المبلغ الأصلي بالعملة المحلية، ويُثبَّت سعر الدولار عند تسوية حساب التاجر</small>
          </section>
        </aside>
      </div>

      {reviewOpen && (
        <TransferReviewModal
          review={{
            form,
            currency,
            amount,
            commission,
            netAmount,
            usdAmount,
            receiptUrl,
            receiptIsImage,
            brandClass,
            brandLabel,
            saving,
            onClose: () => setReviewOpen(false),
            onConfirm: () => { void confirmSave() },
          }}
        />
      )}
    </>
  )
}

export default TransferFormCreate
