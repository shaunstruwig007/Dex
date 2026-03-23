# Cross-cutting open questions (multi-PRD)

**Purpose:** Questions that **only appear** when connecting specs — not duplicates of single-PRD “Open Questions” sections.  
**Companion:** [PRD_Product_Map.md](./PRD_Product_Map.md) · per-feature AC files in this folder.

**Use:** Backlog / steerco / architecture — **human-owned**.

---

## Identity, tenant, and recovery

| # | Question | Touches |
|---|----------|---------|
| Q1 | **Find My Account:** Tenant §5 sends OTP on soft-match success; Login PRD describes HR verification path without OTP in some branches. **Which path is canonical** for partial matches, and when is a support ticket vs auto-update? | Login, Tenant_Management |
| Q2 | **Fuzzy matching:** Same algorithm/threshold for Find My Account (Login), Tenant import validation, and Importer row matching — **one service** or per-surface? | Login, Tenant, User_Importer |
| Q3 | **Company code expiry:** Login says expired code message; Tenant says yearly QR/code rotation. **Do short codes and QR share one clock** or independent TTL? | Login, Tenant_Management |

---

## Notifications, communication, and compliance

| # | Question | Touches |
|---|----------|---------|
| Q4 | **Preference hierarchy:** Profile allows email+push off. **Which classes bypass** prefs (urgent takeover, password reset, account-owner forced change, tenant disabled notice)? Define a **matrix**: channel × message type × override. | Profile, Communication, Notifications, Messaging |
| Q5 | **Operational vs urgent delivery cost:** Messaging shows estimated cost; Communication owns providers. **Single pricing service** or duplicate logic? | Messaging, Communication, Tenant |
| Q6 | **In-app “notification drawer” vs messaging read states:** Are operational SMS-only messages **mirrored** in drawer or SMS-only truly excludes in-app? | Messaging, Notifications, Communication |

---

## Content, audience, and data lifecycle

| # | Question | Touches |
|---|----------|---------|
| Q7 | **Group membership vs import cadence:** Groups PRD says not real-time; Posts need audience at publish. **At publish time**, is membership **frozen snapshot** or **re-evaluated** against latest import? | Groups, Posts, User_Importer |
| Q8 | **Admin creates post for group they’re not in** (Feed AC edge case): **Admin list/manage view** vs never seeing on personal feed — confirm product rule and build admin post list if needed. | Feed, Posts, Groups |
| Q9 | **Leaver deletion:** Importer deletes user; **posts authored**, **reactions**, **messaging analytics** — retain anonymised vs cascade rules; **align** User_Importer open question with legal. | User_Importer, Posts, Feed, Messaging |
| Q10 | **“Everyone” system group:** When import shrinks workforce dramatically, does **Everyone** audience change **retroactively** for **already published** posts? | Groups, Posts, Feed |

---

## UX coherence (single product feel)

| # | Question | Touches |
|---|----------|---------|
| Q11 | **Theme application timing:** Theming asks immediate vs next session; **Posts themed template** + **login screen** must not flash wrong palette on cold start. | Theming, Tenant, Posts, Login |
| Q12 | **Concurrent editing:** Posts governance lock vs User Management user lock vs Groups edit — **same lock component/pattern** or three behaviours? | Posts, User_Management, Groups |
| Q13 | **Owner theme location:** Profile says Company Account; Theming P1 says login/OTP theming. **Single settings surface** map for owners. | Profile, Theming, Tenant |

---

## Operations and compliance

| # | Question | Touches |
|---|----------|---------|
| Q14 | **JIRA:** Login creates tickets on duplicate mobile; Find My Account; Communication lists JIRA for support. **One ticket schema** and deduplication rules? | Login, Communication, Tenant |
| Q15 | **Audit logs:** Tenant audit (identity) vs post admin actions vs messaging send logs — **correlation ID** across systems for investigations? | Tenant, Posts, Messaging, User_Management |
| Q16 | **Hard-delete tenant:** Confirm backup/DW purge scope (Tenant open question) **before** first production tenant delete. | Tenant_Management |

---

## Suggested resolution order

1. **Q4 / Q7** — unblock MVP behaviour for notifications and targeting.  
2. **Q1 / Q2** — reduce contradictory recovery flows.  
3. **Q9 / Q16** — legal/compliance.  
4. **Q11 / Q12** — polish and engineering reuse.

---

*Add new rows here when PRDs change; link out to feature AC files for testable criteria.*
