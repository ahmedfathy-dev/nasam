import { Check } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { cn } from '@/lib/cn'

type MerchantAddSuccessModalProps = {
  open: boolean
  merchantName: string
  onViewMerchant: () => void
  onAddAnother: () => void
  onClose?: () => void
}

function MerchantAddSuccessModal({ dialog }: { dialog: MerchantAddSuccessModalProps }) {
  const {
    open,
    merchantName,
    onViewMerchant,
    onAddAnother,
    onClose,
  } = dialog
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
      className="mas-backdrop fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_38_48_/_42%)] p-4 min-[561px]:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        ref={dialogRef}
        className={cn(
          'mas-modal grid w-[min(420px,100%)] justify-items-center gap-3 rounded-2xl border border-[#e8ecef]',
          'bg-white px-[18px] pb-5 pt-7 text-center shadow-[0_22px_48px_rgb(20_32_42_/_18%)]',
          'animate-[mas-in_160ms_ease-out]',
          'min-[561px]:gap-3.5 min-[561px]:px-7 min-[561px]:pb-7 min-[561px]:pt-9',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir="rtl"
      >
        <div
          className={cn(
            'mas-icon grid size-16 place-items-center rounded-full bg-green text-white',
            'shadow-[0_10px_24px_rgb(57_174_57_/_28%)]',
            'min-[561px]:size-[72px]',
          )}
          aria-hidden="true"
        >
          <Check size={34} strokeWidth={3} />
        </div>
        <h2 id={titleId} className="mt-1 text-[19px] font-bold leading-[1.35] text-[#1f272e] min-[561px]:text-[22px]">
          تمت الإضافة بنجاح
        </h2>
        <p className="m-0 max-w-[34ch] text-[12px] leading-[1.75] text-[#7a848c] min-[561px]:text-[13px]">
          تمت إضافة التاجر «{merchantName}» إلى النظام بنجاح، ويمكنك الآن استخدامه.
        </p>
        <div className="mas-actions mt-2 flex w-full flex-col items-center justify-center gap-2.5 min-[561px]:flex-row">
          <button
            type="button"
            className={cn(
              'mas-primary inline-flex min-h-11 flex-1 items-center justify-center whitespace-nowrap rounded-[9px]',
              'border border-ink-soft bg-ink-soft px-3.5 text-[13px] font-semibold text-white',
              'hover:border-[#11171c] hover:bg-[#11171c]',
              'min-[561px]:min-h-[42px]',
            )}
            onClick={onViewMerchant}
          >
            عرض التاجر
          </button>
          <button
            type="button"
            className={cn(
              'mas-secondary inline-flex min-h-11 w-full flex-1 items-center justify-center whitespace-nowrap rounded-[9px]',
              'border border-[#e4e8eb] bg-[#f0f2f3] px-3.5 text-[13px] font-semibold text-[#4f5961]',
              'hover:border-[#d7dce0] hover:bg-[#e7eaec]',
              'min-[561px]:min-h-[42px]',
            )}
            onClick={onAddAnother}
          >
            إضافة تاجر آخر
          </button>
        </div>
      </section>
    </div>
  )
}

export default MerchantAddSuccessModal
