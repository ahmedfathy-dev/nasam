import { ChevronDown, CircleHelp, LogOut } from 'lucide-react'
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
        <span className="brand-mark">N</span>
        <span className="brand-name">NASAM</span>
        <span className="brand-dot">●</span>
      </div>
      <div className="workspace-label">مساحة العمل</div>
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
      <div className="sidebar-bottom">
        <button className="help-link"><CircleHelp size={16} /><span>المساعدة والدعم</span></button>
        <button className="profile-card">
          <span className="avatar">م</span>
          <span className="profile-copy"><strong>محمد العتيبي</strong><small>مدير النظام</small></span>
          <ChevronDown size={14} />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar