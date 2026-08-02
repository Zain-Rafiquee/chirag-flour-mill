import { useCallback, useEffect, useRef, useState } from 'react'
import { EASE, useReducedMotion } from '../../lib/motion'
import FadeUp from '../ui/FadeUp'

const QUOTES = [
  {
    quote:
      'We switched our whole roti line over and the dough stopped fighting us. Same hydration, better lift, and it holds overnight.',
    name: 'Rukhsana P.',
    role: 'Head baker, Noor Bakehouse',
  },
  {
    quote:
      'Twelve years of supply and I have never had to send a lot back. When something looks off, they call me before I call them.',
    name: 'Devendra S.',
    role: 'Distributor, Central belt',
  },
  {
    quote:
      'The spec sheet actually matches what arrives. In this trade that is rarer than it should be.',
    name: 'Anita M.',
    role: 'Procurement, Saanjh Foods',
  },
]

const AUTOPLAY_MS = 7000

/** Fades a string in character by character. Never slides. */
function CharFade({ text, id }: { text: string; id: number }) {
  const reduced = useReducedMotion()

  return (
    <span key={id} aria-label={text} className="inline">
      {text.split('').map((char, i) => (
        <span
          key={`${id}-${i}`}
          aria-hidden="true"
          className="inline"
          style={{
            opacity: reduced ? 1 : 0,
            animation: reduced
              ? undefined
              : `charIn 600ms ${EASE} forwards ${i * 9}ms`,
          }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  )
}

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()
  const dragState = useRef({ startX: 0, dragging: false })

  const go = useCallback((next: number) => {
    setIndex(((next % QUOTES.length) + QUOTES.length) % QUOTES.length)
  }, [])

  useEffect(() => {
    if (reduced) return
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % QUOTES.length),
      AUTOPLAY_MS,
    )
    return () => window.clearInterval(timer)
  }, [reduced, index])

  const onPointerDown = (event: React.PointerEvent) => {
    dragState.current = { startX: event.clientX, dragging: true }
  }

  const onPointerUp = (event: React.PointerEvent) => {
    if (!dragState.current.dragging) return
    const delta = event.clientX - dragState.current.startX
    dragState.current.dragging = false
    if (Math.abs(delta) > 60) go(index + (delta < 0 ? 1 : -1))
  }

  const active = QUOTES[index]

  return (
    <section
      id="testimonials"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:px-12 md:py-32"
    >
      <FadeUp>
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
          What buyers say
        </span>
      </FadeUp>

      <div
        className="mt-10 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragState.current.dragging = false)}
      >
        <blockquote className="min-h-[9em] sm:min-h-[7em] md:min-h-[6em]">
          <p className="max-w-4xl font-serif text-2xl font-normal leading-[1.25] tracking-tight text-ink sm:text-3xl md:text-4xl lg:text-5xl">
            <CharFade text={`“${active.quote}”`} id={index} />
          </p>
        </blockquote>

        <figcaption className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.15em] text-ink/50">
          <span className="text-ink/80">{active.name}</span>
          <span aria-hidden="true">—</span>
          <span>{active.role}</span>
        </figcaption>
      </div>

      {/* Controls */}
      <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-6">
        <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
          {QUOTES.map((quote, i) => (
            <button
              key={quote.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimonial ${i + 1}: ${quote.name}`}
              onClick={() => setIndex(i)}
              className={`h-1 w-10 transition-colors duration-600 ease-standard ${
                i === index ? 'bg-accent' : 'bg-ink/15 hover:bg-ink/35'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
