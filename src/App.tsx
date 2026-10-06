import { useState } from 'react'
import AnalyticsPanel from './components/AnalyticsPanel'
import DashboardFooter from './components/DashboardFooter'
import DashboardHeader from './components/DashboardHeader'
import ExchangeRateSection from './components/ExchangeRateSection'
import LoginPage from './components/LoginPage'
import MetricCards from './components/MetricCards'
import NoticeBanner from './components/NoticeBanner'
import OperationsTable from './components/OperationsTable'
import PageHeading from './components/PageHeading'
import Sidebar from './components/Sidebar'
import TransfersPage from './components/TransfersPage'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    window.localStorage.getItem('nasam-authenticated') === 'true'
    || window.sessionStorage.getItem('nasam-authenticated') === 'true',
  )
  const [activePage, setActivePage] = useState('لوحة التحكم')
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function handleLogin(rememberMe: boolean) {
    const selectedStorage = rememberMe ? window.localStorage : window.sessionStorage
    const otherStorage = rememberMe ? window.sessionStorage : window.localStorage
    otherStorage.removeItem('nasam-authenticated')
    selectedStorage.setItem('nasam-authenticated', 'true')
    setIsAuthenticated(true)
  }

  function handleLogout() {
    window.localStorage.removeItem('nasam-authenticated')
    window.sessionStorage.removeItem('nasam-authenticated')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />

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
        onLogout={handleLogout}
        onNavigate={(page) => {
          setActivePage(page)
          setIsSidebarOpen(false)
        }}
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

export default App
