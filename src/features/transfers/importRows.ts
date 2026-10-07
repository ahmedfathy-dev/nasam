import type { ImportRow } from './types'

export const initialImportRows: ImportRow[] = [
  { id: '1', country: 'مصر', merchant: 'محمد سامي', method: 'Vodafone Cash', account: '01012345678', amount: '12,000', reference: 'VF-88213409', date: '05/10 14:22', status: 'صالح' },
  { id: '2', country: 'مصر', merchant: 'محمد سمير', method: 'Vodafone Cash', account: '01099887766', amount: '3,500', reference: 'VF-88123212', date: '05/10 13:10', status: 'تاجر غير موجود', errorField: 'merchant' },
  { id: '3', country: 'مصر', merchant: 'نور التجارية', method: 'InstaPay', account: 'noor@instapay', amount: '8,400', reference: 'IP-550981', date: '05/10 12:40', status: 'صالح' },
  { id: '4', country: 'مصر', merchant: 'محمد سامي', method: 'Vodafone Cash', account: '01012345678', amount: '—', reference: 'VF-88212002', date: '05/10 11:05', status: 'القيمة مفقودة', errorField: 'amount' },
  { id: '5', country: 'مصر', merchant: 'محمد سامي', method: 'Fawry', account: '01055551234', amount: '2,200', reference: 'FW-100221', date: '05/10 10:18', status: 'وسيلة غير مفعلة', errorField: 'method' },
  { id: '6', country: 'مصر', merchant: 'نور التجارية', method: 'Vodafone Cash', account: '0119083344', amount: '5,750', reference: 'VF-88300112', date: '04/10 21:44', status: 'صالح' },
  { id: '7', country: 'مصر', merchant: 'محمد سامي', method: 'InstaPay', account: 'msamy@instapay', amount: '4,100', reference: 'IP-551002', date: '04/10 19:12', status: 'صالح' },
  { id: '8', country: 'مصر', merchant: 'نور التجارية', method: 'Vodafone Cash', account: '0119083344', amount: '9,200', reference: 'VF-88310055', date: '04/10 16:05', status: 'صالح' },
  { id: '9', country: 'مصر', merchant: 'محمد سامي', method: 'Vodafone Cash', account: '01012345678', amount: '1,800', reference: 'VF-88321001', date: '04/10 14:40', status: 'صالح' },
  { id: '10', country: 'مصر', merchant: 'نور التجارية', method: 'InstaPay', account: 'noor@instapay', amount: '6,600', reference: 'IP-551188', date: '04/10 11:22', status: 'صالح' },
]
