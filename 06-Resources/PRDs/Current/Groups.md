# Groups

---

> Lighter spec derived from the Groups discovery document. Covers group types, query builder, ownership model, dashboard, and lifecycle management.

**Related PRDs:** [Posts.md](./Posts.md) (**primary consumer** — every published post requires an audience), [Feed.md](./Feed.md) (employees only see posts for groups they belong to), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (same audience primitives for urgent/operational sends), [User_Importer.md](./User_Importer.md) (keys/values for the query builder), [User_Management.md](./User_Management.md) (directory picks for once-off groups). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

---

# Problem Statement

Without structured audience targeting, all content goes to all users — creating noise and reducing relevance. Admins need the ability to create, manage, and reuse audience segments built from imported employee data (department, region, position, etc.) to ensure business communication reaches the right people. Groups are the foundation of content targeting; without them, the platform cannot function as a targeted communication tool.

---

# Goals

1. **Enable precise content targeting** — Every post reaches only the intended audience.
2. **Support both ad-hoc and reusable audiences** — Once-off groups for single sends, saved groups for ongoing targeting.
3. **Provide a self-service query builder** — Admins build audiences from imported employee data keys without engineering help.
4. **Maintain clean group lifecycle** — Groups are automatically marked active/inactive and cleaned up when no longer used.

---

# Non-Goals

- **User-created groups / self-join** — Groups are admin-managed only. Employee self-service groups are a future initiative.
- **Cross-tenant groups** — Groups are scoped to a single tenant.
- **Nested groups / group hierarchies** — Flat structure only for Phase 1.
- **Real-time group membership updates** — Membership updates on import, not in real-time.

---

# User Stories

- As an **admin**, I want to create a saved group using a query builder so that I can reuse the same audience across multiple posts.
- As an **admin**, I want to pick individual users from the directory for a once-off message so that I can target precisely without creating a permanent group.
- As an **admin**, I want saved groups to automatically include new employees who match the query so that I don't need to manually update audiences.
- As an **admin**, I want to see a dashboard of all my groups with status, audience count, and usage so that I can manage them efficiently.
- As an **admin**, I want to transfer ownership of a group to another admin so that groups don't become orphaned when I leave.
**Edge Cases:**
- As an **admin**, I want a warning when I edit a saved group used by other **content items** (posts, messaging, etc.) so that I understand the impact of my change.
- As a **system**, I want to mark groups inactive when they're no longer linked to any **content** (e.g. [Posts](./Posts.md), messaging sends) so that the dashboard stays clean.
- As a **system**, I want to reassign group ownership when the owner is removed from the system.

---

# Requirements

## Must-Have (P0)

### Group Types

- **Once-off (query-based):** Created for a single content item. Only sends to users matching the query at time of publish. Saved to content item only, not dashboard. Auto-deleted when unlinked or content archived.
- **Once-off (directory-based):** Manually selected users. Single/multi-select. Searchable directory. Same lifecycle as query-based.
- **Saved groups (ongoing):** Sends to current + future matching users. Editable by owner only. Locked by ownership. Duplicate requires new name if not owner. Delete only if inactive and you are owner.
- **System groups:** Created on import. Cannot be edited or deleted. "All (Everyone)" available in post creation. Not visible on groups dashboard.

### Query Builder

- Search group keys (from imported user data). Each key has searchable values with user counts.
- Keys and values paginated with text search.
- Add, remove, update, edit queries. Include or exclude multiple keys/values.
- Between queries: allow OR or AND operators.
- Default keys: startDate, department, division, region, position, gender, country, city, dateOfBirth, language. Updated on every import.

### Ownership & Permissions

- Only owner/admin roles can access groups. One owner per group.
- Request ownership (accept/decline with notification). Force ownership change (immediate, alerts previous owner).
- If group owner removed from system: group left ownerless; next admin to manage it becomes owner.

### Groups Dashboard

- Create new group button. Tabs: My groups, All. Filter: Owner, Status, Sort. Search: name, description.
- Group list item: name, description, owner avatar, status (active/inactive), used-by count, audience count.
- Actions: Request ownership, Edit, Select mode (Duplicate, Delete if owner).
- Status: Active (linked to content) / Inactive (not linked). Automated. Content assignment = active.

### Editing & Deletion

- Saved groups: edit name, description, query, owner. Warning when editing a group used by other content.
- Once-off groups: edit description, query/audience.
- Saved groups deleted permanently (no soft delete). Once-off groups deleted when content is archived/deleted.

## Nice-to-Have (P1)

- Bulk group actions from the dashboard.
- Group usage analytics (how many posts, how many unique reaches).

---

# Success Metrics

**Leading:**

- % of posts published with targeted groups (vs "Everyone") (target: >40% within 3 months)
- Saved group reuse rate (avg times a saved group is used across content items)
- Query builder adoption (% of groups created via query vs directory)
**Lagging:**
- Reduction in untargeted "Everyone" broadcasts (indicator of content maturity)
- Content engagement rate improvement from targeted vs broadcast posts

---

# Open Questions

- **[Engineering]** How often are group memberships recalculated — on every import, or on a schedule?
- **[Product]** Should groups support a "preview audience" count before saving?
- **[Design]** How does the query builder handle keys with thousands of values (e.g. employee names)?
- **[Product]** Can admins see which specific users are in a group, or only the count?

---

# Timeline Considerations

- **Dependency:** [User Importer](./User_Importer.md) must be operational (group keys come from imported data).
- **Dependency:** [Posts](./Posts.md) and [Feed](./Feed.md) — groups are the **audience layer** for targeted comms; ship **before** or **with** post publish + feed visibility.
- **Dependency:** [Messaging: Ops & Urgent Alerts](./Messaging_Ops_Urgent_Alerts.md) reuses group selection for sends.
- **Suggested phasing:** Group types + query builder + dashboard (Phase 1a) → Ownership + lifecycle (Phase 1b).

