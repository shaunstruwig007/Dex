---
prd_id: user-management
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
  - Concurrent edit rules with Engineering
---

# User Management

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Tenant admins managing directory, roles, invites, and bulk actions  
**Estimated Effort:** Ongoing

---

> Lighter spec derived from the User Management discovery document. Covers the admin-facing user directory, individual/bulk actions, role management, and concurrent editing protection.

**Related PRDs:** [User_Importer.md](./User_Importer.md) (bulk import logic), [Groups.md](./Groups.md) (directory selection for once-off audiences), [Profile_Users.md](./Profile_Users.md) (self-service vs admin view). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Admins **search, view, and act** on user records (invite, role changes, troubleshooting) with **bulk operations** and safe **concurrency** rules — staying aligned with imports and profile self-service.

**User value:** Operational efficiency; fewer access tickets.

---

## Work Packages

### WP-Directory: Search & detail (P0)

**Priority:** P0  
**Dependencies:** Imported user records  
**Files:** Admin UI TBD  
**VPS-eligible:** No

### WP-Roles: Promote/demote (P0)

**Priority:** P0  
**Dependencies:** RBAC model  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-Bulk: Bulk actions (P1)

**Priority:** P1  
**Dependencies:** WP-Directory  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-Concurrency: Edit locks (P1)

**Priority:** P1  
**Dependencies:** WP-Directory  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- Admin finds user; changes role; audit trail (per BDD).  
- Bulk invite respects importer state.

---

## Satisfaction Metric

**Overall Success:** BDD User Management suite pass **≥ 95%** (target).

**Measured by:** QA regression.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Parity** fields with Profile for employee-visible attributes.  
- **Directory** used for once-off group picks ([Groups.md](./Groups.md)).

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| User admin API | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/User_Management.md"
# PASS: >= 1

grep -c "User_Importer" "06-Resources/PRDs/User_Management.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Concurrent editing edge cases.

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- Net-new admin powers not in legacy spec.

---

# Problem Statement

Once users are imported, admins need a centralised place to view, search, and manage employee records. Without structured user management, admins cannot efficiently promote/demote roles, invite users, troubleshoot access issues, or maintain data quality. Every minor change becomes a support ticket, slowing onboarding and increasing operational burden.

---

# Goals

1. **Provide a complete user directory** — Admins can view, search, filter, and sort all users in one place.
1. **Enable self-service user actions** — Promote/demote roles, invite/re-invite, enable/disable, and delete without support involvement.
1. **Protect data integrity during concurrent edits** — Prevent two admins from overwriting each other's changes.
1. **Support both individual and bulk operations** — Single-user profile editing and multi-user bulk actions.
---

# Non-Goals

- **Mobile import** — Bulk import is desktop/tablet only. Mobile user management is view + individual actions only.
- **Automated role assignment rules** — Roles are manually managed. Automated promotion/demotion is future scope.
- **User self-service role requests** — Only admins/owners can change roles.
- **Cross-tenant user management** — Scoped to a single tenant.
---

# User Stories

- As an **admin/owner**, I want to search users by name, position, or department so that I can quickly find the person I need.
- As an **admin/owner**, I want to filter users by role and invite status so that I can see who needs attention.
- As an **owner**, I want to promote a user to admin so that they can help manage content and users.
- As an **admin/owner**, I want to invite or re-invite multiple users at once so that I can onboard groups efficiently.
- As an **admin/owner**, I want to view and edit a user's profile so that I can correct data issues without a support ticket.
**Edge Cases:**

- As an **admin**, I want to request editing access when another admin is already editing a user so that I don't have to wait indefinitely.
- As an **admin**, I want to forcefully take over editing rights if the other admin is unresponsive.
- As a **standard user**, I want my profile locked while an admin is editing it so that my changes don't conflict.
---

# Requirements

## Must-Have (P0)

### User Directory

- [ ] Display all users. Owner profile auto-added on tenant creation.
- [ ] Search by: Name, Position, Department.
- [ ] Filter by: Role (Standard, Admin, Owner), Invite status.
- [ ] Sort: Alphabetical (first name), Ascending/Descending.
### Individual User Actions

- [ ] View/edit user profile from admin view.
- [ ] Promote/demote roles: Standard ↔ Admin ↔ Owner.
- [ ] Enable/disable individual users.
- [ ] Invite and re-invite individual users.
- [ ] Delete individual users.
### Bulk Actions

- [ ] Bulk invite/re-invite multiple selected users.
- [ ] Bulk enable/disable multiple selected users.
- [ ] Bulk delete multiple selected users.
### Bulk Import

- [ ] Desktop/tablet only. Download template, populate, upload.
- [ ] View import results. Re-import failed users. Report failed import to [[Wyzetalk]] support.
- [ ] Full import logic covered in User Importer spec.
### Manually Add Single User

- [ ] Admin/owner can manually create a new user without import.
### Concurrent Editing Protection

- [ ] Request editing access when another admin is editing a user.
- [ ] Forcefully take over editing rights with confirmation.
- [ ] Lock standard user's profile while an admin/owner is editing it.
## Nice-to-Have (P1)

- [ ] User activity status (last login, activation date) visible in directory.
- [ ] Export filtered user list from directory (separate from import snapshot export).
---

# Success Metrics

**Leading:**

- % of user management actions completed without support ticket (target: >90%)
- Time to find and edit a user record (target: <30 seconds)
**Lagging:**

- Reduction in user-management-related support tickets (target: -60% within 3 months)
- Admin satisfaction with user management interface (survey)
---

# Open Questions

- **[Product]** Should there be a limit on the number of owners per tenant?
- **[Engineering]** How long does an editing lock last before it auto-releases?
- **[Product]** Should bulk delete require additional confirmation (e.g. type tenant name)?
- **[Design]** What does the mobile user management experience look like — read-only or limited actions?
---

# Timeline Considerations

- **Dependency:** User Importer (users must exist to be managed).
- **Dependency:** Profile: Users (admin edit view shares data model with user self-service profile).
- **Suggested phasing:** Directory + individual actions (Phase 1a) → Bulk actions + concurrent editing (Phase 1b).

---

## Acceptance criteria (BDD)

**Source PRD:** [User_Management.md](./User_Management.md)  
**Related:** [User_Importer.md](./User_Importer.md) + [User_Importer_acceptance_criteria.md](./User_Importer.md#acceptance-criteria-bdd), [Groups.md](./Groups.md) (directory picks), [Profile_Users.md](./Profile_Users.md).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Directory:** search, filter, sort; desktop import; mobile view + individual actions only.  
- **Roles:** Standard ↔ Admin ↔ Owner (manual).  
- **Concurrent edit:** request access, force takeover, lock end-user profile while admin edits.

---

## Acceptance criteria — Directory

| ID | Criterion |
|----|-----------|
| UM-01 | **Given** tenant **when** admin opens directory **then** all users listed; **owner** auto-created on tenant creation. |
| UM-02 | **Given** search **when** used **then** matches **Name, Position, Department**. |
| UM-03 | **Given** filters **when** applied **then** **Role** and **Invite status** work; sort **first name** asc/desc. |

---

## Acceptance criteria — Individual actions

| ID | Criterion |
|----|-----------|
| UM-04 | **Given** admin/owner **when** editing user **then** promote/demote roles, enable/disable, invite/re-invite, delete per permissions. |
| UM-05 | **Given** standard user **when** admin has lock **then** user **cannot** edit profile concurrently *(PRD)*. |

---

## Acceptance criteria — Bulk

| ID | Criterion |
|----|-----------|
| UM-06 | **Given** multi-select **when** bulk invite/re-invite/enable/disable/delete **then** actions apply with confirmations as defined. |
| UM-07 | **Given** bulk import **when** on desktop **then** template download → upload → results; failures reportable to support per PRD. |

---

## Acceptance criteria — Manual create & locks

| ID | Criterion |
|----|-----------|
| UM-08 | **Given** admin **when** manual add **then** new user created without import file. |
| UM-09 | **Given** second admin **when** first holds edit lock **then** **request** or **force takeover** with confirmation flows. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Owner** | Demote last owner | Block unless another owner — **product**. |
| **Bulk delete** | Accidental | Extra confirmation (type tenant name?) — open question. |
| **Import** | Conflicts with open admin edit | Ordering — **engineering**. |

---

## Outstanding

- Max owners per tenant.  
- Lock **TTL** auto-release.  
- Mobile: read-only vs limited actions — design.

---

*Directory is source for Groups “directory” audience — keep search fields aligned.*
