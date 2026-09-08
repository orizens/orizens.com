# ORIZENS DESIGN SYSTEM

Use this design system consistently throughout the redesign. Do not invent random blues, purples, shadows, radii, or gradients inside individual components.

The visual identity should feel:

- Cosmic
- Premium
- Technical
- Friendly
- Dimensional / 3D
- Clean rather than "gaming"
- Dark, but not black

The 3D avatar and illustrations should feel warmer and softer than the surrounding cosmic environment.

---

## 1. CORE COLOR PALETTE

### Cosmic backgrounds

cosmic-950: #020817
Main deepest page background.

cosmic-900: #061226
Primary background.

cosmic-850: #091A32
Elevated dark areas.

cosmic-800: #0C203B
Cards and navigation surfaces.

cosmic-700: #123052
Elevated/hover surfaces.

### Primary blue / cyan

orbit-600: #0878F9
Strong interactive blue.

orbit-500: #0B9CFF
Primary CTA.

orbit-400: #29C6FF
Bright cyan accent.

orbit-300: #6DDCFF
Light cyan highlight.

orbit-200: #A9ECFF
Soft highlight.

### Cosmic violet

nova-600: #6548E8

nova-500: #8066FF

nova-400: #A17CFF

nova-300: #C2A9FF

### Warm dimensional colors

moon-50: #FFF9F1
Warm white.

moon-100: #F5EDE2
Avatar / warm surfaces.

moon-200: #E9D9C6

moon-300: #D7BFA5

### Typography

ink-primary: #F7FAFF
Main text.

ink-secondary: #C3CEE0
Body copy.

ink-muted: #8293AD
Metadata / captions.

ink-subtle: #61728D
Very low-priority text.

### Semantic colors

success: #38D9A9
warning: #FFC857
danger: #FF6577

---

## 2. PRIMARY BRAND GRADIENT

Use sparingly for Oren's name, selected highlights, logo glow and important decorative elements.

background:
linear-gradient(
90deg,
#6DDCFF 0%,
#29C6FF 28%,
#8066FF 68%,
#C2A9FF 100%
);

Do NOT apply this gradient to ordinary body text.

---

## 3. PAGE BACKGROUND

The main page background should approximately be:

background:
radial-gradient(
circle at 72% 12%,
rgba(101,72,232,.20),
transparent 32%
),
radial-gradient(
circle at 20% 28%,
rgba(11,156,255,.12),
transparent 28%
),
#020817;

The supplied space artwork can sit ABOVE this foundation.

This means the site still looks intentional while images load.

---

## 4. CARD SYSTEM

Standard card:

background: rgba(9, 26, 50, 0.78);
border: 1px solid rgba(109, 220, 255, 0.13);
border-radius: 24px;
backdrop-filter: blur(16px);

box-shadow:
0 20px 60px rgba(0,0,0,.30),
inset 0 1px 0 rgba(255,255,255,.05);

### Card hover

border-color: rgba(41,198,255,.30);

box-shadow:
0 24px 70px rgba(0,0,0,.38),
0 0 30px rgba(11,156,255,.08),
inset 0 1px 0 rgba(255,255,255,.07);

transform: translateY(-3px);

Transition around 250ms.

Do not make cards float excessively.

---

## 5. PRIMARY BUTTON

Background:

linear-gradient(
135deg,
#0878F9,
#0B9CFF
);

Text:
#FFFFFF

Border:
rgba(109,220,255,.55)

Shadow:

0 8px 30px rgba(11,156,255,.30),
inset 0 1px 0 rgba(255,255,255,.30);

Hover:

box-shadow:
0 10px 38px rgba(11,156,255,.42),
0 0 18px rgba(41,198,255,.20);

Do not use purple as the main CTA color.

---

## 6. SECONDARY BUTTON

background:
rgba(12,32,59,.70)

border:
1px solid rgba(169,236,255,.22)

text:
#F7FAFF

hover background:
rgba(18,48,82,.85)

---

## 7. GLOW SYSTEM

Glow must be controlled.

### Cyan glow

box-shadow:
0 0 32px rgba(41,198,255,.22);

### Violet glow

box-shadow:
0 0 36px rgba(128,102,255,.20);

### Strong hero glow

filter:
drop-shadow(0 0 35px rgba(41,198,255,.16));

Never put a strong neon glow around every component.

---

## 8. BORDER SYSTEM

Standard:
rgba(109,220,255,.13)

Strong:
rgba(109,220,255,.24)

Highlight:
rgba(41,198,255,.40)

Warm:
rgba(245,237,226,.18)

---

## 9. TYPOGRAPHY

Two families, loaded from Google Fonts in `src/templates/Base.astro`. A third
(Caveat) is used only for tiny handwritten accents.

### Display serif — headings

**Fraunces** (variable, with `opsz` optical sizing).
Fallback stack: `Georgia, Cambria, "Times New Roman", serif`.

Fraunces is warm, readable and premium — soft humanist terminals that match the
"warmer / softer than the surrounding cosmic environment" direction, and an
optical-size axis so large headings pick up the high-contrast display cut while
small headings (card titles) stay sturdy.

Use it for every heading: hero H1, page H1s, section H2/H3, card titles, article
titles, and `.prose` headings. Never for nav, buttons, body copy, labels or
metadata — those stay Inter.

Tokens / helpers:

- Tailwind: `font-serif` (alias `font-display`) → the Fraunces stack.
- CSS var: `--font-serif`.
- `.font-display` — family + `font-optical-sizing: auto`, `font-weight: 500`,
  `letter-spacing: -0.02em`, `line-height: 1.05`. For section headings and
  card titles. Pair with a size utility only.
- `.font-display-xl` — same, tighter (`-0.025em` / `line-height: 0.98`). For
  hero- and page-scale H1s. Pair with a `font-size` (clamp) only.

Weight: **400–600 only.** Serifs read heavy — never `font-bold` / `font-extrabold`
on a Fraunces heading. 500 is the default; 600 for a heading that must shout.

### Body / UI sans — Inter

Set on `<body>`. Used for all body copy, navigation, buttons, form controls,
labels, eyebrows and metadata. Fallback: `system-ui, -apple-system, "Segoe UI",
Roboto, sans-serif`. Token: `font-sans` / `--font-sans`.

### Handwritten accent — Caveat

`.hand` class only, for tiny decorative phrases:

"Better tools. / Happier people." · "Same planet. / More possibilities."

Never for navigation, headings, buttons or body text.

### Desktop H1 (Fraunces)

font-size: clamp(2.6rem, 6vw, 4.5rem) for page H1s;
the hero H1 goes larger — clamp(2.9rem, 7.2vw, 5.75rem).

font-weight: 500 (`.font-display-xl`).

line-height: ~0.98.

letter-spacing: -0.025em.

### Mobile H1

Driven by the lower bound of the same clamp; line-height stays ~0.98–1.05.

---

## 10. SPACING SYSTEM

Use Tailwind's spacing system, but sections should feel generous.

Desktop section padding:
py-24 to py-32

Mobile:
py-14 to py-20

Main content width:

max-w-[1440px]
mx-auto
px-5
sm:px-6
lg:px-10
xl:px-12

Text content should generally NOT exceed:

max-w-2xl

This is especially important in the hero.

---

## 11. BORDER RADIUS

Small UI:
rounded-xl

Buttons:
rounded-xl or rounded-2xl

Cards:
rounded-3xl

Large containers:
28px-32px

Hero artwork should generally not look like a conventional rectangular card.

---

## 12. TAILWIND THEME TOKENS

Add equivalent tokens to the existing Tailwind configuration.

Use the syntax appropriate for the Tailwind version already installed.

Conceptually the tokens are:

colors: {
cosmic: {
950: '#020817',
900: '#061226',
850: '#091A32',
800: '#0C203B',
700: '#123052',
},

orbit: {
600: '#0878F9',
500: '#0B9CFF',
400: '#29C6FF',
300: '#6DDCFF',
200: '#A9ECFF',
},

nova: {
600: '#6548E8',
500: '#8066FF',
400: '#A17CFF',
300: '#C2A9FF',
},

moon: {
50: '#FFF9F1',
100: '#F5EDE2',
200: '#E9D9C6',
300: '#D7BFA5',
},

ink: {
primary: '#F7FAFF',
secondary: '#C3CEE0',
muted: '#8293AD',
subtle: '#61728D',
}
}

---

## 13. CSS VARIABLES

Also expose the important semantic colors as variables:

:root {
--background: #020817;
--background-secondary: #061226;

--surface: #091A32;
--surface-elevated: #0C203B;

--foreground: #F7FAFF;
--foreground-secondary: #C3CEE0;
--foreground-muted: #8293AD;

--primary: #0B9CFF;
--primary-light: #29C6FF;

--accent: #8066FF;
--accent-light: #A17CFF;

--border: rgba(109, 220, 255, 0.13);
--border-hover: rgba(41, 198, 255, 0.30);
}

Components should prefer semantic tokens where practical.

---

# VISUAL HIERARCHY

The intended color ratio is approximately:

70% - dark navy / cosmic space
15% - dark elevated surfaces
8% - white / warm typography
5% - cyan / blue
2% - violet and special accents

The cyan and violet are highlights.

They should NOT dominate the entire interface.

---

# 3D AVATAR INTEGRATION

The avatar is deliberately warm:

light blue shirt
warm beige pants
white shoes
natural skin tones

Do not recolor the avatar blue/purple.

The contrast between the warm human character and the cool universe is an important part of the visual identity.

Place a subtle cyan/violet atmospheric glow BEHIND the avatar instead.

---

# SPACE GRAPHICS

Space imagery should primarily contain:

deep navy
royal blue
cyan atmospheric light
restrained violet nebula
occasional warm sunrise light

Avoid:

- excessive pink
- bright purple everywhere
- cartoon stars
- rainbow nebulae
- generic gaming aesthetics

The universe should feel sophisticated and cinematic.

---

# MOST IMPORTANT DESIGN RULE

Think:

"NASA meets premium product design meets friendly 3D character."

NOT:

"neon gaming website."

The page should remain clean enough that Oren's engineering work, writing and products are the focus.

The cosmic environment establishes personality.
The 3D avatar establishes warmth.
The typography and layout establish professionalism.
