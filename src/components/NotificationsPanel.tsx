import { CheckCheck } from 'lucide-react'
import type { NotificationItem } from '../data/dashboardData'
import './NotificationsPanel.css'

type NotificationsPanelProps = {
  items: NotificationItem[]
  onMarkAllRead: () => void
}

function NotificationsPanel({ items, onMarkAllRead }: NotificationsPanelProps) {
  const unreadCount = items.filter((item) => item.unread).length

  return (
    <section className="notifications-panel" aria-label="الإشعارات">
      <header className="notifications-head">
        <div>
          <h2>الإشعارات</h2>
          <span className="notifications-unread">{unreadCount} غير مقروءة</span>
        </div>
        <button type="button" className="notifications-mark" onClick={onMarkAllRead}>
          <CheckCheck size={13} />
          تحديد الكل كمقروء
        </button>
      </header>

      <ul className="notifications-list">
        {items.map((item) => (
          <li key={item.id} className={`notification-item ${item.unread ? 'is-unread' : ''}`}>
            <div className="notification-top">
              <strong>{item.title}</strong>
              {item.tag && <span className={`notification-tag tag-${item.tone}`}>{item.tag}</span>}
            </div>
            <p>{item.body}</p>
            <time>{item.time}</time>
          </li>
        ))}
      </ul>

      <footer className="notifications-foot">
        <button type="button">عرض كل الإشعارات</button>
      </footer>
    </section>
  )
}

export default NotificationsPanel
