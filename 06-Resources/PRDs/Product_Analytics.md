---
prd_id: product-analytics
lifecycle: spec_ready
created_date: 2026-03-30
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Lock event schema at Essential GA (instrumentation before UI)
  - Build vs buy decision (OQ-01)
---

# Product Analytics

**Status:** Spec-ready stub — agent-oriented retrofit  
**Target:** Tenant admins (self-serve engagement) and Wyzetalk internal (benchmarks, feature adoption)  
**Estimated Effort:** Large — schema + pipeline + UI phasing

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.

**Phase:** Next (post-Essential GA). **Priority: #5** in post-GA sequence (confirmed 2026-03-30).

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

> **Key decision (2026-03-30):** Instrument events **at GA**, reporting UI phase 2. The event schema must be designed now — do not wait for the analytics UI to be prioritised. Retrofitting instrumentation after GA is significantly more expensive than building it in from the start.

**Related PRDs (Phase 1):**
- [Tenant_Management.md](./Tenant_Management.md) — tenant context for analytics segmentation
- [Feed.md](./Feed.md) — feed engagement events (views, dwell time, reactions)
- [Posts.md](./Posts.md) — post-level metrics (views, reactions, click-throughs per content type)
- [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) — message delivery and read receipts
- [communication_service.md](./communication_service.md) — channel delivery rates (push, SMS, WhatsApp)
- [Profile_Users.md](./Profile_Users.md) — user segments for cohort analytics
- [Login_Account_Activation.md](./Login_Account_Activation.md) — activation funnel and session data

---

## The Job to Be Done

**Tenant admins** can see how employees use the platform (activation, engagement, delivery), and **Wyzetalk** can prioritise product using cross-tenant usage data — with **POPIA/GDPR-safe** pseudonymisation.

**User value:** Evidence for QBRs, renewal, and internal roadmap; closes gap vs “data in logs only.”

---

## Work Packages

### WP-1: Event schema & contract (P0)

**Priority:** P0  
**Dependencies:** Cross-PRD alignment with Feed, Posts, Messaging, Login  
**Files:** `event-catalog.md` TBD; SDK contracts TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Versioned event names + required props | Published schema |
| 1b | No raw PII in event payloads | Privacy review |

### WP-2: Ingestion pipeline (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Backend TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 2a | Tenant isolation | Row-level security tests |
| 2b | Retention policy | Config per Legal (OQ-05) |

### WP-3: Tenant admin dashboard (P1)

**Priority:** P1  
**Dependencies:** WP-2  
**Files:** Admin UI TBD  
**VPS-eligible:** No

### WP-4: Wyzetalk internal benchmarks (P1)

**Priority:** P1  
**Dependencies:** WP-2  
**Files:** Internal BI TBD  
**VPS-eligible:** Yes

**Dependency graph:**

```text
WP-1 ──> WP-2 ──> WP-3
              └──> WP-4
```

---

## Success Scenarios

### Scenario 1: Activation funnel visible

**Setup:** Tenant has invites + activations.  
**Action:** Admin opens analytics.  
**Observable Outcome:** Invited → activated → first login funnel displayed for **that tenant only**.  
**Success Criteria:** UAT with test tenant; numbers match source tables within tolerance.

### Scenario 2: SMS delivery partial data

**Setup:** Carrier returns inconsistent receipts (OQ-04).  
**Action:** Display delivery stats.  
**Observable Outcome:** UI does not over-claim; “partial data” state documented.  
**Success Criteria:** Product + Engineering sign-off.

---

## Satisfaction Metric

**Overall Success:** Event loss rate **< 0.1%** in staging soak (TBD measurement window).

**Measured by:** Pipeline monitoring.

---

## Metrics Strategy

### Events to Track (design now; `analytics_tool: none` in vault until tool chosen)

Per legacy scope: activation funnel, DAU/MAU, content engagement, message delivery, channel mix, group engagement, feed dwell, cross-tenant benchmarks, feature adoption, onboarding velocity. **Exact names** in event catalog — not invented here.

### Success Targets

- Schema approved **before** Essential GA instrumentation.  
- Tenant admin tier decision (OQ-03): base vs premium.

### Business Outcome Mapping

Sales/CS **proof points** for QBRs; internal prioritisation by usage.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **POPIA/GDPR:** pseudonymised user IDs; tenant isolation.  
- **Instrument at GA** even if UI ships later.  
- **Build vs buy** (PostHog / Mixpanel / Amplitude / internal) — decision in discovery — not assumed here.

---

## Technical Blueprint

### System Integration Map

```text
Clients --> SDK_TBD --> ingest --> store --> dashboards
```

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Event SDK (mobile/web) | TBD |
| Ingest API | TBD |
| Warehouse | TBD |

---

## Validation Protocol

```bash
grep -c "POPIA" "06-Resources/PRDs/Product_Analytics.md"
# PASS: >= 1

grep -c "Tenant_Management" "06-Resources/PRDs/Product_Analytics.md"
# PASS: >= 1
```

**Manual:** Privacy review; benchmark accuracy sampling.

### Post-launch metrics

Adoption of analytics UI; event volume — production only.

---

## Success Rate Target

**2 of 2** static checks on doc commit.

---

## Notes for Agent Implementation

**Scout priorities:** OQ-01 build vs buy; SA data residency.  
**Worker tasks:** Event catalog RACI with Feed/Posts/Messaging owners.

---

## Files to Create

```
# TBD
docs/analytics/event-catalog-v1.md
```

## Files to Modify

```
# TBD — each client surface for SDK emit
```

---

## Out of Scope

- Full **AI-generated insights** (stretch Phase 2.1).  
- Resolving board priority reorder (2026-04-13) — steerco outside this file.

---

## Detailed product context (legacy)

## Problem hypothesis

[[Wyzetalk]] Essential ships without a native product analytics layer — usage data exists in logs and backend tables but is not surfaced to tenant admins or the Wyzetalk product team in a way that drives decisions. This creates three gaps:

1. **Tenant admins can't measure adoption** — They don't know whether employees are opening the app, reading posts, completing onboarding, or engaging with specific channels. Without this, they can't justify the platform to their own stakeholders or know when to escalate low-adoption issues.

2. **Wyzetalk product can't prioritise by usage** — Feature decisions rely on anecdote and deal pressure rather than data on what's actually used across the tenant base. This slows the feedback loop and increases the risk of building for the wrong use cases.

3. **Sales and CS have no proof points** — QBRs and renewals require "the platform is working" evidence. Engagement benchmarks, activation rates, and message delivery stats are the currency of that conversation.

## Scope indicators (to be confirmed in discovery)

**Tenant Admin Dashboard (self-serve):**
- **Activation funnel** — Users invited → activated → first login → 7-day retained
- **DAU / MAU** — Daily and monthly active users per tenant; trend over time
- **Content engagement** — Per-post: views, reactions, click-throughs; by content type (Text, Image, PDF, Video, Form Link)
- **Message delivery** — Per message: sent, delivered, read (where channel supports it); by channel (push, SMS, WhatsApp)
- **Channel mix** — Which delivery channels employees are actually reached on; opt-in rates per channel
- **Group engagement** — Which groups are most/least active; useful for targeted re-engagement
- **Feed dwell time** — Time spent in feed per session (proxy for content quality)

**Wyzetalk Internal / Platform-level:**
- **Cross-tenant benchmarks** — Anonymised activation rate, DAU/MAU, message delivery by industry vertical
- **Feature adoption** — Which features are live and used per tenant (e.g. % tenants using WhatsApp channel, PDF posts, elevated auth)
- **Onboarding velocity** — Time from tenant creation to first published post; first message sent
- **Support signal** — Correlate low-engagement tenants with support ticket volume (churn risk indicator)

**Stretch / Phase 2.1:**
- **Cohort analysis** — Activation and retention by user import batch / department / group
- **A/B content performance** — Compare engagement across post types or send times
- **AI-generated content insights** — "Posts with images get 2× more reactions in your tenant"

## Data model considerations

- All events must be POPIA/GDPR compliant: no raw PII in analytics tables; user IDs hashed or pseudonymised
- Tenant admins see only their own tenant data — strict row-level isolation
- Event schema should be designed at Essential GA (even if analytics UI ships in Next) to avoid retrofitting instrumentation
- Consider whether to use an internal event store or integrate with a third-party analytics platform (Mixpanel, PostHog, Amplitude — evaluation TBD)

## Open questions (pre-discovery)

| # | Question | Owner |
|---|----------|-------|
| OQ-01 | Build vs buy: internal analytics pipeline vs PostHog / Mixpanel / Amplitude? Cost, data residency (SA), POPIA implications? | Engineering + Legal |
| OQ-02 | What events need to be instrumented in Phase 1 (Essential) to support this? Instrument early even if UI ships later. | Engineering + Product |
| OQ-03 | Tenant admin access tier: is analytics a feature of the base tenant admin role, or a premium add-on (upsell opportunity)? | Shaun + Sales |
| OQ-04 | SMS delivery receipts: carriers return delivery status inconsistently. How do we handle partial data without misleading admins? | Engineering |
| OQ-05 | Data retention policy for analytics events: 90 days? 12 months? Per POPIA guidance? | Legal |
| OQ-06 | Should Wyzetalk internal platform analytics be a separate surface from tenant admin analytics, or unified with role-based visibility? | Product |

---

## Acceptance criteria (BDD)

*To be added when promoting toward full binding spec.*

---

*Promote to full PRD when discovery is scheduled. **Instrument Phase 1 events at GA — analytics UI can wait, but the event schema cannot.** See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17*
