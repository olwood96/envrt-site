# Homepage v3 — design notes

> Internal rulebook for the homepage at `/preview/home-v3`. Not yet promoted.
> If we keep it, fold these rules into `docs/ui-styleguide.md`.

---

## The angle

Competitor landing pages cluster in four places:

| Cluster | Examples | Feels like |
|---|---|---|
| Glassmorphic AI-tech | merloop, Carbonfact | Tech demo, dark, fast |
| Lifestyle / busy | Renoon, tex.tracer | Editorial-adjacent but cluttered |
| Corporate B2B SaaS | TrusTrace, Retraced, Fairly Made | Clean but generic |
| Apple-clean precision | Apple, Stripe, Linear | Calm, confident, modern |

v3 sits in the fourth lane: Apple-clean precision. Confident sans-serif type,
generous whitespace, dark + light section heartbeat, one calibrated motion
moment per section. Trust earned through restraint.

Two questions the page must answer on first scroll:

1. Is this serious enough that my compliance team will sign off?
2. Is this calm enough that I'm not about to scroll into another SaaS landing
   page with 14 gradient blobs?

---

## Type system

### Pairing
- **N27** — brand voice. Reserved for the wordmark, eyebrows, the
  occasional brand-marked label. Loaded globally for the whole site.
- **System (SF Pro on Apple, Segoe UI on Windows, Roboto on Android)** —
  primary display + body across v3. The exact font Apple uses on
  apple.com. No webfont download.

Tailwind:
```ts
font-system → ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"',
              '"SF Pro Text"', '"Segoe UI"', "Roboto",
              '"Helvetica Neue"', "Arial", "sans-serif"]
```

Applied at the v3 page wrapper. Cascades to every descendant unless a
component opts back into `font-n27` for a brand moment.

### Weight rule
- **font-semibold (600)** for h1, h2, h3 — Apple's display weight
- **font-medium (500)** for buttons, labels, small caps
- **font-normal (400)** for body
- Avoid font-bold (700) on display — too heavy for SF Pro Display

### Tracking rule
- Display headings: `tracking-[-0.02em]` to `tracking-[-0.04em]` for big
  numerals. SF Pro is designed to be tightened at display sizes.
- Body and UI: default tracking, no override.
- Small-caps eyebrows: `tracking-[0.22em]`.

### Display sizes

| Element | Class |
|---|---|
| Hero h1 | `text-[2.5rem] sm:text-5xl lg:text-[3.75rem] font-semibold tracking-[-0.02em]` |
| Section h2 | `text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-[-0.02em]` |
| Manifesto strip | `text-3xl sm:text-4xl lg:text-[3.25rem] font-semibold` |
| Big numeral (NumbersSection) | `text-[4.5rem] sm:text-[5.5rem] lg:text-[6.5rem] font-semibold tracking-[-0.04em]` |
| Bento tile main | `text-xl font-semibold tracking-[-0.01em]` |

---

## Colour

### Palette extensions

Two additions as CSS vars in `globals.css`:

| Token | Hex | Use |
|---|---|---|
| `envrt-ink` | `#0e0e0e` | High-emphasis editorial type, dark section grounds, final CTA |
| `envrt-stone` | `#ece8e1` | Warmer paper tone for layered backgrounds, scene-plates behind photos |

`envrt-charcoal` is now reserved for mid-weight body text. Use `envrt-ink`
for hero h1, section h2, dark inverted sections.

### Section ground rhythm

The scroll alternates ground tones to give a heartbeat:

```
offwhite (hero) → ink (manifesto) → ink (scroll tour) → offwhite (bento)
  → white (numbers) → offwhite (how it works) → ink (final CTA)
```

Two adjacent dark sections (manifesto → scroll tour) read as a single
"trust strip" — calm tech statement, then the live tour as the proof.

### Accent
- `envrt-green` — primary brand, hero buttons, dark tile backgrounds
- `envrt-teal` — small-caps labels, accent highlights, active states
- `envrt-teal-light` — labels on dark grounds
- No new hues. Warmth comes from `envrt-stone`, depth from `envrt-ink`.

---

## Layout

### Container
- Max width: `1280px–1320px` (was `1280px` in v2). Slightly wider so the
  scroll-tour columns breathe.
- Side padding: `px-6 sm:px-10 lg:px-12` or `lg:px-16`

### Section vertical padding

| Tier | Pattern |
|---|---|
| Standard | `py-20 sm:py-24 lg:py-32` |
| Spacious | `py-24 sm:py-32 lg:py-40` (manifesto, final CTA) |
| Pinned scroll | `h-[400vh]` (scroll tour) |

### Bento rules
- 12-column on `lg`, 6-column on `sm`, single on mobile
- No tile rotates. No infinite-loop ambient animation on tiles.
- Hover-lift: `hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(14,14,14,0.18)]`
- Alternate `bg-envrt-ink`, `bg-envrt-stone`, `bg-white ring-1 ring-envrt-ink/5` to vary surface
- Each tile: small-caps label (top) · main content (middle) · short caption (bottom-anchored)

---

## Motion

### Headline pattern: scroll-pinned DPP tour
The set-piece of v3. See `ScrollTourSection.tsx`.

- Section is 4 viewport heights (`h-[400vh]`)
- Inner container uses `position: sticky; top: 0`
- A tall DPP screenshot pans inside a phone frame via `useScroll` +
  `useTransform` (`y: ["0%", "-72%"]`)
- 4 narrative stops on the left rail, each tied to a scroll progress range
  `[0, 0.27]`, `[0.27, 0.5]`, etc.
- Each stop's opacity, number colour and left-edge indicator are derived
  from the same `scrollYProgress` motion value
- Background teal halo also reacts to scroll progress

### Smaller motion moments
- **CountUp** on big stats (NumbersSection). Cubic ease, 1.4s, fires once
  when in view. Swaps to formatted display string on completion.
- **Soft scale-in** on the hero QR card (motion.div with
  `initial={{ opacity: 0, scale: 0.92 }}`)
- **Hover lift** on bento tiles and how-it-works rows
- **Section entrance** via `FadeUp` everywhere

### Removed from v2
- Glow blobs behind every section — too tech-y at scale
- Auto-pulse ring on QR — distracts from a calm product shot
- Hoodie float bob — calm product photos don't bob
- Cascading rotated callouts — replaced with bento
- All Fraunces italic display — switched to N27 / system bold

### Rule
- Quiet on first paint. One choreographed motion moment per section. Scroll
  tour is the moment of "show me how this works".

---

## Photography

### Hero
- One garment, fill-frame inside a 4:5 aspect ratio
- Stone-tinted scene plate behind (subtle frame)
- One QR + tag overlay where a real care label would sit
- Drop-shadow: `drop-shadow-[0_30px_60px_rgba(14,14,14,0.16)]`

### Scroll tour
- Phone shell with ~600px-tall screen
- Tall DPP PNG inside, panned via `translateY`
- Gradient fade masks at top and bottom of the screen frame
- Caption strip under the phone: `dpp.envrt.com · live example`

---

## Copy register

### Lead lines
- Build with **specifics**, not adjectives
- Active voice, short sentences
- Period at the end of every line

### Numbers
- **Source from real site data**, never invent. See cross-references:

| Claim | Source |
|---|---|
| ~30 minutes onboarding | `src/app/faq/page.tsx:17` |
| 68,431 reference cells per LCA | `src/lib/impact-stats.ts:9` |
| £149/mo Starter | `src/app/pricing/layout.tsx`, `src/app/roi/page.tsx:71` |
| 6.3 kg CO₂e (hoodie) | `src/components/sections/SupplyChainFlowSection.tsx:7` |
| 12,450 L water (hoodie) | `src/components/sections/SupplyChainFlowSection.tsx:8` |
| 69% data depth | `src/components/sections/SupplyChainFlowSection.tsx` |
| EU PEF · ISO 14040 · AWARE | `src/lib/aligned-with.ts` |

If a stat isn't anchored to one of these, don't put a number on it.

### Labels (small-caps overlines)
- `text-[11px] font-semibold uppercase tracking-[0.22em] text-envrt-teal`
- Coloured teal on light grounds, teal-light on dark grounds
- One per section. Never two stacked.

---

## Components introduced

| File | Purpose |
|---|---|
| `src/components/sections/v3/HeroV3.tsx` | Apple-clean hero, single product photo, two CTAs |
| `src/components/sections/v3/ManifestoSection.tsx` | Dark exhale strip, single bold statement |
| `src/components/sections/v3/ScrollTourSection.tsx` | Scroll-pinned phone with panning DPP and a 4-stop narrative rail |
| `src/components/sections/v3/WhatsInDppV3.tsx` | Six-tile bento with hover-lift |
| `src/components/sections/v3/NumbersSection.tsx` | Three big numerals with `CountUp` animation |
| `src/components/sections/v3/HowItWorksV3.tsx` | Three rows with hover-state on `01 02 03` step numbers |
| `src/components/sections/v3/FinalCtaV3.tsx` | Dark closing block with teal halo |

Existing sections reused as-is on v3 (mid-page support):
`ComparisonSection`, `AlignedWithCarousel`, `FAQSection`. These don't yet
match the v3 weight rules. If v3 is promoted, sweep them for `font-bold`
→ `font-semibold` and Apple-style tracking on h2.

---

## What's deliberately not on v3 (vs v2)

- ImpactStatsSection — replaced by `NumbersSection`
- PricingPreviewSection — out of the page run; tease it from final CTA only
- StickyNudge — kills the calm
- DppAnatomySection — superseded by `ScrollTourSection`
- FxLabSection — was only ever a sandbox

---

## Open questions for review

1. Does the scroll-tour earn its 4 viewport heights, or is it too long?
2. The CountUp on NumbersSection — does it land as confident, or does it
   look like a performance gimmick?
3. Manifesto + scroll tour are both dark and adjacent. Read as one trust
   strip, or do we need a visual break between them?
4. Should the v3 hero invert to dark too, for a Carbonfact-style entrance?
5. Promote v3 in place at `/`, or keep as a campaign landing page?
