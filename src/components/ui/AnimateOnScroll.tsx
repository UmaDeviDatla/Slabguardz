import { motion, useInView, type Variants } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type AnimateOnScrollProps = {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  duration = 0.6,
  y = 30,
  once = true,
}: AnimateOnScrollProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] as const }}
    >
      {children}
    </motion.div>
  )
}

type StaggerContainerProps = {
  children: ReactNode
  className?: string
  stagger?: number
  once?: boolean
}

export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
  once = true,
}: StaggerContainerProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  )
}

export const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
}
