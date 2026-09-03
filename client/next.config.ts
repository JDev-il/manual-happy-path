import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root also carries a lockfile; pin the workspace root to client/.
  turbopack: {
    root: path.resolve(import.meta.dirname ?? "."),
  },
  // client/CLAUDE.md is the agent contract for this scope — never let the
  // framework regenerate over it.
  agentRules: false,
  compiler: {
    // Enables SSR-safe class name generation for styled-components.
    styledComponents: true,
  },
};

export default nextConfig;
