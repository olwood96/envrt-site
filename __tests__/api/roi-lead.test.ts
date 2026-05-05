import { describe, it, expect, vi, beforeEach } from "vitest";

const mockSendEmail = vi.fn().mockResolvedValue({ id: "email-id" });
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mockSendEmail };
  },
}));

const mockInsert = vi.fn().mockResolvedValue({ error: null });
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}));

import { POST } from "@/app/api/roi-lead/route";
import { NextRequest } from "next/server";

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("https://envrt.com/api/roi-lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  firstName: "Test",
  brandName: "TestBrand",
  email: "test@example.com",
  marketingConsent: true,
  skuCount: 50,
  dataMaturity: "medium",
  hoursPerProduct: 4,
  market: "EU only",
  approach: "manual",
  envrtCost: 5000,
  envrtPlan: "Growth",
  envrtPlanPrice: "£416/mo",
  consultantCost: 25000,
  inhouseCost: 40000,
  maxSaving: 35000,
  savingVsConsultant: 20000,
  savingVsInhouse: 35000,
  hoursSaved: 200,
  daysSaved: 25,
};

beforeEach(() => {
  vi.clearAllMocks();
  mockInsert.mockResolvedValue({ error: null });
  process.env.RESEND_API_KEY = "test-key";
});

describe("POST /api/roi-lead", () => {
  it("returns 400 for missing required fields", async () => {
    const res = await POST(makeRequest({ email: "test@example.com" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new NextRequest("https://envrt.com/api/roi-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("sends two emails and returns success", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
    // First call: user email
    expect(mockSendEmail.mock.calls[0][0].to).toBe("test@example.com");
    // Second call: internal notification
    expect(mockSendEmail.mock.calls[1][0].to).toBe("info@envrt.com");
  });

  it("persists lead to Supabase before sending emails", async () => {
    await POST(makeRequest(validPayload));
    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
        first_name: "Test",
        brand_name: "TestBrand",
        sku_count: 50,
      })
    );
  });

  it("still sends emails if Supabase insert fails", async () => {
    mockInsert.mockRejectedValueOnce(new Error("db down"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });
});
