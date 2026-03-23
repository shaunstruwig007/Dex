# Market intelligence — architecture

**Related:** [README.md](./README.md) · [WORKFLOW.md](./WORKFLOW.md) · [Market_and_deal_signals.md](../Market_and_deal_signals.md)

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
  B --> L
  L -->|"strong signal"| E
  E --> P

  PM --> T
  T -.->|"themes"| L
```

**Slash commands:** `/intelligence-scanning`, `/daily-intelligence-brief`, `/weekly-market-discovery` (see `.claude/skills/`).

---

## Gaps to be aware of

| Gap | Mitigation |
|-----|------------|
| Newsletters are manual paste | Use RSS → reader → export, or “view in browser” + paste (see [WORKFLOW.md](./WORKFLOW.md)). |
| Phase 2 deal log empty | Add process when CRM buy-in exists. |
| `EV-*` optional | Add rows when a signal informs a spec; cite from PRDs. |
