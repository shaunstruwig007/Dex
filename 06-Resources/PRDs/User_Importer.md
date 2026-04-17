---
prd_id: user-importer
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
  - Import field catalog ↔ Groups query builder
---

# User Importer

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Tenant admins importing and maintaining accurate rosters despite turnover and data quality issues  
**Estimated Effort:** Ongoing; data-quality investment

---

> Lighter spec derived from the User Importer discovery document. Covers snapshot import, system-generated IDs, data cleaning, selective updates, and export functionality.

**Related PRDs:** [Groups.md](./Groups.md) (query-builder keys/values come from imported attributes), [User_Management.md](./User_Management.md), [Login_Account_Activation.md](./Login_Account_Activation.md). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Admins **import**, **clean**, and **incrementally update** employee data with stable identifiers — feeding **Groups**, **User Management**, and **activation** without duplicate or stale users.

**User value:** Foundation for targeting and login; reduces comms misfires.

---

## Work Packages

### WP-Import: Snapshot & validation (P0)

**Priority:** P0  
**Dependencies:** File format / connector  
**Files:** Import pipeline TBD  
**VPS-eligible:** Yes

### WP-IDs: System IDs & dedupe (P0)

**Priority:** P0  
**Dependencies:** WP-Import  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-Update: Selective updates (P0)

**Priority:** P0  
**Dependencies:** WP-Import  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-Export: Export (P1)

**Priority:** P1  
**Dependencies:** WP-Import  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- Import dry-run catches duplicates per BDD.  
- Joiner/leaver correctness in test tenants.

---

## Satisfaction Metric

**Overall Success:** BDD Importer suite pass **≥ 95%** (target).

**Measured by:** QA + data-quality audits.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- Imported **keys** drive **Groups** query builder.  
- Handle **high turnover** scenarios per Problem Statement research.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Import workers | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1

grep -c "Groups.md" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Duplicate employee numbers across sub-companies.

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- Real-time HRIS sync (unless specified in discovery).

---

# Problem Statement

The current import system cannot reliably maintain accurate, up-to-date employee data across high-turnover, multi-unit, and mixed-workforce environments. Inconsistent identifiers, poor data quality, and rigid import processes result in duplicate users, missing joiners, and leavers who remain active. Stakeholder feedback (Anneke, AD, Theo, Kino, Nicola) confirms 30–70% staff turnover, 10–40% of employees with missing data, and duplicate employee numbers across sub-companies — all leading to failed activations, incorrect communication targeting, and high support dependency.

---

# Goals

1. **Ensure accurate, deduplicated user records** — Every import produces clean, consistent data with no unintended duplicates or overwrites.
2. **Automate joiner/leaver detection** — Snapshot imports automatically identify new users, updates, and users no longer on the list.
3. **Protect activated contact details** — Never overwrite an employee's verified mobile number or email during import.
4. **Reduce import-related support tickets** — Clear error reporting and rollback capability so admins can self-serve.
5. **Establish reliable matching** — System-generated unique IDs eliminate dependency on inconsistent employee numbers.

---

# Non-Goals

- **Delta imports (row-level create/update/delete)** — Phase 2. Phase 1 focuses on snapshot mode only.
- **Franchise/operator self-service import** — Phase 3. Requires multi-operator data isolation.
- **Real-time API-based user sync** — Future integration pathway. Phase 1 is file-based.
- **Import scheduling/automation** — Phase 1 is manual trigger only.
- **Duplicate employee number detection across tenants** — Out of scope; duplicates are handled within a tenant.

---

# User Stories

- As an **admin/owner**, I want to upload a populated import template so that employee records are created or updated in bulk.
- As an **admin/owner**, I want the system to generate a unique ID for each user so that matching is reliable even when employee numbers are inconsistent.
- As an **admin/owner**, I want to see a clear import report (new, updated, leavers, errors) so that I know exactly what changed.
- As an **admin/owner**, I want to roll back to the previous import if something went wrong so that I can recover without support help.
- As an **admin/owner**, I want to export the current user list before importing so that I can reconcile my data.
- As an **admin/owner**, I want protected fields (activated mobile, email) to never be overwritten during import so that verified employee contact details are preserved.
- As a **system**, I want to detect users missing from a snapshot and handle them by worker type (delete permanent, disable contractor/seasonal) so that the user list stays accurate.
**Edge Cases:**
- As an **admin/owner**, I want rows with critical errors rejected individually (not the whole file) so that valid rows still process.
- As a **system**, I want to reject the entire file if 20%+ rows have critical errors so that bad data doesn't corrupt the system.
- As a **system**, I want to never delete owners or admins missing from a snapshot without additional checks.

---

# Requirements

## Skeleton

### System-Generated Unique User ID

- On user creation (import or manual), generate a permanent, never-changing UUID.
- Use UUID as primary matching key. If UUID present → match on UUID. If not → fall back to tenant-configured identifier pair.
- UUID must never change, never be reused, and be unique across the entire platform.
- If Employee Number conflicts but UUID matches → trust UUID, update employee number.

### Snapshot Import Logic

- File represents complete list of active users. Matching hierarchy: UUID first, then identifier pair.
- Per-row outcomes: No match → Create. Single match → Update. Multiple matches → Block row.
- After processing: users missing from snapshot → Leaver Candidates. Permanent workers → delete. Contractor/seasonal → disable only.
- Do not delete owners/admins missing from snapshot — check role before action.
- If file structure or parsing fails → reject entire import.

### Selective Update Logic

- Protected fields (never overwritten): System UUID, Activated Mobile Number, Employee Number (if tenant locks it).
- Updatable fields: Employee Number, DOB, ID/Passport, Name, Last Name, Worker Type, Location, Work Area, City, Region, Country, Language, Status, Department, Position, Division.
- Blank values treated as blank (remove if previously imported). Do not write invalid formats.

### Data Cleaning & Validation

- Mobile: strip symbols/spaces, standardise to international format, reject invalid length. No two users share same activated mobile in tenant.
- Dates: accept YYYY-MM-DD, DD/MM/YYYY, MM-DD-YYYY. Store as ISO.
- Email: validate @ symbol and TLD. Employee number: preserve leading zeros, trim whitespace, accept alphanumeric.
- Template validation: reject if required columns missing, duplicate column names, or incompatible mapping.

### Import Report & Rollback

- Report shows: new users, updated users, leavers, protected fields skipped, disabled/enabled contractor-seasonal, duplicate mobiles, failed rows, unchanged/skipped, total imported.
- Admin can undo import (rollback to previous snapshot) from the import dashboard.
- Error output includes: summary, row-level errors, suggested corrections.

### Export Snapshot

- Admin can export current user snapshot before import. Includes all active/disabled users, all template fields, UUID, Status.
- Filter by: tenant, operator, location. All exports logged.

### File Rejection Rules

- Reject entire file if: template incorrect, duplicate columns, 20%+ rows with critical errors, file cannot be parsed.
- Reject individual rows if: missing required fields, invalid mobile/date/email, duplicate activated mobile, multiple identifier matches.

## Flesh

- Import history log: file name, imported by, timestamp, summary counts.
- Admin can download original import file from history.
- Operator ID column support (operator cannot modify users in other operators).

## Future

- Delta import mode: row-level action column (Create/Update/Remove).
- Import preview screen with variance warnings before committing.
- Import type selection (leavers only, update only, add only).
- Expanded template: contract dates, status fields, seasonal bulk enable/disable.
- Duplicate employee number detection with resolution UI.

---

# Success Metrics

**Leading:**

- Import success rate (% of files processed without full rejection) (target: >95%)
- Row-level error rate per import (target: <5%)
- Time to complete an import cycle (upload → report) (target: <5 min for 5,000 users)
**Lagging:**
- Reduction in import-related support tickets (target: -70% within 3 months)
- % of tenants with zero duplicate active mobile numbers (target: 100%)
- Rollback usage rate (indicator of data quality issues — should trend down)

---

# Open Questions

- **[Engineering]** How are UUIDs generated — UUIDv4, or a custom format with tenant prefix?
- **[Product]** Should the 20% error threshold for full file rejection be configurable per tenant?
- **[Engineering]** What is the max file size / max row count supported per import?
- **[Product]** When a leaver is deleted, what happens to their activity records (posts, reactions, messages)?
- **[Legal]** What data must be anonymised vs. fully purged when a leaver is deleted?
- **[Engineering]** How is rollback implemented — full snapshot restore or transaction-level undo?

---

# Timeline Considerations

- **Dependency:** Tenant Management must exist (tenant + identifier configuration).
- **Dependency:** Communication service for post-import invite sending.
- **Suggested phasing:** Core snapshot import + UUID + validation (Phase 1a) → Export + rollback + reporting (Phase 1b) → Delta imports (Phase 2).

---

## Acceptance criteria (BDD)

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
