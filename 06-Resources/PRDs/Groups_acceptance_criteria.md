# Groups — Acceptance criteria & edge cases

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
