import { useMemo } from 'react'
import { cn } from '@/lib/cn'
import { recentTransfers } from '../data/dashboardData'

type OperationsTableProps = {
  search: string
}

const thClass = 'h-10 px-2.5 text-start text-[11px] font-medium text-[#929aa2]'
const tdClass = 'h-11 border-t border-[#f0f2f4] px-2.5 text-[12px]'

function OperationsTable({ search }: OperationsTableProps) {
  const filteredTransfers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return recentTransfers
    return recentTransfers.filter((transfer) =>
      Object.values(transfer).some((value) => value.toLowerCase().includes(query)),
    )
  }, [search])

  return (
    <article
      className={cn(
        'min-w-0 rounded-xl border border-[#e9ecef] bg-surface',
        'shadow-[0_2px_5px_rgb(30_45_58_/_2%)]',
      )}
    >
      <div className="flex min-h-[58px] items-center justify-between gap-3 border-b border-[#edf0f2] px-4 py-3">
        <div className="text-start">
          <h2 className="text-[16px] font-bold leading-[1.35] text-[#1c242b]">آخر الحوالات</h2>
          <p className="mt-0.5 text-[12px] text-[#9aa3ab]">أحدث الحوالات المسجلة في النظام</p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse whitespace-nowrap">
          <thead className="bg-[#fafbfc]">
            <tr>
              <th className={thClass}>رقم الحوالة</th>
              <th className={thClass}>التاريخ</th>
              <th className={thClass}>الدولة</th>
              <th className={thClass}>التاجر</th>
              <th className={thClass}>الطريقة</th>
              <th className={thClass}>القيمة</th>
              <th className={thClass}>الصافي (محلي)</th>
              <th className={thClass}>الصافي ($)</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransfers.map((transfer) => (
              <tr key={transfer.id} className="hover:bg-[#fbfdfe]">
                <td className={cn(tdClass, 'text-start')}>
                  <span className="font-sans text-[12px] font-semibold text-[#3988b8]" dir="ltr">
                    {transfer.id}
                  </span>
                </td>
                <td className={cn(tdClass, 'text-end text-[#87919a]')} dir="ltr">{transfer.date}</td>
                <td className={cn(tdClass, 'text-start text-[#5c666e]')}>{transfer.country}</td>
                <td className={cn(tdClass, 'text-start font-semibold text-[#2f3942]')}>{transfer.merchant}</td>
                <td className={cn(tdClass, 'text-start text-[#6d767e]')}>{transfer.method}</td>
                <td className={cn(tdClass, 'text-end font-sans font-semibold text-[#35404a]')} dir="ltr">{transfer.amount}</td>
                <td className={cn(tdClass, 'text-end font-sans text-[#5c666e]')} dir="ltr">{transfer.netLocal}</td>
                <td className={cn(tdClass, 'text-end font-sans font-semibold text-[#2fbe4f]')} dir="ltr">{transfer.netUsd}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransfers.length === 0 && (
          <div className="px-3 py-6 text-center text-[13px] text-[#929ba4]">
            لا توجد حوالات مطابقة لبحثك
          </div>
        )}
      </div>
    </article>
  )
}

export default OperationsTable
