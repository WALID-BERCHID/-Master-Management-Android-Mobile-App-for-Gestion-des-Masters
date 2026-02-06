import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { createStudent } from "@/lib/actions";
import Link from "next/link";

export default async function StudentsPage() {
  const supabase = getSupabaseServer();
  const { data: students } = await supabase
    .from("students")
    .select("id, display_name, internal_id")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Students</h1>
        <p className="text-sm text-muted mt-2">Manage student profiles with minimal sensitive data.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Student list</h2>
          <div className="mt-4 space-y-3">
            {students?.length ? (
              students.map((student) => (
                <Link key={student.id} href={`/students/${student.id}`} className="block rounded-2xl border border-border bg-surface2 p-4">
                  <p className="text-sm font-medium">{student.display_name}</p>
                  <p className="text-xs text-muted">Internal id: {student.internal_id || "Not set"}</p>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted">No students yet. Add one to begin.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Add student</h2>
          <form action={createStudent} className="mt-4 space-y-3">
            <Input label="Student display name" name="display_name" placeholder="Student name" required />
            <Input label="Internal id" name="internal_id" placeholder="Optional" />
            <Input label="Strengths" name="strengths" placeholder="One per line" />
            <Input label="Needs" name="needs" placeholder="One per line" />
            <Button type="submit">Save student</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
