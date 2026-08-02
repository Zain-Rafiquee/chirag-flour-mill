# Chirag Flour Mill

Marketing site for a heritage stone flour mill. Single page, editorial layout,
scroll-driven motion throughout.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v3 · GSAP/ScrollTrigger · Lenis ·
Framer Motion

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Structure

```
src/
  lib/
    motion.ts          ease token, reduced-motion + mobile hooks, gsap setup
    useLenis.ts        smooth scroll, driven off the GSAP ticker
  components/
    Hero.tsx           pinned hero, scroll-scrubbed video
    BoomerangVideoBg.tsx   frame extraction + scrub playback
    Navbar.tsx  Logo.tsx
    ui/                SplitText, Figure, FadeUp, Grain, Cursor, MagneticButton
    sections/          Marquee, Heritage, Process, Products, Scale, Quality,
                       Bulk, Testimonials, Faq, Contact, Footer
public/
  hero.mp4           hero background footage (H.264)
```

## How the hero video works

The video never plays. On mount an offscreen `<video>` is **seeked** to ~96
evenly spaced timestamps and each frame is drawn into an offscreen canvas. The
visible `<canvas>` then draws frames indexed by the hero's own scroll progress,
so scrolling down advances the footage and scrolling up runs it backward.

Frame budget is device-aware — 96 frames at 960px on desktop, 48 at 640px below
768px, since each stored frame costs `width × height × 4` bytes.

Any replacement footage must be **H.264 in an MP4** (or WebM/VP9). HEVC decodes
in almost no browser and will fail silently, producing no frames at all.

## Design tokens

Defined in `tailwind.config.js`:

| Token     | Value     |
| --------- | --------- |
| `ink`     | `#191919` |
| `paper`   | `#FFFFFF` |
| `surface` | `#F4F3F3` |
| `accent`  | `#C2410C` |

Type: `P22 Mackinac W01 Book` for display, `Inter` for UI. One ease everywhere —
`cubic-bezier(0.16, 1, 0.3, 1)`, durations 0.6–1.2s, no spring.

## Motion rules

- Every heading uses a word-level stagger on enter, once only
- Images enter via clip-path unmask, never opacity alone
- `prefers-reduced-motion` disables Lenis, the pin, parallax, the custom cursor
  and all staggers, and snaps counters to their final values
- The pinned horizontal Process section becomes a vertical list below `md`

## Known gaps

- Section visuals are CSS placeholders (`ui/Figure.tsx`). Pass a `src` to swap in
  real photography — layout and motion are unchanged.
- Navbar links still point at `#product`, `#solutions`, `#pricing`, `#company`,
  which do not exist. Real anchors are `#heritage`, `#process`, `#products`,
  `#quality`, `#bulk`, `#faq`, `#contact`.
- The contact form validates but has no submit endpoint wired.
- The map is hand-drawn SVG, matched to the palette rather than a live embed.
