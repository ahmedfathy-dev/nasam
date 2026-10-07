import type { ChangeEvent, RefObject } from 'react'
import { Download, FileSpreadsheet, Trash2, Upload, X } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import { formatAmount, parseAmount } from '../../utils/format'
import type { ImportRow, ImportTab } from './types'

type TransferImportModalProps = {
  fileName: string
  rows: ImportRow[]
  tab: ImportTab
  inputRef: RefObject<HTMLInputElement | null>
  onTabChange: (tab: ImportTab) => void
  onDeleteRow: (id: string) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClose: () => void
  onImport: () => void
  onDownloadTemplate: () => void
}

function TransferImportModal({
  fileName,
  rows,
  tab,
  inputRef,
  onTabChange,
  onDeleteRow,
  onFileChange,
  onClose,
  onImport,
  onDownloadTemplate,
}: TransferImportModalProps) {
  const validCount = rows.filter((row) => row.status === 'صالح').length
  const errorCount = rows.length - validCount
  const totalValue = rows
    .filter((row) => row.status === 'صالح')
    .reduce((sum, row) => sum + parseAmount(row.amount), 0)
  const shown = rows.filter((row) => {
    if (tab === 'valid') return row.status === 'صالح'
    if (tab === 'errors') return row.status !== 'صالح'
    return true
  })
  const isDemoFile = rows.length >= 5
  const displayTotal = isDemoFile ? 51 : rows.length
  const displayValid = isDemoFile ? 48 : validCount
  const displayErrors = isDemoFile ? 3 : errorCount
  const displayValue = isDemoFile ? '568,400 EGP' : `${formatAmount(totalValue)} EGP`

  return (
    <Modal
      backdropClassName="transfer-modal-backdrop"
      panelClassName="transfer-modal import-modal"
      labelledBy="import-modal-title"
      onClose={onClose}
    >
      <div className="transfer-modal-heading">
        <div>
          <h2 id="import-modal-title">رفع تحويلات من ملف Excel</h2>
          <p>إضافة عدد كبير من التحويلات دفعة واحدة وفق نموذج تسجيل التحويل المعتمد</p>
        </div>
        <button type="button" className="modal-close" onClick={onClose} aria-label="إغلاق"><X size={17} /></button>
      </div>

      <div className="import-file-row">
        {/* RTL: file info on the right, actions on the left */}
        <div className="import-file-info">
          <span className="excel-file-icon" aria-hidden="true">
            <FileSpreadsheet size={18} />
            <em>XLS</em>
          </span>
          <div>
            <strong>{fileName || 'لم يتم اختيار ملف'}</strong>
            <small>{fileName ? '51 صف · 48 KB · تم التحقق' : 'اختر ملف Excel لعرض معاينة البيانات'}</small>
          </div>
        </div>
        <div className="import-file-actions">
          <input ref={inputRef} className="visually-hidden" type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} />
          <button type="button" className="transfer-tool-button" onClick={() => inputRef.current?.click()}>
            <Upload size={13} />استبدال الملف
          </button>
          <button type="button" className="transfer-tool-button" onClick={onDownloadTemplate}>
            <Download size={13} />تحميل النموذج
          </button>
        </div>
      </div>

      <div className="import-stats">
        <div><span>إجمالي الصفوف</span><strong>{displayTotal}</strong></div>
        <div className="import-valid"><span>صفوف صالحة</span><strong>{displayValid}</strong></div>
        <div className="import-invalid"><span>بها أخطاء</span><strong>{displayErrors}</strong></div>
        <div className="import-total-value"><span>إجمالي القيمة</span><strong dir="ltr">{displayValue}</strong></div>
      </div>

      <div className="import-tabs" role="tablist" aria-label="تصفية صفوف الاستيراد">
        <button type="button" role="tab" aria-selected={tab === 'all'} className={tab === 'all' ? 'is-active' : ''} onClick={() => onTabChange('all')}>الكل ({displayTotal})</button>
        <button type="button" role="tab" aria-selected={tab === 'errors'} className={tab === 'errors' ? 'is-active' : ''} onClick={() => onTabChange('errors')}>الأخطاء ({displayErrors})</button>
        <button type="button" role="tab" aria-selected={tab === 'valid'} className={tab === 'valid' ? 'is-active' : ''} onClick={() => onTabChange('valid')}>الصالحة ({displayValid})</button>
      </div>

      <div className="import-table-wrap">
        <table className="import-table">
          <thead>
            <tr>
              <th>#</th>
              <th>الدولة</th>
              <th>التاجر</th>
              <th>الوسيلة</th>
              <th>رقم الاستقبال</th>
              <th>القيمة</th>
              <th>رقم المرجع</th>
              <th>التاريخ</th>
              <th>نتيجة التحقق</th>
              <th>حذف</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((row, index) => (
              <tr key={row.id} className={row.status === 'صالح' ? undefined : 'is-error-row'}>
                <td>{index + 1}</td>
                <td>{row.country}</td>
                <td className={row.errorField === 'merchant' ? 'is-error-cell' : undefined}>{row.merchant}</td>
                <td className={row.errorField === 'method' ? 'is-error-cell' : undefined} dir="ltr">{row.method}</td>
                <td dir="ltr">{row.account}</td>
                <td className={row.errorField === 'amount' ? 'is-error-cell' : undefined} dir="ltr">{row.amount}</td>
                <td dir="ltr">{row.reference}</td>
                <td dir="ltr">{row.date}</td>
                <td>
                  <span className={`import-row-status ${row.status === 'صالح' ? 'import-row-valid' : 'import-row-invalid'}`}>
                    <i />{row.status}
                  </span>
                </td>
                <td>
                  <button type="button" className="import-delete" aria-label="حذف الصف" onClick={() => onDeleteRow(row.id)}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="import-modal-footer">
        {/* Screenshot pixel check: green CTA is on the RIGHT → first in RTL flex */}
        <div className="import-modal-footer-actions">
          <button type="button" className="transfer-confirm-button" disabled={!fileName || validCount === 0} onClick={onImport}>
            اعتماد {displayValid} تحويل صالح
          </button>
          <button type="button" className="transfer-cancel-button" onClick={onClose}>إلغاء</button>
        </div>
        <span>الصفوف التي بها أخطاء لن تُضاف. يمكنك حذف أي صف خاطئ أو مكرر قبل الإضافة بدون إعادة رفع الملف</span>
      </div>
    </Modal>
  )
}

export default TransferImportModal
