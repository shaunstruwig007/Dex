---
prd_id: notifications
lifecycle: done
created_date: 2026-04-17
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Drawer retention policy (Open Questions)
---

# Notifications

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** End users receiving timely in-app, push, and email notifications with severity and actions  
**Estimated Effort:** Ongoing; drawer/toast polish

---

> Lighter spec derived from the Notifications discovery document. Covers in-app notification types, external channels, severity levels, and action buttons.

**Related PRDs:** [communication_service.md](./communication_service.md) (actual SMS/email/push delivery), [Profile_Users.md](./Profile_Users.md) (user toggles), [Posts.md](./Posts.md) (“notify on publish”), [Groups.md](./Groups.md) (ownership request flows). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Users see **actionable, well-prioritised notifications** (toast, dialogue, drawer, push, email mirror) so they do not miss requests, posts, or admin failures — within preference and severity rules.

**User value:** Drives feed engagement and group ownership workflows; pairs with [communication_service.md](./communication_service.md) for delivery.

---

## Work Packages

### WP-UI: In-app surfaces (P0)

**Priority:** P0  
**Dependencies:** None  
**Files:** Client UI TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| U1 | Toast, dialogue, drawer | BDD NTF-01–03 |
| U2 | Request accept/decline | BDD NTF-04 |

### WP-External: Push + email mirror (P0)

**Priority:** P0  
**Dependencies:** [communication_service.md](./communication_service.md)  
**Files:** Client + comms TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| E1 | Push + email mirror | BDD NTF-05–06 |

### WP-Severity: High/Medium/Low (P0)

**Priority:** P0  
**Dependencies:** WP-UI  
**Files:** Client TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| S1 | Severity triage | BDD NTF-07 |

### WP-Flows: Posts + Groups (P0)

**Priority:** P0  
**Dependencies:** [Posts.md](./Posts.md), [Groups.md](./Groups.md), [Feed.md](./Feed.md) NT-*  
**Files:** Product logic TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| F1 | New post notify | BDD NTF-08 |
| F2 | Ownership request | BDD NTF-09 |

**Dependency graph:**

```text
WP-UI ──> WP-Severity
WP-External (parallel)
WP-Flows (parallel)
```

---

## Success Scenarios

- **New post:** Matches Feed AC NT-01/NT-02 with prefs.  
- **Ownership request:** Accept/decline from drawer.  
- **Admin error:** Surfaces in drawer per PRD.

---

## Satisfaction Metric

**Overall Success:** **>40%** interaction rate; **<4h** median time to action on request notifications (legacy Success Metrics).

**Measured by:** Analytics when available; interim via sampling.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Future: notification IDs in [Product_Analytics.md](./Product_Analytics.md).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **NTF-** prefix distinct from Feed **NT-** (legacy note).  
- **Per-type toggles** out Phase 1 (simple email/push on/off).

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Notification service | TBD |
| Client drawer | TBD |

---

## Validation Protocol

```bash
grep -c "NTF-01" "06-Resources/PRDs/Notifications.md"
# PASS: >= 1

grep -c "communication_service" "06-Resources/PRDs/Notifications.md"
# PASS: >= 1
```

**Manual:** UX review toast/drawer behaviour.

---

## Notes for Agent Implementation

**Soldier review:** Critical bypass prefs (Outstanding section).

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- **Notification history** Phase 1.  
- **Digest/batching** future.

---

# Problem Statement

Users need to be informed about actions, updates, and requests in a timely and consistent way. Without standardised notification types, delivery channels, and severity levels, important alerts get missed, users can't act on request-based workflows (e.g. group ownership requests), and the app feels unresponsive.

---

# Goals

1. **Ensure timely awareness** — Users see relevant notifications immediately via the most appropriate channel.
2. **Enable in-notification actions** — Users can respond to requests (accept/decline) directly from notifications.
3. **Support multiple delivery channels** — In-app (toast, dialogue, drawer), push notification, and email.
4. **Prioritise by severity** — High, medium, and low severity levels help users triage.

---

# Non-Goals

- **Per-notification-type preference toggles** — Phase 1 is simple on/off for email and push.
- **Notification history / log** — Future consideration.
- **Custom notification sounds** — Out of scope.
- **Notification batching / digest mode** — Future consideration.

---

# User Stories

- As an **employee**, I want to see a notification when a new post is published to my group so that I don't miss important content.
- As an **admin**, I want to receive a notification when someone requests ownership of my group so that I can accept or decline.
- As an **admin**, I want to see error notifications in my notification drawer so that I know when something I triggered has failed.
- As an **employee**, I want push notifications on my phone so that I'm aware of updates even when I'm not in the app.

---

# Requirements

## Must-Have (P0)

### In-App Notification Types

- **Toast:** Quick inline alert for brief action/info feedback. Supports action buttons.
- **Dialogue:** Modal pop-up requiring user to close before continuing. Supports action buttons.
- **Notification Drawer:** Located in top nav alongside search and profile. Icon shows new/unread count. Supports action buttons (e.g. accept/decline).

### External Channels

- **Push notifications:** Delivered to app. Errors (admin-triggered) placed in drawer.
- **Email notifications:** Mirrors in-app notifications based on user preference.

### Severity Levels

- Three levels: High, Medium, Low.

### Action Button Types

- **Support:** redirects to Support flow.
- **Hook:** triggers a backend event.
- **Redirect:** navigates to another page/section.
- **Request:** accept/decline response.

## Nice-to-Have (P1)

- Notification history view (past 30 days).
- Per-notification-type toggle in preferences.
- Notification badge on app icon.

---

# Success Metrics

**Leading:**

- Notification interaction rate (% of notifications opened/acted on) (target: >40%)
- Time from notification to action (for request-type notifications) (target: <4 hours median)
**Lagging:**
- Reduction in missed actions or stale requests (qualitative)
- User satisfaction with notification relevance (survey)

---

# Open Questions

- **[Engineering]** What is the notification delivery stack — FCM for push, SES/SendGrid for email?
- **[Product]** How long do notifications persist in the drawer before auto-clearing?
- **[Design]** Should toast notifications auto-dismiss after X seconds or require manual close?
- **[Product]** Should critical notifications (e.g. forced ownership change) bypass user preference toggles?

---

## Acceptance criteria (BDD)

**Source PRD:** [Notifications.md](./Notifications.md)  
**Related:** [communication_service.md](./communication_service.md) + [communication_service.md](./communication_service.md#acceptance-criteria-bdd) (delivery), [Profile_Users.md](./Profile_Users.md) (toggles), [Posts.md](./Posts.md) (notify on publish), [Groups.md](./Groups.md) (ownership request flows).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §4.2  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **In:** Toast, dialogue, **notification drawer** (badge count), push, email mirror, severity (High/Medium/Low), action types: Support, Hook, Redirect, Request (accept/decline).  
- **Out Phase 1:** Per-type toggles, history log, custom sounds, batching/digest.

**Note:** [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) uses **NT-01/NT-02** for **new business post** alerts — keep naming distinct: this file uses **NTF-** prefix.

---

## Acceptance criteria — In-app surfaces

| ID | Criterion |
|----|-----------|
| NTF-01 | **Given** brief feedback needed **when** action completes **then** **toast** can show with optional action buttons. |
| NTF-02 | **Given** blocking confirmation needed **when** event fires **then** **dialogue** requires dismiss before continuing; supports actions. |
| NTF-03 | **Given** user opens app **when** they use top nav **then** **notification drawer** is available beside search/profile with **unread/new count** on icon. |
| NTF-04 | **Given** drawer item **when** it supports **Request** **then** user can **accept/decline** from drawer. |

---

## Acceptance criteria — External channels

| ID | Criterion |
|----|-----------|
| NTF-05 | **Given** push enabled **when** notification generated **then** push delivers to device per [communication_service.md](./communication_service.md#acceptance-criteria-bdd). |
| NTF-06 | **Given** email mirror enabled in profile **when** in-app notification created **then** email sent per Communication rules. |

---

## Acceptance criteria — Severity

| ID | Criterion |
|----|-----------|
| NTF-07 | **Given** notification created **when** classified **then** it carries **High / Medium / Low** and UI respects triage *(define visual/ordering in design)*. |

---

## Acceptance criteria — Product flows

| ID | Criterion |
|----|-----------|
| NTF-08 | **Given** new post published with notify toggle **when** user in audience **then** behaviour matches **Feed AC NT-01/NT-02** (preference respected). |
| NTF-09 | **Given** group ownership request **when** sent **then** owner receives actionable notification per Groups PRD. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Preference** | User turned off push/email | No external delivery; define in-app-only for critical — **cross-PRD**. |
| **Stale** | User taps deep link to removed content | Graceful message (align Feed AC). |
| **Admin errors** | Admin-triggered failure | Lands in drawer per PRD. |

---

## Outstanding

- Drawer retention / auto-clear policy.  
- Toast auto-dismiss vs manual.  
- **Critical** notifications bypassing prefs (forced ownership change, etc.).

---

*Align severity and “critical bypass” with Tenant/User Management flows.*
