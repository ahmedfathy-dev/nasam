import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, ChevronLeft, Menu, Search, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NotificationItem } from '../data/dashboardData'
import NotificationsPanel from './NotificationsPanel'

export type DashboardHeaderState = {
  activePage: string
  search: string
  onSearchChange: (value: string) => void
  isSidebarOpen: boolean
  onMenuClick: () => void
  onOpenProfile: () => void
  notifications: NotificationItem[]
  onMarkAllRead: () => void
  onOpenNotifications: () => void
}

function DashboardHeader({ header }: { header: DashboardHeaderState }) {
  const { activePage, search, onSearchChange, isSidebarOpen, onMenuClick, onOpenProfile, notifications, onMarkAllRead, onOpenNotifications } = header
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
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

  const iconBtn = cn(
    'relative grid size-[30px] flex-none place-items-center rounded-[5px] border border-transparent',
    'bg-transparent p-0 text-[#77828c] cursor-pointer',
    'hover:border-[#e5e5e5] hover:bg-[#f1f1f1] hover:text-[#202a30] hover:[&_svg]:text-[#43a52e]',
  )

  return (
    <header
      className={cn(
        'flex h-[55px] items-center gap-[9px] border-b border-[#e9ecef] bg-white px-[13px]',
        'min-[721px]:h-[60px] min-[721px]:gap-5 min-[721px]:px-[30px]',
        'min-[721px]:max-[1180px]:gap-[14px] min-[721px]:max-[1180px]:px-[22px]',
        'max-[500px]:gap-1.5',
      )}
    >
      <button
        className={cn(iconBtn, 'grid min-[921px]:hidden')}
        type="button"
        aria-label={isSidebarOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
        aria-expanded={isSidebarOpen}
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </button>
      <div
        className={cn(
          'hidden flex-none items-center gap-2 whitespace-nowrap text-[11px] text-[#98a0a8]',
          'min-[501px]:flex min-[501px]:max-[720px]:gap-[5px] min-[501px]:max-[720px]:text-[10px]',
        )}
      >
        <span>الرئيسية</span>
        <ChevronLeft size={13} />
        <strong className="font-medium text-[#4b5662]">
          {activePage === 'الدول' ? 'إدارة الدول' : activePage === 'التجار' ? 'إدارة التجار' : activePage === 'وسائل الصرف' ? 'وسائل الدفع' : activePage === 'أسعار الصرف' ? 'أسعار الصرف اليومية' : window.location.pathname.startsWith('/profile/edit') ? 'تعديل الملف الشخصي' : activePage}
        </strong>
      </div>
      <label
        className={cn(
          'flex h-[34px] w-full flex-1 items-center gap-2 rounded-[6px] border border-[#e9edf0]',
          'bg-[#fafbfc] px-2.5 text-[#9ca5ad]',
          'transition-[border-color,background-color,box-shadow] duration-150',
          'hover:not-focus-within:border-[#cbd5dc] hover:not-focus-within:bg-white',
          'focus-within:border-blue focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(23_141_224_/_9%)]',
          'min-[501px]:ms-auto min-[501px]:me-0 min-[501px]:w-[min(260px,39vw)] min-[501px]:flex-none',
          'min-[721px]:mx-auto min-[721px]:w-[min(320px,32vw)]',
        )}
      >
        <Search size={15} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث عن حوالة، كود أو تحويل..."
          className="h-full w-full min-w-0 border-0 bg-transparent p-0 text-base text-[#34404b] outline-0 text-end min-[681px]:text-[11px]"
        />
      </label>
      <div
        className={cn(
          'flex flex-none items-center gap-1',
          'min-[721px]:gap-[11px]',
          'max-[720px]:gap-1',
        )}
      >
        <button
          className={cn(iconBtn, 'hidden min-[721px]:grid')}
          type="button"
          aria-label="تصفية"
        >
          <SlidersHorizontal size={16} />
        </button>
        <div className="relative" ref={notificationsRef}>
          <button
            className={iconBtn}
            type="button"
            aria-label="الإشعارات"
            aria-expanded={isNotificationsOpen}
            onClick={() => setIsNotificationsOpen((open) => !open)}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <i className="absolute top-[5px] start-1.5 size-1.5 rounded-full border border-white bg-[#56b943]" />
            )}
          </button>
          {isNotificationsOpen && (
            <NotificationsPanel
              items={notifications}
              onMarkAllRead={onMarkAllRead}
              onViewAll={() => {
                setIsNotificationsOpen(false)
                onOpenNotifications()
              }}
            />
          )}
        </div>
        <span className="hidden h-[22px] w-px bg-[#edf0f2] min-[721px]:block" />
        <button type="button" className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-0 bg-transparent p-0 text-[11px] text-[#55616d]" onClick={onOpenProfile}>
          <span
            className={cn(
              'topbar-avatar grid size-[27px] flex-none place-items-center rounded-full',
              'bg-[#e8f4fb] text-[11px] font-bold text-[#247eb6]',
            )}
          >
            أ
          </span>
          <span className="hidden min-[721px]:inline">أحمد علي</span>
          <ChevronDown size={13} className="hidden min-[721px]:block" />
        </button>
      </div>
    </header>
  )
}

export default DashboardHeader
