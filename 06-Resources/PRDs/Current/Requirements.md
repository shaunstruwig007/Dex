# Requirements

---

This section contains formal specifications and requirements documentation for features being built.

> 📌 Requirements documents are written after discovery is complete. Each feature has its own spec page below.

**How these pages connect (dependencies, shared rules, build order):** [PRD_Product_Map.md](../PRD_Product_Map.md)

---

## Vault integration artifacts

- [PRD_Product_Map.md](../PRD_Product_Map.md) — **Groups ↔ Posts ↔ Feed**, messaging vs feed, canonical archive/retention table
- [README.md](../README.md) — **index of all acceptance criteria** (`*_acceptance_criteria.md`) + cross-cutting open questions
- [PRD_Cross_cutting_open_questions.md](../PRD_Cross_cutting_open_questions.md) — multi-PRD integration questions only

---

## Identity, tenant, and access

- [Tenant Management](./Tenant_Management.md)
- [Communication](./Communication.md)
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
- [WhatsApp Channel](./WhatsApp_Channel.md) — one-way outbound delivery channel for Urgent Alerts + Standard Messages (Phase 1)

## Payroll & sensitive data access

- [Payslip PDF](./Payslip_PDF.md) — remote PDF payslip access, Elevated Auth (Blue Core addition), in-app viewer, recovery flows
