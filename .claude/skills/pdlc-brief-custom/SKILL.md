---
name: pdlc-brief-custom
description: PDLC-scoped product brief. Runs on idea → discovery column move. Produces a typed brief card-state (not a full PRD). Context pre-fill hook + confidence-tagged output.
---

# PDLC brief (custom)

**Custom skill — protected from Dex updates** (`-custom` suffix). Edit this file directly; `/dex-update` will not overwrite it.

**Why this exists (vs canonical `/product-brief`):** The canonical [`/product-brief`](../product-brief/SKILL.md) generates a full PRD inside itself (Phases 5–7), duplicating what [`/agent-prd`](../agent-prd/SKILL.md) does. This custom variant is **shrunken for PDLC use**: it ends at the **brief + understanding summary** and writes a **typed card-state** that `/agent-prd` and the `pdlc-ui` consume deterministically.

**Companions:** [plans/PDLC_UI/schema-initiative-v0.md](../../../plans/PDLC_UI/schema-initiative-v0.md) · [plans/PDLC_UI/skill-agent-map.md](../../../plans/PDLC_UI/skill-agent-map.md) · [lifecycle-transitions.md](../../../plans/PDLC_UI/lifecycle-transitions.md).

---

## When this skill runs

- **UI-triggered:** a card moves from `idea` → `discovery` in `pdlc-ui`; this skill opens as the stepwise popup (plan R4).
- **Chat-triggered:** user types `/pdlc-brief-custom [initiative handle or title]` in Cursor / Claude Code.
- **Re-run:** user clicks "Re-run discovery" on a card after `brief.*` fields change (plan R5 / schema §7 staleness).

---

## I/O contract (schema-anchored)

**Reads** from the initiative card-state ([schema v0.1](../../../plans/PDLC_UI/schema-initiative-v0.md)):

- `title`, `body`
- `gate.*` (if `/pdlc-idea-gate-custom` ran first — don't re-ask what the gate already answered)
- `sourceRefs[]` (meetings, customer pages, signals — for Phase-3 pre-fill)
- existing `brief.*` (for re-run: preserve what's `source: user` or `reviewedBy != null`)

**Writes** to:

- `brief.problem`, `brief.targetUsers`, `brief.coreValue`, `brief.scopeIn`, `brief.scopeOut`, `brief.assumptions[]`, `brief.constraints`, `brief.successDefinition`, `brief.understandingSummary`
- `discovery.openQuestions[]` (as `agent_draft` entries — PM confirms in discovery column)

**Does NOT write:**

- `spec.*` — that's `/agent-prd`'s job.
- `design.*` — that's the design column.
- A full PRD markdown file — that's `/agent-prd` at `spec_ready`.

**Field envelope:** every field produced here follows the **`{ value, confidence, source, sourceRef?, reviewedBy?, updatedAt }`** envelope from [schema §3](../../../plans/PDLC_UI/schema-initiative-v0.md#3-field-envelope-every-skill-written-field). Agent-drafted fields emit `source: agent_draft` + `reviewedBy: null` so the UI can badge them for human confirmation.

---

## Process

### Phase 0 — Context pre-fill (NEW vs canonical skill)

**Goal:** Make the blank-page problem go away. Before asking the user anything, harvest what the vault already knows about this initiative.

1. **Parse handle / title** — pull the card from `pdlc-ui/data/` (or the chat arg). Read `title`, `body`, `gate.*`, `sourceRefs[]`.
2. **Call sub-skills (or their data) scoped to this initiative:**
   - `/customer-intel --initiative <handle>` *(future: per-initiative scope; today: portfolio-wide filtered to keywords from `title`+`body`)*
   - `/intelligence-scanning --initiative <handle>` *(future scope; today: scan `06-Resources/Market_intelligence/synthesis/daily/*` and `Market_and_deal_signals.md` for the card's keywords)*
   - `/meeting-prep`-style lookup: grep `00-Inbox/Meetings/` from last 60 days for keywords; stage refs under `sourceRefs[]`.
3. **Load [`/industry-truths`](../industry-truths/SKILL.md) horizons** if the file exists — these become hidden constraints on assumption quality.
4. **Draft initial answers** (Problem, Target users, Core value, a few Assumptions) with `source: agent_draft` + `confidence: low|med` and a `sourceRef` pointing at the evidence row.

**Output of Phase 0 to the user:**

```
Context pre-filled from:
- 3 meetings (Acme Q1 review, TechStart churn call, Sarah 1:1 — 14 Apr)
- 2 signals (EV-0087 competitor move, EV-0091 regulatory note)
- 0 customer evidence quotes matched

Pre-filled drafts (review/confirm below):
- Problem (low confidence) — drafted from Acme meeting
- Target users (med) — drafted from gate answer
- 2 assumptions (low) — flagged for validation

Skip pre-fill? Type "skip context".
```

If the user skips, proceed as the canonical skill does.

### Phase 1 — Capture / confirm initial framing

Show the user the drafts from Phase 0 alongside any user-written `gate.*` answers. The PM either **confirms** (promotes `source` to `user`, sets `reviewedBy`) or **overwrites**.

Do not re-ask questions `/pdlc-idea-gate-custom` already answered (origin, primary beneficiary, rough effort, trade-off).

### Phase 2 — Clarifying questions (2–3 at a time, not a survey)

Same rounds as the canonical skill — **but** only ask questions the card does not already answer (with `source: user` or `reviewedBy != null`).

| Round | Topic | Schema target |
|-------|-------|---------------|
| 1 | Problem, target, success | `brief.problem`, `brief.targetUsers`, `brief.coreValue`, `brief.successDefinition` |
| 2 | Constraints, scope | `brief.constraints`, `brief.scopeIn`, `brief.scopeOut` |
| 3 | Assumptions, open questions | `brief.assumptions[]`, `discovery.openQuestions[]` (draft) |

After each round, acknowledge briefly and update the card-state in memory; persist on Phase 3 confirmation.

### Phase 3 — Understanding summary + save

Present the summary from the schema template:

```markdown
## What I heard

**Problem:** {brief.problem.value}
**Target users:** {brief.targetUsers.value}
**Core value:** {brief.coreValue.value}
**Scope — in:** {brief.scopeIn.value}
**Scope — out:** {brief.scopeOut.value}
**Key assumptions to validate:** {brief.assumptions[].text}
**Success definition:** {brief.successDefinition.value}
**Open questions (drafted for discovery):** {count}

Fields the UI will badge for confirmation:
- {list of fields with source != user and reviewedBy == null}

Confirm (yes) → save to card. Correct anything above. Or "skip" to leave fields as drafts.
```

On **yes**:

1. Write every confirmed field as `source: user`, `reviewedBy: <user>`, `reviewedAt: now`.
2. Leave unconfirmed drafts as `source: agent_draft`, `reviewedBy: null` — the UI surfaces them in the discovery column for later confirmation.
3. Append an `events[]` entry: `{ kind: "skill_run", payload: { skill: "pdlc-brief-custom", iteration: N } }`.
4. Set `brief.reviewedAt`, `brief.reviewedBy`.
5. Return control to the UI / caller. **Do not generate a PRD.** **Do not create `06-Resources/PRDs/<Feature>.md`** — that is `/agent-prd`'s job at `spec_ready`.

### Phase 4 — Hand-off to discovery

Output a short human-readable summary plus the schema-shaped payload the UI persists. End with:

> **Next:** Discovery column — work the open questions, add customer evidence, export to Claude Design when ready. `/agent-prd` will pick up brief + discovery when the card enters `spec_ready`.

---

## Re-run semantics

If called on a card with existing `brief.*`:

1. Show a **diff view** of current fields with `source` + `confidence`.
2. Ask the user which sections to re-open. Default: any field with `source: agent_draft` + `reviewedBy: null`, plus any field where `updatedAt` predates the latest `sourceRefs[]` entry (staleness rule).
3. Preserve everything else verbatim.
4. Increment `discovery.iteration`, set `discovery.lastRerunAt`.

---

## Pause / resume (Phase-2 readiness)

If this skill runs **headless** (future Agent Flywheel — plan R15 Phase 2) and hits a blocker:

- **Do not guess.** Emit an `openQuestion[]` entry with `owner: "pm"`, `status: "open"`, `source: "agent_draft"` describing exactly what you need.
- Set `brief.reviewedBy = null` and return.
- When the PM answers the `openQuestion` in the UI, the runner re-invokes this skill; Phase 0 sees the resolved answer and continues.

---

## Explicit non-goals (keep the skill small)

- **No PRD generation** — that duplicates `/agent-prd`.
- **No design flows** — that's the design column.
- **No prioritization matrix** — that's `/pdlc-idea-gate-custom` (lite) or `/feature-decision` (full).
- **No stakeholder comms draft** — separate skill.

---

## Conversational style

Same thought-partner tone as the canonical skill. Ask follow-ups when answers reveal gaps; never turn this into a survey. Good: *"Interesting — if that's enterprise, how do we handle SSO? Or punt to Phase 2?"* Bad: *"Question 7: please describe your authentication strategy."*

---

## Integration

- **Pillars / strategy:** if `strategyPillarIds[]` is empty, gently prompt once ("Which strategy pillar does this live under?") but don't block. Post-MVP R12 will enforce.
- **Person pages:** if stakeholders are mentioned, stage them as `sourceRefs[{kind: "customer", ...}]` — do not auto-update person pages from this skill (plan principle: one skill, one artefact).
- **Tasks:** do not push to `03-Tasks/Tasks.md` from here; task extraction lives in `/process-meetings`.

---

## Track usage (silent)

Update `System/usage_log.md` with `pdlc_brief_custom_run` (or similar — free-form line; custom skills don't need to register centrally). Analytics: no event emission from custom skills.

---

*Custom skill created 2026-04-21 — shrunken variant of `/product-brief` for PDLC Bar A. Protected from `/dex-update` by the `-custom` suffix.*
