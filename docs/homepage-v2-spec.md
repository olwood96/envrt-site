# Homepage v2 Spec

> Draft for the redesigned homepage. Built first at `/preview/home-v2`, no nav links, noindex. Cutover into the real homepage after sign-off. All references to the styleguide point to `docs/ui-styleguide.md`.

---

## Goal

A first-time visitor should be able to answer three questions in the first 30 seconds:

1. What is ENVRT? (a platform that creates Digital Product Passports for fashion brands)
2. What's the product? (a scannable page per garment with regulation-ready impact data)
3. Why now? (EU mandate, retailer pressure)

Today's homepage answers these eventually. The redesign brings them forward and stops the page from repeating itself in the middle.

---

## Route and isolation

| Property | Value |
|---|---|
| Path | `/preview/home-v2` |
| Indexing | `noindex, nofollow` meta + `robots.txt` Disallow `/preview/` |
| Nav link | None |
| Sitemap | Excluded |
| Auth | None for now (publicly reachable at unguessable URL) |
| Layout | Same shell as the real site (Navbar + Footer) |
| Data | Fully static. No live DPP fetches, no API calls. Sidesteps RLS entirely. |

---

## Section order

| # | Section | Status | Notes |
|---|---|---|---|
| 1 | Hero (v2) | New build | Noun headline + poetic kicker |
| 2 | What's in a DPP | New build | Annotated screenshot, scroll-revealed callouts |
| 3 | How It Works | New build | Three steps, customer journey only |
| 4 | What You Get | New build | Deliverables-led, no dashboard screenshots in v1 |
| 5 | Why Now | Trimmed | Regulation-only, no consumer-pull sidestep |
| 6 | Comparison | Keep | Existing `ComparisonSection` |
| 7 | Platform impact | Keep | Existing `ImpactStatsSection` |
| 8 | Aligned with | Keep | Existing `AlignedWithCarousel` |
| 9 | Pricing preview | Keep | Existing `PricingPreviewSection` |
| 10 | FAQ | Keep | Existing `FAQSection` |
| 11 | Final CTA | Keep | Existing `FinalCTASection` |

Net change: hero rewritten, two new sections added (2, 4), two existing sections (WhyNow + Outcomes) merged into one trimmed section (5). Everything else stays.

---

## 1. Hero (v2)

### Copy

| Element | v1 | v2 |
|---|---|---|
| Eyebrow | "Onboard in 30 minutes. Generate DPPs today." | "Ready for the EU ESPR mandate." |
| Headline (primary) | *Your* GARMENTS. *Their* IMPACT. *One* PLATFORM. | **Digital Product Passports for fashion brands.** |
| Headline (kicker) | (none) | *Your* GARMENTS. *Their* IMPACT. *One* PLATFORM. (current styled treatment, demoted to smaller size beneath) |
| Subheadline | "Create regulation-ready Digital Product Passports. Calculate emissions, water scarcity and French Eco-Score ratings. Share it all with your customers." | "Calculate emissions, water scarcity and Eco-Score for every garment. Attach a QR to the tag. Customers scan and see it." |
| CTAs | Get a free DPP / Book a demo | Same |
| Foot label | "Built for fashion and apparel brands selling into the EU." | Same |

### Visual

- Right column: PhoneMockup (existing component) showing the **live DPP at `https://dpp.envrt.com/envrt/demo-garments/hoodie-0509-1882/embed`**. Same as today.
- Reason: hero is "product in context" (phone, hand, environment). Section 2 is "product as artefact" (flat, labelled). Different registers, no doubling up.

### Typography

- Primary headline: `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-envrt-charcoal`
- Kicker (poetic line): one step down, `text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight` with existing italic / case treatment
- Spacing between them: `mt-4`

### Open question

- Keep the eyebrow as a speed promise, or swap to a regulation anchor? Suggest building both variants behind a flag and viewing in place.

---

## 2. What's in a DPP (new)

### Purpose

Give visitors a concrete mental model of the product. One image, four to five callouts, one secondary CTA out to the live example.

### Layout

- Single annotated visual, centred, max width ~960px on desktop.
- Image: static PNG screenshot of the live DPP page, framed as a tall phone or browser frame (CSS only, no asset work for the frame).
- Callouts: absolutely positioned divs with thin SVG arrow lines pointing into the image. Positioned with `top` / `left` percentages so they scale.
- Reveal: each callout fades in sequentially as the section enters the viewport. Uses `FadeUp` with staggered delays. ~150ms apart. Once only.

### Callouts (working set, finalise after seeing the live DPP)

| # | Pointing at | Label | Note |
|---|---|---|---|
| 1 | The page header / QR area | "What a customer sees when they scan the tag" | Anchors the "scannable" premise |
| 2 | Headline impact metrics (CO₂e, water scarcity) | "Real numbers, peer-reviewed methods" | Names the methodology lightly without jargon |
| 3 | Supply chain map / journey | "Every stage, from fibre to finished garment" | Demonstrates transparency depth |
| 4 | Eco-Score badge | "French Eco-Score, regulation-recognised" | EU entity for AEO |
| 5 | Brand story / photos | "Your story, your photos, your provenance" | Brand control signal |

### Copy

- Heading: "What's in a Digital Product Passport."
- Body: one sentence. "Every garment gets a scannable page with regulation-ready impact data, supply chain transparency and your brand's own story."
- CTA: "Open a live example →" linking to the public DPP URL.

### Section styling

- Tier: Standard (`py-16 sm:py-24`)
- Background: `bg-envrt-offwhite` or `bg-white` depending on flow with adjacent sections. Test both.

---

## 3. How It Works (new)

### Purpose

Customer journey in three steps. No dashboard detail. Save that for section 4.

### Steps

| # | Heading | One-line body | Illustration |
|---|---|---|---|
| 1 | **Add your garments** | "You give us your collection data. We do the supply chain legwork." | Line illustration: spreadsheet or material swatch |
| 2 | **We calculate the impact** | "Full LCA per garment, regulation-aligned, ready in hours." | Line illustration: calculator / gauge / supply chain dots |
| 3 | **Your customers scan and see it** | "A QR on every tag opens a live Digital Product Passport." | Line illustration: tag with QR + phone |

### Layout

- Desktop: 3 columns side by side
- Mobile: 3 stacked rows
- No card chrome. Just numbered steps with title, body, and a small line illustration above each.
- Illustrations in `envrt-teal`. Per styleguide, hardcoded hex inside SVGs is permitted (exception clause).

### Note on existing component

There's a `HowItWorksSection.tsx` already in the repo (currently unused, scroll-driven sticky multi-step). Decision needed: refactor that file to fit the new three-step design, or leave it alone and create a new simpler component. Suggest **new component**, leave the existing scroll-driven version for potential later use.

### Section styling

- Tier: Standard (`py-16 sm:py-24`)
- Heading: "How it works" eyebrow (small caps) + h2 "Three steps from spreadsheet to live DPP"

---

## 4. What You Get (new, replaces "Inside the Dashboard")

### Purpose

Answers "what am I paying for" without relying on dashboard screenshots. Dashboard isn't visually camera-ready yet, so we lead with deliverables, not the tool.

### Layout

- 4 deliverable tiles, 2x2 on desktop, stacked on mobile.
- Each tile: small illustration or styled mark, short title, one-line body.
- No literal product screenshots in v1.

### Deliverables

| # | Title | One-line body | Visual |
|---|---|---|---|
| 1 | Digital Product Passport per garment | A live, scannable page for every SKU in your collection. | Phone outline with QR mark |
| 2 | QR codes for tags and packaging | Print-ready codes that link straight to the passport. | QR code style mark |
| 3 | Full impact data | Stage-by-stage emissions, water scarcity and Eco-Score. | Bar / metric mark |
| 4 | EU-aligned methodology | PEF, ISO 14040 and AWARE referenced throughout. | Document / stamp mark |

### Copy

- Heading: "What you get."
- Body: "Everything a fashion brand needs to publish regulation-ready Digital Product Passports, on day one."

### Section styling

- Tier: Standard (`py-16 sm:py-24`)
- Tile pattern matches styleguide cards (`rounded-2xl border border-envrt-charcoal/5 bg-white`).

### Future

When the dashboard has had a polish pass, a separate "Take a tour" section can be added between this and Comparison. Out of scope for v1.

---

## 5. Why Now (trimmed, regulation-only)

### Purpose

Replace both `WhyNowSection` and `OutcomesSection` with one tighter section. Single throughline: regulation is closing in, smart brands are moving early. No consumer-pull sidestep (kept for later sections).

### Content

Three points, all regulatory or retailer pressure:

1. **The mandate is dated.** EU ESPR textile delegated acts enforce from 2027. Textiles is among the first product categories named under the regulation.
2. **France is already live.** AGEC environmental display rules already require fashion brands to publish per-product environmental data. Scaling each year through 2030.
3. **Retailers move first.** Major EU retailers and platforms are asking for product-level impact data ahead of the mandate. Late movers pay a premium when demand surges in 2026 to 2027.

Each point is a short paragraph (two sentences), not a card. Editorial layout, no icons.

### Layout

- Two-column. Left: heading + intro sentence. Right: vertical stack of the three points.
- No grid of cards.

### Copy

- Heading: "Why now."
- Intro: "Three reasons brands are moving on DPPs this year, not next."

### Section styling

- Tier: Standard (`py-16 sm:py-24`)

---

## Asset plan

Total new assets needed for v1:

| Asset | How produced | Output path |
|---|---|---|
| 1× DPP screenshot (full page, tall) | Playwright OR manual capture from live URL | `public/screenshots/dpp/hoodie-passport.png` |
| 2 to 3× dashboard screenshots | Playwright against local dashboard dev | `public/screenshots/dashboard/*.png` |
| 3× How It Works line illustrations | SVG drawn in Figma or sourced from existing illustration set | `public/illustrations/how-it-works/*.svg` |

Everything else is code. Frames, callouts, arrows, captions are CSS / DOM, not images.

---

## Playwright capture script (v2, after v1 lands)

### Goal

Re-capture canonical screenshots on demand with one command. No design tool involvement.

### Outline

- New script at `scripts/capture-screenshots.ts`
- Runs Playwright headed against a configurable base URL (env var `CAPTURE_BASE_URL`)
- For the DPP shot: navigates to the live DPP URL at a fixed viewport (e.g. 412×900 for the tall phone shot), waits for full load, captures full page, writes PNG.
- For the dashboard shots: requires login. Reads credentials from local `.env.capture`, never committed. Navigates to specific routes, captures.
- Script is manual only (`npm run capture:screenshots`). Not wired into CI.

### Dependencies

- `playwright` as a devDep (~70MB, includes browsers)
- One-off `npx playwright install chromium` on the first run

### Not in scope for v1

- CI integration, scheduled re-capture, auto-PR creation. Add later if useful.

---

## Cutover plan

1. Build the preview page end-to-end with manual screenshots.
2. User reviews on phone and desktop via the preview URL.
3. Iterate on copy and visuals.
4. Once approved, copy the preview page contents into `src/app/page.tsx` (or equivalent), delete the preview route, delete the screenshot assets that were preview-only (keep the dashboard / DPP shots since they'll be in use).
5. Verify noindex was on the preview path and isn't carried over to production.
6. Commit and ship.

---

## Open questions

1. **Eyebrow copy** on the hero: keep speed promise, or swap to regulation anchor? Will provide both for comparison.
2. **Section 2 background:** `bg-white` or `bg-envrt-offwhite`? Will A/B in the preview build.
3. **Inside the Dashboard layout:** Option A (large + insets) or Option B (horizontal scroller)? Will sketch both in the preview build.
4. **9.7% consumer stat source link:** if there's a canonical source URL we should link to inline (helps AEO).
5. **Existing `HowItWorksSection.tsx`:** keep or delete? Suggest keep but unused, decide at cutover.
