# PRDs (product requirements)

Feature specs live as **flat markdown files** in this folder. Each feature PRD uses **YAML frontmatter** (`lifecycle`, `prd_id`, …) aligned with **Steerco / product orchestration** — see [agent-prd skill](../../.claude/skills/agent-prd/SKILL.md).

**Integration / cross-PRD rules:** [PRD_Product_Map.md](./PRD_Product_Map.md) — dependencies, canonical overlap (e.g. Feed vs Posts vs archive), suggested build order.

**Market & competitive evidence (`EV-*`):** [../Market_and_competitive_signals.md](../Market_and_competitive_signals.md)

**Retrofit playbook (agent-prd uplift):** [_Retrofit_playbook.md](./_Retrofit_playbook.md)

---

## Lifecycle (Steerco / PDLC board)

**Board columns (canonical `lifecycle` for `pdlc-ui` + PRD frontmatter):**

`idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed` · Branch: **`parked`**

- **Steerco** decides on the board; **`pdlc-ui` persistence wins** for stage. When a flat PRD exists, **sync `lifecycle` from the board** (never overwrite the board from stale YAML).
- **Subflows (not separate columns):** **`/product-brief`** runs when the user moves **`idea` → `discovery`** (stepwise popup first). **`/agent-prd`** runs in **`spec_ready`** (MVP: export + Cursor; later in-app). **`develop`** starts after spec is complete and handoff is issued.
- **Rewind / rework:** Cards may move **backward** (e.g. `spec_ready` → `discovery` or `design`) to absorb scope change; **only** a move **into `idea`** clears the card to **title + description** only. Detail: [plans/PDLC_UI/lifecycle-transitions.md](../../plans/PDLC_UI/lifecycle-transitions.md).
- **`parked`:** Use intent **`revisit`** vs **`wont_consider`** (see lifecycle doc).
- **Strategy (“golden thread”):** Link initiatives to **`System/pillars.yaml`** (and future company strategy); **warn** when an idea does not match declared strategy (e.g. loudest-client work outside A/B).

**Migration from older frontmatter (retrofit over time):**

| Previous `lifecycle` | Map to |
|----------------------|--------|
| `brief` | **`discovery`** (brief is the entry subflow) — **match board** |
| `spec_ready` | **`spec_ready`** (unchanged) |
| `done` | `deployed` |

---

## Wyzetalk Essential (core product)

| PRD | File |
|-----|------|
| Communication | [communication_service.md](./communication_service.md) |
| Feed | [Feed.md](./Feed.md) |
| Groups | [Groups.md](./Groups.md) |
| Login & Account Activation | [Login_Account_Activation.md](./Login_Account_Activation.md) |
| Messaging: Ops, Urgent Alerts & WhatsApp (Part 1 + Part 2) | [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) |
| Notifications | [Notifications.md](./Notifications.md) |
| Payslip PDF | [Payslip_PDF.md](./Payslip_PDF.md) |
| Posts | [Posts.md](./Posts.md) |
| Profile: Users | [Profile_Users.md](./Profile_Users.md) |
| Requirements (hub) | [Requirements.md](./Requirements.md) |
| Tenant Management | [Tenant_Management.md](./Tenant_Management.md) |
| Theming | [Theming.md](./Theming.md) |
| User Importer | [User_Importer.md](./User_Importer.md) |
| User Management | [User_Management.md](./User_Management.md) |
---

## Roadmap — specified / discovery

| PRD | File | Notes |
|-----|------|--------|
| Elevated Auth — Remote App | [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) | |
| Explorer | [Explorer.md](./Explorer.md) | |
| Page Builder | [Page_Builder.md](./Page_Builder.md) | |
| Product Analytics | [Product_Analytics.md](./Product_Analytics.md) | |
| Scheduled & recurring content | [Scheduled_Content.md](./Scheduled_Content.md) | |
| WhatsApp Smart HR | [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) | |
| Employee chat & groups | [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md) | Discovery |
| AI Assistant — FAQ | [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) | |
| Floatpays integration | [Integrations_floatpays.md](./Integrations_floatpays.md) | |

---

## Acceptance criteria

Testable **Given / When / Then** criteria live under **`## Acceptance criteria (BDD)`** inside each feature PRD (merged from former `*_acceptance_criteria.md` files).

---

## How to add a new PRD

1. Capture idea in orchestration → **`/product-brief`** through **`spec_ready`**.  
2. Create `06-Resources/PRDs/<Feature>.md` with frontmatter and run **`/agent-prd`** to complete the binding spec.  
3. Link from [PRD_Product_Map.md](./PRD_Product_Map.md) if the feature touches cross-PRD rules.

## Agent-prd uplift

Library-wide: **flat paths**, **BDD merged** into parents, **Steerco `lifecycle`**, **[PRD_Product_Map.md](./PRD_Product_Map.md)** (incl. §8 agent structure). **2026-04-17:** All README-indexed **feature PRDs** retrofitted with [`/agent-prd`](../../.claude/skills/agent-prd/SKILL.md) sections (Work packages, Technical blueprint hybrid, Validation protocol, extended frontmatter). Defaults and file list: [_Retrofit_playbook.md](./_Retrofit_playbook.md). **Pilot:** [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md). Use the playbook session prompt for **new** PRDs or major rewrites.
