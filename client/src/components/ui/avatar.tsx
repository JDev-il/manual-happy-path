import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { initials: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-pill)]",
        "bg-accent-soft text-[length:var(--text-xs)] font-semibold text-accent-base",
        className,
      )}
      {...props}
    >
      {initials}
    </span>
  );
}
