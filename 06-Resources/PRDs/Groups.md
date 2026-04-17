---
prd_id: groups
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
  - Reconcile query-builder keys with User Importer schema
---

# Groups

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Admins building and reusing audience segments (Everyone, saved, directory, once-off) for posts and messaging  
**Estimated Effort:** Ongoing; query builder complexity

---

> Lighter spec derived from the Groups discovery document. Covers group types, query builder, ownership model, dashboard, and lifecycle management.

**Related PRDs:** [Posts.md](./Posts.md) (**primary consumer** — every published post requires an audience), [Feed.md](./Feed.md) (employees only see posts for groups they belong to), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (same audience primitives for urgent/operational sends), [User_Importer.md](./User_Importer.md) (keys/values for the query builder), [User_Management.md](./User_Management.md) (directory picks for once-off groups). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Admins define **audiences** so posts and messages reach the right employees — via saved queries, directory picks, and system groups — with ownership and lifecycle management.

**User value:** Foundation for Feed visibility and Messaging targeting; reduces broadcast noise.

---

## Work Packages

### WP-Builder: Query builder & keys (P0)

**Priority:** P0  
**Dependencies:** [User_Importer.md](./User_Importer.md)  
**Files:** Admin UI TBD  
**VPS-eligible:** No

### WP-Ownership: Requests & dashboard (P0)

**Priority:** P0  
**Dependencies:** [Notifications.md](./Notifications.md)  
**Files:** TBD  
**VPS-eligible:** No

### WP-Messaging: Parity primitives (P0)

**Priority:** P0  
**Dependencies:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- Post publish requires resolved audience (cross-PRD with Posts).  
- Group ownership request flows per BDD.

---

## Satisfaction Metric

**Overall Success:** BDD **Groups** rows pass in regression **≥ 95%** (target).

**Measured by:** QA suite.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Everyone** group exception per Product Map.  
- Same primitives for Messaging and Posts.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Groups service | TBD |

---

## Validation Protocol

```bash
grep -c "User_Importer" "06-Resources/PRDs/Groups.md"
# PASS: >= 1

grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Groups.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Performance of large segments.

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- Features not listed in legacy requirements without steerco approval.

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

---

## Acceptance criteria (BDD)

**Source PRD:** [Groups.md](./Groups.md)  
**Related:** [Posts.md](./Posts.md) (audience mandatory), [Feed.md](./Feed.md) (membership visibility), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (same audience primitives), [User_Importer.md](./User_Importer.md) (keys/values), [User_Management.md](./User_Management.md) (directory), [Notifications.md](./Notifications.md) (ownership request).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Group types:** Once-off (query / directory), **Saved** (ongoing), **System** (import; “Everyone”; not on dashboard).  
- **Out:** Self-join, cross-tenant, nesting, real-time membership (import-driven updates).

---

## Acceptance criteria — Group types & lifecycle

| ID | Criterion |
|----|-----------|
| GR-01 | **Given** once-off **query** group **when** linked to single content item **then** it is **not** listed as saved dashboard group; **auto-deleted** when unlinked or content archived per PRD. |
| GR-02 | **Given** once-off **directory** group **when** saved to content only **then** same lifecycle as GR-01. |
| GR-03 | **Given** **saved** group **when** import adds users matching query **then** membership includes **current + future** matchers *(recalc on import — frequency in open questions)*. |
| GR-04 | **Given** **system** group **when** admin views dashboard **then** system groups **do not** appear; **Everyone** available in post/messaging audience pickers. |
| GR-05 | **Given** saved group **inactive** (no content links) **when** eligibility met **then** **delete** allowed only if inactive **and** requester is **owner**. |

---

## Acceptance criteria — Query builder

| ID | Criterion |
|----|-----------|
| QB-01 | **Given** keys from import **when** admin searches **then** keys and values are searchable with **pagination** and **counts**. |
| QB-02 | **Given** multiple predicates **when** building **then** **AND/OR** between groups of conditions works per PRD. |
| QB-03 | **Given** default keys **when** tenant imports **then** keys include at minimum: startDate, department, division, region, position, gender, country, city, dateOfBirth, language *(updated on import)*. |

---

## Acceptance criteria — Ownership

| ID | Criterion |
|----|-----------|
| OWN-01 | **Given** non-owner **when** requesting ownership **then** owner gets **accept/decline** flow with **notification**. |
| OWN-02 | **Given** **force** ownership change **when** executed **then** previous owner alerted **immediately** per PRD. |
| OWN-03 | **Given** owner **removed** from system **when** next admin manages group **then** they become owner *(PRD)*. |

---

## Acceptance criteria — Dashboard

| ID | Criterion |
|----|-----------|
| DB-01 | **Given** admin opens Groups **when** viewing **then** tabs **My groups / All**, filters (Owner, Status), sort, search (name, description) work. |
| DB-02 | **Given** list row **when** displayed **then** shows name, description, owner avatar, status active/inactive, used-by count, audience count. |

---

## Acceptance criteria — Edit warnings

| ID | Criterion |
|----|-----------|
| WRN-01 | **Given** saved group used by **posts/messaging** **when** admin edits **then** **warning** explains blast radius. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Empty query** | No users match | Block publish or allow zero-recipient — **product**. |
| **Import** | Key removed from schema | Groups referencing key show error or require fix. |
| **Concurrency** | Two admins edit same group | Define lock or last-write — **align User Management locks**. |

---

## Outstanding

- Membership recalc: every import vs schedule.  
- **Preview audience count** before save.  
- **Member list vs count only** for admins.

---

*Audience resolution must match Posts “cannot publish without group”.*
