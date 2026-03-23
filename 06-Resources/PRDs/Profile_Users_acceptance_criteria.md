# Profile: Users — Acceptance criteria & edge cases

**Source PRD:** [Profile_Users.md](./Profile_Users.md)  
**Related:** [Communication.md](./Communication.md) + [Communication_acceptance_criteria.md](./Communication_acceptance_criteria.md) (prefs → delivery), [Notifications.md](./Notifications.md), [User_Management.md](./User_Management.md) (admin edit same fields), [Theming.md](./Theming.md) (owner theme).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md)  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Self-service edits:** email, mobile, language, profile picture only; other fields HR/import.  
- **Owner:** + company info + theme.  
- **Out Phase 1:** MFA, per-category notification toggles, native guides (PDF links only).

---

## Acceptance criteria — Views & sections

| ID | Criterion |
|----|-----------|
| PR-01 | **Given** standard/admin user **when** opening profile **then** sections: overview, My Details, Security, Notifications, Guides, Feedback, Support, Legal, Logout. |
| PR-02 | **Given** **owner** **when** opening profile **then** **Company Account** (company info + **theme**) in addition to PR-01. |

---

## Acceptance criteria — Self-service updates

| ID | Criterion |
|----|-----------|
| PR-03 | **Given** user updates email/mobile/language/picture **when** save succeeds **then** success messaging per PRD (“phone updated”, etc.). |
| PR-04 | **Given** imported fields **when** viewing **then** read-only list matches PRD; **“Incorrect info? Contact HR.”** |

---

## Acceptance criteria — Security & notifications

| ID | Criterion |
|----|-----------|
| PR-05 | **Given** user changes password **when** flow completes **then** secure reset path (link/OTP per implementation). |
| PR-06 | **Given** notification prefs **when** user toggles **then** **email** on/off and **push** on/off persist and **Communication** honours them. |

---

## Acceptance criteria — Support & guides

| ID | Criterion |
|----|-----------|
| PR-07 | **Given** feedback/support submit **when** sent **then** confirmation message shown. |
| PR-08 | **Given** guides **when** opened **then** PDF links for Owner/Admin and Standard manuals. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Import** | Admin changed field + user editing | Conflict rules — **User Management** lock. |
| **Urgent** | Push off | Urgent may still require delivery — **Messaging vs Profile** priority. |
| **Email change** | Unverified email | P1 OTP-to-new-email — until then define behaviour. |

---

## Outstanding

- Password change without IDP — implementation pattern.  
- Email verification before swap — product.  
- User-visible audit log — product/security.

---

*Prefs are the bridge between Notifications UX and Communication delivery.*
