# Tenant Management — Acceptance criteria & edge cases

**Source PRD:** [Tenant_Management.md](./Tenant_Management.md)
**Related:** [Login_Account_Activation.md](./Login_Account_Activation.md), [Theming.md](./Theming.md), [Communication.md](./Communication.md), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (currency/rates), [WhatsApp_Channel.md](./WhatsApp_Channel.md) (full channel spec — §9 ACs below cover tenant config surface only).
**Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md) §3  
**Use:** Eng / QA — **human-owned**.

---

## 1. Tenant creation & setup

| ID | Criterion |
|----|-----------|
| TC-01 | **Given** new tenant **when** domain submitted **then** uniqueness validated; reserved keywords (`admin`, `wyzetalk`, `api`, `support`) **rejected** with message. |
| TC-02 | **Given** successful create **when** committed **then** **QR**, **short code**, **redirect target** generated and stored; status **Pending Setup**. |
| TC-03 | **Given** any step fails **when** during creation **then** **full rollback** including QR/URL; clear error returned. |
| TC-04 | **Given** identifier config **when** saved **then** **exactly two** fields chosen from allowed set; **no** duplicates; applied to tenant login domain; **logged**. |

---

## 2. Identity & login validation (portal/backend)

| ID | Criterion |
|----|-----------|
| TC-05 | **Given** login attempt **when** validation fails **then** inline errors + **logged** failures. |
| TC-06 | **Given** OTP policy **when** configured **then** TTL + max resends enforced and **logged**. |
| TC-07 | **Given** no match **when** Find My Account path **then** soft match attempt; failure → **support ticket** per §5. |
| TC-08 | **Given** expired activation token **when** used **then** block + message + “request new invite” + log. |

---

## 3. QR code management

| ID | Criterion |
|----|-----------|
| TC-09 | **Given** tenant profile **when** owner views **then** QR image, short URL, download PNG, poster, copy, share; updates on regeneration. |
| TC-10 | **Given** **yearly** rotation **when** job runs **then** old QR invalid; owner notified **30d** and **7d** before. |
| TC-11 | **Given** **expired** QR scan **when** user lands **then** login **hidden**, message to contact HR, **no** OTP, attempt **logged**. |

---

## 4. Tenant status (disabled)

| ID | Criterion |
|----|-----------|
| TC-12 | **Given** tenant **disabled** **when** user hits login **then** company-specific message; **no** OTP; attempts **logged**. |
| TC-13 | **Given** **re-enabled** **when** switched on **then** login works within **30 seconds** without manual steps. |

---

## 5. Find My Account & support workflows

| ID | Criterion |
|----|-----------|
| TC-14 | **Given** submission **when** soft match succeeds **then** OTP + redirect to tenant login path. |
| TC-15 | **Given** soft match fails **when** submitted **then** ticket + user message; data retained per **retention** then purged. |
| TC-16 | **Given** support agent **when** using dashboard **then** approve/reject/edit/resend; actions **logged**. |

---

## 6. Account owner & contacts

| ID | Criterion |
|----|-----------|
| TC-17 | **Given** owner invite **when** sent **then** TTL tracked; expired/retry behaviour per PRD. |
| TC-18 | **Given** owner change **when** executed **then** previous owner **loses access immediately**; event **logged**. |

---

## 7. Deactivation, archive & hard delete

| ID | Criterion |
|----|-----------|
| TC-19 | **Given** soft-deleted tenant **when** **30 days** elapse **then** **hard delete** job runs; **idempotent**; no UI undo. |
| TC-20 | **Given** archived tenant **when** **1 year** elapses **then** hard delete per PRD. |
| TC-21 | **Given** hard delete **when** complete **then** compliance notification + audit of **event** retained separately from tenant data. |

---

## 9. WhatsApp channel configuration

| ID | Criterion |
|----|-----------|
| TC-24 | **Given** a Tenant Owner opens WhatsApp settings **when** WABA credentials, both template names, or template approval status is incomplete **then** the WhatsApp toggle cannot be activated and a validation message identifies the missing prerequisite. |
| TC-25 | **Given** all prerequisites are met **when** Tenant Owner activates the WhatsApp toggle **then** WhatsApp becomes available as a channel across all message types for that tenant; the toggle state is logged with timestamp and admin ID. |
| TC-26 | **Given** Tenant Owner saves WABA credentials **when** Business Display Name is set **then** all outbound WhatsApp messages from that tenant show the configured display name as the sender. |
| TC-27 | **Given** Urgent Alert template is mapped **when** Tenant Owner views the template config **then** conversation category is shown as "Utility" and is not editable. |
| TC-28 | **Given** Standard Message template is mapped **when** Tenant Owner sets the category to Marketing **then** all Standard Message WhatsApp sends for this tenant default to Marketing conversation category; pre-send cost estimate uses the Marketing rate. |
| TC-29 | **Given** a mapped template has Meta status `Pending` or `Rejected` **when** any admin attempts to send that message type via WhatsApp **then** WhatsApp delivery is blocked for that message type; a clear error is shown: "Template '[name]' is not approved by Meta. WhatsApp sends are paused." Other channels proceed. |
| TC-30 | **Given** a mapped template has Meta status `Approved` **when** Tenant Owner views template settings **then** a green approved indicator is shown; sends are unblocked. |
| TC-31 | **Given** required template variable slots are not fully mapped **when** Tenant Owner attempts to activate the template **then** activation is blocked: "Map all required variables before activating this template." |
| TC-32 | **Given** Tenant Owner enters per-conversation rates (Utility and Marketing) **when** rates are saved **then** pre-send cost estimates in the messaging flow immediately use the updated rates. |
| TC-33 | **Given** Tenant Owner enables the onboarding opt-in method **when** a new employee completes account activation **then** a WhatsApp consent step is included in the activation flow. |
| TC-34 | **Given** Tenant Owner disables the onboarding opt-in method **when** a new employee completes account activation **then** no WhatsApp consent step is shown; existing opted-in employees are unaffected. |
| TC-35 | **Given** WhatsApp settings screen **when** Tenant Owner views it **then** total workforce count, total opted-in count, and opt-in percentage are displayed and reflect the current state. |
| TC-36 | **Given** any WhatsApp config change (toggle, credentials, template mapping, rates, opt-in method) **when** saved **then** the change is recorded in the audit log with: timestamp, admin ID, field changed, old value, new value. |

---

## 8. Audit logging

| ID | Criterion |
|----|-----------|
| TC-22 | **Given** listed event types **when** they occur **then** each log has **timestamp**, **tenant ID**, **source**; **immutable** for users. |
| TC-23 | **Given** authorised role **when** searching **then** filter/export available *(Flesh)*. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **QR regen** | Downstream caches | Invalidate contract — engineering open question. |
| **Hard delete** | Backups / DW | Legal/engineering alignment. |
| **Find My Account** | Same person, two tenants | Route to correct tenant — fuzzy rules. |

---

## Outstanding

- Data-free toggle post-creation?  
- Owner self-service QR regen vs admin-only.  
- Partial tenant modes (read-only) vs binary disabled.

---

*Coordinates with Login AC for all routing and recovery paths.*
