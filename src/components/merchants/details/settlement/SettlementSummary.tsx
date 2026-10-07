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
    <section className="sa-summary-card" aria-label="ملخص المبلغ المراد تسويته">
      <h3>ملخص المبلغ المراد تسويته</h3>
      <div className="sa-summary-rows">
        <div className="sa-summary-row">
          <span>الفترة التي تغطيها التسوية</span>
          <strong dir="ltr">{lastSettlementDate} – {periodEnd}</strong>
        </div>
        <div className="sa-summary-row">
          <span>عدد التحويلات المشمولة</span>
          <strong>{formatAmount(cycle.transfersCount)} تحويل</strong>
        </div>
        <div className="sa-summary-row">
          <span>إجمالي المبالغ المحصلة</span>
          <strong dir="ltr">{formatAmount(cycle.collected)} {currency}</strong>
        </div>
        <div className="sa-summary-row">
          <span>إجمالي العمولات ({commissionLabel})</span>
          <strong className="is-minus" dir="ltr">− {formatAmount(cycle.commissions)} {currency}</strong>
        </div>
        <div className="sa-summary-row is-net">
          <span>صافي المبلغ المستحق</span>
          <strong className="is-green" dir="ltr">{formatAmount(cycle.netDueLocal)} {currency}</strong>
        </div>
      </div>
    </section>
  )
}

export default SettlementSummary
