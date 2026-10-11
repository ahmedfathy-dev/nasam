import { useMemo, useState } from 'react'
import { Check, CheckCheck, Lock, Plus, Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import {
  initialRoles,
  permissionActions,
  permissionSections,
  type AppRole,
  type PermissionCell,
  type PermissionRow,
} from '@/data/rolesData'

const card = 'rounded-2xl border border-[#eef1f3] bg-white'

function countCells(matrix: PermissionRow[]) {
  let enabled = 0
  let available = 0
  matrix.forEach((row) => {
    row.forEach((cell) => {
      if (cell === 'na') return
      available += 1
      if (cell === 'on') enabled += 1
    })
  })
  return { enabled, available }
}

function RolesPage() {
  const [roles, setRoles] = useState<AppRole[]>(initialRoles)
  const [selectedId, setSelectedId] = useState('accountant')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState<'name' | 'about'>('name')
  const [savedId, setSavedId] = useState<string | null>(null)

  const selected = roles.find((role) => role.id === selectedId) ?? roles[0]
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return roles
    return roles.filter((role) => `${role.name} ${role.description}`.toLowerCase().includes(needle))
  }, [query, roles])

  const supervisorTotal = roles.reduce((sum, role) => sum + role.supervisors, 0)
  const stats = selected ? countCells(selected.matrix) : { enabled: 0, available: 0 }

  function updateRole(id: string, patch: Partial<AppRole>) {
    setRoles((current) => current.map((role) => (role.id === id ? { ...role, ...patch } : role)))
  }

  function toggleCell(sectionIndex: number, actionIndex: number) {
    if (!selected || selected.system) return
    const matrix = selected.matrix.map((row) => [...row] as PermissionRow)
    const cell = matrix[sectionIndex][actionIndex]
    if (cell === 'na') return
    matrix[sectionIndex][actionIndex] = cell === 'on' ? 'off' : 'on'
    updateRole(selected.id, { matrix })
    setSavedId(null)
  }

  function allowAllPermissions() {
    if (!selected || selected.system) return
    const matrix = selected.matrix.map((row) =>
      row.map((cell) => (cell === 'na' ? 'na' : 'on')) as PermissionRow,
    )
    updateRole(selected.id, { matrix })
    setSavedId(null)
  }

  function clearAllPermissions() {
    if (!selected || selected.system) return
    const matrix = selected.matrix.map((row) =>
      row.map((cell) => (cell === 'na' ? 'na' : 'off')) as PermissionRow,
    )
    updateRole(selected.id, { matrix })
    setSavedId(null)
  }

  function saveRole() {
    if (!selected || selected.system) return
    updateRole(selected.id, { updatedAt: '11 أكتوبر 2026', updatedBy: 'أحمد علي' })
    setSavedId(selected.id)
  }

  function deleteRole() {
    if (!selected || selected.system) return
    const next = roles.filter((role) => role.id !== selected.id)
    setRoles(next)
    setSelectedId(next[0]?.id ?? '')
    setSavedId(null)
  }

  function addRole() {
    const id = `role-${Date.now()}`
    const created: AppRole = {
      id,
      name: 'دور جديد',
      description: 'وصف الصلاحيات لهذا الدور',
      initial: 'د',
      color: '#64748b',
      supervisors: 0,
      updatedAt: '11 أكتوبر 2026',
      updatedBy: 'أحمد علي',
      matrix: permissionSections.map(() => ['off', 'off', 'off', 'off', 'off', 'off']),
    }
    setRoles((current) => [...current, created])
    setSelectedId(id)
    setTab('about')
    setQuery('')
    setSavedId(null)
  }

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.25] text-[#1a2128] min-[721px]:text-[30px]">الأدوار والصلاحيات</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">حدد ما يمكن لكل دور الوصول إليه وتنفيذه داخل النظام</p>
        </div>
        <button
          type="button"
          onClick={addRole}
          className="inline-flex h-10 items-center justify-center gap-1.5 self-start rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
        >
          إضافة دور
          <Plus size={15} strokeWidth={2.4} />
        </button>
      </header>

      <div className="grid items-start gap-3 min-[721px]:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
        <section className={cn(card, 'grid min-w-0 gap-3 overflow-hidden p-4')}>
          <div className="text-start">
            <h2 className="text-[16px] font-bold text-[#24303a]">الأدوار</h2>
            <p className="mt-0.5 text-[11px] text-[#9aa2a9]">{roles.length} أدوار · {supervisorTotal} مشرف</p>
          </div>
          <label className="flex h-9 items-center gap-2 rounded-full border border-[#e6eaee] bg-white px-3 text-[#9aa3ab]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="بحث عن دور..."
              className="h-full w-full min-w-0 border-0 bg-transparent text-start text-base text-[#2c343b] outline-0 placeholder:text-[#b0b7bd] min-[681px]:text-[12px]"
            />
            <Search size={14} className="shrink-0" />
          </label>
          <ul className="grid gap-1.5">
            {filtered.length === 0 && (
              <li className="px-2 py-6 text-center text-[12px] text-[#9aa3ab]">لا توجد أدوار مطابقة</li>
            )}
            {filtered.map((role) => {
              const active = role.id === selected?.id
              return (
                <li key={role.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(role.id)
                      setTab('name')
                    }}
                    className={cn(
                      'flex w-full min-w-0 items-center gap-2.5 rounded-xl border px-2.5 py-2.5 text-start',
                      active
                        ? 'border-[#b7e7c4] bg-[#f3fbf5]'
                        : 'border-transparent hover:bg-[#f7f8f9]',
                    )}
                  >
                    <span
                      className="grid size-9 shrink-0 place-items-center rounded-full text-[14px] font-bold text-white"
                      style={{ backgroundColor: role.color }}
                    >
                      {role.initial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span className="truncate text-[13px] font-semibold text-[#24303a]">{role.name}</span>
                        {role.system && (
                          <span className="shrink-0 rounded-full bg-[#f1f2f4] px-1.5 py-0.5 text-[10px] font-medium text-[#8b939c]">نظامي</span>
                        )}
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-[11px] leading-[1.45] text-[#9aa3ab]">{role.description}</span>
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[11px] text-[#9aa3ab]">{role.supervisors} مشرف</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="rounded-xl border border-[#f3e6c8] bg-[#fdf8ee] px-3 py-2.5 text-start">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[#c48a2a]">
              <Lock size={13} />
              دور Super Admin محمي
            </p>
            <p className="mt-1 text-[11px] leading-5 text-[#a08a62]">
              لا يمكن تعديل صلاحياته أو حذفه، ويجب أن يبقى مشرف واحد على الأقل بهذا الدور.
            </p>
          </div>
        </section>

        {selected && (
          <section className={cn(card, 'min-w-0 p-4')}>
            <div className="flex flex-col items-stretch gap-3 min-[1100px]:flex-row min-[1100px]:items-start min-[1100px]:justify-between">
              <div className="text-start">
                <h2 className="text-[20px] font-bold text-[#1a2128]">{selected.name}</h2>
                <p className="mt-1 text-[12px] text-[#9aa3ab]">
                  {selected.supervisors} مشرف بهذا الدور · آخر تعديل {selected.updatedAt} بواسطة {selected.updatedBy}
                </p>
              </div>
              <div className="flex w-full min-w-0 flex-wrap items-center gap-2 self-start min-[1100px]:w-auto min-[1100px]:flex-nowrap">
                <button
                  type="button"
                  disabled={selected.system}
                  onClick={saveRole}
                  className="inline-flex h-9 min-w-[120px] flex-1 items-center justify-center whitespace-nowrap rounded-full bg-[#111315] px-3.5 text-[12px] font-semibold text-white enabled:hover:bg-[#292d2f] disabled:cursor-not-allowed disabled:opacity-40 min-[1100px]:min-w-0 min-[1100px]:flex-none"
                >
                  {savedId === selected.id ? 'تم الحفظ' : 'حفظ الصلاحيات'}
                </button>
                <button
                  type="button"
                  disabled={selected.system}
                  onClick={deleteRole}
                  className="inline-flex h-9 min-w-[120px] flex-1 items-center justify-center whitespace-nowrap rounded-full border border-[#f0c2c2] bg-white px-3.5 text-[12px] font-semibold text-[#e15b5b] enabled:hover:bg-[#fdf6f6] disabled:cursor-not-allowed disabled:opacity-40 min-[1100px]:min-w-0 min-[1100px]:flex-none"
                >
                  حذف الدور
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <TabButton active={tab === 'name'} onClick={() => setTab('name')}>{selected.name}</TabButton>
              <TabButton active={tab === 'about'} onClick={() => setTab('about')}>الوصف</TabButton>
            </div>

            {tab === 'about' ? (
              <div className="mt-4 grid max-w-xl gap-3 text-start">
                <label className="grid gap-1.5 text-[12px] text-[#6d7780]">
                  اسم الدور
                  <input
                    value={selected.name}
                    disabled={selected.system}
                    onChange={(event) => updateRole(selected.id, { name: event.target.value, initial: event.target.value.trim().slice(0, 1) || 'د' })}
                    className="h-10 rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 text-[13px] text-[#24303a] outline-0 focus:border-[#b7e7c4] focus:bg-white disabled:opacity-60"
                  />
                </label>
                <label className="grid gap-1.5 text-[12px] text-[#6d7780]">
                  الوصف
                  <textarea
                    value={selected.description}
                    disabled={selected.system}
                    rows={4}
                    onChange={(event) => updateRole(selected.id, { description: event.target.value })}
                    className="resize-none rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 py-2 text-[13px] text-[#24303a] outline-0 focus:border-[#b7e7c4] focus:bg-white disabled:opacity-60"
                  />
                </label>
              </div>
            ) : (
              <div className="mt-4">
                <div className="mb-2 grid gap-2 min-[560px]:grid-cols-2">
                  <button
                    type="button"
                    disabled={selected.system}
                    onClick={allowAllPermissions}
                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#b7e7c4] bg-[#f3fbf5] px-3 py-2 text-[12px] font-semibold text-[#23823d] transition-colors hover:bg-[#e8f7ec] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CheckCheck size={15} aria-hidden="true" />
                    السماح بكل الصلاحيات
                  </button>
                  <button
                    type="button"
                    disabled={selected.system}
                    onClick={clearAllPermissions}
                    className="inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#f0c2c2] bg-white px-3 py-2 text-[12px] font-semibold text-[#d94b4b] transition-colors hover:bg-[#fdf6f6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <X size={15} aria-hidden="true" />
                    إلغاء كل الصلاحيات
                  </button>
                </div>
                <div>
                  <div className="grid grid-cols-[minmax(72px,1.15fr)_repeat(6,minmax(0,1fr))] border-b border-[#f0f2f4] px-1 py-2">
                    <span className="text-start text-[12px] font-medium text-[#9aa3ab]">القسم</span>
                    {permissionActions.map((action) => (
                      <span key={action.key} className="text-center text-[12px] font-medium text-[#9aa3ab]">{action.label}</span>
                    ))}
                  </div>
                  {permissionSections.map((section, sectionIndex) => (
                    <div
                      key={section}
                      className="grid grid-cols-[minmax(72px,1.15fr)_repeat(6,minmax(0,1fr))] items-center border-b border-[#f4f6f8] px-1 py-2.5 last:border-b-0"
                    >
                      <span className="text-start text-[13px] font-semibold text-[#2c343c]">{section}</span>
                      {selected.matrix[sectionIndex].map((cell, actionIndex) => (
                        <span key={permissionActions[actionIndex].key} className="grid place-items-center">
                          <PermissionMark
                            cell={cell}
                            label={`${section} — ${permissionActions[actionIndex].label}`}
                            disabled={Boolean(selected.system)}
                            onToggle={() => toggleCell(sectionIndex, actionIndex)}
                          />
                        </span>
                      ))}
                    </div>
                  ))}
                  <p className="px-1 pt-3 text-start text-[12px] text-[#9aa3ab]">
                    {stats.enabled} صلاحية مفعّلة من {stats.available}
                    <span className="mx-2 text-[#c5ccd3]">—</span>
                    غير متاح لهذا القسم
                  </p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-8 rounded-lg px-3 text-[12px] font-medium',
        active ? 'bg-[#f2f3f5] text-[#24303a]' : 'text-[#8b949c] hover:bg-[#f7f8f9]',
      )}
    >
      {children}
    </button>
  )
}

function PermissionMark({
  cell,
  label,
  disabled,
  onToggle,
}: {
  cell: PermissionCell
  label: string
  disabled: boolean
  onToggle: () => void
}) {
  if (cell === 'na') {
    return <span className="text-[14px] text-[#c5ccd3]" aria-label={`${label}: غير متاح`}>—</span>
  }
  const on = cell === 'on'
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'grid size-[18px] place-items-center',
        on ? 'rounded-[4px] bg-[#3dcf5a] text-white' : 'rounded-[4px] border border-[#d5dbe1] bg-white',
        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      {on && <Check size={12} strokeWidth={3} />}
    </button>
  )
}

export default RolesPage
