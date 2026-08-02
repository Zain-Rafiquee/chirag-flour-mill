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
      ['WhatsApp', 'https://wa.me/919822000000'],
    ],
  },
]

export default function Footer() {
  const wordmarkRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

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
              Chirag Flour Mill has stone-milled wheat on the Katol road since
              1954. Family owned, still one floor, still slow.
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

        {/* Oversized wordmark, unmasked bottom to top. The 13.5vw step fills
            the width for this 17-character name — retune if it changes. */}
        <div
          ref={wordmarkRef}
          className="border-t border-paper/15 pt-8"
          style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        >
          <span
            aria-hidden="true"
            className="block w-full whitespace-nowrap text-center font-serif leading-[0.85] tracking-tight text-paper"
            style={{ fontSize: 'clamp(2.5rem, 13.5vw, 13rem)' }}
          >
            Chirag Flour Mill
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t border-paper/15 py-8 text-[11px] uppercase tracking-[0.15em] text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Chirag Flour Mill</span>
          <span>FSSAI 10019011000123 — Nagpur, Maharashtra</span>
        </div>
      </div>
    </footer>
  )
}
