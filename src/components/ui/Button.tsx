import type { ButtonHTMLAttributes } from 'react'

type Variant = 'default' | 'primary' | 'danger'
type Size    = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export function Button({
  variant = 'default',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  const base = 'btn'
  const v = variant === 'primary' ? 'primary' : variant === 'danger' ? 'danger' : ''
  const s = size === 'sm' ? 'sm' : ''
  const cls = [base, v, s, className].filter(Boolean).join(' ')
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  )
}
