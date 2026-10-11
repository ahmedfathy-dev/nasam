import { getMethodById } from '../../../data/merchantCatalog'
import { useAddMerchantForm } from './addMerchantFormContext'

function MerchantSummaryCard() {
  const { values, country } = useAddMerchantForm()
  const commission = values.commissionType === 'percent'
    ? `${values.commissionValue || '—'}% نسبة مئوية`
    : `${values.commissionValue || '—'} ${country?.currency ?? ''} قيمة ثابتة`

  const methodsLabel = (values.methods ?? [])
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
    <aside className="am-summary static order-2 grid gap-3.5 rounded-lg border border-line bg-surface p-4 min-[1024px]:sticky min-[1024px]:top-[76px] min-[1024px]:order-none">
      <header>
        <h2 className="text-sm font-bold text-[#303b46]">ملخص التاجر</h2>
        <p className="mt-[3px] text-[10px] text-text-muted">يتحدّث تلقائيًا أثناء إدخال البيانات</p>
      </header>

      <dl className="m-0 grid">
        {rows.map((row) => (
          <div key={row.label} className="flex min-h-[38px] items-center justify-between gap-3 border-b border-[#f0f2f4] text-[11px]">
            <dt className="text-text-muted">{row.label}</dt>
            <dd className="m-0 max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap text-end font-bold text-[#303b46]" title={row.value}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="am-notes rounded-md bg-[#f3faf1] p-3">
        <strong className="mb-2 block text-xs font-bold text-green">ملاحظات</strong>
        <ul className="m-0 grid gap-1.5 pe-0 ps-4 text-[11px] leading-[1.6] text-[#4a535a]">
          <li>يمكن إضافة أكثر من وسيلة استقبال للتاجر.</li>
          <li>يمكن إضافة أكثر من رقم أو حساب لنفس الوسيلة.</li>
          <li>تظهر فقط وسائل الدفع المفعلة في قائمة الاختيار.</li>
        </ul>
      </div>
    </aside>
  )
}

export default MerchantSummaryCard
