import { useState } from 'react'
import { Info, X } from 'lucide-react'
import './NoticeBanner.css'

function NoticeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  if (!isVisible) return null

  return (
    <section className="notice-bar">
      <span className="notice-icon"><Info size={14} /></span>
      <span>تم تحديث سعر صرف اليوم لحملة الليرة التركية (TRY) — إن تمكنت من التحويل مسبقاً ستحصل على سعر بنك عُمان</span>
      <button aria-label="إغلاق التنبيه" onClick={() => setIsVisible(false)}><X size={14} /></button>
    </section>
  )
}

export default NoticeBanner
