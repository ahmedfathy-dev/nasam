export type TransferStatus = 'مستوفاة' | 'غير مستوفاة' | 'مسودة'

export type Transfer = {
  number: string
  date: string
  country: string
  merchant: string
  sender: string
  method: string
  amount: string
  currency: string
  usd: string
  status: TransferStatus
}

export const initialTransfers: Transfer[] = [
  { number: 'TRX-1248', date: '05/10 · 14:22', country: 'مصر', merchant: 'محمد سامي', sender: 'أحمد يوسف', method: 'Vodafone Cash', amount: '12,000', currency: 'EGP', usd: '$ 245', status: 'غير مستوفاة' },
  { number: 'TRX-1247', date: '05/10 · 13:50', country: 'السعودية', merchant: 'مؤسسة الريان', sender: 'محمد العتيبي', method: 'STC Pay', amount: '2,500', currency: 'SAR', usd: '$ 657', status: 'غير مستوفاة' },
  { number: 'TRX-1247', date: '05/10 · 12:10', country: 'مصر', merchant: 'نور التجارية', sender: '—', method: 'InstaPay', amount: '8,400', currency: 'EGP', usd: '$ 174', status: 'غير مستوفاة' },
  { number: 'TRX-1246', date: '05/10 · 10:44', country: 'الإمارات', merchant: 'دار الخير', sender: 'سالم الهاشمي', method: 'Bank Transfer', amount: '3,200', currency: 'AED', usd: '$ 865', status: 'غير مستوفاة' },
  { number: 'TRX-1245', date: '04/10 · 22:31', country: 'تركيا', merchant: 'Yildiz Ticaret', sender: 'Emre K.', method: 'Papara', amount: '15,000', currency: 'TRY', usd: '$ 427', status: 'غير مستوفاة' },
  { number: 'TRX-1244', date: '04/10 · 20:05', country: 'الأردن', merchant: 'عنان للصرافة', sender: 'ليث حمد', method: 'CliQ', amount: '420', currency: 'JOD', usd: '$ 580', status: 'غير مستوفاة' },
  { number: 'TRX-1243', date: '04/10 · 18:17', country: 'مصر', merchant: 'محمد سامي', sender: 'حسن محسن', method: 'InstaPay', amount: '20,000', currency: 'EGP', usd: '$ 408', status: 'غير مستوفاة' },
  { number: 'TRX-1240', date: '03/10 · 15:02', country: 'عُمان', merchant: 'مصطفى إكسبريس', sender: 'خالد العوفي', method: 'Bank Transfer', amount: '300', currency: 'OMR', usd: '$ 771.43', status: 'مستوفاة' },
  { number: 'TRX-1238', date: '03/10 · 11:48', country: 'السعودية', merchant: 'مؤسسة الريان', sender: '—', method: 'Bank Transfer', amount: '5,000', currency: 'SAR', usd: '$ 1,313.33', status: 'مستوفاة' },
  { number: 'TRX-1236', date: '02/10 · 19:20', country: 'الإمارات', merchant: 'دار الخير', sender: 'محمد العتيبي', method: 'Payit', amount: '1,800', currency: 'AED', usd: '$ 483.38', status: 'مستوفاة' },
  { number: 'TRX-1231', date: '02/10 · 08:02', country: 'عُمان', merchant: 'مصطفى إكسبريس', sender: 'سالم الهاشمي', method: 'Bank Transfer', amount: '6,000', currency: 'OMR', usd: '$ 124.38', status: 'مستوفاة' },
  { number: 'TRX-1228', date: '01/10 · 21:40', country: 'تركيا', merchant: 'Yildiz Ticaret', sender: 'Ayse D.', method: 'Bank Transfer', amount: '9,000', currency: 'TRY', usd: '$ 256.24', status: 'مستوفاة' },
]

export const transferCountries = ['مصر', 'السعودية', 'الإمارات', 'تركيا', 'الأردن', 'عُمان', 'الكويت']

export const transferCurrencies = [
  { code: 'EGP', country: 'مصر', rate: 48 },
  { code: 'SAR', country: 'السعودية', rate: 3.75 },
  { code: 'AED', country: 'الإمارات', rate: 3.67 },
  { code: 'TRY', country: 'تركيا', rate: 34.2 },
  { code: 'JOD', country: 'الأردن', rate: 0.709 },
  { code: 'OMR', country: 'عُمان', rate: 0.385 },
  { code: 'KWD', country: 'الكويت', rate: 0.307 },
]

export type TransferMerchantOption = {
  name: string
  country: string
  status: 'نشط' | 'موقوف'
  commissionType: 'percent' | 'fixed'
  commissionValue: number
  methods: Array<{
    name: string
    brand: 'vodafone' | 'instapay' | 'bank' | 'other'
    accounts: string[]
  }>
}

export const transferMerchants: TransferMerchantOption[] = [
  {
    name: 'محمد سامي',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 2,
    methods: [
      { name: 'Vodafone Cash', brand: 'vodafone', accounts: ['01012345678', '01099887766'] },
      { name: 'InstaPay', brand: 'instapay', accounts: ['msamy@instapay'] },
    ],
  },
  {
    name: 'نور التجارية',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 2,
    methods: [
      { name: 'Vodafone Cash', brand: 'vodafone', accounts: ['0119083344'] },
      { name: 'InstaPay', brand: 'instapay', accounts: ['noor@instapay'] },
    ],
  },
  {
    name: 'الهدى للصرافة',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 2,
    methods: [
      { name: 'Vodafone Cash', brand: 'vodafone', accounts: ['01077776666'] },
      { name: 'InstaPay', brand: 'instapay', accounts: ['huda@instapay'] },
    ],
  },
  {
    name: 'أفق للتحويلات',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'fixed',
    commissionValue: 25,
    methods: [
      { name: 'Vodafone Cash', brand: 'vodafone', accounts: ['01122334455'] },
    ],
  },
  {
    name: 'بيت المال مصر',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 1.75,
    methods: [
      { name: 'InstaPay', brand: 'instapay', accounts: ['bait@instapay'] },
      { name: 'Bank Transfer', brand: 'bank', accounts: ['EG•••4410'] },
    ],
  },
  {
    name: 'سريع كاش',
    country: 'مصر',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 2.25,
    methods: [
      { name: 'Vodafone Cash', brand: 'vodafone', accounts: ['01234567890', '01555551212'] },
    ],
  },
  {
    name: 'مؤسسة الريان',
    country: 'السعودية',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 1.5,
    methods: [
      { name: 'STC Pay', brand: 'other', accounts: ['0554102200'] },
      { name: 'Bank Transfer', brand: 'bank', accounts: ['SA•••2200'] },
    ],
  },
  {
    name: 'دار الخير',
    country: 'الإمارات',
    status: 'نشط',
    commissionType: 'percent',
    commissionValue: 2.5,
    methods: [
      { name: 'Bank Transfer', brand: 'bank', accounts: ['AE•••9012'] },
    ],
  },
]

export type ReceiptExtract = {
  amount: string
  receiver: string
  sender: string
  reference: string
  dateTime: string
}

export async function extractReceiptData(file: File): Promise<ReceiptExtract> {
  await new Promise((resolve) => window.setTimeout(resolve, 450))
  void file
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const hh = String(now.getHours()).padStart(2, '0')
  const min = String(now.getMinutes()).padStart(2, '0')
  return {
    amount: '12000',
    receiver: '01012345678',
    sender: 'أحمد يوسف',
    reference: 'VF-88213409',
    dateTime: `${dd}/${mm}/${yyyy} · ${hh}:${min}`,
  }
}

const DRAFT_KEY = 'nasam-transfer-draft'

export function saveTransferDraft(payload: unknown) {
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
}

export function loadTransferDraft<T>(): T | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) as T : null
  } catch {
    return null
  }
}

export function clearTransferDraft() {
  window.localStorage.removeItem(DRAFT_KEY)
}