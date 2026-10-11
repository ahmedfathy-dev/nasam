export type LiveRate = {
  code: string
  name: string
  country: string
  rate: string
  yesterday: string
  change: string
  up: boolean
}

export type RateHistoryRow = {
  id: string
  code: string
  rate: string
  date: string
  time: string
  source: string
  settlements: string
}

export const liveSyncLabel = '09:41:12'
export const liveClockLabel = '09:41'
export const ratesPageDate = 'الإثنين 05/10/2026'

export const liveRates: LiveRate[] = [
  { code: 'AED', name: 'درهم إماراتي', country: 'الإمارات', rate: '3.67', yesterday: '3.67', change: '0.00%', up: false },
  { code: 'SAR', name: 'ريال سعودي', country: 'السعودية', rate: '3.75', yesterday: '3.75', change: '0.00%', up: false },
  { code: 'EGP', name: 'جنيه مصري', country: 'مصر', rate: '48.00', yesterday: '47.85', change: '0.31%', up: true },
  { code: 'OMR', name: 'ريال عماني', country: 'عُمان', rate: '0.385', yesterday: '0.385', change: '0.00%', up: false },
  { code: 'JOD', name: 'دينار أردني', country: 'الأردن', rate: '0.709', yesterday: '0.709', change: '0.00%', up: false },
  { code: 'TRY', name: 'ليرة تركية', country: 'تركيا', rate: '34.20', yesterday: '34.10', change: '0.29%', up: true },
]

export const rateHistory: RateHistoryRow[] = [
  { id: 'h1', code: 'EGP', rate: '48.00', date: '05/10/2026', time: '09:12', source: 'API · تلقائي', settlements: 'STL-0033, STL-0034' },
  { id: 'h2', code: 'SAR', rate: '3.75', date: '05/10/2026', time: '09:12', source: 'API · تلقائي', settlements: '—' },
  { id: 'h3', code: 'EGP', rate: '47.85', date: '04/10/2026', time: '08:55', source: 'API · تلقائي', settlements: '—' },
  { id: 'h4', code: 'TRY', rate: '34.10', date: '04/10/2026', time: '08:55', source: 'API · تلقائي', settlements: 'STL-0032' },
  { id: 'h5', code: 'EGP', rate: '48.00', date: '21/09/2026', time: '09:40', source: 'API · تلقائي', settlements: 'STL-0031' },
  { id: 'h6', code: 'AED', rate: '3.67', date: '21/09/2026', time: '09:40', source: 'API · تلقائي', settlements: 'STL-0030' },
]
