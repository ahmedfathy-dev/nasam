import { Download, ExternalLink, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  formatAmount,
  formatUsdFixed,
  settlementDiffAbs,
  settlementHasDiff,
  type MerchantSettlementRow,
} from '../../../data/merchantDetailsData'
import SettlementStatusBadge from './SettlementStatusBadge'
import { merchantModalClose } from '../merchantTw'

type SettlementDetailsDrawerProps = {
  open: boolean
  row: MerchantSettlementRow | null
  onClose: () => void
  onViewTransfers: (row: MerchantSettlementRow) => void
}

function SettlementDetailsDrawer({ drawer }: { drawer: SettlementDetailsDrawerProps }) {
  const { open, row, onClose, onViewTransfers } = drawer
  if (!open || !row) return null

  const differs = settlementHasDiff(row)

  return (
    <>
      <button type="button" className="merchant-drawer-scrim fixed inset-0 z-[55] cursor-pointer border-0 bg-[rgb(25_31_36_/_28%)]" aria-label="إغلاق" onClick={onClose} />
      <aside
        className={cn(
          'merchant-details-drawer sh-drawer fixed start-0 top-0 z-[56] flex h-[100dvh] w-screen flex-col',
          'border-e border-[#e7eaec] bg-white shadow-[-8px_0_28px_rgb(17_27_34_/_12%)]',
          'animate-[merchant-drawer-in_180ms_ease-out]',
          'min-[640px]:w-[min(400px,92vw)]',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sh-drawer-title"
        dir="rtl"
      >
        <header className="merchant-drawer-head flex items-start justify-between gap-2.5 border-b border-[#edf0f2] px-3.5 pb-2.5 pt-3.5">
          <div>
            <h2 id="sh-drawer-title" className="text-[13px] font-semibold text-[#272f35]">تفاصيل التسوية</h2>
            <p className="mt-0.5 text-[9px] text-[#7e878e]" dir="ltr">{row.id}</p>
          </div>
          <button type="button" className={merchantModalClose} aria-label="إغلاق" onClick={onClose}>
            <X size={14} />
          </button>
        </header>

        <div className="merchant-drawer-body flex-1 overflow-auto px-3.5 pb-4 pt-3">
          <div className="sh-drawer-status mb-3">
            <SettlementStatusBadge row={row} />
          </div>

          <dl className="merchant-details-list m-0 p-0">
            {[
              { dt: 'رقم التسوية', dd: row.id, ltr: true },
              { dt: 'التاريخ', dd: row.date, ltr: true },
              { dt: 'الفترة', dd: row.period, ltr: true },
              { dt: 'عدد التحويلات', dd: formatAmount(row.transfersCount) },
              { dt: 'المحصل', dd: `${formatAmount(row.collected)} ${row.currency}`, ltr: true },
              { dt: 'العمولات', dd: `${formatAmount(row.commissions)} ${row.currency}`, ltr: true },
              { dt: 'الصافي المستحق', dd: formatUsdFixed(row.netDue), ltr: true },
              { dt: 'سعر الصرف', dd: `@ ${row.exchangeRate.toFixed(2)}`, ltr: true },
            ].map((item) => (
              <div key={item.dt} className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
                <dt className="text-[#91999f]">{item.dt}</dt>
                <dd className="m-0 font-medium text-[#4c555b]" dir={item.ltr ? 'ltr' : undefined}>{item.dd}</dd>
              </div>
            ))}
            <div className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
              <dt className="text-[#91999f]">المحوّل فعليًا</dt>
              <dd className={cn('m-0 font-medium', differs ? 'sh-amount-red font-bold text-danger' : 'sh-amount-green font-bold text-green')} dir="ltr">{formatUsdFixed(row.transferredUsd)}</dd>
            </div>
            <div className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
              <dt className="text-[#91999f]">الفرق</dt>
              <dd className="m-0 font-medium text-[#4c555b]" dir="ltr">{differs ? formatUsdFixed(settlementDiffAbs(row)) : formatUsdFixed(0)}</dd>
            </div>
            <div className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
              <dt className="text-[#91999f]">المرجع</dt>
              <dd className="m-0 font-medium text-[#4c555b]" dir="ltr">{row.reference}</dd>
            </div>
            <div className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
              <dt className="text-[#91999f]">بواسطة</dt>
              <dd className="m-0 font-medium text-[#4c555b]">{row.by}</dd>
            </div>
            <div className="merchant-detail-row flex min-h-[34px] items-center justify-between gap-2.5 border-b border-[#f0f2f4] text-[9px]">
              <dt className="text-[#91999f]">ملاحظات</dt>
              <dd className="m-0 font-medium text-[#4c555b]">{row.notes?.trim() || '—'}</dd>
            </div>
          </dl>

          <div className="sh-receipt mt-4 grid gap-2">
            <div className="sh-receipt-head flex items-center justify-between gap-2">
              <h3 className="text-[11px] font-semibold text-[#343d44]">صورة الإيصال</h3>
              {row.receiptUrl && (
                <a className="sh-receipt-link inline-flex items-center gap-1 text-[10px] text-green no-underline" href={row.receiptUrl} download={`receipt-${row.id}.svg`}>
                  <Download size={13} />تحميل
                </a>
              )}
            </div>
            {row.receiptUrl ? (
              <a href={row.receiptUrl} target="_blank" rel="noreferrer" className="sh-receipt-preview block overflow-hidden rounded-sm border border-[#edf0f2] bg-[#f7f8f9]">
                <img className="block h-auto w-full" src={row.receiptUrl} alt={`إيصال ${row.id}`} />
              </a>
            ) : (
              <div className="sh-receipt-empty rounded-sm border border-dashed border-[#e7eaec] p-[18px] text-center text-[10px] text-[#929aa1]">لا توجد صورة إيصال</div>
            )}
          </div>

          <button type="button" className="sh-transfers-link mt-3.5 inline-flex min-h-10 w-full items-center justify-center gap-1.5 rounded-sm border border-green-border bg-[#f3faf1] text-[11px] font-semibold text-green" onClick={() => onViewTransfers(row)}>
            <ExternalLink size={14} />عرض التحويلات المشمولة
          </button>
        </div>
      </aside>
    </>
  )
}

export default SettlementDetailsDrawer
