import { describe, expect, it } from "vitest";
import { meetingSchema, studentSchema, taskSchema } from "@/lib/validators";

describe("validators", () => {
  it("validates student schema", () => {
    const parsed = studentSchema.parse({
      display_name: "Ava Carter",
      internal_id: "STU-12",
      strengths: ["Reading"],
      needs: ["Math"]
    });

    expect(parsed.display_name).toBe("Ava Carter");
  });

  it("validates meeting schema", () => {
    const parsed = meetingSchema.parse({
      student_id: "11111111-1111-1111-1111-111111111111",
      meeting_type: "annual",
      meeting_date: "2024-08-01",
      meeting_time: "14:00",
      meeting_mode: "virtual",
      location_or_link: "https://meet.example.com",
      participants: []
    });

    expect(parsed.meeting_mode).toBe("virtual");
  });

  it("validates task schema", () => {
    const parsed = taskSchema.parse({
      title: "Send draft goals",
      owner: "Case Manager",
      priority: "high",
      status: "to do"
    });

    expect(parsed.priority).toBe("high");
  });
});
