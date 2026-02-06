import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import Link from "next/link";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { agendaTemplates } from "@/lib/templates";
import { addParticipant } from "@/lib/actions";

interface PageProps {
  params: { id: string };
}

export default async function MeetingDetailPage({ params }: PageProps) {
  const supabase = getSupabaseServer();
  const { data: meeting } = await supabase
    .from("meetings")
    .select("*, student:students(display_name)")
    .eq("id", params.id)
    .single();

  const { data: participants } = await supabase
    .from("meeting_participants")
    .select("id, name, role, attendance")
    .eq("meeting_id", params.id);

  const agenda = meeting ? agendaTemplates[meeting.meeting_type as keyof typeof agendaTemplates] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold capitalize">{meeting?.meeting_type || "Meeting"} meeting</h1>
        <p className="text-sm text-muted mt-2">Student: {meeting?.student?.display_name || "Unknown"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Meeting details</h2>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p>Date: {meeting?.meeting_date || ""}</p>
            <p>Time: {meeting?.meeting_time || ""}</p>
            <p>Mode: {meeting?.meeting_mode || ""}</p>
            <p>Location or link: {meeting?.location_or_link || ""}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Link href={`/minutes/${params.id}`} className="rounded-full px-4 py-2 text-sm button-primary shadow-soft">Open minutes</Link>
            <form action="/api/exports/pdf" method="post" className="inline">
              <input type="hidden" name="meeting_id" value={params.id} />
              <button className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-text">Export PDF</button>
            </form>
            <form action="/api/exports/docx" method="post" className="inline">
              <input type="hidden" name="meeting_id" value={params.id} />
              <button className="rounded-full border border-border px-4 py-2 text-sm text-muted hover:text-text">Export DOCX</button>
            </form>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Participants</h2>
          <div className="mt-4 space-y-3">
            {participants?.length ? (
              participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-muted">{participant.role}</p>
                  </div>
                  <Chip variant={participant.attendance === "present" ? "peach" : "neutral"}>
                    {participant.attendance}
                  </Chip>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Add participants once the meeting is scheduled.</p>
            )}
          </div>
          <form action={addParticipant} className="mt-4 space-y-2">
            <input type="hidden" name="meeting_id" value={params.id} />
            <input name="name" placeholder="Participant name" className="w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm" required />
            <select name="role" className="w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm">
              <option value="parent or guardian">Parent or guardian</option>
              <option value="case manager">Case manager</option>
              <option value="general education teacher">General education teacher</option>
              <option value="special education teacher">Special education teacher</option>
              <option value="admin">Admin</option>
              <option value="SLP">SLP</option>
              <option value="OT">OT</option>
              <option value="PT">PT</option>
              <option value="psychologist">Psychologist</option>
              <option value="other">Other</option>
            </select>
            <input name="email" type="email" placeholder="Email optional" className="w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm" />
            <select name="attendance" className="w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="excused">Excused</option>
            </select>
            <button className="rounded-full px-4 py-2 text-sm button-primary shadow-soft">Add participant</button>
          </form>
        </Card>
      </div>
      <Card>
        <h2 className="text-lg font-semibold">Agenda builder</h2>
        <p className="text-sm text-muted mt-2">Drag and drop is supported in the full editor. Start with this template.</p>
        <div className="mt-4 grid gap-2">
          {agenda?.map((item, index) => (
            <div key={`${item}-${index}`} className="rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
