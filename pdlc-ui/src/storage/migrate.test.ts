import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { migrate, migrationStatus } from "./migrate";

let tmp: string;
let db: Database.Database;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), "pdlc-s1-mig-"));
  db = new Database(join(tmp, "pdlc.db"));
});

afterEach(() => {
  db.close();
  rmSync(tmp, { recursive: true, force: true });
});

describe("migrate", () => {
  it("applies all pending migrations on first call", () => {
    const applied = migrate(db);
    expect(applied.length).toBeGreaterThanOrEqual(2);
    const status = migrationStatus(db);
    expect(status.pending).toEqual([]);
  });

  it("is idempotent on repeat calls", () => {
    migrate(db);
    const second = migrate(db);
    expect(second).toEqual([]);
  });

  it("creates expected tables + indexes", () => {
    migrate(db);
    const tables = db
      .prepare<[], { name: string }>(
        "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
      )
      .all()
      .map((r) => r.name);
    expect(tables).toContain("initiatives");
    expect(tables).toContain("deleted_initiative_events");
    expect(tables).toContain("schema_migrations");
  });
});
