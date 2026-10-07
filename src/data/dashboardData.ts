import {
  ArrowLeftRight,
  BadgeDollarSign,
  ClipboardList,
  CreditCard,
  FileBarChart,
  Globe,
  Landmark,
  LayoutDashboard,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const navigation = [
  { label: 'لوحة التحكم', icon: LayoutDashboard },
  { label: 'الحوالات', icon: ArrowLeftRight },
  { label: 'التجار', icon: Users },
  { label: 'الدول', icon: Globe },
  { label: 'وسائل الصرف', icon: Landmark },
  { label: 'أسعار الصرف', icon: BadgeDollarSign },
  { label: 'التقارير', icon: FileBarChart },
] satisfies { label: string; icon: LucideIcon }[]

export type TransferRow = {
  id: string
  date: string
  sender: string
  recipient: string
  country: string
  method: string
  sent: string
  received: string
  status: 'مكتملة' | 'معلقة' | 'قيد المراجعة'
}

export const recentTransfers: TransferRow[] = [
  { id: 'TRX-1848', date: '06/10', sender: 'محمد علي', recipient: 'محمد سامي', country: 'مصر', method: 'Vodafone Cash', sent: '12,000 EGP', received: '17,760 LYD', status: 'مكتملة' },
  { id: 'TRX-1847', date: '06/10', sender: 'سارة أحمد', recipient: 'مؤسسة النور', country: 'السعودية', method: 'STC Pay', sent: '1,500 SAR', received: '1,443 LYD', status: 'مكتملة' },
  { id: 'TRX-1846', date: '05/10', sender: 'أحمد العتيبي', recipient: 'دار الخير', country: 'الإمارات', method: 'Bank Transfer', sent: '3,200 AED', received: '3,712 LYD', status: 'قيد المراجعة' },
  { id: 'TRX-1845', date: '05/10', sender: 'ليث حمد', recipient: 'Yildiz Ticaret', country: 'تركيا', method: 'Papara', sent: '15,000 TRY', received: '17,430 LYD', status: 'مكتملة' },
  { id: 'TRX-1844', date: '04/10', sender: 'حسن محسن', recipient: 'نور التجارية', country: 'مصر', method: 'Cash', sent: '20,000 EGP', received: '17,820 LYD', status: 'معلقة' },
  { id: 'TRX-1843', date: '04/10', sender: 'خالد العوفي', recipient: 'مؤسسة الريان', country: 'السعودية', method: 'InstaPay', sent: '5,000 SAR', received: '4,800 LYD', status: 'مكتملة' },
  { id: 'TRX-1842', date: '03/10', sender: 'سالم الهاشمي', recipient: 'دار الخير', country: 'الإمارات', method: 'Bank Transfer', sent: '2,000 AED', received: '2,320 LYD', status: 'قيد المراجعة' },
]

export const metrics = [
  { label: 'عدد عمليات الشهر', value: '38', change: '+12.8%', note: 'عن الشهر الماضي', icon: ClipboardList, color: 'green' },
  { label: 'إجمالي قيمة عمليات الشهر', value: '$ 12,840', change: '+8.2%', note: 'مقارنة بالأمس', icon: Wallet, color: 'blue' },
  { label: 'عدد عمليات اليوم', value: '642', change: '+6.4%', note: 'عن أمس', icon: ClipboardList, color: 'green' },
  { label: 'إجمالي مصروف عمليات الشهر', value: '$ 214,560', change: '+14.6%', note: 'مقارنة بالشهر الماضي', icon: Wallet, color: 'green' },
  { label: 'إجمالي مصروف عمليات اليوم', value: '$ 4,291', change: '-2.4%', note: 'مقارنة بالأمس', icon: CreditCard, color: 'orange' },
  { label: 'إجمالي قيمة عمليات اليوم', value: '$ 210,269', change: '+9.1%', note: 'مقارنة بالأمس', icon: Wallet, color: 'green' },
]

export const countryBreakdown = [
  { label: 'ليبيا', percent: 62, color: 'green' },
  { label: 'الإمارات', percent: 23, color: 'blue' },
  { label: 'مصر', percent: 11, color: 'cyan' },
  { label: 'لبنان', percent: 4, color: 'orange' },
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
