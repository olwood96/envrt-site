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

import { GET } from "@/app/api/collective/unsubscribe/route";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/collective/unsubscribe", () => {
  it("redirects with error for missing token", async () => {
    const req = new NextRequest("https://envrt.com/api/collective/unsubscribe");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribe_error=missing_token");
  });

  it("redirects with error for invalid token", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null });
    const req = new NextRequest("https://envrt.com/api/collective/unsubscribe?token=bad-token");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("subscribe_error=invalid_token");
  });

  it("unsubscribes and redirects on valid token", async () => {
    mockMaybeSingle.mockResolvedValue({ data: { id: "sub-id" } });
    const req = new NextRequest("https://envrt.com/api/collective/unsubscribe?token=valid-token");
    const res = await GET(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toContain("unsubscribed=true");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ unsubscribed_at: expect.any(String) })
    );
  });
});
