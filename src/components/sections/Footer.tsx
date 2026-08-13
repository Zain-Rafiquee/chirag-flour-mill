const COLUMNS = [
  {
    heading: 'Explore',
    links: [
      ['Heritage', '#heritage'],
      ['Process', '#process'],
      ['Products', '#products'],
      ['Quality', '#quality'],
    ],
  },
  {
    heading: 'Trade',
    links: [
      ['Bulk supply', '#bulk'],
      ['Become a distributor', '#bulk'],
      ['FAQ', '#faq'],
      ['Contact', '#contact'],
    ],
  },
  {
    heading: 'Social',
    links: [
      ['TikTok', 'https://www.tiktok.com/@chiragh.group'],
      ['WhatsApp', 'https://wa.me/923007666665'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-ink pt-24 text-paper md:pt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12">
        <div className="grid gap-12 pb-20 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Chirag Flour and General Mills has milled wheat on the Multan
              road since 2016, on Turkish-built plant. Family owned, one floor,
              one standard.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-[10px] uppercase tracking-[0.2em] text-paper/40">
                {column.heading}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-paper/75 transition-colors duration-300 hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-paper/15 py-8 text-[11px] uppercase tracking-[0.15em] text-paper/40">
          <span>© {new Date().getFullYear()} Chirag Flour and General Mills</span>
        </div>
      </div>
    </footer>
  )
}
