import { useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import FormSelect from '@/components/ui/FormSelect'

type SettingsForm = {
  organization: string
  email: string
  phone: string
  timezone: string
  autoRates: boolean
  rateInterval: string
  baseCurrency: string
  defaultCampaign: string
  notifyTransfers: boolean
  notifyRates: boolean
  notifySettlements: boolean
  notifySupervisors: boolean
  requireTwoFactor: boolean
  loginAlerts: boolean
  sessionMinutes: string
}

const initialSettings: SettingsForm = {
  organization: 'نسام',
  email: 'support@nasam.com',
  phone: '+966 55 412 8890',
  timezone: 'الرياض (GMT+3)',
  autoRates: true,
  rateInterval: 'كل دقيقة',
  baseCurrency: 'USD',
  defaultCampaign: 'TRY',
  notifyTransfers: true,
  notifyRates: true,
  notifySettlements: true,
  notifySupervisors: false,
  requireTwoFactor: true,
  loginAlerts: true,
  sessionMinutes: '30 دقيقة',
}

const card = 'rounded-2xl border border-[#eef1f3] bg-white'
const fieldClass = 'h-11 w-full rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 text-start text-[13px] text-[#2c343b] outline-0 focus:border-[#3dcf5a] focus:bg-white'

function SettingsPage() {
  const [saved, setSaved] = useState(initialSettings)
  const [draft, setDraft] = useState(initialSettings)
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')

  function patch<K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
    setStatus('idle')
  }

  function save() {
    setSaved(draft)
    setStatus('saved')
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.25] text-[#1a2128] min-[721px]:text-[30px]">الإعدادات</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">إعدادات النظام العامة، الإشعارات، وتحديث أسعار الصرف</p>
        </div>
        <button
          type="button"
          disabled={!dirty && status !== 'saved'}
          onClick={save}
          className="inline-flex h-10 shrink-0 items-center justify-center self-start whitespace-nowrap rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white enabled:hover:bg-[#292d2f] disabled:opacity-40"
        >
          {status === 'saved' && !dirty ? 'تم الحفظ' : 'حفظ التغييرات'}
        </button>
      </header>

      <div className="grid items-start gap-4 min-[1100px]:grid-cols-2">
        <article className={cn(card, 'grid gap-3 p-4')}>
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">بيانات المنشأة</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">الاسم وبيانات التواصل الظاهرة داخل النظام</p>
          </div>
          <Field label="اسم المنشأة">
            <input className={fieldClass} value={draft.organization} onChange={(event) => patch('organization', event.target.value)} />
          </Field>
          <div className="grid gap-3 min-[721px]:grid-cols-2">
            <Field label="البريد">
              <input className={fieldClass} dir="ltr" value={draft.email} onChange={(event) => patch('email', event.target.value)} />
            </Field>
            <Field label="الهاتف">
              <input className={fieldClass} dir="ltr" value={draft.phone} onChange={(event) => patch('phone', event.target.value)} />
            </Field>
          </div>
          <Choice choice={{ label: 'المنطقة الزمنية', value: draft.timezone, options: ['الرياض (GMT+3)', 'دبي (GMT+4)', 'القاهرة (GMT+2)'], onChange: (value) => patch('timezone', value) }} />
        </article>

        <article className={cn(card, 'grid gap-3 p-4')}>
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">أسعار الصرف</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">تحديث سعر اليوم تلقائيًا، ومنها حملة الليرة التركية (TRY)</p>
          </div>
          <SettingRow row={{ label: 'تحديث تلقائي', hint: 'سحب الأسعار من المزوّد بدون إدخال يدوي', checked: draft.autoRates, onChange: (value) => patch('autoRates', value) }} />
          <div className="grid gap-3 min-[721px]:grid-cols-3">
            <Choice choice={{ label: 'فترة التحديث', value: draft.rateInterval, options: ['كل دقيقة', 'كل 5 دقائق', 'كل ساعة'], onChange: (value) => patch('rateInterval', value) }} />
            <Choice choice={{ label: 'العملة الأساسية', value: draft.baseCurrency, options: ['USD', 'SAR', 'EUR'], onChange: (value) => patch('baseCurrency', value) }} />
            <Choice choice={{ label: 'الحملة الافتراضية', value: draft.defaultCampaign, options: ['TRY', 'EGP', 'SAR', 'AED'], onChange: (value) => patch('defaultCampaign', value) }} />
          </div>
        </article>

        <article className={cn(card, 'grid gap-3 p-4')}>
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">الإشعارات</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">ما يصلك أنت وبقية المشرفين داخل النظام</p>
          </div>
          <SettingRow row={{ label: 'الحوالات الجديدة', hint: 'عند تسجيل أي حوالة جديدة', checked: draft.notifyTransfers, onChange: (value) => patch('notifyTransfers', value) }} />
          <SettingRow row={{ label: 'تنبيهات أسعار الصرف', hint: 'عند تغيّر سعر اليوم', checked: draft.notifyRates, onChange: (value) => patch('notifyRates', value) }} />
          <SettingRow row={{ label: 'طلبات التسوية', hint: 'عند وصول طلب يحتاج اعتماد', checked: draft.notifySettlements, onChange: (value) => patch('notifySettlements', value) }} />
          <SettingRow row={{ label: 'مشرف جديد', hint: 'عند إضافة حساب مشرف', checked: draft.notifySupervisors, onChange: (value) => patch('notifySupervisors', value) }} />
        </article>

        <article className={cn(card, 'grid gap-3 p-4')}>
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">الأمان</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">حماية الدخول وجلسات المشرفين</p>
          </div>
          <SettingRow row={{ label: 'إلزام التحقق بخطوتين', hint: 'يُطلب من كل مشرف عند تسجيل الدخول', checked: draft.requireTwoFactor, onChange: (value) => patch('requireTwoFactor', value) }} />
          <SettingRow row={{ label: 'تنبيه تسجيل الدخول', hint: 'إشعار عند الدخول من جهاز جديد', checked: draft.loginAlerts, onChange: (value) => patch('loginAlerts', value) }} />
          <Choice choice={{ label: 'مدة الجلسة', value: draft.sessionMinutes, options: ['15 دقيقة', '30 دقيقة', 'ساعة', '8 ساعات'], onChange: (value) => patch('sessionMinutes', value) }} />
        </article>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-start">
      <span className="text-[12px] font-semibold text-[#3d4650]">{label}</span>
      {children}
    </label>
  )
}

function Choice({ choice }: { choice: { label: string; value: string; options: string[]; onChange: (value: string) => void } }) {
  const options = Array.isArray(choice.options) ? choice.options : []
  return (
    <div className="grid min-w-0 gap-1.5 text-start">
      <span className="text-[12px] font-semibold text-[#3d4650]">{choice.label}</span>
      <FormSelect
        field={{
          ariaLabel: choice.label,
          value: choice.value,
          options: options.map((option) => ({ label: option, value: option })),
          onChange: choice.onChange,
          className: 'h-11 rounded-xl border border-[#e6eaee] bg-[#f7f8f9] text-[13px] text-[#2c343b] focus-within:border-[#3dcf5a] focus-within:bg-white',
        }}
      />
    </div>
  )
}

function SettingRow({ row }: {
  row: {
    label: string
    hint: string
    checked: boolean
    onChange: (value: boolean) => void
  }
}) {
  const { label, hint, checked, onChange } = row
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#f3f5f6] pt-3 first:border-t-0 first:pt-0">
      <div className="min-w-0 text-start">
        <div className="text-[13px] font-semibold text-[#2a3238]">{label}</div>
        <p className="text-[11px] text-[#9aa3ab]">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className={cn('relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-0 p-0.5', checked ? 'bg-[#3dcf5a]' : 'bg-[#e4e7ea]')}
        onClick={() => onChange(!checked)}
      >
        <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(20_30_40_/_25%)]', checked ? 'start-[22px]' : 'start-0.5')} />
      </button>
    </div>
  )
}

export default SettingsPage
