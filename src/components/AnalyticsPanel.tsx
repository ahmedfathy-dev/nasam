import { ChevronLeft } from 'lucide-react'
import { countryBreakdown } from '../data/dashboardData'
import './AnalyticsPanel.css'

function AnalyticsPanel() {
  return (
    <aside className="panel analytics-panel">
      <div className="panel-heading">
        <div>
          <h2>ملخص الحوالات حسب الدولة</h2>
          <p>توزيع الحوالات حسب الدولة</p>
        </div>
        <button className="text-button">عرض الكل<ChevronLeft size={13} /></button>
      </div>
      <div className="segmented-bar" aria-label="توزيع الحوالات">
        {countryBreakdown.map((country) => (
          <span key={country.label} className={`segment-${country.color}`} style={{ width: `${country.percent}%` }} />
        ))}
      </div>
      <div className="category-list">
        {countryBreakdown.map((country) => (
          <div className="category-row" key={country.label}>
            <div className="category-head">
              <span><i className={`legend-${country.color}`} />{country.label}</span>
              <strong dir="ltr">{country.percent}%</strong>
            </div>
            <div className="progress-track"><span className={`progress-${country.color}`} style={{ width: `${country.percent}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="analytics-total"><span>الإجمالي</span><strong dir="ltr">$ 214,560</strong></div>
    </aside>
  )
}

export default AnalyticsPanel
