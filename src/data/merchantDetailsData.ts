import type { MerchantStatus } from './merchantsData'

export type PaymentMethodStatus = MerchantStatus

export type MerchantPaymentMethod = {
  id: string
  name: string
  account: string
  status: PaymentMethodStatus
  transfersCount: number
  totalAmount: number
  commission: number
  netDue: number
  currency: string
}

export type MerchantTransferRow = {
  id: string
  date: string
  sender: string
  methodId: string
  method: string
  receiveNumber: string
  localAmount: number
  commission: number
  net: number
  usd: number
  settled: boolean
  currency: string
  settlementRate?: number
  settlementId?: string
}

export type MerchantSettlementRow = {
  id: string
  /** Settlement closing date DD/MM/YYYY */
  date: string
  /** Display period e.g. 01/09 – 21/09 */
  period: string
  transfersCount: number
  collected: number
  commissions: number
  /** Net due in USD */
  netDue: number
  exchangeRate: number
  transferredUsd: number
  /** actual − netDue (USD) */
  difference: number
  differenceLocal: number
  by: string
  status: 'مسوّاة' | 'قيد المراجعة'
  currency: string
  reference: string
  notes?: string
  createdAt?: string
  methodFilter?: string
  receiptUrl?: string
  settlementId?: string
}

export type SettleAccountPayload = {
  methodFilter: 'all' | string
  exchangeRate: number
  transferredUsd: number
  reference: string
  settlementDate: string
  notes: string
  processedBy?: string
}

export const TODAY_EXCHANGE_RATE = 49.3

export type MerchantDetails = {
  id: number
  name: string
  email: string
  phone: string
  country: string
  currency: string
  commission: string
  commissionLabel: string
  status: MerchantStatus
  createdAt: string
  settlementsCount: number
  settlementsTotal: number
  netUsdToday: number
  lastSettlementId: string
  lastSettlementDate: string
  cycle: {
    transfersCount: number
    collected: number
    commissions: number
    netDue: number
    netDueLocal: number
    netDueUsd: number
  }
}

export const merchantDetailsById: Record<number, MerchantDetails> = {
  1: {
    id: 1,
    name: 'محمد سامي',
    email: 'm.samy@nasam.org',
    phone: '+20 100 234 5678',
    country: 'مصر',
    currency: 'EGP',
    commission: '2%',
    commissionLabel: 'عمولة 2% نسبة مئوية',
    status: 'نشط',
    createdAt: '12/03/2026',
    settlementsCount: 128,
    settlementsTotal: 312400,
    netUsdToday: 6374,
    lastSettlementId: 'STL-0021',
    lastSettlementDate: '21/09/2026',
    cycle: {
      transfersCount: 54,
      collected: 86000,
      commissions: 1720,
      netDue: 1756,
      netDueLocal: 84280,
      netDueUsd: 48,
    },
  },
}

export function buildMerchantDetailsFallback(merchant: {
  id: number
  name: string
  phone: string
  country: string
  currency: string
  commission: string
  status: MerchantStatus
  lastActivity: string
}): MerchantDetails {
  return {
    id: merchant.id,
    name: merchant.name,
    email: `${merchant.name.replace(/\s+/g, '.').toLowerCase()}@nasam.org`,
    phone: merchant.phone,
    country: merchant.country,
    currency: merchant.currency,
    commission: merchant.commission,
    commissionLabel: `عمولة ${merchant.commission} نسبة مئوية`,
    status: merchant.status,
    createdAt: merchant.lastActivity,
    settlementsCount: 12,
    settlementsTotal: 45000,
    netUsdToday: 920,
    lastSettlementId: 'STL-0008',
    lastSettlementDate: merchant.lastActivity,
    cycle: {
      transfersCount: 8,
      collected: 12000,
      commissions: 240,
      netDue: 180,
      netDueLocal: 11760,
      netDueUsd: 24,
    },
  }
}

export const merchantMethodsById: Record<number, MerchantPaymentMethod[]> = {
  1: [
    { id: 'vf-1', name: 'Vodafone Cash', account: '01012345678', status: 'نشط', transfersCount: 64, totalAmount: 24800, commission: 496, netDue: 24304, currency: 'EGP' },
    { id: 'vf-2', name: 'Vodafone Cash', account: '01099887766', status: 'نشط', transfersCount: 18, totalAmount: 9200, commission: 184, netDue: 9016, currency: 'EGP' },
    { id: 'ip-1', name: 'InstaPay', account: 'username@instapay', status: 'نشط', transfersCount: 22, totalAmount: 15400, commission: 308, netDue: 15092, currency: 'EGP' },
    { id: 'bank-1', name: 'Bank Transfer', account: 'EG•••4417', status: 'موقوف', transfersCount: 6, totalAmount: 4800, commission: 96, netDue: 4704, currency: 'EGP' },
  ],
}

export function buildDefaultMethods(currency: string): MerchantPaymentMethod[] {
  return [
    { id: 'default-1', name: 'Vodafone Cash', account: '01000000000', status: 'نشط', transfersCount: 10, totalAmount: 5000, commission: 100, netDue: 4900, currency },
    { id: 'default-2', name: 'InstaPay', account: 'user@instapay', status: 'نشط', transfersCount: 4, totalAmount: 2200, commission: 44, netDue: 2156, currency },
  ]
}

export const merchantTransfersById: Record<number, MerchantTransferRow[]> = {
  1: [
    { id: 'TRX-1248', date: '05/10/2026', sender: 'أحمد يوسف', methodId: 'vf-1', method: 'Vodafone Cash', receiveNumber: '01012345678', localAmount: 12000, commission: 240, net: 11760, usd: 245, settled: false, currency: 'EGP' },
    { id: 'TRX-1239', date: '04/10/2026', sender: 'حسن محسن', methodId: 'vf-1', method: 'Vodafone Cash', receiveNumber: '01012345678', localAmount: 8500, commission: 170, net: 8330, usd: 174, settled: false, currency: 'EGP' },
    { id: 'TRX-1226', date: '02/10/2026', sender: 'سارة أحمد', methodId: 'ip-1', method: 'InstaPay', receiveNumber: 'username@instapay', localAmount: 6400, commission: 128, net: 6272, usd: 131, settled: true, currency: 'EGP', settlementId: 'STL-0031' },
    { id: 'TRX-1211', date: '28/09/2026', sender: 'ليث حمد', methodId: 'vf-1', method: 'Vodafone Cash', receiveNumber: '01012345678', localAmount: 15000, commission: 300, net: 14700, usd: 306, settled: true, currency: 'EGP', settlementId: 'STL-0031' },
    { id: 'TRX-1198', date: '25/09/2026', sender: 'خالد العوفي', methodId: 'vf-2', method: 'Vodafone Cash', receiveNumber: '01099887766', localAmount: 4200, commission: 84, net: 4116, usd: 86, settled: false, currency: 'EGP' },
    { id: 'TRX-1102', date: '22/09/2026', sender: 'نور الدين', methodId: 'bank-1', method: 'Bank Transfer', receiveNumber: 'EG•••4417', localAmount: 9800, commission: 196, net: 9604, usd: 200, settled: true, currency: 'EGP', settlementId: 'STL-0031' },
    { id: 'TRX-1095', date: '20/09/2026', sender: 'منى سالم', methodId: 'ip-1', method: 'InstaPay', receiveNumber: 'username@instapay', localAmount: 3100, commission: 62, net: 3038, usd: 63, settled: true, currency: 'EGP', settlementId: 'STL-0024' },
  ],
}

export const merchantSettlementsById: Record<number, MerchantSettlementRow[]> = {
  1: [
    { id: 'STL-0031', date: '21/09/2026', period: '01/09 – 21/09', transfersCount: 48, collected: 78500, commissions: 1570, netDue: 1602.71, exchangeRate: 48.00, transferredUsd: 1602.71, difference: 0, differenceLocal: 0, by: 'أحمد علي', status: 'مسوّاة', currency: 'EGP', reference: 'FT-77812', notes: 'تسوية دورة سبتمبر', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0024', date: '31/08/2026', period: '05/08 – 31/08', transfersCount: 61, collected: 102000, commissions: 2040, netDue: 2082.50, exchangeRate: 48.00, transferredUsd: 2080.00, difference: -2.5, differenceLocal: -120, by: 'أحمد علي', status: 'مسوّاة', currency: 'EGP', reference: 'FT-70233', notes: 'فرق طفيف سيُرحّل', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0017', date: '04/08/2026', period: '12/07 – 04/08', transfersCount: 39, collected: 64200, commissions: 1284, netDue: 1322.32, exchangeRate: 47.58, transferredUsd: 1322.32, difference: 0, differenceLocal: 0, by: 'سارة كمال', status: 'مسوّاة', currency: 'EGP', reference: 'FT-66410', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0012', date: '11/07/2026', period: '20/06 – 11/07', transfersCount: 52, collected: 84300, commissions: 1686, netDue: 1742.91, exchangeRate: 47.40, transferredUsd: 1742.91, difference: 0, differenceLocal: 0, by: 'سارة كمال', status: 'مسوّاة', currency: 'EGP', reference: 'FT-61875', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0009', date: '19/06/2026', period: '28/05 – 19/06', transfersCount: 44, collected: 69800, commissions: 1396, netDue: 1447.70, exchangeRate: 47.25, transferredUsd: 1447.70, difference: 0, differenceLocal: 0, by: 'أحمد علي', status: 'مسوّاة', currency: 'EGP', reference: 'FT-57302', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0006', date: '27/05/2026', period: '06/05 – 27/05', transfersCount: 57, collected: 91400, commissions: 1828, netDue: 1901.74, exchangeRate: 47.10, transferredUsd: 1901.74, difference: 0, differenceLocal: 0, by: 'أحمد علي', status: 'مسوّاة', currency: 'EGP', reference: 'FT-52944', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0004', date: '05/05/2026', period: '14/04 – 05/05', transfersCount: 41, collected: 66900, commissions: 1338, netDue: 1394.94, exchangeRate: 47.00, transferredUsd: 1393.74, difference: -1.2, differenceLocal: -56, by: 'سارة كمال', status: 'مسوّاة', currency: 'EGP', reference: 'FT-48117', notes: 'فرق 1.20 دولار', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0003', date: '13/04/2026', period: '23/03 – 13/04', transfersCount: 36, collected: 58100, commissions: 1162, netDue: 1215.33, exchangeRate: 46.85, transferredUsd: 1215.33, difference: 0, differenceLocal: 0, by: 'سارة كمال', status: 'مسوّاة', currency: 'EGP', reference: 'FT-43690', receiptUrl: '/receipt-placeholder.svg' },
    { id: 'STL-0002', date: '22/03/2026', period: '12/03 – 22/03', transfersCount: 18, collected: 27600, commissions: 552, netDue: 577.95, exchangeRate: 46.80, transferredUsd: 577.95, difference: 0, differenceLocal: 0, by: 'سارة كمال', status: 'مسوّاة', currency: 'EGP', reference: 'FT-39025', receiptUrl: '/receipt-placeholder.svg' },
  ],
}

export function parseDisplayDate(value: string): Date {
  const [day, month, year] = value.split('/').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

export { formatAmount, formatUsd, formatUsdFixed } from '../utils/format'

export function settlementHasDiff(row: MerchantSettlementRow) {
  return Math.abs(row.difference) >= 0.005 || Math.abs(row.transferredUsd - row.netDue) >= 0.005
}

export function settlementDiffAbs(row: MerchantSettlementRow) {
  return Math.abs(row.difference || (row.transferredUsd - row.netDue))
}
