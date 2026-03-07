import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          single: vi.fn().mockResolvedValue({ data: { value: "false" } }),
        }),
      }),
    }),
  }),
}));

vi.mock("resend", () => ({
  Resend: class {
    batch = { send: vi.fn().mockResolvedValue({}) };
  },
}));

vi.mock("@/lib/collective/email-templates", () => ({
  buildDigestEmail: vi.fn().mockReturnValue("<html>digest</html>"),
}));

import { GET } from "@/app/api/cron/collective-digest/route";
import { NextRequest } from "next/server";

beforeEach(() => {
  vi.clearAllMocks();
  process.env.CRON_SECRET = "test-secret";
  process.env.RESEND_API_KEY = "test-key";
});

describe("GET /api/cron/collective-digest", () => {
  it("returns 401 without valid authorization", async () => {
    const req = new NextRequest("https://envrt.com/api/cron/collective-digest");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const req = new NextRequest("https://envrt.com/api/cron/collective-digest", {
      headers: { authorization: "Bearer wrong-secret" },
    });
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns success when authorized (digest disabled)", async () => {
    const req = new NextRequest("https://envrt.com/api/cron/collective-digest", {
      headers: { authorization: "Bearer test-secret" },
    });
    const res = await GET(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.message).toBe("Digest disabled");
  });
});
