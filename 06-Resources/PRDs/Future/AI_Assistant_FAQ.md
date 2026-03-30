# AI Assistant — FAQ & HR Queries (Rapid Deployment)

> **Status:** Active stub · **Phase:** Next (post-Essential GA) — **#2 commercial priority** (confirmed 2026-03-30)
>
> *This is a distinct, fast-ship initiative from the broader [AI_Assistant_Conversational.md](./AI_Assistant_Conversational.md) future vision. Scope is intentionally narrow — ship quickly, learn, then expand.*

*Created: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

---

## Priority & rationale

**#2 post-GA priority** as confirmed in the 2026-03-30 leadership session (Leon — CTO, Merel — CEO/CPO).

- Competitors (JEM, Paymenow) are moving fast with AI and WhatsApp-delivered HR services.
- Clients want immediate, tangible AI value.
- Framing: **quick win** — simple, effective, fast to ship. This is not a full AI platform.

---

## Confirmed decisions (2026-03-30)

| Decision | Detail |
|----------|--------|
| **Tool confirmed** | **tawk.to** — live chat and AI support platform. Confirmed suitable for rapid implementation. |
| **Scope** | Basic FAQ and HR query handling **only**. Not a full conversational AI platform. |
| **Delivery surfaces** | Blue app + WhatsApp Flow |
| **Approach** | Simple, fast to ship. Do not over-engineer for Phase 1. |

---

## Hypothesis

Frontline employees have recurring, repetitive HR and policy questions (leave balances, payslip queries, safety procedures, company policies). Answering these through a simple FAQ chatbot — without requiring HR staff intervention — reduces support load and delivers immediate perceived AI value to clients.

tawk.to enables rapid deployment of a structured FAQ bot without custom AI infrastructure, making this a genuine quick win rather than a multi-month build.

---

## Scope (Phase 1 — fast ship)

- **FAQ bot** — Pre-configured answers to the most common HR and policy questions (leave, payslips, safety contacts, onboarding info)
- **Accessible from Blue app** — In-app chat surface
- **Accessible via WhatsApp Flow** — WhatsApp as a delivery channel for FAQ interactions
- **tawk.to as the engine** — No custom AI infrastructure required for Phase 1
- **HR-grounded responses** — Answers constrained to approved company content (not open-ended AI generation)
- **Escalation path** — Unanswered queries routed to HR inbox or human agent

## Out of scope (Phase 1)

- Complex conversational flows or multi-turn reasoning
- Live HR data lookups (leave balance, real-time payslip) — that is [WhatsApp_Smart_HR.md](../Next/WhatsApp_Smart_HR.md)
- Custom AI model training or fine-tuning
- Full conversational AI platform — see [AI_Assistant_Conversational.md](./AI_Assistant_Conversational.md) for future vision

---

## Relationship to other PRDs

| PRD | Relationship |
|-----|-------------|
| [WhatsApp_Smart_HR.md](../Next/WhatsApp_Smart_HR.md) | Smart HR is #1 priority and handles structured HR data (payslips, leave, roster via HRIS). This is #2 and handles unstructured FAQ/policy content. They share the WhatsApp Flow delivery surface. |
| [AI_Assistant_Conversational.md](./AI_Assistant_Conversational.md) | This is the fast-ship phase of a broader AI assistant vision. Phase 1 intentionally scoped down. |
| [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md) | Chat is #3 priority. Separate surface — peer/team messaging vs bot. |

---

## Dependencies

- WhatsApp Channel (Essential — live at GA)
- WhatsApp Flow infrastructure (being evaluated by Jan for Smart HR — shared dependency)
- tawk.to account setup and configuration
- HR/policy content sourced and structured by client (or Wyzetalk implementation team)

---

## Open questions (pre-discovery)

- How does tawk.to integrate with WhatsApp Business API and WhatsApp Flow?
- What is the content management model — who updates FAQ answers, how often?
- Is this Wyzetalk-configured per tenant or client self-serve?
- POPIA/GDPR: tawk.to conversation data residency — where is it stored?
- Escalation: does tawk.to support live agent handoff within the same interface?
- Will Phase 1 tawk.to be reusable or replaced when the broader AI Assistant platform matures?

---

*Promote to Next stub when ready to schedule discovery. Fast-ship target — aim to have discovery complete by May 2026. See [README.md](./README.md) for promote path.*
