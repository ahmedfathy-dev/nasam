import type { ReactNode } from 'react'

type ModalProps = {
  children: ReactNode
  onClose?: () => void
  /** Backdrop class — keep feature-specific classes for identical visuals */
  backdropClassName?: string
  /** Dialog panel class */
  panelClassName?: string
  labelledBy?: string
  closeOnBackdrop?: boolean
}

/**
 * Shared modal shell. Pass existing CSS class names so appearance stays unchanged.
 * Example: backdropClassName="transfer-modal-backdrop" panelClassName="transfer-modal review-modal"
 */
function Modal({
  children,
  onClose,
  backdropClassName = 'transfer-modal-backdrop',
  panelClassName = 'transfer-modal',
  labelledBy,
  closeOnBackdrop = true,
}: ModalProps) {
  return (
    <div
      className={backdropClassName}
      onMouseDown={(event) => {
        if (!closeOnBackdrop || !onClose) return
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={panelClassName}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
      >
        {children}
      </section>
    </div>
  )
}

export default Modal
