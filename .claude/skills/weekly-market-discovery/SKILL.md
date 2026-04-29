---
name: weekly-market-discovery
description: Run the weekly source rotation from Market_and_deal_signals and capture notable items in the signal log.
---

# Weekly market discovery

**When:** End of week or when user asks to run the **weekly scanning routine** *without* the full weekly-market-intel pass.

**Relationship to [`/weekly-market-intel-custom`](../weekly-market-intel-custom/SKILL.md):** this skill covers **Step 1 only** (signal log + optional EV proposals). Prefer `/weekly-market-intel-custom` on Fridays so competitor watch, industry pulse, and `synthesis/weekly/<ISO-Monday>_friday_signal.md` stay in sync.

**Reference:** [Market_and_deal_signals.md](../../../06-Resources/Market_and_deal_signals.md) (routine table) · [Market_intelligence_Source_Guide.md](../../../06-Resources/Market_intelligence_Source_Guide.md)

**Steps:**

1. Walk the priority sources for the current week phase (Monday–Friday focus areas in the table).
2. For each notable item, add or extend a row in **Phase 1 — Signal log** in `Market_and_deal_signals.md` (week of, source, theme, implication).
3. If material for product decisions, add `EV-*` to `06-Resources/Market_and_competitive_signals.md` and link from specs as needed.
4. Optionally refresh [Competitors/COMPETITOR_INDEX.md](../../../06-Resources/Competitors/COMPETITOR_INDEX.md) competitor-pass rows.
