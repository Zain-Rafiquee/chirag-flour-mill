interface LogoProps {
  className?: string
}

/**
 * The company seal. Cropped to the outer ring, so `rounded-full` masks the
 * square asset back to the circle and it reads as a badge over the hero
 * video rather than a white tile.
 */
export default function Logo({ className = 'w-9 h-9' }: LogoProps) {
  return (
    <img
      src="/logo.webp"
      alt="Chirag Flour and General Mills"
      width={256}
      height={256}
      className={`rounded-full object-contain ${className}`}
    />
  )
}
