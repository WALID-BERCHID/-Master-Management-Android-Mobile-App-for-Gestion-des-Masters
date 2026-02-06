import { cn } from "@/lib/utils";

type Tab = { id: string; label: string };

type TabsProps = {
  tabs: Tab[];
  active: string;
  onChange: (id: string) => void;
};

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-4 py-2 text-sm transition",
            active === tab.id ? "bg-peach200 text-text" : "bg-surface2 text-muted"
          )}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
