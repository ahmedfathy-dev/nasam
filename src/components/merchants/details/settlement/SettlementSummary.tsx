import { cn } from '@/lib/cn'
import { formatAmount, type MerchantDetails } from '../../../../data/merchantDetailsData'
import { isoToDisplayDate, todayIso } from './settleFormTypes'

type SettlementSummaryProps = {
  details: MerchantDetails
}

function SettlementSummary({ details }: SettlementSummaryProps) {
  const { cycle, currency, commission, lastSettlementDate } = details
  const periodEnd = isoToDisplayDate(todayIso())
  const commissionLabel = commission.includes('%') ? commission : `${commission}`

  return (
    <section className="sa-summary-card rounded-lg border border-line bg-[#f7f8f9] p-3 min-[561px]:p-4 min-[1024px]:p-4" aria-label="ملخص المبلغ المراد تسويته">
      <h3 className="mb-3 text-xs font-bold text-green">ملخص المبلغ المراد تسويته</h3>
      <div className="sa-summary-rows grid gap-2.5">
        <div className="sa-summary-row flex min-h-[22px] flex-wrap items-start justify-between gap-1 gap-x-2.5 min-[561px]:items-center min-[561px]:gap-3">
          <span className="text-xs text-text-muted">الفترة التي تغطيها التسوية</span>
          <strong className="text-[13px] font-bold text-[#243039] text-end min-[561px]:text-end max-[560px]:max-w-full max-[560px]:[overflow-wrap:anywhere]" dir="ltr">{lastSettlementDate} – {periodEnd}</strong>
        </div>
        <div className="sa-summary-row flex min-h-[22px] flex-wrap items-start justify-between gap-1 gap-x-2.5 min-[561px]:items-center min-[561px]:gap-3">
          <span className="text-xs text-text-muted">عدد التحويلات المشمولة</span>
          <strong className="text-[13px] font-bold text-[#243039] text-end">{formatAmount(cycle.transfersCount)} تحويل</strong>
        </div>
        <div className="sa-summary-row flex min-h-[22px] flex-wrap items-start justify-between gap-1 gap-x-2.5 min-[561px]:items-center min-[561px]:gap-3">
          <span className="text-xs text-text-muted">إجمالي المبالغ المحصلة</span>
          <strong className="text-[13px] font-bold text-[#243039] text-end" dir="ltr">{formatAmount(cycle.collected)} {currency}</strong>
        </div>
        <div className="sa-summary-row flex min-h-[22px] flex-wrap items-start justify-between gap-1 gap-x-2.5 min-[561px]:items-center min-[561px]:gap-3">
          <span className="text-xs text-text-muted">إجمالي العمولات ({commissionLabel})</span>
          <strong className="is-minus text-[13px] font-bold text-danger text-end" dir="ltr">− {formatAmount(cycle.commissions)} {currency}</strong>
        </div>
        <div className="sa-summary-row is-net mt-1 flex min-h-[22px] flex-wrap items-start justify-between gap-1 gap-x-2.5 border-t border-dashed border-[#e2e6ea] pt-3 min-[561px]:items-center min-[561px]:gap-3">
          <span className="text-xs font-semibold text-[#4a535a]">صافي المبلغ المستحق</span>
          <strong className={cn('is-green text-[15px] font-bold text-green text-end')} dir="ltr">{formatAmount(cycle.netDueLocal)} {currency}</strong>
        </div>
      </div>
    </section>
  )
}

export default SettlementSummary
