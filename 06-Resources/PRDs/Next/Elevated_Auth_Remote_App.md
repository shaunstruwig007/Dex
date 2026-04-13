# Elevated Auth — Remote App Integration

---

> **Status: Stub** — Phase 1 elevated auth workshop pending (see task `task-20260323-008`). This stub captures the Next-phase extension: the token model that allows remote apps (payslip, leave, HR self-service) to request and validate elevated auth from the core platform.

**Phase:** Next (post-Essential GA) — depends on Phase 1 elevated auth core being shipped and workshopped first.

**Related PRDs (Phase 1):**
- [Login_Account_Activation.md](../Current/Login_Account_Activation.md) — base auth model; OTP flow; session token issued at login
- [Tenant_Management.md](../Current/Tenant_Management.md) — elevated auth is tenant-configured (factor type, label, description)
- [Profile_Users.md](../Current/Profile_Users.md) — user identity and hidden field (compliance / impersonation prevention)
- [Payslip_PDF.md](../Current/Payslip_PDF.md) — first remote app requiring elevated auth before serving sensitive payslip data

**Meeting context:** [2026-03-21 - Elevated auth.md](../../../00-Inbox/Meetings/2026-03-21%20-%20Elevated%20auth.md) · [2026-03-26 - Remote app and PDF payslip.md](../../../00-Inbox/Meetings/2026-03-26%20-%20Remote%20app%20and%20PDF%20payslip.md)

---

## Background

Two parallel decisions are in flight from Q1 2026:

1. **Elevated auth (core)** — A tenant-configured step-up verification layer. Not external SSO; not standard OTP. A second identity check (configurable factor, label, description) applied before accessing sensitive actions or data. Defined as CORE platform with tenant-level configuration. Workshop on core vs remote app split still pending (task `task-20260323-008`).

2. **Remote app model** — Independent deployable apps (payslip viewer, leave balance, HR self-service) that are federated into the core [[Wyzetalk]] shell via token passing. The core platform issues a token; the remote app validates it against core APIs to retrieve user context and make downstream calls. First live example: FLM (Food Lovers Market) payslip integration.

This PRD covers the **intersection**: how remote apps request elevated auth from the core before unlocking sensitive data, and how the token model carries the elevated auth claim across the boundary.

---

## Problem hypothesis

Remote apps (payslip, leave, HR self-service) handle sensitive employee data. Accessing a payslip or updating personal HR details should require more than a session token — it should require explicit step-up verification at the time of access. The challenge is that remote apps are independently deployed and cannot directly trigger the core auth flow. A clean protocol is needed so remote apps can:

1. **Signal** they require elevated auth before rendering sensitive content
2. **Request** the core to perform the step-up check
3. **Receive** a short-lived elevated-auth token that proves the check was completed
4. **Validate** that token server-side before serving data

Without this, either (a) sensitive remote app data is accessible to anyone with a valid session (security gap), or (b) each remote app builds its own auth layer (fragmentation, inconsistency, compliance risk).

---

## Scope indicators (to be confirmed in workshop + discovery)

**Core platform responsibilities:**
- Elevated auth check trigger: core presents the configured verification step (factor, label, description) when requested by a remote app
- On success: issue a short-lived elevated-auth token (separate from session token) scoped to the requesting remote app and user
- Token contains: user ID, tenant ID, remote app scope, expiry timestamp, auth factor used
- Audit log: every elevated auth check (pass / fail) logged against user + tenant + remote app

**Remote app responsibilities:**
- Declare in their manifest/config which actions require elevated auth
- On launch: check if valid elevated-auth token exists in the token store for this user + scope
- If not: request elevated auth from core (redirect or inline prompt via core component)
- On token receipt: validate against core API before serving sensitive content
- Token must not be stored beyond session; not accessible to other remote apps

**Tenant configuration:**
- Elevated auth factor: configurable per tenant (e.g. Employee Number, ID/Passport, hidden HR field)
- Elevated auth label and description: what employees see when the step-up prompt appears
- Per-remote-app toggle: which remote apps require elevated auth (e.g. payslip = mandatory, leave balance = optional)
- Token validity window: configurable (e.g. 5 minutes, 30 minutes, per-session)

---

## Key design decisions pending workshop

| Decision | Options | Impact |
|----------|---------|--------|
| Token passing mechanism | Redirect with token param vs postMessage vs shared secure store | Security model, cross-origin trust |
| Elevated auth vs SSO interaction | Does an SSO session satisfy elevated auth? Or always require step-up? | See OQ-01 in [SSO.md](../Future/SSO.md) |
| Scope granularity | Per-app token vs per-action token | Complexity vs security |
| Core vs remote app boundary | Where does the elevated auth UI live — core shell or remote app? | UX consistency, maintenance |
| Hidden field compliance (Jan's model) | Permission + hidden field prevents impersonation; how does this bind to the elevated auth factor? | POPIA / auditor requirements |

---

## Dependencies and sequencing

```
Phase 1 (Essential):
  ├── Core elevated auth implementation (workshop pending: task-20260323-008)
  ├── Tenant-level config (factor, label, description) in Tenant Management
  └── Remote app token model (established in payslip integration)

Next phase (this PRD):
  ├── Elevated auth token protocol formalised across all remote apps
  ├── Per-remote-app elevated auth configuration in Tenant Management
  ├── Audit log integration
  └── Extended to: leave balance, HR self-service, Smart HR WhatsApp (see WhatsApp_Smart_HR.md)
```

---

## Open questions (pre-design)

| # | Question | Owner |
|---|----------|-------|
| OQ-01 | Core vs remote app split: does elevated auth UI live in the core shell (better consistency) or can remote apps trigger it inline? | Workshop |
| OQ-02 | Token storage: where is the elevated-auth token held between issuance and validation? Secure memory only, or short-lived localStorage with encryption? | Engineering |
| OQ-03 | What happens if a user closes the elevated auth prompt without completing? Does the remote app fall back to a safe state or surface a retry? | Product + Design |
| OQ-04 | If the tenant disables elevated auth mid-session, does a previously issued elevated-auth token remain valid until expiry? | Engineering |
| OQ-05 | Tanya's documentation update (user import, user profile, hidden field viewing) — does this need to be complete before this PRD can be fully specified? | Tanya (in progress) |

---

*Promote to full PRD after Phase 1 elevated auth workshop is complete. See [Next/README.md](./README.md) for merge instructions.*
