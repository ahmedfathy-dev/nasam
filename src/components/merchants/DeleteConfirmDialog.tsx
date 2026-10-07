import { X } from 'lucide-react'
import './MerchantUi.css'

type DeleteConfirmDialogProps = {
  open: boolean
  merchantName: string
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
  title?: string
  entityLabel?: string
}

function DeleteConfirmDialog({
  open,
  merchantName,
  loading,
  onCancel,
  onConfirm,
  title = 'حذف التاجر',
  entityLabel = 'التاجر',
}: DeleteConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="merchant-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel() }}>
      <section className="merchant-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="merchant-delete-title">
        <button type="button" className="merchant-modal-close" aria-label="إغلاق" disabled={loading} onClick={onCancel}><X size={14} /></button>
        <h2 id="merchant-delete-title">{title}</h2>
        <p>هل أنت متأكد من حذف {entityLabel} <strong>{merchantName}</strong>؟ لا يمكن التراجع عن هذا الإجراء.</p>
        <div className="merchant-confirm-actions">
          <button type="button" className="traders-tool-button" disabled={loading} onClick={onCancel}>إلغاء</button>
          <button type="button" className="merchant-delete-button" disabled={loading} onClick={onConfirm}>
            {loading ? 'جاري الحذف...' : 'حذف'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DeleteConfirmDialog
