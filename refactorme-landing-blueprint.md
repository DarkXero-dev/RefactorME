# Refactor.me — Landing Page Build Brief (Astro)

## For Claude Code

Read this brief in full, then build the site it describes from scratch. Do not ask clarifying questions. Build it. Use Astro. Deploy target is GitHub Pages.

---

## STOP. Read this before anything else.

This is a **from-scratch redesign**. There may be a previous version of this site in the working directory or in your memory of this project. **Ignore it completely.** Do not open it, do not reference it, do not iterate on it, do not reuse a single colour, font, spacing value, layout decision, or component from it.

To guarantee a clean break: treat the existing files as if they are blank. Replace the styles, components, and markup wholesale rather than editing them. Do not carry over any palette, typeface, spacing value, or layout structure from what is already there. If the result shares a palette, a typeface, or a layout structure with the previous version, you have failed the brief and must start over.

The previous attempts produced a dark terminal / code-editor aesthetic (near-black background, a single bright teal or amber accent, monospace headlines). **That entire direction is dead.** This brief replaces it with a completely different, fully specified visual identity below. Follow it exactly.

---

## PHASE 0 (MANDATORY): diverge and preview before you build the real site

You keep producing the same design because you anchor to your default. Break that anchor before building the real site. Do this first, every time, no exceptions.

**Step A: generate 25 radically different design directions for this site.** They must have **nothing in common with each other** except the colour constraint below: different typefaces, different layout structures, different moods, different textures, different signature ideas. No two may share a font pairing, a layout skeleton, or a signature concept. Spread them as wide as possible across everything except colour.

Colour constraint that applies to all 25: **dark mode only, cool tones only.** Blues, purples, slate, indigo, aubergine, charcoal, cool greys, with cool metallic or cool-bright highlights allowed (silver, platinum, cool blue, cool violet). **Forbidden in every concept: brown, green, yellow, gold, orange, pink, red, and any warm earth tone.** None of the 25 may be the dead terminal/code-editor look (flat near-black + single bright accent + monospace). Within those limits, diverge hard: some minimal, some maximal, some architectural, some editorial, some painterly, some austere, some textural, some sculptural. If they feel like cousins, you have failed this step.

**Step B: build a real visual preview of every one of the 25.** Not text descriptions. Actual rendered previews so they can be judged by eye.

- For each concept, produce a self-contained single HTML file (vanilla HTML and CSS, inline, no build step, no dependencies) named `previews/01.html` through `previews/25.html`.
- Each preview shows that concept's hero plus one or two representative sections, using its real palette, real fonts (load via Google Fonts link or system fonts), real layout, and a static hint of its signature idea. Enough to judge the look and feel at a glance. It does not need the full page content, just enough to communicate the direction convincingly.
- Use placeholder Refactor.me copy so each preview feels real.
- Keep each preview lightweight and fast.

**Step C: build a gallery index** at `previews/index.html` that shows all 25 previews together as a scrollable grid of cards (each card can embed the preview in an iframe or a scaled thumbnail, with its number and a one-line name), so the operator can flip through all 25 on one page and pick. Make the gallery itself clean and dark so it is comfortable to browse.

**Step D: stop and let the operator choose.** Concept #1 is fixed as the Gintsugi direction specified below. After the previews and gallery exist, default to building the full site as Gintsugi (#1) unless the operator names a different number. If they say "build #14", build that concept to the full depth described in the rest of this brief.

The point of Phase 0 is mechanical: you cannot honestly produce 25 genuinely distinct previews and still fall back into the same rut. Do the divergence for real and the anchor breaks. Only after the previews exist do you build the chosen full Astro site.

---

## Writing rule (all copy, all docs, all comments)

**No em dashes anywhere.** Not in headings, body, README, or code comments. Use a period, comma, "and", or parentheses instead. Hard rule.

---

## What this is

A landing site for **Refactor.me**, a one-person service that rebuilds outdated small business websites, hobby sites, and single-product sites. The operator works alone and is not an agency. Tone is nerdy, self-aware, confident, and human. Not corporate. Not startup.

The page's single job is **credibility**: a visitor should feel this person clearly knows what they're doing, and think "I could afford this and I'd trust them." No hard sell, no sign-up form, no pop-ups.

**Tone guardrail:** the audience is small business owners and hobbyists on modest budgets. The design reads as "this person is really good", NOT "expensive agency out of my league."

---

## LOCKED DESIGN DIRECTION: Gintsugi (cool, silver)

The entire visual identity is built around **gintsugi**, the silver-and-platinum variant of kintsugi: the Japanese art of repairing broken pottery by filling the cracks with precious metal, so the mended object is more beautiful than the original. Here the metal is **cool**, silver and platinum rather than gold. This is not a loose theme. It is the spine of every design decision, and the perfect metaphor for the business: a broken, dated website (cracked pottery) is repaired into something better, with the repair itself made beautiful (luminous silver seams).

This direction is **locked**. Do not substitute another metaphor. Do not water it down into a generic dark site with a silver accent. The gintsugi idea must show up in the palette, the type, the texture, the layout, and especially the signature moment.

### Mode: dark only, cool tones only

The site is **dark mode only**. No light mode, no theme toggle, no `prefers-color-scheme` light variant. Build one dark theme and only that.

**Palette is cool, not warm.** Use blues, purples, slate, and greys. **Forbidden colours: brown, green, yellow, gold, pink, red, orange.** No warm earth tones anywhere. This is not the forbidden flat terminal-black either. Gintsugi dark means deep, cool, glazed darkness with real depth, lit by silver and platinum. Think the inside of a tea bowl glazed in deep indigo, aubergine, and slate, not a code editor and not a warm lacquer.

### Palette (derive your final hexes near these, named and deliberate)

- **Glaze base**: a deep cool near-black with a blue or indigo undertone, not pure `#000`. Around `#13151c` to `#15161f`. This is the ceramic body.
- **Surface glaze**: a slightly lifted cool dark tone for cards and panels, around `#1c1f2b`, so surfaces have depth against the base.
- **Deep indigo / aubergine**: one deep cool glaze accent, used sparingly, a muted indigo around `#26304a` or a dark aubergine-violet around `#2c2742`. Supporting, never loud.
- **Gintsugi silver**: the hero accent, a real metallic-feeling cool silver/platinum that can glow. Use a small family for the seams and highlights, around `#aeb8c9`, a brighter `#cdd6e4`, and a luminous cool highlight `#dfe7f4`. A faint cool-blue glow (`#8fa6d6`) can sit under the brightest seams. This is the only bright element. It is the repair. Spend it on the cracks and the most important moments only.
- **Cool bone / off-white**: text colour, a slightly cool off-white rather than pure white, around `#e6e9f2`, so it reads clean against the dark glaze.

The silver is precious. Use it like real metal leaf: in the seams, on the one headline word that matters, on the signature transformation. Flooding the page with bright metal kills the metaphor. Restraint is the whole point.

### Typography

- **Display face**: a characterful serif or humanist face with craft, something that feels considered and hand-made, not a default geometric sans and explicitly **not monospace** (monospace drags back toward the dead terminal look). A refined serif suits the "repair as art" idea.
- **Body face**: a clean, highly readable sans or humanist serif that pairs deliberately with the display face.
- Set a clear type scale with intentional weights and generous line spacing. Type should feel placed, like objects in a tokonoma alcove, not packed in.

### Texture and detail

- Subtle ceramic / paper grain in the background is welcome, very faint, to give the glaze surface life. Keep it tasteful and performance-cheap (CSS, a tiny SVG noise, or a cool gradient), not a heavy image. Keep any gradient in the cool range, no warm tints.
- The recurring motif is the **silver seam**: thin, irregular cool-metal lines like filled cracks. Use them as dividers between sections, as underlines on key words, as the connective tissue of the page. They should feel like real repair veins (slightly irregular, organic), not straight CSS borders. Hand-drawn-feeling SVG paths work well here.

### Layout

- Editorial and calm, with generous and slightly asymmetric whitespace, like a gallery wall displaying a few precious objects. Not a stack of identical centered sections.
- Let the silver seams guide the eye down the page and link sections.
- Fully responsive, mobile-first. The silver seams and the signature moment must work on a phone.

Before coding, state to yourself the final palette hexes, the two chosen typefaces, and the layout concept, and confirm none of it has drifted back toward flat terminal-dark, a warm palette, or a generic metallic-accent site. Then build exactly that.

---

## Signature element (the one unforgettable moment)

A **gintsugi repair animation** that is also the before/after demo. This is the heart of the page.

- Show a small mock "before" website snippet, deliberately ugly and dated: clashing colours, Times New Roman heading, 2009 layout, maybe a fake "Best viewed in Internet Explorer" badge. Render it as if it is a **cracked ceramic tile**: the ugly site sits on a surface that is visibly broken, with dark fracture lines running through it.
- On load (or on scroll into view, or a button press), the **cracks fill with luminous silver** and the snippet transforms into a clean, modern "after" version of the same site. The fracture lines becoming glowing cool-silver seams IS the transition. Ugly-and-broken becomes refined-and-mended, with the repair glowing silver-blue.
- This literally demonstrates the repair and the service at once. It is the page's thesis in motion.
- Keep it lightweight: CSS transitions, SVG for the crack paths, a little JS. No heavy animation library.
- Make it replayable so visitors can watch the repair again.

This is where all the boldness goes. Make it genuinely beautiful. Keep everything around it quiet so it lands.

---

## Interactivity level

Polished, a few sharp moments, not a fireworks show.

- A calm page-load reveal on the hero.
- Gentle scroll-triggered reveals as sections enter view, optionally with a tiny silver-seam-drawing effect on the dividers.
- Hover micro-interactions on the "what we build" cards (a faint silver seam catching the light).
- The gintsugi repair is the one real "oh" moment.

Respect `prefers-reduced-motion`: with motion off, the page is fully usable, the cracks render already-mended in silver, and it still looks intentional.

---

## Page sections (in order)

### 1. Hero
- Headline playing on the name and service. Direction: "Your website is calling for a refactor." or "We looked at your website. It needs work." Pick the stronger one. The one key word ("refactor") can carry a silver seam. No em dashes.
- One-line subhead, plain English: "We rebuild tired small business sites, hobby pages, and single-product sites. Faster, cleaner, mobile-friendly, and actually good."
- The gintsugi repair signature lives here or directly below.

### 2. What we fix
Honest, slightly funny list framed as recognition, not shame. 5 to 7 items:
- Looks like it was built in 2009 (it was)
- Breaks the moment someone opens it on a phone
- Takes a small eternity to load
- Fonts that should never have existed
- A Flash intro (we are so sorry)
- Untouched since whoever set it up moved on

### 3. What you get
Grounded deliverables, no "stunning" or "world-class":
- A rebuilt site: clean code, fast load, fully mobile responsive
- Whatever the site actually needs: menu, gallery, contact page, the lot
- Plain-English setup instructions
- One human to talk to, not a ticket queue

### 4. How it works
Four steps (numbering is fine here, it is a real sequence):
1. You tell us what you need (email is fine)
2. We ask a few questions and put together a plan
3. You approve it, we build it
4. You get the finished site, ready to go live

### 5. What we build
Three cards, one sentence each, silver-seam hover detail:
- **Websites**: informational sites for cafes, shops, services, hobbyists, anyone with a page that needs saving
- **Discord bots**: custom bots for communities and servers
- **Desktop apps**: simple GUI tools that do a thing well

### 6. Pricing
Honest and plain, no tiers:
> "Most projects land between 150 and 400 euro depending on what's involved. We tell you the price before we start. No surprises."

### 7. Contact
- Just an email: hello@refactor.me (it will not work yet, this is a draft deploy, that is fine)
- One line: "Tell us what you have and what you want. We take it from there."
- No form, no scheduler.

### 8. Footer
- Refactor.me
- hello@refactor.me
- One line: "Small sites rebuilt by one person who knows what they're doing."
- A final thin silver seam as the closing flourish.

---

## Tech stack

- **Astro** (latest), static output, no SSR.
- One Astro component per section (Hero, WhatWeFix, WhatYouGet, HowItWorks, WhatWeBuild, Pricing, Contact, Footer).
- Zero JS by default. Hydrate only the islands that need it (`client:visible` for the repair animation and scroll reveals). No React/Vue for the whole site.
- Scoped component CSS plus a design-token stylesheet holding the locked palette and type scale.
- Self-host or properly load the chosen fonts so they render on GitHub Pages.

---

## Deployment: GitHub Pages

- In `astro.config.mjs`, set `site` and `base`. Assume a project subpath like `https://USERNAME.github.io/refactor-me/`, so `base: '/refactor-me/'`. Comment clearly how to change `base` to `'/'` for a custom root domain later.
- **Create `.github/workflows/deploy.yml`**: a complete, working GitHub Actions workflow that builds the Astro site and deploys to GitHub Pages. Use `actions/checkout`, Node setup, `npm ci`, `npm run build`, `actions/upload-pages-artifact` pointing at `./dist`, and `actions/deploy-pages`. Set `permissions` (`pages: write`, `id-token: write`) and trigger on push to `main`. No stub. It must work.
- README explains in plain English: create the repo, push, enable Pages (Settings, Pages, Source: GitHub Actions), the resulting URL, and how to change `base` and the email when moving to the real refactor.me domain. No em dashes.

---

## Output

A complete Astro project, ready to build and deploy:

- `previews/01.html` through `previews/25.html` the 25 rendered preview directions from Phase 0
- `previews/index.html` the gallery page showing all 25 together for the operator to pick
- `src/pages/index.astro`
- `src/components/` one component per section
- `src/styles/` design tokens (the locked gintsugi palette and type scale) and global styles
- `astro.config.mjs` configured for GitHub Pages
- `.github/workflows/deploy.yml` complete and working
- `package.json`
- `README.md` plain-English setup, run, build, deploy steps, no em dashes

Build it fully. No placeholders, no TODOs. Runs with `npm install && npm run dev` and deploys cleanly via the workflow.

---

End of brief.
