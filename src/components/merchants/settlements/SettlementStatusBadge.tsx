import { formatAmount, settlementDiffAbs, settlementHasDiff, type MerchantSettlementRow } from '../../../data/merchantDetailsData'

type SettlementStatusBadgeProps = {
  row: MerchantSettlementRow
}

function SettlementStatusBadge({ row }: SettlementStatusBadgeProps) {
  const hasDiff = settlementHasDiff(row)
  if (!hasDiff) {
    return (
      <span className="sh-status is-settled">
        <i />مُسوّاة
      </span>
    )
  }

  return (
    <span className="sh-status is-diff">
      <i />فرق ${formatAmount(settlementDiffAbs(row), 2)}
    </span>
  )
}

export default SettlementStatusBadge
