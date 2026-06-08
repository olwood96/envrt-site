# ENVRT Site v3 Styleguide

Reference for the v3 brand redesign. Keep this separate from `ui-styleguide.md` (v1) until the v3 site is approved and migrated.

The v3 system is based on the 2022 ENVRT brand identity. Big Shoulders Text for display headings, Karla for body, N27 for the wordmark and big stat numerals. Brand palette anchored on Ultramarine and Vista White.

---

## Scope

This styleguide governs every component, page and pattern under `/preview/v3/` and the v3 section components in `src/components/sections/v3/`. Once we cut over, this becomes the canonical styleguide and `ui-styleguide.md` is retired.

When in doubt, prefer the shared components in `_shared.tsx` over hand-rolled markup.

---

## Color tokens

All v3 tokens are defined in `tailwind.config.ts` under the `envrt` namespace. Never use hardcoded hex values.

| Token | Value | Usage |
|---|---|---|
| `envrt-brand-ultramarine` | #3E00FF | Primary CTA, eyebrows, links, brand accents |
| `envrt-brand-vista` | #FCF9F0 | Page background, light-section background |
| `envrt-brand-black` | #1A1A1A | Body text, headings, dark sections |
| `envrt-brand-vibrant` | #20E036 | Live pill dot, vibrant accent |
| `envrt-brand-lilac` | #DF5FFF | Dark-section accent, lilac dot grid |
| `envrt-brand-golden` | #FFBF00 | Warning, draft state |
| `envrt-brand-crimson` | #B50003 | Error, expired, missing, alert |
| `envrt-brand-shamrock` | #00B92C | Reserved for shamrock + sunny pairing |
| `envrt-brand-sunny` | #FFE50F | Reserved for shamrock + sunny pairing |
| `envrt-brand-royal` | #1F5BFF | Reserved |
| `envrt-brand-aqua` | #00DAFF | Reserved |
| `envrt-brand-neon` | #EDFF00 | Reserved |

### Book-stated color pairings

The 2022 brand book stipulates specific colour pairings. Do not invent new combinations.

| Pairing | Use case |
|---|---|
| Vista white + Ultramarine | Primary light section |
| Black + Bright Lilac | Dark hero or dark proof section |
| Vibrant green + Vista white | Live indicators, success states |
| Golden + Black | Warning callouts |
| Vista white + Crimson red | Alert callouts |
| Shamrock green + Sunny yellow | Reserved |

### Opacity scale

| Opacity | Purpose |
|---|---|
| `/8` | Inline row dividers, faint borders |
| `/10` | Light card borders, hover tints |
| `/12` | Default card border, internal dividers |
| `/25` | Construction mark text |
| `/40` to `/55` | Muted body text |
| `/60` to `/75` | Standard secondary text |

Never use `/50` or lower on text that conveys meaning. Reserve below `/50` for decorative elements.

---

## Typography

### Display: Big Shoulders Text

Loaded as `--font-display` via `next/font/google` on the v3 page wrapper. Compressed sans-serif with strong vertical proportions. Used for all headings.

Weights: 400, 500, 600, 700. Default to `font-medium` (500) for display headings, `font-semibold` (600) for compact h3-style.

### Body: Karla

Loaded as `--font-body`. Default body sans. Always wrapped in `font-karla` class on the page root.

Weights: 400, 500, 700.

### Wordmark: N27

Loaded as `--font-n27`. Reserved for the ENVRT wordmark in SceneMark and big stat numerals in NumbersSection. Do not use elsewhere.

Weight: 700.

### Mono: ui-monospace

Default browser monospace. Used for construction marks, eyebrows, footer captions, code snippets.

### Heading scale

| Class | Size | Usage |
|---|---|---|
| `text-3xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-4xl lg:text-[3rem]` | 30 / 36 / 48px | Page-level h1, section h2 main |
| `text-3xl font-medium leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]` | 30 / 36 / 44px | Mid-section h2 |
| `text-2xl font-medium leading-tight tracking-[-0.01em] sm:text-3xl lg:text-[2.25rem]` | 24 / 30 / 36px | Sub-section h3 |
| `text-xl font-semibold leading-tight tracking-[-0.01em] sm:text-2xl` | 20 / 24px | Card title h3 |
| `text-lg font-semibold leading-tight tracking-[-0.01em]` | 18px | Card title h4 |

All headings use `font-display` (Big Shoulders Text) and `text-envrt-brand-black`.

### Body scale

| Class | Size | Usage |
|---|---|---|
| `text-base leading-relaxed sm:text-lg` | 16 / 18px | Section intro body, hero body |
| `text-sm leading-relaxed sm:text-base` | 14 / 16px | Standard body |
| `text-sm leading-snug` | 14px | Card body, captions |
| `text-xs leading-snug` | 12px | Meta lines, table cells |

### Mono scale

| Class | Size | Usage |
|---|---|---|
| `font-mono text-[11px] font-semibold uppercase tracking-[0.22em]` | 11px | Eyebrows, FAQ section labels |
| `font-mono text-[10px] font-semibold uppercase tracking-[0.18em]` | 10px | Inline meta, live pill labels |
| `font-mono text-[9px] font-medium uppercase tracking-[0.18em]` | 9px | Construction marks |

Never go below 9px. Never use arbitrary px sizes on content text outside this scale.

### Tracking

Lock to three values:

- `tracking-[0.22em]` for eyebrows
- `tracking-[0.18em]` for corner marks, mono caption labels, the N27 wordmark
- `tracking-[0.14em]` to `0.16em` for inline pill chips

---

## Spacing

### Container

Standard page container is `mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16`.

For narrower content surfaces (articles, FAQ, glossary) use `max-w-[800px]` or `max-w-[1000px]` inside the standard container.

### Section padding scale

Three named scales:

| Scale | Tailwind | Usage |
|---|---|---|
| Tight | `py-12 sm:py-16` | EsprCountdown, small accent sections |
| Standard | `py-20 sm:py-24 lg:py-32` | Most sections |
| Hero | `py-20 sm:py-28 lg:py-36` | Manifesto, FinalCta, page-level hero |

Scroll-pinned sections (ScatterToOrder, ScrollTour, AnatomyOfLca) self-pad via the sticky inner and do not use these scales.

### Content rhythm inside sections

| Spacing | Tailwind | Usage |
|---|---|---|
| Eyebrow → heading | `mt-4` to `mt-5` | Standard |
| Heading → body | `mt-4` to `mt-5` sm: `mt-6` to `mt-8` | Standard |
| Body → first nested block | `mt-10` to `mt-14` | Section intro to grid / card / table |
| Card / list internal | `space-y-2` to `space-y-4` | Rows within a card |

---

## Shared components

All exported from `src/components/sections/v3/_shared.tsx`. Use these in every v3 surface.

### `EASE_BRAND`

```tsx
import { EASE_BRAND } from "./_shared";

const x = useTransform(progress, [0, 1], [0, 100], { ease: EASE_BRAND });
```

The single brand cubic: `[0.16, 1, 0.3, 1]`. Expo-out. Fast start, soft landing. Use for every scroll-driven or component-driven motion curve.

### `SectionCorners`

```tsx
<SectionCorners left="ENVRT/03" right="What we do" />
<SectionCorners
  left="04x"
  right="ENVRT/04"
  bottomLeft="By the numbers"
  bottomRight="N/03"
  tone="dark"
/>
```

Mono caps labels at section corners. `tone="dark"` for use on dark backgrounds (uses lilac instead of black). The brand fingerprint that distinguishes v3 from generic editorial design.

### `Eyebrow`

```tsx
<Eyebrow>Our USP</Eyebrow>
<Eyebrow className="text-center">Aligned with</Eyebrow>
```

The ultramarine mono caps label above section headings. Always paired with an h2 below it.

### `LivePill`

```tsx
<LivePill />
<LivePill label="Live · verified" />
<LivePill label="dpp.envrt.com · live" tone="ultramarine" />
```

Green dot with ping animation plus uppercase mono label. Use for any "live" or "verified" indicator.

### `DotGridBackground`

```tsx
<DotGridBackground />
<DotGridBackground opacity={0.04} size={22} />
<DotGridBackground tone="lilac" opacity={0.06} size={26} />
```

Radial-gradient texture. Use on hero, NumbersSection, FinalCta. `tone="lilac"` for dark sections.

### `AssetIcon`

Single inline-SVG library at `src/components/sections/v3/AssetIcon.tsx`. 18 glyphs: 9 file types (pdf, xlsx, csv, json, folder, email, chat, image, qr) and 9 capability glyphs (supply-chain, lca, eco-score, dpp, vault, audit, compliance, analytics, claims).

```tsx
import { AssetIcon } from "./AssetIcon";

<AssetIcon type="lca" size={20} className="text-envrt-brand-ultramarine" />
```

Use these instead of importing lucide-react or hand-rolling SVGs.

---

## Animation patterns

### Default motion curve

Use `EASE_BRAND` for everything. The cubic is consistent across the page.

```tsx
const opacity = useTransform(progress, [0, 0.1], [0, 1], { ease: EASE_BRAND });
```

### Scroll-driven section animations

For scroll-pinned sections, use `useScroll` with `offset: ["start start", "end end"]` and gate visibility on `useTransform(progress, [0, 0.02], [0, 1])` so content stays invisible until the section is sticky-pinned.

Section heights for scroll-pinned: 320vh to 400vh. Always design with at least 25% of progress as dwell time at the resolved state.

### Reveal entrance

Use the existing `FadeUp` wrapper from `@/components/ui/Motion`:

```tsx
<FadeUp>
  <Eyebrow>What we do</Eyebrow>
</FadeUp>
<FadeUp delay={0.08}>
  <h2>Heading</h2>
</FadeUp>
<FadeUp delay={0.16}>
  <p>Body</p>
</FadeUp>
```

Stagger nested children by 0.08s delay increments.

### Hover transitions

```
transition-colors duration-300
transition-transform duration-200
transition-all duration-300
```

Reserve `duration-500` and above for deliberate slow reveals.

---

## Section patterns

### Standard section skeleton

```tsx
<section className="relative bg-envrt-brand-vista py-20 sm:py-24 lg:py-32">
  <SectionCorners left="ENVRT/XX" right="LABEL" />
  <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-16">
    <FadeUp>
      <Eyebrow>Eyebrow text</Eyebrow>
    </FadeUp>
    <FadeUp delay={0.08}>
      <h2 className="mt-4 font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-envrt-brand-black sm:text-4xl lg:text-[3rem]">
        Heading
      </h2>
    </FadeUp>
    <FadeUp delay={0.16}>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg">
        Body
      </p>
    </FadeUp>
    {/* Content */}
  </div>
</section>
```

### Dark section variant

For high-impact proof sections (NumbersSection pattern):

```tsx
<section className="relative overflow-hidden bg-envrt-brand-black py-20 sm:py-24 lg:py-32">
  <DotGridBackground tone="lilac" opacity={0.06} size={26} />
  <SectionCorners tone="dark" left="04x" right="ENVRT/04" />
  {/* Body uses text-white and text-envrt-brand-lilac */}
</section>
```

### Scroll-pinned section

```tsx
<section ref={sectionRef} className="relative overflow-hidden" style={{ height: "400vh" }}>
  <div className="sticky top-0 flex h-screen items-center bg-envrt-brand-vista">
    {/* Pinned content */}
  </div>
</section>
```

`overflow: hidden` on the section breaks `position: sticky` on the inner div. Use `overflowX: "clip"` for horizontal clipping. Use scroll-driven opacity (`useTransform(progress, [0, 0.02], [0, 1])`) to gate visibility instead of overflow clipping.

---

## Card patterns

### Brand card

```tsx
<div className="rounded-3xl border border-envrt-brand-black/12 bg-white p-6 shadow-[0_18px_40px_-22px_rgba(14,14,14,0.12)] sm:p-8">
  {/* Card content */}
</div>
```

`border-envrt-brand-black/12` is the default card border. Use `/8` for inline row dividers, `/10` to `/15` for hairline accents.

### Card with hover

```tsx
className="group rounded-3xl border border-envrt-brand-black/8 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-envrt-brand-ultramarine/30 hover:shadow-[0_18px_40px_-18px_rgba(14,14,14,0.12)]"
```

Used in InsightsTease. Border bumps to ultramarine on hover, slight lift.

### Brand shadow recipes

Use these exact shadow strings as needed. Do not invent new shadows.

| Recipe | Token-ish name | Use |
|---|---|---|
| `shadow-[0_18px_40px_-22px_rgba(14,14,14,0.35)]` | `shadow-card` | Scatter cards in motion |
| `shadow-[0_18px_40px_-18px_rgba(14,14,14,0.12)]` | `shadow-card-soft` | Insights cards |
| `shadow-[0_30px_70px_-30px_rgba(62,0,255,0.45)]` | `shadow-cta-soft` | DPP card |
| `shadow-[0_12px_28px_-14px_rgba(62,0,255,0.7)]` | `shadow-cta` | Primary CTA button |
| `shadow-[0_10px_22px_-12px_rgba(62,0,255,0.55)]` | `shadow-cta-link` | Inline CTA links |

---

## Form patterns

To be implemented in Phase 0.5 as primitives in `src/components/v3/`. Until then, follow these rules.

### Input

```tsx
<input
  type="text"
  className="w-full rounded-xl border border-envrt-brand-black/15 bg-white px-4 py-3 font-karla text-sm text-envrt-brand-black placeholder:text-envrt-brand-black/35 focus:border-envrt-brand-ultramarine focus:outline-none focus:ring-2 focus:ring-envrt-brand-ultramarine/20"
/>
```

### Select

Match input recipe. Add `appearance-none` and a custom chevron via background-image.

### Label

```tsx
<label className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-envrt-brand-black/65">
  Field name
</label>
```

### Button variants (existing `Button` component, formalised)

| Variant | Recipe | Use |
|---|---|---|
| Primary | `!bg-envrt-brand-ultramarine !text-white shadow-cta hover:!bg-envrt-brand-ultramarine/90` | Hero CTA, final CTA, primary form submit |
| Secondary | Default Button styles | Most other CTAs |
| Ghost | `variant="ghost"` | Inline next-to-primary CTAs |

### Multi-step wizard

```
Step indicator at top (3 numbered dots with active state)
Step body card (1 step shown at a time)
Step navigation row at bottom (Back ghost, Next primary)
```

Use brand cubic on step transitions. AnimatePresence with mode="wait" between steps.

---

## Page-level patterns

### Hero

The HeroV3 pattern: eyebrow + display h1 + body + dual CTA + visual right + capability strip below.

Visual variations: garment photo, product mockup, abstract data visual. Keep the capability strip pattern consistent regardless of visual.

### FAQ snippet at page end

Every dedicated page (not the homepage) ends with a 3-4 question FAQ snippet using the FAQSectionV3 accordion pattern. Question text shaped for AEO: "How does ENVRT calculate water scarcity?", "What's the difference between ENVRT and Carbonfact?", etc.

Snippet sits above the final CTA and serves long-tail search intent.

### Final CTA

Reuse `FinalCtaV3` styling. Stone background, dot grid, top and bottom hairline accent rules, brand-aligned primary button.

---

## Section ordering convention

Every v3 page that uses section corners labels them sequentially as `ENVRT/01`, `ENVRT/02`, etc. The page hero is `ENVRT/01`. Subsequent sections increment.

For sub-numbered sections (e.g. NumbersSection uses both `04x` and `N/03` corners) the pattern is `[parent]/[child]` where parent is the section number and child is the sub-index.

---

## Writing rules

These come from the global ENVRT writing rules and apply to every word of copy in the v3 build.

- **No em dashes anywhere.** Use a comma, parentheses or two sentences.
- **No oxford commas.** Write "A, B and C", never "A, B, and C".
- **Plain English.** Specific over vague.
- **Active voice.** "We ship features", not "features are shipped".
- **Show, do not tell.** Demonstrate with a concrete example or number.
- **Numbers as digits** in tables, stats and inline metrics. Below ten, words in flowing prose ("five brands"). Always digits with a unit ("5 working days", "£1.8k").
- **No emojis** unless explicitly requested.

### Marketing copy verb rules

Use descriptive verbs: "aligned with", "served via", "following", "we apply", "we use", "we reference".

Never use endorsement verbs: "endorsed by", "backed by", "trusted by" (when implying customer trust), "certified by", "approved by", "powered by", "partnered with" (unless formal partnership exists).

Numbers in marketing copy must be defensible from real data.

---

## Things to avoid

- Halos and radial blur backgrounds. The v3 system uses dot grids, construction marks, hairline accent rules and textile cross-hatch only.
- Lucide-react. Use the AssetIcon library.
- Tailwind `text-[Npx]` outside the documented mono scale (9, 10, 11px).
- New shadow recipes. Use the brand shadow recipes table.
- Animating `left` or `top` directly. Use `transform: translate` so the GPU can composite. Exception: when GPU transforms create conflicts (see DPP card centring), use absolute positioning with static CSS transform plus a separate motion-driven inner div.
- `position: sticky` inside an `overflow: hidden` parent. This breaks sticky. Use `overflowX: clip` or no overflow at all.
- Mixing motion value `y: "60vh"` (string with unit) with default framer interpolation. Use numeric pixel values or percentage of own height.

---

## Cutover plan

Until the v3 site is approved:

- All v3 work lives under `/preview/v3/` routes.
- All v3 components live in `src/components/sections/v3/` and (forthcoming) `src/components/v3/`.
- v1 styleguide at `docs/ui-styleguide.md` remains canonical for everything at root paths.

On approval:

- Rename `/preview/v3/` routes to root.
- Retire `docs/ui-styleguide.md`. This file becomes the canonical styleguide.
- Move v3 components out of `v3/` subdirectories.
- Remove v1 components.
