/** Tiny class merger — no extra dependency. Falsy values are skipped. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}
