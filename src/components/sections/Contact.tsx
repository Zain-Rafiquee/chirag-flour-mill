import { useState } from 'react'
import FadeUp from '../ui/FadeUp'
import SplitText from '../ui/SplitText'
import MagneticButton from '../ui/MagneticButton'

type FieldName = 'name' | 'business' | 'city' | 'product' | 'volume' | 'message'

/** Country code + number, digits only — the format wa.me expects. */
const WHATSAPP_NUMBER = '923000000000'
const WHATSAPP_DISPLAY = '+92 300 0000000'

const PRODUCT_OPTIONS = [
  'Refined Atta',
  'Maida',
  'Chokar',
  'Suji',
  'Custom Specifications',
]

const REQUIRED: FieldName[] = ['name', 'business', 'city', 'product', 'volume']

/** Formats the enquiry as a plain-text WhatsApp message. */
function whatsappUrl(values: Record<FieldName, string>): string {
  const lines = [
    'New enquiry from the Chirag Flour Mill website',
    '',
    `Name: ${values.name.trim()}`,
    `Business: ${values.business.trim()}`,
    `City: ${values.city.trim()}`,
    `Product: ${values.product}`,
    `Monthly volume: ${values.volume.trim()}`,
  ]
  if (values.message.trim()) lines.push(`Notes: ${values.message.trim()}`)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

function validate(name: FieldName, value: string): string {
  const trimmed = value.trim()
  if (REQUIRED.includes(name) && !trimmed) return 'This field is required'
  if (name === 'name' && trimmed && trimmed.length < 2) return 'Enter a full name'
  if (name === 'volume' && trimmed && !/\d/.test(trimmed))
    return 'Include a number, e.g. 5 tonnes / month'
  return ''
}

/** Input with a label that floats once the field is filled or focused. */
function Field({
  name,
  label,
  value,
  error,
  onChange,
  onBlur,
  type = 'text',
  as = 'input',
  options,
}: {
  name: FieldName
  label: string
  value: string
  error: string
  onChange: (value: string) => void
  onBlur: () => void
  type?: string
  as?: 'input' | 'textarea' | 'select'
  options?: string[]
}) {
  const [focused, setFocused] = useState(false)
  const floated = focused || value.length > 0
  const describedBy = error ? `${name}-error` : undefined

  const shared = {
    id: name,
    name,
    value,
    'aria-invalid': error ? (true as const) : undefined,
    'aria-describedby': describedBy,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false)
      onBlur()
    },
    className: `peer w-full border-b bg-transparent pb-2 pt-6 text-sm text-ink outline-none transition-colors duration-300 ${
      error ? 'border-accent' : 'border-ink/15 focus:border-ink'
    }`,
  }

  return (
    <div className="relative">
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 origin-left text-ink/45 transition-all duration-600 ease-standard ${
          floated ? 'top-0 text-[10px] uppercase tracking-[0.15em]' : 'top-5 text-sm'
        }`}
      >
        {label}
        {REQUIRED.includes(name) ? (
          <span aria-hidden="true" className="text-accent">
            {' '}
            *
          </span>
        ) : null}
      </label>

      {as === 'textarea' ? (
        <textarea
          {...shared}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : as === 'select' ? (
        <select {...shared} onChange={(event) => onChange(event.target.value)}>
          <option value="" />
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...shared}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-2 text-[11px] text-accent">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/** Hand-drawn map in the site palette — no third-party embed to restyle. */
function Map() {
  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden bg-surface"
      role="img"
      aria-label="Map showing the mill location on the Multan road at Pir Mahal"
    >
      <svg viewBox="0 0 400 300" className="h-full w-full" aria-hidden="true">
        <rect width="400" height="300" fill="#F4F3F3" />
        <g stroke="#191919" strokeOpacity="0.09" strokeWidth="1">
          {Array.from({ length: 15 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 20} x2="400" y2={i * 20} />
          ))}
          {Array.from({ length: 20 }, (_, i) => (
            <line key={`v${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" />
          ))}
        </g>
        <path
          d="M0 210 C 90 200, 150 160, 220 150 S 330 120, 400 96"
          fill="none"
          stroke="#191919"
          strokeOpacity="0.35"
          strokeWidth="3"
        />
        <path
          d="M60 300 C 90 230, 130 190, 210 148"
          fill="none"
          stroke="#191919"
          strokeOpacity="0.16"
          strokeWidth="2"
        />
        <circle cx="215" cy="150" r="26" fill="#C2410C" fillOpacity="0.1" />
        <circle cx="215" cy="150" r="6" fill="#C2410C" />
        <text
          x="215"
          y="130"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="2"
          fill="#191919"
          fillOpacity="0.6"
        >
          THE MILL
        </text>
      </svg>
    </div>
  )
}

export default function Contact() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: '',
    business: '',
    city: '',
    product: '',
    volume: '',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  /** The wa.me link built at submit, kept so the panel can re-offer it. */
  const [sentUrl, setSentUrl] = useState('')

  const setField = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    // Clear the error as soon as the field becomes valid again.
    if (errors[name] && !validate(name, value)) {
      setErrors((current) => ({ ...current, [name]: '' }))
    }
  }

  const blurField = (name: FieldName) => {
    setErrors((current) => ({ ...current, [name]: validate(name, values[name]) }))
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const next: Partial<Record<FieldName, string>> = {}
    for (const key of Object.keys(values) as FieldName[]) {
      const error = validate(key, values[key])
      if (error) next[key] = error
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return

    // Opened straight from the submit gesture, so it isn't caught by popup
    // blockers. On phones this hands off to the WhatsApp app.
    const url = whatsappUrl(values)
    setSentUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="bg-surface/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <FadeUp>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
            Contact
          </span>
        </FadeUp>
        <SplitText
          as="h2"
          text="Tell us what you bake, and how much of it."
          className="mt-4 max-w-2xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl"
        />

        <div className="mt-16 grid gap-12 md:grid-cols-12 md:gap-16">
          {/* Form */}
          <div className="md:col-span-7">
            {sentUrl ? (
              <div
                role="status"
                className="border border-ink/10 bg-paper p-8 md:p-10"
              >
                <h3 className="font-serif text-2xl text-ink">
                  Your enquiry is ready on WhatsApp.
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/65">
                  We've opened a chat with your details filled in — send it and
                  we'll reply within one working day, usually with a spec sheet
                  and an indicative per-tonne rate.
                </p>
                <div className="mt-8">
                  <MagneticButton href={sentUrl} target="_blank">
                    Open WhatsApp again
                  </MagneticButton>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2">
                <Field
                  name="name"
                  label="Your name"
                  value={values.name}
                  error={errors.name ?? ''}
                  onChange={(v) => setField('name', v)}
                  onBlur={() => blurField('name')}
                />
                <Field
                  name="business"
                  label="Business name"
                  value={values.business}
                  error={errors.business ?? ''}
                  onChange={(v) => setField('business', v)}
                  onBlur={() => blurField('business')}
                />
                <Field
                  name="city"
                  label="City"
                  value={values.city}
                  error={errors.city ?? ''}
                  onChange={(v) => setField('city', v)}
                  onBlur={() => blurField('city')}
                />
                <Field
                  name="product"
                  label="Product interest"
                  as="select"
                  options={PRODUCT_OPTIONS}
                  value={values.product}
                  error={errors.product ?? ''}
                  onChange={(v) => setField('product', v)}
                  onBlur={() => blurField('product')}
                />
                <div className="sm:col-span-2">
                  <Field
                    name="volume"
                    label="Monthly volume (e.g. 5 tonnes)"
                    value={values.volume}
                    error={errors.volume ?? ''}
                    onChange={(v) => setField('volume', v)}
                    onBlur={() => blurField('volume')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    name="message"
                    label="Anything else"
                    as="textarea"
                    value={values.message}
                    error={errors.message ?? ''}
                    onChange={(v) => setField('message', v)}
                    onBlur={() => blurField('message')}
                  />
                </div>

                <div className="sm:col-span-2">
                  <MagneticButton type="submit">Send enquiry</MagneticButton>
                </div>
              </form>
            )}
          </div>

          {/* Details + map */}
          <div className="md:col-span-5">
            <FadeUp>
              <Map />
            </FadeUp>

            <FadeUp delay={120}>
              <dl className="mt-8 space-y-6">
                {[
                  [
                    'Address',
                    'Sandhelianwali Bypass, Multan Road, Pir Mahal, Pakistan 36300',
                  ],
                  ['WhatsApp', WHATSAPP_DISPLAY],
                  ['Hours', 'Mon–Sat, 8:00 – 18:30 IST'],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-ink/10 pt-4">
                    <dt className="text-[10px] uppercase tracking-[0.15em] text-ink/45">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm text-ink/80">
                      {label === 'WhatsApp' ? (
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline decoration-ink/20 underline-offset-4 transition-colors duration-300 hover:text-accent"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
