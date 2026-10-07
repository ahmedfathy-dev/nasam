import { Download, ExternalLink, X } from 'lucide-react'
import {
  formatAmount,
  formatUsdFixed,
  settlementDiffAbs,
  settlementHasDiff,
  type MerchantSettlementRow,
} from '../../../data/merchantDetailsData'
import SettlementStatusBadge from './SettlementStatusBadge'

type SettlementDetailsDrawerProps = {
  open: boolean
  row: MerchantSettlementRow | null
  onClose: () => void
  onViewTransfers: (row: MerchantSettlementRow) => void
}

function SettlementDetailsDrawer({ open, row, onClose, onViewTransfers }: SettlementDetailsDrawerProps) {
  if (!open || !row) return null

  const differs = settlementHasDiff(row)

  return (
    <>
      <button type="button" className="merchant-drawer-scrim" aria-label="إغلاق" onClick={onClose} />
      <aside className="merchant-details-drawer sh-drawer" role="dialog" aria-modal="true" aria-labelledby="sh-drawer-title" dir="rtl">
        <header className="merchant-drawer-head">
          <div>
            <h2 id="sh-drawer-title">تفاصيل التسوية</h2>
            <p dir="ltr">{row.id}</p>
          </div>
          <button type="button" className="merchant-modal-close" aria-label="إغلاق" onClick={onClose}>
            <X size={14} />
          </button>
        </header>

        <div className="merchant-drawer-body">
          <div className="sh-drawer-status">
            <SettlementStatusBadge row={row} />
          </div>

          <dl className="merchant-details-list">
            <div className="merchant-detail-row"><dt>رقم التسوية</dt><dd dir="ltr">{row.id}</dd></div>
            <div className="merchant-detail-row"><dt>التاريخ</dt><dd dir="ltr">{row.date}</dd></div>
            <div className="merchant-detail-row"><dt>الفترة</dt><dd dir="ltr">{row.period}</dd></div>
            <div className="merchant-detail-row"><dt>عدد التحويلات</dt><dd>{formatAmount(row.transfersCount)}</dd></div>
            <div className="merchant-detail-row"><dt>المحصل</dt><dd dir="ltr">{formatAmount(row.collected)} {row.currency}</dd></div>
            <div className="merchant-detail-row"><dt>العمولات</dt><dd dir="ltr">{formatAmount(row.commissions)} {row.currency}</dd></div>
            <div className="merchant-detail-row"><dt>الصافي المستحق</dt><dd dir="ltr">{formatUsdFixed(row.netDue)}</dd></div>
            <div className="merchant-detail-row"><dt>سعر الصرف</dt><dd dir="ltr">@ {row.exchangeRate.toFixed(2)}</dd></div>
            <div className="merchant-detail-row">
              <dt>المحوّل فعليًا</dt>
              <dd className={differs ? 'sh-amount-red' : 'sh-amount-green'} dir="ltr">{formatUsdFixed(row.transferredUsd)}</dd>
            </div>
            <div className="merchant-detail-row">
              <dt>الفرق</dt>
              <dd dir="ltr">{differs ? formatUsdFixed(settlementDiffAbs(row)) : formatUsdFixed(0)}</dd>
            </div>
            <div className="merchant-detail-row"><dt>المرجع</dt><dd dir="ltr">{row.reference}</dd></div>
            <div className="merchant-detail-row"><dt>بواسطة</dt><dd>{row.by}</dd></div>
            <div className="merchant-detail-row"><dt>ملاحظات</dt><dd>{row.notes?.trim() || '—'}</dd></div>
          </dl>

          <div className="sh-receipt">
            <div className="sh-receipt-head">
              <h3>صورة الإيصال</h3>
              {row.receiptUrl && (
                <a className="sh-receipt-link" href={row.receiptUrl} download={`receipt-${row.id}.svg`}>
                  <Download size={13} />تحميل
                </a>
              )}
            </div>
            {row.receiptUrl ? (
              <a href={row.receiptUrl} target="_blank" rel="noreferrer" className="sh-receipt-preview">
                <img src={row.receiptUrl} alt={`إيصال ${row.id}`} />
              </a>
            ) : (
              <div className="sh-receipt-empty">لا توجد صورة إيصال</div>
            )}
          </div>

          <button type="button" className="sh-transfers-link" onClick={() => onViewTransfers(row)}>
            <ExternalLink size={14} />عرض التحويلات المشمولة
          </button>
        </div>
      </aside>
    </>
  )
}

export default SettlementDetailsDrawer
