---
# Product idea workspace (dashboard)
dex_dashboard_preserve: false
id: prd-product_analytics
# prdTier: Next — prioritise with Next (P2)
# summary: "Event schema at GA; tenant + internal dashboards phased; prove adoption, delivery, engagement."
---

# Product Analytics

PRD in `06-Resources/PRDs/Next/` — prioritise with Next (P2).

## PRD

- [PRD](06-Resources/PRDs/Next/Product_Analytics.md)

## Design

- Figma: *(add link in dashboard detail or here)*

## Orchestration

Move lanes in the dashboard; export JSON when stable.

---

## Problem formulation

- **Who has the problem, when, and what is broken today**
  - **Tenant admins** need proof the platform is adopted and communications land — ongoing (QBRs, internal justification, escalation when adoption is low). Today, per `06-Resources/PRDs/Next/Product_Analytics.md`, usage sits in logs/backend tables and is **not** surfaced as decision-ready analytics.
  - **Wyzetalk product/engineering** need a feedback loop after Essential GA — **when** prioritising roadmap and **when** validating hypotheses. The stub PRD states decisions still lean on anecdote and deal pressure without cross-tenant usage truth.
  - **Sales and CS** need renewal/QBR evidence — **at** renewal cycles and executive reviews. Engagement benchmarks, activation, and delivery stats are described as the “currency” of that conversation in the same PRD.
- **Success looks like…**
  - A **single event schema** agreed at GA (instrumentation before UI), with **tenant-isolated** reporting for admins and **role-appropriate** internal views for Product/CS/Sales — aligned with `Product_Analytics.md` and `06-Resources/PRDs/Product_Briefs_Current_and_Next.md`.
  - Ability to report **leading** indicators (short-cycle: activation steps, delivery rates, session/feed behaviours) and **lagging** indicators (outcomes over weeks/months: support reduction, retention proxies, survey-based engagement) drawn from the same events — consistent with how Current PRDs already split Leading/Lagging per feature (e.g. Feed, Posts, Login, Messaging).

## Evidence from the vault

- **North-star problem & scope (stub PRD):** `06-Resources/PRDs/Next/Product_Analytics.md` — three gaps (tenant adoption, internal prioritisation, sales/CS proof); **key decision:** instrument at GA, reporting UI later; POPIA/GDPR constraints; build-vs-buy open; related Current PRDs listed for segmentation and events.
- **Portfolio framing:** `06-Resources/PRDs/Product_Briefs_Current_and_Next.md` — elevator pitch (“event schema at GA”), problem (“no shared truth on adoption, delivery, engagement”), audiences (tenant admins, PM/CS, sales QBRs), MVP signal (instrumentation + funnel + DAU/MAU + content metrics defined), dependencies (Feed, Posts, Messaging, Communication, Login, Tenant, Profile).
- **Sequencing / steering:** `06-Resources/PRDs/Next/README.md` — April 2026 board stack **does not** include product analytics in the numbered dev phase; Product Analytics + Scheduled Content called out as **backlog** for this phase (steerco messaging). Use this when setting expectations on **when** UI lands vs **when** events must exist.
- **Cross-PRD success metrics already define leading vs lagging (instrumentation targets per surface):**
  - **Feed:** leading — active feed viewers %, search/filter usage, reaction rate; lagging — engagement score (survey), missed communications (qualitative) — `06-Resources/PRDs/Current/Feed.md`
  - **Posts:** leading — posts/tenant/week, targeting vs Everyone, draft→published, Phase 2 PDF/video/form link adoption; lagging — feed engagement rate, admin satisfaction, support tickets — `06-Resources/PRDs/Current/Posts.md` (also Phase 2 link/CTA analytics alignment).
  - **Login & activation:** leading — activation success, QR completion, Find My Account resolution, OTP delivery; lagging — support ticket reduction, onboarding completion within 30 days, session retention — `06-Resources/PRDs/Current/Login_Account_Activation.md`
  - **Messaging / ops:** user stories for per-message delivery status and spend; leading — acknowledgement rate, operational vs urgent mix; lagging — misuse reduction, cost variance; phasing note: cost reporting + analytics as Phase 1c — `06-Resources/PRDs/Current/Messaging_Ops_Urgent_Alerts.md`
  - **Communication (delivery layer):** leading — SMS/push/email delivery success rates; lagging — “didn’t receive invite/OTP” tickets, push token coverage — `06-Resources/PRDs/Current/Communication.md`
  - **Groups:** P1 “group usage analytics” called out; leading — targeted posts %, saved group reuse, query builder adoption; lagging — broadcast reduction, engagement improvement — `06-Resources/PRDs/Current/Groups.md`
  - **Notifications:** leading — interaction rate, time to action; lagging — missed actions, satisfaction — `06-Resources/PRDs/Current/Notifications.md`
  - **Profile:** leading — self-service profile updates %, profile visits; lagging — support tickets, data accuracy — `06-Resources/PRDs/Current/Profile_Users.md`
  - **Payslip PDF (remote app):** explicit **Analytics** subsection (auth, error, entry, remote→Blue bridge events) and leading/lagging success metrics — `06-Resources/PRDs/Current/Payslip_PDF.md` (shows pattern for **sensitive** flows + telemetry).
- **Future / adjacent PRDs referencing Product Analytics:** `06-Resources/PRDs/Next/Page_Builder.md` (OQ: page views vs post views in analytics), `06-Resources/PRDs/Next/Explorer.md` (OQ: Explorer views/taps feeding analytics), `06-Resources/PRDs/Future/Forms_Authoring.md` (links to Product Analytics).
- **Data lifecycle / compliance hook:** `06-Resources/PRDs/PRD_Cross_cutting_open_questions.md` Q9 — leaver deletion vs **messaging analytics** retention (anonymise vs cascade; align with User_Importer/legal).

**Search notes (this pass):** QMD availability check exited non-zero — discovery used **grep** and targeted reads. **Meetings:** no `00-Inbox/Meetings/*2026-03-30*` file present locally (PRD still cites that session in prose). **Accounts:** `05-Areas/Relationships/Key_Accounts` not present in this vault — no account-level evidence files to cite.

## Solution directions

| Option | Pros | Cons |
|--------|------|------|
| **Internal event store + first-party dashboards** | Full control, data residency narrative, tight tenant isolation | Build cost, pipeline ops, hiring burden |
| **Buy (PostHog / Mixpanel / Amplitude)** | Faster time to charts, cohorts, experiments | Cost, residency, POPIA/DPA review, multi-tenant RBAC complexity |
| **Hybrid: canonical events in-house + export to BI** | Preserves ownership of raw events; flexible reporting | Two systems to govern; integration work |

- **Trade-offs:** The stub PRD already flags **cost, SA residency, POPIA** as evaluation dimensions. **Instrumentation-first** (schema at GA) is the highest-leverage decision regardless of UI timing — matches steering in `Product_Analytics.md` and the brief in `Product_Briefs_Current_and_Next.md`.
- **Recommendation:** Lock a **versioned event dictionary** and **tenant_id** partitioning model early; implement **minimal admin-facing** delivery/activation truth first (overlaps Messaging + Login metrics stories) because those support the strongest **renewal** narrative; defer cohorts and AI insights to stretch scope in `Product_Analytics.md`.

## Novel ideas

- **Single “metrics spine” from PRD Leading/Lagging tables:** Treat existing per-PRD Leading/Lagging bullets as the **first-pass KPI catalogue** — reduces debate about what “good” looks like and ties analytics roadmap directly to specs already in `Current/`.
- **Proof pack for CS:** Auto-assemble a quarterly **tenant health sheet** (activation funnel + delivery success + top content types) from the same events — sales/QBR framing already in the stub PRD.
- **Quality proxy stack:** Combine Feed dwell time + notification interaction rate + message acknowledgement (each has leading metrics in its PRD) as a **composite engagement** hypothesis before investing in survey-based lagging scores.
- **Explorer / Page builder:** Resolve OQs in `Explorer.md` and `Page_Builder.md` early so **navigation** and **static pages** do not become blind spots relative to feed/posts events.

## Risks and assumptions

- **Assumption:** Essential GA will ship **instrumentation** even if board sequencing keeps analytics UI in backlog (`06-Resources/PRDs/Next/README.md` vs instrumentation decision in `Product_Analytics.md`) — misalignment here causes expensive retrofit.
- **Risk:** **SMS/WhatsApp delivery** partial or inconsistent receipts (OQ in `Product_Analytics.md`) — admins may misread dashboards; same theme in `WhatsApp_Channel.md` / Messaging specs.
- **Risk:** **Leaver and deletion** policy (Q9 cross-cutting) collides with retention of historical analytics — legal alignment required before promising long lookback windows.
- **Assumption:** Tenant admins are the primary external consumers; **premium tier** for analytics remains an open question (OQ-03 in stub PRD).

## Open questions

- Build vs buy and **SA data residency** — owner: Engineering + Legal (`Product_Analytics.md` OQ-01).
- **Minimum Phase 1 event list** mapped 1:1 to PRD acceptance criteria and Leading/Lagging rows — owner: Engineering + Product (OQ-02).
- **Analytics as base vs paid add-on** — owner: Product + Sales (OQ-03).
- **Delivery receipt incompleteness** — UX copy and aggregation rules — owner: Engineering (OQ-04).
- **Retention period** for events — owner: Legal (OQ-05).
- **Separate internal vs tenant surfaces** vs unified RBAC — owner: Product (OQ-06).
- **Page Builder / Explorer** event inclusion — `Page_Builder.md`, `Explorer.md` OQs.
- **Remote app → Blue Core** telemetry bridge consistency — called out in `Payslip_PDF.md` open questions; generalises to other remote apps.

## Discovery notes

*(Prior stub replaced by structured discovery 2026-04-14; QMD unavailable — grep/read pass.)*
