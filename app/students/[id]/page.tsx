import { Card } from "@/components/Card";
import { getSupabaseServer } from "@/lib/supabaseServer";
import Link from "next/link";
import { AttachmentsClient } from "@/components/AttachmentsClient";

interface PageProps {
  params: { id: string };
}

export default async function StudentDetailPage({ params }: PageProps) {
  const supabase = getSupabaseServer();
  const { data: student } = await supabase.from("students").select("*").eq("id", params.id).single();
  const { data: meetings } = await supabase
    .from("meetings")
    .select("id, meeting_type, meeting_date")
    .eq("student_id", params.id)
    .order("meeting_date", { ascending: false });
  const { data: attachments } = await supabase
    .from("attachments")
    .select("id, file_name, storage_path")
    .eq("student_id", params.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">{student?.display_name || "Student"}</h1>
        <p className="text-sm text-muted mt-2">Internal id: {student?.internal_id || "Not set"}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold">Meetings</h2>
          <div className="mt-4 space-y-3">
            {meetings?.length ? (
              meetings.map((meeting) => (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block rounded-2xl border border-border bg-surface2 p-4">
                  <p className="text-sm font-medium capitalize">{meeting.meeting_type} meeting</p>
                  <p className="text-xs text-muted">{meeting.meeting_date}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No meetings for this student yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Attachments</h2>
          <div className="mt-4">
            <AttachmentsClient studentId={params.id} initialAttachments={attachments || []} />
          </div>
        </Card>
      </div>
    </div>
  );
}
