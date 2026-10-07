import type { MerchantFormValues } from '../../data/merchantsData'

export type MerchantFormErrors = Partial<Record<keyof MerchantFormValues, string>>

const phonePattern = /^\+?[0-9][0-9\s\-()]{7,18}$/

export function validateMerchantForm(values: MerchantFormValues): MerchantFormErrors {
  const errors: MerchantFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'اسم التاجر مطلوب'
  }

  if (!values.country) {
    errors.country = 'الدولة مطلوبة'
  }

  if (!values.phone.trim()) {
    errors.phone = 'رقم الهاتف مطلوب'
  } else if (!phonePattern.test(values.phone.trim())) {
    errors.phone = 'صيغة رقم الهاتف غير صحيحة'
  }

  if (!values.currency) {
    errors.currency = 'العملة مطلوبة'
  }

  if (!values.commissionValue.trim()) {
    errors.commissionValue = 'العمولة مطلوبة'
  } else {
    const amount = Number(values.commissionValue)
    if (Number.isNaN(amount) || amount <= 0) {
      errors.commissionValue = 'أدخل قيمة عمولة صحيحة'
    } else if (values.commissionType === 'percent' && amount > 100) {
      errors.commissionValue = 'نسبة العمولة لا يمكن أن تتجاوز 100%'
    }
  }

  if (!values.status) {
    errors.status = 'حالة التاجر مطلوبة'
  }

  return errors
}
