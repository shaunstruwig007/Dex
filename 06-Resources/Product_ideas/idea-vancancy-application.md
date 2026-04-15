---
id: idea-vancancy-application
title: Vacancy application
dex_dashboard_preserve: false
---

# Vacancy application — discovery

Structured pass **2026-04-15**. **Semantic search:** `node .scripts/semantic-search/check-availability.cjs --quiet` returned **exit 1** (QMD unavailable); evidence used **grep** and targeted reads across `06-Resources/PRDs`, `06-Resources/Market_intelligence`, and `06-Resources/Product_ideas`. **Accounts:** `05-Areas/Relationships/Key_Accounts` not present in this workspace clone. **Meetings:** no hits under `00-Inbox/Meetings/` for vacancies / notice-board hiring.

---

## Problem formulation

- **Who has the problem, when, and what is broken today**  
  - **Frontline workers** often miss **internal or local vacancies** because openings are communicated through **physical notice boards, flyers, or informal channels** that are easy to miss, weather-damaged, or unevenly distributed—mirroring the intake brief (“pasted on a flyer… wind blows it away”).  
  - **HR / comms admins** need a **governed, repeatable** way to publish openings to the **same audience** they already reach for business news, instead of parallel paper or shadow channels.  
  - **Broken today (vault framing):** The product’s **feed** is explicitly positioned against **“noticeboard clutter”** and scattered channels for frontline workers ([`06-Resources/PRDs/Current/Feed.md`](../../PRDs/Current/Feed.md) — Problem Statement). Replacing **paper** notice boards with **digital posts** is directionally aligned, but **“apply”** and **pipeline** semantics are **not** specified as first-class in current **Posts** / **Feed** specs (admin-only posts; reactions not comments—[`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md), [`06-Resources/PRDs/Current/Feed.md`](../../PRDs/Current/Feed.md)).

- **Success looks like…**  
  - **Intake:** Clients can **create vacancy posts** (admin-authored), workers **see** them in-app (and/or via agreed channels), and a **high share of active users** sees each opening—**~80% reach** per the board brief.  
  - **Product:** Measurable **impressions / unique viewers / apply starts / completes** per vacancy (would extend beyond **click-through** on **External Form Link** in [`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md)); governance (who can post jobs, retention, fairness) TBD.

---

## Evidence from the vault

- **Notice boards as a deal-relevant frontline theme:** HubSpot loss-theme analysis calls out recurring buyer language on **payslips, USSD, data-light, notice boards**—aligned with **deskless** positioning and roadmap relevance ([`06-Resources/Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md`](../../Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md) — §6).  
- **Feed replaces scattered / physical clutter:** Problem statement: without a structured feed, information gets lost in email, SMS, or **“noticeboard clutter”**—**frontline**-specific ([`06-Resources/PRDs/Current/Feed.md`](../../PRDs/Current/Feed.md)).  
- **Posts = admin-authored distribution; group targeting:** Every post requires an **assigned group** before publish; Phase 1 is **admin-only** business content (**no** social / user-generated posts) ([`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md) — Goals, Non-Goals, Requirements). Vacancy posts fit **admin → audience**; **“standard user creates vacancy”** does **not** match Phase 1 Posts model without scope change.  
- **Phase 2 — link out to apply (bridge):** **External Form Link** post type: **Form ID**, custom label, opens **in device browser**, **no** native in-app form rendering in that phase; metric example: **external form link click-through rate** ([`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md)). Strong **MVP** pattern: **post + link/form** for applications until native apply exists.  
- **Forms initiative (adjacent):** Discovery file [`prd-forms_authoring.md`](./prd-forms_authoring.md) ties **Forms** to **Posts**, **Page Builder**, **WhatsApp** future, and **privacy/routing/reporting**—relevant if **application** = structured capture vs plain email.  
- **Internal mobility / jobs as strategic adjacency (market):** Signal brief: platforms embedded in **daily frontline comms** could become the channel for **internal mobility and shift offers** — **“internal talent marketplace adjacency”** ([`06-Resources/Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md`](../../Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md) — Novel outcomes). Vacancy posts are a **lightweight** step toward that narrative.  
- **HR sub-category already exists for posts:** Posts allow sub-categories including **HR** ([`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md) — Categories). Could standardise **job posting** as HR + tags (e.g. location, site).  
- **Notifications on publish:** Posts support **“Notify all users when publishing post”** (group-scoped distribution + optional notify) ([`06-Resources/PRDs/Current/Posts.md`](../../PRDs/Current/Posts.md)) — relevant to **reach** goals; **80% of all users** still needs a **definition** (MAU? group members? time window).  
- **Roadmap context:** Board stack mentions **Forms** among post–Essential priorities ([`06-Resources/PRDs/Next/README.md`](../../PRDs/Next/README.md)); vacancy apply flows should **align** with Forms sequencing rather than inventing a parallel ATS.

---

## Solution directions

| Option | Summary | Trade-offs |
|--------|---------|------------|
| **A — Posts + HR category + external apply link** | Admin publishes **Link** or **Phase 2 External Form Link** post; application happens in **browser** (or third-party ATS) per current Posts spec. | **Fastest** to MVP; **limited** in-app analytics; **fragmented** applicant experience; **compliance** depends on external tool. |
| **B — Native “Vacancy” content type** | Dedicated template: title, location, closing date, **Apply in-app** CTA, optional PDF JD; submissions stored **in platform** (ties to **Forms** roadmap). | **Better** UX and reporting; **larger** build; overlaps **Forms_Authoring** and **Product Analytics** dependencies. |
| **C — Feed + Explorer page** | Short post in feed → **Page Builder** landing with role detail + apply ([`06-Resources/PRDs/Next/Page_Builder.md`](../../PRDs/Next/Page_Builder.md) — form/widget intent in stubs). | Richer **storytelling**; **two-step** UX; depends on **Explorer / Page Builder** maturity. |

- **Recommendation:** **Start with A** to validate **reach and admin workflow** (replace flyer/notice board **distribution**); **plan B** once **Forms** native authoring + in-app completion is sequenced ([`prd-forms_authoring.md`](./prd-forms_authoring.md)). Use **HR** sub-category + tags for findability; define **KPIs** (feed impressions, link clicks, apply completes) so **80% reach** is measurable.

---

## Novel ideas

- **Closed-loop “paper killer” metric:** Track **repeat views** and **shares** (if ever allowed) per site/shift—proving digital beats **flyer** reach for **non-desk** populations.  
- **Shift / internal mobility bridge:** Pair vacancy posts with **shift-offer** or **internal transfer** patterns mentioned in market intel ([`06-Resources/Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md`](../../Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md))—same feed, different template.  
- **WhatsApp notify + apply later:** When **Smart HR / WhatsApp** expands, **vacancy alert** as a **message type** with **deep link** back to post/form ([`06-Resources/PRDs/Current/WhatsApp_Channel.md`](../../PRDs/Current/WhatsApp_Channel.md) — future forms/surveys line in Forms discovery).  
- **Fairness / POPIA:** Position **structured, auditable** internal job visibility as **compliance-positive** vs informal notice boards (echoes **AI hiring** risk discussion vs **comms** in [`06-Resources/Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md`](../../Market_intelligence/synthesis/daily/2026-03-23_signal_brief.md)).

---

## Risks and assumptions

- **Assumption:** Vacancies are **internal comms** (employees) not **external community** hiring—scope differs from **community app** style ideas ([`06-Resources/Product_ideas/idea-community-app.md`](./idea-community-app.md)).  
- **Risk:** **ATS / HRIS** ownership—clients may require **integration** with Workday/SAP/etc.; link-out MVP may be **necessary** politically even if native apply is desired.  
- **Risk:** **Discrimination / fairness** — who sees which vacancies (group membership) must align with **labour** and **company policy**; **Groups** targeting errors could **exclude** protected groups.  
- **Risk:** **80% reach** may conflict with **group-only** visibility ([`06-Resources/PRDs/Current/Feed.md`](../../PRDs/Current/Feed.md) — visibility = group membership); org design of **groups** (Everyone vs site) becomes critical.  
- **Risk:** **Comment threads** for Q&A are **not** Phase 1 feed scope—vacancy **Q&A** may need **DM to HR**, **Forms**, or **future** social layer ([`06-Resources/PRDs/Future/Feed_Social_Layer.md`](../../PRDs/Future/Feed_Social_Layer.md) — if referenced).

---

## Open questions

- **Audience:** Site-specific groups vs **“Everyone”** for all internal vacancies—what do clients want? ([`06-Resources/PRDs/Current/Groups.md`](../../PRDs/Current/Groups.md))  
- **Apply flow:** **Browser form** (Posts Phase 2) vs **native Forms** vs **external ATS** only—what is the **minimum** submission data (CV upload, ID, internal employee number)?  
- **Reach metric:** Is **80%** of **MAU**, **all licensed users**, or **target population** (e.g. one site)—and over what **time window** (7 days from publish)?  
- **Permissions:** Which **admin roles** may publish vacancies—same as comms posts or **HR-only** role?  
- **Multi-language / offline:** Required for **frontline** ICPs ([`06-Resources/Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md`](../../Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md))?  
- **Integration with peer chat:** Do applicants **coordinate** with hiring managers via **future** employee chat ([`06-Resources/Product_ideas/prd-employee_chat_and_groups.md`](./prd-employee_chat_and_groups.md)), or keep **apply** separate to reduce bias/harassment risk?
