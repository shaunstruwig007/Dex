# User Management

---

> Lighter spec derived from the User Management discovery document. Covers the admin-facing user directory, individual/bulk actions, role management, and concurrent editing protection.

**Related PRDs:** [User_Importer.md](./User_Importer.md) (bulk import logic), [Groups.md](./Groups.md) (directory selection for once-off audiences), [Profile_Users.md](./Profile_Users.md) (self-service vs admin view). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

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
