export type TransferFormValues = {
  country: string
  merchant: string
  method: string
  account: string
  amount: string
  number: string
  reference: string
  sender: string
  receiverPhone: string
  date: string
  note: string
}

export type TransferOcrFields = Partial<
  Record<'amount' | 'receiverPhone' | 'sender' | 'reference' | 'date', boolean>
>

export type ImportTab = 'all' | 'errors' | 'valid'

export type ImportRow = {
  id: string
  country: string
  merchant: string
  method: string
  account: string
  amount: string
  reference: string
  date: string
  status: string
  errorField?: 'merchant' | 'method' | 'amount'
}
