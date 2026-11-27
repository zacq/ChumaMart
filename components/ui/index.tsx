// components/ui/index.tsx — Shared primitive components

import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, type HTMLAttributes, forwardRef } from 'react'

// ── Button ────────────────────────────────────────────────────────────────────
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'whatsapp' | 'gold' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary:   'btn-primary',
      secondary: 'btn-secondary',
      whatsapp:  'btn-whatsapp',
      gold:      'btn-gold',
      ghost:     'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-h-[44px]',
    }
    const sizes = {
      sm: 'px-3 py-2 text-xs min-h-[36px]',
      md: '',
      lg: 'px-6 py-4 text-base min-h-[56px]',
    }
    return (
      <button
        ref={ref}
        className={cn(variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// ── Badge ─────────────────────────────────────────────────────────────────────
interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'amber' | 'red' | 'blue' | 'gray'
}

export function Badge({ className, variant = 'gray', ...props }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red:   'bg-red-100 text-red-700',
    blue:  'bg-blue-100 text-blue-700',
    gray:  'bg-gray-100 text-gray-700',
  }
  return <span className={cn('badge', variants[variant], className)} {...props} />
}

// ── Input ─────────────────────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm',
        'placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
        'disabled:cursor-not-allowed disabled:opacity-50 min-h-[48px]',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'

// ── Select ────────────────────────────────────────────────────────────────────
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm bg-white',
        'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 min-h-[48px]',
        className
      )}
      {...props}
    />
  )
)
Select.displayName = 'Select'

// ── Textarea ──────────────────────────────────────────────────────────────────
export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm resize-none',
        'placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200',
        className
      )}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('animate-spin h-5 w-5', className)} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-gray-200', className)} />
}
