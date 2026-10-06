import { useMemo, useRef, useState, type ChangeEvent, type ReactNode, type RefObject } from 'react'
import { AlertCircle, ArrowRight, ArrowUpFromLine, Check, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Download, FileSpreadsheet, FileText, ImagePlus, Plus, Search, Upload, X } from 'lucide-react'
import { initialTransfers, transferCountries, transferCurrencies, type Transfer } from '../data/transfersData'
import './TransfersPage.css'

type FormValues = {
  country: string
  merchant: string
  method: string
  amount: string
  currency: string
  number: string
  sender: string
  phone: string
  date: string
  note: string
}

type Screen = 'list' | 'create'
type Modal = 'review' | 'import' | null

const emptyForm: FormValues = {
  country: 'مصر', merchant: 'محمد سامي', method: 'Vodafone Cash', amount: '12000',
  currency: 'EGP', number: 'TRX-1249', sender: 'أحمد يوسف', phone: '01012345678',
  date: '05/10/2026 · 14:22', note: '',
}

const importRows = [
  { number: 'TRX-1249', country: 'مصر', merchant: 'محمد سامي', amount: '12,000', currency: 'EGP', status: 'صالح' },
  { number: 'VF-88123212', country: 'مصر', merchant: 'محمد سامي', amount: '3,000', currency: 'EGP', status: 'رقم محول مكرر' },
  { number: 'VF-88212001', country: 'السعودية', merchant: 'مؤسسة الريان', amount: '4,500', currency: 'SAR', status: 'صالح' },
  { number: 'VF-88212002', country: 'مصر', merchant: 'محمد سامي', amount: '—', currency: 'EGP', status: 'قيمة المبلغ مفقودة' },
  { number: 'IP-550981', country: 'مصر', merchant: 'نور التجارية', amount: '7,250', currency: 'EGP', status: 'صالح' },
]

function TransfersPage() {
  const [screen, setScreen] = useState<Screen>('list')
  const [modal, setModal] = useState<Modal>(null)
  const [transfers, setTransfers] = useState(initialTransfers)
  const [form, setForm] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('كل الدول')
  const [currency, setCurrency] = useState('كل العملات')
  const [status, setStatus] = useState('كل الحالات')
  const [period, setPeriod] = useState('الفترة هذا الشهر')
  const [receiptName, setReceiptName] = useState('')
  const [excelName, setExcelName] = useState('transfers_egypt_oct.xlsx')
  const [notice, setNotice] = useState('')
  const receiptInput = useRef<HTMLInputElement>(null)
  const excelInput = useRef<HTMLInputElement>(null)

  const exchangeRate = transferCurrencies.find((item) => item.code === form.currency)?.rate ?? 1
  const amount = Number(form.amount) || 0
  const commission = Math.round(amount * 0.02)
  const netAmount = amount - commission
  const usdAmount = (netAmount / exchangeRate).toFixed(2)

  const filteredTransfers = useMemo(() => transfers.filter((item) => {
    const matchesSearch = `${item.number} ${item.sender} ${item.merchant}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
      && (country === 'كل الدول' || item.country === country)
      && (currency === 'كل العملات' || item.currency === currency)
      && (status === 'كل الحالات' || item.status === status)
  }), [transfers, search, country, currency, status])

  function updateForm(field: keyof FormValues, value: string) {
    setForm((current) => {
      if (field === 'country') {
        const matchingCurrency = transferCurrencies.find((item) => item.country === value)?.code ?? current.currency
        return { ...current, country: value, currency: matchingCurrency }
      }
      return { ...current, [field]: value }
    })
  }

  function createTransfer(transferStatus: Transfer['status']): Transfer {
    return {
      number: form.number,
      date: form.date,
      country: form.country,
      merchant: form.merchant,
      sender: form.sender,
      method: form.method,
      amount: amount.toLocaleString('en-US'),
      currency: form.currency,
      usd: `$ ${usdAmount}`,
      status: transferStatus,
    }
  }

  function saveTransfer() {
    setTransfers((current) => [createTransfer('غير مستوفاة'), ...current])
    setModal(null)
    setScreen('list')
    setNotice('تم حفظ الحوالة بنجاح')
  }

  function saveDraft() {
    setTransfers((current) => [createTransfer('مسودة'), ...current])
    setScreen('list')
    setNotice('تم حفظ الحوالة كمسودة')
  }

  function importTransfers() {
    const validRows = importRows.filter((row) => row.status === 'صالح')
    const imported = Array.from({ length: 48 }, (_, index) => {
      const row = validRows[index % validRows.length]
      const rate = transferCurrencies.find((item) => item.code === row.currency)?.rate ?? 1
      const rowAmount = Number(row.amount.replaceAll(',', ''))
      return {
        number: index < validRows.length ? row.number : `XL-${3000 + index}`,
        date: '05/10 · 14:22',
        country: row.country,
        merchant: row.merchant,
        sender: '—',
        method: 'Excel import',
        amount: row.amount,
        currency: row.currency,
        usd: `$ ${(rowAmount / rate).toFixed(2)}`,
        status: 'غير مستوفاة' as const,
      }
    })
    setTransfers((current) => [...imported, ...current])
    setModal(null)
    setScreen('list')
    setNotice('تم استيراد ٤٨ حوالة صالحة بنجاح')
  }

  function startNewTransfer() {
    setForm({ ...emptyForm, number: `TRX-${1249 + transfers.length - initialTransfers.length}` })
    setReceiptName('')
    setScreen('create')
    setNotice('')
  }

  function exportTransfers() {
    const header = ['رقم الحوالة', 'التاريخ', 'الدولة', 'التاجر', 'المحول', 'الوسيلة', 'المبلغ', 'العملة', 'USD', 'التسوية']
    const rows = filteredTransfers.map((item) => [item.number, item.date, item.country, item.merchant, item.sender, item.method, item.amount, item.currency, item.usd, item.status])
    const csv = [header, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'transfers.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleReceiptChange(event: ChangeEvent<HTMLInputElement>) {
    setReceiptName(event.target.files?.[0]?.name ?? '')
  }

  function handleExcelChange(event: ChangeEvent<HTMLInputElement>) {
    setExcelName(event.target.files?.[0]?.name ?? '')
  }

  return (
    <div className="transfers-page" dir="rtl">
      {screen === 'list' ? (
        <TransferList
          transfers={filteredTransfers}
          notice={notice}
          search={search}
          country={country}
          currency={currency}
          status={status}
          period={period}
          onSearch={setSearch}
          onCountry={setCountry}
          onCurrency={setCurrency}
          onStatus={setStatus}
          onPeriod={setPeriod}
          onCreate={startNewTransfer}
          onImport={() => setModal('import')}
          onExport={exportTransfers}
        />
      ) : (
        <TransferFormPage
          form={form}
          receiptName={receiptName}
          amount={amount}
          commission={commission}
          netAmount={netAmount}
          usdAmount={usdAmount}
          receiptInput={receiptInput}
          onFormChange={updateForm}
          onReceiptChange={handleReceiptChange}
          onDraft={saveDraft}
          onBack={() => setScreen('list')}
          onReview={() => setModal('review')}
          onImport={() => setModal('import')}
        />
      )}

      {modal === 'review' && (
        <ReviewModal
          form={form}
          amount={amount}
          commission={commission}
          netAmount={netAmount}
          usdAmount={usdAmount}
          onClose={() => setModal(null)}
          onConfirm={saveTransfer}
        />
      )}
      {modal === 'import' && (
        <ImportModal
          fileName={excelName}
          inputRef={excelInput}
          onFileChange={handleExcelChange}
          onClose={() => setModal(null)}
          onImport={importTransfers}
        />
      )}
    </div>
  )
}

type TransferListProps = {
  transfers: Transfer[]
  notice: string
  search: string
  country: string
  currency: string
  status: string
  period: string
  onSearch: (value: string) => void
  onCountry: (value: string) => void
  onCurrency: (value: string) => void
  onStatus: (value: string) => void
  onPeriod: (value: string) => void
  onCreate: () => void
  onImport: () => void
  onExport: () => void
}

function TransferList({ transfers, notice, search, country, currency, status, period, onSearch, onCountry, onCurrency, onStatus, onPeriod, onCreate, onImport, onExport }: TransferListProps) {
  return (
    <>
      <div className="transfer-page-heading">
        <div><h1>الحوالات</h1><p>جميع الحوالات المستلمة عبر التجار في كل الدول</p></div>
        <div className="transfer-toolbar">
          <button className="transfer-primary-button" onClick={onCreate}><Plus size={14} />تحويل جديد</button>
          <button className="transfer-tool-button" onClick={onImport}><ArrowUpFromLine size={13} />رفع ملف Excel</button>
          <button className="transfer-tool-button" onClick={onExport}><Download size={13} />تصدير</button>
        </div>
      </div>
      {notice && <p className="transfer-success"><CircleCheck size={13} />{notice}</p>}
      <section className="transfer-list-panel">
        <div className="transfer-filters">
          <label className="transfer-search"><Search size={14} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="بحث برقم الحوالة أو اسم المحول..." /></label>
          <FilterSelect value={status} onChange={onStatus} options={['كل الحالات', 'مستوفاة', 'غير مستوفاة', 'مسودة']} />
          <FilterSelect value={country} onChange={onCountry} options={['كل الدول', ...transferCountries]} />
          <FilterSelect value={currency} onChange={onCurrency} options={['كل العملات', 'EGP', 'SAR', 'AED', 'TRY', 'JOD', 'OMR', 'KWD']} />
          <FilterSelect value={period} onChange={onPeriod} options={['الفترة هذا الشهر', 'آخر 7 أيام', 'آخر 30 يومًا']} />
        </div>
        <div className="transfer-table-wrap">
          <table className="transfer-table">
            <thead><tr><th>#</th><th>رقم الحوالة</th><th>التاريخ</th><th>الدولة</th><th>التاجر</th><th>المحول</th><th>الوسيلة</th><th>المبلغ</th><th>العملة</th><th>USD</th><th>التسوية</th></tr></thead>
            <tbody>
              {transfers.map((item, index) => (
                <tr key={`${item.number}-${index}`}>
                  <td>{index + 1}</td><td className="transfer-number" dir="ltr">{item.number}</td><td dir="ltr">{item.date}</td><td>{item.country}</td><td>{item.merchant}</td><td>{item.sender}</td><td dir="ltr">{item.method}</td><td dir="ltr">{item.amount}</td><td dir="ltr">{item.currency}</td><td className="transfer-usd" dir="ltr">{item.usd}</td>
                  <td><span className={`settlement-badge ${item.status === 'مستوفاة' ? 'settlement-paid' : item.status === 'مسودة' ? 'settlement-draft' : 'settlement-pending'}`}><i />{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!transfers.length && <div className="transfer-empty">لا توجد حوالات مطابقة للفلاتر</div>}
        </div>
        <div className="transfer-table-footer">
          <span>عرض ١-{transfers.length} من ٦٤٢</span>
          <div className="transfer-pagination"><button aria-label="السابق"><ChevronRight size={13} /></button><button>٥٤</button><span>…</span><button>٣</button><button>٢</button><button className="transfer-current-page">١</button><button aria-label="التالي"><ChevronLeft size={13} /></button></div>
        </div>
      </section>
    </>
  )
}

function FilterSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="transfer-select"><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={12} /></label>
}

type TransferFormProps = {
  form: FormValues
  receiptName: string
  amount: number
  commission: number
  netAmount: number
  usdAmount: string
  receiptInput: RefObject<HTMLInputElement | null>
  onFormChange: (field: keyof FormValues, value: string) => void
  onReceiptChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDraft: () => void
  onBack: () => void
  onReview: () => void
  onImport: () => void
}

function TransferFormPage({ form, receiptName, amount, commission, netAmount, usdAmount, receiptInput, onFormChange, onReceiptChange, onDraft, onBack, onReview, onImport }: TransferFormProps) {
  return (
    <>
      <div className="transfer-create-heading">
        <div><div className="transfer-breadcrumb">الحوالات <ChevronLeft size={11} /> تسجيل حوالة جديدة</div><h1>تسجيل حوالة جديدة</h1><p>أدخل بيانات الحوالة بدقة وراجعها قبل الحفظ</p></div>
        <button className="transfer-tool-button" onClick={onImport}><ArrowUpFromLine size={13} />رفع ملف Excel</button>
      </div>
      <div className="transfer-create-grid">
        <section className="transfer-form-panel">
          <FormSection number="١" title="صورة إيصال التحويل">
            <input ref={receiptInput} className="visually-hidden" type="file" accept="image/*,.pdf" onChange={onReceiptChange} />
            <button className="receipt-upload" onClick={() => receiptInput.current?.click()}><span className="receipt-upload-icon"><ImagePlus size={19} /></span><span><strong>{receiptName || 'اختر صورة الإيصال'}</strong><small>PNG أو JPG أو PDF · بحد أقصى 10MB</small></span><Upload size={16} /></button>
          </FormSection>
          <FormSection number="٢" title="الدولة والتاجر">
            <div className="transfer-fields two-fields">
              <Field label="الدولة" required><select value={form.country} onChange={(event) => onFormChange('country', event.target.value)}>{transferCountries.map((item) => <option key={item}>{item}</option>)}</select></Field>
              <Field label="التاجر" required><select value={form.merchant} onChange={(event) => onFormChange('merchant', event.target.value)}><option>محمد سامي</option><option>مؤسسة الريان</option><option>دار الخير</option><option>نور التجارية</option></select></Field>
              <Field label="وسيلة التحويل"><select value={form.method} onChange={(event) => onFormChange('method', event.target.value)}><option>Vodafone Cash</option><option>InstaPay</option><option>Bank Transfer</option><option>STC Pay</option></select></Field>
              <Field label="رقم الهاتف"><input value={form.phone} onChange={(event) => onFormChange('phone', event.target.value)} dir="ltr" /></Field>
            </div>
          </FormSection>
          <FormSection number="٣" title="بيانات التحويل">
            <div className="transfer-fields two-fields">
              <Field label="رقم الحوالة" required><input value={form.number} onChange={(event) => onFormChange('number', event.target.value)} dir="ltr" /></Field>
              <Field label="قيمة التحويل" required><input type="number" min="1" value={form.amount} onChange={(event) => onFormChange('amount', event.target.value)} dir="ltr" /></Field>
              <Field label="العملة"><select value={form.currency} onChange={(event) => onFormChange('currency', event.target.value)}>{transferCurrencies.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}</select></Field>
              <Field label="اسم المحول" required><input value={form.sender} onChange={(event) => onFormChange('sender', event.target.value)} /></Field>
              <Field label="تاريخ التحويل" required><input value={form.date} onChange={(event) => onFormChange('date', event.target.value)} dir="ltr" /></Field>
              <Field label="ملاحظات"><input value={form.note} onChange={(event) => onFormChange('note', event.target.value)} placeholder="اختياري" /></Field>
            </div>
          </FormSection>
          <div className="transfer-form-actions"><button className="transfer-draft-button" onClick={onDraft}>حفظ كمسودة</button><span /><button className="transfer-cancel-button" onClick={onBack}>إلغاء</button><button className="transfer-primary-button" onClick={onReview}>مراجعة التحويل</button></div>
        </section>
        <ReceiptPreview form={form} receiptName={receiptName} amount={amount} commission={commission} netAmount={netAmount} usdAmount={usdAmount} onImport={onImport} />
      </div>
    </>
  )
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="transfer-form-section"><h2><span>{number}</span>{title}</h2>{children}</section>
}

function Field({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="transfer-field"><span>{label}{required && <b> *</b>}</span>{children}</label>
}

function ReceiptPreview({ form, receiptName, amount, commission, netAmount, usdAmount, onImport }: { form: FormValues; receiptName: string; amount: number; commission: number; netAmount: number; usdAmount: string; onImport: () => void }) {
  const rate = transferCurrencies.find((item) => item.code === form.currency)?.rate ?? 1
  return (
    <aside className="transfer-preview-column">
      <section className="transfer-preview-card">
        <h2>معاينة الإيصال</h2>
        <div className="receipt-paper"><div className="receipt-brand">Vodafone Cash</div>{receiptName && <div className="receipt-file"><FileText size={13} />{receiptName}</div>}<strong className="receipt-success">تمت العملية بنجاح</strong><ReceiptLine label="المبلغ" value={`${amount.toLocaleString('en-US')} ${form.currency}`} /><ReceiptLine label="رقم الهاتف" value={form.phone} /><ReceiptLine label="المحول" value={form.sender} /><ReceiptLine label="رقم العملية" value={form.number} /><ReceiptLine label="التاريخ" value={form.date} /><small>تمت معالجة التحويل بنجاح</small></div>
        {!receiptName && <button className="preview-import-link" onClick={onImport}>أو ارفع ملف Excel للحوالات</button>}
      </section>
      <section className="transfer-calculation-card">
        <h2>احتساب العمولة والصافي</h2><p>يتم احتساب العمولة تلقائيًا حسب إعدادات التاجر</p>
        <div><span>المبلغ</span><strong dir="ltr">{amount.toLocaleString('en-US')} {form.currency}</strong></div>
        <div className="commission-line"><span>العمولة (٢٪)</span><strong dir="ltr">- {commission.toLocaleString('en-US')} {form.currency}</strong></div>
        <div><span>صافي المبلغ المستلم</span><strong dir="ltr">{netAmount.toLocaleString('en-US')} {form.currency}</strong></div>
        <div className="exchange-equivalent"><span>سعر الصرف</span><strong dir="ltr">1 USD = {rate.toFixed(3)} {form.currency}</strong></div>
        <small>سعر الصرف حسب آخر تحديث للأسعار</small><div className="usd-total"><span>القيمة المحسوبة بالدولار</span><strong dir="ltr">$ {usdAmount}</strong></div>
      </section>
    </aside>
  )
}

function ReceiptLine({ label, value }: { label: string; value: string }) {
  return <div className="receipt-line"><span>{label}</span><strong>{value}</strong></div>
}

function ReviewModal({ form, amount, commission, netAmount, usdAmount, onClose, onConfirm }: { form: FormValues; amount: number; commission: number; netAmount: number; usdAmount: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <ModalFrame className="review-modal" onClose={onClose}>
      <div className="transfer-modal-heading"><div><h2>مراجعة التحويل قبل الحفظ</h2><p>تأكد من البيانات المدخلة قبل اعتماد الحوالة وإضافتها إلى السجل</p></div><button className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={17} /></button></div>
      <div className="review-modal-content"><div className="review-receipt"><div className="receipt-brand">Vodafone Cash</div><div className="receipt-placeholder"><span /><span /><span /></div><small>صورة الإيصال</small></div><div className="review-fields"><ReviewValue label="الدولة" value={form.country} /><ReviewValue label="التاجر" value={form.merchant} /><ReviewValue label="طريقة التحويل" value={form.method} /><ReviewValue label="رقم العملية" value={form.number} /><ReviewValue label="اسم المحول" value={form.sender} /><ReviewValue label="رقم الهاتف" value={form.phone} /><ReviewValue label="تاريخ التحويل" value={form.date} /></div></div>
      <div className="review-totals"><ReviewTotal label="قيمة التحويل" value={`${amount.toLocaleString('en-US')} ${form.currency}`} /><ReviewTotal label="العمولة" value={`${commission.toLocaleString('en-US')} ${form.currency}`} negative /><ReviewTotal label="صافي المبلغ" value={`${netAmount.toLocaleString('en-US')} ${form.currency}`} /><ReviewTotal label="القيمة بالدولار" value={`$ ${usdAmount}`} positive /></div>
      <p className="review-note">عند تأكيد الحوالة سيتم تسجيلها في النظام ولا يمكن التراجع عنها.</p>
      <div className="transfer-modal-actions"><button className="transfer-cancel-button" onClick={onClose}><ArrowRight size={13} />رجوع للتعديل</button><button className="transfer-primary-button" onClick={onConfirm}><Check size={13} />تأكيد وحفظ التحويل</button></div>
    </ModalFrame>
  )
}

function ReviewValue({ label, value }: { label: string; value: string }) {
  return <div className="review-value"><span>{label}</span><strong>{value}</strong></div>
}

function ReviewTotal({ label, value, negative = false, positive = false }: { label: string; value: string; negative?: boolean; positive?: boolean }) {
  return <div className={`review-total ${negative ? 'review-negative' : ''} ${positive ? 'review-positive' : ''}`}><span>{label}</span><strong dir="ltr">{value}</strong></div>
}

function ImportModal({ fileName, inputRef, onFileChange, onClose, onImport }: { fileName: string; inputRef: RefObject<HTMLInputElement | null>; onFileChange: (event: ChangeEvent<HTMLInputElement>) => void; onClose: () => void; onImport: () => void }) {
  return (
    <ModalFrame className="import-modal" onClose={onClose}>
      <div className="transfer-modal-heading"><div><h2>رفع تحويلات من ملف Excel</h2><p>ارفع ملف الحوالات وسيتم التحقق من البيانات قبل إضافتها للنظام</p></div><button className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={17} /></button></div>
      <div className="import-file-row"><div className="import-file-info"><span className="excel-file-icon"><FileSpreadsheet size={17} /></span><div><strong>{fileName || 'لم يتم اختيار ملف'}</strong><small>{fileName ? 'Excel · 48 KB · تم التحقق' : 'اختر ملف Excel لعرض معاينة البيانات'}</small></div></div><input ref={inputRef} className="visually-hidden" type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} /><button className="transfer-tool-button" onClick={() => inputRef.current?.click()}><Upload size={13} />استبدال الملف</button></div>
      <div className="import-stats"><div><span>إجمالي الحوالات</span><strong>٥١</strong></div><div className="import-valid"><span>مستوفاة وصالحة</span><strong>٤٨</strong></div><div className="import-invalid"><span>بحاجة إلى مراجعة</span><strong>٣</strong></div></div>
      <div className="import-table-wrap"><table className="import-table"><thead><tr><th>#</th><th>رقم الحوالة</th><th>الدولة</th><th>التاجر</th><th>المبلغ</th><th>العملة</th><th>الحالة</th></tr></thead><tbody>{importRows.map((row, index) => <tr key={row.number}><td>{index + 1}</td><td dir="ltr">{row.number}</td><td>{row.country}</td><td>{row.merchant}</td><td dir="ltr">{row.amount}</td><td dir="ltr">{row.currency}</td><td><span className={`import-row-status ${row.status === 'صالح' ? 'import-row-valid' : 'import-row-invalid'}`}>{row.status === 'صالح' ? <Check size={10} /> : <AlertCircle size={10} />}{row.status}</span></td></tr>)}</tbody></table></div>
      <div className="import-modal-footer"><span>سيتم إضافة الحوالات الصالحة فقط ويمكنك مراجعة الحالات غير المستوفاة لاحقًا.</span><div><button className="transfer-cancel-button" onClick={onClose}>إلغاء</button><button className="transfer-primary-button" disabled={!fileName} onClick={onImport}>اعتماد ٤٨ حوالة صالحة</button></div></div>
    </ModalFrame>
  )
}

function ModalFrame({ children, className, onClose }: { children: ReactNode; className: string; onClose: () => void }) {
  return <div className="transfer-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className={`transfer-modal ${className}`} role="dialog" aria-modal="true">{children}</section></div>
}

export default TransfersPage
