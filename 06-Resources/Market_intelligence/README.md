# Market intelligence hub

**Purpose:** **Ingest** (YouTube transcripts, newsletter markdown) and **synthesis** (`YYYY-MM-DD_signal_brief.md`) — read the brief daily; **drill in** to `ingest/` when needed.

**Parent:** [Market_and_deal_signals.md](../Market_and_deal_signals.md) · [Market_intelligence_Source_Guide.md](../Market_intelligence_Source_Guide.md)

---

## Layout

| Path | Role |
|------|------|
| [sources_manifest.yaml](./sources_manifest.yaml) | **Canonical registry** — slug, URL, tags (HR / AI / deskless / safety) |
| [ingest/README.md](./ingest/README.md) | **Start here** — folder ↔ slug ↔ what to scan for (engagement, EX, AI, etc.) |
| [ingest/youtube/](./ingest/youtube/) | Transcript `.md` per video — one subfolder per channel slug |
| [ingest/newsletters/](./ingest/newsletters/) | One `.md` per issue — one subfolder per publication slug |
| [synthesis/daily/](./synthesis/daily/) | **Daily signal brief** |
| [synthesis/weekly/](./synthesis/weekly/) | **Weekly Product & Executive pack** (`/weekly-exec-intel`) |
| [synthesis/Deal_Won_Lost_Analysis_Reference.md](./synthesis/Deal_Won_Lost_Analysis_Reference.md) | **Won/lost reasons** (HubSpot export) — pricing, ghosting, stack, deskless |
| [../Research/Industry_research_reports/](../Research/Industry_research_reports/) | **Static industry PDFs** → Markdown summaries (SharePoint‑canonical); frontline / deskless |
| [WORKFLOW.md](./WORKFLOW.md) | Transcript queue, newsletter safety |

**Skills (canonical):** `/intelligence-scanning` · `/daily-intelligence-brief` · `/weekly-market-discovery` · `/weekly-exec-intel` — [.claude/skills/intelligence-scanning/SKILL.md](../../.claude/skills/intelligence-scanning/SKILL.md) · [daily-intelligence-brief](../../.claude/skills/daily-intelligence-brief/SKILL.md) · [weekly-market-discovery](../../.claude/skills/weekly-market-discovery/SKILL.md) · [weekly-exec-intel](../../.claude/skills/weekly-exec-intel/SKILL.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

**Scripts:** [.scripts/market-intelligence/](../../.scripts/market-intelligence/)
