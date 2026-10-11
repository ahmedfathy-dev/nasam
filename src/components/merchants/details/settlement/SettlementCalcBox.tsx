import { cn } from '@/lib/cn'
import { formatAmount, formatUsd } from '../../../../data/merchantDetailsData'

type SettlementCalcBoxProps = {
  expectedUsd: number
  actualUsd: number
  difference: number
}

function SettlementCalcBox({ expectedUsd, actualUsd, difference }: SettlementCalcBoxProps) {
  const diffTone = Math.abs(difference) < 0.005 ? 'zero' : 'diff'
  const signed = `${difference > 0 ? '+' : difference < 0 ? '−' : ''}$${formatAmount(Math.abs(difference), 2)}`

  return (
    <section className="sa-calc grid gap-2.5 rounded-lg border border-line bg-[#f7f8f9] px-4 py-3.5" aria-label="حساب الفرق">
      <div className="sa-calc-row flex flex-wrap items-start justify-between gap-1 gap-x-2.5 text-xs min-[561px]:items-center">
        <span className="text-text-muted">المبلغ المتوقع بالدولار</span>
        <strong className="font-bold text-text text-end max-[560px]:max-w-full max-[560px]:[overflow-wrap:anywhere]" dir="ltr">{formatUsd(expectedUsd)}</strong>
      </div>
      <div className="sa-calc-row flex flex-wrap items-start justify-between gap-1 gap-x-2.5 text-xs min-[561px]:items-center">
        <span className="text-text-muted">المبلغ المحوّل فعلياً</span>
        <strong className="font-bold text-text text-end max-[560px]:max-w-full max-[560px]:[overflow-wrap:anywhere]" dir="ltr">{formatUsd(Number.isFinite(actualUsd) ? actualUsd : 0)}</strong>
      </div>
      <div className="sa-calc-row flex flex-wrap items-start justify-between gap-1 gap-x-2.5 text-xs min-[561px]:items-center">
        <span className="text-text-muted">الفرق</span>
        <span
          className={cn(
            'sa-diff-pill inline-flex items-center rounded-full px-[9px] py-1 text-xs font-bold',
            diffTone === 'zero' ? 'is-zero bg-[#eaf6e8] text-green' : 'is-diff bg-[#fdebec] text-danger',
          )}
          dir="ltr"
        >
          {signed}
        </span>
      </div>
    </section>
  )
}

export default SettlementCalcBox
