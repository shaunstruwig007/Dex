Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S3B — `/pdlc-discovery-research-custom` (Bar A). Branch: feat/s3b-discovery-research.

> **⚠ Open seed — deep-dive scheduled 2026-04-22+ with Shaun.** This file **reserves the slot** and pins the **shape** (interface, inputs, outputs, cadence) so S3A.1 / S3A.2 can build to it without guessing. The full field-by-field behaviour, research taxonomy, and LLM wiring are resolved in Plan mode **with the PO** before Build. **Do not start Build from this seed alone** — the "Deep-dive open questions" block below must close first.

---

### Why this sprint exists

S3A.1's brief shrinks to three questions (*why* / *who* / *what*) — the PM's honest answer at `idea → discovery`. The board now promises that **something happens in discovery** (S3A.2's visible progress bar), but the runner is a deterministic stub. S3B replaces the stub with a real research skill: market intelligence, competitor analysis, customer evidence, strategic fit against ICP. This is what makes discovery **actually discover** instead of just waiting.

**Product philosophy (from plan.md):** the UI steers and guides what **Dex already does in chat** — `/customer-intel`, `/intelligence-scanning`, `/meeting-prep`, `/weekly-exec-intel`. S3B composes those existing skills into a per-initiative research pass, **not** a parallel intelligence system. It is the canonical "Dex-native habit feeds discovery" loop from the plan's Phase 3 list.

---

### Interface lock (so S3A.2 can build to it)

**`/pdlc-discovery-research-custom` replaces the S3A.2 stub behind the same `DiscoveryResearchProvider` interface.** S3A.2 defines:

```ts
interface DiscoveryResearchProvider {
  advance(jobId: string, step: number, ctx: { initiativeId: string; brief: BriefState; gate: GateState; sourceRefs: SourceRef[] }):
    Promise<{ progress: number; done: boolean; payloadPatch?: Partial<DiscoveryState> }>;
}
```

S3B ships a new provider module implementing the same shape — the route handler, `initiative_jobs` table, client polling, card progress bar, side-panel Discovery tab, and terminal-write path stay untouched.

**Invariants S3B preserves from S3A.2:**

- Runner stays **tick-driven, client-polled, server-advanced**. No background process, no `setInterval`, no `after()`. If the deep-dive concludes a long-running research pass needs >2min, **that is an ADR conversation**, not a sprint-convenience override.
- Terminal tick writes the composite `discovery.research.summary` envelope (already defined in S3A.2) in the same transaction as any `discovery.*` field writes; bumps initiative `revision +1`; emits one `skill_run` with `{ skill: "pdlc-discovery-research-custom", iteration }`.
- Job row lifecycle unchanged (running → succeeded / failed; heartbeat + reconciler).
- Cancellation via initiative delete remains the only way to stop an in-flight research pass.

---

### Inputs (reads)

**Card state:**
- `brief.problem`, `brief.targetUsers`, `brief.coreValue`, `brief.understandingSummary` (from the shrunk brief).
- `gate.strategicFit`, `gate.tradeOff`, `gate.primaryBeneficiary`, `gate.origin`, `gate.recommendation` (if `/pdlc-idea-gate-custom` ran).
- `title`, `body`, `sourceRefs[]`, `strategyPillarIds[]`.

**Vault artefacts (TBC 2026-04-22 — short-list for deep-dive):**
- `06-Resources/Market_intelligence/synthesis/daily/*` — daily intel briefs.
- `06-Resources/Market_and_deal_signals.md` — signal log (EV-* rows).
- `06-Resources/Company/company_strategy.md` (WT thesis, in/out lenses).
- **`System/icp.md`** (Ideal Customer Profile — **to be authored by Shaun 2026-04-22**; see Deep-dive Q4 below). Used to score strategic fit and filter competitor analysis.
- `06-Resources/Competitors/*` (if maintained) + `Market_intelligence/weekly/*`.
- `People/External/*` — customer pages for named beneficiaries.
- `00-Inbox/Meetings/` — last 90 days, keyword-scored.

**URL / competitor lists (cadence):** S3B maintains a seed list of **URLs + competitor handles + search queries** per market segment. The weekly sweep (below) re-pulls these; each pass diffs new signal and updates the card's `discovery.competitorSnapshot` when the diff is material. Storage: **TBC 2026-04-22** — options are `System/discovery-sources.yaml` (single shared list) vs per-initiative `discovery.sources[]` (inherited from ICP + gate). See Deep-dive Q2.

---

### Outputs (writes)

All writes go to `discovery.*` — **not** `brief.*`. The brief is frozen at the three PM-answered questions; discovery owns everything the PM couldn't answer at brief time.

| Field | Shape | Source flavour |
|-------|-------|----------------|
| `discovery.researchNotes` | `stringFieldEnvelope` | `agent_draft` (PM reviews → `user`) |
| `discovery.competitorSnapshot` | list envelope (`{ name, url, positioningNote, lastSeen }[]`) | `signal_cited` where sourceRef exists; `agent_draft` otherwise |
| `discovery.customerEvidence[]` | existing shape from §4.3 | `meeting_cited` (with `sourceRef` → meeting path) |
| `discovery.openQuestions[]` | existing shape; `status: "open"`, `owner: "pm"`, `source: "agent_draft"` | All drafted questions start as drafts — PM confirms in the UI |
| `discovery.research.summary` | `stringFieldEnvelope` (already added in S3A.2) | Synthesis of the above — this is what the card side-panel's Discovery tab renders |
| `discovery.iteration` | `number` (monotonic, server-computed) | Incremented on every successful run |
| `discovery.lastRerunAt` | ISO-8601 | Set on every successful run |

**Does NOT write:** `brief.*` (frozen by S3A.1), `spec.*` (`/agent-prd` owns), `design.*`, `release.*`.

---

### Cadence (per Shaun, 2026-04-21)

**Three triggers:**

1. **Kickoff on `idea → discovery` lane move** — the S3A.2 flow invokes S3B once; iteration `1`.
2. **Manual "Re-run discovery"** from the side panel's Discovery tab (staleness rule in schema §7: any `brief.*.updatedAt` newer than `discovery.lastRerunAt` offers the re-run). Incremental iteration; previous `discovery.researchNotes` with `source: user` or `reviewedBy != null` are preserved; only `agent_draft` fields are overwritten.
3. **Weekly sweep (Bar A cadence)** — a scheduled pass across **all cards in the `discovery` column**. Refreshes competitor snapshots, pulls new signals, surfaces any new open questions as drafts. Does **not** touch user-reviewed fields. Designed to **accumulate context** over time — every week the discovery tab has more signal than the week before (this is the compound-loop the plan's Phase 3+ pins to Dex-native habits).

**Scheduler for the weekly sweep:** TBC 2026-04-22. Options are (a) a `cron`-style entry in the Dex daily/weekly runner, (b) a cursor-friendly manual `/weekly-discovery-sweep` chat command, or (c) a UI button in the board header. Default this seed = **(b) manual + (a) cron via existing Dex cadence scripts** — do not add a server-side scheduler to `pdlc-ui` just for this. Revisit after 2 cycles.

---

### Companion skill: market research feeder

The weekly sweep needs fresh market data to re-score against. **`/pdlc-discovery-research-custom` does not fetch it directly** — it consumes what the existing intel stack produces:

- `/weekly-exec-intel` + `/intelligence-scanning` already maintain `Market_intelligence/` outputs (see the Dex skills index).
- A thin companion script or skill **TBC 2026-04-22** can extend URL / competitor lists by segment (see Deep-dive Q2). The goal: keep the research skill a **consumer** of the vault, not a web scraper bolted onto `pdlc-ui`.

---

### Deep-dive open questions (close in Plan mode with PO 2026-04-22+)

**Q1 — Research taxonomy.** What are the research *categories* the skill produces per card? Working list (Shaun to confirm): (a) competitor positioning, (b) customer evidence quotes, (c) market signal alignment, (d) strategic-fit score against ICP, (e) open questions for the PM. Are any of these out? Any missing (e.g. regulatory / pricing / capability gap)?

**Q2 — Source list storage.** Is the URL + competitor list **per-ICP-segment** (shared `System/discovery-sources.yaml`) or **per-initiative** (inherited from gate/ICP)? Default: shared YAML seeded by ICP segment; initiative can append but not override. Revisit if initiatives diverge wildly.

**Q3 — Confidence scoring.** How does the skill decide `confidence: low | med | high` for drafts? Proposal: `high` only when ≥2 independent citations agree; `med` when one citation; `low` otherwise. Confirm + lock before Build.

**Q4 — ICP artefact.** `System/icp.md` does not exist yet — Shaun to author 2026-04-22 as part of this deep-dive. Minimum shape (proposal): WT ICP segments (1–3 named segments) + per-segment *"who they are"*, *"what problem they buy for"*, *"what disqualifies them"*. This skill reads that file to score `gate.strategicFit` on re-runs and to filter competitor analysis. **Blocker for the weekly sweep** — without ICP the sweep has no "is this card still a fit?" check.

**Q5 — LLM wiring.** The S3A.2 stub is deterministic. S3B is the first real LLM caller in `pdlc-ui/`. Which provider? How is the call kept server-side only (no browser keys)? Cost ceiling per run? Cost ceiling per weekly sweep? **Blocker for non-dev runs.**

**Q6 — Staleness + diffing.** A weekly re-run that overwrites `agent_draft` fields is fine; overwriting a `user` / `reviewedBy != null` field is not. But what about *flagging* that a PM-reviewed field is now stale against newer evidence? Proposal: append an `openQuestion` with `owner: "pm"`, `text: "Competitor X has changed positioning since your Apr 21 review — revisit?"`. Confirm UX.

**Q7 — Observability.** How do we see what the sweep did per card? Proposal: one `skill_run` event per card per run (as already committed in schema §6) + one `04-Projects/PDLC_Orchestration_UI.md` Slice log roll-up per week. Confirm.

**Q8 — Failure mode for a single-card research pass.** If the LLM fails mid-run, we mark the job `failed` with an amber retry chip (S3A.2 contract). But what if the skill succeeds partially (e.g. writes `competitorSnapshot` but fails on `customerEvidence`)? Do we commit the partial and mark `warning`, or rollback? **Default = commit partial + emit `openQuestion` noting the gap** — confirm.

**Q9 — Scope boundary with `/agent-prd`.** When the card moves `discovery → design` (and later `design → spec_ready`), what does `/agent-prd` read from `discovery.*` vs `brief.*`? Minor doc update in `schema-initiative-v0 §8` — confirm the I/O contract table line for `/agent-prd`.

**Q10 — Re-run on brief edit.** S3A.2 explicitly does **not** re-fire kickoff on brief edit. With S3B live, the staleness rule in schema §7 becomes real: any `brief.*` update makes `discovery.*` stale. Confirm the side-panel UX offers "Re-run discovery" exactly when the staleness rule fires — and never auto-runs it (PM decides).

---

### Deliverables (outline — fleshed out post-deep-dive)

- **New skill file** `.claude/skills/pdlc-discovery-research-custom/SKILL.md` — I/O contract mirroring `schema-initiative-v0 §8` row; cadence; composition with `/customer-intel` + `/intelligence-scanning` + `/meeting-prep`.
- **Server-side provider implementation** replacing S3A.2's stub behind `DiscoveryResearchProvider`. Composition of vault reads; LLM call(s) for synthesis; envelope outputs.
- **Weekly sweep entrypoint** — manual `/weekly-discovery-sweep` chat command + optional cron hook (TBC Q2 above).
- **ICP artefact** `System/icp.md` authored by Shaun 2026-04-22 (co-shipped with S3B; it is a blocker for the weekly sweep).
- **Schema doc updates** — add `/pdlc-discovery-research-custom` row to `schema-initiative-v0 §8` (already pre-staged 2026-04-21); confirm `discovery.*` write list matches provider output.
- **Side panel Discovery tab copy** — no shape change from S3A.2; just copy that reflects real research vs stub.
- **Tests** — unit-test the provider against golden fixtures (brief shape + mocked vault reads → expected `discovery.*` diff); Playwright smoke that a full kickoff → tick → terminal produces a non-empty `research.summary` on a card with a seeded brief.

---

### DoD (outline)

- [ ] `DiscoveryResearchProvider` swap: S3A.2 stub replaced by the real provider with **zero** changes to the route handler, `initiative_jobs` table, polling client, or side-panel Discovery tab.
- [ ] Deep-dive questions Q1–Q10 closed in Plan mode before Build.
- [ ] `System/icp.md` exists and is read by the provider to score strategic fit.
- [ ] Kickoff writes `discovery.researchNotes` + `discovery.competitorSnapshot` + `discovery.customerEvidence[]` + `discovery.openQuestions[]` + `discovery.research.summary` + `discovery.iteration` + `discovery.lastRerunAt`.
- [ ] Weekly sweep command refreshes all `discovery`-column cards; preserves `user` / `reviewedBy != null` fields; appends an `openQuestion` draft when new evidence contradicts a PM-reviewed field.
- [ ] `/pdlc-discovery-research-custom` row in `schema-initiative-v0 §8` matches provider behaviour; `skill_run` known-ids list includes the id.
- [ ] LLM calls are server-side only; cost ceiling defined + enforced; observable per run (one `skill_run` event + Slice log weekly roll-up).
- [ ] Playwright smoke: seed a card with brief → kickoff → tick-to-terminal → side-panel Discovery tab shows a non-empty synthesis.

---

### Explicitly OUT

- Widening `brief.*` — the brief is frozen at three questions (S3A.1).
- Changes to `canTransition` / `saveBriefAndTransition` / atomic brief API / `eventSchema` / `initiative_jobs` table schema / runner model.
- Any auto-re-run on brief edit (PM-triggered only).
- Hosted / headless execution beyond what Dex's existing cadence scripts + `pdlc-ui` tick runner provide (R15 Phase 2 territory).
- Client-side LLM calls or any browser-exposed model keys.

---

### Dependencies

- **S3A.1 merged** (shrunk brief — the three questions the skill reads).
- **S3A.2 merged** (`DiscoveryResearchProvider` interface, `initiative_jobs` table, kickoff endpoint, side-panel Discovery tab, staleness rule plumbing).
- **`System/icp.md` exists** (Shaun, 2026-04-22) — blocker for the weekly sweep.
- Existing Dex skills: `/customer-intel`, `/intelligence-scanning`, `/meeting-prep`, `/weekly-exec-intel` — consumed as-is.

---

Post-merge: Slice log line + tick S3B Progress in plan.md. Update `schema-initiative-v0 §8` and the companion `skill_run` known-ids list if any drift from the pre-staged entries.
