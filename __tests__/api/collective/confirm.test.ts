import { describe, it, expect, vi, beforeEach } from "vitest";

const mockMaybeSingle = vi.fn();
const mockUpdate = vi.fn();

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          is: () => ({
            maybeSingle: () => mockMaybeSingle(),
          }),
        }),
      }),
      update: (...args: unknown[]) => {
        mockUpdate(...args);
        return {
          eq: () => ({ data: null, error: null }),
        };
      },
    }),
  }),
}));

import { GET } from "@/app/api/collective/confirm/route";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/collective/confirm", () => {
  it("redirects with error for missing token", async () => {
    const req = new NextRequest("https://envrt.com/api/collective/confirm");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribe_error=missing_token");
  });

  it("redirects with error for invalid token", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    const req = new NextRequest("https://envrt.com/api/collective/confirm?token=bad-token");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribe_error=invalid_token");
  });

  it("confirms subscriber and redirects on valid token", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "sub-id", confirmed_at: null },
    });
    const req = new NextRequest("https://envrt.com/api/collective/confirm?token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribed=true");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ confirmed_at: expect.any(String) })
    );
  });

  it("is idempotent for already confirmed subscriber", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { id: "sub-id", confirmed_at: "2024-01-01" },
    });
    const req = new NextRequest("https://envrt.com/api/collective/confirm?token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribed=true");
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
