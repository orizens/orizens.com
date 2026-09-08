# Orizens Website Redesign - Implementation Brief

You are working directly in the existing Orizens repository.

## Objective

Redesign https://orizens.com into a polished personal engineering/product portfolio that combines:

1. The existing Orizens cosmic/space visual identity.
2. The soft, tactile, friendly 3D character/UI aesthetic shown in the supplied 3D avatar reference.
3. The supplied desktop and mobile redesign reference images.

The result must feel like an evolution of Orizens, not a generic template and not a copy of Threads.

## Technical constraints

- Existing stack: Astro + React + Tailwind CSS.
- Work inside the existing architecture rather than replacing the stack.
- Inspect package.json, Astro config, Tailwind config, existing layouts/components, routes, content collections and styles before changing anything.
- Preserve existing URLs, blog routes, SEO metadata, RSS/content behavior and existing content unless a change is required for the redesign.
- Reuse existing data/content sources instead of hardcoding duplicate post/project data.
- Prefer Astro components for static UI.
- Use React only where client-side interactivity is actually needed.
- Avoid unnecessary dependencies.
- Do not turn the entire page into a hydrated React application.
- Keep accessibility, semantic HTML, keyboard navigation and reduced-motion support.
- Optimize images and avoid large assets blocking LCP.
- The final site must be production-ready and fully responsive.

## Supplied visual references

Use these files as visual direction:

- `orizens-desktop-reference.jpg` - primary desktop composition
- `orizens-mobile-reference.jpg` - mobile composition
- `orizens-responsive-reference.jpg` - desktop/mobile relationship
- `3d-avatar-style-reference.jpg` - soft 3D avatar and tactile material direction

Do not simply use the desktop mockup as a full-page background image. Rebuild the interface as real HTML/CSS/Tailwind components.

use these image files - each for their purpose:

/plans/avatar.png
/plans/footer-bg.png
/plans/header-bg.png
/plans/logo.png

## Brand direction

Keep Orizens cosmic and technical, but make it warmer and more personal.

Visual vocabulary:

- deep midnight/navy space background
- subtle stars, nebula glow and planetary horizon
- electric cyan, blue and restrained violet accents
- warm off-white typography
- translucent navy/glass panels
- rounded 20-28px cards
- soft inner highlights
- thin cool-blue borders
- restrained luminous shadows
- tactile 3D elements
- Oren's 3D avatar as the human focal point
- small orbital technology nodes around the avatar
- occasional handwritten-style annotations as decorative accents

Avoid:

- generic SaaS landing-page appearance
- excessive glassmorphism
- excessive gradients on every object
- heavy animations
- illegible text over space imagery
- visual clutter
- copying Threads branding or UI literally

## Homepage information architecture

### 1. Header

Desktop:

- Orizens planet/orbit mark + “Orizens” at left
- Navigation: Home, Writing, Work, About, Contact
- prominent “Let’s Connect” action at right
- transparent/dark header that visually belongs to the cosmic hero

Mobile:

- logo left
- compact menu button right
- accessible slide-down or drawer navigation
- no cramped desktop navigation

### 2. Hero

Desktop should use a two-column composition.

Left:

- eyebrow: “TURNING IDEAS INTO MEANINGFUL PRODUCTS”
- H1: “Hi, I’m Oren Farhi.”
- emphasize the name with the cyan-to-violet brand treatment
- role line: “Software Engineer · Front End Tech Lead · Product Builder”
- concise existing bio copy
- primary CTA: “Explore my work”
- secondary CTA: “Read my writing”
- small handwritten accent such as “Better tools. Happier people.”

Right:

- Oren's 3D avatar
- avatar stands on a small moon/planet surface
- Earth/cosmic horizon behind him
- 4-5 orbiting technology nodes, for example React, TypeScript, AI, Architecture and Open Source
- orbital lines should be decorative and subtle
- optional small handwritten phrase: “Same planet. More possibilities.”

Do not let the avatar obscure important copy.

### 3. Recent Writing

Use real current Orizens posts from the existing content source.

Feature the newest 3 posts on desktop and a clean vertical/card layout on mobile.

Cards should include:

- title
- date
- short excerpt if available
- tags
- subtle cosmic thumbnail/graphic only if it does not require fake content
- hover/focus state
- link to actual article

Include a “View all posts” action.

### 4. Selected Work

Show the existing key achievements/projects prominently:

- ReadM
- Echoes Player
- Reactive Programming with Angular & NgRx
- ngx-infinite-scroll

Each card should preserve the real title, description, technologies and link already represented by the site/data.

Use tactile, rounded dark cards with a soft dimensional feel.

### 5. Tech Stack

Create a compact visual strip/grid using the real stack already represented by Orizens.

Examples currently on the site include React/TypeScript, Redux Toolkit, ChakraUI, Tailwind, SCSS, Astro and Firebase.

Do not invent proficiency claims.

### 6. Open Source

Preserve the existing open-source projects and links. Present them more visually, but do not remove useful existing content.

### 7. Contact / closing section

Use a cinematic lower-page cosmic scene with a compact contact card:

- heading such as “Let’s Build Something Meaningful”
- short friendly line
- “Let’s Connect” CTA
- GitHub/LinkedIn/email links if already present in the project

### 8. Footer

Simple dark cosmic footer with:

- Orizens logo
- navigation
- social links
- existing copyright

## Mobile behavior

Mobile is not a shrunk desktop version.

At <= 768px:

- single-column hero
- intro text first
- CTAs full-width or nearly full-width
- avatar scene below the CTAs
- reduce orbiting nodes to only the most useful 3-4
- keep decorative orbital lines away from text
- tech stack becomes a 2x2/compact horizontal grid as appropriate
- work cards become one-at-a-time carousel only if implemented accessibly, otherwise use a vertical list
- writing cards stack vertically
- contact CTA is thumb-friendly
- minimum interactive target about 44px
- avoid horizontal overflow
- maintain strong typography at 320px width

Recommended responsive testing widths:
320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920px.

## Component architecture

First inspect the current repo and adapt this to its conventions. A reasonable target decomposition is:

- `Header.astro`
- `Hero.astro`
- `AvatarScene.astro` or React only if animation requires it
- `RecentWriting.astro`
- `PostCard.astro`
- `SelectedWork.astro`
- `ProjectCard.astro`
- `TechStack.astro`
- `OpenSource.astro`
- `ContactCTA.astro`
- `Footer.astro`

Do not create components merely for abstraction. Reuse existing components when they already solve the problem.

## Tailwind design tokens

Extend or reuse the Tailwind theme rather than scattering arbitrary values.

Create coherent tokens for:

- cosmic background
- surface/card navy
- border blue
- cyan accent
- violet accent
- warm foreground
- muted foreground
- card radii
- glow shadows
- content max width

Use CSS variables if the current project already follows that pattern.

## Background implementation

Build the cosmic environment primarily with performant CSS:

- layered radial gradients
- subtle star field
- optional optimized decorative images
- pseudo-elements for glows

Avoid a huge raster screenshot as the page background.

The hero planet/horizon may use an optimized image asset if needed.

## 3D avatar

Use the supplied avatar-style reference as visual direction.

If a clean transparent avatar asset is supplied, use it in the hero.

If only the reference image exists, do not poorly cut the avatar out of a complex screenshot. Instead:

1. create the layout with a clearly named avatar asset slot,
2. use the best clean existing portrait/avatar asset in the repo if available,
3. document the exact expected replacement path for the final transparent 3D avatar.

The avatar should remain crisp on retina screens.

## Motion

Motion should be subtle:

- very slow orbit drift
- gentle glow breathing
- tiny card elevation on hover
- no aggressive parallax

Honor `prefers-reduced-motion: reduce`.

Prefer CSS animation. Do not add a heavy animation library unless one already exists in the project.

## Accessibility

- semantic landmarks
- one H1
- correct heading hierarchy
- meaningful alt text
- decorative stars/orbits hidden from assistive tech
- keyboard-visible focus states
- sufficient contrast
- accessible mobile menu
- no interaction that requires hover
- respect reduced motion

## SEO and behavior preservation

This is a redesign, not a destructive rewrite.

Preserve:

- existing page routes
- blog post URLs
- metadata
- structured data if present
- sitemap/RSS if present
- canonical URLs
- working outbound project links
- current article content
- existing analytics if present

Do not change slugs.

## Implementation process

1. Audit the repository and summarize the relevant architecture.
2. Identify which existing components/styles can be retained.
3. Implement the shared visual tokens/background.
4. Rebuild the homepage section by section.
5. Implement responsive behavior.
6. Integrate the avatar and supplied assets correctly.
7. Run formatting/lint/type checks available in the repo.
8. Run the Astro production build.
9. Fix all errors and obvious warnings caused by the changes.
10. Inspect the finished page at desktop and mobile sizes.
11. Check for overflow, layout shifts, broken links and unreadable contrast.
12. Do not stop at a plan. Make the code changes.

## Acceptance criteria

The task is complete only when:

- homepage visually follows the supplied references
- cosmic Orizens identity is clearly retained
- 3D avatar is a major hero element
- desktop and mobile are deliberately designed
- existing real content is preserved
- Astro production build succeeds
- no obvious horizontal overflow exists
- mobile navigation works
- keyboard focus is visible
- reduced motion is supported
- existing blog/article URLs remain functional
- the design is implemented as components, not a screenshot
- there are no placeholder lorem ipsum sections

At the end, report:

1. files changed
2. components added/removed
3. important design decisions
4. build/test results
5. anything that still needs a final production asset, especially the transparent 3D avatar
