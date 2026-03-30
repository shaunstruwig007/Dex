# WhatsApp — Smart HR (Conversational)

---

> **Status: Active stub** — elevated to **#1 commercial priority** (2026-03-30). Discovery workshop scheduled for week 2–3 April. Not yet sized or designed; promote to full PRD after discovery.

**Phase:** Next (post-Essential GA) — **prioritised ahead of all other Next-phase features.**

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

**Related PRDs (Essential / Current):** [WhatsApp_Channel.md](../Current/WhatsApp_Channel.md) (Essential is one-way broadcast only — this extends to two-way conversational), [Payslip_PDF.md](../Current/Payslip_PDF.md), [User_Management.md](../Current/User_Management.md).

---

## Commercial priority & urgency (updated 2026-03-30)

> **#1 commercial priority** as of 2026-03-30 leadership session (Leon — CTO, Merel — CEO/CPO).

**Why #1:**
- The single most common sales objection is lack of WhatsApp. Clients perceive WhatsApp as free and expect it.
- **JEM** and **Paymenow** are already using WhatsApp for advanced features including EWA (earned wage access) and conversational HR — urgency to match or overtake.
- Demo environment target: **mid-April 2026**, for use in real sales conversations.

**Technical approach confirmed (2026-03-30):**
- Use **WhatsApp Flow** technology — secure, branded in-WhatsApp experiences without storing sensitive data in chat. Upholds GDPR/POPIA compliance.
- **Flow Gear** (company) — likely built on WhatsApp Flow, used by a former team member for payslip delivery; referenced as quick and easy to deploy. Jan assigned to investigate feasibility.
- Accessible from both **Blue app** and via WhatsApp Flow.

**Pricing model — confirmed (Merel briefing 2026-03-30):**

Meta shifted to **per-message pricing** in 2026 (away from conversation-based). This is favourable for Wyzetalk's use case.

| Category | Wyzetalk use case | Rate (EU/SA/UK avg) | 24h window? |
|----------|-------------------|---------------------|-------------|
| **Utility** | Payslips, shift updates | ~$0.01/msg | No — broadcast only |
| **Marketing** | News alerts, leadership updates | ~$0.05/msg | No |
| **Service** | Any reply within 24h of employee message | **FREE** | Yes — user-initiated |

**1,000-employee cost model (monthly):**
- Shift updates (4,000) + Payslips (1,000) = $50 Utility
- News/Urgent Alerts (5,000) = $250 Marketing
- Meta total: **$300** + BSP/Platform fee $100–300 = **~$450/month ($0.45/employee)**

**Smart workflow design:** Encourage a user-initiated reply (e.g. "Thanks for the shift!") to open the free 24h Service window — subsequent messages in that window are free.

**Recommended Wyzetalk pricing model — "Hybrid Utility":**
1. Flat base access fee per employee (e.g. $0.20/employee/month) for WhatsApp infrastructure
2. Bundled messages (e.g. 5 Utility + 2 Marketing/month included)
3. Overage billed in arrears at a small markup

**Why Business API (not standard WhatsApp groups):**
- Employee numbers are **never visible** to other employees — 1:1 with platform only
- Messages broadcast individually or by segment
- Required for **POPIA/GDPR compliance** — standard WhatsApp groups expose personal data, invite harassment, and cannot be controlled. This is non-negotiable for frontline industries (mining, manufacturing, retail).

---

## Problem hypothesis

Phase 1 WhatsApp is strictly one-way outbound (Urgent Alerts and Standard Messages). The market signal is clear: 70% of employee–system interactions are shifting to conversational interfaces, and JEM HR + PaySpace are already delivering payslips, leave balances, and attendance via WhatsApp chat. Employees in frontline industries expect to ask questions and get answers on WhatsApp — not log into an app.

Smart HR on WhatsApp turns the broadcast channel into a two-way self-service layer: employees ask, the system responds with structured HR data (payslip, leave balance, shift schedule) via approved WhatsApp templates or conversational flows.

---

## Scope indicators (to be confirmed in discovery)

- **Policy- and HR-grounded answers** — Responses constrained to **company policies** and approved data (see [Future/AI_Assistant_Conversational.md](../Future/AI_Assistant_Conversational.md) · hub [Future/Discovery_backlog.md](../Future/Discovery_backlog.md)).
- **Inbound intent detection** — Employee sends a WhatsApp message (e.g. "my payslip", "leave balance") → system routes to correct handler
- **Payslip on demand** — Employee requests their payslip via WhatsApp; system retrieves and sends as PDF or structured message
- **Leave balance query** — Employee asks remaining leave; system returns balance from HRIS integration
- **Shift / roster query** — Employee asks next shift; system returns from scheduling system
- **Opt-in / opt-out** — Employee controls which HR self-service types they receive via WhatsApp
- **Escalation path** — Unanswered or complex queries routed to HR inbox / chatbot handoff

---

## Dependencies

- Phase 1 WhatsApp Channel must be live (WABA credentials, template approval pipeline, opt-in model)
- Payslip PDF remote app live (data source for payslip on demand)
- HRIS integration or data feed for leave / shift data (not in Phase 1 scope — integration PRD TBD)
- Meta approval for conversational / utility templates (beyond broadcast)

---

## Competitive context

| Competitor | WhatsApp capability | Urgency signal |
|------------|-------------------|----------------|
| **JEM** | Launching systems inside WhatsApp — conversational HR flows | High — active in same market |
| **Paymenow** | Financial inclusion + EWA via WhatsApp; free communication line subsidised by EWA model | High — Leon played live Paymenow demo 2026-03-30 |

*Note: Timestamps 13:45 and 16:44 in the 2026-03-30 meeting recording are Paymenow demo clips played by Leon — competitive reference material, not team discussion.*

---

## Open questions (pre-discovery)

- Which HRIS systems are in scope for Phase 2? (PaySpace, SAP, Sage, custom?)
- Is this a Wyzetalk-native chatbot or an integration with an existing conversational AI platform (e.g. tawk.to)?
- How does this interact with the WhatsApp 24-hour reply window for user-initiated conversations? *(One-way pricing model avoids the 24h window — confirm implications for Smart HR two-way flows.)*
- POPIA/GDPR: storing conversation history on WhatsApp infrastructure vs vault — what is the retention model?
- **Flow Gear feasibility**: Jan to investigate WhatsApp Flow + Flow Gear technical requirements this week.
- **Magic Link auth**: Can a WhatsApp message contain a secure deep-link that authenticates the employee into Blue without a separate login? (Merel raised 2026-03-30 — needs technical scoping, likely overlaps with Elevated Auth / Remote App PRD)
- **Message classification risk**: Meta classifies most "nurture" outbound as Marketing ($0.05) — how do we ensure payslip/shift messages stay classified as Utility ($0.01)? Template wording matters.
- **BSP selection**: Which Business Solution Provider? Affects per-message markup and Monthly Active User pricing model.

---

## Action items (from 2026-03-30)

| Task | Owner | Due |
|------|-------|-----|
| Investigate WhatsApp Flow + Flow Gear feasibility and technical requirements | Jan | This week |
| ~~Fact-check WhatsApp pricing details~~ | Merel | ✅ Done 2026-03-30 — full briefing received, pricing model updated |
| Investigate new WhatsApp one-way pricing — applicability for message module | Anneke | ASAP |
| Organise April discovery workshops (WhatsApp track) | Shaun + Tanya | Wk 2–3 April |

---

*Promote to full PRD after April discovery workshop. Demo environment target: mid-April 2026. See [Next/README.md](./README.md) for merge instructions.*
