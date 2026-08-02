import { Fragment, useEffect, useMemo, useRef, type ElementType } from 'react'
import { gsap, GSAP_EASE, splitWords, useReducedMotion } from '../../lib/motion'

interface SplitTextProps {
  text: string
  as?: ElementType
  className?: string
  /** Seconds between each word. */
  stagger?: number
  delay?: number
}

/**
 * Word-level stagger reveal, fired once when the element enters. Words are
 * real text inside spans and the wrapper carries an aria-label, so the
 * heading still reads correctly to assistive tech.
 */
export default function SplitText({
  text,
  as = 'span',
  className = '',
  stagger = 0.045,
  delay = 0,
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()
  const words = useMemo(() => splitWords(text), [text])

  // Cast keeps the ref typed while `as` still controls the rendered tag.
  const Tag = as as 'div'

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll<HTMLElement>('[data-word]')
    if (!targets.length) return

    if (reduced) {
      gsap.set(targets, { yPercent: 0, opacity: 1 })
      return
    }

    const animation = gsap.fromTo(
      targets,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: GSAP_EASE,
        stagger,
        delay,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      },
    )

    return () => {
      animation.scrollTrigger?.kill()
      animation.kill()
    }
  }, [text, stagger, delay, reduced])

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          {/* pb/-mb pair keeps descenders from being clipped by overflow */}
          <span
            className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
            aria-hidden="true"
          >
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
