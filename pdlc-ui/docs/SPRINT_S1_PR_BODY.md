# Sprint S1 — Idea capture + persistence

**Branch:** `feat/s1-idea-capture` → `main`
**Bar:** A

Cites: [plans/PDLC_UI/sprint-backlog.md § Sprint 1](../../plans/PDLC_UI/sprint-backlog.md#sprint-1--idea-capture--persistence-2-weeks), [plans/PDLC_UI/seeds/s1-idea-capture.md](../../plans/PDLC_UI/seeds/s1-idea-capture.md), [plans/PDLC_UI/plan-mode-prelude.md](../../plans/PDLC_UI/plan-mode-prelude.md), [ADR-0001](./adr/0001-stack-and-persistence.md).

## What ships

- **Persistence (R17 complete for initiatives).** SQLite via `better-sqlite3` with `journal_mode=WAL`, `busy_timeout=5000`, `foreign_keys=ON`, wrapped by **Drizzle ORM** (`drizzle-orm/better-sqlite3`) for the typed query surface — see [`src/storage/schema.ts`](../src/storage/schema.ts) and [`src/storage/repository.ts`](../src/storage/repository.ts). Migrations stay **raw SQL** in [`src/storage/migrations/*.sql`](../src/storage/migrations/), applied by the hand-rolled runner in [`src/storage/migrate.ts`](../src/storage/migrate.ts) and tracked in `schema_migrations`; `drizzle-kit` is installed with [`drizzle.config.ts`](../drizzle.config.ts) for introspection only. Two initial migrations (`001_initial.sql` — `initiatives` + unique `handle`; `002_deleted_events.sql` — tombstone audit table). `npm run db:migrate` CLI + lazy apply on first API request via `/api/ready`. Any column change requires matching edits in **both** `migrations/` and `schema.ts` in the same PR (R16 guardrail 1).
- **Initiative CRUD API.**
  - `POST /api/initiatives` — create (monotonic `INIT-NNNN` handle, `revision=1`, `create` event on the row).
  - `GET /api/initiatives?lifecycle=idea` — list.
  - `GET /api/initiatives/[id]` — single fetch.
  - `PATCH /api/initiatives/[id]` — optimistic `revision` lock; **409** on stale.
  - `DELETE /api/initiatives/[id]` — **hard-delete + tombstone event** into `deleted_initiative_events`.
- **R18 UI.** Shared `RichTextEditor` (Bold / Italic / Underline / H2 / H3 / UL / OL / link / inline code / clear formatting) + `RichTextRenderer` used on the list + card so no raw markdown surfaces ever reach the user. Paste is sanitised (styles / fonts / colours / classes / Office + Google Docs wrappers stripped). `role="textbox"` + `aria-multiline` so axe passes on the open dialog. **Editor is truly WYSIWYG**: ProseMirror typography rules live in a single `proseMirrorTypography` constant in [`components/rich-text/extensions.ts`](../src/components/rich-text/extensions.ts) and are applied to both editor and renderer, so structural marks (H2 / H3 / UL / OL / strong / em / code / link) render identically while typing vs. after save. Poppins + JetBrains Mono load via `next/font` with the CSS-variable classes attached to `<html>` so `html { @apply font-sans }` resolves correctly at the root.
- **Ideas-page glossary.** User-visible copy on the Ideas page consistently says "idea" (button **New idea**, dialog **New idea / Edit idea**, empty state, delete confirm, aria-labels, list label). The underlying entity, API route, DB table, schema, and `INIT-NNNN` handle remain `initiative` — that name stays stable as the record moves through lifecycle stages in S2+.
- **Card action trigger.** `DropdownMenuTrigger` on each card is the `MoreHorizontal` ellipsis icon (Lucide), with `aria-label="Actions for INIT-NNNN"` + `title="Actions"` preserved so screen readers and hover tooltips still work.
- **Schema tightening.** Zod `events` is now a closed enum (`create`, `delete`, `stage_transition`, `field_edit`, `skill_run`, `review`); payload is `Record<string, unknown>` and validated on write. Golden fixture updated with a `create` event so `schema:validate` exercises the constraint.
- **Tests.** 16 Vitest cases across `schema/`, `storage/migrate.ts`, `storage/repository.ts` (create / update / delete / revision conflict / handle allocator / tombstone trail). Playwright covers: (a) ideas list axe, (b) create-dialog axe (editor included), (c) end-to-end CRUD smoke with a reload between edits.

## Doc reconciliations (same PR — R16 guardrail 1)

| Doc                                                                                                     | Before                                        | After                                                                                   |
| ------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------- |
| [schema-initiative-v0.md § 6](../../plans/PDLC_UI/schema-initiative-v0.md#6-events--append-only-audit)  | "Minimum from S1: stage transitions"          | "S1 minimum: `create` + `delete`. `stage_transition` joins in S2."                      |
| [04-Projects/PDLC_Orchestration_UI.md — north-star Stage 1](../../04-Projects/PDLC_Orchestration_UI.md) | "JSON atomic writes; soft-delete only"        | "SQLite + WAL per ADR-0001; `revision` optimistic lock; hard-delete + tombstone event." |
| [pdlc-ui/README.md — accessibility bullet](../README.md)                                                | "axe-core Playwright in CI (Bar B extension)" | "wired S0, **required for every shipped surface from S1 onward**"                       |
| [ADR-0001 Consequences](./adr/0001-stack-and-persistence.md)                                            | ADR only mentioned "Drizzle + SQLite in S1"   | S1 split documented: Drizzle for queries, raw SQL for migrations, HTML body trade-off   |

## How to verify locally

```bash
cd pdlc-ui
npm ci
npm run db:migrate          # creates data/pdlc.db with migrations applied
npm run lint && npm run typecheck && npm run format:check
npm run schema:validate     # fixture + closed event-kinds enum
npm test                    # 16 cases
npm run test:e2e:a11y       # axe + CRUD smoke (Playwright spins its own server)
npm run dev                 # open http://localhost:3000 → create / edit / delete an idea
```

## What next sprint must preserve

- `initiatives.data` JSON column owns all non-queryable nested fields (gate / brief / discovery / design / spec / release / sourceRefs / attachments / events / linkedPrdPath / strategyPillarIds / strategyWarning). Normalised columns: `id`, `handle`, `title`, `body`, `lifecycle`, `parked_intent`, `parked_reason`, `revision`, `created_at`, `updated_at`.
- Any column change edits **both** the Drizzle schema (`src/storage/schema.ts`) **and** a new raw-SQL migration file (`src/storage/migrations/NNN_description.sql`) in the same PR — these must not drift.
- Every write bumps `revision`. Stale writes return 409 (or `{ ok: false, reason: 'revision_conflict' }` at the repository level). Revision bump uses `sql\`${initiatives.revision} + 1\``inside the Drizzle`update().where(and(eq(id),eq(revision)))`clause — keep the`AND revision = ?` predicate on every write.
- `events` kinds stay a **closed** Zod enum — extending it means updating schema-initiative-v0.md + regenerating the JSON Schema + fixture in the same PR.
- S2 stage transitions append `{ kind: 'stage_transition', payload: { from, to, note? } }` to the **live** `events[]` array on the row — not to the tombstone table.
- Body stays **sanitized HTML** (TipTap output through the shared extensions). Do not change the canonical format without a superseding ADR; if full-text search lands later, introduce a derived `body_text` column populated on write.
- **Editor / renderer typography must not drift.** Both consume `proseMirrorTypography` from `components/rich-text/extensions.ts`. New marks or block types added to `richTextExtensions` get their Tailwind rules added there too — if a mark renders different between the editor and the card, that's a regression.
- **Kanban sort order (S2):** user-generated priority via drag-to-reorder, not `updatedAt`. Captured in [seeds/s2-swim-lanes.md](../../plans/PDLC_UI/seeds/s2-swim-lanes.md) and the Slice log. S2 should add a `sort_order` column in a new migration + `schema.ts` and order each lifecycle column by `sort_order NULLS LAST, created_at DESC`.
