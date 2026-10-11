import { useMemo, useState, type FormEvent } from 'react'
import { Check, Pencil, Plus, Search, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { initialPayoutMethods, type PayoutMethod } from '@/data/paymentMethodsData'

type StatusFilter = 'all' | 'active' | 'paused'
type Dialog =
  | { kind: 'closed' }
  | { kind: 'create' }
  | { kind: 'edit'; method: PayoutMethod }
  | { kind: 'delete'; method: PayoutMethod }
  | { kind: 'success'; name: string }

function todayLabel() {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${now.getFullYear()}`
}

function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PayoutMethod[]>(initialPayoutMethods)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [dialog, setDialog] = useState<Dialog>({ kind: 'closed' })

  const stats = useMemo(() => {
    const active = methods.filter((method) => method.status === 'active').length
    const paused = methods.length - active
    const addedThisMonth = methods.filter((method) => method.addedThisMonth).length
    return { total: methods.length, active, paused, addedThisMonth }
  }, [methods])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return methods.filter((method) => {
      const matchesStatus = statusFilter === 'all' || method.status === statusFilter
      const matchesSearch = !query || method.name.toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [methods, search, statusFilter])

  function saveMethod(name: string, active: boolean) {
    const status = active ? 'active' : 'paused'
    if (dialog.kind === 'edit') {
      setMethods((list) => list.map((method) => (
        method.id === dialog.method.id ? { ...method, name, status } : method
      )))
      setDialog({ kind: 'closed' })
      return
    }
    setMethods((list) => [
      ...list,
      {
        id: `pm-${Date.now()}`,
        name,
        addedOn: todayLabel(),
        status,
        addedThisMonth: true,
      },
    ])
    setDialog({ kind: 'success', name })
  }

  function confirmDelete() {
    if (dialog.kind !== 'delete') return
    setMethods((list) => list.filter((method) => method.id !== dialog.method.id))
    setDialog({ kind: 'closed' })
  }

  return (
    <div className="grid gap-4 text-[#1c242b]" dir="rtl">
      <header className="flex flex-col items-stretch gap-3 min-[721px]:flex-row min-[721px]:items-start min-[721px]:justify-between">
        <div className="min-w-0 text-start">
          <h1 className="text-[26px] font-bold leading-[1.3] text-[#1a2128] min-[721px]:text-[30px]">وسائل الدفع</h1>
          <p className="mt-1 text-[12px] text-[#8b949c]">
            وسائل الدفع المتاحة عند تسجيل الحوالات — اسم الوسيلة وحالتها فقط
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 min-[521px]:w-auto min-[521px]:flex-row min-[521px]:items-center">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-[#e6e9ec] bg-white px-3.5 text-[#9aa3ab] min-[521px]:w-[240px]">
            <Search size={15} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="بحث باسم الوسيلة..."
              className="h-full w-full min-w-0 border-0 bg-transparent p-0 text-base text-[#2c343b] outline-0 placeholder:text-[#b0b6bc] min-[681px]:text-[12px]"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#111315] px-4 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
            onClick={() => setDialog({ kind: 'create' })}
          >
            <span>إضافة وسيلة</span>
            <Plus size={15} strokeWidth={2.4} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-2 min-[721px]:grid-cols-4" aria-label="ملخص وسائل الدفع">
        <StatCard label="إجمالي الوسائل" value={stats.total} />
        <StatCard label="وسائل مفعلة" value={stats.active} tone="green" />
        <StatCard label="وسائل موقوفة" value={stats.paused} />
        <StatCard label="أضيفت هذا الشهر" value={stats.addedThisMonth} />
      </section>

      <section className="overflow-hidden rounded-[12px] border border-[#eceff2] bg-white shadow-[0_1px_2px_rgb(20_30_40_/_4%)]">
        <div className="flex flex-col items-stretch gap-3 px-4 py-4 min-[721px]:min-h-[83px] min-[721px]:flex-row min-[721px]:items-center min-[721px]:justify-between min-[721px]:px-9">
          <div className="text-start">
            <h2 className="text-[18px] font-bold leading-[1.3] text-[#202a30]">قائمة وسائل الدفع</h2>
            <p className="mt-0.5 text-[12px] text-[#7d858c]">
              {stats.total} وسائل · {stats.active} مفعلة · {stats.paused} موقوفة
            </p>
          </div>
          <div
            className="inline-flex w-full items-center gap-1 self-start rounded-lg bg-[#f3f4f6] p-1 min-[721px]:w-auto"
            role="tablist"
            aria-label="تصفية الحالة"
          >
            {([
              ['all', 'الكل'],
              ['active', 'مفعلة'],
              ['paused', 'موقوفة'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={statusFilter === value}
                className={cn(
                  'h-7 flex-1 cursor-pointer rounded-md border-0 px-3 text-[12px] font-semibold transition-colors min-[721px]:flex-none',
                  statusFilter === value
                    ? 'bg-white text-black'
                    : 'bg-transparent text-[#6d767e] hover:bg-white hover:text-black',
                )}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table dir="rtl" className="w-full min-w-[640px] table-fixed border-collapse">
            <colgroup>
              <col className="w-[30%]" />
              <col className="w-[40%]" />
              <col className="w-[16%]" />
              <col className="w-[14%]" />
            </colgroup>
            <thead>
              <tr className="bg-[#f7f8f9]">
                {['وسيلة الدفع', 'تاريخ الإضافة', 'الحالة', 'إجراءات'].map((heading) => (
                  <th
                    key={heading}
                    className={cn(
                      'px-5 py-2 text-[10px] font-medium text-[#7f878d]',
                      heading === 'وسيلة الدفع' && 'text-right',
                      (heading === 'تاريخ الإضافة' || heading === 'الحالة') && 'text-center',
                      heading === 'إجراءات' && 'text-left',
                    )}
                    dir={heading === 'إجراءات' ? 'ltr' : undefined}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-[13px] text-[#8d969e]">
                    لا توجد وسائل مطابقة
                  </td>
                </tr>
              )}
              {filtered.map((method) => (
                <tr key={method.id} className="border-t border-[#f0f2f4]">
                  <td className="px-5 py-[14px] text-start text-[12px] font-semibold text-[#15191c]">{method.name}</td>
                  <td className="px-5 py-[14px] text-center text-[12px] text-[#4d5358]">{method.addedOn}</td>
                  <td className="px-5 py-[14px] text-center">
                    <StatusBadge status={method.status} />
                  </td>
                  <td className="px-5 py-[14px] text-start">
                    <div dir="ltr" className="flex w-full items-center justify-start gap-1">
                      <button
                        type="button"
                        className="grid size-7 cursor-pointer place-items-center rounded-[9px] border-0 bg-[#f1f1f1] text-[#f02d2d] hover:bg-[#e8e8e8]"
                        aria-label={`حذف ${method.name}`}
                        onClick={() => setDialog({ kind: 'delete', method })}
                      >
                        <Trash2 size={14} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className="grid size-7 cursor-pointer place-items-center rounded-[9px] border-0 bg-[#f1f1f1] text-[#3d4348] hover:bg-[#e8e8e8]"
                        aria-label={`تعديل ${method.name}`}
                        onClick={() => setDialog({ kind: 'edit', method })}
                      >
                        <Pencil size={14} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(dialog.kind === 'create' || dialog.kind === 'edit') && (
        <MethodFormModal
          dialog={{
            mode: dialog.kind,
            method: dialog.kind === 'edit' ? dialog.method : null,
            onClose: () => setDialog({ kind: 'closed' }),
            onSave: saveMethod,
          }}
        />
      )}
      {dialog.kind === 'delete' && (
        <DeleteMethodModal
          name={dialog.method.name}
          onClose={() => setDialog({ kind: 'closed' })}
          onConfirm={confirmDelete}
        />
      )}
      {dialog.kind === 'success' && (
        <SuccessModal
          name={dialog.name}
          onOk={() => setDialog({ kind: 'closed' })}
          onAddAnother={() => setDialog({ kind: 'create' })}
        />
      )}
    </div>
  )
}

function StatCard({ label, value, tone = 'ink' }: { label: string; value: number; tone?: 'ink' | 'green' }) {
  return (
    <article className="grid min-h-[58px] content-center justify-items-start gap-1 rounded-[9px] border border-[#eceff2] bg-white px-3 py-2 text-start shadow-[0_1px_2px_rgb(20_30_40_/_3%)]">
      <span className="text-[9px] text-[#8b949c]">{label}</span>
      <strong className={cn('text-[20px] font-bold leading-none tabular-nums', tone === 'green' ? 'text-[#1fa34a]' : 'text-[#1c242b]')}>
        {value}
      </strong>
    </article>
  )
}

function StatusBadge({ status }: { status: PayoutMethod['status'] }) {
  const active = status === 'active'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[12px] font-semibold leading-[18px]',
        active ? 'bg-[#e8f5e5] text-[#247a16]' : 'bg-[#fde9e9] text-[#e11d1d]',
      )}
    >
      <span className={cn('size-2 rounded-full', active ? 'bg-[#2fbf32]' : 'bg-[#ef4444]')} />
      {active ? 'نشط' : 'موقوف'}
    </span>
  )
}

function MethodFormModal({ dialog }: {
  dialog: {
    mode: 'create' | 'edit'
    method: PayoutMethod | null
    onClose: () => void
    onSave: (name: string, active: boolean) => void
  }
}) {
  const { mode, method, onClose, onSave } = dialog
  const [name, setName] = useState(method?.name ?? '')
  const [active, setActive] = useState(method ? method.status === 'active' : true)
  const [error, setError] = useState('')
  const editing = mode === 'edit'

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const next = name.trim()
    if (!next) {
      setError('اسم الوسيلة مطلوب')
      return
    }
    onSave(next, active)
  }

  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_36_44_/_46%)] p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <form
        className="w-[min(520px,100%)] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgb(16_24_32_/_22%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-form-title"
        dir="rtl"
        onSubmit={handleSubmit}
      >
        <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
          <div className="text-start">
            <h2 id="pm-form-title" className="text-[18px] font-bold text-[#1c242b]">
              {editing ? 'تعديل وسيلة الدفع' : 'إضافة وسيلة دفع'}
            </h2>
            <p className="mt-1 text-[12px] text-[#8d969e]">
              {editing ? 'عدّل اسم الوسيلة أو حالتها' : 'أضف وسيلة جديدة لاستقبال الحوالات'}
            </p>
          </div>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg border border-[#eceff2] bg-[#f7f8f9] text-[#7a848c]"
            aria-label="إغلاق"
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </header>
        <div className="grid gap-4 border-t border-[#eef1f3] px-5 py-4">
          <label className="grid gap-2 text-start">
            <span className="text-[13px] font-semibold text-[#2c343b]">
              اسم الوسيلة <span className="text-[#e14b4b]">*</span>
            </span>
            <input
              value={name}
              onChange={(event) => { setName(event.target.value); setError('') }}
              placeholder="مثال: Vodafone Cash"
              className="h-11 w-full rounded-xl border border-[#e6eaee] bg-[#f7f8f9] px-3 text-center text-base text-[#2c343b] outline-0 placeholder:text-[#b7bdc3] focus:border-[#cfd6dc] focus:bg-white min-[681px]:text-[13px]"
            />
            {error && <span className="text-[11px] text-[#e14b4b]">{error}</span>}
          </label>
          <div className="flex items-center justify-between gap-3">
            <div className="text-start">
              <div className="text-[13px] font-semibold text-[#2c343b]">تفعيل الوسيلة</div>
              <p className="mt-0.5 text-[11px] text-[#8d969e]">الوسيلة الموقوفة لا تظهر في قائمة الوسائل عند تسجيل حوالة</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={active}
              aria-label="تفعيل الوسيلة"
              className={cn('relative h-7 w-12 shrink-0 cursor-pointer rounded-full border-0 p-0.5 transition-colors', active ? 'bg-[#3dcf5a]' : 'bg-[#e4e7ea]')}
              onClick={() => setActive((value) => !value)}
            >
              <span
                className={cn(
                  'absolute top-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgb(20_30_40_/_25%)] transition-[inset-inline-start]',
                  active ? 'start-[22px]' : 'start-0.5',
                )}
              />
            </button>
          </div>
        </div>
        <footer className="flex items-center justify-center gap-2.5 border-t border-[#eef1f3] px-5 py-4" dir="ltr">
          <button
            type="button"
            className="h-10 min-w-[92px] cursor-pointer rounded-xl border-0 bg-[#f1f3f4] px-5 text-[13px] font-semibold text-[#5c666e] hover:bg-[#e7eaec]"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="h-10 min-w-[132px] cursor-pointer rounded-xl border-0 bg-[#111315] px-5 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
          >
            {editing ? 'حفظ التعديلات' : 'إضافة الوسيلة'}
          </button>
        </footer>
      </form>
    </div>
  )
}

function DeleteMethodModal({
  name,
  onClose,
  onConfirm,
}: {
  name: string
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_36_44_/_46%)] p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <section
        className="w-[min(440px,100%)] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgb(16_24_32_/_22%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-delete-title"
        dir="rtl"
      >
        <div className="relative px-6 pt-5 pb-4 text-center">
          <button
            type="button"
            className="absolute start-4 top-4 grid size-8 cursor-pointer place-items-center rounded-lg border border-[#eceff2] bg-[#f7f8f9] text-[#7a848c]"
            aria-label="إغلاق"
            onClick={onClose}
          >
            <X size={15} />
          </button>
          <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#fdecec] text-[#ef4d4d]">
            <Trash2 size={20} />
          </div>
          <h2 id="pm-delete-title" className="mt-3 text-[18px] font-bold text-[#1c242b]">حذف وسيلة الدفع؟</h2>
          <p className="mx-auto mt-2 max-w-[34ch] text-[12px] leading-[1.8] text-[#8a939b]">
            سيتم حذف وسيلة «<span dir="ltr">{name}</span>» نهائيًا من النظام. الحوالات السابقة المسجلة بهذه الوسيلة لن تتأثر.
          </p>
        </div>
        <footer className="flex items-center justify-center gap-2 border-t border-[#eef1f3] px-5 py-3.5" dir="ltr">
          <button
            type="button"
            className="h-10 min-w-[92px] cursor-pointer rounded-xl border-0 bg-[#f1f3f4] px-5 text-[13px] font-semibold text-[#5c666e] hover:bg-[#e7eaec]"
            onClick={onClose}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="h-10 min-w-[120px] cursor-pointer rounded-xl border-0 bg-[#e53935] px-5 text-[13px] font-semibold text-white hover:bg-[#d32f2c]"
            onClick={onConfirm}
          >
            حذف الوسيلة
          </button>
        </footer>
      </section>
    </div>
  )
}

function SuccessModal({
  name,
  onOk,
  onAddAnother,
}: {
  name: string
  onOk: () => void
  onAddAnother: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[rgb(28_36_44_/_46%)] p-4"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onOk() }}
    >
      <section
        className="w-[min(420px,100%)] rounded-2xl bg-white px-6 pt-7 pb-5 text-center shadow-[0_24px_60px_rgb(16_24_32_/_22%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pm-success-title"
        dir="rtl"
      >
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-[#e8f8ec] text-[#22b14c] ring-8 ring-[#f3fbf5]">
          <span className="grid size-10 place-items-center rounded-full bg-[#2fbe4e] text-white">
            <Check size={22} strokeWidth={3} />
          </span>
        </div>
        <h2 id="pm-success-title" className="mt-4 text-[18px] font-bold text-[#1c242b]">تمت الإضافة بنجاح</h2>
        <p className="mx-auto mt-2 max-w-[32ch] text-[12px] leading-[1.8] text-[#8a939b]">
          تمت إضافة وسيلة الدفع «<span dir="ltr">{name}</span>» إلى النظام بنجاح، ويمكنك الآن استخدامها.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2" dir="ltr">
          <button
            type="button"
            className="h-10 flex-1 cursor-pointer rounded-xl border-0 bg-[#f1f3f4] px-3 text-[13px] font-semibold text-[#5c666e] hover:bg-[#e7eaec]"
            onClick={onAddAnother}
          >
            إضافة وسيلة أخرى
          </button>
          <button
            type="button"
            className="h-10 flex-1 cursor-pointer rounded-xl border-0 bg-[#111315] px-3 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
            onClick={onOk}
          >
            حسناً
          </button>
        </div>
      </section>
    </div>
  )
}

export default PaymentMethodsPage
