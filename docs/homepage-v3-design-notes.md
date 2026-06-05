# Homepage v3 — design notes

> Rulebook for the v3 preview at `/preview/home-v3`. Scoped to v3 only — does
> not change `docs/ui-styleguide.md` or any tokens used by the rest of the
> site. v3 is a testing surface; once a pattern proves out it gets promoted
> to the main styleguide via a separate change.

---

## Brand application

v3 implements the **2022 ENVRT brand identity** (palette + typography). All
brand tokens carry the `brand-` prefix and live alongside the legacy v3
tokens — they're additive only, scoped to v3 via the page wrapper.

### Palette

Primary pairing throughout the page: **Vista White + Ultramarine + Black**.

| Brand colour | Token | Hex | Role on v3 |
|---|---|---|---|
| Vista White | `envrt-brand-vista` | `#FCF9F0` | Page background, default scene |
| Ultramarine | `envrt-brand-ultramarine` | `#3E00FF` | Primary accent — eyebrows, links, halos, active states, sticky CTA button |
| Black | `envrt-brand-black` | `#1A1A1A` | Type, dark Numbers section, sticky CTA bar |
| Vibrant Green | `envrt-brand-vibrant` | `#20E036` | "Live" / verified indicators only |
| Aqua Blue | `envrt-brand-aqua` | `#00DAFF` | Reserved — not yet on page |
| Golden / Lilac / Sunny / Crimson | `envrt-brand-*` | per book | Reserved for specific moments, not free-pour |

Other accent hues are **available** but not deployed by default. If a section
needs a sharp single-use accent (a stat, a callout), pick from the pairings
list in the 2022 book — Black + Lilac, Golden + Black, etc. — rather than
inventing.

### Typography

Two brand families loaded via `next/font/google` on the v3 page wrapper:

| Family | Tailwind | Used for |
|---|---|---|
| **Big Shoulders Text** | `font-display` | All h1, h2, h3, big numerals, stat values |
| **Karla** | `font-body` | Body, eyebrows, mono-cap labels, buttons |
| N27 | `font-n27` | Brand wordmark only (navbar) |

Weight rules:
- Display headings: `font-semibold` (600) default; `font-bold` (700) for the hero h1
- Body: `font-normal` (400)
- Eyebrows: `font-medium` (500)

Big Shoulders Text is a condensed industrial sans — the brand uses it as the
"fearless / disruptive / contemporary" voice. Headlines will read taller and
narrower than Manrope ever did.

---

## Normalised patterns

Every v3 section uses these atoms.

### Eyebrow

```
className="text-[10px] font-semibold uppercase tracking-[0.22em] text-envrt-brand-ultramarine sm:text-[11px]"
```

### H2 section

```
className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-envrt-brand-black sm:text-4xl lg:text-[3rem]"
```

### Body

```
className="text-base leading-relaxed text-envrt-brand-black/70 sm:text-lg"
```

### Mono caption / index

```
className="font-mono text-[10px] uppercase tracking-[0.18em] text-envrt-brand-black/45"
```

### Card hover

```
className="border border-envrt-brand-black/8 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:border-envrt-brand-ultramarine/30"
```

### Section ground rhythm

Pages alternate light grounds to give scroll a heartbeat. Single dark moment
is reserved for **NumbersSection**.

```
Hero (vista) → Manifesto (white) → Countdown (stone) →
  SceneMark 02 (vista) → ScrollTour (vista) → InTheWild (white) →
  SceneMark 03 (vista) → Capabilities (vista) →
  SceneMark 04 (dark) → Numbers (BLACK) → HowItWorks (vista) →
  SceneMark 05 (vista) → Aligned → Insights (vista) → FAQ →
  FinalCTA (stone)
```

---

## Sections in v3

| File | Role | Notes |
|---|---|---|
| `HeroV3` | Headline + product + 6 annotations | Hoodie centred. Tag is a side detail. Annotations are plain mono caps on aqua-line connectors — no card backgrounds. Mobile: chip strip below the photo. |
| `ManifestoSection` | Why ENVRT + live ticker | Parallax photo at 12% opacity. Live platform stats from `fetchPlatformStats()`. |
| `EsprCountdownSection` | Live countdown to 2027-01-01 | Stone-ground card. Days remaining as a Big Shoulders numeral. |
| `ScrollTourSection` | 5-stop pinned tour with live iframe | Iframe rendered at 414px and scaled per phone width. `overflow-x: clip` contains the right-edge peek-off. |
| `InTheWildSection` | Angry Pablo spotlight | Real product card + real Eco-Score label. Replaces the previous bento. |
| `CapabilitiesSection` | 9-row spec-table | Theme clusters: Calculate / Comply / Communicate. Hover ledger animations. |
| `NumbersSection` | Single dark moment | brand-black ground. Count-up using framer-motion `animate` + flip-up entrance. |
| `HowItWorksV3` | Three step rows | Thumbnails on the right. Step number lights ultramarine on hover. |
| `AlignedWithCarousel` | Reused from v2 | Type pass deferred until v3 promotion. |
| `InsightsTeaseSection` | 3 most-recent posts | Filters drafts and invalid dates. |
| `FAQSection` | Reused from v2 | Type pass deferred. |
| `FinalCtaV3` | Stone-ground close | Parallax bg. Ultramarine halo. |
| `StickyCta` | Sticky bar after 60% scroll | Black bar, ultramarine "Start" pill. |
| `ScrollProgressBar` | 2px ultramarine line top | Spring-smoothed. |
| `SceneMark` | Editorial scene breaks | `▽ ENVRT · NN · LABEL`. Light + dark variants. |
| `EcoScoreLabel` | Reusable Coût Environnemental label | Inline SVG/HTML. ENVRT verification accent optional. |
| `SmoothScroll` | Lenis with `lerp: 0.1` | Same setting fairlymade.com uses. Skipped under `prefers-reduced-motion`. |

---

## Open questions

1. Big Shoulders Text is condensed — does it carry our "audit-grade" credibility, or does Karla need to do more body-weight work to balance?
2. Should the Numbers dark moment swap to Black + Bright Lilac (a brand pairing) instead of Black + Ultramarine? Lilac is a softer counterpoint.
3. AlignedWithCarousel and FAQSection still wear v2 typography. Do they get a Big Shoulders pass before v3 → `/` promotion?
4. Standard Button component is `envrt-green` — should v3 have its own ultramarine button variant or keep using the green primary?
