import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-[var(--space-2)] py-[2px] text-[length:var(--text-xs)] font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-surface-overlay text-content-secondary",
        accent: "bg-accent-soft text-accent-base",
        up: "bg-market-up-soft text-market-up",
        down: "bg-market-down-soft text-market-down",
        flat: "bg-market-flat-soft text-market-flat",
        info: "bg-surface-overlay text-status-info",
        warning: "bg-surface-overlay text-status-warning",
        danger: "bg-surface-overlay text-status-danger",
        success: "bg-surface-overlay text-status-success",
      },
      outlined: { true: "border border-border-subtle", false: "" },
    },
    defaultVariants: { tone: "neutral", outlined: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, outlined, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, outlined }), className)} {...props} />;
}

export { badgeVariants };
