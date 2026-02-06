import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { createMeeting } from "@/lib/actions";
import Link from "next/link";

export default async function MeetingsPage() {
  const supabase = getSupabaseServer();
  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, meeting_type, meeting_date, meeting_time, student:students(display_name)")
    .order("meeting_date", { ascending: false });
  const { data: students } = await supabase.from("students").select("id, display_name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Meetings</h1>
        <p className="text-sm text-muted mt-2">Create and manage IEP meetings and agendas.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Upcoming meetings</h2>
          <div className="mt-4 space-y-3">
            {meetings?.length ? (
              meetings.map((meeting) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block rounded-2xl border border-border bg-surface2 p-4">
                  <p className="text-sm font-medium capitalize">{meeting.meeting_type} meeting</p>
                  <p className="text-xs text-muted">{meeting.meeting_date} at {meeting.meeting_time}</p>
                  <p className="text-xs text-muted">Student: {meeting.student?.display_name || "Unknown"}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No meetings yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Schedule meeting</h2>
          <form action={createMeeting} className="mt-4 space-y-3">
            <label className="block text-sm text-muted">
              <span className="block mb-2 text-xs font-medium text-text">Student</span>
              <select name="student_id" className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
                {students?.map((student) => (
                  <option key={student.id} value={student.id}>{student.display_name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm text-muted">
              <span className="block mb-2 text-xs font-medium text-text">Meeting type</span>
              <select name="meeting_type" className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
                <option value="annual">Annual</option>
                <option value="initial">Initial</option>
                <option value="reevaluation">Reevaluation</option>
                <option value="amendment">Amendment</option>
              </select>
            </label>
            <Input label="Meeting date" name="meeting_date" type="date" required />
            <Input label="Meeting time" name="meeting_time" type="time" required />
            <label className="block text-sm text-muted">
              <span className="block mb-2 text-xs font-medium text-text">Mode</span>
              <select name="meeting_mode" className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
                <option value="in person">In person</option>
                <option value="virtual">Virtual</option>
              </select>
            </label>
            <Input label="Location or link" name="location_or_link" placeholder="Room 214 or video link" required />
            <Button type="submit">Save meeting</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
