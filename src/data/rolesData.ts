export type PermissionCell = 'on' | 'off' | 'na'

export const permissionActions = [
  { key: 'view', label: 'عرض' },
  { key: 'create', label: 'إضافة' },
  { key: 'edit', label: 'تعديل' },
  { key: 'remove', label: 'حذف' },
  { key: 'approve', label: 'اعتماد' },
  { key: 'export', label: 'تصدير' },
] as const

export const permissionSections = [
  'لوحة التحكم',
  'الحوالات',
  'التجار',
  'الدول',
  'أسعار الصرف',
  'التسويات',
  'المشرفين',
  'الأدوار والصلاحيات',
  'الإعدادات',
] as const

export type PermissionSection = (typeof permissionSections)[number]

/** Six cells, in the same order as permissionActions. */
export type PermissionRow = [
  PermissionCell,
  PermissionCell,
  PermissionCell,
  PermissionCell,
  PermissionCell,
  PermissionCell,
]

const allOn = (): PermissionRow => ['on', 'on', 'on', 'on', 'on', 'on']
const allOff = (): PermissionRow => ['off', 'off', 'off', 'off', 'off', 'off']
const allNa = (): PermissionRow => ['na', 'na', 'na', 'na', 'na', 'na']

export type AppRole = {
  id: string
  name: string
  description: string
  initial: string
  color: string
  supervisors: number
  system?: boolean
  updatedAt: string
  updatedBy: string
  matrix: PermissionRow[]
}

const accountantMatrix: PermissionRow[] = [
  ['on', 'na', 'na', 'na', 'na', 'on'],
  ['on', 'on', 'off', 'na', 'na', 'on'],
  ['on', 'off', 'off', 'off', 'off', 'on'],
  allNa(),
  ['on', 'off', 'off', 'na', 'na', 'on'],
  allOn(),
  allOff(),
  allOff(),
  allOff(),
]

export const initialRoles: AppRole[] = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'وصول كامل لجميع الأقسام والإعدادات',
    initial: 'س',
    color: '#8ea4cc',
    supervisors: 2,
    system: true,
    updatedAt: '12 مارس 2024',
    updatedBy: 'النظام',
    matrix: permissionSections.map(() => allOn()),
  },
  {
    id: 'operations',
    name: 'مدير العمليات',
    description: 'إدارة الحوالات والتجار واعتمادها',
    initial: 'م',
    color: '#3b82f6',
    supervisors: 3,
    updatedAt: '2 أكتوبر 2026',
    updatedBy: 'أحمد علي',
    matrix: [
      ['on', 'na', 'na', 'na', 'na', 'on'],
      allOn(),
      ['on', 'on', 'on', 'off', 'on', 'on'],
      ['on', 'on', 'on', 'off', 'off', 'off'],
      ['on', 'off', 'on', 'off', 'off', 'on'],
      ['on', 'off', 'off', 'off', 'on', 'on'],
      ['on', 'off', 'off', 'off', 'off', 'off'],
      ['off', 'off', 'off', 'off', 'off', 'off'],
      ['on', 'off', 'off', 'na', 'na', 'off'],
    ],
  },
  {
    id: 'accountant',
    name: 'المحاسب',
    description: 'التسويات وأسعار الصرف ومراجعة الحوالات',
    initial: 'م',
    color: '#2fbf5a',
    supervisors: 2,
    updatedAt: '28 سبتمبر 2026',
    updatedBy: 'أحمد علي',
    matrix: accountantMatrix,
  },
  {
    id: 'clerk',
    name: 'موظف إدخال الحوالات',
    description: 'تسجيل الحوالات ورفع ملفات Excel',
    initial: 'م',
    color: '#f0b429',
    supervisors: 5,
    updatedAt: '18 سبتمبر 2026',
    updatedBy: 'أحمد علي',
    matrix: [
      ['on', 'na', 'na', 'na', 'na', 'off'],
      ['on', 'on', 'on', 'off', 'off', 'off'],
      ['on', 'off', 'off', 'off', 'off', 'off'],
      allNa(),
      ['on', 'off', 'off', 'na', 'na', 'off'],
      ['off', 'off', 'off', 'off', 'off', 'off'],
      allOff(),
      allOff(),
      allNa(),
    ],
  },
  {
    id: 'auditor',
    name: 'المراجع / المدقق',
    description: 'عرض وتصدير فقط بدون تعديل',
    initial: 'م',
    color: '#b0b7c0',
    supervisors: 1,
    updatedAt: '4 سبتمبر 2026',
    updatedBy: 'أحمد علي',
    matrix: [
      ['on', 'na', 'na', 'na', 'na', 'on'],
      ['on', 'off', 'off', 'off', 'off', 'on'],
      ['on', 'off', 'off', 'off', 'off', 'on'],
      ['on', 'na', 'na', 'na', 'na', 'off'],
      ['on', 'off', 'off', 'na', 'na', 'on'],
      ['on', 'off', 'off', 'off', 'off', 'on'],
      ['on', 'off', 'off', 'off', 'off', 'off'],
      ['on', 'off', 'off', 'off', 'off', 'off'],
      ['off', 'off', 'off', 'na', 'na', 'off'],
    ],
  },
]
