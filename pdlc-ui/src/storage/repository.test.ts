import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import type { Lifecycle } from "@/schema/initiative";
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
  reorderInitiative,
  saveBriefAndTransition,
  seedBriefForTesting,
  transitionInitiative,
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

describe("repository — transitionInitiative (S2)", () => {
  it("blocks idea → discovery without a brief (brief_required)", () => {
    const created = createInitiative({ title: "no brief" }, db);
    const result = transitionInitiative(
      { id: created.id, expectedRevision: 1, to: "discovery" },
      db,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("brief_required");
    const current = getInitiative(created.id, db);
    expect(current?.lifecycle).toBe("idea");
    expect(current?.revision).toBe(1);
  });

  it("advances idea → discovery once the brief is seeded", () => {
    const created = createInitiative({ title: "ready" }, db);
    const seeded = seedBriefForTesting(created.id, db);
    expect(seeded?.revision).toBe(2);
    const result = transitionInitiative(
      { id: created.id, expectedRevision: seeded!.revision, to: "discovery" },
      db,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.initiative.lifecycle).toBe("discovery");
    expect(result.initiative.revision).toBe(seeded!.revision + 1);
    const txEvent = result.initiative.events.at(-1);
    expect(txEvent?.kind).toBe("stage_transition");
    expect(txEvent?.payload).toMatchObject({ from: "idea", to: "discovery" });
  });

  it("walks the full forward chain once seeded", () => {
    const created = createInitiative({ title: "forward" }, db);
    let rev = seedBriefForTesting(created.id, db)!.revision;
    const chain: Lifecycle[] = [
      "discovery",
      "design",
      "spec_ready",
      "develop",
      "uat",
      "deployed",
    ];
    for (const to of chain) {
      const result = transitionInitiative(
        { id: created.id, expectedRevision: rev, to },
        db,
      );
      expect(result.ok, `-> ${to}`).toBe(true);
      if (!result.ok) return;
      expect(result.initiative.lifecycle).toBe(to);
      rev = result.initiative.revision;
    }
  });

  it("rejects parked without intent/reason", () => {
    const created = createInitiative({ title: "to-park" }, db);
    const result = transitionInitiative(
      { id: created.id, expectedRevision: 1, to: "parked" },
      db,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("parked_requires_intent_and_reason");
  });

  it("parks with intent + reason and clears them on un-park", () => {
    const created = createInitiative({ title: "park-me" }, db);
    const parked = transitionInitiative(
      {
        id: created.id,
        expectedRevision: 1,
        to: "parked",
        parkedIntent: "revisit",
        parkedReason: "  waiting for Q3  ",
      },
      db,
    );
    expect(parked.ok).toBe(true);
    if (!parked.ok) return;
    expect(parked.initiative.lifecycle).toBe("parked");
    expect(parked.initiative.parkedIntent).toBe("revisit");
    expect(parked.initiative.parkedReason).toBe("waiting for Q3");

    const unparked = transitionInitiative(
      {
        id: created.id,
        expectedRevision: parked.initiative.revision,
        to: "idea",
      },
      db,
    );
    expect(unparked.ok).toBe(true);
    if (!unparked.ok) return;
    expect(unparked.initiative.lifecycle).toBe("idea");
    expect(unparked.initiative.parkedIntent).toBeNull();
    expect(unparked.initiative.parkedReason).toBeNull();
  });

  it("rejects illegal skip transitions (idea → design)", () => {
    const created = createInitiative({ title: "skipper" }, db);
    seedBriefForTesting(created.id, db);
    const result = transitionInitiative(
      { id: created.id, expectedRevision: 2, to: "design" },
      db,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("illegal_transition");
  });

  it("returns revision_conflict on stale transitions", () => {
    const created = createInitiative({ title: "stale" }, db);
    seedBriefForTesting(created.id, db);
    const first = transitionInitiative(
      { id: created.id, expectedRevision: 2, to: "discovery" },
      db,
    );
    expect(first.ok).toBe(true);
    const stale = transitionInitiative(
      { id: created.id, expectedRevision: 2, to: "design" },
      db,
    );
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.reason).toBe("revision_conflict");
  });

  it("returns not_found for unknown ids", () => {
    const result = transitionInitiative(
      { id: "missing", expectedRevision: 1, to: "discovery" },
      db,
    );
    expect(result).toEqual({ ok: false, reason: "not_found" });
  });
});

function completeBriefAnswers() {
  return {
    problem: "<p>Problem text</p>",
    targetUsers: "<p>Users</p>",
    coreValue: "<p>Value</p>",
    successDefinition: "<p>Success</p>",
    constraints: "<p></p>",
    scopeIn: ["alpha"],
    scopeOut: [],
    assumptions: ["assume one"],
    understandingSummary: "<p></p>",
    openQuestions: [],
  };
}

describe("repository — saveBriefAndTransition (S3)", () => {
  it("rejects missing required fields with missing_required_fields", () => {
    const created = createInitiative({ title: "brief-missing" }, db);
    const answers = { ...completeBriefAnswers(), problem: "<p></p>" };
    const result = saveBriefAndTransition(
      { id: created.id, expectedRevision: 1, answers },
      db,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("missing_required_fields");
    if (result.reason !== "missing_required_fields") return;
    expect(result.fields).toContain("problem");
    expect(getInitiative(created.id, db)?.revision).toBe(1);
  });

  it("bumps revision once, moves to discovery, appends skill_run then stage_transition", () => {
    const created = createInitiative({ title: "brief-ok" }, db);
    const result = saveBriefAndTransition(
      { id: created.id, expectedRevision: 1, answers: completeBriefAnswers() },
      db,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.initiative.revision).toBe(2);
    expect(result.initiative.lifecycle).toBe("discovery");
    expect(result.initiative.brief.complete).toBe(true);
    const tail = result.initiative.events.slice(-2);
    expect(tail.map((e) => e.kind)).toEqual(["skill_run", "stage_transition"]);
    if (tail[0]?.kind === "skill_run") {
      expect(tail[0].payload).toEqual({
        skill: "pdlc-brief-custom",
        iteration: 1,
      });
    }
  });

  it("returns revision_conflict when revision is stale", () => {
    const created = createInitiative({ title: "brief-stale" }, db);
    updateInitiative(
      { id: created.id, expectedRevision: 1, title: "bumped" },
      db,
    );
    const result = saveBriefAndTransition(
      { id: created.id, expectedRevision: 1, answers: completeBriefAnswers() },
      db,
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.reason).toBe("revision_conflict");
  });

  it("rejects when not in idea lane", () => {
    const created = createInitiative({ title: "not-idea" }, db);
    saveBriefAndTransition(
      { id: created.id, expectedRevision: 1, answers: completeBriefAnswers() },
      db,
    );
    const inDiscovery = getInitiative(created.id, db);
    expect(inDiscovery?.lifecycle).toBe("discovery");
    const again = saveBriefAndTransition(
      {
        id: created.id,
        expectedRevision: inDiscovery!.revision,
        answers: completeBriefAnswers(),
      },
      db,
    );
    expect(again.ok).toBe(false);
    if (again.ok) return;
    expect(again.reason).toBe("illegal_transition");
  });
});

describe("repository — reorderInitiative (S2)", () => {
  it("persists sortOrder, bumps revision, appends field_edit", () => {
    const created = createInitiative({ title: "dragme" }, db);
    const result = reorderInitiative(
      { id: created.id, expectedRevision: 1, sortOrder: 1500 },
      db,
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.initiative.sortOrder).toBe(1500);
    expect(result.initiative.revision).toBe(2);
    const last = result.initiative.events.at(-1);
    expect(last?.kind).toBe("field_edit");
    expect(last?.payload).toMatchObject({
      field: "sortOrder",
      before: null,
      after: 1500,
    });
  });

  it("rejects stale reorders with revision_conflict", () => {
    const created = createInitiative({ title: "conflict" }, db);
    reorderInitiative(
      { id: created.id, expectedRevision: 1, sortOrder: 1000 },
      db,
    );
    const stale = reorderInitiative(
      { id: created.id, expectedRevision: 1, sortOrder: 2000 },
      db,
    );
    expect(stale.ok).toBe(false);
    if (stale.ok) return;
    expect(stale.reason).toBe("revision_conflict");
  });

  it("orders lanes by sort_order ASC then created_at DESC", () => {
    const t0 = new Date("2026-04-21T10:00:00.000Z");
    const t1 = new Date("2026-04-21T10:00:01.000Z");
    const t2 = new Date("2026-04-21T10:00:02.000Z");
    const a = createInitiative({ title: "a", now: t0 }, db);
    const b = createInitiative({ title: "b", now: t1 }, db);
    const c = createInitiative({ title: "c", now: t2 }, db);
    // Pin c at the top of the idea lane.
    reorderInitiative({ id: c.id, expectedRevision: 1, sortOrder: 100 }, db);
    const ideas = listInitiatives({ lifecycle: "idea" }, db);
    // sort_order-first (c), then tied-null entries by created_at DESC (b before a).
    expect(ideas.map((i) => i.id)).toEqual([c.id, b.id, a.id]);
  });
});
