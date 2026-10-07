import { Search } from 'lucide-react'
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

function SettlementsToolbar({
  search,
  status,
  period,
  countLabel,
  onSearchChange,
  onStatusChange,
  onPeriodChange,
}: SettlementsToolbarProps) {
  return (
    <div className="sh-toolbar">
      <div className="sh-toolbar-controls">
        <label className="sh-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="ابحث برقم التسوية أو المرجع..."
          />
        </label>
        <FormSelect
          className="sh-select"
          ariaLabel="الحالة"
          value={status}
          onChange={onStatusChange}
          options={[
            { label: 'كل الحالات', value: 'all' },
            { label: 'مُسوّاة', value: 'settled' },
            { label: 'فرق', value: 'diff' },
          ]}
        />
        <FormSelect
          className="sh-select sh-select-period"
          ariaLabel="الفترة"
          value={period}
          onChange={onPeriodChange}
          options={[
            { label: 'الفترة: كل الفترات', value: 'all' },
            { label: 'آخر 30 يوم', value: '30d' },
            { label: 'آخر 3 شهور', value: '3m' },
            { label: 'آخر 6 شهور', value: '6m' },
            { label: 'هذه السنة', value: 'year' },
          ]}
        />
      </div>
      <span className="sh-toolbar-count">{countLabel}</span>
    </div>
  )
}

export default SettlementsToolbar
