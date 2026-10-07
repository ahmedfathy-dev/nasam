import { getMethodById, type CatalogCountry } from '../../../data/merchantCatalog'
import type { AddMerchantFormValues } from './addMerchantTypes'

type MerchantSummaryCardProps = {
  values: AddMerchantFormValues
  country?: CatalogCountry
}

function MerchantSummaryCard({ values, country }: MerchantSummaryCardProps) {
  const commission = values.commissionType === 'percent'
    ? `${values.commissionValue || '—'}% نسبة مئوية`
    : `${values.commissionValue || '—'} ${country?.currency ?? ''} قيمة ثابتة`

  const methodsLabel = values.methods
    .map((block) => {
      const method = getMethodById(block.methodId)
      const count = block.accounts.filter((account) => account.trim()).length || block.accounts.length
      return method ? `${method.name} (${count})` : null
    })
    .filter(Boolean)
    .join(' · ') || '—'

  const rows = [
    { label: 'اسم التاجر', value: values.name.trim() || '—' },
    { label: 'الدولة والعملة', value: country ? `${country.name} · ${country.currency}` : '—' },
    { label: 'العمولة', value: commission },
    { label: 'وسائل الاستقبال', value: methodsLabel },
    {
      label: 'حساب الدخول',
      value: values.createAccount
        ? `${values.email.trim() || '—'} · مفعّل`
        : 'غير مفعّل',
    },
    { label: 'الحالة', value: values.status },
  ]

  return (
    <aside className="am-summary">
      <header>
        <h2>ملخص التاجر</h2>
        <p>يتحدّث تلقائيًا أثناء إدخال البيانات</p>
      </header>

      <dl>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>{row.label}</dt>
            <dd title={row.value}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="am-notes">
        <strong>ملاحظات</strong>
        <ul>
          <li>يمكن إضافة أكثر من وسيلة استقبال للتاجر.</li>
          <li>يمكن إضافة أكثر من رقم أو حساب لنفس الوسيلة.</li>
          <li>تظهر فقط وسائل الدفع المفعلة في قائمة الاختيار.</li>
        </ul>
      </div>
    </aside>
  )
}

export default MerchantSummaryCard
