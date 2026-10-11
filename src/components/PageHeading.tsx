import { useState } from 'react'
import { Plus, Upload } from 'lucide-react'
import { cn } from '@/lib/cn'

type PageHeadingProps = {
  title: string
  onNewTransfer?: () => void
  onImportExcel?: () => void
}

const periods = ['اليوم', 'الأسبوع', 'الشهر', 'مخصص'] as const

function PageHeading({ title, onNewTransfer, onImportExcel }: PageHeadingProps) {
  const [period, setPeriod] = useState<(typeof periods)[number]>('الشهر')

  return (
    <div
      className={cn(
        'mb-4 flex items-start justify-between gap-4',
        'max-[640px]:flex-col max-[640px]:gap-3',
      )}
    >
      <div className="min-w-0 text-start">
        <div className="mb-1 text-[12px] text-[#9aa3ab]">الأربعاء، 7 أكتوبر 2026</div>
        <h1 className="text-[28px] font-bold leading-[1.25] text-[#1c242b] max-[720px]:text-[22px]">
          {title}
        </h1>
        <p className="mt-1.5 text-[13px] leading-[1.6] text-[#8b949c]">
          نظرة عامة على حركة الحوالات — أكتوبر 2026
        </p>
      </div>

      <div className="flex flex-col items-end gap-2.5 max-[640px]:items-start">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onImportExcel}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e4e7ea] bg-white px-3.5 text-[13px] font-semibold text-[#3d4650] hover:bg-[#f7f8f9]"
          >
            <Upload size={15} />
            رفع Excel
          </button>
          <button
            type="button"
            onClick={onNewTransfer}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#111315] bg-[#111315] px-3.5 text-[13px] font-semibold text-white hover:bg-[#292d2f]"
          >
            <span>تحويل جديد</span>
            <Plus size={15} />
          </button>
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-[#f3f4f6] p-1" role="tablist" aria-label="الفترة">
          {periods.map((item) => {
            const selected = item === period
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setPeriod(item)}
                className={cn(
                  'h-7 cursor-pointer rounded-md px-3 text-[12px] font-semibold',
                  selected ? 'bg-[#111315] text-white' : 'bg-transparent text-[#6d767e] hover:text-[#1c242b]',
                )}
              >
                {item}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PageHeading
