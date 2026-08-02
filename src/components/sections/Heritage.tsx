import SplitText from '../ui/SplitText'
import FadeUp from '../ui/FadeUp'
import Figure from '../ui/Figure'

export default function Heritage() {
  return (
    <section
      id="heritage"
      className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:px-12 md:py-32 lg:py-40"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Left: oversized statement, revealed word by word */}
        <div className="md:col-span-7 md:pr-8">
          <FadeUp>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Since 1954 — Heritage
            </span>
          </FadeUp>

          <SplitText
            as="h2"
            text="Three generations of stone and patience, milling grain the slow way."
            className="mt-6 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl"
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-14">
            <FadeUp delay={120}>
              <p className="text-sm leading-relaxed text-ink/70 md:text-[15px]">
                We buy standing crop from the same farming families our
                grandfather did, on the black soil belt where the grain runs
                hard and sweet. Every lot is tasted before it is bought.
              </p>
            </FadeUp>
            <FadeUp delay={220}>
              <p className="text-sm leading-relaxed text-ink/70 md:text-[15px]">
                The stones turn slowly and stay cool, so the germ survives the
                grind. It costs us throughput. It is the reason the flour
                smells like wheat and not like paper.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={320} className="mt-12">
            <div className="h-px w-full bg-ink/10" />
            <dl className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                ['1954', 'First stone mill'],
                ['3', 'Generations'],
                ['11', 'Partner villages'],
              ].map(([value, label]) => (
                <div key={label}>
                  <dt className="font-serif text-3xl text-ink md:text-4xl">
                    {value}
                  </dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-[0.15em] text-ink/50">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </div>

        {/* Right: tall masked image with inner parallax */}
        <div className="md:col-span-5">
          <Figure
            alt="Stone grinding wheel at the mill"
            ratio="3/4"
            parallax={6}
            seed={3}
            className="md:sticky md:top-28"
          />
          <FadeUp delay={160}>
            <p className="mt-4 text-[11px] uppercase tracking-[0.15em] text-ink/40">
              The original 1954 chakki, still running
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
