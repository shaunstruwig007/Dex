# Communication — Acceptance criteria & edge cases

**Source PRD:** [Communication.md](./Communication.md)  
**Related:** [Notifications.md](./Notifications.md) + [Notifications_acceptance_criteria.md](./Notifications_acceptance_criteria.md) (types/UX), [Profile_Users.md](./Profile_Users.md) (prefs), [Login_Account_Activation.md](./Login_Account_Activation.md) (SMS OTP), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (multi-channel urgent).  
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
