# Notifications

---

> Lighter spec derived from the Notifications discovery document. Covers in-app notification types, external channels, severity levels, and action buttons.

**Related PRDs:** [Communication.md](./Communication.md) (actual SMS/email/push delivery), [Profile_Users.md](./Profile_Users.md) (user toggles), [Posts.md](./Posts.md) (“notify on publish”), [Groups.md](./Groups.md) (ownership request flows). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

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

