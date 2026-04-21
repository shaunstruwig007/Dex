# PDLC UI — Phase 3+ research (future, not MVP)

**Status:** Research / capture only — **not in Bar A or Bar B scope**.  
**Purpose:** Capture the long-arc thesis for the **PDLC Orchestration UI** so the MVP schema stays compatible and future work has a real starting point. Nothing in this doc is committed scope.

**Read first:** [plan.md § MVP bars](./plan.md#mvp-bars--bar-a-solo--bar-b-steerco--phase-2-automation--phase-3-intel) and [skill-agent-map.md](./skill-agent-map.md) for the core thesis that the UI **steers what Dex already does**.

---

## Anchor — why Phase 3+ exists at all

The whole bet of the orchestration UI is that **discovery gets richer every cycle** because Dex keeps capturing context — meetings, transcripts, market signals, competitor moves, internal decisions. The UI's job is to **serve that context back on the relevant card** when a PM (or, later, an agent) needs it for a brief, open question, or spec clarification.

**Bar A and Bar B do not build any of this.** They make sure the **schema**, **events**, and **attachment slots** are shaped so Phase 3+ can plug in without a painful migration.

**Dex-native habits must stay as they are:** meeting prep, meeting processing, transcript ingestion, and signal scanning continue to run in Dex. The UI eventually becomes the **surface** that serves those results back on a card — it is **not** a replacement for the habits that produce them.

---

## Research thread 1 — Marketing intelligence from the frontend

**Question:** How does a PM pull **market signals** into a card without leaving the board?

**Existing Dex anchors:**

- Skill: [`/weekly-exec-intel`](../../.claude/skills/weekly-exec-intel/SKILL.md)
- Skill: [`/weekly-market-discovery`](../../.claude/skills/weekly-market-discovery/SKILL.md)
- Skill: [`/daily-intelligence-brief`](../../.claude/skills/daily-intelligence-brief/SKILL.md)
- Vault: `Market_intelligence/` ingest; weekly briefs.

**What the UI eventually does:**

- Show **relevant** market signals on a discovery card (filtered by `handle`, `tags`, title terms).
- Let a PM **cite** a signal in a brief answer with a stable reference.
- Refresh cadence: weekly from existing ingest — not real-time.

**Unknowns to close before building:**

- Relevance ranking — tag match, embedding similarity, or manual curation?
- How does a signal become an **open question** on a card when it matters enough?
- Who prunes stale signals so cards don't become graveyards?

---

## Research thread 2 — Competitor analysis from the frontend

**Question:** How do we **surface competitor moves** and score their relevance on an initiative card?

**Existing Dex anchors:**

- Skill: [`/intelligence-scanning`](../../.claude/skills/intelligence-scanning/SKILL.md)
- Skill: [`/daily-intelligence-brief`](../../.claude/skills/daily-intelligence-brief/SKILL.md)

**What the UI eventually does:**

- Per-initiative **competitor snapshot** tab (small set of direct competitors + what changed).
- Trigger: initiative enters `discovery` **or** a tagged competitor moves.
- Output: short summary + source links, attached to card for PM review.

**Unknowns:**

- Competitor list governance — who edits, how often.
- Source allowlist + scrape cadence (cost, legality).
- "Interesting" vs "requires action" — threshold?

---

## Research thread 3 — Signal curation

**Question:** Which signals actually matter enough to **nudge** a card, and at what threshold?

**Existing Dex anchors:**

- Vault: `Market_and_deal_signals/`, signal log.
- Skill: [`/weekly-market-discovery`](../../.claude/skills/weekly-market-discovery/SKILL.md).

**Signal categories to score:**

- **Product** — feature launches, deprecations, pricing tiers.
- **Pricing** — competitor pricing moves, packaging changes.
- **Hiring** — roles posted at adjacent competitors (directional).
- **Deal movement** — partner announcements, M&A.
- **Industry** — regulatory, macro, platform-level shifts.

**What the UI eventually does:**

- Per-card **signal list** with category + score.
- Card **nudge** (warning banner) when a signal above threshold is linked.
- Threshold policy lives with the signal curator (not PM).

**Unknowns:**

- Who owns curation vs consumption.
- One ML model for scoring, or rules + manual tagging first? (Almost certainly start with rules.)
- How to retire a signal once a decision is made (archive vs prune vs cite forever).

---

## Research thread 4 — Meeting correlation and question-answering

**Question:** How do meeting notes and transcripts **answer questions** attached to a specific initiative?

**Existing Dex anchors:**

- Skill: [`/meeting-prep`](../../.claude/skills/meeting-prep/SKILL.md)
- Skill: [`/process-meetings`](../../.claude/skills/process-meetings/SKILL.md)
- Skill: [`/commitment-scan`](../../.claude/skills/commitment-scan/SKILL.md) (asks + promises)
- Granola / Zoom transcript ingestion pipelines.

**Core preserved habit:**
Dex users continue to run `meeting-prep` before meetings and `process-meetings` after. **The UI does not replace these** — it **serves them back** on the relevant card as context for brief answers, open-question resolution, and spec clarifications.

**What the UI eventually does:**

- Attach transcripts / prep notes to an initiative by `handle`, tag, or attendee-name match.
- **Question-answering on the card:** *"why did we decide X?"* resolved against **meeting history + brief evolution + events log**.
- **Commitment surfacing:** when `commitment-scan` detects an ask about an initiative, surface it as an open question **candidate** on the card (PM confirms).

**Unknowns:**

- How to scope search per initiative (time window, explicit tags, attendee overlap, embedding search).
- Where citations live in card UI (footnotes, side panel, inline).
- Privacy / redaction policy for transcripts — some meetings include clients, staff names (PII already flagged in [plan.md § Sprint 0 kick-off](./plan.md#sprint-0-kick-off-decisions-park-until-s0-planning--do-before-coding)).

---

## Schema implications for MVP (keep compatible, do not build)

To keep Phase 3+ **plug-compatible** without a migration later, Bar A / Bar B keep these shape decisions:

| Field / shape | Reason |
|----------------|--------|
| `attachments[]` on initiative | Transcripts, signal snapshots, competitor docs all attach cleanly. |
| `sourceRefs[]` on brief / discovery answers | Lets future citations hook onto specific answers without schema change. |
| `events[]` on initiative (seeded S1) | Timeline already exists; signal nudges and meeting links become new event types later. |
| `tags[]` on initiative (stringly-typed, low ceremony) | Competitor / market-segment / strategy tagging without taxonomy commitment now. |
| `handle` (human ID `INIT-0042`) | Stable reference for transcripts, commitments, signals to point at. |

**Non-goal:** do **not** pre-design relevance scoring, transcript search, or signal taxonomy in Bar A/B. Those are Phase 3+ once the board has real content to learn from.

---

## Promotion criteria — when does a thread leave this doc?

A Phase 3+ thread gets promoted to an **active plan / sprint** only when **all three** are true:

1. **Bar B is in real use** for at least one quarter — not "launched", **used** by Steerco on real decisions.
2. **A concrete pain** for that thread is logged in `System/Session_Learnings/` at least twice.
3. **Owner named** (who will run it) and **unknowns above are answered** in a short spike doc.

Until then — **capture only**.

---

## Open questions

- Should Phase 3+ run **inside** `pdlc-ui` (hosted with the board) or as **Agent Flywheel workers** (Phase 2 infra) that write back to the board store? Likely **Phase 2 infra + UI surface** in `pdlc-ui`.
- How does the UI show provenance without turning every card into a research report? (Default: collapsed, expand on click.)
- Meeting-correlation privacy: is there content that must **never** surface on a card (e.g. board-level strategy transcripts)? Needs a tagging rule.
- Do we build a separate "intel tab" per card, or weave intel into the existing brief / discovery / spec tabs? (Arguments both ways; decide when threads 1 and 4 are promoted.)

---

*Created 2026-04-21 — extracted from [plan.md § MVP bars](./plan.md#mvp-bars--bar-a-solo--bar-b-steerco--phase-2-automation--phase-3-intel) during Bar A / Bar B split.*
