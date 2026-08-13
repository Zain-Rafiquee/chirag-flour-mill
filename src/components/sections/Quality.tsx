import FadeUp from '../ui/FadeUp'
import SplitText from '../ui/SplitText'

const NOTES = [
  {
    title: 'Tested per batch, not per season',
    copy: 'Moisture, gluten, ash and falling number are logged for every lot before it leaves the floor. The sheet travels with the order.',
  },
  {
    title: 'A mill you could eat off',
    copy: 'Wet cleaning on a fixed cycle, pest control under third-party audit, and staff health checks recorded quarterly.',
  },
  {
    title: 'Traceable to the village',
    copy: 'Every bag carries a lot code that resolves to the farm group, the intake date and the operator who ran the grind.',
  },
]

export default function Quality() {
  return (
    <section
      id="quality"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:px-12 md:py-32"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-5">
          <FadeUp>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Quality & Certification
            </span>
          </FadeUp>
          <SplitText
            as="h2"
            text="Nothing here is taken on trust."
            className="mt-4 font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />
        </div>

        <div className="md:col-span-7">
          <div className="space-y-10">
            {NOTES.map((note, i) => (
              <FadeUp key={note.title} delay={i * 110}>
                <div className="border-t border-ink/10 pt-6">
                  <h3 className="text-base font-medium text-ink">
                    {note.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink/65">
                    {note.copy}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
