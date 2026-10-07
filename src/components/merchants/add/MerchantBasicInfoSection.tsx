import FormSelect from '../../ui/FormSelect'
import type { CatalogCountry } from '../../../data/merchantCatalog'
import type { MerchantStatus } from '../../../data/merchantsData'
import SegmentedControl from './SegmentedControl'
import type { AddMerchantFieldErrors, AddMerchantFormValues } from './addMerchantTypes'

type MerchantBasicInfoSectionProps = {
  values: AddMerchantFormValues
  errors: AddMerchantFieldErrors
  countries: CatalogCountry[]
  phonePrefix: string
  disabled?: boolean
  onChange: <K extends keyof AddMerchantFormValues>(key: K, value: AddMerchantFormValues[K]) => void
  onBlurEmail: () => void
}

function MerchantBasicInfoSection({
  values, errors, countries, phonePrefix, disabled, onChange, onBlurEmail,
}: MerchantBasicInfoSectionProps) {
  return (
    <section className="am-section">
      <header className="am-section-head">
        <span className="am-step">1</span>
        <h2>البيانات الأساسية</h2>
      </header>

      <label className="am-field">
        <span>اسم التاجر <b>*</b></span>
        <input
          value={values.name}
          placeholder="محمد سامي"
          disabled={disabled}
          aria-invalid={Boolean(errors.name)}
          onChange={(event) => onChange('name', event.target.value)}
        />
        {errors.name && <small className="am-error">{errors.name}</small>}
      </label>

      <div className="am-grid-2">
        <label className="am-field">
          <span>البريد الإلكتروني / اسم المستخدم <b>*</b></span>
          <input
            type="email"
            dir="ltr"
            value={values.email}
            placeholder="m.samy@nasam.org"
            disabled={disabled}
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => onChange('email', event.target.value)}
            onBlur={onBlurEmail}
          />
          <em className="am-hint">يجب ألا يكون مستخدمًا لحساب آخر</em>
          {errors.email && <small className="am-error">{errors.email}</small>}
        </label>

        <label className="am-field">
          <span>رقم الهاتف <b>*</b></span>
          <div className="am-phone">
            <span className="am-phone-prefix" dir="ltr">{phonePrefix}</span>
            <input
              type="tel"
              dir="ltr"
              value={values.phoneLocal}
              placeholder="100 234 5678"
              disabled={disabled}
              aria-invalid={Boolean(errors.phoneLocal)}
              onChange={(event) => onChange('phoneLocal', event.target.value)}
            />
          </div>
          <em className="am-hint am-hint-spacer" aria-hidden="true">&nbsp;</em>
          {errors.phoneLocal && <small className="am-error">{errors.phoneLocal}</small>}
        </label>
      </div>

      <div className="am-grid-2">
        <label className="am-field">
          <span>الدولة <b>*</b></span>
          <FormSelect
            className="am-select"
            ariaLabel="الدولة"
            value={values.countryId}
            disabled={disabled}
            onChange={(value) => onChange('countryId', value)}
            options={countries.map((country) => ({
              value: country.id,
              label: `${country.flag} ${country.name} · ${country.currency}`,
            }))}
          />
          <em className="am-hint">من الدول المسجلة والمفعلة فقط</em>
          {errors.countryId && <small className="am-error">{errors.countryId}</small>}
        </label>

        <div className="am-field">
          <span>حالة التاجر</span>
          <SegmentedControl
            ariaLabel="حالة التاجر"
            value={values.status}
            disabled={disabled}
            onChange={(value) => onChange('status', value as MerchantStatus)}
            options={[
              { label: 'نشط', value: 'نشط' },
              { label: 'موقوف', value: 'موقوف' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default MerchantBasicInfoSection
