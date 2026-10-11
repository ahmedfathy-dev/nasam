export type PaymentMethodStatus = 'active' | 'paused'

export type PayoutMethod = {
  id: string
  name: string
  addedOn: string
  status: PaymentMethodStatus
  /** Seed row that the design counts as “added this month”. New rows set this when created now. */
  addedThisMonth: boolean
}

export const initialPayoutMethods: PayoutMethod[] = [
  { id: 'pm-vodafone', name: 'Vodafone Cash', addedOn: '12/03/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-instapay', name: 'InstaPay', addedOn: '12/03/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-stc', name: 'STC Pay', addedOn: '02/04/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-bank', name: 'تحويل بنكي', addedOn: '02/04/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-cliq', name: 'CliQ', addedOn: '20/05/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-orange', name: 'Orange Money', addedOn: '14/07/2026', status: 'active', addedThisMonth: false },
  { id: 'pm-wu', name: 'Western Union', addedOn: '09/02/2026', status: 'paused', addedThisMonth: false },
  { id: 'pm-etisalat', name: 'Etisalat Cash', addedOn: '18/08/2026', status: 'paused', addedThisMonth: true },
]
