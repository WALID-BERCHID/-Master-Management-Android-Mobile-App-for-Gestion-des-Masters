import { Card } from "@/components/Card";
import { Chip } from "@/components/Chip";
import { getSupabaseServer } from "@/lib/supabaseServer";

export default async function DashboardPage() {
  const supabase = getSupabaseServer();
  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, meeting_type, meeting_date, meeting_time, meeting_mode")
    .order("meeting_date", { ascending: true })
    .limit(3);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, due_date, priority, status")
    .order("due_date", { ascending: true })
    .limit(3);

  const { data: students } = await supabase
    .from("students")
    .select("id, display_name")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted mt-2">A quick look at upcoming meetings and tasks.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold">Upcoming meetings</h2>
          <div className="mt-4 space-y-3">
            {meetings?.length ? (
              meetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium capitalize">{meeting.meeting_type} meeting</p>
                    <p className="text-xs text-muted">{meeting.meeting_date} at {meeting.meeting_time}</p>
                  </div>
                  <Chip variant="peach">{meeting.meeting_mode}</Chip>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No meetings scheduled yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Upcoming tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks?.length ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-xs text-muted">Due {task.due_date || "No due date"}</p>
                  </div>
                  <Chip variant={task.priority === "high" ? "pink" : "neutral"}>{task.status}</Chip>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No tasks yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Recent students</h2>
          <div className="mt-4 space-y-3">
            {students?.length ? (
              students.map((student) => (
                <p key={student.id} className="text-sm text-text">{student.display_name}</p>
              ))
            ) : (
              <p className="text-sm text-muted">Add your first student to get started.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
