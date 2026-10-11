import { cn } from '@/lib/cn'

/** Shared Traders / Merchants Tailwind class strings — visuals match legacy CSS. */

export const pageShell = cn(
  'box-border w-full max-w-full min-w-0 overflow-x-clip',
)

export const tradersPrimaryButton = cn(
  'traders-primary-button inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap',
  'rounded-[6px] border border-[#151719] bg-[#151719] px-[11px] text-[10px] text-white',
  'transition-[background,border-color] duration-[130ms] ease-in-out hover:bg-[#303437]',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'min-[640px]:min-h-[31px]',
)

export const tradersToolButton = cn(
  'traders-tool-button inline-flex min-h-10 items-center justify-center gap-1.5 whitespace-nowrap',
  'rounded-[6px] border border-[#e7e9eb] bg-[#f0f1f2] px-[11px] text-[10px] text-[#50585e]',
  'transition-[background,border-color] duration-[130ms] ease-in-out',
  'hover:border-[#d6dade] hover:bg-[#e7e9eb]',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'min-[640px]:min-h-[31px]',
)

export const merchantDeleteButton = cn(
  'merchant-delete-button inline-flex min-h-10 items-center justify-center whitespace-nowrap',
  'rounded-[6px] border border-danger bg-danger px-[11px] text-[10px] text-white',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'min-[640px]:min-h-[31px]',
)

export const merchantModalBackdrop = cn(
  'merchant-modal-backdrop fixed inset-0 z-[60] grid place-items-stretch bg-[rgb(30_43_55_/_38%)] p-0',
  'min-[640px]:place-items-center min-[640px]:p-[18px]',
)

export const merchantModal = cn(
  'merchant-modal relative flex max-h-[100dvh] min-h-[100dvh] w-full max-w-full flex-col',
  'rounded-none border border-line bg-surface shadow-[0_16px_45px_rgb(30_45_58_/_18%)]',
  'min-[640px]:min-h-0 min-[640px]:w-[min(100%,92vw)] min-[640px]:max-h-none min-[640px]:rounded-[8px]',
  'min-[640px]:animate-[merchant-dialog-in_160ms_ease-out]',
  'min-[1024px]:w-[min(100%,420px)]',
)

export const merchantConfirmDialog = cn(
  'merchant-confirm-dialog relative flex max-h-[100dvh] min-h-[100dvh] w-full max-w-full flex-col',
  'border border-line bg-surface p-4 text-start shadow-[0_16px_45px_rgb(30_45_58_/_18%)]',
  'min-[640px]:min-h-0 min-[640px]:w-[min(100%,92vw)] min-[640px]:max-h-none min-[640px]:rounded-[8px]',
  'min-[640px]:p-[18px_16px_14px] min-[640px]:text-center',
  'min-[640px]:animate-[merchant-dialog-in_160ms_ease-out]',
  'min-[1024px]:w-[min(100%,420px)]',
)

export const merchantModalClose = cn(
  'merchant-modal-close grid size-10 place-items-center rounded border-0 bg-transparent text-[#899198]',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'min-[640px]:size-6 min-[640px]:rounded',
)

export const merchantModalHead = cn(
  'merchant-modal-head sticky top-0 z-[2] flex items-start justify-between gap-2.5',
  'border-b border-[#edf0f2] bg-surface p-4',
  'min-[640px]:static min-[640px]:p-[14px_14px_10px]',
)

export const merchantModalForm = cn(
  'merchant-modal-form flex flex-1 flex-col gap-2.5 overflow-y-auto p-4 pb-0',
  'min-[640px]:grid min-[640px]:overflow-visible min-[640px]:p-[12px_14px_14px]',
)

export const merchantModalField = cn(
  'merchant-modal-field grid gap-1 text-[9px] text-[#626b71]',
)

export const merchantModalFieldInput = cn(
  'h-11 w-full min-w-0 rounded-[6px] border border-[#e5e8ea] bg-[#f7f8f9] px-2',
  'text-base text-[#454e55] outline-0 disabled:cursor-not-allowed disabled:opacity-60',
  'min-[640px]:h-8 min-[640px]:text-[10px]',
)

export const merchantModalRow = cn(
  'merchant-modal-row grid grid-cols-1 gap-2.5',
  'min-[640px]:grid-cols-2',
)

export const merchantModalActions = cn(
  'merchant-modal-actions sticky bottom-0 z-[2] mt-auto flex flex-col-reverse items-stretch gap-2',
  'border-t border-[#edf0f2] bg-surface px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]',
  'min-[640px]:static min-[640px]:mt-0 min-[640px]:flex-row min-[640px]:items-center',
  'min-[640px]:justify-start min-[640px]:gap-[7px] min-[640px]:border-0 min-[640px]:p-0 min-[640px]:pt-1',
)

export const merchantConfirmActions = cn(
  'merchant-confirm-actions sticky bottom-0 z-[2] mt-auto flex flex-col-reverse items-stretch gap-2',
  'border-t border-[#edf0f2] bg-surface px-4 py-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))]',
  'min-[640px]:static min-[640px]:mt-0 min-[640px]:flex-row min-[640px]:items-center',
  'min-[640px]:justify-start min-[640px]:gap-[7px] min-[640px]:border-0 min-[640px]:bg-transparent min-[640px]:p-0 min-[640px]:pt-1',
)

export const merchantFieldError = 'merchant-field-error text-[8px] text-danger'

export const merchantToastStack = cn(
  'merchant-toast-stack fixed start-4 end-4 top-4 z-[70] grid gap-2',
  'min-[640px]:end-auto min-[640px]:w-auto',
)

export const merchantToastBase = cn(
  'merchant-toast min-w-0 max-w-full rounded-[6px] px-3 py-2.5 text-[10px]',
  'shadow-[0_10px_24px_rgb(17_27_34_/_14%)]',
  'min-[640px]:min-w-[220px] min-[640px]:max-w-[min(360px,90vw)]',
)

export const merchantToastSuccess = cn(
  merchantToastBase,
  'merchant-toast-success border border-green-border bg-[#f3faf1] text-green',
)

export const merchantToastError = cn(
  merchantToastBase,
  'merchant-toast-error border border-[#f1caca] bg-[#fff3f3] text-danger',
)

export const merchantMobileCards = cn(
  'merchant-mobile-cards grid gap-2 py-2',
  'min-[640px]:hidden',
)

export const merchantDesktopTable = cn(
  'merchant-desktop-table max-[639px]:!hidden',
)

export const merchantCard = cn(
  'merchant-card grid gap-2 rounded-sm border border-line bg-surface p-3',
)

export const merchantCardHead = cn(
  'merchant-card-head flex items-start justify-between gap-2',
)

export const merchantCardGrid = cn(
  'merchant-card-grid grid grid-cols-2 gap-2 gap-x-2.5',
)

export const merchantCardField = cn(
  'merchant-card-field grid min-w-0 gap-0.5',
)

export const merchantCardActions = cn(
  'merchant-card-actions flex gap-1.5 border-t border-[#edf0f2] pt-1',
)

export const merchantStatus = cn(
  'merchant-status inline-flex items-center gap-1 whitespace-nowrap rounded-xl px-[7px] py-[3px] text-[9px]',
)

export const merchantStatusActive = cn(merchantStatus, 'is-active bg-[#eaf6e8] text-[#3f9a37]')
export const merchantStatusPaused = cn(merchantStatus, 'is-paused bg-[#fdebec] text-danger')

export const stickyFirstCol = cn(
  'max-lg:sticky max-lg:start-0 max-lg:z-[1] max-lg:bg-white max-lg:shadow-[-1px_0_0_#edf0f2]',
)

export const stickyFirstColHead = cn(
  stickyFirstCol,
  'max-lg:bg-[#fafbfc]',
)

/* ——— Add merchant ——— */

export const amSection = cn(
  'am-section grid gap-3 border-b border-[#edf0f2] py-1 pb-[18px]',
)

export const amSectionLast = cn(amSection, 'am-section-last border-b-0')

export const amSectionHead = cn('am-section-head flex items-center gap-2')

export const amStep = cn(
  'am-step grid size-[22px] place-items-center rounded-full bg-green-soft text-[11px] font-bold text-green',
)

export const amField = cn(
  'am-field merchant-field grid min-w-0 grid-rows-[auto_auto_auto] content-start gap-1.5 text-[11px] text-[#4a535a]',
  'min-[561px]:grid-rows-[auto_40px_auto]',
)

export const amFieldInput = cn(
  'box-border h-10 w-full min-w-0 rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] px-3',
  'text-base text-[#454e55] outline-0',
  'focus:border-green focus:bg-white focus:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
  'min-[561px]:text-xs',
)

export const amSelect = cn(
  'am-select box-border h-10 w-full min-w-0 rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] text-[#454e55]',
  'focus-within:border-green focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
)

export const amGrid2 = cn(
  'am-grid-2 grid grid-cols-1 items-start gap-3 gap-x-4',
  'min-[561px]:grid-cols-2',
)

export const amHint = 'am-hint min-h-3.5 text-[10px] not-italic leading-[1.45] text-text-muted'
export const amError = 'am-error text-xs text-danger'

export const amControlShell = cn(
  'flex h-10 min-w-0 items-center gap-1 rounded-sm border border-[#e5e8ea] bg-[#f7f8f9] px-2.5',
  'focus-within:border-green focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
)

export const amControlInput = cn(
  'h-full min-w-0 flex-1 border-0 bg-transparent text-base text-inherit outline-0',
  'min-[561px]:text-xs',
  'w-0',
)
