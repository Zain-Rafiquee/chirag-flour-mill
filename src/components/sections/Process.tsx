import { useEffect, useRef, useState } from 'react'
import {
  gsap,
  ScrollTrigger,
  GSAP_EASE,
  useIsMobile,
  useReducedMotion,
} from '../../lib/motion'
import Figure from '../ui/Figure'
import FadeUp from '../ui/FadeUp'
import SplitText from '../ui/SplitText'

const STAGES = [
  {
    step: 1,
    title: 'Sourcing',
    copy: 'Standing crop bought by hand from eleven partner villages on the black soil belt.',
  },
  {
    step: 2,
    title: 'Cleaning',
    copy: 'De-stoning, magnetic separation and aspiration until nothing but grain remains.',
  },
  {
    step: 3,
    title: 'Tempering',
    copy: 'Water rested into the kernel for eighteen hours so the bran peels away clean.',
  },
  {
    step: 4,
    title: 'Grinding',
    copy: 'Slow stone rotation, held cool, so the germ and its oils survive the mill.',
  },
  {
    step: 5,
    title: 'Sifting',
    copy: 'Graded through silk to the exact particle size each product is cut for.',
  },
  {
    step: 6,
    title: 'Packing',
    copy: 'Filled, flushed and sealed within the hour, so it reaches you as it left us.',
  },
]

/** Counts 0 → value once, then holds. Padded to two digits. */
function StepNumber({ value, play }: { value: number; play: boolean }) {
  const [shown, setShown] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!play) return
    if (reduced) return setShown(value)

    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 0.9,
      ease: GSAP_EASE,
      onUpdate: () => setShown(Math.round(counter.n)),
    })
    return () => {
      tween.kill()
    }
  }, [play, value, reduced])

  return (
    <span className="block font-serif text-6xl leading-none text-accent sm:text-7xl">
      {String(shown).padStart(2, '0')}
    </span>
  )
}

function StageCard({ stage, active }: { stage: (typeof STAGES)[number]; active: boolean }) {
  return (
    <div className="flex h-full w-[78vw] shrink-0 flex-col justify-center px-5 sm:w-[52vw] sm:px-8 md:w-[38vw] lg:w-[32vw]">
      <div data-stage-item>
        <StepNumber value={stage.step} play={active} />
      </div>
      <h3
        data-stage-item
        className="mt-6 font-serif text-3xl font-normal tracking-tight text-ink md:text-4xl"
      >
        {stage.title}
      </h3>
      <p
        data-stage-item
        className="mt-3 max-w-xs text-sm leading-relaxed text-ink/70"
      >
        {stage.copy}
      </p>
      <div data-stage-item className="mt-8">
        <Figure
          alt={`${stage.title} stage at the mill`}
          ratio="4/3"
          seed={stage.step}
        />
      </div>
    </div>
  )
}

export default function Process() {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const mobile = useIsMobile()
  const reduced = useReducedMotion()
  const pinned = !mobile && !reduced

  useEffect(() => {
    if (!pinned) return
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: viewport,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress)
            // Which card is currently centred.
            setActiveStep(
              Math.min(
                STAGES.length,
                Math.floor(self.progress * STAGES.length) + 1,
              ),
            )
          },
        },
      })

      // Per-card stagger. containerAnimation is what makes ScrollTrigger
      // understand horizontal position inside a pinned tween.
      track.querySelectorAll<HTMLElement>('[data-stage]').forEach((card) => {
        gsap.fromTo(
          card.querySelectorAll('[data-stage-item]'),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: GSAP_EASE,
            stagger: 0.08,
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 80%',
              once: true,
            },
          },
        )
      })
    }, viewportRef)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [pinned])

  // --- Mobile / reduced motion: plain vertical stack, no pinning. ---
  if (!pinned) {
    return (
      <section id="process" className="bg-surface/60 py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
          <ProcessHeading />
          <ol className="mt-14 space-y-16">
            {STAGES.map((stage) => (
              <li key={stage.step}>
                <FadeUp>
                  <span className="block font-serif text-5xl leading-none text-accent">
                    {String(stage.step).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl tracking-tight text-ink">
                    {stage.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
                    {stage.copy}
                  </p>
                  <div className="mt-6">
                    <Figure
                      alt={`${stage.title} stage at the mill`}
                      ratio="4/3"
                      seed={stage.step}
                    />
                  </div>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  // --- Desktop: pinned horizontal run. ---
  return (
    <section id="process" className="relative bg-surface/60">
      <div ref={viewportRef} className="relative h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 px-5 pt-24 sm:px-8 md:px-12">
          <ProcessHeading />
        </div>

        <div ref={trackRef} className="flex h-full w-max items-center pt-40">
          {STAGES.map((stage) => (
            <div key={stage.step} data-stage className="h-full">
              <StageCard stage={stage} active={activeStep >= stage.step} />
            </div>
          ))}
        </div>

        {/* Progress rail */}
        <div className="absolute inset-x-5 bottom-10 z-10 sm:inset-x-8 md:inset-x-12">
          <div className="flex items-center justify-between pb-3 text-[11px] uppercase tracking-[0.15em] text-ink/40">
            <span>{STAGES[Math.max(0, activeStep - 1)]?.title ?? 'Sourcing'}</span>
            <span>
              {String(Math.max(1, activeStep)).padStart(2, '0')} / 06
            </span>
          </div>
          <div className="h-px w-full bg-ink/15">
            <div
              className="h-px bg-accent"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function ProcessHeading() {
  return (
    <>
      <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
        The Process
      </span>
      <SplitText
        as="h2"
        text="Grain to flour, in six unhurried movements."
        className="mt-4 max-w-2xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl"
      />
    </>
  )
}
