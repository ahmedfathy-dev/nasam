import { ArrowDownLeft, ArrowUpLeft, Ellipsis } from 'lucide-react'
import { metrics } from '../data/dashboardData'

function MetricCards() {
  return (
    <section className="metrics-grid" aria-label="ملخص المؤشرات">
      {metrics.map(({ label, value, change, note, icon: Icon, color }) => (
        <article className="metric-card" key={label}>
          <div className="metric-top">
            <span className={`metric-icon icon-${color}`}><Icon size={16} strokeWidth={1.9} /></span>
            <button className="more-button" aria-label={`خيارات ${label}`}><Ellipsis size={17} /></button>
          </div>
          <div className="metric-label">{label}</div>
          <div className="metric-value" dir="ltr">{value}</div>
          <div className="metric-foot">
            <span className={`change change-${color}`}>
              {color === 'orange' ? <ArrowDownLeft size={12} /> : <ArrowUpLeft size={12} />}{change}
            </span>
            <span>{note}</span>
          </div>
        </article>
      ))}
    </section>
  )
}

export default MetricCards