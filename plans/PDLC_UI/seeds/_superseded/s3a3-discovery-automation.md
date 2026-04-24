> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../../../skill-pipeline/README.md). This seed does not drive current work. Also superseded within the pdlc-ui cycle (see 2026-04-22 note below).

> **SUPERSEDED 2026-04-22.**
>
> This seed originally scoped **S3A.2** as "Discovery automation surface + non-modal side panel + prefill". After S3A.1 merged and real-user feedback asked for a single housing surface for every per-initiative artefact, S3A.2 pivoted to the **URL-addressable Initiative Modal + chat-style brief wizard + within-lane reorder restore** — see [`../s3a2-initiative-modal-tabs-chat-wizard.md`](../s3a2-initiative-modal-tabs-chat-wizard.md).
>
> The scope below (prefill, tick-driven discovery kickoff, `initiative_jobs` table, edit-existing-brief, focused-column mode, `KeyboardSensor` revival) moved forward to **S3A.3** — see [`plans/PDLC_UI/sprint-backlog.md § Sprint 3A.3`](../../sprint-backlog.md) for the current row and the trimmed deliverable list. A new seed (`s3a3-discovery-automation.md`) will be authored when S3A.2 merges; this file is preserved verbatim for the original reasoning, field scope, and runner-model contract — all of which carry forward unchanged. The only structural difference: the progress surface moves from the side panel into the **Initiative Modal's Discovery tab**; "non-modal side panel" is dropped.
>
> Reasoning for the pivot: [`pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md`](../../../../pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md).
>
> ADR on the DnD shape (relevant to `KeyboardSensor` revival here): [`pdlc-ui/docs/adr/0003-dnd-shape-and-html5-ban.md`](../../../../pdlc-ui/docs/adr/0003-dnd-shape-and-html5-ban.md).
>
> **Do not execute this seed as S3A.2.** Execute [`../s3a2-initiative-modal-tabs-chat-wizard.md`](../s3a2-initiative-modal-tabs-chat-wizard.md) for S3A.2; author a new S3A.3 seed when S3A.2 merges.

---

Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S3A.2 — Discovery automation surface + side panel + prefill (Bar A). Branch: feat/s3a2-discovery-automation.

Sprint 3A.2 is the **second of the two-slice 3A pass** (3A.1 interactions shipped first). It adds the **automation surface** on top of the polished S3+3A.1 journey: a **pre-filled** brief draft when the wizard opens, a **discovery research kickoff** with a **visible in-progress surface** on the card, an **edit-existing-brief** path, and a **non-modal resizable side panel** that preserves board context. The research runner itself is a **deterministic stub** this sprint — the real agent is wired in S4. 3A.2 proves the **surface**, not the intelligence.

**S3A.1 lands the CPO brief shrink** (three questions: *why* / *who* / *what* — `coreValue` + `targetUsers` + `problem`). S3A.2's prefill therefore targets **all three required fields** of the shrunk brief (not two). This keeps prefill perfectly aligned with the wizard's required set — every field the PM is asked to fill is also the field the prefill helper drafts.

**S3B replaces the kickoff stub.** The `discovery-kickoff-custom` runner in S3A.2 is a **deterministic stub** whose only job is to prove the runner model (tick-driven, client-polled, server-advanced) and the card-level progress surface. **`/pdlc-discovery-research-custom`** (S3B) replaces the stub's advance+terminal logic with real research behind the same interface — no runner-model change, no job-table change. S3A.2 must keep the stub swappable behind a single import.

**Requires S3A.1 merged.** 3A.2 builds on:
- Drag-and-drop as primary affordance (menu as a11y fallback).
- Mandatory field indicators in the wizard.
- Summary step composite with two buttons — "Save brief & start discovery" (primary) and "Save brief only" (secondary). In 3A.1 they are identical server-side; **in 3A.2 the primary additionally fires the kickoff call**.
- One-line `problem.value` preview on the card face.
- Board layout shell (chrome-light, elastic columns, parked rail, density toggle).

**Carry-over from S3 (and S3A.1) that S3A.2 must respect:**
- Atomic `POST /api/initiatives/:id/brief` still owns brief save + lane move + `revision +1` + `skill_run` + `stage_transition`. Reuse unchanged.
- `brief.complete === true` gate, `deriveHasBrief`, `canTransition` — unchanged.
- `briefSchema`, `eventSchema` — not widened. `skill_run` event covers prefill and kickoff iterations. No new event kinds.
- `REQUIRED_BRIEF_FIELDS`, `briefWizardAnswersSchema` — unchanged.

**Goal:** close the Chief-Designer-approved journey — drag in, open a wizard that's already part-drafted, save, watch research tick forward on the card, then open a side panel to read idea + brief + discovery + activity in one place without losing the board.

---

### Deliverables

**1. Pre-filled brief drafts from the idea description (scoped + flagged)**
- New server endpoint: **`POST /api/initiatives/:id/brief/prefill`** — called exactly once when the wizard opens for an initiative with `brief.complete !== true` AND no prior `skill_run` with `skill === "pdlc-brief-prefill-custom"` in `events[]` (server-gated idempotence, not client-asserted).
- **Scoped to the three required brief fields this sprint:** `coreValue` (why), `targetUsers` (who), `problem` (what) — i.e. every field the S3A.1 wizard asks for. The `coreValue` draft seeds from the gate's `strategicFit` + `tradeOff` values when they exist, falling back to a low-confidence rewrite of the idea body's first paragraph. `targetUsers` seeds from `gate.primaryBeneficiary` + any named segments in the body. `problem` seeds from the body's first paragraph.
- **Feature-flagged:** default **ON in dev**, **OFF in prod** via env flag `NEXT_PUBLIC_ENABLE_BRIEF_PREFILL` (or equivalent; confirm in Plan mode). When OFF, the endpoint is still exposed but returns `{ drafts: [] }`.
- Response shape (full envelope, per schema-initiative-v0 §3): `{ drafts: [{ field, value, confidence: "low" | "med", source: "agent_draft", sourceRef: null, updatedAt }] }`. **Server does NOT write the brief** — it returns drafts; the wizard merges them into its in-memory answers state.
- **UI behaviour:**
  - Each pre-filled field renders a **"Draft from idea"** badge + confidence chip (low = red, med = amber).
  - Per-field **"Regenerate"** icon button — re-requests a new draft for that field only (same endpoint, increments the `skill_run` iteration). Prevents wizard re-opening as the escape hatch.
  - Per-field **"Clear"** button — empties the field, removes the badge.
  - **User-typing wins:** if the field is already non-empty when a draft response lands (e.g. the user started typing while the request was in flight), that field is **skipped** — draft does not overwrite user input.
  - On save, any pre-filled field that the user edited flips `source` to `user` and `confidence` to `high`.
- **Prefill latency:** the wizard opens immediately with **skeleton placeholders** on the three prefill-target fields. Drafts fade in on arrival. If the request fails or times out (10s), show an amber inline notice ("Draft unavailable — fill manually") — no toast storm.
- **Prefill helper implementation:** **server-side only**; no model keys in the browser. This sprint ships a **deterministic stub** swappable via a single import — reads `title` + first paragraph of `body` and emits a low-confidence rewrite. Real LLM wiring is out of scope (S4+ or a later PO-driven pass).
- Every call (success or skipped-by-user-typing) appends a `skill_run` event with `{ skill: "pdlc-brief-prefill-custom", iteration }`. `iteration` is computed server-side as "count of prior `skill_run` events for this `(initiativeId, skill)` + 1" — see [schema-initiative-v0 §6](../schema-initiative-v0.md#6-events--append-only-audit).

**2. Discovery research kickoff + visible in-progress on the card** *(stub this sprint; S3B replaces the stub with real research behind the same interface)*
- New endpoint: **`POST /api/initiatives/:id/discovery/kickoff`** — called by the wizard on success of the primary **"Save brief & start discovery"** button (not the secondary "Save brief only" path). Creates a row in the new `initiative_jobs` table (below) and appends a `skill_run` event with `{ skill: "discovery-kickoff-custom", iteration }`.
- **Swappability contract for S3B:** the runner's per-tick advance function is a single server-side module behind an interface (e.g. `DiscoveryResearchProvider.advance(jobId, step) → { progress, done, payloadPatch }`). S3B replaces this module with `/pdlc-discovery-research-custom`; the route handler, job row schema, client polling, progress UI, and terminal-write path stay untouched. Document the interface in the S3A.2 Slice log so S3B can swap cleanly.
- **Runner model (locks the biggest CTO risk):** the runner is **tick-driven, client-polled, server-advanced**. There is **no background process, no setInterval in a route handler, no Next.js `after()`**.
  - Client polls `POST /api/initiatives/:id/discovery/jobs/:jobId/tick` every 2s while `status === "running"`.
  - Each tick call advances the job by one step (increment `progress`, update `heartbeat_at`, return new status). Total of N steps (N ~= 5 for the stub); terminal on the Nth tick (status = `succeeded`, writes a short `discovery.research.summary` envelope to the initiative within the same transaction, bumps initiative `revision +1`, emits a `skill_run` event for the summary write).
  - Stops polling on terminal status.
- **New GET endpoint:** `GET /api/initiatives/:id/discovery/jobs/latest` — returns `{ jobId, status, progress, startedAt, updatedAt, heartbeatAt, error }` for the most recent discovery-research job on this initiative. Kickoff POST response has the same shape.
- **Startup reconciler:** on app boot (or on first read of a `running` job older than N seconds — N ~= 30), mark stale `running` jobs as `failed` with `error = "server_restart"`. Idempotent.
- **Cancellation via deletion:** if the initiative is deleted while a job is running, the next tick call returns 410 Gone and the job row auto-fails with `error = "initiative_deleted"`. Not queued for restart.
- **UI on the card (in the `discovery` column):**
  - **While running:** linear progress bar (driven by `progress` 0–100) + status text ("Researching…"). Bar advances with each 2s tick.
  - **On success:** "Research drafted" chip; the **Discovery** tab in the side panel shows the `discovery.research.summary` envelope.
  - **On failure:** amber "Retry research" chip that re-calls the kickoff endpoint (new job row). Lane does **not** roll back.
  - **Timeout:** if a job is `running` and its `heartbeat_at` is older than 60s, client marks it as **stalled** in the UI and offers the same retry affordance; next tick from the reconciler will flip the row to `failed`.
- **No schema change to `brief.*` or `discovery.openQuestions[]` this sprint.** The only new initiative-JSON write is `discovery.research.summary` (a new envelope field in `discovery.*`) — add it to `schema-initiative-v0.md §4.3` same-PR.

**3. `initiative_jobs` table (locked columns)**
- New SQLite table (+ Drizzle schema + migration, per R16 guardrail 1, same-PR):

```
initiative_jobs
---------------
id              TEXT PK                                    (e.g. nanoid)
initiative_id   TEXT NOT NULL REFERENCES initiatives(id) ON DELETE CASCADE
kind            TEXT NOT NULL CHECK (kind IN ('discovery-research'))
status          TEXT NOT NULL CHECK (status IN ('running','succeeded','failed'))
progress        INTEGER NOT NULL DEFAULT 0                 (0..100)
started_at      TEXT NOT NULL                              (ISO-8601)
updated_at      TEXT NOT NULL                              (ISO-8601)
heartbeat_at    TEXT                                       (ISO-8601; set on each tick)
error           TEXT                                       (null when status != failed)
payload         TEXT NOT NULL DEFAULT '{}'                 (JSON for step state; opaque to UI)
```

- Index on `(initiative_id, kind, started_at DESC)` to make "latest job" queries cheap.
- **Jobs are ephemera, not initiative state** — do NOT embed them in `initiative.data` JSON. Progress ticks do not bump initiative `revision`.
- The terminal write that lands `discovery.research.summary` is **separate** from the job row update and **does** bump `revision +1` (standard initiative write path).

**4. Right-rail side panel (non-modal, resizable, board stays live)**
- New component: `InitiativeSidePanel` — replaces the inline `<details>` BriefPanel from S3/S3A.1 on the card face (card retains the one-line `problem.value` preview from 3A.1 + a "Open details ›" link that opens the panel on the relevant tab).
- **ARIA semantics:** `role="complementary"` with `aria-label="Initiative details"` — **NOT** `role="dialog"`. No focus trap. Esc closes via a keyboard listener (captured at the panel root, not via a dialog primitive).
- **Resizable:** drag the **left edge** to resize; default **420px**, min **320px**, max **600px**. Width persists per user (`localStorage`).
- **Drag auto-collapse:** while a card-drag is in progress anywhere on the board, the panel collapses to an **80px summary rail** (just the tab icons) and re-expands to the previous width on drag end. Prevents the panel from stealing columns exactly when the user is reaching for them.
- **Tabs:**
  - **Idea** — `title` + rendered `body` via `RichTextRenderer`.
  - **Brief** — full brief composite (reuses the summary-step renderer from 3A.1 where possible; source + confidence chips). Includes an **"Edit brief"** action (see Deliverable 5).
  - **Discovery** — latest job status + progress (live if running) + `discovery.research.summary` when available. S4 is free to grow this tab (open-questions CRUD etc.).
  - **Activity** — scrollable `events[]` list (chronological descending).
- **Opens on card click** (anywhere outside the drag handle / menu trigger). Pins to the last-opened tab per user. Clicking another card swaps the panel content in place; closing (Esc or ✕) leaves the board untouched and remembers horizontal scroll position.
- **Keyboard:** Tab reaches the panel after the last card in its column; Shift+Tab returns; Esc closes; arrow-key focus within the panel follows shadcn primitives.

**5. Edit existing brief (from the side panel's Brief tab)**
- In the Brief tab, an **"Edit brief"** button re-opens `BriefWizardDialog` pre-populated with the saved `brief.*` values.
- **Prefill is skipped on edit** (`brief.complete === true` gates it off — server-enforced).
- Save path is the existing atomic `POST .../brief` — it re-writes the full envelope, bumps `revision`, appends a `skill_run` event (with a new iteration — semantics unchanged), and **does NOT re-fire the discovery kickoff** (kickoff is tied to the initial lane move `idea → discovery`; editing an already-in-`discovery` brief does not re-run research in 3A.2 — that's a deliberate boundary with S4's "Re-run discovery" affordance).
- No new schema fields; no new event kinds.

**6. Focused-column mode (from the board-layout design doc — implementation)**
- Double-click a column header (or press Enter on a focused header) to enter focused mode: that column expands to fill the visible board; sibling main lanes collapse to **48px rails** showing only the stage icon + card count. Parked rail is unaffected.
- Esc returns to the default layout.
- Focus state is **ephemeral** (not persisted) — it's a deep-work escape hatch, not a view setting.
- Implements the focused-column spec documented in 3A.1's [`pdlc-ui/docs/design/board-layout.md`](../../pdlc-ui/docs/design/board-layout.md).

---

### Technical — how

- **Runner model is the single highest-leverage decision — lock tick-driven before Build.** The benefits: no background process, no restart-zombies (heartbeat + reconciler handle it), testable in Playwright by polling at an accelerated rate, trivially swappable for a real queue in S4. Cost: ticks advance only while a client is watching — acceptable for a stub that S4 replaces.
- **Prefill helper is a server-only module** behind an interface (e.g. `BriefPrefillProvider`) so S4+ swaps it for a real LLM without touching the route or the wizard.
- **Server-gated prefill idempotence:** check `events[]` for a prior `pdlc-brief-prefill-custom` `skill_run`; if found and not a "Regenerate" call, return the cached draft (cache is the wizard's state + an optional short-TTL server cache keyed by `(initiativeId, iteration)`).
- **`discovery.research.summary` envelope:** add to `schema-initiative-v0.md §4.3` and the runtime Zod `discoverySchema` in `pdlc-ui/src/schema/initiative.ts` same-PR (R16 guardrail 1). Shape = `stringFieldEnvelopeSchema` (already defined for S3).
- **Side panel is NOT a shadcn `Dialog`** — it is a bespoke slide-over (or a primitive that supports non-modal, e.g. a drawer without focus trap). Verify in Plan mode that the chosen base component supports `role="complementary"` + no trap; override shadcn defaults where needed.
- **Tests:**
  - Unit: `initiative_jobs` repository (create, advance, fail, reconcile-stale, cascade-delete on initiative delete); prefill idempotence gate; `discovery.research.summary` Zod round-trip.
  - Playwright (happy path): drag → wizard opens with prefilled `problem` + `targetUsers` (dev flag ON); Regenerate on one field triggers a new `skill_run`; user-typing-wins race (type fast, slow-mock endpoint, field not overwritten); Save-&-start-discovery fires kickoff; card shows progress bar ticking; terminal success writes summary; side panel shows summary.
  - Playwright (recovery): kickoff that fails on tick 3 → "Retry research" chip starts a new job row; server restart reconciler flips stale `running` → `failed` on the next read.
  - Playwright (side panel): non-modal behaviour — clicking a card behind the panel swaps panel content without closing; drag a card while panel open → panel auto-collapses → drag end restores width; Esc closes; axe clean.
  - Playwright (edit brief): open panel → Brief tab → "Edit brief" → wizard opens with saved values, prefill skipped; Save rewrites brief, bumps revision, does NOT fire kickoff.
- **Reuse, don't fork:** `BriefWizardDialog`, `canTransition`, `saveBriefAndTransition`, `briefWizardAnswersSchema`, `REQUIRED_BRIEF_FIELDS`, `RichTextRenderer`, density toggle from 3A.1 — all unchanged.

---

### UI

- Read `.claude/skills/anthropic-frontend-design/SKILL.md` before styling the progress bar, "Draft from idea" badges, regenerate affordance, side panel tabs, and focused-column rails.
- R18 baseline: tokens only; 2px focus ring on every interactive (including the panel resize handle and the tab triggers); keyboard end-to-end; no raw markdown.
- Board-layout design doc from 3A.1 governs panel dimensions and focused-column specifics.

---

### DoD

**Prefill**
- [ ] `POST /api/initiatives/:id/brief/prefill` exists; server-gated to fire at most once per `(initiativeId, skill)` unless "Regenerate" is invoked; default ON in dev / OFF in prod via env flag.
- [ ] The three required brief fields (`coreValue`, `targetUsers`, `problem`) receive drafts this sprint. `coreValue` seeds from `gate.strategicFit` + `gate.tradeOff` when present. No other fields are drafted (legacy optional fields stay empty).
- [ ] Each drafted field shows a "Draft from idea" badge + confidence chip + Regenerate + Clear.
- [ ] User-typing-wins: a field the user already typed in is not overwritten when the draft response lands (Playwright test).
- [ ] Prefill failure opens an empty wizard with a visible amber notice — no toast storm.
- [ ] Editing a drafted field flips `source` to `user` and `confidence` to `high` on save.

**Discovery kickoff + runner**
- [ ] Primary "Save brief & start discovery" button fires `POST .../discovery/kickoff` on success of the atomic brief save; secondary "Save brief only" does not.
- [ ] Kickoff creates an `initiative_jobs` row and appends a `skill_run` event with `{ skill: "discovery-kickoff-custom", iteration }`.
- [ ] Kickoff response and `GET .../discovery/jobs/latest` return `{ jobId, status, progress, startedAt, updatedAt, heartbeatAt, error }`.
- [ ] Client polls `/tick` every 2s; each tick advances one step; terminal tick writes `discovery.research.summary` (envelope) and bumps initiative `revision +1`.
- [ ] Card shows progress bar ticking during `running`; "Research drafted" chip on `succeeded`; "Retry research" chip on `failed` (new job row on retry; lane does not roll back).
- [ ] Startup reconciler flips stale `running` jobs (heartbeat > 30s) to `failed` with `error = "server_restart"`.
- [ ] Initiative delete cascades to job rows; in-flight tick returns 410 Gone.

**Side panel**
- [ ] Panel opens on card click; `role="complementary"`; no focus trap; Esc closes; board behind stays interactive.
- [ ] Tabs: Idea / Brief / Discovery / Activity — rendered content matches spec; activity lists `events[]` chronologically descending.
- [ ] Resizable via left edge; default 420px / min 320px / max 600px; width persists per user.
- [ ] Drag auto-collapse to 80px rail while a card-drag is active; restores width on drag end.
- [ ] Inline `<details>` BriefPanel on card face is replaced by a one-liner `problem.value` + "Open details ›" link (one-liner is already present from 3A.1).

**Edit brief**
- [ ] "Edit brief" on panel's Brief tab re-opens wizard with saved values; prefill skipped; Save rewrites via atomic endpoint; `revision` bumps; no kickoff re-fire.

**Focused column**
- [ ] Double-click or Enter-on-focused column header enters focused mode (siblings collapse to 48px rails, parked rail unchanged); Esc returns; ephemeral (not persisted).

**Contracts**
- [ ] `briefSchema`, `REQUIRED_BRIEF_FIELDS`, `canTransition`, `saveBriefAndTransition`, atomic `POST .../brief` are **unchanged**.
- [ ] `eventSchema` **unchanged** (no new event kinds — prefill + kickoff + summary-write all reuse `skill_run`).
- [ ] `schema-initiative-v0.md §4.3` updated same-PR with `discovery.research.summary` envelope; `lifecycle-transitions.md` updated if any legality nuance is introduced (none expected).

---

### Schema + docs same-PR discipline

- **New migration** for `initiative_jobs` + `schema.ts` + `schema-initiative-v0.md` mention (new table noted at an appropriate anchor + `discovery.research.summary` added to §4.3) — all in the **same PR** (R16 guardrail 1).
- New routes (`/api/initiatives/:id/brief/prefill`, `/api/initiatives/:id/discovery/kickoff`, `/api/initiatives/:id/discovery/jobs/:jobId/tick`, `/api/initiatives/:id/discovery/jobs/latest`) must be listed in the S3A.2 Slice log.
- `tech-stack.md § 3` addendum if a non-shadcn primitive is chosen for the non-modal panel.
- Post-merge: Slice log line + tick S3A.2 Progress in plan.md.

---

### Explicitly OUT

- Real LLM wiring for prefill or research (deterministic stubs acceptable this sprint).
- Re-run discovery on brief edit — the boundary with S4's "Re-run discovery" stays crisp: 3A.2 only fires kickoff on the initial `idea → discovery` move; editing an in-discovery brief does not re-run research.
- S4 deliverables (open-questions CRUD, export pack, re-run audit, workshop export polish).
- S5–S8 scope (design artefacts, review gate, spec wizard, backward moves).
- Multi-user concurrency beyond what S3 already handles (409 refetch+retry unchanged).
- Changes to `/pdlc-brief-custom` question copy / order / workflow.
- Widening any S3 contract: `briefSchema`, `REQUIRED_BRIEF_FIELDS`, `canTransition`, `saveBriefAndTransition`, atomic `POST .../brief`, `eventSchema`.

---

### Risks

- **Prefill quality too low erodes trust** → scoped to 2 fields, confidence chips, Regenerate + Clear per field, feature flag OFF in prod this sprint.
- **Runner-process debate re-opens** → tick-driven + client-polled + server-advanced is **locked** by this seed; any push to background-process must motivate with a production justification + ADR, not sprint convenience.
- **Side-panel a11y regression (focus trap accidentally enabled)** → explicit `role="complementary"` check in Playwright; axe on panel open across tabs.
- **Resizable panel + elastic columns interaction** → drag auto-collapse to 80px rail addresses the worst case; measure on a 1440px laptop before merge.
- **Edit-brief path accidentally re-fires kickoff** → server checks: kickoff fires only when the save transitions `lifecycle` from `idea` to `discovery`; edit-in-discovery does not match.
- **Startup reconciler overshoots during legit long ticks** → heartbeat < 30s threshold is deliberately generous for a 2s polling cadence; adjust if Playwright flakes.

---

### Open questions to resolve in Plan mode (before Build)

1. **Prefill skill name:** `pdlc-brief-prefill-custom` (sibling) vs a "prefill" mode flag on `/pdlc-brief-custom`. Default this sprint = **sibling** (keeps the user-facing wizard skill clean; PO re-confirms).
2. **Prefill feature flag default in prod:** confirm **OFF in prod** is the safe ship while the stub is deterministic; flipping ON coincides with real LLM wiring in a later sprint.
3. **Side panel primitive:** confirm the base component supports `role="complementary"` and no focus trap; fallback to a bespoke slide-over if shadcn's `Dialog` cannot be coerced cleanly.
4. **Step count N for the research stub:** default **5** (~10s wall-clock at 2s poll). Confirm before Build.

---

Post-merge: Slice log line + tick S3A.2 Progress in plan.md. Do **not** modify S4+ sprint blocks or any S3 contract.
