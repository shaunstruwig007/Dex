# Communication

---

> Lighter spec derived from the Communication discovery document. Covers the underlying delivery layer for SMS, email, and push notifications across all platform features.

**Related PRDs:** [Notifications.md](./Notifications.md) (what gets sent / UX), [Login_Account_Activation.md](./Login_Account_Activation.md) (OTP / invites), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (multi-channel urgent + operational), [Profile_Users.md](./Profile_Users.md) (channel preferences), [WhatsApp_Channel.md](./WhatsApp_Channel.md) (**WhatsApp now a registered delivery channel — one-way outbound, tenant-toggled**). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

---

# Problem Statement

The platform needs a reliable, multi-channel communication layer to reach employees via SMS, email, and push notifications. Without it, invitations don't arrive, OTPs fail, and users miss important updates. The system also needs cross-OS push support (Android, Apple, Huawei) and integration with support tooling.

---

# Goals

1. **Ensure reliable message delivery** — Every OTP, invite, and notification reaches the employee via the most appropriate channel.
1. **Support all major platforms** — Push notifications work on Android, Apple, and Huawei.
1. **Respect user preferences** — Communication service honours notification toggles.
1. **Integrate with support workflows** — Connection to JIRA for ticket management.
---

# Non-Goals

- **WhatsApp two-way / conversational messaging** — Outbound-only. Reply handling, chatbots, and smart HR via WhatsApp are Phase 2+. One-way WhatsApp delivery is now **in scope** — see [WhatsApp_Channel.md](./WhatsApp_Channel.md).
- **In-app chat / two-way messaging** — Communication is outbound-only (platform to user).
- **Custom notification templates (per tenant)** — Phase 1 uses standard templates.
- **Delivery scheduling** — Messages send immediately. Scheduled delivery is future scope.
---

# User Stories

- As a **system**, I want to determine the correct delivery channel for each user based on their profile data so that messages reach them reliably.
- As a **new employee**, I want to receive my activation invite via SMS so that I can get started without needing an email.
- As an **employee with email configured**, I want to receive notifications via email in addition to push so that I have multiple ways to stay informed.
- As an **admin**, I want support tickets to be created in JIRA so that the support team can track and resolve issues.
---

# Requirements

## Must-Have (P0)

### SMS

- [ ] Primary channel for initial contact: activation invites, OTP delivery.
- [ ] Send notification to user with download link, username (employee ID), and password.
### Email

- [ ] Used post-activation when user has added email. Supports: verification, password reset, owner invite.
- [ ] Email mirrors in-app notifications based on user preference.
### Push Notifications

- [ ] Support for Android (FCM), Apple (APNs), and Huawei (HMS).
- [ ] In-app notifications displayed in the notification drawer.
- [ ] Admin-triggered errors placed in the notification drawer.
### Channel Selection Logic

- [ ] Communication service determines platform based on user profile data (from Profile service).
- [ ] Respects user notification preferences (email on/off, push on/off, **WhatsApp on/off — opt-in flag per employee, see [WhatsApp_Channel.md](./WhatsApp_Channel.md) §Employee Opt-In**).
### Support Integration

- [ ] JIRA integration for support ticket creation and management.
## Nice-to-Have (P1)

- [ ] 5-star app rating system.
- [ ] Feedback form integration with support tooling.
- [ ] SMS delivery receipt tracking.
## Future Considerations (P2)

- [ ] ~~WhatsApp as a delivery channel~~ — **Delivered. See [WhatsApp_Channel.md](./WhatsApp_Channel.md).**
- [ ] Custom notification templates per tenant.
- [ ] Delivery scheduling (send at optimal time).
---

# Success Metrics

**Leading:**

- SMS delivery success rate (target: >97%)
- Push notification delivery success rate (target: >95%)
- Email delivery success rate (target: >98%)
**Lagging:**

- Reduction in "didn't receive invite/OTP" support tickets (target: -50% within 3 months)
- Cross-platform push coverage (% of users with valid push tokens)
---

# Open Questions

- **[Engineering]** Which SMS provider(s) are being used? Do they support delivery receipts?
- **[Engineering]** Is Huawei HMS push a hard requirement for Phase 1, or can it follow?
- **[Product]** Should the communication service support a priority queue (urgent messages sent first)?
- **[Engineering]** How is JIRA integration implemented — direct API, webhook, or via a middleware?
---

# Timeline Considerations

- **Dependency:** This is a foundational service. Must be in place before Login & Account Activation, Messaging, and Notifications.
- **Suggested phasing:** SMS + Push (Phase 1a) → Email (Phase 1b) → JIRA integration (Phase 1c).
