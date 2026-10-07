import { Check } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import './MerchantAddSuccessModal.css'

type MerchantAddSuccessModalProps = {
  open: boolean
  merchantName: string
  onViewMerchant: () => void
  onAddAnother: () => void
  onClose?: () => void
}

function MerchantAddSuccessModal({
  open,
  merchantName,
  onViewMerchant,
  onAddAnother,
  onClose,
}: MerchantAddSuccessModalProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    dialogRef.current?.querySelector<HTMLButtonElement>('.mas-primary')?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="mas-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        ref={dialogRef}
        className="mas-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <div className="mas-icon" aria-hidden="true">
          <Check size={34} strokeWidth={3} />
        </div>
        <h2 id={titleId}>تمت الإضافة بنجاح</h2>
        <p>
          تمت إضافة التاجر «{merchantName}» إلى النظام بنجاح، ويمكنك الآن استخدامه.
        </p>
        <div className="mas-actions">
          <button type="button" className="mas-primary" onClick={onViewMerchant}>
            عرض التاجر
          </button>
          <button type="button" className="mas-secondary" onClick={onAddAnother}>
            إضافة تاجر آخر
          </button>
        </div>
      </section>
    </div>
  )
}

export default MerchantAddSuccessModal
