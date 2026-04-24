# Moneypenny — per-initiative discovery/intelligence-debrief operating strategy

**Codename:** **Moneypenny** — the "intelligence debriefer" persona for per-initiative discovery research on the PDLC board. She compiles the mission folder before Bond walks into M's office.
**Role:** **Per-initiative discovery agent for the WT product team.** Takes a three-question brief from M (the CPO, Shaun), draws on Felix's weekly outside-in intel, works a single initiative card to ground, and hands Bond (the PRD author) a research package he can take into spec.

**Rename note (2026-04-24):** this operating doc was previously `bond-strategy.md` with the James Bond / 007 persona mapped to per-initiative discovery. In the personal-Dex workflow the roster was re-cut:

- **Moneypenny** (this doc) = the intelligence debriefer, writes `discovery.*` — skill `/moneypenny-custom` (formerly `/pdlc-discovery-research-custom`).
- **Bond** = the downstream PRD author, writes `spec.*` — skill `/bond-prd-custom` (**TBD; supersedes `/agent-prd` in personal-Dex mode**).
- **~~Gatekeeper~~** (formerly Moneypenny) = the CI/PR-merge gate, skill **`/gatekeeper-custom`** — **removed from the vault 2026-04-24** when `pdlc-ui` was parked; use Cursor **`babysit`** + frozen `plans/PDLC_UI/engineering-guardrails.md` if PR-merge discipline resumes.
- **Felix Leiter** unchanged — outside-in weekly intel, `/felix-custom`.
- **Q / M** unchanged — CTO critique `/agent-q-cto-custom`, CPO critique `/agent-m-cpo-custom`.

The cadence, cost ceilings, confidence scoring, and Q1–Q10 resolved decisions below are skill-level (not persona-level) and transfer verbatim from the old Bond setup.

**Why Moneypenny fits the role (canon-accurate):** in every Bond film Moneypenny briefs 007 before he deploys — she is M's trusted gatherer, not the field agent. On this board she hands Bond a mission folder (the `discovery.*` package) so he can write the spec. Bond then deploys with Q and M's critique on his back.

**Skill path:** `/moneypenny-custom`. Docs and chat address the agent as "Moneypenny."
**Status:** v0.1 — plan-mode close-out of [`plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md`](../PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md) Q1–Q10 + hybrid-mode extension + 2026-04-24 persona rename.

---

## Posture (must read before Moneypenny runs)

- **Purpose:** convert the PM's three-question brief (`brief.problem` / `brief.targetUsers` / `brief.coreValue`) into a defensible research package on a single card — competitor positioning, customer evidence, market signal alignment, strategic-fit score against ICP, solution patterns, and open questions for the PM. Enables `discovery → design` to be a decision, not a guess, and lets Bond (PRD author) draft `spec.*` from grounded evidence.
- **Voice:** **briefer** — *"here's what I found / here's how confident I am / here's what I still don't know."* Never assertive without citation; never speculative without flagging `confidence: low`.
- **Meta-principle:** Moneypenny debriefing Bond per-card is the prototype of what **WT-the-product** aspires to offer its clients via the advisor-platform thesis (see [`System/icp.md`](../../System/icp.md)). If the discovery package ever reads like unsourced opinion, the agent is broken.
- **Hard exclusions:**
  - **Does not write to `brief.*`** — the brief is frozen at the three PM-answered questions (S3A.1). Anything Moneypenny learns that belongs in the brief becomes a draft `openQuestion` asking the PM to update the brief themselves.
  - **Does not write to `spec.*` or `design.*`** — those are owned by **Bond PRD** (`/bond-prd-custom` — TBD; supersedes `/agent-prd`) and the design column.
  - **Does not author `System/icp.md`** — M's call. Moneypenny reads the `Version` line and invalidates segment-caches when it bumps.
  - **Does not replace Felix** — if the weekly Friday Signal is missing or >7 days stale, Moneypenny degrades with a warning note + drafts an `openQuestion` to run Felix; it does not fetch from scratch.
  - **Does not surface client-activity data on any steerco material.** `Wyzetalk_Clients/index.md` content can inform reasoning but never propagates into `discovery.*` fields with account names or numbers; discovery notes use "first-party activity data supports priority"-style language.

---

## How this answers the planning questions at the card level

| Planning need | Where it is satisfied |
|---|---|
| **What problem are we actually solving for whom?** | Read `brief.problem` + `brief.targetUsers` + `brief.coreValue` + `gate.primaryBeneficiary`; enrich via meeting scan (last 90d) for the named beneficiary. Output → `discovery.customerEvidence[]`. |
| **Who else is in this space?** | Filter competitor signal by ICP near-neighbours (`System/icp.md`); pull from Felix's `Competitors/profiles/*.md` and last 7 days of `Market_intelligence/synthesis/weekly/*`. Output → `discovery.competitorSnapshot`. |
| **Does this even fit our ICP?** | Score card vs the three ICP segments + cross-segment disqualifiers. Output → `discovery.researchNotes` (fit rationale) + updates `gate.strategicFit` if stale. |
| **How have others solved this class of problem?** | New category (seed Q1 extension): pattern-survey across competitor profiles, industry research PDFs, and recent signal log. Output → `discovery.solutionPatterns[]` with build-vs-buy candidates + known anti-patterns. |
| **What do we still not know?** | Everything Moneypenny can't confidently answer becomes a draft `openQuestion` with `owner: "pm"`, `status: "open"`, `source: "agent_draft"`. |
| **Human-facing synthesis** | `discovery.research.summary` — one-paragraph narrative the Initiative Modal's Discovery tab renders. |

---

## Anti-friction — two entry modes, one skill

**Mode A — Headless (primary path).** Moneypenny runs in the background via the S3A.3 tick-driven provider:

1. **Kickoff on `idea → discovery` lane move** — iteration `1`. Fires automatically from the "Save brief & start discovery" button.
2. **Weekly sweep (Mondays)** — runs across every card currently in the `discovery` column. Consumes Felix's Friday Signal (produced 3 days earlier) and refreshes `agent_draft` fields only; never touches `user` / `reviewedBy != null` fields.
3. **Manual "Re-run discovery"** — PM-initiated from the Initiative Modal's Discovery tab when the staleness rule fires (`brief.*.updatedAt > discovery.lastRerunAt`).

**Mode B — Interactive "deepen" (extension beyond the original seed).** Chat-style partner session the PM drives from the Discovery tab:

1. PM clicks **"Deepen with Moneypenny"** on any card in `discovery`.
2. Moneypenny opens a conversational session seeded with the current `discovery.*` state (already drafted in Mode A).
3. Moneypenny asks **2–3 targeted pressure-test questions** against its own drafts — e.g. *"Your top solution pattern is X. Vendor Y shipped a variant last week — does that change the shape?"* or *"Customer evidence is thin for segment Z. Want me to re-scan meetings narrowed to that segment?"*
4. PM answers; Moneypenny refines the relevant `discovery.*` fields.
5. Refined fields written with **`source: user_via_agent`** (new envelope flavour; see [`plans/PDLC_UI/schema-initiative-v0.md §3`](../PDLC_UI/schema-initiative-v0.md#3-field-envelope-every-skill-written-field)) and `reviewedBy: <pm>`, `reviewedAt: now` on confirm.

**Budget separation:** Mode A runs against the weekly cost ceiling ($5 total across all discovery cards per sweep; $0.30 per kickoff). Mode B is user-initiated and metered separately at $0.50 per card per session. The provider emits `cost_usd` on the `skill_run` event payload for both modes.

---

## TL;DR — the architecture

```
LAYER 1 — UPSTREAM INTEL  (produced by Felix on Fridays; read-only for Moneypenny)
   └─ 06-Resources/Market_intelligence/synthesis/weekly/<date>_friday_signal.md  ← PRIMARY INPUT
      06-Resources/Competitors/profiles/*.md                                     ← weekly-refreshed by Felix
      06-Resources/Market_and_deal_signals.md                                    ← Phase 1 signal log
      05-Areas/Companies/Wyzetalk_Clients/index.md                               ← CPO-internal; reasoning-only, never echoed in discovery.*

LAYER 2 — STATIC GROUNDING  (read-only for Moneypenny)
   └─ System/icp.md                                                              ← three segments + disqualifiers + near-neighbours
      06-Resources/Research/Industry_reports/<sector>/                           ← durable sector truths
      System/discovery-sources.yaml                                              ← ICP-segment-keyed URL + competitor seed list

LAYER 3 — PER-INITIATIVE DISCOVERY  (Moneypenny — this agent)
   /moneypenny-custom
        Mode A (headless):
          Phase 0. Load card state + ICP version + Felix staleness check
          Phase 1. Competitor filter + positioning (from Felix's profiles + synthesis)
          Phase 2. Customer evidence harvest (meetings last 90d, People/External/*)
          Phase 3. Market signal alignment (Market_and_deal_signals.md diff vs brief keywords)
          Phase 4. ICP strategic-fit score (read System/icp.md, compare brief.* + gate.*)
          Phase 5. Solution-pattern survey (new — competitor profiles + industry PDFs + signal log)
          Phase 6. Compose discovery.research.summary + draft openQuestions for gaps
          Terminal. Write discovery.* (provider-atomic); bump revision +1; emit skill_run
        Mode B (interactive "deepen"):
          Seeded from current discovery.* state
          Targeted 2–3 question pressure-test
          Writes refined fields with source: user_via_agent

LAYER 4 — DOWNSTREAM CONSUMERS  (read discovery.*)
   └─ /bond-prd-custom (TBD; supersedes /agent-prd in personal mode)
        — reads discovery.researchNotes + customerEvidence[] + solutionPatterns[] + closed openQuestions[]
      Initiative Modal     — renders discovery.research.summary + field-level badges
      Weekly sweep         — reads discovery.lastRerunAt to decide re-score vs skip
```

The point: **Felix does the company-wide weekly intel; Moneypenny does the per-card discovery using Felix's output as curated input**. This keeps Moneypenny's per-card cost low (synthesis, not fetching) and guarantees both agents read the same ground truth. Bond (downstream) then consumes Moneypenny's package at `spec_ready`.

---

## Inputs Moneypenny owns vs consumes

| Input | Where it lives | Owned by | Moneypenny's relationship |
|---|---|---|---|
| **Card state** — `brief.*`, `gate.*`, `title`, `body`, `sourceRefs[]` | `pdlc-ui/data/` (SQLite) | PM (via `/pdlc-brief-custom` + `/pdlc-idea-gate-custom`) | **Reads** |
| **ICP** | [`System/icp.md`](../../System/icp.md) | M (Shaun) | **Reads.** Cache-invalidates on `Version` line change. |
| **Felix weekly artefacts** | `06-Resources/Market_intelligence/synthesis/weekly/*`, `06-Resources/Competitors/profiles/*` | Felix (`/felix-custom`) | **Reads.** Warns if >7 days stale. |
| **Signal log** | `06-Resources/Market_and_deal_signals.md` | Felix (Step 1 of `/felix-custom`) | **Reads** last 7 days for diff-against-brief-keywords. |
| **Industry research PDFs** | `06-Resources/Research/Industry_reports/<sector>/` | Manual quarterly drop | **Reads** on solution-pattern survey (Phase 5). |
| **Meetings** | `00-Inbox/Meetings/` | Granola sync + `/process-meetings` | **Reads** last 90 days keyword-scoped. |
| **People pages** | `People/External/*` | `/process-meetings` | **Reads** when card mentions a named beneficiary. |
| **Wyzetalk client data** | `05-Areas/Companies/Wyzetalk_Clients/*` | Felix (`/felix-client-signals-custom`, on-demand) | **Reads for reasoning only** — never echoes account names or numbers into `discovery.*`. |
| **Discovery source list** | [`System/discovery-sources.yaml`](../../System/discovery-sources.yaml) | M (seeded by Moneypenny, maintained by M) | **Reads + appends.** Initiatives can append URLs; never override. |
| **`discovery.*` fields** | Card state | **Moneypenny (primary writer)** | **Writes** via `DiscoveryResearchProvider.advance()`. |

---

## Cadence

### Per-card kickoff (automatic, ~60–90s)

Fires on `idea → discovery` lane move via the S3A.3 kickoff route. Runs Phase 0–6 headless; terminal tick writes `discovery.*`; Initiative Modal's Discovery tab renders the synthesis live.

### Monday weekly sweep (~3–5 min across ~5–15 cards)

Reads Friday's Felix Signal (3 days old). Runs Phases 1, 3, 4, 5 per card — skips Phase 2 (customer-evidence harvest) unless new meetings landed. Preserves `user` / `reviewedBy != null` fields verbatim; when new evidence contradicts a reviewed field, appends a draft `openQuestion`:

> *"Competitor X has changed positioning since your <date> review — revisit?"*

Invoked via the companion skill [`/weekly-discovery-sweep-custom`](../../.claude/skills/weekly-discovery-sweep-custom/SKILL.md).

### On-demand "Deepen with Moneypenny" (Mode B, ~5–10 min per card)

PM-initiated from the Discovery tab when the drafts need pressure-testing. Budget: $0.50/card/session. Not rate-limited beyond the budget.

### ICP version bump (event-driven)

When `System/icp.md`'s `Version` line changes, the next weekly sweep invalidates segment-caches and re-scores strategic fit on every `discovery`-column card. No immediate re-fire per card — the sweep handles it.

---

## Handoff contracts

### Upstream — Felix → Moneypenny

Moneypenny reads Felix's output, does not trigger it. If Felix hasn't run (`Market_intelligence/synthesis/weekly/<latest>.md` missing or mtime >7 days), Moneypenny:

1. Proceeds with Phase 0–6 using the stale artefacts.
2. Prepends a one-line warning to `discovery.research.summary`: *"⚠ Felix's Friday Signal is <N> days stale — synthesis may miss recent competitor moves."*
3. Appends a draft `openQuestion`: *"Run `/felix-custom` before this card's next sweep — discovery is operating on stale intel."*
4. Does **not** retry or fall back to raw `ingest/` scraping. Felix owns fetching.

### Downstream — Moneypenny → Bond PRD

At `spec_ready`, **Bond PRD** (`/bond-prd-custom` — TBD; supersedes `/agent-prd` in the personal-Dex workflow) reads:

- `brief.*` (frozen, 3 fields + understandingSummary)
- `discovery.researchNotes`
- `discovery.customerEvidence[]`
- `discovery.solutionPatterns[]` *(new)*
- `discovery.openQuestions[]` — **only those with `status: "resolved"`** (open questions block spec readiness)

Bond ignores `discovery.competitorSnapshot` (reference-only, not PRD-shaped) and `discovery.research.summary` (human narrative, redundant once fields are read). Contract row lives in [`plans/PDLC_UI/schema-initiative-v0.md §8`](../PDLC_UI/schema-initiative-v0.md#8-skill-io-contracts-summary) — annotated with "Bond PRD supersedes `/agent-prd`" pending the `/bond-prd-custom` SKILL.md.

**Until `/bond-prd-custom` is authored**, the canonical Dex `/agent-prd` skill can be invoked manually against Moneypenny's `discovery.*` output as a compatibility shim — the field-level contract is identical; only the persona wrapper differs.

### Downstream — Moneypenny → design (deferred)

Moneypenny does **not** package a design-brief today. The `discovery → design` lane move currently writes no skill output (template-filling only — see [`plans/PDLC_UI/skill-agent-map.md`](../PDLC_UI/skill-agent-map.md)). Revisit after two cards have completed the full `idea → design → spec_ready` flow; options on the table are (a) Phase 7 of Moneypenny at lane move, or (b) a sibling `/pdlc-design-brief-custom`. Not this sprint.

### Downstream critique — Bond → Q / M-critique

After Bond PRD drafts `spec.*`, Q (`/agent-q-cto-custom`) runs a feasibility pass and M-critique (`/agent-m-cpo-custom`) runs a product-outcome pass. Both operate on Bond's PRD output — **not** on Moneypenny's `discovery.*` directly. Moneypenny's job ends when the briefing folder is ready.

---

## Skills map

### Moneypenny skills (just one, for now)

| Skill | One-liner | Reads | Writes |
|---|---|---|---|
| **`/moneypenny-custom`** | **The agent.** Per-card discovery: competitor filter + customer evidence + market-signal alignment + ICP strategic-fit + solution patterns + draft open questions. Two entry modes (headless + interactive "deepen"). | Card state (`brief.*`, `gate.*`, `title`, `body`, `sourceRefs[]`); `System/icp.md`; Felix weekly artefacts; `Market_and_deal_signals.md`; `00-Inbox/Meetings/` last 90d; `People/External/*`; `System/discovery-sources.yaml`; `Research/Industry_reports/*` (on solution-pattern pass) | `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.customerEvidence[]`, `discovery.solutionPatterns[]` *(new)*, `discovery.openQuestions[]` (drafts), `discovery.research.summary`, `discovery.iteration`, `discovery.lastRerunAt`. Proposes `gate.strategicFit` updates on ICP version bump. |
| **`/weekly-discovery-sweep-custom`** | **Wrapper.** Iterates every card in the `discovery` column and invokes Moneypenny headless. One run per Monday. | Card list from `pdlc-ui` (`lifecycle === "discovery"`) | Invokes `/moneypenny-custom` per card. Writes one Slice log roll-up to `04-Projects/PDLC_Orchestration_UI.md`. |

### Adjacent skills (Moneypenny does not own; documented so you know the lanes)

| Skill | Relationship |
|---|---|
| `/felix-custom` | **Upstream producer.** Moneypenny consumes Friday Signal + competitor profiles + signal log. Do not invoke inside Moneypenny — runs separately on Fridays. |
| `/felix-client-signals-custom` | **CPO-internal, on-demand.** Moneypenny reads `Wyzetalk_Clients/index.md` only for reasoning; never surfaces account names or numbers into `discovery.*`. |
| `/pdlc-brief-custom` | **Upstream producer.** Supplies `brief.*` (the three questions Moneypenny reads). |
| `/pdlc-idea-gate-custom` | **Upstream producer.** Supplies `gate.*` if the optional gate ran. |
| `/bond-prd-custom` (TBD) | **Downstream consumer.** Reads `brief.*` + `discovery.*` at `spec_ready`. Supersedes `/agent-prd` in personal-Dex mode. SKILL.md authored in a later pass. |
| `/agent-prd` | **Compatibility shim.** Still invocable; same field-level contract as Bond PRD. Annotated as superseded in the personal-Dex workflow. |
| `/customer-intel`, `/intelligence-scanning`, `/meeting-prep` | **Composable sub-skills.** Moneypenny's Phase 2 (customer evidence) mirrors `/meeting-prep`'s meeting-scan logic; may invoke directly in future. Today: inline. |
| `/industry-truths` | **Cousin.** Felix writes; Moneypenny reads industry PDFs the same way on the solution-pattern pass. |
| `/agent-q-cto-custom` | **Downstream feasibility pass on Bond's PRD output** — not on Moneypenny directly. Manual trigger today. |
| `/agent-m-cpo-custom` | **Downstream product-outcome critique on Bond's PRD output** — not on Moneypenny directly. Manual trigger today. |
| ~~`/gatekeeper-custom`~~ *(removed 2026-04-24)* | **Was** the engineering/PR-merge gate (formerly Moneypenny). **Deleted** from the vault — does not interact with `/moneypenny-custom`. Use **`babysit`** + R16 checklist for future `pdlc-ui` PRs. |

---

## How this ties to the PDLC sprint plan (S3B)

Moneypenny **is** what S3B was scoped for. The [`plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md`](../PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md) seed closes its 10 deep-dive questions against the answers here. The "S3B" label is historical — pdlc-ui is no longer PR-merge-tracked in personal mode, but the interface contracts remain useful spec for a future revival. Concretely:

1. **Interface unchanged** — `DiscoveryResearchProvider.advance()` would be the only integration point in a pdlc-ui build. S3A.3's kickoff route, `initiative_jobs` table, client polling, progress bar, and Initiative Modal's Discovery tab stay untouched.
2. **Hybrid mode adds no new runner infrastructure** — Mode B is a separate chat-triggered entrypoint on the same skill; it does not use the tick-driven runner. No `initiative_jobs` row for Mode B; writes go via the atomic card-state update path.
3. **New schema additions (same-PR per plan R16):**
   - `discovery.solutionPatterns[]` — added to [`schema-initiative-v0.md §4.3`](../PDLC_UI/schema-initiative-v0.md#43-discovery--open-questions--research).
   - `source: "user_via_agent"` — added to envelope `source` enum in [`schema-initiative-v0.md §3`](../PDLC_UI/schema-initiative-v0.md#3-field-envelope-every-skill-written-field).
   - `skill_run.payload` gets optional `cost_usd?`, `categoriesWritten?`, `contradictionsFlagged?` — added to [`schema-initiative-v0.md §6`](../PDLC_UI/schema-initiative-v0.md#6-events--append-only-audit).
   - `initiative_jobs.status` gets new value `succeeded_with_warnings` — coordinated with S3A.3's CHECK constraint at migration time.

---

## Cost ceilings (first-pass — tune after one full weekly sweep)

| Entrypoint | Budget | Rationale |
|---|---|---|
| **Kickoff (Mode A, per card)** | **$0.30** | Felix already fetched + curated; Moneypenny is synthesis-only across 6 short phases. |
| **Weekly sweep (Mode A, whole column)** | **$5.00** | Assumes 10–15 cards at $0.30 with headroom for 1–2 re-runs on transient failures. |
| **Interactive "Deepen" session (Mode B, per card)** | **$0.50** | 2–3 turns + targeted re-reads. User-initiated, so over-budget is a UX concern not a silent-burn one. |

Cost emitted on the `skill_run` event as `payload.cost_usd`. Breach of ceiling → job status `failed` with `error: "cost_ceiling_breached"`; no partial write.

---

## Confidence scoring (locked)

Moneypenny writes field-level `confidence` per the envelope contract:

- **`high`** — ≥2 independent citations agree (different `sourceRef` paths, different origin — e.g. meeting + market signal, not two sections of the same PDF). Requires matching `sourceRef[]` on the field.
- **`med`** — exactly one citation supports the claim, or multiple citations from the same source. Requires `sourceRef`.
- **`low`** — inference from context without direct citation. No `sourceRef` required; PM review expected before promotion to `user`.

Moneypenny **never** writes `confidence: "high"` without matching `sourceRef`s. Enforced in the provider implementation + unit-tested against golden fixtures.

---

## Failure semantics

| Failure mode | Moneypenny's response |
|---|---|
| Felix artefacts stale (>7d) | Proceed; warn in `discovery.research.summary`; draft `openQuestion` to run Felix. |
| ICP missing | Hard fail; job status `failed` with `error: "icp_missing"`. Blocker — `System/icp.md` is a hard dependency. |
| Phase N fails mid-run | Commit partial; job status `succeeded_with_warnings`; draft `openQuestion` noting the gap. E.g. *"Customer-evidence step failed on run <id>; competitor + signal sections succeeded."* |
| Cost ceiling breached | Job status `failed`; no partial write; PM sees amber retry chip on the card. |
| LLM provider error | Job status `failed`; PM retries via "Re-run discovery" button (standard S3A.3 flow). |

---

## Observability

- **Per-run:** one `skill_run` event on the card with `payload: { skill, iteration, cost_usd, categoriesWritten, contradictionsFlagged }`.
- **Per-sweep:** one Slice log roll-up line in `04-Projects/PDLC_Orchestration_UI.md`:
  > *YYYY-MM-DD (Mon) — Weekly discovery sweep: N cards refreshed, M contradictions flagged, total cost $X.XX.*
- **Per-interactive-session (Mode B):** one `skill_run` event with `payload.mode: "deepen"`.

---

## Open questions for M (standing list)

1. **Design-brief packaging trigger** — revisit after 2 cards hit `design`, or a time window (30 days)? Default until overridden: **after 2 cards**.
2. **Cost ceiling tuning** — the $0.30 / $5 / $0.50 numbers are informed guesses. Adjust after first sweep gives real data.
3. **Q (CTO critique) wiring** — today Q runs manually when M invokes it on Bond's PRD output. Worth auto-triggering a Q pass after every Moneypenny kickoff on cards with effort `l | xl`? Probably not — Q reads `spec.*`, which Moneypenny doesn't produce.
4. **Discovery source YAML ownership** — Moneypenny seeds from ICP segments at v1; after first two weekly sweeps, does M want to maintain the YAML manually or have Moneypenny propose diffs?
5. **Mode B transcript archiving** — interactive sessions produce chat logs. Archive verbatim in `discovery.deepenTranscript[]` or summarise into `discovery.researchNotes`? Default: **summarise**; reconsider if PMs want to re-read sessions.
6. **Bond PRD skill authoring** (new post-rename) — when to stop deferring `/bond-prd-custom`? Default: when the first card with a Moneypenny-complete `discovery.*` payload is ready to leave `discovery → spec_ready` and we have actual output to feed it.

**Resolved 2026-04-22 (pm, via plan mode with M):**

- Persona originally named **Bond / 007**; skill path `/pdlc-discovery-research-custom` (interface contracts bound).
- Interaction model is **hybrid** (Mode A headless + Mode B interactive "deepen").
- Design-brief packaging **deferred** — discovery agent stops at `discovery.*` for now.
- Solution-patterns added as sixth research category (`discovery.solutionPatterns[]`).
- Confidence scoring locked at `high` = ≥2 independent citations / `med` = one / `low` = inferred.
- LLM provider: Anthropic Claude Sonnet via server-side API key in `pdlc-ui` env.

**Resolved 2026-04-24 (persona re-map in personal-Dex workflow):**

- Old Moneypenny (PR-merge gate) renamed to **Gatekeeper** (`/gatekeeper-custom`), then **removed from the vault 2026-04-24** — `pdlc-ui` parked; use **`babysit`** + frozen guardrails.
- This skill renamed from `/pdlc-discovery-research-custom` → **`/moneypenny-custom`**; persona is now the intelligence debriefer.
- The codename **Bond** migrates to the downstream PRD author: `/bond-prd-custom` (TBD; supersedes `/agent-prd` in personal mode).
- All Q1–Q10 decisions above hold — they attach to the skill's behaviour, not the persona label.

---

## Files filed in the bootstrap (2026-04-22, persona-renamed 2026-04-24)

| What | Where | Why |
|---|---|---|
| Moneypenny operating doc (this file) | `plans/Research/moneypenny-strategy.md` *(formerly `bond-strategy.md`)* | Persona definition, handoff contracts, cadence |
| S3B seed close-out | `plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md` | Q1–Q10 answered; Mode B section added; solution-patterns added; persona + skill-path refreshed 2026-04-24 |
| Moneypenny SKILL.md | `.claude/skills/moneypenny-custom/SKILL.md` *(formerly `.claude/skills/pdlc-discovery-research-custom/SKILL.md`)* | The agent itself — phase-by-phase runbook |
| ~~Gatekeeper SKILL.md~~ | *(deleted 2026-04-24)* | Old PR-merge gate — last **committed** copy on this branch: `git show freeze/skills-pipeline-pivot^:.claude/skills/moneypenny-custom/SKILL.md` (pre–persona-remap MoneyPenny gate) |
| Discovery source list | `System/discovery-sources.yaml` | ICP-segment-keyed URLs + competitor handles + search queries |
| Weekly sweep wrapper | `.claude/skills/weekly-discovery-sweep-custom/SKILL.md` | Monday iteration across `discovery`-column cards |
| Schema delta | `plans/PDLC_UI/schema-initiative-v0.md` | `discovery.solutionPatterns[]`, `source: user_via_agent`, `skill_run.payload` optional fields, `/agent-prd` I/O row + Bond-PRD-supersedes annotation |
| Skill-agent-map delta | `plans/PDLC_UI/skill-agent-map.md` | Stage→skill row for `discovery`; Custom skills table entry; engineering-gate row renamed to Gatekeeper; Future-skills block for Bond PRD |

**Not filed in this bootstrap (explicit out-of-scope):**

- `/bond-prd-custom` SKILL.md — deferred; map-only reference in `skill-agent-map.md` + `schema-initiative-v0.md`.
- Provider implementation (`pdlc-ui/src/server/discovery/provider.ts`) — pdlc-ui build is no longer PR-merge-tracked in personal mode; revive only if the project resumes.
- `/agent-prd` I/O changes to actually consume `discovery.solutionPatterns[]` — separate pass; Moneypenny writes the field ahead of any PRD-author skill reading it.
- Design-brief packaging at `discovery → design` — deferred until 2 cards clear the flow.

---

*Bootstrapped 2026-04-22 by M (CPO) + Dex, closing plan-mode deep-dive against [`plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md`](../PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md) Q1–Q10. Persona re-mapped 2026-04-24 (Moneypenny/Bond/Gatekeeper re-cut for the personal-Dex workflow). Mirrors [`plans/Research/felix-strategy.md`](./felix-strategy.md) structure for lineage continuity.*
