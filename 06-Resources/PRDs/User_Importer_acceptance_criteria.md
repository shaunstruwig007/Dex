# User Importer — Acceptance criteria & edge cases

**Source PRD:** [User_Importer.md](./User_Importer.md)  
**Related:** [Groups.md](./Groups.md) (keys/values), [User_Management.md](./User_Management.md), [Login_Account_Activation.md](./Login_Account_Activation.md), [Tenant_Management.md](./Tenant_Management.md).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Phase 1:** Snapshot import only; manual trigger; UUID matching hierarchy; protected fields; leaver handling by worker type; rollback; **20%** row error threshold for **full file** reject.

---

## Acceptance criteria — Identity & matching

| ID | Criterion |
|----|-----------|
| IMP-01 | **Given** new user **when** created **then** **UUID** assigned; **never** changes, **never** reused platform-wide. |
| IMP-02 | **Given** import row **when** matching **then** order: **UUID** first, else tenant **identifier pair**; multiple matches → **row blocked**. |
| IMP-03 | **Given** UUID match but employee number changed **when** import says so **then** **trust UUID**, update number. |

---

## Acceptance criteria — Snapshot outcomes

| ID | Criterion |
|----|-----------|
| IMP-04 | **Given** row not in snapshot **when** processing complete **then** user becomes **leaver candidate**; permanent → **delete**, contractor/seasonal → **disable** per PRD. |
| IMP-05 | **Given** owner/admin missing from snapshot **when** leaver logic runs **then** **no** delete without extra checks. |
| IMP-06 | **Given** parse/mapping failure **when** file level **then** **reject entire import**. |
| IMP-07 | **Given** **≥20%** critical row errors **when** threshold exceeded **then** **reject entire file**. |

---

## Acceptance criteria — Protected & updatable fields

| ID | Criterion |
|----|-----------|
| IMP-08 | **Given** any import **when** writing **then** **activated mobile** (and email per PRD) **never** overwritten by file. |
| IMP-09 | **Given** listed updatable fields **when** import **then** blank removes prior imported value where applicable; invalid formats rejected at row. |

---

## Acceptance criteria — Validation

| ID | Criterion |
|----|-----------|
| IMP-10 | **Given** mobile **when** parsed **then** normalised international format; **duplicate activated mobile** in tenant → row reject. |
| IMP-11 | **Given** dates/emails **when** invalid **then** row-level reject with message. |

---

## Acceptance criteria — Report & rollback

| ID | Criterion |
|----|-----------|
| IMP-12 | **Given** import completes **when** admin views report **then** new/updated/leavers/protected skips/failures/unchanged totals present. |
| IMP-13 | **Given** admin rolls back **when** action **then** restore to **previous snapshot** state per implementation. |

---

## Acceptance criteria — Export

| ID | Criterion |
|----|-----------|
| IMP-14 | **Given** export **when** run **then** includes active/disabled users, template fields, UUID, status; **logged**. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Groups** | Import removes a key used in saved group | Group query invalid — surface to admin. |
| **Posts** | Author deleted as leaver | “Previous employee” — Feed AC; content retention — **cross-cutting**. |
| **Rollback** | Partial failure mid-job | Transaction boundary — engineering. |

---

## Outstanding

- 20% threshold tenant-configurable?  
- Max file size/rows.  
- Leaver **content** handling (posts, reactions, messages).

---

*Import cadence drives Groups membership recalculation — align with Groups AC.*
