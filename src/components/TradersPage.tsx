import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Merchant } from '../data/merchantsData'
import { useToast } from '../hooks/useToast'
import {
  deleteMerchant,
  listMerchants,
} from '../services/merchantService'
import FormSelect from './ui/FormSelect'
import AddMerchantPage from './merchants/add/AddMerchantPage'
import DeleteConfirmDialog from './merchants/DeleteConfirmDialog'
import MerchantAddSuccessModal from './merchants/MerchantAddSuccessModal'
import MerchantDetailsPage from './merchants/details/MerchantDetailsPage'
import SettlementsHistoryPage from './merchants/settlements/SettlementsHistoryPage'
import ToastStack from './merchants/ToastStack'
import './TradersPage.css'
import './merchants/MerchantUi.css'
import './merchants/MerchantResponsive.css'

const countries = ['مصر', 'السعودية', 'الإمارات', 'تركيا', 'الأردن', 'عُمان']

type MerchantView =
  | { kind: 'list' }
  | { kind: 'create' }
  | { kind: 'edit'; merchantId: number }
  | { kind: 'details'; merchantId: number; tab?: 'transfers' | 'settlements'; settlementId?: string | null }
  | { kind: 'settlements'; merchantId: number }

function parseMerchantPath(pathname: string): MerchantView {
  if (pathname === '/merchants/new' || pathname === '/merchants/new/') {
    return { kind: 'create' }
  }
  const editMatch = pathname.match(/^\/merchants\/(\d+)\/edit\/?$/)
  if (editMatch) {
    return { kind: 'edit', merchantId: Number(editMatch[1]) }
  }
  const settlementsMatch = pathname.match(/^\/merchants\/(\d+)\/settlements\/?$/)
  if (settlementsMatch) {
    return { kind: 'settlements', merchantId: Number(settlementsMatch[1]) }
  }
  const detailsMatch = pathname.match(/^\/merchants\/(\d+)\/?$/)
  if (detailsMatch) {
    return { kind: 'details', merchantId: Number(detailsMatch[1]) }
  }
  return { kind: 'list' }
}

function pathForView(view: MerchantView) {
  if (view.kind === 'create') return '/merchants/new'
  if (view.kind === 'edit') return `/merchants/${view.merchantId}/edit`
  if (view.kind === 'settlements') return `/merchants/${view.merchantId}/settlements`
  if (view.kind === 'details') return `/merchants/${view.merchantId}`
  return '/merchants'
}

function TradersPage() {
  const [view, setView] = useState<MerchantView>(() => parseMerchantPath(window.location.pathname))
  const [merchants, setMerchants] = useState<Merchant[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('كل الدول')
  const [status, setStatus] = useState('كل الحالات')
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Merchant | null>(null)
  const [createdSuccess, setCreatedSuccess] = useState<{ id: number; name: string } | null>(null)
  const { toasts, pushToast, dismissToast } = useToast()

  const refreshMerchants = useCallback(async () => {
    setLoadingList(true)
    try {
      const data = await listMerchants()
      setMerchants(data)
    } catch {
      pushToast('تعذر تحميل قائمة التجار', 'error')
    } finally {
      setLoadingList(false)
    }
  }, [pushToast])

  useEffect(() => {
    void refreshMerchants()
  }, [refreshMerchants])

  const navigateView = useCallback((next: MerchantView, replace = false) => {
    setView(next)
    const path = pathForView(next)
    if (window.location.pathname !== path) {
      if (replace) window.history.replaceState({ merchantView: next }, '', path)
      else window.history.pushState({ merchantView: next }, '', path)
    }
  }, [])

  useEffect(() => {
    if (!window.location.pathname.startsWith('/merchants')) {
      navigateView({ kind: 'list' }, true)
      return
    }
    setView(parseMerchantPath(window.location.pathname))
  }, [navigateView])

  useEffect(() => {
    function onPopState() {
      setView(parseMerchantPath(window.location.pathname))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const filteredMerchants = useMemo(() => merchants.filter((merchant) => {
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${merchant.name} ${merchant.phone}`.toLowerCase().includes(query)
    return matchesSearch
      && (country === 'كل الدول' || merchant.country === country)
      && (status === 'كل الحالات' || merchant.status === status)
  }), [merchants, search, country, status])

  const pageCount = Math.max(1, Math.ceil(filteredMerchants.length / 10))
  const currentPage = Math.min(page, pageCount)
  const visibleMerchants = filteredMerchants.slice((currentPage - 1) * 10, currentPage * 10)

  useEffect(() => {
    if (page > pageCount) setPage(pageCount)
  }, [page, pageCount])

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMerchant(deleteTarget.id)
      await refreshMerchants()
      pushToast('تم حذف التاجر بنجاح', 'success')
      setDeleteTarget(null)
    } catch {
      pushToast('حدث خطأ أثناء حذف التاجر', 'error')
    } finally {
      setDeleting(false)
    }
  }

  function exportMerchants() {
    const header = ['اسم التاجر', 'الدولة', 'رقم الهاتف', 'العملة', 'العمولة', 'عدد الحوالات', 'الرصيد', 'الحالة']
    const rows = filteredMerchants.map((merchant) => [
      merchant.name, merchant.country, merchant.phone, merchant.currency,
      merchant.commission, merchant.transfers, merchant.balance, merchant.status,
    ])
    const csv = [header, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'merchants.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (view.kind === 'create' || view.kind === 'edit') {
    return (
      <AddMerchantPage
        mode={view.kind === 'edit' ? 'edit' : 'create'}
        merchantId={view.kind === 'edit' ? view.merchantId : undefined}
        onBackToList={() => {
          navigateView({ kind: 'list' })
          void refreshMerchants()
        }}
        onSuccess={(result) => {
          void refreshMerchants()
          if (view.kind === 'create') {
            navigateView({ kind: 'list' })
            setCreatedSuccess(result)
            return
          }
          navigateView({ kind: 'details', merchantId: result.id })
        }}
      />
    )
  }

  if (view.kind === 'settlements') {
    return (
      <SettlementsHistoryPage
        merchantId={view.merchantId}
        onBackToDetails={() => navigateView({ kind: 'details', merchantId: view.merchantId })}
        onBackToMerchants={() => {
          navigateView({ kind: 'list' })
          void refreshMerchants()
        }}
        onViewTransfers={(settlementId) => {
          navigateView({
            kind: 'details',
            merchantId: view.merchantId,
            tab: 'transfers',
            settlementId,
          })
        }}
      />
    )
  }

  if (view.kind === 'details') {
    return (
      <MerchantDetailsPage
        merchantId={view.merchantId}
        initialTab={view.tab}
        highlightSettlementId={view.settlementId}
        onBack={() => {
          navigateView({ kind: 'list' })
          void refreshMerchants()
        }}
        onViewSettlementsHistory={() => navigateView({ kind: 'settlements', merchantId: view.merchantId })}
      />
    )
  }

  return (
    <div className="traders-page" dir="rtl">
      <div className="traders-heading">
        <div><h1>إدارة التجار</h1><p>اختر التجار المسجلين لإدارة حساباتهم ومتابعة نشاطهم المالي بكل سهولة</p></div>
        <div className="traders-heading-actions">
          <button type="button" className="traders-primary-button" onClick={() => navigateView({ kind: 'create' })}><Plus size={14} />إضافة تاجر</button>
          <button type="button" className="traders-tool-button" onClick={exportMerchants}><Download size={13} />تصدير Excel</button>
        </div>
      </div>

      <section className="merchant-metrics" aria-label="ملخص التجار">
        <Metric label="إجمالي التجار" value={String(merchants.length)} detail="٦ دول" accent="green" />
        <Metric label="تجار نشطون" value={String(merchants.filter((merchant) => merchant.status === 'نشط').length)} detail={`${merchants.filter((merchant) => merchant.status === 'موقوف').length} موقوف`} accent="green" />
        <Metric label="أرصدة قيد التسوية" value="$ 18,420" detail="١٤ تاجر" accent="orange" />
        <Metric label="متوسط العمولة" value="2.1%" detail="نسبة ثابتة" accent="plain" />
      </section>

      <section className="merchant-list-panel">
        <div className="merchant-list-heading">
          <div><h2>قائمة التجار</h2><p>{merchants.length} تاجر مسجل</p></div>
          <span className="merchant-live-count"><i />{merchants.filter((merchant) => merchant.status === 'نشط').length} نشط</span>
        </div>
        <div className="merchant-filters">
          <label className="merchant-search">
            <Search size={13} />
            <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="بحث باسم التاجر أو الهاتف..." />
          </label>
          <FormSelect className="merchant-select" ariaLabel="الدولة" value={country} onChange={(value) => { setCountry(value); setPage(1) }} options={['كل الدول', ...countries].map((item) => ({ label: item, value: item }))} />
          <FormSelect className="merchant-select" ariaLabel="حالة التاجر" value={status} onChange={(value) => { setStatus(value); setPage(1) }} options={['كل الحالات', 'نشط', 'موقوف'].map((item) => ({ label: item, value: item }))} />
          <button type="button" className="merchant-filter-shortcut" onClick={() => { setCountry('كل الدول'); setStatus('كل الحالات'); setSearch(''); setPage(1) }}>كل الفلاتر <ChevronDown size={12} /></button>
        </div>
        <div className="merchant-table-scroll merchant-desktop-table">
          <table className="merchant-table">
            <thead><tr><th>اسم التاجر</th><th>الدولة</th><th>رقم الهاتف</th><th>العمولة</th><th>عدد الحوالات</th><th>الرصيد</th><th>آخر نشاط</th><th>الحالة</th><th>إجراءات</th></tr></thead>
            <tbody>
              {loadingList && (
                <tr><td className="merchant-empty" colSpan={9}>جاري تحميل التجار...</td></tr>
              )}
              {!loadingList && visibleMerchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td className="merchant-name" title={merchant.name}>{merchant.name}</td>
                  <td>{merchant.country}</td>
                  <td className="merchant-phone">{merchant.phone}</td>
                  <td>{merchant.commission}</td>
                  <td>{merchant.transfers}</td>
                  <td className="merchant-balance">{merchant.balance}</td>
                  <td>{merchant.lastActivity}</td>
                  <td><span className={`merchant-status ${merchant.status === 'نشط' ? 'is-active' : 'is-paused'}`}><i />{merchant.status}</span></td>
                  <td>
                    <div className="merchant-row-actions">
                      <button type="button" title="حذف التاجر" aria-label={`حذف ${merchant.name}`} disabled={deleting} onClick={() => setDeleteTarget(merchant)}><Trash2 size={11} /></button>
                      <button type="button" title="تعديل التاجر" aria-label={`تعديل ${merchant.name}`} onClick={() => navigateView({ kind: 'edit', merchantId: merchant.id })}><Pencil size={11} /></button>
                      <button type="button" title="عرض التفاصيل" aria-label={`عرض ${merchant.name}`} onClick={() => navigateView({ kind: 'details', merchantId: merchant.id })}><Eye size={11} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loadingList && filteredMerchants.length === 0 && (
                <tr><td className="merchant-empty" colSpan={9}>لا توجد نتائج مطابقة</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="merchant-mobile-cards" aria-label="قائمة التجار">
          {loadingList && <div className="merchant-card"><strong>جاري تحميل التجار...</strong></div>}
          {!loadingList && visibleMerchants.map((merchant) => (
            <article key={merchant.id} className="merchant-card">
              <div className="merchant-card-head">
                <strong title={merchant.name}>{merchant.name}</strong>
                <span className={`merchant-status ${merchant.status === 'نشط' ? 'is-active' : 'is-paused'}`}><i />{merchant.status}</span>
              </div>
              <div className="merchant-card-grid">
                <div className="merchant-card-field"><span>الدولة</span><b>{merchant.country}</b></div>
                <div className="merchant-card-field"><span>الهاتف</span><b dir="ltr" title={merchant.phone}>{merchant.phone}</b></div>
                <div className="merchant-card-field"><span>العمولة</span><b>{merchant.commission}</b></div>
                <div className="merchant-card-field"><span>الحوالات</span><b>{merchant.transfers}</b></div>
                <div className="merchant-card-field"><span>الرصيد</span><b className="merchant-balance" dir="ltr">{merchant.balance}</b></div>
                <div className="merchant-card-field"><span>آخر نشاط</span><b>{merchant.lastActivity}</b></div>
              </div>
              <div className="merchant-card-actions">
                <button type="button" title="عرض التفاصيل" aria-label={`عرض ${merchant.name}`} onClick={() => navigateView({ kind: 'details', merchantId: merchant.id })}><Eye size={14} /><span>عرض</span></button>
                <button type="button" title="تعديل التاجر" aria-label={`تعديل ${merchant.name}`} onClick={() => navigateView({ kind: 'edit', merchantId: merchant.id })}><Pencil size={14} /><span>تعديل</span></button>
                <button type="button" className="is-danger" title="حذف التاجر" aria-label={`حذف ${merchant.name}`} disabled={deleting} onClick={() => setDeleteTarget(merchant)}><Trash2 size={14} /><span>حذف</span></button>
              </div>
            </article>
          ))}
          {!loadingList && filteredMerchants.length === 0 && (
            <div className="merchant-card"><strong>لا توجد نتائج مطابقة</strong></div>
          )}
        </div>

        <div className="merchant-table-footer">
          <span>عرض {filteredMerchants.length ? (currentPage - 1) * 10 + 1 : 0} - {Math.min(currentPage * 10, filteredMerchants.length)} من {filteredMerchants.length} تاجر</span>
          <div className="merchant-pagination">
            <button type="button" aria-label="الصفحة السابقة" onClick={() => setPage(Math.max(1, currentPage - 1))}><ChevronRight size={12} /></button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button type="button" className={`page-num ${currentPage === index + 1 ? 'is-current' : ''}`} key={index + 1} onClick={() => setPage(index + 1)}>{index + 1}</button>
            ))}
            <span className="merchant-pagination-mobile">{currentPage} / {pageCount}</span>
            <button type="button" aria-label="الصفحة التالية" onClick={() => setPage(Math.min(pageCount, currentPage + 1))}><ChevronLeft size={12} /></button>
          </div>
        </div>
      </section>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        merchantName={deleteTarget?.name ?? ''}
        loading={deleting}
        onCancel={() => { if (!deleting) setDeleteTarget(null) }}
        onConfirm={handleConfirmDelete}
      />

      <MerchantAddSuccessModal
        open={Boolean(createdSuccess)}
        merchantName={createdSuccess?.name ?? ''}
        onClose={() => setCreatedSuccess(null)}
        onViewMerchant={() => {
          if (!createdSuccess) return
          const id = createdSuccess.id
          setCreatedSuccess(null)
          navigateView({ kind: 'details', merchantId: id })
        }}
        onAddAnother={() => {
          setCreatedSuccess(null)
          navigateView({ kind: 'create' })
        }}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function Metric({ label, value, detail, accent }: { label: string; value: string; detail: string; accent: 'green' | 'orange' | 'plain' }) {
  return <article className="merchant-metric"><span>{label}</span><strong className={`metric-${accent}`}>{value}</strong><small>{detail}</small></article>
}

export default TradersPage
