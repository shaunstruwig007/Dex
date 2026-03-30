# WhatsApp Channel — Outbound Messaging

---

> Spec for WhatsApp as an additional one-way outbound delivery channel for Urgent Alerts and Standard Messages. Phase 1 is strictly broadcast-only: no inbound reading, no reply handling, no conversational AI. This picks up the "WhatsApp — Future phase" items parked in [Communication.md](./Communication.md) and [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md).

**Related PRDs:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (the two message types WhatsApp delivers), [Communication.md](./Communication.md) (channel delivery layer), [Tenant_Management.md](./Tenant_Management.md) (WhatsApp config added here), [Profile_Users.md](./Profile_Users.md) (employee opt-in preference). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-002](../Evidence_register.md) | Market: TA vendors now shipping frontline flows on SMS/WhatsApp — same channel employees associate with deskless comms. Validates adding WhatsApp as a standard delivery channel for employee messaging. |
| [EV-2026-03-004](../Evidence_register.md) | Market: 70% of employee–system interactions shifting to conversational interfaces; 98% SMS read rate. WhatsApp is not just preferred — it is where frontline workers already live. |

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

- **Dependency:** [Communication.md](./Communication.md) channel delivery layer must support WhatsApp as a registered channel type.
- **Dependency:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) must be stable — WhatsApp is an additive channel, not a redesign of messaging.
- **Dependency:** [Tenant_Management.md](./Tenant_Management.md) — WhatsApp config section added to tenant settings.
- **Dependency:** Meta WABA approval and template approval for each tenant — this is an external dependency with a lead time of 1–5 business days per tenant. Cannot go live without approved templates.
- **Suggested phasing:**
  - **Phase 1a:** Tenant WABA setup + template mapping + employee opt-in (in-app toggle) + Standard Message WhatsApp delivery.
  - **Phase 1b:** Urgent Alert WhatsApp delivery + pre-send cost estimate + delivery tracking dashboard.
  - **Phase 1c:** Opt-in import column + opt-in rate dashboard + template preview.
