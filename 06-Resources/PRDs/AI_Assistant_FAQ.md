---
prd_id: ai-assistant-faq
lifecycle: discovery
created_date: 2026-03-30
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Define analytics events when Product Analytics stack is chosen
  - Revisit Technical Blueprint when tawk.to ↔ WhatsApp Flow integration is validated
---

# AI Assistant — FAQ & HR Queries (Rapid Deployment)

**Status:** Discovery — binding agent-oriented spec (retrofit)  
**Target:** Frontline employees and HR-adjacent teams needing fast answers to recurring policy/FAQ questions via Blue app and WhatsApp Flow  
**Estimated Effort:** 24–40 hours agent time (discovery + integration; excludes full conversational AI platform)

> **Steerco:** Active stub · **Phase:** Next (post-Essential GA) — **#2 commercial priority** (confirmed 2026-03-30)
>
> *Scope is intentionally narrow — ship quickly, learn, then expand. A fuller conversational assistant roadmap may follow in later phases.*

*Created: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

### Collaborative pilot (product decisions — 2026-04-17)

Captured during a **pilot-only** `/agent-prd` session (questions before treating the spec as locked):

| Decision | Shaun’s call |
|----------|----------------|
| **tawk.to tenancy (Phase 1)** | **Wyzetalk-operated** workspaces/properties per tenant — not client-owned tawk.to accounts for GA. |
| **Phase 1 GA scope** | **Blue app + WhatsApp Flow together** — both surfaces required for Phase 1 GA (no GA with only one). |
| **FAQ engine** | **tawk.to stays locked** as the engine; leadership choice stands — only integration patterns may change in discovery. |

*Content ownership (who edits FAQ copy on an ongoing basis) remains in Open questions below.*

---

## The Job to Be Done

Employees can get accurate, HR-approved answers to common FAQ and policy questions from a single chat experience in the Blue app and via WhatsApp Flow, without waiting for a human, with a clear path to escalation when the bot cannot answer.

**User value:** Cuts HR/support load, matches competitor “AI quick win” positioning, and delivers tangible AI value to clients without building a custom LLM platform in Phase 1.

---

## Work Packages

### WP-1: Product & tawk.to tenancy model (P0 — No dependencies)

**Priority:** P0  
**Dependencies:** No dependencies  
**Files:** Tenant-facing runbooks (TBD), tawk.to workspace config (TBD)  
**VPS-eligible:** Yes (admin/config work)

| # | Behavior | Observable |
|---|----------|------------|
| 1a | **Wyzetalk-operated** tawk.to property/workspace per tenant; credentials in Wyzetalk-controlled stores | Runbook: provision + rotate; no client-owned tawk GA requirement |
| 1b | Roles for **who authors/updates FAQ corpus** (Wyzetalk vs client content owner) documented | Roster in runbook — separate from workspace ownership |

**Dependency graph:**

```text
WP-1 (P0) ──> WP-2, WP-3
WP-2 (P0, deps: WP-1) ──> WP-4
WP-3 (P0, deps: WP-1) ──> WP-4
WP-4 (P1, deps: WP-2, WP-3) ──> release candidate
```

### WP-2: Blue app — FAQ chat surface (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Mobile: TBD · Web embed SDK usage per tawk.to docs  
**VPS-eligible:** No (mobile toolchain)

| # | Behavior | Observable |
|---|----------|------------|
| 2a | User opens FAQ/chat entry point in Blue app | Chat UI loads within app shell |
| 2b | Session is attributable to tenant/user for escalation | Identifiers passed per tawk.to integration pattern (TBD in implementation) |

### WP-3: WhatsApp Flow — FAQ path (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1; product dependency on [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) WhatsApp/Flow readiness  
**Files:** Flow definitions (TBD); integration with [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) shared surfaces  
**VPS-eligible:** Partial (backend flows yes)

| # | Behavior | Observable |
|---|----------|------------|
| 3a | User can start FAQ interaction from approved WhatsApp Flow entry | Flow reaches tawk.to or handoff endpoint |
| 3b | Behaviour stays FAQ-scoped (no live HRIS data in Phase 1) | No payroll/leave API calls in this PRD’s Phase 1 path |

### WP-4: Content, escalation, and compliance (P1 — Depends on WP-2, WP-3)

**Priority:** P1  
**Dependencies:** WP-2, WP-3  
**Files:** Content schema (TBD); privacy assessment (TBD)  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 4a | FAQ corpus is curated and versioned | Change log or CMS behaviour documented |
| 4b | Unanswered queries escalate to HR inbox or human agent | Escalation route visible in tawk.to or email handoff |
| 4c | POPIA/GDPR data residency for tawk.to is recorded | Decision logged with vendor docs link |

---

## Success Scenarios

### Scenario 1: Happy path — in-app FAQ

**Setup:** Employee authenticated in Blue app; tawk.to FAQ content published for tenant.  
**Action:** User opens FAQ chat and asks a question covered by the corpus.  
**Observable Outcome:** User receives an approved answer in the chat within the tawk.to SLA (configure target in implementation).  
**Success Criteria:** 100% of seeded smoke-test questions return a non-empty bot response in UAT.

### Scenario 2: Escalation path

**Setup:** Question not in corpus.  
**Action:** User requests help or bot offers escalation.  
**Observable Outcome:** Ticket or handoff reaches HR inbox or live agent per configuration.  
**Success Criteria:** Escalation path verified in UAT with a test message end-to-end **once per channel** — **Phase 1 GA requires both Blue and WhatsApp Flow** (pilot decision 2026-04-17).

### Scenario 3: Error / compliance — out-of-scope ask

**Setup:** User asks for live payslip or leave balance (Phase 1 out of scope).  
**Action:** User submits query.  
**Observable Outcome:** Bot does not fabricate HRIS data; redirects or defers to documented process / Smart HR scope.  
**Success Criteria:** Scripted test passes: no ungrounded payroll numbers returned.

---

## Satisfaction Metric

**Overall Success:** 90% of UAT scripted FAQ intents receive a correct grounded response or explicit escalation (no hallucinated policy).

**Measured by:** UAT script pass rate + HR sign-off on corpus coverage list.

---

## Metrics Strategy

### Events to Track (none — deferred)

`analytics_tool: none`. When [Product_Analytics.md](./Product_Analytics.md) is implemented, add events such as `faq_session_started`, `faq_answer_served`, `faq_escalation_triggered` (names TBD with analytics owner).

### Success Targets

- Discovery complete by target date in steering notes (May 2026 aspiration).  
- Phase 1 launch: UAT satisfaction gate above before GA toggle.

### Business Outcome Mapping

This feature ladders to **commercial priority #2** and **perceived AI value** for clients (leadership session 2026-03-30).  
Expected impact: competitive parity with JEM/Paymenow-style AI + WhatsApp HR narratives; quantified revenue tie-in deferred to GTM.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Engine:** tawk.to for Phase 1 FAQ bot — **vendor locked** (leadership 2026-03-30 + pilot 2026-04-17); not an open RFP for GA.  
- **Tenancy:** **Wyzetalk-operated** tawk.to workspace per tenant for Phase 1 GA (pilot 2026-04-17).  
- **GA gate:** **Blue app + WhatsApp Flow** must both ship for Phase 1 GA — no single-surface GA (pilot 2026-04-17).  
- **Scope:** FAQ and HR *policy* queries only — not full conversational AI; no custom model training in Phase 1.  
- **No live HRIS lookups** in Phase 1 ([Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) owns structured data).  
- **Responses** must be grounded in approved content, not open-ended generation.

---

## Technical Blueprint

### System Integration Map

```text
Employee --> Blue_app --> tawk_to_widget --> tawk_to_cloud
Employee --> WhatsApp --> WhatsApp_Flow --> [handoff_TBD] --> tawk_to
tawk_to --> escalation --> HR_inbox_or_agent
```

Cross-PRD: WhatsApp infrastructure overlaps [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (Part 2) and [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md).

### Implementation repository paths (TBD)

| Layer | Path / owner |
|-------|----------------|
| Mobile (Blue) | TBD |
| Backend / Flow | TBD |
| tawk.to workspace | **Wyzetalk-provisioned**, tenant-scoped (credentials Wyzetalk ops/secrets) |
| Content / CMS | TBD — who edits copy is a process decision (see Open questions) |

### Config & Setup

Concrete JSON/YAML for tawk.to and WhatsApp Flow must be produced during discovery. Example placeholder shape (values not binding):

```yaml
# TBD — illustrative only
tawk:
  property_id: "<tenant_property>"
  widget_key: "<embed_key>"
whatsapp_flow:
  flow_id: "<meta_flow_id>"
  entry_point: "<deep_link_or_cta>"
```

### Key Implementation Patterns

- Embed tawk.to per official mobile/Web SDK; pass user/tenant context as supported by vendor.  
- WhatsApp Flow → tawk.to or middleware: **unresolved —** confirm with vendor + Meta docs during WP-3.

### Dependencies (runtime)

| Package / system | Version | Purpose |
|------------------|---------|---------|
| tawk.to | Per vendor | FAQ + escalation |
| WhatsApp Business / Flow | Per Meta | Delivery channel |

### Environment Variables

| Variable | Example Value | Where Set | Purpose |
|----------|---------------|-----------|---------|
| `TAWK_PROPERTY_ID` | TBD | Secrets store | Tenant routing |

---

## Validation Protocol

Vault-era checks (no app repo in this workspace): static proof that the spec remains internally consistent. Product QA remains manual/UAT.

### WP-1 checks

```bash
# Check 1.1: PRD names tawk.to as engine
grep -c "tawk" "06-Resources/PRDs/AI_Assistant_FAQ.md"
# PASS: >= 1

# Check 1.2: Phase 1 excludes live HRIS lookups (spec consistency)
grep -c "Smart_HR_Whatsapp" "06-Resources/PRDs/AI_Assistant_FAQ.md"
# PASS: >= 1 (cross-PRD boundary)
```

### WP-2 / WP-3 checks

```bash
# Check 2.1: Blue app surface explicitly required
grep -c "Blue" "06-Resources/PRDs/AI_Assistant_FAQ.md"
# PASS: >= 1

# Check 3.1: WhatsApp Flow explicitly required
grep -c "WhatsApp Flow" "06-Resources/PRDs/AI_Assistant_FAQ.md"
# PASS: >= 1
```

### WP-4 checks

```bash
# Check 4.1: Escalation path documented
grep -c -i "escalat" "06-Resources/PRDs/AI_Assistant_FAQ.md"
# PASS: >= 1
```

**Manual (not counted in automated pass rate):** UAT on device; tawk.to dashboard verification; legal/privacy sign-off.

### Post-launch metrics (not agent-verifiable at vault build time)

Adoption rate, deflection rate, median time-to-answer — require analytics instrumentation and production data.

---

## Success Rate Target

**4 of 4** static vault checks above must pass on each doc update.  
**Overall:** 100% of automated grep checks pass before merge to main for this file.

UAT and production metrics are out of scope for automated vault validation.

---

## Notes for Agent Implementation

**Scout priorities:**

1. tawk.to integration with WhatsApp Business API / Flow (vendor + Meta documentation).  
2. POPIA/GDPR data residency and subprocessors list for tawk.to.

**Worker tasks:**

1. Confirm embed vs redirect model for Blue app.  
2. Build Flow handoff prototype; validate with one pilot tenant.  
3. Define FAQ content workflow and escalation roster.

**Soldier review focus:**

- Boundary with Smart HR (no HRIS reads here in Phase 1).  
- Escalation UX and audit trail.  
- No ungrounded generative answers outside approved corpus.

---

## Files to Create

```
# TBD at implementation time (outside vault)
docs/runbooks/tawk-to-tenant-setup.md
config/whatsapp-flow/faq-entry.yaml
```

## Files to Modify

```
# Mobile / backend repos — TBD paths
Blue app: add chat entry + SDK integration
```

---

## Out of Scope

- Complex conversational flows or multi-turn reasoning beyond FAQ.  
- Live HR data lookups (leave, real-time payslip) — [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md).  
- Custom AI model training or fine-tuning.  
- Full conversational AI platform in Phase 1.  
- Peer/team chat — [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md).

---

## Detailed product context (historical)

### Priority & rationale

**#2 post-GA priority** as confirmed in the 2026-03-30 leadership session (Leon — CTO, Merel — CEO/CPO).

- Competitors (JEM, Paymenow) are moving fast with AI and WhatsApp-delivered HR services.
- Clients want immediate, tangible AI value.
- Framing: **quick win** — simple, effective, fast to ship. This is not a full AI platform.

### Confirmed decisions (2026-03-30)

| Decision | Detail |
|----------|--------|
| **Tool confirmed** | **tawk.to** — live chat and AI support platform. Confirmed suitable for rapid implementation. |
| **Scope** | Basic FAQ and HR query handling **only**. Not a full conversational AI platform. |
| **Delivery surfaces** | Blue app + WhatsApp Flow |
| **Approach** | Simple, fast to ship. Do not over-engineer for Phase 1. |

### Hypothesis

Frontline employees have recurring, repetitive HR and policy questions (leave balances, payslip queries, safety procedures, company policies). Answering these through a simple FAQ chatbot — without requiring HR staff intervention — reduces support load and delivers immediate perceived AI value to clients.

tawk.to enables rapid deployment of a structured FAQ bot without custom AI infrastructure, making this a genuine quick win rather than a multi-month build.

### Scope (Phase 1 — fast ship)

- **FAQ bot** — Pre-configured answers to the most common HR and policy questions (leave, payslips, safety contacts, onboarding info)
- **Accessible from Blue app** — In-app chat surface
- **Accessible via WhatsApp Flow** — WhatsApp as a delivery channel for FAQ interactions
- **tawk.to as the engine** — No custom AI infrastructure required for Phase 1
- **HR-grounded responses** — Answers constrained to approved company content (not open-ended AI generation)
- **Escalation path** — Unanswered queries routed to HR inbox or human agent

### Relationship to other PRDs

| PRD | Relationship |
|-----|-------------|
| [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) | Smart HR is #1 priority and handles structured HR data (payslips, leave, roster via HRIS). This is #2 and handles unstructured FAQ/policy content. They share the WhatsApp Flow delivery surface. |
| *(Future conversational assistant)* | Phase 1 is FAQ-only; broader assistant vision is not tracked in a separate vault PRD yet. |
| [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md) | Chat is #3 priority. Separate surface — peer/team messaging vs bot. |

### Dependencies

- WhatsApp outbound ([Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) Part 2 — Essential, live at GA)
- WhatsApp Flow infrastructure (being evaluated by Jan for Smart HR — shared dependency)
- tawk.to account setup and configuration
- HR/policy content sourced and structured by client (or Wyzetalk implementation team)

### Open questions (pre-discovery)

- How does tawk.to integrate with WhatsApp Business API and WhatsApp Flow?
- **Content management:** who updates FAQ answers on an ongoing basis, how often, and approval workflow — *workspace tenancy is Wyzetalk-operated per pilot 2026-04-17; content ops still TBD.*
- ~~Is this Wyzetalk-configured per tenant or client self-serve?~~ **Resolved (pilot 2026-04-17):** tawk.to **workspace is Wyzetalk-operated** per tenant for Phase 1 GA; client self-serve of tawk accounts is out of scope for GA.
- POPIA/GDPR: tawk.to conversation data residency — where is it stored?
- Escalation: does tawk.to support live agent handoff within the same interface?
- Will Phase 1 tawk.to be reusable or replaced when the broader AI Assistant platform matures?

---

## Acceptance criteria (BDD)

*Not yet authored — discovery stub. When promoting toward `spec_ready`, add Given/When/Then rows here and link checks in **Validation Protocol**.*

---

*Promote toward `spec_ready` when discovery closes. Fast-ship target — aim to have discovery complete by May 2026. See [README.md](./README.md) for lifecycle.*

*Agent-prd retrofit — 2026-04-17 · collaborative pilot decisions merged — 2026-04-17*
