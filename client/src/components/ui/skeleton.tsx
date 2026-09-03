import { cn } from "@/lib/utils";

/** Loading placeholder. Rendered whenever data is not yet available. */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-[var(--radius-sm)] bg-surface-overlay", className)}
      {...props}
    />
  );
}
