import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EASE, useReducedMotion } from '../../lib/motion'

interface FadeUpProps {
  children: ReactNode
  /** ms */
  delay?: number
  className?: string
}

/** Small y-offset fade, once on enter. The quietest motion in the system. */
export default function FadeUp({
  children,
  delay = 0,
  className = '',
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [shown, setShown] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return setShown(true)
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: shown ? 'translateY(0)' : 'translateY(24px)',
        opacity: shown ? 1 : 0,
        transition: reduced
          ? undefined
          : `transform 900ms ${EASE} ${delay}ms, opacity 900ms ${EASE} ${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}
