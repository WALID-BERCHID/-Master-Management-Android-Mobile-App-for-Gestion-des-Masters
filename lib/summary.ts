export type MinutesItem = {
  text: string;
  decision?: "yes" | "no" | "deferred";
};

export type MinutesSection = {
  title: string;
  items: MinutesItem[];
};

export type SummaryInput = {
  decisions: string[];
  parentConcerns: string[];
  nextSteps: string[];
};

export function buildSummary(input: SummaryInput) {
  const decisions = input.decisions.length
    ? `Decisions made: ${input.decisions.join("; ")}.`
    : "Decisions made: No new decisions were recorded.";
  const concerns = input.parentConcerns.length
    ? `Family concerns and questions: ${input.parentConcerns.join("; ")}.`
    : "Family concerns and questions: None were recorded.";
  const nextSteps = input.nextSteps.length
    ? `Next steps: ${input.nextSteps.join("; ")}.`
    : "Next steps: No follow up steps were recorded.";

  return `${decisions} ${concerns} ${nextSteps}`.trim();
}

export function extractSummaryInput(sections: MinutesSection[]): SummaryInput {
  const decisions: string[] = [];
  const parentConcerns: string[] = [];
  const nextSteps: string[] = [];

  sections.forEach((section) => {
    const title = section.title.toLowerCase();
    section.items.forEach((item) => {
      if (item.decision === "yes") {
        decisions.push(item.text);
      }
      if (title.includes("parent concerns")) {
        parentConcerns.push(item.text);
      }
      if (title.includes("next steps") || title.includes("items deferred")) {
        nextSteps.push(item.text);
      }
    });
  });

  return { decisions, parentConcerns, nextSteps };
}
