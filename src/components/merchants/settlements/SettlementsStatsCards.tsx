import { AlertTriangle, ListOrdered, Send, Wallet } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  formatUsdFixed,
  settlementDiffAbs,
  settlementHasDiff,
  type MerchantSettlementRow,
} from '../../../data/merchantDetailsData'

type SettlementsStatsCardsProps = {
  settlements: MerchantSettlementRow[]
  loading?: boolean
  sinceDate?: string
  commissionLabel?: string
}

const skeleton = 'sh-skeleton mt-2 block h-2.5 w-[70%] rounded bg-[linear-gradient(90deg,#eef1f3_25%,#f7f8f9_50%,#eef1f3_75%)] bg-[length:200%_100%] animate-[sh-shimmer_1.1s_linear_infinite] first:mt-0'

function SettlementsStatsCards({ stats }: { stats: SettlementsStatsCardsProps }) {
  const {
    settlements: sourceSettlements,
    loading = false,
    sinceDate = '12/03/2026',
    commissionLabel = 'بعد خصم عمولة 2%',
  } = stats
  const settlements = sourceSettlements ?? []
  const totalNet = settlements.reduce((sum, row) => sum + row.netDue, 0)
  const totalTransferred = settlements.reduce((sum, row) => sum + row.transferredUsd, 0)
  const diffRows = settlements.filter(settlementHasDiff)
  const totalDiff = diffRows.reduce((sum, row) => sum + settlementDiffAbs(row), 0)
  const pct = totalNet > 0 ? ((totalTransferred / totalNet) * 100).toFixed(2) : '0.00'

  let diffCaption = 'لا توجد فروقات'
  if (diffRows.length === 1) diffCaption = 'في تسوية واحدة · تُرحَّل تلقائيًا إلى التسوية التالية'
  else if (diffRows.length === 2) diffCaption = 'في تسويتين · تُرحَّل تلقائيًا إلى التسوية التالية'
  else if (diffRows.length > 2) diffCaption = `في ${diffRows.length} تسويات · تُرحَّل تلقائيًا إلى التسوية التالية`

  if (loading) {
    return (
      <div className="sh-stats grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="sh-stat-card is-skeleton relative grid min-h-[112px] gap-2 rounded-lg border border-line bg-surface p-4" key={index}>
            <span className={cn(skeleton, 'sh-skeleton-icon size-9')} />
            <div>
              <span className={skeleton} />
              <strong className={skeleton} />
              <small className={skeleton} />
            </div>
          </article>
        ))}
      </div>
    )
  }

  const cards = [
    {
      label: 'عدد التسويات',
      value: String(settlements.length),
      caption: `منذ ${sinceDate}`,
      icon: ListOrdered,
      tone: 'green' as const,
      valueTone: 'dark' as const,
    },
    {
      label: 'إجمالي الصافي المستحق',
      value: formatUsdFixed(totalNet),
      caption: commissionLabel,
      icon: Wallet,
      tone: 'green' as const,
      valueTone: 'dark' as const,
    },
    {
      label: 'إجمالي المحوّل فعليًا',
      value: formatUsdFixed(totalTransferred),
      caption: `${pct}% من المستحق`,
      icon: Send,
      tone: 'green' as const,
      valueTone: 'green' as const,
    },
    {
      label: 'الفروقات',
      value: formatUsdFixed(totalDiff),
      caption: diffCaption,
      icon: AlertTriangle,
      tone: 'red' as const,
      valueTone: 'red' as const,
    },
  ]

  return (
    <div className="sh-stats grid grid-cols-1 gap-3 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article className="sh-stat-card relative grid min-h-[112px] gap-2 rounded-lg border border-line bg-surface p-4" key={card.label}>
            <span
              className={cn(
                'sh-stat-icon absolute end-4 top-4 grid size-9 place-items-center rounded-md',
                card.tone === 'green' ? 'tone-green bg-green-soft text-green' : 'tone-red bg-[#fdebec] text-danger',
              )}
              aria-hidden="true"
            >
              <Icon size={18} />
            </span>
            <div className="sh-stat-copy grid gap-1 pe-12">
              <span className="text-[11px] text-text-muted">{card.label}</span>
              <strong
                className={cn(
                  'text-[22px] font-bold leading-[1.2] text-[#243039] min-[640px]:text-2xl',
                  card.valueTone === 'green' && 'is-green text-green',
                  card.valueTone === 'red' && 'is-red text-danger',
                )}
                dir="ltr"
              >
                {card.value}
              </strong>
              <small className="text-[10px] leading-[1.5] text-[#95a0a7]">{card.caption}</small>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default SettlementsStatsCards
