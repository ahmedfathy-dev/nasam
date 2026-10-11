import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  merchantConfirmActions,
  merchantConfirmDialog,
  merchantDeleteButton,
  merchantModalBackdrop,
  merchantModalClose,
  tradersToolButton,
} from './merchantTw'

type DeleteConfirmDialogProps = {
  open: boolean
  merchantName: string
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
  title?: string
  entityLabel?: string
}

function DeleteConfirmDialog({ dialog }: { dialog: DeleteConfirmDialogProps }) {
  const {
    open,
    merchantName,
    loading,
    onCancel,
    onConfirm,
    title = 'حذف التاجر',
    entityLabel = 'التاجر',
  } = dialog
  if (!open) return null

  return (
    <div className={merchantModalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel() }}>
      <section className={merchantConfirmDialog} role="dialog" aria-modal="true" aria-labelledby="merchant-delete-title">
        <button type="button" className={cn(merchantModalClose, 'absolute start-2 top-2 min-[640px]:start-auto min-[640px]:end-2')} aria-label="إغلاق" disabled={loading} onClick={onCancel}><X size={14} /></button>
        <h2 id="merchant-delete-title" className="pb-2 text-center text-[13px] font-semibold text-[#272f35] min-[640px]:pb-0">{title}</h2>
        <p className="my-2 flex-1 text-[9px] leading-[1.8] text-[#7e878e] [overflow-wrap:anywhere] [word-break:break-word] min-[640px]:my-2 min-[640px]:mb-3.5">
          هل أنت متأكد من حذف {entityLabel} <strong className="text-[#343d44]">{merchantName}</strong>؟ لا يمكن التراجع عن هذا الإجراء.
        </p>
        <div className={merchantConfirmActions}>
          <button type="button" className={cn(tradersToolButton, 'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]')} disabled={loading} onClick={onCancel}>إلغاء</button>
          <button type="button" className={cn(merchantDeleteButton, 'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]')} disabled={loading} onClick={onConfirm}>
            {loading ? 'جاري الحذف...' : 'حذف'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default DeleteConfirmDialog
