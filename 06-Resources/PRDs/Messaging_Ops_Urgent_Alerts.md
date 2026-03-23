# Messaging: Ops & Urgent Alerts

---

> Lighter spec derived from the Messaging discovery document. Covers urgent alerts with app takeover, operational messages with channel control, acknowledgement tracking, and cost reporting.

**Related PRDs:** [Groups.md](./Groups.md) (audience: Everyone / saved / directory / new group — same primitives as [Posts](./Posts.md)), [Feed.md](./Feed.md) + [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) (**pinned urgent** on the business feed), [Communication.md](./Communication.md) (channels), [Tenant_Management.md](./Tenant_Management.md) (currency / SMS rates). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

# Problem Statement

Emergency Comms and SMS are used as a catch-all messaging tool because they're the fastest and most reliable way to reach employees. But the platform doesn't differentiate between urgent, critical communications and routine operational messages. This causes message fatigue (reducing effectiveness of true emergencies), higher messaging costs, slower response times during real crises, and customer frustration from misusing urgent channels for day-to-day needs. Harmony (95% of messaging via Wyzetalk, 5–15 messages/day) and mining client interviews confirm strong demand for both targeted operational messaging and a protected emergency channel.

---

# Goals

1. **Protect the emergency channel** — Urgent alerts must be high-trust, high-signal, and impossible to miss via app screen takeover.
1. **Enable fast, targeted operational messaging** — Admins can send SMS-only or notification-only messages to individuals or small groups without alert fatigue.
1. **Reduce misuse of urgent alerts** — Clear separation and guardrails so clients use the right channel for the right message.
1. **Provide delivery and cost visibility** — Admins see estimated cost before sending, delivery status after, and acknowledgement rates for urgent alerts.
1. **Ensure multi-channel reliability** — Urgent alerts go out on all channels; operational messages on admin-selected channels.
---

# Non-Goals

- **WhatsApp as a delivery channel** — Future phase. Phase 1 covers SMS, push, email, and in-app.
- **Two-way messaging / chat** — This is broadcast messaging only. Conversational messaging is a separate initiative.
- **Advanced delivery intelligence (queued send-out time estimates)** — Phase 2.
- **PDF/media attachments on urgent alerts** — Desirable but out of Phase 1 scope.
- **Linking alerts to content pages** — Future phase.
---

# User Stories

**Urgent Alerts:**

- As an **admin**, I want to send an urgent alert that takes over every employee's app screen so that no one can miss a critical safety communication.
- As an **admin**, I want employees to confirm they've seen the alert before they can continue using the app so that I have proof of acknowledgement.
- As an **admin**, I want to resolve an active alert and send a compulsory resolution update so that employees know the situation has changed.
- As an **admin**, I want to see a confirmation modal with recipient count and estimated cost before sending so that I don't accidentally send to the wrong audience.
**Operational Messages:**

- As an **admin**, I want to send an SMS-only message to a single employee so that I can handle operational needs (e.g. "report to HR") without creating feed noise.
- As an **admin**, I want to choose my delivery channel (SMS only, notification only, SMS + notification, email) so that I control how the message reaches employees.
- As an **admin**, I want to send a message to a small group of 3–4 people selected from the directory so that I can target precisely.
**Analytics & Reporting:**

- As an **admin**, I want to see delivery status (sent, delivered, failed, pending) for every message so that I know if my communication reached people.
- As an **admin**, I want to see monthly messaging spend separated by urgent vs operational so that I can manage costs.
**Edge Cases:**

- As an **employee who opens the app during an active alert**, I want to see the takeover screen immediately so that I don't miss the emergency.
- As an **employee**, I want operational messages to never override my silent mode or require acknowledgement so that non-urgent messages don't disrupt me.
---

# Requirements

## Skeleton

### Urgent Alerts

- [ ] Sent on all enabled channels. Channel selection is not optional. Overrides silent mode.
- [ ] **App Screen Takeover:** Full-screen, non-dismissable overlay. User must confirm before continuing. Re-triggered if alert is updated. Shown on app launch if alert is already active.
- [ ] **Pinned Feed:** Pinned at top, expanded by default, collapses on scroll, re-expandable.
- [ ] Required message elements: sender (company name), threat description, location, protective action, timing.
- [ ] Mandatory 160-character SMS version with character limit validation.
- [ ] Admin setup: Title (mandatory), Body (mandatory), Audience (Everyone / Saved group / Directory / New group).
- [ ] Pre-send confirmation modal: warning copy, recipient count, estimated cost.
- [ ] States: Draft → Active → Active (Updated) → Resolved → Resolved (Expired) → Deleted.
- [ ] On resolve: admin must send compulsory resolution update.
### Operational Messages

- [ ] Never labelled as urgent. Never pinned. Never triggers takeover. Never overrides silent mode. Never requires acknowledgement.
- [ ] Audience: Everyone, Saved group, Directory selection, New group. Supports 1:1 and group messaging.
- [ ] Admin selects channel(s): SMS-only, notification-only, SMS + notifications, email.
- [ ] States: Draft → Sent → Deleted → Archived.
### Acknowledgement & Analytics

- [ ] Track for all messages: Sent, Delivered, Failed, Pending, Channels used, Timestamps, Unique recipients.
- [ ] Urgent alerts additionally: end-user confirmation status, admin response time (time to resolve).
### Costing

- [ ] Display estimated cost before send, cost per message, monthly spend.
- [ ] Separate urgent vs standard costs. Separate SMS vs in-app/push.
- [ ] Tenant currency and SMS rate configured at tenant level (admin-only).
## Flesh

- [ ] Light AI validation on urgent alert content to confirm required emergency elements are present.
- [ ] SMS provider delivery feedback surfaced in urgent alert reporting.
- [ ] FCM feedback loop: detect uninstalled apps / expired tokens, suppress from future non-urgent sends.
## Future

- [ ] PDF/media attachments on urgent alerts.
- [ ] Link to content page from an alert.
- [ ] Queued send-out time estimates ("delivery may take ~1–9 minutes").
- [ ] WhatsApp as a delivery channel.
- [ ] Concurrent/linked emergency alerts with timeline view.
---

# Success Metrics

**Leading:**

- Urgent alert acknowledgement rate (target: >95% within 15 minutes)
- Operational message adoption (% of total messages sent as standard vs urgent) (target: >60% standard within 3 months)
- Pre-send confirmation → cancel rate (indicator of accidental sends prevented)
**Lagging:**

- Reduction in non-urgent messages sent as emergency alerts (target: -70% within 6 months)
- SMS cost predictability (actual vs estimated cost variance <10%)
- Fewer cancelled or mis-sent emergency alerts
- Increase in 1:1 and small-group operational message usage
---

# Open Questions

- **[Steerco]** Is estimated cost per alert included in Phase 1, or deferred?
- **[Engineering]** How does app screen takeover work when the user is offline and later opens the app?
- **[Product]** Should operational messages support scheduled send (send later)?
- **[Engineering]** What is the expected delivery time for an urgent alert to 10,000+ users across all channels?
- **[Legal]** Are there regulatory requirements for emergency alert content or delivery in specific countries (e.g. mining safety regulations)?
- **[Product]** Should admins be able to edit a sent operational message, or only delete?
---

# Timeline Considerations

- **Dependency:** Groups system must be built (audience targeting).
- **Dependency:** Communication service (SMS, push, email delivery).
- **Dependency:** Tenant Management (currency + SMS rate config).
- **Suggested phasing:** Urgent alerts with takeover + pinned feed (Phase 1a) → Operational messages with channel control (Phase 1b) → Cost reporting + analytics (Phase 1c).
