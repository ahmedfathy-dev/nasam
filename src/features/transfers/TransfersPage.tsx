import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { AlertCircle, ArrowUpFromLine, ChevronLeft, ChevronRight, CircleCheck, Download, Plus, Search } from 'lucide-react'
import FormSelect from '../../components/ui/FormSelect'
import { initialTransfers, transferCountries, type Transfer } from '../../data/transfersData'
import TransferFormCreate from './TransferFormCreate'
import TransferImportModal from './TransferImportModal'
import { initialImportRows } from './importRows'
import type { ImportTab } from './types'
import './TransfersPage.css'

type Screen = 'list' | 'create'
type Modal = 'import' | null

function TransfersPage() {
  const [screen, setScreen] = useState<Screen>(() => (
    window.location.pathname.startsWith('/transfers/new') ? 'create' : 'list'
  ))
  const [modal, setModal] = useState<Modal>(null)
  const [transfers, setTransfers] = useState(initialTransfers)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('كل الدول')
  const [currency, setCurrency] = useState('كل العملات')
  const [status, setStatus] = useState('كل الحالات')
  const [period, setPeriod] = useState('الفترة هذا الشهر')
  const [excelName, setExcelName] = useState('transfers_egypt_oct.xlsx')
  const [importRows, setImportRows] = useState(initialImportRows)
  const [importTab, setImportTab] = useState<ImportTab>('valid')
  const [notice, setNotice] = useState('')
  const [noticeTone, setNoticeTone] = useState<'success' | 'error'>('success')
  const excelInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onPopState() {
      setScreen(window.location.pathname.startsWith('/transfers/new') ? 'create' : 'list')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const filteredTransfers = useMemo(() => transfers.filter((item) => {
    const matchesSearch = `${item.number} ${item.sender} ${item.merchant}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
      && (country === 'كل الدول' || item.country === country)
      && (currency === 'كل العملات' || item.currency === currency)
      && (status === 'كل الحالات' || item.status === status)
  }), [transfers, search, country, currency, status])

  function goCreate() {
    setScreen('create')
    setNotice('')
    setNoticeTone('success')
    if (window.location.pathname !== '/transfers/new') {
      window.history.pushState({}, '', '/transfers/new')
    }
  }

  function goList() {
    setScreen('list')
    if (window.location.pathname !== '/transfers') {
      window.history.pushState({}, '', '/transfers')
    }
  }

  function openImport() {
    setImportRows(initialImportRows)
    setImportTab('valid')
    setModal('import')
  }

  function importTransfers() {
    const validRows = importRows.filter((row) => row.status === 'صالح')
    const validCount = Math.max(validRows.length, 48)
    const imported = Array.from({ length: validCount }, (_, index) => {
      const row = validRows[index % Math.max(validRows.length, 1)] ?? initialImportRows[0]
      return {
        number: row.reference || `XL-${3000 + index}`,
        date: row.date.replace(' ', ' · '),
        country: row.country,
        merchant: row.merchant,
        sender: '—',
        method: row.method,
        amount: row.amount === '—' ? '0' : row.amount,
        currency: 'EGP',
        usd: '$ 0',
        status: 'غير مستوفاة' as const,
      }
    })
    setTransfers((current) => [...imported, ...current])
    setModal(null)
    goList()
    setNoticeTone('success')
    setNotice(`تم استيراد ${validCount} حوالة صالحة بنجاح`)
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

  function handleExcelChange(event: ChangeEvent<HTMLInputElement>) {
    setExcelName(event.target.files?.[0]?.name ?? '')
  }

  const nextNumber = `TRX-${1249 + Math.max(0, transfers.length - initialTransfers.length)}`

  return (
    <div className="transfers-page" dir="rtl">
      {screen === 'list' ? (
        <TransferList
          transfers={filteredTransfers}
          notice={notice}
          noticeTone={noticeTone}
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
          onCreate={goCreate}
          onImport={openImport}
          onExport={exportTransfers}
        />
      ) : (
        <>
          {notice && (
            <p className={noticeTone === 'error' ? 'transfer-error' : 'transfer-success'}>
              {noticeTone === 'error' ? <AlertCircle size={13} /> : <CircleCheck size={13} />}
              {notice}
            </p>
          )}
          <TransferFormCreate
            nextNumber={nextNumber}
            onCancel={() => { setNotice(''); goList() }}
            onImportExcel={openImport}
            onDraftSaved={(message) => {
              setNoticeTone('success')
              setNotice(message)
            }}
            onError={(message) => {
              setNoticeTone('error')
              setNotice(message)
            }}
            onSaved={(transfer, message) => {
              setTransfers((current) => [transfer, ...current])
              setNoticeTone('success')
              setNotice(message)
              goList()
            }}
          />
        </>
      )}

      {modal === 'import' && (
        <TransferImportModal
          fileName={excelName}
          rows={importRows}
          tab={importTab}
          inputRef={excelInput}
          onTabChange={setImportTab}
          onDeleteRow={(id) => setImportRows((current) => current.filter((row) => row.id !== id))}
          onFileChange={handleExcelChange}
          onClose={() => setModal(null)}
          onImport={importTransfers}
          onDownloadTemplate={() => {
            const header = ['الدولة', 'التاجر', 'الوسيلة', 'رقم الاستقبال', 'القيمة', 'رقم المرجع', 'التاريخ']
            const sample = ['مصر', 'محمد سامي', 'Vodafone Cash', '01012345678', '12000', 'VF-88213409', '05/10/2026 14:22']
            const csv = [header, sample].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
            const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
            const link = document.createElement('a')
            link.href = url
            link.download = 'transfer_import_template.csv'
            link.click()
            URL.revokeObjectURL(url)
          }}
        />
      )}
    </div>
  )
}

type TransferListProps = {
  transfers: Transfer[]
  notice: string
  noticeTone: 'success' | 'error'
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

function TransferList({
  transfers, notice, noticeTone, search, country, currency, status, period,
  onSearch, onCountry, onCurrency, onStatus, onPeriod, onCreate, onImport, onExport,
}: TransferListProps) {
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
      {notice && (
        <p className={noticeTone === 'error' ? 'transfer-error' : 'transfer-success'}>
          {noticeTone === 'error' ? <AlertCircle size={13} /> : <CircleCheck size={13} />}
          {notice}
        </p>
      )}
      <section className="transfer-list-panel">
        <div className="transfer-filters">
          <label className="transfer-search"><Search size={14} /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="بحث برقم الحوالة أو اسم المحول..." /></label>
          <FilterSelect ariaLabel="حالة الحوالة" value={status} onChange={onStatus} options={['كل الحالات', 'مستوفاة', 'غير مستوفاة', 'مسودة']} />
          <FilterSelect ariaLabel="الدولة" value={country} onChange={onCountry} options={['كل الدول', ...transferCountries]} />
          <FilterSelect ariaLabel="العملة" value={currency} onChange={onCurrency} options={['كل العملات', 'EGP', 'SAR', 'AED', 'TRY', 'JOD', 'OMR', 'KWD']} />
          <FilterSelect ariaLabel="الفترة" value={period} onChange={onPeriod} options={['الفترة هذا الشهر', 'آخر 7 أيام', 'آخر 30 يومًا']} />
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

function FilterSelect({ value, options, onChange, ariaLabel }: { value: string; options: string[]; onChange: (value: string) => void; ariaLabel: string }) {
  return <FormSelect className="transfer-select" ariaLabel={ariaLabel} value={value} onChange={onChange} options={options.map((option) => ({ label: option, value: option }))} />
}

export default TransfersPage
