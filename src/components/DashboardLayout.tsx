import { useEffect, useState } from 'react'
import { BREAKPOINTS } from '@/constants/breakpoints'
import { cn } from '@/lib/cn'
import { initialNotifications } from '../data/dashboardData'
import TransfersPage from '@/features/transfers/TransfersPage'
import CountriesPage from './countries/CountriesPage'
import ExchangeRatesPage from './exchange-rates/ExchangeRatesPage'
import ProfilePage from './profile/ProfilePage'
import RolesPage from './roles/RolesPage'
import SettingsPage from './settings/SettingsPage'
import SupervisorsPage from './supervisors/SupervisorsPage'
import PaymentMethodsPage from './payment-methods/PaymentMethodsPage'
import DashboardHeader from './DashboardHeader'
import DashboardPage from './DashboardPage'
import NotificationsPage from './notifications/NotificationsPage'
import Sidebar from './Sidebar'
import TradersPage from './TradersPage'

const MOBILE_SIDEBAR_BREAKPOINT = BREAKPOINTS.sidebar

type DashboardLayoutProps = {
  onLogout: () => void
}

function initialActivePage() {
  if (window.location.pathname.startsWith('/merchants')) return 'التجار'
  if (window.location.pathname.startsWith('/transfers')) return 'الحوالات'
  if (window.location.pathname.startsWith('/countries')) return 'الدول'
  if (window.location.pathname.startsWith('/payment-methods')) return 'وسائل الدفع'
  if (window.location.pathname.startsWith('/exchange-rates')) return 'أسعار الصرف'
  if (window.location.pathname.startsWith('/profile')) return 'الملف الشخصي'
  if (window.location.pathname.startsWith('/supervisors')) return 'المشرفين'
  if (window.location.pathname.startsWith('/roles')) return 'الأدوار والصلاحيات'
  if (window.location.pathname.startsWith('/settings')) return 'الإعدادات'
  if (window.location.pathname.startsWith('/notifications')) return 'الإشعارات'
  return 'لوحة التحكم'
}

function DashboardLayout({ onLogout }: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState(initialActivePage)
  const [search, setSearch] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)

  function markAllNotificationsRead() {
    setNotifications((items) => items.map((item) => ({ ...item, unread: false })))
  }

  function markNotificationRead(id: string) {
    setNotifications((items) => items.map((item) => (item.id === id ? { ...item, unread: false } : item)))
  }

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
    } else if (page === 'وسائل الدفع') {
      if (window.location.pathname !== '/payment-methods') {
        window.history.pushState({}, '', '/payment-methods')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'أسعار الصرف') {
      if (window.location.pathname !== '/exchange-rates') {
        window.history.pushState({}, '', '/exchange-rates')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الملف الشخصي') {
      if (!window.location.pathname.startsWith('/profile')) {
        window.history.pushState({}, '', '/profile')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'المشرفين') {
      if (window.location.pathname !== '/supervisors') {
        window.history.pushState({}, '', '/supervisors')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الأدوار والصلاحيات') {
      if (window.location.pathname !== '/roles') {
        window.history.pushState({}, '', '/roles')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الإعدادات') {
      if (window.location.pathname !== '/settings') {
        window.history.pushState({}, '', '/settings')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (page === 'الإشعارات') {
      if (window.location.pathname !== '/notifications') {
        window.history.pushState({}, '', '/notifications')
      }
      window.dispatchEvent(new PopStateEvent('popstate'))
    } else if (
      window.location.pathname.startsWith('/merchants')
      || window.location.pathname.startsWith('/transfers')
      || window.location.pathname.startsWith('/countries')
      || window.location.pathname.startsWith('/payment-methods')
      || window.location.pathname.startsWith('/exchange-rates')
      || window.location.pathname.startsWith('/profile')
      || window.location.pathname.startsWith('/supervisors')
      || window.location.pathname.startsWith('/roles')
      || window.location.pathname.startsWith('/settings')
      || window.location.pathname.startsWith('/notifications')
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
    <div
      className={cn(
        /* `dashboard` retained for DashboardPrimitives.css selectors */
        'dashboard flex min-h-dvh bg-canvas text-text',
        isSidebarOpen && 'dashboard-sidebar-open',
      )}
      dir="rtl"
    >
      {isSidebarOpen && (
        <button
          type="button"
          className={cn(
            'fixed inset-0 z-[19] block cursor-pointer border-0 bg-[rgb(30_43_55_/_24%)] p-0',
            'min-[921px]:hidden',
          )}
          aria-label="إغلاق القائمة"
          onClick={closeSidebar}
        />
      )}
      <Sidebar nav={{ activePage, isOpen: isSidebarOpen, onLogout, onNavigate: navigateToPage }} />
      <main
        className={cn(
          'min-h-dvh min-w-0 w-full overflow-x-clip',
          'min-[921px]:ms-[205px] min-[921px]:w-[calc(100%-205px)]',
          'min-[1181px]:ms-[224px] min-[1181px]:w-[calc(100%-224px)]',
        )}
      >
        <DashboardHeader
          header={{
            activePage,
            search,
            onSearchChange: setSearch,
            isSidebarOpen,
            onMenuClick: () => setIsSidebarOpen((open) => !open),
            onOpenProfile: () => navigateToPage('الملف الشخصي'),
            notifications,
            onMarkAllRead: markAllNotificationsRead,
            onOpenNotifications: () => navigateToPage('الإشعارات'),
          }}
        />
        <div
          className={cn(
            /* `page-content` retained for custom.css :has() padding overrides */
            'page-content mx-auto w-[min(100%,1600px)] max-w-full overflow-x-clip px-[14px] pt-[18px] pb-[14px]',
            'min-[721px]:px-[30px] min-[721px]:pt-6 min-[721px]:pb-4',
            'min-[721px]:max-[1180px]:px-[22px]',
          )}
        >
          {activePage === 'الحوالات' ? (
            <TransfersPage />
          ) : activePage === 'التجار' ? (
            <TradersPage />
          ) : activePage === 'الدول' ? (
            <CountriesPage />
          ) : activePage === 'وسائل الدفع' ? (
            <PaymentMethodsPage />
          ) : activePage === 'أسعار الصرف' ? (
            <ExchangeRatesPage />
          ) : activePage === 'الملف الشخصي' ? (
            <ProfilePage />
          ) : activePage === 'المشرفين' ? (
            <SupervisorsPage />
          ) : activePage === 'الأدوار والصلاحيات' ? (
            <RolesPage />
          ) : activePage === 'الإعدادات' ? (
            <SettingsPage />
          ) : activePage === 'الإشعارات' ? (
            <NotificationsPage
              page={{
                items: notifications,
                onMarkAllRead: markAllNotificationsRead,
                onMarkRead: markNotificationRead,
              }}
            />
          ) : (
            <DashboardPage title={activePage} search={search} onNewTransfer={() => navigateToPage('الحوالات')} />
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
