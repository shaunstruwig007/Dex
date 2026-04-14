---
name: intelligence-scanning
description: Scan new Market_intelligence ingest (YouTube transcripts, newsletters) and update or draft the daily signal brief.
---

# Intelligence scanning

**When:** After new files land in `06-Resources/Market_intelligence/ingest/` or on a scheduled review.

**Steps:**

0. **Optional — RSS fetch:** If `06-Resources/Market_intelligence/intel_feeds.json` has **`feeds`** entries, run from vault root:  
   `.scripts/market-intelligence/.venv/bin/python .scripts/market-intelligence/fetch_intel_rss.py`  
   (see `.scripts/market-intelligence/README.md` — venv, `--since-days`, `--dry-run`). Skip if feeds are empty or you only use manual paste / YouTube.
1. List recent ingest under `ingest/youtube/<slug>/` and `ingest/newsletters/<slug>/` (newer than last brief date if known). **Folder slugs and themes (HR, engagement, AI, deskless)** are defined in `06-Resources/Market_intelligence/ingest/README.md` and `sources_manifest.yaml`.
2. Read key excerpts; extract themes, claims, and **[[Wyzetalk]] angle** (frontline/deskless vs desk HRIS, mining/energy/regulated).
3. Create or update `06-Resources/Market_intelligence/synthesis/daily/YYYY-MM-DD_signal_brief.md` using `_template_daily_brief.md` — include **Contrarian & novel angles** (skeptical read + second-order outcomes), not only consensus themes.
4. If a signal should inform product evidence, suggest adding a row to `06-Resources/PRDs/Evidence_register.md` with a new `EV-*` id.

**Related:** [Market_intelligence/ingest/README.md](../../../06-Resources/Market_intelligence/ingest/README.md) · [WORKFLOW.md](../../../06-Resources/Market_intelligence/WORKFLOW.md) · [Market_and_deal_signals.md](../../../06-Resources/Market_and_deal_signals.md)
