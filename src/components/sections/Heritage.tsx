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
              Est. 2016 — The Mill
            </span>
          </FadeUp>

          <SplitText
            as="h2"
            text="Ten years of precision and patience, on machinery built in Turkey."
            className="mt-6 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl"
          />

          <div className="mt-10 grid gap-8 sm:grid-cols-2 md:mt-14">
            <FadeUp delay={120}>
              <p className="text-sm leading-relaxed text-ink/70 md:text-[15px]">
                We buy standing crop from the same farming families season
                after season, on the canal belt along the Ravi where the grain
                runs hard and sweet. Every lot is tasted before it is bought.
              </p>
            </FadeUp>
            <FadeUp delay={220}>
              <p className="text-sm leading-relaxed text-ink/70 md:text-[15px]">
                The mill is powered by Turkish-built milling machinery,
                engineered for precision, consistency, and efficient wheat
                processing. From cleaning and conditioning to grinding and
                sifting, the system is designed to deliver flour with a
                consistent texture, dependable quality, and the natural
                character of wheat.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={320} className="mt-12">
            <div className="h-px w-full bg-ink/10" />
            <dl className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3">
              {[
                ['2016', 'Mill established'],
                ['20', 'Districts served'],
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
            src="/mill-floor.jpg"
            alt="Cutaway view of the Turkish-built milling plant: grain silos, cleaning line, roller stands and sifting floors above the loading bay"
            ratio="3/4"
            parallax={6}
            seed={3}
            className="md:sticky md:top-28"
          />
        </div>
      </div>
    </section>
  )
}
