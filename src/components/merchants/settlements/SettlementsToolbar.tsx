import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import FormSelect from '../../ui/FormSelect'

type SettlementsToolbarProps = {
  search: string
  status: string
  period: string
  countLabel: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onPeriodChange: (value: string) => void
}

function SettlementsToolbar({ toolbar }: { toolbar: SettlementsToolbarProps }) {
  const {
    search,
    status,
    period,
    countLabel,
    onSearchChange,
    onStatusChange,
    onPeriodChange,
  } = toolbar
  return (
    <div className="sh-toolbar mb-3.5 flex flex-wrap items-center justify-between gap-3">
      <div className="sh-toolbar-controls grid min-w-0 flex-1 grid-cols-2 gap-2 min-[640px]:flex min-[640px]:flex-wrap min-[640px]:items-center min-[1024px]:flex-nowrap">
        <label className={cn(
          'sh-search col-span-full flex h-10 w-full min-w-0 items-center gap-[7px] rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] px-2.5 text-[#929aa1]',
          'min-[640px]:h-9 min-[640px]:w-full min-[1024px]:w-[min(280px,100%)]',
        )}>
          <Search size={14} />
          <input
            className="w-full min-w-0 border-0 bg-transparent text-base text-[#4c555b] outline-0 min-[640px]:text-[11px]"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ابحث برقم التسوية أو المرجع..."
          />
        </label>
        <FormSelect
          field={{
            className: 'h-10 min-w-0 w-full rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] min-[640px]:h-9 min-[640px]:min-w-0 min-[640px]:flex-[1_1_calc(50%-4px)] min-[1024px]:w-[140px] min-[1024px]:flex-none [&_.form-select-trigger]:!text-[11px]',
            ariaLabel: 'الحالة',
            value: status,
            onChange: onStatusChange,
            options: [
              { label: 'كل الحالات', value: 'all' },
              { label: 'مُسوّاة', value: 'settled' },
              { label: 'فرق', value: 'diff' },
            ],
          }}
        />
        <FormSelect
          field={{
            className: 'h-10 min-w-0 w-full rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] min-[640px]:h-9 min-[640px]:min-w-0 min-[640px]:flex-[1_1_calc(50%-4px)] min-[1024px]:w-[170px] min-[1024px]:flex-none [&_.form-select-trigger]:!text-[11px]',
            ariaLabel: 'الفترة',
            value: period,
            onChange: onPeriodChange,
            options: [
              { label: 'الفترة: كل الفترات', value: 'all' },
              { label: 'آخر 30 يوم', value: '30d' },
              { label: 'آخر 3 شهور', value: '3m' },
              { label: 'آخر 6 شهور', value: '6m' },
              { label: 'هذه السنة', value: 'year' },
            ],
          }}
        />
      </div>
      <span className="sh-toolbar-count w-full flex-none whitespace-normal text-center text-[11px] text-text-muted min-[640px]:w-auto min-[640px]:whitespace-nowrap min-[640px]:text-start">{countLabel}</span>
    </div>
  )
}

export default SettlementsToolbar
