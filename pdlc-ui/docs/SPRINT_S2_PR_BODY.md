# Sprint S2 — Swim lanes + forward moves

**Branch:** `feat/s2-swim-lanes` → `main`
**Bar:** A

Cites: [plans/PDLC_UI/sprint-backlog.md § Sprint 2](../../plans/PDLC_UI/sprint-backlog.md#sprint-2--swim-lanes--forward-moves-2-weeks), [plans/PDLC_UI/seeds/s2-swim-lanes.md](../../plans/PDLC_UI/seeds/s2-swim-lanes.md), [plans/PDLC_UI/lifecycle-transitions.md](../../plans/PDLC_UI/lifecycle-transitions.md#cantransition--enforced-matrix-sprint-2), [plans/PDLC_UI/schema-initiative-v0.md](../../plans/PDLC_UI/schema-initiative-v0.md#6-events--append-only-audit), [ADR-0001](./adr/0001-stack-and-persistence.md). Gated by `/moneypenny-custom`.

## What ships

- **Full swim-lane board.** [`IdeasBoard`](../src/components/ideas/ideas-board.tsx) renders the seven main lanes (`idea → discovery → design → spec_ready → develop → uat → deployed`) in canonical order via [`lanes.ts`](../src/components/ideas/lanes.ts), each as a [`SwimLane`](../src/components/ideas/swim-lane.tsx) with count + description. Cards are the new [`InitiativeCard`](../src/components/ideas/initiative-card.tsx) — card-title, handle, revision, rich-text body, and a `Move to…` submenu. The lane strip is `role="region"` + `tabIndex={0}` so keyboard-only users can pan (axe `scrollable-region-focusable`). `parked` is **not** a main lane — it renders in a toggle-able drawer via [`ParkedFilterToggle`](../src/components/ideas/parked-filter-toggle.tsx) with a badge count.
- **`canTransition` is the single source of truth.** [`src/lib/can-transition.ts`](../src/lib/can-transition.ts) is a pure function consumed by both the UI (to disable menu items + show tooltips) and the repository (to refuse illegal writes). Encoded rules:
  - **Forward-only** along `LIFECYCLE_ORDER`; any skip-or-back returns `{ ok: false, reason: "illegal_transition" }`.
  - **`idea → discovery`** is blocked with `reason: "brief_required"` until `deriveHasBrief(initiative)` is true (S3 dependency). UI tooltip points to Sprint 3.
  - **`* → parked`** requires `parkedIntent ∈ { "revisit", "wont_consider" }` **and** a non-empty `parkedReason` (`reason: "parked_requires_intent_and_reason"`). Enforced client-side by [`ParkedTransitionDialog`](../src/components/ideas/parked-transition-dialog.tsx) and server-side by the repository.
  - **`parked → idea`** is the only un-park path; it clears both `parkedIntent` and `parkedReason`.
  - Same-lane moves short-circuit (`reason: "same_lifecycle"`).
- **Repository write paths + events.** [`transitionInitiative`](../src/storage/repository.ts) and [`reorderInitiative`](../src/storage/repository.ts) both bump `revision`, honour the optimistic `expectedRevision` lock (409 on stale), and append to the live `events[]` array — stage moves append `{ kind: "stage_transition", payload: { from, to, note? } }`; reorders append `{ kind: "field_edit", payload: { field: "sortOrder", from, to } }`. Lane changes also null `sortOrder` so the card lands at the top of its destination.
- **API surface.** `POST /api/initiatives/[id]/transition` and `POST /api/initiatives/[id]/reorder` land with Zod-validated bodies in [`src/app/api/initiatives/schemas.ts`](../src/app/api/initiatives/schemas.ts). Repository reasons map to concrete HTTP codes: `400` (invalid body), `404` (not found), `409` (revision conflict), `422` (policy — `brief_required`, `parked_requires_intent_and_reason`, `illegal_transition`, `same_lifecycle`).
- **Within-lane reorder.** Drag-to-reorder **within** a lane using native HTML5 DnD in [`ideas-board.tsx`](../src/components/ideas/ideas-board.tsx); midpoints computed by [`computeMidpointSortOrder`](../src/components/ideas/reorder.ts) using a `SORT_ORDER_STEP = 1000` integer ladder so gaps always exist. Keyboard fallback via `Alt + ArrowUp / ArrowDown` on the focused card — `neighboursForSwap` returns the neighbour pair and we reuse the same midpoint math (a11y Bar A). Cross-lane DnD is explicitly **out** for S2.
- **Sort-order migration.** [`003_sort_order.sql`](../src/storage/migrations/003_sort_order.sql) adds a nullable `sort_order INTEGER` column and `idx_initiatives_lifecycle_sort (lifecycle, sort_order, created_at)`. `listInitiatives` now orders by `sort_order IS NULL, sort_order ASC, created_at DESC` so freshly created cards appear at the top of their lane until a human reorders them (captured in the S1 Slice log as an S2 carry-over).
- **Parked modal + filter.** Park action always opens [`ParkedTransitionDialog`](../src/components/ideas/parked-transition-dialog.tsx) — `parkedIntent` radio + `parkedReason` textarea with client-side validation. The board shows a "Show parked" checkbox (default off) with the parked count badge; checked, a dashed drawer renders parked cards with an `Un-park → Idea` action.
- **Tests.** **41 Vitest cases** (up from 16): every legal and illegal edge of `canTransition`, transition repository flow (brief gate, park validation, revision conflicts, event appends), reorder repository flow (midpoint persistence, event payloads, null sort_order ordering). **8 Playwright tests** across three specs — board renders all 7 lanes, `idea → discovery` blocked with tooltip, parked modal rejects empty reason + round-trips Un-park, full `discovery → deployed` forward chain after the test-only `POST /api/test/seed-brief` helper (gated by `PDLC_ALLOW_TEST_HELPERS=1`), plus axe on the board and the parked dialog.

## Doc reconciliations (same PR — R16 guardrail 1)

| Doc                                                                                                                 | Before                                                | After                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [schema-initiative-v0.md § 2 (shape) + § 2 Rules](../../plans/PDLC_UI/schema-initiative-v0.md#2-top-level-shape-v0) | No `sortOrder`; parked rules implicit                 | `sortOrder: number \| null` in the shape; explicit rules for `sortOrder`, `parkedIntent`, `parkedReason`                                                   |
| [schema-initiative-v0.md § 6 (events)](../../plans/PDLC_UI/schema-initiative-v0.md#6-events--append-only-audit)     | "`stage_transition` joins in S2" (future tense)       | Shipped-by-sprint table + concrete payload shapes for `create`, `delete`, `stage_transition`, `field_edit` with links to the repo functions that emit them |
| [schema-initiative-v0.md § 9 (TS)](../../plans/PDLC_UI/schema-initiative-v0.md#9-typescript-types-suggested)        | `Initiative` missing `sortOrder`                      | TS interface now carries `sortOrder: number \| null`                                                                                                       |
| [lifecycle-transitions.md](../../plans/PDLC_UI/lifecycle-transitions.md#cantransition--enforced-matrix-sprint-2)    | Prose rules only; no single-source matrix             | New `canTransition — enforced matrix (Sprint 2)` section: edges, reasons, `hasBrief` derivation, parked-modal contract, within-lane reorder notes          |
| [lifecycle-transitions.md § parked](../../plans/PDLC_UI/lifecycle-transitions.md#parked)                            | `parked_intent` / `parked_reason` snake_case in prose | Canonical camelCase (`parkedIntent` / `parkedReason`) + pointer to the dialog contract; SQL-column note preserved                                          |
| [fixtures/initiative-example.json](../../plans/PDLC_UI/fixtures/initiative-example.json)                            | `create`-only events, no `sortOrder`                  | Adds `sortOrder`, a `stage_transition` event, and bumps `revision` so `schema:validate` exercises the S2 contract end-to-end                               |

## How to verify locally

```bash
cd pdlc-ui
npm ci
npm run db:migrate              # applies 001 + 002 + 003_sort_order
npm run lint && npm run typecheck && npm run format:check
npm run schema:validate         # fixture + closed event-kinds enum, incl. stage_transition
npm test                        # 41 Vitest cases
npm run test:e2e:a11y           # 8 Playwright cases (board axe, parked modal axe, CRUD, swim-lanes)
npm run dev                     # http://localhost:3000 — create → try Move to Discovery (blocked tooltip) → Park… (reason required) → Show parked → Un-park
```

## What next sprint (S3) must preserve

- **`canTransition` stays the single source of truth.** S3's `pdlc-brief-custom` wizard populates the brief and makes `deriveHasBrief(initiative)` return true; do **not** duplicate the gate inside the wizard. When the brief lands, `idea → discovery` unlocks through the existing path — no new transition code.
- **Golden fixture must keep covering the S2 event kinds.** [`initiative-example.json`](../../plans/PDLC_UI/fixtures/initiative-example.json) carries a `stage_transition` event; if S3 introduces new event kinds (e.g. `skill_run`) add them to the closed Zod enum **and** the fixture in the same PR (R16 guardrail 1).
- **`sortOrder` is user intent, not a derived value.** S3+ must not overwrite `sort_order` on any write that isn't a reorder. Lane transitions null it (new lane, fresh top-of-column behaviour); lane-edits and brief edits leave it alone.
- **Transition + reorder are the only two write paths that mutate `lifecycle` / `sort_order`.** All other edits go through `PATCH /api/initiatives/[id]` and must not touch those columns.
- **Tombstone audit continues through parks.** `DELETE` still writes to `deleted_initiative_events` (S1). Parking is **not** a delete — it remains in `initiatives` with `lifecycle = "parked"`. Do not short-circuit it into the tombstone table.
- **Parked drawer is an S2 presentation detail.** S3 must keep parked cards reachable from the board without scanning the API — the toggle + drawer are the UX contract; listing endpoints still return parked rows so the count badge stays honest.
- **The test-only `POST /api/test/seed-brief` helper exists only while S3 is in flight.** Once the real brief wizard lands, delete the route **and** the `PDLC_ALLOW_TEST_HELPERS` guard; the Playwright forward-chain test should drive the UI wizard instead.
- **Within-lane reorder is the only DnD interaction.** Cross-lane DnD is out until `canTransition` + keyboard parity land for the cross-lane path (S8 scope). Anyone adding a second drag surface must also add a matching keyboard interaction or they break Bar A.
