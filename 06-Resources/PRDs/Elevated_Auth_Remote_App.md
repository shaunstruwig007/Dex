---
prd_id: elevated-auth-remote-app
lifecycle: spec_ready
created_date: 2026-03-21
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Complete Phase 1 elevated auth workshop (task-20260323-008)
  - Formalise token protocol with Security
---

# Elevated Auth — Remote App Integration

**Status:** Spec-ready stub — agent-oriented retrofit  
**Target:** Remote apps (payslip, leave, HR self-service) requiring step-up verification before sensitive data  
**Estimated Effort:** 56–120 hours agent time (post-workshop)

---

> **Status: Stub** — Phase 1 elevated auth workshop pending (see task `task-20260323-008`). This stub captures the Next-phase extension: the token model that allows remote apps (payslip, leave, HR self-service) to request and validate elevated auth from the core platform.

**Phase:** Next (post-Essential GA) — depends on Phase 1 elevated auth core being shipped and workshopped first.

**Related PRDs (Phase 1):**
- [Login_Account_Activation.md](./Login_Account_Activation.md) — base auth model; OTP flow; session token issued at login
- [Tenant_Management.md](./Tenant_Management.md) — elevated auth is tenant-configured (factor type, label, description)
- [Profile_Users.md](./Profile_Users.md) — user identity and hidden field (compliance / impersonation prevention)
- [Payslip_PDF.md](./Payslip_PDF.md) — first remote app requiring elevated auth before serving sensitive payslip data

**Meeting context:** [2026-03-21 - Elevated auth.md](../../../00-Inbox/Meetings/2026-03-21%20-%20Elevated%20auth.md) · [2026-03-26 - Remote app and PDF payslip.md](../../../00-Inbox/Meetings/2026-03-26%20-%20Remote%20app%20and%20PDF%20payslip.md)

---

## The Job to Be Done

Remote apps can **request step-up verification from the core platform**, receive a **short-lived elevated token**, and **validate server-side** before serving payslip/leave/HR data — one consistent protocol across apps.

**User value:** Avoids per-app auth fragmentation and closes “session-only” security gap for sensitive data.

---

## Work Packages

### WP-1: Workshop — core vs remote split (P0)

**Priority:** P0  
**Dependencies:** Phase 1 elevated auth core  
**Files:** Decision log TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | UI ownership (core shell vs remote) decided | ADR |
| 1b | Token transport (redirect, postMessage, store) selected | Threat model |

### WP-2: Token issuance & validation API (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Auth service TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 2a | Elevated token claims (user, tenant, scope, exp) | JWT/OAuth spec |
| 2b | Validation endpoint for remote apps | Contract tests |

### WP-3: Tenant configuration (P0 — Depends on WP-2)

**Priority:** P0  
**Dependencies:** [Tenant_Management.md](./Tenant_Management.md)  
**Files:** Admin UI TBD  
**VPS-eligible:** No

### WP-4: Audit & Smart HR extension (P1)

**Priority:** P1  
**Dependencies:** WP-2  
**Files:** Audit pipeline TBD  
**VPS-eligible:** Yes

**Dependency graph:**

```text
WP-1 ──> WP-2 ──> WP-3
WP-2 ──> WP-4
```

---

## Success Scenarios

### Scenario 1: Payslip path

**Setup:** User opens remote payslip app.  
**Action:** No valid elevated token.  
**Observable Outcome:** Core step-up prompt; on success, token issued; payslip served.  
**Success Criteria:** E2E security review pass.

### Scenario 2: Token expiry

**Setup:** Token expired mid-session.  
**Action:** User retries sensitive action.  
**Observable Outcome:** Re-prompt for elevation.  
**Success Criteria:** Automated test for expiry boundary.

---

## Satisfaction Metric

**Overall Success:** **0** critical vulnerabilities in penetration test of token flow (target).

**Measured by:** Security assessment.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Audit logs are authoritative — not marketing analytics.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Not** external SSO replacement — elevated auth is step-up **inside** Wyzetalk model.  
- Tokens **scoped** per remote app; **not** long-lived in localStorage without encryption policy (OQ-02).  
- **Audit** every pass/fail.

---

## Technical Blueprint

### System Integration Map

```text
Remote_app --> request_elevation --> Core_UI --> issue_token
Remote_app --> validate_token --> Core_API --> user_context
```

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Core auth | TBD |
| Payslip remote app | TBD |

---

## Validation Protocol

```bash
grep -c "Payslip_PDF" "06-Resources/PRDs/Elevated_Auth_Remote_App.md"
# PASS: >= 1

grep -c "elevated" "06-Resources/PRDs/Elevated_Auth_Remote_App.md"
# PASS: >= 1
```

**Manual:** Security review; workshop outcomes.

---

## Notes for Agent Implementation

**Scout priorities:** OQ SSO interaction ([SSO.md](../Future/SSO.md) if present).  
**Worker tasks:** Bind hidden field model (Jan/Tanya documentation).

---

## Files to Create

```
# TBD
docs/auth/elevated-token-protocol.md
```

---

## Out of Scope

- Resolving all **SSO** interactions — tracked in SSO doc / workshop.

---

## Detailed product context (legacy)

## Background

Two parallel decisions are in flight from Q1 2026:

1. **Elevated auth (core)** — A tenant-configured step-up verification layer. Not external SSO; not standard OTP. A second identity check (configurable factor, label, description) applied before accessing sensitive actions or data. Defined as CORE platform with tenant-level configuration. Workshop on core vs remote app split still pending (task `task-20260323-008`).

2. **Remote app model** — Independent deployable apps (payslip viewer, leave balance, HR self-service) that are federated into the core [[Wyzetalk]] shell via token passing. The core platform issues a token; the remote app validates it against core APIs to retrieve user context and make downstream calls. First live example: FLM (Food Lovers Market) payslip integration.

This PRD covers the **intersection**: how remote apps request elevated auth from the core before unlocking sensitive data, and how the token model carries the elevated auth claim across the boundary.

## Problem hypothesis

Remote apps (payslip, leave, HR self-service) handle sensitive employee data. Accessing a payslip or updating personal HR details should require more than a session token — it should require explicit step-up verification at the time of access. The challenge is that remote apps are independently deployed and cannot directly trigger the core auth flow. A clean protocol is needed so remote apps can:

1. **Signal** they require elevated auth before rendering sensitive content
2. **Request** the core to perform the step-up check
3. **Receive** a short-lived elevated-auth token that proves the check was completed
4. **Validate** that token server-side before serving data

Without this, either (a) sensitive remote app data is accessible to anyone with a valid session (security gap), or (b) each remote app builds its own auth layer (fragmentation, inconsistency, compliance risk).

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

## Key design decisions pending workshop

| Decision | Options | Impact |
|----------|---------|--------|
| Token passing mechanism | Redirect with token param vs postMessage vs shared secure store | Security model, cross-origin trust |
| Elevated auth vs SSO interaction | Does an SSO session satisfy elevated auth? Or always require step-up? | See OQ-01 in [SSO.md](../Future/SSO.md) |
| Scope granularity | Per-app token vs per-action token | Complexity vs security |
| Core vs remote app boundary | Where does the elevated auth UI live — core shell or remote app? | UX consistency, maintenance |
| Hidden field compliance (Jan's model) | Permission + hidden field prevents impersonation; how does this bind to the elevated auth factor? | POPIA / auditor requirements |

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
  └── Extended to: leave balance, HR self-service, Smart HR WhatsApp (see [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md))
```

## Open questions (pre-design)

| # | Question | Owner |
|---|----------|-------|
| OQ-01 | Core vs remote app split: does elevated auth UI live in the core shell (better consistency) or can remote apps trigger it inline? | Workshop |
| OQ-02 | Token storage: where is the elevated-auth token held between issuance and validation? Secure memory only, or short-lived localStorage with encryption? | Engineering |
| OQ-03 | What happens if a user closes the elevated auth prompt without completing? Does the remote app fall back to a safe state or surface a retry? | Product + Design |
| OQ-04 | If the tenant disables elevated auth mid-session, does a previously issued elevated-auth token remain valid until expiry? | Engineering |
| OQ-05 | Tanya's documentation update (user import, user profile, hidden field viewing) — does this need to be complete before this PRD can be fully specified? | Tanya (in progress) |

---

## Acceptance criteria (BDD)

*To be added after Phase 1 workshop.*

---

*Promote to full PRD after Phase 1 elevated auth workshop is complete. See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17*
