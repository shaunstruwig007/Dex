# Wyzetalk Essential — Exec Roadmap (post-MVP)

**Status:** AUTHORITATIVE — direct from exco, captured 2026-04-29
**Source:** Exco session communicating priorities for the development phase following the Wyzetalk Essential MVP launch
**Pairs with:** `System/icp.md` (who we serve) · `06-Resources/Market_intelligence/synthesis/weekly/*` (Friday market signal) · `.claude/skills/initiative-discovery-custom/SKILL.md` (consumes this as a primary evidence source)
**Owner of this file:** Product (Shaun until handoff; then Design Manager)

---

## Why this file exists

In Wyzetalk's organisation, **a meaningful share of build decisions originate from the exco**, not from ground-up customer or CS evidence. Product does not always have direct visibility into sales discussions or CS check-ins. This is an organisational reality, not a failure mode.

This file captures the exec-direction evidence stream in writing so:

1. The **discovery skill** has an authoritative input alongside ICP and weekly market intel.
2. The discovery package can cite "exec directive (date)" as a legitimate evidence source instead of pretending the build was customer-evidence-driven when it wasn't.
3. **Shaun's verbal context survives Shaun.** When the Design Manager takes over, this file is the contract for "what is exec asking us to ship."
4. The roadmap is **diff-able over time** — when exco changes direction, the diff is visible.

---

## Critical priorities — in this order

| # | Initiative | Notes | PRD status (2026-04-29) |
|---|---|---|---|
| 1 | **WhatsApp Integration** | Functional integration to support remote-app features and communication through WhatsApp. | **No PRD yet** — gap. Discovery needed. |
| 2 | **AI Assistant** | Implement an AI chatbot overlay for both Blue and the WhatsApp experience. Investigate tools such as **tawk.to** as a possible starting point. | **Two PRDs cover this:** `06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md` (chat-surface IA) + `06-Resources/PRDs/AI_Assistant_FAQ.md` (engine + Phase-2 WhatsApp Flow). Phase-2 of AI_Assistant_FAQ overlaps with priority #1 (WhatsApp). |
| 3 | **Peer-to-Peer Chat** | Enable both group chat and direct peer-to-peer chat. | **PRD exists:** `06-Resources/PRDs/Employee_Chat_and_Groups.md`. Discovery in progress (engineering spike on chat realtime stack pending). |
| 4 | **Remote App: Extensions** | — | No PRD. Discovery needed. |
| 5 | **EWA: FloatPays integration** | Earned Wage Access via FloatPays. | No PRD. Discovery needed. |
| 6 | **Forms** | — | No PRD. Discovery needed. |

## Lower priority

| # | Initiative | Notes |
|---|---|---|
| 1 | **Migration-specific use cases** | For now, the focus remains on **new sales use cases**, not migrating legacy customers. |

---

## Identified gaps in the exec roadmap

These are NOT on the exec list but were flagged by Product (Shaun) as work that still needs to be planned and resourced. Captured here so they don't disappear.

| Gap | Why it matters | Current owner |
|---|---|---|
| **Product analytics** | Without analytics, none of the success metrics in any PRD (`AI_Assistant_*`, `Employee_Chat_*`, `Multilingual_Content`) are actually measurable. Slice 1 demo readiness assumes we can observe behaviour. | Unassigned. Needs to surface in next exec session. |
| **Bug debt** | Backlog of defects from Wyzetalk Essential MVP and prior. No visible plan for triage / burn-down vs. new feature work. | Unassigned. |
| **Technical debt** | Engineering has accumulated debt that affects velocity on every priority above. No allocated capacity for paydown. | Unassigned. Engineering to surface in next planning. |

> These gaps are flagged as **risks against every PRD that depends on observability, stable infrastructure, or known-good baseline behaviour**. Discovery and PRD authoring should treat them as background risk, not silently assume they're handled.

---

## How the discovery skill should treat this file

When `/initiative-discovery-custom` runs against any new initiative, it should:

1. **Check this file first.** Is the initiative on the exec roadmap? If yes → cite the priority number + date as the strongest evidence source. The proposition is **already validated** by exco; discovery's job is to scope, slice, and de-risk, not to re-litigate the decision.
2. **If the initiative is NOT on the exec roadmap**, flag this as an evidence gap: *"This initiative does not appear in the current exec roadmap (`System/exec_roadmap.md`). Either (a) it's a new product opportunity to surface to exco for prioritisation, or (b) it's a technical / debt initiative that lives outside the feature roadmap."*
3. **Cross-check the gaps section.** If the initiative depends on analytics, debt paydown, or bug-fix capacity, surface that as a risk in the discovery output.
4. **Treat sparse customer / CS evidence as expected, not as a failure.** In this org, exco often decides ahead of (or in parallel with) ground-up evidence collection. Log it as an evidence gap to be filled post-launch, not a blocker.

---

## Roadmap change history

| Date | Change | Source |
|---|---|---|
| 2026-04-29 | Initial capture from exco session post-MVP launch | Shaun, captured from verbal communication |

---

*This file is the source of truth for exec-driven priorities. Update it whenever exco communicates a change. Diff history in git is the record.*
