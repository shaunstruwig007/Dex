# Wyzetalk ICP (Ideal Customer Profile) — placeholder

**Status:** 🚧 **PLACEHOLDER — to be authored by Shaun 2026-04-22+**
**Purpose:** Ground the PDLC `discovery` research skill ([`/moneypenny-custom`](../.claude/skills/moneypenny-custom/SKILL.md), S3B — *formerly `/pdlc-discovery-research-custom`*) in a concrete "who are we building for?" so every discovery pass can score **strategic fit** and filter **competitor analysis** against a shared WT thesis.
**Consumed by:** [`/moneypenny-custom`](../.claude/skills/moneypenny-custom/SKILL.md) *(S3B — formerly `/pdlc-discovery-research-custom`; renamed 2026-04-24 during 007 persona re-map)*; [`/pdlc-idea-gate-custom`](../.claude/skills/pdlc-idea-gate-custom/SKILL.md) (strategic-fit scoring); [`/weekly-market-discovery`](../.claude/skills/weekly-market-discovery/SKILL.md); [`/weekly-discovery-sweep-custom`](../.claude/skills/weekly-discovery-sweep-custom/SKILL.md) (Monday column-wide pass that invokes `/moneypenny-custom` headless per card).
**Pairs with:** `06-Resources/Company/company_strategy.md` (WT thesis + in/out lenses), `System/pillars.yaml` (Dex-wide strategic pillars).
**Schema cross-reference:** [`plans/PDLC_UI/schema-initiative-v0.md §8`](../plans/PDLC_UI/schema-initiative-v0.md#8-skill-io-contracts-summary) — `/moneypenny-custom` I/O row *(row retired `/pdlc-discovery-research-custom` in the 2026-04-24 persona re-map — both slugs describe the same behaviour; Moneypenny is the post-rename name)*.

---

## Why this file exists

The 2026-04-21 CPO brief shrink removed scope / assumptions / success metrics from `/pdlc-brief-custom` and moved them to discovery. Discovery research needs a **static answer to "who is WT's Ideal Customer?"** to do its job — otherwise every research pass has to re-derive the audience from the card body, and the weekly sweep has no "is this card still a fit?" check to run.

This file is **the** WT ICP reference. Do not duplicate it. When it changes, bump a version line and the next weekly sweep will re-score all `discovery`-column cards.

---

## Minimum shape (to be filled by Shaun 2026-04-22)

Shaun, the proposal below is a **scaffold to discuss** — replace with your real segments and trim aggressively. Three named segments is the target; fewer is better.

### Version

`v0 — placeholder, 2026-04-21` *(bump to `v1` on first real authoring)*

### WT thesis (one paragraph)

*(Placeholder — one paragraph: who WT serves, the specific problem WT is best at, and the outcome customers buy from us.)*

### ICP segments

For each segment, capture:

| Field | Why |
|-------|-----|
| **Segment name** | Short label the skill can key off (e.g. "Frontline ops — mining / manufacturing — ≥5k headcount"). |
| **Who they are** | Industry, size, geography, organisational shape. |
| **What problem they buy WT for** | The specific, recurring job-to-be-done WT solves for them. |
| **How they buy** | Champion role; procurement path; typical cycle; budget owner. |
| **What disqualifies them** | Explicit anti-patterns — teams / orgs / use-cases WT is *not* for. |
| **Signals of fit** | Observable cues (job posts, press, tooling mentions, RFPs) that a prospect is in-segment. |
| **Signals of anti-fit** | Observable cues that a prospect is out-of-segment (even if they look tempting). |

### Segment 1 — *(placeholder)*

- **Who they are:** …
- **What problem they buy WT for:** …
- **How they buy:** …
- **What disqualifies them:** …
- **Signals of fit:** …
- **Signals of anti-fit:** …

### Segment 2 — *(placeholder)*

*(as above)*

### Segment 3 — *(optional — only if genuinely distinct from segments 1 and 2)*

*(as above)*

### Cross-segment disqualifiers

*(Use-cases / org shapes / regulatory contexts WT is **not** for, regardless of segment.)*

- …

### Known near-neighbours (competitor positioning)

*(Short list — 5 at most — of the vendors WT is mistaken for or compared against. One line each on "how WT differs in a sentence." The discovery research skill reads this to filter noisy competitor signal.)*

- **[Competitor A]:** WT differs because …
- **[Competitor B]:** WT differs because …
- …

---

## How the discovery research skill uses this

1. **Strategic-fit score on kickoff** — reads segments + cross-segment disqualifiers; compares against the card's `gate.primaryBeneficiary` / `brief.targetUsers` / `brief.problem`; emits `gate.strategicFit = high | med | low` (or updates an existing value if stale).
2. **Competitor filter** — the card's competitor-snapshot output filters for near-neighbours named here; other vendors show in raw signal notes but not in the curated snapshot.
3. **Weekly sweep "still a fit?" check** — if new market signal lands that moves a card's segment mapping (e.g. the named customer has pivoted), the sweep appends a draft `openQuestion` asking the PM to revisit.
4. **Anti-fit guard** — cards whose `gate.primaryBeneficiary` matches a cross-segment disqualifier get a visible amber chip in the side-panel Discovery tab; PM can override but has to read it first.

---

## Update discipline

- **One editor:** Shaun (until WT strategic leadership expands this scope).
- **Bump the version line** on every edit; the weekly sweep reads the version and re-scores only when it has changed.
- **No PII / no customer-specific strategy** in this file — it is vault-general context. Per-customer strategy lives on the relevant `People/External/*` or `06-Resources/Accounts/*` page.
- **Same-PR discipline:** any change that affects how the skill scores or filters is co-committed with the discovery research skill's test fixtures (schema-initiative-v0 R16 guardrail analog).

---

*Placeholder created 2026-04-21 — blocking the S3B `/moneypenny-custom` *(formerly `/pdlc-discovery-research-custom`)* weekly sweep until Shaun authors v1. Skill renamed 2026-04-24 during 007 persona re-map; behaviour unchanged.*
