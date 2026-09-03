import { cn } from "@/lib/utils";

/** Shown wherever a panel has no data to render yet. */
export function EmptyState({
  title,
  hint,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { title: string; hint?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-[var(--space-1)] rounded-[var(--radius-md)]",
        "border border-dashed border-border-subtle px-[var(--space-4)] py-[var(--space-5)] text-center",
        className,
      )}
      {...props}
    >
      <p className="m-0 text-[length:var(--text-sm)] font-medium text-content-secondary">{title}</p>
      {hint ? <p className="m-0 text-[length:var(--text-xs)] text-content-muted">{hint}</p> : null}
    </div>
  );
}
