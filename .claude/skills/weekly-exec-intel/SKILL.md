---
name: weekly-exec-intel
description: Weekly market & competitive intel for Product and Executive — automated ingest fetch, then a stakeholder-ready weekly brief (invoke anytime; pair with run-weekly-intel-fetch.sh for automation).
---

# Weekly exec & product intel

**Audience:** You are preparing the **weekly narrative** for **Product** and **Executive** (and optionally GTM). This is broader than the daily signal brief: fewer items, sharper “so what,” explicit asks.

**When:** End of week (e.g. Friday) or start of week (e.g. Monday) — or whenever you invoke **`/weekly-exec-intel`**.

---

## Part A — Automated ingest (scripts)

Run **before** synthesis so the vault has fresh RSS (and optionally YouTube) under `ingest/`.

**One command from vault root:**

```bash
bash .scripts/market-intelligence/run-weekly-intel-fetch.sh
```

This uses the market-intelligence venv and runs **`fetch_intel_rss.py`** (no-op if `intel_feeds.json` has empty `feeds`). Pass-through flags work, e.g.:

```bash
bash .scripts/market-intelligence/run-weekly-intel-fetch.sh --since-days 10 --verbose
```

**YouTube transcripts** (optional same week): if you use the queue, run `bash .scripts/market-intelligence/run-transcript-queue.sh` when `video-queue.tsv` has lines (see `.scripts/market-intelligence/README.md`).

**Schedule it:** See **[WEEKLY_AUTOMATION.md](../../../.scripts/market-intelligence/WEEKLY_AUTOMATION.md)** (cron / launchd) so Part A runs without remembering.

---

## Part B — Synthesis (this skill)

1. **Confirm ingest window:** List new or recent files under `06-Resources/Market_intelligence/ingest/youtube/<slug>/` and `.../ingest/newsletters/<slug>/` from the last **7 days** (or the week you’re reporting). Use [ingest/README.md](../../../06-Resources/Market_intelligence/ingest/README.md) for slug ↔ theme context.

2. **Read recent daily briefs:** Skim `06-Resources/Market_intelligence/synthesis/daily/*_signal_brief.md` for the same window — avoid duplicating; **elevate** patterns that matter for roadmap and narrative.

3. **Cross-check external log:** Scan **Phase 1 — Signal log** in [Market_and_deal_signals.md](../../../06-Resources/Market_and_deal_signals.md) for the current week; pull **competitive** and **M&A** rows that deserve exec airtime.

4. **Optional:** `/weekly-market-discovery` if you still need to add rotation items to the signal log for this week.

5. **Write the weekly pack:** Create **`06-Resources/Market_intelligence/synthesis/weekly/YYYY-MM-DD_weekly_exec_brief.md`** (use **week-ending** date or say so in the title) from [_template_weekly_exec_brief.md](../../../06-Resources/Market_intelligence/synthesis/weekly/_template_weekly_exec_brief.md).

   - **Executive snapshot:** 3–5 bullets max; outcome-oriented.
   - **Product:** Themes with **implications** for roadmap/priorities; suggest **`EV-*`** rows for [Evidence_register.md](../../../06-Resources/PRDs/Evidence_register.md) when a signal should bind to specs.
   - **Leadership / market:** Competitive moves, category shifts, **risks and mitigations** (not just cheerleading).
   - **Contrarian angle:** One skeptical read + one non-obvious second-order effect — aligns with daily brief discipline.
   - **[[Company]] relevance:** Replace with your company wiki link (e.g. `[[Wyzetalk]]`) per vault convention.

6. **Delivery:** Share the markdown (export to PDF/slides if your execs prefer) or paste sections into your weekly Product/leadership forum template.

**Related:** [intelligence-scanning](../intelligence-scanning/SKILL.md) (daily ingest → daily brief) · [weekly-market-discovery](../weekly-market-discovery/SKILL.md) (signal log rotation) · [WORKFLOW.md](../../../06-Resources/Market_intelligence/WORKFLOW.md)
