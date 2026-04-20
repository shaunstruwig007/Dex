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
  - When Product Analytics exists, add importer events (started, completed, file_rejected, rollback)
target_metrics:
  import_file_success_rate:
    metric_type: funnel
    target: ">95% of files processed without full rejection (leading — Success Metrics)"
    timeframe: post_ship_review
    tool_event: deferred_until_analytics_stack
  row_error_rate:
    metric_type: property_average
    target: "<5% critical row errors per import (leading)"
    timeframe: per_import
    tool_event: deferred_until_analytics_stack
  support_ticket_reduction:
    metric_type: event_count
    target: "-70% import-related support tickets within 3 months (lagging)"
    timeframe: 90_days_post_ship
    tool_event: manual_support_system
---

# User Importer

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Tenant admins importing and maintaining accurate rosters despite turnover and data quality issues  
**Estimated Effort:** Multi-sprint core platform; ongoing data-quality investment

> **Steerco:** Essential · **Phase 1:** Snapshot file import, manual trigger, UUID matching, protected fields, leaver handling, rollback, export — per Non-Goals (no delta API sync in Phase 1).

**Related PRDs:** [Groups.md](./Groups.md) (query-builder keys/values come from imported attributes), [User_Management.md](./User_Management.md), [Login_Account_Activation.md](./Login_Account_Activation.md), [Tenant_Management.md](./Tenant_Management.md). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) (build order: Tenant Management → communication minimal → **User Importer** → User Management / Profile).

---

## The Job to Be Done

Admins **import**, **clean**, and **incrementally update** employee data with stable identifiers — feeding **Groups**, **User Management**, and **activation** without duplicate or stale users.

**User value:** Foundation for targeting and login; reduces comms misfires and support load from bad rosters.

---

## Work Packages

### WP-1: Snapshot ingest, template & file-level validation (P0 — No dependencies)

**Priority:** P0  
**Dependencies:** No dependencies (tenant + identifier configuration from [Tenant_Management.md](./Tenant_Management.md))  
**Files:** Import pipeline, template parser — **implementation repos TBD** (see Technical Blueprint)  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|-------------|
| 1a | Admin uploads a populated import template | File accepted or rejected with parse/mapping error |
| 1b | Template structure validated (required columns, no duplicate column names, compatible mapping) | Incorrect template → **entire import rejected** (IMP-06) |
| 1c | Row-level critical errors counted; **≥20%** critical rows → **entire file rejected** | Import stops before commit; admin sees file-level message (IMP-07) |
| 1d | Valid rows proceed when file passes gates | Row outcomes feed WP-2 |

**Maps to BDD:** IMP-06, IMP-07; template rules under Requirements.

---

### WP-2: System UUID & row matching / dedupe (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** User identity service — **TBD**  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|-------------|
| 2a | New user creation assigns a permanent platform-unique UUID | UUID present on record; never changes (IMP-01) |
| 2b | Match order: **UUID first**, else tenant **identifier pair**; multiple matches → **row blocked** | Row in report as blocked; no silent merge (IMP-02) |
| 2c | UUID match with changed employee number → **trust UUID**, update number | Single updated user; audit trail in report (IMP-03) |

**Maps to BDD:** IMP-01, IMP-02, IMP-03.

---

### WP-3: Leavers, role guards & selective field updates (P0 — Depends on WP-2)

**Priority:** P0  
**Dependencies:** WP-2  
**Files:** User profile write model — **TBD**  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|-------------|
| 3a | Users missing from snapshot → leaver candidates; permanent → delete, contractor/seasonal → disable per policy | Counts in import report; no wrongful delete of owners/admins without extra checks (IMP-04, IMP-05) |
| 3b | **Protected fields** (activated mobile, email per PRD) **never** overwritten by file | Report lists protected-field skips (IMP-08) |
| 3c | Listed updatable fields apply; blank clears prior imported value where applicable; invalid formats → row reject | Row-level errors with messages (IMP-09) |
| 3d | Mobile normalisation + duplicate activated mobile in tenant → row reject | IMP-10 |
| 3e | Invalid dates/emails → row-level reject | IMP-11 |

**Maps to BDD:** IMP-04 through IMP-11.

---

### WP-4: Import report, history & rollback (P0 — Depends on WP-3)

**Priority:** P0  
**Dependencies:** WP-3  
**Files:** Admin dashboard / API — **TBD**  
**VPS-eligible:** Yes (API); admin UI may need web toolchain

| # | Behavior | Observable |
|---|----------|-------------|
| 4a | Report shows new, updated, leavers, protected skips, failures, unchanged, totals | Admin-visible summary (IMP-12) |
| 4b | Rollback restores **previous snapshot** state | Post-rollback data matches prior snapshot per implementation (IMP-13) |
| 4c | **Flesh:** Import history — file name, imported by, timestamp, counts; downloadable original file | History entries auditable |

**Maps to BDD:** IMP-12, IMP-13; Flesh requirements.

---

### WP-5: Export snapshot (P1 — Depends on WP-1)

**Priority:** P1  
**Dependencies:** WP-1 (read path of current roster)  
**Files:** Export job / download — **TBD**  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|-------------|
| 5a | Admin exports current user list before import | File includes active/disabled users, template fields, UUID, status; export **logged** (IMP-14) |
| 5b | Optional filters: tenant, operator, location | Filtered export matches selection |

**Maps to BDD:** IMP-14.

**Dependency graph:**

```text
WP-1 (P0) ──> WP-2 (P0) ──> WP-3 (P0) ──> WP-4 (P0)
   │
   └──> WP-5 (P1)   (parallel after WP-1 for export-only workstreams)
```

**Cross-PRD:** Imported attribute keys feed [Groups.md](./Groups.md) query builder — if import removes a key used in a saved group, surface invalid query to admin (Edge cases table).

---

## Success Scenarios

### Scenario 1: Happy path — clean snapshot

**Setup:** Valid template; &lt;20% critical row errors; tenant identifier config set.  
**Action:** Admin uploads snapshot; confirms import.  
**Observable Outcome:** Report shows expected new/updated counts; no full-file rejection; Groups-capable attributes available for segments.  
**Success Criteria:** All rows either applied or skipped with row-level non-blocking messages; **BDD IMP-01–IMP-14** satisfied in automated QA suite (target **≥95%** suite pass rate — Satisfaction Metric).

### Scenario 2: Error — multimatch row

**Setup:** Two existing users match identifier pair.  
**Action:** Row processed.  
**Observable Outcome:** Row **blocked**; no duplicate merge; message in report (IMP-02).  
**Success Criteria:** Zero duplicate users created from that row (assert in test DB).

### Scenario 3: Error — file-level rejection (20% critical)

**Setup:** Synthetic file with ≥20% critical row errors.  
**Action:** Import run.  
**Observable Outcome:** **Entire file rejected**; no partial commit (IMP-07).  
**Success Criteria:** User count unchanged vs pre-import state.

### Scenario 4: Recovery — rollback

**Setup:** Successful import followed by detected admin error.  
**Action:** Admin triggers rollback from import dashboard.  
**Observable Outcome:** Tenant user data matches **previous snapshot** boundary per implementation (IMP-13).  
**Success Criteria:** Automated test compares checksum or row counts pre/post rollback (implementation-defined binary pass).

### Scenario 5: Guardrail — owner missing from snapshot

**Setup:** Owner account absent from file.  
**Action:** Leaver logic runs.  
**Observable Outcome:** **No delete** without extra checks (IMP-05).  
**Success Criteria:** Owner record still exists and active after import.

---

## Satisfaction Metric

**Overall Success:** **≥95%** of BDD importer suite runs pass (all IMP-xx criteria covered by automation where technically feasible; remainder explicitly **manual QA**-signed).

**Measured by:** CI test suite against IMP-xx + periodic QA audit on edge cases (duplicate mobiles, international formats, rollback).

---

## Metrics Strategy

### Events to Track (none — deferred)

`analytics_tool: none`. When [Product_Analytics.md](./Product_Analytics.md) lands, add events such as `import_started`, `import_completed`, `import_file_rejected`, `import_rollback_invoked` (names TBD with analytics owner). **Do not block GA on analytics.**

### Success Targets

Leading/lagging targets are defined under **# Success Metrics** (file success rate, row error rate, time to complete, support tickets, duplicate mobiles, rollback usage as quality signal).

### Business Outcome Mapping

This feature ladders to **accurate targeting** ([Groups.md](./Groups.md)), **reliable activation** ([Login_Account_Activation.md](./Login_Account_Activation.md)), and **lower support cost** from roster errors. Expected impact: import-related ticket reduction target **−70% within 3 months** (lagging — requires support analytics).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- Imported **attribute keys** drive **[Groups.md](./Groups.md)** query builder — field catalog must stay aligned.  
- **Phase 1:** **Snapshot** file import only; **manual** trigger — no scheduled automation, no real-time HRIS API (see Non-Goals).  
- **Protected contact fields** (activated mobile, verified email) are **never** overwritten by import file.  
- **UUID** is the canonical stable key; matching hierarchy **UUID → tenant identifier pair**; multimatch rows **block**.  
- **High-turnover / mixed workforce** behaviours (leavers by worker type, owner/admin guards) per Problem Statement and stakeholder research.  
- **Rollback** must restore to **previous snapshot** semantics (exact mechanism — transaction vs snapshot store — **Open Questions**).

---

## Technical Blueprint

### System Integration Map

```text
Admin --> Import_UI --> Import_worker --> User_store --> Groups_engine (recalc segments)
                |              |
                v              v
         File_template    Communication_service (invites post-import — dependency)
Tenant_config (identifiers, worker types) --> Import_worker
Import_history / Export <---> User_store
```

Cross-PRD: [Tenant_Management.md](./Tenant_Management.md) (tenant + identifier configuration); [communication_service.md](./communication_service.md) (minimal dependency for post-import comms per Timeline).

### Implementation repository paths (TBD)

| Layer | Path / owner |
|-------|----------------|
| Import workers / parsers | TBD |
| Admin UI (upload, report, rollback) | TBD |
| Mobile | TBD if any admin surface is mobile |
| User / identity API | TBD |

### Config & Setup

Concrete shapes belong in implementation repos. **Illustrative only** (not binding):

```yaml
# TBD — tenant-level importer config (illustrative)
tenant_importer:
  identifier_pair: ["employee_number", "national_id"]   # example
  lock_employee_number_after_activation: true              # if tenant locks
  critical_error_reject_threshold_percent: 20            # IMP-07 — product Q: tenant-configurable?
```

### Key Implementation Patterns

- **Snapshot semantics:** File = complete active set; after row processing, **missing users** → leaver pipeline (IMP-04).  
- **Row outcomes:** No match → create; single match → update; multiple matches → block row.  
- **Validation layer:** Normalise mobile to international format; validate email TLD; dates → ISO storage; preserve employee number leading zeros.  
- **Operator scope:** Operator ID column — users cannot modify users outside their operator (Flesh).

### Dependencies (runtime)

| Package / system | Version | Purpose |
|------------------|---------|---------|
| File parsing (CSV/XLSX TBD) | TBD | Snapshot ingest |
| Identity / UUID issuance | Platform standard | IMP-01 |

### Environment Variables

| Variable | Example Value | Where Set | Purpose |
|----------|---------------|-----------|---------|
| *TBD with implementation* | — | Secrets / config service | Max file size, row limits, feature flags |

---

## Validation Protocol

Vault-era checks: static proof the spec stays internally consistent and every **IMP-xx** ID remains present. **Product QA** executes full BDD against running software (not in this vault).

### WP-1 checks

```bash
# Check 1.1: File-level reject criteria documented
grep -c "IMP-06" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1

# Check 1.2: 20% threshold for full file reject
grep -c "IMP-07" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

### WP-2 checks

```bash
grep -c "IMP-01" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
grep -c "IMP-02" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
grep -c "IMP-03" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

### WP-3 checks

```bash
for id in IMP-04 IMP-05 IMP-08 IMP-09 IMP-10 IMP-11; do
  c=$(grep -c "$id" "06-Resources/PRDs/User_Importer.md" || true)
  test "$c" -ge 1 || { echo "FAIL: $id"; exit 1; }
done
echo "PASS: WP-3 BDD IDs present"
```

### WP-4 checks

```bash
grep -c "IMP-12" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
grep -c "IMP-13" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

### WP-5 checks

```bash
grep -c "IMP-14" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

### Cross-link checks

```bash
grep -c "Groups.md" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
grep -c "PRD_Product_Map.md" "06-Resources/PRDs/User_Importer.md"
# PASS: >= 1
```

**Manual (not counted in automated vault pass rate):** Full BDD UAT; destructive leaver tests; rollback integrity; max file size / row limits once engineering answers land.

### Post-launch metrics (not agent-verifiable at vault build time)

Adoption of export-before-import, import success rates from production, support ticket trends — require production data and/or analytics stack.

---

## Success Rate Target

**14 of 14** BDD row IDs (**IMP-01** … **IMP-14**) must remain present in this file after each edit (`grep` coverage above).  
**Plus 2** cross-link checks (**Groups.md**, **PRD_Product_Map.md**).  
**Overall:** **16/16** automated string checks pass before merge.

---

## Notes for Agent Implementation

**Scout priorities:**

1. Resolve **Open Questions** (UUID version, max rows/size, rollback storage model, leaver content retention with Feed/Posts).  
2. Align attribute catalog with [Groups.md](./Groups.md) query-builder keys.

**Worker tasks:**

1. Implement WP-1 → WP-4 in order; ship WP-5 in parallel once read model stable.  
2. Build automated tests mapped **1:1** to IMP-xx rows.  
3. Document admin runbook: template, error glossary, rollback procedure.

**Soldier review focus:**

- No silent multimatch merges.  
- Protected fields never overwritten.  
- Owner/admin leaver guards cannot regress.  
- Import does not orphan Groups in undefined state — edge case surfaced to admin.

---

## Files to Create

```
# At implementation time (outside vault — examples)
docs/runbooks/user-import-template.md
test/importer/bdd_imp_01_14_suite.{ext}
config/importer/tenant_defaults.yaml   # shape TBD
```

## Files to Modify

```
# Implementation repos — TBD paths
User/identity service: UUID issuance, matching, leaver pipeline
Admin console: upload, report, history, rollback, export
Groups service: segment recalc hooks on attribute changes
```

---

## Out of Scope

- **Delta imports** (row-level create/update/delete column) — Phase 2.  
- **Franchise/operator self-service import** — Phase 3 / multi-operator isolation.  
- **Real-time API-based HRIS sync** — future; Phase 1 is file-based.  
- **Import scheduling/automation** — Phase 1 manual trigger only.  
- **Duplicate employee numbers across tenants** — out of scope; dedupe is **within** tenant.  
- Full **content retention / anonymisation** policy for deleted leavers — legal/product; cross-cutting with Feed/Posts (see Open Questions and Edge cases).

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

## Scope reminder

- **Phase 1:** Snapshot import only; manual trigger; UUID matching hierarchy; protected fields; leaver handling by worker type; rollback; **20%** row error threshold for **full file** reject.

---

## Acceptance criteria (BDD)

**Source PRD:** [User_Importer.md](./User_Importer.md)  
**Related:** [Groups.md](./Groups.md) (keys/values), [User_Management.md](./User_Management.md), [Login_Account_Activation.md](./Login_Account_Activation.md), [Tenant_Management.md](./Tenant_Management.md).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1  
**Use:** Eng / QA — **human-owned**.

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

*Agent-prd retrofit — 2026-04-17 · review swarm (4 sequential passes) — 2026-04-17*
