import { useCallback, useEffect, useMemo, useState } from 'react'
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
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
import './CountriesPage.css'

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
    <div className="countries-page" dir="rtl">
      <header className="co-heading">
        <div>
          <h1>إدارة الدول</h1>
          <p>الدول التي يتم استقبال الحوالات منها، عملاتها وطرق التحويل المتاحة بكل دولة</p>
        </div>
      </header>

      <div className="co-toolbar">
        <label className="co-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث باسم الدولة أو العملة..."
          />
        </label>
        <button type="button" className="co-primary-btn" onClick={openCreate}>
          <Plus size={14} />
          إضافة دولة
        </button>
      </div>

      <section className="co-metrics" aria-label="ملخص الدول">
        <article className="co-metric">
          <span>إجمالي الدول</span>
          <strong>{stats.total}</strong>
        </article>
        <article className="co-metric">
          <span>دول مفعلة</span>
          <strong>{stats.active}</strong>
        </article>
        <article className="co-metric">
          <span>طرق تحويل مفعلة</span>
          <strong>{stats.activeMethods}</strong>
        </article>
        <article className="co-metric">
          <span>تجار مرتبطون</span>
          <strong>{stats.merchants}</strong>
        </article>
      </section>

      <section className="co-panel">
        <div className="co-panel-head">
          <div>
            <h2>قائمة الدول</h2>
            <p>{filtered.length} دول، مرتبة حسب حجم الحوالات</p>
          </div>
          <div className="co-tabs" role="tablist" aria-label="تصفية الحالة">
            <button type="button" role="tab" aria-selected={statusFilter === 'all'} className={statusFilter === 'all' ? 'is-active' : ''} onClick={() => setStatusFilter('all')}>الكل</button>
            <button type="button" role="tab" aria-selected={statusFilter === 'active'} className={statusFilter === 'active' ? 'is-active' : ''} onClick={() => setStatusFilter('active')}>مفعلة</button>
            <button type="button" role="tab" aria-selected={statusFilter === 'paused'} className={statusFilter === 'paused' ? 'is-active' : ''} onClick={() => setStatusFilter('paused')}>موقوفة</button>
          </div>
        </div>

        <div className="co-table-scroll">
          <table className="co-table">
            <thead>
              <tr>
                <th>الدولة</th>
                <th>العملة</th>
                <th>طرق التحويل</th>
                <th>عدد الطرق</th>
                <th>التجار</th>
                <th>حوالات الشهر</th>
                <th>الحالة</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="co-empty" colSpan={8}>جاري تحميل الدول...</td>
                </tr>
              )}
              {!loading && filtered.map((country) => {
                const activeMethods = country.methods.filter((method) => method.active).length
                return (
                  <tr key={country.id}>
                    <td>
                      <div className="co-country-cell">
                        <span className="co-flag" aria-hidden="true">{country.flag}</span>
                        <div>
                          <strong>{country.name}</strong>
                          <small>{country.code}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="co-stack-cell">
                        <strong dir="ltr">{country.currencyCode}</strong>
                        <small>{country.currencyName}</small>
                      </div>
                    </td>
                    <td>
                      <span className="co-methods-text" title={formatMethodsList(country.methods)}>
                        {formatMethodsList(country.methods)}
                      </span>
                    </td>
                    <td>{activeMethods}</td>
                    <td>{country.merchantsCount}</td>
                    <td>{country.monthlyTransfers}</td>
                    <td>
                      <span className={`co-status ${country.status === 'active' ? 'is-active' : 'is-paused'}`}>
                        <i />
                        {country.status === 'active' ? 'نشط' : 'موقوف'}
                      </span>
                    </td>
                    <td>
                      <div className="co-row-actions">
                        <button type="button" aria-label={`عرض ${country.name}`} title="عرض" onClick={() => openEdit(country)}>
                          <Eye size={13} />
                        </button>
                        <button type="button" aria-label={`تعديل ${country.name}`} title="تعديل" onClick={() => openEdit(country)}>
                          <Pencil size={13} />
                        </button>
                        <button type="button" className="is-danger" aria-label={`حذف ${country.name}`} title="حذف" onClick={() => setDeleteTarget(country)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="co-empty" colSpan={8}>لا توجد دول مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="co-mobile-cards">
          {!loading && filtered.map((country) => (
            <article className="co-card" key={`card-${country.id}`}>
              <div className="co-card-head">
                <div className="co-country-cell">
                  <span className="co-flag" aria-hidden="true">{country.flag}</span>
                  <div>
                    <strong>{country.name}</strong>
                    <small>{country.code} · {country.currencyCode}</small>
                  </div>
                </div>
                <span className={`co-status ${country.status === 'active' ? 'is-active' : 'is-paused'}`}>
                  <i />
                  {country.status === 'active' ? 'نشط' : 'موقوف'}
                </span>
              </div>
              <p className="co-methods-text">{formatMethodsList(country.methods)}</p>
              <div className="co-card-meta">
                <span>طرق: {country.methods.filter((method) => method.active).length}</span>
                <span>تجار: {country.merchantsCount}</span>
                <span>حوالات: {country.monthlyTransfers}</span>
              </div>
              <div className="co-row-actions">
                <button type="button" onClick={() => openEdit(country)}><Eye size={14} /> عرض</button>
                <button type="button" onClick={() => openEdit(country)}><Pencil size={14} /> تعديل</button>
                <button type="button" className="is-danger" onClick={() => setDeleteTarget(country)}><Trash2 size={14} /> حذف</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="co-info-banner" role="note">
        <i />
        <p>الدول الموقوفة لا تظهر عند تسجيل حوالة جديدة، مع الاحتفاظ بجميع الحوالات السابقة الخاصة بكل دولة وليست قائمة عامة</p>
      </aside>

      <CountryFormModal
        open={modalOpen}
        mode={modalMode}
        initial={editing}
        loading={saving}
        onClose={() => { if (!saving) setModalOpen(false) }}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        merchantName={deleteTarget?.name ?? ''}
        loading={deleting}
        title="حذف الدولة"
        entityLabel="الدولة"
        onCancel={() => { if (!deleting) setDeleteTarget(null) }}
        onConfirm={handleDelete}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default CountriesPage
