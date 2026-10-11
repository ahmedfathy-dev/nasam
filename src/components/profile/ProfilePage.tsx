import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Camera, Check, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

type ProfileForm = {
  fullName: string
  username: string
  email: string
  phoneCode: string
  phone: string
  jobTitle: string
  department: string
  timezone: string
  language: string
}

type Session = {
  id: string
  device: string
  place: string
  current?: boolean
}

const initialForm: ProfileForm = {
  fullName: 'أحمد علي محمد',
  username: 'ahmed.ali',
  email: 'ahmed.ali@nasam.com',
  phoneCode: '+966',
  phone: '55 412 8890',
  jobTitle: 'مدير النظام',
  department: 'الإدارة العامة',
  timezone: 'الرياض (GMT+3)',
  language: 'العربية',
}

const initialSessions: Session[] = [
  { id: 's1', device: 'Chrome · Windows', place: 'الرياض · 185.12.44.9', current: true },
  { id: 's2', device: 'Safari · iPhone 15', place: 'جدة · منذ ساعتين' },
]

const permissions = [
  'لوحة التحكم',
  'الحوالات',
  'التجار',
  'الدول',
  'أسعار الصرف',
  'الإعدادات',
  'المشرفين',
  'الأدوار والصلاحيات',
  'التسويات',
]

const activities = [
  { id: 'a1', title: 'اعتماد حوالة #TR-10482', detail: 'بقيمة 1,250 USD — تاجر محمد سامي', time: 'منذ 12 د', tone: 'bg-[#2fbf5a]' },
  { id: 'a2', title: 'تحديث سعر صرف TRY', detail: 'من 33.90 إلى 34.20', time: 'منذ ساعة', tone: 'bg-[#e0a23a]' },
  { id: 'a3', title: 'اعتماد تسوية حساب', detail: 'التاجر خالد يوسف — 4,800 USD', time: 'منذ 3 س', tone: 'bg-[#2aa7a1]' },
  { id: 'a4', title: 'إضافة مشرف جديد', detail: 'سارة محمود — دور محاسب', time: 'أمس', tone: 'bg-[#3b82f6]' },
  { id: 'a5', title: 'تسجيل دخول ناجح', detail: 'Chrome · Windows — الرياض', time: 'أمس', tone: 'bg-[#2fbf5a]' },
  { id: 'a6', title: 'تغيير كلمة المرور', detail: 'تم التحديث قبل 30 يومًا', time: 'قبل 30 يومًا', tone: 'bg-[#8b949c]' },
]

const card = 'rounded-2xl border border-[#eceff2] bg-white shadow-[0_1px_2px_rgb(20_30_40_/_3%)]'
const fieldClass = 'h-11 w-full rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 text-[13px] text-[#2c343b] outline-0 focus:border-[#3dcf5a] focus:bg-white'

function isEditPath() {
  return window.location.pathname.startsWith('/profile/edit')
}

function ProfilePage() {
  const [editing, setEditing] = useState(isEditPath)
  const [profile, setProfile] = useState(initialForm)
  const [draft, setDraft] = useState(initialForm)
  const [twoFactor, setTwoFactor] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [notifyTransfers, setNotifyTransfers] = useState(true)
  const [notifyRates, setNotifyRates] = useState(true)
  const [notifySettlements, setNotifySettlements] = useState(true)
  const [sessions, setSessions] = useState(initialSessions)
  const [showAllActivity, setShowAllActivity] = useState(false)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    function sync() {
      setEditing(isEditPath())
    }
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  function openEdit() {
    setDraft(profile)
    setEditing(true)
    if (!isEditPath()) {
      window.history.pushState({}, '', '/profile/edit')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  function closeEdit() {
    setEditing(false)
    if (isEditPath()) {
      window.history.pushState({}, '', '/profile')
      window.dispatchEvent(new PopStateEvent('popstate'))
    }
  }

  function saveProfile(event: FormEvent) {
    event.preventDefault()
    setProfile(draft)
    closeEdit()
  }

  return editing ? (
    <EditProfile
      editor={{
        draft,
        photoUrl,
        notifyTransfers,
        notifyRates,
        notifySettlements,
        onChange: setDraft,
        onPhoto: setPhotoUrl,
        onRemovePhoto: () => setPhotoUrl(null),
        onNotifyTransfers: setNotifyTransfers,
        onNotifyRates: setNotifyRates,
        onNotifySettlements: setNotifySettlements,
        onCancel: closeEdit,
        onSave: saveProfile,
        onEndAll: () => setSessions((list) => list.filter((session) => session.current)),
      }}
    />
  ) : (
    <ProfileView
      view={{
        profile,
        photoUrl,
        twoFactor,
        loginAlerts,
        sessions,
        showAllActivity,
        onEdit: openEdit,
        onTwoFactor: setTwoFactor,
        onLoginAlerts: setLoginAlerts,
        onEndSession: (id) => setSessions((list) => list.filter((session) => session.id !== id)),
        onToggleActivity: () => setShowAllActivity((open) => !open),
      }}
    />
  )
}

function ProfileView({ view }: { view: {
  profile: ProfileForm
  photoUrl: string | null
  twoFactor: boolean
  loginAlerts: boolean
  sessions: Session[]
  showAllActivity: boolean
  onEdit: () => void
  onTwoFactor: (value: boolean) => void
  onLoginAlerts: (value: boolean) => void
  onEndSession: (id: string) => void
  onToggleActivity: () => void
} }) {
  const {
    profile,
    photoUrl,
    twoFactor,
    loginAlerts,
    sessions,
    showAllActivity,
    onEdit,
    onTwoFactor,
    onLoginAlerts,
    onEndSession,
    onToggleActivity,
  } = view
  const visibleSessions = sessions ?? []
  const visibleActivities = showAllActivity ? activities : activities.slice(0, 4)
  const infoRows = [
    ['الاسم الكامل', profile.fullName],
    ['اسم المستخدم', profile.username],
    ['البريد الإلكتروني', profile.email],
    ['رقم الهاتف', `${profile.phoneCode} ${profile.phone}`],
    ['القسم', profile.department],
    ['الدور', 'Super Admin'],
    ['اللغة المفضلة', profile.language],
    ['المنطقة الزمنية', profile.timezone],
  ]

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.3] text-[#1a2128] min-[721px]:text-[30px]">الملف الشخصي</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">بياناتك الشخصية، إعدادات الأمان وسجل النشاط</p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center justify-center self-start rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
          onClick={onEdit}
        >
          تعديل الملف الشخصي
        </button>
      </header>

      <section className="grid items-stretch gap-3 min-[1024px]:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)]">
        <article className={cn(card, 'flex items-center gap-4 p-4')}>
          <Avatar photoUrl={photoUrl} size="md" />
          <div className="min-w-0 text-start">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-bold text-[#1c242b]">أحمد علي</h2>
              <span className="rounded-full bg-[#e8f8ec] px-2 py-0.5 text-[11px] font-semibold text-[#1f9a45]">Super Admin</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f8ec] px-2 py-0.5 text-[11px] font-semibold text-[#1f9a45]">
                <i className="size-1.5 rounded-full bg-[#2fbf5a]" />
                نشط
              </span>
            </div>
            <p className="mt-1 text-[12px] text-[#6d7780]" dir="ltr">{profile.email} · {profile.phoneCode} {profile.phone}</p>
            <p className="mt-1 text-[11px] text-[#9aa3ab]">عضو منذ 12 مارس 2024 — {profile.department} — الرياض</p>
          </div>
        </article>
        <div className="grid grid-cols-3 gap-3">
          <Stat stat={{ label: 'حوالات راجعتها هذا الشهر', value: '312', green: true }} />
          <Stat stat={{ label: 'تسويات اعتمدتها', value: '18' }} />
          <Stat stat={{ label: 'آخر تسجيل دخول', value: 'اليوم', hint: '09:14' }} />
        </div>
      </section>

      <section className="grid items-start gap-3 min-[1024px]:grid-cols-[minmax(0,1.18fr)_minmax(260px,0.82fr)]">
        <article className={cn(card, 'p-4')}>
          <h2 className="text-start text-[15px] font-bold text-[#24303a]">المعلومات الشخصية</h2>
          <p className="mt-1 text-start text-[11px] text-[#9aa2a9]">البيانات الأساسية لحسابك في النظام</p>
          <dl className="mt-3 grid gap-0">
            {infoRows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 border-t border-[#f3f5f6] py-2.5 text-[12px]">
                <dt className="text-[#8b949c]">{label}</dt>
                <dd className="font-semibold text-[#2a3238]" dir={label === 'البريد الإلكتروني' || label === 'اسم المستخدم' ? 'ltr' : undefined}>{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className={cn(card, 'grid gap-3 p-4')}>
          <h2 className="text-start text-[15px] font-bold text-[#24303a]">الأمان وتسجيل الدخول</h2>
          <SecurityRow label="كلمة المرور" hint="آخر تغيير منذ 30 يومًا">
            <span className="rounded-full bg-[#f3f5f6] px-3 py-1 text-[11px] font-semibold text-[#5c666e]">تغيير</span>
          </SecurityRow>
          <SecurityRow label="التحقق بخطوتين (2FA)" hint="مفعّل عبر تطبيق المصادقة">
            <Toggle checked={twoFactor} label="التحقق بخطوتين" onChange={onTwoFactor} />
          </SecurityRow>
          <SecurityRow label="تنبيهات تسجيل الدخول" hint="إشعار عند الدخول من جهاز جديد">
            <Toggle checked={loginAlerts} label="تنبيهات تسجيل الدخول" onChange={onLoginAlerts} />
          </SecurityRow>
          <div className="text-start text-[12px] font-semibold text-[#5c666e]">الجلسات النشطة</div>
          {visibleSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f8f9] px-3 py-2.5">
              <div className="text-start">
                <div className="text-[12px] font-semibold text-[#2a3238]">{session.device}</div>
                <div className="text-[11px] text-[#9aa3ab]">{session.place}</div>
              </div>
              {session.current ? (
                <span className="rounded-full bg-[#e8f8ec] px-2.5 py-1 text-[11px] font-semibold text-[#1f9a45]">هذا الجهاز</span>
              ) : (
                <button
                  type="button"
                  className="h-8 cursor-pointer rounded-full border border-[#f3c7c7] bg-[#fff5f5] px-3 text-[11px] font-semibold text-[#e15b5b]"
                  onClick={() => onEndSession(session.id)}
                >
                  إنهاء
                </button>
              )}
            </div>
          ))}
        </article>
      </section>

      <section className="grid items-start gap-3 min-[1024px]:grid-cols-[minmax(0,1.28fr)_minmax(240px,0.72fr)]">
        <article className={cn(card, 'p-4')}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-bold text-[#24303a]">آخر النشاطات</h2>
            <button type="button" className="rounded-full bg-[#f3f5f6] px-3 py-1 text-[11px] font-semibold text-[#5c666e]" onClick={onToggleActivity}>
              {showAllActivity ? 'عرض الأقل' : 'عرض السجل الكامل'}
            </button>
          </div>
          <p className="mb-2 text-start text-[11px] text-[#9aa2a9]">سجل آخر العمليات التي قمت بها</p>
          <ul className="grid gap-2">
            {visibleActivities.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 border-t border-[#f3f5f6] py-2.5">
                <div className="min-w-0 text-start">
                  <div className="text-[12px] font-semibold text-[#2a3238]">{item.title}</div>
                  <div className="text-[11px] text-[#8b949c]">{item.detail}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2 text-[11px] text-[#9aa3ab]">
                  <span>{item.time}</span>
                  <i className={cn('size-2.5 rounded-full', item.tone)} />
                </div>
              </li>
            ))}
          </ul>
        </article>
        <article className={cn(card, 'p-4 text-start')}>
          <h2 className="text-[15px] font-bold text-[#24303a]">صلاحياتك</h2>
          <p className="mt-1 text-[11px] text-[#9aa2a9]">دور Super Admin — وصول كامل لجميع الأقسام</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {permissions.map((item) => (
              <span key={item} className="rounded-full bg-[#e8f8ec] px-2.5 py-1 text-[11px] font-semibold text-[#1f9a45]">
                {item}
              </span>
            ))}
          </div>
        </article>
      </section>
    </div>
  )
}

function EditProfile({ editor }: { editor: {
  draft: ProfileForm
  photoUrl: string | null
  notifyTransfers: boolean
  notifyRates: boolean
  notifySettlements: boolean
  onChange: (next: ProfileForm) => void
  onPhoto: (url: string | null) => void
  onRemovePhoto: () => void
  onNotifyTransfers: (value: boolean) => void
  onNotifyRates: (value: boolean) => void
  onNotifySettlements: (value: boolean) => void
  onCancel: () => void
  onSave: (event: FormEvent) => void
  onEndAll: () => void
} }) {
  const {
    draft,
    photoUrl,
    notifyTransfers,
    notifyRates,
    notifySettlements,
    onChange,
    onPhoto,
    onRemovePhoto,
    onNotifyTransfers,
    onNotifyRates,
    onNotifySettlements,
    onCancel,
    onSave,
    onEndAll,
  } = editor
  function setField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    onChange({ ...draft, [key]: value })
  }

  return (
    <form className="grid gap-4 text-[#1c242b]" dir="rtl" onSubmit={onSave}>
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.3] text-[#1a2128] min-[721px]:text-[30px]">تعديل الملف الشخصي</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">حدّث بياناتك الشخصية، كلمة المرور وتفضيلات الإشعارات</p>
        </div>
        <div className="flex items-center gap-2 self-start" dir="ltr">
          <button type="submit" className="h-10 cursor-pointer rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]">
            حفظ التغييرات
          </button>
          <button type="button" className="h-10 cursor-pointer rounded-full border border-[#e6e9ec] bg-white px-4 text-[13px] font-semibold text-[#5c666e]" onClick={onCancel}>
            إلغاء
          </button>
        </div>
      </header>

      <div className="grid items-start gap-3 min-[1024px]:grid-cols-[minmax(0,1.22fr)_minmax(260px,0.78fr)]">
        <div className="grid gap-3">
          <article className={cn(card, 'p-4')}>
            <h2 className="mb-1 text-start text-[15px] font-bold">المعلومات الشخصية</h2>
            <p className="mb-3 text-start text-[11px] text-[#9aa2a9]">الحقول المعلّمة بـ * إلزامية</p>
            <div className="grid gap-3 min-[721px]:grid-cols-2">
              <Field field={{ label: 'الاسم الكامل', required: true, className: 'min-[721px]:col-span-1' }}>
                <input className={cn(fieldClass, 'border-[#8ed39a]')} value={draft.fullName} onChange={(event) => setField('fullName', event.target.value)} required />
              </Field>
              <Field field={{ label: 'اسم المستخدم', hint: 'يُستخدم لتسجيل الدخول — لا يمكن تغييره' }}>
                <input className={fieldClass} value={draft.username} dir="ltr" onChange={(event) => setField('username', event.target.value)} />
              </Field>
              <Field field={{ label: 'البريد الإلكتروني', required: true }}>
                <input className={fieldClass} type="email" dir="ltr" value={draft.email} onChange={(event) => setField('email', event.target.value)} required />
              </Field>
              <Field field={{ label: 'رقم الهاتف' }}>
                <div className="flex gap-2" dir="ltr">
                  <input className={cn(fieldClass, 'w-[88px] text-center')} value={draft.phoneCode} onChange={(event) => setField('phoneCode', event.target.value)} />
                  <input className={fieldClass} value={draft.phone} onChange={(event) => setField('phone', event.target.value)} />
                </div>
              </Field>
              <Field field={{ label: 'المسمى الوظيفي' }}>
                <input className={fieldClass} value={draft.jobTitle} onChange={(event) => setField('jobTitle', event.target.value)} />
              </Field>
              <Field field={{ label: 'القسم' }}>
                <select className={fieldClass} value={draft.department} onChange={(event) => setField('department', event.target.value)}>
                  <option>الإدارة العامة</option>
                  <option>المالية</option>
                  <option>العمليات</option>
                </select>
              </Field>
              <Field field={{ label: 'المنطقة الزمنية' }}>
                <select className={fieldClass} value={draft.timezone} onChange={(event) => setField('timezone', event.target.value)}>
                  <option>الرياض (GMT+3)</option>
                  <option>دبي (GMT+4)</option>
                  <option>القاهرة (GMT+2)</option>
                </select>
              </Field>
              <Field field={{ label: 'اللغة المفضلة' }}>
                <select className={fieldClass} value={draft.language} onChange={(event) => setField('language', event.target.value)}>
                  <option>العربية</option>
                  <option>English</option>
                </select>
              </Field>
            </div>
          </article>
          <PasswordCard />
        </div>

        <div className="grid gap-3">
          <article className={cn(card, 'grid justify-items-center gap-3 p-4 text-center')}>
            <h2 className="w-full text-start text-[15px] font-bold">الصورة الشخصية</h2>
            <div className="relative">
              <Avatar photoUrl={photoUrl} size="lg" />
              <span className="absolute bottom-1 end-1 grid size-7 place-items-center rounded-full border border-white bg-[#111315] text-white">
                <Camera size={13} />
              </span>
            </div>
            <div className="flex gap-2">
              <label className="inline-flex h-9 cursor-pointer items-center rounded-full bg-[#f3f5f6] px-3 text-[12px] font-semibold text-[#5c666e]">
                رفع صورة جديدة
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    onPhoto(URL.createObjectURL(file))
                  }}
                />
              </label>
              <button type="button" className="h-9 cursor-pointer rounded-full border border-[#f3c7c7] bg-[#fff5f5] px-3 text-[12px] font-semibold text-[#e15b5b]" onClick={onRemovePhoto}>
                حذف
              </button>
            </div>
            <p className="text-[11px] text-[#9aa3ab]">PNG أو JPG · بحد أقصى 2MB · 400×400 أو أكبر</p>
          </article>

          <article className={cn(card, 'grid gap-3 p-4')}>
            <h2 className="text-start text-[15px] font-bold">تفضيلات الإشعارات</h2>
            <p className="text-start text-[11px] text-[#9aa2a9]">اختر ما تريد أن يصلك</p>
            <NotifyRow row={{ label: 'الحوالات الجديدة', hint: 'عند تسجيل أي حوالة جديدة', checked: notifyTransfers, onChange: onNotifyTransfers }} />
            <NotifyRow row={{ label: 'تنبيهات أسعار الصرف', hint: 'عند تغيّر سعر اليوم', checked: notifyRates, onChange: onNotifyRates }} />
            <NotifyRow row={{ label: 'طلبات التسوية', hint: 'عند وصول طلب يحتاج اعتماد', checked: notifySettlements, onChange: onNotifySettlements }} />
          </article>

          <article className="rounded-2xl border border-[#f3c7c7] bg-[#fff8f8] p-4 text-start">
            <h2 className="text-[14px] font-bold text-[#c44747]">تسجيل الخروج من كل الأجهزة</h2>
            <p className="mt-1 text-[11px] leading-6 text-[#a36a6a]">إنهاء جميع الجلسات النشطة ما عدا هذا الجهاز</p>
            <button type="button" className="mt-3 h-9 cursor-pointer rounded-full border border-[#f0b4b4] bg-white px-3 text-[12px] font-semibold text-[#e15b5b]" onClick={onEndAll}>
              إنهاء كل الجلسات
            </button>
          </article>
        </div>
      </div>
    </form>
  )
}

function PasswordCard() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const rules = useMemo(() => ({
    length: next.length >= 8,
    mixed: /[a-z]/.test(next) && /[A-Z]/.test(next),
    number: /\d/.test(next),
    symbol: /[^A-Za-z0-9]/.test(next),
  }), [next])
  const score = Object.values(rules).filter(Boolean).length
  const matched = confirm.length > 0 && confirm === next

  return (
    <article className={cn(card, 'p-4')}>
      <h2 className="text-start text-[15px] font-bold">تغيير كلمة المرور</h2>
      <p className="mt-1 text-start text-[11px] text-[#9aa2a9]">اترك الحقول فارغة إذا لم ترغب في تغييرها</p>
      <div className="mt-3 grid gap-3 min-[721px]:grid-cols-3">
        <SecretField field={{ label: 'كلمة المرور الحالية', value: current, shown: showCurrent, onToggle: () => setShowCurrent((value) => !value), onChange: setCurrent }} />
        <SecretField field={{ label: 'كلمة المرور الجديدة', value: next, shown: showNext, onToggle: () => setShowNext((value) => !value), onChange: setNext }} />
        <SecretField field={{ label: 'تأكيد كلمة المرور', value: confirm, shown: false, hideToggle: true, matched, onChange: setConfirm }} />
      </div>
      <div className="mt-3 grid gap-1">
        <div className="text-start text-[11px] text-[#8b949c]">قوة كلمة المرور</div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 4 }, (_, index) => (
            <i key={index} className={cn('h-1.5 rounded-full', index < score ? 'bg-[#3dcf5a]' : 'bg-[#e6eaee]')} />
          ))}
        </div>
        <div className="text-start text-[11px] font-semibold text-[#1f9a45]">{score >= 3 ? 'قوية' : score > 0 ? 'متوسطة' : ''}</div>
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#6d7780]">
        <Rule ok={rules.length} label="8 أحرف على الأقل" />
        <Rule ok={rules.mixed} label="حرف كبير وصغير" />
        <Rule ok={rules.number} label="رقم واحد على الأقل" />
        <Rule ok={rules.symbol} label="رمز خاص" />
      </ul>
    </article>
  )
}

function Rule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className={cn('inline-flex items-center gap-1', ok && 'text-[#1f9a45]')}>
      <Check size={12} />
      {label}
    </li>
  )
}

function SecretField({ field }: {
  field: {
    label: string
    value: string
    shown: boolean
    hideToggle?: boolean
    matched?: boolean
    onToggle?: () => void
    onChange: (value: string) => void
  }
}) {
  const { label, value, shown, hideToggle, matched, onToggle, onChange } = field
  return (
    <Field field={{ label }}>
      <div className="relative">
        <input
          className={cn(fieldClass, 'pe-16')}
          type={shown ? 'text' : 'password'}
          value={value}
          autoComplete="new-password"
          onChange={(event) => onChange(event.target.value)}
        />
        {!hideToggle && (
          <button type="button" className="absolute end-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 text-[11px] text-[#8b949c]" onClick={onToggle}>
            {shown ? <EyeOff size={13} /> : <Eye size={13} />}
            إظهار
          </button>
        )}
        {hideToggle && matched && <Check size={14} className="absolute end-3 top-1/2 -translate-y-1/2 text-[#1f9a45]" />}
      </div>
    </Field>
  )
}

function Field({ field, children }: { field: { label: string; required?: boolean; hint?: string; className?: string }; children: ReactNode }) {
  const { label, required, hint, className } = field
  return (
    <label className={cn('grid gap-1.5 text-start', className)}>
      <span className="text-[12px] font-semibold text-[#3d4650]">
        {label} {required && <span className="text-[#e14b4b]">*</span>}
      </span>
      {children}
      {hint && <span className="text-[10px] text-[#9aa3ab]">{hint}</span>}
    </label>
  )
}

function SecurityRow({ label, hint, children }: { label: string; hint: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-[#f3f5f6] pt-3">
      <div className="text-start">
        <div className="text-[13px] font-semibold text-[#2a3238]">{label}</div>
        <p className="text-[11px] text-[#9aa3ab]">{hint}</p>
      </div>
      {children}
    </div>
  )
}

function NotifyRow({ row }: { row: { label: string; hint: string; checked: boolean; onChange: (value: boolean) => void } }) {
  const { label, hint, checked, onChange } = row
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-start">
        <div className="text-[13px] font-semibold">{label}</div>
        <p className="text-[11px] text-[#9aa3ab]">{hint}</p>
      </div>
      <Toggle checked={checked} label={label} onChange={onChange} />
    </div>
  )
}

function Toggle({ checked, label, onChange }: { checked: boolean; label: string; onChange: (value: boolean) => void }) {
  return (
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
  )
}

function Stat({ stat }: { stat: { label: string; value: string; hint?: string; green?: boolean } }) {
  const { label, value, hint, green } = stat
  return (
    <article className={cn(card, 'grid content-center justify-items-center gap-1 px-2 py-3 text-center')}>
      <span className="text-[11px] text-[#8b949c]">{label}</span>
      <strong className={cn('text-[22px] font-bold leading-none', green ? 'text-[#1f9a45]' : 'text-[#1c242b]')}>{value}</strong>
      {hint && <span className="text-[12px] font-semibold text-[#3d4650]">{hint}</span>}
    </article>
  )
}

function Avatar({ photoUrl, size }: { photoUrl: string | null; size: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'size-28 text-[40px]' : 'size-[72px] text-[26px]'
  return photoUrl ? (
    <img src={photoUrl} alt="" className={cn(box, 'shrink-0 rounded-full object-cover')} />
  ) : (
    <span className={cn(box, 'grid shrink-0 place-items-center rounded-full bg-[#0f7a4c] font-bold text-white')}>أ</span>
  )
}

export default ProfilePage
