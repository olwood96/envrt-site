import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase-admin
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockMaybeSingle = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    from: () => ({
      select: (...args: unknown[]) => {
        mockSelect(...args);
        return {
          eq: () => ({
            is: () => ({
              maybeSingle: () => mockMaybeSingle(),
            }),
          }),
        };
      },
      insert: (...args: unknown[]) => {
        mockInsert(...args);
        return {
          select: () => ({
            single: () => mockSingle(),
          }),
        };
      },
    }),
  }),
}));

// Mock Resend
const mockSendEmail = vi.fn().mockResolvedValue({ id: "email-id" });
vi.mock("resend", () => {
  return {
    Resend: class {
      emails = { send: mockSendEmail };
    },
  };
});

// Mock email templates
vi.mock("@/lib/collective/email-templates", () => ({
  buildConfirmationEmail: vi.fn().mockReturnValue("<html>confirm</html>"),
}));

// Mock form-security
const mockVerifyTurnstile = vi.fn().mockResolvedValue(true);
const mockRateLimit = vi.fn().mockReturnValue(true);
vi.mock("@/lib/form-security", () => ({
  verifyTurnstile: (...args: unknown[]) => mockVerifyTurnstile(...args),
  rateLimit: (...args: unknown[]) => mockRateLimit(...args),
  getClientIp: () => "127.0.0.1",
}));

import { POST } from "@/app/api/collective/subscribe/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("https://envrt.com/api/collective/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
  mockVerifyTurnstile.mockResolvedValue(true);
  mockRateLimit.mockReturnValue(true);
});

describe("POST /api/collective/subscribe", () => {
  it("returns 400 for missing email", async () => {
    const res = await POST(makeRequest({ turnstileToken: "token" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Valid email required");
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ email: "not-an-email", turnstileToken: "token" }));
    expect(res.status).toBe(400);
  });

  it("returns success for new subscriber", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    mockSingle.mockResolvedValue({ data: { token: "new-token-123" }, error: null });

    const res = await POST(makeRequest({ email: "test@example.com", turnstileToken: "valid-token" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toContain("Check your email");
    expect(mockInsert).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it("returns success for already confirmed email (no enumeration leak)", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "existing-id", confirmed_at: "2024-01-01" },
    });

    const res = await POST(makeRequest({ email: "existing@example.com", turnstileToken: "token" }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    // Should NOT send another email or insert
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid JSON body", async () => {
    const req = new NextRequest("https://envrt.com/api/collective/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when Turnstile verification fails", async () => {
    mockVerifyTurnstile.mockResolvedValue(false);

    const res = await POST(makeRequest({ email: "test@example.com", turnstileToken: "bad-token" }));
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Verification failed");
    expect(mockInsert).not.toHaveBeenCalled();
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("returns 429 when rate limited", async () => {
    mockRateLimit.mockReturnValue(false);

    const res = await POST(makeRequest({ email: "test@example.com", turnstileToken: "token" }));
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toContain("Too many attempts");
    expect(mockInsert).not.toHaveBeenCalled();
  });

  it("passes turnstile token to verifyTurnstile", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    mockSingle.mockResolvedValue({ data: { token: "new-token" }, error: null });

    await POST(makeRequest({ email: "test@example.com", turnstileToken: "my-token" }));
    expect(mockVerifyTurnstile).toHaveBeenCalledWith("my-token");
  });
});
