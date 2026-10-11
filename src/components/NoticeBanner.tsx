import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'

function NoticeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  if (!isVisible) return null

  return (
    <section
      className={cn(
        'mb-[14px] flex min-h-[36px] items-start gap-[8px] rounded-[5px] border border-[#f1e4cf]',
        'bg-[#fffaf2] px-[10px] py-[6px] text-[9px] leading-[1.5] text-[#947240]',
        'min-[501px]:items-center min-[501px]:text-[10px]',
      )}
    >
      <span className={cn('grid place-items-center text-[#d39a3e]', 'pt-[2px] min-[501px]:pt-0')}>
        <Info size={14} />
      </span>
      <span className="flex-1">
        تم تحديث سعر صرف اليوم لحملة الليرة التركية (TRY) — إن تمكنت من التحويل مسبقاً ستحصل على سعر بنك عُمان
      </span>
      <button
        type="button"
        aria-label="إغلاق التنبيه"
        onClick={() => setIsVisible(false)}
        className="grid cursor-pointer place-items-center border-0 bg-transparent p-[3px] text-[#ad9b7d]"
      >
        <X size={14} />
      </button>
    </section>
  )
}

export default NoticeBanner
