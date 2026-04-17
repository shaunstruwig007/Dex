---
prd_id: profile-users
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
  - Hidden field / elevated auth alignment (Elevated Auth PRD)
---

# Profile: Users

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Employees managing self-service fields; owners managing company settings; prefs driving Notifications/Communication  
**Estimated Effort:** Ongoing

---

> Lighter spec derived from the Profile: Users discovery document. Covers user self-service profile, owner company settings, security, notification preferences, and support/feedback.

**Related PRDs:** [communication_service.md](./communication_service.md) + [Notifications.md](./Notifications.md) (email/push toggles and delivery), [User_Management.md](./User_Management.md) (admin edit of same fields), [Theming.md](./Theming.md) (owner theme). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Users update **their own profile fields** and **notification preferences**; owners manage **company-level settings** — keeping data consistent with User Management and enabling correct channel delivery.

**User value:** Reduces support tickets; feeds Communication channel selection.

---

## Work Packages

### WP-Self: Employee profile (P0)

**Priority:** P0  
**Dependencies:** [User_Management.md](./User_Management.md) field parity  
**Files:** Client TBD  
**VPS-eligible:** No

### WP-Owner: Company settings + theme hook (P0)

**Priority:** P0  
**Dependencies:** [Theming.md](./Theming.md)  
**Files:** TBD  
**VPS-eligible:** No

### WP-Prefs: Notification toggles (P0)

**Priority:** P0  
**Dependencies:** [communication_service.md](./communication_service.md), [Notifications.md](./Notifications.md)  
**Files:** TBD  
**VPS-eligible:** No

### WP-Security: Password / support flows (P0)

**Priority:** P0  
**Dependencies:** Login flows  
**Files:** TBD  
**VPS-eligible:** No

---

## Success Scenarios

- Email/push toggles respected (BDD + Communication).  
- Owner sees company settings; employee does not.

---

## Satisfaction Metric

**Overall Success:** BDD Profile suite pass **≥ 95%** (target).

**Measured by:** QA.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Parity** with admin-editable fields per User Management rules.  
- **WhatsApp opt-in** flag per Communication Part 2.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Profile API | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Profile_Users.md"
# PASS: >= 1

grep -c "communication_service" "06-Resources/PRDs/Profile_Users.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Hidden field viewing + compliance (Elevated Auth).

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- Features beyond legacy Profile scope without new PRD.

---

# Problem Statement

Employees need a place to view the information their company holds about them and to update the details they control (cell number, email, profile picture). Owners additionally need access to company-level settings. Without self-service profile management, every minor update — a phone number change, a language preference — becomes a support ticket or HR request.

---

# Goals

1. **Enable employee self-service** — Users can update their mobile, email, profile picture, and language without HR involvement.
1. **Provide transparency** — Employees can see what data the company holds about them.
1. **Give owners company-level control** — Owners can update company info and theme from their profile.
1. **Support basic security and preferences** — Password management and notification toggles.
---

# Non-Goals

- **Full profile editing by users** — Users can only edit mobile, email, language, and profile picture. All other fields are HR-managed via import.
- **Multi-factor authentication settings** — MFA configuration is future scope.
- **In-app user guides (native)** — Phase 1 links to external PDF guides only.
- **Custom notification categories** — Phase 1 is simple on/off for email and push.
---

# User Stories

- As an **employee**, I want to update my mobile number so that I receive OTPs and invites at the right number.
- As an **employee**, I want to see my imported details (department, position, DOB, etc.) so that I can verify my information is correct.
- As an **employee**, I want to change my password so that I can keep my account secure.
- As an **employee**, I want to toggle email and push notifications on/off so that I control how I'm contacted.
- As an **owner**, I want to update company information and theme settings from my profile so that the app reflects our brand.
---

# Requirements

## Must-Have (P0)

### Profile Views

- [ ] **Admin/Standard:** Profile overview (picture, name, position). Sections: My Details, Security, Notifications. Plus: Guides, Feedback, Support, Legal. Logout.
- [ ] **Owner:** Same as above plus Company Account section: Company Information + Theme.
### Self-Service Updates

- [ ] Users can update: Email, Mobile number, Language, Profile picture.
- [ ] Success alerts: "Your phone number has been updated" / "Your email has been updated."
### Displayed Information (Read-Only)

- [ ] From import: Name, Surname, Employee ID, Gender, DOB, Mobile, Country, City, Region, Work email, Work number, Position, Department, Division, Language, Role.
- [ ] Info panel: "Incorrect info? Contact HR."
- [ ] Owner sees company info: Company Name, Industry, Employee count, Country, Region, City, Zip Code.
### Security

- [ ] User can update their password. Implementation may use a link-based flow (no direct IDP access).
### Notification Preferences

- [ ] Toggle on/off: Email notifications, Push notifications.
### Support & Feedback

- [ ] Feedback form + Support form. Response message after submission.
### Guides

- [ ] Links to PDF user guides (Owner/Admin manual, Standard user manual).
## Nice-to-Have (P1)

- [ ] Profile picture cropping/resizing tool.
- [ ] Email verification flow before updating email (OTP to new email).
- [ ] Richer notification preferences (per-category toggles).
---

# Success Metrics

**Leading:**

- % of mobile number updates completed self-service vs support ticket (target: >90% self-service)
- Profile page visits per user per month (engagement indicator)
**Lagging:**

- Reduction in profile-related support tickets (target: -70%)
- Data accuracy improvement (% of users with valid mobile numbers)
---

# Open Questions

- **[Engineering]** How does password change work without direct IDP access — reset link via email/SMS?
- **[Product]** Should email updates require verification (OTP to new email) before taking effect?
- **[Design]** Where does the owner theme editor live — inside profile, or a separate settings area?
- **[Product]** Should users be able to see their own audit log (login history, profile changes)?

---

## Acceptance criteria (BDD)

**Source PRD:** [Profile_Users.md](./Profile_Users.md)  
**Related:** [communication_service.md](./communication_service.md) + [communication_service.md](./communication_service.md#acceptance-criteria-bdd) (prefs → delivery), [Notifications.md](./Notifications.md), [User_Management.md](./User_Management.md) (admin edit same fields), [Theming.md](./Theming.md) (owner theme).  
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
