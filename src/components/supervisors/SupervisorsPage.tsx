import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Check, ChevronDown, ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '@/components/ui/FormSelect'
import {
  roleBadgeClass,
  supervisorRoles,
  supervisors,
  SUPERVISOR_PAGE_SIZE,
  type Supervisor,
  type SupervisorRole,
} from '@/data/supervisorsData'

const card = 'rounded-2xl border border-[#eef1f3] bg-white'
const fieldClass = 'h-11 w-full rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 text-start text-[13px] text-[#2c343b] outline-0 focus:border-[#3dcf5a] focus:bg-white'
const avatarColors = ['#1aa36a', '#7c5cbf', '#d946a8', '#f0a020', '#e23b6a', '#3b82f6', '#14b8a6', '#0f766e', '#6366f1', '#db2777', '#0284c7']

type SupervisorDialog =
  | { type: 'form'; mode: 'create' | 'edit'; person: Supervisor | null }
  | { type: 'view'; person: Supervisor }
  | { type: 'delete'; person: Supervisor }

function SupervisorsPage() {
  const [people, setPeople] = useState<Supervisor[]>(() => supervisors.map((person) => ({ ...person })))
  const [query, setQuery] = useState('')
  const [role, setRole] = useState<SupervisorRole | 'كل الأدوار'>('كل الأدوار')
  const [roleOpen, setRoleOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState<SupervisorDialog | null>(null)
  const roleRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return people.filter((person) => {
      const matchesRole = role === 'كل الأدوار' || person.role === role
      const haystack = `${person.name} ${person.email} ${person.phone}`.toLowerCase()
      return matchesRole && (!needle || haystack.includes(needle))
    })
  }, [people, query, role])

  const pageCount = Math.max(1, Math.ceil(filtered.length / SUPERVISOR_PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = filtered.length === 0 ? 0 : (currentPage - 1) * SUPERVISOR_PAGE_SIZE
  const visible = filtered.slice(start, start + SUPERVISOR_PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : start + 1
  const rangeEnd = start + visible.length

  const activeCount = people.filter((person) => person.status === 'نشط').length
  const pausedCount = people.filter((person) => person.status === 'موقوف').length
  const onlineCount = people.filter((person) => person.online).length
  const activePercent = people.length === 0 ? 0 : Math.round((activeCount / people.length) * 100)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  useEffect(() => {
    if (!roleOpen) return
    function onPointerDown(event: MouseEvent) {
      if (!roleRef.current?.contains(event.target as Node)) setRoleOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [roleOpen])

  function saveSupervisor(values: SupervisorDraft) {
    const name = values.name.trim()
    const email = values.email.trim().toLowerCase()
    const phone = values.phone.trim()
    if (dialog?.type !== 'form') return
    if (dialog.mode === 'edit' && dialog.person) {
      const current = dialog.person
      setPeople((list) =>
        list.map((person) =>
          person.id === current.id
            ? {
                ...person,
                name,
                email,
                phone,
                initial: name.charAt(0) || person.initial,
                role: values.role,
                twoFactor: values.twoFactor,
                status: values.status,
                online: values.status === 'موقوف' ? false : person.online,
              }
            : person,
        ),
      )
    } else {
      setPeople((list) => [
        {
          id: `sv-${Date.now()}`,
          name,
          email,
          phone,
          initial: name.charAt(0) || 'م',
          avatar: avatarColors[list.length % avatarColors.length],
          role: values.role,
          lastSeen: 'لم يسجل دخولًا',
          twoFactor: values.twoFactor,
          status: values.status,
          online: false,
        },
        ...list,
      ])
      setPage(1)
      setQuery('')
      setRole('كل الأدوار')
    }
    setDialog(null)
  }

  function deleteSupervisor(person: Supervisor) {
    setPeople((list) => list.filter((item) => item.id !== person.id))
    setDialog(null)
  }

  const stats = [
    { label: 'إجمالي المشرفين', value: String(people.length), note: `في ${supervisorRoles.length} أدوار`, accent: false },
    { label: 'مشرفون نشطون', value: String(activeCount), note: `${activePercent}% من الحسابات`, accent: true },
    { label: 'حسابات موقوفة', value: String(pausedCount), note: 'آخر إيقاف منذ 23 يوم', accent: false },
    { label: 'متصلون الآن', value: String(onlineCount), note: 'آخر نشاط قبل دقيقة', accent: false },
  ]

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.25] text-[#1a2128] min-[721px]:text-[30px]">المشرفين</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">إدارة حسابات المشرفين وأدوارهم وحالة الدخول للنظام</p>
        </div>
        <div className="flex flex-col items-stretch gap-2 self-start min-[480px]:flex-row min-[480px]:items-center">
          <label className="flex h-10 w-full items-center gap-2 rounded-full border border-[#e6eaee] bg-white px-3.5 text-[#9aa3ab] min-[480px]:w-[260px]">
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setPage(1)
              }}
              placeholder="بحث بالاسم أو البريد..."
              className="h-full w-full min-w-0 border-0 bg-transparent text-start text-base text-[#2c343b] outline-0 placeholder:text-[#b0b7bd] min-[681px]:text-[12px]"
            />
            <Search size={15} className="shrink-0" />
          </label>
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
            onClick={() => setDialog({ type: 'form', mode: 'create', person: null })}
          >
            إضافة مشرف
            <Plus size={15} strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 min-[1100px]:grid-cols-4" aria-label="ملخص المشرفين">
        {stats.map((item) => (
          <article key={item.label} className={cn(card, 'px-4 py-5 text-center')}>
            <p className="text-[12px] text-[#8d969e]">{item.label}</p>
            <p className={cn('mt-2.5 text-[30px] font-bold leading-none tracking-tight', item.accent ? 'text-[#2f9d45]' : 'text-[#1b2128]')}>
              {item.value}
            </p>
            <p className="mt-2 text-[11px] text-[#a3abb3]">{item.note}</p>
          </article>
        ))}
      </section>

      <section className={cn(card, 'overflow-hidden')}>
        <div className="flex flex-col items-stretch gap-3 px-4 py-3.5 min-[721px]:flex-row min-[721px]:items-center min-[721px]:justify-between">
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">قائمة المشرفين</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">
              {filtered.length} مشرف • مرتبة حسب آخر دخول
            </p>
          </div>
          <div className="relative self-start" ref={roleRef}>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#e6eaee] bg-white px-3.5 text-[12px] text-[#4d5760]"
              aria-expanded={roleOpen}
              aria-haspopup="listbox"
              onClick={() => setRoleOpen((open) => !open)}
            >
              <span>{role}</span>
              <ChevronDown size={14} className="text-[#8b949c]" />
            </button>
            {roleOpen && (
              <ul
                role="listbox"
                className="absolute end-0 z-10 mt-1.5 min-w-[190px] overflow-hidden rounded-xl border border-[#eef1f3] bg-white py-1 shadow-[0_8px_24px_rgb(20_30_40_/_8%)]"
              >
                {(['كل الأدوار', ...supervisorRoles] as const).map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={role === option}
                      className={cn(
                        'flex w-full items-center px-3 py-2 text-start text-[12px] text-[#3d4650] hover:bg-[#f6f7f8]',
                        role === option && 'bg-[#f4f6f8] font-semibold',
                      )}
                      onClick={() => {
                        setRole(option)
                        setPage(1)
                        setRoleOpen(false)
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-y border-[#f0f2f4]">
                {['المشرف', 'الدور', 'رقم الهاتف', 'آخر دخول', 'التحقق 2FA', 'الحالة', ''].map((heading) => (
                  <th key={heading || 'actions'} className="px-4 py-3 text-start text-[12px] font-medium text-[#9aa3ab]">
                    {heading === 'التحقق 2FA' ? (
                      <>التحقق <span dir="ltr">2FA</span></>
                    ) : heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-[13px] text-[#8d969e]">
                    لا يوجد مشرفون مطابقون
                  </td>
                </tr>
              )}
              {visible.map((person) => (
                <tr key={person.id} className="border-b border-[#f3f5f7] last:border-b-0">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-bold text-white"
                        style={{ backgroundColor: person.avatar }}
                      >
                        {person.initial}
                      </span>
                      <div className="min-w-0 text-start">
                        <p className="text-[13px] font-semibold leading-tight text-[#24303a]">{person.name}</p>
                        <p className="mt-0.5 text-start text-[11px] text-[#9aa3ab]"><span dir="ltr">{person.email}</span></p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold', roleBadgeClass[person.role])}>
                      {person.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-start text-[13px] text-[#5c6670]"><span dir="ltr">{person.phone}</span></td>
                  <td className="px-4 py-3.5 text-start text-[12px] text-[#6d7780]">{person.lastSeen}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn('inline-flex items-center gap-1 text-[12px] font-medium', person.twoFactor ? 'text-[#2f9d45]' : 'text-[#a0a7ae]')}>
                      {person.twoFactor && <Check size={13} strokeWidth={2.6} />}
                      {person.twoFactor ? 'مفعل' : 'غير مفعل'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        'inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold',
                        person.status === 'نشط' ? 'bg-[#e8f8ec] text-[#2f9d45]' : 'bg-[#fdecec] text-[#e25555]',
                      )}
                    >
                      <i className={cn('size-1.5 rounded-full', person.status === 'نشط' ? 'bg-[#2fbf5a]' : 'bg-[#e25555]')} />
                      {person.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button type="button" aria-label={`عرض ${person.name}`} className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8b949c] hover:bg-[#f4f6f8]" onClick={() => setDialog({ type: 'view', person })}>
                        <Eye size={15} />
                      </button>
                      <button type="button" aria-label={`تعديل ${person.name}`} className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8b949c] hover:bg-[#f4f6f8]" onClick={() => setDialog({ type: 'form', mode: 'edit', person })}>
                        <Pencil size={15} />
                      </button>
                      <button type="button" aria-label={`حذف ${person.name}`} className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#e15b5b] hover:bg-[#fdf4f4]" onClick={() => setDialog({ type: 'delete', person })}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-col items-stretch gap-3 border-t border-[#f0f2f4] px-4 py-3 min-[721px]:flex-row min-[721px]:items-center min-[721px]:justify-between">
          <p className="text-[12px] text-[#8d969e]">
            عرض {rangeStart}-{rangeEnd} من {filtered.length} مشرف
          </p>
          <div className="flex items-center gap-1.5 self-start" dir="ltr">
            <PagerButton
              pager={{
                label: 'التالي',
                disabled: currentPage >= pageCount,
                onClick: () => setPage(currentPage + 1),
              }}
            >
              <ChevronLeft size={15} />
            </PagerButton>
            {Array.from({ length: pageCount }, (_, index) => pageCount - index).map((number) => (
              <button
                key={number}
                type="button"
                aria-current={number === currentPage ? 'page' : undefined}
                className={cn(
                  'grid size-8 place-items-center rounded-lg border text-[12px] font-semibold',
                  number === currentPage
                    ? 'border-[#111315] bg-[#111315] text-white'
                    : 'border-[#e6eaee] bg-white text-[#4d5760] hover:bg-[#f6f7f8]',
                )}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
            <PagerButton
              pager={{
                label: 'السابق',
                disabled: currentPage <= 1,
                onClick: () => setPage(currentPage - 1),
              }}
            >
              <ChevronRight size={15} />
            </PagerButton>
          </div>
        </footer>
      </section>

      {dialog?.type === 'form' && (
        <SupervisorFormDialog
          dialog={{
            mode: dialog.mode,
            person: dialog.person,
            takenEmails: people.filter((item) => item.id !== dialog.person?.id).map((item) => item.email),
            onClose: () => setDialog(null),
            onSubmit: saveSupervisor,
          }}
        />
      )}
      {dialog?.type === 'view' && (
        <SupervisorViewDialog
          person={dialog.person}
          onClose={() => setDialog(null)}
          onEdit={() => setDialog({ type: 'form', mode: 'edit', person: dialog.person })}
        />
      )}
      {dialog?.type === 'delete' && (
        <SupervisorDeleteDialog
          person={dialog.person}
          onClose={() => setDialog(null)}
          onConfirm={() => deleteSupervisor(dialog.person)}
        />
      )}
    </div>
  )
}

function PagerButton({
  pager,
  children,
}: {
  pager: { label: string; disabled: boolean; onClick: () => void }
  children: ReactNode
}) {
  const { label, disabled, onClick } = pager
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-8 place-items-center rounded-lg border border-[#e6eaee] bg-white text-[#6d7780] enabled:hover:bg-[#f6f7f8] disabled:opacity-40"
    >
      {children}
    </button>
  )
}

type SupervisorDraft = {
  name: string
  email: string
  phone: string
  role: SupervisorRole
  status: Supervisor['status']
  twoFactor: boolean
}

function SupervisorFormDialog({ dialog }: {
  dialog: {
    mode: 'create' | 'edit'
    person: Supervisor | null
    takenEmails: string[]
    onClose: () => void
    onSubmit: (values: SupervisorDraft) => void
  }
}) {
  const { mode, person, takenEmails, onClose, onSubmit } = dialog
  const emails = takenEmails ?? []
  const titleId = useId()
  const [values, setValues] = useState<SupervisorDraft>({
    name: person?.name ?? '',
    email: person?.email ?? '',
    phone: person?.phone ?? '',
    role: person?.role ?? 'موظف إدخال الحوالات',
    status: person?.status ?? 'نشط',
    twoFactor: person?.twoFactor ?? false,
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({})

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const next: typeof errors = {}
    if (!values.name.trim()) next.name = 'أدخل اسم المشرف'
    if (!values.email.trim()) next.email = 'أدخل البريد'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'البريد غير صحيح'
    else if (emails.some((email) => email.toLowerCase() === values.email.trim().toLowerCase())) next.email = 'هذا البريد مستخدم لمشرف آخر'
    if (!values.phone.trim()) next.phone = 'أدخل رقم الهاتف'
    setErrors(next)
    if (Object.keys(next).length) return
    onSubmit(values)
  }

  return (
    <DialogShell shell={{ titleId, title: mode === 'edit' ? 'تعديل المشرف' : 'إضافة مشرف', subtitle: 'بيانات الحساب والدور وحالة الدخول', onClose }}>
      <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
        <DialogField label="الاسم" error={errors.name}>
          <input className={fieldClass} value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} />
        </DialogField>
        <div className="grid gap-3 min-[561px]:grid-cols-2">
          <DialogField label="البريد" error={errors.email}>
            <input className={fieldClass} dir="ltr" value={values.email} onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))} />
          </DialogField>
          <DialogField label="الهاتف" error={errors.phone}>
            <input className={fieldClass} dir="ltr" value={values.phone} onChange={(event) => setValues((current) => ({ ...current, phone: event.target.value }))} />
          </DialogField>
        </div>
        <div className="grid gap-3 min-[561px]:grid-cols-2">
          <div className="grid min-w-0 gap-1.5 text-start">
            <span className="text-[12px] font-semibold text-[#3d4650]">الدور</span>
            <FormSelect
              field={{
                ariaLabel: 'الدور',
                value: values.role,
                options: supervisorRoles.map((option) => ({ label: option, value: option })),
                onChange: (value) => setValues((current) => ({ ...current, role: value as SupervisorRole })),
                className: 'h-11 rounded-xl border border-[#e6eaee] bg-[#f7f8f9] text-[13px] text-[#2c343b] focus-within:border-[#3dcf5a] focus-within:bg-white',
              }}
            />
          </div>
          <div className="grid min-w-0 gap-1.5 text-start">
            <span className="text-[12px] font-semibold text-[#3d4650]">الحالة</span>
            <FormSelect
              field={{
                ariaLabel: 'الحالة',
                value: values.status,
                options: [{ label: 'نشط', value: 'نشط' }, { label: 'موقوف', value: 'موقوف' }],
                onChange: (value) => setValues((current) => ({ ...current, status: value as Supervisor['status'] })),
                className: 'h-11 rounded-xl border border-[#e6eaee] bg-[#f7f8f9] text-[13px] text-[#2c343b] focus-within:border-[#3dcf5a] focus-within:bg-white',
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#eef1f3] px-3 py-2.5">
          <div className="text-start">
            <p className="text-[13px] font-semibold text-[#2a3238]">التحقق بخطوتين</p>
            <p className="text-[11px] text-[#9aa3ab]">يطلب رمزًا إضافيًا عند تسجيل الدخول</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={values.twoFactor}
            aria-label="التحقق بخطوتين"
            className={cn('relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-0 p-0.5', values.twoFactor ? 'bg-[#3dcf5a]' : 'bg-[#e4e7ea]')}
            onClick={() => setValues((current) => ({ ...current, twoFactor: !current.twoFactor }))}
          >
            <span className={cn('absolute top-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(20_30_40_/_25%)]', values.twoFactor ? 'start-[22px]' : 'start-0.5')} />
          </button>
        </div>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="submit" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]">
            {mode === 'edit' ? 'حفظ التعديل' : 'إضافة المشرف'}
          </button>
          <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#e6eaee] bg-white px-4 text-[13px] font-semibold text-[#4d5760] hover:bg-[#f6f7f8]" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </form>
    </DialogShell>
  )
}

function SupervisorViewDialog({ person, onClose, onEdit }: { person: Supervisor; onClose: () => void; onEdit: () => void }) {
  const titleId = useId()
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const rows = [
    { label: 'البريد', value: person.email, ltr: true },
    { label: 'الهاتف', value: person.phone, ltr: true },
    { label: 'آخر دخول', value: person.lastSeen, ltr: false },
    { label: 'التحقق', value: person.twoFactor ? 'مفعل' : 'غير مفعل', ltr: false },
  ]

  return (
    <DialogShell shell={{ titleId, title: person.name, subtitle: 'بيانات حساب المشرف', onClose }}>
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full text-[18px] font-bold text-white" style={{ backgroundColor: person.avatar }}>
          {person.initial}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold', roleBadgeClass[person.role])}>{person.role}</span>
          <span className={cn('inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold', person.status === 'نشط' ? 'bg-[#e8f8ec] text-[#2f9d45]' : 'bg-[#fdecec] text-[#e25555]')}>
            {person.status}
          </span>
        </div>
      </div>
      <dl className="mt-4 grid gap-2">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3 rounded-xl bg-[#f7f8f9] px-3 py-2.5">
            <dt className="text-[12px] text-[#8b949c]">{row.label}</dt>
            <dd className="text-[13px] font-semibold text-[#24303a]" dir={row.ltr ? 'ltr' : undefined}>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]" onClick={onEdit}>
          تعديل
          <Pencil size={14} />
        </button>
        <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#e6eaee] bg-white px-4 text-[13px] font-semibold text-[#4d5760] hover:bg-[#f6f7f8]" onClick={onClose}>
          إغلاق
        </button>
      </div>
    </DialogShell>
  )
}

function SupervisorDeleteDialog({ person, onClose, onConfirm }: { person: Supervisor; onClose: () => void; onConfirm: () => void }) {
  const titleId = useId()
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <DialogShell shell={{ titleId, title: 'حذف المشرف', subtitle: 'لا يمكن التراجع عن هذا الإجراء', onClose }}>
      <p className="text-start text-[13px] leading-7 text-[#5c6670]">
        هل تريد حذف حساب <strong className="text-[#24303a]">{person.name}</strong>؟ سيختفي من قائمة المشرفين.
      </p>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#e25555] px-4 text-[13px] font-semibold text-white hover:bg-[#c94444]" onClick={onConfirm}>
          حذف
        </button>
        <button type="button" className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full border border-[#e6eaee] bg-white px-4 text-[13px] font-semibold text-[#4d5760] hover:bg-[#f6f7f8]" onClick={onClose}>
          إلغاء
        </button>
      </div>
    </DialogShell>
  )
}

function DialogShell({
  shell,
  children,
}: {
  shell: {
    titleId: string
    title: string
    subtitle: string
    onClose: () => void
  }
  children: ReactNode
}) {
  const { titleId, title, subtitle, onClose } = shell
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_38_48_/_42%)] p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} dir="rtl" className="w-[min(520px,calc(100vw-24px))] rounded-2xl border border-[#eef1f3] bg-white p-4 shadow-[0_22px_48px_rgb(20_32_42_/_18%)]">
        <header className="mb-4 flex items-start justify-between gap-3">
          <div className="text-start">
            <h2 id={titleId} className="text-[18px] font-bold text-[#1a2128]">{title}</h2>
            <p className="mt-0.5 text-[12px] text-[#8b949c]">{subtitle}</p>
          </div>
          <button type="button" aria-label="إغلاق" className="grid size-8 cursor-pointer place-items-center rounded-lg border border-[#e6eaee] text-[#6d767e] hover:bg-[#f6f7f8]" onClick={onClose}>
            <X size={15} />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}

function DialogField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-start">
      <span className="text-[12px] font-semibold text-[#3d4650]">{label}</span>
      {children}
      {error && <small className="text-[11px] text-[#e25555]">{error}</small>}
    </label>
  )
}

export default SupervisorsPage
