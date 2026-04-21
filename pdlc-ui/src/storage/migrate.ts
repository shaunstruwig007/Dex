import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type Database from "better-sqlite3";
import { openSqlite } from "./db";

const __dir = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dir, "migrations");

const SCHEMA_MIGRATIONS_DDL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  version     INTEGER PRIMARY KEY,
  name        TEXT    NOT NULL,
  applied_at  TEXT    NOT NULL
)
`;

type MigrationFile = { version: number; name: string; sql: string };

function readMigrations(): MigrationFile[] {
  const entries = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  return entries.map((filename) => {
    const match = filename.match(/^(\d+)_(.+)\.sql$/);
    if (!match) {
      throw new Error(`Invalid migration filename: ${filename}`);
    }
    const [, versionStr, name] = match;
    return {
      version: Number.parseInt(versionStr, 10),
      name,
      sql: readFileSync(join(MIGRATIONS_DIR, filename), "utf8"),
    };
  });
}

function appliedVersions(db: Database.Database): Set<number> {
  const rows = db
    .prepare<[], { version: number }>("SELECT version FROM schema_migrations")
    .all();
  return new Set(rows.map((r) => r.version));
}

/**
 * Apply all pending migrations. Idempotent — safe to call on every boot.
 * Returns the list of migrations applied in this invocation.
 */
export function migrate(db: Database.Database = openSqlite()): MigrationFile[] {
  db.exec(SCHEMA_MIGRATIONS_DDL);
  const already = appliedVersions(db);
  const pending = readMigrations().filter((m) => !already.has(m.version));
  if (pending.length === 0) return [];

  const now = new Date().toISOString();
  const record = db.prepare(
    "INSERT INTO schema_migrations (version, name, applied_at) VALUES (?, ?, ?)",
  );
  const apply = db.transaction((migration: MigrationFile) => {
    db.exec(migration.sql);
    record.run(migration.version, migration.name, now);
  });
  for (const m of pending) apply(m);
  return pending;
}

/** Returns { applied, pending } version counts for health/readiness checks. */
export function migrationStatus(db: Database.Database = openSqlite()): {
  applied: number[];
  pending: number[];
} {
  db.exec(SCHEMA_MIGRATIONS_DDL);
  const already = appliedVersions(db);
  const all = readMigrations().map((m) => m.version);
  return {
    applied: all.filter((v) => already.has(v)),
    pending: all.filter((v) => !already.has(v)),
  };
}
