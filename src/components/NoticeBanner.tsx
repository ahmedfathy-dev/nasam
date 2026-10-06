import { useState } from 'react'
import { Activity, X } from 'lucide-react'

function NoticeBanner() {
  const [isVisible, setIsVisible] = useState(true)
  if (!isVisible) return null

  return (
    <section className="notice-bar">
      <span className="notice-icon"><Activity size={14} /></span>
      <span>أداء أعمالك في تحسن مستمر، زادت الإيرادات بنسبة <strong>١٤٫٦٪</strong> مقارنة بالشهر الماضي</span>
      <button aria-label="إغلاق التنبيه" onClick={() => setIsVisible(false)}><X size={14} /></button>
    </section>
  )
}

export default NoticeBanner