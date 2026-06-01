// Stub for SQLite kysely dialects — this project uses PostgreSQL.
// These files are replaced at build time via NormalModuleReplacementPlugin
// because they import constants from "kysely" that were moved to "kysely/migration"
// in kysely 0.29.x, causing webpack's ESM named-export check to fail.
export const NodeSqliteDialect = undefined;
export const BunSqliteDialect = undefined;
export const D1SqliteDialect = undefined;
