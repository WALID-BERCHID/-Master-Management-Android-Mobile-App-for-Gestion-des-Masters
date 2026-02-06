import { Card } from "@/components/Card";
import { agendaTemplates, taskTemplates, meetingSectionTemplates } from "@/lib/templates";

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-semibold">Templates</h1>
        <p className="text-sm text-muted mt-2">Create reusable agendas, minutes, and task templates.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <h2 className="text-lg font-semibold">Agenda templates</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            {Object.entries(agendaTemplates).map(([type, items]) => (
              <div key={type}>
                <p className="font-medium capitalize text-text">{type}</p>
                <ul className="list-disc list-inside">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Minutes templates</h2>
          <div className="mt-4 space-y-2 text-sm text-muted">
            {meetingSectionTemplates.map((section) => (
              <div key={section} className="rounded-2xl border border-border bg-surface2 px-3 py-2">
                {section}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Task templates</h2>
          <div className="mt-4 space-y-3 text-sm text-muted">
            {taskTemplates.map((task) => (
              <div key={task.title} className="rounded-2xl border border-border bg-surface2 p-3">
                <p className="text-sm font-medium text-text">{task.title}</p>
                <p className="text-xs text-muted">{task.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
