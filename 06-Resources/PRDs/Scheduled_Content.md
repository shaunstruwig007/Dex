---
prd_id: scheduled-content
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
  - Align scheduler cron design with Engineering
  - Define events for Product Analytics when stack exists
---

# Content — Scheduled & Recurring Publishing

**Status:** Spec-ready stub — agent-oriented retrofit  
**Target:** Content managers and ops users preparing posts and operational messages in advance  
**Estimated Effort:** 48–96 hours agent time (post-discovery build)

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.

**Phase:** Next (post-Essential GA). **Priority: #6** in post-GA sequence (confirmed 2026-03-30).

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

> **Key decision (2026-03-30):** Start with the **simplest cron-based approach** for scheduling posts and messages. Do not over-engineer for Phase 1 of this feature — ship a working time-based trigger first, layer sophistication later. Dynamic localisation and multi-layered translations are a future phase (Jan to be involved when ready).

**Scope note:** Scheduled **Posts** and scheduled **operational messaging** (Standard Message from [Messaging_Ops_Urgent_Alerts](./Messaging_Ops_Urgent_Alerts.md)); **Urgent Alerts** stay immediate-only.

**Related PRDs (Essential / Current):**
- [Posts.md](./Posts.md) — content types in scope: Text, Image, Link (Phase 1); PDF, Video, Form Link (Phase 1 Phase 2 flesh)
- [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) — Standard Message (operational) scheduling; Urgent Alerts explicitly excluded (emergency-only, no scheduling)
- [communication_service.md](./communication_service.md) — channel delivery layer (push, SMS, WhatsApp) that scheduled content flows through
- [Feed.md](./Feed.md) — scheduled posts surface in feed at publish time

---

## The Job to Be Done

Authors can **schedule and recur** in-scope posts and operational messages for future delivery so publishing aligns to shifts, campaigns, and quiet hours — without manual send at the exact moment.

**User value:** Reduces operational drag; enables consistent cadence (safety, payroll announcements).

---

## Work Packages

### WP-1: Scheduler core (cron / queue) (P0)

**Priority:** P0  
**Dependencies:** [Posts.md](./Posts.md) publish pipeline; [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) Standard Message path  
**Files:** Backend scheduler service TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Schedule datetime stored with content | DB / API contract |
| 1b | Job fires at time; idempotency | Logs show single publish |

### WP-2: Authoring UX — schedule & recurring rules (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Admin UI TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 2a | User picks future publish time | UI acceptance |
| 2b | Recurrence rules (daily/weekly/monthly) MVP | Rule engine tests |

### WP-3: Timezone & policy (P1 — Depends on WP-1)

**Priority:** P1  
**Dependencies:** WP-1; tenant timezone config ([Tenant_Management.md](./Tenant_Management.md))  
**Files:** Policy engine TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 3a | Tenant timezone applied | Unit tests |
| 3b | Quiet hours interaction | Documented rule per Open questions |

### WP-4: Calendar / queue view (P2)

**Priority:** P2  
**Dependencies:** WP-1, WP-2  
**Files:** Admin UI TBD  
**VPS-eligible:** No

**Dependency graph:**

```text
WP-1 ──> WP-2 ──> WP-4
WP-1 ──> WP-3
```

---

## Success Scenarios

### Scenario 1: Post scheduled for later

**Setup:** Draft post with future datetime.  
**Action:** Save as scheduled.  
**Observable Outcome:** At publish time, post appears in [Feed.md](./Feed.md) per targeting.  
**Success Criteria:** UAT passes for one post type (Text).

### Scenario 2: Standard Message scheduled — Urgent excluded

**Setup:** Operational message.  
**Action:** Schedule send.  
**Observable Outcome:** Delivery at time via [communication_service.md](./communication_service.md).  
**Success Criteria:** Urgent path cannot be scheduled (guard in UI + API).

### Scenario 3: Group membership change before publish

**Setup:** Open question — roster at schedule vs publish time.  
**Action:** Document decision in spec.  
**Observable Outcome:** Behaviour explicit in BDD.  
**Success Criteria:** Single canonical rule in [PRD_Product_Map.md](./PRD_Product_Map.md) if cross-PRD.

---

## Satisfaction Metric

**Overall Success:** 95% of scheduled jobs in UAT fire within **60s** of target time (configurable SLA TBD).

**Measured by:** Scheduler integration tests + staging soak.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Future: `schedule_created`, `schedule_fired`, `schedule_failed`.

### Business Outcome Mapping

**#6** post-GA priority (2026-03-30 ordering); board stack updates noted in legacy section below may supersede — reconcile in steerco.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Urgent Alerts** are **not** schedulable.  
- **Cron-first** simplicity for Phase 1 (2026-03-30).  
- Full delivery stack (in-app + push + SMS + WhatsApp) in scope for “schedule” meaning end-to-end delivery.

---

## Technical Blueprint

### System Integration Map

```text
Author --> admin_UI --> scheduler_service --> Posts_pipeline | Messaging_pipeline
scheduler_service --> communication_service --> channels
```

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Scheduler | TBD |
| Admin UI | TBD |

### Config & Setup

```yaml
# Illustrative — TBD
scheduler:
  tick_interval_seconds: 60
  timezone_source: tenant_default
```

---

## Validation Protocol

```bash
grep -c "Urgent" "06-Resources/PRDs/Scheduled_Content.md"
# PASS: >= 1 (Urgent excluded from scheduling — doc mentions)

grep -c "Posts.md" "06-Resources/PRDs/Scheduled_Content.md"
# PASS: >= 1
```

**Manual:** E2E schedule → feed visibility.

---

## Success Rate Target

**2 of 2** static checks; staging SLA tests separate.

---

## Notes for Agent Implementation

**Scout priorities:** Approval workflow vs schedule clock; multi-timezone tenants.  
**Worker tasks:** Idempotency keys for fire-once delivery.

---

## Files to Create

```
# TBD
services/scheduler/README.md
```

## Files to Modify

```
# TBD — Posts authoring API, Messaging send path
```

---

## Out of Scope

- Scheduling **Urgent Alerts**.  
- Full variable substitution in recurring bodies (stretch).

---

## Detailed product context (legacy)

## Problem hypothesis

Phase 1 across Posts and Messaging is publish-now only. Content managers, HR communicators, and operations teams need to prepare content in advance and send it at the right moment — shift change reminders, weekly safety briefings, payroll day announcements, campaign cadences. The absence of scheduling forces real-time publishing that disrupts working hours and creates inconsistent cadences.

There is an existing open question in `Messaging_Ops_Urgent_Alerts.md`: *"Should operational messages support scheduled send (send later)?"* — this PRD answers yes, and extends it to all publishable content types.

## Content types in scope

| Type | Source PRD | Phase 1 status | Notes |
|------|-----------|---------------|-------|
| Text post | [Posts.md](./Posts.md) | Live at GA | Core format |
| Image post | [Posts.md](./Posts.md) | Live at GA | PNG, JPG, SVG, GIF; landscape 1080×600 |
| Link post | [Posts.md](./Posts.md) | Live at GA | External URL; opens in device browser |
| PDF post | [Posts.md](./Posts.md) | Phase 1 flesh (Phase 2 of Posts) | Policy docs, safety sheets |
| Video post | [Posts.md](./Posts.md) | Phase 1 flesh (Phase 2 of Posts) | Cloudflare-hosted; training / announcements |
| Form link post | [Posts.md](./Posts.md) | Phase 1 flesh (Phase 2 of Posts) | [[Wyzetalk]] Forms link; custom button label |
| Standard Message (operational) | [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) | Live at GA | Multi-channel delivery (push, SMS, WhatsApp) |
| **Urgent Alert** | [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) | **Out of scope** | Emergency-only; scheduling contradicts urgency intent |

## Scope indicators (to be confirmed in discovery)

- **Schedule for later** — Pick a future date + time when creating any in-scope content type; content publishes automatically at that time
- **Recurring schedule** — Define a cadence (daily, weekly, monthly, custom) for repeating content (e.g. weekly safety brief every Monday 07:00)
- **Scheduler queue / calendar view** — Content managers see all scheduled items in a timeline or calendar; edit or cancel before publish time
- **Timezone handling** — Per-tenant timezone configuration; multi-country tenants need per-group timezone scheduling (e.g. ZA vs DRC vs Panama)
- **Draft → Scheduled → Published lifecycle** — Scheduled state sits between Draft and Published; content can be recalled before publish time
- **Scheduling permissions** — Role-based: who can schedule vs who can only draft and submit for approval
- **Delivery channel scheduling** — Scheduling applies to the full delivery stack (in-app + push + SMS + WhatsApp) not just feed publication
- **Variable substitution (stretch)** — `{{date}}`, `{{group_name}}` in recurring content (e.g. "Week {{week_number}} safety brief")

## Open questions (pre-discovery)

- Does scheduling apply to group-targeted content correctly? If a group membership changes between schedule and publish, which roster is used — at schedule time or at publish time?
- Recurring posts: should content be static (same body each cycle) or allow variable substitution?
- Cancel / reschedule UX for items already in the delivery queue (SMS already dispatched?)
- Should scheduled content respect tenant quiet hours configuration, or override it?
- Approval workflow: if content requires approval, does the schedule clock start before or after approval?
- Timezone: is scheduling always in tenant admin's timezone, or configurable per piece of content?

---

## Priority context (2026-03-30 / 2026-04-13)

The confirmed post-GA priority order from the 2026-03-30 leadership session is:

1. WhatsApp Smart HR — #1
2. AI Assistant (FAQ/HR) — #2
3. Employee Chat — #3
4. Remote App Extensions — #4
5. Product Analytics — #5
6. Scheduled Content — #6

**Update 2026-04-13 (Leon — sales + board):** the **numbered board stack** is now **#1 WhatsApp** → **#2 AI** → **#3 P2P chat** → **#4 Remote App extensions** → **#5 FloatPays** → **#6 Forms**; **Product Analytics** and **Scheduled Content** are **not** in that six for the **current development phase**. See [Next/README.md](./README.md) and [Wyzetalk_Essential_Launch.md](../../../04-Projects/Wyzetalk_Essential_Launch.md).

---

## Acceptance criteria (BDD)

*To be added when promoting toward full binding spec.*

---

*Promote to full PRD when discovery is scheduled. See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17*
