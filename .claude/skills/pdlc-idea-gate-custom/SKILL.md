---
name: pdlc-idea-gate-custom
description: Lightweight go/no-go gate at the idea column. 5 questions, writes typed gate.* state, decides whether to take the card into discovery or park it.
---

# PDLC idea gate (custom)

**Custom skill — protected from Dex updates** (`-custom` suffix). Edit this file directly; `/dex-update` will not overwrite it.

**Why this exists (vs canonical `/feature-decision`):** The canonical [`/feature-decision`](../feature-decision/SKILL.md) is a heavy 8-step decision document designed to produce a saved `04-Projects/Decision_*.md`. That's right for substantial feature bets **after** discovery. At the `idea` column there is **no skill today** — cards drop in with only title + body, and `/pdlc-brief-custom` fires unconditionally on `idea → discovery`. That means discovery work gets done on ideas that should have been rejected upstream. This skill is the **5-question nudge** that prevents that.

**Position in the lane map:** **MVP-optional** gate at `idea → discovery`. Not a hard block (Bar A — plan MVP bars); the PM may skip. When skipped, `/pdlc-brief-custom` proceeds as today. When run, it writes `gate.*` on the card so `/pdlc-brief-custom` can **skip questions already answered** and so the UI can badge ideas that are `no_go` / `later`.

**Companions:** [schema-initiative-v0.md](../../../plans/PDLC_UI/schema-initiative-v0.md) (§4.1 `gate`) · [skill-agent-map.md](../../../plans/PDLC_UI/skill-agent-map.md) · [company_strategy.md](../../../plans/PDLC_UI/company_strategy.md).

---

## When this skill runs

- **UI-triggered:** user clicks "Gate idea" on a card in the `idea` column (or UI auto-offers after N days in `idea`).
- **Chat-triggered:** `/pdlc-idea-gate-custom [handle or title]`.
- **Pre-brief:** if the PM starts `/pdlc-brief-custom` on a card with empty `gate.*`, the brief may prompt "Run the idea gate first? (y/skip)" — skip is always allowed (MVP).

---

## I/O contract

**Reads** from the initiative card-state:

- `title`, `body`
- `strategyPillarIds[]` (if present)
- `sourceRefs[]` (any inbound signal/meeting attached at idea capture)
- Optional `06-Resources/Market_and_deal_signals.md` rows matching keywords

**Writes** to `gate.*` per [schema §4.1](../../../plans/PDLC_UI/schema-initiative-v0.md#41-gate--idea-gate-pdlc-idea-gate-custom-output):

```json
"gate": {
  "recommendation": { "value": "do_now | do_next | later | no_go | needs_discovery", "confidence": "med", "source": "agent_draft|user" },
  "strategicFit": { "value": "high | med | low", ... },
  "roughEffort": { "value": "s | m | l | xl", ... },
  "origin": { "value": "customer | internal | competitive | strategic", ... },
  "tradeOff": { "value": "text", ... },
  "primaryBeneficiary": { "value": "text", ... },
  "strategyWarning": "text | null"
}
```

Every field uses the **field envelope** (`{ value, confidence, source, reviewedBy, ... }`) from [schema §3](../../../plans/PDLC_UI/schema-initiative-v0.md#3-field-envelope-every-skill-written-field).

**Does NOT write** `brief.*`, `discovery.*`, `spec.*`, or any decision markdown in `04-Projects/`. This is a **lightweight gate**, not the canonical decision doc.

---

## Process — 5 questions, nothing more

Show the 5 questions in one batch (not one-at-a-time — the whole point is speed). Pre-fill any answer the card already provides.

### Q1 — Origin
*"Where did this idea come from?"*
Options: `customer` · `internal` · `competitive` · `strategic`.
Pre-fill from `sourceRefs[]` kind if unambiguous.
Writes: `gate.origin`.

### Q2 — Primary beneficiary
*"If we build this, who specifically benefits and how?"* (one line)
Writes: `gate.primaryBeneficiary`.

### Q3 — Strategic fit
*"How well does this align with our current strategy pillar(s)?"*
Options: `high` · `med` · `low`.
**If `company_strategy.md` exists and is populated (R12 post-MVP):** pre-fill a rating with `source: agent_draft` + `confidence: med` by keyword-matching `title + body` against the strategy doc's in/out examples. If the match is clearly "out", populate `gate.strategyWarning` with a one-line reason.
Writes: `gate.strategicFit`, `gate.strategyWarning`.

### Q4 — Rough effort
*"Best guess on engineering effort?"*
Options: `s` (<1 week) · `m` (1–4 weeks) · `l` (1–3 months) · `xl` (>3 months).
This is a **PM gut estimate**, not an engineering estimate. Skill must label it `confidence: low` unless the PM explicitly says "confirmed with eng".
Writes: `gate.roughEffort`.

### Q5 — Trade-off
*"If we take this into discovery, what are we **not** doing?"* (one line — the opportunity cost)
Writes: `gate.tradeOff`.

---

## Recommendation logic (deterministic)

After the five answers, the skill computes a **recommendation** (not a verdict — PM can override):

| `strategicFit` | `roughEffort` | Signal / customer evidence | Recommendation |
|---|---|---|---|
| `low` | any | any | `no_go` (or `later` if PM objects) |
| `high` | `s` \| `m` | `customer` or `competitive` origin | `do_now` |
| `high` | `l` \| `xl` | any | `do_next` (needs trade-off surfaced at steerco) |
| `med` | `s` \| `m` | any | `needs_discovery` (take to `/pdlc-brief-custom`, decide after) |
| `med` | `l` \| `xl` | any | `later` |
| any | any | `strategyWarning != null` | `no_go` + warning banner (PM override required) |

Present the recommendation with **one-line rationale** drawn from the answers. PM confirms, overrides, or parks.

---

## Outcomes (what happens after the gate)

| PM choice | Card action |
|-----------|-------------|
| **Accept `do_now` / `do_next` / `needs_discovery`** | Write `gate.*`, prompt "Move to discovery now?" — on yes, transition `idea → discovery` (which triggers `/pdlc-brief-custom`). |
| **Accept `later`** | Write `gate.*`, keep card in `idea`. UI badges it `later` and drops its sort priority. |
| **Accept `no_go`** | Offer: move to **`parked`** with `parkedIntent: wont_consider` and `parkedReason` prefilled from `tradeOff` + rationale. PM confirms the reason before the move. |
| **Override recommendation** | PM types their own recommendation; skill records it with `source: user`, keeps the computed one in `events[]` for audit. |

Every outcome appends an `events[]` entry: `{ kind: "skill_run", payload: { skill: "pdlc-idea-gate-custom", recommendation, override?: true } }`.

---

## Re-run semantics

Running the gate on a card that already has `gate.*`:

1. Show the current answers with `source` + `confidence` badges.
2. Offer: **Refresh** (re-ask with prior answers prefilled) or **Review only** (flip `reviewedAt` forward without changes).
3. If `strategyPillarIds[]` changed or `company_strategy.md` was updated since `gate.reviewedAt`, recommend re-running `strategicFit` specifically.

---

## Pause / resume (Phase-2 readiness)

Headless mode (future Agent Flywheel):

- Skill may pre-fill Q1 (`origin`) and Q3 (`strategicFit`) from context with `confidence: med|low`.
- Q2, Q4, Q5 **require human input** — skill emits one `discovery.openQuestions[]` entry per missing answer with `owner: "pm"` and returns. When answered, the runner re-invokes and the recommendation resolves.

This is intentional: the gate decides whether to spend PM time on discovery; having the agent **also** answer "what are we not doing?" defeats the purpose.

---

## Explicit non-goals

- **Not the canonical `/feature-decision`** — that skill writes a full 30-section decision document under `04-Projects/Decision_*.md`. Use it for significant bets after discovery, not at idea capture. This skill **writes to the card only**.
- **No customer-intel synthesis** — surface what's already in `sourceRefs[]`; don't run a portfolio scan here.
- **No prioritisation matrix across cards** — that's `/roadmap`.

---

## Integration with other skills

- **Before discovery:** precedes `/pdlc-brief-custom`; populates `gate.*` so brief can skip redundant questions.
- **After `no_go` → `parked`:** plan lifecycle-transitions enforces `parkedReason`; this skill prefills it.
- **Post-MVP R12:** when `company_strategy.md` is real, this skill is the enforcement point for strategy conformance warnings.
- **Not called from `/agent-prd`** — gate context is available via `gate.*` if needed, but the spec flow doesn't re-gate.

---

## UI rendering hints (for `pdlc-ui`)

- Idea card shows `gate.recommendation` as a coloured pill (`do_now` green · `do_next` teal · `needs_discovery` neutral · `later` amber · `no_go` red).
- `strategyWarning` renders as a card-level banner until dismissed or resolved.
- Each `gate.*` field with `source: agent_draft` + `reviewedBy: null` shows a small "confirm" affordance.

---

## Track usage (silent)

Update `System/usage_log.md` with `pdlc_idea_gate_custom_run`. Custom skills don't emit central analytics.

---

*Custom skill created 2026-04-21 — lite idea-column gate for PDLC Bar A. Protected from `/dex-update` by the `-custom` suffix.*
