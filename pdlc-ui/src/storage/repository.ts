import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import {
  eventSchema,
  type Initiative,
  type InitiativeEvent,
  type Lifecycle,
  emptyInitiativeStages,
  initiativeSchema,
} from "@/schema/initiative";
import {
  canTransition,
  type CanTransitionReason,
  deriveHasBrief,
} from "@/lib/can-transition";
import { type Drizzle, openDrizzle } from "./db";
import { deletedInitiativeEvents, initiatives } from "./schema";

/**
 * Repository for `initiatives`. Single-writer assumption (see OPERATIONS.md):
 * one Next.js process owns the DB file; WAL + busy_timeout absorb overlapping
 * readers and the occasional overlapping writer.
 *
 * Optimistic lock contract: callers pass `expectedRevision`; stale updates
 * return `{ conflict: true }` and MUST NOT mutate the row.
 *
 * Query surface uses Drizzle ORM per ADR-0001. Migrations remain raw SQL
 * (`src/storage/migrations/*.sql`); any schema change requires matching edits
 * in both `migrations/` and `schema.ts` in the same PR.
 */

type DrizzleRow = typeof initiatives.$inferSelect;

type ExtraFields = {
  gate: Record<string, unknown>;
  brief: Record<string, unknown>;
  discovery: Record<string, unknown>;
  design: Record<string, unknown>;
  spec: Record<string, unknown>;
  release: Record<string, unknown>;
  sourceRefs: Record<string, unknown>[];
  attachments: Record<string, unknown>[];
  events: InitiativeEvent[];
  linkedPrdPath: string | null;
  strategyPillarIds: string[];
  strategyWarning: string | null;
};

function emptyExtras(): ExtraFields {
  return {
    ...emptyInitiativeStages(),
    sourceRefs: [],
    attachments: [],
    events: [],
    linkedPrdPath: null,
    strategyPillarIds: [],
    strategyWarning: null,
  };
}

function rowToInitiative(row: DrizzleRow): Initiative {
  const extras = JSON.parse(row.data) as Partial<ExtraFields>;
  const base = { ...emptyExtras(), ...extras };
  const initiative: Initiative = {
    schemaVersion: 1,
    revision: row.revision,
    id: row.id,
    handle: row.handle,
    title: row.title,
    body: row.body,
    lifecycle: row.lifecycle as Lifecycle,
    parkedIntent: row.parkedIntent as Initiative["parkedIntent"],
    parkedReason: row.parkedReason,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    gate: base.gate,
    brief: base.brief,
    discovery: base.discovery,
    design: base.design,
    spec: base.spec,
    release: base.release,
    sourceRefs: base.sourceRefs,
    attachments: base.attachments,
    events: base.events,
    linkedPrdPath: base.linkedPrdPath,
    strategyPillarIds: base.strategyPillarIds,
    strategyWarning: base.strategyWarning,
  };
  // Defensive parse — guarantees we never leak a malformed row to the UI/API.
  return initiativeSchema.parse(initiative);
}

export function nextHandle(db: Drizzle): string {
  const rows = db
    .select({ handle: initiatives.handle })
    .from(initiatives)
    .orderBy(desc(sql`CAST(substr(${initiatives.handle}, 6) AS INTEGER)`))
    .limit(1)
    .all();
  const last = rows[0]?.handle;
  const lastNum = last ? Number.parseInt(last.slice(5), 10) : 0;
  const next = Number.isFinite(lastNum) ? lastNum + 1 : 1;
  return `INIT-${String(next).padStart(4, "0")}`;
}

export function listInitiatives(
  options: { lifecycle?: Lifecycle } = {},
  db: Drizzle = openDrizzle(),
): Initiative[] {
  // Order: user-placed cards first by sort_order ASC, then un-reordered cards
  // by created_at DESC (newest on top of a lane until someone drags them).
  // SQLite sorts NULLs first by default; `sort_order IS NULL` inverts that.
  const orderBy = [
    sql`(${initiatives.sortOrder} IS NULL)`,
    asc(initiatives.sortOrder),
    desc(initiatives.createdAt),
  ];
  const baseQuery = db.select().from(initiatives);
  const rows = options.lifecycle
    ? baseQuery
        .where(eq(initiatives.lifecycle, options.lifecycle))
        .orderBy(...orderBy)
        .all()
    : baseQuery.orderBy(...orderBy).all();
  return rows.map(rowToInitiative);
}

export function getInitiative(
  id: string,
  db: Drizzle = openDrizzle(),
): Initiative | null {
  const row = db.select().from(initiatives).where(eq(initiatives.id, id)).get();
  return row ? rowToInitiative(row) : null;
}

export type CreateInput = {
  title: string;
  body?: string;
  by?: string;
  now?: Date;
};

export function createInitiative(
  input: CreateInput,
  db: Drizzle = openDrizzle(),
): Initiative {
  const title = input.title.trim();
  if (title.length === 0) {
    throw new Error("title_required");
  }
  const now = (input.now ?? new Date()).toISOString();
  const by = input.by ?? "shaun";
  const body = input.body ?? "";
  const id = randomUUID();

  const createdId = db.transaction((tx) => {
    const handle = nextHandle(tx);
    const extras = emptyExtras();
    extras.events.push({
      at: now,
      by,
      kind: "create",
      payload: { handle },
    });
    tx.insert(initiatives)
      .values({
        id,
        handle,
        title,
        body,
        lifecycle: "idea",
        revision: 1,
        createdAt: now,
        updatedAt: now,
        data: JSON.stringify(extras),
      })
      .run();
    return id;
  });
  const created = getInitiative(createdId, db);
  if (!created) {
    throw new Error("create_failed");
  }
  return created;
}

export type UpdateInput = {
  id: string;
  expectedRevision: number;
  title?: string;
  body?: string;
  by?: string;
  now?: Date;
};

export type UpdateResult =
  | { ok: true; initiative: Initiative }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "revision_conflict"; current: Initiative };

export function updateInitiative(
  input: UpdateInput,
  db: Drizzle = openDrizzle(),
): UpdateResult {
  const now = (input.now ?? new Date()).toISOString();
  const existing = getInitiative(input.id, db);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.revision !== input.expectedRevision) {
    return { ok: false, reason: "revision_conflict", current: existing };
  }

  const nextTitle =
    input.title !== undefined ? input.title.trim() : existing.title;
  if (nextTitle.length === 0) {
    throw new Error("title_required");
  }
  const nextBody = input.body !== undefined ? input.body : existing.body;
  void input.by; // reserved for future field_edit events

  const result = db
    .update(initiatives)
    .set({
      title: nextTitle,
      body: nextBody,
      revision: sql`${initiatives.revision} + 1`,
      updatedAt: now,
    })
    .where(
      and(
        eq(initiatives.id, input.id),
        eq(initiatives.revision, input.expectedRevision),
      ),
    )
    .run();

  if (result.changes === 0) {
    const current = getInitiative(input.id, db);
    if (!current) return { ok: false, reason: "not_found" };
    return { ok: false, reason: "revision_conflict", current };
  }
  const updated = getInitiative(input.id, db);
  if (!updated) return { ok: false, reason: "not_found" };
  return { ok: true, initiative: updated };
}

export type DeleteInput = {
  id: string;
  expectedRevision: number;
  by?: string;
  now?: Date;
  note?: string;
};

export type DeleteResult =
  | { ok: true; deleted: { id: string; handle: string } }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "revision_conflict"; current: Initiative };

/**
 * Hard delete (S1 Bar A decision). Appends a `delete` event to a per-session
 * audit log BEFORE the row is removed so the audit trail survives deletion.
 */
export function deleteInitiative(
  input: DeleteInput,
  db: Drizzle = openDrizzle(),
): DeleteResult {
  const existing = getInitiative(input.id, db);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.revision !== input.expectedRevision) {
    return { ok: false, reason: "revision_conflict", current: existing };
  }
  const now = (input.now ?? new Date()).toISOString();
  const by = input.by ?? "shaun";
  const event: InitiativeEvent = {
    at: now,
    by,
    kind: "delete",
    payload: {
      handle: existing.handle,
      ...(input.note ? { note: input.note } : {}),
    },
  };
  // Validate the event so we fail loudly if the contract changes.
  eventSchema.parse(event);
  appendDeletedEvent(event, db);

  const result = db
    .delete(initiatives)
    .where(
      and(
        eq(initiatives.id, input.id),
        eq(initiatives.revision, input.expectedRevision),
      ),
    )
    .run();
  if (result.changes === 0) {
    const current = getInitiative(input.id, db);
    if (!current) return { ok: false, reason: "not_found" };
    return { ok: false, reason: "revision_conflict", current };
  }
  return { ok: true, deleted: { id: existing.id, handle: existing.handle } };
}

/** Append a tombstone event for a hard-deleted initiative (see 002_deleted_events.sql). */
function appendDeletedEvent(event: InitiativeEvent, db: Drizzle): void {
  db.insert(deletedInitiativeEvents)
    .values({
      at: event.at,
      by: event.by,
      kind: event.kind,
      payload: JSON.stringify(event.payload),
    })
    .run();
}

/**
 * Read the tombstone audit trail. Returns events newest-first. Exported for
 * tests + future audit view; the current UI does not surface this yet.
 */
export function listDeletedEvents(
  db: Drizzle = openDrizzle(),
): InitiativeEvent[] {
  const rows = db
    .select()
    .from(deletedInitiativeEvents)
    .orderBy(desc(deletedInitiativeEvents.at))
    .all();
  return rows.map((r) =>
    eventSchema.parse({
      at: r.at,
      by: r.by,
      kind: r.kind,
      payload: JSON.parse(r.payload),
    }),
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sprint 2 — stage transitions + lane reordering
// ────────────────────────────────────────────────────────────────────────────

export type TransitionInput = {
  id: string;
  expectedRevision: number;
  to: Lifecycle;
  parkedIntent?: "revisit" | "wont_consider" | null;
  parkedReason?: string | null;
  note?: string;
  by?: string;
  now?: Date;
};

export type TransitionResult =
  | { ok: true; initiative: Initiative }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "revision_conflict"; current: Initiative }
  | { ok: false; reason: CanTransitionReason; current: Initiative };

/**
 * Move an initiative forward through the lifecycle. Enforces `canTransition`
 * (pure function in `@/lib/can-transition`) so the HTTP layer and UI menu
 * logic agree on legality. Appends a `stage_transition` event; clears parked
 * fields on `parked → idea`.
 */
export function transitionInitiative(
  input: TransitionInput,
  db: Drizzle = openDrizzle(),
): TransitionResult {
  const existing = getInitiative(input.id, db);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.revision !== input.expectedRevision) {
    return { ok: false, reason: "revision_conflict", current: existing };
  }

  const from = existing.lifecycle;
  const gate = canTransition(from, input.to, {
    hasBrief: deriveHasBrief(existing),
    parkedIntent: input.parkedIntent ?? null,
    parkedReason: input.parkedReason ?? null,
  });
  if (!gate.ok) {
    return { ok: false, reason: gate.reason, current: existing };
  }

  const now = (input.now ?? new Date()).toISOString();
  const by = input.by ?? "shaun";
  const isParking = input.to === "parked";
  const isUnParking = from === "parked" && input.to === "idea";

  const payload: Record<string, unknown> = { from, to: input.to };
  if (input.note) payload.note = input.note;
  if (isParking) {
    payload.parkedIntent = input.parkedIntent;
    payload.parkedReason = (input.parkedReason ?? "").trim();
  }
  const event: InitiativeEvent = eventSchema.parse({
    at: now,
    by,
    kind: "stage_transition",
    payload,
  });

  const nextEvents = [...existing.events, event];
  const nextParkedIntent = isParking
    ? (input.parkedIntent ?? null)
    : isUnParking
      ? null
      : existing.parkedIntent;
  const nextParkedReason = isParking
    ? (input.parkedReason ?? "").trim() || null
    : isUnParking
      ? null
      : existing.parkedReason;

  const nextData = JSON.stringify({
    gate: existing.gate,
    brief: existing.brief,
    discovery: existing.discovery,
    design: existing.design,
    spec: existing.spec,
    release: existing.release,
    sourceRefs: existing.sourceRefs,
    attachments: existing.attachments,
    events: nextEvents,
    linkedPrdPath: existing.linkedPrdPath,
    strategyPillarIds: existing.strategyPillarIds,
    strategyWarning: existing.strategyWarning,
  });

  const result = db
    .update(initiatives)
    .set({
      lifecycle: input.to,
      parkedIntent: nextParkedIntent,
      parkedReason: nextParkedReason,
      // New lane placement: clear sortOrder so the card lands at the top of
      // the destination lane (NULLs are ordered last → newest by createdAt).
      sortOrder: null,
      revision: sql`${initiatives.revision} + 1`,
      updatedAt: now,
      data: nextData,
    })
    .where(
      and(
        eq(initiatives.id, input.id),
        eq(initiatives.revision, input.expectedRevision),
      ),
    )
    .run();

  if (result.changes === 0) {
    const current = getInitiative(input.id, db);
    if (!current) return { ok: false, reason: "not_found" };
    return { ok: false, reason: "revision_conflict", current };
  }

  const updated = getInitiative(input.id, db);
  if (!updated) return { ok: false, reason: "not_found" };
  return { ok: true, initiative: updated };
}

export type ReorderInput = {
  id: string;
  expectedRevision: number;
  sortOrder: number;
  by?: string;
  now?: Date;
};

export type ReorderResult =
  | { ok: true; initiative: Initiative }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "revision_conflict"; current: Initiative };

/**
 * Update a card's `sort_order` within its lane. Midpoint allocation is the
 * caller's responsibility (the UI computes `(prev + next) / 2` on drop);
 * the repository just persists the value, bumps the revision, and appends
 * a `field_edit` event so the audit log shows who reordered when.
 */
export function reorderInitiative(
  input: ReorderInput,
  db: Drizzle = openDrizzle(),
): ReorderResult {
  if (!Number.isFinite(input.sortOrder)) {
    throw new Error("sort_order_not_finite");
  }
  const nextSortOrder = Math.trunc(input.sortOrder);

  const existing = getInitiative(input.id, db);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.revision !== input.expectedRevision) {
    return { ok: false, reason: "revision_conflict", current: existing };
  }

  const now = (input.now ?? new Date()).toISOString();
  const by = input.by ?? "shaun";

  const event: InitiativeEvent = eventSchema.parse({
    at: now,
    by,
    kind: "field_edit",
    payload: {
      field: "sortOrder",
      before: existing.sortOrder,
      after: nextSortOrder,
    },
  });

  const nextEvents = [...existing.events, event];
  const nextData = JSON.stringify({
    gate: existing.gate,
    brief: existing.brief,
    discovery: existing.discovery,
    design: existing.design,
    spec: existing.spec,
    release: existing.release,
    sourceRefs: existing.sourceRefs,
    attachments: existing.attachments,
    events: nextEvents,
    linkedPrdPath: existing.linkedPrdPath,
    strategyPillarIds: existing.strategyPillarIds,
    strategyWarning: existing.strategyWarning,
  });

  const result = db
    .update(initiatives)
    .set({
      sortOrder: nextSortOrder,
      revision: sql`${initiatives.revision} + 1`,
      updatedAt: now,
      data: nextData,
    })
    .where(
      and(
        eq(initiatives.id, input.id),
        eq(initiatives.revision, input.expectedRevision),
      ),
    )
    .run();

  if (result.changes === 0) {
    const current = getInitiative(input.id, db);
    if (!current) return { ok: false, reason: "not_found" };
    return { ok: false, reason: "revision_conflict", current };
  }

  const updated = getInitiative(input.id, db);
  if (!updated) return { ok: false, reason: "not_found" };
  return { ok: true, initiative: updated };
}

/**
 * Test / seeding helper: mark the brief stage as populated so S2 flows can
 * exercise forward moves without the S3 wizard. Not exposed via API; used
 * only in tests and Playwright e2e global setup.
 */
export function seedBriefForTesting(
  id: string,
  db: Drizzle = openDrizzle(),
): Initiative | null {
  const existing = getInitiative(id, db);
  if (!existing) return null;
  const nextData = JSON.stringify({
    gate: existing.gate,
    brief: { problem: { value: "seed", source: "user" } },
    discovery: existing.discovery,
    design: existing.design,
    spec: existing.spec,
    release: existing.release,
    sourceRefs: existing.sourceRefs,
    attachments: existing.attachments,
    events: existing.events,
    linkedPrdPath: existing.linkedPrdPath,
    strategyPillarIds: existing.strategyPillarIds,
    strategyWarning: existing.strategyWarning,
  });
  db.update(initiatives)
    .set({
      data: nextData,
      revision: sql`${initiatives.revision} + 1`,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(initiatives.id, id))
    .run();
  return getInitiative(id, db);
}
