import { ArrowDownLeft, ArrowUpLeft } from 'lucide-react'
import { exchangeRates } from '../data/dashboardData'

function ExchangeRateSection() {
  return (
    <section className="exchange-section" aria-labelledby="exchange-title">
      <div className="exchange-heading">
        <div><h2 id="exchange-title">أسعار الصرف مقابل الدولار</h2><p>أسعار العملات العالمية</p></div>
        <span className="exchange-updated"><i />آخر تحديث قبل دقيقتين</span>
      </div>
      <div className="exchange-rates">
        {exchangeRates.map(({ code, name, rate, change, trend }) => (
          <article className="exchange-rate" key={code}>
            <div className="exchange-currency"><strong dir="ltr">{code}</strong><span>{name}</span></div>
            <div className="exchange-value">
              <strong dir="ltr">{rate}</strong>
              <span className={`exchange-change trend-${trend}`} dir="ltr">
                {trend === 'up' ? <ArrowUpLeft size={10} /> : trend === 'down' ? <ArrowDownLeft size={10} /> : null}{change}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ExchangeRateSection