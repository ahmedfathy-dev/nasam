import { cn } from '@/lib/cn'

export const transferPrimaryButtonClass = cn(
  /* `transfer-primary-button` retained for DashboardPrimitives.css */
  'transfer-primary-button inline-flex min-h-[31px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border border-[#151719] bg-[#151719] px-[11px] text-[10px] text-white transition-[background,border-color] duration-[130ms] ease-in-out rounded-[6px]',
  'hover:bg-[#303437]',
  'disabled:cursor-not-allowed disabled:border-[#bec3c7] disabled:bg-[#bec3c7]',
)

export const transferToolButtonClass = cn(
  /* `transfer-tool-button` retained for DashboardPrimitives.css */
  'transfer-tool-button inline-flex min-h-[31px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border border-[#e7e9eb] bg-[#f0f1f2] px-[11px] text-[10px] text-[#50585e] transition-[background,border-color] duration-[130ms] ease-in-out rounded-[6px]',
  'hover:border-[#d6dade] hover:bg-[#e7e9eb]',
  'max-[480px]:px-2 max-[480px]:text-[8px]',
)

export const transferCancelButtonClass = cn(
  /* `transfer-cancel-button` retained for DashboardPrimitives.css */
  'transfer-cancel-button inline-flex min-h-[31px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap border border-[#e7e9eb] bg-[#f0f1f2] px-[11px] text-[10px] text-[#50585e] transition-[background,border-color] duration-[130ms] ease-in-out rounded-[6px]',
  'hover:border-[#d6dade] hover:bg-[#e7e9eb]',
)

export const transferConfirmButtonClass = cn(
  'inline-flex min-h-10 cursor-pointer items-center gap-1.5 border border-green bg-green px-3.5 text-[12px] text-white rounded-sm',
  'disabled:cursor-not-allowed disabled:opacity-55',
)

export const transferModalBackdropClass =
  'fixed inset-0 z-[60] grid place-items-center bg-[rgb(31_36_39_/_42%)] p-5 max-[700px]:p-2.5'

export const transferModalPanelClass = cn(
  'max-h-[min(92dvh,820px)] w-[min(860px,100%)] overflow-auto border border-[#e5e8ea] bg-surface shadow-[0_18px_50px_rgb(17_23_26_/_18%)] rounded-lg',
)

export const transferFormSelectClass = cn(
  /* `form-select-field` retained for DashboardPrimitives.css */
  'form-select-field !h-[42px] !rounded-sm !border-[#e5e8ea] !bg-[#f7f8f9] !text-base !text-[#343d44]',
  'focus-within:!border-green focus-within:!bg-surface focus-within:!shadow-[0_0_0_3px_rgb(57_174_57_/_12%)]',
  'min-[561px]:!text-[13px]',
  '[&_.form-select-trigger]:h-full [&_.form-select-trigger]:px-3 [&_.form-select-trigger]:text-base',
  'min-[561px]:[&_.form-select-trigger]:text-[13px]',
)
