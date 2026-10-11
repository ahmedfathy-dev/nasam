import {
  ArrowLeftRight,
  BadgeDollarSign,
  ClipboardList,
  Percent,
  Settings,
  Globe,
  Landmark,
  Shield,
  LayoutDashboard,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const navigation = [
  { label: 'لوحة التحكم', icon: LayoutDashboard },
  { label: 'الحوالات', icon: ArrowLeftRight },
  { label: 'التجار', icon: Users },
  { label: 'الدول', icon: Globe },
  { label: 'وسائل الدفع', icon: Landmark },
  { label: 'أسعار الصرف', icon: BadgeDollarSign },
  { label: 'المشرفين', icon: UserRound },
  { label: 'الأدوار والصلاحيات', icon: Shield },
  { label: 'الإعدادات', icon: Settings },
] satisfies { label: string; icon: LucideIcon }[]

export type TransferRow = {
  id: string
  date: string
  country: string
  merchant: string
  method: string
  amount: string
  netLocal: string
  netUsd: string
}

export const recentTransfers: TransferRow[] = [
  { id: 'TRX-1248', date: '05/10', country: 'مصر', merchant: 'محمد سامي', method: 'Vodafone Cash', amount: '12,000 EGP', netLocal: '11,760 EGP', netUsd: '$ 245.00' },
  { id: 'TRX-1247', date: '05/10', country: 'السعودية', merchant: 'مؤسسة الرياض', method: 'STC Pay', amount: '2,500 SAR', netLocal: '2,450 SAR', netUsd: '$ 653.33' },
  { id: 'TRX-1246', date: '05/10', country: 'مصر', merchant: 'محمد سامي', method: 'InstaPay', amount: '8,400 EGP', netLocal: '8,232 EGP', netUsd: '$ 171.50' },
  { id: 'TRX-1245', date: '05/10', country: 'الإمارات', merchant: 'دار الخير', method: 'Bank Transfer', amount: '3,200 AED', netLocal: '3,136 AED', netUsd: '$ 854.50' },
  { id: 'TRX-1244', date: '04/10', country: 'تركيا', merchant: 'Yildiz Ticaret', method: 'Papara', amount: '15,000 TRY', netLocal: '14,700 TRY', netUsd: '$ 429.82' },
  { id: 'TRX-1243', date: '04/10', country: 'الأردن', merchant: 'عمان للصرافة', method: 'CIQ', amount: '420 JOD', netLocal: '412 JOD', netUsd: '$ 581.10' },
  { id: 'TRX-1242', date: '04/10', country: 'مصر', merchant: 'نور للتجارة', method: 'InstaPay', amount: '20,000 EGP', netLocal: '19,600 EGP', netUsd: '$ 408.33' },
  { id: 'TRX-1241', date: '04/10', country: 'السعودية', merchant: 'مؤسسة الرياض', method: 'Bank Transfer', amount: '5,000 SAR', netLocal: '4,900 SAR', netUsd: '$ 1,306.67' },
  { id: 'TRX-1240', date: '03/10', country: 'عُمان', merchant: 'مسقط إكسبريس', method: 'Bank Transfer', amount: '300 OMR', netLocal: '294 OMR', netUsd: '$ 763.64' },
]

export const metrics = [
  { label: 'عدد حوالات اليوم', value: '38', change: '+12%', note: 'عن أمس', icon: ClipboardList },
  { label: 'إجمالي قيمة حوالات اليوم', value: '$ 12,840', change: '+8.2%', note: 'عن أمس', icon: Wallet },
  { label: 'عدد حوالات الشهر', value: '642', change: '+4.1%', note: 'عن الشهر الماضي', icon: ClipboardList },
  { label: 'إجمالي قيمة حوالات الشهر', value: '$ 214,560', change: '+7%', note: 'عن الشهر الماضي', icon: Wallet },
  { label: 'إجمالي عمولة حوالات الشهر', value: '$ 4,291', change: '+2.0%', note: 'متوسط', icon: Percent },
  { label: 'صافي المبالغ المحصلة', value: '$ 210,269', change: '', note: 'بعد خصم العمولة', icon: Wallet },
]

export const countryBreakdown = [
  { label: 'مصر', count: 271, amount: 90115, percent: 42, color: 'green' },
  { label: 'السعودية', count: 148, amount: 49349, percent: 23, color: 'green' },
  { label: 'الإمارات', count: 90, amount: 30038, percent: 14, color: 'green' },
  { label: 'تركيا', count: 71, amount: 23601, percent: 11, color: 'teal' },
  { label: 'الأردن', count: 38, amount: 12874, percent: 6, color: 'blue' },
  { label: 'عُمان', count: 24, amount: 8583, percent: 4, color: 'slate' },
]

export type NotificationItem = {
  id: string
  title: string
  body: string
  time: string
  unread: boolean
  tag?: string
  tone: 'green' | 'orange' | 'blue'
}

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'حوالة جديدة TRX-1848',
    body: 'تم استلام حوالة بقيمة 12,000 USD لحملة الليرة التركية (TRY)',
    time: 'منذ 5 دقائق',
    unread: true,
    tag: 'جديد',
    tone: 'green',
  },
  {
    id: 'n2',
    title: 'تغير في سعر الصرف',
    body: 'ارتفع سعر صرف الليرة التركية (TRY) ويمكن تنفيذ التحويل مسبقاً على سعر بنك عُمان',
    time: 'منذ 20 دقيقة',
    unread: true,
    tag: 'سعر الصرف',
    tone: 'orange',
  },
  {
    id: 'n3',
    title: 'تسوية بانتظار الاعتماد',
    body: 'توجد تسوية بانتظار اعتمادك قبل إغلاق يوم العمل',
    time: 'منذ ساعة',
    unread: false,
    tag: 'تسوية',
    tone: 'blue',
  },
  {
    id: 'n4',
    title: 'ملف Excel جاهز للتصدير',
    body: 'اكتمل تجهيز كشف الحوالات ويمكن تنزيله من التقارير',
    time: 'منذ 3 ساعات',
    unread: false,
    tag: 'Excel',
    tone: 'green',
  },
  {
    id: 'n5',
    title: 'تحويل يحتاج مراجعة',
    body: 'التحويل رقم TRX-1844 يحتاج إلى مراجعة المستندات قبل الإكمال',
    time: 'أمس',
    unread: false,
    tone: 'orange',
  },
]

export const exchangeRates = [
  { code: 'EGP', country: 'مصر', rate: '48.00', change: '+0.31%', trend: 'up' as const },
  { code: 'SAR', country: 'السعودية', rate: '3.75', change: '0.00%', trend: 'steady' as const },
  { code: 'AED', country: 'الإمارات', rate: '3.67', change: '0.00%', trend: 'steady' as const },
  { code: 'TRY', country: 'تركيا', rate: '34.20', change: '+0.29%', trend: 'up' as const },
  { code: 'JOD', country: 'الأردن', rate: '0.709', change: '0.00%', trend: 'steady' as const },
  { code: 'OMR', country: 'عُمان', rate: '0.385', change: '0.00%', trend: 'steady' as const },
  { code: 'KWD', country: 'الكويت', rate: '0.307', change: '-0.03%', trend: 'down' as const },
]
