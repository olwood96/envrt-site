# ENVRT Site — UI Styleguide

Reference for consistent styling across the envrt-site codebase.

---

## Color Tokens

All colors use CSS custom properties defined in `tailwind.config.ts`. Never use hardcoded hex values in Tailwind classes.

| Token | Value | Usage |
|-------|-------|-------|
| `envrt-green` | #1a3a2a | Primary CTA, CO2 metrics |
| `envrt-green-light` | #2d5a3f | Primary hover |
| `envrt-teal` | #2aa198 | Accent, links, highlights, transparency score |
| `envrt-teal-light` | #5bbdb6 | Accent hover |
| `envrt-charcoal` | #1e1e1e | Body text, headings |
| `envrt-offwhite` | #f8f7f4 | Page background |
| `envrt-cream` | #f0eeea | Skeleton loaders, subtle fills |
| `envrt-muted` | #9ca3a0 | Secondary text, labels, captions |

**Tailwind blue** (`blue-50`, `blue-600`, `blue-700`) is used for water metrics only.
**Tailwind red** (`red-50`, `red-500`) is used for error states only.

### Opacity Scale

| Opacity | Purpose |
|---------|---------|
| `/5` | Very subtle backgrounds, section accents |
| `/8` | Light borders, toggle backgrounds |
| `/10` | Icon backgrounds, button hover tints |
| `/20` | Card hover borders, accent borders |
| `/60` | Muted units, lighter secondary text |
| `/70` | Medium secondary text (minimum for body text on light backgrounds) |
| `/90` | Dark backgrounds, near-solid overlays |

**Rule:** Never use `/50` or lower on text that conveys meaning. Reserve `/50` and below for decorative elements, disabled states, and glassmorphic backgrounds only.

---

## Typography

### Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-4xl sm:text-5xl lg:text-[3.5rem]` | 36/48/56px | Page titles (h1) |
| `text-3xl sm:text-4xl` | 30/36px | Section headings (h2) |
| `text-2xl sm:text-3xl` | 24/30px | Sub-section headings (h3) |
| `text-xl` | 20px | Card titles (large) |
| `text-lg` | 18px | Card titles (standard), emphasis text |
| `text-base` | 16px | Body paragraphs |
| `text-sm` | 14px | Secondary body, descriptions, card content |
| `text-xs` | 12px | Meta text, captions, labels (minimum size for content text) |

**Rules:**
- **Minimum body/label text size: `text-xs` (12px)**. Never use arbitrary px values like `text-[11px]` or smaller. The single exception is hardware/device mockup UI (`text-[8px]`) which must be documented as intentional.
- Always use Tailwind scale (`text-xs`, `text-sm`, etc.) instead of arbitrary `text-[Npx]` values.
- For tight visual rhythm, prefer 1-step gaps in the scale (e.g. `text-base sm:text-lg`).

### Line height

Set globally in `globals.css`:

| Element | Line-height |
|---------|-------------|
| `body` | `1.6` (relaxed for readability) |
| `h1, h2, h3, h4, h5, h6` | `1.3` (tighter for display) |

Override per-element only when the design genuinely needs it (e.g. very large hero text may need `leading-[1.15]`). Use Tailwind's `leading-relaxed` (1.625) or `leading-tight` (1.25) for utility-side overrides.

### Font Weights

| Weight | Usage |
|--------|-------|
| `font-bold` | Page headings (h1, h2) |
| `font-semibold` | Card titles, section sub-heads |
| `font-medium` | Labels, meta text, buttons |
| `font-extrabold` | Price callouts |

### Tracking

| Class | Usage |
|-------|-------|
| `tracking-widest` | Small-caps brand/collection names |
| `tracking-wide` or `tracking-[0.15em]` | Uppercase section labels |
| `tracking-tight` | Large headings for tighter feel |

---

## Border Radius

| Class | Usage |
|-------|-------|
| `rounded-full` | Badges, pills, toggles, dot indicators |
| `rounded-xl` | Input fields, icon boxes, tabs, small containers, dropdowns |
| `rounded-2xl` | Cards, modals, large containers |
| `rounded-scene` (1.5rem) | Scene/section backgrounds (CSS class) |

Exception: Hardware mockups (phone, video player) use custom px values (`rounded-[2.5rem]`, `rounded-[2.8rem]`) for authenticity.

---

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Badges, form elements, subtle emphasis |
| `shadow-md` | Button hover states |
| `shadow-lg` | Card hover emphasis (standard) |
| `shadow-xl` | Strong emphasis, highlighted pricing cards |
| `shadow-2xl` | Feature hero elements |

Colored shadows (e.g. `shadow-envrt-teal/5`) are reserved for high-priority feature cards (pricing highlight, collective cards).

---

## Cards

All card-like containers follow this base pattern:

```
rounded-2xl border border-envrt-charcoal/5 bg-white
```

### Hover states

```
hover:-translate-y-1 hover:border-envrt-teal/20 hover:shadow-lg
```

For highlighted/featured cards, use `shadow-xl shadow-envrt-teal/5`.

### Padding

| Card type | Padding |
|-----------|---------|
| Product grid | `px-5 pb-5 pt-3` (compact, data-dense) |
| Content/article | `p-6 sm:p-8` (comfortable reading) |
| Feature/outcome | `p-8 sm:p-10` (spacious) |
| Pricing plan | `p-8` |

---

## Buttons

Use the `Button` component (`src/components/ui/Button.tsx`). Do not create ad-hoc button styles.

### Variants

| Variant | Appearance |
|---------|------------|
| `primary` | `bg-envrt-green text-white` + shadow |
| `secondary` | Transparent, `border-envrt-charcoal/20` |
| `ghost` | Transparent, no border, text only |

### Sizes

| Size | Classes |
|------|---------|
| `sm` | `px-4 py-2 text-sm` |
| `md` | `px-6 py-3 text-base` |
| `lg` | `px-8 py-4 text-lg` |

All buttons use `rounded-xl` and `transition-all duration-300`.

---

## Filter Dropdowns

Use the `FilterDropdown` component (`src/components/collective/FilterDropdown.tsx`) for filter bars. Never use native `<select>` elements in filter/analytics contexts.

**Pattern:**
- Trigger: `h-9 rounded-xl border min-w-[140px]`
- Open state: `ring-2 ring-envrt-charcoal/8`
- Menu: `rounded-xl shadow-lg max-h-56 overflow-y-auto`
- Selected item: Check icon + `font-medium` + light background
- Non-selected indent: `pl-[22px]` to align with check icon
- Chevron rotates 180deg when open

---

## Animations & Transitions

### Interaction transitions

| Context | Duration | Property |
|---------|----------|----------|
| Color changes (hover, focus) | `duration-300` | `transition-colors` |
| Transforms (scale, translate) | `duration-300` | `transition-transform` |
| Multi-property (shadow + border + position) | `duration-300` | `transition-all` |

### Entrance animations (Framer Motion)

| Component | Duration | Easing |
|-----------|----------|--------|
| `FadeUp` | 0.5s | `[0.25, 0.1, 0.25, 1]` |
| `FadeIn` | 0.5s | `easeOut` |
| `StaggerChildren` | 0.08s stagger | Parent controls children |

Use `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations. Use individual `FadeUp` wrappers (not `StaggerChildren`) for dynamically loaded content (e.g. paginated grids).

**No root-level page transitions.** `AnimatePresence` in the Next.js App Router root layout causes hydration flashes and breaks hash navigation. Per-section `FadeUp` animations provide visual polish instead.

### Keyframe animations (globals.css)

| Animation | Duration | Usage |
|-----------|----------|-------|
| `glass-shimmer` | 6s infinite | Navbar prismatic effect |
| `trusted-scroll` | 35s linear infinite | Logo carousel |
| `nudge` | 0.6s ease-in-out | Pricing card attention |
| `qr-scan` / `qr-pulse` | 2s | Hero QR demo |

All custom keyframe animations are disabled under `prefers-reduced-motion: reduce`.

---

## Spacing

### Section-level vertical padding

Sections fall into one of three tiers based on visual weight and purpose. Match the tier to keep rhythm across the page.

| Tier | Pattern | Use case | Examples |
|------|---------|----------|----------|
| Compact | `py-12 sm:py-16` | Trust bands, logo carousels, data tickers, overline-led sections | `TrustedBy`, `ImpactStatsSection`, `AlignedWithCarousel` |
| Standard | `py-16 sm:py-24` | Content sections with cards, copy, accordions | `WhyNow`, `Outcomes`, `Comparison`, `FAQ`, `PricingPreview` |
| Emphasized | `py-16 sm:py-20 lg:py-28` | High-priority sections (final CTA, conclusion blocks) | `FinalCTA` |

`HeroSection` uses a one-off pattern (`pt-28 pb-16 sm:pt-32`) due to navbar offset. Do not copy that elsewhere.

### Section-level horizontal padding

Wrap section content in the `<Container>` component (`src/components/ui/Container.tsx`). It already applies `mx-auto w-full max-w-[1280px] px-5 sm:px-8`. Do not re-implement responsive horizontal padding at the section level.

### Component-level

| Scale | Classes | Usage |
|-------|---------|-------|
| Compact | `p-1.5`, `gap-1.5` | Badge groups, icon containers |
| Standard | `p-3`, `gap-2` | Most component internals |
| Comfortable | `p-6`, `gap-4` | Card content, form groups |
| Spacious | `p-8`+, `gap-6` | Feature sections, large cards |

---

## Responsive Patterns

### Paragraph text per tier

Paragraphs scale up once at the `sm:` breakpoint (640px). Match the section tier.

| Tier | Mobile | Desktop |
|------|--------|---------|
| Compact | `text-sm` | `sm:text-base` |
| Standard | `text-base` | `sm:text-lg` |
| Emphasized | `text-base` | `sm:text-lg` |

Avoid three-breakpoint scales (`text-sm sm:text-base md:text-lg`) unless the layout genuinely warrants it.

### Section headings per tier

| Tier | Pattern |
|------|---------|
| Compact | Small caps overline `text-[11px] font-medium uppercase tracking-[0.2em] text-envrt-muted/70`, rendered as `<h2>` for semantic hierarchy |
| Standard | `text-3xl sm:text-4xl font-bold tracking-tight text-envrt-charcoal` |
| Emphasized | `text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight` |

Always preserve the heading hierarchy: a compact section's small caps label is still an `<h2>`, not a `<p>`.

### Grid breakpoint patterns

Mobile-first cascade. Primary breakpoints are `sm:` (640px), `md:` (768px), `lg:` (1024px).

| Layout | Pattern |
|--------|---------|
| 4-up content cards | `grid gap-5 sm:grid-cols-2 lg:grid-cols-4` |
| 3-up metric grid | `grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8` |
| 6-up trust band (2/3/6 cascade) | `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-8 md:gap-x-10 md:gap-y-12 lg:gap-x-6` |
| 2-col side-by-side | `grid gap-12 lg:gap-16` |

### Animation wrapper

Wrap section content in `<FadeUp>` from `src/components/ui/Motion.tsx` for scroll-triggered entrance. For multi-item grids that should cascade, use `<StaggerChildren>` with `<StaggerItem>` children. Never use raw `motion.div` directly — always go through the `Motion` exports.

### Image / cell heights in trust bands

| Pattern | Use case |
|---------|----------|
| `h-10 w-28 sm:h-12 sm:w-32` | TrustedBy logo container (fixed-width logo strip) |
| `h-12 sm:h-16` | AlignedWithCarousel logo/text-box cell (responsive content width) |

---

## Images

Always use `next/image`. Never use raw `<img>` tags.

### Required attributes

| Attribute | Rule |
|-----------|------|
| `src` | Path under `/public` or absolute URL |
| `alt` | Descriptive, never empty unless image is purely decorative |
| `width` and `height` | Set explicitly to prevent layout shift |
| `sizes` | **Required** for responsive grids and content images. Must match the rendered display size at each breakpoint |
| `priority` | Set only for above-the-fold images |

### Sizes patterns

| Layout | Pattern |
|--------|---------|
| 6-up trust band (2/3/6 cascade) | `sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"` |
| 3-up content cards | `sizes="(min-width: 768px) 33vw, 100vw"` |
| Full-width hero image | `sizes="100vw"` |
| Above-the-fold square avatar | `sizes="120px"` (fixed size) |

Skipping `sizes` causes Next.js to download a 3840px-wide image regardless of display size. Affects LCP and mobile data use.

### Alt text

- **Decorative images**: `alt=""` is acceptable
- **Content images**: include the methodology or context (e.g. "EU emblem indicating alignment with EU PEF methodology")
- **Logo images in trust bands**: name the organisation and what it represents

---

## Skeleton Loaders

Use `animate-pulse` on `bg-envrt-cream` blocks. Follow the existing pattern from `src/app/insights/[slug]/loading.tsx`:

```tsx
<div className="animate-pulse">
  <div className="h-10 w-3/4 rounded-lg bg-envrt-cream" />
  <div className="mt-4 h-5 w-1/2 rounded bg-envrt-cream" />
</div>
```

- Use `rounded-lg` for text-like blocks, `rounded-xl`/`rounded-2xl` for card shapes, `rounded-full` for pills
- Match the layout structure of the real content
- Place in `loading.tsx` files alongside the corresponding page

---

## Scroll Hints

For horizontally scrollable content (comparison tables), use the `ScrollHint` component (`src/components/ui/ScrollHint.tsx`):

```tsx
<ScrollHint>
  <table className="min-w-[600px]">...</table>
</ScrollHint>
```

Shows gradient fade overlays on left/right edges to indicate off-screen content. Automatically hides gradients when scrolled to the start/end.

---

## Focus & Accessibility

Global `:focus-visible` rule (globals.css):
```css
:focus-visible {
  outline: 2px solid var(--envrt-teal);
  outline-offset: 2px;
  border-radius: 4px;
}
```

All interactive elements inherit this automatically. Do not override unless there's a specific visual reason (e.g. buttons with their own ring styles).

---

## Exceptions

These patterns intentionally deviate from the standard and should not be "fixed":

- **Hardware mockups** (phone shell in HeroSection, VideoFrame): Custom border-radius, text-[8px], hardcoded system UI colors
- **SVG illustrations** (SupplyChainFlowSection, HowItWorksSection): Hardcoded hex colors in SVG/Canvas — CSS variables don't apply inside these contexts
- **Glassmorphic effects** (Navbar): Complex custom box-shadows and backdrop-blur defined in globals.css
