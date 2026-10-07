import type { SettleFormErrors, SettleFormValues } from './settleFormTypes'

type SettlementFormProps = {
  values: SettleFormValues
  errors: SettleFormErrors
  currency: string
  todayRate: number
  disabled: boolean
  onChange: <Key extends keyof SettleFormValues>(key: Key, value: SettleFormValues[Key]) => void
}

function SettlementForm({ values, errors, currency, todayRate, disabled, onChange }: SettlementFormProps) {
  return (
    <div className="sa-form">
      <label className="sa-field" htmlFor="sa-rate">
        <span>سعر الصرف ({currency} → USD)</span>
        <input
          id="sa-rate"
          type="number"
          min="0"
          step="0.01"
          dir="ltr"
          value={values.exchangeRate}
          disabled={disabled}
          aria-invalid={Boolean(errors.exchangeRate)}
          onChange={(event) => onChange('exchangeRate', event.target.value)}
        />
        <em className="sa-hint">سعر اليوم: {todayRate.toFixed(2)}</em>
        {errors.exchangeRate && <small className="sa-error">{errors.exchangeRate}</small>}
      </label>

      <label className="sa-field" htmlFor="sa-amount">
        <span>المبلغ المحوّل فعلياً (USD)</span>
        <div className="sa-input-prefix">
          <span>$</span>
          <input
            id="sa-amount"
            type="number"
            min="0"
            step="0.01"
            dir="ltr"
            value={values.transferredUsd}
            disabled={disabled}
            aria-invalid={Boolean(errors.transferredUsd)}
            onChange={(event) => onChange('transferredUsd', event.target.value)}
          />
        </div>
        <em className="sa-hint sa-hint-spacer" aria-hidden="true">&nbsp;</em>
        {errors.transferredUsd && <small className="sa-error">{errors.transferredUsd}</small>}
      </label>

      <label className="sa-field" htmlFor="sa-ref">
        <span>الرقم المرجعي للتحويل</span>
        <input
          id="sa-ref"
          type="text"
          dir="ltr"
          placeholder="FT-77812"
          value={values.reference}
          disabled={disabled}
          aria-invalid={Boolean(errors.reference)}
          onChange={(event) => onChange('reference', event.target.value)}
        />
        <em className="sa-hint sa-hint-spacer" aria-hidden="true">&nbsp;</em>
        {errors.reference && <small className="sa-error">{errors.reference}</small>}
      </label>

      <label className="sa-field" htmlFor="sa-date">
        <span>تاريخ التسوية</span>
        <input
          id="sa-date"
          type="date"
          value={values.settlementDateIso}
          disabled={disabled}
          aria-invalid={Boolean(errors.settlementDateIso)}
          onChange={(event) => onChange('settlementDateIso', event.target.value)}
        />
        <em className="sa-hint sa-hint-spacer" aria-hidden="true">&nbsp;</em>
        {errors.settlementDateIso && <small className="sa-error">{errors.settlementDateIso}</small>}
      </label>

      <label className="sa-field sa-field-full" htmlFor="sa-notes">
        <span>ملاحظات</span>
        <textarea
          id="sa-notes"
          rows={3}
          value={values.notes}
          disabled={disabled}
          placeholder="ملاحظات اختيارية حول التسوية"
          onChange={(event) => onChange('notes', event.target.value)}
        />
      </label>
    </div>
  )
}

export default SettlementForm
