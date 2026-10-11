import { cn } from '@/lib/cn'

function DashboardFooter() {
  return (
    <footer
      className={cn(
        'mt-[12px] flex justify-between gap-[12px] border-t border-[#e8ebee]',
        'px-px pb-[4px] pt-[9px] text-[8px] text-[#a3aab1]',
        'min-[501px]:text-[9px]',
      )}
    >
      <span>© ٢٠٢٦ نسام للأنظمة المالية</span>
      <span>آخر تحديث: منذ دقيقتين</span>
    </footer>
  )
}

export default DashboardFooter
