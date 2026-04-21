import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "./migrate";
import * as schema from "./schema";
import type { Drizzle } from "./db";
import {
  createInitiative,
  deleteInitiative,
  getInitiative,
  listDeletedEvents,
  listInitiatives,
  nextHandle,
  updateInitiative,
} from "./repository";

let tmp: string;
let sqlite: Database.Database;
let db: Drizzle;

beforeEach(() => {
  tmp = mkdtempSync(join(tmpdir(), "pdlc-s1-"));
  sqlite = new Database(join(tmp, "pdlc.db"));
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("busy_timeout = 5000");
  migrate(sqlite);
  db = drizzle(sqlite, { schema }) as Drizzle;
});

afterEach(() => {
  sqlite.close();
  rmSync(tmp, { recursive: true, force: true });
});

describe("repository", () => {
  it("creates initiatives with monotonic INIT-NNNN handles and revision 1", () => {
    const a = createInitiative({ title: "First" }, db);
    const b = createInitiative({ title: "Second" }, db);
    expect(a.handle).toBe("INIT-0001");
    expect(b.handle).toBe("INIT-0002");
    expect(a.revision).toBe(1);
    expect(a.lifecycle).toBe("idea");
    expect(nextHandle(db)).toBe("INIT-0003");
  });

  it("appends a 'create' event on creation", () => {
    const created = createInitiative({ title: "With audit" }, db);
    expect(created.events).toHaveLength(1);
    expect(created.events[0]).toMatchObject({
      kind: "create",
      by: "shaun",
      payload: { handle: "INIT-0001" },
    });
  });

  it("rejects empty titles on create", () => {
    expect(() => createInitiative({ title: "   " }, db)).toThrowError(
      /title_required/,
    );
  });

  it("enforces handle uniqueness (DB-level)", () => {
    createInitiative({ title: "a" }, db);
    // Simulate a duplicate handle insert — should throw via UNIQUE constraint.
    expect(() =>
      sqlite
        .prepare(
          `INSERT INTO initiatives (id, handle, title, body, lifecycle, revision, created_at, updated_at, data)
           VALUES ('dupe', 'INIT-0001', 't', '', 'idea', 1, ?, ?, '{}')`,
        )
        .run(new Date().toISOString(), new Date().toISOString()),
    ).toThrowError(/UNIQUE/);
  });

  it("updates bump revision and keep handle stable", () => {
    const created = createInitiative({ title: "v1" }, db);
    const result = updateInitiative(
      {
        id: created.id,
        expectedRevision: 1,
        title: "v2",
        body: "<p>new</p>",
      },
      db,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.initiative.title).toBe("v2");
    expect(result.initiative.body).toBe("<p>new</p>");
    expect(result.initiative.revision).toBe(2);
    expect(result.initiative.handle).toBe(created.handle);
  });

  it("rejects stale updates with revision_conflict", () => {
    const created = createInitiative({ title: "v1" }, db);
    const first = updateInitiative(
      { id: created.id, expectedRevision: 1, title: "v2" },
      db,
    );
    expect(first.ok).toBe(true);
    const stale = updateInitiative(
      { id: created.id, expectedRevision: 1, title: "v3-stale" },
      db,
    );
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.reason).toBe("revision_conflict");
    if (stale.reason !== "revision_conflict") return;
    expect(stale.current.revision).toBe(2);
    expect(stale.current.title).toBe("v2");
  });

  it("lists only requested lifecycle", () => {
    createInitiative({ title: "idea-one" }, db);
    createInitiative({ title: "idea-two" }, db);
    const ideas = listInitiatives({ lifecycle: "idea" }, db);
    expect(ideas).toHaveLength(2);
    expect(listInitiatives({ lifecycle: "design" }, db)).toHaveLength(0);
  });

  it("hard-deletes and appends a tombstone 'delete' event", () => {
    const created = createInitiative({ title: "to-delete" }, db);
    const result = deleteInitiative(
      { id: created.id, expectedRevision: created.revision },
      db,
    );
    expect(result.ok).toBe(true);
    expect(getInitiative(created.id, db)).toBeNull();
    const tombstones = listDeletedEvents(db);
    expect(tombstones).toHaveLength(1);
    expect(tombstones[0]).toMatchObject({
      kind: "delete",
      by: "shaun",
      payload: { handle: created.handle },
    });
  });

  it("rejects stale deletes with revision_conflict", () => {
    const created = createInitiative({ title: "still-here" }, db);
    const update = updateInitiative(
      { id: created.id, expectedRevision: 1, title: "bumped" },
      db,
    );
    expect(update.ok).toBe(true);
    const result = deleteInitiative(
      { id: created.id, expectedRevision: 1 },
      db,
    );
    expect(result.ok).toBe(false);
    expect(getInitiative(created.id, db)).not.toBeNull();
  });
});
