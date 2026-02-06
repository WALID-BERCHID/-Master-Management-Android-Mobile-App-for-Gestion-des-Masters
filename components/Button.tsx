import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "outline" | "ghost";
  onClick?: () => void;
};

export function Button({ children, href, type = "button", variant = "primary", onClick }: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach500",
    variant === "primary" && "button-primary shadow-soft hover:-translate-y-0.5",
    variant === "outline" && "border border-border text-muted hover:text-text bg-white",
    variant === "ghost" && "text-muted hover:text-text"
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
