import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, Download, ArrowLeft } from 'lucide-react'
import type { MerchantDetails, MerchantSettlementRow } from '../../../data/merchantDetailsData'
import { getMerchantDetails, getMerchantSettlements, type SettlementsQuery } from '../../../services/merchantService'
import SettlementDetailsDrawer from './SettlementDetailsDrawer'
import SettlementsStatsCards from './SettlementsStatsCards'
import SettlementsTable, { type SettlementSortKey } from './SettlementsTable'
import SettlementsToolbar from './SettlementsToolbar'
import { cn } from '@/lib/cn'
import { pageShell } from '../merchantTw'

type SettlementsHistoryPageProps = {
  merchantId: number
  onBackToDetails: () => void
  onBackToMerchants: () => void
  onViewTransfers: (settlementId: string) => void
}

function SettlementsHistoryPage({ screen }: { screen: SettlementsHistoryPageProps }) {
  const {
    merchantId,
    onBackToDetails,
    onBackToMerchants,
    onViewTransfers,
  } = screen
  const [details, setDetails] = useState<MerchantDetails | null>(null)
  const [allRows, setAllRows] = useState<MerchantSettlementRow[]>([])
  const [rows, setRows] = useState<MerchantSettlementRow[]>([])
  const [total, setTotal] = useState(0)
  const [pageCount, setPageCount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [period, setPeriod] = useState('all')
  const [sort, setSort] = useState<SettlementSortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<MerchantSettlementRow | null>(null)

  const pageSize = 10

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const query: SettlementsQuery = {
        search,
        status: status as SettlementsQuery['status'],
        period: period as SettlementsQuery['period'],
        sort,
        sortDir,
        page,
        pageSize,
      }
      const [merchant, result] = await Promise.all([
        getMerchantDetails(merchantId),
        getMerchantSettlements(merchantId, query),
      ])
      if (!merchant) {
        setError('تعذر العثور على التاجر')
        return
      }
      setDetails(merchant)
      setAllRows(result.allRows)
      setRows(result.rows)
      setTotal(result.total)
      setPageCount(result.pageCount)
      if (result.page !== page) setPage(result.page)
    } catch {
      setError('تعذر تحميل سجل التسويات')
    } finally {
      setLoading(false)
    }
  }, [merchantId, search, status, period, sort, sortDir, page])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [search, status, period, sort, sortDir])

  const sinceDate = details?.createdAt ?? '12/03/2026'
  const countLabel = `${total} تسويات منذ ${sinceDate}`

  function handleSort(key: SettlementSortKey) {
    if (sort === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSort(key)
    setSortDir('desc')
  }

  function exportRows() {
    const header = [
      'رقم التسوية', 'التاريخ', 'الفترة', 'التحويلات', 'المحصل', 'العمولات',
      'الصافي المستحق', 'المحوّل فعليًا', 'سعر الصرف', 'المرجع', 'بواسطة', 'الفرق',
    ]
    const filteredForExport = filterLocal(allRows, search, status, period, sort, sortDir)
    const csvRows = filteredForExport.map((row) => [
      row.id,
      row.date,
      row.period,
      row.transfersCount,
      row.collected,
      row.commissions,
      row.netDue,
      row.transferredUsd,
      row.exchangeRate,
      row.reference,
      row.by,
      row.difference,
    ])
    const csv = [header, ...csvRows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `settlements-${merchantId}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={cn('settlements-history-page', pageShell, 'grid gap-4 text-text')} dir="rtl">
      <nav className="sh-breadcrumb flex flex-wrap items-center gap-[5px] text-[11px] text-text-muted" aria-label="مسار الصفحة">
        <button type="button" className="border-0 bg-transparent font-inherit text-inherit hover:text-green" onClick={onBackToMerchants}>التجار</button>
        <ChevronLeft size={12} />
        <button type="button" className="border-0 bg-transparent font-inherit text-inherit hover:text-green" onClick={onBackToDetails}>{details?.name ?? '...'}</button>
        <ChevronLeft size={12} />
        <strong className="font-semibold text-[#4b5662]">سجل التسويات</strong>
      </nav>

      <header className="sh-header flex flex-col items-stretch gap-[18px] min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:justify-between">
        <div className="sh-header-copy grid min-w-0 gap-1.5">
          <h1 className="text-[22px] font-bold leading-[1.25] text-[#1f2730] min-[640px]:text-[28px]">سجل التسويات</h1>
          <p className="text-xs leading-[1.6] text-text-muted">
            {details
              ? `${details.name} · ${details.country} · ${details.currency} — كل دورات التحصيل التي تم إغلاقها وتحويلها إلى مؤسسة نسم`
              : 'جاري تحميل بيانات التاجر...'}
          </p>
        </div>
        <div className="sh-header-actions flex w-full flex-none flex-col flex-wrap items-stretch justify-end gap-2 min-[640px]:w-auto min-[640px]:flex-row">
          <button type="button" className="sh-btn-back inline-flex min-h-10 w-full min-w-0 items-center justify-center gap-[7px] whitespace-nowrap rounded-md border border-[#e4e7ea] bg-[#eef0f2] px-3.5 text-xs font-semibold text-[#3f4850] hover:bg-[#e6e9ec] min-[640px]:min-w-[180px] min-[640px]:w-auto" onClick={onBackToDetails}>
            <ArrowLeft size={15} />
            رجوع لتفاصيل التاجر
          </button>
          <button type="button" className="sh-btn-outline inline-flex min-h-10 w-full items-center justify-center gap-[7px] whitespace-nowrap rounded-md border border-[#e4e9ed] bg-surface px-3.5 text-[11px] text-[#56616c] hover:bg-[#f7f8f9] min-[640px]:min-h-[34px] min-[640px]:w-auto" onClick={exportRows}>
            <Download size={13} />
            تصدير Excel
          </button>
        </div>
      </header>

      <SettlementsStatsCards
        stats={{
          settlements: allRows,
          loading: loading && !allRows.length,
          sinceDate,
          commissionLabel: details ? `بعد خصم عمولة ${details.commission}` : 'بعد خصم عمولة 2%',
        }}
      />

      <section className="sh-panel rounded-lg border border-line bg-surface p-4">
        <SettlementsToolbar
          toolbar={{
            search,
            status,
            period,
            countLabel,
            onSearchChange: setSearch,
            onStatusChange: setStatus,
            onPeriodChange: setPeriod,
          }}
        />

        <SettlementsTable
          table={{
            rows,
            loading,
            error,
            page,
            pageCount,
            total,
            pageSize,
            sort,
            sortDir,
            onSort: handleSort,
            onPageChange: setPage,
            onRowClick: setSelected,
            onRetry: () => void load(),
          }}
        />
      </section>

      <SettlementDetailsDrawer
        drawer={{
          open: Boolean(selected),
          row: selected,
          onClose: () => setSelected(null),
          onViewTransfers: (row) => {
            setSelected(null)
            onViewTransfers(row.id)
          },
        }}
      />
    </div>
  )
}

function filterLocal(
  rows: MerchantSettlementRow[],
  search: string,
  status: string,
  period: string,
  sort: SettlementSortKey,
  sortDir: 'asc' | 'desc',
) {
  const q = search.trim().toLowerCase()
  const now = new Date()
  let filtered = rows.filter((row) => {
    const matchesSearch = !q || row.id.toLowerCase().includes(q) || (row.reference ?? '').toLowerCase().includes(q)
    const diff = Math.abs(row.difference) >= 0.005 || Math.abs(row.transferredUsd - row.netDue) >= 0.005
    const matchesStatus = status === 'all' || (status === 'settled' && !diff) || (status === 'diff' && diff)
    const [d, m, y] = (row.date || '01/01/2020').split('/').map(Number)
    const rowDate = new Date(y, m - 1, d)
    let matchesPeriod = true
    if (period === '30d') {
      const from = new Date(now); from.setDate(from.getDate() - 30); matchesPeriod = rowDate >= from
    } else if (period === '3m') {
      const from = new Date(now); from.setMonth(from.getMonth() - 3); matchesPeriod = rowDate >= from
    } else if (period === '6m') {
      const from = new Date(now); from.setMonth(from.getMonth() - 6); matchesPeriod = rowDate >= from
    } else if (period === 'year') {
      matchesPeriod = rowDate.getFullYear() === now.getFullYear()
    }
    return matchesSearch && matchesStatus && matchesPeriod
  })

  filtered = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sort === 'collected') cmp = a.collected - b.collected
    else if (sort === 'netDue') cmp = a.netDue - b.netDue
    else {
      const [ad, am, ay] = (a.date || '').split('/').map(Number)
      const [bd, bm, by] = (b.date || '').split('/').map(Number)
      cmp = new Date(ay, am - 1, ad).getTime() - new Date(by, bm - 1, bd).getTime()
    }
    return sortDir === 'asc' ? cmp : -cmp
  })
  return filtered
}

export default SettlementsHistoryPage
