/**
 * Token bridge.
 *
 * Every value here is a `var(--token)` reference into src/app/globals.css.
 * Components must consume tokens through this object (or the styled-components
 * theme built from it) — never a literal colour, radius, or size.
 */

export const tokens = {
  surface: {
    base: "var(--surface-base)",
    raised: "var(--surface-raised)",
    overlay: "var(--surface-overlay)",
    sunken: "var(--surface-sunken)",
  },
  content: {
    primary: "var(--content-primary)",
    secondary: "var(--content-secondary)",
    muted: "var(--content-muted)",
    inverted: "var(--content-inverted)",
  },
  border: {
    subtle: "var(--border-subtle)",
    strong: "var(--border-strong)",
    focus: "var(--border-focus)",
  },
  accent: {
    base: "var(--accent-base)",
    hover: "var(--accent-hover)",
    soft: "var(--accent-soft)",
    content: "var(--accent-content)",
  },
  market: {
    up: "var(--market-up)",
    upSoft: "var(--market-up-soft)",
    down: "var(--market-down)",
    downSoft: "var(--market-down-soft)",
    flat: "var(--market-flat)",
    flatSoft: "var(--market-flat-soft)",
  },
  status: {
    info: "var(--status-info)",
    warning: "var(--status-warning)",
    danger: "var(--status-danger)",
    success: "var(--status-success)",
  },
  radius: {
    xs: "var(--radius-xs)",
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
    pill: "var(--radius-pill)",
  },
  space: {
    1: "var(--space-1)",
    2: "var(--space-2)",
    3: "var(--space-3)",
    4: "var(--space-4)",
    5: "var(--space-5)",
    6: "var(--space-6)",
    7: "var(--space-7)",
  },
  font: {
    sans: "var(--font-sans)",
    mono: "var(--font-mono)",
  },
  text: {
    xs: "var(--text-xs)",
    sm: "var(--text-sm)",
    base: "var(--text-base)",
    lg: "var(--text-lg)",
    xl: "var(--text-xl)",
    "2xl": "var(--text-2xl)",
    "3xl": "var(--text-3xl)",
  },
  shadow: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    glow: "var(--shadow-glow)",
  },
  motion: {
    easeOut: "var(--ease-out)",
    fast: "var(--duration-fast)",
    base: "var(--duration-base)",
    slow: "var(--duration-slow)",
  },
  layout: {
    sidebarWidth: "var(--layout-sidebar-width)",
    sidebarCollapsed: "var(--layout-sidebar-collapsed)",
    topbarHeight: "var(--layout-topbar-height)",
    contentMax: "var(--layout-content-max)",
  },
} as const;

export type Tokens = typeof tokens;
