import { ChevronLeft, ChevronRight, Download, ExternalLink } from 'lucide-react'
import { formatAmount, formatUsd, type MerchantSettlementRow } from '../../../data/merchantDetailsData'
import SettlementsStats from './SettlementsStats'

type SettlementsTableProps = {
  rows: MerchantSettlementRow[]
  page: number
  loading: boolean
  onPageChange: (page: number) => void
  onExport: () => void
  onViewFullHistory?: () => void
}

const PAGE_SIZE = 3

function SettlementsTable({ rows, page, loading, onPageChange, onExport, onViewFullHistory }: SettlementsTableProps) {
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const visible = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <section className="md-panel">
      <div className="md-section-head md-panel-head">
        <div>
          <h2>سجل التسويات</h2>
          <p>ملخص التسويات المنفذة مع هذا التاجر</p>
        </div>
        <div className="md-header-actions">
          <button type="button" className="md-btn md-btn-neutral md-export-btn" onClick={onExport}>
            <Download size={12} /><span className="md-export-label">تصدير</span>
          </button>
          <button type="button" className="md-btn md-btn-neutral" onClick={onViewFullHistory}>
            <ExternalLink size={12} /><span className="md-export-label">عرض السجل الكامل</span>
          </button>
        </div>
      </div>

      <SettlementsStats settlements={rows} />

      <div className="md-table-scroll merchant-desktop-table">
        <table className="md-table">
          <thead>
            <tr>
              <th>رقم التسوية</th>
              <th>الفترة</th>
              <th>التحويلات</th>
              <th>المحصل</th>
              <th>العمولات</th>
              <th>الصافي المستحق</th>
              <th>سعر الصرف</th>
              <th>المحوّل فعلياً</th>
              <th>الفرق</th>
              <th>بواسطة</th>
              <th>الحالة</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={`sk-${index}`} className="md-skeleton-row">
                  {Array.from({ length: 11 }).map((__, cell) => <td key={cell}><span className="md-skeleton" /></td>)}
                </tr>
              ))
            )}
            {!loading && visible.map((row) => (
              <tr key={row.id}>
                <td className="md-link" dir="ltr">{row.id}</td>
                <td dir="ltr">{row.period}</td>
                <td>{formatAmount(row.transfersCount)}</td>
                <td dir="ltr">{formatAmount(row.collected)}</td>
                <td dir="ltr">{formatAmount(row.commissions)}</td>
                <td dir="ltr">{formatUsd(row.netDue)}</td>
                <td dir="ltr">{row.exchangeRate.toFixed(1)}</td>
                <td dir="ltr">{formatUsd(row.transferredUsd)}</td>
                <td>
                  <span className={`md-diff-pill ${row.differenceLocal < 0 ? 'is-neg' : row.differenceLocal > 0 ? 'is-pos' : 'is-zero'}`} dir="ltr">
                    {formatAmount(Math.abs(row.differenceLocal))} {row.currency}
                  </span>
                </td>
                <td title={row.by}>{row.by}</td>
                <td><span className="md-settle-badge is-done">{row.status}</span></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td className="md-empty" colSpan={11}>لا توجد تسويات مسجلة</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="merchant-mobile-cards" aria-label="سجل التسويات">
        {loading && <div className="merchant-card"><strong>جاري التحميل...</strong></div>}
        {!loading && visible.map((row) => (
          <article key={row.id} className="merchant-card">
            <div className="merchant-card-head">
              <strong className="md-link" dir="ltr" title={row.id}>{row.id}</strong>
              <span className="md-settle-badge is-done">{row.status}</span>
            </div>
            <div className="merchant-card-grid">
              <div className="merchant-card-field"><span>الفترة</span><b dir="ltr">{row.period}</b></div>
              <div className="merchant-card-field"><span>التحويلات</span><b>{formatAmount(row.transfersCount)}</b></div>
              <div className="merchant-card-field"><span>المحصل</span><b dir="ltr">{formatAmount(row.collected)}</b></div>
              <div className="merchant-card-field"><span>العمولات</span><b dir="ltr">{formatAmount(row.commissions)}</b></div>
              <div className="merchant-card-field"><span>الصافي</span><b dir="ltr">{formatUsd(row.netDue)}</b></div>
              <div className="merchant-card-field"><span>سعر الصرف</span><b dir="ltr">{row.exchangeRate.toFixed(1)}</b></div>
              <div className="merchant-card-field"><span>المحوّل</span><b dir="ltr">{formatUsd(row.transferredUsd)}</b></div>
              <div className="merchant-card-field">
                <span>الفرق</span>
                <b>
                  <span className={`md-diff-pill ${row.differenceLocal < 0 ? 'is-neg' : row.differenceLocal > 0 ? 'is-pos' : 'is-zero'}`} dir="ltr">
                    {formatAmount(Math.abs(row.differenceLocal))} {row.currency}
                  </span>
                </b>
              </div>
              <div className="merchant-card-field"><span>بواسطة</span><b title={row.by}>{row.by}</b></div>
            </div>
          </article>
        ))}
        {!loading && rows.length === 0 && (
          <div className="merchant-card"><strong>لا توجد تسويات مسجلة</strong></div>
        )}
      </div>

      <div className="md-table-footer">
        <span>عرض {rows.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-{Math.min(currentPage * PAGE_SIZE, rows.length)} من {rows.length} تسويات</span>
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

export default SettlementsTable
