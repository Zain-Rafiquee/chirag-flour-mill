import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, GSAP_EASE, useReducedMotion } from '../../lib/motion'

interface FigureProps {
  /** Real image source. When omitted, the CSS placeholder stands in. */
  src?: string
  alt: string
  /** e.g. "3/4", "16/9" — reserves layout space so there is no shift. */
  ratio?: string
  className?: string
  /** Inner-image parallax travel in percent. 0 disables it. */
  parallax?: number
  /** Seed varies the placeholder so repeated figures aren't identical. */
  seed?: number
  children?: ReactNode
}

/**
 * Every image enters via a bottom-to-top clip-path unmask, never a plain
 * fade, with optional parallax on the inner image. Falls back to a CSS
 * placeholder until real photography is dropped in.
 */
export default function Figure({
  src,
  alt,
  ratio = '3/4',
  className = '',
  parallax = 0,
  seed = 0,
  children,
}: FigureProps) {
  const maskRef = useRef<HTMLDivElement | null>(null)
  const innerRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const mask = maskRef.current
    const inner = innerRef.current
    if (!mask || !inner) return

    if (reduced) {
      gsap.set(mask, { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }

    const reveal = gsap.fromTo(
      mask,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: GSAP_EASE,
        scrollTrigger: { trigger: mask, start: 'top 85%', once: true },
      },
    )

    // Inner image drifts slower than the frame for depth.
    const drift =
      parallax === 0
        ? null
        : gsap.fromTo(
            inner,
            { yPercent: -parallax },
            {
              yPercent: parallax,
              ease: 'none',
              scrollTrigger: {
                trigger: mask,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )

    return () => {
      reveal.scrollTrigger?.kill()
      reveal.kill()
      drift?.scrollTrigger?.kill()
      drift?.kill()
    }
  }, [parallax, reduced])

  return (
    <div
      ref={maskRef}
      className={`relative overflow-hidden bg-surface ${className}`}
      style={{ aspectRatio: ratio, clipPath: 'inset(0% 0% 100% 0%)' }}
    >
      {/* Oversized so parallax travel never exposes an edge. */}
      <div ref={innerRef} className="absolute inset-0 -top-[8%] h-[116%]">
        {src ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          <PlaceholderArt seed={seed} label={alt} />
        )}
      </div>
      {children}
    </div>
  )
}

/**
 * Stand-in artwork: layered mono washes plus grain, in the site palette.
 * Swap for a real `src` and nothing about the layout or motion changes.
 */
function PlaceholderArt({ seed, label }: { seed: number; label: string }) {
  const angle = 120 + ((seed * 37) % 90)
  const stop = 32 + ((seed * 17) % 26)

  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-full w-full"
      style={{
        background: `linear-gradient(${angle}deg, #F4F3F3 0%, #E2E0DE ${stop}%, #C9C6C2 72%, #A8A4A0 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, #191919 0 1px, transparent 1px 3px)',
        }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink/30">
          {label}
        </span>
      </div>
    </div>
  )
}
