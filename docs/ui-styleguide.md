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
| `text-4xl sm:text-5xl` | 36/48px | Page titles (h1) |
| `text-3xl sm:text-4xl` | 30/36px | Section headings (h2) |
| `text-2xl sm:text-3xl` | 24/30px | Sub-section headings (h3) |
| `text-xl` | 20px | Card titles (large) |
| `text-lg` | 18px | Card titles (standard), emphasis text |
| `text-base` | 16px | Body paragraphs |
| `text-sm` | 14px | Secondary body, descriptions, card content |
| `text-xs` | 12px | Meta text, captions, labels |
| `text-[11px]` | 11px | Metric badges, data-dense labels |
| `text-[10px]` | 10px | Tags, pills, fine captions (minimum size) |

**Rules:**
- Minimum text size: `text-[10px]` (10px). Never use `text-[9px]` or smaller.
- Exception: phone/device mockup UI (`text-[8px]`) — document as intentional.
- Prefer Tailwind scale (`text-xs`, `text-sm`) over custom pixel values where possible.

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
| `PageTransition` | 0.3s | `easeInOut` |

Use `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations. Use individual `FadeUp` wrappers (not `StaggerChildren`) for dynamically loaded content (e.g. paginated grids).

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

### Section-level

| Pattern | Usage |
|---------|-------|
| `py-16 sm:py-24` | Standard section padding |
| `py-20 sm:py-28` | Emphasized section padding |
| `px-4 sm:px-6` | Responsive horizontal padding |

### Component-level

| Scale | Classes | Usage |
|-------|---------|-------|
| Compact | `p-1.5`, `gap-1.5` | Badge groups, icon containers |
| Standard | `p-3`, `gap-2` | Most component internals |
| Comfortable | `p-6`, `gap-4` | Card content, form groups |
| Spacious | `p-8`+, `gap-6` | Feature sections, large cards |

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
