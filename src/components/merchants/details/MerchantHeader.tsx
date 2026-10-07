import { Pencil } from 'lucide-react'
import type { MerchantDetails } from '../../../data/merchantDetailsData'

type MerchantHeaderProps = {
  details: MerchantDetails
  canSettle: boolean
  onEdit: () => void
  onSuspend: () => void
  onSettle: () => void
}

function MerchantHeader({ details, canSettle, onEdit, onSuspend, onSettle }: MerchantHeaderProps) {
  const initial = details.name.trim().charAt(0) || 'ت'
  const isActive = details.status === 'نشط'

  return (
    <section className="md-header-card">
      <div className="md-header-main">
        <span className="md-avatar" aria-hidden="true">{initial}</span>
        <div className="md-header-copy">
          <h1 title={details.name}>{details.name}</h1>
          <div className="md-header-badges">
            <span className={`md-status-badge ${isActive ? 'is-active' : 'is-paused'}`}>
              <i />{details.status}
            </span>
            <span className="md-soft-badge">{details.country} · {details.currency}</span>
            <span className="md-soft-badge">{details.commissionLabel}</span>
          </div>
        </div>
      </div>
      <div className="md-header-actions">
        <button type="button" className="md-btn md-btn-danger" onClick={onSuspend}>
          {isActive ? 'إيقاف التاجر' : 'تفعيل التاجر'}
        </button>
        <button type="button" className="md-btn md-btn-neutral" onClick={onEdit}>
          <Pencil size={12} />تعديل
        </button>
        <button
          type="button"
          className="md-btn md-btn-green"
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
