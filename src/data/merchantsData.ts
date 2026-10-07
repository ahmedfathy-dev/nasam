export type MerchantStatus = 'نشط' | 'موقوف'

export type Merchant = {
  id: number
  name: string
  email?: string
  country: string
  phone: string
  currency: string
  commission: string
  transfers: number
  balance: string
  status: MerchantStatus
  lastActivity: string
  createAccount?: boolean
}

export type CommissionType = 'percent' | 'fixed'

export type MerchantFormValues = {
  name: string
  country: string
  phone: string
  currency: string
  commissionType: CommissionType
  commissionValue: string
  status: MerchantStatus
}

export const merchantCountries = ['مصر', 'السعودية', 'الإمارات', 'تركيا', 'الأردن', 'عُمان'] as const

export const countryCurrencies: Record<string, string> = {
  مصر: 'EGP',
  السعودية: 'SAR',
  الإمارات: 'AED',
  تركيا: 'TRY',
  الأردن: 'JOD',
  عُمان: 'OMR',
}

export const merchantCurrencies = ['EGP', 'SAR', 'AED', 'TRY', 'JOD', 'OMR'] as const

export const initialMerchants: Merchant[] = [
  { id: 1, name: 'محمد سامي', email: 'm.samy@nasam.org', country: 'مصر', phone: '+20 100 234 5678', currency: 'EGP', commission: '2%', transfers: 126, balance: '84,200 EGP', status: 'نشط', lastActivity: '12/03/2026', createAccount: true },
  { id: 2, name: 'مؤسسة الريان', country: 'السعودية', phone: '+966 55 410 2200', currency: 'SAR', commission: '1.5%', transfers: 98, balance: '12,750 SAR', status: 'نشط', lastActivity: '02/04/2026' },
  { id: 3, name: 'دار الخير', country: 'الإمارات', phone: '+971 50 778 9012', currency: 'AED', commission: '2.5%', transfers: 64, balance: '0 AED', status: 'نشط', lastActivity: '18/04/2026' },
  { id: 4, name: 'Yildiz Ticaret', country: 'تركيا', phone: '+90 532 174 5567', currency: 'TRY', commission: '2.5%', transfers: 71, balance: '48,300 TRY', status: 'نشط', lastActivity: '05/05/2026' },
  { id: 5, name: 'عمال الأفق', country: 'الأردن', phone: '+962 79 555 1020', currency: 'JOD', commission: '2%', transfers: 58, balance: '1,140 JOD', status: 'نشط', lastActivity: '20/05/2026' },
  { id: 6, name: 'نور التجارية', country: 'مصر', phone: '+20 11 908 3344', currency: 'EGP', commission: '30 EGP', transfers: 145, balance: '39,800 EGP', status: 'نشط', lastActivity: '01/06/2026' },
  { id: 7, name: 'مجموعة الريادة', country: 'عُمان', phone: '+968 9 120 4455', currency: 'OMR', commission: '1%', transfers: 24, balance: '0 OMR', status: 'نشط', lastActivity: '14/07/2026' },
  { id: 8, name: 'مؤسسة فلسطين', country: 'الأردن', phone: '+962 7 330 4455', currency: 'JOD', commission: '2%', transfers: 50, balance: '0 JOD', status: 'نشط', lastActivity: '09/08/2026' },
  { id: 9, name: 'الفرح للخدمات', country: 'مصر', phone: '+20 55 600 3100', currency: 'EGP', commission: '2%', transfers: 50, balance: '0 EGP', status: 'موقوف', lastActivity: '09/09/2026' },
  { id: 10, name: 'Kaya Döviz', country: 'تركيا', phone: '+90 542 210 9020', currency: 'TRY', commission: '20 TRY', transfers: 0, balance: '0 TRY', status: 'موقوف', lastActivity: '22/08/2026' },
  { id: 11, name: 'شركة المدار للتجارة', country: 'مصر', phone: '+20 100 554 7001', currency: 'EGP', commission: '2%', transfers: 84, balance: '42,600 EGP', status: 'نشط', lastActivity: '02/09/2026' },
  { id: 12, name: 'مؤسسة النور', country: 'السعودية', phone: '+966 55 321 7800', currency: 'SAR', commission: '1.5%', transfers: 92, balance: '8,250 SAR', status: 'نشط', lastActivity: '11/09/2026' },
  { id: 13, name: 'شركة آفاق', country: 'الإمارات', phone: '+971 50 332 1800', currency: 'AED', commission: '2%', transfers: 39, balance: '6,300 AED', status: 'نشط', lastActivity: '14/09/2026' },
  { id: 14, name: 'الشرق للصرافة', country: 'مصر', phone: '+20 11 234 5880', currency: 'EGP', commission: '2.5%', transfers: 73, balance: '25,400 EGP', status: 'نشط', lastActivity: '18/09/2026' },
  { id: 15, name: 'الصفوة للحوالات', country: 'الأردن', phone: '+962 79 221 1900', currency: 'JOD', commission: '1.5%', transfers: 55, balance: '880 JOD', status: 'نشط', lastActivity: '20/09/2026' },
  { id: 16, name: 'Bosphorus Exchange', country: 'تركيا', phone: '+90 532 610 4421', currency: 'TRY', commission: '2%', transfers: 108, balance: '37,500 TRY', status: 'نشط', lastActivity: '22/09/2026' },
  { id: 17, name: 'الوسيط المالي', country: 'عُمان', phone: '+968 9 887 1600', currency: 'OMR', commission: '1%', transfers: 31, balance: '220 OMR', status: 'نشط', lastActivity: '24/09/2026' },
  { id: 18, name: 'شركة الأمان', country: 'مصر', phone: '+20 12 551 2640', currency: 'EGP', commission: '2%', transfers: 67, balance: '18,900 EGP', status: 'نشط', lastActivity: '25/09/2026' },
  { id: 19, name: 'دار الاستثمار', country: 'السعودية', phone: '+966 54 880 3400', currency: 'SAR', commission: '1.5%', transfers: 49, balance: '5,700 SAR', status: 'نشط', lastActivity: '27/09/2026' },
  { id: 20, name: 'النخبة للخدمات', country: 'الإمارات', phone: '+971 55 808 1130', currency: 'AED', commission: '2%', transfers: 27, balance: '1,250 AED', status: 'نشط', lastActivity: '29/09/2026' },
  { id: 21, name: 'الرواد التجارية', country: 'مصر', phone: '+20 10 872 2341', currency: 'EGP', commission: '2%', transfers: 42, balance: '11,800 EGP', status: 'نشط', lastActivity: '01/10/2026' },
  { id: 22, name: 'المدينة للتحويلات', country: 'الأردن', phone: '+962 78 440 1122', currency: 'JOD', commission: '1.5%', transfers: 19, balance: '430 JOD', status: 'نشط', lastActivity: '03/10/2026' },
  { id: 23, name: 'الريادة الدولية', country: 'تركيا', phone: '+90 530 445 1670', currency: 'TRY', commission: '2%', transfers: 36, balance: '9,700 TRY', status: 'نشط', lastActivity: '04/10/2026' },
  { id: 24, name: 'بوابة الخليج', country: 'عُمان', phone: '+968 9 500 2077', currency: 'OMR', commission: '1%', transfers: 16, balance: '180 OMR', status: 'نشط', lastActivity: '05/10/2026' },
]

export function emptyMerchantForm(): MerchantFormValues {
  return {
    name: '',
    country: 'مصر',
    phone: '',
    currency: 'EGP',
    commissionType: 'percent',
    commissionValue: '2',
    status: 'نشط',
  }
}

export function formatCommission(values: Pick<MerchantFormValues, 'commissionType' | 'commissionValue' | 'currency'>): string {
  const value = values.commissionValue.trim()
  if (values.commissionType === 'percent') return `${value}%`
  return `${value} ${values.currency}`
}

export function parseCommission(commission: string, currency: string): Pick<MerchantFormValues, 'commissionType' | 'commissionValue'> {
  if (commission.trim().endsWith('%')) {
    return { commissionType: 'percent', commissionValue: commission.replace('%', '').trim() }
  }
  const withoutCurrency = commission.replace(currency, '').trim()
  return { commissionType: 'fixed', commissionValue: withoutCurrency }
}

export function merchantToFormValues(merchant: Merchant): MerchantFormValues {
  const { commissionType, commissionValue } = parseCommission(merchant.commission, merchant.currency)
  return {
    name: merchant.name,
    country: merchant.country,
    phone: merchant.phone,
    currency: merchant.currency,
    commissionType,
    commissionValue,
    status: merchant.status,
  }
}
