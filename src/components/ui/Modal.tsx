import type { ReactNode } from 'react'

export type ModalShell = {
  onClose?: () => void
  /** Backdrop class — keep feature-specific classes for identical visuals */
  backdropClassName?: string
  /** Dialog panel class */
  panelClassName?: string
  labelledBy?: string
  closeOnBackdrop?: boolean
}

type ModalProps = {
  shell?: ModalShell
  children: ReactNode
}

/**
 * Shared modal shell. Configuration travels as one object; children stay as content.
 */
function Modal({ shell, children }: ModalProps) {
  const onClose = shell?.onClose
  const backdropClassName = shell?.backdropClassName ?? 'transfer-modal-backdrop'
  const panelClassName = shell?.panelClassName ?? 'transfer-modal'
  const labelledBy = shell?.labelledBy
  const closeOnBackdrop = shell?.closeOnBackdrop ?? true
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
