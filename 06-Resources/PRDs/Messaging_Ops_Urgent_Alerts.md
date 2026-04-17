---
prd_id: messaging-ops-urgent-alerts
lifecycle: done
created_date: 2026-04-17
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Keep WhatsApp Part 2 aligned with Tenant §9 and Smart HR roadmap
---

# Messaging: Ops & Urgent Alerts

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Admins sending **Urgent** (takeover + feed pin) vs **operational** messages with channel mix; WhatsApp outbound Part 2  
**Estimated Effort:** Large spec — Part 2 is long-form below

---

> Lighter spec derived from the Messaging discovery document. Covers urgent alerts with app takeover, operational messages with channel control, acknowledgement tracking, and cost reporting.

**Related PRDs:** [Groups.md](./Groups.md) (audience: Everyone / saved / directory / new group — same primitives as [Posts](./Posts.md)), [Feed.md](./Feed.md) + [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) (**pinned urgent** on the business feed), [communication_service.md](./communication_service.md) (channels), [Tenant_Management.md](./Tenant_Management.md) (currency / SMS rates / **WhatsApp toggle**). **WhatsApp outbound** is **Part 2** of this document ([§ WhatsApp Channel](#whatsapp-channel--outbound-messaging)). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Organisations send **true emergencies** via protected urgent flows (takeover + feed pin) and **routine ops** via standard messaging — with acknowledgement, cost visibility, and **WhatsApp** as a registered channel — without training employees to ignore urgent.

**User value:** Trust + cost control; prerequisite for [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) two-way evolution.

---

## Work Packages

### WP-Urgent: Takeover + feed pin (P0)

**Priority:** P0  
**Dependencies:** [Feed.md](./Feed.md) PIN-* BDD  
**Files:** Client TBD  
**VPS-eligible:** No

### WP-Ops: Standard / operational send (P0)

**Priority:** P0  
**Dependencies:** [communication_service.md](./communication_service.md)  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-WhatsApp: Part 2 outbound (P0)

**Priority:** P0  
**Dependencies:** WABA; [Tenant_Management.md](./Tenant_Management.md)  
**Files:** See Part 2 below  
**VPS-eligible:** Partial

### WP-Cost: Reporting & acknowledgement (P1)

**Priority:** P1  
**Dependencies:** WP-Ops  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- Urgent vs ops messages routed per BDD; no ops content wrongly pinned as urgent.  
- WhatsApp opt-in and tenant toggle respected (Part 2).

---

## Satisfaction Metric

**Overall Success:** Messaging + WhatsApp BDD sections pass **≥ 95%** (target).

**Measured by:** QA + cost report sampling.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Delivery/read/cost events — [Product_Analytics.md](./Product_Analytics.md).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Audience primitives** match Posts/Groups.  
- **PIN** coordination with Feed BDD.  
- **Part 2** WhatsApp is canonical outbound channel doc.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Messaging orchestrator | TBD |
| WABA integration | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Messaging_Ops_Urgent_Alerts.md"
# PASS: >= 1

grep -c "WhatsApp" "06-Resources/PRDs/Messaging_Ops_Urgent_Alerts.md"
# PASS: >= 1
```

**Manual:** Multi-channel send tests; WhatsApp template QA.

---

## Notes for Agent Implementation

**Scout priorities:** Scheduled operational send handoff to [Scheduled_Content.md](./Scheduled_Content.md).  
**Soldier review:** Misuse guardrails for urgent channel.

---

## Files to Create / Modify

```
# TBD — see Part 1 & Part 2 body
```

---

## Out of Scope

- **Smart HR** conversational two-way — [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md).

---

# Problem Statement

Emergency Comms and SMS are used as a catch-all messaging tool because they're the fastest and most reliable way to reach employees. But the platform doesn't differentiate between urgent, critical communications and routine operational messages. This causes message fatigue (reducing effectiveness of true emergencies), higher messaging costs, slower response times during real crises, and customer frustration from misusing urgent channels for day-to-day needs. Harmony (95% of messaging via [[Wyzetalk]], 5–15 messages/day) and mining client interviews confirm strong demand for both targeted operational messaging and a protected emergency channel.

---

# Goals

1. **Protect the emergency channel** — Urgent alerts must be high-trust, high-signal, and impossible to miss via app screen takeover.
1. **Enable fast, targeted operational messaging** — Admins can send SMS-only or notification-only messages to individuals or small groups without alert fatigue.
1. **Reduce misuse of urgent alerts** — Clear separation and guardrails so clients use the right channel for the right message.
1. **Provide delivery and cost visibility** — Admins see estimated cost before sending, delivery status after, and acknowledgement rates for urgent alerts.
1. **Ensure multi-channel reliability** — Urgent alerts go out on all channels; operational messages on admin-selected channels.
---

# Non-Goals

- **WhatsApp two-way / conversational messaging** — One-way broadcast only. Reply handling, chatbots, and smart HR via WhatsApp are Phase 2+. See [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) §Future Considerations.
- **Two-way messaging / chat** — This is broadcast messaging only. Conversational messaging is a separate initiative.
- **Advanced delivery intelligence (queued send-out time estimates)** — Phase 2.
- **PDF/media attachments on urgent alerts** — Desirable but out of Phase 1 scope.
- **Linking alerts to content pages** — Future phase.
---

# User Stories

**Urgent Alerts:**

- As an **admin**, I want to send an urgent alert that takes over every employee's app screen so that no one can miss a critical safety communication.
- As an **admin**, I want employees to confirm they've seen the alert before they can continue using the app so that I have proof of acknowledgement.
- As an **admin**, I want to resolve an active alert and send a compulsory resolution update so that employees know the situation has changed.
- As an **admin**, I want to see a confirmation modal with recipient count and estimated cost before sending so that I don't accidentally send to the wrong audience.
**Operational Messages:**

- As an **admin**, I want to send an SMS-only message to a single employee so that I can handle operational needs (e.g. "report to HR") without creating feed noise.
- As an **admin**, I want to choose my delivery channel (SMS only, notification only, SMS + notification, email) so that I control how the message reaches employees.
- As an **admin**, I want to send a message to a small group of 3–4 people selected from the directory so that I can target precisely.
**Analytics & Reporting:**

- As an **admin**, I want to see delivery status (sent, delivered, failed, pending) for every message so that I know if my communication reached people.
- As an **admin**, I want to see monthly messaging spend separated by urgent vs operational so that I can manage costs.
**Edge Cases:**

- As an **employee who opens the app during an active alert**, I want to see the takeover screen immediately so that I don't miss the emergency.
- As an **employee**, I want operational messages to never override my silent mode or require acknowledgement so that non-urgent messages don't disrupt me.
---

# Requirements

## Skeleton

### Urgent Alerts

- [ ] Sent on all enabled channels (SMS, push, in-app, **and WhatsApp if enabled for the tenant** — see [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging)). Channel selection is not optional for Urgent Alerts. Overrides silent mode.
- [ ] **App Screen Takeover:** Full-screen, non-dismissable overlay. User must confirm before continuing. Re-triggered if alert is updated. Shown on app launch if alert is already active.
- [ ] **Pinned Feed:** Pinned at top, expanded by default, collapses on scroll, re-expandable.
- [ ] Required message elements: sender (company name), threat description, location, protective action, timing.
- [ ] Mandatory 160-character SMS version with character limit validation.
- [ ] Admin setup: Title (mandatory), Body (mandatory), Audience (Everyone / Saved group / Directory / New group).
- [ ] Pre-send confirmation modal: warning copy, recipient count, estimated cost.
- [ ] States: Draft → Active → Active (Updated) → Resolved → Resolved (Expired) → Deleted.
- [ ] On resolve: admin must send compulsory resolution update.
### Operational Messages

- [ ] Never labelled as urgent. Never pinned. Never triggers takeover. Never overrides silent mode. Never requires acknowledgement.
- [ ] Audience: Everyone, Saved group, Directory selection, New group. Supports 1:1 and group messaging.
- [ ] Admin selects channel(s): SMS-only, notification-only, SMS + notifications, email, **WhatsApp** (selectable if enabled for tenant — see [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging)).
- [ ] States: Draft → Sent → Deleted → Archived.
### Acknowledgement & Analytics

- [ ] Track for all messages: Sent, Delivered, Failed, Pending, Channels used, Timestamps, Unique recipients.
- [ ] Urgent alerts additionally: end-user confirmation status, admin response time (time to resolve).
### Costing

- [ ] Display estimated cost before send, cost per message, monthly spend.
- [ ] Separate urgent vs standard costs. Separate SMS vs in-app/push vs **WhatsApp** (conversation-based pricing — Utility category for Urgent Alerts). See [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) §Costing.
- [ ] Tenant currency and SMS rate configured at tenant level (admin-only).
## Flesh

- [ ] Light AI validation on urgent alert content to confirm required emergency elements are present.
- [ ] SMS provider delivery feedback surfaced in urgent alert reporting.
- [ ] FCM feedback loop: detect uninstalled apps / expired tokens, suppress from future non-urgent sends.
## Future

- [ ] PDF/media attachments on urgent alerts.
- [ ] Link to content page from an alert.
- [ ] Queued send-out time estimates ("delivery may take ~1–9 minutes").
- [ ] ~~WhatsApp as a delivery channel~~ — **Delivered. See [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging).**
- [ ] Concurrent/linked emergency alerts with timeline view.
---

# Success Metrics

**Leading:**

- Urgent alert acknowledgement rate (target: >95% within 15 minutes)
- Operational message adoption (% of total messages sent as standard vs urgent) (target: >60% standard within 3 months)
- Pre-send confirmation → cancel rate (indicator of accidental sends prevented)
**Lagging:**

- Reduction in non-urgent messages sent as emergency alerts (target: -70% within 6 months)
- SMS cost predictability (actual vs estimated cost variance <10%)
- Fewer cancelled or mis-sent emergency alerts
- Increase in 1:1 and small-group operational message usage
---

# Open Questions

- **[Steerco]** Is estimated cost per alert included in Phase 1, or deferred?
- **[Engineering]** How does app screen takeover work when the user is offline and later opens the app?
- **[Product]** Should operational messages support scheduled send (send later)?
- **[Engineering]** What is the expected delivery time for an urgent alert to 10,000+ users across all channels?
- **[Legal]** Are there regulatory requirements for emergency alert content or delivery in specific countries (e.g. mining safety regulations)?
- **[Product]** Should admins be able to edit a sent operational message, or only delete?
---

# Timeline Considerations

- **Dependency:** Groups system must be built (audience targeting).
- **Dependency:** Communication service (SMS, push, email delivery).
- **Dependency:** Tenant Management (currency + SMS rate config).
- **Suggested phasing:** Urgent alerts with takeover + pinned feed (Phase 1a) → Operational messages with channel control (Phase 1b) → Cost reporting + analytics (Phase 1c).

---

## Acceptance criteria (BDD)

**Source PRD:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)
**Related:** [Groups.md](./Groups.md) (audience), [communication_service.md](./communication_service.md) (channels), [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) (PIN-* pinned urgent), [Tenant_Management.md](./Tenant_Management.md) (currency, SMS rates, **WhatsApp config — TC-24 to TC-36**), [Notifications.md](./Notifications.md) (in-app surfaces), [WhatsApp BDD](./Messaging_Ops_Urgent_Alerts.md#acceptance-criteria-bdd--whatsapp-channel) (WA-19 to WA-29 in Part 2).
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md)  
**Use:** Eng / QA / design review — **human-owned**.

---

## Scope reminder

- **Urgent:** all enabled channels, **no** channel opt-out for send, **app takeover** (non-dismissable until ack), **pinned feed** block (expanded/collapse), mandatory SMS 160-char, pre-send cost modal, lifecycle states through Resolved/Deleted.  
- **Operational:** never urgent semantics — **no** takeover, **no** pin, **no** silent override, **no** mandatory ack; channel mix admin-selected.  
- **WhatsApp delivery:** now in scope — ACs in Part 2 ([WhatsApp BDD](./Messaging_Ops_Urgent_Alerts.md#acceptance-criteria-bdd--whatsapp-channel)) (WA-19 to WA-29).
- **Out Phase 1:** Two-way WhatsApp / chat, PDF attachments, queued time estimates.

---

## Acceptance criteria — Urgent alerts

| ID | Criterion |
|----|-----------|
| URG-01 | **Given** an urgent alert is **Active** **when** an employee opens the app **then** **full-screen takeover** appears before normal navigation; user **cannot** proceed without acknowledgement. |
| URG-02 | **Given** the alert is **updated** **when** the employee next foregrounds the app **then** takeover **re-shows** until acknowledged for the new version *(per PRD “re-triggered if updated”)*. |
| URG-03 | **Given** admin composes urgent content **when** saving/sending **then** required elements are present: sender/company, threat description, location, protective action, timing *(+ PRD “light AI validation” if implemented)*. |
| URG-04 | **Given** SMS leg **when** admin enters body **then** **160 characters** max enforced with validation errors before send. |
| URG-05 | **Given** admin initiates send **when** confirmation opens **then** modal shows **warning copy**, **recipient count**, **estimated cost**; Cancel and Confirm both work. |
| URG-06 | **Given** audience selection **when** configuring **then** options match Groups primitives: **Everyone**, **Saved group**, **Directory**, **New group** — same as Posts/Messaging PRD. |
| URG-07 | **Given** admin **resolves** an alert **when** resolving **then** **compulsory resolution update** is required before state moves to resolved per lifecycle. |

---

## Acceptance criteria — Pinned feed (coordination with Feed AC)

| ID | Criterion |
|----|-----------|
| PIN-XREF-01 | Pinned urgent behaviour on the business feed matches **[Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) PIN-01–PIN-06** and **SF-05** (pin visible during search). |

---

## Acceptance criteria — Operational messages

| ID | Criterion |
|----|-----------|
| OPS-01 | **Given** operational message **when** delivered **then** it is **never** labelled urgent, **never** pinned to feed, **never** triggers takeover, **never** overrides silent mode, **never** requires acknowledgement. |
| OPS-02 | **Given** admin creates operational send **when** choosing channels **then** allowed combinations include SMS-only, notification-only, SMS+notification, email *(per PRD)*. |
| OPS-03 | **Given** 1:1 or small directory selection **when** sending **then** audience matches Groups/directory behaviour. |

---

## Acceptance criteria — Analytics & cost

| ID | Criterion |
|----|-----------|
| AN-01 | **Given** any send **when** completed **then** statuses include at least: Sent, Delivered, Failed, Pending, channels used, timestamps, unique recipients *(per PRD)*. |
| AN-02 | **Given** urgent **when** reporting **then** acknowledgement status and **time-to-resolve** are available to admins. |
| COST-01 | **Given** pre-send **when** modal shows cost **then** tenant **currency** and **SMS rate** come from tenant config ([Tenant_Management.md](./Tenant_Management.md)). |
| COST-02 | **Given** reporting views **when** admin opens spend **then** urgent vs operational and SMS vs in-app/push are **separable**. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Offline** | User offline during urgent | Queue takeover on next open; align with PRD open question on offline. |
| **Concurrent urgencies** | Multiple active | Match Feed AC PIN-06 / product decision single vs multiple. |
| **Cost estimate** | Unknown audience size | Block or show range — **steerco**. |
| **Operational** | Admin selects email only | No push/SMS; respects OPS-01. |

---

## Resolved product decisions *(from Feed AC / map)*

| Topic | Decision | Notes |
|--------|-----------|--------|
| **Operational vs feed** | Operational **not** feed-pinned | Per PRD; business feed stays clean. |

---

## Outstanding

- **Estimated cost in Phase 1** — PRD open question (Steerco).  
- **Legal** mining/safety regulations by jurisdiction — compliance review.  
- **Edit sent operational** — PRD open question.

---

*Review with Feed AC and communication_service AC together.*

---

# WhatsApp Channel — Outbound Messaging

---

> Spec for WhatsApp as an additional one-way outbound delivery channel for Urgent Alerts and Standard Messages. Phase 1 is strictly broadcast-only: no inbound reading, no reply handling, no conversational AI. This picks up the "WhatsApp — Future phase" items parked in [communication_service.md](./communication_service.md) and Part 1 of this document.

**Related PRDs:** Part 1 above (the two message types WhatsApp delivers), [communication_service.md](./communication_service.md) (channel delivery layer), [Tenant_Management.md](./Tenant_Management.md) (WhatsApp config added here), [Profile_Users.md](./Profile_Users.md) (employee opt-in preference). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-002](../Market_and_competitive_signals.md) | Market: TA vendors now shipping frontline flows on SMS/WhatsApp — same channel employees associate with deskless comms. Validates adding WhatsApp as a standard delivery channel for employee messaging. |
| [EV-2026-03-004](../Market_and_competitive_signals.md) | Market: 70% of employee–system interactions shifting to conversational interfaces; 98% SMS read rate. WhatsApp is not just preferred — it is where frontline workers already live. |

---

## Problem Statement

Frontline employees, particularly in deskless environments (mining, manufacturing, retail, logistics), have high WhatsApp penetration and low email / push notification reliability. The current [[Wyzetalk]] platform reaches employees via SMS, push, and in-app notification — channels that are either costly (SMS), dependent on app installation (push), or invisible to employees who don't open the app (in-app). There is also an existing legacy WhatsApp solution in the old platform (one-way, broadcast-only), which validates the channel's feasibility and employee familiarity.

The result: critical Urgent Alerts don't reach every employee, and Standard Messages are ignored or missed by workers who predominantly use WhatsApp as their primary communication channel.

Adding WhatsApp as a first-class outbound delivery channel closes this gap — without introducing conversational complexity, compliance risk from unmonitored replies, or scope creep into two-way messaging.

---

## Goals

1. **Extend reach** — WhatsApp becomes an additional delivery channel alongside SMS, push, and email. The existing messaging types (Urgent Alert, Standard Message) are delivered over WhatsApp without requiring architectural changes to the message creation flow.
2. **Keep it simple (Phase 1)** — One-way, outbound only. Two approved message templates. No reply handling. No bots.
3. **Make it configurable per tenant** — WhatsApp is opt-in at the tenant level. Each tenant connects their own WhatsApp Business Account and manages templates.
4. **Respect employee opt-in** — WhatsApp delivery requires explicit employee consent (Meta policy). No opt-in = no WhatsApp messages. Opt-out is instant and permanent until employee re-opts in.
5. **Give admins cost visibility** — WhatsApp has its own pricing model (per conversation, not per message). Admins see estimated WhatsApp cost before sending, alongside SMS cost, using the same pre-send confirmation pattern.

---

## Non-Goals (Phase 1 — strict)

- **Two-way / conversational messaging** — Replies from employees are not read, processed, or displayed anywhere in the platform. This is a one-way broadcast channel.
- **WhatsApp chatbots or AI assistant** — No smart HR, no payslip access via WhatsApp, no automated reply flows. These are Phase 2+ (see Future Considerations).
- **Forms or surveys via WhatsApp** — Not in Phase 1.
- **Learning modules via WhatsApp** — Not in Phase 1.
- **WhatsApp as the primary channel for OTPs or account activation** — SMS remains the activation channel. WhatsApp is for post-activation messaging only.
- **Custom per-tenant template design** — Phase 1 uses two platform-level approved templates (Urgent Alert, Standard Message). Tenant-level template customisation is Phase 2.
- **Media attachments via WhatsApp** — Text-only templates in Phase 1. Image/document support is Phase 2.
- **Shared / pooled WABA across tenants** — Each tenant connects their own WhatsApp Business Account to maintain brand identity and regulatory independence.

---

## How WhatsApp Fits into the Existing Messaging Model

The existing messaging model has two types ([Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)):

| Message Type | Existing channels | WhatsApp adds |
|---|---|---|
| **Urgent Alert** | All channels (SMS + push + in-app). Non-optional, overrides silent mode. | WhatsApp as an additional mandatory channel when enabled for the tenant. |
| **Standard Message (Operational)** | Admin selects: SMS-only / push-only / SMS+push / email. | WhatsApp added as a selectable channel option. |

WhatsApp does not replace SMS or push — it supplements them. The admin's message creation flow does not change; WhatsApp is simply an additional channel checkbox / automatic include.

---

## WhatsApp Business API — Foundational Concepts

*(Context for engineering and product — not user-facing.)*

### How it works
- Wyzetalk uses the **Meta WhatsApp Business API (WABA)** to send outbound messages on behalf of each tenant.
- Business-initiated messages (outbound from Wyzetalk to employees) **must use pre-approved Meta message templates**. Free-form text cannot be sent to users who have not messaged first within a 24-hour window.
- Since Phase 1 is one-way (no reading of replies), all messages are business-initiated and must use templates.
- Templates are submitted to Meta for approval (typically 24–48 hours). A template must be approved before it can be used to send messages.

### Conversation-based pricing (Meta model)
Meta charges **per conversation**, not per individual message:
- A **conversation** = a 24-hour window opened by the first message sent (or received) in that window.
- If you send 3 messages to the same employee within 24 hours, it counts as **one conversation**.
- Conversations are categorised by type — each has a different per-conversation rate:

| Category | What it covers | Use in [[Wyzetalk]] |
|---|---|---|
| **Utility** (Transactional) | Operational updates, alerts, notifications — directly related to an agreed-upon transaction or subscription. Lower cost. | Urgent Alerts; operational Standard Messages. |
| **Marketing** | Promotional content, product updates, offers. Higher cost. | Marketing / announcement Standard Messages (optional, tenant choice). |

- Free tier: 1,000 user-initiated conversations per month per WABA (not relevant for one-way sends, but important if employees reply).
- Pricing varies by country. Tenants must know their per-conversation rate by region before go-live.

### Template structure (Meta)
Each approved template has:
- **Header** (optional): static text, image, video, or document. Phase 1: static text only.
- **Body**: main message copy. Can include variables (e.g. `{{1}}` = employee name, `{{2}}` = alert title).
- **Footer** (optional): static text. Phase 1: opt-out instruction (required by Meta policy).
- **Buttons** (optional): quick-reply or call-to-action. Phase 1: one CTA button "Open App" (deep-links to Wyzetalk app).

---

## User Stories

**Tenant / admin configuration**

- As a **Tenant Owner**, I want to enable WhatsApp as a delivery channel for my tenant so that my employees receive messages on the channel they use most.
- As a **Tenant Owner**, I want to connect my WhatsApp Business Account so that messages arrive from my company's verified WhatsApp number, not a shared generic number.
- As a **Tenant Owner**, I want to see estimated WhatsApp conversation costs before I send a message so that I can manage messaging spend.
- As a **Tenant Owner**, I want to set whether Standard Messages use Utility or Marketing conversation pricing so that I categorise my messages correctly per Meta's policy.

**Admin — sending**

- As an **admin**, I want Urgent Alerts to automatically include WhatsApp delivery (when enabled) so that I don't need extra steps during a crisis.
- As an **admin**, I want to select WhatsApp as a channel option when sending a Standard Message so that I can reach employees without app installation.
- As an **admin**, I want to see the pre-send confirmation modal include WhatsApp recipient count and estimated conversation cost so that I have full visibility before sending.

**Employee — receiving**

- As a **frontline employee**, I want to opt in to receive WhatsApp messages from my employer via the app so that I can choose my preferred communication channel.
- As a **frontline employee**, I want to be able to opt out at any time by replying STOP so that I am never forced to receive WhatsApp messages.
- As a **frontline employee**, I want WhatsApp messages to link back to the Wyzetalk app for full context so that I know where to go for more information.

---

## Requirements

### Must-Have (P0)

#### Tenant Management — WhatsApp Configuration

- [ ] **WhatsApp channel toggle** — Tenant-level ON/OFF. Default: OFF. When OFF, no WhatsApp messages are sent regardless of admin channel selection. When ON, WhatsApp becomes available as a channel across all message types.
- [ ] **WhatsApp Business Account (WABA) setup** — Tenant connects their WABA by providing:
  - WhatsApp Business Account ID
  - Phone Number ID (the specific number to send from)
  - Permanent Access Token (or OAuth app flow — confirm with engineering)
  - Business Display Name (what employees see as the sender in WhatsApp)
- [ ] **Template mapping (Phase 1 — two templates):**
  - *Urgent Alert template:* Tenant provides the Meta-approved template name for urgent alerts. Mapped to Utility (Transactional) conversation category. Non-configurable category — always Utility.
  - *Standard Message template:* Tenant provides the Meta-approved template name for standard messages. Tenant selects conversation category: **Utility** (transactional/operational content) or **Marketing** (promotional/announcement content).
- [ ] **Template variable configuration** — Tenant configures which data fields map to template variables (e.g. `{{1}}` = employee first name, `{{2}}` = message title, `{{3}}` = message body). Validates that all required variables are mapped before the template can be activated.
- [ ] **Per-conversation cost input** — Tenant enters the per-conversation rate (in tenant currency) for each category (Utility, Marketing) based on their Meta pricing for their primary country. Used for pre-send cost estimates; not a billing integration.
- [ ] **WhatsApp opt-in method** — Tenant selects how employee opt-in is collected:
  - Option A: In-app toggle (employee enables WhatsApp notifications in Profile → Notification preferences)
  - Option B: Opt-in during account activation onboarding step (checkbox with explicit consent copy)
  - Both options must be available. Tenant can enable both simultaneously.
- [ ] **Opt-out handling** — Platform must process employee opt-out immediately. Any reply of STOP, UNSUBSCRIBE, or equivalent must set the employee's WhatsApp opt-in status to OFF in the platform. No further WhatsApp messages sent until employee re-opts in.

#### Meta WhatsApp Business API — Integration Layer

- [ ] **API integration** — Platform integrates with the Meta Cloud API (or on-premises API, confirm with engineering). All outbound messages are sent via the approved WABA for the sending tenant.
- [ ] **Message template enforcement** — All outbound WhatsApp messages use pre-approved Meta templates. Free-form messages must not be sent. If a template is not approved, the send fails gracefully with a clear admin error.
- [ ] **Variable injection** — At send time, platform injects the configured variable values into the template (e.g. employee name, message title, message body, app deep-link URL).
- [ ] **Conversation category** — Each message send specifies the correct template category (Utility or Marketing) to Meta. Mismatching category = Meta policy violation; must be prevented at the platform level.
- [ ] **Delivery status webhooks** — Platform receives and processes Meta delivery status callbacks: `sent`, `delivered`, `read`, `failed`. These feed the delivery analytics dashboard (same pattern as SMS delivery tracking in [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)).
- [ ] **Rate limit handling** — Platform handles Meta API rate limits gracefully: queue outbound messages, surface rate limit errors to admins, and retry with exponential backoff.
- [ ] **Opt-out webhook** — Platform receives and processes Meta opt-out events (when employee replies STOP). Updates employee opt-in status immediately. No further messages sent.

#### Employee Opt-In / Opt-Out

- [ ] **Opt-in flag per employee** — Each employee has a `whatsapp_opted_in: true/false` field. Only employees with `true` receive WhatsApp messages. Default: `false` until explicit opt-in action.
- [ ] **In-app opt-in** — Employee can enable/disable WhatsApp notifications in Profile → Notification preferences. Toggle label: "Receive messages on WhatsApp". Enabling shows consent copy: "By enabling this, [Company Name] will send you work updates via WhatsApp to [mobile number]."
- [ ] **Onboarding opt-in** — If tenant enables onboarding opt-in method: during account activation, a consent step is included. Copy: "Would you like to receive updates from [Company Name] on WhatsApp?" Accept / Skip. Not mandatory — employees can activate without opting in.
- [ ] **Opt-out via reply** — When employee replies STOP (or Meta-recognised equivalent), opt-in status is set to OFF immediately. No further messages until employee re-opts in via in-app toggle.
- [ ] **Opt-out confirmation** — When opt-out is processed, the employee receives a final WhatsApp message: "You have been unsubscribed from [Company Name] WhatsApp messages. Reply START or open the app to re-subscribe." (This message is sent using the opt-out confirmation template — a separate Meta-approved template.)
- [ ] **Opt-in count** — Tenant admin can see total opted-in employees vs total workforce in the WhatsApp settings screen.

#### Urgent Alert — WhatsApp Delivery

- [ ] **Auto-include WhatsApp** — When Urgent Alert is sent and WhatsApp is enabled for the tenant, WhatsApp is automatically included as a delivery channel alongside SMS, push, and in-app. Admin cannot deselect it for Urgent Alerts.
- [ ] **Template: Urgent Alert** — Uses the tenant-mapped Urgent Alert template. Template variables injected: Company Name, Alert Title, Alert Body (truncated to template body character limit), deep-link to app. Footer: opt-out instruction per Meta policy.
- [ ] **Conversation category** — Always Utility (Transactional). Not configurable.
- [ ] **Recipient scope** — Sent only to employees in the alert's audience who have `whatsapp_opted_in: true`. Employees without opt-in receive Urgent Alert via other channels (SMS, push) only. Opt-in gap is surfaced in the pre-send confirmation modal.
- [ ] **Pre-send modal — WhatsApp row** — Pre-send confirmation includes: WhatsApp recipient count (opted-in employees in audience), estimated conversation cost (opted-in count × per-conversation Utility rate), and a note if opt-in coverage is below a threshold (e.g. <80% of audience opted in).
- [ ] **Delivery tracking** — WhatsApp delivery status (`sent`, `delivered`, `read`, `failed`) tracked per employee, visible in Urgent Alert delivery report alongside SMS and push.

#### Standard Message — WhatsApp Delivery

- [ ] **WhatsApp as selectable channel** — When Standard Message is created and WhatsApp is enabled for the tenant, "WhatsApp" appears as a channel option in the channel selector alongside SMS, push, email.
- [ ] **Template: Standard Message** — Uses the tenant-mapped Standard Message template. Template variables injected: Company Name, Message Title, Message Body (truncated to template body character limit), deep-link to app (optional, based on message content). Footer: opt-out instruction.
- [ ] **Conversation category selection** — Admin selects Utility or Marketing at send time (not per-template). Selection affects cost estimate and Meta billing. Helper text: "Utility: operational updates, HR info, shift notices. Marketing: promotions, announcements, engagement campaigns."
- [ ] **Recipient scope** — Sent only to employees in the message's audience with `whatsapp_opted_in: true`.
- [ ] **Pre-send modal — WhatsApp row** — Includes WhatsApp recipient count, estimated conversation cost (opted-in count × selected category rate), and opt-in coverage indicator.
- [ ] **Delivery tracking** — WhatsApp delivery status tracked per employee, visible in Standard Message delivery report.

#### Message Templates (Phase 1 — Platform-Level)

Phase 1 ships with two platform-level template structures. Tenants submit these templates to Meta for approval under their WABA before go-live.

**Template 1: Urgent Alert**

```
Header: ⚠️ URGENT — {{company_name}}
Body:   {{alert_title}}

{{alert_body}}

Open the Wyzetalk app for full details and to confirm you have seen this alert.
Footer: Reply STOP to opt out.
Button: Open App [deep-link to app]
```
Category: Utility

**Template 2: Standard Message**

```
Header: {{company_name}}
Body:   {{message_title}}

{{message_body}}

Footer: Reply STOP to opt out.
Button: Open App [deep-link to app] (optional — shown only if message includes app link)
```
Category: Utility or Marketing (set per send)

- [ ] Both template structures documented in the Tenant Onboarding Guide (what to submit to Meta, how to set up variables).
- [ ] Platform validates that the tenant's Meta-approved template name maps to the correct template structure before the first WhatsApp message can be sent.
- [ ] Template status visible in WhatsApp settings: Pending / Approved / Rejected. Sends blocked if status ≠ Approved.

#### Costing & Cost Visibility

- [ ] **Pre-send cost estimate** — Pre-send confirmation modal shows WhatsApp line: opted-in recipient count, category (Utility/Marketing), estimated cost per conversation, total estimated WhatsApp spend. Same pattern as existing SMS cost estimate.
- [ ] **Monthly spend reporting** — WhatsApp conversation spend tracked separately from SMS spend in the Messaging cost report. Broken down by: conversation category (Utility / Marketing), message type (Urgent Alert / Standard Message), total conversations, total estimated cost.
- [ ] **Currency** — Uses the tenant-configured currency from Tenant Management (already exists).
- [ ] **Disclaimer** — Cost estimates are indicative only, based on tenant-entered per-conversation rates. Actual Meta billing may vary. Displayed in the cost report.

#### Delivery Analytics

- [ ] **Per-message delivery status** — For each WhatsApp message send: `queued`, `sent`, `delivered`, `read`, `failed` tracked per employee.
- [ ] **Failed delivery reason** — Where Meta returns a failure reason (invalid number, opt-out, template rejected, API error), surface the reason in the delivery report.
- [ ] **Opt-in coverage per send** — Delivery report shows: total audience, WhatsApp opted-in count, opt-out count, not opted-in count.
- [ ] **Read rate** — WhatsApp `read` receipts (delivered and opened) tracked where available (subject to employee WhatsApp privacy settings).

---

### Nice-to-Have (P1)

- [ ] **Opt-in rate dashboard** — Tenant-level view of WhatsApp opt-in rate over time (% of workforce opted in per month). Helps admins drive adoption.
- [ ] **Bulk opt-in import** — Add `whatsapp_opted_in: true/false` as a column in the User Import CSV so HR can pre-populate consent from a separate opt-in collection process.
- [ ] **Template preview** — Admin can preview how a message will render in WhatsApp before sending (using template variables with sample data).
- [ ] **Send time optimisation hint** — Advisory suggestion on optimal time to send WhatsApp messages based on historical read rate patterns (no automated scheduling in Phase 1).

---

### Future Considerations (Phase 2+)

These are explicitly out of Phase 1 scope. Captured here to prevent scope creep and to frame the Phase 2 narrative.

- [ ] **Smart HR via WhatsApp** — Employee can request payslips, leave balances, or HR self-service actions via WhatsApp by interacting with a [[Wyzetalk]]-powered chatbot. Blue (Essential) acts as the content-rich knowledge layer; WhatsApp is the conversational surface.
- [ ] **Forms / surveys via WhatsApp** — Employees can complete simple forms or pulse surveys via WhatsApp quick-reply buttons or button lists, with responses captured in the platform.
- [ ] **Learning modules via WhatsApp** — Short learning content delivered as a structured WhatsApp conversation (micro-learning format).
- [ ] **Two-way operational messaging** — HR or managers can exchange messages with individual employees via WhatsApp, with the conversation visible and managed in the platform.
- [ ] **Template library / customisation** — Tenants build and manage their own approved template library beyond the two Phase 1 platform templates.
- [ ] **Media attachments** — Images, PDFs, or short videos sent via WhatsApp (e.g. safety bulletin as a PDF, shift schedule as an image).
- [ ] **Shared WABA (multi-tenant)** — Explore shared business number with sender sub-branding for smaller tenants who cannot manage their own WABA.
- [ ] **WhatsApp as OTP / activation channel** — Send account activation invites or OTPs via WhatsApp for employees without SMS reliability (e.g. international numbers).

---

## Success Metrics

**Leading:**
- WhatsApp opt-in rate: % of workforce per tenant who opt in within 30 days of feature launch
- WhatsApp delivery rate: % of sent messages reaching `delivered` status
- WhatsApp read rate: % of delivered messages reaching `read` status (vs SMS open-rate proxy)
- Opt-out rate: % of opted-in employees who opt out per month (health indicator — high opt-out = message fatigue)

**Lagging:**
- Urgent Alert acknowledgement rate uplift: increase in app-confirmed acknowledgements when WhatsApp is added as a channel
- Reduction in "didn't receive message" support tickets after WhatsApp channel launch
- Cost per delivered message (WhatsApp vs SMS comparison per tenant)
- Tenant adoption: % of active tenants who enable WhatsApp within 90 days of availability

---

## Open Questions

- **[Engineering]** Meta Cloud API vs on-premises WABA API — confirm which integration approach. Cloud API is recommended (lower infrastructure overhead); on-premises required only if data residency constraints apply.
- **[Engineering]** How are WABA credentials stored per tenant? Key management and rotation strategy needed (API tokens are long-lived and sensitive).
- **[Legal / Compliance]** POPIA and GDPR implications of sending employee data (name, mobile number) to Meta's API — confirm that the WhatsApp Business API data processing agreement covers this, or whether a separate DPA is required per tenant.
- **[Product]** What happens to WhatsApp delivery when an employee's `whatsapp_opted_in` is `true` but their registered mobile number is not a valid WhatsApp number? Graceful failure + flag in delivery report?
- **[Product]** Should Urgent Alerts fail silently on WhatsApp (fall back to SMS) if the template is not yet approved, or should WhatsApp simply be excluded? Must not block an Urgent Alert from going out.
- **[Engineering]** Opt-out webhook: what is the expected latency between Meta receiving a STOP reply and the platform updating the employee's opt-in status? Must be near-real-time.
- **[Product]** Per-conversation cost estimates are based on tenant-entered rates — confirm whether Wyzetalk will surface actual Meta billing data via API, or whether self-reported rates are sufficient for Phase 1.
- **[Product]** Opt-in coverage threshold for the pre-send warning: what % opted-in is considered "low" and should trigger a warning to the admin? Suggest <70% as default.
- **[Engineering]** WhatsApp message queue: if a large tenant (10,000+ employees) sends an Urgent Alert, how does the platform handle Meta's API rate limits without delaying delivery? Confirm throughput capacity.
- **[Legal]** Meta's commerce policy restricts certain industries from using WhatsApp Business API. Confirm that Wyzetalk's target verticals (mining, manufacturing, retail) are not restricted.

---

## Timeline Considerations

- **Dependency:** [communication_service.md](./communication_service.md) channel delivery layer must support WhatsApp as a registered channel type.
- **Dependency:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) must be stable — WhatsApp is an additive channel, not a redesign of messaging.
- **Dependency:** [Tenant_Management.md](./Tenant_Management.md) — WhatsApp config section added to tenant settings.
- **Dependency:** Meta WABA approval and template approval for each tenant — this is an external dependency with a lead time of 1–5 business days per tenant. Cannot go live without approved templates.
- **Suggested phasing:**
  - **Phase 1a:** Tenant WABA setup + template mapping + employee opt-in (in-app toggle) + Standard Message WhatsApp delivery.
  - **Phase 1b:** Urgent Alert WhatsApp delivery + pre-send cost estimate + delivery tracking dashboard.
  - **Phase 1c:** Opt-in import column + opt-in rate dashboard + template preview.

---

## Acceptance criteria (BDD) — WhatsApp channel

**Source PRD:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (Part 2 — WhatsApp)
**Related:** Part 1 (message types), [communication_service.md](./communication_service.md) (channel layer), [Tenant_Management.md](./Tenant_Management.md) (WhatsApp config), [Profile_Users.md](./Profile_Users.md) (opt-in preference).
**Use:** Eng / QA — human-owned.

---

## Scope reminder

- **Phase 1 is strictly one-way / outbound only.** No inbound message reading, no reply processing, no chatbot, no smart HR.
- **Two message types:** Urgent Alert (auto-includes WhatsApp), Standard Message (WhatsApp is a selectable channel).
- **Two template structures:** Urgent Alert template (always Utility) and Standard Message template (Utility or Marketing, set per send).
- **Employee opt-in is mandatory** (Meta policy). No opt-in = no WhatsApp messages to that employee.
- **Opt-out via STOP reply** must be processed immediately and permanently until re-opt-in.

---

## Acceptance Criteria — Tenant Configuration

| ID | Criterion |
|----|-----------|
| WA-01 | **Given** WhatsApp toggle is OFF for a tenant **when** an admin sends any message type **then** no WhatsApp messages are dispatched, and WhatsApp does not appear as a channel option anywhere in the UI. |
| WA-02 | **Given** WhatsApp toggle is turned ON **when** WABA credentials (Account ID, Phone Number ID, Access Token, Display Name) are not yet saved **then** the toggle cannot be activated and a validation message is shown: "Complete WhatsApp Business Account setup before enabling this channel." |
| WA-03 | **Given** WABA credentials are saved **when** Urgent Alert template name is not mapped **then** the tenant cannot activate WhatsApp and a validation message is shown: "Map your Urgent Alert template before enabling WhatsApp." |
| WA-04 | **Given** WABA credentials and both template names are saved **when** either template's Meta approval status is not `Approved` **then** WhatsApp is enabled in config but message sends using the unapproved template are blocked with a clear error: "Template '[name]' is pending Meta approval. Sends are paused until approved." |
| WA-05 | **Given** tenant sets Standard Message template category to Utility **when** admin sends a Standard Message via WhatsApp **then** the message is sent as a Utility conversation and the pre-send cost estimate uses the tenant's Utility per-conversation rate. |
| WA-06 | **Given** tenant sets Standard Message template category to Marketing **when** admin sends a Standard Message via WhatsApp **then** the message is sent as a Marketing conversation and the pre-send cost estimate uses the tenant's Marketing per-conversation rate. |
| WA-07 | **Given** per-conversation rates are entered for both Utility and Marketing **when** admin views the pre-send confirmation **then** estimated WhatsApp cost = (opted-in recipients in audience) × (rate for selected category), displayed in tenant currency. |
| WA-08 | **Given** opted-in recipient count for a send is below 70% of total audience **when** pre-send confirmation is shown **then** a warning is displayed: "Only [X]% of your audience has opted in to WhatsApp. [Y] employees will not receive this via WhatsApp — they will still receive it via other channels." |
| WA-09 | **Given** WhatsApp settings screen **when** tenant admin views it **then** total workforce count and total WhatsApp opted-in count are visible. |

---

## Acceptance Criteria — Employee Opt-In

| ID | Criterion |
|----|-----------|
| WA-10 | **Given** a new employee completes account activation **when** the tenant has onboarding opt-in enabled **then** a consent step is shown: "Would you like to receive updates from [Company Name] on WhatsApp?" with Accept and Skip buttons. Skipping does not block activation. |
| WA-11 | **Given** employee taps Accept on the onboarding opt-in step **when** the step completes **then** `whatsapp_opted_in` is set to `true` for that employee's record. |
| WA-12 | **Given** employee taps Skip on the onboarding opt-in step **when** the step completes **then** `whatsapp_opted_in` remains `false` and the employee is not sent WhatsApp messages. |
| WA-13 | **Given** an existing employee opens Profile → Notification preferences **when** WhatsApp is enabled for the tenant **then** "Receive messages on WhatsApp" toggle is visible with current opt-in state. |
| WA-14 | **Given** employee enables the in-app WhatsApp toggle **when** the action completes **then** `whatsapp_opted_in` is set to `true`; consent copy shown: "By enabling this, [Company Name] will send you work updates via WhatsApp to [mobile number]." |
| WA-15 | **Given** employee disables the in-app WhatsApp toggle **when** the action completes **then** `whatsapp_opted_in` is set to `false` immediately; no further WhatsApp messages are sent from that point. |
| WA-16 | **Given** employee replies STOP to any WhatsApp message **when** Meta's opt-out webhook fires **then** `whatsapp_opted_in` is set to `false` within 60 seconds of webhook receipt; a final opt-out confirmation message is sent via the approved opt-out template. |
| WA-17 | **Given** `whatsapp_opted_in` is `false` **when** any message send is processed **then** that employee is excluded from the WhatsApp recipient list. They still receive the message via other enabled channels (SMS, push). |
| WA-18 | **Given** employee replies START after opting out **when** Meta's opt-in webhook fires **then** `whatsapp_opted_in` is set to `true`; a confirmation message is sent: "You are now subscribed to [Company Name] WhatsApp updates." |

---

## Acceptance Criteria — Urgent Alert via WhatsApp

| ID | Criterion |
|----|-----------|
| WA-19 | **Given** WhatsApp is enabled for the tenant **when** admin sends an Urgent Alert **then** WhatsApp is automatically included as a delivery channel alongside SMS, push, and in-app. Admin cannot deselect WhatsApp for Urgent Alerts. |
| WA-20 | **Given** Urgent Alert is sent **when** WhatsApp is dispatched **then** the message uses the Urgent Alert template, conversation category is Utility, and all template variables (company name, alert title, alert body, app deep-link) are correctly injected. |
| WA-21 | **Given** Urgent Alert body exceeds the template's body character limit **when** the message is dispatched **then** the body is truncated to the limit and a footer note added: "Open the app for full details." No send failure due to length. |
| WA-22 | **Given** Urgent Alert is sent **when** the pre-send confirmation modal is shown **then** it includes a WhatsApp row showing: opted-in recipient count, estimated Utility cost, and a note if coverage is below 70%. |
| WA-23 | **Given** Urgent Alert template has Meta status `Pending` or `Rejected` **when** admin attempts to send **then** WhatsApp delivery is skipped silently; other channels (SMS, push) are not blocked. A warning is logged in the delivery report: "WhatsApp delivery skipped — template not approved." |
| WA-24 | **Given** Urgent Alert is resolved **when** admin sends the resolution update **then** resolution update is also delivered via WhatsApp to the same opted-in employees who received the original alert. |

---

## Acceptance Criteria — Standard Message via WhatsApp

| ID | Criterion |
|----|-----------|
| WA-25 | **Given** WhatsApp is enabled for the tenant **when** admin creates a Standard Message **then** "WhatsApp" appears as a selectable channel option in the channel selector alongside SMS, push, and email. |
| WA-26 | **Given** admin selects WhatsApp for a Standard Message **when** WhatsApp is selected **then** admin must choose conversation category: Utility or Marketing. Helper text explains the distinction. Category selection is required before the pre-send step. |
| WA-27 | **Given** Standard Message is sent via WhatsApp **when** dispatched **then** the Standard Message template is used, variables injected, conversation category matches admin's selection. |
| WA-28 | **Given** Standard Message is sent via WhatsApp **when** the pre-send confirmation modal is shown **then** WhatsApp row shows opted-in recipient count, selected category (Utility/Marketing), estimated cost, and opt-in coverage indicator. |
| WA-29 | **Given** admin does not select WhatsApp for a Standard Message **when** the message is sent **then** no WhatsApp messages are dispatched for that send, regardless of employee opt-in status. |

---

## Acceptance Criteria — Template & API Integration

| ID | Criterion |
|----|-----------|
| WA-30 | **Given** a WhatsApp message is dispatched **when** the Meta API call is made **then** the request uses the correct WABA Phone Number ID and template name for the sending tenant. Cross-tenant credential leakage must be architecturally impossible. |
| WA-31 | **Given** a WhatsApp message is dispatched **when** Meta returns a rate limit error (429) **then** the platform queues the message and retries with exponential backoff. Admin is not notified unless the queue is unresolved after [X] minutes (confirm threshold with engineering). |
| WA-32 | **Given** a WhatsApp message is dispatched **when** Meta returns a template rejection error **then** the send fails for WhatsApp only; other channels proceed. The failure is logged in the delivery report with error code and reason. |
| WA-33 | **Given** Meta sends a delivery status webhook (`sent`, `delivered`, `read`, `failed`) **when** the webhook is received **then** the corresponding employee's delivery status is updated within 30 seconds. |
| WA-34 | **Given** Meta sends a `failed` status with an error code **when** the webhook is received **then** the failure reason is stored and surfaced in the admin delivery report for that message send. |

---

## Acceptance Criteria — Delivery Reporting

| ID | Criterion |
|----|-----------|
| WA-35 | **Given** a message was sent via WhatsApp **when** admin views the delivery report **then** WhatsApp delivery is shown as a separate channel row: recipient count, `sent`, `delivered`, `read`, `failed` counts, and opt-out count. |
| WA-36 | **Given** the monthly messaging cost report **when** admin views it **then** WhatsApp spend is displayed as a separate line from SMS spend, broken down by: conversation category (Utility / Marketing), message type (Urgent Alert / Standard Message), conversation count, estimated cost. |
| WA-37 | **Given** cost figures in any report **when** displayed **then** a disclaimer is shown: "Cost estimates are based on your entered per-conversation rates. Actual Meta billing may vary." |

---

## Edge Cases & Negative Paths

| Area | Edge / negative | Expected behaviour |
|------|----------------|-------------------|
| **No opted-in employees** | Urgent Alert sent; zero employees have `whatsapp_opted_in: true` | WhatsApp send is skipped entirely. Other channels proceed. Pre-send modal shows WhatsApp: "0 opted-in recipients — WhatsApp will not be sent." |
| **Employee not on WhatsApp** | Employee opted in but their registered mobile number is not a WhatsApp account | Meta returns delivery failure. Status: `failed`, reason surfaced in delivery report. Employee is not opted out — they stay opted in in case they create a WhatsApp account. |
| **Employee changes mobile number** | Number change while `whatsapp_opted_in: true` | `whatsapp_opted_in` is reset to `false` on number change (same risk pattern as payslip). Employee must re-opt in via in-app toggle after confirming new number. |
| **Template variable missing at send time** | A required template variable (e.g. employee first name) is null for some employees | Platform substitutes a safe default (e.g. "there" for first name) or omits the variable if the template allows it. Must not fail the send for the entire audience. Fallback strategy documented in implementation guide. |
| **Message body exceeds template limit** | Admin enters a 500-character Standard Message body but template body limit is 1,024 chars | Pass. If body exceeds limit: truncate at limit, append "…Open the app for the full message." |
| **Tenant disables WhatsApp mid-send** | Toggle turned OFF while a large send is queued | Queued messages that have not yet been dispatched are cancelled. Messages already sent proceed to delivery. Admin notified: "WhatsApp channel was disabled — [X] queued messages were cancelled." |
| **STOP reply processed during active Urgent Alert** | Employee replies STOP while an Urgent Alert is active | Opt-out is processed. No further WhatsApp messages sent for this alert or any future sends. Other channels (SMS, push) still deliver the alert. No re-send of alert via WhatsApp after opt-out. |
| **Template pending during Urgent Alert** | Template approval status becomes Pending (Meta review) after go-live | Urgent Alert WhatsApp delivery skipped. Other channels proceed. Warning logged. This is a tenant operational risk — templates must be monitored. |
| **Duplicate STOP from same user** | Employee replies STOP twice | Idempotent: second STOP has no effect; user is already opted out. No error, no duplicate confirmation message. |
| **Marketing template sent as Utility** | Admin error: admin claims Utility but template was approved by Meta as Marketing | Meta will reject the send (template category mismatch). Platform surfaces the Meta error in the delivery report. Admin must correct the category setting in tenant config. Platform cannot override Meta's template category. |
| **Invalid access token** | WABA access token expired or revoked | All WhatsApp sends fail. Platform surfaces a tenant-level health alert: "WhatsApp integration error — check your API credentials in Settings." Admins should be notified before a failed Urgent Alert, not after. |
| **WhatsApp number blocked by employee** | Employee blocks the WABA number in WhatsApp app | Meta returns delivery failure. Status: `failed`. Employee is not automatically opted out (blocking ≠ STOP). Counts as a failed delivery in reporting. |

---

## Outstanding

- Meta Cloud API vs on-premises API selection — engineering decision needed before integration design begins.
- WABA credential storage and key rotation strategy — security review required.
- POPIA / GDPR DPA with Meta per tenant — legal review required before any tenant go-live.
- Rate limit queue threshold: how long before admin is notified of an unresolved queue (especially critical for Urgent Alerts).
- Template variable null fallback strategy — must be documented in implementation guide, not left to per-send improvisation.
- Opt-in coverage warning threshold — 70% suggested; confirm with product.

---

*WhatsApp Channel — v0.1 · 2026-03-26. Phase 1: one-way outbound only. Two templates: Urgent Alert (Utility) + Standard Message (Utility/Marketing). Evidence: EV-2026-03-002, EV-2026-03-004.*
