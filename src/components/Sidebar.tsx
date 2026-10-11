import { LogOut } from 'lucide-react'
import { cn } from '@/lib/cn'
import { navigation } from '../data/dashboardData'

export type SidebarState = {
  activePage: string
  isOpen: boolean
  onNavigate: (page: string) => void
  onLogout: () => void
}

function Sidebar({ nav }: { nav: SidebarState }) {
  const { activePage, isOpen, onNavigate, onLogout } = nav
  return (
    <aside
      className={cn(
        'fixed inset-y-0 start-0 z-20 flex flex-col border-s border-[#eceef0] bg-white px-[14px] pt-[18px] pb-[14px]',
        'shadow-[-3px_0_12px_rgb(28_41_54_/_2%)]',
        'w-[min(245px,86vw)] transition-[transform,visibility] duration-[180ms] ease-in-out',
        /* Exclusive classes: both translate-x-full and translate-x-0 cannot sit together — Tailwind cascade keeps the closed state. */
        isOpen
          ? 'translate-x-0 visible pointer-events-auto'
          : 'translate-x-full invisible pointer-events-none',
        'min-[921px]:w-[205px] min-[921px]:translate-x-0 min-[921px]:visible min-[921px]:pointer-events-auto',
        'min-[1181px]:w-[224px]',
      )}
    >
      <div className="mx-1 mb-[25px] flex min-h-[46px] items-center justify-center" aria-label="نسام">
        <img
          className="block h-auto w-[min(100%,150px)] object-contain"
          src="/logo.png"
          alt="نسام"
        />
      </div>
      <nav className="grid flex-1 content-start gap-[3px]" aria-label="القائمة الرئيسية">
        {navigation.map(({ label, icon: Icon }) => {
          const active = activePage === label
          return (
            <button
              key={label}
              type="button"
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex h-[37px] w-full cursor-pointer items-center gap-2.5 rounded-[6px] border border-transparent px-2.5 text-end',
                'transition-[background,color] duration-[140ms] ease-in-out',
                'hover:bg-[#f1f1f1] hover:text-[#202a30] hover:[&_svg]:text-[#43a52e]',
                active
                  ? 'bg-[#f1f1f1] font-semibold text-[#202a30] [&_svg]:text-[#43a52e]'
                  : 'bg-transparent text-[#66717d]',
              )}
              onClick={() => onNavigate(label)}
            >
              <Icon size={16} strokeWidth={1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        className={cn(
          'mt-auto flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-[5px] border-0 bg-transparent',
          'px-2.5 text-end text-[10px] text-[#78818a]',
          'hover:bg-[#f7f9fb] hover:text-[#4e5963]',
        )}
        onClick={onLogout}
      >
        <LogOut size={16} />
        <span>تسجيل الخروج</span>
      </button>
    </aside>
  )
}

export default Sidebar
