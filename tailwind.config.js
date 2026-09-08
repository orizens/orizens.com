/* eslint-disable import/no-extraneous-dependencies, global-require */
const plugin = require('tailwindcss/plugin');

/**
 * Orizens cosmic design system.
 * See plans/DESIGN_SYSTEM.md — do not scatter arbitrary blues / shadows / radii
 * inside components, reach for these tokens instead.
 */
const cosmic = {
  950: '#020817',
  900: '#061226',
  850: '#091A32',
  800: '#0C203B',
  700: '#123052',
};

const orbit = {
  600: '#0878F9',
  500: '#0B9CFF',
  400: '#29C6FF',
  300: '#6DDCFF',
  200: '#A9ECFF',
};

const nova = {
  600: '#6548E8',
  500: '#8066FF',
  400: '#A17CFF',
  300: '#C2A9FF',
};

const moon = {
  50: '#FFF9F1',
  100: '#F5EDE2',
  200: '#E9D9C6',
  300: '#D7BFA5',
};

const ink = {
  primary: '#F7FAFF',
  secondary: '#C3CEE0',
  muted: '#8293AD',
  subtle: '#61728D',
};

// `primary` is kept as an alias so the wide existing usage (text-primary,
// border-primary, bg-primary, shadow-primary, primaryAlpha) keeps working,
// now pointing at the cosmic cyan accent.
const primary = orbit[400];

module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}',
    './node_modules/astro-boilerplate-components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        'Inter',
        'system-ui',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'sans-serif',
      ],
      // Display serif for headings — Fraunces, with optical sizing (see .font-display
      // in global.css and plans/DESIGN_SYSTEM.md §9). `serif` and `display` are aliases.
      serif: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      // Reading serif for body copy / articles / cards — Newsreader, deliberately
      // distinct from the Fraunces display cut. Default on <body>; utility is
      // `font-serif-text`.
      'serif-text': [
        'Newsreader',
        'Georgia',
        'Cambria',
        'Times New Roman',
        'serif',
      ],
      hand: ['Caveat', 'Segoe Script', 'Bradley Hand', 'cursive'],
      // kept for any lingering references
      OpenSans: ['Inter', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        cosmic,
        orbit,
        nova,
        moon,
        ink,
        primary,
        primaryAlpha: 'rgba(41, 198, 255, 0.10)',
        accent: orbit[400],
        accentLight: orbit[300],
        // semantic aliases mapped to CSS variables (see global.css)
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
      },
      fontSize: {
        h1: [
          'clamp(3.5rem, 6vw, 6.5rem)',
          { lineHeight: '0.98', letterSpacing: '-0.045em' },
        ],
        'h1-mobile': [
          'clamp(2.8rem, 12vw, 4.4rem)',
          { lineHeight: '0.96', letterSpacing: '-0.04em' },
        ],
      },
      maxWidth: {
        content: '1440px',
      },
      borderRadius: {
        card: '24px',
        '4xl': '28px',
        '5xl': '32px',
      },
      borderColor: {
        cool: 'rgba(109, 220, 255, 0.13)',
        'cool-strong': 'rgba(109, 220, 255, 0.24)',
        'cool-hover': 'rgba(41, 198, 255, 0.30)',
        warm: 'rgba(245, 237, 226, 0.18)',
      },
      boxShadow: {
        card: '0 20px 60px rgba(0,0,0,.30), inset 0 1px 0 rgba(255,255,255,.05)',
        'card-hover':
          '0 24px 70px rgba(0,0,0,.38), 0 0 30px rgba(11,156,255,.08), inset 0 1px 0 rgba(255,255,255,.07)',
        'glow-cyan': '0 0 32px rgba(41,198,255,.22)',
        'glow-violet': '0 0 36px rgba(128,102,255,.20)',
        btn: '0 8px 30px rgba(11,156,255,.30), inset 0 1px 0 rgba(255,255,255,.30)',
        'btn-hover':
          '0 10px 38px rgba(11,156,255,.42), 0 0 18px rgba(41,198,255,.20)',
        primary: '0 0 32px rgba(41,198,255,.22)',
      },
      dropShadow: {
        hero: '0 0 35px rgba(41,198,255,.16)',
        primary: '0 0 10px rgba(41,198,255,.55)',
      },
      backgroundImage: {
        brand:
          'linear-gradient(90deg, #6DDCFF 0%, #29C6FF 28%, #8066FF 68%, #C2A9FF 100%)',
      },
      keyframes: {
        'orbit-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'orbit-spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        'glow-breathe': {
          '0%, 100%': { opacity: '0.55' },
          '50%': { opacity: '0.9' },
        },
        'float-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'orbit-slow': 'orbit-spin 90s linear infinite',
        'orbit-slower': 'orbit-spin-reverse 140s linear infinite',
        'glow-breathe': 'glow-breathe 8s ease-in-out infinite',
        'float-soft': 'float-soft 9s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    plugin(({ addBase, theme }) => {
      addBase({
        body: {
          fontFamily: 'Newsreader, Georgia, Cambria, "Times New Roman", serif',
          fontOpticalSizing: 'auto',
          color: ink.secondary,
          backgroundColor: cosmic[950],
        },
        // Article body styling is scoped to .prose so it never leaks into
        // the redesigned marketing sections.
        '.prose :where(h1, h2, h3, h4)': {
          color: ink.primary,
          fontFamily: 'Fraunces, Georgia, Cambria, "Times New Roman", serif',
          fontWeight: '500',
          fontOpticalSizing: 'auto',
          letterSpacing: '-0.015em',
        },
        '.prose :where(h3)': {
          fontSize: theme('fontSize.2xl'),
        },
        '.prose :where(strong)': {
          color: theme('colors.orbit.300'),
        },
        '.prose :where(a)': {
          color: theme('colors.orbit.400'),
        },
        '.prose :where(code):not(pre code)': {
          backgroundColor: 'rgba(128,102,255,.16)',
          padding: theme('spacing[1.5]'),
          borderRadius: theme('borderRadius.lg'),
        },
        '.prose :where(code)::before': { display: 'none' },
        '.prose :where(code)::after': { display: 'none' },
      });
    }),
  ],
};
