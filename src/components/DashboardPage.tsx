import AnalyticsPanel from './AnalyticsPanel'
import ExchangeRateSection from './ExchangeRateSection'
import MetricCards from './MetricCards'
import NoticeBanner from './NoticeBanner'
import OperationsTable from './OperationsTable'
import PageHeading from './PageHeading'

type DashboardPageProps = {
  title: string
  search: string
  onNewTransfer: () => void
}

function DashboardPage({ title, search, onNewTransfer }: DashboardPageProps) {
  return (
    <>
      <PageHeading title={title} onNewTransfer={onNewTransfer} />
      <NoticeBanner />
      <ExchangeRateSection />
      <MetricCards />
      <section className="content-grid">
        <OperationsTable search={search} onViewAll={onNewTransfer} />
        <AnalyticsPanel />
      </section>
    </>
  )
}

export default DashboardPage
