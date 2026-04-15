---
id: idea-community-app
title: Community app
dex_dashboard_preserve: false
---

# Community app — discovery

Structured pass **2026-04-15**. Semantic routing: `node .scripts/semantic-search/check-availability.cjs --quiet` returned **exit 1** (QMD unavailable); vault evidence used **grep** and file reads. **Accounts:** `05-Areas/Relationships/Key_Accounts` not present in this workspace clone. **Meetings:** no hits under `00-Inbox/Meetings/` for this topic.

---

## Problem formulation

- **Who has the problem, when, and what is broken today**  
  - **External “communities around the business”** (e.g. mining: host communities, local residents, traditional authorities, municipal stakeholders, job seekers in the area) need **timely, trustworthy** updates from the company—jobs, CSR, safety incidents, environmental notices, brand/reputation—without everything living in **ad hoc WhatsApp groups**, one-off town halls, or **broadcast-only** channels that do not support structured two-way dialogue or governance.  
  - **Corporate affairs / community relations / HR (local hiring)** teams lack a **single governed surface** that ties **identity, moderation, retention, and analytics** to those audiences—different from **internal** employee comms.  
  - **Contrast with internal EX:** The vault’s product map is **employee → groups → posts → feed** for **workforce** audiences ([`06-Resources/PRDs/PRD_Product_Map.md`](../PRDs/PRD_Product_Map.md)); **Groups** are **admin-managed from imported employee data**, not self-serve communities ([`06-Resources/PRDs/Current/Groups.md`](../PRDs/Current/Groups.md) — Non-Goals include user-created / self-join). A “community app” in the **external** sense is therefore **not covered** by current shipped scope and must be distinguished from **peer employee chat** ([`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)).

- **Success looks like…**  
  - A client can **reach and optionally engage** defined external communities (per site, region, or campaign) with **clear roles** (read-only updates vs moderated Q&A vs applications), **auditability**, and **measurable reach**—while staying aligned with **regulated-industry** expectations (mining/energy called out in competitor positioning: [`06-Resources/Competitors/profiles/Workvivo.md`](../Competitors/profiles/Workvivo.md)).

---

## Evidence from the vault

- **Internal “community” as employee engagement (different problem):** Deskless research lists **“Lack of employee community”** among what breaks the frontline experience, alongside communication and training ([`06-Resources/Research/Industry_research_reports/summaries/Global - all industries/Deskless_Report_2024_UK.md`](../Research/Industry_research_reports/summaries/Global%20-%20all%20industries/Deskless_Report_2024_UK.md) — Frontline Hierarchy of Needs). Useful as **language** overlap only; does not substitute **external** community relations.  
- **Mining / metals — external community and social licence:** Industry summaries reference **community investment**, balancing operations with **community** users, and **community** veto/consultation examples ([`06-Resources/Research/Industry_research_reports/summaries/Mining and Metels/Global-_-Annual-Mining-Report-2025-compressed.md`](../Research/Industry_research_reports/summaries/Mining%20and%20Metels/Global-_-Annual-Mining-Report-2025-compressed.md); [`06-Resources/Research/Industry_research_reports/summaries/Mining and Metels/tracking-the-trends-2025.md`](../Research/Industry_research_reports/summaries/Mining%20and%20Metels/tracking-the-trends-2025.md)). **Women in mining communities** called out as a distinct subsection in ILO-aligned material ([`06-Resources/Research/Industry_research_reports/summaries/Mining and Metels/wcms_821061.md`](../Research/Industry_research_reports/summaries/Mining%20and%20Metels/wcms_821061.md)). Supports **use cases** (jobs, inclusion, local narrative), not a product spec.  
- **Product architecture — internal audiences only today:** **Groups** = query-builder segments over **employees**; no cross-tenant or self-join ([`06-Resources/PRDs/Current/Groups.md`](../PRDs/Current/Groups.md)). **Feed + posts** assume that membership model ([`06-Resources/PRDs/PRD_Product_Map.md`](../PRDs/PRD_Product_Map.md)).  
- **“Social” stance is an open discovery theme for the *employee* feed:** [`06-Resources/PRDs/Future/Feed_Social_Layer.md`](../PRDs/Future/Feed_Social_Layer.md) — business/ops vs social layer; relates to **internal** feed ranking/moderation, not external communities.  
- **Peer chat is sequenced as internal #3 post-GA** and scoped as **employee ↔ employee** ([`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)); product-idea file [`prd-employee_chat_and_groups.md`](./prd-employee_chat_and_groups.md) documents boundaries vs ops messaging and AI. **Community app** should be **explicitly decoupled** from that line item unless discovery merges them (high risk).  
- **Competitor colour:** Workvivo overlaps **EX engagement, mobile, community**; differentiation narrative for Wyzetalk is **regulated frontline ops, mining/energy, safety-first** ([`06-Resources/Competitors/profiles/Workvivo.md`](../Competitors/profiles/Workvivo.md)). Suggests **positioning** for an external community product must not blur **safety/ops** trust.  
- **Market pipeline:** Signal brief notes prioritising **Africa/SA mining** ingest when the pipeline resumes ([`06-Resources/Market_intelligence/synthesis/daily/2026-04-13_signal_brief.md`](../Market_intelligence/synthesis/daily/2026-04-13_signal_brief.md)); aligns with **mining** as ICP-adjacent context, not direct evidence for this idea.

---

## Solution directions

| Option | Summary | Trade-offs |
|--------|---------|------------|
| **A — Dedicated “external community” tenant or app** | Separate auth, roles, moderation, and data retention from the employee app; optional white-label per client. | **Pros:** Clean compliance story, clear buyer (Corp Affairs vs HR). **Cons:** New build, GTM, and support surface. |
| **B — Module inside existing tenant** | External users as a new **principal type** with limited apps/surfaces (read-first feed, forms, optional chat). | **Pros:** Single vendor relationship, shared branding ([`06-Resources/PRDs/Current/Theming.md`](../PRDs/Current/Theming.md)). **Cons:** Engineering complexity; risk of **scope bleed** into internal Groups/Feed. |
| **C — Orchestration layer, not a net-new social network** | Publish **jobs/CSR updates** via **integrations** (ATS, careers page, SMS/WhatsApp templates) with **governance** and analytics; minimal new UX. | **Pros:** Faster, fits **WhatsApp-first** markets. **Cons:** Weaker “community” story; less lock-in. |

**Recommendation (discovery-level):** Treat **external community** as a **separate problem** from internal feed/groups/chat until **one** anchor buyer proves willingness to fund (Corp Affairs / SLP vs HR). Prefer **proving value** with **C → B** (thin integrations + one governed surface) before **A**.

---

## Novel ideas

- **Jobs + social licence in one narrative stream:** Pair **local hiring posts** with **transparent project updates** so communities see **economic benefit** alongside risk communication—differentiated from generic EX “community” features.  
- **Site-scoped “public rooms” with legal review queues:** For mining, tie **geofenced or site-registered** access to **pre-approved** outbound content and **async** Q&A (reduces real-time moderation load).  
- **Bridge to employee advocacy:** Approved **employee shares** to external community (with policy)—connects **Theming/brand** ([`06-Resources/PRDs/Current/Theming.md`](../PRDs/Current/Theming.md)) to **reputation** without opening full social graph.

---

## Risks and assumptions

- **Assumption:** Buyers will pay for **governed external engagement** separately from **internal** deskless comms; not validated in vault (no account notes here).  
- **Risk:** **Product-scope confusion** with **Employee Chat**, **Feed social layer**, and **WhatsApp**—each already has a distinct story in PRDs ([`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md), [`06-Resources/PRDs/Future/Feed_Social_Layer.md`](../PRDs/Future/Feed_Social_Layer.md), [`06-Resources/PRDs/Current/WhatsApp_Channel.md`](../PRDs/Current/WhatsApp_Channel.md)).  
- **Risk:** **Privacy / POPIA** and **identity** for non-employees; retention and monitoring expectations may exceed internal employee comms assumptions.  
- **Risk:** **Competitive overlap** with EX “community” players ([`06-Resources/Competitors/profiles/Workvivo.md`](../Competitors/profiles/Workvivo.md)) without a crisp **regulated / frontline** wedge.

---

## Open questions

- Who is the **economic buyer**—Community Relations, HR, Marketing, or Site GM—and what **budget line** funds it?  
- **Identity model:** phone-only, verified address, ID, or partner NGO onboarding?  
- **Two-way scope:** broadcast-only vs moderated comments vs full chat; how does this relate to **WhatsApp** roadmap ([`06-Resources/PRDs/Current/WhatsApp_Channel.md`](../PRDs/Current/WhatsApp_Channel.md))?  
- **Multi-tenant isolation:** can one mining house run **separate** community spaces per **mine** or **region** under one contract?  
- **Evidence plan:** which **customer conversations** or **pilot sites** will validate jobs + CSR + crisis comms together?
