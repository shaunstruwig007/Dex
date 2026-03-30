# Content — Scheduled & Recurring Publishing

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.

**Phase:** Next (post-Essential GA). **Priority: #6** in post-GA sequence (confirmed 2026-03-30).

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

> **Key decision (2026-03-30):** Start with the **simplest cron-based approach** for scheduling posts and messages. Do not over-engineer for Phase 1 of this feature — ship a working time-based trigger first, layer sophistication later. Dynamic localisation and multi-layered translations are a future phase (Jan to be involved when ready).

**Scope note:** Scheduled **Posts** and scheduled **operational messaging** (Standard Message from [Messaging_Ops_Urgent_Alerts](../Current/Messaging_Ops_Urgent_Alerts.md)); **Urgent Alerts** stay immediate-only.

**Related PRDs (Essential / Current):**
- [Posts.md](../Current/Posts.md) — content types in scope: Text, Image, Link (Phase 1); PDF, Video, Form Link (Phase 1 Phase 2 flesh)
- [Messaging_Ops_Urgent_Alerts.md](../Current/Messaging_Ops_Urgent_Alerts.md) — Standard Message (operational) scheduling; Urgent Alerts explicitly excluded (emergency-only, no scheduling)
- [Communication.md](../Current/Communication.md) — channel delivery layer (push, SMS, WhatsApp) that scheduled content flows through
- [Feed.md](../Current/Feed.md) — scheduled posts surface in feed at publish time

---

## Problem hypothesis

Phase 1 across Posts and Messaging is publish-now only. Content managers, HR communicators, and operations teams need to prepare content in advance and send it at the right moment — shift change reminders, weekly safety briefings, payroll day announcements, campaign cadences. The absence of scheduling forces real-time publishing that disrupts working hours and creates inconsistent cadences.

There is an existing open question in `Messaging_Ops_Urgent_Alerts.md`: *"Should operational messages support scheduled send (send later)?"* — this PRD answers yes, and extends it to all publishable content types.

---

## Content types in scope

| Type | Source PRD | Phase 1 status | Notes |
|------|-----------|---------------|-------|
| Text post | [Posts.md](../Current/Posts.md) | Live at GA | Core format |
| Image post | [Posts.md](../Current/Posts.md) | Live at GA | PNG, JPG, SVG, GIF; landscape 1080×600 |
| Link post | [Posts.md](../Current/Posts.md) | Live at GA | External URL; opens in device browser |
| PDF post | [Posts.md](../Current/Posts.md) | Phase 1 flesh (Phase 2 of Posts) | Policy docs, safety sheets |
| Video post | [Posts.md](../Current/Posts.md) | Phase 1 flesh (Phase 2 of Posts) | Cloudflare-hosted; training / announcements |
| Form link post | [Posts.md](../Current/Posts.md) | Phase 1 flesh (Phase 2 of Posts) | [[Wyzetalk]] Forms link; custom button label |
| Standard Message (operational) | [Messaging_Ops_Urgent_Alerts.md](../Current/Messaging_Ops_Urgent_Alerts.md) | Live at GA | Multi-channel delivery (push, SMS, WhatsApp) |
| **Urgent Alert** | [Messaging_Ops_Urgent_Alerts.md](../Current/Messaging_Ops_Urgent_Alerts.md) | **Out of scope** | Emergency-only; scheduling contradicts urgency intent |

---

## Scope indicators (to be confirmed in discovery)

- **Schedule for later** — Pick a future date + time when creating any in-scope content type; content publishes automatically at that time
- **Recurring schedule** — Define a cadence (daily, weekly, monthly, custom) for repeating content (e.g. weekly safety brief every Monday 07:00)
- **Scheduler queue / calendar view** — Content managers see all scheduled items in a timeline or calendar; edit or cancel before publish time
- **Timezone handling** — Per-tenant timezone configuration; multi-country tenants need per-group timezone scheduling (e.g. ZA vs DRC vs Panama)
- **Draft → Scheduled → Published lifecycle** — Scheduled state sits between Draft and Published; content can be recalled before publish time
- **Scheduling permissions** — Role-based: who can schedule vs who can only draft and submit for approval
- **Delivery channel scheduling** — Scheduling applies to the full delivery stack (in-app + push + SMS + WhatsApp) not just feed publication
- **Variable substitution (stretch)** — `{{date}}`, `{{group_name}}` in recurring content (e.g. "Week {{week_number}} safety brief")

---

## Open questions (pre-discovery)

- Does scheduling apply to group-targeted content correctly? If a group membership changes between schedule and publish, which roster is used — at schedule time or at publish time?
- Recurring posts: should content be static (same body each cycle) or allow variable substitution?
- Cancel / reschedule UX for items already in the delivery queue (SMS already dispatched?)
- Should scheduled content respect tenant quiet hours configuration, or override it?
- Approval workflow: if content requires approval, does the schedule clock start before or after approval?
- Timezone: is scheduling always in tenant admin's timezone, or configurable per piece of content?

---

*Promote to full PRD when discovery is scheduled. See [Next/README.md](./README.md) for merge instructions.*
