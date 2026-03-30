# Payslip PDF — Acceptance Criteria & Edge Cases

**Source PRD:** [Payslip_PDF.md](./Payslip_PDF.md)
**Related:** [Tenant_Management.md](./Tenant_Management.md) (Elevated Auth config), [Login_Account_Activation.md](./Login_Account_Activation.md) (app password / step-up baseline), [User_Management.md](./User_Management.md) (Elevated Auth field permissions).
**Use:** Eng / QA — human-owned.

---

## Scope reminder

- **Tenant config:** Elevated Auth toggle, type, labels, remote app placement, import field, user management permissions.
- **Integration layer:** Dual endpoints (list + PDF), multi-auth support, IP allowlisting, no server-side storage.
- **Onboarding:** Notification screen → App Password (step-up) → Elevated Auth (if enabled) → HR Verified → Access Enabled.
- **Payslip viewing:** In-app viewer, list, loading states, refresh, error states, empty state.
- **Returning user:** App Password only once HR Verified; risk-triggered re-verification.
- **Recovery:** Password reset (clears HR Verified), Mobile Number Change (high-security re-verify).
- **Security / lockout:** 6-attempt (3 min), 10-attempt (24 hr + SMS), session timeout, no remember-me.
- **Analytics:** Auth events, error events, entry events (Blue Core); interaction events (remote app → bridge TBC).

---

## Acceptance Criteria — Tenant Configuration

| ID | Criterion |
|----|-----------|
| PAY-01 | **Given** a Tenant Owner opens tenant config **when** Elevated Auth toggle is OFF **then** payslip access uses App Password only; no Elevated Auth input shown to workers at any point. |
| PAY-02 | **Given** Elevated Auth toggle is ON **when** tenant saves config **then** auth type, custom label, custom helper text, and "Require for Onboarding" toggle are all required fields before config can be saved. |
| PAY-03 | **Given** auth type = ID Number or Passport Number **when** worker reaches Elevated Auth step **then** input renders as text field; given auth type = PUK or Password **then** input renders as numeric or text (per type). |
| PAY-04 | **Given** tenant sets Custom Input Label **when** employee sees Elevated Auth screen **then** the label shown exactly matches the tenant-configured string (no hard-coded fallback visible). |
| PAY-05 | **Given** tenant sets Custom Helper Text **when** employee sees Elevated Auth screen **then** helper text shown exactly matches the tenant-configured string. |
| PAY-06 | **Given** Remote App Display Name is configured **when** app renders the entry point (Profile or Explorer) **then** the name shown matches the tenant-configured string. |
| PAY-07 | **Given** Remote App Placement = Profile → Work Essentials **when** employee opens Profile **then** remote app entry appears under Work Essentials with configured name. |
| PAY-08 | **Given** Remote App Placement = Explorer **when** employee opens Explorer **then** remote app entry appears in the configured section/category with configured name. |
| PAY-09 | **Given** a new "Elevated Auth Value" column is present in the import CSV **when** import completes **then** the value is stored encrypted and is not visible in any admin or worker UI — only editable by Tenant Owner or Elevated Admin. |
| PAY-10 | **Given** a standard Admin opens any user record **when** Elevated Auth is configured for the tenant **then** the Elevated Auth field is not rendered — not blank, not masked, simply absent. |
| PAY-11 | **Given** a Tenant Owner or Elevated Admin opens a user record **when** Elevated Auth is configured **then** the field is editable and saving updates the encrypted stored value. |

---

## Acceptance Criteria — Integration Layer

| ID | Criterion |
|----|-----------|
| PAY-12 | **Given** employee taps a payslip period **when** the integration layer calls the Payslip PDF endpoint **then** the PDF is streamed on demand and no copy is retained server-side after delivery. |
| PAY-13 | **Given** the Payslip List endpoint is called **when** a valid response is returned **then** periods are displayed sorted newest → oldest with no salary or sensitive data values visible. |
| PAY-14 | **Given** a client integration requires IP allowlisting **when** the Wyzetalk integration layer makes outbound requests **then** requests originate from the configured static IP. |
| PAY-15 | **Given** a client uses a non-standard auth mechanism (OAuth, API key, Basic Auth) **when** the integration is configured **then** the request is authenticated correctly without code changes to Blue Core. |
| PAY-16 | **Given** the client's payroll system is on a private intranet only **when** the integration is attempted **then** the system surfaces a clear configuration error and the feature is not enabled until public endpoints or a client proxy are available. |

---

## Acceptance Criteria — Onboarding (First-Time)

| ID | Criterion |
|----|-----------|
| PAY-17 | **Given** payslips are enabled for a tenant **when** an employee opens the app for the first time after enablement **then** the notification screen is shown with "Verify now" and "Not now" buttons. |
| PAY-18 | **Given** employee taps "Not now" **when** they later tap the payslip entry point **then** they are presented with the verification flow and cannot access the Payslip List until it is completed. |
| PAY-19 | **Given** employee taps "Verify now" **when** Step 1 renders **then** title = "Confirm Your Identity", input label = "App password", button = "Continue". |
| PAY-20 | **Given** employee enters correct App Password at Step 1 **when** Elevated Auth is OFF or Require for Onboarding = NO **then** HR Verified status is set and Access Enabled screen is shown. |
| PAY-21 | **Given** employee enters correct App Password at Step 1 **when** Elevated Auth is ON and Require for Onboarding = YES **then** Step 2 (Elevated Auth) is presented. |
| PAY-22 | **Given** employee enters correct Elevated Auth value at Step 2 **when** value matches the stored encrypted value **then** HR Verified status is set and Access Enabled screen is shown. |
| PAY-23 | **Given** Access Enabled screen is shown **when** employee taps "Go to My Pay-slips" **then** Payslip List is loaded. |
| PAY-24 | **Given** employee arrives via SMS / push / email deep-link **when** HR Verified status is not set **then** full auth flow (App Password → Elevated Auth if enabled) is enforced before any payslip content is shown. Deep-link target loads only after successful auth. |
| PAY-25 | **Given** employee arrives via deep-link **when** HR Verified is already set **then** App Password step-up is shown before loading the deep-link target; Elevated Auth is not repeated. |

---

## Acceptance Criteria — Payslip Viewing

| ID | Criterion |
|----|-----------|
| PAY-26 | **Given** Payslip List loads **when** periods are available **then** list is sorted newest → oldest; no salary values, employee ID, or other sensitive fields are displayed in the list rows. |
| PAY-27 | **Given** employee taps a payslip row **when** PDF loads **then** PDF renders inside the app using a native viewer (PDFKit / androidx.pdf / equivalent); the device browser is not opened at any point. |
| PAY-28 | **Given** PDF is loading **when** load takes >0.5 s **then** a loading spinner or progress indicator is visible until render completes. |
| PAY-29 | **Given** PDF load fails **when** any error condition is met **then** the correct error copy and retry action are displayed per the error state table in the PRD. |
| PAY-30 | **Given** employee taps "Reload Pay-slips" **when** the button is tapped **then** a cache-busting request is sent (timestamp or equivalent), stale local data is cleared, and the list reloads from the remote endpoint. |
| PAY-31 | **Given** no payslips are available for the employee **when** Payslip List loads **then** empty state is shown: "No pay-slips available. Your pay-slips will appear once published by HR." with optional "If this seems wrong, please speak to HR." |
| PAY-32 | **Given** tenant download toggle is OFF **when** employee views a payslip **then** no download or share button / option is rendered. |
| PAY-33 | **Given** tenant download toggle is ON **when** employee views a payslip **then** download and share actions are available. |

---

## Acceptance Criteria — Returning User

| ID | Criterion |
|----|-----------|
| PAY-34 | **Given** employee is HR Verified **when** they tap the payslip entry point on a subsequent visit **then** only App Password step-up is shown; Elevated Auth step is not shown. |
| PAY-35 | **Given** employee enters wrong App Password on returning visit **when** error is returned **then** "Wrong password. Please try again." is shown. After 6 attempts → 3-minute lockout message. |

---

## Acceptance Criteria — Recovery Flows

| ID | Criterion |
|----|-----------|
| PAY-36 | **Given** employee taps "Forgot password" **when** OTP is sent **then** on correct OTP entry, employee can set a new password; on success: "Your password has been updated." HR Verified status is immediately set to **Not HR Verified**. |
| PAY-37 | **Given** HR Verified is Not HR Verified after password reset **when** employee next taps payslips **then** full onboarding flow is triggered again (App Password → Elevated Auth if enabled). |
| PAY-38 | **Given** employee changes mobile number **when** payslips are enabled for the tenant **then** mobile is marked Not Verified and HR Verified is set to Not HR Verified immediately on number update. |
| PAY-39 | **Given** employee completes mobile number change **when** they next attempt payslip access **then** flow is: OTP verify new number → App Password step-up → Elevated Auth (if enabled) → HR Verified restored. |
| PAY-40 | **Given** OTP is invalid or expired during any recovery flow **when** employee submits **then** "Invalid or expired code." is shown and the employee can request a new OTP. |

---

## Acceptance Criteria — Lockout & Security

| ID | Criterion |
|----|-----------|
| PAY-41 | **Given** employee enters wrong App Password or Elevated Auth value **when** 6th failed attempt is made **then** 3-minute lockout is applied and copy reads: "Too many attempts. Please try again in 3 minutes." |
| PAY-42 | **Given** 3-minute lockout is active **when** employee attempts to retry before the window expires **then** the action is blocked and remaining time is indicated (or static copy shown). |
| PAY-43 | **Given** employee makes 10 failed App Password attempts in a 24-hour window **when** the 10th attempt fails **then** account is locked for 24 hours, copy reads: "Your pay-slip access has been locked for 24 hours. Please speak to HR.", and an SMS is sent to the employee's registered number. |
| PAY-44 | **Given** session is idle beyond the configured timeout (2–5 min) **when** employee returns to the app **then** payslip screens require re-authentication; copy: "Your session has expired. Please log in again." |
| PAY-45 | **Given** any payslip auth step **when** rendered on any supported platform (iOS, Android) **then** error copy strings are byte-for-byte identical — no platform-specific variations. |
| PAY-46 | **Given** App Password step-up for payslips **when** the OS or app offers to save or autofill the password **then** the input field is marked to suppress autofill/save (e.g. `autocomplete="off"` / equivalent native flag). |

---

## Acceptance Criteria — Analytics

| ID | Criterion |
|----|-----------|
| PAY-47 | **Given** employee completes or fails App Password step-up **when** the event occurs **then** event is logged in Blue Core with: outcome (success/fail), attempt count, timestamp. |
| PAY-48 | **Given** lockout is triggered (3 min or 24 hr) **when** the event occurs **then** lockout type and timestamp are logged in Blue Core. |
| PAY-49 | **Given** PDF fetch fails or times out **when** the error occurs **then** error type (API error / network / timeout) and timestamp are logged in Blue Core. |
| PAY-50 | **Given** employee views the Payslip List screen or sees the empty state **when** screen renders **then** an entry event is logged in Blue Core. |

---

## Edge Cases & Negative Paths

| Area | Edge / negative | Expected behaviour |
|------|----------------|-------------------|
| **Elevated Auth not on record** | Employee's Elevated Auth value was never imported or is blank | Step 2 shows: "We don't have your [Custom Label] on record. Please speak to HR." Access is blocked until HR resolves. |
| **Auth type = Passport (global)** | Employee in country without mandatory national ID | Input accepts free text; no format validation applied; helper text must be set by tenant to guide workers. |
| **Deep-link + already HR Verified** | Employee taps push notification when HR Verified is set | App Password step-up only → then loads deep-link target directly. |
| **Deep-link + not HR Verified** | Employee taps push notification, never completed onboarding | Full onboarding flow before deep-link target loads. |
| **Slow API on Payslip List** | List endpoint >1.5 s response | "The system is busy, please try again later." + Retry; spinner shown throughout wait. |
| **Two sessions simultaneously** | Employee opens payslips on two devices | Each session independently enforces step-up auth; no shared session state assumed. |
| **Mobile number change mid-session** | Number change triggered while employee has active payslip session | Session is invalidated on number-change confirmation; employee must re-verify on next payslip access. |
| **Import — duplicate Elevated Auth value** | Same value imported for two users (e.g. both set to same PUK) | System accepts; no uniqueness enforced at platform level. This is a client data quality issue — flag in implementation guide. |
| **Tenant disables Elevated Auth after workers are HR Verified** | Toggle switched OFF after some workers completed onboarding | HR Verified status is retained; App Password is sufficient going forward. Existing HR Verified employees are not forced to re-onboard. |
| **Tenant enables Elevated Auth after go-live** | Toggle switched ON after workers are already accessing payslips | HR Verified status is reset to Not HR Verified for all users in the tenant on next payslip access; full onboarding flow triggered. *(Confirm with engineering — needs explicit reset mechanism.)* |
| **PDF viewer unavailable / library missing** | Native viewer not available on device | Fallback: display error "Unable to open PDF. Please update your app." Do not open browser. |
| **Payslip List empty but periods exist on payroll system** | API returns valid but empty array | Empty state shown; do not imply a system error. |

---

## Outstanding

- Lockout timer confirmation (3 min vs 6 min — engineering to close).
- Elevated Auth logic location (Blue backend vs payroll system API) — changes data flow and POPIA obligations.
- Remote App placement in Explorer — exact section/category structure needs design workshop.
- Remote-app-side interaction events → Blue Core bridge — dev investigation required before PAY-50 can be fully specified.
- Tenant behaviour when Elevated Auth is enabled after workers are already HR Verified — needs explicit reset mechanism confirmation.
- Session timeout duration — confirm 2–5 min or adjust for frontline context.

---

*Payslip PDF — v0.1 · 2026-03-26. Source: UX/PM discovery notes (PDF payslip.docx). Enrich with Dex context (Elevated Auth task, signal briefs EV-2026-03-002 + EV-2026-03-004).*
