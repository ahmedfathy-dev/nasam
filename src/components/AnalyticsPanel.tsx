import { cn } from '@/lib/cn'
import { countryBreakdown } from '../data/dashboardData'

const segmentTone: Record<string, string> = {
  green: 'bg-[#3dcf5a]',
  teal: 'bg-[#1aa3c7]',
  blue: 'bg-[#2f7de0]',
  slate: 'bg-[#b7bec4]',
}

const totalAmount = countryBreakdown.reduce((sum, country) => sum + country.amount, 0)

function formatUsd(amount: number) {
  return `$ ${amount.toLocaleString('en-US')}`
}

function AnalyticsPanel() {
  return (
    <aside
      className={cn(
        'flex min-w-0 flex-col rounded-xl border border-[#e9ecef] bg-surface',
        'shadow-[0_2px_5px_rgb(30_45_58_/_2%)]',
      )}
    >
      <header className="px-4 pb-3 pt-4 text-start">
        <h2 className="text-[16px] font-bold leading-[1.35] text-[#1c242b]">ملخص الحوالات حسب الدولة</h2>
        <p className="mt-1 text-[12px] text-[#9aa3ab]">هذا الشهر · بالدولار USD</p>
      </header>

      <div
        className="mx-4 mb-4 flex h-2 overflow-hidden rounded-full"
        aria-label="توزيع الحوالات"
      >
        {countryBreakdown.map((country) => (
          <span
            key={country.label}
            className={cn('block h-full', segmentTone[country.color])}
            style={{ width: `${country.percent}%` }}
          />
        ))}
      </div>

      <div className="grid gap-3.5 px-4 pb-3">
        {countryBreakdown.map((country) => (
          <div key={country.label} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
            <div className="min-w-[4.5rem] text-start">
              <div className="inline-flex items-center gap-1.5">
                <i className={cn('size-2 flex-none rounded-full', segmentTone[country.color])} />
                <span className="text-[13px] font-bold leading-none text-[#1c242b]">{country.label}</span>
              </div>
              <div className="mt-1 text-[11px] leading-none text-[#9aa3ab]">{country.count} حوالة</div>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-[#eef1f3]">
              <span
                className={cn('block h-full rounded-full', segmentTone[country.color])}
                style={{ width: `${country.percent}%` }}
              />
            </div>
            <div className="min-w-[4.75rem] text-start" dir="ltr">
              <div className="text-[15px] font-bold leading-none text-[#1c242b]">{country.percent}%</div>
              <div className="mt-1 text-[11px] leading-none text-[#8b949c]">{formatUsd(country.amount)}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-4 mb-3 mt-1 flex items-center justify-between border-t border-[#edf0f2] pt-3">
        <span className="text-[13px] text-[#8b949c]">الإجمالي</span>
        <strong className="text-[18px] font-bold leading-none text-[#1c242b]" dir="ltr">
          {formatUsd(totalAmount)}
        </strong>
      </div>
    </aside>
  )
}

export default AnalyticsPanel
