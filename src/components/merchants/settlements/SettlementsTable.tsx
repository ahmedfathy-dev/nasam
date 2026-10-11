import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  formatAmount,
  formatUsdFixed,
  settlementHasDiff,
  type MerchantSettlementRow,
} from '../../../data/merchantDetailsData'
import SettlementStatusBadge from './SettlementStatusBadge'
import {
  merchantCard,
  merchantCardField,
  merchantCardGrid,
  merchantCardHead,
  merchantDesktopTable,
  merchantMobileCards,
  stickyFirstCol,
  stickyFirstColHead,
} from '../merchantTw'

export type SettlementSortKey = 'date' | 'collected' | 'netDue'

type SettlementsTableProps = {
  rows: MerchantSettlementRow[]
  loading?: boolean
  error?: string | null
  page: number
  pageCount: number
  total: number
  pageSize: number
  sort: SettlementSortKey
  sortDir: 'asc' | 'desc'
  onSort: (key: SettlementSortKey) => void
  onPageChange: (page: number) => void
  onRowClick: (row: MerchantSettlementRow) => void
  onRetry?: () => void
}

const th = 'h-10 border-b border-[#edf0f2] px-2.5 text-end text-[10px] font-semibold text-[#929aa2]'
const td = 'h-[46px] border-b border-[#f0f2f4] px-2.5 text-end text-[11px] text-[#545d64]'
const skeleton = 'sh-skeleton block h-2.5 w-[70%] rounded bg-[linear-gradient(90deg,#eef1f3_25%,#f7f8f9_50%,#eef1f3_75%)] bg-[length:200%_100%] animate-[sh-shimmer_1.1s_linear_infinite]'
const pageBtn = cn(
  'grid size-10 min-w-10 place-items-center rounded-sm border border-[#e7eaed] bg-surface px-1.5 text-[11px] text-[#68727a]',
  'disabled:cursor-not-allowed disabled:opacity-45',
  'min-[640px]:h-8 min-[640px]:min-w-8',
)

function SettlementsTable({ table }: { table: SettlementsTableProps }) {
  const {
    rows: sourceRows,
    loading,
    error,
    page,
    pageCount,
    total,
    pageSize,
    sort,
    sortDir,
    onSort,
    onPageChange,
    onRowClick,
    onRetry,
  } = table
  const rows = sourceRows ?? []
  const from = total ? (page - 1) * pageSize + 1 : 0
  const to = Math.min(page * pageSize, total)

  function sortLabel(key: SettlementSortKey, label: string) {
    const active = sort === key
    return (
      <button
        type="button"
        className={cn('sh-sort inline-flex items-center gap-1 border-0 bg-transparent font-inherit font-semibold text-inherit', active && 'is-active text-[#5d666d]')}
        onClick={() => onSort(key)}
      >
        {label}
        {active ? <span aria-hidden="true">{sortDir === 'asc' ? '↑' : '↓'}</span> : null}
      </button>
    )
  }

  return (
    <div className="sh-table-card grid gap-0">
      <div className={cn('sh-table-scroll w-full overflow-x-auto', merchantDesktopTable)}>
        <table className="sh-table w-full min-w-[1180px] border-collapse whitespace-nowrap">
          <thead className="bg-[#fafbfc]">
            <tr>
              <th className={cn(th, stickyFirstColHead)}>رقم التسوية</th>
              <th className={th}>{sortLabel('date', 'التاريخ')}</th>
              <th className={th}>الفترة</th>
              <th className={th}>التحويلات</th>
              <th className={th}>{sortLabel('collected', 'المحصل')}</th>
              <th className={th}>العمولات</th>
              <th className={th}>{sortLabel('netDue', 'الصافي المستحق')}</th>
              <th className={th}>المحوّل فعليًا</th>
              <th className={th}>سعر الصرف</th>
              <th className={th}>المرجع</th>
              <th className={th}>بواسطة</th>
              <th className={th}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, index) => (
              <tr key={`sk-${index}`} className="is-skeleton-row">
                {Array.from({ length: 12 }).map((__, cell) => (
                  <td key={cell} className={td}><span className={skeleton} /></td>
                ))}
              </tr>
            ))}

            {!loading && error && (
              <tr>
                <td className="sh-empty !h-[180px]" colSpan={12}>
                  <div className="sh-empty-state grid place-items-center gap-2 text-center text-text-muted">
                    <p>{error}</p>
                    {onRetry && <button type="button" className="sh-btn-outline inline-flex min-h-10 items-center justify-center gap-[7px] rounded-md border border-[#e4e9ed] bg-surface px-3.5 text-[11px] text-[#56616c] hover:bg-[#f7f8f9] min-[640px]:min-h-[34px]" onClick={onRetry}>إعادة المحاولة</button>}
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && rows.map((row) => {
              const differs = settlementHasDiff(row)
              return (
                <tr key={row.id} className="cursor-pointer hover:bg-[#fafcfd]" onClick={() => onRowClick(row)}>
                  <td className={cn(td, 'sh-id font-semibold text-[#343d44]', stickyFirstCol)} dir="ltr">{row.id}</td>
                  <td className={td} dir="ltr">{row.date}</td>
                  <td className={td} dir="ltr">{row.period}</td>
                  <td className={td}>{formatAmount(row.transfersCount)}</td>
                  <td className={td} dir="ltr">{formatAmount(row.collected)} {row.currency}</td>
                  <td className={td} dir="ltr">{formatAmount(row.commissions)} {row.currency}</td>
                  <td className={cn(td, 'sh-net font-bold text-[#243039]')} dir="ltr">{formatUsdFixed(row.netDue)}</td>
                  <td className={cn(td, differs ? 'sh-amount-red font-bold text-danger' : 'sh-amount-green font-bold text-green')} dir="ltr">
                    {formatUsdFixed(row.transferredUsd)}
                  </td>
                  <td className={cn(td, 'sh-muted text-[#95a0a7]')} dir="ltr">@ {row.exchangeRate.toFixed(2)}</td>
                  <td className={cn(td, 'sh-muted text-[#95a0a7]')} dir="ltr">{row.reference}</td>
                  <td className={td}>{row.by}</td>
                  <td className={td}><SettlementStatusBadge row={row} /></td>
                </tr>
              )
            })}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td className="sh-empty !h-[180px]" colSpan={12}>
                  <div className="sh-empty-state grid place-items-center gap-2 text-center text-text-muted">
                    <Inbox size={28} />
                    <p>لا توجد تسويات</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={cn(merchantMobileCards, 'sh-mobile-cards')} aria-label="سجل التسويات">
        {loading && <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">جاري التحميل...</strong></div>}
        {!loading && error && (
          <div className={cn(merchantCard, 'sh-empty-state grid place-items-center gap-2 text-center text-text-muted')}>
            <p>{error}</p>
            {onRetry && <button type="button" className="sh-btn-outline inline-flex min-h-10 items-center justify-center gap-[7px] rounded-md border border-[#e4e9ed] bg-surface px-3.5 text-[11px] text-[#56616c]" onClick={onRetry}>إعادة المحاولة</button>}
          </div>
        )}
        {!loading && !error && rows.map((row) => {
          const differs = settlementHasDiff(row)
          return (
            <article key={row.id} className={cn(merchantCard, 'sh-mobile-card cursor-pointer')} onClick={() => onRowClick(row)}>
              <div className={merchantCardHead}>
                <strong className="sh-id min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-[#343d44]" dir="ltr">{row.id}</strong>
                <SettlementStatusBadge row={row} />
              </div>
              <div className={merchantCardGrid}>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">التاريخ</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.date}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الفترة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.period}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">التحويلات</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{formatAmount(row.transfersCount)}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">المحصل</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.collected)} {row.currency}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الصافي</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatUsdFixed(row.netDue)}</b></div>
                <div className={merchantCardField}>
                  <span className="text-[9px] text-text-muted">المحوّل</span>
                  <b className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold', differs ? 'sh-amount-red text-danger' : 'sh-amount-green text-green')} dir="ltr">{formatUsdFixed(row.transferredUsd)}</b>
                </div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">المرجع</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.reference}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">بواسطة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{row.by}</b></div>
              </div>
            </article>
          )
        })}
        {!loading && !error && rows.length === 0 && (
          <div className={cn(merchantCard, 'sh-empty-state grid place-items-center gap-2 text-center text-text-muted')}>
            <Inbox size={28} />
            <p>لا توجد تسويات</p>
          </div>
        )}
      </div>

      <div className="sh-footer mt-2.5 flex min-h-0 flex-col items-stretch gap-2 text-center text-[11px] text-text-muted min-[640px]:min-h-12 min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-3 min-[640px]:text-start">
        <span>
          عرض {from}–{to} من {total} تسويات · الفروقات تُرحَّل تلقائيًا إلى التسوية التالية
        </span>
        <div className="sh-pagination merchant-pagination flex items-center justify-center gap-1.5 min-[640px]:gap-1">
          <button type="button" aria-label="السابق" className={pageBtn} disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronRight size={14} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              type="button"
              key={index + 1}
              className={cn('page-num hidden min-[640px]:grid', pageBtn, page === index + 1 && 'is-current border-green bg-green text-white')}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <span className="merchant-pagination-mobile inline-flex items-center gap-1.5 text-[11px] text-[#68727a] min-[640px]:hidden">{page} / {pageCount}</span>
          <button type="button" aria-label="التالي" className={pageBtn} disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettlementsTable
