import { useEffect, useState, type MouseEvent } from 'react'
import Logo from './Logo'
import { getLenis, scrollToHash } from '../lib/useLenis'

const LINKS = [
  { label: 'Products', href: '#products' },
  { label: 'Order', href: '#bulk' },
  { label: 'Contact', href: '#contact' },
  { label: 'About', href: '#heritage' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Over the hero the bar floats bare, as designed. Past it the bar sits on
  // whatever section is passing underneath — including the dark Scale band
  // and the footer — where dark-on-dark text would vanish, so it takes its
  // own ground. Keyed to the hero's own bottom edge because the hero stays
  // pinned for a long runway that a fixed scroll threshold can't predict.
  useEffect(() => {
    const hero = document.querySelector('[data-hero]')
    const onScroll = () => {
      const bottom = hero?.getBoundingClientRect().bottom ?? 0
      setScrolled(bottom <= 72)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // The sheet is a small-screen affordance only. Drop it if the viewport
  // grows past the breakpoint mid-session (rotation, window resize).
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const update = () => {
      if (query.matches) setOpen(false)
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // Hold the page still behind the sheet. Lenis drives the scroll, so
  // overflow:hidden alone would not stop it.
  useEffect(() => {
    if (!open) return
    const lenis = getLenis()
    lenis?.stop()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)

    return () => {
      lenis?.start()
      document.body.style.overflow = previous
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!document.querySelector(href)) return
    event.preventDefault()
    setOpen(false)
    // Deferred a frame so Lenis is running again before we ask it to scroll —
    // closing the sheet restarts it during the same commit.
    requestAnimationFrame(() => scrollToHash(href))
  }

  const grounded = scrolled || open

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 md:px-14 py-4 sm:py-5 transition-colors duration-300 ${
        grounded ? 'bg-paper/90 backdrop-blur-md' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* min-w-0 + truncate rather than shrink-0: at 30 characters the name
            no longer fits beside the links and the CTA at md, so it gives way
            instead of pushing them off the bar. */}
        <a href="#" className="flex min-w-0 items-center gap-2.5">
          <Logo className="w-6 h-6 shrink-0 text-[#191919]" />
          <span className="hidden min-[360px]:inline truncate font-semibold text-sm tracking-tight text-[#191919] lg:text-base">
            Chirag Flour and General Mills
          </span>
        </a>

        <div className="hidden md:flex shrink-0 items-center gap-6 lg:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => onNavigate(e, link.href)}
              className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Desktop only — on phones this CTA lives in the hero instead, so
              the bar stays down to the logo and the menu. */}
          <a
            href="#contact"
            onClick={(e) => onNavigate(e, '#contact')}
            className="hidden md:inline-flex px-5 py-2.5 text-sm bg-[#191919] text-white font-medium rounded-lg whitespace-nowrap hover:bg-[#191919]/90 transition-colors duration-200"
          >
            Send Enquiry
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 shrink-0 place-items-center md:hidden"
          >
            {/* Two rules that fold into an × */}
            <span aria-hidden="true" className="relative block h-4 w-5">
              <span
                className="absolute left-0 block h-px w-5 bg-[#191919] transition-transform duration-300 ease-standard"
                style={{
                  transform: open
                    ? 'translateY(7px) rotate(45deg)'
                    : 'translateY(2px)',
                }}
              />
              <span
                className="absolute left-0 block h-px w-5 bg-[#191919] transition-transform duration-300 ease-standard"
                style={{
                  transform: open
                    ? 'translateY(7px) rotate(-45deg)'
                    : 'translateY(12px)',
                }}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile sheet. Kept mounted so it can transition, but inert while
          closed so it takes no tab stops. */}
      <div
        id="mobile-nav"
        inert={!open}
        className={`absolute inset-x-0 top-full origin-top border-t border-ink/10 bg-paper/95 backdrop-blur-md transition-[opacity,transform] duration-300 ease-standard md:hidden ${
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
      >
        <ul className="flex flex-col px-4 py-2 sm:px-8">
          {LINKS.map((link) => (
            <li key={link.label} className="border-b border-ink/10 last:border-b-0">
              <a
                href={link.href}
                onClick={(e) => onNavigate(e, link.href)}
                className="block py-4 text-base text-[#191919]/80 transition-colors duration-200 hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
