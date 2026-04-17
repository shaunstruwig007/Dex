---
prd_id: communication-service
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
  - SMS provider + receipts (Open Questions)
---

# Communication service

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Platform services sending SMS, email, push, WhatsApp delivery with profile-aware routing  
**Estimated Effort:** Ongoing maintenance + provider hardening

---

> Lighter spec derived from the Communication discovery document. Covers the underlying delivery layer for SMS, email, and push notifications across all platform features.

**Related PRDs:** [Notifications.md](./Notifications.md) (what gets sent / UX), [Login_Account_Activation.md](./Login_Account_Activation.md) (OTP / invites), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (multi-channel urgent + operational), [Profile_Users.md](./Profile_Users.md) (channel preferences), [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) (**WhatsApp now a registered delivery channel — one-way outbound, tenant-toggled**). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

The platform reliably **delivers** invites, OTPs, notifications, and messaging across **SMS, email, push (FCM/APNs/HMS), and WhatsApp** — respecting user preferences and channel rules from Profile — so employees receive critical comms on time.

**User value:** Foundation for Login, Notifications, Messaging; reduces “didn’t receive” support load.

---

## Work Packages

### WP-SMS: Invites & OTP (P0)

**Priority:** P0  
**Dependencies:** Provider contract  
**Files:** SMS adapter TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| S1 | Activation + OTP SMS sent | Delivery metrics >97% target |
| S2 | Download link + credentials per product rules | BDD SMS-01 |

### WP-Push: FCM / APNs / HMS (P0)

**Priority:** P0  
**Dependencies:** Device registration  
**Files:** Push service TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| P1 | Cross-platform tokens | BDD PUSH-01 |
| P2 | Admin errors in drawer | BDD PUSH-02 |

### WP-Email: Verification & mirror (P0)

**Priority:** P0  
**Dependencies:** [Profile_Users.md](./Profile_Users.md) prefs  
**Files:** Email adapter TBD  
**VPS-eligible:** Yes

### WP-Routing: Channel selection (P0)

**Priority:** P0  
**Dependencies:** Profile; [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) overrides  
**Files:** Router TBD  
**VPS-eligible:** Yes

### WP-Support: JIRA (P1)

**Priority:** P1  
**Dependencies:** None  
**Files:** Integration TBD  
**VPS-eligible:** Yes

**Dependency graph:**

```text
WP-SMS, WP-Push, WP-Email (parallel) ──> WP-Routing
WP-Support (parallel)
```

---

## Success Scenarios

- **OTP delivered:** User receives SMS OTP within SLA (staging + prod monitoring).  
- **Preference respected:** Email off → no mirror (per BDD CH-01).  
- **Urgent path:** Messaging overrides respected (CH-02).

---

## Satisfaction Metric

**Overall Success:** SMS **>97%**, push **>95%**, email **>98%** delivery success (targets from legacy Success Metrics).

**Measured by:** Provider dashboards + ticket trend “didn’t receive” (−50% lagging target).

---

## Metrics Strategy

### Events to Track (none in vault)

`analytics_tool: none`. Wire delivery events into [Product_Analytics.md](./Product_Analytics.md) when catalog exists.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **FCM, APNs, HMS** push support.  
- **Profile-driven** channel selection + WhatsApp opt-in per Part 2.  
- **Scheduled send** is **out** for Phase 1 per legacy Non-Goals (use [Scheduled_Content.md](./Scheduled_Content.md) later).

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| SMS provider | TBD |
| Email provider | TBD |
| Push | TBD |

---

## Validation Protocol

```bash
grep -c "SMS-01" "06-Resources/PRDs/communication_service.md"
# PASS: >= 1 (BDD row present)

grep -c "FCM" "06-Resources/PRDs/communication_service.md"
# PASS: >= 1
```

**Manual:** Provider dashboards; device matrix QA.

---

## Success Rate Target

**2 of 2** grep checks on doc commit.

---

## Notes for Agent Implementation

**Scout priorities:** SMS provider + receipts; Huawei HMS phasing.  
**Worker tasks:** Priority queue cross-PRD with Messaging.

---

## Files to Create / Modify

```
# TBD — provider configs, secrets management
```

---

## Out of Scope

- **Two-way WhatsApp conversational** — [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md).  
- **Per-tenant templates** Phase 1.  
- **Scheduled delivery** — [Scheduled_Content.md](./Scheduled_Content.md).

---

# Problem Statement

The platform needs a reliable, multi-channel communication layer to reach employees via SMS, email, and push notifications. Without it, invitations don't arrive, OTPs fail, and users miss important updates. The system also needs cross-OS push support (Android, Apple, Huawei) and integration with support tooling.

---

# Goals

1. **Ensure reliable message delivery** — Every OTP, invite, and notification reaches the employee via the most appropriate channel.
1. **Support all major platforms** — Push notifications work on Android, Apple, and Huawei.
1. **Respect user preferences** — Communication service honours notification toggles.
1. **Integrate with support workflows** — Connection to JIRA for ticket management.
---

# Non-Goals

- **WhatsApp two-way / conversational messaging** — Outbound-only. Reply handling, chatbots, and smart HR via WhatsApp are Phase 2+. One-way WhatsApp delivery is now **in scope** — see [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging).
- **In-app chat / two-way messaging** — Communication is outbound-only (platform to user).
- **Custom notification templates (per tenant)** — Phase 1 uses standard templates.
- **Delivery scheduling** — Messages send immediately. Scheduled delivery is future scope.
---

# User Stories

- As a **system**, I want to determine the correct delivery channel for each user based on their profile data so that messages reach them reliably.
- As a **new employee**, I want to receive my activation invite via SMS so that I can get started without needing an email.
- As an **employee with email configured**, I want to receive notifications via email in addition to push so that I have multiple ways to stay informed.
- As an **admin**, I want support tickets to be created in JIRA so that the support team can track and resolve issues.
---

# Requirements

## Must-Have (P0)

### SMS

- [ ] Primary channel for initial contact: activation invites, OTP delivery.
- [ ] Send notification to user with download link, username (employee ID), and password.
### Email

- [ ] Used post-activation when user has added email. Supports: verification, password reset, owner invite.
- [ ] Email mirrors in-app notifications based on user preference.
### Push Notifications

- [ ] Support for Android (FCM), Apple (APNs), and Huawei (HMS).
- [ ] In-app notifications displayed in the notification drawer.
- [ ] Admin-triggered errors placed in the notification drawer.
### Channel Selection Logic

- [ ] Communication service determines platform based on user profile data (from Profile service).
- [ ] Respects user notification preferences (email on/off, push on/off, **WhatsApp on/off — opt-in flag per employee, see [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) §Employee Opt-In**).
### Support Integration

- [ ] JIRA integration for support ticket creation and management.
## Nice-to-Have (P1)

- [ ] 5-star app rating system.
- [ ] Feedback form integration with support tooling.
- [ ] SMS delivery receipt tracking.
## Future Considerations (P2)

- [ ] ~~WhatsApp as a delivery channel~~ — **Delivered. See [Part 2 — WhatsApp](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging).**
- [ ] Custom notification templates per tenant.
- [ ] Delivery scheduling (send at optimal time).
---

# Success Metrics

**Leading:**

- SMS delivery success rate (target: >97%)
- Push notification delivery success rate (target: >95%)
- Email delivery success rate (target: >98%)
**Lagging:**

- Reduction in "didn't receive invite/OTP" support tickets (target: -50% within 3 months)
- Cross-platform push coverage (% of users with valid push tokens)
---

# Open Questions

- **[Engineering]** Which SMS provider(s) are being used? Do they support delivery receipts?
- **[Engineering]** Is Huawei HMS push a hard requirement for Phase 1, or can it follow?
- **[Product]** Should the communication service support a priority queue (urgent messages sent first)?
- **[Engineering]** How is JIRA integration implemented — direct API, webhook, or via a middleware?
---

# Timeline Considerations

- **Dependency:** This is a foundational service. Must be in place before Login & Account Activation, Messaging, and Notifications.
- **Suggested phasing:** SMS + Push (Phase 1a) → Email (Phase 1b) → JIRA integration (Phase 1c).

---

## Acceptance criteria (BDD)

**Source PRD:** [communication_service.md](./communication_service.md)  
**Related:** [Notifications.md](./Notifications.md) + [Notifications BDD](./Notifications.md#acceptance-criteria-bdd) (types/UX), [Profile_Users.md](./Profile_Users.md) (prefs), [Login_Account_Activation.md](./Login_Account_Activation.md) (SMS OTP), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (multi-channel urgent).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §4.2  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **In:** SMS (invites, OTP), email (verification, reset, mirror in-app per prefs), push (FCM, APNs, HMS), channel selection from profile, JIRA for support tickets.  
- **Out Phase 1:** WhatsApp, per-tenant templates, scheduled send.

---

## Acceptance criteria — SMS

| ID | Criterion |
|----|-----------|
| SMS-01 | **Given** activation/OTP path **when** system sends SMS **then** message can include download link, username/employee ID, and password per product rules. |
| SMS-02 | **Given** SMS send **when** measured **then** delivery success rate trackable toward **>97%** target *(monitoring stack TBD)*. |

---

## Acceptance criteria — Email

| ID | Criterion |
|----|-----------|
| EM-01 | **Given** user has email configured post-activation **when** product sends verification or password flows **then** email delivery works. |
| EM-02 | **Given** user enabled email in profile **when** in-app notification is generated **then** email **mirrors** notification per preference ([Profile_Users.md](./Profile_Users.md)). |

---

## Acceptance criteria — Push

| ID | Criterion |
|----|-----------|
| PUSH-01 | **Given** Android / iOS / Huawei devices **when** registered **then** push uses **FCM / APNs / HMS** respectively. |
| PUSH-02 | **Given** admin-triggered error **when** failure occurs **then** user sees item in **notification drawer** ([Notifications.md](./Notifications.md)). |

---

## Acceptance criteria — Channel selection & prefs

| ID | Criterion |
|----|-----------|
| CH-01 | **Given** Communication service routes a message **when** resolving channel **then** it reads **profile/user** data and **respects** email on/off and push on/off. |
| CH-02 | **Given** urgent alert **when** Messaging sends **then** channel rules follow [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (overrides for urgent vs operational). |

---

## Acceptance criteria — Support (JIRA)

| ID | Criterion |
|----|-----------|
| SUP-01 | **Given** support flow requires ticket **when** triggered **then** JIRA integration creates/tracks ticket per implementation. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **No token** | Push token invalid | Suppress or refresh; align FCM loop with Messaging PRD “flesh”. |
| **All channels off** | User disabled email + push | In-app still possible; **no** silent failure for critical flows — define with Product. |
| **Duplicate OTP** | Rapid resend | Rate limit + TTL; align Login AC. |

---

## Outstanding

- SMS provider(s), receipts, Huawei HMS Phase 1 vs Phase 1b.  
- Priority queue for urgent vs bulk — **cross-PRD** with Messaging.  
- JIRA: API vs webhook.

---

*Foundation service — sequence before Login, Notifications, Messaging.*
