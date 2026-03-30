# SSO — Acceptance Criteria

> **Scope:** Enterprise Identity Federation (SAML 2.0 / OIDC). Covers IdP configuration, SP-initiated login, JIT provisioning, session management, coexistence with OTP, and error states. **Phase: Next (post-Essential GA).**
>
> Test code prefix: **SA** (SSO Authentication)

**Related PRD:** [SSO.md](./SSO.md) · **Phase 1 base:** [Login_Account_Activation_acceptance_criteria.md](../Current/Login_Account_Activation_acceptance_criteria.md)

---

## SA-01 — SAML 2.0 IdP Configuration (metadata upload)

| | |
|---|---|
| **Given** | A tenant admin is in Tenant Management → SSO Configuration |
| **When** | They upload a valid SAML 2.0 metadata XML file |
| **Then** | Entity ID, SSO URL, and X.509 certificate are parsed and pre-filled; admin can review before saving |

---

## SA-02 — SAML 2.0 IdP Configuration (manual entry)

| | |
|---|---|
| **Given** | A tenant admin is in Tenant Management → SSO Configuration |
| **When** | They enter Entity ID, SSO URL, and paste an X.509 certificate manually |
| **Then** | Configuration is saved in draft state; a downloadable SP metadata XML is available for the admin to register in their IdP |

---

## SA-03 — OIDC IdP Configuration

| | |
|---|---|
| **Given** | A tenant admin selects OIDC as the protocol |
| **When** | They enter Client ID, Client Secret, and a valid Discovery URL |
| **Then** | The system fetches the OpenID configuration from the discovery endpoint and confirms endpoints are reachable; configuration is saved in draft |

---

## SA-04 — Attribute Mapping — Required fields

| | |
|---|---|
| **Given** | SSO configuration is in draft |
| **When** | The admin does not map the EmployeeID claim to a Wyzetalk user field |
| **Then** | The system blocks enabling SSO and shows: "EmployeeID mapping is required to match users. Map this field before enabling." |

---

## SA-05 — Test Connection — Pass

| | |
|---|---|
| **Given** | An admin has completed IdP configuration and attribute mapping |
| **When** | They click "Test connection" |
| **Then** | A SAML/OIDC test flow is initiated; on success, the system shows "Connection successful — IdP reachable and assertion valid" with a summary of received claims |

---

## SA-06 — Test Connection — Fail

| | |
|---|---|
| **Given** | An admin has configured an IdP with an incorrect SSO URL |
| **When** | They click "Test connection" |
| **Then** | The system shows a specific error (e.g. "IdP endpoint unreachable — check the SSO URL") without enabling the configuration |

---

## SA-07 — SSO Enable gate

| | |
|---|---|
| **Given** | SSO configuration has not been tested successfully |
| **When** | The admin tries to enable SSO |
| **Then** | The "Enable SSO" button is disabled until a successful test connection has been recorded in the current session |

---

## SA-08 — SP-initiated login — SSO button appears

| | |
|---|---|
| **Given** | A tenant has SSO enabled in Mixed mode |
| **When** | A user reaches the login page for that tenant (via QR, company code, or short URL) |
| **Then** | A "Sign in with [Tenant Display Name]" button is shown alongside the OTP option |

---

## SA-09 — SP-initiated login — Successful federation

| | |
|---|---|
| **Given** | A user clicks "Sign in with [Company]" and authenticates successfully at the IdP |
| **When** | The IdP returns a valid SAML assertion / OIDC token to Wyzetalk |
| **Then** | The system validates the assertion, matches the user by EmployeeID, issues a session, and routes the user to the Feed (standard post-login landing) |

---

## SA-10 — SP-initiated login — User not found, JIT disabled

| | |
|---|---|
| **Given** | A user authenticates at the IdP successfully, but no matching Wyzetalk user record exists and JIT provisioning is disabled |
| **When** | Wyzetalk processes the assertion |
| **Then** | The user sees: "Account not found — contact your HR administrator." No user record is created. The event is logged. |

---

## SA-11 — JIT Provisioning — New user auto-created

| | |
|---|---|
| **Given** | JIT provisioning is enabled for the tenant |
| **When** | A user authenticates at the IdP and no matching Wyzetalk record exists |
| **Then** | A user record is created using the mapped IdP attributes; the user is assigned the default role; the user lands on the Feed; the provisioning event is logged with "SSO-provisioned" flag |

---

## SA-12 — JIT Provisioning — Missing required attribute

| | |
|---|---|
| **Given** | JIT provisioning is enabled but the IdP assertion is missing a required mapped attribute (e.g. phone number) |
| **When** | Wyzetalk attempts to create the user record |
| **Then** | Provisioning fails; no partial record is created; the user sees: "Your account could not be verified — contact your IT administrator." Event is logged with attribute detail. |

---

## SA-13 — Coexistence: OTP user in SSO-enabled tenant

| | |
|---|---|
| **Given** | A tenant has SSO enabled in Mixed mode |
| **When** | A user whose account is not linked to an IdP identity reaches the login page |
| **Then** | The OTP login flow is available and functions exactly as in the Phase 1 spec; no SSO redirect occurs for this user |

---

## SA-14 — SSO-only mode: OTP disabled

| | |
|---|---|
| **Given** | A tenant admin has set login mode to "SSO-only" |
| **When** | Any user reaches the login page for that tenant |
| **Then** | Only the "Sign in with [Company]" button is shown; OTP option is not presented |

---

## SA-15 — Deactivated account: SSO assertion rejected

| | |
|---|---|
| **Given** | A user's Wyzetalk account is deactivated |
| **When** | The user authenticates at the IdP and a valid assertion is returned |
| **Then** | Wyzetalk rejects the session; the user sees the standard deactivated account message; no session is issued |

---

## SA-16 — IdP unreachable: fallback prompt

| | |
|---|---|
| **Given** | A user clicks "Sign in with [Company]" |
| **When** | The IdP is unreachable or returns a timeout |
| **Then** | The user sees: "Sign-in service unavailable — try again or use [OTP login]." The OTP option remains accessible. The event is logged server-side. |

---

## SA-17 — Expired / invalid SAML assertion

| | |
|---|---|
| **Given** | Wyzetalk receives a SAML assertion |
| **When** | The assertion is expired, the signature is invalid, or the Audience does not match the SP Entity ID |
| **Then** | The assertion is silently rejected; the user sees a generic auth error; detailed failure reason is logged server-side only (not exposed to user) |

---

## SA-18 — Certificate expiry warning (SAML)

| | |
|---|---|
| **Given** | The IdP X.509 certificate in the tenant's SAML configuration is within 30 days of expiry |
| **When** | A tenant admin views the Tenant Management → SSO Configuration screen |
| **Then** | A warning banner is shown: "Your IdP certificate expires on [date]. Update it before expiry to prevent login disruptions." |

---

## SA-19 — Certificate expiry: SSO blocked

| | |
|---|---|
| **Given** | The IdP X.509 certificate has expired |
| **When** | A user attempts SSO login |
| **Then** | SSO is blocked; user sees: "Sign-in is temporarily unavailable — contact your IT administrator." Tenant admin sees a critical error in Tenant Management. OTP login (if not SSO-only) remains available. |

---

## SA-20 — SAML Single Logout — IdP-initiated

| | |
|---|---|
| **Given** | A user has an active Wyzetalk SSO session |
| **When** | The IdP sends a SAML SLO request to the Wyzetalk SLO endpoint |
| **Then** | Wyzetalk invalidates the user's session; the user is redirected to the login page on next navigation |

---

## SA-21 — Audit log: SSO login event

| | |
|---|---|
| **Given** | A user successfully authenticates via SSO |
| **When** | The session is issued |
| **Then** | An audit log entry is created with: timestamp, user ID, tenant ID, IdP type (SAML/OIDC), login result (success), and JIT flag (if applicable) |

---

## SA-22 — Audit log: SSO failure event

| | |
|---|---|
| **Given** | An SSO authentication attempt fails for any reason |
| **When** | The failure is processed |
| **Then** | An audit log entry is created with: timestamp, tenant ID, failure type (IdP unreachable / assertion invalid / user not found / account deactivated), and enough detail for an admin to diagnose — without storing raw assertion content |

---

## SA-23 — SP metadata download

| | |
|---|---|
| **Given** | A tenant admin is in SSO Configuration |
| **When** | They click "Download SP metadata" |
| **Then** | A valid SAML SP metadata XML is downloaded containing the SP Entity ID, ACS URL, and SP certificate; the file can be uploaded directly to Azure AD, Okta, or Google Workspace to register Wyzetalk as a service provider |
