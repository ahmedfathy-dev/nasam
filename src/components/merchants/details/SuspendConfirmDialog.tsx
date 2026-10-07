import { X } from 'lucide-react'
import '../MerchantUi.css'

type SuspendConfirmDialogProps = {
  open: boolean
  merchantName: string
  isActive: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}

function SuspendConfirmDialog({ open, merchantName, isActive, loading, onCancel, onConfirm }: SuspendConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="merchant-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel() }}>
      <section className="merchant-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="merchant-suspend-title">
        <button type="button" className="merchant-modal-close" aria-label="إغلاق" disabled={loading} onClick={onCancel}><X size={14} /></button>
        <h2 id="merchant-suspend-title">{isActive ? 'إيقاف التاجر' : 'تفعيل التاجر'}</h2>
        <p>
          {isActive
            ? <>هل أنت متأكد من إيقاف التاجر <strong>{merchantName}</strong>؟ لن يتمكن من استقبال حوالات جديدة.</>
            : <>هل تريد إعادة تفعيل التاجر <strong>{merchantName}</strong>؟</>}
        </p>
        <div className="merchant-confirm-actions">
          <button type="button" className="traders-tool-button" disabled={loading} onClick={onCancel}>إلغاء</button>
          <button type="button" className={isActive ? 'merchant-delete-button' : 'traders-primary-button'} disabled={loading} onClick={onConfirm}>
            {loading ? 'جاري التنفيذ...' : isActive ? 'إيقاف' : 'تفعيل'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default SuspendConfirmDialog
