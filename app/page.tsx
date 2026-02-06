import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="section-soft rounded-3xl border border-border p-10 shadow-soft">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-semibold">Prepare for IEP meetings with clarity and care</h1>
          <p className="text-base text-muted">
            IEP Prep keeps everything organized so teams can focus on students. Plan meetings, capture minutes,
            create follow up tasks, and generate a family friendly summary.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/sign-up">Start free</Button>
            <Button href="/dashboard" variant="outline">View dashboard</Button>
          </div>
        </div>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Structured minutes",
            description: "Capture decisions and attendance in a consistent format with task creation.",
          },
          {
            title: "Meeting prep",
            description: "Agenda templates, pre meeting checklists, and input forms for teams.",
          },
          {
            title: "Exports",
            description: "Create print ready PDF and DOCX meeting packages from a single click.",
          }
        ].map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-sm text-muted mt-2">{item.description}</p>
          </Card>
        ))}
      </section>
      <section className="card p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold">Built for secure collaboration</h2>
            <p className="text-sm text-muted mt-2">
              Supabase auth, strict row level security, and private storage keep student data protected.
            </p>
          </div>
          <Link className="rounded-full px-6 py-3 text-sm button-primary shadow-soft" href="/sign-up">
            Create your workspace
          </Link>
        </div>
      </section>
    </div>
  );
}
