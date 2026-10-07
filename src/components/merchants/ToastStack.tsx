import { useEffect } from 'react'
import type { ToastItem } from '../../types/toast'
import './MerchantUi.css'

export type { ToastItem }

type ToastStackProps = {
  items: ToastItem[]
  onDismiss: (id: number) => void
}

function ToastStack({ items, onDismiss }: ToastStackProps) {
  return (
    <div className="merchant-toast-stack" aria-live="polite">
      {items.map((item) => (
        <Toast key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), 3200)
    return () => window.clearTimeout(timer)
  }, [item.id, onDismiss])

  return (
    <div className={`merchant-toast merchant-toast-${item.tone}`} role="status">
      {item.message}
    </div>
  )
}

export default ToastStack
