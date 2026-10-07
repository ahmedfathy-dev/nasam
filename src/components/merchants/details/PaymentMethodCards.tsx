import { Plus } from 'lucide-react'
import { formatAmount, type MerchantPaymentMethod } from '../../../data/merchantDetailsData'

type PaymentMethodCardsProps = {
  methods: MerchantPaymentMethod[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd?: () => void
}

function PaymentMethodCards({ methods, selectedId, onSelect, onAdd }: PaymentMethodCardsProps) {
  return (
    <section className="md-section">
      <div className="md-section-head">
        <div>
          <h2>وسائل التحويل الخاصة بالتاجر</h2>
          <p>اختر وسيلة لعرض سجل التسويات الخاص بها</p>
        </div>
        <button type="button" className="md-btn md-btn-green-soft" onClick={onAdd}>
          <Plus size={12} />إضافة وسيلة
        </button>
      </div>
      <div className="md-methods-grid">
        {methods.map((method) => {
          const selected = method.id === selectedId
          return (
            <button
              type="button"
              key={method.id}
              className={`md-method-card ${selected ? 'is-selected' : ''} ${method.status === 'موقوف' ? 'is-paused' : ''}`}
              onClick={() => onSelect(method.id)}
            >
              <div className="md-method-top">
                <strong>{method.name}</strong>
                <span className={`md-status-badge ${method.status === 'نشط' ? 'is-active' : 'is-paused'}`}>
                  <i />{method.status}
                </span>
              </div>
              <div className="md-method-account" dir="ltr">{method.account}</div>
              <div className="md-method-stats">
                <div><span>عدد التحويلات</span><b>{formatAmount(method.transfersCount)}</b></div>
                <div><span>إجمالي التحويلات</span><b dir="ltr">{formatAmount(method.totalAmount)}</b></div>
                <div><span>العمولة</span><b dir="ltr">{formatAmount(method.commission)}</b></div>
                <div><span>صافي المستحق</span><b className="is-green" dir="ltr">{formatAmount(method.netDue)}</b></div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default PaymentMethodCards
