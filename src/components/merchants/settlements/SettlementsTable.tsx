import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import {
  formatAmount,
  formatUsdFixed,
  settlementHasDiff,
  type MerchantSettlementRow,
} from '../../../data/merchantDetailsData'
import SettlementStatusBadge from './SettlementStatusBadge'

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

function SettlementsTable({
  rows,
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
}: SettlementsTableProps) {
  const from = total ? (page - 1) * pageSize + 1 : 0
  const to = Math.min(page * pageSize, total)

  function sortLabel(key: SettlementSortKey, label: string) {
    const active = sort === key
    return (
      <button
        type="button"
        className={`sh-sort ${active ? 'is-active' : ''}`}
        onClick={() => onSort(key)}
      >
        {label}
        {active ? <span aria-hidden="true">{sortDir === 'asc' ? '↑' : '↓'}</span> : null}
      </button>
    )
  }

  return (
    <div className="sh-table-card">
      <div className="sh-table-scroll merchant-desktop-table">
        <table className="sh-table">
          <thead>
            <tr>
              <th>رقم التسوية</th>
              <th>{sortLabel('date', 'التاريخ')}</th>
              <th>الفترة</th>
              <th>التحويلات</th>
              <th>{sortLabel('collected', 'المحصل')}</th>
              <th>العمولات</th>
              <th>{sortLabel('netDue', 'الصافي المستحق')}</th>
              <th>المحوّل فعليًا</th>
              <th>سعر الصرف</th>
              <th>المرجع</th>
              <th>بواسطة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 6 }).map((_, index) => (
              <tr key={`sk-${index}`} className="is-skeleton-row">
                {Array.from({ length: 12 }).map((__, cell) => (
                  <td key={cell}><span className="sh-skeleton" /></td>
                ))}
              </tr>
            ))}

            {!loading && error && (
              <tr>
                <td className="sh-empty" colSpan={12}>
                  <div className="sh-empty-state">
                    <p>{error}</p>
                    {onRetry && <button type="button" className="sh-btn-outline" onClick={onRetry}>إعادة المحاولة</button>}
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && rows.map((row) => {
              const differs = settlementHasDiff(row)
              return (
                <tr key={row.id} onClick={() => onRowClick(row)}>
                  <td className="sh-id" dir="ltr">{row.id}</td>
                  <td dir="ltr">{row.date}</td>
                  <td dir="ltr">{row.period}</td>
                  <td>{formatAmount(row.transfersCount)}</td>
                  <td dir="ltr">{formatAmount(row.collected)} {row.currency}</td>
                  <td dir="ltr">{formatAmount(row.commissions)} {row.currency}</td>
                  <td className="sh-net" dir="ltr">{formatUsdFixed(row.netDue)}</td>
                  <td className={differs ? 'sh-amount-red' : 'sh-amount-green'} dir="ltr">
                    {formatUsdFixed(row.transferredUsd)}
                  </td>
                  <td className="sh-muted" dir="ltr">@ {row.exchangeRate.toFixed(2)}</td>
                  <td className="sh-muted" dir="ltr">{row.reference}</td>
                  <td>{row.by}</td>
                  <td><SettlementStatusBadge row={row} /></td>
                </tr>
              )
            })}

            {!loading && !error && rows.length === 0 && (
              <tr>
                <td className="sh-empty" colSpan={12}>
                  <div className="sh-empty-state">
                    <Inbox size={28} />
                    <p>لا توجد تسويات</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="merchant-mobile-cards sh-mobile-cards" aria-label="سجل التسويات">
        {loading && <div className="merchant-card"><strong>جاري التحميل...</strong></div>}
        {!loading && error && (
          <div className="merchant-card sh-empty-state">
            <p>{error}</p>
            {onRetry && <button type="button" className="sh-btn-outline" onClick={onRetry}>إعادة المحاولة</button>}
          </div>
        )}
        {!loading && !error && rows.map((row) => {
          const differs = settlementHasDiff(row)
          return (
            <article key={row.id} className="merchant-card sh-mobile-card" onClick={() => onRowClick(row)}>
              <div className="merchant-card-head">
                <strong className="sh-id" dir="ltr">{row.id}</strong>
                <SettlementStatusBadge row={row} />
              </div>
              <div className="merchant-card-grid">
                <div className="merchant-card-field"><span>التاريخ</span><b dir="ltr">{row.date}</b></div>
                <div className="merchant-card-field"><span>الفترة</span><b dir="ltr">{row.period}</b></div>
                <div className="merchant-card-field"><span>التحويلات</span><b>{formatAmount(row.transfersCount)}</b></div>
                <div className="merchant-card-field"><span>المحصل</span><b dir="ltr">{formatAmount(row.collected)} {row.currency}</b></div>
                <div className="merchant-card-field"><span>الصافي</span><b dir="ltr">{formatUsdFixed(row.netDue)}</b></div>
                <div className="merchant-card-field">
                  <span>المحوّل</span>
                  <b className={differs ? 'sh-amount-red' : 'sh-amount-green'} dir="ltr">{formatUsdFixed(row.transferredUsd)}</b>
                </div>
                <div className="merchant-card-field"><span>المرجع</span><b dir="ltr">{row.reference}</b></div>
                <div className="merchant-card-field"><span>بواسطة</span><b>{row.by}</b></div>
              </div>
            </article>
          )
        })}
        {!loading && !error && rows.length === 0 && (
          <div className="merchant-card sh-empty-state">
            <Inbox size={28} />
            <p>لا توجد تسويات</p>
          </div>
        )}
      </div>

      <div className="sh-footer">
        <span>
          عرض {from}–{to} من {total} تسويات · الفروقات تُرحَّل تلقائيًا إلى التسوية التالية
        </span>
        <div className="sh-pagination merchant-pagination">
          <button type="button" aria-label="السابق" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronRight size={14} />
          </button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button
              type="button"
              key={index + 1}
              className={`page-num ${page === index + 1 ? 'is-current' : ''}`}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <span className="merchant-pagination-mobile">{page} / {pageCount}</span>
          <button type="button" aria-label="التالي" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettlementsTable
