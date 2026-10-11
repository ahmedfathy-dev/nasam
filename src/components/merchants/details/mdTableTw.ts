import { cn } from '@/lib/cn'
import {
  merchantCard,
  merchantCardField,
  merchantCardGrid,
  merchantCardHead,
  merchantDesktopTable,
  merchantMobileCards,
  stickyFirstCol,
  stickyFirstColHead,
} from '../merchantTw'

export const mdPanel = cn(
  'md-panel min-w-0 max-w-full overflow-hidden rounded-[7px] border border-line bg-surface p-2.5 min-[640px]:p-2.5 min-[1024px]:p-3',
)

export const mdTh = cn(
  'h-9 border-b border-[#edf0f2] px-[9px] text-end text-[9px] font-medium text-[#929aa2]',
)

export const mdTd = cn(
  'h-[42px] border-b border-[#f0f2f4] px-[9px] text-end text-[10px] text-[#545d64]',
)

export const mdTable = cn(
  'md-table w-full min-w-[780px] border-collapse whitespace-nowrap table-auto',
  'min-[640px]:min-w-[860px] min-[1024px]:min-w-[920px] min-[1024px]:w-[max(100%,920px)]',
)

export const mdTableScroll = cn(
  'md-table-scroll w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain',
  merchantDesktopTable,
)

export const mdSkeleton = cn(
  'md-skeleton block h-2.5 w-[70%] rounded bg-[linear-gradient(90deg,#eef1f3_25%,#f7f8f9_50%,#eef1f3_75%)] bg-[length:200%_100%] animate-[md-shimmer_1.1s_linear_infinite]',
)

export const mdSettleDone = 'md-settle-badge is-done inline-flex items-center rounded-full bg-[#eaf6e8] px-2 py-[3px] text-[9px] text-[#3f9a37]'
export const mdSettleOpen = 'md-settle-badge is-open inline-flex items-center rounded-full bg-[#fff5e4] px-2 py-[3px] text-[9px] text-orange'

export const mdBtnNeutral = cn(
  'md-btn md-btn-neutral inline-flex min-h-10 items-center justify-center gap-[5px] whitespace-nowrap rounded-[6px]',
  'border border-[#e4e9ed] bg-surface px-2.5 text-[10px] text-[#56616c]',
  'min-[640px]:min-h-[30px]',
)

export const mdPaginationBtn = cn(
  'grid size-10 min-w-10 place-items-center rounded-[5px] border border-[#e7eaed] bg-surface px-[5px] text-[9px] text-[#68727a]',
  'min-[640px]:h-[26px] min-[640px]:min-w-[26px]',
)

export const mdTableFooter = cn(
  'md-table-footer mt-1.5 flex min-h-0 flex-col items-stretch gap-2 pt-1 text-center text-[10px] text-text-muted',
  'min-[640px]:min-h-[42px] min-[640px]:flex-row min-[640px]:items-center min-[640px]:justify-between min-[640px]:gap-2 min-[640px]:text-start',
)

export {
  merchantCard,
  merchantCardField,
  merchantCardGrid,
  merchantCardHead,
  merchantMobileCards,
  stickyFirstCol,
  stickyFirstColHead,
}
