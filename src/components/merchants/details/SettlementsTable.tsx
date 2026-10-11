import { ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatAmount, formatUsd, type MerchantSettlementRow } from '../../../data/merchantDetailsData'
import SettlementsStats from './SettlementsStats'
import {
  mdBtnNeutral,
  mdPanel,
  mdPaginationBtn,
  mdSettleDone,
  mdSkeleton,
  mdTable,
  mdTableFooter,
  mdTableScroll,
  mdTd,
  mdTh,
  merchantCard,
  merchantCardField,
  merchantCardGrid,
  merchantCardHead,
  merchantMobileCards,
  stickyFirstCol,
  stickyFirstColHead,
} from './mdTableTw'

type SettlementsTableProps = {
  rows: MerchantSettlementRow[]
  page: number
  loading: boolean
  onPageChange: (page: number) => void
  onExport: () => void
  onViewFullHistory?: () => void
}

const PAGE_SIZE = 3

function SettlementsTable({ table }: { table: SettlementsTableProps }) {
  const { rows: sourceRows, page, loading, onPageChange, onExport, onViewFullHistory } = table
  const rows = sourceRows ?? []
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className={mdPanel}>
      <div className="md-section-head md-panel-head mb-2.5 flex flex-col items-stretch gap-2 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h2 className="text-[13px] font-bold text-[#303b46]">سجل التسويات</h2>
          <p className="mt-0.5 text-[10px] text-text-muted">ملخص التسويات المنفذة مع هذا التاجر</p>
        </div>
        <div className="md-header-actions flex w-full flex-wrap gap-1.5 min-[640px]:w-auto">
          <button type="button" className={cn(mdBtnNeutral, 'md-export-btn min-h-10 flex-1 min-[640px]:min-h-[30px] min-[640px]:flex-none')} onClick={onExport}>
            <Download size={12} /><span className="md-export-label">تصدير</span>
          </button>
          <button type="button" className={cn(mdBtnNeutral, 'min-h-10 flex-1 min-[640px]:min-h-[30px] min-[640px]:flex-none')} onClick={onViewFullHistory}>
            <ExternalLink size={12} /><span className="md-export-label">عرض السجل الكامل</span>
          </button>
        </div>
      </div>

      <SettlementsStats settlements={rows} />

      <div className={mdTableScroll}>
        <table className={mdTable}>
          <thead className="bg-[#fafbfc]">
            <tr>
              <th className={cn(mdTh, stickyFirstColHead)}>رقم التسوية</th>
              <th className={mdTh}>الفترة</th>
              <th className={mdTh}>التحويلات</th>
              <th className={mdTh}>المحصل</th>
              <th className={mdTh}>العمولات</th>
              <th className={mdTh}>الصافي المستحق</th>
              <th className={mdTh}>سعر الصرف</th>
              <th className={mdTh}>المحوّل فعلياً</th>
              <th className={mdTh}>الفرق</th>
              <th className={mdTh}>بواسطة</th>
              <th className={mdTh}>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={`sk-${index}`} className="md-skeleton-row">
                  {Array.from({ length: 11 }).map((__, cell) => <td key={cell} className={mdTd}><span className={mdSkeleton} /></td>)}
                </tr>
              ))
            )}
            {!loading && visible.map((row) => (
              <tr key={row.id} className="hover:bg-[#fafcfd]">
                <td className={cn(mdTd, 'md-link font-semibold text-blue', stickyFirstCol)} dir="ltr">{row.id}</td>
                <td className={mdTd} dir="ltr">{row.period}</td>
                <td className={mdTd}>{formatAmount(row.transfersCount)}</td>
                <td className={mdTd} dir="ltr">{formatAmount(row.collected)}</td>
                <td className={mdTd} dir="ltr">{formatAmount(row.commissions)}</td>
                <td className={mdTd} dir="ltr">{formatUsd(row.netDue)}</td>
                <td className={mdTd} dir="ltr">{row.exchangeRate.toFixed(1)}</td>
                <td className={mdTd} dir="ltr">{formatUsd(row.transferredUsd)}</td>
                <td className={mdTd}>
                  <span className={cn('md-diff-pill inline-flex rounded-full px-[7px] py-[3px] text-[9px] font-semibold', row.differenceLocal < 0 ? 'is-neg bg-[#fdebec] text-danger' : row.differenceLocal > 0 ? 'is-pos bg-[#eaf6e8] text-[#3f9a37]' : 'is-zero bg-[#f3f5f6] text-text-muted')} dir="ltr">
                    {formatAmount(Math.abs(row.differenceLocal))} {row.currency}
                  </span>
                </td>
                <td className={mdTd} title={row.by}>{row.by}</td>
                <td className={mdTd}><span className={mdSettleDone}>{row.status}</span></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td className="md-empty !h-[110px] !text-center !text-text-muted" colSpan={11}>لا توجد تسويات مسجلة</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={merchantMobileCards} aria-label="سجل التسويات">
        {loading && <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">جاري التحميل...</strong></div>}
        {!loading && visible.map((row) => (
          <article key={row.id} className={merchantCard}>
            <div className={merchantCardHead}>
              <strong className="md-link min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-blue" dir="ltr" title={row.id}>{row.id}</strong>
              <span className={mdSettleDone}>{row.status}</span>
            </div>
            <div className={merchantCardGrid}>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">الفترة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.period}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">التحويلات</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{formatAmount(row.transfersCount)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">المحصل</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.collected)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">العمولات</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.commissions)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">الصافي</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatUsd(row.netDue)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">سعر الصرف</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.exchangeRate.toFixed(1)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">المحوّل</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatUsd(row.transferredUsd)}</b></div>
              <div className={merchantCardField}>
                <span className="text-[9px] text-text-muted">الفرق</span>
                <b>
                  <span className={cn('md-diff-pill inline-flex rounded-full px-[7px] py-[3px] text-[9px] font-semibold', row.differenceLocal < 0 ? 'is-neg bg-[#fdebec] text-danger' : row.differenceLocal > 0 ? 'is-pos bg-[#eaf6e8] text-[#3f9a37]' : 'is-zero bg-[#f3f5f6] text-text-muted')} dir="ltr">
                    {formatAmount(Math.abs(row.differenceLocal))} {row.currency}
                  </span>
                </b>
              </div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">بواسطة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" title={row.by}>{row.by}</b></div>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">لا توجد تسويات مسجلة</strong></div>
        )}
      </div>

      <div className={mdTableFooter}>
        <span>عرض {rows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, rows.length)} من {rows.length} تسويات</span>
        <div className="md-pagination merchant-pagination flex flex-wrap items-center justify-center gap-1.5 min-[640px]:justify-start min-[640px]:gap-[3px]">
          <button type="button" aria-label="السابق" className={mdPaginationBtn} onClick={() => onPageChange(Math.max(1, currentPage - 1))}><ChevronRight size={12} /></button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button type="button" key={index + 1} className={cn('page-num hidden min-[640px]:grid', mdPaginationBtn, currentPage === index + 1 ? 'is-current border-green bg-green text-white' : '')} onClick={() => onPageChange(index + 1)}>{index + 1}</button>
          ))}
          <span className="merchant-pagination-mobile inline-flex items-center gap-1.5 text-[11px] text-[#68727a] min-[640px]:hidden">{currentPage} / {pageCount}</span>
          <button type="button" aria-label="التالي" className={mdPaginationBtn} onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}><ChevronLeft size={12} /></button>
        </div>
      </div>
    </section>
  )
}

export default SettlementsTable
