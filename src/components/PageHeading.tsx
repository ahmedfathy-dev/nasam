import { Plus, RefreshCw } from 'lucide-react'
import './PageHeading.css'

type PageHeadingProps = {
  title: string
  onNewTransfer?: () => void
}

function PageHeading({ title, onNewTransfer }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">الأربعاء، 7 أكتوبر 2026</div>
        <h1>{title}</h1>
        <p>نظرة عامة على سعر صرف اليوم لحملة الليرة التركية (TRY)</p>
      </div>
      <div className="heading-actions">
        <button className="outline-button" type="button">
          <RefreshCw size={14} />
          <span>تحديث السعر</span>
        </button>
        <button className="primary-button" type="button" onClick={onNewTransfer}>
          <Plus size={15} />
          <span>تحويل جديد</span>
        </button>
      </div>
    </div>
  )
}

export default PageHeading
