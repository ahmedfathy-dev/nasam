import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import {
  emptyMerchantForm,
  merchantToFormValues,
  type Merchant,
  type MerchantFormValues,
} from '../../../data/merchantsData'
import type {
  MerchantDetails,
  MerchantPaymentMethod,
  MerchantSettlementRow,
  MerchantTransferRow,
  SettleAccountPayload,
} from '../../../data/merchantDetailsData'
import {
  getMerchantById,
  getMerchantDetails,
  getMerchantPaymentMethods,
  getMerchantSettlements,
  getMerchantTransfers,
  setMerchantStatus,
  settleMerchantAccount,
  updateMerchant,
} from '../../../services/merchantService'
import { useToast } from '../../../hooks/useToast'
import MerchantFormModal from '../MerchantFormModal'
import ToastStack from '../ToastStack'
import AccountSummaryCards from './AccountSummaryCards'
import MerchantHeader from './MerchantHeader'
import MerchantInfoStrip from './MerchantInfoStrip'
import PaymentMethodCards from './PaymentMethodCards'
import SettleAccountModal from './settlement/SettleAccountModal'
import SettlementsTable from './SettlementsTable'
import SuspendConfirmDialog from './SuspendConfirmDialog'
import TransfersTable from './TransfersTable'
import { cn } from '@/lib/cn'
import { pageShell } from '../merchantTw'

type MerchantDetailsPageProps = {
  merchantId: number
  onBack: () => void
  onViewSettlementsHistory?: () => void
  initialTab?: TabKey
  highlightSettlementId?: string | null
}

type TabKey = 'transfers' | 'settlements'

function MerchantDetailsPage({ page }: { page: MerchantDetailsPageProps }) {
  const {
    merchantId,
    onBack,
    onViewSettlementsHistory,
    initialTab = 'transfers',
    highlightSettlementId = null,
  } = page
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [details, setDetails] = useState<MerchantDetails | null>(null)
  const [methods, setMethods] = useState<MerchantPaymentMethod[]>([])
  const [transfers, setTransfers] = useState<MerchantTransferRow[]>([])
  const [settlements, setSettlements] = useState<MerchantSettlementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null)
  const [tab, setTab] = useState<TabKey>(initialTab)
  const [cycleFilter, setCycleFilter] = useState(highlightSettlementId ? 'all' : 'current')
  const [statusFilter, setStatusFilter] = useState('all')
  const [transferPage, setTransferPage] = useState(1)
  const [settlementPage, setSettlementPage] = useState(1)
  const [editOpen, setEditOpen] = useState(false)
  const [editValues, setEditValues] = useState<MerchantFormValues>(emptyMerchantForm())
  const [saving, setSaving] = useState(false)
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [suspending, setSuspending] = useState(false)
  const [settleOpen, setSettleOpen] = useState(false)
  const [settling, setSettling] = useState(false)
  const { toasts, pushToast, dismissToast } = useToast()

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [base, detail, paymentMethods, transferRows, settlementRows] = await Promise.all([
        getMerchantById(merchantId),
        getMerchantDetails(merchantId),
        getMerchantPaymentMethods(merchantId),
        getMerchantTransfers(merchantId),
        getMerchantSettlements(merchantId),
      ])
      if (!base || !detail) {
        pushToast('تعذر العثور على التاجر', 'error')
        onBack()
        return
      }
      setMerchant(base)
      setDetails(detail)
      setMethods(paymentMethods)
      setTransfers(transferRows)
      setSettlements(settlementRows)
      setSelectedMethodId((current) => current && paymentMethods.some((method) => method.id === current)
        ? current
        : paymentMethods[0]?.id ?? null)
    } catch {
      pushToast('تعذر تحميل تفاصيل التاجر', 'error')
    } finally {
      setLoading(false)
    }
  }, [merchantId, onBack, pushToast])

  useEffect(() => {
    void loadAll()
  }, [loadAll])

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (highlightSettlementId) {
      setTab('transfers')
      setCycleFilter('all')
    }
  }, [highlightSettlementId])

  const selectedMethod = useMemo(
    () => methods.find((method) => method.id === selectedMethodId) ?? null,
    [methods, selectedMethodId],
  )

  const filteredTransfers = useMemo(() => transfers.filter((row) => {
    const methodOk = !selectedMethodId || row.methodId === selectedMethodId
    const statusOk = statusFilter === 'all'
      || (statusFilter === 'settled' && row.settled)
      || (statusFilter === 'open' && !row.settled)
    const settlementOk = !highlightSettlementId || row.settlementId === highlightSettlementId
    // Seeded rows represent the open ledger; "current" keeps them all visible like the design.
    const cycleOk = cycleFilter === 'all' || cycleFilter === 'current' || Boolean(highlightSettlementId)
    return methodOk && statusOk && cycleOk && settlementOk
  }), [transfers, selectedMethodId, statusFilter, cycleFilter, highlightSettlementId])

  const filteredSettlements = useMemo(() => settlements, [settlements])

  useEffect(() => {
    setTransferPage(1)
  }, [selectedMethodId, cycleFilter, statusFilter])

  function openEdit() {
    if (!merchant) return
    setEditValues(merchantToFormValues(merchant))
    setEditOpen(true)
  }

  async function handleSaveEdit(values: MerchantFormValues) {
    if (!merchant) return
    setSaving(true)
    try {
      await updateMerchant(merchant.id, values)
      await loadAll()
      setEditOpen(false)
      pushToast('تم تحديث بيانات التاجر بنجاح', 'success')
    } catch {
      pushToast('حدث خطأ أثناء حفظ بيانات التاجر', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleSuspend() {
    if (!details) return
    setSuspending(true)
    try {
      const nextStatus = details.status === 'نشط' ? 'موقوف' : 'نشط'
      await setMerchantStatus(details.id, nextStatus)
      await loadAll()
      setSuspendOpen(false)
      pushToast(nextStatus === 'موقوف' ? 'تم إيقاف التاجر بنجاح' : 'تم تفعيل التاجر بنجاح', 'success')
    } catch {
      pushToast('حدث خطأ أثناء تحديث حالة التاجر', 'error')
    } finally {
      setSuspending(false)
    }
  }

  const canSettle = useMemo(
    () => transfers.some((row) => !row.settled) || (details?.cycle.transfersCount ?? 0) > 0,
    [transfers, details],
  )

  async function handleSettle(payload: SettleAccountPayload) {
    if (!details) return
    setSettling(true)
    try {
      await settleMerchantAccount(details.id, payload)
      await loadAll()
      setSettleOpen(false)
      setTab('settlements')
      setSettlementPage(1)
      pushToast('تمت تسوية الحساب بنجاح', 'success')
    } catch {
      pushToast('حدث خطأ أثناء التسوية، حاول مرة أخرى', 'error')
    } finally {
      setSettling(false)
    }
  }

  function exportTransfers() {
    const header = ['التحويل', 'التاريخ', 'اسم المحول', 'الوسيلة', 'رقم الاستقبال', 'القيمة', 'العمولة', 'الصافي', 'USD', 'التسوية']
    const rows = filteredTransfers.map((row) => [
      row.id, row.date, row.sender, row.method, row.receiveNumber,
      row.localAmount, row.commission, row.net, row.usd, row.settled ? 'مسوّاة' : 'غير مسوّاة',
    ])
    downloadCsv('merchant-transfers.csv', header, rows)
  }

  function exportSettlements() {
    const header = ['رقم التسوية', 'الفترة', 'التحويلات', 'المحصل', 'العمولات', 'الصافي', 'سعر الصرف', 'المحوّل', 'الفرق', 'بواسطة', 'الحالة']
    const rows = filteredSettlements.map((row) => [
      row.id, row.period, row.transfersCount, row.collected, row.commissions, row.netDue,
      row.exchangeRate, row.transferredUsd, row.differenceLocal, row.by, row.status,
    ])
    downloadCsv('merchant-settlements.csv', header, rows)
  }

  if (loading && !details) {
    return (
      <div className={cn('merchant-details-page', pageShell, 'grid gap-2.5 text-text min-[640px]:gap-[11px] min-[1024px]:gap-3')} dir="rtl">
        <div className="md-loading grid min-h-[240px] place-items-center rounded-[7px] border border-line bg-surface text-[11px] text-text-muted">جاري تحميل تفاصيل التاجر...</div>
      </div>
    )
  }

  if (!details || !merchant) return null

  return (
    <div className={cn('merchant-details-page', pageShell, 'grid gap-2.5 text-text min-[640px]:gap-[11px] min-[1024px]:gap-3')} dir="rtl">
      <nav className="md-breadcrumb flex flex-wrap items-center gap-[5px] text-[9px] text-[#98a0a8] min-[640px]:text-[10px]" aria-label="مسار الصفحة">
        <button type="button" className="border-0 bg-transparent font-inherit text-inherit hover:text-green" onClick={onBack}>التجار</button>
        <ChevronLeft size={12} />
        <strong className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-[#4b5662]">{details.name}</strong>
      </nav>

      <MerchantHeader
        header={{
          details,
          canSettle,
          onEdit: openEdit,
          onSuspend: () => setSuspendOpen(true),
          onSettle: () => setSettleOpen(true),
        }}
      />

      <MerchantInfoStrip details={details} />
      <AccountSummaryCards details={details} />

      <PaymentMethodCards
        cards={{
          methods,
          selectedId: selectedMethodId,
          onSelect: (id) => setSelectedMethodId(id),
          onAdd: () => pushToast('إضافة وسيلة ستكون متاحة قريبًا', 'success'),
        }}
      />

      <div className="md-tabs flex gap-3.5 overflow-x-auto border-b border-line min-[640px]:gap-[18px]" role="tablist" aria-label="سجلات التاجر">
        <button type="button" role="tab" aria-selected={tab === 'transfers'} className={cn('relative min-h-10 flex-none border-0 bg-transparent px-0.5 pb-2.5 text-[10px] text-text-muted min-[640px]:min-h-0 min-[640px]:text-[11px]', tab === 'transfers' && 'is-active font-bold text-green after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-sm after:bg-green after:content-[\'\']')} onClick={() => setTab('transfers')}>
          سجل التحويلات
        </button>
        <button type="button" role="tab" aria-selected={tab === 'settlements'} className={cn('relative min-h-10 flex-none border-0 bg-transparent px-0.5 pb-2.5 text-[10px] text-text-muted min-[640px]:min-h-0 min-[640px]:text-[11px]', tab === 'settlements' && 'is-active font-bold text-green after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-sm after:bg-green after:content-[\'\']')} onClick={() => setTab('settlements')}>
          سجل التسويات
        </button>
      </div>

      {tab === 'transfers' ? (
        <TransfersTable
          table={{
            rows: filteredTransfers,
            selectedMethod,
            cycleFilter,
            statusFilter,
            page: transferPage,
            loading,
            onCycleChange: setCycleFilter,
            onStatusChange: (value) => { setStatusFilter(value); setTransferPage(1) },
            onClearMethod: () => setSelectedMethodId(null),
            onPageChange: setTransferPage,
            onExport: exportTransfers,
          }}
        />
      ) : (
        <SettlementsTable
          table={{
            rows: filteredSettlements,
            page: settlementPage,
            loading,
            onPageChange: setSettlementPage,
            onExport: exportSettlements,
            onViewFullHistory: onViewSettlementsHistory,
          }}
        />
      )}

      <MerchantFormModal
        dialog={{
          open: editOpen,
          mode: 'edit',
          initialValues: editValues,
          loading: saving,
          onClose: () => { if (!saving) setEditOpen(false) },
          onSubmit: handleSaveEdit,
        }}
      />

      <SuspendConfirmDialog
        dialog={{
          open: suspendOpen,
          merchantName: details.name,
          isActive: details.status === 'نشط',
          loading: suspending,
          onCancel: () => { if (!suspending) setSuspendOpen(false) },
          onConfirm: handleSuspend,
        }}
      />

      <SettleAccountModal
        dialog={{
          open: settleOpen,
          details,
          methods,
          loading: settling,
          onClose: () => { if (!settling) setSettleOpen(false) },
          onConfirm: handleSettle,
        }}
      />

      <ToastStack items={toasts} onDismiss={dismissToast} />
    </div>
  )
}

function downloadCsv(filename: string, header: string[], rows: Array<Array<string | number>>) {
  const csv = [header, ...rows].map((row) => row.map((value) => `"${value}"`).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default MerchantDetailsPage
