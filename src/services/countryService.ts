import {
  currencyOptions,
  guessCountryMeta,
  initialCountries,
  type CountryFormValues,
  type CountryStatus,
  type ManagedCountry,
} from '../data/countriesData'
import {
  syncMerchantCatalog,
  type CatalogCountry,
  type CatalogPaymentMethod,
  type PaymentMethodKind,
} from '../data/merchantCatalog'

const wait = (ms = 120) => new Promise((resolve) => window.setTimeout(resolve, ms))

let countriesStore: ManagedCountry[] = initialCountries.map((country) => ({
  ...country,
  methods: country.methods.map((method) => ({ ...method })),
}))

let nextMethodId = 1000

function cloneCountries() {
  return countriesStore.map((country) => ({
    ...country,
    methods: country.methods.map((method) => ({ ...method })),
  }))
}

function syncCatalog() {
  syncMerchantCatalog(getCatalogCountriesSnapshot(), getCatalogPaymentMethodsSnapshot())
}

function sortByTransfers(list: ManagedCountry[]) {
  return [...list].sort((a, b) => b.monthlyTransfers - a.monthlyTransfers || a.name.localeCompare(b.name, 'ar'))
}

function inferMethodKind(name: string): PaymentMethodKind {
  const lower = name.toLowerCase()
  if (lower.includes('insta')) return 'instapay'
  if (lower.includes('bank') || lower.includes('iban') || lower.includes('transfer')) return 'bank'
  return 'wallet'
}

export function getCatalogCountriesSnapshot(): CatalogCountry[] {
  return countriesStore.map((country) => ({
    id: country.id,
    name: country.name,
    currency: country.currencyCode,
    phonePrefix: country.phonePrefix,
    flag: country.flag,
    active: country.status === 'active',
  }))
}

export function getCatalogPaymentMethodsSnapshot(): CatalogPaymentMethod[] {
  return countriesStore.flatMap((country) =>
    country.methods.map((method) => ({
      id: method.id,
      name: method.name,
      kind: inferMethodKind(method.name),
      countryIds: [country.id],
      accountLabel: inferMethodKind(method.name) === 'instapay'
        ? 'عنوان InstaPay'
        : inferMethodKind(method.name) === 'bank'
          ? 'رقم الحساب / IBAN'
          : 'رقم المحفظة',
      accountPlaceholder: inferMethodKind(method.name) === 'instapay'
        ? 'user@instapay'
        : inferMethodKind(method.name) === 'bank'
          ? `${country.code}000000000000000000000000`
          : '01012345678',
      active: method.active && country.status === 'active',
    })),
  )
}

export async function listCountries(): Promise<ManagedCountry[]> {
  await wait()
  return sortByTransfers(cloneCountries())
}

export async function getCountryStats() {
  await wait(60)
  const list = countriesStore
  const activeMethods = list.reduce((sum, country) => {
    if (country.status !== 'active') return sum
    return sum + country.methods.filter((method) => method.active).length
  }, 0)
  const merchants = list.reduce((sum, country) => sum + country.merchantsCount, 0)
  return {
    total: list.length,
    active: list.filter((country) => country.status === 'active').length,
    activeMethods,
    merchants,
  }
}

export async function createCountry(values: CountryFormValues): Promise<ManagedCountry> {
  await wait(180)
  const name = values.name.trim()
  if (!name) throw new Error('name required')
  if (countriesStore.some((country) => country.name === name)) {
    throw new Error('duplicate')
  }

  const currency = currencyOptions.find((item) => item.code === values.currencyCode)
  const meta = guessCountryMeta(name, values.currencyCode)
  const id = name
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .toLowerCase() || `c-${Date.now()}`

  const country: ManagedCountry = {
    id: countriesStore.some((item) => item.id === id) ? `${id}-${Date.now()}` : id,
    name,
    code: meta.code,
    flag: meta.flag,
    currencyCode: values.currencyCode,
    currencyName: currency?.name ?? meta.currencyName,
    phonePrefix: meta.phonePrefix,
    status: values.status,
    methods: values.methods
      .map((method) => ({ ...method, name: method.name.trim() }))
      .filter((method) => method.name),
    merchantsCount: 0,
    monthlyTransfers: 0,
  }

  countriesStore = [country, ...countriesStore]
  syncCatalog()
  return { ...country, methods: country.methods.map((method) => ({ ...method })) }
}

export async function updateCountry(id: string, values: CountryFormValues): Promise<ManagedCountry> {
  await wait(180)
  const index = countriesStore.findIndex((country) => country.id === id)
  if (index < 0) throw new Error('not found')

  const name = values.name.trim()
  if (!name) throw new Error('name required')
  if (countriesStore.some((country) => country.id !== id && country.name === name)) {
    throw new Error('duplicate')
  }

  const current = countriesStore[index]
  const currency = currencyOptions.find((item) => item.code === values.currencyCode)
  const updated: ManagedCountry = {
    ...current,
    name,
    currencyCode: values.currencyCode,
    currencyName: currency?.name ?? current.currencyName,
    status: values.status,
    methods: values.methods
      .map((method) => ({ ...method, name: method.name.trim() }))
      .filter((method) => method.name),
  }

  countriesStore = countriesStore.map((country) => (country.id === id ? updated : country))
  syncCatalog()
  return { ...updated, methods: updated.methods.map((method) => ({ ...method })) }
}

export async function deleteCountry(id: string): Promise<void> {
  await wait(140)
  countriesStore = countriesStore.filter((country) => country.id !== id)
  syncCatalog()
}

export async function setCountryStatus(id: string, status: CountryStatus): Promise<ManagedCountry> {
  await wait(100)
  const current = countriesStore.find((country) => country.id === id)
  if (!current) throw new Error('not found')
  const updated = { ...current, status }
  countriesStore = countriesStore.map((country) => (country.id === id ? updated : country))
  syncCatalog()
  return { ...updated, methods: updated.methods.map((method) => ({ ...method })) }
}

export function createMethodDraft(name = ''): { id: string; name: string; active: boolean } {
  nextMethodId += 1
  return { id: `method-${nextMethodId}`, name, active: true }
}

syncCatalog()
