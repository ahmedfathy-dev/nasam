import { cn } from '@/lib/cn'
import type { SettleFormErrors, SettleFormValues } from './settleFormTypes'

type SettlementFormProps = {
  values: SettleFormValues
  errors: SettleFormErrors
  currency: string
  todayRate: number
  disabled: boolean
  onChange: <Key extends keyof SettleFormValues>(key: Key, value: SettleFormValues[Key]) => void
}

const saField = cn(
  'sa-field grid min-w-0 grid-rows-[auto_auto_auto] content-start gap-1.5 text-xs text-[#5a636a]',
  'min-[561px]:grid-rows-[auto_40px_auto]',
)

const saInput = cn(
  'box-border h-10 w-full min-w-0 rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] px-3',
  'text-base text-[#454e55] outline-0',
  'focus:border-blue focus:bg-white focus:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
  'min-[561px]:text-[13px]',
)

const saHint = 'sa-hint min-h-4 text-[11px] not-italic leading-[1.45] text-text-muted'
const saError = 'sa-error text-xs text-danger'

function SettlementForm({ form }: { form: SettlementFormProps }) {
  const { values, errors, currency, todayRate, disabled, onChange } = form
  return (
    <div className="sa-form grid w-full min-w-0 grid-cols-1 items-start gap-3.5 min-[561px]:grid-cols-2 min-[561px]:gap-3 min-[1024px]:gap-x-3.5 min-[1024px]:gap-y-3">
      <label className={saField} htmlFor="sa-rate">
        <span className="min-h-[18px] leading-[1.35]">سعر الصرف ({currency} → USD)</span>
        <input
          className={saInput}
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
        <em className={saHint}>سعر اليوم: {todayRate.toFixed(2)}</em>
        {errors.exchangeRate && <small className={saError}>{errors.exchangeRate}</small>}
      </label>

      <label className={saField} htmlFor="sa-amount">
        <span className="min-h-[18px] leading-[1.35]">المبلغ المحوّل فعلياً (USD)</span>
        <div className={cn('sa-input-prefix flex h-10 min-w-0 items-center gap-1 rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] px-2.5 [direction:ltr]', 'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]')}>
          <span className="whitespace-nowrap font-semibold text-text-muted">$</span>
          <input
            className="h-full w-0 min-w-0 flex-1 border-0 bg-transparent text-base text-inherit outline-0 min-[561px]:text-[13px]"
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
        <em className={`${saHint} sa-hint-spacer invisible select-none`} aria-hidden="true">&nbsp;</em>
        {errors.transferredUsd && <small className={saError}>{errors.transferredUsd}</small>}
      </label>

      <label className={saField} htmlFor="sa-ref">
        <span className="min-h-[18px] leading-[1.35]">الرقم المرجعي للتحويل</span>
        <input
          className={saInput}
          id="sa-ref"
          type="text"
          dir="ltr"
          placeholder="FT-77812"
          value={values.reference}
          disabled={disabled}
          aria-invalid={Boolean(errors.reference)}
          onChange={(event) => onChange('reference', event.target.value)}
        />
        <em className={`${saHint} sa-hint-spacer invisible select-none`} aria-hidden="true">&nbsp;</em>
        {errors.reference && <small className={saError}>{errors.reference}</small>}
      </label>

      <label className={saField} htmlFor="sa-date">
        <span className="min-h-[18px] leading-[1.35]">تاريخ التسوية</span>
        <input
          className={saInput}
          id="sa-date"
          type="date"
          value={values.settlementDateIso}
          disabled={disabled}
          aria-invalid={Boolean(errors.settlementDateIso)}
          onChange={(event) => onChange('settlementDateIso', event.target.value)}
        />
        <em className={`${saHint} sa-hint-spacer invisible select-none`} aria-hidden="true">&nbsp;</em>
        {errors.settlementDateIso && <small className={saError}>{errors.settlementDateIso}</small>}
      </label>

      <label className={cn(saField, 'sa-field-full col-span-full min-[561px]:grid-rows-[auto_auto]')} htmlFor="sa-notes">
        <span className="min-h-[18px] leading-[1.35]">ملاحظات</span>
        <textarea
          className={cn(saInput, 'h-auto resize-y py-2.5')}
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
