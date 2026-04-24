# Felix — research operating strategy

**Codename:** **Felix Leiter** — the "head of research" agent for Wyzetalk product.
**Role:** **Outside-in awareness agent for the WT product team.** Brings packaged market, competitive, and industry signal to **M (the CPO, Shaun)** on a weekly cadence, written in **advisory tone** (safe for CEO escalation to board), and on-demand to **`/moneypenny-custom`** *(formerly `/pdlc-discovery-research-custom`; S3B)* when initiative cards move `idea → discovery`.

> **Rename note (2026-04-24):** Felix's downstream per-initiative consumer was previously called "Bond" (`/pdlc-discovery-research-custom`). It is now **Moneypenny** (`/moneypenny-custom`) — the 007 "Bond" codename migrated to a deferred PRD author (`/bond-prd-custom`, TBD). Behaviour / contract identical; the handoff direction is unchanged. See [`plans/Research/moneypenny-strategy.md`](./moneypenny-strategy.md).

**Why a 007 name:** when Felix was named, the vault already had **Moneypenny** (at that time the PR gatekeeper — *renamed to Gatekeeper on 2026-04-24, then **removed**; the Moneypenny name migrated to the per-initiative discovery-intel role / `/moneypenny-custom`*). Felix Leiter is the canonical CIA / external-asset character — lives outside the walls, pays in intel, never overshadows M. Naming Felix as **a persona that owns a stack of skills** (rather than a single `/skill` command) is consistent with how **persona-scoped** custom skills are invoked.

**Status:** v0.3 — consolidated to **single-command agent** (`/felix-custom`) 2026-04-23. Supersedes the four sub-skills (weekly-pulse / competitor-watch / industry-pulse / friday-brief).

## Posture (must read before Felix runs)

- **Purpose:** surface **outside-in awareness** of what the market is doing — competitors, industries, AI/software trends — so WT product decisions are grounded in signal, not vibe. **Not** internal-risk analysis.
- **Audience of the Friday output:** **WT Steerco**. The CEO decides on board escalation. This is the editorial bar: every line must be safe-for-board in tone.
- **Voice:** **advisory** — *what we see / what it means / what we propose.* Never risk-alarm. Never individual-account risk framing.
- **Meta-principle:** Felix advising the CPO is the prototype of what **WT-the-product** aspires to offer its clients (see `System/icp.md` WT thesis — advisor-platform evolution). If the brief ever stops feeling like advisor-voice, the skill is broken.
- **Hard exclusion — client-activity data.** The book-of-business snapshot (`Wyzetalk_Clients/index.md`) is CPO-internal and **never** appears on the Friday Signal, dashboards, or steerco material. Reasoning: the legacy extract's known data-quality limits (6-month aggregation from Sept 2025, WT legacy platform edge-cases) mean the numbers are directional, not defensible as operational KPIs — and the current organisational climate means surfacing them creates more heat than light. `/felix-client-signals-custom` exists, runs on-demand, and is explicitly CPO-internal.

---

## How this stack answers planning questions (market / competitors / industry / software)

| Planning need | Where it is satisfied |
|---|---|
| **Market movements** (newsletters, podcasts, macro HR-tech narrative) | `/felix-custom` Step 1 (market discovery — Mon–Fri rotation, signal log) + Step 4 brief "Worth a click" / sector band. |
| **Competitor analysis** | `/felix-custom` Step 2 — T0 JEM platform-bundle scan + T1 weekly diff + T2 on-surface. Writes `Competitors/profiles/*.md`. |
| **Industry news & durable context** | `/felix-custom` Step 3 (`--quick`: rotating sector + 3 AI sub-lenses weekly; `--deep`: PDF re-read monthly) + `06-Resources/Research/Industry_reports/`. |
| **Software / AI shifts** | Same Step 3 Pass B (frontline-AI products, worker-data regulation, union/worker AI sentiment) + Step 2 competitor product moves. |
| **Context for solution development** | Single artefact: **`synthesis/weekly/<date>_friday_signal.md`** — advisory "see / mean / propose" tied to ICP + WT thesis; **Moneypenny** (`/moneypenny-custom`) and the Monday **`/weekly-discovery-sweep-custom`** consume it for discovery cards. |

**Remaining frictions (honest):** (1) **Manifest vs guide drift** — if `intel_feeds.json` / `sources_manifest.yaml` diverge from `Source_Guide_v2_1.md`, the *list you authored* and what actually fetches are not the same; reconcile on the quarterly source audit. (2) **Legacy skills still exist** — `/weekly-exec-intel` and `/intelligence-scanning` remain in the vault for on-demand / daily-cadence use; do not run them in the same week as `/felix-custom` (overlap the same `ingest/`).

**Resolved by v0.3 consolidation:** doc drift across four sub-skill files, duplicate human runs across `/felix-weekly-pulse-custom` + sub-skills, and the "refresh ingest first, then run Felix" two-step (ingest is now Step 0 of the single command).

---

## Anti-friction — **one command, one run, one artefact**

**Default weekly path:**

```
/felix-custom
```

That's the whole CPO-facing interaction. `/felix-custom` runs ingest fetch itself (Step 0 — has a 24h freshness short-circuit, so same-day re-runs are cheap), then walks market discovery → competitor watch → industry pulse → Friday Signal write in a single pass. Flags: `--deep` (monthly PDF re-read), `--skip-ingest` (debug), `--dry-run` (compose to chat, no file write).

**Do not also run** `/weekly-exec-intel` or `/intelligence-scanning` the same week — they re-read the same `ingest/` for overlapping purpose. One run of record per week.

**Optional:** `/intelligence-scanning` on a scheduled daily cadence if you want standalone daily triage — it is **not** a prerequisite for the Friday Signal.

---

## TL;DR — the architecture

```
LAYER 1 — CONTINUOUS INGEST  (scripts; invoked by /felix-custom Step 0, not cron-dependent)
   └─ scripts: fetch_intel_rss.py, run-transcript-queue.sh
      sources: Market_intelligence/intel_feeds.json + Source_Guide_v2_1.md (26 sources)
      writes:  06-Resources/Market_intelligence/ingest/{newsletters,youtube}/<slug>/

LAYER 2 — WEEKLY SYNTHESIS  (single command, Friday, advisory tone, steerco audience)
   /felix-custom  ←  THE ENTRY POINT
        Step 0. Ingest fetch (RSS + YouTube queue; 24h freshness short-circuit)
        Step 1. Market discovery        (Mon–Fri rotation → Phase 1 signal log)
        Step 2. Competitor watch        (T0 JEM + T1 incumbents + T2 on-surface)
        Step 3. Industry pulse          (sector rotation + 3 AI sub-lenses; --deep monthly)
        Step 4. Compose Friday Signal   (see / mean / propose)
        Step 5. Chat summary + Slice log append
   writes:
        Market_intelligence/synthesis/weekly/<date>_friday_signal.md   (the brief)
        Market_and_deal_signals.md          (Phase 1 signal-log rows)
        Market_and_competitive_signals.md   (proposes EV-* candidates; CPO confirms)
        Competitors/profiles/*.md           (last_reviewed + watch-signal diffs)
        Competitors/COMPETITOR_INDEX.md     (weekly pass refresh)

   NOT part of /felix-custom (stays separate):
        /felix-client-signals-custom  —  on-demand, CPO-internal only. Writes
        Wyzetalk_Clients/index.md for ICP-calibration context. Never surfaces
        to the brief or any dashboard.

LAYER 3 — PER-INITIATIVE DISCOVERY  (S3B, on idea→discovery card move)
   /moneypenny-custom  (formerly /pdlc-discovery-research-custom — 2026-04-24 rename)
        reads: brief.* + gate.* + Felix's Layer 2 output + System/icp.md
        writes: discovery.* on the initiative card
```

The point: **`/felix-custom` does the company-wide weekly intel pass in one command; S3B does the per-card pass**. Felix's Friday Signal is the highest-signal vault artefact S3B reads every Monday.

---

## Inputs Felix owns (the four corners)

| Source | Where it lives | Refresh cadence | Felix's job |
|---|---|---|---|
| **Industry research reports** (sector PDFs — Mining, Energy, Retail, Manufacturing, Healthcare, Transport, Frontline-global) | `06-Resources/Research/Industry_reports/<sector>/` | **Quarterly** (manual drop) | Re-read on each sector deal-cycle; produce **monthly industry pulse** + extract durable truths into `04-Projects/Product_Strategy/Industry_Truths.md` (existing skill `/industry-truths` writes here) |
| **Market signal sources** (26 newsletters/podcasts/YouTube — Josh Bersin, HR Tech Feed, Lenny, etc.) | `06-Resources/Market_intelligence/ingest/` (auto-fetched) | **Daily/weekly** (cron) | Friday: scan new ingest, surface the 5–10 items worth an EV row, promote material ones to `Market_and_competitive_signals.md` |
| **Competitor list** — tiered per `System/icp.md` | `06-Resources/Competitors/profiles/<Name>.md` + `_imports/Competitor_2024_baseline.xlsx` | **Weekly diff (T0/T1), quarterly rotation (T2)** | **T0 — JEM HR (primary platform threat):** weekly deep scan for **bundle-extension moves** (device / telco / EWA / payslip / HRIS integration). T0 is the strategic anchor of the Friday Signal. **T1 — Staffbase, Workvivo, Beekeeper, Speakap, Blink, Flip:** weekly website / LinkedIn / press diff. **T2 — Yoobic + 10 others (Appspace, Firstup, Humand, LumApps, Poppulo, Unily, Sentiv, Teamwire, PayMeNow, Oneteam):** monitor-on-surface only; include in the Friday Signal only if a move materially crosses WT's ICP segments. Yoobic is explicitly **not** a recurring Friday entry (adjacent-market retail task-mgmt). Implemented in `/felix-custom` Step 2. |
| **Wyzetalk client list** (50 accounts) — **CPO-INTERNAL, on-demand only** | `05-Areas/Companies/Wyzetalk_Clients/` | **On snapshot drop** (not a weekly loop) | `/felix-client-signals-custom` (separate skill, not part of `/felix-custom`) produces **ICP calibration** (segment hit-rate) and **discovery evidence** (day-2 engagement-gap pattern as product-shape signal). **Never** produces churn-risk, at-risk-account lists, or Yoobic-vulnerable flags. **Never** surfaces on the Friday Signal, dashboards, or steerco material. Every output carries the 6-month-aggregation data-quality caveat. |

---

## Cadence

### Friday (45–60 min, one command)

```
/felix-custom
```

That's it. One invocation runs ingest + discovery + competitor watch + industry pulse + brief write, and returns a 3-line chat summary. Output: `06-Resources/Market_intelligence/synthesis/weekly/<date>_friday_signal.md` — the advisory Friday Signal. Steerco-facing. CEO decides on board escalation.

### Monday morning (10 min, Shaun-led)

- Read the Friday brief
- Promote Felix-proposed EV candidates → `EV-*` rows in `Market_and_competitive_signals.md`
- Trigger any `idea → discovery` moves on the board (S3B pulls in the fresh brief automatically)

### Monthly (add ~30 min, first Friday)

```
/felix-custom --deep
```

Re-reads sector PDFs (instead of just recent ingest digest); writes `synthesis/monthly/<YYYY-MM>_industry_pulse.md`; proposes updates to `Industry_Truths.md` if time-horizoned beliefs have shifted.

### Quarterly (2h, Shaun-led, Felix supports)

- Competitor profile **deep refresh** — visit each of the top 8 competitors' sites; refresh the `Vs Wyzetalk` block; archive previous version
- Source list audit — check each of the 26 sources is still high-signal; retire dead ones; add new; reconcile `intel_feeds.json` + `sources_manifest.yaml` vs `Source_Guide_v2_1.md`

---

## Skills map

### Felix skills (just two)

| Skill | One-liner | Reads | Writes |
|---|---|---|---|
| **`/felix-custom`** | **The agent.** Single command, runs ingest + market discovery + competitor watch (T0 JEM / T1 / T2) + industry pulse (sector + 3 AI sub-lenses) + Friday Signal brief write. Three-movement advisory structure (see / mean / propose), steerco-safe, safe-for-board. | `ingest/`, `Market_and_deal_signals.md`, `Competitors/profiles/*`, `_imports/Competitor_2024_baseline.xlsx`, `Research/Industry_reports/*`, `System/icp.md` | `synthesis/weekly/<date>_friday_signal.md`, `Market_and_deal_signals.md` (Phase 1 rows), `Competitors/profiles/*.md` (last_reviewed + watch signals), `Competitors/COMPETITOR_INDEX.md`, `synthesis/monthly/*` (on `--deep`). Proposes `EV-*` candidates for CPO confirm. |
| `/felix-client-signals-custom` | **Separate — CPO-internal, on-demand only.** Translates WT client activity into ICP calibration + discovery evidence. Never produces risk flags, churn scoring, Yoobic-vulnerable lists. Never surfaces on any brief or dashboard. Fires on new snapshot drop or CPO ask — **not** part of `/felix-custom`. | `05-Areas/Companies/Wyzetalk_Clients/_data/Clients_<date>.xlsx`, prior snapshot, `System/icp.md` | `05-Areas/Companies/Wyzetalk_Clients/index.md` only (`visibility: cpo-internal`, `dashboard_surface: false`) |

### Adjacent skills (Felix does not own; documented so you know not to double-run)

| Skill | Relationship |
|---|---|
| `/weekly-market-discovery` | Standalone market-rotation skill. Its logic is **inlined** inside `/felix-custom` Step 1 — do not invoke separately the same week. |
| `/intelligence-scanning` | Daily ingest → daily brief. Optional standalone daily habit. **Not required** by `/felix-custom`; avoid running the same week as Felix. |
| `/weekly-exec-intel` | Legacy generic synthesis → `*_weekly_exec_brief.md`. Superseded by `/felix-custom`; kept for on-demand use only. Do not run the same week as Felix. |
| `/industry-truths` | Downstream consumer: `/felix-custom --deep` proposes updates; this skill is what actually writes `Industry_Truths.md` when Shaun confirms. |
| `/customer-intel` | Generic skill. `/felix-client-signals-custom` is the Wyzetalk-specific flavour. |
| `/scrape` (Scrapling MCP) | Invoked inline by `/felix-custom` Step 2 for competitor site diffs; also used by S3B. |
| `/moneypenny-custom` (S3B — *formerly `/pdlc-discovery-research-custom`*; 2026-04-24 rename) | **Downstream consumer of `/felix-custom`'s weekly output.** Reads `synthesis/weekly/*` + `Competitors/profiles/*` + (CPO-internal) `Wyzetalk_Clients/*` per card. |

---

## How this ties to the PDLC sprint plan (S3B)

S3B's archived seed `plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md` is the per-initiative research skill spec. Today its **Inputs** section says it reads:

- `Market_intelligence/synthesis/daily/*`
- `Market_and_deal_signals.md`
- `Competitors/*` (if maintained)
- `People/External/*`
- `00-Inbox/Meetings/`
- `System/icp.md` **v1 ✅** (2026-04-22) — three segments (FMCG manufacturing; Mining & minerals; Auto & industrial ops) + cross-segment disqualifiers + near-neighbour competitor filter. **Felix reads the `Version` line on each run; when it changes, segment-caches invalidate and the next weekly pass re-tags all evidence.**

**Felix makes those inputs real.** Concretely:

1. **`Competitors/*` (if maintained)** → `/felix-custom` Step 2 maintains it. Without Felix, the "if maintained" caveat is doing all the work and S3B reads nothing useful.
2. **`Market_intelligence/synthesis/weekly/*`** → produced by Felix every Friday. `/felix-custom` Step 4 writes `<date>_friday_signal.md`.
3. **`05-Areas/Companies/Wyzetalk_Clients/*`** — S3B **may** read `index.md` as ICP-calibration context for per-card segment fit, but **must respect the frontmatter `visibility: cpo-internal` / `dashboard_surface: false`** — the content informs reasoning but never propagates into `discovery.*` writes on cards in a way that surfaces account names or numbers. Discovery notes reference it as "first-party activity data supports priority" style language, no specifics.
4. **`System/icp.md`** → **v1 authored 2026-04-22 ✅** (three segments + WT thesis advisor-platform extension + T0/T1/T2 competitor tiering). Felix reads the `Version` line on each run; when it changes, segment-caches invalidate and the next weekly pass re-tags all evidence. ICP v2 calibration work is a CPO-initiated pass, not a Felix-scheduled one.

Updates to S3B-side artefacts (filed in patches alongside this strategy):

- [`plans/PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md`](../PDLC_UI/seeds/_archived-2026-04-24/s3b-discovery-research.md) — Inputs + Companion-skill blocks name `/felix-custom` (single skill, single output).
- [`plans/PDLC_UI/sprint-backlog.md` § Sprint 3B](../PDLC_UI/sprint-backlog.md) — Dependencies reference `/felix-custom` as the single Felix pre-req.

---

## Open questions for Shaun (standing list)

1. **Industry reports refresh.** PDFs are dated 2021–2025 — do you want Felix to flag any older than **18 months** as stale candidates for replacement at the next quarterly refresh?
2. **Client list cadence.** Is the Clients xlsx a one-off snapshot (the `2026-04-22` file) or do you have a monthly/quarterly export? Name the source path so Felix's client-signals skill can ingest new drops without manual moves. (Remember: on-demand skill, not weekly — so cadence only matters for when you'd fire it.)
3. **Scrapling MCP on competitor watch.** Some competitor sites (Workvivo, LumApps) sit behind Cloudflare. `/felix-custom` Step 2 defaults to `scrapling_stealthy_fetch` for those — confirm this is fine on weekly cadence.
4. **`pdlc-brief-prefill-custom` (S3A.2).** S3A.2 ships a brief-prefill skill. Default: keep it `pdlc-*`-style — it's a builder-tool, not an intelligence asset. Confirm.
5. **Agent name.** Felix Leiter stands unless you want to swap to **Bill Tanner** (MI6 Chief of Staff, in-house-briefer framing — cleaner fit given the advisory-tone steerco focus). Post-consolidation, renaming is a sed across this doc + 2 SKILL.md files (`felix-custom`, `felix-client-signals-custom`) + 2 sprint refs.

**Resolved 2026-04-22 pm (for audit trail):**

- Client-activity data posture: **CPO-internal, never dashboard / steerco** — client-signals skill removed from weekly orchestration.
- Competitor tiering: JEM HR T0 (platform threat), Yoobic T2 (adjacent-market, monitor-only) — encoded in `System/icp.md` and `/felix-custom` Step 2.
- AI scan structure: three sub-lenses (frontline-AI product / worker-data regulation / union-AI sentiment) — encoded in `/felix-custom` Step 3 Pass B.
- Friday brief editorial posture: three-movement (what we see / what it means / what we propose), advisory tone, steerco audience, safe-for-board — encoded in `/felix-custom` Step 4.
- WT strategic counter-thesis vs. JEM platform play: **advisor platform** (depth of engagement primitives + LMS + advisory intelligence) — added to `System/icp.md` WT thesis.

**Resolved 2026-04-23 (for audit trail):**

- Felix collapsed from 4 weekly sub-skills + 1 on-demand skill → **1 weekly command + 1 on-demand skill**. `/felix-weekly-pulse-custom`, `/felix-competitor-watch-custom`, `/felix-industry-pulse-custom`, `/felix-friday-brief-custom` deleted; logic inlined into `/felix-custom` with sections by step.
- Ingest fetch moved **inside** the agent (Step 0) with 24h freshness short-circuit — the CPO no longer needs to refresh ingest before running Felix. Cron dependency removed from the default path.

---

## Files filed in this bootstrap (2026-04-22)

| What | Where | Why |
|---|---|---|
| `market-signals-guide-v2_1.docx` (original) | `06-Resources/Market_intelligence/_source/` | Source of truth, archived |
| Markdown of v2.1 | `06-Resources/Market_intelligence/Source_Guide_v2_1.md` | Skill-readable canonical |
| Industry research PDFs (45 files, 7 sectors + 4 standalone checklists) | `06-Resources/Research/Industry_reports/<sector>/` | Per-sector context for Felix's industry-pulse + S3B's per-card research |
| `Competitor 2024.xlsx` | `06-Resources/Competitors/_imports/Competitor_2024_baseline.xlsx` | Felix's competitor-watch baseline; feature-comparison data for ~12 competitors |
| `Clients list.xlsx` (50 accounts) | `05-Areas/Companies/Wyzetalk_Clients/_data/Clients_2026-04-22.xlsx` | Felix's client-signals input |
| Restored `06-Resources/Competitors/` from `07-Archives/Full_vault_snapshot_2026-04-16/` | `06-Resources/Competitors/` | Skills + EV register reference this folder; was missing |
| Restored `06-Resources/Market_intelligence/` skeleton (architecture, sources_manifest, intel_feeds) | `06-Resources/Market_intelligence/` | `/weekly-exec-intel` references this; was missing |

**Not restored from archive:** `06-Resources/Research/` (rebuilt fresh for industry reports), `06-Resources/Product_ideas/`, `06-Resources/Product_orchestration_playbook.md` — out of Felix's scope, left to a separate restoration call.

---

*Bootstrapped 2026-04-22 by Shaun (CPO) + Dex. Consolidated to single-command agent (`/felix-custom`) 2026-04-23.*
