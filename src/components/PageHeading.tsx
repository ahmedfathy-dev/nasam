import { useState } from 'react'
import { CalendarDays, ChevronDown, Download } from 'lucide-react'

type PageHeadingProps = {
  title: string
}

function PageHeading({ title }: PageHeadingProps) {
  const [isPeriodOpen, setIsPeriodOpen] = useState(false)
  const [period, setPeriod] = useState('هذا الشهر')

  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">الثلاثاء، ٦ أكتوبر ٢٠٢٦</div>
        <h1>{title}</h1>
        <p>نظرة عامة على أداء أعمالك وحركة الحسابات</p>
      </div>
      <div className="heading-actions">
        <div className="period-wrap">
          <button className="outline-button" onClick={() => setIsPeriodOpen(!isPeriodOpen)}>
            <CalendarDays size={15} /><span>{period}</span><ChevronDown size={13} />
          </button>
          {isPeriodOpen && (
            <div className="period-menu">
              {['هذا اليوم', 'هذا الأسبوع', 'هذا الشهر'].map((item) => (
                <button key={item} onClick={() => { setPeriod(item); setIsPeriodOpen(false) }}>{item}</button>
              ))}
            </div>
          )}
        </div>
        <button className="primary-button" onClick={() => window.print()}><Download size={15} /><span>تصدير التقرير</span></button>
      </div>
    </div>
  )
}

export default PageHeading