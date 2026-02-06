import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helperText?: string;
};

export function Input({ label, helperText, className, ...props }: InputProps) {
  return (
    <label className="block text-sm text-muted">
      {label && <span className="block mb-2 text-xs font-medium text-text">{label}</span>}
      <input
        {...props}
        className={cn(
          "w-full rounded-2xl border border-border bg-surface2 px-4 py-3 text-sm text-text placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach500",
          className
        )}
      />
      {helperText && <span className="mt-2 block text-xs text-muted">{helperText}</span>}
    </label>
  );
}
