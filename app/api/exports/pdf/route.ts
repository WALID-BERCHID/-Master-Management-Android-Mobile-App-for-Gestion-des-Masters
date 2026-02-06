import { NextResponse } from "next/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { billingEnabled, freeTierLimits, isPaidUser } from "@/lib/billing";

export async function POST(request: Request) {
  let meeting_id = "";
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    meeting_id = body.meeting_id;
  } else {
    const formData = await request.formData();
    meeting_id = String(formData.get("meeting_id") || "");
  }
  if (!meeting_id) {
    return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
  }

  const supabase = getSupabaseServer();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (billingEnabled && !(await isPaidUser(supabase, userId))) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const { count } = await supabase
      .from("audit_logs")
      .select("id", { count: "exact", head: true })
      .eq("table_name", "exports")
      .gte("created_at", startOfMonth.toISOString());
    if ((count || 0) >= freeTierLimits.maxExportsPerMonth) {
      return NextResponse.json({ error: "Free tier export limit reached" }, { status: 402 });
    }
  }
  const { data: meeting } = await supabase
    .from("meetings")
    .select("*, student:students(display_name)")
    .eq("id", meeting_id)
    .single();
  const { data: participants } = await supabase
    .from("meeting_participants")
    .select("name, role, attendance")
    .eq("meeting_id", meeting_id);
  const { data: minutes } = await supabase
    .from("meeting_minutes")
    .select("sections, summary")
    .eq("meeting_id", meeting_id)
    .single();
  const { data: tasks } = await supabase
    .from("tasks")
    .select("title, owner, due_date, status")
    .eq("meeting_id", meeting_id);

  const pdf = await PDFDocument.create();
  const page = pdf.addPage();
  const { width, height } = page.getSize();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  let y = height - 50;

  const writeLine = (text: string, size = 12) => {
    page.drawText(text, { x: 50, y, size, font, color: rgb(0.17, 0.11, 0.09) });
    y -= size + 8;
  };

  writeLine("IEP Prep Meeting Package", 18);
  writeLine(`Student: ${meeting?.student?.display_name || ""}`);
  writeLine(`Meeting type: ${meeting?.meeting_type || ""}`);
  writeLine(`Date: ${meeting?.meeting_date || ""} ${meeting?.meeting_time || ""}`);
  writeLine(`Mode: ${meeting?.meeting_mode || ""}`);
  writeLine(`Location or link: ${meeting?.location_or_link || ""}`);
  y -= 8;

  writeLine("Participants", 14);
  participants?.forEach((participant) => {
    writeLine(`${participant.name} | ${participant.role} | ${participant.attendance}`, 11);
  });
  y -= 6;

  writeLine("Minutes", 14);
  minutes?.sections?.forEach((section: any) => {
    writeLine(section.title, 12);
    section.items?.forEach((item: any) => {
      writeLine(`- ${item.text} ${item.decision ? `[Decision: ${item.decision}]` : ""}`, 10);
    });
  });
  y -= 6;

  writeLine("Follow up tasks", 14);
  tasks?.forEach((task) => {
    writeLine(`${task.title} | Owner: ${task.owner} | Due: ${task.due_date || ""} | ${task.status}`, 10);
  });
  y -= 6;

  writeLine("Family summary", 14);
  writeLine(minutes?.summary || "No summary available.", 11);

  const pdfBytes = await pdf.save();
  await supabase.from("audit_logs").insert({ user_id: userId, table_name: "exports", record_id: meeting_id, action: "EXPORT_PDF" });
  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="meeting-${meeting_id}.pdf"`
    }
  });
}
