import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '@/constants/breakpoints'
import TransfersPage from '@/features/transfers/TransfersPage'
import CountriesPage from './countries/CountriesPage'
import DashboardHeader from './DashboardHeader'
import DashboardPage from './DashboardPage'
import Sidebar from './Sidebar'
import TradersPage from './TradersPage'
import './DashboardPrimitives.css'
import './DashboardPanels.css'
import './DashboardLayout.css'

const MOBILE_SIDEBAR_BREAKPOINT = BREAKPOINTS.sidebar

type DashboardLayoutProps = {
  onLogout: () => void
}

function initialActivePage() {
  if (window.location.pathname.startsWith('/merchants')) return 'التجار'
  if (window.location.pathname.startsWith('/transfers')) return 'الحوالات'
  if (window.location.pathname.startsWith('/countries')) return 'الدول'
  return 'لوحة التحكم'
}

function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState(initialActivePage)
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  function closeSidebar() {
    setIsSidebarOpen(false)
  }

  function navigateToPage(page: string) {
    if (page === 'التجار') {
      if (window.location.pathname !== '/merchants') {
        window.history.pushState({ merchantView: { kind: 'list' } }, '', '/merchants')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الحوالات') {
      if (window.location.pathname !== '/transfers') {
        window.history.pushState({}, '', '/transfers')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الدول') {
      if (window.location.pathname !== '/countries') {
        window.history.pushState({}, '', '/countries')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (
      window.location.pathname.startsWith('/merchants')
      || window.location.pathname.startsWith('/transfers')
      || window.location.pathname.startsWith('/countries')
    ) {
      window.history.pushState({}, '', '/')
    }

    setActivePage(page)
    closeSidebar()
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > MOBILE_SIDEBAR_BREAKPOINT) {
        setIsSidebarOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false)
      }
    }

    function handlePopState() {
      setActivePage(initialActivePage())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (!isSidebarOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isSidebarOpen])

  return (
    <div className={`dashboard ${isSidebarOpen ? 'dashboard-sidebar-open' : ''}`} dir="rtl">
      {isSidebarOpen && (
        <button
          type="button"
          className="sidebar-scrim"
          aria-label="إغلاق القائمة"
          onClick={closeSidebar}
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
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen((open) => !open)}
        />
        <div className="page-content">
          {activePage === 'الحوالات' ? (
            <TransfersPage />
          ) : activePage === 'التجار' ? (
            <TradersPage />
          ) : activePage === 'الدول' ? (
            <CountriesPage />
          ) : (
            <DashboardPage title={activePage} search={search} onNewTransfer={() => navigateToPage('الحوالات')} />
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
