import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { createTask } from "@/lib/actions";

export default async function TasksPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = getSupabaseServer();
  let query = supabase
    .from("tasks")
    .select("id, title, due_date, owner, priority, status")
    .order("created_at", { ascending: false });

  const status = typeof searchParams?.status === "string" ? searchParams.status : "";
  const priority = typeof searchParams?.priority === "string" ? searchParams.priority : "";
  const owner = typeof searchParams?.owner === "string" ? searchParams.owner : "";

  if (status) query = query.eq("status", status);
  if (priority) query = query.eq("priority", priority);
  if (owner) query = query.ilike("owner", `%${owner}%`);

  const { data: tasks } = await query;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Tasks</h1>
        <p className="text-sm text-muted mt-2">Track follow up actions linked to meetings and students.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Task list</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-3" method="get">
            <label className="block text-xs text-muted">
              Status
              <select name="status" defaultValue={status} className="mt-2 w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm">
                <option value="">All</option>
                <option value="to do">To do</option>
                <option value="in progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="block text-xs text-muted">
              Priority
              <select name="priority" defaultValue={priority} className="mt-2 w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm">
                <option value="">All</option>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block text-xs text-muted">
              Owner
              <input name="owner" defaultValue={owner} className="mt-2 w-full rounded-2xl border border-border bg-surface2 px-3 py-2 text-sm" placeholder="Search owner" />
            </label>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" variant="outline">Apply filters</Button>
            </div>
          </form>
          <div className="mt-4 space-y-3">
            {tasks?.length ? (
              tasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-border bg-surface2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{task.title}</p>
                    <span className="text-xs text-muted">{task.status}</span>
                  </div>
                  <p className="text-xs text-muted">Owner: {task.owner}</p>
                  <p className="text-xs text-muted">Due: {task.due_date || "No due date"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No tasks yet. Add follow ups from minutes.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Create task</h2>
          <form action={createTask} className="mt-4 space-y-3">
            <Input label="Title" name="title" placeholder="Task title" required />
            <Input label="Description" name="description" placeholder="Optional details" />
            <Input label="Owner" name="owner" placeholder="Case Manager" required />
            <Input label="Due date" name="due_date" type="date" />
            <label className="block text-sm text-muted">
              <span className="block mb-2 text-xs font-medium text-text">Priority</span>
              <select name="priority" className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>
            <label className="block text-sm text-muted">
              <span className="block mb-2 text-xs font-medium text-text">Status</span>
              <select name="status" className="w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm">
                <option value="to do">To do</option>
                <option value="in progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <Button type="submit">Save task</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
