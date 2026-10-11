import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { CountryFormValues, ManagedCountry } from '../../data/countriesData'
import { formatMethodsList } from '../../data/countriesData'
import {
  createCountry,
  deleteCountry,
  getCountryStats,
  listCountries,
  updateCountry,
} from '../../services/countryService'
import { useToast } from '../../hooks/useToast'
import DeleteConfirmDialog from '../merchants/DeleteConfirmDialog'
import ToastStack from '../merchants/ToastStack'
import CountryFormModal from './CountryFormModal'

type StatusFilter = 'all' | 'active' | 'paused'

function CountriesPage() {
  const [countries, setCountries] = useState<ManagedCountry[]>([])
  const [stats, setStats] = useState({ total: 0, active: 0, activeMethods: 0, merchants: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [editing, setEditing] = useState<ManagedCountry | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<ManagedCountry | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toasts, pushToast, dismissToast } = useToast()

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [list, nextStats] = await Promise.all([listCountries(), getCountryStats()])
      setCountries(list)
      setStats(nextStats)
    } catch {
      pushToast('تعذر تحميل الدول', 'error')
    } finally {
      setLoading(false)
    }
  }, [pushToast])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return countries.filter((country) => {
      const matchesStatus =
        statusFilter === 'all'
        || (statusFilter === 'active' && country.status === 'active')
        || (statusFilter === 'paused' && country.status === 'paused')
      const haystack = `${country.name} ${country.code} ${country.currencyCode} ${country.currencyName}`.toLowerCase()
      const matchesSearch = !query || haystack.includes(query)
      return matchesStatus && matchesSearch
    })
  }, [countries, search, statusFilter])

  function openCreate() {
    setModalMode('create')
    setEditing(null)
    setModalOpen(true)
  }

  function openEdit(country: ManagedCountry) {
    setModalMode('edit')
    setEditing(country)
    setModalOpen(true)
  }

  async function handleSubmit(values: CountryFormValues) {
    setSaving(true)
    try {
      if (modalMode === 'edit' && editing) {
        await updateCountry(editing.id, values)
        pushToast('تم تحديث الدولة بنجاح', 'success')
      } else {
        await createCountry(values)
        pushToast('تمت إضافة الدولة بنجاح', 'success')
      }
      setModalOpen(false)
      await refresh()
    } catch (error) {
      const message = error instanceof Error && error.message === 'duplicate'
        ? 'اسم الدولة مستخدم مسبقًا'
        : 'حدث خطأ أثناء الحفظ'
      pushToast(message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCountry(deleteTarget.id)
      pushToast('تم حذف الدولة بنجاح', 'success')
      setDeleteTarget(null)
      await refresh()
    } catch {
      pushToast('حدث خطأ أثناء الحذف', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div
      className={cn(
        'grid w-full max-w-full min-w-0 grid-cols-[minmax(0,1fr)] gap-3 overflow-x-clip text-[#343b42]',
        '*:min-w-0 *:max-w-full',
      )}
      dir="rtl"
    >
      <header>
        <div>
          <h1
            className={cn(
              'text-[18px] font-bold leading-[1.4] text-[#232a30]',
              'min-[721px]:text-[21px]',
            )}
          >
            إدارة الدول
          </h1>
          <p className="mt-1 max-w-[52ch] text-[12px] leading-[1.6] text-[#8b939a]">
            الدول التي يتم استقبال الحوالات منها، عملاتها وطرق التحويل المتاحة بكل دولة
          </p>
        </div>
      </header>

      <div
        className={cn(
          'flex flex-col-reverse items-stretch gap-2.5',
          'min-[721px]:flex-row min-[721px]:items-center',
        )}
      >
        <label
          className={cn(
            'flex h-[38px] min-h-[42px] w-full min-w-0 flex-1 items-center gap-2 border border-[#e7eaed] bg-surface px-3 text-[#8a9299] rounded-sm',
            'min-[721px]:min-h-0',
          )}
        >
          <Search size={14} />
          <input
            className={cn(
              'w-full min-w-0 border-0 bg-transparent font-[inherit] text-base text-[#454e55] outline-0',
              'min-[721px]:text-[12px]',
            )}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث باسم الدولة أو العملة..."
          />
        </label>
        <button
          type="button"
          className={cn(
            'inline-flex min-h-[42px] w-full flex-none cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border border-ink-soft bg-ink-soft px-3.5 text-[12px] font-semibold text-white rounded-sm',
            'hover:bg-[#11171c]',
            'min-[721px]:min-h-[38px] min-[721px]:w-auto',
          )}
          onClick={openCreate}
        >
          <Plus size={14} />
          إضافة دولة
        </button>
      </div>

      <section
        className={cn(
          'grid grid-cols-1 gap-2',
          'min-[481px]:grid-cols-2 min-[481px]:gap-2.5',
          'min-[1024px]:grid-cols-4',
        )}
        aria-label="ملخص الدول"
      >
        <article
          className={cn(
            'grid min-h-[72px] min-w-0 content-center gap-1.5 border border-[#e8ecef] bg-surface px-3 py-2.5 rounded-sm',
            'min-[721px]:min-h-[78px] min-[721px]:px-3.5 min-[721px]:py-3',
          )}
        >
          <span className="text-[11px] text-[#858e95]">إجمالي الدول</span>
          <strong
            className={cn(
              'text-[18px] font-bold leading-[1.2] text-[#1f272e] tabular-nums',
              'min-[721px]:text-[22px]',
            )}
          >
            {stats.total}
          </strong>
        </article>
        <article
          className={cn(
            'grid min-h-[72px] min-w-0 content-center gap-1.5 border border-[#e8ecef] bg-surface px-3 py-2.5 rounded-sm',
            'min-[721px]:min-h-[78px] min-[721px]:px-3.5 min-[721px]:py-3',
          )}
        >
          <span className="text-[11px] text-[#858e95]">دول مفعلة</span>
          <strong
            className={cn(
              'text-[18px] font-bold leading-[1.2] text-[#1f272e] tabular-nums',
              'min-[721px]:text-[22px]',
            )}
          >
            {stats.active}
          </strong>
        </article>
        <article
          className={cn(
            'grid min-h-[72px] min-w-0 content-center gap-1.5 border border-[#e8ecef] bg-surface px-3 py-2.5 rounded-sm',
            'min-[721px]:min-h-[78px] min-[721px]:px-3.5 min-[721px]:py-3',
          )}
        >
          <span className="text-[11px] text-[#858e95]">طرق تحويل مفعلة</span>
          <strong
            className={cn(
              'text-[18px] font-bold leading-[1.2] text-[#1f272e] tabular-nums',
              'min-[721px]:text-[22px]',
            )}
          >
            {stats.activeMethods}
          </strong>
        </article>
        <article
          className={cn(
            'grid min-h-[72px] min-w-0 content-center gap-1.5 border border-[#e8ecef] bg-surface px-3 py-2.5 rounded-sm',
            'min-[721px]:min-h-[78px] min-[721px]:px-3.5 min-[721px]:py-3',
          )}
        >
          <span className="text-[11px] text-[#858e95]">تجار مرتبطون</span>
          <strong
            className={cn(
              'text-[18px] font-bold leading-[1.2] text-[#1f272e] tabular-nums',
              'min-[721px]:text-[22px]',
            )}
          >
            {stats.merchants}
          </strong>
        </article>
      </section>

      <section className="overflow-hidden border border-[#e7eaec] bg-surface rounded-md">
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-3 border-b border-[#edf0f2] px-3.5 py-3',
          )}
        >
          <div>
            <h2 className="text-[13px] font-bold text-[#343d44]">قائمة الدول</h2>
            <p className="mt-0.5 text-[11px] text-[#939ba1]">{filtered.length} دول، مرتبة حسب حجم الحوالات</p>
          </div>
          <div
            className={cn(
              'inline-flex w-full items-center justify-between gap-1 rounded-full bg-[#f3f5f6] p-[3px]',
              'min-[721px]:w-auto min-[721px]:justify-start',
            )}
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
                  'min-h-9 flex-1 cursor-pointer whitespace-nowrap rounded-full border-0 bg-transparent px-3 text-[11px] font-semibold text-[#6a737b]',
                  'min-[721px]:min-h-7 min-[721px]:flex-none',
                  statusFilter === value && 'bg-surface text-[#2d363d] shadow-[0_1px_3px_rgb(20_30_40_/_10%)]',
                )}
                onClick={() => setStatusFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain min-[721px]:block">
          <table
            className={cn(
              'w-[max(100%,860px)] min-w-[860px] border-collapse',
              'min-[1024px]:w-[max(100%,920px)] min-[1024px]:min-w-[920px]',
            )}
          >
            <thead>
              <tr>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">الدولة</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">العملة</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">طرق التحويل</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">عدد الطرق</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">التجار</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">حوالات الشهر</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">الحالة</th>
                <th className="whitespace-nowrap border-b border-[#edf0f2] bg-[#fafbfc] px-3 py-[11px] text-start align-middle text-[11px] font-medium text-[#929aa2]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="!px-3 !py-7 text-center text-[12px] text-[#929aa1]" colSpan={8}>جاري تحميل الدول...</td>
                </tr>
              )}
              {!loading && filtered.map((country) => {
                const activeMethods = country.methods.filter((method) => method.active).length
                return (
                  <tr key={country.id}>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">
                      <div className="inline-flex min-w-0 items-center gap-2">
                        <span className="grid size-7 place-items-center rounded-full bg-[#f3f5f6] text-[15px]" aria-hidden="true">{country.flag}</span>
                        <div>
                          <strong className="block text-[12px] font-bold text-[#2a3238]">{country.name}</strong>
                          <small className="mt-0.5 block text-[10px] text-[#91999f]">{country.code}</small>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">
                      <div>
                        <strong className="block text-[12px] font-bold text-[#2a3238]" dir="ltr">{country.currencyCode}</strong>
                        <small className="mt-0.5 block text-[10px] text-[#91999f]">{country.currencyName}</small>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">
                      <span className="inline-block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[#556068]" title={formatMethodsList(country.methods)}>
                        {formatMethodsList(country.methods)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">{activeMethods}</td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">{country.merchantsCount}</td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">{country.monthlyTransfers}</td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">
                      <CountryStatusBadge status={country.status} />
                    </td>
                    <td className="whitespace-nowrap border-b border-[#edf0f2] px-3 py-[11px] text-start align-middle text-[12px] text-[#3a434a]">
                      <div className="inline-flex items-center gap-[5px]">
                        <RowActionButton action={{ ariaLabel: `عرض ${country.name}`, title: 'عرض', onClick: () => openEdit(country) }}>
                          <Eye size={13} />
                        </RowActionButton>
                        <RowActionButton action={{ ariaLabel: `تعديل ${country.name}`, title: 'تعديل', onClick: () => openEdit(country) }}>
                          <Pencil size={13} />
                        </RowActionButton>
                        <RowActionButton action={{ ariaLabel: `حذف ${country.name}`, title: 'حذف', danger: true, onClick: () => setDeleteTarget(country) }}>
                          <Trash2 size={13} />
                        </RowActionButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="!px-3 !py-7 text-center text-[12px] text-[#929aa1]" colSpan={8}>لا توجد دول مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="grid gap-2 p-2.5 min-[721px]:hidden">
          {!loading && filtered.map((country) => (
            <article className="grid gap-2.5 border border-[#e8ecef] bg-surface p-3 rounded-sm" key={`card-${country.id}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="inline-flex min-w-0 items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-full bg-[#f3f5f6] text-[15px]" aria-hidden="true">{country.flag}</span>
                  <div>
                    <strong className="block text-[12px] font-bold text-[#2a3238]">{country.name}</strong>
                    <small className="mt-0.5 block text-[10px] text-[#91999f]">{country.code} · {country.currencyCode}</small>
                  </div>
                </div>
                <CountryStatusBadge status={country.status} />
              </div>
              <p className="inline-block max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap text-[#556068]">
                {formatMethodsList(country.methods)}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-[#7d868e]">
                <span>طرق: {country.methods.filter((method) => method.active).length}</span>
                <span>تجار: {country.merchantsCount}</span>
                <span>حوالات: {country.monthlyTransfers}</span>
              </div>
              <div className="inline-flex items-center gap-[5px]">
                <button
                  type="button"
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-[5px] border border-[#e7eaed] bg-surface text-[11px] text-[#68727a] rounded-[6px]"
                  onClick={() => openEdit(country)}
                >
                  <Eye size={14} /> عرض
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-[5px] border border-[#e7eaed] bg-surface text-[11px] text-[#68727a] rounded-[6px]"
                  onClick={() => openEdit(country)}
                >
                  <Pencil size={14} /> تعديل
                </button>
                <button
                  type="button"
                  className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-[5px] border border-[#f0c4c4] bg-[#fff7f7] text-[11px] text-danger rounded-[6px]"
                  onClick={() => setDeleteTarget(country)}
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside
        className="flex items-start gap-2.5 border border-[#d9e8f7] bg-[#f3f8fd] px-3.5 py-3 text-[12px] leading-[1.7] text-[#4d6f8f] rounded-[9px]"
        role="note"
      >
        <i className="mt-1.5 size-2 flex-none rounded-[2px] bg-[#4f8fd6]" />
        <p>الدول الموقوفة لا تظهر عند تسجيل حوالة جديدة، مع الاحتفاظ بجميع الحوالات السابقة الخاصة بكل دولة وليست قائمة عامة</p>
      </aside>

      <CountryFormModal
        dialog={{
          open: modalOpen,
          mode: modalMode,
          initial: editing,
          loading: saving,
          onClose: () => { if (!saving) setModalOpen(false) },
          onSubmit: handleSubmit,
        }}
      />

      <DeleteConfirmDialog
        dialog={{
          open: Boolean(deleteTarget),
          merchantName: deleteTarget?.name ?? '',
          loading: deleting,
          title: 'حذف الدولة',
          entityLabel: 'الدولة',
          onCancel: () => { if (!deleting) setDeleteTarget(null) },
          onConfirm: handleDelete,
        }}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function CountryStatusBadge({ status }: { status: ManagedCountry['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[5px] whitespace-nowrap rounded-full px-2 py-[3px] text-[10px] font-semibold',
        status === 'active' ? 'bg-[#eaf6e8] text-[#3f9a37]' : 'bg-[#fdebec] text-danger',
      )}
    >
      <i className="size-[5px] rounded-full bg-current" />
      {status === 'active' ? 'نشط' : 'موقوف'}
    </span>
  )
}

function RowActionButton({
  action,
  children,
}: {
  action: {
    ariaLabel: string
    title: string
    danger?: boolean
    onClick: () => void
  }
  children: ReactNode
}) {
  const { ariaLabel, title, danger, onClick } = action
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={title}
      className={cn(
        'inline-flex size-7 cursor-pointer items-center justify-center border bg-surface rounded-[6px]',
        danger
          ? 'border-[#f0c4c4] bg-[#fff7f7] text-danger'
          : 'border-[#e7eaed] text-[#68727a]',
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default CountriesPage
