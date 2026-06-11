import { describe, it, expect } from "vitest";
import {
  INSIGHT_TOPICS,
  getTopicBySlug,
  getTopicsForTag,
  postMatchesTopic,
  countPostsByTopic,
} from "@/lib/insightTopics";

describe("INSIGHT_TOPICS config", () => {
  it("has six curated topics in the expected order", () => {
    expect(INSIGHT_TOPICS.map((t) => t.slug)).toEqual([
      "dpp",
      "lca-and-data",
      "regulation",
      "supply-chain",
      "green-claims",
      "business-and-pricing",
    ]);
  });

  it("every topic has a non-empty tag list and human-readable label", () => {
    for (const topic of INSIGHT_TOPICS) {
      expect(topic.tags.length).toBeGreaterThan(0);
      expect(topic.label.length).toBeGreaterThan(2);
      expect(topic.description.length).toBeGreaterThan(10);
    }
  });
});

describe("getTopicBySlug", () => {
  it("finds a topic by slug", () => {
    expect(getTopicBySlug("dpp")?.label).toMatch(/Digital Product Passports/);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getTopicBySlug("nope")).toBeUndefined();
  });
});

describe("getTopicsForTag", () => {
  it("maps a raw tag to its topic, case-insensitive", () => {
    expect(getTopicsForTag("DPP").map((t) => t.slug)).toContain("dpp");
    expect(getTopicsForTag("dpp").map((t) => t.slug)).toContain("dpp");
  });

  it("returns an empty array for a tag with no topic", () => {
    expect(getTopicsForTag("Guide")).toEqual([]);
  });

  it("maps multi-topic tags into every matching topic", () => {
    // Water belongs to LCA and impact data
    expect(getTopicsForTag("Water").map((t) => t.slug)).toEqual(["lca-and-data"]);
  });
});

describe("postMatchesTopic", () => {
  it("matches when any of the post tags belongs to the topic", () => {
    expect(postMatchesTopic(["DPP", "Regulation"], "dpp")).toBe(true);
    expect(postMatchesTopic(["DPP", "Regulation"], "regulation")).toBe(true);
  });

  it("does not match when no post tag belongs to the topic", () => {
    expect(postMatchesTopic(["LCA", "Data"], "green-claims")).toBe(false);
  });

  it("is case-insensitive on both sides", () => {
    expect(postMatchesTopic(["green claims"], "green-claims")).toBe(true);
  });
});

describe("countPostsByTopic", () => {
  it("counts posts whose tags overlap the topic", () => {
    const posts = [
      { tags: ["DPP", "ESPR"] },
      { tags: ["LCA", "Water"] },
      { tags: ["Regulation"] },
      { tags: [] },
    ];
    expect(countPostsByTopic(posts, "dpp")).toBe(1);
    expect(countPostsByTopic(posts, "lca-and-data")).toBe(1);
    expect(countPostsByTopic(posts, "regulation")).toBe(1);
    expect(countPostsByTopic(posts, "green-claims")).toBe(0);
  });
});
