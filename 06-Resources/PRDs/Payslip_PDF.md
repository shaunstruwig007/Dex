---
prd_id: payslip-pdf
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
  - Remote app token protocol ↔ Elevated Auth workshop
---

# Payslip PDF — Remote Access & Elevated Auth

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Employees viewing PDF payslips via remote app with elevated auth and tenant policy  
**Estimated Effort:** High — security + integration

---

> Spec for secure, configurable, frontline-friendly access to remote PDF payslips via the Wyzetalk mobile app. Covers Elevated Auth (Blue Core addition), tenant configuration, integration layer, onboarding flow, payslip viewing, recovery flows, and analytics.

**Related PRDs:** [Tenant_Management.md](./Tenant_Management.md) (Elevated Auth is a Blue Core addition — extends existing tenant config), [Login_Account_Activation.md](./Login_Account_Activation.md) (app password / step-up auth baseline), [User_Management.md](./User_Management.md) (Elevated Auth field permissions). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Employees **open payslip PDFs** through the approved remote app path after **elevated authentication** — with tenant-configurable factors, auditability, and recovery flows.

**User value:** FLM-style reference implementation; prerequisite for [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) payslip-on-demand.

---

## Work Packages

### WP-EA: Elevated auth gates (P0)

**Priority:** P0  
**Dependencies:** [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md); [Tenant_Management.md](./Tenant_Management.md)  
**Files:** Remote app TBD  
**VPS-eligible:** No

### WP-Integrate: HRIS / PDF pipeline (P0)

**Priority:** P0  
**Dependencies:** Integration layer spec in body  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-UX: Onboarding & recovery (P0)

**Priority:** P0  
**Dependencies:** WP-EA  
**Files:** Mobile TBD  
**VPS-eligible:** No

### WP-Analytics: Delivery metrics (P1)

**Priority:** P1  
**Dependencies:** [Product_Analytics.md](./Product_Analytics.md)  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- User passes elevation → PDF displays; failures audited.  
- Recovery paths per BDD without exposing data pre-auth.

---

## Satisfaction Metric

**Overall Success:** BDD Payslip suite pass **≥ 95%**; **0** critical findings in security review for token flow.

**Measured by:** QA + pentest.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. View/success events deferred to Product Analytics catalog.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Elevated auth** before sensitive PDF.  
- **Evidence** rows (`EV-*`) inform positioning — see Market file.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Remote payslip app | TBD |
| Core token validation | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Payslip_PDF.md"
# PASS: >= 1

grep -c "Elevated" "06-Resources/PRDs/Payslip_PDF.md"
# PASS: >= 1
```

**Manual:** Security review; device testing.

---

## Notes for Agent Implementation

**Scout priorities:** [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) protocol timing vs this PRD.

---

## Files to Create / Modify

```
# TBD — see body sections
```

---

## Out of Scope

- Non-PDF payroll formats unless added by steerco.

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-002](../Market_and_competitive_signals.md) | Market: TA vendors shipping WhatsApp/SMS-native frontline flows. Validates channel urgency and the "always-on mobile" expectation for payslip access. |
| [EV-2026-03-004](../Market_and_competitive_signals.md) | Market: 70% of employee–system interactions shifting to conversational; WhatsApp HRMS integrations for payslips, leave, attendance now multi-vendor standard. Validates scope and urgency of this feature. |

---

## Problem Statement

Frontline employees need reliable, private, and simple access to monthly payslips from their mobile devices. Today, delivery is inconsistent and support-heavy because:

- **Fragmented integrations.** Client payroll systems expose different endpoints, auth methods, and network requirements (public internet vs intranet, IP whitelisting), causing long lead times and bespoke work per client.
- **Device and browser fragility.** Employees with older phones or outdated PDF viewers experience failed openings or stale cached files; many can't clear cache or update viewers.
- **PUK / password overhead.** Distributing and resetting PUKs via printed payslips or HR is admin-heavy and breaks at scale once print is retired.
- **Security and compliance pressure.** Payslips contain sensitive personal data; the platform must minimise data collection, restrict access, and meet GDPR/POPIA expectations.
- **Inconsistent viewing experience.** Current approach opens PDFs via the device's preferred browser — less secure, inconsistent, and more error-prone than in-app viewing.

**Result:** High support load (access issues, forgotten PUKs, broken downloads), slower go-lives per client due to custom integrations, and employee frustration that erodes trust in the app.

---

## Goals

1. **Secure the access path** — Multi-step identity verification (App Password + optional Elevated Auth) protects sensitive payroll data and prevents impersonation.
2. **Make auth configurable per tenant** — Elevated Auth type, label, helper text, and onboarding requirement are all tenant-controlled without engineering involvement.
3. **Standardise the integration layer** — One flexible API contract handles multiple payroll backends; no long-term PDF storage on Wyzetalk servers.
4. **Deliver a reliable in-app viewer** — PDFs open inside the app, never in external browsers; loading states, refresh, and error recovery are explicit.
5. **Reduce support burden** — Clear error states, self-service recovery flows, and predictable lockout logic minimise HR and support tickets.
6. **Comply with GDPR / POPIA** — Data minimisation, restricted access, no sensitive data exposed in lists, and breach notification readiness.

---

## Non-Goals

- **Long-term PDF storage on Wyzetalk servers** — PDFs are fetched on demand and streamed; not stored.
- **Intranet-only payroll systems without client middleware** — Client must expose public endpoints or build a secure proxy; Wyzetalk cannot connect to purely internal networks.
- **Built-in payroll calculation or generation** — Wyzetalk fetches and displays; it does not generate payslips.
- **Desktop / web payslip access** — Phase 1 is mobile app only.
- **Biometric authentication** — Future phase; flagged as best practice but not in scope here.
- **Multiple auth layers in a single session** — After HR Verified status is set, returning users only re-enter App Password (not Elevated Auth) unless a risk event is detected.

---

## User Stories

**Tenant / admin configuration**

- As a **Tenant Owner**, I want to toggle Elevated Auth on/off so that I can apply the right security level for my organisation's payslip setup.
- As a **Tenant Owner**, I want to choose the auth type (ID, Passport, PUK, Password, or custom) and set a custom label and helper text so that the onboarding copy matches my workforce's language and existing HR processes.
- As a **Tenant Owner**, I want to choose where the remote app appears (Profile → Work Essentials or Explorer) and give it a custom name so that workers can always find their payslips without confusion.
- As a **Tenant Owner / Elevated Admin**, I want to edit a single user's Elevated Auth value so that I can correct mismatches without a full re-import.
- As a **standard Admin**, I should not be able to view or edit any user's Elevated Auth value so that sensitive auth credentials remain protected.

**Employee — first-time access**

- As a **frontline employee**, I want to receive a clear notification when payslips are available so that I know I need to verify my identity.
- As a **frontline employee**, I want to enter my app password as a first step so that I prove I own my account before accessing sensitive data.
- As a **frontline employee**, I want to enter my HR-issued credential (if required by my employer) as a second step so that access is tied to my correct payroll record.
- As a **frontline employee**, I want a clear success screen after onboarding so that I know payslip access is enabled and where to find my payslips.

**Employee — payslip viewing**

- As a **frontline employee**, I want to see a list of available payslips sorted newest to oldest so that I can quickly find the month I need.
- As a **frontline employee**, I want the payslip to open inside the app (not a browser) so that the experience is consistent and private.
- As a **frontline employee**, I want a refresh button that forces the latest version so that I never get stuck on a stale file.
- As a **frontline employee**, I want clear error messages with retry options so that I can self-resolve most access issues without calling HR.

**Employee — recovery**

- As a **frontline employee**, I want to reset my app password via OTP so that I can regain access without calling HR.
- As a **frontline employee**, I want to update my mobile number with OTP verification and then re-verify my identity so that my account is not compromised by a SIM swap.

---

## Requirements

### Must-Have (P0)

#### Tenant Management — Elevated Auth (Blue Core addition)

- [ ] **Elevated Auth toggle** — Tenant-level ON/OFF. When OFF, payslip access uses App Password only. Default: OFF.
- [ ] **Auth Type selection** — When Elevated Auth is ON, tenant selects one type: ID Number, Passport Number, PUK, Password / HR Password, or a freeform custom type.
- [ ] **Custom Input Label** — Free-text field; shown to employees as the input label. Examples: "HR Password", "PUK Code", "Employee ID Check".
- [ ] **Custom Helper Text** — Free-text field; shown below the input. Examples: "This code was given to you by HR."
- [ ] **Require for Onboarding toggle** — YES: worker must enter Elevated Auth during first-time setup. NO: App Password only; Elevated Auth still used for risk-triggered re-verification.
- [ ] **Remote App Display Name** — Tenant sets a custom name (e.g. "Payslips", "My Smart HR", "HR Documents").
- [ ] **Remote App Placement** — Tenant chooses placement: Profile → Work Essentials → [App Name] OR Explorer → [Section/Category → App Name]. Stored per-tenant in config. *(Exact Explorer structure to be workshopped with design.)*
- [ ] **Import CSV — new column** — "Elevated Auth Value" added to import template. Value is hidden and encrypted immediately on import. Not visible to standard admins or workers in any UI.
- [ ] **User Management — Elevated Admin edit** — Tenant Owners and Elevated Admins can view and update the Elevated Auth value for a single user via User Management. Standard Admins and all workers cannot see this field.

#### Integration Layer (API-first)

- [ ] **Two remote endpoints** — (1) Payslip List: returns available periods/months for the employee. (2) Payslip PDF: fetches the file on demand, streamed directly to device. No long-term storage on Wyzetalk servers.
- [ ] **Multiple auth mechanisms** — Integration layer supports: Bearer/token, API key, OAuth 2.0, Basic Auth. Request format, response structure, and parameter naming are configurable per client.
- [ ] **IP allowlisting support** — Integration layer supports static IP whitelisting for clients whose payroll systems require firewall rules.
- [ ] **No PDF storage** — PDFs are streamed on demand. Wyzetalk does not store, cache, or retain payslip files server-side.
- [ ] **File size** — No enforced file size limit on Wyzetalk side. Typical expected size: 50–100 KB. Integration layer must handle larger files gracefully.

#### Onboarding — First-Time Setup

- [ ] **Notification screen** — Shown when payslips are enabled for a tenant. Copy: "Pay-slips are now available under Profile > My Pay-slips. Please verify your identity to access your pay-slips." Actions: **Verify now** (primary) / **Not now** (secondary). Toast on dismiss: "You can verify your identity anytime under Profile > My Pay-slips."
- [ ] **Repeated dismissal logic** — If user dismisses, verification is required every time they attempt to access payslips. Cannot access Payslip List until onboarding is completed.
- [ ] **Step 1 — App Password (step-up auth)** — Employee enters their app password to prove account ownership. Title: "Confirm Your Identity". Label: "App password". Button: "Continue". Errors: wrong password, 6-attempt lockout (3 min), 10-attempt lockout (24 hrs + SMS alert).
- [ ] **Step 2 — Elevated Auth** — Shown only if Elevated Auth is ON AND Require for Onboarding = YES. Title: "Enter Your [Custom Label]". Message: [Custom Helper Text]. Input type matches auth type (numeric or text). Button: "Continue". Errors: "Incorrect [Custom Label]. Please try again." / "We could not verify this value. Please speak to HR." / "We don't have your [Custom Label] on record. Please speak to HR." Lockout: 6 attempts → 3-min lockout → daily lock (24 hrs).
- [ ] **HR Verified status** — Set on the user record after successful completion of the full onboarding flow (Step 1 + Step 2 if enabled). HR Verified status controls access to payslip content.
- [ ] **Access Enabled screen** — Shown on successful onboarding. Copy: "Pay-slip Access Enabled. You can now view your pay-slips under Profile > My Pay-slips." Button: "Go to My Pay-slips".
- [ ] **Deep-link enforcement** — If employee arrives via SMS / push / email deep-link, the app must still enforce the full auth flow (App Password → Elevated Auth if enabled) before loading the Payslip List or PDF. Deep-links cannot bypass onboarding or verification.

#### Payslip Viewing (Remote App)

- [ ] **Payslip List screen** — Shows available months/periods. Sorted newest → oldest. Tap to open a single payslip. No salary values or sensitive data shown in the list. Shows last 3–6 months (configurable).
- [ ] **In-app PDF viewer** — PDF opens inside the app using a native viewer (Android: `androidx.pdf`; iOS: `PDFKit`; cross-platform: `react-native-pdf` or equivalent). Must never open in an external browser or external PDF app.
- [ ] **Loading states** — Show spinner / progress bar when PDF is loading. Display file size before the user opens. Show estimated load time on slow connections.
- [ ] **Refresh button** — Label: "Reload Pay-slips". Helper: "Loads the latest pay-slip and removes old data." Triggers cache-busting fetch (timestamp parameter or equivalent). Removes stale cached data.
- [ ] **Viewer error states:**

  | Condition | Error copy | Action |
  |-----------|-----------|--------|
  | PDF load failure | "Unable to load PDF." | Try Again |
  | Network down | "Network connection lost." | Retry |
  | Slow API (>1.5 s) | "The system is busy, please try again later." | Retry |

- [ ] **Empty state** — "No pay-slips available. Your pay-slips will appear once published by HR. If this seems wrong, please speak to HR."
- [ ] **Download / share** — Controlled by tenant security profile toggle. If OFF: no download or share option shown. If ON: download and share actions available.

#### Returning User Flow

- [ ] **App Password only** — Once HR Verified, employee only re-enters App Password to access payslips on subsequent visits (Elevated Auth is not repeated).
- [ ] **Risk-triggered re-verification** — Elevated Auth is re-requested only when a risk event is detected (see Mobile Number Change below).
- [ ] **Returning user errors** — "Wrong password. Please try again." / "Too many attempts. Please try again in 3 minutes."

#### Recovery Flows

- [ ] **App Password Reset** — Flow: Tap "Forgot password" → OTP sent → Enter OTP ("Invalid or expired code" on failure) → Create new password → Success: "Your password has been updated." → HR Verified status resets to **Not HR Verified**; employee must re-complete onboarding on next payslip access.
- [ ] **Mobile Number Change (high security)** — When payslips are enabled: changing mobile number sets phone to **Not Verified** and user to **HR Not Verified**. Flow on next payslip access: Update mobile → OTP sent to new number → Enter OTP → Mark mobile as Verified → App Password step-up → Elevated Auth (if enabled) → HR Verified restored. Protects against SIM-swap fraud.

#### Security Profile (Tenant-Configurable)

- [ ] **Mobile number change** → always triggers re-verification when payslips are enabled.
- [ ] **Password reset** → always resets HR Verified status.
- [ ] **Download / share toggle** — Per tenant.
- [ ] **No "Remember Me" for sensitive data** — App Password for payslip access must never be stored or auto-filled.
- [ ] **Session timeout** — Re-authentication required after inactivity. Timeout window: 2–5 minutes (confirm with engineering).

#### Lockout & Error Logic (Global)

- [ ] **6 failed attempts** (App Password or Elevated Auth) → 3-minute lockout. Copy: "Too many attempts. Please try again in 3 minutes."
- [ ] **10 failed attempts** (App Password) → 24-hour lockout + SMS alert to employee. Copy: "Your pay-slip access has been locked for 24 hours. Please speak to HR."
- [ ] **Session expired** → "Your session has expired. Please log in again."
- [ ] **System error toasts** — "Unable to verify your details. Please try again." / "Something went wrong. Please try again later."
- [ ] **Validation messages** — "Enter your app login password." / "Enter your [Custom Label]." / "Password must be numbers only." (where applicable)
- [ ] **General notification** — "You need [Custom Label] to access your pay-slips. Please speak to HR if you do not have it."
- [ ] **Error copy consistent across platforms** — iOS, Android, and any web wrapper must render identical error strings.

#### Analytics

- [ ] **Auth events (Blue Core)** — Log: Payslip Password verified (success/fail), Elevated Auth verified (success/fail), lockout triggered (3 min / 24 hr), password reset initiated, password reset completed, step-up attempt count.
- [ ] **Error / failure events (Blue Core)** — Log: Failed to fetch payslip list (API error), failed to fetch PDF metadata, timeout fetching remote PDF, no network / unstable connection.
- [ ] **Entry events (Blue Core)** — Log: User viewed Payslips list screen, user saw empty state.
- [ ] **Interaction events (Remote App → Blue Core bridge)** — Log: tap on payslip list item, tap Download (if allowed), tap "Reload Pay-slips". *(Dev investigation required: confirm how remote-app interaction events are pushed to Blue Core telemetry pipeline.)*

---

### Nice-to-Have (P1)

- [ ] **Offline / cached viewing** — Cache previously loaded PDFs locally so employees can re-open without a network connection. Auto-expire cached files after a configurable period.
- [ ] **Month / period filter** — Filter or search within the payslip list when more than 6 months are available.
- [ ] **Configurable look-back window** — Tenant sets how many months are shown (3 or 6).
- [ ] **Biometric unlock** — Fingerprint or Face ID as an alternative to App Password for step-up auth (future best practice; GDPR/POPIA implications to review).

---

### Future Considerations

- [ ] **Desktop / web payslip access** — Extend remote app to web portal.
- [ ] **Multiple payslip types per tenant** — e.g. salary + bonus + IRP5 in separate lists.
- [ ] **Push notification when new payslip available** — Triggered by payroll system webhook.
- [ ] **Biometric authentication** — Fingerprint / Face ID as primary step-up mechanism.

---

## Success Metrics

**Leading:**
- Access success rate: >98% successful PDF opens (from tap to PDF rendered)
- Onboarding completion rate: % of workers who complete full verification flow after notification
- Step-up auth drop-off: % of workers who abandon at App Password or Elevated Auth step
- Refresh button tap rate (proxy for stale-cache frustration)

**Lagging:**
- Support tickets: decrease in HR password / number-change / "can't open payslip" issues
- Go-live time per client: reduction in bespoke integration work (days from contract to first payslip viewed)
- Monthly adoption: % of workforce accessing payslips via app each month
- Performance: first PDF page load <2 s on 4G for ≤1 MB files

---

## Open Questions

- **[Engineering]** Where does Elevated Auth value matching run — Blue backend, or is the value passed to the payroll system for verification? This changes the data flow and POPIA implications significantly.
- **[Engineering]** Confirm lockout timer: 3 minutes or 6 minutes? Doc has both; best practice is 3.
- **[Engineering]** Confirm the split between Blue Core auth events and Remote App interaction events — how are remote-app-side interactions pushed back to Blue telemetry?
- **[Engineering]** Session timeout window: confirm 2–5 minutes or longer for frontline use cases (workers may step away from a screen mid-task).
- **[Product / Design]** Remote App placement in Explorer — section and category structure needs workshopping with design before config UI is built.
- **[Engineering]** Confirm max supported concurrent payslip fetches per tenant and any rate-limiting strategy on the integration proxy.
- **[Product]** Should the look-back window (3 vs 6 months) be tenant-configurable, or is a single platform default sufficient for Phase 1?
- **[Legal / Compliance]** Confirm POPIA breach notification obligations if an employee's Elevated Auth value is exposed — does this trigger formal reporting to the Information Regulator?
- **[Engineering]** All existing PDF posts in the platform currently open in browser — confirm update scope: do all PDF posts migrate to in-app viewer, or only the Payslip remote app?

---

## Timeline Considerations

- **Dependency:** [Tenant_Management.md](./Tenant_Management.md) — Elevated Auth config UI must exist before any payslip tenant can go live.
- **Dependency:** [Login_Account_Activation.md](./Login_Account_Activation.md) — App Password / step-up auth baseline must be stable before layering Elevated Auth on top.
- **Dependency:** [User_Management.md](./User_Management.md) — Elevated Auth field storage and permission model must be confirmed before import template update ships.
- **Suggested phasing:**
  - **Phase 1:** Tenant config (Elevated Auth toggle + type + labels) + onboarding flow (App Password + Elevated Auth) + Payslip List + in-app PDF viewer + refresh + basic error states.
  - **Phase 2:** Mobile Number Change high-security flow + analytics bridge (remote app → Blue Core) + download/share toggle.
  - **Phase 3:** Offline caching + biometric step-up + push notifications on new payslip.

---

## Acceptance criteria (BDD)

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
