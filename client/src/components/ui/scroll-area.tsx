import * as React from "react";
import { cn } from "@/lib/utils";

/** Thin overflow container so panels scroll internally instead of the page. */
export const ScrollArea = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:thin]", className)}
      {...props}
    />
  ),
);
ScrollArea.displayName = "ScrollArea";
