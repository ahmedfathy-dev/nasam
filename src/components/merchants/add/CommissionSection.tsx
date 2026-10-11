import type { CommissionType } from '../../../data/merchantsData'
import { useAddMerchantForm } from './addMerchantFormContext'
import SegmentedControl from './SegmentedControl'
import {
  amControlInput,
  amControlShell,
  amError,
  amField,
  amGrid2,
  amSection,
  amSectionHead,
  amStep,
} from '../merchantTw'

function CommissionSection() {
  const { values, errors, currency, disabled, onChange } = useAddMerchantForm()
  const amount = Number(values.commissionValue) || 0
  const sample = 10000
  const commission = values.commissionType === 'percent'
    ? Math.round((sample * amount) / 100)
    : amount
  const net = Math.max(0, sample - commission)
  const fmt = (value: number) => value.toLocaleString('en-US')

  return (
    <section className={amSection}>
      <header className={amSectionHead}>
        <span className={amStep}>2</span>
        <h2 className="text-sm font-bold text-[#303b46]">إعداد العمولة</h2>
      </header>

      <div className={amGrid2}>
        <div className={amField}>
          <span className="min-h-[18px] leading-[1.35]">نوع العمولة</span>
          <SegmentedControl
            control={{
              ariaLabel: 'نوع العمولة',
              value: values.commissionType,
              disabled,
              onChange: (value) => onChange('commissionType', value as CommissionType),
              options: [
                { label: 'نسبة مئوية %', value: 'percent' },
                { label: 'قيمة ثابتة', value: 'fixed' },
              ],
            }}
          />
        </div>

        <label className={amField}>
          <span className="min-h-[18px] leading-[1.35]">قيمة العمولة <b className="font-semibold text-danger">*</b></span>
          <div className={`am-suffix-input ${amControlShell}`}>
            <input
              className={amControlInput}
              type="number"
              min="0"
              step="0.1"
              value={values.commissionValue}
              disabled={disabled}
              aria-invalid={Boolean(errors.commissionValue)}
              onChange={(event) => onChange('commissionValue', event.target.value)}
            />
            <span className="whitespace-nowrap text-xs font-semibold text-[#7d868e]">
              {values.commissionType === 'percent' ? '%' : currency}
            </span>
          </div>
          {errors.commissionValue && <small className={amError}>{errors.commissionValue}</small>}
        </label>
      </div>

      <div className="am-example rounded-sm bg-[#f3f5f6] px-3 py-2.5 text-[11px] leading-[1.6] text-[#6d767e]" dir="rtl">
        مثال: حوالة {currency} {fmt(sample)} · عمولة {currency} {fmt(commission)} · صافي {currency} {fmt(net)}
      </div>
    </section>
  )
}

export default CommissionSection
