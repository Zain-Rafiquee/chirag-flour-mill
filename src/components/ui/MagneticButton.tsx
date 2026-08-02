import { useEffect, useRef, type ReactNode } from 'react'
import { useReducedMotion } from '../../lib/motion'

interface MagneticButtonProps {
  children: ReactNode
  href?: string
  variant?: 'solid' | 'outline'
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  /** Only meaningful alongside `href`. */
  target?: '_blank'
}

/** Pull strength in px at the edge of the hit area. */
const PULL = 14

/**
 * Button that leans toward the pointer. The transform lives on an inner span
 * so the hit area itself never moves — the target can't slip away from you.
 */
export default function MagneticButton({
  children,
  href,
  variant = 'solid',
  className = '',
  onClick,
  type = 'button',
  target,
}: MagneticButtonProps) {
  const hostRef = useRef<HTMLElement | null>(null)
  const innerRef = useRef<HTMLSpanElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const host = hostRef.current
    const inner = innerRef.current
    if (!host || !inner) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const move = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      inner.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`
    }

    const reset = () => {
      inner.style.transform = 'translate(0px, 0px)'
    }

    host.addEventListener('pointermove', move)
    host.addEventListener('pointerleave', reset)
    return () => {
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', reset)
    }
  }, [reduced])

  const base =
    'relative inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-medium transition-colors duration-600 ease-standard'
  const skin =
    variant === 'solid'
      ? 'bg-ink text-paper hover:bg-accent'
      : 'border border-ink/20 text-ink hover:border-ink/60'

  const content = (
    <span
      ref={innerRef}
      className="inline-block transition-transform duration-600 ease-standard will-change-transform"
    >
      {children}
    </span>
  )

  if (href) {
    return (
      <a
        ref={hostRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
        className={`${base} ${skin} ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      ref={hostRef as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={`${base} ${skin} ${className}`}
    >
      {content}
    </button>
  )
}
