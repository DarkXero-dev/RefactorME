# Refaktor.me — Credibility & Copy Pass

Context for whoever is implementing this: this is a solo-run web refactoring
service. The site already has good bones (clear pricing, real FAQ, a working
process section). The issues below are specific and text-only. Do not rewrite
the whole page, do not touch layout/design, and do not remove the site's
existing personality (the IE6/Netscape joke demos, "we are so sorry" Flash
line, the terminal/health-monitor theme). Those are working in its favor.
This pass is about closing trust gaps and fixing voice consistency.

Apply the changes below directly in the source (likely Astro components under
something like `src/components/` or `src/pages/index.astro`). Search for the
old text and replace with the new text. If wording differs slightly from what
is shown here due to JSX/template syntax, match on meaning, not exact string.

---

## 1. Fix inconsistent voice (I vs we)

The site is positioned as one person doing the work ("the builder," "no
agency, no ticket queue" is already in the FAQ). Several lines still use
"we/us," which contradicts that positioning. Standardize to first-person
singular everywhere on the page.

Replace:
- "We rebuild tired small business sites, hobby pages, and single-product
  sites." → "I rebuild tired small business sites, hobby pages, and
  single-product sites."
- "We build mobile-first, so everything reads and taps perfectly on any
  screen" → "I build mobile-first, so everything reads and taps perfectly on
  any screen"
- "We rework the layout and the calls-to-action, so visitors actually reach
  out." → "I rework the layout and the calls-to-action, so visitors actually
  reach out."
- "We rebuild it clean and current, so it looks as sharp as the work you
  actually do." → "I rebuild it clean and current, so it looks as sharp as
  the work you actually do."
- "We build with the full web stack: Astro, Vite, HTML, CSS, and JavaScript,
  no bloated page builders." → "I build with the full web stack: Astro, Vite,
  HTML, CSS, and JavaScript, no bloated page builders."
- "Tell us what you've got and what you want done. We'll come back with a
  plan and a price." → "Tell me what you've got and what you want done. I'll
  come back with a plan and a price."

Leave "the builder" and existing "I" instances in the FAQ and trust section
as they are, they're already correct.

---

## 2. Replace the NDA line (trust section)

Current text:
> "Want it in writing? An NDA is available on request, just ask before we
> start."

This reads as an unbacked promise, it implies nothing exists until a client
asks for it. Replace with:

> "Every project starts with a short signed work agreement, covering
> confidentiality, what happens to your credentials, and payment terms.
> It's standard, not something you need to request."

Note: this line will only be true once that agreement actually exists. Flag
this back to the site owner if no such document exists yet, this shouldn't
go live before it's real.

---

## 3. Add payment terms

Nowhere on the site currently says when or how payment happens. Add a new
FAQ entry, placed after the existing "How much does it cost?" question:

**Q: How does payment work?**
> Full payment is due before work begins. For a fixed-price, short-turnaround
> project like this, that's standard practice, it's what makes the fixed
> price possible in the first place. Scope, timeline, and revisions are all
> agreed in the signed work agreement before that payment is made, so there
> are no surprises on either side.

---

## 4. Add a revision policy

Add another new FAQ entry, placed near the payment one:

**Q: How many revisions are included?**
> Two rounds of revisions are included in every quote, that's normally more
> than enough once you've seen the first build. Anything beyond that is
> quick to do and priced separately, always agreed before it happens.

---

## 5. Answer "why you, specifically" honestly

No fabricated team, no invented history. Add one more FAQ entry that turns
the lack of a long track record into an honest, specific pitch:

**Q: Have you done this before?**
> Refaktor is new. In practice that means your project gets full attention
> instead of being one of twenty in a queue, and pricing that reflects a
> service getting started, not inflated agency rates.

---

## 6. Do not change

- The retro demo jokes (Tony's Pizza, CyberTech/NETCORE, IE6/Netscape
  references), these are working personality, not credibility problems.
- The pipeline and diagnostics sections, structurally fine as is.
- The overall dark/terminal visual theme.
- (Pricing section copy is changing, see #8 below, don't leave both versions
  in place.)

---

## 7. Fix footer entity name

TechXero is not a legally incorporated entity. Replace:
> "© 2026 TechXero Inc."

with:
> "© 2026 TechXero"

No "Inc." No LLC, Ltd, or any other suffix implying incorporation.

---

## 8. Reframe pricing as "starting at" with bounded scope

Keep the pricing visible, do not hide or remove it. Public pricing is one of
the site's stronger trust signals right now. The fix for scope-creep risk is
to bound what each price covers, not to hide the number.

For each existing price tier, change the framing from a flat number to a
"starting at" number, and add one line defining what's included at that
tier. Exact wording depends on what's currently in each tier, but the
pattern is:

- "€150" → "Starting at €150"
- Add directly under each tier: a short line listing what's included at that
  price (e.g. page count, feature scope, whatever the current tier already
  implies).
- Add one closing line under the whole pricing block:
  > "Anything beyond this scope gets a custom quote before any work starts,
  > you'll always know the price before you commit."

**This applies to every tier, including the highest-priced one.** If the top
tier currently reads as a flat number or a "top-end" price (e.g. "€450" or
"Full rebuild – €450"), that also becomes "Starting at €450." No tier should
read as a hard ceiling, the whole point of this change is that nothing on
the page caps what a larger job could cost. Check the rendered pricing
section after this change: if any tier still shows a bare number without
"Starting at" in front of it, the fix wasn't applied correctly.

This keeps the transparency intact while protecting against underquoting a
job that turns out bigger than it looked.

---

## 9. Remove any leftover references to the AI preview generator

The "paste your URL, get an automated mockup back" feature has been
scrapped, cost too much to run. Search the codebase for any copy, buttons,
or gated/placeholder components referencing this (anything mentioning a
live preview, URL submission for a mockup, or similar) and remove them
entirely, including any env-var-gated dead code for it. Nothing on the live
site should imply this feature exists or is coming.

---

## 10. Roadmap idea: real diagnostic tool (not urgent, no code changes now)

Not for this pass, just logging it since it solves the same problem the
scrapped preview generator was meant to solve, without the AI cost. The
site's "Site Health Monitor" score is currently just marketing flavor on
fake demo sites. Google PageSpeed Insights has a free API (no per-call cost,
generous rate limits) that returns a real performance/SEO/accessibility
score for any public URL. Wiring the existing score UI to real PageSpeed
Insights data, so a visitor could enter their own site and get an honest
real number back, would turn a marketing gimmick into actual free proof of
value, at effectively zero running cost. Worth scoping as a future addition,
not part of this credibility pass.

---

## 11. Use the name "Steve" instead of "the builder"

Replace every instance of "the builder" with "Steve" across the site
(pricing section, FAQ, trust section, wherever it appears). Adjust
surrounding grammar so it still reads naturally, for example:

- "Who you deal with: the builder" → "Who you deal with: Steve"
- "You deal with the builder, start to finish." → "You deal with Steve,
  start to finish."
- "Direct, no middlemen: You deal with the builder..." → "Direct, no
  middlemen: You deal with Steve..."

Do not add a surname, job title beyond what's already there, or any other
biographical detail, just the first name in place of "the builder."

---

## 12. Final FAQ list: cut to 6 questions total

This section replaces the entire FAQ block and supersedes any impression
from sections 3-5 that the new questions were just being tacked onto the
existing 9. The current FAQ has 9 questions. Adding the 3 new ones without
cutting anything would make 12, that's too many and starts to look like a
wall of objections instead of a confident answer. Replace the whole FAQ
section with exactly these 6, in this order:

**Do I keep my domain and hosting?**
> Yes. Your domain and hosting stay yours. I work with what you already
> have, or help you move to something simpler if you want.

**I only need a small tweak, not a full rebuild.**
> That is fine. Small jobs are welcome and get the same quote-first
> treatment. Tell me what you need and I will price just that.

**How much does it cost?**
> Most projects start at €150, with typical projects landing up to €450
> depending on scope. Anything beyond that gets a custom quote before any
> work starts, so you always know the price first, no surprises.

**How does payment work?**
> Full payment is due before work begins. For a fixed-price, short-turnaround
> project like this, that's standard practice, it's what makes the fixed
> price possible in the first place. Scope, timeline, and revisions are all
> agreed in the signed work agreement before that payment is made, so there
> are no surprises on either side.

**How many revisions are included?**
> Two rounds of revisions are included in every quote, that's normally more
> than enough once you've seen the first build. Anything beyond that is
> quick to do and priced separately, always agreed before it happens.

**Have you done this before?**
> Refaktor is new. In practice that means your project gets full attention
> instead of being one of twenty in a queue, and pricing that reflects a
> service getting started, not inflated agency rates.

Remove these 6 existing questions entirely, each one is already answered
elsewhere on the page or isn't worth the space:
- "What if I don't have a site yet?"
- "What is the difference between a refactor and a redesign?"
- "What do you need from me to start?" (covered by the pipeline section)
- "Who actually does the work?" (covered by the deliverables card and the
  trust section)
- "How long does it take?" (covered by the "Typical turnaround" line under
  the pipeline section)
- "What about maintenance after the site is live?" (covered by the
  "Maintenance: optional add-on" line in the pricing table)

---

## 13. Add an About page

Create a new page (e.g. `src/pages/about.astro`, matching however other
pages/sections in this project are structured). Reuse existing site
components, fonts, colors, and spacing, this should look like it belongs to
the same site, not a bolted-on template. Add a link to it labeled "About" in
both the header nav and the footer, wherever the existing nav links live.

Page content, exactly as written below. Company names are bold and linked
to their real official sites, open those links in a new tab
(`target="_blank" rel="noopener noreferrer"`), styled the same way any
existing external link on the site is styled (check the footer's
techxero.com link or similar for the existing link/hover treatment, reuse
it, don't invent a new link style):

---

**About**

Hi, I'm Steve.

Refaktor is something I'm building on my own, and I want to be upfront
about where I'm coming from.

I spent five years in sales and technical support at **[iStyle](https://istyle.ae)**,
an Apple Premium Reseller, working across Dubai and Beirut. After that, I
worked on **[Apple](https://www.apple.com)**'s Siri Machine Learning
project, reviewing and tagging real user data to help Siri understand
requests more accurately.

None of that is web development on paper. What it gave me was years of
hands-on time inside Apple's ecosystem, a close look at how people actually
use the technical products in front of them, and a habit of dealing with
problems directly instead of passing them up a chain.

Refaktor is new. That means every project gets my full attention, not a
slot in a queue, and pricing that reflects a service just getting started,
not an agency's overhead.

If you want the longer version, it's on [LinkedIn](https://www.linkedin.com/in/schaanine/).

---

Keep this to one page, no additional sections, no stock photos, no team
imagery.

---

## 14. Make code-authorship language neutral

Three places on the site currently say "hand-written," which specifically
claims a person typed every line by hand. Keep the underlying claims that
are still true (real stack, no drag-and-drop page builders, no bloat), just
drop the authorship-specific word so the copy stays accurate without
overstating method. Replace:

- Hero badge: "No templates, no page builders / Hand-written clean code" →
  "No templates, no page builders / Clean code, no bloat"
- Deliverables card 01 subtext: "Hand-written, lightweight, and audited on
  real devices." → "Lightweight, clean, and audited on real devices."
- Samples section: "I build with the full web stack: Astro, Vite, HTML,
  CSS, and JavaScript, no bloated page builders. Hand-written and fast,
  sharp from desktop to phone." → "I build with the full web stack: Astro,
  Vite, HTML, CSS, and JavaScript, no bloated page builders. Clean and
  fast, sharp from desktop to phone."

Do not touch "no templates, no page builders" anywhere, that claim is about
the tech stack, not who typed it, and stays accurate as is.

---

## 15. Final QA checklist, verify against the rendered page

Sections 8 and 14 have been sent before and their status is unconfirmed,
they may not have been applied yet. Do not mark this pass done based on the
diff alone, open the actual rendered page after making changes and check
each item below by eye:

- [ ] Section 8: pricing shows "Starting at €150" (or equivalent), not a
      flat number or a "from X to Y" range, for every tier including the
      top one
- [ ] Section 8: the "How much does it cost?" FAQ answer matches the same
      open-ended framing, not the old "land between €150 and €450" wording
- [ ] Section 14: hero badge no longer says "Hand-written," check the exact
      current wording against what's live
- [ ] Section 14: deliverables card 01 no longer says "Hand-written"
- [ ] Section 14: samples section no longer says "Hand-written"
- [ ] Section 13: About page exists, is linked from nav and footer, and
      loads

If any of these are still showing the old text after edits are made, that's
a real bug worth flagging back, not a caching issue.

---

## 16. Self-check: no AI-isms, no dead code

Before considering this pass finished, do one more pass over everything
touched in this file and check for two things:

**AI-isms in the copy.** Read every changed section out loud in your head
and cut anything that sounds like generated text rather than a person
talking: em dashes, "furthermore," "in today's digital landscape," triplet
lists ("clean, fast, and reliable"), generic hedging, or any phrase that
feels inserted to sound impressive rather than to say something specific.
The bar is: would a small business owner reading this think a person wrote
it, not a template.

**Dead code.** Check for anything left behind by this pass or earlier ones:
unused components, orphaned CSS classes, leftover env-var gates or
placeholder logic for the scrapped preview generator (see section 9),
commented-out blocks, or any file that's no longer referenced by anything
after these changes. Remove it rather than leaving it dormant.

Do not just scan the diffs for this, actually read the rendered page and
skim the touched files.
