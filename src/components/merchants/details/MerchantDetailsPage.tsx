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
import './MerchantDetailsPage.css'
import '../MerchantResponsive.css'

type MerchantDetailsPageProps = {
  merchantId: number
  onBack: () => void
  onViewSettlementsHistory?: () => void
  initialTab?: TabKey
  highlightSettlementId?: string | null
}

type TabKey = 'transfers' | 'settlements'

function MerchantDetailsPage({
  merchantId,
  onBack,
  onViewSettlementsHistory,
  initialTab = 'transfers',
  highlightSettlementId = null,
}: MerchantDetailsPageProps) {
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
      <div className="merchant-details-page" dir="rtl">
        <div className="md-loading">جاري تحميل تفاصيل التاجر...</div>
      </div>
    )
  }

  if (!details || !merchant) return null

  return (
    <div className="merchant-details-page" dir="rtl">
      <nav className="md-breadcrumb" aria-label="مسار الصفحة">
        <button type="button" onClick={onBack}>التجار</button>
        <ChevronLeft size={12} />
        <strong>{details.name}</strong>
      </nav>

      <MerchantHeader
        details={details}
        canSettle={canSettle}
        onEdit={openEdit}
        onSuspend={() => setSuspendOpen(true)}
        onSettle={() => setSettleOpen(true)}
      />

      <MerchantInfoStrip details={details} />
      <AccountSummaryCards details={details} />

      <PaymentMethodCards
        methods={methods}
        selectedId={selectedMethodId}
        onSelect={(id) => setSelectedMethodId(id)}
        onAdd={() => pushToast('إضافة وسيلة ستكون متاحة قريبًا', 'success')}
      />

      <div className="md-tabs" role="tablist" aria-label="سجلات التاجر">
        <button type="button" role="tab" aria-selected={tab === 'transfers'} className={tab === 'transfers' ? 'is-active' : ''} onClick={() => setTab('transfers')}>
          سجل التحويلات
        </button>
        <button type="button" role="tab" aria-selected={tab === 'settlements'} className={tab === 'settlements' ? 'is-active' : ''} onClick={() => setTab('settlements')}>
          سجل التسويات
        </button>
      </div>

      {tab === 'transfers' ? (
        <TransfersTable
          rows={filteredTransfers}
          selectedMethod={selectedMethod}
          cycleFilter={cycleFilter}
          statusFilter={statusFilter}
          page={transferPage}
          loading={loading}
          onCycleChange={setCycleFilter}
          onStatusChange={(value) => { setStatusFilter(value); setTransferPage(1) }}
          onClearMethod={() => setSelectedMethodId(null)}
          onPageChange={setTransferPage}
          onExport={exportTransfers}
        />
      ) : (
        <SettlementsTable
          rows={filteredSettlements}
          page={settlementPage}
          loading={loading}
          onPageChange={setSettlementPage}
          onExport={exportSettlements}
          onViewFullHistory={onViewSettlementsHistory}
        />
      )}

      <MerchantFormModal
        open={editOpen}
        mode="edit"
        initialValues={editValues}
        loading={saving}
        onClose={() => { if (!saving) setEditOpen(false) }}
        onSubmit={handleSaveEdit}
      />

      <SuspendConfirmDialog
        open={suspendOpen}
        merchantName={details.name}
        isActive={details.status === 'نشط'}
        loading={suspending}
        onCancel={() => { if (!suspending) setSuspendOpen(false) }}
        onConfirm={handleSuspend}
      />

      <SettleAccountModal
        open={settleOpen}
        details={details}
        methods={methods}
        loading={settling}
        onClose={() => { if (!settling) setSettleOpen(false) }}
        onConfirm={handleSettle}
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
