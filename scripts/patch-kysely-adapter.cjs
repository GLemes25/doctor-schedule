/**
 * Patches @better-auth/kysely-adapter SQLite dialect files that import
 * DEFAULT_MIGRATION_LOCK_TABLE and DEFAULT_MIGRATION_TABLE from "kysely".
 *
 * In kysely 0.29.x those constants were moved to "kysely/migration" and are
 * no longer part of the main entry point, which causes Turbopack / webpack
 * to throw "Export X doesn't exist in target module" at build time.
 *
 * Since this project uses PostgreSQL, the SQLite dialects are never executed.
 * This script rewrites the broken imports to use inline constants instead.
 * Run automatically via the "postinstall" npm script.
 */

const fs = require("fs");
const path = require("path");

const ADAPTER_DIST = path.join(
  __dirname,
  "..",
  "node_modules",
  "@better-auth",
  "kysely-adapter",
  "dist",
);

// Constants that moved from "kysely" main entry to "kysely/migration"
const MIGRATION_TABLE = "kysely_migration";
const MIGRATION_LOCK_TABLE = "kysely_migration_lock";

const INLINE_CONSTANTS = [
  `const DEFAULT_MIGRATION_TABLE = "${MIGRATION_TABLE}";`,
  `const DEFAULT_MIGRATION_LOCK_TABLE = "${MIGRATION_LOCK_TABLE}";`,
].join("\n");

function patchFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`[patch-kysely-adapter] Skipping (not found): ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, "utf8");

  // Guard: already patched
  if (content.includes('const DEFAULT_MIGRATION_TABLE = "')) {
    console.log(`[patch-kysely-adapter] Already patched: ${path.basename(filePath)}`);
    return;
  }

  // Remove the two constants from the "kysely" named import.
  // Works whether they appear first, last, or in the middle of the list.
  content = content.replace(
    /^(import \{)([^}]+)(\} from "kysely";)/m,
    (_, open, importList, close) => {
      const cleaned = importList
        .split(",")
        .map((s) => s.trim())
        .filter(
          (s) =>
            s !== "DEFAULT_MIGRATION_LOCK_TABLE" &&
            s !== "DEFAULT_MIGRATION_TABLE" &&
            s !== "",
        )
        .join(", ");

      const fixedImport = `${open} ${cleaned} ${close}`;
      return `${fixedImport}\n${INLINE_CONSTANTS}`;
    },
  );

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`[patch-kysely-adapter] Patched: ${path.basename(filePath)}`);
}

// All SQLite dialect files in the adapter that have the broken imports
const targets = [
  path.join(ADAPTER_DIST, "node-sqlite-dialect.mjs"),
  path.join(ADAPTER_DIST, "bun-sqlite-dialect-DzNwOpKv.mjs"),
  path.join(ADAPTER_DIST, "d1-sqlite-dialect-C2B7YsIT.mjs"),
];

if (!fs.existsSync(ADAPTER_DIST)) {
  console.log("[patch-kysely-adapter] @better-auth/kysely-adapter not installed, skipping.");
  process.exit(0);
}

for (const target of targets) {
  patchFile(target);
}
