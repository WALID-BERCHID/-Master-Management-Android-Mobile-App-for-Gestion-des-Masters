import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { taskSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = taskSchema.parse({
    title: body.title,
    description: body.description,
    owner: body.owner,
    due_date: body.due_date,
    priority: body.priority || "normal",
    status: body.status || "to do",
    student_id: body.student_id || null,
    meeting_id: body.meeting_id || null
  });

  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { data, error } = await supabase.from("tasks").insert({ ...payload, user_id: userId }).select("id").single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ id: data.id });
}
