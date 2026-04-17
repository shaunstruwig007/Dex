---
prd_id: requirements
lifecycle: done
last_status_update: 2026-04-17
source: legacy_upgrade
document_type: prd_index
---

# Requirements

---

This section contains formal specifications and requirements documentation for features being built.

> 📌 Requirements documents are written after discovery is complete. Each feature has its own spec page below.

**How these pages connect (dependencies, shared rules, build order):** [PRD_Product_Map.md](./PRD_Product_Map.md)

---

## Vault integration artifacts

- [PRD_Product_Map.md](./PRD_Product_Map.md) — **Groups ↔ Posts ↔ Feed**, messaging vs feed, canonical archive/retention table
- [README.md](./README.md) — index of feature PRDs, lifecycle, Steerco alignment
- [Market_and_competitive_signals.md](../Market_and_competitive_signals.md) — `EV-*` market/competitive evidence register

---

## Identity, tenant, and access

- [Tenant Management](./Tenant_Management.md)
- [Communication service](./communication_service.md)
- [Login & Account Activation](./Login_Account_Activation.md)
- [Theming](./Theming.md)

## People data and directory

- [User Importer](./User_Importer.md)
- [User Management](./User_Management.md)
- [Profile: Users](./Profile_Users.md)

## Audience, content, and feed

- [Groups](./Groups.md) — audience segments (feeds [Posts](./Posts.md) + [Messaging: Ops & Urgent Alerts](./Messaging_Ops_Urgent_Alerts.md))
- [Posts](./Posts.md) — admin-authored content; **requires a group** before publish; **Phase 2** (PDF, Video, external form link) is specified in the same doc
- [Feed](./Feed.md) — employee view; **visibility = group membership**

## Messaging and notifications

- [Messaging: Ops & Urgent Alerts](./Messaging_Ops_Urgent_Alerts.md)
- [Notifications](./Notifications.md)
- [WhatsApp outbound (Part 2)](./Messaging_Ops_Urgent_Alerts.md#whatsapp-channel--outbound-messaging) — one-way outbound delivery for Urgent Alerts + Standard Messages (Phase 1); see [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) for full messaging spec

## Payroll & sensitive data access

- [Payslip PDF](./Payslip_PDF.md) — remote PDF payslip access, Elevated Auth (Blue Core addition), in-app viewer, recovery flows
