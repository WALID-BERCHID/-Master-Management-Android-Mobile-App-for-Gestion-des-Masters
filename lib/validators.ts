import { z } from "zod";

export const studentSchema = z.object({
  display_name: z.string().min(1, "Student name is required"),
  internal_id: z.string().max(50).optional().nullable(),
  strengths: z.array(z.string().max(200)).optional().default([]),
  needs: z.array(z.string().max(200)).optional().default([])
});

export const participantSchema = z.object({
  name: z.string().min(1),
  role: z.enum([
    "parent or guardian",
    "case manager",
    "general education teacher",
    "special education teacher",
    "admin",
    "SLP",
    "OT",
    "PT",
    "psychologist",
    "other"
  ]),
  email: z.string().email().optional().nullable(),
  attendance: z.enum(["present", "absent", "excused"]).default("present")
});

export const meetingSchema = z.object({
  student_id: z.string().uuid(),
  meeting_type: z.enum(["annual", "initial", "reevaluation", "amendment"]),
  meeting_date: z.string().min(1),
  meeting_time: z.string().min(1),
  meeting_mode: z.enum(["in person", "virtual"]),
  location_or_link: z.string().min(1),
  participants: z.array(participantSchema).default([])
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().max(500).optional().nullable(),
  owner: z.string().min(1),
  due_date: z.string().optional().nullable(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  status: z.enum(["to do", "in progress", "done"]).default("to do"),
  student_id: z.string().uuid().optional().nullable(),
  meeting_id: z.string().uuid().optional().nullable()
});

export const minutesSectionSchema = z.object({
  title: z.string().min(1),
  items: z.array(
    z.object({
      text: z.string().min(1),
      decision: z.enum(["yes", "no", "deferred"]).optional(),
      timestamp: z.string().optional(),
      taskReady: z.boolean().optional()
    })
  )
});

export const meetingMinutesSchema = z.object({
  meeting_id: z.string().uuid(),
  sections: z.array(minutesSectionSchema).default([]),
  summary: z.string().optional().nullable()
});

export const agendaTemplateSchema = z.object({
  name: z.string().min(1),
  meeting_type: z.enum(["annual", "initial", "reevaluation", "amendment"]),
  sections: z.array(z.string().min(1))
});

export const templateSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["agenda", "minutes", "task"]),
  content: z.record(z.any())
});
