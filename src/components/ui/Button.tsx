import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'outline' | 'primary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  children: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  outline: cn(
    'border-[#e4e9ed] bg-white text-[#56616c]',
    'hover:border-[#b8d9ed] hover:bg-[#fafdff]',
  ),
  primary: cn(
    'border-[#43a83d] bg-[#43a83d] text-white',
    'hover:border-[#348f2f] hover:bg-[#348f2f]',
  ),
}

/** Shared heading / toolbar button — matches legacy .outline-button / .primary-button */
export function Button({ variant = 'outline', className, children, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        /* 6px matches DashboardPrimitives override of legacy 5px heading buttons */
        'inline-flex h-[33px] items-center justify-center gap-[7px] whitespace-nowrap rounded-[6px] border px-2.5',
        'cursor-pointer text-[10px] transition-[border-color,background] duration-[140ms] ease-in-out',
        'max-[720px]:h-[31px] max-[720px]:px-2 max-[720px]:text-[9px]',
        variantClass[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
