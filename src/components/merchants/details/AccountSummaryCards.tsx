import { formatAmount, formatUsd, type MerchantDetails } from '../../../data/merchantDetailsData'

type AccountSummaryCardsProps = {
  details: MerchantDetails
}

function AccountSummaryCards({ details }: AccountSummaryCardsProps) {
  const { cycle, currency, commission, lastSettlementId, lastSettlementDate } = details

  return (
    <section className="md-section">
      <div className="md-section-head">
        <div>
          <h2>ملخص الحساب — الدورة الحالية</h2>
          <p>منذ آخر تسوية بتاريخ {lastSettlementId} · {lastSettlementDate}</p>
        </div>
      </div>
      <div className="md-summary-grid">
        <article className="md-summary-card">
          <span>إجمالي التحويلات الحالية</span>
          <strong>{formatAmount(cycle.transfersCount)}</strong>
          <small>تحويل منذ آخر تسوية</small>
        </article>
        <article className="md-summary-card">
          <span>إجمالي المبلغ المحصل</span>
          <strong dir="ltr">{formatAmount(cycle.collected)}</strong>
          <small>بالعملة المحلية {currency}</small>
        </article>
        <article className="md-summary-card">
          <span>إجمالي العمولات</span>
          <strong dir="ltr">{formatAmount(cycle.commissions)}</strong>
          <small>من المحصل · {commission} {currency}</small>
        </article>
        <article className="md-summary-card is-highlight">
          <span>صافي المبلغ المستحق</span>
          <strong className="is-green" dir="ltr">{formatAmount(cycle.netDue)}</strong>
          <small dir="ltr">{formatAmount(cycle.netDueLocal)} {currency} ≈ {formatUsd(cycle.netDueUsd)}</small>
        </article>
      </div>
    </section>
  )
}

export default AccountSummaryCards
