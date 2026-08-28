import { describe, expect, it } from "vitest";
import { filterNotebooks, getNotebookStats, notebooks } from "./notebooks";

describe("notebooks catalogue", () => {
  it("exposes only the two notebooks provided by the user", () => {
    expect(notebooks).toHaveLength(2);

    const stats = getNotebookStats(notebooks);
    expect(stats.total).toBe(2);
    expect(stats.featured).toBe(1);
  });

  it("filters accent-insensitively", () => {
    const results = filterNotebooks(notebooks, "notebook");
    expect(results).toHaveLength(2);
  });

  it("filters by search text", () => {
    const results = filterNotebooks(notebooks, "1085ecc7");
    expect(results).toHaveLength(1);
    expect(results[0].notebookUrl).toContain("1085ecc7-e2da-4388-b798-2725936d717f");
  });
});
