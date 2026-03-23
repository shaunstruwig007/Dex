# Tenant Management

---

> Lighter specs for all 8 Tenant Management feature areas. Each section covers user stories, Skeleton / Flesh requirements, success metrics, and open questions.

**Related PRDs:** [Login_Account_Activation.md](./Login_Account_Activation.md) (QR, identifiers, routing), [Theming.md](./Theming.md) (login branding), [Communication.md](./Communication.md) (invites/OTP), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (tenant currency / SMS rates). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

# 1. Tenant Creation & Setup

**Problem:** When a new tenant is created, the platform does not automatically generate QR codes, short URLs, or guide the Tenant Manager through login configuration — resulting in slow, inconsistent onboarding that requires manual Wyzetalk involvement.

**User Stories**

- As a **Tenant Manager**, I want the system to auto-generate a QR code and short company code on tenant creation, so that I can immediately share access points with employees.
- As a **Tenant Manager**, I want to select exactly two identifier fields for employee login, so that the login screen is configured correctly for my organisation.
- As a **Tenant Manager**, I want tenant branding applied to the login screen automatically, so that employees see a familiar, professional experience.
**Skeleton**

- [ ] Accept tenant details: name, domain, account owner info, HR/support contact, data-free toggle.
- [ ] Validate domain uniqueness and reject reserved keywords (`admin`, `wyzetalk`, `api`, `support`). Show "Domain is not available." on failure.
- [ ] On success: auto-generate unique QR code, short URL/code (e.g. `wyz-123`), and redirect target. Store all in tenant profile.
- [ ] Set tenant status to **Pending Setup** after creation and trigger structured setup flow.
- [ ] Roll back entire tenant creation (including QR/short URL) if any step fails. Return a clear error.
- [ ] Allow Tenant Manager to select **exactly two** identifier fields from: Employee Number, ID/Passport, Date of Birth, Email. Prevent duplicates or saving with fewer/more than two.
- [ ] Apply identifier fields instantly to the tenant login domain. Log all changes with timestamp and admin ID.
**Flesh**

- [ ] Apply tenant branding (logo, theme colour, display name) to login and OTP screens. Fall back to generic theme if none exists.
- [ ] Login screen preview during setup so Tenant Manager can verify branding before publishing.
**Success Metrics**

- % of new tenants completing full setup without Wyzetalk manual intervention (target: >90%)
- Average time from creation to Setup Complete (target: <15 min)
- Tenant creation rollback rate (target: <2%)
**Open Questions**

- [Engineering] Short code generation strategy — random, sequential, or name-based?
- [Product] Can the data-free toggle be changed post-creation?
- [Design] Wizard (multi-step) or single form with sections?
---

# 2. Identity & Login Validation Flows

**Problem:** The platform has no structured flow for validating employees at login using tenant-configured identifier fields, or routing users to the correct tenant — leaving failed logins with no recovery path.

**User Stories**

- As an **employee**, I want to log in using my company's required identifier fields, so that I can access the platform securely.
- As an **employee whose details don't match**, I want to be guided to a self-service recovery flow, so that I can resolve the issue without calling HR.
- As an **employee using a company code**, I want to be automatically redirected to my company's login page.
**Skeleton**

- [ ] Load and display the tenant's two configured identifier fields plus cell number on the login screen.
- [ ] Validate input against required fields, formatting rules, and allowed patterns. Show inline errors. Log every validation failure.
- [ ] On match: update stored cell if different → generate OTP → send via SMS → log event.
- [ ] OTP TTL and max resend attempts configurable (e.g. 5 min TTL, 3 resends). Log all OTP events.
- [ ] On no match: redirect to Find My Account. Attempt soft/fuzzy match. If soft match fails, auto-create support ticket.
- [ ] Expired activation link: block activation, show clear message, provide "Request new invite" action, and log attempt.
- [ ] Company code: valid → redirect to tenant login; invalid → "Company code not found."; expired → "This code has expired."
- [ ] Auto-detect tenant from QR, short URL, company code, or email domain. Route accordingly; show fallback if no match.
**Flesh**

- [ ] "Resend OTP" countdown timer.
- [ ] Contextual help text on login screen (e.g. "Not sure what your Employee Number is? Contact HR.").
**Success Metrics**

- Login success rate on first attempt (target: >80%)
- OTP delivery success rate (target: >98%)
- % of login failures resolved via Find My Account (target: >60%)
**Open Questions**

- [Engineering] Fuzzy matching algorithm and confidence threshold?
- [Product] Max failed login attempts before lockout?
- [Legal] Retention rules for failed login attempt logs?
---

# 3. QR Code Management

**Problem:** QR codes and company codes are not automatically maintained — when they expire, employees lose access until Wyzetalk staff manually regenerate and redistribute them.

**User Stories**

- As an **Account Owner**, I want to download and share my QR code directly from the portal, so that I don't need to involve Wyzetalk.
- As an **Account Owner**, I want advance notice before my QR code expires, so that I can update printed materials in time.
- As a **system admin**, I want to regenerate a QR code on demand to respond to security incidents.
**Skeleton**

- [ ] Tenant profile displays: QR code image, short URL, download QR (.png), download branded poster, copy short URL, and share button. UI updates instantly after regeneration.
- [ ] System auto-regenerates QR and short code **yearly**. Old QR becomes invalid; account owner notified. All regeneration events logged.
- [ ] System admins can manually trigger regeneration at any time.
- [ ] Expired QR scan: hide login form, show "This QR code has expired. Please reach out to your HR department.", block OTP, log scan attempt.
- [ ] Notify account owner **30 days** and **7 days** before expiry with download link and note to update printed posters.
**Flesh**

- [ ] QR expiry date visible in the tenant profile.
- [ ] Branded poster download with company logo, QR code, and short URL pre-formatted for print.
**Success Metrics**

- % of QR renewals completed before expiry (target: >95%)
- Support tickets for expired QR/company codes (target: near zero within 3 months)
- QR download/share usage rate per tenant per month
**Open Questions**

- [Engineering] How are downstream systems updated on regeneration — API push or polling?
- [Product] Can account owners trigger their own regeneration, or system admin only?
---

# 4. Tenant Status Management

**Problem:** When a tenant is disabled, employees see a broken or empty login state with no explanation — causing confusion and unnecessary support contacts.

**User Stories**

- As an **employee of a disabled tenant**, I want a clear message explaining why I can't log in, so that I know to contact HR.
- As a **system admin**, I want reactivation to immediately restore normal login with no manual steps.
**Skeleton**

- [ ] Disabled tenant: hide login form and show "{Company name}'s account has been disabled. Please reach out to your HR department."
- [ ] Block OTP generation while tenant is disabled.
- [ ] Log all login attempts against a disabled tenant.
- [ ] Reactivation automatically restores normal login — no manual intervention required.
**Flesh**

- [ ] Show HR contact details on the disabled state screen.
- [ ] Admin dashboard flags disabled tenants with a visual indicator.
**Success Metrics**

- Support tickets from employees of disabled tenants citing confusion (target: near zero post-launch)
- Time from reactivation to login being restored (target: <30 seconds)
**Open Questions**

- [Product] Binary enabled/disabled, or partial modes (e.g. read-only)?
- [Engineering] Status checked at page load or on form submission?
---

# 5. Find My Account & Support Workflows

**Problem:** Employees whose details don't match the system have no self-service recovery path, and Wyzetalk staff have no structured way to review or resolve these cases.

**User Stories**

- As an **employee who can't log in**, I want to submit my details for verification so that HR can identify me and restore access.
- As a **support agent**, I want a dashboard of unmatched users so that I can review and resolve cases efficiently.
**Skeleton**

- [ ] Find My Account form captures personal and company info. Attempts soft match on submission.
- [ ] Soft match success: send OTP → redirect to correct tenant login.
- [ ] Soft match failure: auto-create support ticket (user info, tenant ID, timestamp). Show "Account not found. We've sent your details to HR for verification."
- [ ] Support tickets visible in Support UI immediately.
- [ ] Submissions stored for configured retention period, then auto-deleted.
- [ ] Pending Verification Dashboard: list unmatched users; agents can approve, reject, edit fields, or resend invite. All actions logged.
**Flesh**

- [ ] Email notification to HR/support contact on new unmatched submission.
- [ ] Bulk actions on the dashboard (e.g. bulk reject stale submissions).
**Success Metrics**

- % of submissions resolved without manual escalation (target: >50% via soft match)
- Average time to resolve a pending verification case (target: <24 hours)
**Open Questions**

- [Engineering] Fields used in soft match and confidence threshold?
- [Legal] Configured retention period for unmatched submissions?
- [Product] Do employees receive a follow-up notification when their case is resolved?
---

# 6. Account Owner & Contact Management

**Problem:** Assigning account owners and managing changes lacks a structured flow — making onboarding slower and creating risk when ownership changes or contact details go stale.

**User Stories**

- As a **Tenant Manager**, I want the system to automatically send an invitation to the account owner, so that I don't need to manually compose onboarding emails.
- As a **Tenant Manager**, I want to change the account owner and have access immediately transferred.
- As a **Tenant Manager**, I want to update HR and support contact details so that employees see the right information when they need help.
**Skeleton**

- [ ] Create Account Owner record and send invitation email: activation link, short URL, QR code, temporary password.
- [ ] Activation link TTL configurable (e.g. 72 hours). Track statuses: sent, activated, expired. Retry if email fails.
- [ ] Change Account Owner: send new invite → remove previous owner's permissions immediately → log event.
- [ ] Add/update HR and support contact phone and email. Log all changes.
**Flesh**

- [ ] HR/support contact details optionally shown as help text on the login screen.
- [ ] Account Owner can resend their own expired invitation.
**Success Metrics**

- % of invitations activated within the TTL window (target: >85%)
- Time for previous owner to lose access after ownership change (target: immediate)
- Support tickets related to account owner access (target: -70% post-launch)
**Open Questions**

- [Engineering] Retry count and interval for bounced invitation emails?
- [Product] Should the previous owner be notified when replaced?
- [Security] Is the temporary password a one-time token or a must-change-on-first-login password?
---

# 7. Tenant Deactivation, Archive & Hard Delete

**Problem:** There is no automated data lifecycle process for deactivated or archived tenants — exposing the business to GDPR compliance risk and accumulating stale data indefinitely.

**User Stories**

- As a **system**, I want to automatically hard-delete a soft-deleted tenant after 30 days so that data is not retained beyond what is required.
- As a **system**, I want to automatically hard-delete an archived tenant after one year for the same reason.
**Skeleton**

- [ ] Soft-deleted tenant: hard-delete after 30 days. Anonymise or purge all associated data. Tenant cannot be restored. Log deletion and trigger compliance processes.
- [ ] Archived tenant: hard-delete after one year. Same requirements as above.
- [ ] All hard-delete operations are backend-only — no UI trigger available.
- [ ] Hard-delete process must be idempotent.
**Flesh**

- [ ] Notify a designated compliance/admin email when a hard delete executes.
- [ ] Retain audit log entries for hard-delete events separately from deleted tenant data.
**Success Metrics**

- % of eligible tenants hard-deleted within the required window (target: 100%)
- Zero compliance incidents related to over-retained tenant data
- Hard-delete job failure rate (target: <0.1%)
**Open Questions**

- [Legal] Which fields must be anonymised vs. fully purged?
- [Engineering] Does the data warehouse/backup also need purging on hard delete?
- [Product] Are the 30-day and 1-year windows globally configurable or fixed?
---

# 8. Audit Logging

**Problem:** Identity, routing, and QR events are not captured in a unified audit trail — making it impossible to investigate access issues, demonstrate compliance, or detect suspicious activity.

**User Stories**

- As a **system admin**, I want a unified log of all identity and tenant events so that I can investigate issues and demonstrate compliance.
- As a **security team member**, I want to see failed logins, expired QR scans, and OTP failures in one place so that I can detect anomalies.
**Skeleton**

- [ ] Log all events: QR scans (valid/expired), company code attempts, identifier field match/fail, OTP events (sent/verified/failed), disabled tenant login attempts, expired activation tokens, tenant creation/deletion, branding changes, account owner changes, identifier field config changes.
- [ ] Every log entry includes: **timestamp**, **tenant ID**, **source** (web / mobile / QR / admin portal).
- [ ] Audit logs accessible to authorised users only (role-based access).
- [ ] Logs are immutable — no user can edit or delete entries.
**Flesh**

- [ ] Admin UI to search and filter logs by tenant, event type, date range, and source.
- [ ] Exportable audit log (CSV/JSON) for compliance reporting.
- [ ] Alerting on anomaly patterns (e.g. >10 failed OTP attempts from one tenant in 5 minutes).
**Success Metrics**

- 100% of required event types captured from day one
- Zero gaps in log coverage during incident investigations
- Time to retrieve a specific log entry via UI (target: <5 seconds)
**Open Questions**

- [Engineering] Separate immutable log store, or same DB as application data?
- [Legal] Required retention period for audit logs?
- [Product] Do tenants or account owners have read access to their own logs?
