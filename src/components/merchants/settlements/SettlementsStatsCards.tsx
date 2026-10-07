import { AlertTriangle, ListOrdered, Send, Wallet } from 'lucide-react'
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

function SettlementsStatsCards({
  settlements,
  loading,
  sinceDate = '12/03/2026',
  commissionLabel = 'بعد خصم عمولة 2%',
}: SettlementsStatsCardsProps) {
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
      <div className="sh-stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <article className="sh-stat-card is-skeleton" key={index}>
            <span className="sh-skeleton sh-skeleton-icon" />
            <div>
              <span className="sh-skeleton" />
              <strong className="sh-skeleton" />
              <small className="sh-skeleton" />
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
    <div className="sh-stats">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <article className="sh-stat-card" key={card.label}>
            <span className={`sh-stat-icon tone-${card.tone}`} aria-hidden="true">
              <Icon size={18} />
            </span>
            <div className="sh-stat-copy">
              <span>{card.label}</span>
              <strong className={`is-${card.valueTone}`} dir="ltr">{card.value}</strong>
              <small>{card.caption}</small>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default SettlementsStatsCards
