import { X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  merchantConfirmActions,
  merchantConfirmDialog,
  merchantDeleteButton,
  merchantModalBackdrop,
  merchantModalClose,
  tradersPrimaryButton,
  tradersToolButton,
} from '../merchantTw'

type SuspendConfirmDialogProps = {
  open: boolean
  merchantName: string
  isActive: boolean
  loading: boolean
  onCancel: () => void
  onConfirm: () => void
}

function SuspendConfirmDialog({ dialog }: { dialog: SuspendConfirmDialogProps }) {
  const { open, merchantName, isActive, loading, onCancel, onConfirm } = dialog
  if (!open) return null

  return (
    <div className={merchantModalBackdrop} onMouseDown={(event) => { if (event.target === event.currentTarget && !loading) onCancel() }}>
      <section className={merchantConfirmDialog} role="dialog" aria-modal="true" aria-labelledby="merchant-suspend-title">
        <button type="button" className={cn(merchantModalClose, 'absolute start-2 top-2 min-[640px]:start-auto min-[640px]:end-2')} aria-label="إغلاق" disabled={loading} onClick={onCancel}><X size={14} /></button>
        <h2 id="merchant-suspend-title" className="pb-2 text-center text-[13px] font-semibold text-[#272f35]">{isActive ? 'إيقاف التاجر' : 'تفعيل التاجر'}</h2>
        <p className="my-2 flex-1 text-[9px] leading-[1.8] text-[#7e878e] [overflow-wrap:anywhere] [word-break:break-word] min-[640px]:mb-3.5">
          {isActive
            ? <>هل أنت متأكد من إيقاف التاجر <strong className="text-[#343d44]">{merchantName}</strong>؟ لن يتمكن من استقبال حوالات جديدة.</>
            : <>هل تريد إعادة تفعيل التاجر <strong className="text-[#343d44]">{merchantName}</strong>؟</>}
        </p>
        <div className={merchantConfirmActions}>
          <button type="button" className={cn(tradersToolButton, 'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]')} disabled={loading} onClick={onCancel}>إلغاء</button>
          <button
            type="button"
            className={cn(
              isActive ? merchantDeleteButton : tradersPrimaryButton,
              'w-full min-h-11 min-[640px]:w-auto min-[640px]:min-h-[31px]',
            )}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? 'جاري التنفيذ...' : isActive ? 'إيقاف' : 'تفعيل'}
          </button>
        </div>
      </section>
    </div>
  )
}

export default SuspendConfirmDialog
