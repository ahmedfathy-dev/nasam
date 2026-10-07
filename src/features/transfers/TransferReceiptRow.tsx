type TransferReceiptRowProps = {
  label: string
  value: string
  highlight?: boolean
}

function TransferReceiptRow({ label, value, highlight }: TransferReceiptRowProps) {
  return (
    <div className={`receipt-line ${highlight ? 'is-highlight' : ''}`}>
      <span>{label}</span>
      <strong dir="ltr">{value}</strong>
    </div>
  )
}

export default TransferReceiptRow
