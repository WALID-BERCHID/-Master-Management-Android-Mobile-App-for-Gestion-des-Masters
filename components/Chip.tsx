import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  variant?: "peach" | "pink" | "gold" | "neutral";
};

export function Chip({ children, variant = "neutral" }: ChipProps) {
  const classes = cn(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
    variant === "peach" && "bg-peach200 text-text",
    variant === "pink" && "bg-pink200 text-text",
    variant === "gold" && "bg-gold400/30 text-text",
    variant === "neutral" && "bg-surface2 text-muted"
  );
  return <span className={classes}>{children}</span>;
}
