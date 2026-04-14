# Market intelligence — architecture

**Related:** [README.md](./README.md) · [ingest/README.md](./ingest/README.md) · [WORKFLOW.md](./WORKFLOW.md) · [Market_and_deal_signals.md](../Market_and_deal_signals.md)

---

## End-to-end flow

```mermaid
%%{init: {'theme': 'neutral'}}%%
flowchart TB
  subgraph sources["External sources"]
    S1[Source guide — 26 sources]
    S2[YouTube / podcasts]
    S3[Newsletters / web]
    S4[Competitor / RFP intel]
  end

  subgraph ingest["Vault ingest"]
    I1["ingest/youtube/"]
    I2["ingest/newsletters/"]
    I3["../Competitors/profiles/"]
  end

  subgraph synth["Synthesis"]
    B["synthesis/daily/*_signal_brief.md"]
    W["synthesis/weekly/*_weekly_exec_brief.md"]
    D["synthesis/Deal_Won_Lost_Analysis_Reference.md"]
    L["Market_and_deal_signals.md"]
  end

  subgraph product["Product traceability"]
    E["PRDs/Evidence_register.md — EV-*"]
    P["PRDs + acceptance criteria"]
  end

  subgraph pkm["PKM — separate pipeline"]
    PM["/process-meetings"]
    T["Tasks / People"]
  end

  S1 --> S2
  S1 --> S3
  S2 --> I1
  S3 --> I2
  S4 --> I3
  I1 --> B
  I2 --> B
  I1 --> W
  I2 --> W
  B --> W
  B --> L
  L --> W
  D --> L
  L -->|"strong signal"| E
  E --> P

  PM --> T
  T -.->|"themes"| L
```

**Slash commands:** `/intelligence-scanning`, `/daily-intelligence-brief`, `/weekly-market-discovery`, `/weekly-exec-intel` (see `.claude/skills/`).

---

## Gaps to be aware of

| Gap | Mitigation |
|-----|------------|
| Slugs not discoverable | Use [ingest/README.md](./ingest/README.md) + [sources_manifest.yaml](./sources_manifest.yaml) — folder name = slug. |
| Newsletters often manual paste | Optional: **`fetch_intel_rss.py`** + **`intel_feeds.json`** (see [WORKFLOW.md](./WORKFLOW.md)); else RSS reader → export, or “view in browser” + paste. |
| Phase 2 deal log empty | Add process when CRM buy-in exists. |
| `EV-*` optional | Add rows when a signal informs a spec; cite from PRDs. |
