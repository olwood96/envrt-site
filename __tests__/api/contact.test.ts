import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email-id" });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSendEmail };
  },
}));

import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown, ip?: string): NextRequest {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (ip) headers["x-forwarded-for"] = ip;
  return new NextRequest("https://envrt.com/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

const validPayload = {
  firstName: "Oliver",
  lastName: "Wood",
  email: "oliver@example.com",
  company: "ENVRT",
  message: "Hello!",
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "test-key";
});

describe("POST /api/contact", () => {
  it("returns 400 for missing required fields", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("https://envrt.com/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("sends confirmation and internal emails on valid submission", async () => {
    const res = await POST(makeRequest(validPayload, "1.2.3.4"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // Confirmation to user
    expect(mockSendEmail.mock.calls[0][0].to).toBe("oliver@example.com");
    // Internal notification
    expect(mockSendEmail.mock.calls[1][0].to).toBe("info@envrt.com");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(
      makeRequest({ ...validPayload, email: "not-an-email" }, "2.2.2.2")
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("email");
  });

  it("silently accepts honeypot submissions without sending email", async () => {
    const res = await POST(
      makeRequest({ ...validPayload, "bot-field": "spam value" }, "3.3.3.3")
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    // Should NOT send any emails
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("sanitizes newlines from email subject (header injection prevention)", async () => {
    const res = await POST(
      makeRequest(
        { ...validPayload, company: "Evil\nBcc: attacker@evil.com" },
        "4.4.4.4"
      )
    );
    expect(res.status).toBe(200);
    // Internal email subject should not contain newlines
    const internalCall = mockSendEmail.mock.calls[1][0];
    expect(internalCall.subject).not.toContain("\n");
    expect(internalCall.subject).toContain("Evil");
  });

  it("escapes HTML in email body (XSS prevention)", async () => {
    const res = await POST(
      makeRequest(
        { ...validPayload, message: '<script>alert("xss")</script>' },
        "5.5.5.5"
      )
    );
    expect(res.status).toBe(200);
    const internalCall = mockSendEmail.mock.calls[1][0];
    expect(internalCall.html).not.toContain("<script>");
    expect(internalCall.html).toContain("&lt;script&gt;");
  });

  it("rate limits after 5 requests from same IP", async () => {
    const ip = `rate-test-${Date.now()}`;
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeRequest(validPayload, ip));
      expect(res.status).toBe(200);
    }
    // 6th request should be rate-limited
    const res = await POST(makeRequest(validPayload, ip));
    expect(res.status).toBe(429);
  });
});
