import { getMethodById } from '../../../data/merchantCatalog'
import type { AddMerchantFieldErrors, AddMerchantFormValues } from './addMerchantTypes'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneLocalPattern = /^[0-9][0-9\s]{6,14}$/
const walletPattern = /^0?[0-9]{9,12}$/
const instapayPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+$/
const ibanPattern = /^[A-Z]{2}[0-9A-Z]{13,32}$/i

export function validateAddMerchantForm(values: AddMerchantFormValues): AddMerchantFieldErrors {
  const errors: AddMerchantFieldErrors = {}

  if (!values.name.trim()) errors.name = 'هذا الحقل مطلوب'
  if (!values.email.trim()) errors.email = 'هذا الحقل مطلوب'
  else if (!emailPattern.test(values.email.trim())) errors.email = 'بريد إلكتروني غير صالح'

  if (!values.phoneLocal.trim()) errors.phoneLocal = 'هذا الحقل مطلوب'
  else if (!phoneLocalPattern.test(values.phoneLocal.trim())) errors.phoneLocal = 'رقم هاتف غير صالح'

  if (!values.countryId) errors.countryId = 'هذا الحقل مطلوب'

  if (!values.commissionValue.trim()) {
    errors.commissionValue = 'هذا الحقل مطلوب'
  } else {
    const amount = Number(values.commissionValue)
    if (Number.isNaN(amount) || amount < 0) errors.commissionValue = 'أدخل قيمة عمولة صحيحة'
    else if (values.commissionType === 'percent' && (amount <= 0 || amount > 100)) {
      errors.commissionValue = 'نسبة العمولة يجب أن تكون بين 0 و 100'
    } else if (values.commissionType === 'fixed' && amount <= 0) {
      errors.commissionValue = 'قيمة العمولة يجب أن تكون أكبر من صفر'
    }
  }

  if (!values.methods.length) {
    errors.methods = 'أضف وسيلة استقبال واحدة على الأقل'
  }

  const accounts: Record<string, Record<number, string>> = {}
  const seen = new Set<string>()
  let hasValidAccount = false

  values.methods.forEach((block) => {
    const method = getMethodById(block.methodId)
    if (!method) {
      accounts[block.key] = { 0: 'اختر وسيلة صحيحة' }
      return
    }
    if (!block.accounts.length) {
      accounts[block.key] = { 0: 'أضف رقمًا أو حسابًا واحدًا على الأقل' }
      return
    }
    block.accounts.forEach((account, index) => {
      const value = account.trim()
      if (!value) {
        accounts[block.key] = { ...accounts[block.key], [index]: 'هذا الحقل مطلوب' }
        return
      }
      const key = `${block.methodId}:${value.toLowerCase()}`
      if (seen.has(key)) {
        accounts[block.key] = { ...accounts[block.key], [index]: 'هذا الرقم مضاف مسبقًا' }
        return
      }
      seen.add(key)

      let invalid = false
      if (method.kind === 'wallet') invalid = !walletPattern.test(value.replace(/\s/g, ''))
      if (method.kind === 'instapay') invalid = !instapayPattern.test(value)
      if (method.kind === 'bank') {
        const compact = value.replace(/\s/g, '')
        invalid = compact.length < 8 || (compact.length >= 15 && !ibanPattern.test(compact))
      }

      if (invalid) {
        const message = method.kind === 'instapay'
          ? 'عنوان InstaPay غير صالح'
          : method.kind === 'bank'
            ? 'رقم الحساب / IBAN غير صالح'
            : 'رقم هاتف غير صالح'
        accounts[block.key] = { ...accounts[block.key], [index]: message }
        return
      }
      hasValidAccount = true
    })
  })

  if (Object.keys(accounts).length) errors.accounts = accounts
  if (!hasValidAccount && !errors.methods) errors.methods = 'أضف وسيلة استقبال واحدة برقم أو حساب صالح على الأقل'

  return errors
}
