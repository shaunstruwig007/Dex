import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Drizzle schema mirrors the hand-written SQL in `src/storage/migrations/`.
 * Migrations stay raw SQL (simpler to review and roll forward); Drizzle owns
 * the typed query surface only. Any column change requires:
 *   1. a new `NNN_description.sql` migration under `src/storage/migrations/`,
 *   2. matching edits here,
 *   3. `npm run schema:validate` + Vitest green,
 * all in the same PR (R16 guardrail 1).
 */

export const initiatives = sqliteTable(
  "initiatives",
  {
    id: text("id").primaryKey(),
    handle: text("handle").notNull().unique(),
    title: text("title").notNull(),
    body: text("body").notNull().default(""),
    lifecycle: text("lifecycle").notNull().default("idea"),
    parkedIntent: text("parked_intent"),
    parkedReason: text("parked_reason"),
    revision: integer("revision").notNull().default(1),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    // Nullable — new cards land at the top of a lane (NULLS LAST) until a human
    // reorders via drag-to-reorder. Populated by reorderInitiative().
    sortOrder: integer("sort_order"),
    // JSON blob for non-queryable nested fields (gate/brief/discovery/design/
    // spec/release, sourceRefs, attachments, events, linkedPrdPath,
    // strategyPillarIds, strategyWarning). Repository serialises via
    // JSON.stringify; validated against initiativeSchema on read.
    data: text("data").notNull().default("{}"),
  },
  (t) => [
    index("idx_initiatives_lifecycle").on(t.lifecycle),
    index("idx_initiatives_created_at").on(t.createdAt),
    index("idx_initiatives_lifecycle_sort").on(
      t.lifecycle,
      t.sortOrder,
      t.createdAt,
    ),
  ],
);

export const deletedInitiativeEvents = sqliteTable(
  "deleted_initiative_events",
  {
    at: text("at").notNull(),
    by: text("by").notNull(),
    kind: text("kind").notNull(),
    payload: text("payload").notNull(),
  },
  (t) => [index("idx_deleted_events_at").on(t.at)],
);

export const schemaMigrations = sqliteTable("schema_migrations", {
  version: integer("version").primaryKey(),
  name: text("name").notNull(),
  appliedAt: text("applied_at").notNull(),
});
