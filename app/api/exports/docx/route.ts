import { NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun } from "docx";
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

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [new TextRun({ text: "IEP Prep Meeting Package", bold: true })]
          }),
          new Paragraph(`Student: ${meeting?.student?.display_name || ""}`),
          new Paragraph(`Meeting type: ${meeting?.meeting_type || ""}`),
          new Paragraph(`Date: ${meeting?.meeting_date || ""} ${meeting?.meeting_time || ""}`),
          new Paragraph(`Mode: ${meeting?.meeting_mode || ""}`),
          new Paragraph(`Location or link: ${meeting?.location_or_link || ""}`),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Participants", bold: true })] }),
          ...(participants || []).map(
            (participant) =>
              new Paragraph(`${participant.name} | ${participant.role} | ${participant.attendance}`)
          ),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Minutes", bold: true })] }),
          ...(minutes?.sections || []).flatMap((section: any) => [
            new Paragraph({ children: [new TextRun({ text: section.title, bold: true })] }),
            ...(section.items || []).map(
              (item: any) => new Paragraph(`- ${item.text} ${item.decision ? `[Decision: ${item.decision}]` : ""}`)
            )
          ]),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Follow up tasks", bold: true })] }),
          ...(tasks || []).map(
            (task) =>
              new Paragraph(`${task.title} | Owner: ${task.owner} | Due: ${task.due_date || ""} | ${task.status}`)
          ),
          new Paragraph(""),
          new Paragraph({ children: [new TextRun({ text: "Family summary", bold: true })] }),
          new Paragraph(minutes?.summary || "No summary available.")
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  await supabase.from("audit_logs").insert({ user_id: userId, table_name: "exports", record_id: meeting_id, action: "EXPORT_DOCX" });
  return new NextResponse(Buffer.from(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="meeting-${meeting_id}.docx"`
    }
  });
}
