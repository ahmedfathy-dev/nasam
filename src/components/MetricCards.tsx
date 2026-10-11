import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/cn'
import { metrics } from '../data/dashboardData'

function MetricCards() {
  return (
    <section
      className={cn(
        'mb-4 grid grid-cols-2 gap-2.5',
        'min-[721px]:grid-cols-3 min-[721px]:gap-3',
      )}
      aria-label="ملخص المؤشرات"
    >
      {metrics.map(({ label, value, change, note, icon: Icon }) => (
        <article
          className={cn(
            'flex min-w-0 items-center gap-3 rounded-xl border border-[#e9ecef] bg-surface px-3.5 py-3.5',
            'shadow-[0_2px_5px_rgb(30_45_58_/_2%)]',
          )}
          key={label}
        >
          <div className="min-w-0 flex-1 text-start">
            <div className="text-[12px] leading-[1.35] text-[#8b949c]">{label}</div>
            <div className="mt-2 text-end font-sans text-[26px] font-bold leading-none text-[#1c242b]" dir="ltr">
              {value}
            </div>
            <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-[11px]">
              {change ? (
                <span className="inline-flex items-center gap-0.5 font-semibold text-[#3dcf5a]">
                  <ArrowUp size={12} strokeWidth={2.4} />
                  {change}
                </span>
              ) : null}
              <span className="text-[#9aa3ab]">{note}</span>
            </div>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#eef8ea] text-[#3dcf5a]">
            <Icon size={18} strokeWidth={2} />
          </span>
        </article>
      ))}
    </section>
  )
}

export default MetricCards
