# User Importer

---

> Lighter spec derived from the User Importer discovery document. Covers snapshot import, system-generated IDs, data cleaning, selective updates, and export functionality.

**Related PRDs:** [Groups.md](./Groups.md) (query-builder keys/values come from imported attributes), [User_Management.md](./User_Management.md), [Login_Account_Activation.md](./Login_Account_Activation.md). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

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

