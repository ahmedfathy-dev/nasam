import { ChevronLeft, ChevronRight, Download, X } from 'lucide-react'
import FormSelect from '../../ui/FormSelect'
import { formatAmount, formatUsd, type MerchantPaymentMethod, type MerchantTransferRow } from '../../../data/merchantDetailsData'

type TransfersTableProps = {
  rows: MerchantTransferRow[]
  selectedMethod: MerchantPaymentMethod | null
  cycleFilter: string
  statusFilter: string
  page: number
  loading: boolean
  onCycleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClearMethod: () => void
  onPageChange: (page: number) => void
  onExport: () => void
}

const PAGE_SIZE = 7

function TransfersTable({
  rows, selectedMethod, cycleFilter, statusFilter, page, loading,
  onCycleChange, onStatusChange, onClearMethod, onPageChange, onExport,
}: TransfersTableProps) {
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="md-panel">
      <div className="md-table-filters">
        <div className="md-filter-start">
          {selectedMethod && (
            <button type="button" className="md-method-chip" onClick={onClearMethod}>
              <span dir="ltr">{selectedMethod.name} · {selectedMethod.account}</span>
              <X size={11} />
            </button>
          )}
          <FormSelect
            className="md-filter-select"
            ariaLabel="الدورة"
            value={cycleFilter}
            onChange={onCycleChange}
            options={[
              { label: 'الدورة الحالية', value: 'current' },
              { label: 'كل الدورات', value: 'all' },
            ]}
          />
          <FormSelect
            className="md-filter-select"
            ariaLabel="حالة التسوية"
            value={statusFilter}
            onChange={onStatusChange}
            options={[
              { label: 'كل الحالات', value: 'all' },
              { label: 'مسوّاة', value: 'settled' },
              { label: 'غير مسوّاة', value: 'open' },
            ]}
          />
        </div>
        <button type="button" className="md-btn md-btn-neutral md-export-btn" onClick={onExport}>
          <Download size={12} /><span className="md-export-label">تصدير</span>
        </button>
      </div>

      <div className="md-table-scroll merchant-desktop-table">
        <table className="md-table">
          <thead>
            <tr>
              <th>التحويل</th>
              <th>التاريخ</th>
              <th>اسم المحول</th>
              <th>الوسيلة</th>
              <th>رقم الاستقبال</th>
              <th>القيمة (محلي)</th>
              <th>العمولة</th>
              <th>الصافي</th>
              <th>المبلغ (دولار USD)</th>
              <th>التسوية</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`sk-${index}`} className="md-skeleton-row">
                  {Array.from({ length: 10 }).map((__, cell) => <td key={cell}><span className="md-skeleton" /></td>)}
                </tr>
              ))
            )}
            {!loading && visible.map((row) => (
              <tr key={row.id} className={row.settled ? 'is-settled' : undefined}>
                <td className="md-link" dir="ltr">{row.id}</td>
                <td dir="ltr">{row.date}</td>
                <td title={row.sender}>{row.sender}</td>
                <td dir="ltr">{row.method}</td>
                <td dir="ltr">{row.receiveNumber}</td>
                <td dir="ltr">{formatAmount(row.localAmount)} {row.currency}</td>
                <td dir="ltr">{formatAmount(row.commission)}</td>
                <td dir="ltr">{formatAmount(row.net)}</td>
                <td dir="ltr">{formatUsd(row.usd)}</td>
                <td>
                  <span className={`md-settle-badge ${row.settled ? 'is-done' : 'is-open'}`}>
                    {row.settled ? 'مسوّاة' : 'غير مسوّاة'}
                  </span>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td className="md-empty" colSpan={10}>لا توجد تحويلات مطابقة للفلاتر الحالية</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="merchant-mobile-cards" aria-label="سجل التحويلات">
        {loading && <div className="merchant-card"><strong>جاري التحميل...</strong></div>}
        {!loading && visible.map((row) => (
          <article key={row.id} className={`merchant-card ${row.settled ? 'is-settled' : ''}`}>
            <div className="merchant-card-head">
              <strong className="md-link" dir="ltr" title={row.id}>{row.id}</strong>
              <span className={`md-settle-badge ${row.settled ? 'is-done' : 'is-open'}`}>
                {row.settled ? 'مسوّاة' : 'غير مسوّاة'}
              </span>
            </div>
            <div className="merchant-card-grid">
              <div className="merchant-card-field"><span>التاريخ</span><b dir="ltr">{row.date}</b></div>
              <div className="merchant-card-field"><span>المحول</span><b title={row.sender}>{row.sender}</b></div>
              <div className="merchant-card-field"><span>الوسيلة</span><b dir="ltr">{row.method}</b></div>
              <div className="merchant-card-field"><span>الاستقبال</span><b dir="ltr">{row.receiveNumber}</b></div>
              <div className="merchant-card-field"><span>القيمة</span><b dir="ltr">{formatAmount(row.localAmount)} {row.currency}</b></div>
              <div className="merchant-card-field"><span>العمولة</span><b dir="ltr">{formatAmount(row.commission)}</b></div>
              <div className="merchant-card-field"><span>الصافي</span><b dir="ltr">{formatAmount(row.net)}</b></div>
              <div className="merchant-card-field"><span>USD</span><b dir="ltr">{formatUsd(row.usd)}</b></div>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className="merchant-card"><strong>لا توجد تحويلات مطابقة للفلاتر الحالية</strong></div>
        )}
      </div>

      <p className="md-table-note">التحويلات المسوّاة تظل محفوظة في السجل ولكن يُعرض سعر الصرف المحلي وقت التسوية</p>

      <div className="md-table-footer">
        <span>عرض {rows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0} - {Math.min(currentPage * PAGE_SIZE, rows.length)} من {rows.length}</span>
        <div className="md-pagination merchant-pagination">
          <button type="button" aria-label="السابق" onClick={() => onPageChange(Math.max(1, currentPage - 1))}><ChevronRight size={12} /></button>
          {Array.from({ length: pageCount }, (_, index) => (
            <button type="button" key={index + 1} className={`page-num ${currentPage === index + 1 ? 'is-current' : ''}`} onClick={() => onPageChange(index + 1)}>{index + 1}</button>
          ))}
          <span className="merchant-pagination-mobile">{currentPage} / {pageCount}</span>
          <button type="button" aria-label="التالي" onClick={() => onPageChange(Math.min(pageCount, currentPage + 1))}><ChevronLeft size={12} /></button>
        </div>
      </div>
    </section>
  )
}

export default TransfersTable
