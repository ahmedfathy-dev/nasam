import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, ChevronLeft, Menu, Search, SlidersHorizontal } from 'lucide-react'
import { initialNotifications } from '../data/dashboardData'
import NotificationsPanel from './NotificationsPanel'
import './DashboardHeader.css'

type DashboardHeaderProps = {
  activePage: string
  search: string
  onSearchChange: (value: string) => void
  isSidebarOpen: boolean
  onMenuClick: () => void
}

function DashboardHeader({ activePage, search, onSearchChange, isSidebarOpen, onMenuClick }: DashboardHeaderProps) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((item) => item.unread).length

  useEffect(() => {
    if (!isNotificationsOpen) return

    function handlePointerDown(event: MouseEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isNotificationsOpen])

  return (
    <header className="topbar">
      <button
        className="icon-button menu-button"
        type="button"
        aria-label={isSidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        aria-expanded={isSidebarOpen}
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </button>
      <div className="breadcrumb">
        <span>الرئيسية</span>
        <ChevronLeft size={13} />
        <strong>{activePage === 'الدول' ? 'إدارة الدول' : activePage === 'التجار' ? 'إدارة التجار' : activePage}</strong>
      </div>
      <label className="search-box">
        <Search size={15} />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="ابحث عن حوالة، كود أو تحويل..." />
      </label>
      <div className="topbar-actions">
        <button className="icon-button filter-button" aria-label="تصفية"><SlidersHorizontal size={16} /></button>
        <div className="notifications-wrap" ref={notificationsRef}>
          <button
            className="icon-button notification-button"
            aria-label="الإشعارات"
            aria-expanded={isNotificationsOpen}
            onClick={() => setIsNotificationsOpen((open) => !open)}
          >
            <Bell size={17} />
            {unreadCount > 0 && <i />}
          </button>
          {isNotificationsOpen && (
            <NotificationsPanel
              items={notifications}
              onMarkAllRead={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
            />
          )}
        </div>
        <span className="topbar-divider" />
        <span className="topbar-user"><span className="topbar-avatar">أ</span><span>أحمد علي</span><ChevronDown size={13} /></span>
      </div>
    </header>
  )
}

export default DashboardHeader
