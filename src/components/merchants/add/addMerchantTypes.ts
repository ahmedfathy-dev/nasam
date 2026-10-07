import type { CommissionType, MerchantStatus } from '../../../data/merchantsData'
import { getCountryByName, type CreateMerchantPayload } from '../../../data/merchantCatalog'

export type { CreateMerchantPayload }

export type MethodBlock = {
  key: string
  methodId: string
  accounts: string[]
}

export type AddMerchantFormValues = {
  name: string
  email: string
  phoneLocal: string
  countryId: string
  status: MerchantStatus
  commissionType: CommissionType
  commissionValue: string
  methods: MethodBlock[]
  createAccount: boolean
}

export type AddMerchantFieldErrors = {
  name?: string
  email?: string
  phoneLocal?: string
  countryId?: string
  commissionValue?: string
  methods?: string
  accounts?: Record<string, Record<number, string>>
}

export function emptyAddMerchantForm(): AddMerchantFormValues {
  return {
    name: '',
    email: '',
    phoneLocal: '',
    countryId: 'eg',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: '2',
    methods: [
      { key: 'm1', methodId: 'vf-cash', accounts: [''] },
    ],
    createAccount: true,
  }
}

export function newMethodKey() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function phoneLocalFromFull(phone: string, prefix: string) {
  const normalized = phone.trim()
  if (normalized.startsWith(prefix)) {
    return normalized.slice(prefix.length).trim()
  }
  return normalized.replace(/^\+\d+\s*/, '').trim()
}

export function merchantToAddForm(merchant: {
  name: string
  phone: string
  country: string
  commission: string
  currency: string
  status: MerchantStatus
  email?: string
}): AddMerchantFormValues {
  const country = getCountryByName(merchant.country)
  const isPercent = merchant.commission.trim().endsWith('%')
  return {
    name: merchant.name,
    email: merchant.email ?? '',
    phoneLocal: phoneLocalFromFull(merchant.phone, country?.phonePrefix ?? ''),
    countryId: country?.id ?? 'eg',
    status: merchant.status,
    commissionType: isPercent ? 'percent' : 'fixed',
    commissionValue: isPercent
      ? merchant.commission.replace('%', '').trim()
      : merchant.commission.replace(merchant.currency, '').trim(),
    methods: [{ key: newMethodKey(), methodId: country?.id === 'eg' ? 'vf-cash' : 'bank-sa', accounts: [''] }],
    createAccount: Boolean(merchant.email),
  }
}
