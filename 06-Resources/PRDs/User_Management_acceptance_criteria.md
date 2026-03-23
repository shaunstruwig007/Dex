# User Management — Acceptance criteria & edge cases

**Source PRD:** [User_Management.md](./User_Management.md)  
**Related:** [User_Importer.md](./User_Importer.md) + [User_Importer_acceptance_criteria.md](./User_Importer_acceptance_criteria.md), [Groups.md](./Groups.md) (directory picks), [Profile_Users.md](./Profile_Users.md).  
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
