import { formatAmount, settlementDiffAbs, settlementHasDiff, type MerchantSettlementRow } from '../../../data/merchantDetailsData'

type SettlementStatusBadgeProps = {
  row: MerchantSettlementRow
}

function SettlementStatusBadge({ row }: SettlementStatusBadgeProps) {
  const hasDiff = settlementHasDiff(row)
  if (!hasDiff) {
    return (
      <span className="sh-status is-settled inline-flex items-center gap-[5px] whitespace-nowrap rounded-full bg-[#eaf6e8] px-[9px] py-1 text-[10px] font-semibold text-[#3f9a37]">
        <i className="size-1.5 rounded-full bg-current" />مُسوّاة
      </span>
    )
  }

  return (
    <span className="sh-status is-diff inline-flex items-center gap-[5px] whitespace-nowrap rounded-full bg-[#fdebec] px-[9px] py-1 text-[10px] font-semibold text-danger">
      <i className="size-1.5 rounded-full bg-current" />فرق ${formatAmount(settlementDiffAbs(row), 2)}
    </span>
  )
}

export default SettlementStatusBadge
