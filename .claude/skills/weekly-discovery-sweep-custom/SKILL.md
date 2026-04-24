---
name: weekly-discovery-sweep-custom
description: Monday-morning wrapper that iterates every card in the PDLC discovery column and invokes Moneypenny (/moneypenny-custom) headless per card. Consumes Felix's Friday Signal. Respects $5 total sweep budget. Writes one Slice-log roll-up line to 04-Projects/PDLC_Orchestration_UI.md. Invoke manually on Mondays or via a Dex cadence cron hook.
---

# Weekly Discovery Sweep — Moneypenny's Monday column-wide pass

**Command:** `/weekly-discovery-sweep-custom`
**Role:** **Thin wrapper** around [`/moneypenny-custom`](../moneypenny-custom/SKILL.md) (Moneypenny — per-initiative intelligence debriefer). Runs Mode A headless across every card in `lifecycle === "discovery"` so the column stays fresh against Felix's latest Friday Signal + new meetings + new market signals.

**Rename note (2026-04-24):** the per-card skill invoked here was previously `/pdlc-discovery-research-custom` with a Bond codename. It is now `/moneypenny-custom`; the "Bond" codename migrated to the downstream PRD author (`/bond-prd-custom` — TBD).
**Cadence:** Mondays, after Felix's Friday pass (so the sweep reads 3-day-old synthesis — the intended freshness).
**Budget:** **$5.00 total across all cards** ($0.30/card headless ceiling; ~10–15 cards with retry headroom).
**Runtime:** ~3–5 min for a typical column; scales linearly with card count.

**Custom skill — protected from Dex updates** (`-custom` suffix).

---

## What this skill is (and is not)

**Is:**
- A cadence-driven iteration over `discovery`-column cards.
- A budget-guard around Moneypenny's per-card runs.
- A Slice-log roll-up so the sweep is observable.

**Is not:**
- A replacement for Moneypenny. All research logic lives in `/moneypenny-custom`. This skill invokes it.
- A scheduler. Runs manually (via this command) or via a Dex daily/weekly cadence script. `pdlc-ui` does not ship a server-side scheduler.
- A fetcher. Felix owns fetching. If Felix hasn't run this week, every per-card invocation degrades per Moneypenny's stale-Felix contract (warning note + draft `openQuestion`) — the sweep doesn't retry or fall back.

---

## When to run

**Primary:** Monday morning, after Felix's Friday pass has landed `06-Resources/Market_intelligence/synthesis/weekly/<date>_friday_signal.md`.

**Also:**
- After a `System/icp.md` version bump — invalidates segment-caches across the column so every card re-scores strategic fit.
- After a big meeting batch lands (e.g. a steerco recap or a multi-customer week) — surfaces new customer evidence across relevant cards.
- Ad-hoc when the PM wants a full refresh.

**Not to run:**
- During Felix's fetch window (Friday afternoon) — risks reading half-written synthesis.
- More than once per 24h — redundant; Moneypenny's per-card idempotency means the second run writes nearly identical drafts and burns budget.

---

## Process

### Phase 0 — Pre-flight (~5s)

1. Read the `pdlc-ui` initiative list (via the existing HTTP endpoint or direct SQLite read — details in the Build implementation). Filter to `lifecycle === "discovery"`.
2. Check Felix freshness: `stat 06-Resources/Market_intelligence/synthesis/weekly/<latest>_friday_signal.md`.
   - If missing or mtime >7d, **warn but proceed** — each per-card run will degrade per Moneypenny's stale-Felix contract.
3. Check [`System/icp.md`](../../../System/icp.md) `Version` line. If changed since last sweep (tracked in `04-Projects/PDLC_Orchestration_UI.md` Slice log), flag `icp_version_bumped: true` — cards will re-score strategic fit this pass.
4. Budget pre-check: confirm configured ceiling ($5 default) and per-card ceiling ($0.30 default).
5. If the card list is empty, skip to Terminal with a "no cards to sweep" note.

### Phase 1 — Per-card iteration

For each card, in `sortOrder` order (top-of-column first):

1. Invoke `/moneypenny-custom` headless (Mode A, manual re-run path — same entrypoint as the Initiative Modal's "Re-run discovery" button).
2. Capture the result:
   - Status: `succeeded` / `succeeded_with_warnings` / `failed`.
   - `cost_usd` (from the `skill_run.payload`).
   - `categoriesWritten[]`.
   - `contradictionsFlagged` count.
3. **Budget gate:** after each card, sum `cost_usd` across all cards so far. If the running total breaches the sweep ceiling ($5 default), **stop iterating** — remaining cards are logged as `skipped: "budget_exceeded"` and the Slice log notes it.
4. **Failure handling (per card):** a `failed` status on one card does **not** abort the sweep. Log it in the roll-up and continue. The PM sees the amber retry chip on that card in the UI (S3A.3 contract).
5. **Preservation contract (delegated to Moneypenny):** user-reviewed fields (`source: "user"` / `reviewedBy != null` / `source: "user_via_agent"`) are untouched; only `agent_draft` fields are overwritten. When new evidence contradicts a reviewed field, Moneypenny appends a draft `openQuestion` — this sweep does not mutate that logic.

### Phase 2 — Slice log roll-up

Append one line to `04-Projects/PDLC_Orchestration_UI.md` under the **Progress log** section:

```
- **2026-04-27 (Mon) — Weekly discovery sweep.** 12 cards refreshed, 3 contradictions flagged, 1 card failed (retry queued), total cost $3.42. Felix freshness: 3d. ICP version: v1 (unchanged).
```

Fields in the roll-up:

- Date + day-of-week.
- `<N> cards refreshed` — count where status ∈ `{succeeded, succeeded_with_warnings}`.
- `<M> contradictions flagged` — sum of `contradictionsFlagged` across cards.
- `<K> cards failed (retry queued)` — count where status = `failed`; omit if zero.
- `total cost $<X.XX>` — sum of `cost_usd`.
- `Felix freshness: <N>d` — age of the Friday Signal at sweep start.
- `ICP version: <version> (<changed|unchanged>)` — for audit.

If the sweep hit the budget ceiling:

```
- **2026-04-27 (Mon) — Weekly discovery sweep (BUDGET EXCEEDED).** 14 cards refreshed, 2 cards skipped (budget_exceeded), total cost $4.98 of $5.00 ceiling. Review ceiling if this recurs.
```

### Phase 3 — Present to the user

Print a one-screen summary to the chat:

```
Weekly discovery sweep complete.

Cards: 12 refreshed · 1 failed · 0 skipped
Contradictions flagged: 3 (see per-card openQuestions)
Cost: $3.42 / $5.00 budget
Felix freshness: 3d (fresh)
ICP version: v1 (unchanged)

Per-card detail:
  ✓ INIT-0042 — Shift-handover comms — $0.28 — 2 new competitor moves, 1 contradiction
  ✓ INIT-0051 — Safety nudge framework — $0.31 — customer evidence refreshed
  ⚠ INIT-0058 — Learning deployment — $0.29 — succeeded_with_warnings (customer-evidence phase skipped, no new meetings)
  ✗ INIT-0061 — Frontline broadcast — FAILED (LLM timeout; PM should click Re-run)
  ...

Slice log updated: 04-Projects/PDLC_Orchestration_UI.md
```

---

## Failure semantics (sweep-level)

| Scenario | Response |
|---|---|
| Zero cards in `discovery` column | Log "no cards to sweep"; exit with cost $0. |
| `System/icp.md` missing | Hard-fail the whole sweep (same as Moneypenny's per-card hard-fail — no point iterating). |
| Felix artefacts stale (>7d) | Proceed with warning; each per-card run degrades per Moneypenny's contract. |
| Individual card `failed` | Log it; continue with remaining cards. Don't abort. |
| Budget ceiling breached mid-sweep | Stop iterating; mark remaining cards `skipped: "budget_exceeded"`; write the adjusted Slice log; flag the breach in the summary. |
| PDLC-UI unreachable | Hard-fail; no partial Slice log write. |

---

## Cost accounting

- **Per-card ceiling:** $0.30 (Moneypenny's Mode A ceiling — enforced inside `/moneypenny-custom`, not re-enforced here).
- **Sweep ceiling:** $5.00 (this skill's responsibility to enforce by stopping iteration).
- **Tuning:** after the first 2–3 sweeps, review real cost/card and adjust ceilings in this skill's configuration. Don't silently burn budget.

---

## Configuration

The sweep ceiling and per-card ceiling live as named constants at the top of the skill's implementation (Build phase). For now, hard-coded:

```
SWEEP_COST_CEILING_USD = 5.00
PER_CARD_COST_CEILING_USD = 0.30   # enforced by Moneypenny; duplicated here for transparency
FELIX_STALE_THRESHOLD_DAYS = 7
```

---

## Explicit non-goals

- **No scheduling.** This skill does not install a cron. It is invoked manually by chat or by a Dex cadence script that already exists.
- **No LLM calls of its own.** All Moneypenny invocations happen inside `/moneypenny-custom`.
- **No UI surface.** The sweep runs from chat; results are written to `04-Projects/PDLC_Orchestration_UI.md` and per-card `discovery.*`.
- **No parallelism.** Cards run sequentially to make budget-tracking deterministic and avoid provider-side rate limits. If sequential runtime becomes a problem, revisit.
- **No retry of failed cards.** PM clicks "Re-run discovery" on the card. The sweep does not auto-retry.

---

## Related

- [`/moneypenny-custom`](../moneypenny-custom/SKILL.md) — Moneypenny, the per-card agent this sweep invokes.
- [`/felix-custom`](../felix-custom/SKILL.md) — upstream producer; sweep reads Felix's Friday Signal via Moneypenny.
- [`plans/Research/moneypenny-strategy.md`](../../../plans/Research/moneypenny-strategy.md) — Moneypenny operating doc; § "Cadence" covers the sweep from the agent-system view.
- [`plans/PDLC_UI/seeds/s3b-discovery-research.md`](../../../plans/PDLC_UI/seeds/s3b-discovery-research.md) — S3B seed *(name historical)*; § "Cadence" locks the Monday trigger.
- [`plans/PDLC_UI/skill-agent-map.md`](../../../plans/PDLC_UI/skill-agent-map.md) — Stage→skill table.
- `04-Projects/PDLC_Orchestration_UI.md` — Slice log target.

---

*Custom skill created 2026-04-22 — companion to [`/moneypenny-custom`](../moneypenny-custom/SKILL.md). Renamed invocation path 2026-04-24 (was `/pdlc-discovery-research-custom`). Protected from `/dex-update` by the `-custom` suffix.*
