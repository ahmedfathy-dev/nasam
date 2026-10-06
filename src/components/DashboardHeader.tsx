import { Bell, ChevronDown, ChevronLeft, Menu, Search, SlidersHorizontal } from 'lucide-react'

type DashboardHeaderProps = {
  activePage: string
  search: string
  onSearchChange: (value: string) => void
  onMenuClick: () => void
}

function DashboardHeader({ activePage, search, onSearchChange, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="topbar">
      <button className="icon-button menu-button" aria-label="فتح القائمة" onClick={onMenuClick}><Menu size={18} /></button>
      <div className="breadcrumb"><span>الرئيسية</span><ChevronLeft size={13} /><strong>{activePage}</strong></div>
      <label className="search-box">
        <Search size={15} />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="ابحث عن عملية أو عميل..." />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <button className="icon-button filter-button" aria-label="تصفية"><SlidersHorizontal size={16} /></button>
        <button className="icon-button notification-button" aria-label="الإشعارات"><Bell size={17} /><i /></button>
        <span className="topbar-divider" />
        <span className="topbar-user"><span className="topbar-avatar">م</span><span>محمد العتيبي</span><ChevronDown size={13} /></span>
      </div>
    </header>
  )
}

export default DashboardHeader