import { useEffect, useRef, useState } from 'react'
import { EASE, useReducedMotion } from '../../lib/motion'
import FadeUp from '../ui/FadeUp'
import SplitText from '../ui/SplitText'

const ITEMS = [
  {
    q: 'What is your minimum order for bulk supply?',
    a: 'One tonne for a first order, half a tonne on repeat. Below that we will point you to a stockist rather than take the order — freight makes it bad value for you.',
  },
  {
    q: 'Can you mill to our own specification?',
    a: 'Yes. Particle size, ash, bran percentage and moisture can all be dialled. We run a paid trial batch first so you can bake against it before committing to volume.',
  },
  {
    q: 'How is the flour packed and how long does it keep?',
    a: 'Food-grade woven sacks with an inner liner, in 25kg and 50kg. Whole wheat keeps three months from mill date; refined flours keep six. Both assume a cool, dry store.',
  },
  {
    q: 'Do you deliver outside your districts?',
    a: 'We deliver on our own trucks across twenty-six districts. Beyond that we hand off to a freight partner at cost, and you keep the same lot codes and paperwork.',
  },
  {
    q: 'Can we visit the mill?',
    a: 'Please do. Buyers are welcome on any working weekday with a day of notice, and we will run your grain through the pilot mill while you watch.',
  },
]

function Item({
  item,
  open,
  onToggle,
  id,
}: {
  item: (typeof ITEMS)[number]
  open: boolean
  onToggle: () => void
  id: string
}) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState(0)
  const reduced = useReducedMotion()

  // Measure so the panel can animate to an explicit height.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const measure = () => setHeight(panel.scrollHeight)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="border-b border-ink/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="max-w-2xl text-base text-ink transition-colors duration-300 group-hover:text-accent md:text-lg">
            {item.q}
          </span>

          {/* Rotating +/− */}
          <span
            aria-hidden="true"
            className="relative mt-1 grid h-6 w-6 shrink-0 place-items-center"
          >
            <span className="absolute h-px w-4 bg-ink" />
            <span
              className="absolute h-px w-4 bg-ink transition-transform duration-600 ease-standard"
              style={{ transform: `rotate(${open ? 0 : 90}deg)` }}
            />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        // Kept mounted so the height can be measured and animated; hidden from
        // assistive tech while collapsed. No focusable content inside.
        aria-hidden={!open}
        style={{
          height: open ? height : 0,
          overflow: 'hidden',
          transition: reduced ? undefined : `height 600ms ${EASE}`,
        }}
      >
        <div ref={panelRef}>
          <p className="max-w-2xl pb-8 pr-10 text-sm leading-relaxed text-ink/65">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:px-12 md:py-32"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <FadeUp>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
              FAQ
            </span>
          </FadeUp>
          <SplitText
            as="h2"
            text="Questions buyers ask us first."
            className="mt-4 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl"
          />
        </div>

        <div className="md:col-span-8">
          <div className="border-t border-ink/10">
            {ITEMS.map((item, i) => (
              <Item
                key={item.q}
                id={`faq-${i}`}
                item={item}
                open={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
