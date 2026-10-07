export type ToastTone = 'success' | 'error'

export type ToastItem = {
  id: number
  message: string
  tone: ToastTone
}
