# Notifications — Acceptance criteria & edge cases

**Source PRD:** [Notifications.md](./Notifications.md)  
**Related:** [Communication.md](./Communication.md) + [Communication_acceptance_criteria.md](./Communication_acceptance_criteria.md) (delivery), [Profile_Users.md](./Profile_Users.md) (toggles), [Posts.md](./Posts.md) (notify on publish), [Groups.md](./Groups.md) (ownership request flows).  
**Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md) §4.2  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **In:** Toast, dialogue, **notification drawer** (badge count), push, email mirror, severity (High/Medium/Low), action types: Support, Hook, Redirect, Request (accept/decline).  
- **Out Phase 1:** Per-type toggles, history log, custom sounds, batching/digest.

**Note:** [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) uses **NT-01/NT-02** for **new business post** alerts — keep naming distinct: this file uses **NTF-** prefix.

---

## Acceptance criteria — In-app surfaces

| ID | Criterion |
|----|-----------|
| NTF-01 | **Given** brief feedback needed **when** action completes **then** **toast** can show with optional action buttons. |
| NTF-02 | **Given** blocking confirmation needed **when** event fires **then** **dialogue** requires dismiss before continuing; supports actions. |
| NTF-03 | **Given** user opens app **when** they use top nav **then** **notification drawer** is available beside search/profile with **unread/new count** on icon. |
| NTF-04 | **Given** drawer item **when** it supports **Request** **then** user can **accept/decline** from drawer. |

---

## Acceptance criteria — External channels

| ID | Criterion |
|----|-----------|
| NTF-05 | **Given** push enabled **when** notification generated **then** push delivers to device per [Communication_acceptance_criteria.md](./Communication_acceptance_criteria.md). |
| NTF-06 | **Given** email mirror enabled in profile **when** in-app notification created **then** email sent per Communication rules. |

---

## Acceptance criteria — Severity

| ID | Criterion |
|----|-----------|
| NTF-07 | **Given** notification created **when** classified **then** it carries **High / Medium / Low** and UI respects triage *(define visual/ordering in design)*. |

---

## Acceptance criteria — Product flows

| ID | Criterion |
|----|-----------|
| NTF-08 | **Given** new post published with notify toggle **when** user in audience **then** behaviour matches **Feed AC NT-01/NT-02** (preference respected). |
| NTF-09 | **Given** group ownership request **when** sent **then** owner receives actionable notification per Groups PRD. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Preference** | User turned off push/email | No external delivery; define in-app-only for critical — **cross-PRD**. |
| **Stale** | User taps deep link to removed content | Graceful message (align Feed AC). |
| **Admin errors** | Admin-triggered failure | Lands in drawer per PRD. |

---

## Outstanding

- Drawer retention / auto-clear policy.  
- Toast auto-dismiss vs manual.  
- **Critical** notifications bypassing prefs (forced ownership change, etc.).

---

*Align severity and “critical bypass” with Tenant/User Management flows.*
