import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/motion'

const ITEMS = [
  'Chakki Atta',
  'Sharbati Wheat',
  'Maida',
  'Suji',
  'Rava',
  'Wheat Bran',
  'Multigrain',
  'Durum Semolina',
]

/** px per second at rest. */
const BASE_SPEED = 60
/** How hard scroll velocity pushes the ticker. */
const VELOCITY_GAIN = 3.2
const MAX_SPEED = 900

function WheatGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 shrink-0 text-accent"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 21V9" />
      <path d="M12 9c0-2.2 1.4-4 3.2-4C15.2 7.2 13.8 9 12 9Z" />
      <path d="M12 9C12 6.8 10.6 5 8.8 5 8.8 7.2 10.2 9 12 9Z" />
      <path d="M12 14c0-2.2 1.4-4 3.2-4 0 2.2-1.4 4-3.2 4Z" />
      <path d="M12 14c0-2.2-1.4-4-3.2-4 0 2.2 1.4 4 3.2 4Z" />
    </svg>
  )
}

/**
 * Infinite ticker whose speed tracks scroll velocity and whose direction
 * flips when the page scrolls up. Two identical tracks leapfrog each other,
 * so there is no seam and no snap on wrap.
 */
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const track = trackRef.current
    if (!track) return

    let offset = 0
    let velocity = 0
    let lastScroll = window.scrollY
    let lastTime = performance.now()
    let raf = 0

    const onScroll = () => {
      const now = performance.now()
      const dt = Math.max(1, now - lastTime)
      // px per ms, signed: negative when scrolling up.
      velocity = (window.scrollY - lastScroll) / dt
      lastScroll = window.scrollY
      lastTime = now
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min(64, now - lastTime) / 1000

      // Velocity decays back to rest so the ticker settles after a flick.
      velocity *= 0.92
      const boost = velocity * 1000 * VELOCITY_GAIN
      const direction = boost < -BASE_SPEED ? -1 : 1
      const speed = Math.min(
        MAX_SPEED,
        Math.abs(BASE_SPEED + Math.abs(boost)) * direction,
      )

      offset -= speed * dt
      const half = track.scrollWidth / 2
      if (half > 0) {
        // Wrap within the first copy's width; the second copy covers the gap.
        if (offset <= -half) offset += half
        if (offset > 0) offset -= half
      }
      track.style.transform = `translate3d(${offset}px, 0, 0)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === 'b'}>
      {ITEMS.map((item, i) => (
        <div key={`${item}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-serif text-2xl text-ink sm:px-8 sm:text-3xl md:text-4xl">
            {item}
          </span>
          <WheatGlyph />
        </div>
      ))}
    </div>
  )

  return (
    <section
      aria-label="Products milled"
      className="relative overflow-hidden border-y border-ink/10 bg-paper py-6 sm:py-8"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        {row('a')}
        {row('b')}
      </div>
    </section>
  )
}
