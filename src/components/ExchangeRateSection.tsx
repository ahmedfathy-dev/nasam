import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, RefreshCw } from 'lucide-react'
import './ExchangeRateSection.css'
import { exchangeRates } from '../data/dashboardData'

function ExchangeRateSection() {
  const [clock, setClock] = useState(() => formatLiveClock())
  const rates = useMemo(() => exchangeRates, [])

  function refresh() {
    setClock(formatLiveClock())
  }

  return (
    <section className="exchange-section" aria-labelledby="exchange-title">
      <div className="exchange-heading">
        <div className="exchange-heading-main">
          <button type="button" className="exchange-refresh" aria-label="تحديث أسعار الصرف" onClick={refresh}>
            <RefreshCw size={15} />
          </button>
          <div className="exchange-heading-copy">
            <h2 id="exchange-title">أسعار الصرف مقابل الدولار</h2>
            <p>تُحدَّث تلقائيًا ولحظيًا عبر API لكل عملات الدول التي تدعمها مؤسسة نسام</p>
          </div>
        </div>

        <div className="exchange-heading-meta">
          <span className="exchange-live-pill">
            <i aria-hidden="true" />
            مباشر · آخر تحديث {clock}
          </span>
          <button type="button" className="exchange-all-link">
            كل الأسعار
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      <div className="exchange-rates" role="list">
        {rates.map(({ code, country, rate, change, trend }) => (
          <article className="exchange-rate" role="listitem" key={code}>
            <div className="exchange-currency">
              <strong dir="ltr">{code}</strong>
              <span>{country}</span>
            </div>
            <div className="exchange-value">
              <strong className="exchange-rate-value" dir="ltr">{rate}</strong>
              <span className={`exchange-change trend-${trend}`} dir="ltr">
                {change}
                {trend === 'up' ? <ArrowUp size={10} strokeWidth={2.75} aria-hidden="true" /> : null}
                {trend === 'down' ? <ArrowDown size={10} strokeWidth={2.75} aria-hidden="true" /> : null}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function formatLiveClock(date = new Date()) {
  const hh = String(date.getHours()).padStart(2, '0')
  const mm = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default ExchangeRateSection
