import { ArrowLeftRight, CircleDollarSign, Diff, Hash } from 'lucide-react'
import { formatAmount, formatUsd, type MerchantSettlementRow } from '../../../data/merchantDetailsData'

type SettlementsStatsProps = {
  settlements: MerchantSettlementRow[]
}

function SettlementsStats({ settlements }: SettlementsStatsProps) {
  const totalNet = settlements.reduce((sum, item) => sum + item.netDue, 0)
  const totalTransferred = settlements.reduce((sum, item) => sum + item.transferredUsd, 0)
  const totalDiff = settlements.reduce((sum, item) => sum + item.difference, 0)

  const cards = [
    { label: 'عدد التسويات', value: formatAmount(settlements.length), icon: Hash, tone: 'green' },
    { label: 'إجمالي الصافي المستحق', value: formatUsd(totalNet), icon: CircleDollarSign, tone: 'amber' },
    { label: 'إجمالي المحوّل فعلياً', value: formatUsd(totalTransferred), icon: ArrowLeftRight, tone: 'green' },
    { label: 'الفروقات', value: formatUsd(Math.abs(totalDiff)), caption: totalDiff >= 0 ? 'فائض طفيف' : 'عجز طفيف', icon: Diff, tone: 'red' },
  ] as const

  return (
    <div className="md-settle-stats">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article className="md-settle-stat" key={card.label}>
            <span className={`md-settle-icon tone-${card.tone}`}><Icon size={14} /></span>
            <div>
              <span>{card.label}</span>
              <strong dir="ltr">{card.value}</strong>
              {'caption' in card && card.caption ? <small>{card.caption}</small> : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default SettlementsStats
