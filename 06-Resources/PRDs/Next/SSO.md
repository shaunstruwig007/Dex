# SSO — Enterprise Identity Federation

---

> Spec for SAML 2.0 and OIDC enterprise single sign-on, enabling employees at tenants with existing identity providers (Azure AD, Google Workspace, Okta) to access [[Wyzetalk]] using their corporate credentials. Phase 1 OTP login remains the default for non-SSO tenants and non-SSO users within a mixed tenant.

**Phase:** Next (post-Essential GA) — not in scope for Essential launch.

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

---

## Strategic reframe (2026-03-30)

> **Important clarification from Leon (CTO), 2026-03-30:**

SSO has been repositioned. The two use cases are now treated with different urgency:

| Use case | Priority | Notes |
|----------|----------|-------|
| **Blue ↔ remote app authenticated handoff** | **Higher** — required for Remote App Extensions (#4 priority) | Core requirement: securely pass an authenticated user record from Blue to a client-owned remote app (payslips, leave, roster). This is NOT necessarily external IdP/SAML. |
| **External IdP federation (Azure AD, Okta, Google)** | **Lower** — migration enabler for Q4 2026+ cohorts | Still needed for the €93K MRR migration cohort, but not a primary new-sales procurement blocker as previously positioned. |

**What this means for the PRD:**
- The core near-term requirement is the authenticated session handoff between Blue and remote apps — closer to elevated auth / token-passing than full SAML federation.
- Full external IdP/SAML is still in scope but is primarily a **migration enabler** (Q4 2026 cohorts), not a new-deal unlock.
- Discovery workshops (week 2–3 April) should clarify the exact technical boundary between elevated auth (remote app) and SSO (external IdP).

**Relationship to Elevated Auth PRD:** See [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) — elevated auth handles step-up for remote apps and may satisfy the near-term Blue↔remote app handoff requirement without full SAML/OIDC.

**Related PRDs (Essential / Current):** [Login_Account_Activation.md](../Current/Login_Account_Activation.md) (extends — SSO replaces OTP for configured users), [Tenant_Management.md](../Current/Tenant_Management.md) (IdP config added here), [User_Importer.md](../Current/User_Importer.md) (JIT provisioning vs pre-import), [Profile_Users.md](../Current/Profile_Users.md) (attribute mapping to user record). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-001](../Evidence_register.md) | Deal loss analysis: **18 deals tagged with technical / integration fit as a loss theme** (keyword-derived from HubSpot free-text fields). 3 explicitly cite "not complying to technical requirements" in the structured HubSpot field. Full named list pending extraction from source spreadsheet. IT/security procurement gates not met. ⚠️ **Under validation** — see note below. |
| [EV-2026-03-003](../Evidence_register.md) | Humand $66M Series A — enterprise-tier competitors investing in identity and integration depth signals that SSO is becoming table stakes in this category. |
| Migration roadmap Q4 2026 – Q1 2027 cohort | €93,348 MRR (Ardagh Glass, Khumani, Ekapa, Black Rock, Jonsson's, Sun International, Food Lover's, Ulwazi, Sibanye-Stillwater, Glencore SA, Harmony, Lactalis, Isuzu, Bidvest) explicitly tagged as SSO/integrations dependent. Slipping these cohorts delays cost recovery on legacy infra. |

> ⚠️ **18-deal figure — under validation (2026-03-30):** Merel challenged the accuracy of this figure in the 2026-03-30 leadership session — inconsistencies noted with her board summaries and sales knowledge. The figure is **keyword-derived from HubSpot free-text fields** and may not accurately reflect SSO as a true procurement blocker. **Do not use this figure in any external narrative or sales deck until validated.** Shaun to interview Tafadzwa, Isma'eel, and Michelle to confirm whether SSO was an explicit procurement blocker in specific named lost deals. Also: review full lost deal Excel for named list.

---

## Problem Statement

Enterprise and mid-market accounts in regulated industries (mining, manufacturing, retail, logistics) operate Microsoft Azure AD or Okta as their central identity provider. Their IT security posture requires that all employee-facing applications federate with the corporate IdP — so users authenticate once (corporate login) rather than managing separate app credentials.

The current [[Wyzetalk]] OTP model (SMS to phone number) fails this bar in two ways:

1. **Procurement blocker** — IT / security teams reject apps that don't support SAML or OIDC during RFP evaluation, before product value is assessed. 18 deals are tagged with technical / integration fit as a loss theme (keyword-derived); 3 explicitly cite non-compliance with technical requirements in HubSpot's structured field — GoGlobal, Mukuru (functionality gap), and Pepsico USA. Full named list pending extraction from source spreadsheet. ⚠️ *The 18-deal figure is under validation — see Evidence section. Do not use externally until validated.*
2. **Migration blocker** — The Q4 2026 and Q1 2027 migration cohorts (€93K MRR) are explicitly flagged as SSO/integrations dependent in the Essential migration roadmap. Without SSO, these accounts cannot be migrated on schedule, extending legacy platform costs and delaying revenue.

The OTP model is not wrong — it serves the deskless, low-literacy, unstable-phone-number user well. SSO is an additive layer for the white-collar and management population at the same enterprises who are already on corporate devices with Azure AD accounts.

---

## Goals

> *Revised priority order per 2026-03-30 reframe. Blue↔remote app handoff is now the primary near-term goal; external IdP federation is secondary (migration-focused).*

1. **Enable Blue ↔ remote app authenticated handoff** — Securely pass authenticated user records from Blue to client-owned remote apps (payslips, leave, roster) without requiring users to re-authenticate. Primary near-term requirement.
2. **Unblock €93K MRR migration cohorts** — Q4 2026 and Q1 2027 accounts migrate on schedule without IT/security blockers.
3. **Pass enterprise IT procurement gates** — SSO on the spec sheet ends the pattern of deals dying before product evaluation. *(Impact on new deals to be confirmed via stakeholder interviews — see Evidence.)*
4. **Zero disruption to OTP users** — Non-SSO employees in the same tenant continue unchanged on OTP login.
5. **Self-service IdP setup for tenant admins** — IT admins can configure and test their IdP connection without Wyzetalk engineering involvement.
6. **Attribute-driven user matching** — SSO assertions map to existing user records via employee ID, reducing duplicate account risk.

---

## Non-Goals

- **SCIM directory sync** — Automated user provisioning from IdP directory is a separate initiative (Phase 3 candidate). JIT provisioning (on-demand at first login) is in scope here.
- **Multiple IdPs per tenant** — Single IdP per tenant for Phase 2. Multi-IdP (e.g. group-based routing) is future scope.
- **Social login (Google, Apple consumer)** — This is an enterprise B2B feature; consumer social identity is a separate product decision.
- **Passkeys / biometric login** — Separate initiative; see `Login_Account_Activation.md` Non-Goals.
- **Replacing elevated auth for remote apps** — SSO controls platform entry. Elevated auth (step-up, remote app token) is orthogonal and remains as specified in the core platform.
- **MFA enforcement** — Wyzetalk will honour IdP-enforced MFA but will not add a second MFA layer on top of a SSO session. Elevated auth is separate.

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| US-SSO-01 | Tenant IT admin | Configure a SAML 2.0 or OIDC IdP connection for my tenant | Employees log in with corporate credentials |
| US-SSO-02 | Tenant IT admin | Test the IdP connection before enabling it for users | I can verify the integration without impacting production access |
| US-SSO-03 | Tenant IT admin | Map IdP attributes (EmployeeID, UPN, DisplayName) to Wyzetalk user fields | User records match without manual reconciliation |
| US-SSO-04 | Tenant IT admin | Enable or disable JIT provisioning | I control whether unknown IdP users auto-create accounts |
| US-SSO-05 | Employee (SSO-enabled tenant) | Click "Sign in with [Company]" on the login page | I authenticate with my existing corporate credentials |
| US-SSO-06 | Employee (SSO-enabled tenant) | Be redirected back to the app immediately after IdP auth | I experience seamless access without re-entering credentials |
| US-SSO-07 | Employee (OTP user in SSO-enabled tenant) | Still log in with OTP as before | My access is not disrupted because some colleagues use SSO |
| US-SSO-08 | Tenant admin | View an audit log of SSO login events | I can investigate access issues and demonstrate compliance |

---

## Skeleton Requirements

### S1 — IdP Configuration per Tenant (Tenant Management extension)

- Tenant admin can configure exactly one IdP per tenant
- **SAML 2.0 support:**
  - Metadata XML upload (preferred) or manual entry (Entity ID, SSO URL, X.509 certificate)
  - SP metadata downloadable by admin (Entity ID, ACS URL, SP certificate)
  - SP-initiated flow only for Phase 2 (IdP-initiated is Phase 2.1+)
- **OIDC support:**
  - Client ID, Client Secret, Discovery URL (`.well-known/openid-configuration`)
  - Supported IdPs tested: Azure AD, Google Workspace, Okta
  - Generic OIDC for unlisted providers
- Config is saved in draft until admin explicitly enables it
- Enabling SSO does not disable OTP for existing users — coexistence is the default

### S2 — Attribute Mapping

- Admin maps IdP claims/attributes to Wyzetalk user fields:
  - **Required:** EmployeeID (or equivalent unique identifier)
  - **Required:** Phone number (for OTP fallback and notification delivery)
  - **Optional:** Display name, email, department, role
- Mapping is configured per tenant in the SSO setup section of Tenant Management
- Unmapped required fields → JIT provisioning fails with a clear error (does not create incomplete record)

### S3 — SP-Initiated Login Flow

- On the login page, after tenant routing (QR / company code), if tenant has SSO enabled:
  - Show "Sign in with [Tenant Display Name]" button alongside (or instead of, if admin configured) OTP option
  - Clicking the button initiates the SAML / OIDC redirect to the IdP
- IdP authenticates the user and returns assertion/token to Wyzetalk ACS/callback URL
- Wyzetalk validates assertion/token:
  - Finds matching user record by EmployeeID claim
  - If match found → issue session, route to post-login landing (Feed)
  - If no match + JIT enabled → create user record, issue session
  - If no match + JIT disabled → show error: "Account not found — contact your HR administrator"

### S4 — JIT Provisioning

- On first successful SSO login where no matching user record exists:
  - Create user record with attributes from IdP assertion
  - Assign to tenant with default role (configurable: Employee)
  - Log creation event in audit log
- Admin can disable JIT per tenant (default: disabled — require pre-import)
- JIT-created users are flagged in User Management as "SSO-provisioned" for audit purposes

### S5 — Coexistence: SSO and OTP in Same Tenant

- SSO and OTP can coexist in the same tenant
- Users who have an SSO-linked identity → shown SSO button first
- Users without an SSO identity in the IdP → fall through to OTP login automatically
- Tenant admin can choose login mode per tenant:
  - **Mixed** (default): SSO button + OTP available
  - **SSO-first**: SSO button prominent; OTP available via "Other sign-in options" link
  - **SSO-only**: OTP disabled; only SSO allowed (admin acknowledges risk for users without IdP accounts)

### S6 — Session Management

- SSO session token issued on successful federation; standard platform session lifetime applies
- **SAML Single Logout (SLO):** Honour IdP-initiated logout if IdP sends SLO request
- On Wyzetalk logout: issue SAML SLO request to IdP (if SAML and SLO endpoint configured)
- IdP session expiry → user prompted to re-authenticate at next platform action (no silent re-auth)

### S7 — Error Handling

| Scenario | Behaviour |
|----------|-----------|
| IdP unreachable / timeout | Show error: "Sign-in service unavailable — try again or use [OTP option]". Log event. |
| Invalid / expired SAML assertion | Reject silently, show generic auth error, log detail server-side |
| Attribute mismatch (required claim missing) | Block login, show: "Your account could not be verified — contact your IT administrator". Do not create partial record. |
| Account not found + JIT disabled | Show: "Account not found — contact your HR administrator". Do not create record. |
| Account suspended/deactivated | Honour Wyzetalk account state even if IdP asserts valid identity. Show deactivated message. |
| Certificate expired (SAML) | Warn tenant admin in Tenant Management UI before expiry (30-day advance warning). Block SSO on expiry with clear admin error. |

---

## Flesh Requirements (Phase 2 nice-to-have, scope TBC)

- **SSO setup wizard** — Step-by-step guided setup for IT admins: choose protocol → enter config → map attributes → test → enable
- **Test connection** — Admin can fire a test SAML/OIDC request before going live, with a clear pass/fail result and debug detail
- **IdP-initiated flow (SAML)** — User clicks Wyzetalk tile in Azure MyApps / Okta Dashboard → lands directly in app (Phase 2.1)
- **Certificate rotation** — Upload new SP/IdP certificates before expiry without downtime
- **SSO login event dashboard** — Admin view: login volume, failure rate, JIT provisioning count (per tenant)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| SSO-blocked migration cohorts (Q4 2026 – Q1 2027) migrated on schedule | 100% of named accounts migrated within their window |
| SSO-related support tickets post-migration | < 2% of total support volume |
| Enterprise RFPs with SSO gate passed | Pass rate ≥ 80% (vs current: unknown / fail by default) |
| Tenant admin SSO setup time (first configuration to enabled) | < 30 minutes without Wyzetalk engineering support |
| JIT provisioning error rate | < 1% of first-time SSO logins |

---

## Open Questions

| # | Question | Owner | Due |
|---|----------|-------|-----|
| OQ-01 | Does elevated auth (step-up for remote apps) interact with SSO session? Can an SSO session satisfy elevated auth, or does it always trigger separately? | Shaun + Jan | Pre-design |
| OQ-02 | SCIM: is directory sync in scope for Phase 2 or strictly Phase 3? Affects JIT provisioning priority. | Shaun | Q2 2026 |
| OQ-03 | Token storage for IdP Access Token / Refresh Token — where stored, encryption at rest, POPIA/GDPR implications? | Engineering + Legal | Pre-build |
| OQ-04 | Which IdP is the highest-priority first target? Azure AD covers most Q4 2026 accounts; confirm with account owners. | Shaun + Sales | Before design kickoff |
| OQ-05 | SSO-only mode: what is the fallback for employees who lose Azure AD access (e.g. role changes, offboarding lag)? Define admin override path. | Shaun | Pre-build |
| OQ-06 | Certificate management for multi-year: who holds SP private key? How is rotation handled in production without downtime? | Engineering | Pre-build |
