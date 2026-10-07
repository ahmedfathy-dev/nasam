import {
  buildDefaultMethods,
  buildMerchantDetailsFallback,
  merchantDetailsById,
  merchantMethodsById,
  merchantSettlementsById,
  merchantTransfersById,
  parseDisplayDate,
  settlementHasDiff,
  type MerchantDetails,
  type MerchantPaymentMethod,
  type MerchantSettlementRow,
  type MerchantTransferRow,
  type SettleAccountPayload,
} from '../data/merchantDetailsData'
import {
  catalogCountries,
  catalogPaymentMethods,
  getCountryById,
  getMethodById,
  type CatalogCountry,
  type CatalogPaymentMethod,
  type CreateMerchantPayload,
} from '../data/merchantCatalog'
import {
  formatCommission,
  initialMerchants,
  type Merchant,
  type MerchantFormValues,
  type MerchantStatus,
} from '../data/merchantsData'

let merchantsStore = [...initialMerchants]
let nextId = Math.max(...initialMerchants.map((merchant) => merchant.id)) + 1
let detailsStore: Record<number, MerchantDetails> = { ...merchantDetailsById }
let methodsStore: Record<number, MerchantPaymentMethod[]> = Object.fromEntries(
  Object.entries(merchantMethodsById).map(([id, methods]) => [Number(id), methods.map((method) => ({ ...method }))]),
)
let transfersStore: Record<number, MerchantTransferRow[]> = Object.fromEntries(
  Object.entries(merchantTransfersById).map(([id, rows]) => [Number(id), rows.map((row) => ({ ...row }))]),
)
let settlementsStore: Record<number, MerchantSettlementRow[]> = Object.fromEntries(
  Object.entries(merchantSettlementsById).map(([id, rows]) => [Number(id), rows.map((row) => ({ ...row }))]),
)
let nextSettlementSeq = 32
const usedTransferReferences = new Set<string>(['vf-88123212'])

export type SettlementsQuery = {
  search?: string
  status?: 'all' | 'settled' | 'diff'
  period?: 'all' | '30d' | '3m' | '6m' | 'year'
  sort?: 'date' | 'collected' | 'netDue'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export type SettlementsQueryResult = {
  rows: MerchantSettlementRow[]
  total: number
  page: number
  pageSize: number
  pageCount: number
  allRows: MerchantSettlementRow[]
}

function wait(ms = 450) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function formatToday() {
  return new Intl.DateTimeFormat('en-GB').format(new Date())
}

function ensureMerchantExtras(merchant: Merchant) {
  if (!detailsStore[merchant.id]) {
    detailsStore[merchant.id] = buildMerchantDetailsFallback(merchant)
  }
  if (!methodsStore[merchant.id]) {
    methodsStore[merchant.id] = buildDefaultMethods(merchant.currency)
  }
  if (!transfersStore[merchant.id]) {
    transfersStore[merchant.id] = []
  }
  if (!settlementsStore[merchant.id]) {
    settlementsStore[merchant.id] = []
  }
}

export async function listMerchants(): Promise<Merchant[]> {
  await wait(200)
  return [...merchantsStore]
}

export async function getActiveCountries(): Promise<CatalogCountry[]> {
  await wait(80)
  return catalogCountries.filter((country) => country.active)
}

export async function getActivePaymentMethodsByCountry(countryId: string): Promise<CatalogPaymentMethod[]> {
  await wait(80)
  return catalogPaymentMethods.filter(
    (method) => method.active && method.countryIds.includes(countryId),
  )
}

export async function checkMerchantEmailUnique(email: string, excludeId?: number): Promise<boolean> {
  await wait(220)
  const normalized = email.trim().toLowerCase()
  if (!normalized) return true
  return !merchantsStore.some(
    (merchant) => merchant.id !== excludeId && (merchant.email ?? '').toLowerCase() === normalized,
  )
}

export async function createMerchant(input: MerchantFormValues | CreateMerchantPayload): Promise<Merchant> {
  await wait()

  if (isCreatePayload(input)) {
    const country = getCountryById(input.countryId)
    const commissionLabel = input.commission.type === 'percent'
      ? `${input.commission.value}%`
      : `${input.commission.value} ${input.currency}`

    const merchant: Merchant = {
      id: nextId++,
      name: input.name.trim(),
      email: input.email.trim(),
      country: input.country || country?.name || input.country,
      phone: input.phone.trim(),
      currency: input.currency || country?.currency || 'EGP',
      commission: commissionLabel,
      transfers: 0,
      balance: `0 ${input.currency || country?.currency || 'EGP'}`,
      status: input.status,
      lastActivity: formatToday(),
      createAccount: input.createAccount,
    }

    merchantsStore = [merchant, ...merchantsStore]
    ensureMerchantExtras(merchant)

    const methods: MerchantPaymentMethod[] = input.paymentMethods.map((block, index) => {
      const catalog = getMethodById(block.methodId)
      return {
        id: `${block.methodId}-${index + 1}`,
        name: catalog?.name ?? block.methodId,
        account: block.accounts[0] ?? '',
        status: 'نشط' as const,
        transfersCount: 0,
        totalAmount: 0,
        commission: 0,
        netDue: 0,
        currency: merchant.currency,
      }
    })
    // Expand multi-account methods into separate cards matching details UX
    const expanded: MerchantPaymentMethod[] = []
    input.paymentMethods.forEach((block, blockIndex) => {
      const catalog = getMethodById(block.methodId)
      block.accounts.filter(Boolean).forEach((account, accountIndex) => {
        expanded.push({
          id: `${block.methodId}-${blockIndex + 1}-${accountIndex + 1}`,
          name: catalog?.name ?? block.methodId,
          account,
          status: 'نشط',
          transfersCount: 0,
          totalAmount: 0,
          commission: 0,
          netDue: 0,
          currency: merchant.currency,
        })
      })
    })
    methodsStore[merchant.id] = expanded.length ? expanded : methods

    detailsStore[merchant.id] = {
      ...detailsStore[merchant.id],
      email: merchant.email ?? '',
      phone: merchant.phone,
      country: merchant.country,
      currency: merchant.currency,
      commission: merchant.commission,
      commissionLabel: `عمولة ${merchant.commission} ${input.commission.type === 'percent' ? 'نسبة مئوية' : 'قيمة ثابتة'}`,
      status: merchant.status,
      name: merchant.name,
    }

    return merchant
  }

  const merchant: Merchant = {
    id: nextId++,
    name: input.name.trim(),
    country: input.country,
    phone: input.phone.trim(),
    currency: input.currency,
    commission: formatCommission(input),
    transfers: 0,
    balance: `0 ${input.currency}`,
    status: input.status,
    lastActivity: formatToday(),
  }
  merchantsStore = [merchant, ...merchantsStore]
  ensureMerchantExtras(merchant)
  return merchant
}

function isCreatePayload(input: MerchantFormValues | CreateMerchantPayload): input is CreateMerchantPayload {
  return 'paymentMethods' in input && 'countryId' in input
}

export async function updateMerchantFull(id: number, input: CreateMerchantPayload): Promise<Merchant> {
  await wait()
  const index = merchantsStore.findIndex((merchant) => merchant.id === id)
  if (index === -1) throw new Error('لم يتم العثور على التاجر')
  const country = getCountryById(input.countryId)
  const commissionLabel = input.commission.type === 'percent'
    ? `${input.commission.value}%`
    : `${input.commission.value} ${input.currency}`

  const updated: Merchant = {
    ...merchantsStore[index],
    name: input.name.trim(),
    email: input.email.trim(),
    country: input.country || country?.name || merchantsStore[index].country,
    phone: input.phone.trim(),
    currency: input.currency || country?.currency || merchantsStore[index].currency,
    commission: commissionLabel,
    status: input.status,
    lastActivity: formatToday(),
    createAccount: input.createAccount,
  }
  merchantsStore[index] = updated
  ensureMerchantExtras(updated)

  const expanded: MerchantPaymentMethod[] = []
  input.paymentMethods.forEach((block, blockIndex) => {
    const catalog = getMethodById(block.methodId)
    block.accounts.filter(Boolean).forEach((account, accountIndex) => {
      expanded.push({
        id: `${block.methodId}-${blockIndex + 1}-${accountIndex + 1}`,
        name: catalog?.name ?? block.methodId,
        account,
        status: 'نشط',
        transfersCount: 0,
        totalAmount: 0,
        commission: 0,
        netDue: 0,
        currency: updated.currency,
      })
    })
  })
  if (expanded.length) methodsStore[id] = expanded

  if (detailsStore[id]) {
    detailsStore[id] = {
      ...detailsStore[id],
      name: updated.name,
      email: updated.email ?? '',
      phone: updated.phone,
      country: updated.country,
      currency: updated.currency,
      commission: updated.commission,
      commissionLabel: `عمولة ${updated.commission} ${input.commission.type === 'percent' ? 'نسبة مئوية' : 'قيمة ثابتة'}`,
      status: updated.status,
    }
  }

  return updated
}

export async function updateMerchant(id: number, input: MerchantFormValues): Promise<Merchant> {
  await wait()
  const index = merchantsStore.findIndex((merchant) => merchant.id === id)
  if (index === -1) throw new Error('لم يتم العثور على التاجر')
  const current = merchantsStore[index]
  const updated: Merchant = {
    ...current,
    name: input.name.trim(),
    country: input.country,
    phone: input.phone.trim(),
    currency: input.currency,
    commission: formatCommission(input),
    status: input.status,
    lastActivity: formatToday(),
  }
  merchantsStore[index] = updated
  ensureMerchantExtras(updated)
  const details = detailsStore[id]
  if (details) {
    detailsStore[id] = {
      ...details,
      name: updated.name,
      phone: updated.phone,
      country: updated.country,
      currency: updated.currency,
      commission: updated.commission,
      commissionLabel: `عمولة ${updated.commission} نسبة مئوية`,
      status: updated.status,
    }
  }
  return updated
}

export async function deleteMerchant(id: number): Promise<void> {
  await wait()
  const exists = merchantsStore.some((merchant) => merchant.id === id)
  if (!exists) throw new Error('لم يتم العثور على التاجر')
  merchantsStore = merchantsStore.filter((merchant) => merchant.id !== id)
  delete detailsStore[id]
  delete methodsStore[id]
  delete transfersStore[id]
  delete settlementsStore[id]
}

export async function getMerchantById(id: number): Promise<Merchant | null> {
  await wait(180)
  return merchantsStore.find((merchant) => merchant.id === id) ?? null
}

export async function getMerchantDetails(id: number): Promise<MerchantDetails | null> {
  await wait(220)
  const merchant = merchantsStore.find((item) => item.id === id)
  if (!merchant) return null
  ensureMerchantExtras(merchant)
  return { ...detailsStore[id] }
}

export async function getMerchantPaymentMethods(id: number): Promise<MerchantPaymentMethod[]> {
  await wait(180)
  const merchant = merchantsStore.find((item) => item.id === id)
  if (!merchant) return []
  ensureMerchantExtras(merchant)
  return methodsStore[id].map((method) => ({ ...method }))
}

export async function getMerchantTransfers(id: number): Promise<MerchantTransferRow[]> {
  await wait(200)
  const merchant = merchantsStore.find((item) => item.id === id)
  if (!merchant) return []
  ensureMerchantExtras(merchant)
  return transfersStore[id].map((row) => ({ ...row }))
}

export async function registerTransferForMerchant(input: {
  merchantName: string
  id: string
  date: string
  sender: string
  method: string
  receiveNumber: string
  localAmount: number
  commission: number
  currency: string
  usd: number
}): Promise<void> {
  await wait(120)
  const merchant = merchantsStore.find((item) => item.name === input.merchantName)
  if (!merchant) return
  ensureMerchantExtras(merchant)
  const methods = methodsStore[merchant.id] ?? []
  const methodMatch = methods.find((method) => method.name === input.method)
  const row: MerchantTransferRow = {
    id: input.id,
    date: input.date,
    sender: input.sender,
    methodId: methodMatch?.id ?? 'manual',
    method: input.method,
    receiveNumber: input.receiveNumber,
    localAmount: input.localAmount,
    commission: input.commission,
    net: input.localAmount - input.commission,
    usd: input.usd,
    settled: false,
    currency: input.currency,
  }
  transfersStore[merchant.id] = [row, ...transfersStore[merchant.id]]
  const details = detailsStore[merchant.id]
  if (details) {
    detailsStore[merchant.id] = {
      ...details,
      cycle: {
        ...details.cycle,
        transfersCount: details.cycle.transfersCount + 1,
        collected: details.cycle.collected + input.localAmount,
        commissions: details.cycle.commissions + input.commission,
        netDue: details.cycle.netDue + (input.localAmount - input.commission),
        netDueLocal: details.cycle.netDueLocal + (input.localAmount - input.commission),
        netDueUsd: details.cycle.netDueUsd + input.usd,
      },
    }
  }
  const index = merchantsStore.findIndex((item) => item.id === merchant.id)
  if (index !== -1) {
    merchantsStore[index] = {
      ...merchantsStore[index],
      transfers: merchantsStore[index].transfers + 1,
      lastActivity: formatToday(),
    }
  }
}

export async function isTransferReferenceTaken(reference: string): Promise<boolean> {
  await wait(100)
  const normalized = reference.trim().toLowerCase()
  if (!normalized) return false
  return usedTransferReferences.has(normalized)
}

export function markTransferReferenceUsed(reference: string) {
  const normalized = reference.trim().toLowerCase()
  if (normalized) usedTransferReferences.add(normalized)
}

export async function getMerchantSettlements(id: number): Promise<MerchantSettlementRow[]>
export async function getMerchantSettlements(id: number, query: SettlementsQuery): Promise<SettlementsQueryResult>
export async function getMerchantSettlements(
  id: number,
  query?: SettlementsQuery,
): Promise<MerchantSettlementRow[] | SettlementsQueryResult> {
  await wait(220)
  const merchant = merchantsStore.find((item) => item.id === id)
  if (!merchant) {
    return query ? { rows: [], total: 0, page: 1, pageSize: query.pageSize ?? 10, pageCount: 1, allRows: [] } : []
  }
  ensureMerchantExtras(merchant)
  const allRows = settlementsStore[id].map((row) => ({ ...row }))
  if (!query) return allRows

  const search = query.search?.trim().toLowerCase() ?? ''
  const status = query.status ?? 'all'
  const period = query.period ?? 'all'
  const sort = query.sort ?? 'date'
  const sortDir = query.sortDir ?? 'desc'
  const pageSize = query.pageSize ?? 10
  const page = Math.max(1, query.page ?? 1)
  const now = new Date()

  let filtered = allRows.filter((row) => {
    const matchesSearch = !search
      || row.id.toLowerCase().includes(search)
      || (row.reference ?? '').toLowerCase().includes(search)
    const hasDiff = settlementHasDiff(row)
    const matchesStatus = status === 'all'
      || (status === 'settled' && !hasDiff)
      || (status === 'diff' && hasDiff)
    const rowDate = parseDisplayDate(row.date || row.createdAt || '01/01/2020')
    let matchesPeriod = true
    if (period === '30d') {
      const from = new Date(now)
      from.setDate(from.getDate() - 30)
      matchesPeriod = rowDate >= from
    } else if (period === '3m') {
      const from = new Date(now)
      from.setMonth(from.getMonth() - 3)
      matchesPeriod = rowDate >= from
    } else if (period === '6m') {
      const from = new Date(now)
      from.setMonth(from.getMonth() - 6)
      matchesPeriod = rowDate >= from
    } else if (period === 'year') {
      matchesPeriod = rowDate.getFullYear() === now.getFullYear()
    }
    return matchesSearch && matchesStatus && matchesPeriod
  })

  filtered = [...filtered].sort((a, b) => {
    let cmp = 0
    if (sort === 'collected') cmp = a.collected - b.collected
    else if (sort === 'netDue') cmp = a.netDue - b.netDue
    else cmp = parseDisplayDate(a.date || a.createdAt || '').getTime() - parseDisplayDate(b.date || b.createdAt || '').getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * pageSize
  const rows = filtered.slice(start, start + pageSize)

  return { rows, total, page: safePage, pageSize, pageCount, allRows }
}

export async function getSettlementById(merchantId: number, settlementId: string): Promise<MerchantSettlementRow | null> {
  await wait(160)
  const merchant = merchantsStore.find((item) => item.id === merchantId)
  if (!merchant) return null
  ensureMerchantExtras(merchant)
  const row = settlementsStore[merchantId].find((item) => item.id === settlementId)
  return row ? { ...row } : null
}

export async function setMerchantStatus(id: number, status: MerchantStatus): Promise<Merchant> {
  await wait()
  const index = merchantsStore.findIndex((merchant) => merchant.id === id)
  if (index === -1) throw new Error('لم يتم العثور على التاجر')
  const updated = { ...merchantsStore[index], status, lastActivity: formatToday() }
  merchantsStore[index] = updated
  if (detailsStore[id]) detailsStore[id] = { ...detailsStore[id], status }
  return updated
}

export async function settleMerchantAccount(id: number, payload: SettleAccountPayload): Promise<MerchantSettlementRow> {
  await wait(650)
  const merchant = merchantsStore.find((item) => item.id === id)
  if (!merchant) throw new Error('لم يتم العثور على التاجر')
  ensureMerchantExtras(merchant)
  const details = detailsStore[id]

  const included = transfersStore[id].filter((row) => {
    if (row.settled) return false
    if (payload.methodFilter === 'all') return true
    return row.method === payload.methodFilter
  })

  if (included.length === 0 && details.cycle.transfersCount === 0) {
    throw new Error('لا توجد تحويلات للتسوية')
  }

  const expectedUsd = details.cycle.netDueLocal / payload.exchangeRate
  const differenceUsd = payload.transferredUsd - expectedUsd
  const differenceLocal = differenceUsd * payload.exchangeRate

  const settlement: MerchantSettlementRow = {
    id: `STL-${String(nextSettlementSeq++).padStart(4, '0')}`,
    date: payload.settlementDate,
    period: formatPeriodShort(details.lastSettlementDate, payload.settlementDate),
    transfersCount: details.cycle.transfersCount,
    collected: details.cycle.collected,
    commissions: details.cycle.commissions,
    netDue: Number(expectedUsd.toFixed(2)),
    exchangeRate: payload.exchangeRate,
    transferredUsd: payload.transferredUsd,
    difference: Number(differenceUsd.toFixed(2)),
    differenceLocal: Math.round(differenceLocal),
    by: payload.processedBy ?? 'أحمد علي',
    status: 'مسوّاة',
    currency: details.currency,
    reference: payload.reference,
    notes: payload.notes,
    createdAt: payload.settlementDate,
    methodFilter: payload.methodFilter,
    receiptUrl: '/receipt-placeholder.svg',
  }

  settlementsStore[id] = [settlement, ...settlementsStore[id]]
  detailsStore[id] = {
    ...details,
    settlementsCount: details.settlementsCount + 1,
    settlementsTotal: details.settlementsTotal + details.cycle.collected,
    netUsdToday: Number((details.netUsdToday + payload.transferredUsd).toFixed(2)),
    lastSettlementId: settlement.id,
    lastSettlementDate: payload.settlementDate,
    cycle: {
      transfersCount: 0,
      collected: 0,
      commissions: 0,
      netDue: 0,
      netDueLocal: 0,
      netDueUsd: 0,
    },
  }

  transfersStore[id] = transfersStore[id].map((row) => {
    if (row.settled) return row
    const include = payload.methodFilter === 'all' || row.method === payload.methodFilter
    if (!include) return row
    return {
      ...row,
      settled: true,
      settlementId: settlement.id,
      settlementRate: payload.exchangeRate,
      usd: Number((row.net / payload.exchangeRate).toFixed(2)),
    }
  })

  return settlement
}

function formatPeriodShort(from: string, to: string) {
  const short = (value: string) => {
    const parts = value.split('/')
    if (parts.length < 2) return value
    return `${parts[0]}/${parts[1]}`
  }
  return `${short(from)} – ${short(to)}`
}
