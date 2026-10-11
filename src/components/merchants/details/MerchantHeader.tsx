import { Pencil } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { MerchantDetails } from '../../../data/merchantDetailsData'

type MerchantHeaderProps = {
  details: MerchantDetails
  canSettle: boolean
  onEdit: () => void
  onSuspend: () => void
  onSettle: () => void
}

const mdBtn = cn(
  'md-btn inline-flex min-h-10 items-center justify-center gap-[5px] whitespace-nowrap rounded-[6px] px-2.5 text-[10px]',
  'min-[640px]:min-h-[30px]',
)

function MerchantHeader({ header }: { header: MerchantHeaderProps }) {
  const { details, canSettle, onEdit, onSuspend, onSettle } = header
  if (!details) return null
  const initial = details.name.trim().charAt(0) || 'ت'
  const isActive = details.status === 'نشط'

  return (
    <section
      className={cn(
        'md-header-card flex w-full flex-col items-stretch gap-3 rounded-[7px] border border-line bg-surface p-3',
        'min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:gap-3 min-[640px]:px-3.5',
        'min-[1024px]:items-center min-[1024px]:gap-3.5 min-[1024px]:px-4 min-[1024px]:py-3.5',
      )}
    >
      <div className="md-header-main flex min-w-0 flex-1 items-center gap-2.5 min-[640px]:w-full min-[1024px]:w-auto min-[1024px]:gap-3">
        <span className="md-avatar grid size-10 flex-none place-items-center rounded-full bg-green-soft text-base font-bold text-green min-[640px]:size-[46px] min-[640px]:text-[18px]" aria-hidden="true">{initial}</span>
        <div className="md-header-copy grid min-w-0 gap-1.5">
          <h1
            className={cn(
              'overflow-hidden text-ellipsis text-[16px] font-bold leading-[1.3] text-[#232a30]',
              'min-[640px]:whitespace-normal min-[640px]:text-[18px] min-[640px]:[overflow-wrap:anywhere]',
              'min-[1024px]:whitespace-nowrap min-[1024px]:text-xl',
            )}
            title={details.name}
          >
            {details.name}
          </h1>
          <div className="md-header-badges flex flex-wrap items-center gap-[5px] min-[640px]:gap-1.5">
            <span className={cn('md-status-badge inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[9px]', isActive ? 'is-active bg-[#eaf6e8] text-[#3f9a37]' : 'is-paused bg-[#fdebec] text-danger')}>
              <i className="size-[5px] rounded-full bg-current" />{details.status}
            </span>
            <span className="md-soft-badge inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f3f5f6] px-2 py-[3px] text-[9px] text-[#66717d]">{details.country} · {details.currency}</span>
            <span className="md-soft-badge inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-[#f3f5f6] px-2 py-[3px] text-[9px] text-[#66717d]">{details.commissionLabel}</span>
          </div>
        </div>
      </div>
      <div className="md-header-actions flex w-full max-w-full flex-wrap items-center gap-1.5">
        <button type="button" className={cn(mdBtn, 'md-btn-danger flex-[1_1_calc(50%-4px)] border border-[#f0c4c4] bg-[#fff5f5] text-danger min-[640px]:flex-[1_1_calc(33.33%-6px)]')} onClick={onSuspend}>
          {isActive ? 'إيقاف التاجر' : 'تفعيل التاجر'}
        </button>
        <button type="button" className={cn(mdBtn, 'md-btn-neutral flex-[1_1_calc(50%-4px)] border border-[#e4e9ed] bg-surface text-[#56616c] min-[640px]:flex-[1_1_calc(33.33%-6px)]')} onClick={onEdit}>
          <Pencil size={12} />تعديل
        </button>
        <button
          type="button"
          className={cn(mdBtn, 'md-btn-green flex-[1_1_100%] border border-[#c8e0c2] bg-[#f3faf1] text-green disabled:cursor-not-allowed disabled:opacity-50 min-[640px]:flex-[1_1_calc(33.33%-6px)]')}
          onClick={onSettle}
          disabled={!canSettle}
          title={canSettle ? 'تسوية الحساب' : 'لا توجد تحويلات للتسوية'}
        >
          تسوية الحساب
        </button>
      </div>
    </section>
  )
}

export default MerchantHeader
