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
    <section className="md-info-strip" aria-label="معلومات التاجر">
      {items.map((item) => (
        <div className="md-info-cell" key={item.label}>
          <span>{item.label}</span>
          <strong className={item.accent ? 'is-green' : undefined} dir={item.ltr ? 'ltr' : undefined} title={item.value}>{item.value}</strong>
        </div>
      ))}
    </section>
  )
}

export default MerchantInfoStrip
