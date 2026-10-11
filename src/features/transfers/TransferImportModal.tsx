import type { ChangeEvent, RefObject } from 'react'
import { Download, FileSpreadsheet, Trash2, Upload, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import Modal from '../../components/ui/Modal'
import { formatAmount, parseAmount } from '../../utils/format'
import {
  transferCancelButtonClass,
  transferConfirmButtonClass,
  transferModalBackdropClass,
  transferModalPanelClass,
  transferToolButtonClass,
} from './transferFieldClasses'
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

function TransferImportModal({ dialog }: { dialog: TransferImportModalProps }) {
  const {
    fileName,
    rows: sourceRows,
    tab,
    inputRef,
    onTabChange,
    onDeleteRow,
    onFileChange,
    onClose,
    onImport,
    onDownloadTemplate,
  } = dialog
  const rows = sourceRows ?? []
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
      shell={{
        backdropClassName: transferModalBackdropClass,
        panelClassName: cn(transferModalPanelClass, 'w-[min(1040px,100%)]'),
        labelledBy: 'import-modal-title',
        onClose,
      }}
    >
      <div dir="rtl">
        <div className="flex min-h-[72px] items-start justify-between gap-3 border-b border-[#edf0f2] px-[18px] pb-3.5 pt-4">
          <div>
            <h2 id="import-modal-title" className="text-[18px] font-bold text-[#243039]">رفع تحويلات من ملف Excel</h2>
            <p className="mt-1 text-[12px] leading-[1.5] text-text-muted">إضافة عدد كبير من التحويلات دفعة واحدة وفق نموذج تسجيل التحويل المعتمد</p>
          </div>
          <button type="button" className="grid size-8 flex-none place-items-center border border-[#e7eaec] bg-[#f8f9fa] text-[#788188] rounded-sm" onClick={onClose} aria-label="إغلاق">
            <X size={17} />
          </button>
        </div>

        <div
          className={cn(
            'mx-[18px] mt-3.5 flex flex-col items-stretch justify-between gap-3 border border-[#e9ecee] bg-[#f7f8f9] px-3.5 py-3 rounded-md',
            'min-[701px]:flex-row min-[701px]:items-center',
          )}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="relative grid size-10 place-items-center rounded-sm bg-[#eaf5e7] text-green" aria-hidden="true">
              <FileSpreadsheet className="-mt-1.5" size={18} />
              <em className="absolute inset-x-0 bottom-[3px] text-center text-[8px] font-extrabold not-italic leading-none tracking-[0.02em] text-green">XLS</em>
            </span>
            <div className="grid min-w-0 gap-[3px]">
              <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-[#343d44]">{fileName || 'لم يتم اختيار ملف'}</strong>
              <small className="text-[11px] text-text-muted">{fileName ? '51 صف · 48 KB · تم التحقق' : 'اختر ملف Excel لعرض معاينة البيانات'}</small>
            </div>
          </div>
          <div className={cn('flex w-full flex-none gap-2', 'min-[701px]:w-auto')}>
            <input ref={inputRef} className="absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)] [clip:rect(0,0,0,0)]" type="file" accept=".xlsx,.xls,.csv" onChange={onFileChange} />
            <button type="button" className={cn(transferToolButtonClass, 'max-[700px]:flex-1')} onClick={() => inputRef.current?.click()}>
              <Upload size={13} />استبدال الملف
            </button>
            <button type="button" className={cn(transferToolButtonClass, 'max-[700px]:flex-1')} onClick={onDownloadTemplate}>
              <Download size={13} />تحميل النموذج
            </button>
          </div>
        </div>

        <div
          className={cn(
            'grid grid-cols-2 gap-2.5 px-[18px] pb-2.5 pt-3.5',
            'min-[701px]:grid-cols-4',
          )}
        >
          <div className="grid gap-1.5 border border-[#e9ecee] bg-surface p-3 text-[12px] text-[#707980] rounded-md">
            <span>إجمالي الصفوف</span>
            <strong className="text-[20px] font-bold text-[#40494f]">{displayTotal}</strong>
          </div>
          <div className="grid gap-1.5 border border-green-border bg-[#f3faf1] p-3 text-[12px] text-[#707980] rounded-md">
            <span>صفوف صالحة</span>
            <strong className="text-[20px] font-bold text-green">{displayValid}</strong>
          </div>
          <div className="grid gap-1.5 border border-[#f1caca] bg-[#fff8f6] p-3 text-[12px] text-[#707980] rounded-md">
            <span>بها أخطاء</span>
            <strong className="text-[20px] font-bold text-danger">{displayErrors}</strong>
          </div>
          <div className="grid gap-1.5 border border-[#e9ecee] bg-surface p-3 text-[12px] text-[#707980] rounded-md">
            <span>إجمالي القيمة</span>
            <strong className="text-[20px] font-bold text-[#1f2730]" dir="ltr">{displayValue}</strong>
          </div>
        </div>

        <div className="flex gap-1.5 px-[18px] pb-2.5" role="tablist" aria-label="تصفية صفوف الاستيراد">
          {([
            ['all', `الكل (${displayTotal})`],
            ['errors', `الأخطاء (${displayErrors})`],
            ['valid', `الصالحة (${displayValid})`],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              className={cn(
                'min-h-[34px] cursor-pointer border border-transparent bg-transparent px-3 text-[12px] text-[#6c757d] font-[inherit] rounded-sm',
                tab === value && 'border-[#d9ecd4] bg-green-soft font-bold text-green',
              )}
              onClick={() => onTabChange(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mx-[18px] max-h-[280px] overflow-auto border border-[#edf0f2] rounded-md">
          <table className="w-full min-w-[920px] border-collapse whitespace-nowrap">
            <thead>
              <tr>
                {['#', 'الدولة', 'التاجر', 'الوسيلة', 'رقم الاستقبال', 'القيمة', 'رقم المرجع', 'التاريخ', 'نتيجة التحقق', 'حذف'].map((label) => (
                  <th key={label} className="sticky top-0 z-[1] h-10 border-b border-[#eff1f2] bg-[#f8f9fa] px-2.5 text-start text-[12px] font-semibold text-[#8b949b]">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((row, index) => (
                <tr key={row.id}>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]">{index + 1}</td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]">{row.country}</td>
                  <td className={cn('h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]', row.errorField === 'merchant' && 'font-semibold text-danger')}>{row.merchant}</td>
                  <td className={cn('h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]', row.errorField === 'method' && 'font-semibold text-danger')} dir="ltr">{row.method}</td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]" dir="ltr">{row.account}</td>
                  <td className={cn('h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]', row.errorField === 'amount' && 'font-semibold text-danger')} dir="ltr">{row.amount}</td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]" dir="ltr">{row.reference}</td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]" dir="ltr">{row.date}</td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]">
                    <span
                      className={cn(
                        'inline-flex items-center gap-[5px] rounded-full px-2 py-1 text-[11px] font-semibold',
                        row.status === 'صالح' ? 'bg-[#eaf6e8] text-green' : 'bg-danger-soft text-danger',
                      )}
                    >
                      <i className="size-1.5 rounded-full bg-current" />
                      {row.status}
                    </span>
                  </td>
                  <td className="h-10 border-b border-[#eff1f2] px-2.5 text-start text-[12px] text-[#545d64]">
                    <button
                      type="button"
                      className="grid size-7 place-items-center border-0 bg-transparent text-danger rounded-[6px] hover:bg-danger-soft"
                      aria-label="حذف الصف"
                      onClick={() => onDeleteRow(row.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          className={cn(
            'flex flex-col-reverse items-stretch justify-between gap-3.5 border-t border-[#edf0f2] px-[18px] pb-4 pt-3.5 text-[12px] leading-[1.5] text-text-muted',
            'min-[701px]:flex-row min-[701px]:items-center',
          )}
        >
          <div className={cn('flex w-full flex-none flex-col items-stretch gap-2', 'min-[701px]:w-auto min-[701px]:flex-row min-[701px]:items-center')}>
            <button
              type="button"
              className={cn(transferConfirmButtonClass, 'min-h-10 justify-center rounded-sm text-[13px] max-[700px]:w-full')}
              disabled={!fileName || validCount === 0}
              onClick={onImport}
            >
              اعتماد {displayValid} تحويل صالح
            </button>
            <button type="button" className={cn(transferCancelButtonClass, 'min-h-10 justify-center rounded-sm text-[13px] max-[700px]:w-full')} onClick={onClose}>
              إلغاء
            </button>
          </div>
          <span className="max-w-none min-[701px]:max-w-[420px]">الصفوف التي بها أخطاء لن تُضاف. يمكنك حذف أي صف خاطئ أو مكرر قبل الإضافة بدون إعادة رفع الملف</span>
        </div>
      </div>
    </Modal>
  )
}

export default TransferImportModal
