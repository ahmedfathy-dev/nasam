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
import FormSelect from '../../components/ui/FormSelect'
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

function TransferFormCreate({ nextNumber, onCancel, onSaved, onDraftSaved, onError, onImportExcel }: TransferFormCreateProps) {
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

  return (
    <>
      <div className="transfer-create-heading">
        <div>
          <nav className="transfer-breadcrumb" aria-label="مسار الصفحة">
            <button type="button" onClick={askCancel}>الحوالات</button>
            <span aria-hidden="true">/</span>
            <strong>تسجيل حوالة جديدة</strong>
          </nav>
          <h1>تسجيل حوالة جديدة</h1>
          <p>أدخل بيانات الحوالة يدويًا وأرفق صورة الإيصال كإثبات للتحويل</p>
        </div>
        <button type="button" className="transfer-excel-button" onClick={onImportExcel}>
          رفع ملف Excel
          <ArrowUpFromLine size={14} />
        </button>
      </div>

      <div className="transfer-create-grid">
        <form
          className="transfer-form-panel"
          onSubmit={(event: FormEvent) => { event.preventDefault(); void openReview() }}
          noValidate
        >
          <TransferFormSection number="1" title="صورة إيصال التحويل" hint="الخطوة الأولى">
            <input
              ref={receiptInput}
              className="visually-hidden"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf,.pdf"
              onChange={handleReceipt}
            />
            {receiptName ? (
              <div className="receipt-upload is-filled">
                <div className="receipt-thumb" aria-hidden="true"><i /><i /><b /></div>
                <div className="receipt-upload-copy">
                  <strong title={receiptName}>{receiptName}</strong>
                  {extracting && <small>جاري قراءة الإيصال...</small>}
                </div>
                <button type="button" className="receipt-replace" onClick={() => receiptInput.current?.click()}>استبدال</button>
              </div>
            ) : (
              <button
                type="button"
                className={`receipt-upload is-empty ${dragging ? 'is-dragging' : ''}`}
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
                <strong>اختر صورة أو اسحبها هنا</strong>
                <small>JPG / PNG / PDF حتى 5MB</small>
              </button>
            )}
            {receiptError && <small className="transfer-field-error">{receiptError}</small>}
          </TransferFormSection>

          <TransferFormSection number="2" title="الدولة والتاجر" hint="تظهر الخيارات حسب الدولة المختارة">
            <div className="transfer-fields two-fields">
              <TransferFormField fieldKey="country" label="الدولة" required error={errors.country} hint={`العملة: ${currency} — أُخذت تلقائيًا`}>
                <FormSelect
                  className="form-select-field"
                  ariaLabel="الدولة"
                  value={form.country}
                  invalid={Boolean(errors.country)}
                  onChange={(value) => updateField('country', value)}
                  options={transferCountries.map((item) => ({ label: item, value: item }))}
                />
              </TransferFormField>
              <TransferFormField fieldKey="merchant" label="التاجر" required error={errors.merchant} hint={`تجار ${form.country} المفعّلون فقط (${merchants.length})`}>
                <FormSelect
                  className="form-select-field"
                  ariaLabel="التاجر"
                  searchable
                  value={form.merchant}
                  invalid={Boolean(errors.merchant)}
                  onChange={(value) => updateField('merchant', value)}
                  options={merchants.map((item) => ({ label: item.name, value: item.name }))}
                />
              </TransferFormField>
              <TransferFormField fieldKey="method" label="وسيلة التحويل" required error={errors.method} hint="وسائل هذا التاجر المفعلة فقط">
                <FormSelect
                  className="form-select-field"
                  ariaLabel="وسيلة التحويل"
                  value={form.method}
                  invalid={Boolean(errors.method)}
                  onChange={(value) => updateField('method', value)}
                  options={methods.map((item) => ({ label: item.name, value: item.name }))}
                />
              </TransferFormField>
              <TransferFormField
                fieldKey="account"
                label="رقم / حساب الاستقبال"
                required
                error={errors.account}
                hint={
                  accounts.length === 0
                    ? 'لا توجد حسابات'
                    : accounts.length === 1
                      ? `للتاجر رقم واحد على ${form.method}`
                      : accounts.length === 2
                        ? `للتاجر رقمان على ${form.method}`
                        : `للتاجر ${accounts.length} أرقام على ${form.method}`
                }
              >
                <FormSelect
                  className="form-select-field"
                  ariaLabel="رقم / حساب الاستقبال"
                  value={form.account}
                  invalid={Boolean(errors.account)}
                  onChange={(value) => updateField('account', value)}
                  options={accounts.map((item) => ({ label: item, value: item }))}
                />
              </TransferFormField>
            </div>
          </TransferFormSection>

          <TransferFormSection number="3" title="بيانات التحويل">
            <div className="transfer-fields two-fields">
              <TransferFormField fieldKey="number" label="رقم التحويل" hint="يُنشأ تلقائيًا بواسطة النظام">
                <input className="is-readonly" value={form.number} readOnly dir="ltr" />
              </TransferFormField>
              <TransferFormField fieldKey="amount" label={`قيمة التحويل (${currency})`} required error={errors.amount}>
                <div className={`transfer-amount-input ${ocrFields.amount ? 'is-ocr' : ''}`}>
                  <span>{currency}</span>
                  <input
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
              <TransferFormField fieldKey="reference" label="رقم المرجع" required error={errors.reference}>
                <input
                  className={ocrFields.reference ? 'is-ocr' : undefined}
                  dir="ltr"
                  value={form.reference}
                  aria-invalid={Boolean(errors.reference)}
                  onChange={(event) => updateField('reference', event.target.value)}
                  onBlur={() => { void validateField('reference') }}
                />
              </TransferFormField>
              <TransferFormField fieldKey="sender" label="اسم المحوّل" required error={errors.sender}>
                <input
                  className={ocrFields.sender ? 'is-ocr' : undefined}
                  value={form.sender}
                  aria-invalid={Boolean(errors.sender)}
                  onChange={(event) => updateField('sender', event.target.value)}
                  onBlur={() => { void validateField('sender') }}
                />
              </TransferFormField>
              <TransferFormField fieldKey="receiverPhone" label="رقم هاتف المستلم">
                <input
                  className={ocrFields.receiverPhone ? 'is-ocr' : undefined}
                  dir="ltr"
                  value={form.receiverPhone}
                  onChange={(event) => updateField('receiverPhone', event.target.value)}
                />
              </TransferFormField>
              <TransferFormField fieldKey="date" label="تاريخ ووقت التحويل" required error={errors.date}>
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
              <TransferFormField fieldKey="note" label="ملاحظات" wide>
                <textarea
                  rows={3}
                  value={form.note}
                  placeholder="اختياري"
                  onChange={(event) => updateField('note', event.target.value)}
                />
              </TransferFormField>
            </div>
          </TransferFormSection>

          <div className="transfer-form-actions">
            <div className="transfer-form-actions-main">
              <button type="submit" className="transfer-primary-button">مراجعة التحويل</button>
              <button type="button" className="transfer-cancel-button" onClick={askCancel}>إلغاء</button>
            </div>
            <button type="button" className="transfer-draft-link" onClick={saveDraft}>حفظ كمسودة</button>
          </div>
        </form>

        <aside className="transfer-preview-column">
          <section className="transfer-preview-card">
            <h2>معاينة الإيصال</h2>
            {receiptUrl ? (
              <a className="receipt-real" href={receiptUrl} target="_blank" rel="noreferrer" title="تكبير">
                {receiptIsImage ? (
                  <img src={receiptUrl} alt="معاينة الإيصال" />
                ) : (
                  <span className="receipt-pdf-link">عرض ملف PDF · {receiptName}</span>
                )}
              </a>
            ) : (
              <div className={`receipt-paper ${brandClass}`}>
                <div className="receipt-brand">{brandLabel === '—' ? 'Receipt' : brandLabel}</div>
                <strong className="receipt-success">تمت العملية بنجاح</strong>
                <TransferReceiptRow label="المبلغ" value={amount ? `${formatAmount(amount, 2)} جنيه` : '—'} highlight />
                <TransferReceiptRow label="إلى" value={form.receiverPhone || form.account || '—'} highlight />
                <TransferReceiptRow label="من" value={form.sender || '—'} highlight />
                <TransferReceiptRow label="رقم العملية" value={form.reference || '—'} highlight />
                <TransferReceiptRow label="التاريخ" value={formatReceiptDate(form.date)} highlight />
                <TransferReceiptRow label="الرصيد المتبقي" value="—" />
                <small>شكرًا لاستخدامك فودافون كاش</small>
              </div>
            )}
          </section>

          <section className="transfer-calculation-card">
            <h2>احتساب العمولة والصافي</h2>
            <p>
              وفق إعدادات التاجر:{' '}
              {merchant
                ? merchant.commissionType === 'percent'
                  ? `${merchant.commissionValue}% نسبة مئوية`
                  : `${merchant.commissionValue} ${currency} قيمة ثابتة`
                : '—'}
            </p>
            <div className="calc-row"><span>قيمة التحويل</span><strong dir="ltr">{amount ? `${formatAmount(amount)} ${currency}` : '—'}</strong></div>
            <div className="calc-row commission-line">
              <span>العمولة ({merchant?.commissionType === 'percent' ? `${commissionRate}%` : currency})</span>
              <strong dir="ltr">{amount ? `− ${formatAmount(commission)} ${currency}` : '—'}</strong>
            </div>
            <div className="calc-row"><span>صافي المبلغ المستحق</span><strong dir="ltr">{amount ? `${formatAmount(netAmount)} ${currency}` : '—'}</strong></div>

            <div className="exchange-box">
              <div className="exchange-box-top">
                <div>
                  <span>سعر صرف الدولار وقت التسجيل</span>
                  <em className="live-pill"><i />مباشر · API</em>
                </div>
                <strong dir="ltr">1 USD = {rate.toFixed(2)} {currency}</strong>
              </div>
              <small>{rateClock} — يُثبَّت مع الحوالة</small>
            </div>

            <div className="usd-total">
              <span>القيمة المحتسبة بالدولار</span>
              <strong dir="ltr">{amount ? `≈ $ ${usdAmount}` : '—'}</strong>
            </div>
            <small className="usd-note">محسوبة بسعر الصرف اللحظي وقت التسجيل. يُحفظ المبلغ الأصلي بالعملة المحلية، ويُثبَّت سعر الدولار عند تسوية حساب التاجر</small>
          </section>
        </aside>
      </div>

      {reviewOpen && (
        <TransferReviewModal
          form={form}
          currency={currency}
          amount={amount}
          commission={commission}
          netAmount={netAmount}
          usdAmount={usdAmount}
          receiptUrl={receiptUrl}
          receiptIsImage={receiptIsImage}
          brandClass={brandClass}
          brandLabel={brandLabel}
          saving={saving}
          onClose={() => setReviewOpen(false)}
          onConfirm={() => { void confirmSave() }}
        />
      )}
    </>
  )
}

export default TransferFormCreate
