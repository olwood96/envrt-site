import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email-id" });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSendEmail };
  },
}));

import { POST } from "@/app/api/contact/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("https://envrt.com/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

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
    const res = await POST(
      makeRequest({
        firstName: "Oliver",
        lastName: "Wood",
        email: "oliver@example.com",
        company: "ENVRT",
        message: "Hello!",
      })
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // Confirmation to user
    expect(mockSendEmail.mock.calls[0][0].to).toBe("oliver@example.com");
    // Internal notification
    expect(mockSendEmail.mock.calls[1][0].to).toBe("info@envrt.com");
  });
});
