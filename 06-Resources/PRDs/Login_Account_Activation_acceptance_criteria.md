# Login & Account Activation — Acceptance criteria & edge cases

**Source PRD:** [Login_Account_Activation.md](./Login_Account_Activation.md)  
**Related:** [Tenant_Management.md](./Tenant_Management.md) (QR, codes, identifiers, disabled tenant), [Communication.md](./Communication.md) (SMS OTP), [Feed.md](./Feed.md) (post-login landing).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §3  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Entry:** QR → tenant login, global login (scan / company code / Find My Account), auto-detect tenant, company code valid/invalid/expired.  
- **Activation:** two tenant-configured identifiers + cell, OTP, password create, duplicate mobile handling, owner invite path.  
- **Returning:** session → feed; manual login; forgot password; number change; locked/deactivated UX.

---

## Acceptance criteria — Tenant routing

| ID | Criterion |
|----|-----------|
| LA-01 | **Given** user scans **QR** **when** landing **then** **tenant-branded** login (logo, theme, company name); QR carries **tenant id only** — no PII. |
| LA-02 | **Given** global login **when** user chooses path **then** Scan QR, Enter company code, and Find My Account are available. |
| LA-03 | **Given** company code **when** entered **then** valid → redirect to tenant login; invalid → “Company code not found.”; expired → “This code has expired.” |
| LA-04 | **Given** multiple tenant matches **when** auto-detect **then** user picks from list; none → global fallback. |

---

## Acceptance criteria — First-time activation

| ID | Criterion |
|----|-----------|
| LA-05 | **Given** login screen **when** shown **then** displays **two** tenant-configured identifier fields + **cell**; valid pairs per PRD (e.g. Employee Number + ID). |
| LA-06 | **Given** identifier match **when** OTP sent **then** SMS via Communication; wrong/expired OTP shows clear error; **resend** with countdown. |
| LA-07 | **Given** OTP success **first-time** **when** continuing **then** password creation with strength + show/hide; **auto-login** after. |
| LA-08 | **Given** duplicate **activated** mobile in tenant **when** detected **then** “number already in use” + **support ticket** auto-created. |

---

## Acceptance criteria — Account owner

| ID | Criterion |
|----|-----------|
| LA-09 | **Given** owner invite **when** delivered **then** SMS/email contains activation link, username, temp password; link opens **company login**. |
| LA-10 | **Given** owner **when** activating **then** mobile OTP + password; **no QR required** for owner type. |

---

## Acceptance criteria — Find My Account

| ID | Criterion |
|----|-----------|
| LA-11 | **Given** user opens Find My Account **when** form submitted **then** required fields + confirmation checkbox; **2+ field match** → update + resend invite message per PRD. |
| LA-12 | **Given** **no** match **when** submitted **then** pending verification / HR message per PRD; **no** silent failure. |

---

## Acceptance criteria — Returning users

| ID | Criterion |
|----|-----------|
| LA-13 | **Given** valid **session** **when** app opens **then** **skip login** → **feed**; expired → login form. |
| LA-14 | **Given** failed login **when** credentials wrong **then** inline error; Forgot password + Find My Account visible. |
| LA-15 | **Given** forgot password **when** flow completed **then** OTP to registered channel → new password → confirmation. |
| LA-16 | **Given** **locked** / **deactivated** account **when** user tries **then** distinct copy: locked vs inactive per PRD. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Tenant** | Tenant disabled | Align **Tenant_Management** — no OTP, clear message. |
| **Find My Account** | Fuzzy match borderline | Confidence threshold + audit — align Tenant §5. |
| **Session** | Token theft suspicion | Out of scope Phase 1 — document for security backlog. |

---

## Outstanding

- Lockout after N failures (count + duration).  
- Find My Account retention + fuzzy algorithm — **Tenant AC** overlap.  
- Wizard vs single-scroll — design.

---

*Happy path lands on Feed; coordinate branding with Theming + Tenant.*
