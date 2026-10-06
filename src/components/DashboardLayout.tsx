import { useState } from 'react'
import AnalyticsPanel from './AnalyticsPanel'
import DashboardFooter from './DashboardFooter'
import DashboardHeader from './DashboardHeader'
import ExchangeRateSection from './ExchangeRateSection'
import MetricCards from './MetricCards'
import NoticeBanner from './NoticeBanner'
import OperationsTable from './OperationsTable'
import PageHeading from './PageHeading'
import Sidebar from './Sidebar'
import TradersPage from './TradersPage'
import TransfersPage from './TransfersPage'
import './DashboardPrimitives.css'
import './DashboardPanels.css'
import './DashboardLayout.css'

type DashboardLayoutProps = {
  onLogout: () => void
}

function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState('لوحة التحكم')
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function navigateToPage(page: string) {
    setActivePage(page)
    setIsSidebarOpen(false)
  }

  return (
    <div className="dashboard" dir="rtl">
      {isSidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="إغلاق القائمة"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <Sidebar
        activePage={activePage}
        isOpen={isSidebarOpen}
        onLogout={onLogout}
        onNavigate={navigateToPage}
      />
      <main className="main-area">
        <DashboardHeader
          activePage={activePage}
          search={search}
          onSearchChange={setSearch}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="page-content">
          {activePage === 'الحوالات' ? (
            <TransfersPage />
          ) : activePage === 'التجار' ? (
            <TradersPage />
          ) : (
            <>
              <PageHeading title={activePage} />
              <NoticeBanner />
              <ExchangeRateSection />
              <MetricCards />
              <section className="content-grid">
                <OperationsTable search={search} />
                <AnalyticsPanel />
              </section>
              <DashboardFooter />
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout