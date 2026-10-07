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
    <section className="sa-calc" aria-label="حساب الفرق">
      <div className="sa-calc-row">
        <span>المبلغ المتوقع بالدولار</span>
        <strong dir="ltr">{formatUsd(expectedUsd)}</strong>
      </div>
      <div className="sa-calc-row">
        <span>المبلغ المحوّل فعلياً</span>
        <strong dir="ltr">{formatUsd(Number.isFinite(actualUsd) ? actualUsd : 0)}</strong>
      </div>
      <div className="sa-calc-row">
        <span>الفرق</span>
        <span className={`sa-diff-pill is-${diffTone}`} dir="ltr">{signed}</span>
      </div>
    </section>
  )
}

export default SettlementCalcBox
