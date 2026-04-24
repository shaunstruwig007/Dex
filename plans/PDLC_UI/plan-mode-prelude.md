# PDLC UI — Plan mode prelude

> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../skill-pipeline/README.md). This prelude was the mandatory pre-read for every `pdlc-ui` Plan-mode run. Current-cycle Plan-mode runs for the skill pipeline use the live plan file directly; this prelude does not apply.

**Purpose:** This file is the **persistent, shared preamble** that every Cursor Plan-mode run for `pdlc-ui` must honour. Each sprint's **Plan mode seed** (inline in [`sprint-backlog.md`](./sprint-backlog.md) § Sprint `#`) opens with *"Read `plans/PDLC_UI/plan-mode-prelude.md` first, then execute this Sprint S&lt;N&gt; seed"* — you paste **only the sprint seed** into Plan mode; Cursor reads this file for the rest.

**Never copy-paste this content into Plan mode** — always let Cursor read the file so updates propagate automatically.

---

## 1. Cross-sprint references — Cursor must read these every Plan-mode run

These files apply to **every** sprint. Cursor reads them once per Plan-mode run (via this prelude); per-sprint seeds do **not** re-list them and only cite **sprint-specific** extras.

| File | Role |
|------|------|
| [`plan.md`](./plan.md) | Requirement authority (especially **R1 / R9 / R10 / R16 / R17 / R18**), **Phase 5 decisions**, Engineering governance, Data + DevOps + operability, MVP bars. |
| [`engineering-guardrails.md`](./engineering-guardrails.md) | **R16 guardrail table**, hotfix rule, branch-per-cycle, merge gate, S0 vs S1 split, end-of-sprint ceremony. |
| [`implementation-standard.md`](./implementation-standard.md) | UI-building rule (read `/anthropic-frontend-design` before styling), a11y baseline, vertical-slice shape, R18 inheritance pointers, S5–S6 design-system dogfood loop. |
| [`tech-stack.md`](./tech-stack.md) | Recommended stack (ratified by ADR-0001) + **UI primitives spec § 3** (tokens, typography, focus/keyboard/motion, TipTap toolbar minimum, shadcn primitives, forbidden "AI slop" patterns). |
| [`schema-initiative-v0.md`](./schema-initiative-v0.md) | Typed initiative contract — camelCase canonical. |
| [`lifecycle-transitions.md`](./lifecycle-transitions.md) | Forward / backward rules, parked intent + reason, skill triggers on column moves. |
| [`.claude/skills/anthropic-frontend-design/SKILL.md`](../../.claude/skills/anthropic-frontend-design/SKILL.md) | UI-build skill invoked before styling any user-visible surface. |

**Per-sprint adds on top of this:** the sprint's detailed seed ([`seeds/s#-<slug>.md`](./seeds/)), the backlog **§ Sprint #** block for scope, the **Slice log** in [`04-Projects/PDLC_Orchestration_UI.md`](../../04-Projects/PDLC_Orchestration_UI.md) for **previous-sprint actual outcomes**, and any sprint-specific skill or template.

---

## 2. Backlog sprint shape — what Plan mode should expect to see in `sprint-backlog.md § Sprint #`

| Block | Contents |
|-------|----------|
| **Goal** | Outcome + why it matters now |
| **Maps to** | Plan **R#** / north-star **Stage** |
| **Bar** | A, A/B, or B (sprint-specific — maps to MVP bars) |
| **Deliverables** | Product-facing "what" |
| **Technical — how** | Stack-agnostic steps (adjust per ADR-0001 from S0) |
| **Definition of Done (DoD)** | Observable proof — Plan must produce a task list closing each |
| **Explicitly out** | Prevents scope creep |
| **Dependencies / risks** |  |
| **Plan mode seed** | Inline pasteable prompt — ~10 lines, lists sprint-specific files to read on top of this prelude's cross-sprint refs |

---

## 3. Non-negotiable rules (R16 + R18 — enforce in Plan and Build)

### Governance (detail: [`engineering-guardrails.md`](./engineering-guardrails.md))

- **Canonical field case = camelCase** everywhere in JSON / TypeScript / schema (`schemaVersion`, `revision`, `handle`, `parkedIntent`, `parkedReason`, `specComplete`, `userReleaseNotes`, `claudeDesignHandoffPath`, `implementationPolishNote`, `hiFiRequired`, `loFiArtifactUrl`, `figmaLibraryUrl`). **No snake_case** in new code.
- **Branch-per-cycle:** all work on a named branch (`feat/s<N>-<slug>`). **Never commit directly to `main`.** Integrate only via PR.
- **Green CI required** to merge to `main` — lint + format + typecheck + JSON schema validation. Failing CI blocks merge.
- **Same-PR update discipline:** any change to `lifecycle` values, transition rules, or initiative shape updates [`schema-initiative-v0.md`](./schema-initiative-v0.md) and [`lifecycle-transitions.md`](./lifecycle-transitions.md) in the **same PR** (R16 guardrail 1).
- **No secrets in git** — `.env.example` with dummy values only; real secrets in ICT-approved store.
- **ADRs for irreversible choices** — stack, persistence, auth, hosting, framework swap.
- **PR description** cites **Sprint S&lt;N&gt;** and links this prelude + the sprint's backlog seed block (R16 §5 Plan mode traceability).

### Bar awareness

- Check **Bar alignment** for S&lt;N&gt; in [`sprint-backlog.md`](./sprint-backlog.md). **Bar A** ships the minimum; **Bar B extensions** land before internal-host rollout, not earlier.
- **S5 gate:** do not start Bar B sprints until Bar A exit criteria are met on a real initiative (see [`plan.md § Bar A success`](./plan.md)).
- **Accessibility:** keyboard nav + AA contrast is **Bar A baseline** (not "Bar B only"); **automated audit tooling** (`@axe-core/playwright`) is Bar B.

### UI / UX — R18 enforcement (full spec: [`tech-stack.md § 3`](./tech-stack.md#3-ui-primitives-r18); cross-sprint HOW: [`implementation-standard.md`](./implementation-standard.md))

Plan mode must confirm for every new user-visible surface:

1. **Read [`/anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md)** before styling.
2. **No raw markdown** surfaces on cards — rendered via TipTap read-only or sanitised HTML.
3. **TipTap rich-text editor** on editable prose fields with the [R18 minimum toolbar](./tech-stack.md#34-rich-text-editor-required-toolbar--tiptap). Titles stay plain text.
4. **Every colour from `pdlc-ui/src/styles/tokens.css`** — no hardcoded hex, no default Tailwind colour classes on user-visible code.
5. **Visible 2 px focus ring** on every interactive element; `outline: none` without a direct replacement = bug.
6. **Keyboard-completable** flow end-to-end; modals trap and restore focus; Esc closes by default.
7. **No forbidden "AI slop" patterns** — see [`tech-stack.md § 3.6`](./tech-stack.md#36-forbidden-ai-slop-patterns).

Drift without an ADR = R16 guardrail 4 violation.

### Previous-sprint reality diff (Plan-mode specific)

Every Plan-mode run (except S0) must:

1. Read the [**Slice log**](../../04-Projects/PDLC_Orchestration_UI.md) for the previous sprint.
2. Diff the previous sprint's **plan** vs **actual outcomes** (ADR decisions, schema shape, component APIs, gate wiring).
3. **Flag any S&lt;N&gt; DoD item invalidated** by the diff **before Build mode starts** — do not silently adapt.

---

## 4. Output expectation from Plan mode

Plan mode must produce:

1. **Task list keyed to each DoD checkbox** in the sprint section, with explicit file paths.
2. **Scope conflicts flagged** from the previous-sprint reality diff (§ 3).
3. **ADRs this sprint files or extends** (even one-liners).
4. **Docs to update in the same PR** — [`schema-initiative-v0.md`](./schema-initiative-v0.md), [`lifecycle-transitions.md`](./lifecycle-transitions.md), `OPERATIONS.md`, `BACKUP_RUNBOOK.md`, `README` kick-off decisions block, `design-system.md` (after S6), etc.
5. **Explicitly OUT reminder** copied from the sprint section so Build does not drift.
6. **UI primitives audit** — list every new user-visible surface and confirm (a) `/anthropic-frontend-design` was read, (b) content renders via the renderer, (c) tokens used for every colour, (d) visible focus ring, (e) keyboard-completable.
7. **M + Q critique pass** (mandatory before handoff to Build) — invoke [`/agent-m-cpo-custom`](../../.claude/skills/agent-m-cpo-custom/SKILL.md) **first** (CPO / outcome / first-demo risk) and [`/agent-q-cto-custom`](../../.claude/skills/agent-q-cto-custom/SKILL.md) **second** (CTO / feasibility / contracts / cheaper path). Fold every must-fix into the plan in a single edit under a heading **"Net M + Q recommendations applied"**. Do not move to Build with an unresolved M or Q **GAP**. Either agent's verdict can return the plan; neither has veto over the other (plan author resolves conflicts and notes trade-offs).

---

## 5. Ceremony at sprint end

1. Append **one line** to **Slice log** in [`04-Projects/PDLC_Orchestration_UI.md`](../../04-Projects/PDLC_Orchestration_UI.md) — including a **"Tech: next sprint must preserve …"** hand-off note.
2. Tick **Progress log** in [`plan.md`](./plan.md).
3. If anything in this prelude proved wrong or brittle, **edit it** in the same PR that closes the sprint — this file is the canonical rulebook; it evolves.

---

*Created 2026-04-21 — extracted from `sprint-backlog.md` so seeds reference a file, not a pasted block. Updated 2026-04-21 with Cross-sprint references block (R18 detail delegated to `tech-stack.md § 3`; HOW rules delegated to `implementation-standard.md`; governance delegated to `engineering-guardrails.md`).*
