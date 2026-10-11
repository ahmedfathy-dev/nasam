import { cn } from '@/lib/cn'
import { formatAmount, formatUsd, type MerchantDetails } from '../../../data/merchantDetailsData'

type MerchantInfoStripProps = {
  details: MerchantDetails
}

function MerchantInfoStrip({ details }: MerchantInfoStripProps) {
  const items = [
    { label: 'رقم الهاتف', value: details.phone, ltr: true },
    { label: 'البريد الإلكتروني', value: details.email, ltr: true },
    { label: 'تاريخ الإنشاء', value: details.createdAt, ltr: true },
    { label: 'إجمالي عدد التسويات', value: formatAmount(details.settlementsCount) },
    { label: 'إجمالي قيمة التسويات', value: `${formatAmount(details.settlementsTotal)} ${details.currency}`, ltr: true },
    { label: 'صافي بالدولار (سعر اليوم)', value: formatUsd(details.netUsdToday), accent: true, ltr: true },
  ]

  return (
    <section
      className={cn(
        'md-info-strip flex w-full min-w-0 max-w-full items-stretch overflow-x-auto overflow-y-hidden',
        'rounded-[7px] border border-line bg-surface overscroll-x-contain',
        'min-[640px]:grid min-[640px]:grid-cols-6 min-[640px]:overflow-x-hidden',
        'min-[901px]:overflow-x-auto',
        'min-[1024px]:overflow-x-auto',
      )}
      aria-label="معلومات التاجر"
    >
      {items.map((item, index) => (
        <div
          className={cn(
            'md-info-cell grid w-[min(148px,72vw)] min-w-0 flex-[0_0_min(148px,72vw)] gap-1 snap-start border-s border-[#edf0f2] px-3 py-2.5',
            'min-[640px]:w-auto min-[640px]:flex-none min-[640px]:px-1.5 min-[640px]:py-2.5',
            'min-[901px]:px-2',
            'min-[1024px]:px-3.5 min-[1024px]:py-3',
            index === 0 && 'border-s-0',
          )}
          key={item.label}
        >
          <span className="text-[9px] leading-[1.35] text-text-muted min-[640px]:text-[7.5px] min-[901px]:text-[8px] min-[1024px]:text-[9px]">{item.label}</span>
          <strong
            className={cn(
              'overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-bold text-[#2f383f]',
              'min-[640px]:text-[9.5px] min-[901px]:text-[10px] min-[1024px]:text-[11px]',
              item.accent && 'is-green text-green',
            )}
            dir={item.ltr ? 'ltr' : undefined}
            title={item.value}
          >
            {item.value}
          </strong>
        </div>
      ))}
    </section>
  )
}

export default MerchantInfoStrip
