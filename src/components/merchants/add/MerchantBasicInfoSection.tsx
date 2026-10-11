import FormSelect from '../../ui/FormSelect'
import type { MerchantStatus } from '../../../data/merchantsData'
import { useAddMerchantForm } from './addMerchantFormContext'
import SegmentedControl from './SegmentedControl'
import {
  amControlInput,
  amControlShell,
  amError,
  amField,
  amFieldInput,
  amGrid2,
  amHint,
  amSection,
  amSectionHead,
  amSelect,
  amStep,
} from '../merchantTw'

function MerchantBasicInfoSection() {
  const { values, errors, countries, phonePrefix, disabled, onChange, onBlurEmail } = useAddMerchantForm()
  return (
    <section className={amSection}>
      <header className={amSectionHead}>
        <span className={amStep}>1</span>
        <h2 className="text-sm font-bold text-[#303b46]">البيانات الأساسية</h2>
      </header>

      <label className={amField}>
        <span className="min-h-[18px] leading-[1.35]">اسم التاجر <b className="font-semibold text-danger">*</b></span>
        <input
          className={amFieldInput}
          value={values.name}
          placeholder="محمد سامي"
          disabled={disabled}
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => onChange('name', event.target.value)}
        />
        {errors.name && <small className={amError}>{errors.name}</small>}
      </label>

      <div className={amGrid2}>
        <label className={amField}>
          <span className="min-h-[18px] leading-[1.35]">البريد الإلكتروني / اسم المستخدم <b className="font-semibold text-danger">*</b></span>
          <input
            className={amFieldInput}
            type="email"
            dir="ltr"
            value={values.email}
            placeholder="m.samy@nasam.org"
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={onBlurEmail}
          />
          <em className={amHint}>يجب ألا يكون مستخدمًا لحساب آخر</em>
          {errors.email && <small className={amError}>{errors.email}</small>}
        </label>

        <label className={amField}>
          <span className="min-h-[18px] leading-[1.35]">رقم الهاتف <b className="font-semibold text-danger">*</b></span>
          <div className={`am-phone ${amControlShell} [direction:ltr]`}>
            <span className="am-phone-prefix whitespace-nowrap text-xs font-semibold text-[#7d868e]" dir="ltr">{phonePrefix}</span>
            <input
              className={amControlInput}
              type="tel"
              dir="ltr"
              value={values.phoneLocal}
              placeholder="100 234 5678"
              disabled={disabled}
              aria-invalid={Boolean(errors.phoneLocal)}
              onChange={(event) => onChange('phoneLocal', event.target.value)}
            />
          </div>
          <em className={`${amHint} am-hint-spacer invisible select-none`} aria-hidden="true">&nbsp;</em>
          {errors.phoneLocal && <small className={amError}>{errors.phoneLocal}</small>}
        </label>
      </div>

      <div className={amGrid2}>
        <label className={amField}>
          <span className="min-h-[18px] leading-[1.35]">الدولة <b className="font-semibold text-danger">*</b></span>
          <FormSelect
            field={{
              className: amSelect,
              ariaLabel: 'الدولة',
              value: values.countryId,
              disabled,
              onChange: (value) => onChange('countryId', value),
              options: countries.map((country) => ({
                value: country.id,
                label: `${country.flag} ${country.name} · ${country.currency}`,
              })),
            }}
          />
          <em className={amHint}>من الدول المسجلة والمفعلة فقط</em>
          {errors.countryId && <small className={amError}>{errors.countryId}</small>}
        </label>

        <div className={amField}>
          <span className="min-h-[18px] leading-[1.35]">حالة التاجر</span>
          <SegmentedControl
            control={{
              ariaLabel: 'حالة التاجر',
              value: values.status,
              disabled,
              onChange: (value) => onChange('status', value as MerchantStatus),
              options: [
                { label: 'نشط', value: 'نشط' },
                { label: 'موقوف', value: 'موقوف' },
              ],
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default MerchantBasicInfoSection
