import { useEffect, useRef } from 'react'
import { gsap, GSAP_EASE, useReducedMotion } from '../../lib/motion'

const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      ['Heritage', '#heritage'],
      ['Process', '#process'],
      ['Products', '#products'],
      ['Quality', '#quality'],
    ],
  },
  {
    heading: 'Trade',
    links: [
      ['Bulk supply', '#bulk'],
      ['Become a distributor', '#bulk'],
      ['FAQ', '#faq'],
      ['Contact', '#contact'],
    ],
  },
  {
    heading: 'Social',
    links: [
      ['Instagram', 'https://instagram.com'],
      ['LinkedIn', 'https://linkedin.com'],
      ['WhatsApp', 'https://wa.me/923000000000'],
    ],
  },
]

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)
  const reduced = useReducedMotion()

  // Size the wordmark to the container rather than the viewport. A vw-based
  // clamp overflows once max-w-7xl stops growing, and under-fills on phones.
  useEffect(() => {
    const box = wordmarkRef.current
    const text = textRef.current
    if (!box || !text) return

    let lastWidth = 0

    const fit = () => {
      const available = box.clientWidth
      // Height changes as we resize the text; only react to width.
      if (!available || available === lastWidth) return
      lastWidth = available

      // Text width scales linearly with font-size, so one measurement at a
      // known size gives the exact size that fills the box. max-content is
      // what makes the span report its own width instead of the box's.
      text.style.fontSize = '100px'
      text.style.width = 'max-content'
      const natural = text.scrollWidth
      text.style.width = ''
      if (natural) text.style.fontSize = `${(available / natural) * 100}px`
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    // The serif is a webfont — remeasure once it has actually loaded.
    void document.fonts?.ready.then(() => {
      lastWidth = 0
      fit()
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return

    if (reduced) {
      gsap.set(el, { clipPath: 'inset(0% 0% 0% 0%)' })
      return
    }

    const tween = gsap.fromTo(
      el,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.2,
        ease: GSAP_EASE,
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])

  return (
    <footer className="bg-ink pt-24 text-paper md:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="grid gap-12 pb-20 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Chirag Flour Mill has stone-milled wheat on the Multan road since
              2016, on Turkish-built plant. Family owned, one floor, still slow.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-paper/40">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-paper/75 transition-colors duration-300 hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Oversized wordmark, unmasked bottom to top. Sized by measurement
            above, so it fills the container at any width and never clips. */}
        <div
          ref={wordmarkRef}
          className="border-t border-paper/15 pt-8"
          style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        >
          <span
            ref={textRef}
            aria-hidden="true"
            className="block w-full whitespace-nowrap text-center font-serif leading-[0.85] tracking-tight text-paper"
          >
            Chirag Flour Mill
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/15 py-8 text-[11px] uppercase tracking-[0.15em] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Chirag Flour Mill</span>
          <span>PFA Licence 0000123 — Pir Mahal, Punjab</span>
        </div>
      </div>
    </footer>
  )
}
