import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/motion'

/**
 * Small dot that trails the pointer, scaling up and inverting over anything
 * interactive. Pointer-devices only — never rendered for touch or when
 * reduced motion is requested.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    if (!dot) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y
    let raf = 0

    const move = (event: PointerEvent) => {
      targetX = event.clientX
      targetY = event.clientY
    }

    const tick = () => {
      raf = requestAnimationFrame(tick)
      // Slight lag so the dot feels weighted rather than glued to the pointer.
      x += (targetX - x) * 0.22
      y += (targetY - y) * 0.22
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
    }

    const INTERACTIVE = 'a, button, input, textarea, select, summary, [data-cursor]'
    const over = (event: PointerEvent) => {
      const target = event.target as Element | null
      const active = !!target?.closest?.(INTERACTIVE)
      dot.dataset.active = active ? 'true' : 'false'
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    raf = requestAnimationFrame(tick)
    dot.style.opacity = '1'

    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-2 w-2 rounded-full bg-ink opacity-0 transition-[width,height,background-color] duration-300 ease-standard [@media(pointer:fine)]:block data-[active=true]:h-8 data-[active=true]:w-8 data-[active=true]:bg-ink/20 data-[active=true]:mix-blend-difference"
    />
  )
}
