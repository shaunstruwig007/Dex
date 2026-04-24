> **FROZEN 2026-04-24 — pdlc-ui parked.** The live plan is [`plans/skill-pipeline/README.md`](../../skill-pipeline/README.md). This seed does not drive current work. Moneypenny's operational contract continues outside the `pdlc-ui` runtime; see [`.claude/skills/moneypenny-custom/SKILL.md`](../../../.claude/skills/moneypenny-custom/SKILL.md) and [`plans/Research/moneypenny-strategy.md`](../../Research/moneypenny-strategy.md). The `DiscoveryResearchProvider` runtime interface referenced below is dormant.

Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S3B — `/moneypenny-custom` *(formerly `/pdlc-discovery-research-custom`)* (Bar A). Branch: feat/s3b-discovery-research.

> **✅ Deep-dive closed 2026-04-22 (pm) with M (Shaun).** Q1–Q10 resolved inline below. Persona originally named **Bond / 007**; **renamed 2026-04-24 to Moneypenny** — per-initiative intelligence debriefer — and skill path renamed to `/moneypenny-custom` (the "Bond" codename migrated to the downstream PRD author `/bond-prd-custom`, TBD, which supersedes `/agent-prd` in personal-Dex mode). See [`plans/Research/moneypenny-strategy.md`](../../Research/moneypenny-strategy.md) for the operating doc. Hybrid interaction model locked (Mode A headless + Mode B interactive "deepen"). Solution-patterns added as sixth research category (`discovery.solutionPatterns[]`). Design-brief packaging at `discovery → design` deferred until 2 cards clear the flow. **The "S3B" label is historical** — pdlc-ui is no longer PR-merge-tracked in personal mode; the interface contracts below remain useful spec for a future revival. **This seed is now buildable.**
>
> **2026-04-22 upstream pivot note.** S3A.2 no longer ships the automation surface (prefill + kickoff + `initiative_jobs` + the provider interface). S3A.2 now ships the URL-addressable **Initiative Modal** + chat-style brief wizard + within-lane reorder restore. The automation-surface work — including the `DiscoveryResearchProvider` interface this S3B replaces — moved to **S3A.3**. In the body below, treat every "S3A.2" reference as "S3A.3" for the parts that describe kickoff / jobs / provider swap / discovery progress, and every "side panel" reference as "Initiative Modal's Discovery tab". See [`../../pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md`](../../../pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md) and the current [`sprint-backlog.md § Sprint 3A.2` + `§ Sprint 3A.3`](../sprint-backlog.md).

---

### Why this sprint exists

S3A.1's brief shrinks to three questions (*why* / *who* / *what*) — the PM's honest answer at `idea → discovery`. The board now promises that **something happens in discovery** (S3A.2's visible progress bar), but the runner is a deterministic stub. S3B replaces the stub with a real research skill: market intelligence, competitor analysis, customer evidence, strategic fit against ICP. This is what makes discovery **actually discover** instead of just waiting.

**Product philosophy (from plan.md):** the UI steers and guides what **Dex already does in chat** — `/customer-intel`, `/intelligence-scanning`, `/meeting-prep`, `/weekly-exec-intel`. S3B composes those existing skills into a per-initiative research pass, **not** a parallel intelligence system. It is the canonical "Dex-native habit feeds discovery" loop from the plan's Phase 3 list.

---

### Interface lock (so S3A.2 can build to it)

**`/moneypenny-custom` replaces the S3A.2 stub behind the same `DiscoveryResearchProvider` interface.** S3A.2 defines:

```ts
interface DiscoveryResearchProvider {
  advance(jobId: string, step: number, ctx: { initiativeId: string; brief: BriefState; gate: GateState; sourceRefs: SourceRef[] }):
    Promise<{ progress: number; done: boolean; payloadPatch?: Partial<DiscoveryState> }>;
}
```

S3B ships a new provider module implementing the same shape — the route handler, `initiative_jobs` table, client polling, card progress bar, Initiative Modal's Discovery tab, and terminal-write path stay untouched.

**Invariants S3B preserves from S3A.2:**

- Runner stays **tick-driven, client-polled, server-advanced**. No background process, no `setInterval`, no `after()`. If the deep-dive concludes a long-running research pass needs >2min, **that is an ADR conversation**, not a sprint-convenience override.
- Terminal tick writes the composite `discovery.research.summary` envelope (already defined in S3A.2) in the same transaction as any `discovery.*` field writes; bumps initiative `revision +1`; emits one `skill_run` with `{ skill: "moneypenny-custom", iteration }`.
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
| `discovery.solutionPatterns[]` *(new — Q1 extension)* | list envelope (`{ pattern, exampleVendors[], applicabilityToWT, sourceRef }[]`) | `signal_cited` or `agent_draft`. "How this class of problem has been solved elsewhere" — build-vs-buy candidates + known anti-patterns. |
| `discovery.openQuestions[]` | existing shape; `status: "open"`, `owner: "pm"`, `source: "agent_draft"` | All drafted questions start as drafts — PM confirms in the UI |
| `discovery.research.summary` | `stringFieldEnvelope` (already added in S3A.2) | Synthesis of the above — this is what the Initiative Modal's Discovery tab renders |
| `discovery.iteration` | `number` (monotonic, server-computed) | Incremented on every successful run |
| `discovery.lastRerunAt` | ISO-8601 | Set on every successful run |

**Does NOT write:** `brief.*` (frozen by S3A.1), `spec.*` (`/agent-prd` owns), `design.*`, `release.*`.

---

### Cadence (resolved 2026-04-22)

**Mode A — Headless. Three triggers:**

1. **Kickoff on `idea → discovery` lane move** — the S3A.3 flow invokes Moneypenny once; iteration `1`.
2. **Manual "Re-run discovery"** from the Initiative Modal's Discovery tab (staleness rule in schema §7: any `brief.*.updatedAt` newer than `discovery.lastRerunAt` offers the re-run). Incremental iteration; previous `discovery.researchNotes` with `source: user` or `reviewedBy != null` are preserved; only `agent_draft` fields are overwritten.
3. **Weekly sweep (Mondays)** — scheduled pass across **all cards in the `discovery` column**, consuming Felix's Friday Signal (3 days old). Refreshes competitor snapshots, pulls new signals, surfaces any new open questions as drafts. Does **not** touch user-reviewed fields. Designed to **accumulate context** over time — every week the discovery tab has more signal than the week before.

**Mode B — Interactive "deepen".** PM-initiated from the Discovery tab. Chat-style partner session seeded from the current `discovery.*` state; Moneypenny asks 2–3 targeted pressure-test questions; refined fields written with **`source: "user_via_agent"`** (new envelope flavour — see schema §3 delta) and `reviewedBy: <pm>`. Runs against a separate per-session budget ($0.50) so it does not pressure the weekly sweep ceiling. No `initiative_jobs` row — writes via the atomic card-state update path; emits a `skill_run` event with `payload.mode: "deepen"`. See [`plans/Research/moneypenny-strategy.md` § "Anti-friction — two entry modes"](../../Research/moneypenny-strategy.md#anti-friction--two-entry-modes-one-skill).

**Scheduler for the weekly sweep:** **Resolved** — the companion `/weekly-discovery-sweep-custom` chat command iterates every `discovery`-column card and invokes Moneypenny headless per card. Optional cron hook via Dex's existing cadence scripts. **No server-side scheduler** in `pdlc-ui`.

---

### Companion skill: market research feeder

The weekly sweep needs fresh market data to re-score against. **`/moneypenny-custom` does not fetch it directly** — it consumes what the existing intel stack produces:

- `/weekly-exec-intel` + `/intelligence-scanning` already maintain `Market_intelligence/` outputs (see the Dex skills index).
- A thin companion script or skill **TBC 2026-04-22** can extend URL / competitor lists by segment (see Deep-dive Q2). The goal: keep the research skill a **consumer** of the vault, not a web scraper bolted onto `pdlc-ui`.

---

### Deep-dive — RESOLVED 2026-04-22 (pm) with M

Q1–Q10 closed in Plan mode with M. These are the decisions Build implements against. See [`plans/Research/moneypenny-strategy.md`](../../Research/moneypenny-strategy.md) for the full operating doc.

**Q1 — Research taxonomy.** ✅ **Six categories** (one added): (a) competitor positioning, (b) customer evidence quotes, (c) market signal alignment, (d) strategic-fit score against ICP, (e) open questions for the PM, **(f) solution patterns** — how this class of problem has been solved elsewhere (build-vs-buy candidates + known anti-patterns). New field `discovery.solutionPatterns[]` with shape `{ pattern, exampleVendors[], applicabilityToWT, sourceRef }` added to `schema-initiative-v0.md §4.3` same-PR per R16.

**Q2 — Source list storage.** ✅ **Shared YAML** seeded by ICP segment (FMCG / Mining / Auto & Industrial) at `System/discovery-sources.yaml`. Initiatives can append, not override. Revisit if initiatives diverge wildly after the first two weekly sweeps.

**Q3 — Confidence scoring.** ✅ **Locked:** `high` = ≥2 independent citations agree (different `sourceRef` origins, not two sections of the same PDF); `med` = exactly one citation (or multiple from the same source); `low` = inference without direct citation. Moneypenny never writes `confidence: "high"` without matching `sourceRef`s. Unit-tested against golden fixtures.

**Q4 — ICP artefact.** ✅ **Already shipped** — [`System/icp.md`](../../../System/icp.md) v1 (2026-04-22) — three segments (FMCG manufacturing, Mining & minerals, Auto & industrial) + cross-segment disqualifiers + near-neighbour competitor filter. Moneypenny reads the `Version` line on each run; version change invalidates segment-caches and re-scores strategic fit on the next weekly sweep.

**Q5 — LLM wiring.** ✅ **Provider: Anthropic Claude Sonnet** via server-side API key in `pdlc-ui` env (no browser exposure, no client-side keys). **Cost ceilings (v1, tune after first sweep):** kickoff $0.30/card; weekly sweep $5.00 total (10–15 cards at $0.30 with headroom); interactive "deepen" session $0.50/card/session (budget metered separately from sweep). Breach → job status `failed` with `error: "cost_ceiling_breached"`, no partial write. `cost_usd` emitted on every `skill_run.payload`.

**Q6 — Staleness + diffing.** ✅ **Confirmed.** Weekly re-run overwrites `agent_draft` freely; never `user` / `reviewedBy != null`. When new evidence contradicts a reviewed field, append a draft `openQuestion`: *"Competitor X has changed positioning since your <date> review — revisit?"* PM decides whether to revisit.

**Q7 — Observability.** ✅ **Confirmed + extended.** One `skill_run` event per card per run with `payload: { skill, iteration, cost_usd?, categoriesWritten?, contradictionsFlagged?, mode? }` (optional fields added to schema §6). One weekly Slice log roll-up line in `04-Projects/PDLC_Orchestration_UI.md`:
> *YYYY-MM-DD (Mon) — Weekly discovery sweep: N cards refreshed, M contradictions flagged, total cost $X.XX.*

**Q8 — Partial failure.** ✅ **Confirmed:** commit partial + emit draft `openQuestion` noting the gap. Job status introduces a new value **`succeeded_with_warnings`** — coordinate same-PR with S3A.3's `initiative_jobs.status` CHECK constraint. E.g. *"Customer-evidence step failed on run <id>; competitor + signal sections succeeded."*

**Q9 — Scope boundary with `/agent-prd` (now Bond PRD `/bond-prd-custom`, TBD).** ✅ **Locked.** At `spec_ready`, the PRD author reads: `brief.*` (frozen), `discovery.researchNotes`, `discovery.customerEvidence[]`, `discovery.solutionPatterns[]` *(new)*, and `discovery.openQuestions[]` where `status: "resolved"` (open questions block spec readiness). Ignores `discovery.competitorSnapshot` (reference-only) and `discovery.research.summary` (human narrative). Contract row updated same-PR in `schema-initiative-v0.md §8` and annotated "Bond PRD supersedes `/agent-prd`" in personal-Dex mode. Until `/bond-prd-custom` is authored, `/agent-prd` remains the compatibility shim against the same field-level contract.

**Q10 — Re-run on brief edit.** ✅ **Confirmed.** No auto-re-fire. Staleness rule fires (any `brief.*.updatedAt > discovery.lastRerunAt`) → Initiative Modal's Discovery tab offers "Re-run discovery" button. PM clicks to invoke Mode A manual re-run.

---

### Felix integration (resolved 2026-04-22)

Moneypenny is **downstream of Felix**, not parallel. Felix produces the weekly corpus Moneypenny reads:

- `06-Resources/Market_intelligence/synthesis/weekly/<date>_friday_signal.md` — primary synthesis input
- `06-Resources/Competitors/profiles/*.md` — weekly-refreshed by Felix
- `06-Resources/Market_and_deal_signals.md` — Phase 1 signal log

**Stale-Felix fallback:** if `synthesis/weekly/<latest>.md` mtime >7 days, Moneypenny proceeds with stale artefacts, prepends a one-line warning to `discovery.research.summary`, and drafts an `openQuestion` asking M to run `/felix-custom`. **Does not** fall back to raw `ingest/` scraping. Felix owns fetching.

See [`plans/Research/moneypenny-strategy.md` § "Handoff contracts"](../../Research/moneypenny-strategy.md#handoff-contracts) for the full contract.

---

### Deliverables (post-deep-dive)

**Docs (plan-mode pass — this PR):**
- **Moneypenny operating doc** [`plans/Research/moneypenny-strategy.md`](../../Research/moneypenny-strategy.md) *(formerly `bond-strategy.md`)* — persona, handoff contracts, cadence, cost ceilings, failure semantics.
- **Moneypenny SKILL.md** `.claude/skills/moneypenny-custom/SKILL.md` *(formerly `.claude/skills/pdlc-discovery-research-custom/SKILL.md`)* — I/O contract mirroring `schema-initiative-v0 §8`; six-phase runbook; Mode A + Mode B entrypoints; composition with Felix + `/customer-intel` + `/intelligence-scanning` + `/meeting-prep`.
- **Weekly sweep wrapper** `.claude/skills/weekly-discovery-sweep-custom/SKILL.md` — iterates every `discovery`-column card and invokes Moneypenny headless.
- **Discovery source list** `System/discovery-sources.yaml` — ICP-segment-keyed URLs + competitor handles + search queries seeded from `System/icp.md` v1.
- **Schema doc updates** — `discovery.solutionPatterns[]` (§4.3), `source: "user_via_agent"` (§3), `skill_run.payload` optional fields (§6), `/agent-prd` I/O row (§8) + "Bond PRD supersedes `/agent-prd`" annotation.
- **Skill-agent-map update** — Stage→skill row for `discovery` lane; Custom skills table entry for Moneypenny + weekly sweep; engineering-gate row renamed to Gatekeeper; Future-skills block for Bond PRD.
- ~~**ICP artefact** `System/icp.md`~~ — **shipped 2026-04-22 ✅** (v1, three segments). No longer a deliverable of S3B; read-only dependency.

**Build pass (separate PR on `feat/s3b-discovery-research`):**
- **Server-side provider implementation** replacing S3A.3's stub behind `DiscoveryResearchProvider`. Composition of vault reads; LLM call via server-side Anthropic Claude Sonnet key; envelope outputs; `succeeded_with_warnings` job status.
- **Interactive "deepen" entrypoint** — chat-triggered path on the same skill; writes with `source: "user_via_agent"`; $0.50/session budget.
- **Initiative Modal Discovery tab copy** — no shape change from S3A.3; copy reflects real research vs stub.
- **Tests** — unit-test the provider against golden fixtures (brief shape + mocked vault reads → expected `discovery.*` diff); Playwright smoke that a full kickoff → tick → terminal produces a non-empty `research.summary` on a card with a seeded brief.

---

### DoD (outline)

- [x] Deep-dive questions Q1–Q10 closed in Plan mode before Build. *(2026-04-22 pm — inline above.)*
- [x] `System/icp.md` exists and is read by the provider to score strategic fit. *(v1 shipped 2026-04-22.)*
- [ ] `DiscoveryResearchProvider` swap: S3A.3 stub replaced by the real provider with **zero** changes to the route handler, `initiative_jobs` table, polling client, or Initiative Modal's Discovery tab.
- [ ] Kickoff writes `discovery.researchNotes` + `discovery.competitorSnapshot` + `discovery.customerEvidence[]` + `discovery.solutionPatterns[]` *(new)* + `discovery.openQuestions[]` + `discovery.research.summary` + `discovery.iteration` + `discovery.lastRerunAt`.
- [ ] Interactive "deepen" (Mode B) entrypoint writes refined fields with `source: "user_via_agent"` and `reviewedBy: <pm>`; emits `skill_run` with `payload.mode: "deepen"`; respects $0.50/session budget.
- [ ] Weekly sweep command (`/weekly-discovery-sweep-custom`) refreshes all `discovery`-column cards; preserves `user` / `reviewedBy != null` fields; appends an `openQuestion` draft when new evidence contradicts a PM-reviewed field.
- [ ] `/moneypenny-custom` row in `schema-initiative-v0 §8` matches provider behaviour; `skill_run` known-ids list includes the id (and no longer includes the superseded `pdlc-discovery-research-custom` id).
- [ ] LLM calls are server-side only; $0.30/kickoff + $5/sweep + $0.50/deepen ceilings enforced; `cost_usd` emitted on every `skill_run.payload`.
- [ ] `initiative_jobs.status` CHECK constraint extended to include `succeeded_with_warnings` (coordinated with S3A.3 migration).
- [ ] Playwright smoke: seed a card with brief → kickoff → tick-to-terminal → Initiative Modal's Discovery tab shows a non-empty synthesis.

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
- **S3A.2 merged** (Initiative Modal + tabs shell) **and S3A.3 merged** (`DiscoveryResearchProvider` interface, `initiative_jobs` table, kickoff endpoint, Initiative Modal's Discovery tab progress surface, staleness rule plumbing).
- **`System/icp.md` exists** (Shaun, 2026-04-22) — blocker for the weekly sweep.
- Existing Dex skills: `/customer-intel`, `/intelligence-scanning`, `/meeting-prep`, `/weekly-exec-intel` — consumed as-is.

---

Post-merge: Slice log line + tick S3B Progress in plan.md. Update `schema-initiative-v0 §8` and the companion `skill_run` known-ids list if any drift from the pre-staged entries.
