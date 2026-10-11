import { cn } from '@/lib/cn'

type TransferReceiptRowProps = {
  label: string
  value: string
  highlight?: boolean
}

function TransferReceiptRow({ label, value, highlight }: TransferReceiptRowProps) {
  return (
    <div
      className={cn(
        'mx-2.5 mb-1.5 flex items-center justify-between gap-2 text-start text-[11px] text-[#818990]',
      )}
    >
      <span>{label}</span>
      <strong
        className={cn(
          'max-w-[62%] min-w-0 overflow-hidden text-ellipsis whitespace-nowrap rounded-[6px] px-2 py-[5px] text-[11px] font-semibold text-[#4d565d]',
          highlight && 'border border-dashed border-green-border bg-[#f3faf1] text-[#2f7d35]',
        )}
        dir="ltr"
      >
        {value}
      </strong>
    </div>
  )
}

export default TransferReceiptRow
