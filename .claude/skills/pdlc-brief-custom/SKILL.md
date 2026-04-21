---
name: pdlc-brief-custom
description: PDLC-scoped product brief. Runs on idea → discovery column move. Three questions only — why, who, what. Produces a typed brief card-state (not a full PRD). Context pre-fill hook + confidence-tagged output.
---

# PDLC brief (custom)

**Custom skill — protected from Dex updates** (`-custom` suffix). Edit this file directly; `/dex-update` will not overwrite it.

**Why this exists (vs canonical `/product-brief`):** The canonical [`/product-brief`](../product-brief/SKILL.md) generates a full PRD inside itself (Phases 5–7), duplicating what [`/agent-prd`](../agent-prd/SKILL.md) does. This custom variant is **deliberately tiny**: three questions (**why / who / what**) that gate `idea → discovery`. Anything that needs market research, scoping, assumption validation, or success-metric definition is out of scope here and belongs to **`/pdlc-discovery-research-custom`** (S3B) once the card is in `discovery`.

**Design rationale (2026-04-21, S3A.1):** The brief is a **thesis gate**, not a PRD. Its only job is to force three honest answers before a card burns discovery time: *Why are we doing this? Who are we doing this for? What problem does it solve?* Fields like scope, constraints, assumptions, and hard success metrics were moved to discovery — they require evidence the PM does not yet have at `idea → discovery`, and asking for them here produced low-confidence agent-drafts that the PM had to unpick. See [plans/PDLC_UI/schema-initiative-v0.md §4.2](../../../plans/PDLC_UI/schema-initiative-v0.md#42-brief--discovery-brief-pdlc-brief-custom-output) and the 2026-04-21 S3A.1 Progress log entry.

**Companions:** [plans/PDLC_UI/schema-initiative-v0.md](../../../plans/PDLC_UI/schema-initiative-v0.md) · [plans/PDLC_UI/skill-agent-map.md](../../../plans/PDLC_UI/skill-agent-map.md) · [lifecycle-transitions.md](../../../plans/PDLC_UI/lifecycle-transitions.md) · [plans/PDLC_UI/seeds/s3b-discovery-research.md](../../../plans/PDLC_UI/seeds/s3b-discovery-research.md) (sibling research skill — fills discovery).

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

**Writes** to (**only** these — the brief is deliberately tiny):

- `brief.problem` — what problem are we solving?
- `brief.targetUsers` — who are we solving it for?
- `brief.coreValue` — why are we doing this / what value does solving it create?
- `brief.understandingSummary` — one-paragraph synthesis the summary step shows back to the PM.
- `brief.complete = true` + `brief.reviewedBy` + `brief.reviewedAt` on confirm.

**Does NOT write (moved to discovery or later sprints):**

- `brief.scopeIn`, `brief.scopeOut`, `brief.constraints` — these need discovery evidence; if a PM volunteers them early the wizard lets them type free-text into the understanding summary, but they are not asked as structured questions.
- `brief.assumptions[]` — populated by **`/pdlc-discovery-research-custom`** (S3B) once the card is in discovery.
- `brief.successDefinition` — success framing (hypothesis + metric) is owned by discovery + `/agent-prd` at spec-time; asking for hard metrics at brief-time produced low-confidence drafts.
- `discovery.openQuestions[]`, `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.customerEvidence` — all owned by **`/pdlc-discovery-research-custom`** (S3B).
- `spec.*` — that's `/agent-prd`'s job.
- `design.*` — that's the design column.
- A full PRD markdown file — that's `/agent-prd` at `spec_ready`.

**Legacy fields in `briefSchema`:** `scopeIn`, `scopeOut`, `assumptions`, `constraints`, `successDefinition` remain in the schema as **optional** (backward-compat with existing cards). New cards starting at `idea → discovery` after 2026-04-21 leave them empty; S3B writes equivalents to `discovery.*` fields. Do not re-surface them in the wizard.

**Field envelope:** every field produced here follows the **`{ value, confidence, source, sourceRef?, reviewedBy?, updatedAt }`** envelope from [schema §3](../../../plans/PDLC_UI/schema-initiative-v0.md#3-field-envelope-every-skill-written-field). Agent-drafted fields emit `source: agent_draft` + `reviewedBy: null` so the UI can badge them for human confirmation.

---

## Process

### Phase 0 — Context pre-fill (scoped to the three brief fields)

**Goal:** Make the blank-page problem go away on the three wizard fields. Before asking the user anything, harvest what the vault already knows — but only draft the fields the wizard will actually show.

1. **Parse handle / title** — pull the card from `pdlc-ui/data/` (or the chat arg). Read `title`, `body`, `gate.*`, `sourceRefs[]`.
2. **Call sub-skills (or their data) scoped to this initiative:**
   - `/customer-intel --initiative <handle>` *(future: per-initiative scope; today: portfolio-wide filtered to keywords from `title`+`body`)*
   - `/intelligence-scanning --initiative <handle>` *(future scope; today: scan `06-Resources/Market_intelligence/synthesis/daily/*` and `Market_and_deal_signals.md` for the card's keywords)*
   - `/meeting-prep`-style lookup: grep `00-Inbox/Meetings/` from last 60 days for keywords; stage refs under `sourceRefs[]`.
3. **Draft only the three wizard fields** — `brief.problem`, `brief.targetUsers`, `brief.coreValue` — with `source: agent_draft` + `confidence: low|med` and a `sourceRef` pointing at the evidence row. **Do not** draft assumptions, scope, constraints, or success metrics — those are owned by `/pdlc-discovery-research-custom`.
4. **UI-triggered path:** the S3A.2 prefill endpoint (`POST /api/initiatives/:id/brief/prefill`) owns the three-field draft write at wizard-open. This SKILL.md documents the intent; the server-side prefill helper is a swappable interface.

**Output of Phase 0 to the user (chat-triggered path only):**

```
Context pre-filled from:
- 3 meetings (Acme Q1 review, TechStart churn call, Sarah 1:1 — 14 Apr)
- 2 signals (EV-0087 competitor move, EV-0091 regulatory note)

Pre-filled drafts on the three brief questions (review/confirm below):
- Problem (low confidence) — drafted from Acme meeting
- Target users (med) — drafted from gate answer
- Core value (low) — drafted from gate answer + title

Skip pre-fill? Type "skip context".
```

If the user skips, show the three empty questions.

### Phase 1 — Capture / confirm initial framing

Show the user the drafts from Phase 0 alongside any user-written `gate.*` answers. The PM either **confirms** (promotes `source` to `user`, sets `reviewedBy`) or **overwrites**.

Do not re-ask questions `/pdlc-idea-gate-custom` already answered (origin, primary beneficiary, rough effort, trade-off, strategic fit).

### Phase 2 — The three questions (one round, not a survey)

One round of clarifying questions. Ask only the questions the card does not already answer (with `source: user` or `reviewedBy != null`).

| Round | Topic | Schema target | Required |
|-------|-------|---------------|----------|
| 1 | Why / who / what | `brief.coreValue` (why are we doing this?), `brief.targetUsers` (who are we solving for?), `brief.problem` (what problem does it solve?) | ✓ all three |

If the PM volunteers scope, assumptions, constraints, or success metrics in their free-text answers, **absorb that text into `brief.understandingSummary`** — do not prompt for structured scope/assumptions/success-metric fields at brief time. Discovery (S3B) will surface what discovery research discovers; spec-time (`/agent-prd`) will nail success metrics.

After the round, acknowledge briefly, synthesise `brief.understandingSummary`, and go to Phase 3.

### Phase 3 — Understanding summary + save

Present the summary from the schema template:

```markdown
## What I heard

**Why (core value):** {brief.coreValue.value}
**Who (target users):** {brief.targetUsers.value}
**What problem:** {brief.problem.value}

**Synthesis:** {brief.understandingSummary.value}

Fields the UI will badge for confirmation:
- {list of fields with source != user and reviewedBy == null}

Confirm (yes) → save to card and move to discovery. Correct anything above. Or "skip" to leave fields as drafts (brief.complete stays false; lane does not move).
```

On **yes**:

1. Write every confirmed field as `source: user`, `reviewedBy: <user>`, `reviewedAt: now`.
2. Leave unconfirmed drafts as `source: agent_draft`, `reviewedBy: null` — the UI badges them.
3. Append an `events[]` entry: `{ kind: "skill_run", payload: { skill: "pdlc-brief-custom", iteration: N } }` (iteration computed server-side per `schema-initiative-v0 §6`).
4. Set `brief.complete = true`, `brief.reviewedAt`, `brief.reviewedBy`.
5. Return control to the UI / caller. **Do not generate a PRD.** **Do not create `06-Resources/PRDs/<Feature>.md`** — that is `/agent-prd`'s job at `spec_ready`.
6. **Do not populate `discovery.*` fields** — `/pdlc-discovery-research-custom` (S3B) owns the discovery column.

### Phase 4 — Hand-off to discovery

Output a short human-readable summary plus the schema-shaped payload the UI persists. End with:

> **Next:** Discovery — **`/pdlc-discovery-research-custom`** (S3B) kicks off automatically on lane move, reads this brief + market intelligence + customer evidence, and populates `discovery.*`. The card shows research progress live. `/agent-prd` picks up brief + discovery when the card enters `spec_ready`.

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

*Custom skill created 2026-04-21 — originally a shrunken variant of `/product-brief` for PDLC Bar A. Reshaped on 2026-04-21 (S3A.1 CPO pass) to **three questions only** (why / who / what); scope / assumptions / success-metrics moved to discovery (`/pdlc-discovery-research-custom`, S3B) and spec (`/agent-prd`). Protected from `/dex-update` by the `-custom` suffix.*
