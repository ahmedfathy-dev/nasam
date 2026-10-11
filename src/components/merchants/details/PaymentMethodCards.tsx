import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatAmount, type MerchantPaymentMethod } from '../../../data/merchantDetailsData'

type PaymentMethodCardsProps = {
  methods: MerchantPaymentMethod[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd?: () => void
}

function PaymentMethodCards({ cards }: { cards: PaymentMethodCardsProps }) {
  const { methods: sourceMethods, selectedId, onSelect, onAdd } = cards
  const methods = sourceMethods ?? []
  return (
    <section className="md-section grid min-w-0 max-w-full gap-2.5">
      <div className="md-section-head flex flex-col items-stretch gap-2 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:items-start min-[640px]:justify-between">
        <div>
          <h2 className="text-[13px] font-bold text-[#303b46]">وسائل التحويل الخاصة بالتاجر</h2>
          <p className="mt-0.5 text-[10px] text-text-muted">اختر وسيلة لعرض سجل التسويات الخاص بها</p>
        </div>
        <button type="button" className="md-btn md-btn-green-soft inline-flex min-h-10 w-full items-center justify-center gap-[5px] whitespace-nowrap rounded-[6px] border border-green-border bg-[#f3faf1] px-2.5 text-[10px] text-[#3f9a37] min-[640px]:min-h-[30px] min-[640px]:w-auto" onClick={onAdd}>
          <Plus size={12} />إضافة وسيلة
        </button>
      </div>
      <div
        className={cn(
          'md-methods-grid flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1',
          'min-[640px]:grid min-[640px]:grid-cols-2 min-[640px]:overflow-visible',
          'min-[1024px]:grid-cols-4 min-[1024px]:gap-2.5',
        )}
      >
        {methods.map((method) => {
          const selected = method.id === selectedId
          return (
            <button
              type="button"
              key={method.id}
              className={cn(
                'md-method-card grid w-full min-w-0 flex-[0_0_min(280px,85vw)] gap-2 snap-start rounded-[7px] border border-line bg-surface p-2.5 text-end',
                'transition-[border-color,background] duration-[120ms] ease-in-out',
                'min-[640px]:flex-none min-[640px]:p-3',
                selected && 'is-selected border-green bg-[#f3faf1] shadow-[inset_0_0_0_1px_#c8e0c2]',
                method.status === 'موقوف' && 'is-paused',
              )}
              onClick={() => onSelect(method.id)}
            >
              <div className="md-method-top flex items-center justify-between gap-2">
                <strong className="text-[11px] font-bold text-[#303b46]">{method.name}</strong>
                <span className={cn('md-status-badge inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-[3px] text-[9px]', method.status === 'نشط' ? 'is-active bg-[#eaf6e8] text-[#3f9a37]' : 'is-paused bg-[#fdebec] text-danger')}>
                  <i className="size-[5px] rounded-full bg-current" />{method.status}
                </span>
              </div>
              <div className="md-method-account text-end text-[9px] text-text-muted" dir="ltr">{method.account}</div>
              <div className="md-method-stats grid gap-[5px]">
                <div className="flex items-center justify-between gap-2 text-[9px]"><span className="text-text-muted">عدد التحويلات</span><b className="font-semibold text-[#3a434a]">{formatAmount(method.transfersCount)}</b></div>
                <div className="flex items-center justify-between gap-2 text-[9px]"><span className="text-text-muted">إجمالي التحويلات</span><b className="font-semibold text-[#3a434a]" dir="ltr">{formatAmount(method.totalAmount)}</b></div>
                <div className="flex items-center justify-between gap-2 text-[9px]"><span className="text-text-muted">العمولة</span><b className="font-semibold text-[#3a434a]" dir="ltr">{formatAmount(method.commission)}</b></div>
                <div className="flex items-center justify-between gap-2 text-[9px]"><span className="text-text-muted">صافي المستحق</span><b className="is-green font-semibold text-green" dir="ltr">{formatAmount(method.netDue)}</b></div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default PaymentMethodCards
