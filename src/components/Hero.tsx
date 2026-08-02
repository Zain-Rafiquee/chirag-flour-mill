import { useRef } from 'react'
import BoomerangVideoBg from './BoomerangVideoBg'

/**
 * The hero's scroll runway. The first viewport is the pinned hero itself; the
 * rest is how much scrolling the video scrub spans. Shorter on phones so the
 * hero doesn't hold the screen hostage on a small display.
 */
const RUNWAY = 'h-[170vh] md:h-[250vh]'

/**
 * 100svh is the *small* viewport height — the visible area with the mobile
 * browser bars showing. Plain 100vh resolves to the large viewport, so the
 * hero would hang below the fold until the URL bar collapsed.
 */
const VIEWPORT = 'h-screen supports-[height:100svh]:h-[100svh]'

export default function Hero() {
  const scrubRef = useRef<HTMLDivElement | null>(null)

  return (
    <div ref={scrubRef} data-hero className={`relative ${RUNWAY}`}>
      {/* Pinned for the length of the runway, then releases and scrolls away. */}
      <section
        className={`sticky top-0 flex ${VIEWPORT} flex-col items-center overflow-hidden`}
      >
        <BoomerangVideoBg scrubRef={scrubRef} />

        <div className="relative z-10 flex flex-col items-center text-center pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6">
          {/* Fluid rather than stepped, so it scales smoothly from a 320px
              phone to an ultrawide instead of jumping at each breakpoint. */}
          <h1 className="font-serif text-[clamp(2.25rem,7.5vw+0.5rem,7rem)] leading-[1.1] tracking-tighter text-[#191919] font-normal">
            Build lasting
            <br />
            relationships.
          </h1>
        </div>
      </section>
    </div>
  )
}
