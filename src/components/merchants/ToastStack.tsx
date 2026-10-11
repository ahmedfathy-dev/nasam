import { useEffect } from 'react'
import { cn } from '@/lib/cn'
import type { ToastItem } from '../../types/toast'
import { merchantToastError, merchantToastStack, merchantToastSuccess } from './merchantTw'

export type { ToastItem }

type ToastStackProps = {
  items: ToastItem[]
  onDismiss: (id: number) => void
}

function ToastStack({ items, onDismiss }: ToastStackProps) {
  return (
    <div className={merchantToastStack} aria-live="polite">
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
    <div
      className={cn(item.tone === 'success' ? merchantToastSuccess : merchantToastError)}
      role="status"
    >
      {item.message}
    </div>
  )
}

export default ToastStack
