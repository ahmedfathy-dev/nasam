/** Layout breakpoints used across the app (px). Keep in sync with CSS media queries. */
export const BREAKPOINTS = {
  mobile: 639,
  tablet: 700,
  sidebar: 920,
  desktop: 1023,
  wide: 1024,
  pageWide: 1180,
} as const

export const MEDIA = {
  mobile: `(max-width: ${BREAKPOINTS.mobile}px)`,
  tabletDown: `(max-width: ${BREAKPOINTS.desktop}px)`,
  sidebarCollapse: `(max-width: ${BREAKPOINTS.sidebar}px)`,
} as const
