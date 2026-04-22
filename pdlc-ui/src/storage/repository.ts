import { randomUUID } from "node:crypto";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import {
  eventSchema,
  missingForCompleteBrief,
  type BriefState,
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
import {
  validateBriefWizardAnswers,
  type BriefWizardAnswersInput,
} from "@/lib/brief-wizard-validation";
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
  brief: BriefState;
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
  /** Optional list position in the destination lane (omit → null in DB). */
  sortOrder?: number;
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

  const nextSortOrder =
    typeof input.sortOrder === "number" && Number.isFinite(input.sortOrder)
      ? Math.trunc(input.sortOrder)
      : null;

  const result = db
    .update(initiatives)
    .set({
      lifecycle: input.to,
      parkedIntent: nextParkedIntent,
      parkedReason: nextParkedReason,
      // Explicit `sortOrder` from the client (DnD / menu placement). When
      // omitted, clear to null so `listInitiatives` orders by createdAt among
      // null rows — which no longer matches "where I dropped" once lanes mix
      // explicit reorder keys with nulls; callers that care pass `sortOrder`.
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

// ────────────────────────────────────────────────────────────────────────────
// Sprint 3 — atomic brief save + idea → discovery (single revision bump)
// ────────────────────────────────────────────────────────────────────────────

export type { BriefWizardAnswersInput } from "@/lib/brief-wizard-validation";

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function envelopeString(value: string, at: string, by: string) {
  return {
    value,
    confidence: "high" as const,
    source: "user" as const,
    reviewedBy: by,
    reviewedAt: at,
    updatedAt: at,
  };
}

function envelopeStringList(values: string[], at: string, by: string) {
  return {
    value: values,
    confidence: "high" as const,
    source: "user" as const,
    reviewedBy: by,
    reviewedAt: at,
    updatedAt: at,
  };
}

function buildBriefStateFromAnswers(
  answers: BriefWizardAnswersInput,
  by: string,
  at: string,
): BriefState {
  // Wizard now ships only the 3 required content fields + a summary.
  // Legacy optional fields are still accepted on the wire (S3A.1 Q1 option b)
  // and re-emitted as empty envelopes when present so downstream consumers
  // (export pack, BriefPanel) keep their stable read shape.
  const scopeIn = (answers.scopeIn ?? []).map((s) => s.trim()).filter(Boolean);
  const scopeOut = (answers.scopeOut ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
  const assumptionsText = (answers.assumptions ?? [])
    .map((s) => s.trim())
    .filter(Boolean);
  const constraintsValue = answers.constraints ?? "<p></p>";
  const constraintsHtml =
    textFromHtml(constraintsValue).length > 0 ? constraintsValue : "<p></p>";
  const successValue = answers.successDefinition ?? "<p></p>";
  const successHtml =
    textFromHtml(successValue).length > 0 ? successValue : "<p></p>";
  const summaryValue = answers.understandingSummary ?? "<p></p>";
  const summaryHtml =
    textFromHtml(summaryValue).length > 0 ? summaryValue : "<p></p>";
  return {
    problem: envelopeString(answers.problem, at, by),
    targetUsers: envelopeString(answers.targetUsers, at, by),
    coreValue: envelopeString(answers.coreValue, at, by),
    successDefinition: envelopeString(successHtml, at, by),
    constraints: envelopeString(constraintsHtml, at, by),
    scopeIn: envelopeStringList(scopeIn, at, by),
    scopeOut: envelopeStringList(scopeOut, at, by),
    assumptions: assumptionsText.map((text) => ({
      text,
      validation: null,
      confidence: "high" as const,
      source: "user" as const,
      reviewedBy: by,
    })),
    understandingSummary: envelopeString(summaryHtml, at, by),
    complete: true,
    reviewedAt: at,
    reviewedBy: by,
  };
}

/**
 * Merge any wizard-supplied open-question drafts into `discovery.openQuestions`.
 * Tolerates `lines === undefined` (Q1 option b — the S3A.1 wizard no longer
 * surfaces an open-questions step). When undefined or empty, returns the
 * discovery object unchanged so no `openQuestions` field is invented and no
 * spurious `field_edit` shape leaks downstream.
 */
function mergeDiscoveryDraftQuestions(
  discovery: Record<string, unknown>,
  lines: string[] | undefined,
  by: string,
): Record<string, unknown> {
  if (!lines || lines.length === 0) return discovery;
  const additions = lines
    .map((t) => t.trim())
    .filter(Boolean)
    .map((text) => ({
      id: `oq-${randomUUID()}`,
      text,
      owner: by,
      status: "open" as const,
      answer: null,
      answeredAt: null,
      source: "user" as const,
      sourceRef: null,
    }));
  if (additions.length === 0) return discovery;
  const prev = Array.isArray(discovery.openQuestions)
    ? (discovery.openQuestions as unknown[])
    : [];
  return { ...discovery, openQuestions: [...prev, ...additions] };
}

function nextPdlcBriefIteration(events: InitiativeEvent[]): number {
  let max = 0;
  for (const e of events) {
    if (e.kind === "skill_run" && e.payload.skill === "pdlc-brief-custom") {
      max = Math.max(max, e.payload.iteration);
    }
  }
  return max + 1;
}

export type SaveBriefAndTransitionInput = {
  id: string;
  expectedRevision: number;
  answers: BriefWizardAnswersInput;
  by?: string;
  now?: Date;
};

export type SaveBriefAndTransitionResult =
  | { ok: true; initiative: Initiative }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "revision_conflict"; current: Initiative }
  | {
      ok: false;
      reason: "missing_required_fields";
      fields: string[];
      current: Initiative;
    }
  | { ok: false; reason: CanTransitionReason; current: Initiative };

/**
 * Atomically writes `brief.*` (full envelope + `complete: true`), merges
 * discovery open-question drafts, appends `skill_run` + `stage_transition`,
 * moves `idea → discovery`, bumps `revision` once.
 */
export function saveBriefAndTransition(
  input: SaveBriefAndTransitionInput,
  db: Drizzle = openDrizzle(),
): SaveBriefAndTransitionResult {
  const existing = getInitiative(input.id, db);
  if (!existing) return { ok: false, reason: "not_found" };
  if (existing.revision !== input.expectedRevision) {
    return { ok: false, reason: "revision_conflict", current: existing };
  }
  if (existing.lifecycle !== "idea") {
    return {
      ok: false,
      reason: "illegal_transition",
      current: existing,
    };
  }

  const now = (input.now ?? new Date()).toISOString();
  const by = input.by ?? "shaun";

  const missing = validateBriefWizardAnswers(input.answers);
  if (missing.length > 0) {
    return {
      ok: false,
      reason: "missing_required_fields",
      fields: missing,
      current: existing,
    };
  }

  const nextBrief = buildBriefStateFromAnswers(input.answers, by, now);

  // Server-side belt-and-braces: even if a malformed payload slips past the
  // wizard validator, never persist `complete: true` with a missing required
  // envelope. Mirrors `briefSchema.superRefine` (single source of truth).
  const refineMissing = missingForCompleteBrief(nextBrief);
  if (refineMissing.length > 0) {
    return {
      ok: false,
      reason: "missing_required_fields",
      fields: refineMissing,
      current: existing,
    };
  }

  const existingDiscovery =
    (existing.discovery as Record<string, unknown>) ?? {};
  const nextDiscovery = mergeDiscoveryDraftQuestions(
    existingDiscovery,
    input.answers.openQuestions,
    by,
  );

  const draftInitiative: Initiative = {
    ...existing,
    brief: nextBrief,
    discovery: nextDiscovery,
  };

  const gate = canTransition("idea", "discovery", {
    hasBrief: deriveHasBrief(draftInitiative),
    parkedIntent: null,
    parkedReason: null,
  });
  if (!gate.ok) {
    return {
      ok: false,
      reason: gate.reason,
      current: existing,
    };
  }

  const iteration = nextPdlcBriefIteration(existing.events);
  const skillRun: InitiativeEvent = eventSchema.parse({
    at: now,
    by,
    kind: "skill_run",
    payload: { skill: "pdlc-brief-custom", iteration },
  });
  const stageTx: InitiativeEvent = eventSchema.parse({
    at: now,
    by,
    kind: "stage_transition",
    payload: { from: "idea", to: "discovery" },
  });

  const nextEvents = [...existing.events, skillRun, stageTx];
  const nextData = JSON.stringify({
    gate: existing.gate,
    brief: nextBrief,
    discovery: nextDiscovery,
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
      lifecycle: "discovery",
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
 * Test / seeding helper: write a **minimum viable completed brief** so S2/S3
 * gates pass without running the wizard. Not exposed via API; used in tests
 * and Playwright e2e (`PDLC_ALLOW_TEST_HELPERS=1`).
 */
export function seedBriefForTesting(
  id: string,
  db: Drizzle = openDrizzle(),
): Initiative | null {
  const existing = getInitiative(id, db);
  if (!existing) return null;
  const at = new Date().toISOString();
  const by = "shaun";
  const seededBrief: BriefState = {
    problem: {
      value: "<p>seed problem</p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    targetUsers: {
      value: "<p>seed users</p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    coreValue: {
      value: "<p>seed value</p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    successDefinition: {
      value: "<p>seed success</p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    constraints: {
      value: "<p></p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    scopeIn: {
      value: ["seed scope in"],
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    scopeOut: {
      value: [],
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    assumptions: [
      {
        text: "seed assumption",
        validation: null,
        confidence: "high",
        source: "user",
        reviewedBy: by,
      },
    ],
    understandingSummary: {
      value: "<p></p>",
      confidence: "high",
      source: "user",
      reviewedBy: by,
      reviewedAt: at,
      updatedAt: at,
    },
    complete: true,
    reviewedAt: at,
    reviewedBy: by,
  };
  const nextData = JSON.stringify({
    gate: existing.gate,
    brief: seededBrief,
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
