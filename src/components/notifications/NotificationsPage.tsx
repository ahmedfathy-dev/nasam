import { useState } from 'react'
import { CheckCheck } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { NotificationItem } from '../../data/dashboardData'

type NotificationsPageProps = {
  page: {
    items: NotificationItem[]
    onMarkAllRead: () => void
    onMarkRead: (id: string) => void
  }
}

const filters = ['الكل', 'غير المقروءة'] as const

const tagTone: Record<NotificationItem['tone'], string> = {
  green: 'text-[#3ea03a] bg-[#edf8eb]',
  orange: 'text-[#c99438] bg-[#fff6e8]',
  blue: 'text-[#2a8fcb] bg-[#eef7fc]',
}

function NotificationsPage({ page }: NotificationsPageProps) {
  const { items, onMarkAllRead, onMarkRead } = page
  const [filter, setFilter] = useState<(typeof filters)[number]>('الكل')
  const unreadCount = items.filter((item) => item.unread).length
  const visible = filter === 'غير المقروءة' ? items.filter((item) => item.unread) : items

  return (
    <section className="mx-auto w-full max-w-[760px]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="text-start">
          <h1 className="text-[28px] font-bold leading-[1.25] text-[#1c242b] max-[720px]:text-[22px]">الإشعارات</h1>
          <p className="mt-1.5 text-[13px] text-[#8b949c]">
            {unreadCount > 0 ? `${unreadCount} غير مقروءة من ${items.length}` : 'كل الإشعارات مقروءة'}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#dce8ee] bg-white px-3.5 text-[13px] font-semibold text-[#1f88c4] hover:bg-[#f7fbfc] disabled:cursor-default disabled:opacity-50"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck size={15} />
          تحديد الكل كمقروء
        </button>
      </div>

      <div className="mb-3 flex w-fit items-center gap-1 rounded-lg bg-[#f3f4f6] p-1" role="tablist" aria-label="تصفية الإشعارات">
        {filters.map((item) => {
          const selected = item === filter
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setFilter(item)}
              className={cn(
                'h-7 cursor-pointer rounded-md px-3 text-[12px] font-semibold',
                selected ? 'bg-[#111315] text-white' : 'bg-transparent text-[#6d767e] hover:text-[#1c242b]',
              )}
            >
              {item}
            </button>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e9ecef] bg-white shadow-[0_2px_5px_rgb(30_45_58_/_2%)]">
        {visible.length === 0 ? (
          <p className="px-4 py-10 text-center text-[13px] text-[#8b949c]">لا توجد إشعارات غير مقروءة</p>
        ) : (
          <ul className="m-0 list-none">
            {visible.map((item) => (
              <li key={item.id} className="border-b border-[#f3f5f7] last:border-b-0">
                <button
                  type="button"
                  className={cn(
                    'flex w-full cursor-pointer flex-col gap-1 px-4 py-3.5 text-start',
                    item.unread ? 'bg-[#f8fcf7] hover:bg-[#f3faf1]' : 'bg-white hover:bg-[#fafbfc]',
                  )}
                  onClick={() => onMarkRead(item.id)}
                >
                  <span className="flex items-center justify-between gap-3">
                    <strong className="text-[14px] font-bold text-[#24303a]">{item.title}</strong>
                    {item.tag ? (
                      <span className={cn('flex-none rounded-full px-2 py-0.5 text-[10px] font-bold', tagTone[item.tone])}>
                        {item.tag}
                      </span>
                    ) : null}
                  </span>
                  <span className="text-[13px] leading-[1.6] text-[#6d767e]">{item.body}</span>
                  <time className="text-[12px] text-[#9aa3ab]">{item.time}</time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default NotificationsPage
