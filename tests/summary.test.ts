import { describe, expect, it } from "vitest";
import { buildSummary, extractSummaryInput } from "@/lib/summary";

describe("summary builder", () => {
  it("builds deterministic summary", () => {
    const summary = buildSummary({
      decisions: ["Team agreed to add reading support"],
      parentConcerns: ["Homework load"],
      nextSteps: ["Share draft goals by Friday"]
    });

    expect(summary).toContain("Decisions made: Team agreed to add reading support.");
    expect(summary).toContain("Family concerns and questions: Homework load.");
    expect(summary).toContain("Next steps: Share draft goals by Friday.");
  });

  it("extracts inputs from sections", () => {
    const input = extractSummaryInput([
      {
        title: "Decisions made",
        items: [{ text: "Update accommodations", decision: "yes" }]
      },
      {
        title: "Parent concerns and team responses",
        items: [{ text: "Schedule conflicts" }]
      },
      {
        title: "Items deferred and next steps",
        items: [{ text: "Finalize services minutes" }]
      }
    ]);

    expect(input.decisions).toEqual(["Update accommodations"]);
    expect(input.parentConcerns).toEqual(["Schedule conflicts"]);
    expect(input.nextSteps).toEqual(["Finalize services minutes"]);
  });
});
