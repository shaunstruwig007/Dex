# PRDs (vault-maintained)

Feature specs live here as markdown. **Requirements ownership** is this vault — PRDs and acceptance criteria are edited here; there is no external doc sync.

## Folder model

| Folder | Meaning | Tagging / status (your convention) |
|--------|---------|-------------------------------------|
| **[Current/](Current/)** | **Wyzetalk Essential** — shipped or in-flight for the current release. | PRD + acceptance criteria; extend with tags such as **done**, **BDD done**, **AC done** per requirement as you refine tracking. |
| **[Next/](Next/)** | **Specified** post–Essential GA capabilities (formal stubs / drafts): SSO, Elevated Auth, scheduled content & messaging, Smart HR, Product Analytics, Explorer, Page Builder, templates. | Ready for sequencing after Essential; add design/dev tags as you adopt them. |
| **[Then/](Then/)** | **Pipeline** — items moving from discovery/design into build; when **development is complete**, the spec + AC move to **Current**. | Use for: **discovery**, **design**, **done (spec)** / in dev, until release lands in Current. |
| **[Future/](Future/)** | **Pre-PRD themes** — exploration only until promoted to **Next** or **Then**. | No committed delivery until promoted. |

**Cross-cutting (stay at this level):** [PRD_Product_Map.md](./PRD_Product_Map.md) · [PRD_Cross_cutting_open_questions.md](./PRD_Cross_cutting_open_questions.md) · [Evidence_and_traceability.md](./Evidence_and_traceability.md) · [Evidence_register.md](./Evidence_register.md)

**Discovery → spec traceability:** [Evidence_and_traceability.md](./Evidence_and_traceability.md) · **Register:** [Evidence_register.md](./Evidence_register.md)

**Market & deal signals:** [../Market_and_deal_signals.md](../Market_and_deal_signals.md)

---

## Current — Wyzetalk Essential

| PRD | File |
|-----|------|
| Communication | [Current/Communication.md](./Current/Communication.md) |
| Feed | [Current/Feed.md](./Current/Feed.md) |
| Groups | [Current/Groups.md](./Current/Groups.md) |
| Login & Account Activation | [Current/Login_Account_Activation.md](./Current/Login_Account_Activation.md) |
| Messaging: Ops & Urgent Alerts | [Current/Messaging_Ops_Urgent_Alerts.md](./Current/Messaging_Ops_Urgent_Alerts.md) |
| Notifications | [Current/Notifications.md](./Current/Notifications.md) |
| Payslip PDF | [Current/Payslip_PDF.md](./Current/Payslip_PDF.md) |
| Posts | [Current/Posts.md](./Current/Posts.md) |
| Profile: Users | [Current/Profile_Users.md](./Current/Profile_Users.md) |
| Requirements | [Current/Requirements.md](./Current/Requirements.md) |
| Tenant Management | [Current/Tenant_Management.md](./Current/Tenant_Management.md) |
| Theming | [Current/Theming.md](./Current/Theming.md) |
| User Importer | [Current/User_Importer.md](./Current/User_Importer.md) |
| User Management | [Current/User_Management.md](./Current/User_Management.md) |
| WhatsApp Channel | [Current/WhatsApp_Channel.md](./Current/WhatsApp_Channel.md) |

**How specs connect:** [PRD_Product_Map.md](./PRD_Product_Map.md)

---

## Next — specified post-Essential GA

Full index: [Next/README.md](./Next/README.md)

| PRD | File | Status |
|-----|------|--------|
| SSO — Enterprise Identity Federation | [Next/SSO.md](./Next/SSO.md) | Draft |
| Content — Scheduled & Recurring Publishing | [Next/Scheduled_Content_Extended.md](./Next/Scheduled_Content_Extended.md) | Stub |
| WhatsApp — Smart HR (Conversational) | [Next/WhatsApp_Smart_HR.md](./Next/WhatsApp_Smart_HR.md) | Stub |
| Elevated Auth — Remote App Integration | [Next/Elevated_Auth_Remote_App.md](./Next/Elevated_Auth_Remote_App.md) | Stub |
| Product Analytics | [Next/Product_Analytics.md](./Next/Product_Analytics.md) | Stub |
| Explorer — Category-Based Navigation | [Next/Explorer.md](./Next/Explorer.md) | Stub |
| Page Builder — Widget-Driven Content | [Next/Page_Builder.md](./Next/Page_Builder.md) | Stub |

**Discovery templates**

| Template | File |
|----------|------|
| Remote App (federated / Air) | [Next/Template_Remote_App.md](./Next/Template_Remote_App.md) |
| Feature within Essential (core) | [Next/Template_Feature_Essential.md](./Next/Template_Feature_Essential.md) |

---

## Then — discovery / design / pre-release dev

See [Then/README.md](./Then/README.md). Add specs here when they graduate from **Future** but are not yet **Current**.

---

## Future — pre-PRD themes

Index: [Future/README.md](./Future/README.md) · Hub: [Future/Discovery_backlog.md](./Future/Discovery_backlog.md)

---

## Acceptance criteria & QA layer

| PRD | Acceptance criteria |
|-----|----------------------|
| Communication | [Current/Communication_acceptance_criteria.md](./Current/Communication_acceptance_criteria.md) |
| Feed | [Current/Feed_acceptance_criteria.md](./Current/Feed_acceptance_criteria.md) |
| Groups | [Current/Groups_acceptance_criteria.md](./Current/Groups_acceptance_criteria.md) |
| Login & Account Activation | [Current/Login_Account_Activation_acceptance_criteria.md](./Current/Login_Account_Activation_acceptance_criteria.md) |
| Messaging: Ops & Urgent Alerts | [Current/Messaging_Ops_Urgent_Alerts_acceptance_criteria.md](./Current/Messaging_Ops_Urgent_Alerts_acceptance_criteria.md) |
| Notifications | [Current/Notifications_acceptance_criteria.md](./Current/Notifications_acceptance_criteria.md) |
| Payslip PDF | [Current/Payslip_PDF_acceptance_criteria.md](./Current/Payslip_PDF_acceptance_criteria.md) |
| Posts | [Current/Posts_acceptance_criteria.md](./Current/Posts_acceptance_criteria.md) |
| Profile: Users | [Current/Profile_Users_acceptance_criteria.md](./Current/Profile_Users_acceptance_criteria.md) |
| Tenant Management | [Current/Tenant_Management_acceptance_criteria.md](./Current/Tenant_Management_acceptance_criteria.md) |
| Theming | [Current/Theming_acceptance_criteria.md](./Current/Theming_acceptance_criteria.md) |
| User Importer | [Current/User_Importer_acceptance_criteria.md](./Current/User_Importer_acceptance_criteria.md) |
| User Management | [Current/User_Management_acceptance_criteria.md](./Current/User_Management_acceptance_criteria.md) |
| WhatsApp Channel | [Current/WhatsApp_Channel_acceptance_criteria.md](./Current/WhatsApp_Channel_acceptance_criteria.md) |
| SSO (Next) | [Next/SSO_acceptance_criteria.md](./Next/SSO_acceptance_criteria.md) |

| Cross-cutting | File |
|---------------|------|
| Integration-only open questions | [PRD_Cross_cutting_open_questions.md](./PRD_Cross_cutting_open_questions.md) |
| Product map & canonical overlap rules | [PRD_Product_Map.md](./PRD_Product_Map.md) |
