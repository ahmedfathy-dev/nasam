import { cn } from '@/lib/cn'
import AnalyticsPanel from './AnalyticsPanel'
import ExchangeRateSection from './ExchangeRateSection'
import MetricCards from './MetricCards'
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
      <PageHeading title={title} onNewTransfer={onNewTransfer} onImportExcel={onNewTransfer} />
      <ExchangeRateSection />
      <MetricCards />
      <section
        className={cn(
          'grid grid-cols-1 items-start gap-3',
          'min-[1100px]:grid-cols-[minmax(0,1.85fr)_minmax(300px,1fr)]',
        )}
      >
        <OperationsTable search={search} />
        <AnalyticsPanel />
      </section>
    </>
  )
}

export default DashboardPage
