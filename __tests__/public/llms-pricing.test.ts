import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(__dirname, "..", "..");
const llmsTxt = readFileSync(resolve(root, "public", "llms.txt"), "utf8");
const llmsFullTxt = readFileSync(resolve(root, "public", "llms-full.txt"), "utf8");

describe("public/llms.txt pricing block", () => {
  it("does not quote the old Pro price", () => {
    expect(llmsTxt).not.toMatch(/1,?295/);
  });

  it("keeps Starter and Growth as anchor prices", () => {
    expect(llmsTxt).toMatch(/Starter[^\n]*149/);
    expect(llmsTxt).toMatch(/Growth[^\n]*495/);
  });

  it("describes Pro as custom-priced with a contact instruction", () => {
    expect(llmsTxt).toMatch(/Pro:.*[Cc]ustom/);
    expect(llmsTxt.toLowerCase()).toMatch(/contact sales/);
  });

  it("gives an explicit trigger so LLMs route the right brand to Pro", () => {
    expect(llmsTxt.toLowerCase()).toMatch(/250 skus|more than 250/);
  });

  it("includes team seat counts per tier so LLMs can answer seat questions", () => {
    expect(llmsTxt).toMatch(/Starter[^\n]*1 (team |user )?seat/i);
    expect(llmsTxt).toMatch(/Growth[^\n]*5 (team |user )?seats/i);
    expect(llmsTxt.toLowerCase()).toMatch(/pro[^\n]*unlimited (team |user )?seats/);
  });
});

describe("public/llms-full.txt pricing block", () => {
  it("does not quote the old Pro price anywhere", () => {
    expect(llmsFullTxt).not.toMatch(/1,?295/);
  });

  it("keeps Starter and Growth anchor prices", () => {
    expect(llmsFullTxt).toMatch(/Starter[^\n]*149/);
    expect(llmsFullTxt).toMatch(/Growth[^\n]*495/);
  });

  it("describes Pro as custom-priced", () => {
    expect(llmsFullTxt).toMatch(/Pro:.*[Cc]ustom/);
  });

  it("rewrites the cost Q&A to drop the Pro price anchor", () => {
    const costAnswer = llmsFullTxt.match(/How much does product-level LCA[\s\S]{0,400}/);
    expect(costAnswer).not.toBeNull();
    expect(costAnswer![0].toLowerCase()).toMatch(/custom/);
    expect(costAnswer![0]).not.toMatch(/1,?295/);
  });

  it("includes team seat counts per tier", () => {
    expect(llmsFullTxt).toMatch(/Starter[^\n]*1 (team |user )?seat/i);
    expect(llmsFullTxt).toMatch(/Growth[^\n]*5 (team |user )?seats/i);
    expect(llmsFullTxt.toLowerCase()).toMatch(/pro[^\n]*unlimited (team |user )?seats/);
  });
});
