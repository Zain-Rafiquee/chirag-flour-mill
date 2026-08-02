import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, useReducedMotion } from './motion'

/** Shared instance so components can read scroll velocity. */
let lenisInstance: Lenis | null = null
export const getLenis = () => lenisInstance

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
