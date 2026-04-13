# Product briefs — Current + Next PRDs

**Owner:** Shaun  
**Date:** 2026-04-13  
**Status:** Roll-up (derived from existing PRDs; not a replacement for source specs)

**Purpose:** One-screen **product-brief** view per formal PRD in **[Current/](Current/)** (Wyzetalk Essential) and **[Next/](Next/)** (specified post–GA). Use this for steering, workshops, and sequencing — then open the linked PRD + `*_acceptance_criteria.md` for delivery detail.

**Hub:** [Requirements.md](Current/Requirements.md) · [PRD_Product_Map.md](PRD_Product_Map.md) · [README.md](README.md)

**Deferred / future-phase:** **[Future/](Future/)** — pre-PRD themes and **SSO** (formal spec parked there; see [Future/SSO.md](Future/SSO.md)). Broader **Future** product briefs still run after workshops promote themes.

---

## How to read each brief

| Field | Meaning |
|--------|--------|
| **Elevator pitch** | What this capability is, in plain language |
| **Problem** | Why it exists |
| **Who it’s for** | Primary users |
| **Success / MVP signal** | What “working” looks like at a glance |
| **Depends on** | Upstream PRDs or programs |
| **QA layer** | Acceptance criteria file (where applicable) |

---

# Current — Wyzetalk Essential

## Requirements (hub)

| | |
|--|--|
| **Elevator pitch** | Index of all Essential specs and how they connect — not a feature PRD itself. |
| **Problem** | Teams need one map for dependencies, build order, and canonical rules across specs. |
| **Who it’s for** | PM, eng leads, QA |
| **Success / MVP signal** | Every launch-scope capability has a PRD + AC where applicable; [PRD_Product_Map.md](PRD_Product_Map.md) stays aligned. |
| **Depends on** | All Current PRDs |
| **QA layer** | [README.md](README.md) § Acceptance criteria |

---

## Communication

| | |
|--|--|
| **Elevator pitch** | Multi-channel **delivery layer** for SMS, email, push — plus JIRA for support tickets. |
| **Problem** | Invites, OTPs, and notifications must reach employees reliably across devices and preferences. |
| **Who it’s for** | System, employees, admins (indirect via support) |
| **Success / MVP signal** | Correct channel selection; push on Android/Apple/Huawei; prefs respected. |
| **Depends on** | Used by Login, Notifications, Messaging, WhatsApp Channel |
| **QA layer** | [Communication_acceptance_criteria.md](Current/Communication_acceptance_criteria.md) |

---

## Feed

| | |
|--|--|
| **Elevator pitch** | The **main employee surface** after login — chronological business posts for groups the user belongs to. |
| **Problem** | Frontline staff need one trusted place for company news; clutter or weak search kills adoption. |
| **Who it’s for** | Employees (read); admins (moderate from feed) |
| **Success / MVP signal** | Group-targeted posts visible; search/filter/reactions; archive rules applied. |
| **Depends on** | Groups, Posts; coordinates with Messaging (pinned urgent) |
| **QA layer** | [Feed_acceptance_criteria.md](Current/Feed_acceptance_criteria.md) |

---

## Groups

| | |
|--|--|
| **Elevator pitch** | **Audience segments** for posts and messaging — query builder, saved groups, once-off picks. |
| **Problem** | Without structured audiences, everything is broadcast noise. |
| **Who it’s for** | Tenant admins / comms |
| **Success / MVP signal** | Every publish path requires a group; query builder keys from import. |
| **Depends on** | User Importer, User Management |
| **QA layer** | [Groups_acceptance_criteria.md](Current/Groups_acceptance_criteria.md) |

---

## Login & Account Activation

| | |
|--|--|
| **Elevator pitch** | **Tenant routing**, activation, OTP login, recovery — tuned for deskless reality. |
| **Problem** | High friction and wrong-tenant confusion drive support load and failed activations. |
| **Who it’s for** | New and returning employees; account owners |
| **Success / MVP signal** | QR/code routing; OTP flows; Find My Account; post-login land on feed. |
| **Depends on** | Tenant Management, Communication |
| **QA layer** | [Login_Account_Activation_acceptance_criteria.md](Current/Login_Account_Activation_acceptance_criteria.md) |

---

## Messaging: Ops & Urgent Alerts

| | |
|--|--|
| **Elevator pitch** | **Two messaging modes**: urgent (takeover + ack) vs operational (channel-flexible) — same audience model as Posts. |
| **Problem** | Everything-as-emergency erodes trust; ops needs targeted channels without polluting urgent. |
| **Who it’s for** | Admins sending; employees receiving |
| **Success / MVP signal** | Urgent protected; ops multi-channel; cost visibility; feed pin rules for urgent. |
| **Depends on** | Groups, Communication, Feed, Tenant (cost/currency), WhatsApp Channel |
| **QA layer** | [Messaging_Ops_Urgent_Alerts_acceptance_criteria.md](Current/Messaging_Ops_Urgent_Alerts_acceptance_criteria.md) |

---

## Notifications

| | |
|--|--|
| **Elevator pitch** | **In-app + push** notification types, severity, drawer/toast patterns — wires to Communication for delivery. |
| **Problem** | Inconsistent notification UX breaks actionable workflows (e.g. group ownership requests). |
| **Who it’s for** | All users |
| **Success / MVP signal** | Timely alerts; in-notification actions where specified; severity model. |
| **Depends on** | Communication, Profile (toggles), Posts (publish alerts) |
| **QA layer** | [Notifications_acceptance_criteria.md](Current/Notifications_acceptance_criteria.md) |

---

## Payslip PDF (remote + Elevated Auth)

| | |
|--|--|
| **Elevator pitch** | **Secure payslip PDF** via remote integration — Elevated Auth, in-app viewer, tenant config, reduced support. |
| **Problem** | Fragmented payroll integrations, browser fragility, and PUK overhead create cost and risk. |
| **Who it’s for** | Frontline employees; HR/support (fewer tickets) |
| **Success / MVP signal** | Step-up auth; in-app PDF; clear errors/recovery; minimal PII in lists. |
| **Depends on** | Tenant Management, Login, User Management |
| **QA layer** | [Payslip_PDF_acceptance_criteria.md](Current/Payslip_PDF_acceptance_criteria.md) |

---

## Posts

| | |
|--|--|
| **Elevator pitch** | **Admin-authored content** with mandatory group; Phase 1 templates + Phase 2 PDF/Video/Form link via same lifecycle. |
| **Problem** | Unstructured comms don’t scale; extended formats must reuse one model. |
| **Who it’s for** | Comms admins |
| **Success / MVP signal** | Draft → publish → archive; group required; Phase 2 media pipeline aligned with Cloudflare. |
| **Depends on** | Groups, Feed, Notifications |
| **QA layer** | [Posts_acceptance_criteria.md](Current/Posts_acceptance_criteria.md) |

---

## Profile: Users

| | |
|--|--|
| **Elevator pitch** | **Self-service** for contact + prefs; owners get company/theme controls. |
| **Problem** | Minor profile changes shouldn’t become HR tickets. |
| **Who it’s for** | Employees; tenant owners |
| **Success / MVP signal** | Edit limited fields; see imported data; password + notification toggles. |
| **Depends on** | Communication, Notifications, User Management, Theming |
| **QA layer** | [Profile_Users_acceptance_criteria.md](Current/Profile_Users_acceptance_criteria.md) |

---

## Tenant Management

| | |
|--|--|
| **Elevator pitch** | **Tenant lifecycle** — creation, identifiers, QR/codes, branding hooks, currency/SMS/WhatsApp config. |
| **Problem** | Inconsistent tenant setup blocks activation and comms cost clarity. |
| **Who it’s for** | Tenant Managers; Wyzetalk ops |
| **Success / MVP signal** | Automated QR/code; identifier pair; setup completion metrics. |
| **Depends on** | Feeds Login, Communication, Messaging |
| **QA layer** | [Tenant_Management_acceptance_criteria.md](Current/Tenant_Management_acceptance_criteria.md) |

---

## Theming

| | |
|--|--|
| **Elevator pitch** | **Constrained branding** — palette, type, buttons — with preview. |
| **Problem** | Default shell feels generic; full white-label is out of scope. |
| **Who it’s for** | Owners |
| **Success / MVP signal** | Accessible palettes; preview before apply. |
| **Depends on** | Tenant Management, Profile |
| **QA layer** | [Theming_acceptance_criteria.md](Current/Theming_acceptance_criteria.md) |

---

## User Importer

| | |
|--|--|
| **Elevator pitch** | **Snapshot import** with dedup, leaver handling, protected activated contacts, export/rollback. |
| **Problem** | Turnover and dirty HR data break targeting and activation. |
| **Who it’s for** | Admins/owners |
| **Success / MVP signal** | Clear import report; system IDs; no overwrite of verified mobile/email. |
| **Depends on** | — (enables Groups, Login) |
| **QA layer** | [User_Importer_acceptance_criteria.md](Current/User_Importer_acceptance_criteria.md) |

---

## User Management

| | |
|--|--|
| **Elevator pitch** | **Admin directory** — search, roles, invite, bulk actions, concurrent edit protection. |
| **Problem** | Admin workarounds and collisions without a single control surface. |
| **Who it’s for** | Admins/owners |
| **Success / MVP signal** | Directory completeness; safe concurrent edits; role changes. |
| **Depends on** | User Importer |
| **QA layer** | [User_Management_acceptance_criteria.md](Current/User_Management_acceptance_criteria.md) |

---

## WhatsApp Channel

| | |
|--|--|
| **Elevator pitch** | **One-way WhatsApp** as delivery for the same urgent/standard message types — tenant WABA, opt-in, cost preview. |
| **Problem** | Deskless workers live in WhatsApp; SMS/push alone miss reach. |
| **Who it’s for** | Employees (receive); admins (send) |
| **Success / MVP signal** | Outbound-only templates; Meta/opt-in compliance; cost estimate pre-send. |
| **Depends on** | Messaging, Communication, Tenant, Profile opt-in |
| **QA layer** | [WhatsApp_Channel_acceptance_criteria.md](Current/WhatsApp_Channel_acceptance_criteria.md) |

---

# Next — specified post–Essential GA

*Priority order and workshop timing: [Next/README.md](Next/README.md), [Wyzetalk_Essential_Launch.md](../../04-Projects/Wyzetalk_Essential_Launch.md).*

**SSO** is **not** listed here — it lives under **[Future/SSO.md](Future/SSO.md)** (future-phase) until promoted to Next. Brief: SAML/OIDC + migration story; QA: [Future/SSO_acceptance_criteria.md](Future/SSO_acceptance_criteria.md).

---

## Content — Scheduled & Recurring Publishing

| | |
|--|--|
| **Elevator pitch** | **Schedule** posts and **operational** messages; **cron-first**; urgent stays immediate. |
| **Problem** | Publish-now-only forces bad timing and weak cadence. |
| **Who it’s for** | Comms, HR ops |
| **Success / MVP signal** | Schedule + recurring MVP; timezone rules; queue/calendar TBD in discovery. |
| **Depends on** | Posts, Messaging (standard), Communication, Feed |

---

## WhatsApp — Smart HR (Conversational)

| | |
|--|--|
| **Elevator pitch** | **Two-way / Flow** experiences on WhatsApp for HR journeys — commercial #1; extends one-way channel. |
| **Problem** | Competitors already ship conversational HR in WhatsApp; table stakes for deals. |
| **Who it’s for** | Frontline employees; HR |
| **Success / MVP signal** | Flow-based journeys; pricing model aligned with Meta 2026; demo-ready path. |
| **Depends on** | WhatsApp Channel, Payslip PDF, User Management |

---

## Elevated Auth — Remote App Integration

| | |
|--|--|
| **Elevator pitch** | **Protocol** for remote apps to request core step-up and receive scoped elevated tokens. |
| **Problem** | Sensitive remote surfaces must not rely on session alone; avoid per-app auth silos. |
| **Who it’s for** | Employees using payslip/leave/HR remote apps |
| **Success / MVP signal** | Request/validate token flow; audit; aligns with core elevated auth workshop. |
| **Depends on** | Login, Tenant, Profile, Payslip PDF |

---

## Product Analytics

| | |
|--|--|
| **Elevator pitch** | **Event schema at GA**; tenant + internal dashboards phased after. |
| **Problem** | No shared truth on adoption, delivery, or engagement post-launch. |
| **Who it’s for** | Tenant admins; Wyzetalk PM/CS; sales QBRs |
| **Success / MVP signal** | Instrumentation live; funnel + DAU/MAU + content metrics defined. |
| **Depends on** | Feed, Posts, Messaging, Communication, Login, Tenant, Profile |

---

## Explorer — Category-Based Navigation

| | |
|--|--|
| **Elevator pitch** | **Topic hub** (tiles) for permanent reference content — complements chronological feed. |
| **Problem** | Policies and guides get buried in the feed. |
| **Who it’s for** | Employees browsing by topic |
| **Success / MVP signal** | Tiles + filtered views; scope confirmed post-workshop (priority under review). |
| **Depends on** | Posts taxonomy, Feed, Groups; entry to Page Builder |

---

## Page Builder — Widget-Driven Content

| | |
|--|--|
| **Elevator pitch** | **Composable pages** (widgets) for durable content — linked from Explorer, posts, messages. |
| **Problem** | Single-template posts are wrong for rich reference and multi-section guidance. |
| **Who it’s for** | Authors; employees reading reference |
| **Success / MVP signal** | Widget MVP set; stable URLs; Explorer integration. |
| **Depends on** | Posts (concepts), Feed (links), Explorer |

---

## Templates (not feature PRDs)

| File | Role |
|------|------|
| [Template_Remote_App.md](Next/Template_Remote_App.md) | Discovery worksheet for **federated remote app** candidates. |
| [Template_Feature_Essential.md](Next/Template_Feature_Essential.md) | Discovery worksheet for **core Essential** features. |

---

## Maintenance

- When a **Next** PRD ships and moves to **Current**, add its brief under Current and trim or redirect here.
- When **Future** items are promoted, add briefs in a sibling doc **`Product_Briefs_Future.md`** after workshops (not maintained yet). **Exception:** [Future/SSO.md](Future/SSO.md) is already a full PRD — link from [Future/README.md](Future/README.md).

---

*Generated from `/product-brief` roll-up request — 2026-04-13. SSO brief removed from Next section — moved to Future-phase 2026-04-13.*
