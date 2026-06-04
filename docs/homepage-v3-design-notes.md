# Homepage v3 — design notes

> Internal rulebook for the editorial redesign at `/preview/home-v3`. Not yet
> promoted. If we keep it, fold these rules into `docs/ui-styleguide.md` and
> retire the v2 docs.

---

## The angle

Competitor sites cluster in three places:

| Cluster | Examples | Feels like |
|---|---|---|
| Glassmorphic AI-tech | merloop, Carbonfact | Tech demo, dark, fast |
| Lifestyle / busy | Renoon, tex.tracer | Editorial-adjacent but cluttered |
| Corporate B2B SaaS | TrusTrace, Retraced, Fairly Made | Clean but generic |

v3 takes a fourth lane: **editorial precision**. Quietly confident. Audit-grade
under the hood, fashion-credible on the surface. Closer in temperament to
Cuyana, Aesop, Tibi than to a typical SaaS landing page.

The page should answer two questions on first scroll:

1. Is this fashion-credible enough that I'd put a QR from them on my hangtag?
2. Will the numbers underneath survive my compliance team's review?

Everything else is decoration.

---

## Type system

### Pairing
- **N27** — primary. UI, headings, captions, buttons. Unchanged from v2.
- **Fraunces** — editorial serif, italic only. Loaded via `next/font/google`
  on the v3 route. Used for:
  - Hero lead line
  - Section headings (h2)
  - Pull-quote moments in body copy
  - Big stat numerals
  - Step numbers in How It Works
  - Foot quote-marks (italic captions like "Built for fashion brands…")

### Rule of thumb
- Fraunces italic is the **voice**.
- N27 bold/semibold is the **product**.
- Anything that's a number you want to feel like a statement → Fraunces italic.
  Anything that's instructional → N27.

### Sizes (display)

| Element | Class |
|---|---|
| Hero serif lead | `font-fraunces italic text-[1.7rem] sm:text-[2.1rem] lg:text-[2.4rem]` |
| Section h2 (serif) | `font-fraunces italic text-3xl sm:text-4xl lg:text-[2.6rem]` |
| Manifesto strip | `font-fraunces italic text-3xl sm:text-4xl lg:text-[3.2rem]` |
| Big numeral | `font-fraunces italic text-[5rem] sm:text-[6rem] lg:text-[7rem]` |
| Pull-quote in tile | `font-fraunces italic text-xl` |

### Weight rule
- Fraunces: `font-normal` (400) for all display. Italic does the emphasis work;
  weight stacking would over-stress it.
- N27: same scale as v2 (bold for h1, semibold for h3, medium for labels).

---

## Colour

### Palette extensions

Two additions, both as CSS vars in `globals.css`:

| Token | Hex | Use |
|---|---|---|
| `envrt-ink` | `#0e0e0e` | High-emphasis editorial type, dark section grounds |
| `envrt-stone` | `#ece8e1` | Warmer paper tone for layered backgrounds, plate-behind-photo |

`envrt-charcoal` is now reserved for **mid-weight** type (body text, captions).
Use `envrt-ink` for hero h1, section h2, and anywhere you want the weight of
ink on cotton paper.

### When to use stone vs cream vs offwhite

| Ground | Use |
|---|---|
| `envrt-offwhite` | Default page background |
| `envrt-stone` | Layered surfaces (scene plates behind photos, final CTA section) |
| `envrt-cream` | Skeleton loaders only (unchanged from v2) |
| `envrt-ink` | Dark inversion (manifesto strip, hero bento dark tile) |

### Accent discipline
- `envrt-green` — primary brand, hero buttons, dark tile backgrounds
- `envrt-teal` — small-caps labels, accent highlights, hover states
- `envrt-teal-light` — accent labels on dark grounds
- No new accent colour. The warmth comes from `envrt-stone`, not new hues.

---

## Layout

### Page rhythm
Alternate ground tones to give the scroll a heartbeat:

```
offwhite → ink (manifesto) → offwhite → offwhite → white → … → stone (CTA)
```

Don't run two same-coloured sections in a row.

### Container
- Max width: `1320px` (was `1280px` in v2). Slightly wider gives the bento
  more room without feeling crowded.
- Side padding: `px-6 sm:px-10 lg:px-16`

### Section vertical padding

| Tier | Pattern |
|---|---|
| Editorial standard | `py-20 sm:py-24 lg:py-32` |
| Editorial spacious | `py-24 sm:py-32 lg:py-40` (manifesto, final CTA) |

Always more than v2. Generous whitespace is non-negotiable.

### Bento rules
- Use 12-column grid on `lg`, 6-column on `sm`, single on mobile
- No tile rotates. No tile floats. No shimmer keyframes on bento tiles.
- Alternate `bg-envrt-ink`, `bg-envrt-stone`, `bg-white ring-1 ring-envrt-ink/5`
  across the grid to vary surface
- Each tile has a small-caps label (top), main content (middle), short
  caption sentence (bottom-anchored)

---

## Motion

### Removed from v2
- Glow blobs behind the hero — too tech-y for editorial register
- Auto-pulse ring on QR — distracts from a calm product shot
- Hoodie float bob — calm photography doesn't bob
- Cascading rotated callouts — replaced with bento

### Kept
- `FadeUp` on every section entrance, staggered 60–80ms between siblings
- No infinite-loop ambient animations on the v3 page (apart from
  `prefers-reduced-motion`-respecting custom keyframes that the site already
  ships globally; the v3 page just doesn't use them)

### Rule
- The page should feel quiet on first paint. Motion is for arrival, not
  ambience.

---

## Photography

### Hero
- One garment, centered, fill-frame inside a `5:6` plate
- Stone-tinted plate behind it (subtle frame)
- One QR + tag combination, placed where a care label would naturally sit
- Drop-shadow: `drop-shadow-[0_30px_60px_rgba(14,14,14,0.18)]`

### Bento
- Photos at max two per grid (Eco-Score label, QR). Don't crowd.
- Diagrams (provenance map, supply chain) use SVG, not raster screenshots.

---

## Copy register

### Lead lines (serif italic)
- Build with **specifics**, not adjectives. "Numbers that pass an audit"
  beats "Trusted compliance".
- Use two short sentences for the lead, not one long one.
- Period at the end of every line. Closure matters.

### Body
- Active voice, short sentences. Per universal style rules.
- No oxford commas. No em dashes.
- Numbers as digits in stats and stat-adjacent prose.

### Labels (small-caps overlines)
- `text-[11px] font-medium uppercase tracking-[0.22em] text-envrt-charcoal/55`
- One per section. Never two stacked.

---

## Components introduced

| File | Purpose |
|---|---|
| `src/components/sections/v3/HeroV3.tsx` | Editorial hero + one product photo + stat strip caption |
| `src/components/sections/v3/ManifestoSection.tsx` | Dark exhale strip, single serif statement |
| `src/components/sections/v3/WhatsInDppV3.tsx` | Six-tile bento describing the passport |
| `src/components/sections/v3/NumbersSection.tsx` | Three big serif numerals |
| `src/components/sections/v3/HowItWorksV3.tsx` | Three editorial rows with serif step numbers |
| `src/components/sections/v3/FinalCtaV3.tsx` | Stone-ground final CTA, single italic line |

Existing sections reused as-is: `ComparisonSection`, `AlignedWithCarousel`,
`FAQSection`. These don't yet match the v3 type system. If v3 is promoted,
they need a Fraunces pass on their section headings.

---

## What's deliberately not on v3 (vs v2)

- ImpactStatsSection — replaced by `NumbersSection`
- PricingPreviewSection — out of the editorial run; should be promoted to its
  own page or shortened to a single price moment in v3
- StickyNudge — kills the editorial mood
- DppAnatomySection (the iframe-pan version) — bento covers the same ground
- FxLabSection — was only ever a sandbox

---

## Open questions for review

1. Is `Fraunces` the right serif or should we test `Cormorant Garamond`
   (higher-fashion, more luxe) or `Source Serif` (more neutral)?
2. Does the manifesto strip earn its dark-section moment, or should it be a
   lighter pull-quote?
3. Should the final CTA stay stone-ground, or invert to ink for a stronger
   close?
4. Does the bento need a sixth tile or do five (3+2) read calmer?
5. Promote v3 in place at `/`, or keep it as a campaign landing page only?
