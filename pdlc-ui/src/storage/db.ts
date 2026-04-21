import { existsSync, mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import Database from "better-sqlite3";
import {
  drizzle,
  type BetterSQLite3Database,
} from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

/**
 * SQLite bootstrap (ADR-0001): WAL + busy_timeout, single-writer assumption.
 * Path resolution: PDLC_DB_PATH env, else `<cwd>/data/pdlc.db`.
 *
 * `better-sqlite3` is synchronous and fast. Drizzle wraps the same connection
 * so query-builder reads and `.run()`-style migrations share one WAL session.
 */

export type Drizzle = BetterSQLite3Database<typeof schema>;

let cachedSqlite: Database.Database | null = null;
let cachedDrizzle: Drizzle | null = null;

function resolveDbPath(): string {
  const fromEnv = process.env.PDLC_DB_PATH;
  if (fromEnv && fromEnv.trim() !== "") {
    return isAbsolute(fromEnv) ? fromEnv : resolve(process.cwd(), fromEnv);
  }
  return resolve(process.cwd(), "data", "pdlc.db");
}

function ensureDir(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/** Raw `better-sqlite3` handle — used by the migration runner and tests. */
export function openSqlite(): Database.Database {
  if (cachedSqlite) return cachedSqlite;
  const file = resolveDbPath();
  ensureDir(file);
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");
  db.pragma("foreign_keys = ON");
  cachedSqlite = db;
  return db;
}

/** Drizzle query surface over the shared `better-sqlite3` handle. */
export function openDrizzle(): Drizzle {
  if (cachedDrizzle) return cachedDrizzle;
  cachedDrizzle = drizzle(openSqlite(), { schema });
  return cachedDrizzle;
}

/** Test-only: close and drop the cached handles. */
export function __resetDbForTests(): void {
  if (cachedSqlite) {
    cachedSqlite.close();
    cachedSqlite = null;
    cachedDrizzle = null;
  }
}
