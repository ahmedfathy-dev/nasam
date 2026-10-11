import { cn } from '@/lib/cn'
import { formatAmount, formatUsd, type MerchantDetails } from '../../../data/merchantDetailsData'

type AccountSummaryCardsProps = {
  details: MerchantDetails
}

function AccountSummaryCards({ details }: AccountSummaryCardsProps) {
  const { cycle, currency, commission, lastSettlementId, lastSettlementDate } = details

  const cards = [
    { label: 'إجمالي التحويلات الحالية', value: formatAmount(cycle.transfersCount), small: 'تحويل منذ آخر تسوية' },
    { label: 'إجمالي المبلغ المحصل', value: formatAmount(cycle.collected), small: `بالعملة المحلية ${currency}`, ltr: true },
    { label: 'إجمالي العمولات', value: formatAmount(cycle.commissions), small: `من المحصل · ${commission} ${currency}`, ltr: true },
    {
      label: 'صافي المبلغ المستحق',
      value: formatAmount(cycle.netDue),
      small: `${formatAmount(cycle.netDueLocal)} ${currency} ≈ ${formatUsd(cycle.netDueUsd)}`,
      highlight: true,
      green: true,
      ltr: true,
      smallLtr: true,
    },
  ]

  return (
    <section className="md-section grid min-w-0 max-w-full gap-2.5">
      <div className="md-section-head flex flex-col items-stretch gap-2 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:justify-between min-[1024px]:flex-nowrap">
        <div>
          <h2 className="text-[13px] font-bold text-[#303b46]">ملخص الحساب — الدورة الحالية</h2>
          <p className="mt-0.5 text-[10px] text-text-muted">منذ آخر تسوية بتاريخ {lastSettlementId} · {lastSettlementDate}</p>
        </div>
      </div>
      <div
        className={cn(
          'md-summary-grid flex gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain snap-x snap-mandatory pb-0.5',
          'min-[640px]:grid min-[640px]:grid-cols-2 min-[640px]:overflow-visible',
          'min-[901px]:grid-cols-4 min-[901px]:gap-2',
          'min-[1024px]:gap-2.5',
        )}
      >
        {cards.map((card) => (
          <article
            key={card.label}
            className={cn(
              'md-summary-card grid min-h-[84px] w-[min(200px,78vw)] min-w-0 flex-[0_0_min(200px,78vw)] content-center gap-1 snap-start rounded-[7px] border border-line bg-surface px-3 py-[11px]',
              'min-[640px]:w-auto min-[640px]:flex-none min-[640px]:min-h-[88px] min-[640px]:p-2.5',
              'min-[901px]:min-h-[84px] min-[1024px]:min-h-[92px] min-[1024px]:px-3.5 min-[1024px]:py-3',
              card.highlight && 'is-highlight border-[#c8e0c2] bg-[#f3faf1]',
            )}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-text-muted min-[640px]:whitespace-normal min-[901px]:text-[8px] min-[1024px]:text-[9px]">{card.label}</span>
            <strong
              className={cn(
                'overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-bold leading-[1.2] text-[#243039]',
                'min-[640px]:text-xl min-[901px]:text-[17px] min-[1024px]:text-[22px]',
                card.green && 'is-green text-green',
              )}
              dir={card.ltr ? 'ltr' : undefined}
            >
              {card.value}
            </strong>
            <small className="overflow-hidden text-ellipsis whitespace-nowrap text-[8px] text-[#959ca3] min-[640px]:whitespace-normal min-[1024px]:text-[9px]" dir={card.smallLtr ? 'ltr' : undefined}>{card.small}</small>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AccountSummaryCards
