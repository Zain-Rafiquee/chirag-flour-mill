import FadeUp from '../ui/FadeUp'
import SplitText from '../ui/SplitText'
import MagneticButton from '../ui/MagneticButton'

const PATHS = [
  {
    kicker: 'For bakeries & kitchens',
    title: 'Request bulk pricing',
    copy: 'Per-tonne rates on 25kg and 50kg sacks, with a fixed spec sheet and a named contact for reorders.',
    cta: 'Request bulk pricing',
    variant: 'solid' as const,
  },
  {
    kicker: 'For distributors & wholesale',
    title: 'Become a distributor',
    copy: 'Territory-protected supply, retail-ready packaging and quarterly stock planning against your sell-through.',
    cta: 'Become a distributor',
    variant: 'outline' as const,
  },
]

export default function Bulk() {
  return (
    <section id="bulk" className="bg-surface/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <FadeUp>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
            B2B & Bulk Supply
          </span>
        </FadeUp>
        <SplitText
          as="h2"
          text="Two ways to buy at volume."
          className="mt-4 max-w-2xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl"
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-2">
          {PATHS.map((path, i) => (
            <FadeUp key={path.title} delay={i * 140} className="bg-paper">
              <div className="flex h-full flex-col p-8 md:p-12">
                <span className="text-[11px] uppercase tracking-[0.15em] text-ink/45">
                  {path.kicker}
                </span>
                <h3 className="mt-4 font-serif text-2xl tracking-tight text-ink md:text-3xl">
                  {path.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
                  {path.copy}
                </p>
                <div className="mt-10 pt-2">
                  <MagneticButton href="#contact" variant={path.variant}>
                    {path.cta}
                  </MagneticButton>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  )
}
