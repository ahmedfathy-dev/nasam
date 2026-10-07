export type SettleFormValues = {
  methodFilter: string
  exchangeRate: string
  transferredUsd: string
  reference: string
  settlementDateIso: string
  notes: string
}

export type SettleFormErrors = Partial<Record<keyof SettleFormValues, string>>

export function isoToDisplayDate(iso: string) {
  if (!iso) return ''
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function todayIso() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function validateSettleForm(values: SettleFormValues): SettleFormErrors {
  const errors: SettleFormErrors = {}
  const rate = Number(values.exchangeRate)
  const amount = Number(values.transferredUsd)

  if (!values.exchangeRate.trim() || Number.isNaN(rate) || rate <= 0) {
    errors.exchangeRate = 'سعر الصرف مطلوب ويجب أن يكون أكبر من صفر'
  }
  if (!values.transferredUsd.trim() || Number.isNaN(amount) || amount <= 0) {
    errors.transferredUsd = 'المبلغ المحوّل مطلوب ويجب أن يكون أكبر من صفر'
  }
  if (!values.reference.trim()) {
    errors.reference = 'الرقم المرجعي مطلوب'
  }
  if (!values.settlementDateIso) {
    errors.settlementDateIso = 'تاريخ التسوية مطلوب'
  }
  return errors
}
