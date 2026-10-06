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