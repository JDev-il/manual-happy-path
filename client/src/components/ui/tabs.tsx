"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Uncontrolled-by-default tab strip. Purely presentational: the active value
 * may be driven from outside, but no data is fetched or derived here.
 */
export interface TabItem {
  value: string;
  label: string;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  items: readonly TabItem[];
  value: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ items, value, onValueChange, className, ...props }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-[2px] rounded-[var(--radius-md)] bg-surface-sunken p-[2px]",
        className,
      )}
      {...props}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onValueChange?.(item.value)}
            className={cn(
              "rounded-[var(--radius-sm)] px-[var(--space-2)] py-[var(--space-1)]",
              "text-[length:var(--text-xs)] font-medium transition-colors",
              active
                ? "bg-surface-overlay text-content-primary"
                : "text-content-muted hover:text-content-secondary",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
