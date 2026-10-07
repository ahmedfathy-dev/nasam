import { formatDateTime } from '../../utils/format'
import type { TransferFormValues, TransferOcrFields } from './types'

/** Demo receipt shown in the design screenshot when no draft is restored. */
export const DEMO_RECEIPT_NAME = 'vodafone_receipt_0510.jpg'

export function emptyTransferForm(nextNumber: string): TransferFormValues {
  return {
    country: 'مصر',
    merchant: 'محمد سامي',
    method: 'Vodafone Cash',
    account: '01012345678',
    amount: '12,000',
    number: nextNumber,
    reference: 'VF-88213409',
    sender: 'أحمد يوسف',
    receiverPhone: '01012345678',
    date: formatDateTime(new Date(), ' · '),
    note: '',
  }
}

/** Fields that appear OCR-filled in the design (light green backgrounds). */
export const DEMO_OCR_FIELDS: TransferOcrFields = {
  amount: true,
  reference: true,
  sender: true,
  receiverPhone: true,
  date: true,
}
