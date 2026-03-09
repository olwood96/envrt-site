import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  escapeHtml,
  sanitizeForSubject,
  isValidEmail,
  rateLimit,
  verifyTurnstile,
} from "@/lib/form-security";

// ── escapeHtml ──────────────────────────────────────────────────────────

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
    );
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("A & B")).toBe("A &amp; B");
  });

  it("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s");
  });

  it("returns plain text unchanged", () => {
    expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

// ── sanitizeForSubject ──────────────────────────────────────────────────

describe("sanitizeForSubject", () => {
  it("strips newlines (email header injection prevention)", () => {
    expect(sanitizeForSubject("Test\nBcc: evil@attacker.com")).toBe(
      "Test Bcc: evil@attacker.com"
    );
  });

  it("strips carriage returns", () => {
    expect(sanitizeForSubject("Test\r\nSubject: Hacked")).toBe(
      "Test  Subject: Hacked"
    );
  });

  it("strips tabs and null bytes", () => {
    expect(sanitizeForSubject("Test\t\x00Subject")).toBe("Test  Subject");
  });

  it("trims whitespace", () => {
    expect(sanitizeForSubject("  Hello  ")).toBe("Hello");
  });

  it("returns normal text unchanged", () => {
    expect(sanitizeForSubject("Jane @ Acme Corp")).toBe("Jane @ Acme Corp");
  });
});

// ── isValidEmail ────────────────────────────────────────────────────────

describe("isValidEmail", () => {
  it("accepts valid emails", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("jane.doe@brand.co.uk")).toBe(true);
    expect(isValidEmail("test+tag@gmail.com")).toBe(true);
  });

  it("rejects emails without @", () => {
    expect(isValidEmail("notanemail")).toBe(false);
  });

  it("rejects emails without domain", () => {
    expect(isValidEmail("user@")).toBe(false);
  });

  it("rejects emails without TLD", () => {
    expect(isValidEmail("user@domain")).toBe(false);
  });

  it("rejects emails with spaces", () => {
    expect(isValidEmail("user @example.com")).toBe(false);
  });

  it("rejects overly long emails (>254 chars)", () => {
    const longEmail = "a".repeat(246) + "@test.com";
    expect(isValidEmail(longEmail)).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

// ── rateLimit ───────────────────────────────────────────────────────────

describe("rateLimit", () => {
  beforeEach(() => {
    // Reset the internal store by using a unique key prefix per test
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
  });

  it("blocks requests exceeding the limit", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("resets after the window expires", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 60_000);
    expect(rateLimit(key, 1, 60_000)).toBe(false);

    // Advance past the window
    vi.advanceTimersByTime(61_000);

    expect(rateLimit(key, 1, 60_000)).toBe(true);
  });

  it("tracks different keys independently", () => {
    const key1 = `test-a-${Math.random()}`;
    const key2 = `test-b-${Math.random()}`;

    rateLimit(key1, 1, 60_000);
    expect(rateLimit(key1, 1, 60_000)).toBe(false);
    // key2 should still be allowed
    expect(rateLimit(key2, 1, 60_000)).toBe(true);
  });
});

// ── verifyTurnstile ──────────────────────────────────────────────────

describe("verifyTurnstile", () => {
  const originalEnv = process.env.TURNSTILE_SECRET_KEY;

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.TURNSTILE_SECRET_KEY;
    } else {
      process.env.TURNSTILE_SECRET_KEY = originalEnv;
    }
    vi.restoreAllMocks();
  });

  it("returns true when TURNSTILE_SECRET_KEY is not set (dev mode)", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    expect(await verifyTurnstile("any-token")).toBe(true);
  });

  it("returns false when token is empty and secret is set", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    expect(await verifyTurnstile("")).toBe(false);
    expect(await verifyTurnstile(undefined)).toBe(false);
  });

  it("returns true when Cloudflare responds with success", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true }))
    );
    expect(await verifyTurnstile("valid-token")).toBe(true);
  });

  it("returns false when Cloudflare responds with failure", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: false }))
    );
    expect(await verifyTurnstile("bad-token")).toBe(false);
  });

  it("fails open when fetch throws (Cloudflare down)", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test-secret";
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network"));
    expect(await verifyTurnstile("some-token")).toBe(true);
  });
});
