"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { meetingSectionTemplates } from "@/lib/templates";
import { buildSummary, extractSummaryInput, MinutesSection } from "@/lib/summary";
import { saveMinutes } from "@/lib/actions";

const emptySections = meetingSectionTemplates.map((title) => ({ title, items: [] as { text: string; decision?: "yes" | "no" | "deferred" }[] }));

type MinutesClientProps = {
  meetingId: string;
  initialSections?: MinutesSection[];
  initialSummary?: string | null;
};

export default function MinutesClient({ meetingId, initialSections, initialSummary }: MinutesClientProps) {
  const [sections, setSections] = useState<MinutesSection[]>(initialSections?.length ? initialSections : emptySections);
  const [summary, setSummary] = useState<string>(initialSummary || "");
  const [status, setStatus] = useState<string>("Saved");

  const summaryInput = useMemo(() => extractSummaryInput(sections), [sections]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const payload = { meeting_id: meetingId, sections, summary };
      const formData = new FormData();
      formData.set("payload", JSON.stringify(payload));
      saveMinutes(formData).then(() => setStatus("Saved")).catch(() => setStatus("Save failed"));
    }, 1200);

    setStatus("Saving");
    return () => clearTimeout(timeout);
  }, [meetingId, sections, summary]);

  const regenerateSummary = () => {
    setSummary(buildSummary(summaryInput));
  };

  const addItem = (index: number) => {
    const text = prompt("Enter a note");
    if (!text) return;
    setSections((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        items: [...updated[index].items, { text }]
      };
      return updated;
    });
  };

  const updateDecision = (sectionIndex: number, itemIndex: number, decision: "yes" | "no" | "deferred") => {
    setSections((prev) => {
      const updated = [...prev];
      const section = updated[sectionIndex];
      const items = [...section.items];
      items[itemIndex] = { ...items[itemIndex], decision };
      updated[sectionIndex] = { ...section, items };
      return updated;
    });
  };

  const createTaskFromItem = async (text: string) => {
    const owner = prompt("Task owner name");
    if (!owner) return;
    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text, owner, meeting_id: meetingId })
    });
    setStatus("Task created");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Minutes editor</h1>
          <p className="text-sm text-muted mt-2">Structured minutes with autosave and task ready decisions.</p>
        </div>
        <span className="text-xs text-muted">{status}</span>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <Card key={section.title}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{section.title}</h2>
                <Button variant="ghost" onClick={() => addItem(sectionIndex)}>Add note</Button>
              </div>
              <div className="mt-3 space-y-2">
                {section.items.length ? (
                  section.items.map((item, itemIndex) => (
                    <div key={`${section.title}-${itemIndex}`} className="rounded-2xl border border-border bg-surface2 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <p>{item.text}</p>
                          {(item.decision === "yes" || item.decision === "deferred") && (
                            <Button variant="outline" onClick={() => createTaskFromItem(item.text)}>
                              Create follow up task
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {["yes", "no", "deferred"].map((choice) => (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => updateDecision(sectionIndex, itemIndex, choice as "yes" | "no" | "deferred")}
                              className={`rounded-full px-2 py-1 text-xs ${item.decision === choice ? "bg-peach200 text-text" : "bg-white text-muted"}`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">No notes yet. Add the first item.</p>
                )}
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <h2 className="text-lg font-semibold">Family summary</h2>
          <p className="text-sm text-muted mt-2">Deterministic summary from decisions, concerns, and next steps.</p>
          <div className="mt-4 space-y-3">
            <Input
              label="Summary"
              name="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
            />
            <Button onClick={regenerateSummary}>Regenerate summary</Button>
            <div className="text-xs text-muted">
              Decisions: {summaryInput.decisions.length} | Concerns: {summaryInput.parentConcerns.length} | Next steps: {summaryInput.nextSteps.length}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
