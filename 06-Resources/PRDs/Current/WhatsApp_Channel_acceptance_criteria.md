# WhatsApp Channel — Acceptance Criteria & Edge Cases

**Source PRD:** [WhatsApp_Channel.md](./WhatsApp_Channel.md)
**Related:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (message types), [Communication.md](./Communication.md) (channel layer), [Tenant_Management.md](./Tenant_Management.md) (WhatsApp config), [Profile_Users.md](./Profile_Users.md) (opt-in preference).
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
