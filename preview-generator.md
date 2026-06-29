# Preview Generator — Addendum Blueprint

## For Claude Code

This is an **addendum** to `refactorme-landing-blueprint.md`. It adds one feature to the landing site: a visitor pastes their website URL, and the page shows them a static image of what their homepage could look like, modernized. Read this in full and implement it on top of the main site. Do not ask clarifying questions.

No em dashes anywhere (copy, docs, comments). Hard rule.

---

## Draft mode for now: button dead, backend present

The site is currently deployed to GitHub Pages as a draft for friends and family. GitHub Pages cannot run the backend, so for now:

- **Build the full backend** (the endpoint, the fetch/extract/generate/render modules, the guardrails) exactly as specified below. It must be complete and ready, not a stub. This is what gets switched on at live deploy time.
- **Build the front-end section** (the "See your site, refactored" area with the URL field and generate control) so the design is visible in the draft.
- **But wire the button to do nothing for now.** It is a dead placeholder. On the GitHub Pages draft it must not call the backend (the backend is not reachable there anyway), must not error, and must not spend any money. Tapping it either does nothing, or shows a calm inline note like "Live preview coming soon." Pick the quieter option.
- Gate this with a single flag, for example a `PREVIEW_ENABLED` environment variable (or a constant) that defaults to `false`. When `false`: the section renders, the button is inert, no backend call is made. When `true` (set at live deploy on the real host): the button works and calls the endpoint for real.

This way the draft shows the complete design including the preview section, the backend is built and waiting, and flipping one flag at live-deploy time turns it on. Document the flag clearly in the README so the operator knows the one switch that activates the feature.

---

## Read this first: what this feature forces (at live deploy, not now)

Adding this feature changes the project in three ways. These are not optional, they are consequences. Build with them in mind.

1. **The site can no longer be hosted on GitHub Pages.** This feature needs a backend (a server function). GitHub Pages is static only. The site must move to a host that runs Astro in server or hybrid mode: **Cloudflare Pages, Vercel, or Netlify** (all have free tiers and serve the static parts just as well). Default this blueprint to **Vercel** unless told otherwise, and structure the Astro config for a server adapter, not a static build.

2. **Every generate costs money.** Each preview makes one Anthropic API call and one screenshot call. This is real spend per click, and the button is public, so bots and curious strangers will click it. Cost control is a first-class requirement, not an afterthought. Build the guardrails in section 4 from the start.

3. **Fetching arbitrary real-world sites is unreliable.** Many sites block bots, render via heavy JavaScript, or have no clean structure. The feature must fail gracefully and never show the visitor a broken or empty preview. A clean "we could not read that site, email us the URL and we will do it by hand" fallback is mandatory.

---

## 1. User-facing behaviour

On the landing page, add one section: **"See your site, refactored."**

- A single input field for a URL, and one generate control.
- The visitor enters their URL and triggers generate.
- A calm loading state appears (tie it to the gintsugi seam motif: a thin silver seam drawing across while it works). Honest microcopy: "Reading your site and reimagining it. This takes a few seconds."
- On success: a **static image** of their modernized homepage appears, presented as a before/after if their original is available, or just the modernized "after" image if not.
- Below the image, one soft line of copy and the contact email: "Like what you see? This is a rough draft. Email hello@refactor.me and we will build the real thing." No clickable rebuilt page, no downloadable code, just the image and the invitation.

Why an image and not a live page: returning an image is more reliable, looks finished, and protects the actual deliverable so nobody copies the HTML and leaves without paying. This is deliberate. Do not return live rebuilt HTML to the visitor.

---

## 2. Architecture

```
Visitor pastes URL
      |
      v
Astro server endpoint  (POST /api/preview)
      |
      1. validate + normalise the URL
      2. rate-limit / abuse checks (section 4)
      3. cache check: seen this URL recently? return cached image
      4. fetch the visitor's site (server-side)
      5. extract content: title, headings, paragraphs, nav items,
         logo/image URLs, dominant colours, business type guess
      6. send extracted content to Claude -> modernized homepage HTML
         (self-contained, inline CSS, in the gintsugi style)
      7. render that HTML to a PNG via an HTML-to-image service
      8. cache the image by URL, return it to the visitor
```

Keep the core logic in one module so the pieces (fetch, extract, generate, render) are separable and testable. The endpoint is the only public surface.

---

## 3. The pieces

### Fetch
- Server-side fetch of the visitor's URL with a normal browser user-agent and a short timeout (about 8 seconds).
- Follow redirects. Cap response size. Only accept HTML responses.
- If fetch fails, times out, or returns non-HTML: stop and return the graceful fallback (section 5), do not call Claude or the screenshot service (no point spending money on a dead input).

### Extract
- Parse the fetched HTML and pull: page title, meta description, headings (h1 to h3), the first chunk of body text, navigation/menu labels, image and logo URLs, and any obvious brand colours from inline styles or CSS.
- Make a light guess at the business type from the content (cafe, plumber, shop, portfolio, etc) to steer the redesign.
- Keep extraction defensive: missing fields are normal, never throw on absent data.

### Generate (Claude)
- Send the extracted content to Claude with a tight system prompt: "You are redesigning this homepage. Here is the existing content. Produce a single self-contained modern homepage as one HTML file with inline CSS, dark mode, cool palette (blues, purples, slate, silver), in the spirit of a clean editorial gintsugi-inspired design. Keep the business's real content. Do not invent fake testimonials or false claims. Output only the HTML, no commentary."
- Use a cost-efficient model for this (the cheaper tier), since it runs on every click.
- Cap output tokens. Strip any markdown fences from the response before rendering.
- Reuse one cached system prompt across calls for token efficiency.

### Render to image
- Send the generated HTML to an **HTML-to-image service** that accepts raw HTML and returns a PNG. Recommended options, all with free tiers: ScreenshotOne, HTMLCSStoImage, or urlbox. Pick one, put its key in an environment variable.
- This avoids self-hosting a headless browser, which is heavy and fragile on serverless. If the operator later wants to self-host, Playwright with a serverless chromium build is the alternative, but the hosted service is the default.
- Render at a sensible homepage size (for example 1280 wide), return the PNG to the visitor.

---

## 4. Abuse and cost control (mandatory, build from the start)

This is a public button that spends money. Without these, one bad afternoon of bot traffic costs real money.

- **Rate limit per IP**: a small number of generates per IP per hour (for example 3). Return a friendly "you have hit the limit, email us and we will do it by hand" message past that.
- **Global daily cap**: a hard ceiling on total generates per day across everyone (for example 100). Past it, the feature shows "the preview tool is resting, email us your URL" and stops spending. The cap value lives in an environment variable so the operator can tune it.
- **Bot protection**: put a lightweight challenge in front of the generate action. **Cloudflare Turnstile** is free, invisible to most users, and the right fit. Require a valid token before the endpoint does any paid work.
- **Cache by URL**: if the same URL was generated recently (say within 24 hours), return the cached image instead of regenerating. Saves money and makes repeat views instant.
- **Block obvious junk early**: reject non-URLs, localhost, private IP ranges, and absurdly large pages before spending anything.
- **Fail before spending**: every check that can reject a request (rate limit, cap, bad URL, dead fetch) must run before the Claude call and the screenshot call.

---

## 5. Graceful failure

The visitor must never see a broken or empty preview. For any failure (unreadable site, blocked fetch, JS-only page, service error, cap reached), show one calm message in the gintsugi style:

> "We could not get a clean read on that site automatically. Email the URL to hello@refactor.me and we will mock up a preview by hand."

This turns every failure into a lead instead of a dead end, and it is also a genuinely better experience for the messy sites that are exactly your target market.

---

## 6. Configuration (environment variables)

All secrets and tunables via environment variables, documented in the README:

- `PREVIEW_ENABLED` master switch for the feature (default `false`). False keeps the button inert and makes no backend calls (draft mode). Set to `true` at live deploy to turn the generator on.
- `ANTHROPIC_API_KEY` the Claude key for generation
- `SCREENSHOT_API_KEY` the HTML-to-image service key
- `TURNSTILE_SECRET` Cloudflare Turnstile secret
- `DAILY_GENERATE_CAP` global daily ceiling (default 100)
- `PER_IP_HOURLY_LIMIT` per-IP limit (default 3)
- `CACHE_TTL_HOURS` how long to cache a URL's image (default 24)

The README must explain in plain English, no assumed knowledge: how to get each key, where to paste it on the chosen host (Vercel/Cloudflare/Netlify dashboard), and how to change the caps. Spell out that this feature spends money per use and that the caps are the spending brake.

---

## 7. Output

On top of the existing site:

- `src/pages/api/preview.ts` (or `.js`) the server endpoint with all logic and guardrails
- `src/lib/` the separable fetch, extract, generate, and render modules
- the preview section component added to the landing page, in the gintsugi style, with the button inert while `PREVIEW_ENABLED` is `false`
- `astro.config.mjs` updated to use a server adapter (Vercel by default) instead of static output
- `.env.example` listing every variable above with placeholder values and a comment each
- README updated: the new host (not GitHub Pages), every env var, how to deploy, the cost warning, and how to tune the caps

Build it fully, no placeholders in the logic. The guardrails in section 4 are not optional and must be present and working.

---

## 8. Operator reality check (plain talk for the operator, keep this section in the README too)

- This feature is the most complex and the only paid-per-use part of the whole project. It is worth having only if the business is getting traffic. If you have not had a customer yet, ship the landing page without it first and add this later.
- The caps are your wallet's seatbelt. Set them low to start. Watch your Anthropic and screenshot-service usage for the first week.
- Most of your real target sites (old, messy, JS-heavy) are exactly the ones that fetch and extract badly. Expect the hand-mockup fallback to fire often. That is fine. It still produces a lead.

---

End of addendum.
