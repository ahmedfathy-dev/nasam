export type CountryStatus = 'active' | 'paused'

export type CountryMethod = {
  id: string
  name: string
  active: boolean
}

export type ManagedCountry = {
  id: string
  name: string
  code: string
  flag: string
  currencyCode: string
  currencyName: string
  phonePrefix: string
  status: CountryStatus
  methods: CountryMethod[]
  merchantsCount: number
  monthlyTransfers: number
}

export type CurrencyOption = {
  code: string
  name: string
  label: string
}

export type CountryFormValues = {
  name: string
  currencyCode: string
  status: CountryStatus
  methods: CountryMethod[]
}

export const currencyOptions: CurrencyOption[] = [
  { code: 'EGP', name: 'جنيه مصري', label: 'جنيه مصري — EGP' },
  { code: 'SAR', name: 'ريال سعودي', label: 'ريال سعودي — SAR' },
  { code: 'AED', name: 'درهم إماراتي', label: 'درهم إماراتي — AED' },
  { code: 'TRY', name: 'ليرة تركية', label: 'ليرة تركية — TRY' },
  { code: 'JOD', name: 'دينار أردني', label: 'دينار أردني — JOD' },
  { code: 'OMR', name: 'ريال عماني', label: 'ريال عماني — OMR' },
  { code: 'KWD', name: 'دينار كويتي', label: 'دينار كويتي — KWD' },
]

function method(id: string, name: string, active = true): CountryMethod {
  return { id, name, active }
}

export const initialCountries: ManagedCountry[] = [
  {
    id: 'eg',
    name: 'مصر',
    code: 'EG',
    flag: '🇪🇬',
    currencyCode: 'EGP',
    currencyName: 'جنيه مصري',
    phonePrefix: '+20',
    status: 'active',
    methods: [
      method('eg-instapay', 'InstaPay'),
      method('eg-vf', 'Vodafone Cash'),
      method('eg-bank', 'Bank Transfer'),
    ],
    merchantsCount: 8,
    monthlyTransfers: 142,
  },
  {
    id: 'sa',
    name: 'السعودية',
    code: 'SA',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    currencyName: 'ريال سعودي',
    phonePrefix: '+966',
    status: 'active',
    methods: [
      method('sa-stc', 'STC Pay'),
      method('sa-bank', 'Bank Transfer'),
      method('sa-mada', 'mada'),
    ],
    merchantsCount: 5,
    monthlyTransfers: 98,
  },
  {
    id: 'ae',
    name: 'الإمارات',
    code: 'AE',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencyName: 'درهم إماراتي',
    phonePrefix: '+971',
    status: 'active',
    methods: [
      method('ae-money', 'e& Money'),
      method('ae-bank', 'Bank Transfer'),
      method('ae-instant', 'Instant Transfer'),
      method('ae-apple', 'Apple Pay'),
    ],
    merchantsCount: 4,
    monthlyTransfers: 76,
  },
  {
    id: 'tr',
    name: 'تركيا',
    code: 'TR',
    flag: '🇹🇷',
    currencyCode: 'TRY',
    currencyName: 'ليرة تركية',
    phonePrefix: '+90',
    status: 'active',
    methods: [
      method('tr-papara', 'Papara'),
      method('tr-bank', 'Bank Transfer'),
      method('tr-havale', 'Havale'),
    ],
    merchantsCount: 3,
    monthlyTransfers: 64,
  },
  {
    id: 'jo',
    name: 'الأردن',
    code: 'JO',
    flag: '🇯🇴',
    currencyCode: 'JOD',
    currencyName: 'دينار أردني',
    phonePrefix: '+962',
    status: 'active',
    methods: [
      method('jo-cliq', 'CliQ'),
      method('jo-bank', 'Bank Transfer'),
      method('jo-wallet', 'Orange Money'),
    ],
    merchantsCount: 2,
    monthlyTransfers: 41,
  },
  {
    id: 'om',
    name: 'عُمان',
    code: 'OM',
    flag: '🇴🇲',
    currencyCode: 'OMR',
    currencyName: 'ريال عماني',
    phonePrefix: '+968',
    status: 'active',
    methods: [
      method('om-bank', 'Bank Transfer'),
      method('om-wallet', 'Mobile Wallet'),
    ],
    merchantsCount: 1,
    monthlyTransfers: 28,
  },
  {
    id: 'kw',
    name: 'الكويت',
    code: 'KW',
    flag: '🇰🇼',
    currencyCode: 'KWD',
    currencyName: 'دينار كويتي',
    phonePrefix: '+965',
    status: 'paused',
    methods: [
      method('kw-bank', 'Bank Transfer'),
      method('kw-knet', 'K-Net', false),
    ],
    merchantsCount: 1,
    monthlyTransfers: 0,
  },
]

export function emptyCountryForm(): CountryFormValues {
  return {
    name: '',
    currencyCode: 'EGP',
    status: 'active',
    methods: [
      method(`m-${Date.now()}-1`, 'InstaPay'),
      method(`m-${Date.now()}-2`, 'Vodafone Cash'),
      method(`m-${Date.now()}-3`, 'Bank Transfer'),
      method(`m-${Date.now()}-4`, 'Fawry', false),
    ],
  }
}

export function countryToFormValues(country: ManagedCountry): CountryFormValues {
  return {
    name: country.name,
    currencyCode: country.currencyCode,
    status: country.status,
    methods: country.methods.map((item) => ({ ...item })),
  }
}

export function methodsSummaryLabel(methods: CountryMethod[]) {
  const active = methods.filter((method) => method.active).length
  const paused = methods.length - active
  return `${active} طرق مفعلة، ${paused} موقوفة`
}

export function formatMethodsList(methods: CountryMethod[]) {
  const active = methods.filter((method) => method.active).map((method) => method.name)
  return active.length ? active.join(' - ') : '—'
}

export function guessCountryMeta(name: string, currencyCode: string) {
  const known = initialCountries.find((country) => country.name === name || country.currencyCode === currencyCode)
  if (known && known.name === name) {
    return {
      code: known.code,
      flag: known.flag,
      phonePrefix: known.phonePrefix,
      currencyName: known.currencyName,
    }
  }
  const currency = currencyOptions.find((item) => item.code === currencyCode)
  const code = name.trim().slice(0, 2).toUpperCase() || currencyCode.slice(0, 2)
  return {
    code,
    flag: '🏳️',
    phonePrefix: '+000',
    currencyName: currency?.name ?? currencyCode,
  }
}
