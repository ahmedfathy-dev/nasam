import { LogOut } from 'lucide-react'
import { navigation } from '../data/dashboardData'
import './Sidebar.css'

type SidebarProps = {
  activePage: string
  isOpen: boolean
  onNavigate: (page: string) => void
  onLogout: () => void
}

function Sidebar({ activePage, isOpen, onNavigate, onLogout }: SidebarProps) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="brand" aria-label="نسام">
        <img className="brand-logo" src="/logo.png" alt="نسام" />
      </div>
      <nav className="side-nav" aria-label="القائمة الرئيسية">
        {navigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={`nav-item ${activePage === label ? 'nav-active' : ''}`}
            onClick={() => onNavigate(label)}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <button className="logout-link" onClick={onLogout}><LogOut size={16} /><span>تسجيل الخروج</span></button>
    </aside>
  )
}

export default Sidebar
