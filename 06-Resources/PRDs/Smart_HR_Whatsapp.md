---
prd_id: smart-hr-whatsapp
lifecycle: spec_ready
created_date: 2026-03-30
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Spike: WhatsApp Flow / WABA integration options (no Flow Gear default in PRD — pilot 2026-04-17)
  - Mid-April 2026 demo: payslip path + opt-in (steerco)
  - Align FAQ handoff UX with [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md)
---

# WhatsApp — Smart HR (Conversational)

**Status:** Active stub — agent-oriented retrofit  
**Target:** Frontline employees requesting payslip, leave, roster, and HR answers via WhatsApp (two-way)  
**Estimated Effort:** 120–240 hours agent time (post-discovery)

---

> **Status: Active stub** — elevated to **#1 commercial priority** (2026-03-30). Discovery workshop scheduled for week 2–3 April. Not yet sized or designed; promote to full PRD after discovery.

**Phase:** Next (post-Essential GA) — **prioritised ahead of all other Next-phase features.**

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

**Related PRDs (Essential / Current):** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) (one-way WhatsApp broadcast — this extends to two-way conversational), [Payslip_PDF.md](./Payslip_PDF.md), [User_Management.md](./User_Management.md).

### Collaborative pilot (product decisions — 2026-04-17)

| Decision | Shaun’s call |
|----------|----------------|
| **Mid-April demo / sales slice** | **Payslip on demand via WhatsApp** (+ opt-in) is the **minimum credible demo**; **leave / roster** can ship **after** — not required for that demo milestone. |
| **Fuzzy policy / FAQ-ish questions** | **Prefer handoff or deep-link** to the FAQ path ([AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) / tawk.to) when the intent is **outside structured HR self-service** in this PRD. |
| **Flow Gear** | **Do not anchor** the binding spec on Flow Gear — **spike-only**; no preferred vendor path named in Architecture / Technical Blueprint (historical meeting notes may still mention investigations below). |

---

## The Job to Be Done

Employees can complete **structured HR self-service** (payslip, leave balance, shifts) and **policy-grounded** answers on WhatsApp using Flows and approved data — upgrading Phase 1 one-way WhatsApp to **two-way** safely.

**User value:** Matches JEM/Paymenow market pressure; Meta pricing model documented in legacy section.

---

## Work Packages

### WP-1: WABA + Flow foundation (P0)

**Priority:** P0  
**Dependencies:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) Part 2 live  
**Files:** BSP config TBD  
**VPS-eligible:** Partial

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Inbound message routing | Webhook tests |
| 1b | Template / utility classification guardrails | Compliance review |

### WP-2: Payslip on demand (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** [Payslip_PDF.md](./Payslip_PDF.md); HRIS feed  
**Files:** Integration TBD  
**VPS-eligible:** Yes

### WP-3: Leave / roster queries (P1)

**Priority:** P1 — **after** payslip demo milestone unless workshop pulls forward  
**Dependencies:** HRIS integration PRD TBD  
**Files:** TBD  
**VPS-eligible:** Yes  
**Note (pilot 2026-04-17):** Not required for mid-April **payslip-first** demo.

### WP-4: FAQ boundary + escalation (P1)

**Priority:** P1  
**Dependencies:** [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) — **handoff / deep-link** when intent is not structured HR (payslip/leave/roster per policy)  
**Files:** Routing TBD  
**VPS-eligible:** Yes  

| # | Behavior | Observable |
|---|----------|------------|
| 4a | Non-structured HR / policy questions route to FAQ bot path | Documented handoff or deep-link; UAT |
| 4b | Structured HR intents stay in Smart HR handlers | No duplicate FAQ engine here |

**Dependency graph:**

```text
WP-1 ──> WP-2
WP-1 ──> WP-4
WP-1 ──> WP-3
```

---

## Success Scenarios

### Scenario 1: Payslip request

**Setup:** Employee opted in; payslip data available.  
**Action:** User asks for payslip in WhatsApp.  
**Observable Outcome:** PDF or approved delivery per policy.  
**Success Criteria:** UAT on staging WABA.

### Scenario 1b: Mid-April sales demo (pilot 2026-04-17)

**Setup:** Same as Scenario 1 — **payslip path + opt-in** is the **minimum demo**; leave/roster not required for this milestone.  
**Action:** Sales-led demo on staging/demo WABA.  
**Observable Outcome:** Payslip flow credible for buyer conversation.  
**Success Criteria:** Steerco / GTM sign-off on demo script.

### Scenario 2: 24h service window

**Setup:** User-initiated thread.  
**Action:** Follow-up messages within 24h.  
**Observable Outcome:** Billing model matches Merel briefing (legacy pricing table).  
**Success Criteria:** Finance validates message classification.

### Scenario 3: FAQ / policy handoff

**Setup:** Employee message is **not** a clean structured HR intent (payslip/leave/roster).  
**Action:** System offers **handoff or deep-link** to [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) path.  
**Observable Outcome:** User reaches FAQ/policy support without Smart HR inventing open-domain answers.  
**Success Criteria:** UAT + product sign-off on routing matrix (pilot 2026-04-17).

---

## Satisfaction Metric

**Overall Success:** **95%** of UAT scripted HR intents routed correctly (no wrong payslip).

**Measured by:** Test matrix + QA sign-off.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Defer to [Product_Analytics.md](./Product_Analytics.md) — template-level and Flow completion events TBD.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **WhatsApp Flow** / secure flows for sensitive patterns (2026-03-30).  
- **Business API** (not groups) for privacy — legacy rationale.  
- **POPIA/GDPR** retention — open questions must be closed before GA.  
- **No Flow Gear (or other vendor) as a named default** in the binding spec — **spike** decides optional accelerators (pilot 2026-04-17).  
- **Mid-April demo:** **Payslip + opt-in** path is the **minimum** sales demo; leave/roster follow (pilot 2026-04-17).  
- **FAQ-ish intents:** **Hand off** to [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) rather than open-domain LLM in Smart HR (pilot 2026-04-17).

---

## Technical Blueprint

**Binding baseline (pilot 2026-04-17):** **Meta WhatsApp Business API + WhatsApp Flow patterns** — integration details and any third-party accelerators emerge from **engineering spike**, not from a pre-named default vendor in this PRD.

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Flow / WABA integration | TBD (spike) |
| HRIS connectors | TBD |

---

## Validation Protocol

```bash
grep -c "WhatsApp Flow" "06-Resources/PRDs/Smart_HR_Whatsapp.md"
# PASS: >= 1

grep -c "Payslip_PDF" "06-Resources/PRDs/Smart_HR_Whatsapp.md"
# PASS: >= 1
```

**Manual:** Meta template review; mid-April demo checklist.

---

## Notes for Agent Implementation

**Scout priorities:** WABA + WhatsApp Flow integration paths; **spike** for optional tooling (do **not** treat Flow Gear as committed — pilot 2026-04-17). Magic link auth overlap with [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md). FAQ **handoff** UX with [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md).

---

## Files to Create

```
# TBD
docs/whatsapp/smart-hr-flows.md
```

---

## Out of Scope

- Full open-domain LLM chat — use [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) for FAQ-only tack.

### Binding vs historical (pilot 2026-04-17)

Sections above (Collaborative pilot, Architecture constraints, Technical Blueprint) are **binding** for product/engineering. **Detailed product context (legacy)** below keeps **Flow Gear** and March 2026 workshop wording as **historical / investigative** — not a vendor commitment unless revived after spike.

---

## Detailed product context (legacy)

## Commercial priority & urgency (updated 2026-03-30)

> **#1 commercial priority** as of 2026-03-30 leadership session (Leon — CTO, Merel — CEO/CPO).

**Why #1:**
- The single most common sales objection is lack of WhatsApp. Clients perceive WhatsApp as free and expect it.
- **JEM** and **Paymenow** are already using WhatsApp for advanced features including EWA (earned wage access) and conversational HR — urgency to match or overtake.
- Demo environment target: **mid-April 2026**, for use in real sales conversations.

**Technical approach confirmed (2026-03-30):**
- Use **WhatsApp Flow** technology — secure, branded in-WhatsApp experiences without storing sensitive data in chat. Upholds GDPR/POPIA compliance.
- **Flow Gear** (company) — *historical note:* discussed as possibly quick to deploy; **Jan to investigate** — **not** a binding default in Architecture (see pilot 2026-04-17).
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

## Problem hypothesis

Phase 1 WhatsApp is strictly one-way outbound (Urgent Alerts and Standard Messages). The market signal is clear: 70% of employee–system interactions are shifting to conversational interfaces, and JEM HR + PaySpace are already delivering payslips, leave balances, and attendance via WhatsApp chat. Employees in frontline industries expect to ask questions and get answers on WhatsApp — not log into an app.

Smart HR on WhatsApp turns the broadcast channel into a two-way self-service layer: employees ask, the system responds with structured HR data (payslip, leave balance, shift schedule) via approved WhatsApp templates or conversational flows.

## Scope indicators (to be confirmed in discovery)

- **Policy- and HR-grounded answers** — Responses constrained to **company policies** and approved data (see [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) for related assistant scope).
- **Inbound intent detection** — Employee sends a WhatsApp message (e.g. "my payslip", "leave balance") → system routes to correct handler
- **Payslip on demand** — Employee requests their payslip via WhatsApp; system retrieves and sends as PDF or structured message
- **Leave balance query** — Employee asks remaining leave; system returns balance from HRIS integration
- **Shift / roster query** — Employee asks next shift; system returns from scheduling system
- **Opt-in / opt-out** — Employee controls which HR self-service types they receive via WhatsApp
- **Escalation path** — Unanswered or complex queries routed to HR inbox / chatbot handoff

## Dependencies

- Phase 1 WhatsApp Channel must be live (WABA credentials, template approval pipeline, opt-in model)
- Payslip PDF remote app live (data source for payslip on demand)
- HRIS integration or data feed for leave / shift data (not in Phase 1 scope — integration PRD TBD)
- Meta approval for conversational / utility templates (beyond broadcast)

## Competitive context

| Competitor | WhatsApp capability | Urgency signal |
|------------|-------------------|----------------|
| **JEM** | Launching systems inside WhatsApp — conversational HR flows | High — active in same market |
| **Paymenow** | Financial inclusion + EWA via WhatsApp; free communication line subsidised by EWA model | High — Leon played live Paymenow demo 2026-03-30 |

*Note: Timestamps 13:45 and 16:44 in the 2026-03-30 meeting recording are Paymenow demo clips played by Leon — competitive reference material, not team discussion.*

## Open questions (pre-discovery)

- Which HRIS systems are in scope for Phase 2? (PaySpace, SAP, Sage, custom?)
- ~~Is this a Wyzetalk-native chatbot or an integration with an existing conversational AI platform (e.g. tawk.to)?~~ **Partially resolved (pilot 2026-04-17):** Structured HR here; **FAQ/policy** routes to [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) (tawk.to there). Remaining: exact **handoff mechanics** in WhatsApp.
- How does this interact with the WhatsApp 24-hour reply window for user-initiated conversations? *(One-way pricing model avoids the 24h window — confirm implications for Smart HR two-way flows.)*
- POPIA/GDPR: storing conversation history on WhatsApp infrastructure vs vault — what is the retention model?
- **Flow Gear feasibility** — *spike / historical; not a PRD default* (pilot 2026-04-17): Jan’s investigation informs options only.
- **Magic Link auth**: Can a WhatsApp message contain a secure deep-link that authenticates the employee into Blue without a separate login? (Merel raised 2026-03-30 — needs technical scoping, likely overlaps with Elevated Auth / Remote App PRD)
- **Message classification risk**: Meta classifies most "nurture" outbound as Marketing ($0.05) — how do we ensure payslip/shift messages stay classified as Utility ($0.01)? Template wording matters.
- **BSP selection**: Which Business Solution Provider? Affects per-message markup and Monthly Active User pricing model.

## Action items (from 2026-03-30)

| Task | Owner | Due |
|------|-------|-----|
| Investigate WhatsApp Flow + Flow Gear feasibility and technical requirements | Jan | This week |
| ~~Fact-check WhatsApp pricing details~~ | Merel | ✅ Done 2026-03-30 — full briefing received, pricing model updated |
| Investigate new WhatsApp one-way pricing — applicability for message module | Anneke | ASAP |
| Organise April discovery workshops (WhatsApp track) | Shaun + Tanya | Wk 2–3 April |

---

## Acceptance criteria (BDD)

*To be added after April discovery workshop.*

---

*Promote to full PRD after April discovery workshop. Demo environment target: mid-April 2026. See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17 · collaborative pilot decisions merged — 2026-04-17*
