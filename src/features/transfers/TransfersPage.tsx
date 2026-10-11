import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { AlertCircle, ArrowUpFromLine, ChevronLeft, ChevronRight, CircleCheck, Download, Plus, Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../../components/ui/FormSelect'
import { initialTransfers, transferCountries, type Transfer } from '../../data/transfersData'
import TransferFormCreate from './TransferFormCreate'
import TransferImportModal from './TransferImportModal'
import { initialImportRows } from './importRows'
import {
  transferPrimaryButtonClass,
  transferToolButtonClass,
} from './transferFieldClasses'
import type { ImportTab } from './types'

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
    <div className="transfers-page min-w-0 text-[#343b42]" dir="rtl">
      {screen === 'list' ? (
        <TransferList
          list={{
            transfers: filteredTransfers,
            notice,
            noticeTone,
            search,
            country,
            currency,
            status,
            period,
            onSearch: setSearch,
            onCountry: setCountry,
            onCurrency: setCurrency,
            onStatus: setStatus,
            onPeriod: setPeriod,
            onCreate: goCreate,
            onImport: openImport,
            onExport: exportTransfers,
          }}
        />
      ) : (
        <>
          {notice && (
            <NoticeBanner tone={noticeTone}>{notice}</NoticeBanner>
          )}
          <TransferFormCreate
            screen={{
              nextNumber,
              onCancel: () => { setNotice(''); goList() },
              onImportExcel: openImport,
              onDraftSaved: (message) => {
                setNoticeTone('success')
                setNotice(message)
              },
              onError: (message) => {
                setNoticeTone('error')
                setNotice(message)
              },
              onSaved: (transfer, message) => {
                setTransfers((current) => [transfer, ...current])
                setNoticeTone('success')
                setNotice(message)
                goList()
              },
            }}
          />
        </>
      )}

      {modal === 'import' && (
        <TransferImportModal
          dialog={{
            fileName: excelName,
            rows: importRows,
            tab: importTab,
            inputRef: excelInput,
            onTabChange: setImportTab,
            onDeleteRow: (id) => setImportRows((current) => current.filter((row) => row.id !== id)),
            onFileChange: handleExcelChange,
            onClose: () => setModal(null),
            onImport: importTransfers,
            onDownloadTemplate: () => {
            const header = ['الدولة', 'التاجر', 'الوسيلة', 'رقم الاستقبال', 'القيمة', 'رقم المرجع', 'التاريخ']
            const sample = ['مصر', 'محمد سامي', 'Vodafone Cash', '01012345678', '12000', 'VF-88213409', '05/10/2026 14:22']
            const csv = [header, sample].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
            const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
            const link = document.createElement('a')
            link.href = url
            link.download = 'transfer_import_template.csv'
            link.click()
            URL.revokeObjectURL(url)
            },
          }}
        />
      )}
    </div>
  )
}

type TransferListState = {
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

function NoticeBanner({ tone, children }: { tone: 'success' | 'error'; children: ReactNode }) {
  if (tone === 'error') {
    return (
      <p className="mb-2.5 flex items-center gap-1.5 rounded-sm border border-[#f1caca] bg-[#fff3f3] px-2.5 py-2 text-[11px] text-danger">
        <AlertCircle size={13} />
        {children}
      </p>
    )
  }
  return (
    <p className="mb-2 flex items-center gap-1.5 text-[10px] text-[#338e2d]">
      <CircleCheck size={13} />
      {children}
    </p>
  )
}

function TransferList({ list }: { list: TransferListState }) {
  const {
    transfers, notice, noticeTone, search, country, currency, status, period,
    onSearch, onCountry, onCurrency, onStatus, onPeriod, onCreate, onImport, onExport,
  } = list
  const visibleTransfers = transfers ?? []
  return (
    <>
      <div
        className={cn(
          'mb-3 flex min-h-[63px] flex-col items-start justify-between gap-4 py-[7px]',
          'min-[701px]:flex-row min-[701px]:items-center min-[701px]:py-0',
        )}
      >
        <div>
          <h1 className="text-[21px] font-semibold leading-[1.5] text-[#232a30]">الحوالات</h1>
          <p className="mt-0.5 text-[11px] text-[#8b939a]">جميع الحوالات المستلمة عبر التجار في كل الدول</p>
        </div>
        <div
          className={cn(
            'transfer-toolbar flex w-full flex-wrap items-center gap-[5px]',
            'min-[481px]:gap-2',
            'min-[701px]:w-auto',
            'print:hidden',
          )}
          dir="ltr"
        >
          <button type="button" className={transferPrimaryButtonClass} onClick={onCreate}>
            <Plus size={14} />تحويل جديد
          </button>
          <button type="button" className={transferToolButtonClass} onClick={onImport}>
            <ArrowUpFromLine size={13} />رفع ملف Excel
          </button>
          <button type="button" className={transferToolButtonClass} onClick={onExport}>
            <Download size={13} />تصدير
          </button>
        </div>
      </div>
      {notice && <NoticeBanner tone={noticeTone}>{notice}</NoticeBanner>}
      <section
        className={cn(
          'flex min-h-[65dvh] flex-col border border-[#e7eaec] bg-surface px-[11px] pb-2 pt-[9px] rounded-sm',
          'min-[701px]:min-h-[68dvh]',
          'min-[921px]:min-h-[72dvh]',
          'print:border-0',
        )}
      >
        <div
          className={cn(
            'grid grid-cols-1 gap-[7px] border-b border-[#edf0f2] pb-[9px]',
            'min-[481px]:grid-cols-2',
            'min-[701px]:grid-cols-3',
            'min-[921px]:grid-cols-[minmax(160px,1.4fr)_repeat(4,minmax(90px,0.6fr))]',
            'min-[1181px]:grid-cols-[minmax(190px,1.5fr)_repeat(4,minmax(105px,0.58fr))]',
          )}
        >
          <label
            className={cn(
              'flex h-9 min-w-0 items-center gap-1.5 rounded-[6px] border border-[#e7eaed] bg-[#f8f9fa] px-[9px] text-[#929aa1]',
              'transition-[border-color,background-color,box-shadow] duration-150',
              'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
              'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
              'min-[481px]:col-span-2',
              'min-[701px]:col-span-3',
              'min-[921px]:col-span-1',
            )}
          >
            <Search size={14} />
            <input
              className="w-full min-w-0 border-0 bg-transparent text-[10px] text-[#5d666d] outline-0"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="بحث برقم الحوالة أو اسم المحول..."
            />
          </label>
          <FilterSelect field={{ ariaLabel: 'حالة الحوالة', value: status, onChange: onStatus, options: ['كل الحالات', 'مستوفاة', 'غير مستوفاة', 'مسودة'] }} />
          <FilterSelect field={{ ariaLabel: 'الدولة', value: country, onChange: onCountry, options: ['كل الدول', ...transferCountries] }} />
          <FilterSelect field={{ ariaLabel: 'العملة', value: currency, onChange: onCurrency, options: ['كل العملات', 'EGP', 'SAR', 'AED', 'TRY', 'JOD', 'OMR', 'KWD'] }} />
          <FilterSelect field={{ ariaLabel: 'الفترة', value: period, onChange: onPeriod, options: ['الفترة هذا الشهر', 'آخر 7 أيام', 'آخر 30 يومًا'] }} />
        </div>
        <div className={cn('flex-1 overflow-auto', 'max-[700px]:max-h-[65dvh]')}>
          <table className="w-full min-w-[1060px] table-auto border-collapse whitespace-nowrap">
            <thead className="bg-[#fafbfc]">
              <tr>
                {['#', 'رقم الحوالة', 'التاريخ', 'الدولة', 'التاجر', 'المحول', 'الوسيلة', 'المبلغ', 'العملة', 'USD', 'التسوية'].map((label) => (
                  <th key={label} className="h-[38px] border-b border-[#edf0f2] px-[9px] text-start text-[9px] font-medium text-[#929aa1]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleTransfers.map((item, index) => (
                <tr key={`${item.number}-${index}`} className="hover:bg-[#fafcfd]">
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#929aa1]">{index + 1}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] font-semibold text-[#343d44]" dir="ltr">{item.number}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]" dir="ltr">{item.date}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]">{item.country}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]">{item.merchant}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]">{item.sender}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]" dir="ltr">{item.method}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]" dir="ltr">{item.amount}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]" dir="ltr">{item.currency}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] font-semibold text-[#474f55]" dir="ltr">{item.usd}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-start text-[10px] text-[#545d64]">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-xl px-1.5 py-[3px] text-[9px]',
                        item.status === 'مستوفاة' && 'bg-[#eaf6e8] text-green',
                        item.status === 'مسودة' && 'bg-[#f0f2f3] text-[#78828a]',
                        item.status !== 'مستوفاة' && item.status !== 'مسودة' && 'bg-[#f9f0e0] text-[#bd8733]',
                      )}
                    >
                      <i className="size-[5px] rounded-full bg-current" />
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!visibleTransfers.length && (
            <div className="px-3 py-[35px] text-center text-[10px] text-[#8d959b]">لا توجد حوالات مطابقة للفلاتر</div>
          )}
        </div>
        <div className="flex min-h-[42px] items-center justify-between gap-2 px-0.5 pt-1 text-[10px] text-[#858e95]">
          <span>عرض ١-{visibleTransfers.length} من ٦٤٢</span>
          <div className="flex items-center gap-[3px]">
            <PaginationButton ariaLabel="السابق"><ChevronRight size={13} /></PaginationButton>
            <PaginationButton>٥٤</PaginationButton>
            <span>…</span>
            <PaginationButton>٣</PaginationButton>
            <PaginationButton>٢</PaginationButton>
            <PaginationButton current>١</PaginationButton>
            <PaginationButton ariaLabel="التالي"><ChevronLeft size={13} /></PaginationButton>
          </div>
        </div>
      </section>
    </>
  )
}

function PaginationButton({
  children,
  current,
  ariaLabel,
}: {
  children: ReactNode
  current?: boolean
  ariaLabel?: string
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'grid h-[26px] min-w-[26px] place-items-center border px-[5px] text-[9px] rounded-[5px]',
        current
          ? 'border-green bg-green text-white'
          : 'cursor-pointer border-[#e7eaed] bg-surface text-[#68727a]',
      )}
    >
      {children}
    </button>
  )
}

function FilterSelect({ field }: { field: { value: string; options: string[]; onChange: (value: string) => void; ariaLabel: string } }) {
  return (
    <FormSelect
      field={{
        className: cn(
          'h-9 min-w-0 rounded-[6px] border border-[#e7eaed] bg-[#f8f9fa] p-0 text-[#929aa1]',
          'transition-[border-color,background-color,box-shadow] duration-150',
          'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
          'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
          '[&_.form-select-trigger]:!px-[9px] [&_.form-select-trigger]:!text-[8px]',
        ),
        ariaLabel: field.ariaLabel,
        value: field.value,
        onChange: field.onChange,
        options: (field.options ?? []).map((option) => ({ label: option, value: option })),
      }}
    />
  )
}

export default TransfersPage
