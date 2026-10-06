import { ChevronLeft } from 'lucide-react'
import { categories } from '../data/dashboardData'
import './AnalyticsPanel.css'

function AnalyticsPanel() {
  return (
    <aside className="panel analytics-panel">
      <div className="panel-heading">
        <div><h2>ملخص العمليات</h2><p>توزيع العمليات حسب النوع</p></div>
        <button className="text-button">عرض الكل<ChevronLeft size={13} /></button>
      </div>
      <div className="segmented-bar" aria-label="توزيع العمليات"><span /><span /><span /><span /></div>
      <div className="category-list">
        {categories.map((category) => (
          <div className="category-row" key={category.label}>
            <div className="category-head">
              <span><i className={`legend-${category.color}`} />{category.label}</span>
              <strong dir="ltr">{category.percent}٪</strong>
            </div>
            <div className="progress-track"><span className={`progress-${category.color}`} style={{ width: `${category.percent}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="analytics-total"><span>إجمالي العمليات</span><strong dir="ltr">$ 214,560</strong></div>
    </aside>
  )
}

export default AnalyticsPanel