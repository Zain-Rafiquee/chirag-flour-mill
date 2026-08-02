import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useReducedMotion } from './motion'

/** Shared instance so components can read scroll velocity. */
let lenisInstance: Lenis | null = null
export const getLenis = () => lenisInstance

/**
 * Scroll to an in-page target by hash. Lenis owns the scroll position, so a
 * native anchor jump would land in the wrong place; the browser only takes
 * over when Lenis isn't running (reduced motion).
 *
 * Returns false when nothing matches, so callers can leave the link alone.
 */
export function scrollToHash(href: string): boolean {
  const target = document.querySelector(href)
  if (!target) return false

  const lenis = getLenis()
  if (lenis) lenis.scrollTo(target as HTMLElement)
  else target.scrollIntoView({ behavior: 'smooth' })
  return true
}

/**
 * Smooth scroll, weighted on the heavier side, driven off GSAP's ticker so
 * ScrollTrigger and Lenis never fight over the frame.
 */
export function useLenis() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const lenis = new Lenis({
      duration: 1.4,
      // Matches the standard ease: fast out, long settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.9,
      touchMultiplier: 1.6,
    })
    lenisInstance = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisInstance = null
    }
  }, [reduced])
}
