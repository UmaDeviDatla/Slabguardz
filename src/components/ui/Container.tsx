import type { HTMLAttributes, ReactNode } from 'react'

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  size?: 'page' | 'reading'
}

export function Container({ children, className, size = 'page', ...props }: ContainerProps) {
  return <div className={`container container-${size}${className ? ` ${className}` : ''}`} {...props}>{children}</div>
}
