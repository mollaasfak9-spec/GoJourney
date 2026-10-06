/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      // Every color below resolves to a CSS custom property defined in
      // src/index.css. Light and dark values live side by side there, so
      // classes like `bg-paper` / `text-ink` need no `dark:` variant.
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-soft': 'rgb(var(--color-surface-soft) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-soft': 'rgb(var(--color-ink-soft) / <alpha-value>)',
        'on-ink': 'rgb(var(--color-on-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        'muted-strong': 'rgb(var(--color-muted-strong) / <alpha-value>)',
        live: 'rgb(var(--color-live) / <alpha-value>)',
        'live-tint': 'rgb(var(--color-live-tint) / <alpha-value>)',
        'live-ink': 'rgb(var(--color-live-ink) / <alpha-value>)',
        pin: 'rgb(var(--color-pin) / <alpha-value>)',
        'pin-tint': 'rgb(var(--color-pin-tint) / <alpha-value>)',
        map: {
          road: 'rgb(var(--color-map-road) / <alpha-value>)',
          block: 'rgb(var(--color-map-block) / <alpha-value>)',
          park: 'rgb(var(--color-map-park) / <alpha-value>)',
          water: 'rgb(var(--color-map-water) / <alpha-value>)',
          route: 'rgb(var(--color-map-route) / <alpha-value>)',
        },
        status: {
          requested: 'rgb(var(--color-status-requested) / <alpha-value>)',
          accepted: 'rgb(var(--color-status-accepted) / <alpha-value>)',
          driver_arriving: 'rgb(var(--color-status-driver-arriving) / <alpha-value>)',
          driver_arrived: 'rgb(var(--color-status-driver-arrived) / <alpha-value>)',
          started: 'rgb(var(--color-status-started) / <alpha-value>)',
          completed: 'rgb(var(--color-status-completed) / <alpha-value>)',
          cancelled: 'rgb(var(--color-status-cancelled) / <alpha-value>)',
        },
      },
      // Alphas are tokenized too, because a black shadow is invisible on a
      // dark surface and needs to be stronger there.
      boxShadow: {
        flat: '0 1px 2px rgb(var(--color-shadow) / var(--shadow-flat-alpha))',
        float: '0 20px 40px -20px rgb(var(--color-shadow) / var(--shadow-float-alpha))',
        button: '0 1px 2px rgb(var(--color-shadow) / var(--shadow-button-alpha))',
        hero: '0 40px 60px -40px rgb(var(--color-shadow) / var(--shadow-hero-alpha))',
      },
    },
  },
  plugins: [],
}