# WhatsApp — Smart HR (Conversational)

---

> **Status: Stub** — not yet sized or designed. Placeholder to signal this is in scope for the Next phase.

**Phase:** Next (post-Essential GA).

**Related PRDs (Essential / Current):** [WhatsApp_Channel.md](../Current/WhatsApp_Channel.md) (Essential is one-way broadcast only — this extends to two-way conversational), [Payslip_PDF.md](../Current/Payslip_PDF.md), [User_Management.md](../Current/User_Management.md).

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

## Open questions (pre-discovery)

- Which HRIS systems are in scope for Phase 2? (PaySpace, SAP, Sage, custom?)
- Is this a Wyzetalk-native chatbot or an integration with an existing conversational AI platform?
- How does this interact with the WhatsApp 24-hour reply window for user-initiated conversations?
- POPIA/GDPR: storing conversation history on WhatsApp infrastructure vs vault — what is the retention model?

---

*Promote to full PRD when discovery is scheduled. See [Next/README.md](./README.md) for merge instructions.*
