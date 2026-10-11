import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../../ui/FormSelect'
import { formatAmount, formatUsd, type MerchantPaymentMethod, type MerchantTransferRow } from '../../../data/merchantDetailsData'
import {
  mdBtnNeutral,
  mdPanel,
  mdPaginationBtn,
  mdSettleDone,
  mdSettleOpen,
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

type TransfersTableProps = {
  rows: MerchantTransferRow[]
  selectedMethod: MerchantPaymentMethod | null
  cycleFilter: string
  statusFilter: string
  page: number
  loading: boolean
  onCycleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClearMethod: () => void
  onPageChange: (page: number) => void
  onExport: () => void
}

const PAGE_SIZE = 7

function TransfersTable({ table }: { table: TransfersTableProps }) {
  const {
    rows: sourceRows, selectedMethod, cycleFilter, statusFilter, page, loading,
    onCycleChange, onStatusChange, onClearMethod, onPageChange, onExport,
  } = table
  const rows = sourceRows ?? []
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className={mdPanel}>
      <div className="md-table-filters mb-2.5 flex w-full flex-col items-stretch gap-2 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-center min-[640px]:justify-between">
        <div className="md-filter-start grid w-full min-w-0 grid-cols-2 gap-[7px] min-[640px]:flex min-[640px]:flex-wrap min-[640px]:items-center">
          {selectedMethod && (
            <button type="button" className="md-method-chip col-span-full inline-flex max-w-full min-h-10 items-center gap-1.5 overflow-hidden rounded-full border border-green-border bg-[#f3faf1] px-2 text-[9px] text-green min-[640px]:min-h-[30px]" onClick={onClearMethod}>
              <span className="overflow-hidden text-ellipsis whitespace-nowrap" dir="ltr">{selectedMethod.name} · {selectedMethod.account}</span>
              <X size={11} />
            </button>
          )}
          <FormSelect
            field={{
              className: 'h-10 min-w-0 flex-[1_1_calc(50%-4px)] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] min-[640px]:h-[30px] min-[640px]:w-[140px] min-[640px]:flex-none [&_.form-select-trigger]:!text-[9px] max-[639px]:[&_.form-select-trigger]:!text-[16px]',
              ariaLabel: 'الدورة',
              value: cycleFilter,
              onChange: onCycleChange,
              options: [
                { label: 'الدورة الحالية', value: 'current' },
                { label: 'كل الدورات', value: 'all' },
              ],
            }}
          />
          <FormSelect
            field={{
              className: 'h-10 min-w-0 flex-[1_1_calc(50%-4px)] rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] min-[640px]:h-[30px] min-[640px]:w-[140px] min-[640px]:flex-none [&_.form-select-trigger]:!text-[9px] max-[639px]:[&_.form-select-trigger]:!text-[16px]',
              ariaLabel: 'حالة التسوية',
              value: statusFilter,
              onChange: onStatusChange,
              options: [
                { label: 'كل الحالات', value: 'all' },
                { label: 'مسوّاة', value: 'settled' },
                { label: 'غير مسوّاة', value: 'open' },
              ],
            }}
          />
        </div>
        <button type="button" className={cn(mdBtnNeutral, 'md-export-btn w-full min-[640px]:w-auto')} onClick={onExport}>
          <Download size={12} /><span className="md-export-label">تصدير</span>
        </button>
      </div>

      <div className={mdTableScroll}>
        <table className={mdTable}>
          <thead className="bg-[#fafbfc]">
            <tr>
              <th className={cn(mdTh, stickyFirstColHead)}>التحويل</th>
              <th className={mdTh}>التاريخ</th>
              <th className={mdTh}>اسم المحول</th>
              <th className={mdTh}>الوسيلة</th>
              <th className={mdTh}>رقم الاستقبال</th>
              <th className={mdTh}>القيمة (محلي)</th>
              <th className={mdTh}>العمولة</th>
              <th className={mdTh}>الصافي</th>
              <th className={mdTh}>المبلغ (دولار USD)</th>
              <th className={mdTh}>التسوية</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`sk-${index}`} className="md-skeleton-row">
                  {Array.from({ length: 10 }).map((__, cell) => <td key={cell} className={mdTd}><span className={mdSkeleton} /></td>)}
                </tr>
              ))
            )}
            {!loading && visible.map((row) => (
              <tr key={row.id} className={cn(row.settled && 'is-settled bg-[#f7f8f9]', 'hover:bg-[#fafcfd]')}>
                <td className={cn(mdTd, 'md-link font-semibold text-blue', stickyFirstCol)} dir="ltr">{row.id}</td>
                <td className={mdTd} dir="ltr">{row.date}</td>
                <td className={mdTd} title={row.sender}>{row.sender}</td>
                <td className={mdTd} dir="ltr">{row.method}</td>
                <td className={mdTd} dir="ltr">{row.receiveNumber}</td>
                <td className={mdTd} dir="ltr">{formatAmount(row.localAmount)} {row.currency}</td>
                <td className={mdTd} dir="ltr">{formatAmount(row.commission)}</td>
                <td className={mdTd} dir="ltr">{formatAmount(row.net)}</td>
                <td className={mdTd} dir="ltr">{formatUsd(row.usd)}</td>
                <td className={mdTd}>
                  <span className={row.settled ? mdSettleDone : mdSettleOpen}>
                    {row.settled ? 'مسوّاة' : 'غير مسوّاة'}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td className="md-empty !h-[110px] !text-center !text-text-muted" colSpan={10}>لا توجد تحويلات مطابقة للفلاتر الحالية</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={merchantMobileCards} aria-label="سجل التحويلات">
        {loading && <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">جاري التحميل...</strong></div>}
        {!loading && visible.map((row) => (
          <article key={row.id} className={cn(merchantCard, row.settled && 'is-settled bg-[#f7f8f9]')}>
            <div className={merchantCardHead}>
              <strong className="md-link min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-blue" dir="ltr" title={row.id}>{row.id}</strong>
              <span className={row.settled ? mdSettleDone : mdSettleOpen}>
                {row.settled ? 'مسوّاة' : 'غير مسوّاة'}
              </span>
            </div>
            <div className={merchantCardGrid}>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">التاريخ</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.date}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">المحول</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" title={row.sender}>{row.sender}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">الوسيلة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.method}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">الاستقبال</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{row.receiveNumber}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">القيمة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.localAmount)} {row.currency}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">العمولة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.commission)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">الصافي</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatAmount(row.net)}</b></div>
              <div className={merchantCardField}><span className="text-[9px] text-text-muted">USD</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr">{formatUsd(row.usd)}</b></div>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">لا توجد تحويلات مطابقة للفلاتر الحالية</strong></div>
        )}
      </div>

      <p className="md-table-note mt-2 text-[9px] text-text-muted">التحويلات المسوّاة تظل محفوظة في السجل ولكن يُعرض سعر الصرف المحلي وقت التسوية</p>

      <div className={mdTableFooter}>
        <span>عرض {rows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, rows.length)} من {rows.length}</span>
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

export default TransfersTable
