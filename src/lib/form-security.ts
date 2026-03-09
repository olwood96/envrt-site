// Shared security helpers for form API routes.
// Prevents email header injection, XSS in HTML email bodies,
// and basic rate limiting.

// ── HTML escaping ───────────────────────────────────────────────────────

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/** Escape HTML special characters to prevent XSS in email bodies. */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE_MAP[ch] || ch);
}

// ── Email subject sanitization ──────────────────────────────────────────

/** Strip control characters that could inject email headers. */
export function sanitizeForSubject(str: string): string {
  return str.replace(/[\r\n\t\x00-\x1f]/g, " ").trim();
}

// ── Email validation ────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Basic server-side email format check. */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

// ── Rate limiting ───────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries periodically (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  store.forEach((entry, key) => {
    if (now > entry.resetAt) store.delete(key);
  });
}

/**
 * Simple in-memory rate limiter.
 * Returns true if the request is allowed, false if rate-limited.
 *
 * @param key  - Unique identifier (e.g. IP address or route+IP)
 * @param max  - Max requests per window
 * @param windowMs - Window duration in ms
 */
export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): boolean {
  cleanupStaleEntries();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  return entry.count <= max;
}

/**
 * Extract client IP from request headers (Vercel / Cloudflare / standard).
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
