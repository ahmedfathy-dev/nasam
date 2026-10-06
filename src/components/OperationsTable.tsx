import { useMemo, useState } from 'react'
import './OperationsTable.css'
import { ChevronLeft, ChevronRight, Ellipsis, ShoppingBag } from 'lucide-react'
import { operations } from '../data/dashboardData'

type OperationsTableProps = {
  search: string
}

function OperationsTable({ search }: OperationsTableProps) {
  const [openAction, setOpenAction] = useState<string | null>(null)
  const filteredOperations = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return operations
    return operations.filter((operation) =>
      Object.values(operation).some((value) => value.toLowerCase().includes(query)),
    )
  }, [search])

  return (
    <article className="panel operations-panel">
      <div className="panel-heading">
        <div><h2>آخر العمليات</h2><p>تابع أحدث الحركات المالية في حسابك</p></div>
        <button className="text-button">عرض الكل<ChevronLeft size={14} /></button>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>رقم العملية</th><th>التاريخ</th><th>العميل</th><th>النوع</th><th>المبلغ</th><th>الحالة</th><th aria-label="الإجراءات" /></tr>
          </thead>
          <tbody>
            {filteredOperations.map((operation) => (
              <tr key={operation.id}>
                <td><span className="transaction-id" dir="ltr">{operation.id}</span></td>
                <td className="muted-cell">{operation.date}</td>
                <td className="customer-cell"><span className="customer-avatar">{operation.customer.slice(0, 1)}</span>{operation.customer}</td>
                <td><span className="type-cell"><ShoppingBag size={13} />{operation.type}</span></td>
                <td className="amount-cell" dir="ltr">{operation.amount}</td>
                <td>
                  <span className={`status status-${operation.status === 'مكتملة' ? 'complete' : operation.status === 'معلقة' ? 'pending' : 'review'}`}>
                    <i />{operation.status}
                  </span>
                </td>
                <td className="row-action-cell">
                  <button className="row-action" aria-label="إجراءات العملية" onClick={() => setOpenAction(openAction === operation.id ? null : operation.id)}><Ellipsis size={17} /></button>
                  {openAction === operation.id && (
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
        {filteredOperations.length === 0 && <div className="empty-state">لا توجد عمليات مطابقة لبحثك</div>}
      </div>
      <div className="table-footer">
        <span>عرض <strong>{filteredOperations.length}</strong> من <strong>٢٤</strong> عملية</span>
        <div className="pagination">
          <button aria-label="الصفحة السابقة"><ChevronRight size={14} /></button>
          <button className="page-current">١</button><button>٢</button><button>٣</button><span>…</span><button>٨</button>
          <button aria-label="الصفحة التالية"><ChevronLeft size={14} /></button>
        </div>
      </div>
    </article>
  )
}

export default OperationsTable