import { useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Building2, Check, ChevronDown, ChevronLeft, ChevronRight, CircleCheck, Download, Eye, MapPin, Pencil, Plus, Search, Store, Trash2, X } from 'lucide-react'
import FormSelect from './FormSelect'
import './TradersPage.css'

type Merchant = {
  id: number
  name: string
  country: string
  phone: string
  currency: string
  commission: string
  transfers: number
  balance: string
  status: 'نشط' | 'موقوف'
  lastActivity: string
}

type MerchantDraft = {
  name: string
  tradeName: string
  country: string
  phone: string
  email: string
  address: string
  currency: string
  commission: string
  dailyLimit: string
  transactionLimit: string
  active: boolean
  methods: string[]
}

const initialMerchants: Merchant[] = [
  { id: 1, name: 'محمد سامي', country: 'مصر', phone: '+20 100 234 5678', currency: 'EGP', commission: '2%', transfers: 126, balance: '84,200 EGP', status: 'نشط', lastActivity: '12/03/2026' },
  { id: 2, name: 'مؤسسة الريان', country: 'السعودية', phone: '+966 55 410 2200', currency: 'SAR', commission: '1.5%', transfers: 98, balance: '12,750 SAR', status: 'نشط', lastActivity: '02/04/2026' },
  { id: 3, name: 'دار الخير', country: 'الإمارات', phone: '+971 50 778 9012', currency: 'AED', commission: '2.5%', transfers: 64, balance: '0 AED', status: 'نشط', lastActivity: '18/04/2026' },
  { id: 4, name: 'Yildiz Ticaret', country: 'تركيا', phone: '+90 532 174 5567', currency: 'TRY', commission: '2.5%', transfers: 71, balance: '48,300 TRY', status: 'نشط', lastActivity: '05/05/2026' },
  { id: 5, name: 'عمال الأفق', country: 'الأردن', phone: '+962 79 555 1020', currency: 'JOD', commission: '2%', transfers: 58, balance: '1,140 JOD', status: 'نشط', lastActivity: '20/05/2026' },
  { id: 6, name: 'نور التجارية', country: 'مصر', phone: '+20 11 908 3344', currency: 'EGP', commission: '30 EGP', transfers: 145, balance: '39,800 EGP', status: 'نشط', lastActivity: '01/06/2026' },
  { id: 7, name: 'مجموعة الريادة', country: 'عُمان', phone: '+968 9 120 4455', currency: 'OMR', commission: '1%', transfers: 24, balance: '0 OMR', status: 'نشط', lastActivity: '14/07/2026' },
  { id: 8, name: 'مؤسسة فلسطين', country: 'الأردن', phone: '+962 7 330 4455', currency: 'JOD', commission: '2%', transfers: 50, balance: '0 JOD', status: 'نشط', lastActivity: '09/08/2026' },
  { id: 9, name: 'الفرح للخدمات', country: 'مصر', phone: '+20 55 600 3100', currency: 'EGP', commission: '2%', transfers: 50, balance: '0 EGP', status: 'موقوف', lastActivity: '09/09/2026' },
  { id: 10, name: 'Kaya Döviz', country: 'تركيا', phone: '+90 542 210 9020', currency: 'TRY', commission: '20 TRY', transfers: 0, balance: '0 TRY', status: 'موقوف', lastActivity: '22/08/2026' },
  { id: 11, name: 'شركة المدار للتجارة', country: 'مصر', phone: '+20 100 554 7001', currency: 'EGP', commission: '2%', transfers: 84, balance: '42,600 EGP', status: 'نشط', lastActivity: '02/09/2026' },
  { id: 12, name: 'مؤسسة النور', country: 'السعودية', phone: '+966 55 321 7800', currency: 'SAR', commission: '1.5%', transfers: 92, balance: '8,250 SAR', status: 'نشط', lastActivity: '11/09/2026' },
  { id: 13, name: 'شركة آفاق', country: 'الإمارات', phone: '+971 50 332 1800', currency: 'AED', commission: '2%', transfers: 39, balance: '6,300 AED', status: 'نشط', lastActivity: '14/09/2026' },
  { id: 14, name: 'الشرق للصرافة', country: 'مصر', phone: '+20 11 234 5880', currency: 'EGP', commission: '2.5%', transfers: 73, balance: '25,400 EGP', status: 'نشط', lastActivity: '18/09/2026' },
  { id: 15, name: 'الصفوة للحوالات', country: 'الأردن', phone: '+962 79 221 1900', currency: 'JOD', commission: '1.5%', transfers: 55, balance: '880 JOD', status: 'نشط', lastActivity: '20/09/2026' },
  { id: 16, name: 'Bosphorus Exchange', country: 'تركيا', phone: '+90 532 610 4421', currency: 'TRY', commission: '2%', transfers: 108, balance: '37,500 TRY', status: 'نشط', lastActivity: '22/09/2026' },
  { id: 17, name: 'الوسيط المالي', country: 'عُمان', phone: '+968 9 887 1600', currency: 'OMR', commission: '1%', transfers: 31, balance: '220 OMR', status: 'نشط', lastActivity: '24/09/2026' },
  { id: 18, name: 'شركة الأمان', country: 'مصر', phone: '+20 12 551 2640', currency: 'EGP', commission: '2%', transfers: 67, balance: '18,900 EGP', status: 'نشط', lastActivity: '25/09/2026' },
  { id: 19, name: 'دار الاستثمار', country: 'السعودية', phone: '+966 54 880 3400', currency: 'SAR', commission: '1.5%', transfers: 49, balance: '5,700 SAR', status: 'نشط', lastActivity: '27/09/2026' },
  { id: 20, name: 'النخبة للخدمات', country: 'الإمارات', phone: '+971 55 808 1130', currency: 'AED', commission: '2%', transfers: 27, balance: '1,250 AED', status: 'نشط', lastActivity: '29/09/2026' },
  { id: 21, name: 'الرواد التجارية', country: 'مصر', phone: '+20 10 872 2341', currency: 'EGP', commission: '2%', transfers: 42, balance: '11,800 EGP', status: 'نشط', lastActivity: '01/10/2026' },
  { id: 22, name: 'المدينة للتحويلات', country: 'الأردن', phone: '+962 78 440 1122', currency: 'JOD', commission: '1.5%', transfers: 19, balance: '430 JOD', status: 'نشط', lastActivity: '03/10/2026' },
  { id: 23, name: 'الريادة الدولية', country: 'تركيا', phone: '+90 530 445 1670', currency: 'TRY', commission: '2%', transfers: 36, balance: '9,700 TRY', status: 'نشط', lastActivity: '04/10/2026' },
  { id: 24, name: 'بوابة الخليج', country: 'عُمان', phone: '+968 9 500 2077', currency: 'OMR', commission: '1%', transfers: 16, balance: '180 OMR', status: 'نشط', lastActivity: '05/10/2026' },
]

const emptyDraft: MerchantDraft = {
  name: '', tradeName: '', country: 'مصر', phone: '', email: '', address: '', currency: 'EGP',
  commission: '2', dailyLimit: '50000', transactionLimit: '10000', active: true, methods: ['Vodafone Cash', 'InstaPay'],
}

const countries = ['مصر', 'السعودية', 'الإمارات', 'تركيا', 'الأردن', 'عُمان']
const countryCurrencies: Record<string, string> = { مصر: 'EGP', السعودية: 'SAR', الإمارات: 'AED', تركيا: 'TRY', الأردن: 'JOD', عُمان: 'OMR' }
const paymentMethods = ['Vodafone Cash', 'InstaPay', 'تحويل بنكي']

function TradersPage() {
  const [screen, setScreen] = useState<'list' | 'create'>('list')
  const [merchants, setMerchants] = useState(initialMerchants)
  const [draft, setDraft] = useState(emptyDraft)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('كل الدول')
  const [status, setStatus] = useState('كل الحالات')
  const [successOpen, setSuccessOpen] = useState(false)
  const [page, setPage] = useState(1)

  const filteredMerchants = useMemo(() => merchants.filter((merchant) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${merchant.name} ${merchant.phone} ${merchant.country}`.toLowerCase().includes(query)
    return matchesSearch && (country === 'كل الدول' || merchant.country === country) && (status === 'كل الحالات' || merchant.status === status)
  }), [merchants, search, country, status])
  const pageCount = Math.max(1, Math.ceil(filteredMerchants.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visibleMerchants = filteredMerchants.slice((currentPage - 1) * 10, currentPage * 10)

  function updateDraft<Key extends keyof MerchantDraft>(key: Key, value: MerchantDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function startCreate() {
    setDraft(emptyDraft)
    setScreen('create')
  }

  function saveMerchant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const newMerchant: Merchant = {
      id: Date.now(),
      name: draft.tradeName || draft.name,
      country: draft.country,
      phone: draft.phone,
      currency: draft.currency,
      commission: `${draft.commission}%`,
      transfers: 0,
      balance: `0 ${draft.currency}`,
      status: draft.active ? 'نشط' : 'موقوف',
      lastActivity: new Intl.DateTimeFormat('en-GB').format(new Date()),
    }
    setMerchants((current) => [newMerchant, ...current])
    setSearch('')
    setCountry('كل الدول')
    setStatus('كل الحالات')
    setPage(1)
    setScreen('list')
    setSuccessOpen(true)
  }

  function exportMerchants() {
    const header = ['اسم التاجر', 'الدولة', 'رقم الهاتف', 'العملة', 'العمولة', 'عدد الحوالات', 'الرصيد', 'الحالة']
    const rows = filteredMerchants.map((merchant) => [merchant.name, merchant.country, merchant.phone, merchant.currency, merchant.commission, merchant.transfers, merchant.balance, merchant.status])
    const csv = [header, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'merchants.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  function toggleMethod(method: string) {
    setDraft((current) => ({
      ...current,
      methods: current.methods.includes(method) ? current.methods.filter((item) => item !== method) : [...current.methods, method],
    }))
  }

  function addBankTransferMethod() {
    setDraft((current) => current.methods.includes('تحويل بنكي')
      ? current
      : { ...current, methods: [...current.methods, 'تحويل بنكي'] })
  }

  return (
    <div className="traders-page" dir="rtl">
      {screen === 'list' ? (
        <>
          <div className="traders-heading">
            <div><h1>إدارة التجار</h1><p>اختر التجار المسجلين لإدارة حساباتهم ومتابعة نشاطهم المالي بكل سهولة</p></div>
            <div className="traders-heading-actions">
              <button className="traders-primary-button" onClick={startCreate}><Plus size={14} />إضافة تاجر</button>
              <button className="traders-tool-button" onClick={exportMerchants}><Download size={13} />تصدير Excel</button>
            </div>
          </div>

          <section className="merchant-metrics" aria-label="ملخص التجار">
            <Metric label="إجمالي التجار" value={String(merchants.length)} detail="٦ دول" accent="green" />
            <Metric label="تجار نشطون" value={String(merchants.filter((merchant) => merchant.status === 'نشط').length)} detail={`${merchants.filter((merchant) => merchant.status === 'موقوف').length} موقوف`} accent="green" />
            <Metric label="أرصدة قيد التسوية" value="$ 18,420" detail="١٤ تاجر" accent="orange" />
            <Metric label="متوسط العمولة" value="2.1%" detail="نسبة ثابتة" accent="plain" />
          </section>

          <section className="merchant-list-panel">
            <div className="merchant-list-heading"><div><h2>قائمة التجار</h2><p>{merchants.length} تاجر مسجل</p></div><span className="merchant-live-count"><i />{merchants.filter((merchant) => merchant.status === 'نشط').length} نشط</span></div>
            <div className="merchant-filters">
              <label className="merchant-search"><Search size={13} /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="بحث باسم التاجر أو الهاتف..." /></label>
              <FormSelect className="merchant-select" ariaLabel="الدولة" value={country} onChange={(value) => { setCountry(value); setPage(1) }} options={['كل الدول', ...countries].map((item) => ({ label: item, value: item }))} />
              <FormSelect className="merchant-select" ariaLabel="حالة التاجر" value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={['كل الحالات', 'نشط', 'موقوف'].map((item) => ({ label: item, value: item }))} />
              <button className="merchant-filter-shortcut" onClick={() => { setCountry('كل الدول'); setStatus('كل الحالات'); setSearch('') }}>كل الفلاتر <ChevronDown size={12} /></button>
            </div>
            <div className="merchant-table-scroll">
              <table className="merchant-table">
                <thead><tr><th>اسم التاجر</th><th>الدولة</th><th>رقم الهاتف</th><th>العمولة</th><th>عدد الحوالات</th><th>الرصيد</th><th>آخر نشاط</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {visibleMerchants.map((merchant) => (
                    <tr key={merchant.id}>
                      <td className="merchant-name">{merchant.name}</td>
                      <td>{merchant.country}</td>
                      <td className="merchant-phone">{merchant.phone}</td>
                      <td>{merchant.commission}</td>
                      <td>{merchant.transfers}</td>
                      <td className="merchant-balance">{merchant.balance}</td>
                      <td>{merchant.lastActivity}</td>
                      <td><span className={`merchant-status ${merchant.status === 'نشط' ? 'is-active' : 'is-paused'}`}><i />{merchant.status}</span></td>
                      <td><div className="merchant-row-actions"><button title="حذف التاجر" aria-label={`حذف ${merchant.name}`} onClick={() => setMerchants((current) => current.filter((item) => item.id !== merchant.id))}><Trash2 size={11} /></button><button title="تعديل التاجر" aria-label={`تعديل ${merchant.name}`}><Pencil size={11} /></button><button title="عرض التفاصيل" aria-label={`عرض ${merchant.name}`}><Eye size={11} /></button></div></td>
                    </tr>
                  ))}
                  {filteredMerchants.length === 0 && <tr><td className="merchant-empty" colSpan={9}>لا توجد نتائج مطابقة</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="merchant-table-footer"><span>عرض {filteredMerchants.length ? (currentPage - 1) * 10 + 1 : 0} - {Math.min(currentPage * 10, filteredMerchants.length)} من {filteredMerchants.length} تاجر</span><div className="merchant-pagination"><button aria-label="الصفحة السابقة" onClick={() => setPage(Math.max(1, currentPage - 1))}><ChevronRight size={12} /></button>{Array.from({ length: pageCount }, (_, index) => <button className={currentPage === index + 1 ? 'is-current' : ''} key={index + 1} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button aria-label="الصفحة التالية" onClick={() => setPage(Math.min(pageCount, currentPage + 1))}><ChevronLeft size={12} /></button></div></div>
          </section>
        </>
      ) : (
        <MerchantForm draft={draft} onChange={updateDraft} onToggleMethod={toggleMethod} onAddBankTransfer={addBankTransferMethod} onBack={() => setScreen('list')} onSubmit={saveMerchant} />
      )}

      {successOpen && <SuccessDialog onClose={() => setSuccessOpen(false)} onAddAnother={() => { setSuccessOpen(false); startCreate() }} />}
    </div>
  )
}

function Metric({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: 'green' | 'orange' | 'plain' }) {
  return <article className="merchant-metric"><span>{label}</span><strong className={`metric-${accent}`}>{value}</strong><small>{detail}</small></article>
}

function MerchantForm({ draft, onChange, onToggleMethod, onAddBankTransfer, onBack, onSubmit }: {
  draft: MerchantDraft
  onChange: <Key extends keyof MerchantDraft>(key: Key, value: MerchantDraft[Key]) => void
  onToggleMethod: (method: string) => void
  onAddBankTransfer: () => void
  onBack: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <>
      <div className="merchant-create-heading">
        <div><div className="merchant-breadcrumb"><span>الرئيسية</span><ChevronLeft size={11} /><button onClick={onBack}>إدارة التجار</button><ChevronLeft size={11} /><span>إضافة تاجر جديد</span></div><h1>إضافة تاجر جديد</h1><p>أدخل بيانات التاجر الأساسية ووسائل التحصيل لتفعيل حسابه</p></div>
        <button className="traders-tool-button" onClick={onBack}><ChevronRight size={13} />رجوع لقائمة التجار</button>
      </div>
      <div className="merchant-create-grid">
        <form className="merchant-form-panel" onSubmit={onSubmit}>
          <FormSection number="١" title="البيانات الأساسية">
            <div className="merchant-fields">
              <Field label="اسم التاجر" required><input required value={draft.name} onChange={(event) => onChange('name', event.target.value)} placeholder="الاسم الكامل" /></Field>
              <Field label="الاسم التجاري"><input value={draft.tradeName} onChange={(event) => onChange('tradeName', event.target.value)} placeholder="اسم النشاط التجاري" /></Field>
              <Field label="الدولة" required><FormSelect className="form-select-field" ariaLabel="الدولة" required value={draft.country} onChange={(nextCountry) => { onChange('country', nextCountry); onChange('currency', countryCurrencies[nextCountry]) }} options={countries.map((item) => ({ label: item, value: item }))} /></Field>
              <Field label="رقم الهاتف" required><input required type="tel" value={draft.phone} onChange={(event) => onChange('phone', event.target.value)} placeholder="+20 100 000 0000" /></Field>
              <Field label="البريد الإلكتروني"><input type="email" value={draft.email} onChange={(event) => onChange('email', event.target.value)} placeholder="name@company.com" /></Field>
              <Field label="عنوان النشاط"><input value={draft.address} onChange={(event) => onChange('address', event.target.value)} placeholder="المدينة، المنطقة" /></Field>
            </div>
          </FormSection>
          <FormSection number="٢" title="الإعدادات المالية">
            <div className="merchant-fields merchant-fields-four">
              <Field label="العملة الرئيسية" required><FormSelect className="form-select-field" ariaLabel="العملة الرئيسية" required value={draft.currency} onChange={(value) => onChange('currency', value)} options={Object.values(countryCurrencies).map((item) => ({ label: item, value: item }))} /></Field>
              <Field label="نسبة العمولة (%)" required><input required type="number" min="0" max="100" step="0.1" value={draft.commission} onChange={(event) => onChange('commission', event.target.value)} /></Field>
              <Field label="الحد اليومي" required><input required type="number" min="1" value={draft.dailyLimit} onChange={(event) => onChange('dailyLimit', event.target.value)} /></Field>
              <Field label="حد العملية" required><input required type="number" min="1" value={draft.transactionLimit} onChange={(event) => onChange('transactionLimit', event.target.value)} /></Field>
            </div>
          </FormSection>
          <FormSection number="٣" title="وسائل التحصيل">
            <p className="merchant-section-hint">اختر وسائل التحصيل التي يرغب التاجر في استقبال الحوالات من خلالها</p>
            <div className="merchant-methods">
              {paymentMethods.map((method) => <label className="merchant-method" key={method}><input type="checkbox" checked={draft.methods.includes(method)} onChange={() => onToggleMethod(method)} /><span className="merchant-check"><Check size={10} /></span><span>{method}</span><input className="merchant-method-account" aria-label={`بيانات ${method}`} placeholder={method === 'تحويل بنكي' ? 'اسم البنك / رقم الحساب' : 'رقم المحفظة / الحساب'} /></label>)}
            </div>
            <button className="merchant-add-method" type="button" onClick={onAddBankTransfer}><Plus size={12} />إضافة وسيلة تحصيل أخرى</button>
          </FormSection>
          <FormSection number="٤" title="حالة التاجر">
            <label className="merchant-active-toggle"><span><strong>تفعيل حساب التاجر</strong><small>سيتمكن التاجر من استقبال الحوالات فور تفعيل الحساب</small></span><input type="checkbox" checked={draft.active} onChange={(event) => onChange('active', event.target.checked)} /><i /></label>
          </FormSection>
          <div className="merchant-form-actions"><button className="traders-tool-button" type="button" onClick={onBack}>إلغاء</button><button className="traders-primary-button" type="submit"><Check size={13} />حفظ التاجر</button></div>
        </form>

        <aside className="merchant-preview-column">
          <section className="merchant-preview-card"><h2>ملخص التاجر</h2><div className="merchant-preview-brand"><span><Store size={17} /></span><div><strong>{draft.tradeName || draft.name || 'اسم التاجر'}</strong><small>{draft.name || 'الاسم الكامل'}</small></div></div><PreviewLine icon={<MapPin size={12} />} label="الدولة" value={draft.country} /><PreviewLine icon={<Building2 size={12} />} label="العملة الرئيسية" value={draft.currency} /><PreviewLine icon={<CircleCheck size={12} />} label="نسبة العمولة" value={`${draft.commission || '0'}%`} /><PreviewLine icon={<span className="preview-phone-icon">☎</span>} label="رقم الهاتف" value={draft.phone || '—'} /><div className="merchant-preview-note"><strong><CircleCheck size={12} />معلومات مهمة</strong><p>سيتمكن التاجر من الدخول إلى لوحة التحكم ومتابعة الحوالات بعد حفظ البيانات.</p></div></section>
        </aside>
      </div>
    </>
  )
}

function FormSection({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <section className="merchant-form-section"><h2><span>{number}</span>{title}</h2>{children}</section>
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <label className="merchant-field"><span>{label}{required && <b> *</b>}</span>{children}</label>
}

function PreviewLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <div className="merchant-preview-line"><span>{icon}{label}</span><strong>{value}</strong></div>
}

function SuccessDialog({ onClose, onAddAnother }: { onClose: () => void; onAddAnother: () => void }) {
  return <div className="merchant-success-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="merchant-success-dialog" role="dialog" aria-modal="true" aria-labelledby="merchant-success-title"><button className="merchant-success-close" aria-label="إغلاق" onClick={onClose}><X size={14} /></button><span className="merchant-success-icon"><CircleCheck size={25} fill="currentColor" /></span><h2 id="merchant-success-title">تمت الإضافة بنجاح</h2><p>تمت إضافة التاجر بنجاح، وأصبح بإمكانه تسجيل الدخول واستقبال الحوالات.</p><div><button className="traders-tool-button" onClick={onAddAnother}>إضافة تاجر آخر</button><button className="traders-primary-button" onClick={onClose}>العودة للتجار</button></div></section></div>
}

export default TradersPage
