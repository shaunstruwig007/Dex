# Login & Account Activation

---

> Lighter spec derived from the Login & Account Activation discovery document. Covers tenant routing, first-time activation, OTP login, self-service recovery, and returning user flows.

**Related PRDs:** [Tenant_Management.md](./Tenant_Management.md) (QR, identifiers, tenant state), [Communication.md](./Communication.md) (SMS OTP), [Feed.md](./Feed.md) (typical post-login landing). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

# Problem Statement

Frontline workers — often with limited tech literacy, unstable contact details, and no knowledge of their company's domain — cannot reliably access the [[Wyzetalk]] platform. Invites go out via SMS or email, but many workers don't receive them, don't have stable phone numbers, and don't know which company domain to use. This creates high support volumes, failed activations, and low onboarding completion rates. Evidence from stakeholder interviews (Lize, Kino, May 2021 research) confirms 30–70% staff turnover, frequent number changes, and duplicate identifier issues across sub-companies.

---

# Goals

1. **Reduce onboarding friction** — Enable employees to find and access their company's login without knowing a URL, domain, or having received an invite.
1. **Achieve high first-attempt activation rate** — Employees who scan a QR code or enter a company code should reach the correct login page and complete activation on the first try.
1. **Eliminate domain confusion** — Auto-route users to the correct tenant via QR code, company code, or identifier matching.
1. **Reduce support tickets for login issues** — Self-service recovery (Find My Account) should resolve the majority of access problems without HR/support intervention.
1. **Ensure secure, compliant identity verification** — OTP-first authentication with GDPR-compliant data handling.
---

# Non-Goals

- **Passkeys / biometric login** — Desirable but requires user education and device support. Separate initiative.
- **SSO (SAML/OIDC) integration** — Only relevant for clients with existing identity providers. Future phase.
- **WhatsApp OTP delivery** — SMS is the primary channel for Phase 1. WhatsApp as an alternative delivery method is future scope.
- **In-app onboarding tour** — Welcome experience after first login is a separate feature (Feed/UX).
- **Automated pre-launch data collection** — QR-linked forms for collecting employee data before go-live are a separate initiative.
---

# User Stories

**First-Time Users:**

- As a **new employee**, I want to scan my company's QR code so that I can open the correct company login page without knowing a URL.
- As a **new employee**, I want to enter my two identifier fields and cell number so that I can verify my identity and receive an OTP to activate my account.
- As a **new employee who didn't receive an invite**, I want to submit my details via a "Find My Account" form so that support can verify me and send a new invite.
- As a **new employee**, I want to create my own password after OTP verification so that I can access my account independently going forward.
**Account Owners:**

- As an **account owner**, I want to receive a direct invite from [[Wyzetalk]] with an activation link so that I can set up my account without needing the QR code.
**Returning Users:**

- As a **returning employee**, I want to open the app and be automatically logged in if my session is still valid so that I don't have to re-enter credentials.
- As a **returning employee who changed phone numbers**, I want to enter my identifier fields with my new cell number so that the system updates my contact details and sends me an OTP.
- As a **returning employee who forgot my password**, I want to reset it via OTP so that I can regain access without calling HR.
**Edge Cases:**

- As an **employee activating with a number already in use**, I want to see a clear message and be routed to support so that the duplicate is resolved.
- As an **employee on the global login page**, I want to be auto-detected and redirected to my company's login so that I don't need to remember a domain.
- As an **employee with a locked or deactivated account**, I want a clear message explaining why I can't log in and what to do next.
---

# Requirements

## Skeleton

### Entry Point & Tenant Routing

- [ ] QR code scans open the company-branded login screen with logo, theme, and company name. QR encodes tenant identifier only — never personal data.
- [ ] Global login ([app.wyzetalk.com](http://app.wyzetalk.com/)) offers: Scan QR, Enter company code, or "Don't have a code?" → Find My Account.
- [ ] Valid company code → auto-redirect to tenant login. Invalid → "Company code not found." Expired → "This code has expired."
- [ ] Auto-detect tenant from QR, short URL, company code, or email domain. Single match → route. Multiple → show list. None → global fallback.
### First-Time Activation

- [ ] Login screen displays 2 tenant-configured identifier fields + cell number. Valid combinations: Employee Number, ID/Passport, DOB, Email — any two.
- [ ] On identifier match → send OTP via SMS. OTP TTL and max resends configurable. Incorrect/expired OTP → clear error message.
- [ ] After successful OTP: first-time user → create password (strength meter, show/hide toggle). User is auto-logged-in after setup.
- [ ] Validate no two users share the same activated mobile number in a tenant. Duplicate → "This number is already in use" → auto-create support ticket.
### Account Owner Activation

- [ ] Owner receives invite via SMS/email with activation link, username, and temporary password. Link opens company login page.
- [ ] Owner verifies mobile via OTP, creates password. Owner is the only user type not requiring QR to activate.
### Find My Account / Self-Service Recovery

- [ ] CTA on all login screens: "Didn't get your invite or need to update your details?"
- [ ] Form captures: First name, Last name, DOB, Cell number, Company name, Employee Number, Company email. Confirmation checkbox required.
- [ ] 2+ field match → auto-update record → resend invite. Message: "We found your account and updated your details."
- [ ] No match → create pending verification request for support. Message: "We've sent your details to HR for verification."
### Returning User Flows

- [ ] Valid session token → skip login, go to feed. Expired → show login form.
- [ ] Manual login: Phone/email/employee ID + Password. Inline error on failure. "Forgot password" and "Find my account" links visible.
- [ ] Forgot password: OTP to registered phone/email → create new password → confirmation.
- [ ] Device/number change: 2 identifier fields + new cell. If match → update cell → send OTP. If no match → Find My Account.
- [ ] Locked account → "Temporarily locked. Try again later or contact HR." Deactivated → "Your account is inactive. Please contact HR."
## Flesh

- [ ] Contextual help text on login screen (e.g. "Not sure what your Employee Number is? Contact HR.").
- [ ] OTP resend countdown timer.
- [ ] Multi-domain confusion: backend auto-detects domain from identifier and redirects.
- [ ] "Use another account" option on returning user login.
## Future

- [ ] Pre-designed branded QR poster for print/sharing (depends on Theming).
- [ ] Owner-triggered QR code regeneration.
- [ ] QR code expiry policy.
- [ ] Passkey / biometric login.
- [ ] WhatsApp as OTP delivery channel.
---

# Success Metrics

**Leading (days–weeks):**

- First-attempt activation success rate (target: >75%)
- QR-to-login completion rate (target: >85%)
- Find My Account → resolved without manual escalation (target: >50%)
- OTP delivery success rate (target: >98%)
**Lagging (weeks–months):**

- Reduction in login/activation support tickets (target: -60% within 3 months)
- Overall onboarding completion rate (target: >80% of imported users activated within 30 days)
- Returning user session retention rate
---

# Open Questions

- **[Engineering]** Fuzzy matching algorithm for Find My Account — edit distance, phonetic, or field-by-field partial match? What confidence threshold?
- **[Product]** Should Surname be added as a tenant-configurable identifier option (per Kino's feedback)?
- **[Product]** Max failed login attempts before lockout? Lockout duration?
- **[Legal]** Data retention period for unmatched Find My Account submissions?
- **[Engineering]** How is OTP delivery monitored — do we get SMS provider delivery receipts?
- **[Design]** Is the activation flow a wizard or a single scrollable form?
---

# Timeline Considerations

- **Dependency:** Tenant Management must be built first (tenant creation, QR generation, identifier field configuration).
- **Dependency:** User Importer must be operational (users need to exist in the system before they can activate).
- **Dependency:** Communication service (SMS/OTP delivery) must be in place.
- **Suggested phasing:** Entry point + first-time activation (Phase 1a) → Find My Account + returning user flows (Phase 1b).
