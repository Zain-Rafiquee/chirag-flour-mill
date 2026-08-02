/**
 * Paper grain laid over the whole page at ~4%. Pure SVG turbulence as a data
 * URI, so there is no network request and nothing to lazy-load.
 */
const NOISE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
       <feColorMatrix type="saturate" values="0"/>
     </filter>
     <rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/>
   </svg>`.replace(/\s+/g, ' '),
)

export default function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] opacity-[0.04] mix-blend-multiply"
      style={{ backgroundImage: `url("data:image/svg+xml,${NOISE}")` }}
    />
  )
}
