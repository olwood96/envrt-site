/* ── Shared constants ─────────────────────────────────────────────────── */

// Interaction thresholds
export const SCROLL_THRESHOLD = 20;
export const RESIZE_DEBOUNCE_MS = 150;

// Impact stats
export const IMPACT_POLL_INTERVAL_MS = 30_000;
export const IMPACT_MAX_CONSECUTIVE_ERRORS = 5;

// Pricing — canonical values live in plans.generated.ts (synced from
// envrt-dashboard/lib/plans/plans.ts); re-exported here so existing
// imports keep working.
export { GBP_TO_EUR, ANNUAL_DISCOUNT } from "./plans.generated";
export const NUDGE_INTERVAL_MS = 3_500;

// Hero section proportions (relative to phone mockup height)
export const HERO_JACKET_HEIGHT_RATIO = 1.183;
export const HERO_QR_HEIGHT_RATIO = 0.3;

// Phone mockup
export const PHONE_VIEWPORT_WIDTH = 375;
export const PHONE_VIEWPORT_HEIGHT = 812;
