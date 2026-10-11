import { ArrowLeftRight, CircleDollarSign, Diff, Hash } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatAmount, formatUsd, type MerchantSettlementRow } from '../../../data/merchantDetailsData'

type SettlementsStatsProps = {
  settlements: MerchantSettlementRow[]
}

function SettlementsStats({ settlements }: SettlementsStatsProps) {
  const totalNet = settlements.reduce((sum, item) => sum + item.netDue, 0)
  const totalTransferred = settlements.reduce((sum, item) => sum + item.transferredUsd, 0)
  const totalDiff = settlements.reduce((sum, item) => sum + item.difference, 0)

  const cards = [
    { label: 'عدد التسويات', value: formatAmount(settlements.length), icon: Hash, tone: 'green' as const },
    { label: 'إجمالي الصافي المستحق', value: formatUsd(totalNet), icon: CircleDollarSign, tone: 'amber' as const },
    { label: 'إجمالي المحوّل فعلياً', value: formatUsd(totalTransferred), icon: ArrowLeftRight, tone: 'green' as const },
    { label: 'الفروقات', value: formatUsd(Math.abs(totalDiff)), caption: totalDiff >= 0 ? 'فائض طفيف' : 'عجز طفيف', icon: Diff, tone: 'red' as const },
  ]

  const toneClass = {
    green: 'tone-green bg-green-soft text-green',
    amber: 'tone-amber bg-[#fff5e4] text-orange',
    red: 'tone-red bg-[#fdebec] text-danger',
  }

  return (
    <div className="md-settle-stats my-2.5 mb-3 grid grid-cols-1 gap-2 min-[640px]:grid-cols-2 min-[640px]:gap-[9px] min-[1024px]:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article className="md-settle-stat flex min-h-16 items-center gap-2.5 rounded-[7px] border border-line bg-surface px-[11px] py-[9px] min-[640px]:min-h-[70px] min-[640px]:px-3 min-[640px]:py-2.5" key={card.label}>
            <span className={cn('md-settle-icon grid size-[30px] flex-none place-items-center rounded-full', toneClass[card.tone])}><Icon size={14} /></span>
            <div className="grid min-w-0 gap-0.5">
              <span className="text-[9px] text-text-muted">{card.label}</span>
              <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-bold text-[#303b46] min-[640px]:text-[13px]" dir="ltr">{card.value}</strong>
              {'caption' in card && card.caption ? <small className="text-[8px] text-[#95a0a7]">{card.caption}</small> : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default SettlementsStats
