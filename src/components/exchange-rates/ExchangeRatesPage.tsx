import { useMemo, useState } from 'react'
import { CalendarDays, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  liveClockLabel,
  liveRates,
  liveSyncLabel,
  rateHistory,
  ratesPageDate,
  type RateHistoryRow,
} from '@/data/exchangeRatesPageData'

const periodOptions = [
  { value: '30', label: 'آخر 30 يوم' },
  { value: '7', label: 'آخر 7 أيام' },
  { value: 'all', label: 'كل السجل' },
] as const

function parseRowDate(value: string) {
  const [day, month, year] = value.split('/').map(Number)
  return new Date(year, month - 1, day)
}

function withinPeriod(row: RateHistoryRow, period: string) {
  if (period === 'all') return true
  const anchor = parseRowDate('05/10/2026')
  const rowDate = parseRowDate(row.date)
  const days = period === '7' ? 7 : 30
  const limit = new Date(anchor)
  limit.setDate(limit.getDate() - days)
  return rowDate >= limit
}

function ExchangeRatesPage() {
  const [period, setPeriod] = useState('30')
  const [currency, setCurrency] = useState('all')

  const currencyOptions = useMemo(
    () => ['all', ...liveRates.map((rate) => rate.code)],
    [],
  )

  const rows = useMemo(
    () => rateHistory.filter((row) => (
      (currency === 'all' || row.code === currency) && withinPeriod(row, period)
    )),
    [currency, period],
  )

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.3] text-[#1a2128] min-[721px]:text-[30px]">
            أسعار الصرف اللحظية
          </h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">
            سعر الدولار مقابل عملة كل دولة · تُحدَّث تلقائيًا ولحظيًا عبر API بدون أي إدخال يدوي
          </p>
        </div>
        <span className="inline-flex h-9 w-fit items-center gap-2 self-start rounded-full border border-[#e6e9ec] bg-white px-3 text-[12px] text-[#5c666e]">
          {ratesPageDate}
          <CalendarDays size={14} className="text-[#8b949c]" />
        </span>
      </header>

      <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d7efcf] bg-[#eef8ea] px-4 py-2.5 text-center text-[12px] font-medium text-[#3d9a45]">
        <span>
          متصل بمزوّد الأسعار (API) · آخر مزامنة {liveSyncLabel} · يتم تحديث الأسعار تلقائيًا كل دقيقة
        </span>
        <i className="size-2 shrink-0 rounded-full bg-[#3dcf5a]" />
      </div>

      <section className="grid grid-cols-1 gap-3 min-[721px]:grid-cols-2 min-[1100px]:grid-cols-3" aria-label="أسعار العملات" dir="ltr">
        {liveRates.map((rate) => {
          const changeValue = rate.change.replace('%', '')
          const changeLabel = rate.up ? `%${changeValue}+` : `%${changeValue}`
          return (
            <article
              key={rate.code}
              dir="rtl"
              className="rounded-[16px] border border-[#eef1f3] bg-white px-4 pb-[18px] pt-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="inline-flex h-[22px] shrink-0 items-center rounded-[6px] bg-[#f2f4f6] px-1.5 text-[11px] font-semibold tracking-[0.01em] text-[#7b848d]">
                    {rate.code}
                  </span>
                  <span className="truncate text-[12px] text-[#9aa3ab]">
                    {rate.name} · {rate.country}
                  </span>
                </div>
                <span
                  dir="ltr"
                  className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full bg-[#e7f6ea] ps-2.5 pe-2 text-[11px] font-semibold text-[#3aaa48]"
                >
                  <span>{liveClockLabel} · مباشر</span>
                  <i className="size-1.5 rounded-full bg-[#3dcf5a]" />
                </span>
              </div>
              <div className="mt-[22px] flex flex-col items-center">
                <span className="text-[13px] leading-none text-[#a8b0b7]" dir="ltr">1 USD =</span>
                <p className="mt-2 flex items-baseline gap-2" dir="ltr">
                  <span className="text-[14px] font-medium leading-none text-[#9aa3ab]">{rate.code}</span>
                  <span className="text-[32px] font-bold leading-none tracking-[-0.03em] text-[#1b2128]">{rate.rate}</span>
                </p>
                <p className="mt-2.5 text-[11px] leading-none text-[#b0b7bd]" dir="ltr">
                  <span className={rate.up ? 'font-semibold text-[#2f9d45]' : undefined}>{changeLabel}</span>
                  {` · ${rate.yesterday} أمس`}
                </p>
              </div>
            </article>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#eceff2] bg-white shadow-[0_1px_2px_rgb(20_30_40_/_4%)]">
        <div className="flex flex-col items-stretch gap-3 px-4 py-3.5 min-[721px]:flex-row min-[721px]:items-center min-[721px]:justify-between">
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">سجل أسعار الصرف</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">
              يُحفظ كل سعر تم سحبه من الـ API ويُربط مباشرة بالتسويات التي استخدمته
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 self-start">
            <FilterSelect
              field={{
                value: period,
                options: periodOptions.map((option) => ({ value: option.value, label: option.label })),
                onChange: setPeriod,
                ariaLabel: 'فترة السجل',
              }}
            />
            <FilterSelect
              field={{
                value: currency,
                options: currencyOptions.map((code) => ({
                  value: code,
                  label: code === 'all' ? 'كل العملات' : code,
                })),
                onChange: setCurrency,
                ariaLabel: 'تصفية العملة',
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="bg-[#f7f8f9]">
                {['العملة', 'سعر الدولار', 'التاريخ', 'وقت التحديث', 'المصدر', 'مستخدم في التسويات'].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-start text-[12px] font-medium text-[#8d969e]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[#8d969e]">
                    لا توجد أسعار في هذه الفترة
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[#f0f2f4]">
                  <td className="px-4 py-3.5 text-start text-[13px] font-semibold text-[#2a3238]">{row.code}</td>
                  <td className="px-4 py-3.5 text-start text-[13px] text-[#3d4650]">{row.rate}</td>
                  <td className="px-4 py-3.5 text-start text-[13px] text-[#6d7780]">{row.date}</td>
                  <td className="px-4 py-3.5 text-start text-[13px] text-[#6d7780]">{row.time}</td>
                  <td className="px-4 py-3.5 text-start text-[13px] text-[#6d7780]">{row.source}</td>
                  <td className={cn(
                    'px-4 py-3.5 text-start text-[13px] font-semibold',
                    row.settlements === '—' ? 'font-normal text-[#b0b6bc]' : 'text-[#1f9a45]',
                  )}
                  >
                    {row.settlements}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function FilterSelect({ field }: {
  field: {
    value: string
    options: Array<{ value: string; label: string }>
    onChange: (value: string) => void
    ariaLabel: string
  }
}) {
  const { value, options: sourceOptions, onChange, ariaLabel } = field
  const options = sourceOptions?.length ? sourceOptions : [{ value: '', label: '—' }]
  const [open, setOpen] = useState(false)
  const current = options.find((option) => option.value === value) ?? options[0]

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border border-[#e6e9ec] bg-[#f4f5f6] px-3 text-[12px] font-medium text-[#3f4850]"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
      >
        <span>{current.label}</span>
        <ChevronDown size={14} className="text-[#8b949c]" />
      </button>
      {open && (
        <div className="absolute start-0 top-[calc(100%+6px)] z-20 min-w-full rounded-xl border border-[#e6e9ec] bg-white p-1 shadow-[0_10px_24px_rgb(20_30_40_/_12%)]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'block w-full cursor-pointer rounded-lg border-0 bg-transparent px-3 py-2 text-start text-[12px] text-[#3f4850]',
                option.value === value && 'bg-[#f4f6f7] font-semibold',
              )}
              onClick={() => {
                onChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExchangeRatesPage
