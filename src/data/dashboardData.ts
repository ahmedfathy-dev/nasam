import {
  Activity,
  ArrowLeftRight,
  BriefcaseBusiness,
  ClipboardList,
  CreditCard,
  FileBarChart,
  LayoutDashboard,
  Settings,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react'

export const navigation = [
  { label: 'لوحة التحكم', icon: LayoutDashboard },
  { label: 'الحوالات', icon: ArrowLeftRight },
  { label: 'التجار', icon: Users },
  { label: 'العملاء', icon: BriefcaseBusiness },
  { label: 'الموظفون', icon: ClipboardList },
  { label: 'التقارير', icon: FileBarChart },
  { label: 'الإعدادات', icon: Settings },
] satisfies { label: string; icon: LucideIcon }[]

export const operations = [
  { id: 'TRX-1848', date: '٠٦ أكتوبر ٢٠٢٦', customer: 'شركة المدار للتجارة', type: 'تحويل بنكي', amount: '$ ٤٬٨٥٠', status: 'مكتملة' },
  { id: 'TRX-1847', date: '٠٦ أكتوبر ٢٠٢٦', customer: 'مؤسسة النور', type: 'دفع إلكتروني', amount: '$ ٢٬٤٥٠', status: 'مكتملة' },
  { id: 'TRX-1846', date: '٠٥ أكتوبر ٢٠٢٦', customer: 'أحمد العتيبي', type: 'إيداع نقدي', amount: '$ ١٬٣٢٠', status: 'قيد المراجعة' },
  { id: 'TRX-1845', date: '٠٥ أكتوبر ٢٠٢٦', customer: 'شركة آفاق', type: 'تحويل بنكي', amount: '$ ٣٬٢٠٠', status: 'مكتملة' },
  { id: 'TRX-1844', date: '٠٤ أكتوبر ٢٠٢٦', customer: 'سارة القحطاني', type: 'شراء خدمة', amount: '$ ٨٦٠', status: 'معلقة' },
  { id: 'TRX-1843', date: '٠٤ أكتوبر ٢٠٢٦', customer: 'مجموعة الريادة', type: 'تحويل بنكي', amount: '$ ٥٬٧٠٠', status: 'مكتملة' },
]

export const exchangeRates = [
  { code: 'EGP', name: 'الجنيه المصري', rate: '48.00', change: '+0.31%', trend: 'up' },
  { code: 'SAR', name: 'الريال السعودي', rate: '3.75', change: '+0.24%', trend: 'up' },
  { code: 'AED', name: 'الدرهم الإماراتي', rate: '3.67', change: '+0.18%', trend: 'up' },
  { code: 'TRY', name: 'الليرة التركية', rate: '34.20', change: '-0.12%', trend: 'down' },
  { code: 'JOD', name: 'الدينار الأردني', rate: '0.709', change: 'ثابت', trend: 'steady' },
  { code: 'OMR', name: 'الريال العُماني', rate: '0.385', change: 'ثابت', trend: 'steady' },
  { code: 'KWD', name: 'الدينار الكويتي', rate: '0.307', change: 'ثابت', trend: 'steady' },
]

export const metrics = [
  { label: 'عدد العمليات', value: '38', change: '+12.8%', note: 'عن الشهر الماضي', icon: Activity, color: 'green' },
  { label: 'الإيرادات اليوم', value: '$ 12,840', change: '+8.2%', note: 'مقارنة بالأمس', icon: Wallet, color: 'blue' },
  { label: 'إجمالي العملاء', value: '642', change: '+6.4%', note: 'عن الشهر الماضي', icon: Users, color: 'green' },
  { label: 'صافي الإيرادات', value: '$ 214,560', change: '+14.6%', note: 'مقارنة بالشهر الماضي', icon: Activity, color: 'green' },
  { label: 'المصروفات', value: '$ 4,291', change: '-2.4%', note: 'مقارنة بالشهر الماضي', icon: CreditCard, color: 'orange' },
  { label: 'الرصيد الحالي', value: '$ 210,269', change: '+9.1%', note: 'مقارنة بالشهر الماضي', icon: Wallet, color: 'green' },
]

export const categories = [
  { label: 'التحويلات البنكية', percent: 23, color: 'green' },
  { label: 'المدفوعات الإلكترونية', percent: 14, color: 'blue' },
  { label: 'الإيداع النقدي', percent: 9, color: 'cyan' },
  { label: 'المشتريات', percent: 7, color: 'orange' },
  { label: 'الرواتب', percent: 6, color: 'green' },
  { label: 'عمليات أخرى', percent: 4, color: 'blue' },
]