export type SupervisorRole =
  | 'Super Admin'
  | 'المحاسب'
  | 'مدير العمليات'
  | 'موظف إدخال الحوالات'
  | 'المدقق / المراجع'

export type Supervisor = {
  id: string
  name: string
  email: string
  initial: string
  avatar: string
  role: SupervisorRole
  phone: string
  lastSeen: string
  twoFactor: boolean
  status: 'نشط' | 'موقوف'
  online: boolean
}

export const supervisorRoles: SupervisorRole[] = [
  'Super Admin',
  'المحاسب',
  'مدير العمليات',
  'موظف إدخال الحوالات',
  'المدقق / المراجع',
]

export const roleBadgeClass: Record<SupervisorRole, string> = {
  'Super Admin': 'bg-[#e7eefc] text-[#3d62c4]',
  'المحاسب': 'bg-[#e7f6ea] text-[#2f9d45]',
  'مدير العمليات': 'bg-[#e7f3fb] text-[#3b82d6]',
  'موظف إدخال الحوالات': 'bg-[#fdf3e3] text-[#d08a2c]',
  'المدقق / المراجع': 'bg-[#f2f3f5] text-[#6e7780]',
}

export const supervisors: Supervisor[] = [
  { id: 'sv-1', name: 'أحمد علي', email: 'ahmed.ali@nasam.com', initial: 'أ', avatar: '#1aa36a', role: 'Super Admin', phone: '+966 55 412 8890', lastSeen: 'الآن', twoFactor: true, status: 'نشط', online: true },
  { id: 'sv-2', name: 'خالد الحربي', email: 'khalid.h@nasam.com', initial: 'خ', avatar: '#7c5cbf', role: 'Super Admin', phone: '+966 50 221 7745', lastSeen: 'منذ ساعة', twoFactor: true, status: 'نشط', online: false },
  { id: 'sv-3', name: 'سارة محمود', email: 'sara.m@nasam.com', initial: 'س', avatar: '#d946a8', role: 'المحاسب', phone: '+966 54 908 1123', lastSeen: 'اليوم 10:02 ص', twoFactor: true, status: 'نشط', online: false },
  { id: 'sv-4', name: 'عمر فاروق', email: 'omar.f@nasam.com', initial: 'ع', avatar: '#f0a020', role: 'مدير العمليات', phone: '+20 100 455 2290', lastSeen: 'اليوم 08:47 ص', twoFactor: false, status: 'نشط', online: false },
  { id: 'sv-5', name: 'ريم العتيبي', email: 'reem.o@nasam.com', initial: 'ر', avatar: '#e23b6a', role: 'موظف إدخال الحوالات', phone: '+966 56 330 4412', lastSeen: 'أمس 6:15 م', twoFactor: true, status: 'نشط', online: false },
  { id: 'sv-6', name: 'يوسف منصور', email: 'yousef.m@nasam.com', initial: 'ي', avatar: '#3b82f6', role: 'موظف إدخال الحوالات', phone: '+966 53 778 0091', lastSeen: 'أمس 2:30 م', twoFactor: false, status: 'نشط', online: false },
  { id: 'sv-7', name: 'منى السيد', email: 'mona.s@nasam.com', initial: 'م', avatar: '#14b8a6', role: 'المدقق / المراجع', phone: '+20 112 640 7781', lastSeen: '5 أكتوبر 2026', twoFactor: true, status: 'نشط', online: false },
  { id: 'sv-8', name: 'فهد الدوسري', email: 'fahad.d@nasam.com', initial: 'ف', avatar: '#94a3b8', role: 'مدير العمليات', phone: '+966 55 019 6654', lastSeen: '12 سبتمبر 2026', twoFactor: false, status: 'موقوف', online: false },
  { id: 'sv-9', name: 'نورة القحطاني', email: 'nora.q@nasam.com', initial: 'ن', avatar: '#0f766e', role: 'موظف إدخال الحوالات', phone: '+966 55 100 2201', lastSeen: 'قبل دقيقة', twoFactor: true, status: 'نشط', online: true },
  { id: 'sv-10', name: 'سلطان العتيبي', email: 'sultan.o@nasam.com', initial: 'س', avatar: '#6366f1', role: 'المحاسب', phone: '+966 50 330 1188', lastSeen: 'الآن', twoFactor: true, status: 'نشط', online: true },
  { id: 'sv-11', name: 'ليلى حسن', email: 'layla.h@nasam.com', initial: 'ل', avatar: '#db2777', role: 'المدقق / المراجع', phone: '+966 54 220 9090', lastSeen: 'الآن', twoFactor: false, status: 'نشط', online: true },
  { id: 'sv-12', name: 'ماجد الشمري', email: 'majed.s@nasam.com', initial: 'م', avatar: '#0284c7', role: 'مدير العمليات', phone: '+966 53 410 7766', lastSeen: 'منذ 3 ساعات', twoFactor: true, status: 'نشط', online: false },
  { id: 'sv-13', name: 'هند العلي', email: 'hind.a@nasam.com', initial: 'ه', avatar: '#a8a29e', role: 'موظف إدخال الحوالات', phone: '+966 56 880 3344', lastSeen: '1 أكتوبر 2026', twoFactor: false, status: 'موقوف', online: false },
]

export const SUPERVISOR_PAGE_SIZE = 8
