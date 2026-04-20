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
  - This PRD Phase 2: Revisit Technical Blueprint when tawk.to ↔ WhatsApp Flow (**FAQ path only**) integration is validated (WhatsApp/Flow program work may precede elsewhere)
  - Pilot tawk.to Shortcuts + Suggested Message chains on one tenant; measure tap-through vs free-text for frontline cohort
---

# AI Assistant — FAQ & HR Queries (Rapid Deployment)

**Status:** Discovery — binding agent-oriented spec (retrofit)  
**Target:** Frontline (blue-collar) employees and HR-adjacent teams needing fast answers to recurring policy/FAQ questions — **primary surface for Phase 1 of this PRD: Blue app**. **FAQ delivery via WhatsApp Flow** is **Phase 2 here** (decoupled from tawk.to Phase 1 — **WhatsApp / Flow stay priorities** on Smart HR & Messaging roadmaps).  
**Estimated Effort:** 20–32 hours agent time for Phase 1 (Blue + tawk.to); +8–16 hours when WhatsApp Flow is picked up (excludes full conversational AI platform)

> **Steerco:** Active stub · **Phase:** Next (post-Essential GA) — **#2 commercial priority** (confirmed 2026-03-30)
>
> *Scope is intentionally narrow — ship quickly, learn, then expand. A fuller conversational assistant roadmap may follow in later phases.*

**Program vs this PRD:** **WhatsApp** and **WhatsApp Flow** remain **high portfolio priorities** (e.g. [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)) — nothing here downranks that. What is **decoupled** is only **this PRD’s Phase 1 scope**: ship **FAQ/policy via tawk.to in Blue** first, **without** making tawk.to GA depend on building the **FAQ-on-WhatsApp-Flow** integration. The Flow path for *this* FAQ product is **Phase 2** in *this* document; Flow and WhatsApp work proceed on their own tracks elsewhere.

*Created: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

### Collaborative pilot (product decisions — 2026-04-17)

Captured during a **pilot-only** `/agent-prd` session (questions before treating the spec as locked):

| Decision | Shaun’s call |
|----------|----------------|
| **tawk.to tenancy (Phase 1)** | **Wyzetalk-operated** workspaces/properties per tenant — not client-owned tawk.to accounts for GA. |
| **Phase 1 GA scope** | **Blue app + tawk.to** — ship FAQ/policy chat in-app first. **FAQ-on-WhatsApp-Flow** is **Phase 2 in this PRD** (not in the same delivery slice as tawk.to depth work). **WhatsApp / Flow remain program priorities**; they are **not** deprioritized — only **ungated** from this FAQ milestone. Extra discovery goes to tawk.to (policy ingestion, guided flows, frontline UX). |
| **FAQ engine** | **tawk.to stays locked** as the engine; leadership choice stands — only integration patterns may change in discovery. |

*Content ownership (who edits FAQ copy on an ongoing basis) remains in Open questions below.*

---

## The Job to Be Done

Employees can get accurate, HR-approved answers to common FAQ and policy questions from a single chat experience in the **Blue app** (Phase 1 of this PRD), without waiting for a human, with **tap-first guided paths** where helpful for low-literacy or low-patience users, and a clear path to escalation when the bot cannot answer. **Exposing this same FAQ bot via WhatsApp Flow** is Phase 2 **in this PRD** — separate from company-wide WhatsApp investment, which stays priority on [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) and [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md).

**User value:** Cuts HR/support load, matches competitor “AI quick win” positioning, and delivers tangible AI value to clients without building a custom LLM platform in Phase 1.

---

## tawk.to — policy ingestion, guided prompts, frontline UX (discovery)

**Sources:** [Understanding AI Assist’s Data Sources](https://help.tawk.to/article/understanding-ai-assist%E2%80%99s-data-sources), [Setting up your Knowledge Base](https://help.tawk.to/article/setting-up-your-knowledge-base), [Suggested Messages and AI Questions](https://help.tawk.to/article/suggested-messages-and-ai-questions) (tawk.to Help Center, retrieved 2026-04-17).

### Client policies → answers (Wyzetalk service shape)

tawk.to **AI Assist** can combine multiple **data sources** so uploaded client material feeds the same bot that employees use in Blue:

| Source type | Fit for client policies / HR docs |
|-------------|-------------------------------------|
| **Documents** | **PDF, CSV, TXT** — add per property; text must be copy-extractable (scanned images without OCR are weak). AI reads snippets (~3,300 chars per chunk per vendor doc). |
| **Knowledge Base articles** | Good for structured chapters (leave, safety, conduct). When AI Assist is on, KB is a **data source**. |
| **FAQs** | Q/A pairs; **CSV batch import**; per-row limits (question ≤255 chars, answer ≤1,000 chars — long answers must be split or moved to KB/Documents/Text). |
| **Plain Text** | Short global context per AI agent (tone, disclaimers, escalation rules). |
| **Shortcuts** | Templated answers + attachments; can pair with guided UI (below). |

**Operational implication:** Wyzetalk can standardize an **ingestion playbook** for tenants: receive policy PDFs → QA text extractability → upload to **Documents** and/or split into **KB articles** / FAQ rows → tune **Base Prompt** (tone, “only use sources,” escalation) → test with preview “which sources were used” indicator in dashboard.

### Guided prompts — is it possible?

**Yes, with important nuance.** tawk.to supports **tap-first guided paths** alongside free-text chat:

- **Suggested Messages:** Up to **four** clickable buttons per Shortcut response — vendor guidance: **simple language, under 10 words per button**, no internal jargon ([Suggested Messages and AI Questions](https://help.tawk.to/article/suggested-messages-and-ai-questions)).
- **Chained flows:** A Shortcut response can include Suggested Messages that trigger the **next** Shortcut (scripted sequences).
- **AI Questions:** Hidden matching phrases on Shortcuts so **AI Assist** routes typed *or* tapped input to the **exact** templated reply (predictable, HR-approved wording when “Revise answer based on context” is off).
- **Triggers / pre-chat:** Automation and pre-chat forms can start structured flows ([scripted sequences guide](https://help.tawk.to/article/using-suggested-message-and-ai-assist-to-create-scripted-chat-sequences)).

**Nuance for ~90% blue-collar / frontline users:** Visitors **can still ignore buttons and type freely**; AI Assist then answers from **data sources + Base Prompt**. Mitigations for Phase 1 product design:

1. **Open with Suggested Messages** on greeting (top intents: Leave, Pay, Safety, Talk to someone).  
2. **Base Prompt** tuned for **short, plain** replies, local language if supported, and **mandatory escalation** when confidence/source match is weak ([restrict replies](https://help.tawk.to/article/using-base-prompt-to-restrict-ai-assist-replies) / escalation patterns per vendor).  
3. **Avoid over-reliance on long PDF-only** answers — break policies into **shortcuts + KB** so guided taps return **readable** chunks, not walls of text.  
4. **Human handoff** remains a Shortcut action (transfer to department/agent) for low-literacy or frustrated users.

**Verdict:** tawk.to is **suitable for guided self-service** for frontline workers **if** product invests in **Shortcut + Suggested Message** design and **policy chunking** — **Meta Flow–style** structured screens are a **different** channel (still a priority elsewhere); tawk.to delivers **strong button-led** chat inside the widget for Phase 1.

### Vendor limits to track in implementation

- AI Assist pulls **up to five** relevant chunks per reply; duplicate content across sources hurts accuracy — **dedupe** in ingestion playbook.  
- **AI Assist message quotas / overages** apply (billing).  
- Images in PDFs/websites are **not** analyzed; tables on websites may be incomplete.

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
WP-1 (P0) ──> WP-2, WP-3 (Phase 2 — FAQ-on-Flow; decoupled from tawk Phase 1)
WP-2 (P0, deps: WP-1) ──> WP-4 ──> Phase 1 release candidate (Blue + tawk.to)
WP-3 (P1/P2, deps: WP-1; Messaging PRDs) ──> WP-4 extension ──> dual-channel GA (future)
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

### WP-3: WhatsApp Flow — FAQ path (**Phase 2 — this PRD only**)

**Priority:** P1/P2 for **this** FAQ product (not Phase 1 GA here)  
**Rationale (clarity):** **WhatsApp and WhatsApp Flow stay portfolio priorities** — owned and advanced primarily via [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) and [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md). **This WP** only **decouples**: the **tawk.to FAQ** milestone does **not** wait on hooking that bot into Flow. When program Flow surfaces and handoff patterns are ready, **add** the FAQ entry path (WP-3) to the same tawk.to engine — second channel UAT, not a statement that WhatsApp is “later” company-wide.

**Dependencies:** WP-1; product dependency on Messaging PRDs WhatsApp/Flow readiness  
**Files:** Flow definitions (TBD); integration with Smart HR shared surfaces  
**VPS-eligible:** Partial (backend flows yes)

| # | Behavior | Observable |
|---|----------|------------|
| 3a | User can start FAQ interaction from approved WhatsApp Flow entry | Flow reaches tawk.to or handoff endpoint |
| 3b | Behaviour stays FAQ-scoped (no live HRIS data in this path) | No payroll/leave API calls in the FAQ Flow path |

### WP-4: Content, escalation, and compliance (P1 — Depends on WP-2)

**Priority:** P1  
**Dependencies:** WP-2 (Phase 1). When WP-3 ships, re-run UAT for **second channel** (WhatsApp).  
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
**Success Criteria:** Escalation path verified in UAT with a test message end-to-end **from Blue app** (Phase 1). When WhatsApp Flow ships (Phase 2), repeat once for that channel.

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
- **GA gate (revised 2026-04-17):** **Blue app + tawk.to** for **this PRD’s** Phase 1 GA. **FAQ-on-WhatsApp-Flow** is **Phase 2 here** — prior “both channels for GA” pilot language for *this FAQ product* is superseded. **WhatsApp / Flow program priority is unchanged**; other PRDs continue Flow work on their timelines.  
- **Scope:** FAQ and HR *policy* queries only — not full conversational AI; no custom model training in Phase 1.  
- **No live HRIS lookups** in Phase 1 ([Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) owns structured data).  
- **Responses** must be grounded in approved content, not open-ended generation.

---

## Technical Blueprint

### System Integration Map

```text
Employee --> Blue_app --> tawk_to_widget --> tawk_to_cloud
Employee --> WhatsApp --> WhatsApp_Flow --> [handoff_TBD] --> tawk_to   # Phase 2 — deferred
tawk_to --> escalation --> HR_inbox_or_agent
```

Cross-PRD: WhatsApp / Flow infrastructure and investment live under [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (Part 2) and [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) — **remain priorities**. **This PRD:** Phase 1 = Blue + tawk.to; **attaching this FAQ bot to Flow** = Phase 2 **here** (does not block other WhatsApp work).

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

# Check 3.1: WhatsApp Flow still tracked (Phase 2 for this PRD’s FAQ-on-Flow path)
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

1. tawk.to **AI Assist** data sources + **Shortcuts / Suggested Messages** for guided frontline UX (vendor Help Center — links in **tawk.to capability review** below).  
2. tawk.to integration with WhatsApp Business API / Flow when Phase 2 is scheduled (vendor + Meta documentation).  
3. POPIA/GDPR data residency and subprocessors list for tawk.to.

**Worker tasks:**

1. Confirm embed vs redirect model for Blue app.  
2. **Service design:** client policy PDFs → Wyzetalk ingestion checklist (Documents + KB articles + FAQ rows; chunking for AI Assist limits) per vendor docs.  
3. Prototype **guided shortcut chains** (Suggested Messages: short labels, ≤4 buttons per step) for 2–3 top intents; validate with frontline pilot users.  
4. **This PRD Phase 2:** FAQ → Flow handoff prototype when product chooses to attach this bot to Flow (Messaging / Smart HR timelines may already be advancing WhatsApp elsewhere).  
5. Define FAQ content workflow and escalation roster.

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
| **Delivery surfaces** | Blue app (Phase 1 for this PRD) + **FAQ via** WhatsApp Flow (Phase 2 **here**). **WhatsApp / Flow remain priorities** on other roadmaps. |
| **Approach** | Simple, fast to ship. Do not over-engineer for Phase 1. |

### Hypothesis

Frontline employees have recurring, repetitive HR and policy questions (leave balances, payslip queries, safety procedures, company policies). Answering these through a simple FAQ chatbot — without requiring HR staff intervention — reduces support load and delivers immediate perceived AI value to clients.

tawk.to enables rapid deployment of a structured FAQ bot without custom AI infrastructure, making this a genuine quick win rather than a multi-month build.

### Scope (Phase 1 — fast ship)

- **FAQ bot** — Pre-configured answers to the most common HR and policy questions (leave, payslips, safety contacts, onboarding info)
- **Accessible from Blue app** — In-app chat surface
- **Accessible via WhatsApp Flow (Phase 2)** — same FAQ engine (tawk.to); channel work deferred
- **tawk.to as the engine** — No custom AI infrastructure required for Phase 1
- **HR-grounded responses** — Answers constrained to approved company content (not open-ended AI generation)
- **Escalation path** — Unanswered queries routed to HR inbox or human agent

### Relationship to other PRDs

| PRD | Relationship |
|-----|-------------|
| [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) | Smart HR is **#1 priority** and handles structured HR data (payslips, leave, roster via HRIS). This PRD is **#2** (FAQ/policy via tawk.to). **WhatsApp / Flow stay central to Smart HR**; **this** PRD’s Phase 2 is only “**also** surface the tawk FAQ via Flow when integrated” — not a competition with Smart HR’s Flow roadmap. |
| *(Future conversational assistant)* | Phase 1 is FAQ-only; broader assistant vision is not tracked in a separate vault PRD yet. |
| [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md) | Chat is #3 priority. Separate surface — peer/team messaging vs bot. |

### Dependencies

- WhatsApp outbound ([Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) Part 2 — Essential, live at GA) — **remains priority**; independent of this PRD’s Phase 1.
- WhatsApp Flow infrastructure (Smart HR / Messaging — **ongoing priority**). **This PRD** adds a **FAQ-on-Flow** dependency only for **Phase 2** of *this* scope (tawk handoff), not for Blue + tawk.to GA.
- tawk.to account setup and configuration
- HR/policy content sourced and structured by client (or Wyzetalk implementation team)

### Open questions (pre-discovery)

- For frontline-only UX: does tawk.to widget support **disabling or de-emphasizing** free-text input so flows are **primarily** tap-driven? (If not, product relies on greeting Shortcuts + Base Prompt — confirm in widget/SDK docs.)
- How does tawk.to integrate with WhatsApp Business API and WhatsApp Flow? (**Phase 2**)
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

*Agent-prd retrofit — 2026-04-17 · collaborative pilot decisions merged — 2026-04-17 · FAQ-on-Flow = Phase 2 in this PRD (decoupled from tawk Phase 1); WhatsApp/Flow remain program priorities — clarified 2026-04-17 · tawk.to guided-flow + policy ingestion review — 2026-04-17*
