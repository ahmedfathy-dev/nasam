import { useMemo } from 'react'
import { LoaderCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import Modal from '../../components/ui/Modal'
import { formatAmount, formatDateTimeStamp, formatReceiptDate } from '../../utils/format'
import TransferReceiptRow from './TransferReceiptRow'
import {
  transferCancelButtonClass,
  transferConfirmButtonClass,
  transferModalBackdropClass,
  transferModalPanelClass,
} from './transferFieldClasses'
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

function TransferReviewModal({ review }: { review: TransferReviewModalProps }) {
  const {
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
  } = review
  if (!form) return null
  const stampedAt = useMemo(() => formatDateTimeStamp(), [])

  const brandBg =
    brandClass.includes('vodafone') ? 'bg-[#e60000]'
      : brandClass.includes('instapay') ? 'bg-blue'
        : brandClass.includes('bank') ? 'bg-[#3f4850]'
          : 'bg-[#9aa3aa]'

  return (
    <Modal
      shell={{
        backdropClassName: transferModalBackdropClass,
        panelClassName: cn(transferModalPanelClass, 'w-[min(920px,100%)]'),
        labelledBy: 'review-modal-title',
        closeOnBackdrop: !saving,
        onClose,
      }}
    >
      <div dir="rtl">
        <div className="flex min-h-[72px] items-start justify-between gap-3 border-b border-[#edf0f2] px-[18px] pb-3.5 pt-4">
          <div>
            <h2 id="review-modal-title" className="text-[18px] font-bold text-[#243039]">مراجعة التحويل قبل الحفظ</h2>
            <p className="mt-1 text-[12px] leading-[1.5] text-text-muted">تأكد من البيانات المستخرجة تلقائيًا – يمكنك الرجوع وتعديل أي حقل</p>
          </div>
          <button
            type="button"
            className="grid size-8 flex-none place-items-center border border-[#e7eaec] bg-[#f8f9fa] text-[#788188] rounded-sm disabled:cursor-not-allowed disabled:opacity-55"
            aria-label="إغلاق"
            disabled={saving}
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <div
          className={cn(
            'grid grid-cols-1 gap-[18px] px-[18px] pb-2 pt-4',
            'min-[701px]:grid-cols-[minmax(0,1.55fr)_220px]',
          )}
        >
          <div className="grid grid-cols-2 gap-2.5">
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

          <aside
            className={cn(
              'grid content-start justify-items-center gap-2',
              'max-[700px]:order-[-1] max-[700px]:mx-auto max-[700px]:max-w-[240px]',
            )}
          >
            {receiptUrl && receiptIsImage ? (
              <a className="w-full overflow-hidden border border-[#e8eaeb] bg-[#f7f8f9] no-underline rounded-md" href={receiptUrl} target="_blank" rel="noreferrer">
                <img className="block h-auto w-full" src={receiptUrl} alt="صورة الإيصال" />
              </a>
            ) : (
              <div className="m-0 w-full overflow-hidden border border-[#e8eaeb] bg-[#f7f8f9] pb-3 text-center rounded-md">
                <div className={cn('grid min-h-10 place-items-center text-[13px] font-bold text-white', brandBg)} dir="ltr">
                  {brandLabel === '—' ? 'Receipt' : brandLabel}
                </div>
                <strong className="block px-2 pb-2 pt-3 text-[13px] font-bold text-[#303b46]">تمت العملية بنجاح</strong>
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
                <small className="mt-2 block text-[10px] text-[#a1a7ab]">شكرًا لاستخدامك فودافون كاش</small>
              </div>
            )}
            <span className="text-[11px] text-text-muted">صورة الإيصال</span>
          </aside>
        </div>

        <div
          className={cn(
            'mx-[18px] mt-2 grid grid-cols-2 gap-y-2.5 border border-green-border bg-[#f3faf1] px-2 py-3.5 rounded-md',
            'min-[701px]:grid-cols-4 min-[701px]:gap-y-0',
          )}
        >
          <ReviewTotal total={{ label: 'قيمة التحويل', value: `${formatAmount(amount)} ${currency}` }} />
          <ReviewTotal total={{ label: 'العمولة', value: `${formatAmount(commission)} ${currency}`, negative: true, clearBorderOnMobile: true }} />
          <ReviewTotal total={{ label: 'صافي المبلغ', value: `${formatAmount(netAmount)} ${currency}` }} />
          <ReviewTotal total={{ label: 'القيمة بالدولار', value: `≈ $ ${usdAmount}`, positive: true }} />
        </div>

        <p className="mx-[18px] mt-2.5 text-[12px] leading-[1.6] text-text-muted">
          عند الحفظ سيتم إنشاء رقم تحويل فريد وإضافة {formatAmount(netAmount)} {currency} إلى رصيد التاجر المستحق.
        </p>

        <div
          className={cn(
            'mt-2 flex flex-col items-stretch justify-between gap-3 border-t border-[#edf0f2] px-[18px] pb-4 pt-3.5',
            'min-[701px]:flex-row min-[701px]:items-center',
            'max-[480px]:flex-wrap',
          )}
        >
          <div className={cn('flex w-full flex-col items-stretch gap-2', 'min-[701px]:w-auto min-[701px]:flex-none min-[701px]:flex-row min-[701px]:items-center')}>
            <button
              type="button"
              className={cn(transferConfirmButtonClass, 'min-h-10 justify-center rounded-sm text-[13px] max-[700px]:w-full')}
              disabled={saving}
              onClick={onConfirm}
            >
              {saving ? <LoaderCircle size={14} className="am-spinner animate-[am-spin_1s_linear_infinite]" /> : null}
              تأكيد وحفظ التحويل
            </button>
            <button
              type="button"
              className={cn(transferCancelButtonClass, 'min-h-10 justify-center rounded-sm text-[13px] max-[700px]:w-full')}
              disabled={saving}
              onClick={onClose}
            >
              رجوع للتعديل
            </button>
          </div>
          <span className="text-[12px] text-text-muted">أضيف بواسطة: أحمد علي · {stampedAt}</span>
        </div>
      </div>
    </Modal>
  )
}

function ReviewValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid min-w-0 gap-[5px]">
      <span className="text-[11px] text-[#8b949b]">{label}</span>
      <strong className="block min-h-10 overflow-hidden text-ellipsis whitespace-nowrap border border-[#e7eaec] bg-[#f7f8f9] px-3 py-2.5 text-[13px] font-semibold text-[#343d44] rounded-sm" dir="auto">
        {value || '—'}
      </strong>
    </div>
  )
}

function ReviewTotal({ total }: {
  total: {
    label: string
    value: string
    negative?: boolean
    positive?: boolean
    clearBorderOnMobile?: boolean
  }
}) {
  const {
    label,
    value,
    negative = false,
    positive = false,
    clearBorderOnMobile = false,
  } = total

  return (
    <div
      className={cn(
        'grid justify-items-center gap-1.5 border-s border-[#dcebda] px-2.5 text-center',
        'last:border-s-0',
        clearBorderOnMobile && 'max-[700px]:border-s-0',
      )}
    >
      <span className="text-[11px] text-[#6f7a72]">{label}</span>
      <strong
        className={cn(
          'text-[15px] font-bold text-[#2f3834]',
          negative && 'text-danger',
          positive && 'text-[18px] font-bold text-green',
        )}
        dir="ltr"
      >
        {value}
      </strong>
    </div>
  )
}

export default TransferReviewModal
