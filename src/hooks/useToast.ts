import { useCallback, useState } from 'react'
import type { ToastItem, ToastTone } from '../types/toast'

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const pushToast = useCallback((message: string, tone: ToastTone) => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), message, tone }])
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const clearToasts = useCallback(() => setToasts([]), [])

  return { toasts, pushToast, dismissToast, clearToasts }
}
