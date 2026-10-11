import { CheckCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NotificationItem } from '../data/dashboardData'

type NotificationsPanelProps = {
  items: NotificationItem[]
  onMarkAllRead: () => void
  onViewAll: () => void
}

const tagTone: Record<NotificationItem['tone'], string> = {
  green: 'text-[#3ea03a] bg-[#edf8eb]',
  orange: 'text-[#c99438] bg-[#fff6e8]',
  blue: 'text-[#2a8fcb] bg-[#eef7fc]',
}

function NotificationsPanel({ items, onMarkAllRead, onViewAll }: NotificationsPanelProps) {
  const unreadCount = items.filter((item) => item.unread).length

  return (
    <section
      className={cn(
        'absolute end-0 top-[calc(100%+8px)] z-30 w-[min(360px,calc(100vw-24px))] overflow-hidden',
        'rounded-[10px] border border-[#e7ecef] bg-white',
        'shadow-[0_16px_40px_rgb(28_41_54_/_14%)]',
      )}
      aria-label="الإشعارات"
    >
      <header className="flex items-start justify-between gap-[10px] border-b border-[#eef1f3] px-[14px] pb-[10px] pt-[14px]">
        <div>
          <h2 className="text-[14px] font-bold text-[#24303a]">الإشعارات</h2>
          <span
            className={cn(
              'mt-[4px] inline-flex rounded-full bg-[#edf8eb] px-[7px] py-[2px]',
              'text-[9px] font-semibold text-[#3ea03a]',
            )}
          >
            {unreadCount} غير مقروءة
          </span>
        </div>
        <button
          type="button"
          className={cn(
            'inline-flex cursor-pointer items-center gap-[4px] whitespace-nowrap border-0 bg-transparent p-0',
            'text-[10px] text-[#2189c9]',
          )}
          onClick={onMarkAllRead}
        >
          <CheckCheck size={13} />
          تحديد الكل كمقروء
        </button>
      </header>

      <ul className="m-0 max-h-[420px] list-none overflow-y-auto py-[6px]">
        {items.map((item) => (
          <li
            key={item.id}
            className={cn(
              'border-b border-[#f3f5f7] px-[14px] pb-[11px] pt-[10px]',
              item.unread && 'bg-[#f8fcf7]',
            )}
          >
            <div className="flex items-center justify-between gap-[8px]">
              <strong className="text-[11px] font-bold text-[#2c3843]">{item.title}</strong>
              {item.tag && (
                <span
                  className={cn(
                    'flex-none rounded-full px-[6px] py-[2px] text-[8px] font-bold',
                    tagTone[item.tone],
                  )}
                >
                  {item.tag}
                </span>
              )}
            </div>
            <p className="mt-[4px] text-[10px] leading-[1.55] text-[#7a858f]">{item.body}</p>
            <time className="mt-[5px] block text-[9px] text-[#a4adb5]">{item.time}</time>
          </li>
        ))}
      </ul>

      <footer className="border-t border-[#eef1f3] px-[14px] pb-[12px] pt-[10px]">
        <button
          type="button"
          className={cn(
            'h-[32px] w-full cursor-pointer rounded-[6px] border border-[#dce8ee] bg-[#f7fbfc]',
            'text-[11px] text-[#1f88c4] hover:bg-[#eef7fc]',
          )}
          onClick={onViewAll}
        >
          عرض كل الإشعارات
        </button>
      </footer>
    </section>
  )
}

export default NotificationsPanel
