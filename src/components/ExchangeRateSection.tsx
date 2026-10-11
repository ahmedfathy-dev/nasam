import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/cn'
import { exchangeRates } from '../data/dashboardData'

function ExchangeRateSection() {
  const [clock, setClock] = useState(() => formatLiveClock())
  const rates = useMemo(() => exchangeRates, [])

  function refresh() {
    setClock(formatLiveClock())
  }

  return (
    <section
      className={cn(
        'mb-[18px] overflow-hidden rounded-[14px] border border-line bg-surface p-[12px]',
        'shadow-[0_1px_2px_rgb(31_39_48_/_4%)]',
        'min-[561px]:p-[14px]',
      )}
      aria-labelledby="exchange-title"
    >
      <div
        className={cn(
          'mb-[12px] flex min-w-0 flex-wrap items-start justify-between gap-[10px]',
          'min-[721px]:flex-nowrap',
        )}
      >
        <div className="flex min-w-0 flex-auto items-start gap-[8px]">
          <div className="min-w-0">
            <h2
              id="exchange-title"
              className="text-[13px] font-bold leading-[1.35] text-[#1f2730] min-[721px]:text-[14px]"
            >
              أسعار الصرف مقابل الدولار
            </h2>
            <p
              className={cn(
                'mt-[3px] overflow-hidden text-[11px] leading-[1.5] text-text-muted',
                'line-clamp-2',
              )}
            >
              تُحدَّث تلقائيًا ولحظيًا عبر API لكل عملات الدول التي تدعمها مؤسسة نسام
            </p>
          </div>
          <button
            type="button"
            className={cn(
              'mt-px grid size-[30px] flex-none place-items-center rounded-full border-0',
              'cursor-pointer bg-green-soft text-green',
              'hover:bg-[#e2f4df]',
            )}
            aria-label="تحديث أسعار الصرف"
            onClick={refresh}
          >
            <RefreshCw size={15} />
          </button>
        </div>

        <div
          className={cn(
            'flex w-full min-w-0 flex-wrap items-center justify-start gap-[6px] pt-px',
            'min-[721px]:w-auto min-[721px]:flex-[0_1_auto] min-[721px]:justify-end',
            'min-[901px]:flex-nowrap min-[901px]:justify-start',
          )}
        >
          <span
            className={cn(
              'inline-flex max-w-full items-center gap-[6px] overflow-hidden text-ellipsis',
              'whitespace-nowrap rounded-full bg-green-soft px-[8px] text-[10px] font-semibold text-green',
              'min-h-[28px] min-[901px]:px-[10px] min-[901px]:text-[11px]',
            )}
          >
            <i
              aria-hidden="true"
              className={cn(
                'size-[6px] flex-none rounded-full bg-current',
                'shadow-[0_0_0_3px_rgb(57_174_57_/_16%)]',
              )}
            />
            مباشر · آخر تحديث {clock}
          </span>
          <button
            type="button"
            className={cn(
              'inline-flex min-h-[28px] flex-none cursor-pointer items-center gap-px whitespace-nowrap',
              'rounded-full border-0 bg-transparent px-[8px] font-[inherit] text-[11px] font-semibold text-[#5a636c]',
              'hover:bg-[#f3f5f7] hover:text-[#2f383f]',
            )}
          >
            كل الأسعار
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          'grid min-w-0 grid-cols-4 gap-[6px]',
          'min-[561px]:grid-cols-2 min-[561px]:gap-[5px]',
          'min-[721px]:grid-cols-7 min-[721px]:gap-[6px]',
        )}
        role="list"
      >
        {rates.map(({ code, country, rate, change, trend }) => (
          <article
            className={cn(
              'flex min-w-0 flex-col justify-center gap-[5px]',
              'rounded-[10px] border border-[#eef1f3] bg-[#f7f8f9] px-[4px] py-[7px]',
              'min-[1100px]:gap-[6px] min-[1100px]:px-[8px] min-[1100px]:py-[9px]',
            )}
            role="listitem"
            key={code}
          >
            <div className="flex min-w-0 items-baseline gap-[3px]">
              <strong className="flex-none text-[10px] font-bold text-[#243039]" dir="ltr">
                {code}
              </strong>
              <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-text-muted">
                {country}
              </span>
            </div>
            <div className="flex min-w-0 flex-row items-center justify-between gap-[2px]">
              <strong
                className={cn(
                  'shrink-0 whitespace-nowrap',
                  'text-[12px] font-bold leading-none tracking-[-0.02em] text-[#1f2730]',
                  'min-[1100px]:text-[16px]',
                )}
                dir="ltr"
              >
                {rate}
              </strong>
              <span
                className={cn(
                  'inline-flex min-h-[14px] flex-none items-center gap-px whitespace-nowrap',
                  'rounded-full px-[3px] text-[7px] font-bold leading-none',
                  'min-[721px]:min-h-[16px] min-[721px]:px-[4px] min-[721px]:text-[8px]',
                  '[&_svg]:size-[8px] [&_svg]:flex-none',
                  trend === 'up' && 'bg-green-soft text-green',
                  trend === 'down' && 'bg-danger-soft text-danger',
                  trend === 'steady' && 'bg-[#eef0f2] text-[#8b949b]',
                )}
                dir="ltr"
              >
                {change}
                {trend === 'up' ? <ArrowUp size={10} strokeWidth={2.75} aria-hidden="true" /> : null}
                {trend === 'down' ? <ArrowDown size={10} strokeWidth={2.75} aria-hidden="true" /> : null}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatLiveClock(date = new Date()) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default ExchangeRateSection
