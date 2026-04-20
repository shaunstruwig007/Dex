# Market intelligence — source guide

**Purpose:** Where weekly scans pull from, and how they connect to the signal log.

| Artifact | Role |
|----------|------|
| [Market_and_deal_signals.md](Market_and_deal_signals.md) | **Weekly routine table** (Mon–Fri focus) + **Phase 1 — Signal log** (raw week-of rows). |
| [Market_and_competitive_signals.md](Market_and_competitive_signals.md) | **`EV-*` register** — promote signals that should bind PRDs / positioning. |
| `00-Inbox/*_Intel` | Optional: pasted newsletters, YouTube notes, conference bullets (when folder exists). |
| [Competitors/](Competitors/) | Competitor profiles + index (when present); refresh pass rows after competitor-heavy weeks. |

**Command:** `/weekly-market-discovery` — walks the **current weekday** column in the routine table, adds signal-log rows, and optionally adds `EV-*` rows.

---

*Bootstrapped 2026-04-17 with `Market_and_deal_signals.md`.*
