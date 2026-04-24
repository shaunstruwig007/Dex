> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../../skill-pipeline/README.md). This seed does not drive current work.

Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S3A.1 — Brief wizard + board interaction polish (Bar A). Branch: feat/s3a1-brief-wizard-interactions.

> **Rename note (2026-04-24 — 007 persona re-map):** references in this seed to `/pdlc-discovery-research-custom` describe the skill now known as **`/moneypenny-custom`**. Sprint seed retained with original slug for historical accuracy; current canonical slug is `/moneypenny-custom`. See [plans/Research/moneypenny-strategy.md](../../Research/moneypenny-strategy.md).

Sprint 3A.1 is the **first of a two-slice pass** (3A.1 interactions + 3A.2 automation-surface). It ships the **craft + cohesion** changes on top of S3 **without** introducing any new runner process, job record, or server-side skill call. 3A.1 is safe, small, shippable alone. It explicitly does not touch S4/S5+/S6+ scope.

**CPO decision 2026-04-21 (reverses earlier deferral):** the brief is reshaped to **three questions only** — *why* (`coreValue`), *who* (`targetUsers`), *what* (`problem`). Scope / assumptions / success metrics move to **discovery** (`/pdlc-discovery-research-custom`, S3B) and **spec** (`/agent-prd`). The brief shrink lands here in S3A.1 (same PR as the mandatory indicators and summary composite — it is a wizard-UX change, and S3A.2's prefill already targets these three fields). `briefSchema` narrows the `required-for-complete` list but keeps legacy fields as **optional** (backward compat with pre-2026-04-21 cards — no data migration). See [schema-initiative-v0 §4.2](../schema-initiative-v0.md#42-brief--discovery-brief-pdlc-brief-custom-output).

**What moved to S3A.2 (so this sprint stays tight):**
- Pre-filled brief drafts from the idea description (prefill endpoint, "Draft from idea" badges, regenerate per field).
- Discovery research kickoff + in-progress surface on the card (job record, tick-driven runner, progress bar).
- URL-addressable Initiative Modal (Idea / Brief / Discovery / Spec / Design / Activity tabs). _(Originally scoped as a non-modal right-rail side panel; pivoted 2026-04-22 — see [`../../pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md`](../../../pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md).)_
- Edit-existing-brief path from the Initiative Modal's Brief tab (deferred to S3A.3 with the other automation-surface work).

**Carry-over from S3 Slice log (2026-04-21) that S3A.1 must respect:**
- Atomic `POST /api/initiatives/:id/brief` saves the brief + moves the lane in one transaction with `revision +1`, emitting `skill_run` then `stage_transition`. **Reuse unchanged** (no contract change — only the required-fields list and the steps content shrink).
- `brief.complete === true` is the gate; `deriveHasBrief` reads it; `canTransition` enforces it. **Do not relax.**
- `eventSchema` is tight (discriminated union on `event.kind`; `skill_run` payload = `{ skill, iteration }`). **Do not widen.**
- `briefSchema` **narrows** the `required-for-complete` list (now `problem` + `targetUsers` + `coreValue`) and keeps legacy fields as **optional** — this is a narrowing, not a widening. Same-PR schema-doc update in [§4.2](../schema-initiative-v0.md#42-brief--discovery-brief-pdlc-brief-custom-output).
- Card moves today run through an **ellipsis "Move to…" menu** (S2). S3A.1 **adds** drag-and-drop on top; menu stays as the a11y/keyboard fallback (not regressed).

**Goal:** make the S3 journey feel designed **and honest** — the brief is now three questions (why / who / what) you actually have answers to at `idea → discovery`; you can drag a card into discovery; the wizard marks all three as required and lets you jump around; the summary step is a real, editable composite; the card face gains a one-line brief preview. Zero new server processes, zero new skills.

---

### Deliverables

**0. Brief shrink — three questions only (CPO pass)**
- **Required set narrows to three fields:** `problem` (what problem are we solving?), `targetUsers` (who are we solving it for?), `coreValue` (why are we doing this?). `REQUIRED_BRIEF_FIELDS` drops `successDefinition`, the `scopeIn` "≥1 line" rule, and the `assumptions` "≥1 row" rule.
- **Wizard content shrinks:** `pdlc-ui/content/pdlc-brief-steps.json` reduces to **3 content steps + 1 summary step** (down from 10 + summary). Content ordering = `coreValue` (why) → `targetUsers` (who) → `problem` (what) → summary. Rationale: the "why" answer frames the next two; the summary gains `understandingSummary` auto-synthesis.
- **Legacy fields stay in the schema as optional:** `scopeIn`, `scopeOut`, `assumptions[]`, `constraints`, `successDefinition` remain on `briefSchema` (backward compat — existing cards validate unchanged). The wizard does **not** render them; `/pdlc-discovery-research-custom` (S3B) writes equivalents to `discovery.*` once that ships. Confirm in Plan mode: no data migration, no prod backfill — existing cards keep their saved values; fresh cards leave them empty.
- **Skill update (same PR):** [`.claude/skills/pdlc-brief-custom/SKILL.md`](../../.claude/skills/pdlc-brief-custom/SKILL.md) is already updated (2026-04-21 CPO pass) to one-round Phase 2 with the three questions + the legacy-fields note. Audit it against the final step content before merge.
- **Schema doc update (same PR):** [`schema-initiative-v0.md §4.2`](../schema-initiative-v0.md#42-brief--discovery-brief-pdlc-brief-custom-output) already reflects the new required list. Audit the JSON shape matches the runtime Zod `briefSchema` in `pdlc-ui/src/schema/initiative.ts` before merge.
- **Tests update:** Vitest cases in `pdlc-ui/src/schema/initiative.test.ts` and `pdlc-ui/src/lib/brief-wizard-validation.test.ts` drop the `successDefinition` / scope / assumptions assertions from the "complete" fixtures; a new fixture exercises the 3-field happy path. Playwright smoke `e2e/brief-wizard.spec.ts` updates to 3 content steps.
- **Out of scope for this deliverable:** no rename of the legacy fields, no removal from the TypeScript `BriefState` interface, no DB migration. Clean-up of unused fields is a later sprint.

**1. Drag-and-drop card movement (primary affordance, accessible)**
- Cards drag between lifecycle columns and into `parked` via pointer drag.
- **`canTransition` is imported client-side** (the function is pure — lives at `pdlc-ui/src/lib/can-transition.ts`) and evaluated on `dragOver` to decide legality. Illegal target columns **dim to ~50% opacity** and render a hover tooltip with the existing `humanError` message; drop on an illegal target is a no-op (not an error toast).
- Dropping `idea → discovery` **opens the S3 brief wizard** — does not perform the transition. Same gate as today.
- Dropping `→ parked` opens the existing `ParkedTransitionDialog` (S2) unchanged.
- Drag-to-reorder within a column continues to write `sortOrder` via `POST /api/initiatives/[id]/reorder` with a `field_edit` event (S2 unchanged).
- Library choice = **confirm in Plan mode** (default: `@dnd-kit/core` — headless + accessible — see Open Q1). CSS-only HTML5 DnD is **forbidden** (no first-class keyboard support).
- **Keyboard DnD is mandatory:** wire `KeyboardSensor` + `sortableKeyboardCoordinates` (or equivalent). Space picks up, arrows move, Enter drops, Esc cancels. Add a Playwright keyboard-only test that moves a card from `idea` to `discovery` via keys and opens the wizard at the end.
- **"Move to…" ellipsis menu is retained** as the canonical keyboard/SR fallback. Both paths converge on the same API calls. Drag is additive, not a replacement.

**2. Mandatory field indicators in the wizard**
- Every step whose `field` is in `REQUIRED_BRIEF_FIELDS` renders: a red asterisk beside the step label; the word **"Required"** in the step header; a small red dot on the step-rail marker until the field is answered.
- A **"* Required"** legend is visible at the top of the wizard from step 1.
- `REQUIRED_BRIEF_FIELDS` and the `required` flag on `pdlc-brief-steps.json` are the **sole source of truth**. No schema change.

**3. Summary step = real composite + click-to-edit**
- The final summary step (now step **4** after the shrink) renders a **read-only composite** of: idea (`title`, rendered `body` via the existing `RichTextRenderer`), the three confirmed brief fields (`coreValue`, `targetUsers`, `problem`) with source + confidence chips from S3, and the auto-synthesised `understandingSummary`.
- **Click-to-edit:** clicking any block in the summary jumps the wizard to that step with focus on the primary control — users don't have to Prev-Prev-Prev to fix one field.
- **Two actions, one primary:**
  - Primary (default): **"Save brief & start discovery"** — calls existing atomic `POST /api/initiatives/:id/brief` (lane moves to `discovery`). S3A.1 ships this button **with the label and shape**; the actual **kickoff call** is wired in **S3A.2**. In S3A.1 the save simply succeeds — the card lands in `discovery` with no progress bar, like today.
  - Secondary (smaller, text button): **"Save brief only"** — same atomic endpoint, same `complete: true` flag, same lane move. Identical server call this sprint; the label is the user signal that "I'm committing the brief but may come back for discovery later" (pays off when S3A.2 adds the kickoff under the primary).
- No new fields, no new event kinds.

**4. One-line brief preview on the card face**
- When `brief.complete === true`, the card face shows a single **truncated `problem.value`** line (max ~80 chars, ellipsis) under the card title, before the existing handle + stage badges.
- The existing inline `<details>` BriefPanel on the card face **remains in S3A.1** (it is replaced by the Initiative Modal in S3A.2 — don't move it yet, one change at a time).

**5. Board layout polish (from the Chief Designer pass)**
- Implement the **board layout spec** at [`pdlc-ui/docs/design/board-layout.md`](../../pdlc-ui/docs/design/board-layout.md) (added same-PR — see Schema/docs discipline). Scope this sprint:
  - **Chrome-light shell:** when on the board route, the global app header collapses to a ~48px sticky bar; the **board** becomes the primary scroll container with `height: calc(100vh - 48px)`.
  - **Elastic columns:** `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` for the main 7 lanes. Horizontal scroll only kicks in below the natural floor; visible columns grow to fill width.
  - **Parked → right-edge rail:** `parked` moves out of the main 7-lane grid into a collapsible right rail (40px collapsed → 280px expanded). Reclaims one column slot.
  - **Density toggle in the sticky bar:** Compact / Comfortable (default) / Detailed. Persist per user (localStorage is fine this sprint).
  - **Not edge-to-edge:** keep 16–24px gutters left/right of the grid so drag-over highlights have somewhere to live.
- **Focused-column mode** (double-click a column header to collapse siblings) is specified in the doc but **not implemented this sprint** — documented as S3A.2 polish.

---

### Technical — how

- **DnD library:** default `@dnd-kit/core`. Confirm in Plan mode before Build; if overridden, note the why in the PR description and in [`tech-stack.md § 3`](../tech-stack.md#3-ui-primitives-r18) UI primitives addendum.
- **Client `canTransition`:** import the existing pure function directly — no HTTP call on `dragOver`. Confirm no server-only deps leak in (audit imports in the plan).
- **Density toggle:** add a small context hook (`useBoardDensity`) reading/writing `localStorage`; applies a data-attr on the board root and CSS variables for card `--card-py`, `--card-gap`, `--card-lines`.
- **Parked rail:** render after the 7 lanes; not a new lifecycle value. The parked drawer toggle from S2 moves into this rail's header.
- **Tests:**
  - Unit: client `canTransition` imports cleanly (no server deps); density context round-trips through localStorage.
  - Playwright (pointer): drag card from `idea` to `design` is blocked with a visible tooltip; drag from `idea` to `discovery` opens the wizard (no direct transition); drag-to-reorder within `idea` still writes `sortOrder`.
  - Playwright (keyboard-only): move a card from `idea` to `discovery` via Space + arrows + Enter; wizard opens.
  - Playwright (a11y): axe smoke on the board in each density; axe smoke on the wizard summary step.
  - Playwright (wizard UX): "Save brief only" and "Save brief & start discovery" **both** save + move the lane in 3A.1 (identical behaviour this sprint).
- **Reuse, don't fork:** `BriefWizardDialog` internals, `canTransition`, `saveBriefAndTransition`, `briefWizardAnswersSchema`, `REQUIRED_BRIEF_FIELDS`, `ParkedTransitionDialog`, `RichTextRenderer` — all unchanged.

---

### UI

- Read `.claude/skills/anthropic-frontend-design/SKILL.md` before styling drag affordances, mandatory indicators, the summary step composite, and the density toggle.
- R18 baseline: `tokens.css` only; 2px visible focus ring on every draggable; keyboard nav end-to-end; no raw markdown anywhere.

---

### DoD

- [ ] **Brief shrink:** `REQUIRED_BRIEF_FIELDS` = `["problem", "targetUsers", "coreValue"]`. `pdlc-brief-steps.json` has 3 content steps + 1 summary step (order: why → who → what → summary). Legacy `scopeIn` / `scopeOut` / `assumptions` / `constraints` / `successDefinition` remain optional in `briefSchema` but are not rendered by the wizard. `schema-initiative-v0.md §4.2` and `pdlc-brief-custom/SKILL.md` updated same-PR (already staged).
- [ ] **Brief shrink — tests:** Vitest covers a 3-field "complete" fixture; the legacy 6+-field "complete" fixture still passes (backward compat). Playwright smoke traverses 3 content steps + summary.
- [ ] Drag a card between legal columns; illegal targets dim + show the existing `humanError` tooltip; drop there is a no-op.
- [ ] Drag from `idea → discovery` opens the S3 brief wizard (no regression of `brief.complete` gate).
- [ ] Drag-to-reorder within a column still writes `sortOrder` + `field_edit` event.
- [ ] Ellipsis "Move to…" menu works identically (a11y fallback); both paths hit the same API.
- [ ] Keyboard-only DnD: Space + arrows + Enter moves a card; Esc cancels; covered by Playwright test.
- [ ] Wizard required steps show asterisk + "Required" header + step-rail red dot; "* Required" legend visible from step 1.
- [ ] Summary step renders idea + saved brief fields + open questions; clicking any block jumps to that step with focus.
- [ ] Summary step has **two** actions: primary "Save brief & start discovery" and secondary "Save brief only"; both save + move the lane in 3A.1 (identical server behaviour).
- [ ] When `brief.complete === true`, card face shows a single truncated `problem.value` line.
- [ ] Board shell: sticky 48px header; board is the scroll container (`height: calc(100vh - 48px)`); 16–24px gutters left/right.
- [ ] Main 7 lanes render with `repeat(auto-fit, minmax(280px, 1fr))`; horizontal scroll engages only below the natural floor.
- [ ] Parked lane renders as a collapsible right-edge rail (40px / 280px); S2 parked drawer toggle moves into the rail header.
- [ ] Density toggle (Compact / Comfortable / Detailed) in the sticky header; persisted per user; axe-clean in each mode.
- [ ] `eventSchema`, `canTransition`, `saveBriefAndTransition`, and the atomic `POST .../brief` route **shape** are unchanged. `briefSchema` narrows (not widens) its `required-for-complete` set per Deliverable 0; `REQUIRED_BRIEF_FIELDS` shrinks to three fields. The server-side 422 `missing_required_fields` contract is preserved (same error shape, smaller list).
- [ ] Board layout design doc landed same-PR at `pdlc-ui/docs/design/board-layout.md`.

---

### Schema + docs same-PR discipline

- **Brief shrink touches four surfaces and they all land in one PR:** (a) `pdlc-ui/src/schema/initiative.ts` `briefSchema` (narrow required; keep legacy optional), (b) `pdlc-ui/content/pdlc-brief-steps.json` (3 content steps + summary), (c) `pdlc-ui/src/content/brief-steps.ts` helpers + `REQUIRED_BRIEF_FIELDS`, (d) tests (`initiative.test.ts`, `brief-wizard-validation.test.ts`, `e2e/brief-wizard.spec.ts`). `schema-initiative-v0.md §4.2` and `.claude/skills/pdlc-brief-custom/SKILL.md` are already updated and must ship in the same PR (audit before merge).
- `lifecycle-transitions.md` "Cross-lane DnD is explicitly **not implemented**" note must be updated in the same PR to reflect DnD landing in 3A.1.
- Update [`tech-stack.md § 3`](../tech-stack.md#3-ui-primitives-r18) UI primitives with the chosen DnD library (if `@dnd-kit/core` picked, one line is enough).
- Post-merge: Slice log line + tick S3A.1 Progress in plan.md.

---

### Explicitly OUT

- Anything in the **S3A.2** / **S3A.3** scope (S3A.2 = Initiative Modal + chat wizard + within-lane reorder; S3A.3 = prefill, kickoff, job record, edit-existing-brief, focused-column — both out of S3A.1).
- **Removal** of legacy brief fields from the schema (`scopeIn`, `scopeOut`, `assumptions`, `constraints`, `successDefinition`). They **stay** in `briefSchema` as optional for backward compat; removing them is a later cleanup sprint after S3B ships and migrates equivalent data to `discovery.*`.
- Data migration of existing cards. Pre-2026-04-21 cards keep whatever brief values they were saved with; the schema treats their legacy fields as optional.
- Changes to `eventSchema`, `canTransition`, or the atomic brief API shape. `briefSchema` required-set narrowing and `REQUIRED_BRIEF_FIELDS` shrink **are** in scope (Deliverable 0).
- S4+ scope (open-questions CRUD, export pack, re-run audit, design artefacts, review gate, spec wizard, backward moves).
- Any server-side agent call or new skill invocation (none introduced in 3A.1 — the two summary buttons behave identically server-side this sprint).
- S3B — the `/pdlc-discovery-research-custom` skill and its `discovery.*` writes. This sprint assumes the S3A.2 kickoff stub is the post-save behaviour; S3B replaces the stub in a later PR.

---

### Risks

- **DnD a11y regression** → keyboard-only Playwright test + keep menu path + axe in each density mode.
- **Elastic columns create layout jank when combined with Initiative Modal (3A.2)** → 3A.2 opens the modal over the board with a blurred overlay (board context is dimmed, not resized), so column widths stay stable; 3A.1 proves the elastic column behaviour in isolation so 3A.2 has a clean baseline. _(Original 2026-04-21 design was a non-modal drawer with drag auto-collapse; pivoted 2026-04-22.)_
- **Density toggle drift with card content** → define CSS variables in tokens, not per-component; density changes a data-attr only.
- **Keyboard DnD correctness** → easy to forget `KeyboardSensor` setup; DoD includes an explicit keyboard test to catch it before merge.
- **Scope creep into 3A.2 / 3A.3** → any "while we're here" modal / prefill / runner work is rejected in PR review; 3A.2 + 3A.3 each have their own branches.

---

### Open questions to resolve in Plan mode (before Build)

1. **DnD library:** confirm `@dnd-kit/core` (default) vs alternative; update `tech-stack.md § 3` accordingly.
2. **Density CSS variable set:** confirm the three presets in the design doc before implementing (compact heights: ~32px / 72px / 120px is the starting point).
3. **Parked rail default state:** collapsed or expanded on first load? Default = **collapsed** (Bar A has few parked items); can be toggled persistently.

---

Post-merge: Slice log line + tick S3A.1 Progress in plan.md. Do **not** modify S4+ sprint blocks or any S3 contract. S3A.2 starts on its own branch after merge.
