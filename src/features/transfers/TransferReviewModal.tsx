import { useMemo } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { formatAmount, formatDateTimeStamp, formatReceiptDate } from '../../utils/format'
import TransferReceiptRow from './TransferReceiptRow'
import type { TransferFormValues } from './types'

type TransferReviewModalProps = {
  form: TransferFormValues
  currency: string
  amount: number
  commission: number
  netAmount: number
  usdAmount: string
  receiptUrl: string | null
  receiptIsImage: boolean
  brandClass: string
  brandLabel: string
  saving: boolean
  onClose: () => void
  onConfirm: () => void
}

function TransferReviewModal({
  form,
  currency,
  amount,
  commission,
  netAmount,
  usdAmount,
  receiptUrl,
  receiptIsImage,
  brandClass,
  brandLabel,
  saving,
  onClose,
  onConfirm,
}: TransferReviewModalProps) {
  const stampedAt = useMemo(() => formatDateTimeStamp(), [])

  return (
    <Modal
      backdropClassName="transfer-modal-backdrop"
      panelClassName="transfer-modal review-modal"
      labelledBy="review-modal-title"
      closeOnBackdrop={!saving}
      onClose={onClose}
    >
      <div className="transfer-modal-heading">
        <div>
          <h2 id="review-modal-title">مراجعة التحويل قبل الحفظ</h2>
          <p>تأكد من البيانات المستخرجة تلقائيًا – يمكنك الرجوع وتعديل أي حقل</p>
        </div>
        <button type="button" className="modal-close" aria-label="إغلاق" disabled={saving} onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="review-modal-content">
        <div className="review-fields">
          <ReviewValue label="الدولة" value={form.country} />
          <ReviewValue label="العملة" value={currency} />
          <ReviewValue label="التاجر" value={form.merchant} />
          <ReviewValue label="وسيلة التحويل" value={form.method} />
          <ReviewValue label="رقم / حساب الاستقبال" value={form.account} />
          <ReviewValue label="رقم التحويل" value={form.number} />
          <ReviewValue label="رقم المرجع" value={form.reference} />
          <ReviewValue label="اسم المحول" value={form.sender} />
          <ReviewValue label="رقم هاتف المستلم" value={form.receiverPhone || form.account} />
          <ReviewValue label="تاريخ ووقت التحويل" value={form.date} />
        </div>

        <aside className="review-receipt-panel">
          {receiptUrl && receiptIsImage ? (
            <a className="review-receipt-frame" href={receiptUrl} target="_blank" rel="noreferrer">
              <img src={receiptUrl} alt="صورة الإيصال" />
            </a>
          ) : (
            <div className={`receipt-paper review-receipt-frame ${brandClass}`}>
              <div className="receipt-brand">{brandLabel === '—' ? 'Receipt' : brandLabel}</div>
              <strong className="receipt-success">تمت العملية بنجاح</strong>
              <TransferReceiptRow
                label="المبلغ"
                value={amount ? `${formatAmount(amount, 2)} جنيه` : '—'}
                highlight
              />
              <TransferReceiptRow label="إلى" value={form.receiverPhone || form.account || '—'} highlight />
              <TransferReceiptRow label="من" value={form.sender || '—'} highlight />
              <TransferReceiptRow label="رقم العملية" value={form.reference || '—'} highlight />
              <TransferReceiptRow label="التاريخ" value={formatReceiptDate(form.date)} highlight />
              <TransferReceiptRow label="الرصيد المتبقي" value="—" />
              <small>شكرًا لاستخدامك فودافون كاش</small>
            </div>
          )}
          <span className="review-receipt-caption">صورة الإيصال</span>
        </aside>
      </div>

      <div className="review-totals">
        <ReviewTotal label="قيمة التحويل" value={`${formatAmount(amount)} ${currency}`} />
        <ReviewTotal label="العمولة" value={`${formatAmount(commission)} ${currency}`} negative />
        <ReviewTotal label="صافي المبلغ" value={`${formatAmount(netAmount)} ${currency}`} />
        <ReviewTotal label="القيمة بالدولار" value={`≈ $ ${usdAmount}`} positive />
      </div>

      <p className="review-note">
        عند الحفظ سيتم إنشاء رقم تحويل فريد وإضافة {formatAmount(netAmount)} {currency} إلى رصيد التاجر المستحق.
      </p>

      <div className="transfer-modal-actions review-modal-actions">
        {/* RTL: first child = right side (primary actions, matching screenshot) */}
        <div className="transfer-form-actions-main">
          <button type="button" className="transfer-confirm-button" disabled={saving} onClick={onConfirm}>
            {saving ? <LoaderCircle size={14} className="am-spinner" /> : null}
            تأكيد وحفظ التحويل
          </button>
          <button type="button" className="transfer-cancel-button" disabled={saving} onClick={onClose}>
            رجوع للتعديل
          </button>
        </div>
        <span className="review-meta">أضيف بواسطة: أحمد علي · {stampedAt}</span>
      </div>
    </Modal>
  )
}

function ReviewValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="review-value">
      <span>{label}</span>
      <strong dir="auto">{value || '—'}</strong>
    </div>
  )
}

function ReviewTotal({
  label,
  value,
  negative = false,
  positive = false,
}: {
  label: string
  value: string
  negative?: boolean
  positive?: boolean
}) {
  return (
    <div className={`review-total ${negative ? 'review-negative' : ''} ${positive ? 'review-positive' : ''}`}>
      <span>{label}</span>
      <strong dir="ltr">{value}</strong>
    </div>
  )
}

export default TransferReviewModal
