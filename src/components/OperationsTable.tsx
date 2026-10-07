import { useMemo, useState } from 'react'
import './OperationsTable.css'
import { ChevronLeft, Ellipsis } from 'lucide-react'
import { recentTransfers } from '../data/dashboardData'

type OperationsTableProps = {
  search: string
  onViewAll?: () => void
}

const statusClass = {
  مكتملة: 'complete',
  معلقة: 'pending',
  'قيد المراجعة': 'review',
} as const

function OperationsTable({ search, onViewAll }: OperationsTableProps) {
  const [openAction, setOpenAction] = useState<string | null>(null)
  const filteredTransfers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return recentTransfers
    return recentTransfers.filter((transfer) =>
      Object.values(transfer).some((value) => value.toLowerCase().includes(query)),
    )
  }, [search])

  return (
    <article className="panel operations-panel">
      <div className="panel-heading">
        <div>
          <h2>آخر الحوالات</h2>
          <p>أحدث الحوالات المسجلة في النظام</p>
        </div>
        <button className="text-button" type="button" onClick={onViewAll}>عرض الكل<ChevronLeft size={14} /></button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>رقم الحوالة</th>
              <th>التاريخ</th>
              <th>المرسل</th>
              <th>المستلم</th>
              <th>الدولة</th>
              <th>طريقة التحويل</th>
              <th>المبلغ المرسل</th>
              <th>المبلغ المستلم</th>
              <th>الحالة</th>
              <th aria-label="الإجراءات" />
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map((transfer) => (
              <tr key={transfer.id}>
                <td><span className="transaction-id" dir="ltr">{transfer.id}</span></td>
                <td className="muted-cell" dir="ltr">{transfer.date}</td>
                <td className="customer-cell">{transfer.sender}</td>
                <td>{transfer.recipient}</td>
                <td>{transfer.country}</td>
                <td className="muted-cell">{transfer.method}</td>
                <td className="amount-cell" dir="ltr">{transfer.sent}</td>
                <td className="amount-cell" dir="ltr">{transfer.received}</td>
                <td>
                  <span className={`status status-${statusClass[transfer.status]}`}>
                    <i />{transfer.status}
                  </span>
                </td>
                <td className="row-action-cell">
                  <button className="row-action" aria-label="إجراءات الحوالة" onClick={() => setOpenAction(openAction === transfer.id ? null : transfer.id)}><Ellipsis size={17} /></button>
                  {openAction === transfer.id && (
                    <div className="row-menu">
                      <button onClick={() => setOpenAction(null)}>عرض التفاصيل</button>
                      <button onClick={() => setOpenAction(null)}>تنزيل الإيصال</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransfers.length === 0 && <div className="empty-state">لا توجد حوالات مطابقة لبحثك</div>}
      </div>
    </article>
  )
}

export default OperationsTable
