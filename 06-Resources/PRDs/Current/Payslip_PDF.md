# Payslip PDF — Remote Access & Elevated Auth

---

> Spec for secure, configurable, frontline-friendly access to remote PDF payslips via the Wyzetalk mobile app. Covers Elevated Auth (Blue Core addition), tenant configuration, integration layer, onboarding flow, payslip viewing, recovery flows, and analytics.

**Related PRDs:** [Tenant_Management.md](./Tenant_Management.md) (Elevated Auth is a Blue Core addition — extends existing tenant config), [Login_Account_Activation.md](./Login_Account_Activation.md) (app password / step-up auth baseline), [User_Management.md](./User_Management.md) (Elevated Auth field permissions). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-002](../Evidence_register.md) | Market: TA vendors shipping WhatsApp/SMS-native frontline flows. Validates channel urgency and the "always-on mobile" expectation for payslip access. |
| [EV-2026-03-004](../Evidence_register.md) | Market: 70% of employee–system interactions shifting to conversational; WhatsApp HRMS integrations for payslips, leave, attendance now multi-vendor standard. Validates scope and urgency of this feature. |

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
