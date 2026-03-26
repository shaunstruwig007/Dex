# Market intelligence hub

**Purpose:** **Ingest** (YouTube transcripts, newsletter markdown) and **synthesis** (`YYYY-MM-DD_signal_brief.md`) — read the brief daily; **drill in** to `ingest/` when needed.

**Parent:** [Market_and_deal_signals.md](../Market_and_deal_signals.md) · [Market_intelligence_Source_Guide.md](../Market_intelligence_Source_Guide.md)

---

## Layout

| Path | Role |
|------|------|
| [sources_manifest.yaml](./sources_manifest.yaml) | Channel slugs, newsletter notes |
| [ingest/youtube/](./ingest/youtube/) | Transcript `.md` per video |
| [ingest/newsletters/](./ingest/newsletters/) | One `.md` per issue |
| [synthesis/daily/](./synthesis/daily/) | **Signal brief** |
| [synthesis/Deal_Won_Lost_Analysis_Reference.md](./synthesis/Deal_Won_Lost_Analysis_Reference.md) | **Won/lost reasons** (HubSpot export) — pricing, ghosting, stack, deskless |
| [WORKFLOW.md](./WORKFLOW.md) | Transcript queue, newsletter safety |

**Skills (canonical):** `/intelligence-scanning` · `/daily-intelligence-brief` · `/weekly-market-discovery` — [.claude/skills/intelligence-scanning/SKILL.md](../../.claude/skills/intelligence-scanning/SKILL.md) · [daily-intelligence-brief](../../.claude/skills/daily-intelligence-brief/SKILL.md) · [weekly-market-discovery](../../.claude/skills/weekly-market-discovery/SKILL.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

**Scripts:** [.scripts/market-intelligence/](../../.scripts/market-intelligence/)
