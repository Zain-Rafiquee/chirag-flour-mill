import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SplitText from '../ui/SplitText'
import FadeUp from '../ui/FadeUp'
import Figure from '../ui/Figure'

interface Product {
  id: string
  /** Local trade name, shown as the headline. */
  name: string
  /** English descriptor, shown beneath the name. */
  subtitle: string
  protein: string
  texture: string
  bestFor: string
  blurb: string
  seed: number
}

const PRODUCTS: Product[] = [
  {
    id: 'chakki',
    name: 'Refined Atta',
    subtitle: 'Stone-ground whole wheat',
    protein: '11.8%',
    texture: 'Coarse, flecked with bran',
    bestFor: 'Roti, paratha, everyday baking',
    blurb:
      'Stone-ground with the germ intact, so it keeps the sweet, grassy smell that roller-milled atta loses in the heat of the mill.',
    seed: 1,
  },
  {
    id: 'maida',
    name: 'Maida',
    subtitle: 'Refined flour',
    protein: '9.4%',
    texture: 'Fine, silk-sifted',
    bestFor: 'Pastry, naan, laminated dough',
    blurb:
      'Sifted through fine silk until it runs like powder. Low protein and low ash, for doughs that should stay tender rather than chewy.',
    seed: 2,
  },
  {
    id: 'suji',
    name: 'Suji',
    subtitle: 'Semolina',
    protein: '12.6%',
    texture: 'Granular, even cut',
    bestFor: 'Halwa, kheer, pasta, coatings',
    blurb:
      'Cut from the hard endosperm of durum and graded to a single particle size, so it hydrates evenly and never goes gummy.',
    seed: 3,
  },
  {
    id: 'bran',
    name: 'Chokar',
    subtitle: 'Wheat bran',
    protein: '15.1%',
    texture: 'Flaked, light',
    bestFor: 'Fibre blends, breads, feed',
    blurb:
      'The outer layers, taken off clean during tempering and kept dry. High fibre, and the reason our whole wheat can be dialled to order.',
    seed: 4,
  },
]

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 py-2 last:border-b-0">
      <dt className="text-[10px] uppercase tracking-[0.15em] text-ink/45">
        {label}
      </dt>
      <dd className="text-right text-xs text-ink/80">{value}</dd>
    </div>
  )
}

function ProductCard({
  product,
  onOpen,
}: {
  product: Product
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${product.name} — view details`}
      className="group relative block w-full cursor-pointer text-left"
    >
      <motion.div layoutId={`product-image-${product.id}`} className="overflow-hidden">
        <div className="transition-transform duration-1200 ease-standard group-hover:scale-[1.03]">
          <Figure
            alt={`${product.name} flour`}
            ratio="4/5"
            seed={product.seed}
          />
        </div>
      </motion.div>

      {/* Line draws left to right on hover */}
      <div className="mt-5 h-px w-full bg-ink/10">
        <div className="h-px w-0 bg-accent transition-[width] duration-900 ease-standard group-hover:w-full" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-6">
        <div className="transition-transform duration-600 ease-standard group-hover:translate-x-1">
          <h3 className="font-serif text-2xl tracking-tight text-ink md:text-3xl">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-ink/45">
            {product.subtitle}
          </p>
        </div>

        {/* Spec card fades in on hover; always available via the overlay */}
        <dl className="hidden w-40 shrink-0 opacity-0 transition-opacity duration-600 ease-standard group-hover:opacity-100 md:block">
          <SpecRow label="Protein" value={product.protein} />
          <SpecRow label="Texture" value={product.texture} />
          <SpecRow label="Best for" value={product.bestFor} />
        </dl>
      </div>
    </button>
  )
}

function Overlay({
  product,
  onClose,
}: {
  product: Product
  onClose: () => void
}) {
  // Escape to dismiss, and hold focus inside while open.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previous
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <button
        type="button"
        aria-label="Close details"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/70 backdrop-blur-sm"
      />

      <motion.div
        // svh, not vh: on mobile the large viewport sits behind the browser
        // bars, so a vh-sized dialog runs off the bottom of the screen.
        className="relative grid max-h-[88vh] w-full max-w-4xl gap-8 overflow-y-auto bg-paper p-6 supports-[height:100svh]:max-h-[88svh] sm:grid-cols-2 sm:p-10"
        initial={{ y: 24 }}
        animate={{ y: 0 }}
        exit={{ y: 16 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div layoutId={`product-image-${product.id}`}>
          <Figure alt={`${product.name} flour`} ratio="4/5" seed={product.seed} />
        </motion.div>

        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink/45">
            {product.subtitle}
          </span>
          <h3 className="mt-3 font-serif text-3xl tracking-tight text-ink md:text-4xl">
            {product.name}
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">
            {product.blurb}
          </p>

          <dl className="mt-8">
            <SpecRow label="Protein" value={product.protein} />
            <SpecRow label="Texture" value={product.texture} />
            <SpecRow label="Best for" value={product.bestFor} />
          </dl>

          <div className="mt-auto pt-8">
            <a
              href="#bulk"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors duration-600 ease-standard hover:bg-accent"
            >
              Request bulk pricing
            </a>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          // Sits over the figure on a one-column phone layout, so it carries
          // its own ground rather than relying on the panel behind it.
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-ink/15 bg-paper/90 text-ink backdrop-blur-sm transition-colors duration-300 hover:bg-ink hover:text-paper"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ×
          </span>
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function Products() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = PRODUCTS.find((p) => p.id === openId) ?? null

  return (
    <section
      id="products"
      className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:px-12 md:py-32"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <FadeUp>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/50">
              Products
            </span>
          </FadeUp>
          <SplitText
            as="h2"
            text="Four flours, cut for the way you actually cook."
            className="mt-4 max-w-2xl font-serif text-3xl font-normal leading-[1.12] tracking-tight text-ink sm:text-4xl md:text-5xl"
          />
        </div>
        <FadeUp delay={140}>
          <p className="max-w-xs text-sm leading-relaxed text-ink/60">
            Every grade is milled to a written spec and tested per batch. Ask
            for the sheet — we will send it.
          </p>
        </FadeUp>
      </div>

      {/* Asymmetric editorial grid */}
      <div className="mt-16 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-12">
        {PRODUCTS.map((product, i) => (
          <FadeUp
            key={product.id}
            delay={i * 90}
            className={
              // Two asymmetric rows of 9 of 12 columns, so the grid keeps
              // deliberate whitespace instead of stranding a lone card.
              [
                'lg:col-span-5',
                'lg:col-span-4 lg:mt-24',
                'lg:col-span-4',
                'lg:col-span-5 lg:mt-16',
              ][i] ?? 'lg:col-span-4'
            }
          >
            <ProductCard product={product} onOpen={() => setOpenId(product.id)} />
          </FadeUp>
        ))}
      </div>

      <AnimatePresence>
        {open ? (
          <Overlay key={open.id} product={open} onClose={() => setOpenId(null)} />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
