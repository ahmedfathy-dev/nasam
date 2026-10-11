import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, Download, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'
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
import {
  merchantCard,
  merchantCardActions,
  merchantCardField,
  merchantCardGrid,
  merchantCardHead,
  merchantDesktopTable,
  merchantMobileCards,
  merchantStatusActive,
  merchantStatusPaused,
  pageShell,
  stickyFirstCol,
  stickyFirstColHead,
  tradersPrimaryButton,
  tradersToolButton,
} from './merchants/merchantTw'

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
        page={{
          mode: view.kind === 'edit' ? 'edit' : 'create',
          merchantId: view.kind === 'edit' ? view.merchantId : undefined,
          onBackToList: () => {
            navigateView({ kind: 'list' })
            void refreshMerchants()
          },
          onSuccess: (result) => {
            void refreshMerchants()
            if (view.kind === 'create') {
              navigateView({ kind: 'list' })
              setCreatedSuccess(result)
              return
            }
            navigateView({ kind: 'details', merchantId: result.id })
          },
        }}
      />
    )
  }

  if (view.kind === 'settlements') {
    return (
      <SettlementsHistoryPage
        screen={{
          merchantId: view.merchantId,
          onBackToDetails: () => navigateView({ kind: 'details', merchantId: view.merchantId }),
          onBackToMerchants: () => {
            navigateView({ kind: 'list' })
            void refreshMerchants()
          },
          onViewTransfers: (settlementId) => {
            navigateView({
              kind: 'details',
              merchantId: view.merchantId,
              tab: 'transfers',
              settlementId,
            })
          },
        }}
      />
    )
  }

  if (view.kind === 'details') {
    return (
      <MerchantDetailsPage
        page={{
          merchantId: view.merchantId,
          initialTab: view.tab,
          highlightSettlementId: view.settlementId,
          onBack: () => {
            navigateView({ kind: 'list' })
            void refreshMerchants()
          },
          onViewSettlementsHistory: () => navigateView({ kind: 'settlements', merchantId: view.merchantId }),
        }}
      />
    )
  }

  return (
    <div className={cn('traders-page', pageShell, 'text-[#343b42]')} dir="rtl">
      <div
        className={cn(
          'traders-heading mb-3 flex min-h-0 flex-col items-stretch gap-[11px]',
          'min-[640px]:min-h-[63px] min-[640px]:flex-row min-[640px]:items-start min-[640px]:gap-4',
          'min-[1024px]:items-center',
        )}
      >
        <div>
          <h1
            className={cn(
              'text-[18px] font-semibold leading-[1.5] text-[#232a30]',
              'min-[640px]:text-[19px] min-[1024px]:text-[21px]',
            )}
          >
            إدارة التجار
          </h1>
          <p
            className={cn(
              'mt-0.5 max-w-full text-[10px] text-[#8b939a]',
              'min-[1024px]:text-[11px]',
            )}
          >
            اختر التجار المسجلين لإدارة حساباتهم ومتابعة نشاطهم المالي بكل سهولة
          </p>
        </div>
        <div
          className={cn(
            'traders-heading-actions flex w-full flex-wrap items-center gap-[5px] [direction:rtl]',
            'min-[640px]:w-auto min-[1024px]:gap-2 min-[1024px]:[direction:ltr]',
          )}
        >
          <button
            type="button"
            className={cn(tradersPrimaryButton, 'max-[639px]:flex-1')}
            onClick={() => navigateView({ kind: 'create' })}
          >
            <Plus size={14} />إضافة تاجر
          </button>
          <button
            type="button"
            className={cn(tradersToolButton, 'max-[639px]:flex-1')}
            onClick={exportMerchants}
          >
            <Download size={13} />تصدير Excel
          </button>
        </div>
      </div>

      <section
        className={cn(
          'merchant-metrics mb-3 grid grid-cols-1 gap-2',
          'min-[640px]:grid-cols-2 min-[640px]:gap-2',
          'min-[1024px]:grid-cols-4 min-[1024px]:gap-[9px]',
        )}
        aria-label="ملخص التجار"
      >
        <Metric metric={{ label: 'إجمالي التجار', value: String(merchants.length), detail: '٦ دول', accent: 'green' }} />
        <Metric metric={{ label: 'تجار نشطون', value: String(merchants.filter((merchant) => merchant.status === 'نشط').length), detail: `${merchants.filter((merchant) => merchant.status === 'موقوف').length} موقوف`, accent: 'green' }} />
        <Metric metric={{ label: 'أرصدة قيد التسوية', value: '$ 18,420', detail: '١٤ تاجر', accent: 'orange' }} />
        <Metric metric={{ label: 'متوسط العمولة', value: '2.1%', detail: 'نسبة ثابتة', accent: 'plain' }} />
      </section>

      <section
        className={cn(
          'merchant-list-panel flex min-h-0 flex-col rounded-sm border border-[#e7eaec] bg-white px-2 pb-[7px]',
          'min-[640px]:px-2 min-[1024px]:min-h-[calc(100dvh-244px)] min-[1024px]:px-2.5',
        )}
      >
        <div className="merchant-list-heading flex min-h-[47px] items-center justify-between border-b border-[#edf0f2]">
          <div>
            <h2 className="text-[11px] font-semibold text-[#343d44]">قائمة التجار</h2>
            <p className="mt-px text-[9px] text-[#939ba1]">{merchants.length} تاجر مسجل</p>
          </div>
          <span className="merchant-live-count inline-flex items-center gap-1 whitespace-nowrap text-[9px] text-[#3f9a37]">
            <i className="size-[5px] rounded-full bg-current" />
            {merchants.filter((merchant) => merchant.status === 'نشط').length} نشط
          </span>
        </div>
        <div
          className={cn(
            'merchant-filters grid grid-cols-2 gap-[7px] border-b border-[#edf0f2] py-2',
            'min-[640px]:grid-cols-3',
            'min-[1024px]:grid-cols-[minmax(190px,1fr)_minmax(110px,0.43fr)_minmax(110px,0.43fr)_auto]',
          )}
        >
          <label
            className={cn(
              'col-span-full flex h-10 min-w-0 items-center gap-1.5 rounded-[6px]',
              'border border-[#e7eaed] bg-[#f8f9fa] px-2 text-[#929aa1]',
              'transition-[border-color,background-color,box-shadow] duration-150',
              'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
              'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
              'min-[640px]:h-9',
            )}
          >
            <Search size={13} />
            <input
              className="w-full min-w-0 border-0 bg-transparent text-base text-[#5d666d] outline-0 min-[640px]:text-[10px]"
              value={search}
              onChange={(event) => { setSearch(event.target.value); setPage(1) }}
              placeholder="بحث باسم التاجر أو الهاتف..."
            />
          </label>
          <FormSelect
            field={{
              className: cn(
                'h-10 min-w-0 rounded-[6px] border border-[#e7eaed] bg-[#f8f9fa] p-0 text-[#929aa1]',
                'transition-[border-color,background-color,box-shadow] duration-150',
                'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
                'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
                '[&_.form-select-trigger]:!px-[9px] [&_.form-select-trigger]:!text-[10px]',
                'min-[640px]:h-9',
              ),
              ariaLabel: 'الدولة',
              value: country,
              onChange: (value) => { setCountry(value); setPage(1) },
              options: ['كل الدول', ...countries].map((item) => ({ label: item, value: item })),
            }}
          />
          <FormSelect
            field={{
              className: cn(
                'h-10 min-w-0 rounded-[6px] border border-[#e7eaed] bg-[#f8f9fa] p-0 text-[#929aa1]',
                'transition-[border-color,background-color,box-shadow] duration-150',
                'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
                'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
                '[&_.form-select-trigger]:!px-[9px] [&_.form-select-trigger]:!text-[10px]',
                'min-[640px]:h-9',
              ),
              ariaLabel: 'حالة التاجر',
              value: status,
              onChange: (value) => { setStatus(value); setPage(1) },
              options: ['كل الحالات', 'نشط', 'موقوف'].map((item) => ({ label: item, value: item })),
            }}
          />
          <button
            type="button"
            className={cn(
              'merchant-filter-shortcut col-span-full flex h-10 min-w-0 items-center justify-center',
              'rounded-[6px] border border-[#e7eaed] bg-[#f8f9fa] px-2.5 text-[9px] text-[#5d666d]',
              'whitespace-nowrap min-[640px]:h-9 min-[1024px]:col-span-1',
            )}
            onClick={() => { setCountry('كل الدول'); setStatus('كل الحالات'); setSearch(''); setPage(1) }}
          >
            كل الفلاتر <ChevronDown size={12} />
          </button>
        </div>
        <div className={cn('merchant-table-scroll flex-1 overflow-auto max-lg:overscroll-x-contain', merchantDesktopTable)}>
          <table className="merchant-table w-full min-w-[860px] border-collapse whitespace-nowrap">
            <thead className="bg-[#fafbfc]">
              <tr>
                <th className={cn('h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]', stickyFirstColHead)}>اسم التاجر</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">الدولة</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">رقم الهاتف</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">العمولة</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">عدد الحوالات</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">الرصيد</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">آخر نشاط</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">الحالة</th>
                <th className="h-[38px] border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa1]">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {loadingList && (
                <tr>
                  <td className="merchant-empty !h-[120px] !text-center !text-[#929aa1]" colSpan={9}>جاري تحميل التجار...</td>
                </tr>
              )}
              {!loadingList && visibleMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-[#fafcfd]">
                  <td className={cn('merchant-name h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] font-semibold text-[#343d44]', stickyFirstCol)} title={merchant.name}>{merchant.name}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">{merchant.country}</td>
                  <td className="merchant-phone h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64] [direction:ltr]">{merchant.phone}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">{merchant.commission}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">{merchant.transfers}</td>
                  <td className="merchant-balance h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#d58521] [direction:ltr]">{merchant.balance}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">{merchant.lastActivity}</td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">
                    <span className={merchant.status === 'نشط' ? merchantStatusActive : merchantStatusPaused}>
                      <i className="size-[5px] rounded-full bg-current" />{merchant.status}
                    </span>
                  </td>
                  <td className="h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]">
                    <div className="merchant-row-actions flex items-center gap-[3px] [direction:ltr]">
                      <button type="button" title="حذف التاجر" aria-label={`حذف ${merchant.name}`} disabled={deleting} onClick={() => setDeleteTarget(merchant)} className="grid size-10 place-items-center rounded border border-[#e8ecef] bg-white text-[#df5252] hover:border-[#d5dde2] hover:bg-[#f8fafb] min-[640px]:size-[22px] min-[640px]:rounded"><Trash2 size={11} /></button>
                      <button type="button" title="تعديل التاجر" aria-label={`تعديل ${merchant.name}`} onClick={() => navigateView({ kind: 'edit', merchantId: merchant.id })} className="grid size-10 place-items-center rounded border border-[#e8ecef] bg-white text-[#879097] hover:border-[#d5dde2] hover:bg-[#f8fafb] min-[640px]:size-[22px] min-[640px]:rounded"><Pencil size={11} /></button>
                      <button type="button" title="عرض التفاصيل" aria-label={`عرض ${merchant.name}`} onClick={() => navigateView({ kind: 'details', merchantId: merchant.id })} className="grid size-10 place-items-center rounded border border-[#e8ecef] bg-white text-[#879097] hover:border-[#d5dde2] hover:bg-[#f8fafb] min-[640px]:size-[22px] min-[640px]:rounded"><Eye size={11} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loadingList && filteredMerchants.length === 0 && (
                <tr>
                  <td className="merchant-empty !h-[120px] !text-center !text-[#929aa1]" colSpan={9}>لا توجد نتائج مطابقة</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={merchantMobileCards} aria-label="قائمة التجار">
          {loadingList && <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">جاري تحميل التجار...</strong></div>}
          {!loadingList && visibleMerchants.map((merchant) => (
            <article key={merchant.id} className={merchantCard}>
              <div className={merchantCardHead}>
                <strong className="merchant-name min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-bold text-[#343d44] max-[639px]:[overflow-wrap:anywhere]" title={merchant.name}>{merchant.name}</strong>
                <span className={merchant.status === 'نشط' ? merchantStatusActive : merchantStatusPaused}>
                  <i className="size-[5px] rounded-full bg-current" />{merchant.status}
                </span>
              </div>
              <div className={merchantCardGrid}>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الدولة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{merchant.country}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الهاتف</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]" dir="ltr" title={merchant.phone}>{merchant.phone}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">العمولة</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{merchant.commission}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الحوالات</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{merchant.transfers}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">الرصيد</span><b className="merchant-balance overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#d58521]" dir="ltr">{merchant.balance}</b></div>
                <div className={merchantCardField}><span className="text-[9px] text-text-muted">آخر نشاط</span><b className="overflow-hidden text-ellipsis whitespace-nowrap text-[11px] font-semibold text-[#454e55]">{merchant.lastActivity}</b></div>
              </div>
              <div className={merchantCardActions}>
                <button type="button" title="عرض التفاصيل" aria-label={`عرض ${merchant.name}`} onClick={() => navigateView({ kind: 'details', merchantId: merchant.id })} className="inline-flex min-h-10 min-w-10 flex-1 items-center justify-center gap-[5px] rounded-[6px] border border-[#e8ecef] bg-white text-[10px] text-[#68727a]"><Eye size={14} /><span>عرض</span></button>
                <button type="button" title="تعديل التاجر" aria-label={`تعديل ${merchant.name}`} onClick={() => navigateView({ kind: 'edit', merchantId: merchant.id })} className="inline-flex min-h-10 min-w-10 flex-1 items-center justify-center gap-[5px] rounded-[6px] border border-[#e8ecef] bg-white text-[10px] text-[#68727a]"><Pencil size={14} /><span>تعديل</span></button>
                <button type="button" className="is-danger inline-flex min-h-10 min-w-10 flex-1 items-center justify-center gap-[5px] rounded-[6px] border border-[#e8ecef] bg-white text-[10px] text-danger" title="حذف التاجر" aria-label={`حذف ${merchant.name}`} disabled={deleting} onClick={() => setDeleteTarget(merchant)}><Trash2 size={14} /><span>حذف</span></button>
              </div>
            </article>
          ))}
          {!loadingList && filteredMerchants.length === 0 && (
            <div className={merchantCard}><strong className="text-[12px] font-bold text-[#343d44]">لا توجد نتائج مطابقة</strong></div>
          )}
        </div>

        <div
          className={cn(
            'merchant-table-footer flex min-h-0 flex-col items-stretch gap-2 px-0 py-2 pb-1 text-center text-[10px] text-[#858e95]',
            'min-[640px]:min-h-[42px] min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-2 min-[640px]:pt-1 min-[640px]:text-start',
          )}
        >
          <span>عرض {filteredMerchants.length ? (currentPage - 1) * 10 + 1 : 0} - {Math.min(currentPage * 10, filteredMerchants.length)} من {filteredMerchants.length} تاجر</span>
          <div className="merchant-pagination flex items-center justify-center gap-1.5 min-[640px]:justify-start min-[640px]:gap-[3px]">
            <button type="button" aria-label="الصفحة السابقة" onClick={() => setPage(Math.max(1, currentPage - 1))} className="grid size-10 min-w-10 place-items-center rounded-[5px] border border-[#e7eaed] bg-white px-[5px] text-[9px] text-[#68727a] min-[640px]:h-[26px] min-[640px]:min-w-[26px]"><ChevronRight size={12} /></button>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                type="button"
                className={cn(
                  'page-num hidden size-10 min-w-10 place-items-center rounded-[5px] border px-[5px] text-[9px] min-[640px]:grid min-[640px]:h-[26px] min-[640px]:min-w-[26px]',
                  currentPage === index + 1
                    ? 'is-current border-[#3eab29] bg-[#3eab29] text-white'
                    : 'border-[#e7eaed] bg-white text-[#68727a]',
                )}
                key={index + 1}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <span className="merchant-pagination-mobile inline-flex items-center gap-1.5 text-[11px] text-[#68727a] min-[640px]:hidden">{currentPage} / {pageCount}</span>
            <button type="button" aria-label="الصفحة التالية" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} className="grid size-10 min-w-10 place-items-center rounded-[5px] border border-[#e7eaed] bg-white px-[5px] text-[9px] text-[#68727a] min-[640px]:h-[26px] min-[640px]:min-w-[26px]"><ChevronLeft size={12} /></button>
          </div>
        </div>
      </section>

      <DeleteConfirmDialog
        dialog={{
          open: Boolean(deleteTarget),
          merchantName: deleteTarget?.name ?? '',
          loading: deleting,
          onCancel: () => { if (!deleting) setDeleteTarget(null) },
          onConfirm: handleConfirmDelete,
        }}
      />

      <MerchantAddSuccessModal
        dialog={{
          open: Boolean(createdSuccess),
          merchantName: createdSuccess?.name ?? '',
          onClose: () => setCreatedSuccess(null),
          onViewMerchant: () => {
            if (!createdSuccess) return
            const id = createdSuccess.id
            setCreatedSuccess(null)
            navigateView({ kind: 'details', merchantId: id })
          },
          onAddAnother: () => {
            setCreatedSuccess(null)
            navigateView({ kind: 'create' })
          },
        }}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function Metric({ metric }: { metric: { label: string; value: string; detail: string; accent: 'green' | 'orange' | 'plain' } }) {
  const { label, value, detail, accent } = metric
  return (
    <article
      className={cn(
        'merchant-metric grid min-h-[67px] min-w-0 grid-cols-[1fr_auto] content-center gap-x-2 gap-y-px',
        'rounded-[7px] border border-[#e8ecef] bg-white px-[9px] py-2.5',
        'min-[1024px]:min-h-[76px] min-[1024px]:px-3',
      )}
    >
      <span className="text-[9px] text-[#858e95]">{label}</span>
      <strong
        className={cn(
          'metric-' + accent,
          'col-start-1 row-start-2 text-end text-[16px] font-medium leading-[1.35] text-[#242b31] [direction:ltr]',
          accent === 'green' && 'text-[#42a832]',
          accent === 'orange' && 'text-[#d77b00]',
        )}
      >
        {value}
      </strong>
      <small className="col-start-2 row-start-2 self-end whitespace-nowrap pb-0.5 text-[9px] text-[#858e95]">{detail}</small>
    </article>
  )
}

export default TradersPage
