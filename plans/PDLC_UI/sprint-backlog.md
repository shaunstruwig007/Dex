# PDLC UI — sprint backlog (implementation)

**Purpose:** Turn [plan.md](./plan.md) and [PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) into **small, shippable increments** suitable for **agile delivery** and **Cursor Plan mode** before coding.

**Cadence assumption:** **2-week sprints**, **solo** PM/builder default (one demonstrable outcome per sprint to Steerco / board owner). **Exception:** **S0 may be 1 week** if the spike + scaffolding are clean (purely foundation). All other sprints = 2 weeks unless explicitly re-timed during sprint planning.

**Canonical field case:** **camelCase** for all JSON / schema fields (`parkedIntent`, `parkedReason`, `specComplete`, `userReleaseNotes`, `claudeDesignHandoffPath`, `implementationPolishNote`). Snake_case references in older prose are legacy — update when touched ([plan R16](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).

**Governance (aligned with [plan.md](./plan.md)):** **PM** moves the **record of truth**; Steerco **decides**. **PO** owns **`pdlc-brief-custom` / `pdlc-idea-gate-custom` / `agent-prd`** question copy vs shipped skills ([skill-agent-map.md](./skill-agent-map.md)). **Design review waive:** **PO or Designer** (policy). Audit **`by`** = **Shaun** placeholder until v2 auth. **Handoff to engineering:** **nudge** not hard-block in MVP. **R6b** satisfied by **export-pack-template** from **S4**; extra UI CTA = polish only.

**Rule — one paste, read-then-plan:** Every sprint has a short **Plan mode seed** at the bottom of its block — a **compact** prompt (~6–8 lines) that tells Cursor which **sprint-specific** files to read plus the **previous-sprint Slice log** for reality, and to adapt the plan before Build. Copy that prompt from this backlog, paste into Cursor **Plan mode**. Cross-sprint references (prelude, guardrails, implementation standard, tech-stack, schema, lifecycle) apply automatically via [`plan-mode-prelude.md`](./plan-mode-prelude.md) — per-sprint prompts do **not** re-list them.

Switch to **Build mode** only after Plan produces a task list that closes every DoD checkbox **and** lists any scope conflicts found by diffing the previous sprint's plan vs reality.

**Why this shape:** each sprint's scope drifts based on the one before it (ADR-0001 choice decides S1's write path; S5–S6 produce the design-system the rest of the app consumes). Hard-coding context in the paste means rework every sprint. Referencing files means Cursor picks up the current state each run.

**Ceremony:** At sprint end, append one line to **Slice log** in `04-Projects/PDLC_Orchestration_UI.md` and tick **Progress** in `plan.md`.

**PR merge gate (engineering):** For every open PR that touches **`pdlc-ui/`**, invoke **`/moneypenny-custom`** ([`.claude/skills/moneypenny-custom/SKILL.md`](../../.claude/skills/moneypenny-custom/SKILL.md)) — she watches **`gh pr checks`**, fixes CI with minimal commits, runs the **R16 pre-merge audit** (schema ↔ migration ↔ docs in one PR, closed `events` enum, ADR freeze, etc.), triages review comments, and on merge can run **close-out** (Slice log + `plan.md` Progress). Complements generic PR babysitting (Cursor **`babysit`** skill) with **PDLC-UI-specific** guardrails. Requires **`gh auth login`** once.

---

## Bar alignment (2026-04-21)

**Context:** MVP is split into **Bar A** (solo / localhost / one real initiative) and **Bar B** (Steerco-authentic, internal host). See [plan.md § MVP bars](./plan.md#mvp-bars--bar-a-solo--bar-b-steerco--phase-2-automation--phase-3-intel) for scope, exit gate, and measurable success.

| Sprint | Bar | Notes |
|--------|-----|-------|
| **S0** | **A (minimum)** + **B (extensions)** | See Sprint 0 — the existing DoD covers both; Bar A ships with minimums only, Bar B items land before internal-host rollout. |
| **S1** | **A** | Write path: atomic JSON + `schemaVersion` + `handle` + `events[]`. SQLite-path items defer to Bar B. |
| **S2** | **A** | Swim lanes; forward moves only; parked intent + reason. |
| **S3** | **A** | **`pdlc-brief-custom`**-aligned wizard on `idea → discovery`; unlocks S2's blocked transition. |
| **S3A.1** | **A** | Interaction + layout polish on the `idea → discovery` journey **and** brief shrink to **three questions** (why / who / what): **`REQUIRED_BRIEF_FIELDS` narrows** to `problem` + `targetUsers` + `coreValue` (legacy fields stay optional in `briefSchema` — backward compat; S3B writes equivalents to `discovery.*`); **drag-and-drop** card moves (menu retained as a11y fallback); **mandatory-field indicators** in wizard; **summary-step composite** (3 fields + synthesis) with two actions (primary "Save brief & start discovery" / secondary "Save brief only" — identical server behaviour this sprint); **one-line `problem.value`** preview on card face; **chrome-light board shell** + **elastic columns** + **parked rail** + **density toggle** per [board-layout.md](../../pdlc-ui/docs/design/board-layout.md) §1–§4. No new server processes, no new skills, `briefSchema` narrows (not widens). |
| **S3A.2** | **A** | Automation surface + side panel on top of S3A.1: **pre-filled brief drafts** for the **three required brief fields** (`coreValue` + `targetUsers` + `problem`; feature-flagged OFF in prod), **tick-driven discovery kickoff** with client-polled progress bar behind a **swappable `DiscoveryResearchProvider` interface** (deterministic stub this sprint; **S3B replaces the advance function with `/pdlc-discovery-research-custom` without touching route / job / UI**), new **`initiative_jobs` table** + startup reconciler, **non-modal resizable side panel** (Idea / Brief / Discovery / Activity) per [board-layout.md](../../pdlc-ui/docs/design/board-layout.md) §5–§6, **edit-existing-brief** from panel, **focused-column mode**. |
| **S3B** | **A** | `/pdlc-discovery-research-custom` — real discovery research skill. Replaces the S3A.2 kickoff stub behind the same `DiscoveryResearchProvider` interface; reads `brief.*` + `gate.*` + `Market_intelligence/*` + `Market_and_deal_signals.md` + `People/External/*` + (when it exists) `System/icp.md`; writes `discovery.researchNotes` + `discovery.competitorSnapshot` + `discovery.customerEvidence[]` + `discovery.openQuestions[]` (draft). Designed to re-run on a **weekly sweep** against all `discovery`-column cards. **Deep-dive 2026-04-22+** — this row reserves the slot; full scope is defined in [seeds/s3b-discovery-research.md](./seeds/s3b-discovery-research.md). |
| **S4** | **A (minimal)** / **B (full)** | **Bar A:** export pack download + open-questions persistence. **Bar B:** full re-run audit, workshop export polish. |
| **S5** | **B** | Design artefact fields — board becomes Steerco-readable. |
| **S6** | **B** | Design review **hard gate**. In Bar A this is a **warning nudge**, not a block. |
| **S7** | **B** | Full spec wizard + handoff bundle + release notes. Bar A path = export-only (use the S4 export pack). |
| **S8** | **B** | Backward moves + wipe-to-idea + `canTransition` matrix tests. |
| **S9** | **Phase 2+** | **R12** company-strategy conformance — deferred until strategy artefact exists. |
| **S10+** | **B / Phase 2+** | R13 full vault reconciliation, R6b UI polish, catalogue, headless agents (Agent Flywheel). |

**Bar A exit gate:** one **real** initiative completes `idea → discovery → design → spec_ready → develop` on the board with [plan.md § Bar A success](./plan.md#bar-a--solo-dogfood-localhost-one-operator-one-real-initiative) measurable outcomes. **Bar B sprints do not start** until Bar A exit lands on a real initiative.

---

## Cross-sprint references (read before any sprint Plan-mode run)

The backlog focuses on **what each sprint covers**. Cross-sprint rules, the UI spec, and governance live in their own reference files so they can grow independently:

| Reference | Covers |
|-----------|--------|
| [`plan-mode-prelude.md`](./plan-mode-prelude.md) | **Mandatory preamble** — every sprint Plan-mode run reads this first. Lists all cross-sprint references below, enforces R16 / R18 non-negotiables, and describes the expected backlog sprint shape + Plan-mode output contract. |
| [`engineering-guardrails.md`](./engineering-guardrails.md) | R16 guardrail table (incl. **MoneyPenny** merge gate), hotfix rule, branch-per-cycle, merge gate, S0 vs S1 split, end-of-sprint ceremony. |
| [`implementation-standard.md`](./implementation-standard.md) | UI-building rule (read `/anthropic-frontend-design` before styling), a11y baseline, vertical-slice shape (BE + UI together), R18 inheritance pointers, S5–S6 design-system dogfood loop. |
| [`tech-stack.md`](./tech-stack.md) | Recommended stack (ADR-0001 ratifies) + **UI primitives § 3** (tokens, typography, focus/keyboard/motion, TipTap toolbar minimum, shadcn primitives, forbidden "AI slop" patterns). |
| [`schema-initiative-v0.md`](./schema-initiative-v0.md) | Typed initiative contract — camelCase canonical. |
| [`lifecycle-transitions.md`](./lifecycle-transitions.md) | Forward / backward rules, parked intent + reason, skill triggers on column moves. |
| [`seeds/`](./seeds/) | One detailed seed per sprint — read by Cursor via the backlog's inline Plan-mode seed prompt. Not the paste target. |

**Paste target for Plan mode:** the short **Plan mode seed** code block inline at the bottom of each sprint below. It references the detailed seed file, the backlog § Sprint # block, the 04-Projects Slice log (previous-sprint reality), and any sprint-specific skill / template. The prelude's cross-sprint refs apply automatically; per-sprint prompts do **not** re-list them.

---

## Sprint 0 — Spike + shell + contracts *(~1–2 weeks; 1 week OK per cadence exception)*

**Bar:** **A (minimum)** + **B (extensions)** — see Bar split below.

**Goal:** De-risk **hosting + stack + persistence shape** so later sprints do not thrash; ship an empty **orchestration shell**, **written contracts**, and the **guardrail machinery** (R16 + **R17 seed**) — **not** full production DevOps (see **Out**).

**Maps to:** **R1** (Stage 0), **R10** (runbook doc), **R16**, **R17** (seed), Phase A **schema**; [export-pack-template](./export-pack-template.md) unchanged but referenced.

### Bar split (what must ship for Bar A vs. Bar B)

**Bar A minimum — required to start Sprint 1 on localhost:**

- Runnable `pdlc-ui/` shell with one route (no console errors).
- [schema-initiative-v0.md](./schema-initiative-v0.md) — schema + one example; committed.
- `pdlc-ui/README.md` — how to run locally; where data lives.
- **ADR-001** — stack + persistence choice (one file is enough).
- Atomic-write helper + a ten-line daily snapshot script (`cp -r data/ backups/$(date)`, 30-day retention).

**Bar B extension — required before internal-host rollout (can land anytime before Bar B sprints begin):**

- `pdlc-ui/docs/OPERATIONS.md` — deploy + rollback outline.
- `pdlc-ui/docs/BACKUP_RUNBOOK.md` — owner + frequency + retention + **restore drill** run.
- `.env.example`; secrets in ICT-approved store.
- `/health` + `/ready` stub + build `GIT_SHA` (or `package.json` version) exposed in UI footer / `/health`.
- CI: lint + format + typecheck + **schema-validate** required on PR; branch protection on default branch.
- `npm audit` / `gitleaks` policy documented.
- WCAG 2.1 AA baseline + audit tooling hooked up.

**Interpretation:** the existing Sprint 0 DoD below covers **both bars**. For solo / localhost (Bar A) you only need the **Bar A minimum** block to close Sprint 0 and start S1. **Bar B extensions** stay in Sprint 0 *conceptually* — land them incrementally as you approach the internal-host rollout, not upfront.

**Deliverables**

- Runnable **`pdlc-ui/`** app (local `npm`/`pnpm` dev) with **one route**, app title, empty layout.
- **`plans/PDLC_UI/schema-initiative-v0.md`** — JSON schema (or TypeScript types + JSON example) matching fields in [plan.md § Phase A](./plan.md#phase-a--foundation-vault--planning-only), including **`schemaVersion`** and **`revision`** fields (even if unused until S1).
- **`pdlc-ui/README.md`** — how to run, where data lives, **env vars**, **dependency upgrade policy** (R16).
- **`.env.example`** — dummy keys only; **no secrets** in repo (**R17**).
- **`pdlc-ui/docs/BACKUP_RUNBOOK.md`** — owner (Shaun), frequency, retention, **restore drill** steps for `pdlc-ui/data/*` (R10); **SQLite** path must mention **WAL + quiesce / VACUUM INTO** or equivalent; **JSON** path must mention **atomic writes + restore from backup**.
- **`pdlc-ui/docs/OPERATIONS.md`** — **deploy** + **rollback** outline (even “copy `dist/` + restart service” for v1), where logs go, **health** URL (**R17**); **git:** branch-per-cycle, **no merge to default without green CI**, link or checklist for **branch protection** on host (**R16** §7–8).
- **`pdlc-ui/docs/adr/README.md`** — what an ADR is, numbering, when to write one ([plan R16](./plan.md#engineering-governance-cto--tech-lead--anti-drift)); optional **`0000-template.md`**. **First ADR(s) (S0):** stack + persistence; **git host + CI runner**; **UTC stored / SAST displayed**.
- **CI (required):** lint + format + typecheck on **every PR** to default branch; **validate** golden `initiative.json` (or fixture) **against** `schema-initiative-v0.md` — **failing CI = no merge** (R16). Document **`npm audit` / `pnpm audit`** policy (warn vs block) in README or OPERATIONS.
- **Kick-off decisions block in README:** capture all [plan § Sprint 0 kick-off decisions](./plan.md#sprint-0-kick-off-decisions-park-until-s0-planning--do-before-coding) (canonical case, `handle` ID, `events[]`, attachments = links-only, backup cadence, timezone, a11y WCAG AA, desktop-only, PII, JSON schema-evolution stub, undo out of scope, first real initiative TBC at S7).

**Technical — how**

- **Spike (≤1 day):** choose **static+API** vs **full-stack** one framework; **JSON file** vs **SQLite** for v1 persistence (document decision in **first ADR**).
- Scaffold repo: lint, format, **`/health`** (and **`/ready`** stub if applicable); **build-time version** (`GIT_SHA` or `package.json` version) exposed via small **API or static JSON** for “what am I running?”
- **Shell UI:** apply **`/anthropic-frontend-design`** for app chrome (nav, layout shell, typography baseline) per [implementation-standard.md § 1](./implementation-standard.md) + [tech-stack.md § 3](./tech-stack.md#3-ui-primitives-r18).
- No initiative CRUD yet beyond optional **mock** fixture for layout.

**DoD**

- [ ] Fresh clone: `README` steps → app loads in browser, no console errors.
- [ ] Shell reflects **anthropic-frontend-design** direction (documented in PR or `pdlc-ui/docs/ui-notes.md` one-liner).
- [ ] Schema file committed; at least **one** example `initiative.json` validates; **CI enforces** validation (not optional).
- [ ] Backup runbook exists and names **restore** test date (even “TBD schedule” is OK if owner named).
- [ ] **`pdlc-ui/docs/adr/README.md`** exists; **first ADR** filed for persistence + stack choice (**R16**).
- [ ] **`.env.example`** + **`OPERATIONS.md`** + **health** route live (**R17** seed).

**Out:** **`pdlc-brief-custom`** wizard, swim lanes, PRD generation, **full SQLite migration chain**, **production Docker**, **staging environment**, **gitleaks** in CI — unless ICT mandates, **defer to S1+** and track in slice log.

**Risks:** ICT blocks local SQLite → fall back to JSON early (**ADR**).

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S0 — Spike + shell + contracts. Branch: feat/s0-foundation. Bar: A (minimum) + B (extensions).

Read plans/PDLC_UI/plan-mode-prelude.md first — it pulls in all cross-sprint references (guardrails, implementation standard, tech-stack, schema, lifecycle).

Then read in order:
1. plans/PDLC_UI/seeds/s0-foundation.md — detailed seed (Bar split, ADR list, kick-off decisions, DoD, Explicitly OUT).
2. plans/PDLC_UI/sprint-backlog.md § Sprint 0 — Goal / DoD / Out / Dependencies / Risks (backlog DoD is source of truth).
3. plans/PDLC_UI/plan.md § Sprint 0 kick-off decisions — Day-1 decisions for README + ADRs.

No prior slice log (S0 is first). Output: task list closing every DoD checkbox in backlog § Sprint 0 AND seeds/s0-foundation.md. Flag any conflict between seed and backlog before Build.
```

---

## Sprint 1 — Idea capture + persistence *(~2 weeks)*

**Bar:** **A**.

**Goal:** Steerco can **create, edit, delete** initiatives with **title + description** and see them stored durably — **R17 persistence path** is real (not only docs).

**Maps to:** **R2**, **R9** (initiative CRUD subset), **R17** (complete write-safety baseline).

**Deliverables**

- **Create idea** modal (validation: title required, body optional/min length if you set one).
- **List** or single-column view of cards in **`idea`** (even if full board not built yet).
- **Persist** to store chosen in Sprint 0; **delete** with confirm.
- **SQLite:** enable **WAL**, set **busy_timeout**, ship **initial migration** + runner; document **single-writer** assumption in OPERATIONS. **JSON:** **atomic rename** write pattern + **`schemaVersion`** on file; **`revision`** on each initiative (increment on successful save).
- **`events[]`** seeded on initiative: record `{ at, by, from, to, note? }` for **stage transitions** and **create/delete**; extensible for field edits later.
- **`handle`** (human ID, e.g. `INIT-0042`) generated on create (monotonic or slug); **unique**; used in URLs / Steerco references.

**Technical — how**

- CRUD API or direct file write with **atomic** writes (avoid corrupt JSON).
- IDs: `uuid` or `nanoid`; `createdAt`, `updatedAt`, `lifecycle: 'idea'`; **`revision`** starts at `1`.
- **UI:** modal + list via **`/anthropic-frontend-design`**; pair **write path** with UI in same slice.

**DoD**

- [x] Create → appears after refresh; edit → persists; delete → gone. *(Playwright `e2e/ideas-crud.spec.ts` covers create/edit/delete + reload persistence.)*
- [x] **R17:** Write path meets **SQLite WAL + migrations**; `better-sqlite3` with `journal_mode=WAL` + `busy_timeout=5000`; **Drizzle ORM** query surface (`pdlc-ui/src/storage/schema.ts` + `repository.ts`) over the shared handle; raw-SQL migrations in `pdlc-ui/src/storage/migrations/*.sql` applied by `pdlc-ui/src/storage/migrate.ts` + `schema_migrations` table; **`revision`** bumped on update with **409 on stale** (Drizzle `update(...).set({ revision: sql\`revision + 1\` }).where(and(eq(id),eq(revision)))` + `Repository.updateInitiative`).
- [x] **`events[]`** recorded for create / delete. `create` lives on the row; `delete` written to `deleted_initiative_events` tombstone (Bar A = hard delete). Kinds closed to `create` \| `delete` \| `stage_transition` \| `field_edit` \| `skill_run` \| `review` via Zod.
- [x] **`handle`** (`INIT-NNNN`) shown on card (Badge) and in list; DB `UNIQUE` + monotonic allocator (`nextHandle`).
- [x] No other columns required; stage badge = `idea`.
- [x] Modal and list meet **anthropic-frontend-design** bar: tokens.css only, 2 px focus ring, keyboard-complete flows, TipTap toolbar with full R18 minimum, paste hygiene, axe green on list + open-create-dialog.

**Out:** Column moves, **`pdlc-brief-custom`** brief wizard.

**Dependencies:** Sprint 0 complete.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S1 — Idea capture + persistence. Branch: feat/s1-idea-capture. Bar: A.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S0 actual outcomes (not what S0 planned):
1. plans/PDLC_UI/seeds/s1-idea-capture.md — detailed seed (persistence per ADR-0001, CRUD scope, audit log, R18 TipTap rules, DoD).
2. plans/PDLC_UI/sprint-backlog.md § Sprint 1.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S0 actual outcomes (which persistence store did ADR-0001 pick? did tokens.css + shadcn/ui + TipTap land? did CI schema-validate go green?). Flag any S1 DoD item invalidated.
4. pdlc-ui/docs/adr/0001-*.md — stack + persistence decision (do NOT re-open).

Output: task list closing every DoD checkbox. List scope conflicts before Build.
```

---

## Sprint 2 — Swim lanes + forward moves *(~2 weeks)*

**Bar:** **A**.

**Goal:** **Board is visible** — all lifecycle columns + **parked**; user can **move cards forward** with **guardrails**: no **`idea` → `discovery`** until **S3** (typed **`brief`** via **`pdlc-brief-custom`** flow is **required**); **parked** always captures **intent + reason**.

**Maps to:** **R3** (Stage 2 scaffold), partial **R11** (forward only; backward in Sprint 8); plan Phase 5 **`parked`**.

**Deliverables**

- Horizontal **swim lanes**: `idea` | `discovery` | `design` | `spec_ready` | `develop` | `uat` | `deployed` + **parked** (lane or toggle).
- **Move** control: drag-drop **or** “Move to…” menu (pick one in sprint planning).
- Cards render **title + snippet** in correct column from `lifecycle`.
- **`idea` → `discovery`:** transition **disabled** or shows **“Complete discovery brief (Sprint 3)”** — card **cannot** land in `discovery` without **`brief`** payload (see **S3 dependency**; [lifecycle skill triggers](./lifecycle-transitions.md#skill-triggers-on-column-moves-pdlc-ui)).
- **→ `parked`:** modal requires **`parked_intent`** (`revisit` \| `wont_consider`) **and** **`parked_reason`** (non-empty free text).

**Technical — how**

- Single source of truth: `lifecycle` on initiative record.
- Optimistic UI optional; **server/store** is authority.
- **`canTransition`:** enforce blocked `idea→discovery`; enforce parked intent+reason.
- **UI:** lanes + cards + move affordances via **`/anthropic-frontend-design`** (density, column headers, drag/drop or menu styling).

**DoD**

- [ ] Moving card updates column and survives refresh (except blocked transitions).
- [ ] **`idea` → `discovery`** impossible until S3 ships (feature flag or hard block).
- [ ] **Parked** requires intent + reason; card leaves main flow visually (lane or filter).
- [ ] Board UI passes **anthropic-frontend-design** cohesion check (document in PR).

**Out:** **`pdlc-brief-custom`** wizard (S3), gates (design review, spec), backward moves.

**Dependencies:** Sprint 1; **S3** must ship before enabling `idea→discovery` (or ship **S2+S3** in sequence without releasing board-only between them).

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S2 — Swim lanes + forward moves. Branch: feat/s2-swim-lanes. Bar: A.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply; note lifecycle-transitions.md arrives via prelude — idea→discovery stays blocked until S3).

Then read in order, and adapt the plan to S1 actual outcomes:
1. plans/PDLC_UI/seeds/s2-swim-lanes.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 2.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S1 actual outcomes (CRUD API shape, handle format, revision contract, events[] payload kinds, TipTap wiring). Flag any S2 DoD item invalidated.
4. 06-Resources/PRDs/README.md — canonical lifecycle column order.

Output: task list closing every DoD checkbox. List scope conflicts before Build.
```

---

## Sprint 3 — **`pdlc-brief-custom`** on `idea` → `discovery` *(~2 weeks)*

**Bar:** **A** — closes Bar A's core loop (brief answers persist against a specific initiative; R13 writes are live).

**Goal:** First **skill-shaped** behaviour: moving **`idea` → `discovery`** opens **stepwise** questions aligned to **[`/pdlc-brief-custom`](../../.claude/skills/pdlc-brief-custom/SKILL.md)** (typed **`brief.*`** + discovery drafts — **not** full **`/product-brief`** PRD), with **help text**, persist answers — **unlocks** the transition blocked in **S2**.

**Maps to:** **R4**, Stage 3 north star. **PO** owns question copy alignment with **`pdlc-brief-custom`** (primary) and tracks canonical [`/product-brief`](../../.claude/skills/product-brief/SKILL.md) only for **non-PDLC** drift you intentionally do **not** mirror; **iterate** as usage data arrives.

**Deliverables**

- On transition **`idea` → `discovery`**: **modal/stepper** (externalise question copy from [`.claude/skills/pdlc-brief-custom/SKILL.md`](../../.claude/skills/pdlc-brief-custom/SKILL.md) into `pdlc-ui/content/pdlc-brief-steps.json` or similar — **single source** alongside schema [schema-initiative-v0.md](./schema-initiative-v0.md)).
- **Save** writes `brief` payload on initiative; **minimum required** fields enforced.
- **Cancel** behaviour defined (stay in `idea` — document in UI).
- **Enable** `idea→discovery` in `canTransition` only when brief meets minimum (on wizard **complete**).

**Technical — how**

- Step state machine; partial save if required.
- Optional: “Export prompt for Cursor” button (plain text).
- **UI:** stepper + help text layout via **`/anthropic-frontend-design`** (Steerco-readable, calm density).

**DoD**

- [ ] Incomplete required fields block **finish** and keep card in `idea` (document cancel UX).
- [ ] **Only after** wizard complete may card move to **`discovery`**.
- [ ] Completed brief visible on card detail / discovery column.
- [ ] Wizard screens match **anthropic-frontend-design** quality bar.

**Out:** Discovery open questions, export pack, design review.

**Dependencies:** Sprint 2 (lanes must exist; `idea→discovery` remains blocked until this DoD is met).

**Risks:** Question count too large for one sprint → ship **first N steps + “continue next sprint”** only if unavoidable (prefer thin vertical slice: **all** steps read-only except 2–3 editable first).

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S3 — pdlc-brief-custom on idea → discovery. Branch: feat/s3-brief-wizard. Bar: A (closes Bar A core loop).

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S2 actual outcomes:
1. plans/PDLC_UI/seeds/s3-brief-wizard.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 3.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S2 actual outcomes (canTransition block on idea→discovery, parked modal, events[] stage_transition payload). Flag any S3 DoD item invalidated.
4. .claude/skills/pdlc-brief-custom/SKILL.md — source of truth for wizard question copy (PO owns copy drift).
5. plans/PDLC_UI/skill-agent-map.md — stage ↔ skill mapping (brief.* field targets).

Output: task list closing every DoD checkbox. List scope conflicts before Build.
```

---

## Sprint 3A.1 — Brief shrink + board interaction polish *(~2 weeks)*

**Bar:** **A** — first of a **two-slice 3A pass**. Craft + cohesion pass on the S3 journey **plus** the board layout shell per [`pdlc-ui/docs/design/board-layout.md`](../../pdlc-ui/docs/design/board-layout.md) **plus** the CPO-approved brief shrink to three questions. No new server processes, no new skills; `briefSchema` narrows (does not widen).

**Goal:** Make the S3 journey feel designed **and honest** — the brief asks only what the PM can answer at `idea → discovery` (*why / who / what*); you can drag a card into discovery; the wizard clearly marks required fields and lets you jump to any step from the summary; the summary step commits via two clearly-labelled actions; the card face gains a one-line brief preview; the board uses the viewport properly.

**Maps to:** S3 follow-through + Chief Designer layout pass (board-layout.md §1–§4) + 2026-04-21 CPO brief shrink. No S4+ scope.

**CPO decision 2026-04-21 (reverses earlier deferral):** `/pdlc-brief-custom` question copy / order / workflow **is** changed in S3A.1 — narrows to three questions. Scope / assumptions / success metrics move to discovery (S3B) and spec (`/agent-prd`). Legacy fields remain in the schema as optional (no data migration).

**Deliverables**

- **Brief shrink (CPO pass):** `REQUIRED_BRIEF_FIELDS` narrows to `["problem", "targetUsers", "coreValue"]`. `pdlc-brief-steps.json` reduces to **3 content steps + 1 summary step** (order: *why* → *who* → *what* → summary). Legacy `scopeIn` / `scopeOut` / `assumptions` / `constraints` / `successDefinition` remain optional in `briefSchema` for backward compat and are not rendered by the wizard. `schema-initiative-v0.md §4.2` and `.claude/skills/pdlc-brief-custom/SKILL.md` are already staged and must ship same-PR.
- **Drag-and-drop** card moves (accessible): `canTransition` imported client-side and evaluated on drag-over; illegal targets dim with the existing `humanError` tooltip; drops on illegal targets are a no-op. `@dnd-kit/core` is the default (confirm in Plan mode). **Keyboard DnD mandatory** (`KeyboardSensor` + `sortableKeyboardCoordinates`).
- **Ellipsis "Move to…" menu retained** as canonical keyboard / screen-reader path. Drag is additive.
- **Mandatory indicators** on every required wizard step (asterisk + "Required" header + step-rail red dot + "* Required" legend). Driven by the shrunk `REQUIRED_BRIEF_FIELDS`.
- **Summary step** renders idea + the three confirmed brief fields + auto-synthesised `understandingSummary` as a composite; **clicking any block jumps to that step with focus**. Two buttons: primary **"Save brief & start discovery"** and secondary **"Save brief only"** — **identical server behaviour in 3A.1** (same atomic endpoint, same lane move). 3A.2 wires the kickoff under the primary.
- **One-line `problem.value` preview** on the card face when `brief.complete === true`. Inline `<details>` BriefPanel on the card face is **not** removed in 3A.1 (replaced in 3A.2 by the side panel).
- **Board layout shell** per [`pdlc-ui/docs/design/board-layout.md`](../../pdlc-ui/docs/design/board-layout.md) §1–§4: chrome-light 48px sticky header; board as scroll container (`height: calc(100vh - 48px)`); **elastic main lanes** (`repeat(auto-fit, minmax(280px, 1fr))`); **parked right-edge rail** (collapsed 40px / expanded 280px); **density toggle** (Compact / Comfortable / Detailed) persisted per user via `localStorage`.
- **Focused-column mode** is **documented** in board-layout.md but **not implemented** this sprint — it lands in 3A.2.

**Technical — how**

- **Client `canTransition`:** import the pure function from `pdlc-ui/src/lib/can-transition.ts`; audit imports to confirm no server-only deps leak in.
- **Density toggle:** `useBoardDensity` hook + `localStorage`; applies a data-attr on the board root and swaps CSS variables (`--card-py`, `--card-gap`, `--card-lines`) defined in `tokens.css`.
- **Parked rail:** not a new lifecycle value; render after the main 7 lanes; absorb the S2 "Show parked" toggle into the rail header.
- **Reuse, don't fork:** `BriefWizardDialog`, `canTransition`, `saveBriefAndTransition`, `briefWizardAnswersSchema`, `REQUIRED_BRIEF_FIELDS`, `ParkedTransitionDialog`, `RichTextRenderer` — all unchanged.
- **UI** via `/anthropic-frontend-design` for drag affordances, mandatory indicators, summary composite, density toggle, and rail. R18 baseline preserved.

**DoD**

- [ ] **Brief shrink:** `REQUIRED_BRIEF_FIELDS = ["problem","targetUsers","coreValue"]`. `pdlc-brief-steps.json` = 3 content steps + 1 summary step (order: why → who → what → summary). Legacy brief fields remain optional in `briefSchema`, not rendered. Vitest + Playwright updated to the 3-field shape; legacy "complete" fixture still passes (backward compat).
- [ ] `schema-initiative-v0.md §4.2` + `.claude/skills/pdlc-brief-custom/SKILL.md` land in the same PR (already staged 2026-04-21).
- [ ] Drag between legal columns; illegal targets dim + existing `humanError` tooltip; drop on illegal = no-op.
- [ ] Drag `idea → discovery` opens the S3 brief wizard (gate not regressed).
- [ ] Drag-to-reorder within a column still writes `sortOrder` + `field_edit`.
- [ ] "Move to…" menu unchanged (a11y fallback); both paths one API.
- [ ] Keyboard-only DnD (Space + arrows + Enter; Esc cancels) covered by a Playwright test.
- [ ] Required wizard steps marked (asterisk + "Required" header + step-rail dot); top "* Required" legend visible from step 1.
- [ ] Summary step composite renders idea + the 3 brief fields + auto-synthesised summary; clicking any block jumps to that step with focus.
- [ ] Summary step has **two** buttons (primary "Save brief & start discovery" / secondary "Save brief only"); **both** save + move the lane in 3A.1 (identical server call).
- [ ] When `brief.complete === true`, card face shows a single truncated `problem.value` line.
- [ ] Sticky 48px board header; board is the scroll container; 16–24px gutters; elastic main lanes via `minmax(280px, 1fr)`; parked rail collapsed/expanded (40/280); density toggle persists; axe-clean in each density.
- [ ] `eventSchema`, `canTransition`, `saveBriefAndTransition`, atomic `POST .../brief` shape — **unchanged**. `briefSchema` required-set **narrows**; legacy fields stay optional. 422 `missing_required_fields` contract preserved (same shape, smaller list).
- [ ] Board layout design doc landed same-PR at `pdlc-ui/docs/design/board-layout.md`.

**Out:** Prefill, kickoff, job record, side panel, edit-existing-brief, focused-column implementation — all deferred to **S3A.2**. Removal of legacy brief fields from the schema or data migration. No S3B / `/pdlc-discovery-research-custom` work. No S4+ scope.

**Dependencies:** S3 (brief wizard, atomic brief route, `brief.complete` gate, `skill_run` event kind).

**Risks:**
- **DnD a11y regression** → keyboard-only Playwright + menu retained + axe on each density.
- **Density toggle drift** → CSS variables only, no per-component branches.
- **Scope creep into 3A.2** → any prefill/side-panel/runner work rejected in review.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S3A.1 — Brief wizard + board interaction polish. Branch: feat/s3a1-brief-wizard-interactions. Bar: A.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S3 actual outcomes:
1. plans/PDLC_UI/seeds/s3a1-brief-wizard-interactions.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 3A.1.
3. pdlc-ui/docs/design/board-layout.md — implements §1–§4 this sprint; §5–§6 deferred to S3A.2.
4. 04-Projects/PDLC_Orchestration_UI.md Slice log — S3 actual outcomes (atomic POST .../brief, brief.complete gate, skill_run event payload, BriefPanel, tightened briefSchema/eventSchema). Flag any S3A.1 DoD item invalidated.
5. .claude/skills/pdlc-brief-custom/SKILL.md — already reshaped to 3 questions (2026-04-21 CPO pass); audit + ship same-PR as the wizard / schema / content updates.
6. plans/PDLC_UI/schema-initiative-v0.md §4.2 — already updated for the 3-field required set; audit matches runtime briefSchema before merge.
7. plans/PDLC_UI/lifecycle-transitions.md — update "Cross-lane DnD explicitly not implemented" note same-PR to reflect DnD landing in 3A.1.

Resolve Open Questions in seed § "Open questions to resolve in Plan mode" (DnD library, density CSS values, parked rail default) before Build. Output: task list closing every DoD checkbox. List scope conflicts before Build. Do NOT pull any S3A.2 item into scope (prefill, kickoff, job record, side panel, edit-existing-brief, focused-column). Do NOT modify S4+ sprint blocks or any S3 contract.
```

---

## Sprint 3A.2 — Discovery automation surface + side panel + prefill *(~2 weeks)*

**Bar:** **A** — second of the two-slice 3A pass. Adds the **automation surface** on top of S3A.1: pre-filled brief drafts, tick-driven discovery kickoff with visible progress, non-modal resizable side panel, edit-existing-brief, focused-column mode. Research runner is a deterministic stub — real LLM wiring is later. **Requires S3A.1 merged.**

**Goal:** Close the Chief-Designer-approved journey — drag in, open a wizard that's already part-drafted, save, watch research tick forward on the card, then open a side panel to read idea + brief + discovery + activity in one place without losing the board.

**Maps to:** S3A.1 follow-through (automation surface) + board-layout.md §5–§6. Still no S4 scope.

**Explicitly deferred (PO):** `pdlc-brief-custom` **question copy / order / workflow** — later PO-owned pass.

**Deliverables**

- **`POST /api/initiatives/:id/brief/prefill`** — server-gated to fire at most once per `(initiativeId, skill)` unless "Regenerate" is invoked; feature-flagged (default **ON in dev / OFF in prod**); **scoped to the three required brief fields** (`coreValue`, `targetUsers`, `problem`) — every field the S3A.1 wizard asks for. Response = envelope drafts; server does not write the brief. Per-field Regenerate + Clear + "Draft from idea" badge + confidence chip. **User-typing wins** — a field the user already typed in is not overwritten by a late draft response. Skeleton placeholders while in flight; amber inline notice on failure.
- **`POST /api/initiatives/:id/discovery/kickoff`** — fires **only** on the primary "Save brief & start discovery" button. Creates a row in the new `initiative_jobs` table; appends `skill_run` event with `{ skill: "discovery-kickoff-custom", iteration }`. **Runner is behind a swappable `DiscoveryResearchProvider` interface** — S3B replaces the provider with `/pdlc-discovery-research-custom` without changing the route, job table, or client polling.
- **Runner = tick-driven, client-polled, server-advanced.** Client polls `POST /api/initiatives/:id/discovery/jobs/:jobId/tick` every 2s while `status === "running"`; each tick advances one step + updates `heartbeat_at`; terminal tick writes `discovery.research.summary` (envelope) to the initiative (bumps initiative `revision +1`, emits `skill_run`). **No background process, no setInterval in route handlers, no `after()`.**
- **`GET /api/initiatives/:id/discovery/jobs/latest`** — returns `{ jobId, status, progress, startedAt, updatedAt, heartbeatAt, error }` for UI polling.
- **`initiative_jobs` table (locked columns):** `id`, `initiative_id`, `kind CHECK IN ('discovery-research')`, `status CHECK IN ('running','succeeded','failed')`, `progress` (0–100), `started_at`, `updated_at`, `heartbeat_at`, `error`, `payload` (JSON). Index on `(initiative_id, kind, started_at DESC)`. Cascade delete on initiative delete. **Jobs are ephemera, not initiative state.**
- **Startup reconciler** flips stale `running` jobs (heartbeat > 30s) to `failed` with `error = "server_restart"`.
- **Card UI in `discovery`:** linear progress bar + status text while running; "Research drafted" chip on success; amber "Retry research" chip on failure (new job row on retry; lane does not roll back). In-flight tick on a deleted initiative returns 410 Gone.
- **Right-rail side panel** per [`pdlc-ui/docs/design/board-layout.md`](../../pdlc-ui/docs/design/board-layout.md) §5: **`role="complementary"`** (not `dialog`); no focus trap; Esc closes. Resizable (default 420px / min 320px / max 600px) with width persisted per user. **Drag auto-collapse to 80px rail** while a card-drag is in progress. Tabs: **Idea / Brief / Discovery / Activity**. Replaces the inline `<details>` BriefPanel on the card face (keeps the S3A.1 one-liner + adds "Open details ›" link).
- **Edit existing brief** — "Edit brief" button on the Brief tab re-opens `BriefWizardDialog` with saved values; prefill skipped; save uses the existing atomic endpoint; **does NOT re-fire the discovery kickoff** (kickoff is tied to the initial `idea → discovery` lane move — S4's "Re-run discovery" owns re-triggering research).
- **Focused-column mode** per board-layout.md §6: double-click or Enter-on-focused column header collapses sibling main lanes to 48px rails; parked rail unaffected; Esc returns; ephemeral (not persisted).

**Technical — how**

- **Prefill helper** is a server-side module behind a swappable interface (deterministic stub this sprint; real LLM later). No model keys in the browser.
- **Prefill idempotence** is server-gated: check `events[]` for a prior `pdlc-brief-prefill-custom` `skill_run`; return cached draft on re-request unless "Regenerate".
- **`discovery.research.summary`** envelope added to `schema-initiative-v0.md §4.3` and the runtime Zod `discoverySchema` same-PR (R16 guardrail 1).
- **Side panel is NOT a shadcn `Dialog`** — bespoke slide-over or a drawer primitive that supports `role="complementary"` + no focus trap.
- **Tests:** unit (`initiative_jobs` repo, prefill idempotence, `discovery.research.summary` Zod round-trip), Playwright happy path (drag → prefilled wizard → kickoff → progress → summary → side panel), Playwright recovery (tick fail → retry, reconciler on stale running), Playwright side-panel (non-modal, drag auto-collapse, Esc, axe), Playwright edit-brief (prefill skipped, revision bumped, no kickoff re-fire).
- **UI** via `/anthropic-frontend-design` for progress bar, draft badges, regenerate, panel tabs, focused-column rails.

**DoD**

- [ ] Prefill endpoint gated server-side to fire once per `(initiativeId, skill)` unless Regenerate; feature flag defaults as specified; scope = `coreValue` + `targetUsers` + `problem` (the three required brief fields).
- [ ] User-typing-wins covered by Playwright; failure shows amber notice (no toast storm).
- [ ] Regenerate + Clear per drafted field; editing a drafted field flips `source` to `user` at save.
- [ ] Primary "Save brief & start discovery" fires kickoff; secondary "Save brief only" does not.
- [ ] Kickoff creates `initiative_jobs` row + `skill_run` event; responses + `GET .../discovery/jobs/latest` return the locked shape.
- [ ] Client polls `/tick`; progress ticks; terminal tick writes `discovery.research.summary` (+ `revision +1` + `skill_run`).
- [ ] Failure path: amber "Retry research" chip; retry creates a new job row; lane does not roll back; deletion → 410 Gone; startup reconciler flips stale `running` → `failed`.
- [ ] Side panel is `role="complementary"` (no focus trap); resizable 320/420/600; drag auto-collapse to 80px + restore; tabs Idea / Brief / Discovery / Activity; axe-clean.
- [ ] Edit-existing-brief re-opens wizard with saved values; prefill skipped; save bumps `revision` and does NOT fire kickoff.
- [ ] Focused-column mode (double-click or Enter) collapses sibling lanes to 48px; parked rail unchanged; Esc returns; ephemeral.
- [ ] Inline `<details>` BriefPanel replaced by one-liner + "Open details ›" link.
- [ ] `briefSchema`, `REQUIRED_BRIEF_FIELDS`, `canTransition`, `saveBriefAndTransition`, atomic `POST .../brief`, `eventSchema` — **unchanged**. `schema-initiative-v0.md §4.3` updated same-PR with `discovery.research.summary`.

**Out:** Real LLM / agent wiring (deterministic stubs). Re-run discovery on brief edit (S4). S4 deliverables (open-questions CRUD, export pack, re-run audit). S5–S8 scope. Changes to `/pdlc-brief-custom` question copy. Widening any S3 contract.

**Dependencies:** S3A.1 merged (drag, mandatory indicators, summary composite with two buttons, board shell, density toggle, parked rail).

**Risks:**
- **Prefill quality too low** → scoped to 2 fields, feature-flag off in prod, Regenerate + Clear per field.
- **Runner model re-opens** → tick-driven is **locked** by the seed; background process requires an ADR.
- **Side-panel a11y regression** → explicit `role="complementary"` + axe tests on open / each tab.
- **Edit-brief accidentally re-fires kickoff** → server fires kickoff only when lane actually transitions `idea → discovery`.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S3A.2 — Discovery automation surface + side panel + prefill. Branch: feat/s3a2-discovery-automation. Bar: A.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S3A.1 actual outcomes:
1. plans/PDLC_UI/seeds/s3a2-discovery-automation.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 3A.2.
3. pdlc-ui/docs/design/board-layout.md — implements §5 (side panel) + §6 (focused-column) this sprint.
4. 04-Projects/PDLC_Orchestration_UI.md Slice log — S3A.1 actual outcomes (drag + menu converge on one API; mandatory indicators; summary-step click-to-edit; two buttons identical in 3A.1; one-liner preview; board shell + elastic lanes + parked rail + density). Flag any S3A.2 DoD item invalidated.
5. .claude/skills/pdlc-brief-custom/SKILL.md — already reshaped to 3 questions (S3A.1 pre-stage); confirm prefill draft fields map cleanly to coreValue + targetUsers + problem envelopes.
6. plans/PDLC_UI/schema-initiative-v0.md — add discovery.research.summary envelope to §4.3 + note initiative_jobs table.
7. plans/PDLC_UI/skill-agent-map.md — decide prefill skill naming (default: pdlc-brief-prefill-custom sibling).
8. plans/PDLC_UI/seeds/s3b-discovery-research.md — lock the DiscoveryResearchProvider interface so S3B can swap in without touching route / job / UI.

Resolve Open Questions in seed § "Open questions to resolve in Plan mode" (prefill skill name, prod flag default, side-panel primitive, stub step count N) before Build. Output: task list closing every DoD checkbox. List scope conflicts before Build. Do NOT modify S4+ sprint blocks or any S3 contract.
```

---

## Sprint 3B — `/pdlc-discovery-research-custom` (real research) *(~2 weeks; deep-dive first)*

**Bar:** **A** — replaces the S3A.2 kickoff stub behind the same `DiscoveryResearchProvider` interface. Real discovery research: market intelligence, competitor snapshots, customer evidence, strategic-fit scoring against ICP. Runs on kickoff + a **weekly sweep** across all `discovery`-column cards.

**Goal:** Make discovery actually discover. Replace the deterministic stub with a skill that composes existing Dex intelligence (`/customer-intel`, `/intelligence-scanning`, `/weekly-exec-intel`, `/meeting-prep`) into a per-initiative research pass that writes `discovery.*` and **accumulates context weekly**. The runner model, job table, route handlers, and UI from S3A.2 stay untouched — S3B is a provider swap plus a new skill file.

**⚠ Open sprint — deep-dive 2026-04-22+ with Shaun + PO before Build.** See [`seeds/s3b-discovery-research.md`](./seeds/s3b-discovery-research.md) § "Deep-dive open questions" (Q1–Q10). `System/icp.md` is a **blocker for the weekly sweep** and is authored by Shaun as part of this deep-dive.

**Maps to:** [plan.md § Phase 3+](./plan.md) "Intelligence & meeting correlation" + product philosophy ("UI steers what Dex already does") + schema-initiative-v0 §4.3 / §8 discovery contract + S3A.2 `DiscoveryResearchProvider` interface.

**Deliverables (outline — fleshed out in deep-dive)**

- **New skill** `.claude/skills/pdlc-discovery-research-custom/SKILL.md` — I/O contract per `schema-initiative-v0 §8`; cadence (kickoff + manual re-run + weekly sweep); composition with existing Dex intel skills.
- **Provider swap** — implement `DiscoveryResearchProvider.advance(...)` with real vault reads + LLM synthesis; replace the S3A.2 stub import. Route handler, `initiative_jobs` table, client polling, progress bar, side-panel Discovery tab **unchanged**.
- **Weekly sweep entrypoint** — manual `/weekly-discovery-sweep` chat command + optional cron hook via existing Dex cadence scripts. Refreshes every `discovery`-column card; preserves `user` / `reviewedBy != null` fields; appends `openQuestion` drafts when new evidence contradicts a reviewed field.
- **ICP artefact** `System/icp.md` (authored by Shaun 2026-04-22; co-ships with S3B).
- **Discovery source list** (TBC Q2) — shared `System/discovery-sources.yaml` seeded by ICP segment, or per-initiative `discovery.sources[]`. Default: shared YAML.
- **Schema doc delta** — `/pdlc-discovery-research-custom` row in `schema-initiative-v0 §8` (pre-staged 2026-04-21); `skill_run` known-ids list includes the id.
- **Tests** — unit fixtures for the provider (brief + mocked vault → expected `discovery.*` diff); Playwright smoke (kickoff → tick → terminal → non-empty `research.summary`).

**DoD (outline)**

- [ ] Deep-dive questions Q1–Q10 in the seed closed in Plan mode before Build.
- [ ] `System/icp.md` exists and is read by the provider.
- [ ] Provider swap: S3A.2 stub replaced with **zero** changes to route handler / `initiative_jobs` table / polling client / side-panel Discovery tab.
- [ ] Kickoff writes the full `discovery.*` set (see `seeds/s3b-discovery-research.md` Outputs table).
- [ ] Weekly sweep refreshes all `discovery`-column cards; preserves reviewed fields; surfaces contradictions as draft `openQuestion`s.
- [ ] LLM calls server-side only; cost ceiling defined + enforced; one `skill_run` event per card per run + one Slice log weekly roll-up.
- [ ] `schema-initiative-v0 §4.3` + `§8` match the provider's actual reads/writes.
- [ ] Playwright smoke: seed brief → kickoff → tick-to-terminal → side-panel Discovery tab shows non-empty synthesis.

**Out**

- Widening `brief.*` (frozen by S3A.1), changes to `canTransition` / `saveBriefAndTransition` / atomic brief API / `eventSchema` / `initiative_jobs` schema / runner model.
- Auto-re-run on brief edit (PM-triggered only).
- Hosted / headless execution beyond existing Dex cadence + `pdlc-ui` tick runner (R15 Phase 2 territory).
- Client-side LLM calls / browser-exposed model keys.

**Dependencies:** S3A.1 merged (shrunk brief), S3A.2 merged (`DiscoveryResearchProvider` interface, `initiative_jobs` table, kickoff route, side-panel Discovery tab, staleness plumbing), `System/icp.md` authored.

**Risks**

- **ICP authoring slippage** → weekly sweep cannot score strategic fit without it; the kickoff path can still run (scored as `gate.strategicFit` only) but the sweep's "still a fit?" check is disabled. Start the skill shipping with kickoff only; add the sweep in a follow-up commit once ICP lands.
- **LLM cost spiral on the weekly sweep** → define per-run + per-sweep cost ceilings in the deep-dive; emit cost in the `skill_run` event payload (new optional field) if the runtime supports it.
- **Partial-failure semantics** → commit-partial + emit `openQuestion` noting the gap (default per seed Q8) — confirm in Plan mode.
- **Runner-model pressure** → a research pass longer than a few minutes pushes on the tick-driven invariant. If the deep-dive concludes this is needed, lift it to an ADR (not a sprint-convenience override).

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S3B — /pdlc-discovery-research-custom. Branch: feat/s3b-discovery-research. Bar: A.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S3A.1 + S3A.2 actual outcomes:
1. plans/PDLC_UI/seeds/s3b-discovery-research.md — close Q1–Q10 in the Deep-dive block BEFORE any Build task is written.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 3B.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S3A.2 actual outcomes (DiscoveryResearchProvider interface, initiative_jobs columns, kickoff route, side-panel Discovery tab, staleness plumbing). Flag any S3B DoD item invalidated.
4. plans/PDLC_UI/schema-initiative-v0.md §4.3 + §8 — confirm discovery.* write list + /pdlc-discovery-research-custom I/O row match the provider design.
5. .claude/skills/pdlc-brief-custom/SKILL.md — confirm the 3-question brief contract S3B reads; do NOT mutate it.
6. .claude/skills/{customer-intel,intelligence-scanning,weekly-exec-intel,meeting-prep}/SKILL.md — S3B composes these.
7. System/icp.md — blocker for the weekly sweep; confirm it exists (Shaun authors 2026-04-22).
8. plans/PDLC_UI/skill-agent-map.md — add a row for /pdlc-discovery-research-custom.

Output: (a) deep-dive resolutions for Q1–Q10, (b) task list closing every DoD checkbox, (c) cost ceilings + LLM-provider decision. List scope conflicts before Build. Do NOT widen brief.* or any S3 / S3A contract; do NOT change the runner model / initiative_jobs schema / route handlers.
```

---

## Sprint 4 — Discovery: questions, export, re-run, design pack *(~2 weeks)*

**Bar:** **A (minimal)** / **B (full)**. **Bar A ships:** open-questions CRUD on card + **export pack download** (template merge). **Bar B adds:** re-run audit UX, workshop export polish, CSV export ergonomics.

**Goal:** **Discovery** is usable in workshops and feeds **Claude Design** via **export pack**.

**Maps to:** **R5**, Stage 4; [export-pack-template](./export-pack-template.md).

**Deliverables**

- **Open questions** CRUD on card (`text`, `owner`, `status`).
- **Export** open questions → Markdown / CSV.
- **“Re-run discovery”** — bumps `discoveryIteration` (or audit log), optional placeholder for future AI regen.
- **“Download export pack”** — fills [export-pack-template.md](./export-pack-template.md) from initiative fields + brief + questions (**includes mandatory R6b “Implementation polish” block** — satisfies plan **R6b**; UI one-click copy = later polish).

**Technical — how**

- Template merge (mustache/handlebars/simple replace `{{}}`).
- File download in browser.
- **UI:** question list, editors, export actions via **`/anthropic-frontend-design`**.

**DoD**

- [ ] User can answer a question, save, export, download pack without Dex.
- [ ] Re-run increments version / timestamp visible on card.
- [ ] Discovery surfaces match design standard.

**Out:** Design artefact fields, design review checklist.

**Dependencies:** Sprint 3.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S4 — Discovery: questions, export, re-run, design pack. Branch: feat/s4-discovery. Bar: A (minimal) / B (full).

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S3 actual outcomes:
1. plans/PDLC_UI/seeds/s4-discovery.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 4.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S3 actual outcomes (brief.* payload shape, wizard step JSON location, cancel UX). Flag any S4 DoD item invalidated.
4. plans/PDLC_UI/export-pack-template.md — placeholders for the pack download (R6b "Implementation polish" block lives here).

Decide Bar A (export pack + open questions) vs Bar B (full re-run audit + workshop export polish) scope based on whether Bar A exit is imminent. Output: task list closing every DoD checkbox. List scope conflicts before Build.
```

---

## Sprint 5 — Design column: artefacts + hi-fi gate *(~2 weeks)*

**Bar:** **B** — starts after Bar A exit. First Steerco-readable surface.

**Goal:** Card in **design** holds **Figma** + **Claude Design** links and **lo-fi / optional hi-fi** metadata; aligns with **R6** (manual DS).

**Maps to:** **R6**, Stage 5 (artefacts); **not** R7 yet if team is tight — can merge Sprint 5+6 with care (**AC2**: avoid same PR as full spec wizard).

**Dogfood / test case (process):** Building this screen **is** the first end-to-end rehearsal of **“design column + artefact fields”** that product teams will use. Capture **screenshots or notes** in the Slice log: what Steerco would upload to Claude Design vs what the **orchestration UI** itself required — close the loop for future copy in export packs.

**Deliverables**

- Form fields (canonical schema names): `figmaLibraryUrl`, `claudeDesignSessionUrl`, `loFiArtifactUrl`, `hiFiRequired`, `hiFiArtifactUrl`, **`claudeDesignHandoffPath`**, **`implementationPolishNote`**.
- Optional: **embed** or link-open in new tab.
- **Hi-fi gate** boolean + rationale text.
- **UI:** entire **design-lane card detail / form** built with **`/anthropic-frontend-design`** (this sprint sets the **visual baseline** for Steerco-heavy forms).

**Technical — how**

- URL validation; optional file upload later (links only in MVP is OK).
- Pair **persisted fields** with form submit paths in the same PR.

**DoD**

- [ ] Design column cards show artefact links; edits persist.
- [ ] Export pack from Sprint 4 still merges design section if populated.
- [ ] **R6 UI** reviewed as **dogfood** entry in Slice log (what worked / what to change in export template).

**Out:** Design review checklist blocking `spec_ready`.

**Dependencies:** Sprint 4.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S5 — Design column: artefacts + hi-fi gate. Branch: feat/s5-design-artefacts. Bar: B (first post-Bar-A sprint).

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

GATE: Do not start unless Bar A exit is confirmed per plan.md § Bar A success (real initiative completed idea → spec_ready on the board; zero retro-written PRD sections; at least one Re-run discovery event; no → idea wipes used in anger). If the gate is not met, stop and report the gap.

Then read in order, and adapt the plan to S4 actual outcomes:
1. plans/PDLC_UI/seeds/s5-design-artefacts.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 5.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S4 actual outcomes (export pack fields wired, openQuestions schema, discoveryIteration audit). Flag any S5 DoD item invalidated.
4. plans/PDLC_UI/plan.md R6 — Claude Design + Figma DS contract.
5. plans/PDLC_UI/export-pack-template.md — design section merge target.

Output: task list closing every DoD checkbox. Include the dogfood slice-log entry (what Steerco would upload to Claude Design vs what the orchestration UI itself required). List scope conflicts before Build.
```

---

## Sprint 6 — Design review gate *(~2 weeks)*

**Bar:** **B** — hard gate. **Bar A** surfaces the same checklist as a **warning nudge** only (no block).

**Goal:** **Cannot** enter **`spec_ready`** from **`design`** without **pass or waiver** on checklist.

**Maps to:** **R7**, Stage 6.

**Dogfood / test case (process):** This is the **second** rehearsal of the Steerco **design review gate** — same checklist patterns you will enforce for product cards. Use it to validate **wording**, **order**, and **waive** flow before Steerco sees it.

**Design system seed (out of R6):** After S5–S6 land, add **`pdlc-ui/docs/design-system.md`** (and optionally **`pdlc-ui/src/styles/tokens.css`** or shared primitives) capturing **colours, type scale, form field pattern, checklist row** extracted from the shipped R6/R7 UI. **Sprint 7+** should **consume** these tokens/components so the DS grows from **R6 implementation**, not a blank Figma file.

**Deliverables**

- Checklist UI (items from north star: contrast, tap targets, DS skim, hi-fi extras when present).
- **Pass / Waive** with **reason** + **timestamp** + **`by`** — MVP uses fixed placeholder **Shaun** (single operator); free-text override optional if product wants.
- **UI:** checklist + audit panel via **`/anthropic-frontend-design`** (consistent with S5 forms).

**Technical — how**

- Persist `designReview` object on initiative: `{ status, waived, reason, at, by }`.
- Implement **design→spec_ready** gate in code; **Sprint 8** generalises into full **`canTransition`** matrix (merge without conflict).

**DoD**

- [ ] UI blocks `design` → `spec_ready` until pass or waiver saved.
- [ ] Audit visible on card detail.
- [ ] **`design-system.md`** (or equivalent) drafted from **actual** S5–S6 components — even a **v0.1** bullet list of tokens is enough to unlock S7 polish.

**Out:** `agent-prd` flow.

**Dependencies:** Sprint 5.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S6 — Design review gate. Branch: feat/s6-design-review. Bar: B (hard gate; Bar A path surfaces same checklist as warning nudge only).

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S5 actual outcomes:
1. plans/PDLC_UI/seeds/s6-design-review.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 6.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S5 actual outcomes (design artefact fields + hi-fi gate wiring). Flag any S6 DoD item invalidated.
4. plans/PDLC_UI/plan.md R7 — design → spec_ready gate behaviour + waive policy (PO or Designer; audit by=shaun placeholder).
5. pdlc-ui/docs/design-system.md (read if present — seeded later this sprint if absent; v0.1 extract from S5–S6 UI per implementation-standard.md § 5).

Output: task list closing every DoD checkbox INCLUDING design-system.md v0.1 draft. Design-system.md draft must list tokens + patterns extracted from S5–S6 UI so S7+ can consume them. List scope conflicts before Build.
```

---

## Sprint 7 — `spec_ready`: handoff + `/agent-prd` MVP *(~2 weeks)*

**Bar:** **B**. **Bar A uses the export-only path** (S4 export pack → paste into chat → run `/agent-prd` manually) and does not ship the wizard. Bar B makes the wizard first-class.

**Goal:** **`spec_ready`** produces a **reviewable spec handoff** for engineering (**MD + design pointers**) via **export + Cursor**, and unlocks **`develop`**. **Structured spec-wizard questions are required** (not optional placeholders) so PRDs are complete; **iterate** questions with PO as usage proves gaps.

**Maps to:** **R8**, **R14** (release notes seed), Stage 7; **BDD** remains optional in generated content (skill behaviour, not UI block).

**Default `spec_complete` checklist (MVP — nudge, PO-adjustable):**

- Brief + discovery + design references present on card **or** explicit “N/A + reason”.
- **All required** spec-wizard / clarifying questions answered (mirrors **`/agent-prd`** intent).
- Risks / out-of-scope captured (short fields OK).
- **“Ready for engineering handoff”** acknowledgement checkbox (honour system).

**Deliverables**

- **`spec_ready` experience:** **spec wizard** with **required** structured steps (not shell-only MVP).
- **“Generate handoff bundle”** — concatenated markdown from brief + discovery + design + agent-prd-oriented template; **R6b “Implementation polish”** text comes from **export-pack-template** (S4), not duplicated ad hoc.
- **“Copy for Cursor”** / **deep link** instructions (open repo, paste, run `/agent-prd`).
- **`spec_ready` → `develop`** only when **`specComplete`** satisfied per checklist above (nudge — not hard enforcement of external tools).
- **`userReleaseNotes`** field: **plain language**, **end-user-focused** draft (what customers get); editable from card when entering **`develop`** or when marking develop done — **R14**.

**Technical — how**

- Large string builder from initiative JSON → downloadable `.md`.
- **Vault:** continuous **`06-Resources/PRDs/`** sync + card **tabs** + **history** = **plan R13** — **do not collapse into S7** unless timeboxed; if not in S7, document **“R13 phase 2”** in README and ship download-only MVP.
- **UI:** spec-ready column + wizard via **`/anthropic-frontend-design`**; **reuse** **`pdlc-ui/docs/design-system.md`**.

**DoD**

- [ ] User completes: idea → … → spec_ready → **answer required wizard** → export → **specComplete** → **develop**.
- [ ] README: PRD markdown still goes through **git PR** by human; user-facing language avoids **“promote to vault”** (use **“Saved to product files”** when R13 exists).
- [ ] **Release notes** field visible and saved on card for **develop** path.
- [ ] Spec-ready UI **imports or mirrors** v0.1 DS doc (no visual regression vs S5–S6 unless intentional).

**Out:** Auto PR merge, in-browser agent execution, **R13** full vault threading (unless deferred).

**Dependencies:** Sprint 6.

**Risks:** Scope creep into full agent-prd parity or R13 → **timebox**; ship **export + required wizard + release notes** first; R13 tabs/history as next epic.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S7 — spec_ready: handoff + /agent-prd MVP. Branch: feat/s7-spec-ready. Bar: B (Bar A uses export-only path via S4 export pack + manual /agent-prd in chat).

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply).

Then read in order, and adapt the plan to S6 actual outcomes:
1. plans/PDLC_UI/seeds/s7-spec-ready.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 7 — includes the default spec_complete checklist (MVP nudge, PO-adjustable).
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — S6 actual outcomes (designReview gate wired + waive flow + design-system.md v0.1 tokens). Flag any S7 DoD item invalidated.
4. .claude/skills/agent-prd/SKILL.md — spec wizard + PRD generation contract (BDD Step 3b optional in MVP).
5. plans/PDLC_UI/plan.md R8 + R14 — spec_ready semantics + userReleaseNotes (plain-language, end-user focused).
6. plans/PDLC_UI/export-pack-template.md — R6b "Implementation polish" block (do NOT duplicate; reuse).
7. pdlc-ui/docs/design-system.md — v0.1 patterns S7+ MUST consume (no visual regression vs S5–S6 unless intentional; see implementation-standard.md § 5).

R13 vault continuous save is OPTIONAL this sprint if timebox bites — if deferred, document "R13 phase 2" in README follow-up. Output: task list closing every DoD checkbox. List scope conflicts before Build.
```

---

## Sprint 8 — Backward moves, wipe-to-idea, develop rewind *(~2 weeks)*

**Bar:** **B** — harden rewind after Bar A has exercised forward flow on a real initiative.

**Goal:** **Rework** without losing history; **`develop` / `uat` → earlier columns** (MVP: **PM approves**); **hard reset** to `idea` per governance with **accident mitigation**.

**Maps to:** **R11**, [lifecycle-transitions](./lifecycle-transitions.md). **Parked** intent+reason already in **S2** — this sprint only adjusts if **edit parked reason** is needed.

**Deliverables**

- Allowed **backward** transitions: `spec_ready`→`design`/`discovery`, `design`→`discovery`, **`develop`/`uat` → earlier columns** (same data-retention defaults as `spec_ready` row — confirm in UI).
- **`→ idea`**: modal **“This wipes all except title and description”** + **high-friction confirm** (e.g. type **title** to confirm) and/or **JSON snapshot** to `pdlc-ui/data/snapshots/` before wipe (per lifecycle-transitions).
- Central **`canTransition(from,to,initiative)`**; tests for matrix; **merge** S6 design→spec_ready gate.

**Technical — how**

- Unit tests for full matrix.
- **UI:** confirm modals via **`/anthropic-frontend-design`** + DS doc.

**DoD**

- [ ] Backward move retains data; wipe leaves only title+body; **wipe confirm** is high-friction.
- [ ] Illegal transitions rejected with clear message.
- [ ] **`develop`/`uat` rewind** works with PM confirmation flow.

**Out:** **R12** company-strategy module (deferred — was old “S9”).

**Dependencies:** Sprint **6**+ (needs design gate in matrix); **after Sprint 7** preferred so rewind is tested on full flow.

**Plan mode seed** (copy this block into Cursor Plan mode):

```
Execute Sprint S8 — Backward moves, wipe-to-idea, develop rewind. Branch: feat/s8-backward-moves. Bar: B.

Read plans/PDLC_UI/plan-mode-prelude.md first (cross-sprint refs apply — lifecycle-transitions.md arrives via prelude with full rewind + wipe rules).

Then read in order, and adapt the plan to S2–S7 cumulative outcomes:
1. plans/PDLC_UI/seeds/s8-backward-moves.md.
2. plans/PDLC_UI/sprint-backlog.md § Sprint 8.
3. 04-Projects/PDLC_Orchestration_UI.md Slice log — cumulative outcomes of S2 (parked), S3 (brief complete gate), S6 (design gate), S7 (specComplete nudge). The canTransition matrix generalises these scattered rules; reconcile all of them without breaking existing DoD.
4. plans/PDLC_UI/plan.md R11 — backward moves contract; PM approves develop/uat rewind in MVP.

Output: task list closing every DoD checkbox INCLUDING unit tests covering the full canTransition(from,to,initiative) matrix. Wipe confirm must be high-friction (type title or similar) and snapshot JSON to pdlc-ui/data/snapshots/ before wipe. List scope conflicts before Build.
```

---

## Sprint 9 — **DEFERRED** — Company strategy “golden thread” *(TBD)*

**Bar:** **Phase 2+** (post Bar B, concurrent with Agent Flywheel research).

**Status:** **Not MVP.** [plan.md](./plan.md) **R12** requires a **Wyzetalk company strategy** source (e.g. `company_strategy.md`) and rules / optional ML — **not** Dex `System/pillars.yaml`.

**When un-deferred:** Multi-select strategy tracks, non-conformance warnings (e.g. engagement platform vs budgeting tool), documented heuristics.

**Plan mode seed (deferred — do not run until R12 scoped):** [`seeds/s9-company-strategy.md`](./seeds/s9-company-strategy.md).

---

## Optional Sprint 10+ — Hardening & catalogue

**Bar:** **B / Phase 2+**. Headless agents are **Phase 2 (Agent Flywheel)** per [plan R15](./plan.md). Phase 3+ intelligence threads are **captured-only** in [phase3-research.md](./phase3-research.md).

- **R13 — Vault continuity:** tabs (Idea · Brief · Discovery · Spec/PRD · Design), **history**, **save-on-sync** to `06-Resources/PRDs/` (no “promote to vault” copy), **re-run discovery** / **re-run spec** flows wired to files.
- **R6b** UI polish: one-click **copy “Implementation polish”** block from pack (template already satisfies R6b from **S4**).
- **Essential PRD read-only catalogue** (Stage 8+ north star).
- **Duplicate detection** ([plan compound](./plan.md#compound-opportunities)).
- **CI:** validate initiative JSON + optional PRD frontmatter grep.
- **Headless agents** — phase 2 after adoption proof ([plan](./plan.md) **R15**).

---

## Velocity & dependency graph (summary)

**Solo default:** linear **S0 → S7**, then **S8** (rewind + wipe). **S9 / R12** deferred.

```text
S0 ──► S1 ──► S2 ──► S3 ──► S4 ──► S5 ──► S6 ──► S7 ──► S8
              │                              ▲
              └── parked intent+reason ─────┘ (in S2)
```

**S9 (R12 company strategy):** unscheduled — revisit after MVP.

---

## Definition of Ready (per sprint, before Plan mode)

- [ ] Previous sprint **DoD** met and merged.
- [ ] **No open** ICT/security blockers for this layer.
- [ ] **Owner** named for sprint (default: Shaun).
- [ ] **Branch created** for this cycle (`feat/…` or `sprint/N-short-name`) — **not** developing on **`main`** ([plan R16 §7](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).
- [ ] Host git: **branch protection** + **required checks** planned or enabled for default branch ([plan R16 §8](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).

---

## After each sprint (retro, 15 min)

1. What shipped vs plan?  
2. Update **Slice log** in `04-Projects/PDLC_Orchestration_UI.md`.  
3. One **learning** line in `System/Session_Learnings/` if something blocked velocity.

---

*Created 2026-04-23 — agile decomposition for `pdlc-ui`; adjust sprint length to team capacity.*
