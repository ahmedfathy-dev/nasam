import type { CommissionType } from '../../../data/merchantsData'
import SegmentedControl from './SegmentedControl'
import type { AddMerchantFieldErrors, AddMerchantFormValues } from './addMerchantTypes'

type CommissionSectionProps = {
  values: AddMerchantFormValues
  errors: AddMerchantFieldErrors
  currency: string
  disabled?: boolean
  onChange: <K extends keyof AddMerchantFormValues>(key: K, value: AddMerchantFormValues[K]) => void
}

function CommissionSection({ values, errors, currency, disabled, onChange }: CommissionSectionProps) {
  const amount = Number(values.commissionValue) || 0
  const sample = 10000
  const commission = values.commissionType === 'percent'
    ? Math.round((sample * amount) / 100)
    : amount
  const net = Math.max(0, sample - commission)
  const fmt = (value: number) => value.toLocaleString('en-US')

  return (
    <section className="am-section">
      <header className="am-section-head">
        <span className="am-step">2</span>
        <h2>إعداد العمولة</h2>
      </header>

      <div className="am-grid-2">
        <div className="am-field">
          <span>نوع العمولة</span>
          <SegmentedControl
            ariaLabel="نوع العمولة"
            value={values.commissionType}
            disabled={disabled}
            onChange={(value) => onChange('commissionType', value as CommissionType)}
            options={[
              { label: 'نسبة مئوية %', value: 'percent' },
              { label: 'قيمة ثابتة', value: 'fixed' },
            ]}
          />
        </div>

        <label className="am-field">
          <span>قيمة العمولة <b>*</b></span>
          <div className="am-suffix-input">
            <input
              type="number"
              min="0"
              step="0.1"
              value={values.commissionValue}
              disabled={disabled}
              aria-invalid={Boolean(errors.commissionValue)}
              onChange={(event) => onChange('commissionValue', event.target.value)}
            />
            <span>{values.commissionType === 'percent' ? '%' : currency}</span>
          </div>
          {errors.commissionValue && <small className="am-error">{errors.commissionValue}</small>}
        </label>
      </div>

      <div className="am-example" dir="rtl">
        مثال: حوالة {currency} {fmt(sample)} · عمولة {currency} {fmt(commission)} · صافي {currency} {fmt(net)}
      </div>
    </section>
  )
}

export default CommissionSection
