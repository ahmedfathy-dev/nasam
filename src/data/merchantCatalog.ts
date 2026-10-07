import type { CommissionType, MerchantStatus } from './merchantsData'

export type PaymentMethodKind = 'wallet' | 'instapay' | 'bank'

export type CreateMerchantPayload = {
  name: string
  email: string
  phone: string
  countryId: string
  country: string
  currency: string
  status: MerchantStatus
  commission: { type: CommissionType; value: number }
  paymentMethods: Array<{ methodId: string; accounts: string[] }>
  createAccount: boolean
}

export type CatalogCountry = {
  id: string
  name: string
  currency: string
  phonePrefix: string
  flag: string
  active: boolean
}

export type CatalogPaymentMethod = {
  id: string
  name: string
  kind: PaymentMethodKind
  countryIds: string[]
  accountLabel: string
  accountPlaceholder: string
  active: boolean
}

export let catalogCountries: CatalogCountry[] = [
  { id: 'eg', name: 'مصر', currency: 'EGP', phonePrefix: '+20', flag: '🇪🇬', active: true },
  { id: 'sa', name: 'السعودية', currency: 'SAR', phonePrefix: '+966', flag: '🇸🇦', active: true },
  { id: 'ae', name: 'الإمارات', currency: 'AED', phonePrefix: '+971', flag: '🇦🇪', active: true },
  { id: 'tr', name: 'تركيا', currency: 'TRY', phonePrefix: '+90', flag: '🇹🇷', active: true },
  { id: 'jo', name: 'الأردن', currency: 'JOD', phonePrefix: '+962', flag: '🇯🇴', active: true },
  { id: 'om', name: 'عُمان', currency: 'OMR', phonePrefix: '+968', flag: '🇴🇲', active: true },
]

export function syncMerchantCatalog(countries: CatalogCountry[], methods: CatalogPaymentMethod[]) {
  catalogCountries = countries
  catalogPaymentMethods = methods
}

export let catalogPaymentMethods: CatalogPaymentMethod[] = [
  {
    id: 'vf-cash',
    name: 'Vodafone Cash',
    kind: 'wallet',
    countryIds: ['eg'],
    accountLabel: 'رقم المحفظة',
    accountPlaceholder: '01012345678',
    active: true,
  },
  {
    id: 'instapay',
    name: 'InstaPay',
    kind: 'instapay',
    countryIds: ['eg'],
    accountLabel: 'عنوان InstaPay',
    accountPlaceholder: 'msamy@instapay',
    active: true,
  },
  {
    id: 'bank-eg',
    name: 'Bank Transfer',
    kind: 'bank',
    countryIds: ['eg'],
    accountLabel: 'رقم الحساب / IBAN',
    accountPlaceholder: 'EG000000000000000000000000000',
    active: true,
  },
  {
    id: 'stc-pay',
    name: 'STC Pay',
    kind: 'wallet',
    countryIds: ['sa'],
    accountLabel: 'رقم المحفظة',
    accountPlaceholder: '0554102200',
    active: true,
  },
  {
    id: 'bank-sa',
    name: 'Bank Transfer',
    kind: 'bank',
    countryIds: ['sa', 'ae', 'jo', 'om', 'tr'],
    accountLabel: 'رقم الحساب / IBAN',
    accountPlaceholder: 'SA0000000000000000000000',
    active: true,
  },
  {
    id: 'wallet-ae',
    name: 'e& Money',
    kind: 'wallet',
    countryIds: ['ae'],
    accountLabel: 'رقم المحفظة',
    accountPlaceholder: '0507789012',
    active: true,
  },
]

export function getCountryById(id: string) {
  return catalogCountries.find((country) => country.id === id)
}

export function getCountryByName(name: string) {
  return catalogCountries.find((country) => country.name === name)
}

export function getMethodById(id: string) {
  return catalogPaymentMethods.find((method) => method.id === id)
}

export function accountCountLabel(count: number) {
  if (count === 1) return '1 رقم / حساب'
  return `${count} أرقام / حسابات`
}
