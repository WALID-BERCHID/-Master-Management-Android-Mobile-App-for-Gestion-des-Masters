"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { buildSummary, extractSummaryInput } from "@/lib/summary";
import { billingEnabled, freeTierLimits, isPaidUser } from "@/lib/billing";
import { meetingMinutesSchema, meetingSchema, studentSchema, taskSchema } from "@/lib/validators";

export async function createStudent(formData: FormData) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  if (billingEnabled && !(await isPaidUser(supabase, userId))) {
    const { count } = await supabase.from("students").select("id", { count: "exact", head: true });
    if ((count || 0) >= freeTierLimits.maxStudents) {
      throw new Error("Free tier student limit reached");
    }
  }
  const payload = studentSchema.parse({
    display_name: formData.get("display_name"),
    internal_id: formData.get("internal_id") || null,
    strengths: (formData.get("strengths") as string)?.split("\n").filter(Boolean) || [],
    needs: (formData.get("needs") as string)?.split("\n").filter(Boolean) || []
  });

  const { error } = await supabase.from("students").insert({ ...payload, user_id: userId });
  if (error) throw new Error(error.message);
  revalidatePath("/students");
}

export async function createMeeting(formData: FormData) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  if (billingEnabled && !(await isPaidUser(supabase, userId))) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { count } = await supabase
      .from("meetings")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString());
    if ((count || 0) >= freeTierLimits.maxMeetingsPerMonth) {
      throw new Error("Free tier meeting limit reached");
    }
  }
  const payload = meetingSchema.parse({
    student_id: formData.get("student_id"),
    meeting_type: formData.get("meeting_type"),
    meeting_date: formData.get("meeting_date"),
    meeting_time: formData.get("meeting_time"),
    meeting_mode: formData.get("meeting_mode"),
    location_or_link: formData.get("location_or_link"),
    participants: []
  });

  const { error } = await supabase.from("meetings").insert({
    user_id: userId,
    student_id: payload.student_id,
    meeting_type: payload.meeting_type,
    meeting_date: payload.meeting_date,
    meeting_time: payload.meeting_time,
    meeting_mode: payload.meeting_mode,
    location_or_link: payload.location_or_link
  });

  if (error) throw new Error(error.message);
  revalidatePath("/meetings");
}

export async function addParticipant(formData: FormData) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const payload = {
    meeting_id: formData.get("meeting_id"),
    name: formData.get("name"),
    role: formData.get("role"),
    email: formData.get("email") || null,
    attendance: formData.get("attendance") || "present"
  };

  const { error } = await supabase.from("meeting_participants").insert({
    ...payload,
    user_id: userId
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/meetings/${payload.meeting_id}`);
}

export async function createTask(formData: FormData) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const payload = taskSchema.parse({
    title: formData.get("title"),
    description: formData.get("description"),
    owner: formData.get("owner"),
    due_date: formData.get("due_date"),
    priority: formData.get("priority"),
    status: formData.get("status"),
    student_id: formData.get("student_id") || null,
    meeting_id: formData.get("meeting_id") || null
  });

  const { error } = await supabase.from("tasks").insert({ ...payload, user_id: userId });
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function saveMinutes(formData: FormData) {
  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const minutesPayload = JSON.parse(formData.get("payload") as string || "{}");
  const parsed = meetingMinutesSchema.parse(minutesPayload);
  const summaryInput = extractSummaryInput(parsed.sections);
  const summary = parsed.summary || buildSummary(summaryInput);

  const { error } = await supabase.from("meeting_minutes").upsert({
    user_id: userId,
    meeting_id: parsed.meeting_id,
    sections: parsed.sections,
    summary
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/minutes/${parsed.meeting_id}`);
}

export async function exportAllData() {
  const supabase = getSupabaseServer();
  const { data: students } = await supabase.from("students").select("*");
  const { data: meetings } = await supabase.from("meetings").select("*");
  const { data: tasks } = await supabase.from("tasks").select("*");
  const { data: minutes } = await supabase.from("meeting_minutes").select("*");
  const { data: attachments } = await supabase.from("attachments").select("*");

  return { students, meetings, tasks, minutes, attachments };
}

export async function deleteAllData() {
  const supabase = getSupabaseServer();
  await supabase.from("attachments").delete().neq("id", "");
  await supabase.from("tasks").delete().neq("id", "");
  await supabase.from("meeting_minutes").delete().neq("id", "");
  await supabase.from("meeting_participants").delete().neq("id", "");
  await supabase.from("meetings").delete().neq("id", "");
  await supabase.from("students").delete().neq("id", "");

  revalidatePath("/settings");
}
