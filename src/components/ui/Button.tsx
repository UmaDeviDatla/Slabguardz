import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type ButtonVariant = 'primary' | 'secondary' | 'quiet'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
  to?: never
}

type ButtonLinkProps = LinkProps & {
  children: ReactNode
  variant?: ButtonVariant
  to: string
}

const buttonClassName = (variant: ButtonVariant) => `button button-${variant}`

export function Button({ children, variant = 'primary', className, ...props }: ButtonProps) {
  return <button className={`${buttonClassName(variant)}${className ? ` ${className}` : ''}`} {...props}>{children}</button>
}

export function ButtonLink({ children, variant = 'primary', className, ...props }: ButtonLinkProps) {
  return <Link className={`${buttonClassName(variant)}${className ? ` ${className}` : ''}`} {...props}>{children}</Link>
}
