---
date: 2026-04-29
type: cross-functional / exec sync
participants:
  - Merel van der Lei (CEO/CPO)
  - Leon Janse van Rensburg (CTO)
  - Anneke Vermeulen
  - Jan Vosloo
  - Shaun Struwig (Product, capturing)
recording: yes (with consent — transcript fed into Dex)
related:
  - System/exec_roadmap.md
  - 06-Resources/PRDs/AI_Assistant_FAQ.md
  - 06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md
  - 06-Resources/PRDs/Employee_Chat_and_Groups.md
---

# Exec session — post-MVP roadmap + cross-functional sync

## TL;DR

Exco communicated the post-MVP development priorities (now captured in `System/exec_roadmap.md`). Cross-functional discussion confirmed conversation-time / sales-cycle realities (clients don't sign in 3 weeks even with Blue). Brief callout on the WhatsApp Flow / Flow Gear naming confusion. Background note on Claude token-rationing patterns (Leon).

---

## Decisions captured

| # | Decision | Owner |
|---|---|---|
| 1 | Post-MVP priority order: WhatsApp Integration → AI Assistant → Peer Chat → Remote App Extensions → EWA (FloatPays) → Forms. Migration is lower priority. | Exco |
| 2 | Build proactively — even if a feature takes 3-4 weeks, having it ready before client-ask is the move (Leon). Mitigation: if a client signs faster than expected, communicate "available from \<date\>." | Product / Sales |
| 3 | The third-party tool referenced for WhatsApp pay-step distribution was **WhatsApp Flow**, not Flow Gear (Leon clarified). Need to investigate WhatsApp Flow as the integration pattern. | Product (Shaun) → handoff |

## Action items

| Action | Owner | Status |
|---|---|---|
| Investigate WhatsApp Flow as integration pattern for priority #1 (WhatsApp Integration) | Product | Open |
| Author discovery doc for WhatsApp Integration (no PRD exists yet — gap) | Product | Open |
| Surface analytics / bug debt / tech debt gaps to next exec session | Product | Open |
| Capture exec roadmap as authoritative file in vault | Shaun | Done — `System/exec_roadmap.md` |
| Process recording into Dex for future-proof context capture | Shaun | Done — this file + roadmap |

## Key threads (from transcript wrap-up)

### Sales-cycle reality (Merel)

- Even with Blue (Wyzetalk Essential), client conversion is not 3-week fast.
- Implication: build features ahead of client demand. If a client signs unusually quickly, communicate availability date.

### WhatsApp Flow vs Flow Gear (Leon)

- A pay-step integration was previously discussed referencing "Flow Gear."
- Leon clarified on reflection: **the actual reference was WhatsApp Flow, not Flow Gear**.
- Action: investigate WhatsApp Flow as the integration pattern. This is likely Phase 2 of `06-Resources/PRDs/AI_Assistant_FAQ.md` (FAQ-on-WhatsApp-Flow) AND a likely component of the still-unstarted **WhatsApp Integration PRD** (exec priority #1).

### Background fact — Claude token rationing (Leon)

- Anthropic models ration tokens by giving high impact to the **first 10%** and **last 10%** of an instruction, with spot-checks in the middle.
- Implication for our long instruction docs / PRDs: critical content should sit at the top (Goal, Slices) AND bottom (Build handoff). Middle-buried facts are at risk of being missed by the model.
- This is consistent with how the bond_v1 PRD shape is already structured (Goal at top, Build handoff at bottom). Worth noting as ratification, not a change.

---

## Gaps Shaun raised in-meeting (not on exec roadmap)

These were mentioned by Shaun during the discussion as work that needs to be planned alongside the feature roadmap. Captured in `System/exec_roadmap.md` under "Identified gaps."

- **Product analytics** — without it, success metrics in every PRD are unmeasurable.
- **Bug debt** — backlog from MVP and prior, no triage plan.
- **Technical debt** — affects velocity on every priority above, no allocated paydown.

These are flagged as **risks against every priority that depends on observability or stable infrastructure**.

---

## Followups for the discovery skill

The exec roadmap should now be loaded as an evidence source by `/initiative-discovery-custom`. When any of priorities #1, #4, #5, #6 are workshopped, the skill should:

1. Cite the exec roadmap as the strongest evidence source.
2. Skip the "no customer evidence — fix before spec" failure mode (it's not a failure here; it's how this org makes decisions).
3. Flag the three gaps (analytics / bug / tech debt) as background risks against the candidate slices.

---

## People mentioned (no person pages yet — flagged for future capture)

| Person | Role | Why they matter |
|---|---|---|
| Merel van der Lei | CEO/CPO | Voice of exco. Strategic priorities owner. |
| Leon Janse van Rensburg | CTO | Engineering leadership. WhatsApp Flow / Claude token-rationing context. |
| Anneke Vermeulen | (role to confirm) | In-room participant. |
| Jan Vosloo | (role to confirm) | In-room participant. |

> Person pages should be created in `05-Areas/People/Internal/` if these names recur in future meetings. Vault is currently sparse — no internal person pages exist yet.

---

*Captured 2026-04-29 from Teams recording with participant consent. Transcript fed through Dex for context preservation. Source-of-truth for exec priorities is `System/exec_roadmap.md` — this file is the meeting record only.*
