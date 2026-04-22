# PDLC UI — lifecycle, rewind rules, strategy thread

**Companion:** [plan.md](./plan.md) · [skill-agent-map.md](./skill-agent-map.md) · [04-Projects/PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) — **company strategy** = post-MVP (see § Company strategy alignment).

---

## Canonical column order (`lifecycle`)

`idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed`

**Branch:** `parked` (see below).

**Board wins** for `lifecycle` vs PRD YAML — see [PRDs/README § Lifecycle](../../06-Resources/PRDs/README.md#lifecycle-steerco--pdlc-board).

---

## `canTransition` — enforced matrix (Sprint 2)

The pure function [`canTransition`](../../pdlc-ui/src/lib/can-transition.ts) is the single source of truth for lane legality. The repository (`transitionInitiative`), the HTTP route (`POST /api/initiatives/[id]/transition`), and the `Move to…` submenu in the UI all call it with the same `(from, to, context)` arguments so users never see a menu item that the server would reject for a non-parked reason.

**Scope (S2):** forward-only. Backward moves remain as described below but are **not yet wired in the UI / repository** — they land in Sprint 8 alongside the wipe-on-`→ idea` rule (see § "Backward moves").

| From → To | S2 status | Reason when blocked |
|-----------|-----------|---------------------|
| `idea → discovery` | Allowed **only when** `hasBrief` is `true` (`brief.complete === true`) | `brief_required` — "Complete the product brief." |
| `discovery → design` | Allowed | — |
| `design → spec_ready` | Allowed | — |
| `spec_ready → develop` | Allowed | — |
| `develop → uat` | Allowed | — |
| `uat → deployed` | Allowed | — |
| `* → parked` (any forward lane) | Allowed **only with** `parkedIntent ∈ {revisit, wont_consider}` + trimmed non-empty `parkedReason` | `parked_requires_intent_and_reason` — UI enforces via a required modal before submitting. |
| `parked → idea` | Allowed (un-park). Clears `parkedIntent` + `parkedReason`. | — |
| `parked → anywhere else` | Blocked in S2 (rewind goes via idea first) | `illegal_transition` |
| Any skip-forward (e.g. `idea → design`) | Blocked | `illegal_transition` |
| Any backward move not listed above | Blocked in S2 | `illegal_transition` — lands in S8. |

**`hasBrief` derivation (S3):** `deriveHasBrief` returns `initiative.brief?.complete === true` (wizard-complete). ~~S2 heuristic (any key on `brief`)~~ — superseded.

**Atomic brief + move (S3):** `POST /api/initiatives/:id/brief` writes the full `brief.*` envelope, appends `skill_run` then `stage_transition` (`idea` → `discovery`), bumps `revision` **once**. The client does **not** call `POST .../transition` for this path after the wizard.

**Parked modal (UI contract):** moving to `parked` opens the `ParkedTransitionDialog` ([`parked-transition-dialog.tsx`](../../pdlc-ui/src/components/ideas/parked-transition-dialog.tsx)) with a required radio group (`revisit` / `wont_consider`) and a trimmed non-empty reason textarea. Cards never appear in a main lane while `lifecycle === "parked"`; a **right-edge collapsible "Parked" rail** ([`parked-rail.tsx`](../../pdlc-ui/src/components/ideas/parked-rail.tsx) — collapsed-by-default, persisted per browser via `localStorage`) reveals the parked cards with an **Un-park → Idea** action. *(S3A.1 replaced the S2 `Show parked` header drawer with this rail; see [board-layout.md §3](../../pdlc-ui/docs/design/board-layout.md).)*

**Reorder (within lane):** drag-to-reorder inside a lane writes a new `sortOrder` via `POST /api/initiatives/[id]/reorder` and appends a `field_edit` event. Keyboard reorder falls back to `Alt + ↑/↓` or explicit "Move up/Move down" menu items on a focused card.

**Cross-lane DnD (S3A.1):** cross-lane drag-and-drop **shipped in S3A.1** ([`board-dnd.tsx`](../../pdlc-ui/src/components/ideas/board-dnd.tsx) + [`ideas-board.tsx`](../../pdlc-ui/src/components/ideas/ideas-board.tsx); seed [seeds/s3a1-brief-wizard-interactions.md](./seeds/s3a1-brief-wizard-interactions.md); backlog [§ Sprint 3A.1](./sprint-backlog.md#sprint-3a1--brief-wizard--board-interaction-polish-2-weeks)). It is **additive** to the `Move to…` menu — both paths call the same API; the menu remains the canonical screen-reader fallback. Drop targets evaluate the **same pure `canTransition`** function (imported client-side and memoised on drag-start); illegal lanes dim and surface the existing `humanError` tooltip on hover; drops there are no-ops. Drops onto the source lane are a **silent no-op** (Q-P2.1 — `same_lifecycle` is filtered before any API call fires). Dragging `idea → discovery` opens the S3 brief wizard (not a direct transition) — the `brief.complete` gate is preserved. Dragging `→ parked` opens the existing `ParkedTransitionDialog` (intent + reason) unchanged. **Library:** `@dnd-kit/core` only — `PointerSensor` (6px activation distance) owns pointer cross-lane drag; `KeyboardSensor` is wired for later (pixel-perfect Space → Arrow → Space keyboard DnD is deferred to S3A.2 under focused-column mode — the `Actions → Move to…` submenu is the shipped, test-enforced keyboard cross-lane path this sprint). `@dnd-kit/sortable` is deliberately **not** installed (Q-alt.1, [tech-stack.md §3.5](./tech-stack.md)). **Within-lane pointer reorder** (native HTML5 in S2) was **removed this sprint** — `draggable` on the card `<li>` preempted dnd-kit's PointerSensor and blocked real-user cross-lane drag (e2e blind spot: Playwright synthesises pointer/mouse events but not HTML5 `drag*`). `Alt+↑/↓` keyboard reorder and the `Actions → Move to…` menu cover within-lane changes until S3A.2 reintroduces it via dnd-kit over-events + `neighboursForSwap`.

### Skill triggers on column moves (PDLC UI)

**Authoritative table:** [skill-agent-map.md § Stage → skill](./skill-agent-map.md#stage--skill-v1-target---updated-2026-04-21) · **card contract:** [schema-initiative-v0.md](./schema-initiative-v0.md).

| Transition / column | Skill to invoke (PDLC path) | Card-state focus |
|---------------------|---------------------------|------------------|
| While in **`idea`** (optional) | **`/pdlc-idea-gate-custom`** | `gate.*`; on `no_go`, prefill **parked** reason |
| **`idea` → `discovery`** | **`/pdlc-brief-custom`** (not `/product-brief` — that skill emits a full PRD for general Dex use) | `brief.*`, `discovery.openQuestions[]` drafts |
| **`spec_ready`** (on column entry) | **`/agent-prd`** | `spec.*`, `linkedPrdPath` |

Power users in **Cursor** may still run canonical **`/product-brief`** outside the board; the **Steerco UI** sequences **`pdlc-brief-custom`** so behaviour matches the initiative schema and survives **`/dex-update`** (see [skill-agent-map § Update discipline](./skill-agent-map.md#update-discipline--how-these-skills-survive-dex-update)).

---

## Forward flow (happy path)

1. **`idea`** — Modal: **minimum** title + description/summary; save → card in **Idea**. **Optional:** nudge **`/pdlc-idea-gate-custom`** (5-Q gate → `gate.recommendation`; `no_go` → parked intent/reason).
2. **`idea` → `discovery`** — **Blocked until** a completed **`/pdlc-brief-custom`** stepwise flow (help text per question; same *shape* as the skill — UI may mirror [pdlc-brief-custom SKILL.md](../../.claude/skills/pdlc-brief-custom/SKILL.md)). On save, **discovery** work is active: research, problem detail, solution directions, **open questions**. (Brief is **required** to enrich discovery; discovery will later expand to evidence-led research — not MVP.)
3. **`discovery`** — Workshop: open a question → answer → save → optional **“Re-run discovery”** (same skill / prompt pack with updated answers) to refresh synthesis without losing history (append **iteration** or timestamp in audit).
4. **`discovery` → `design`** — User builds **export pack** (prompt + `.md`) for **Claude Design**; attach outputs to card; move to **Design** when artefacts are linked.
5. **`design`** — Lo-fi / optional hi-fi → **`/anthropic-frontend-design`** → **design review** → when happy, **`design` → `spec_ready`**.
6. **`spec_ready`** — **`/agent-prd`**-aligned flow **on column entry** (MVP: export + Cursor; later in-app). **Structured clarifying questions in the spec wizard are required** so the PRD is not incomplete; iterate questions as usage proves gaps. Optional later = **card-level** prompts / notifications for async follow-ups.
7. **`spec_ready` → `develop`** — **`specComplete`** (nudge checklist — see sprint backlog); **handoff pack** to engineering: PRD `.md` + design links for **Cursor Plan mode**. **`develop` / `uat` / `deployed`:** status lanes — **PM updates** to reflect delivery; **user-facing release notes** (non-technical) on the card — see plan **R14**.

---

## Backward moves (scope change / rework)

**Principle:** Cards must be **rewindable** without forking a new initiative every time reality shifts.

| From | Allowed back to | Data retained |
|------|-----------------|---------------|
| `spec_ready` | `discovery`, `design` | **All** brief, discovery, design, spec-draft artefacts unless user chooses to prune |
| `design` | `discovery` | Brief + discovery; design artefacts may be **superseded** (keep versions or “stale” flag) |
| `discovery` (and any column) | `idea` | **Wipe everything except title + description/summary** — **all transitions into `idea`** use this rule |
| `develop` / `uat` | earlier columns | **Product decision** — recommend same as `spec_ready` row (retain by default); never auto-wipe without confirm |

**Wipe rule (mandatory):** Any transition that lands the card in **`idea`** clears **everything except `title` + `body` (description/summary)** — brief, discovery, open questions, design artefacts, spec drafts, tags, parked intent/reason, release notes draft. **Accidental wipe mitigation (MVP):** require **high-friction confirm** (e.g. type initiative **title** to confirm) and/or **write a JSON snapshot** of the pre-wipe card to `pdlc-ui/data/snapshots/` for manual restore — **no** silent undo stack in v1 unless added later.

---

## `parked`

Canonical case (R16): **`parkedIntent`** + **`parkedReason`** (camelCase on the wire and in code; the SQL columns use `parked_intent` / `parked_reason`). See [`schema-initiative-v0.md`](./schema-initiative-v0.md).

| Value | Meaning |
|-------|---------|
| `revisit` | We intend to come back; not dead. |
| `wont_consider` | Deprioritised / not doing for now (different from "done"). |

**UI (S2):** moving to **Parked** opens the `ParkedTransitionDialog` and requires **`parkedIntent`** (radio; default `revisit`) **and** a **non-empty `parkedReason`** (e.g. "Waiting on client budget", "Superseded by X"). Un-parking (`parked → idea`) clears both fields. Cards with `lifecycle === "parked"` do not occupy a main lane — they live in a toggle-able drawer.

---

## Company strategy alignment (“golden thread”) — **post-MVP**

**Not in MVP.** Dex **`System/pillars.yaml`** is **personal** planning context — **not** Wyzetalk **company strategy**.

**Future:** maintain **[company_strategy.md](./company_strategy.md)** (or CMS) describing WT strategy; initiatives that look like **off-strategy bets** get **warnings or tags** once rules + data exist. Until then, no blocking tags at idea capture.

---

*Last updated: 2026-04-22 — S3A.1 build pass 2: HTML5 `draggable` removed from the card `<li>` after a human-validation defect — it was preempting `PointerSensor` and blocking real-user cross-lane drag. Within-lane pointer reorder is now an S3A.2 carry-over (keyboard Alt+↑/↓ + menu still work); added an e2e regression guard that fails if the card ever re-advertises `draggable="true"`. Pass 1: parked drawer replaced by right-edge **parked rail**; cross-lane DnD shipped (`@dnd-kit/core` only — Q-alt.1; menu retained as a11y fallback; `same_lifecycle` drop is silent — Q-P2.1; `idea → discovery` still opens the brief wizard so `brief.complete` is preserved). Prior: 2026-04-21 S3A.1 note (DnD intent). 2026-04-19 S3 atomic brief + move (`deriveHasBrief` = `brief.complete === true`); S2 `canTransition` matrix (forward-only, `brief_required` gate, parked modal, within-lane reorder); skill triggers table; all-into-idea wipe; strategy post-MVP.*
