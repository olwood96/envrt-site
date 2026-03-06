import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase module
const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockIs = vi.fn();
const mockOrder = vi.fn();
const mockIn = vi.fn();
const mockLimit = vi.fn();
const mockMaybeSingle = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: (...args: unknown[]) => {
      mockFrom(...args);
      return {
        select: (...sArgs: unknown[]) => {
          mockSelect(...sArgs);
          return {
            eq: (...eArgs: unknown[]) => {
              mockEq(...eArgs);
              return {
                is: (...iArgs: unknown[]) => {
                  mockIs(...iArgs);
                  return {
                    order: (...oArgs: unknown[]) => {
                      mockOrder(...oArgs);
                      return { data: [], error: null };
                    },
                  };
                },
                eq: (...eArgs2: unknown[]) => {
                  mockEq(...eArgs2);
                  return {
                    eq: (...eArgs3: unknown[]) => {
                      mockEq(...eArgs3);
                      return {
                        is: (...iArgs: unknown[]) => {
                          mockIs(...iArgs);
                          return {
                            order: (...oArgs: unknown[]) => {
                              mockOrder(...oArgs);
                              return {
                                limit: (...lArgs: unknown[]) => {
                                  mockLimit(...lArgs);
                                  return {
                                    maybeSingle: () => {
                                      mockMaybeSingle();
                                      return { data: null, error: null };
                                    },
                                  };
                                },
                              };
                            },
                          };
                        },
                      };
                    },
                  };
                },
                is: (...iArgs: unknown[]) => {
                  mockIs(...iArgs);
                  return {
                    order: (...oArgs: unknown[]) => {
                      mockOrder(...oArgs);
                      return { data: [], error: null };
                    },
                  };
                },
              };
            },
            in: (...inArgs: unknown[]) => {
              mockIn(...inArgs);
              return { data: [], error: null };
            },
          };
        },
      };
    },
  },
}));

describe("collective/fetch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set required env var
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  });

  it("getFeaturedDpps returns empty data when no featured DPPs exist", async () => {
    const { getFeaturedDpps } = await import("@/lib/collective/fetch");
    const result = await getFeaturedDpps();

    expect(result.cards).toEqual([]);
    expect(result.filters.brands).toEqual([]);
    expect(result.filters.collections).toEqual([]);
    expect(result.filters.materialTypes).toEqual([]);
  });

  it("getFeaturedDpp returns null when brand not found", async () => {
    const { getFeaturedDpp } = await import("@/lib/collective/fetch");
    const result = await getFeaturedDpp("non-existent-brand", "sku-123");

    expect(result).toBeNull();
  });

  it("queries dpp_generated with featured_on_site=true", async () => {
    const { getFeaturedDpps } = await import("@/lib/collective/fetch");
    await getFeaturedDpps();

    expect(mockFrom).toHaveBeenCalledWith("dpp_generated");
    expect(mockEq).toHaveBeenCalledWith("featured_on_site", true);
    expect(mockIs).toHaveBeenCalledWith("deleted_at", null);
  });
});
