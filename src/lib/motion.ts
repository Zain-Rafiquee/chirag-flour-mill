import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** The one ease. Durations live between 0.6s and 1.2s. */
export const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
/** GSAP's named equivalent of the cubic-bezier above. */
export const GSAP_EASE = 'power3.out'

export { gsap, ScrollTrigger }

/** True when the visitor has asked for reduced motion. Live-updating. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

/** True below the `md` breakpoint, where pinned sections stack instead. */
export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window === 'undefined' ? false : window.innerWidth < breakpoint,
  )

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const update = () => setMobile(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [breakpoint])

  return mobile
}

/** Split a string into words, keeping the trailing space with each word. */
export function splitWords(text: string): string[] {
  return text.split(/(\s+)/).filter((part) => part.trim().length > 0)
}
