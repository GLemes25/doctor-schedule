import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Prevent Turbopack from bundling these server-only packages.
  // They contain SQLite dialect files that import constants from the wrong
  // kysely entry point (moved to "kysely/migration" in 0.29.x).
  serverExternalPackages: ["@better-auth/kysely-adapter", "kysely"],
  turbopack: {},
};

export default nextConfig;
