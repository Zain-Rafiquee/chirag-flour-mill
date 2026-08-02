import { useEffect, useRef, useState } from 'react'
import { gsap, GSAP_EASE, useReducedMotion } from '../../lib/motion'
import SplitText from '../ui/SplitText'

const STATS = [
  { value: 240, suffix: '', label: 'Tonnes milled per day' },
  { value: 71, suffix: '', label: 'Years operating' },
  { value: 1840, suffix: '+', label: 'Retail partners' },
  { value: 26, suffix: '', label: 'Districts served' },
]

function Counter({
  value,
  suffix,
  play,
}: {
  value: number
  suffix: string
  play: boolean
}) {
  const [shown, setShown] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!play) return
    if (reduced) return setShown(value)

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.2,
      ease: GSAP_EASE,
      onUpdate: () => setShown(Math.round(counter.n)),
    })
    return () => {
      tween.kill()
    }
  }, [play, value, reduced])

  return (
    <span className="font-serif text-5xl leading-none text-paper sm:text-6xl md:text-7xl">
      {shown.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function Scale() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const textureRef = useRef<HTMLDivElement | null>(null)
  const [play, setPlay] = useState(false)
  const reduced = useReducedMotion()

  // Counters start once the band is 40% in view.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setPlay(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Very slow background drift.
  useEffect(() => {
    if (reduced) return
    const texture = textureRef.current
    const section = sectionRef.current
    if (!texture || !section) return

    const tween = gsap.fromTo(
      texture,
      { yPercent: -12 },
      {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [reduced])

  return (
    <section
      ref={sectionRef}
      id="scale"
      className="relative overflow-hidden bg-ink py-24 md:py-32"
    >
      {/* Parallax texture */}
      <div
        ref={textureRef}
        aria-hidden="true"
        className="absolute inset-x-0 -top-[12%] h-[124%] opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 78% 68%, rgba(194,65,12,0.5), transparent 42%), repeating-linear-gradient(115deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 7px)',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <span className="text-[11px] uppercase tracking-[0.2em] text-paper/45">
          Scale
        </span>
        <SplitText
          as="h2"
          text="Small enough to taste every lot. Large enough to supply a state."
          className="mt-4 max-w-3xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-paper sm:text-4xl md:text-5xl"
        />

        <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="border-t border-paper/15 pt-6">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <Counter value={stat.value} suffix={stat.suffix} play={play} />
                <span className="mt-4 block text-[11px] uppercase tracking-[0.15em] text-paper/50">
                  {stat.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
