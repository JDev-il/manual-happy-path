import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] [&_svg]:shrink-0 [&_svg]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-accent-base text-accent-content hover:bg-accent-hover",
        secondary: "bg-surface-overlay text-content-primary hover:bg-surface-raised",
        outline: "border border-border-strong text-content-primary hover:bg-surface-overlay",
        ghost: "text-content-secondary hover:bg-surface-overlay hover:text-content-primary",
        danger: "bg-status-danger text-content-inverted hover:opacity-90",
      },
      size: {
        sm: "h-7 rounded-[var(--radius-sm)] px-[var(--space-2)] text-[length:var(--text-xs)]",
        md: "h-9 rounded-[var(--radius-md)] px-[var(--space-3)] text-[length:var(--text-sm)]",
        lg: "h-11 rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--text-base)]",
        icon: "size-9 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
