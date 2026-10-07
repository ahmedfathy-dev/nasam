/** Shared number / date formatting helpers (en-US grouping, Arabic display dates). */

export function formatAmount(value: number, digits = 0) {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

export function formatUsd(value: number) {
  return `$ ${formatAmount(value, Math.abs(value) % 1 === 0 ? 0 : 2)}`
}

export function formatUsdFixed(value: number) {
  return `$ ${formatAmount(value, 2)}`
}

export function formatAmountDisplay(raw: string) {
  const digits = raw.replace(/[^\d.]/g, '')
  if (!digits) return ''
  const [whole, fraction] = digits.split('.')
  const formatted = Number(whole || 0).toLocaleString('en-US')
  return fraction !== undefined ? `${formatted}.${fraction.slice(0, 2)}` : formatted
}

export function parseAmount(raw: string) {
  return Number(String(raw).replace(/,/g, '')) || 0
}

export function pad2(value: number) {
  return String(value).padStart(2, '0')
}

export function formatDateTime(date = new Date(), separator = ' - ') {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}${separator}${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function formatDateTimeStamp(date = new Date()) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function formatClockWithDate(date = new Date()) {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())} · ${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`
}

/** e.g. "02:22 م 05/10/2026" from "05/10/2026 - 14:22" */
export function formatReceiptDate(value: string) {
  if (!value.includes('-') && !value.includes('·')) return value || '—'
  const [datePart, timePart] = value.split(/\s[-·]\s/)
  if (!timePart) return value
  const [hh, min] = timePart.split(':').map(Number)
  const period = hh >= 12 ? 'م' : 'ص'
  const hour12 = ((hh + 11) % 12) + 1
  return `${pad2(hour12)}:${pad2(min)} ${period} ${datePart}`
}
