import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Presentational input shell. Validation, masking, and submission behaviour
 * are owned by the FORMS agent — this component only renders.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-9 w-full rounded-[var(--radius-md)] border border-border-subtle bg-surface-sunken px-[var(--space-3)]",
        "text-[length:var(--text-sm)] text-content-primary placeholder:text-content-muted",
        "outline-none transition-colors focus-visible:border-[var(--border-focus)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
