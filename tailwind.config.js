/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        26: '6.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['P22 Mackinac W01 Book', 'Georgia', 'serif'],
      },
      colors: {
        // Mono palette carried over from the hero, plus one saturated accent.
        ink: '#191919',
        paper: '#FFFFFF',
        surface: '#F4F3F3',
        accent: '#C2410C',
      },
      transitionTimingFunction: {
        // The one ease used everywhere. No spring, no bounce.
        standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: {
        600: '600ms',
        900: '900ms',
        1200: '1200ms',
      },
    },
  },
  plugins: [],
}
