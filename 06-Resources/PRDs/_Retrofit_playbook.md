# Agent-PRD retrofit playbook (Dex vault)

Use this with [`/agent-prd`](../../.claude/skills/agent-prd/SKILL.md) when upgrading legacy PRDs to the binding agent-oriented template.

## Canonical feature PRD inventory (22 files)

**Excluded from full template (index / navigation only):** `README.md`, `Requirements.md`, `PRD_Product_Map.md`

**Included — retrofit to full agent-prd structure:**

| # | File |
|---|------|
| 1 | [communication_service.md](./communication_service.md) |
| 2 | [Feed.md](./Feed.md) |
| 3 | [Groups.md](./Groups.md) |
| 4 | [Login_Account_Activation.md](./Login_Account_Activation.md) |
| 5 | [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) |
| 6 | [Notifications.md](./Notifications.md) |
| 7 | [Payslip_PDF.md](./Payslip_PDF.md) |
| 8 | [Posts.md](./Posts.md) |
| 9 | [Profile_Users.md](./Profile_Users.md) |
| 10 | [Tenant_Management.md](./Tenant_Management.md) |
| 11 | [Theming.md](./Theming.md) |
| 12 | [User_Importer.md](./User_Importer.md) |
| 13 | [User_Management.md](./User_Management.md) |
| 14 | [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) |
| 15 | [Explorer.md](./Explorer.md) |
| 16 | [Page_Builder.md](./Page_Builder.md) |
| 17 | [Product_Analytics.md](./Product_Analytics.md) |
| 18 | [Scheduled_Content.md](./Scheduled_Content.md) |
| 19 | [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md) |
| 20 | [Employee_Chat_and_Groups.md](./Employee_Chat_and_Groups.md) |
| 21 | [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) |
| 22 | [Integrations_floatpays.md](./Integrations_floatpays.md) |

*Note: README “Essential” table also lists [Requirements.md](./Requirements.md) as a hub — that file stays a **prd_index**, not a feature retrofit.*

## Defaults (vault has no PM / analytics tools yet)

| Field | Value |
|-------|--------|
| `project_mgmt_tool` | `none` |
| `issue_id` | `null` |
| `analytics_tool` | `none` |
| `shipped_date` / `metrics_checked_date` | `null` unless known |
| `target_metrics` | Omitted or empty; explain in **Metrics Strategy** body |
| **Metrics Strategy** | Defer product analytics events until a stack exists; tie Phase 1 success to BDD / QA where applicable |

## Hybrid Technical Blueprint

- **Product/integration layer now:** Surfaces, services, APIs, and dependencies named in the PRD and [PRD_Product_Map.md](./PRD_Product_Map.md).
- **Implementation repos:** Subsection **Implementation repository paths (TBD)** — list Mobile / API / Infra as `TBD` until linked. Do not invent file paths or SDK signatures.

## BDD preservation

- Keep **`## Acceptance criteria (BDD)`** sections unchanged in substance.
- **Validation Protocol** references BDD IDs where they exist; vault-level checks may use `grep` on the PRD path for stable strings. Label **manual** where automation requires device/QA.

## Session prompt (copy-paste)

```text
Retrofit 06-Resources/PRDs/<File>.md into the /agent-prd output structure. Merge, do not discard existing sections. project_mgmt_tool: none, analytics_tool: none. Use hybrid Technical Blueprint with Implementation repository paths (TBD). Preserve ## Acceptance criteria (BDD) if present. Add Work Packages, Success Scenarios, Validation Protocol, Notes for Agent Implementation, Files to Create/Modify, Out of Scope per skill.
```

## Collaborative pilot (recommended before batch or rewrites)

Use this when you want **product judgment in the loop**, not a one-shot agent fill-in.

1. **Pick one PRD** (first time: [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) is the reference pilot).
2. **Context pass (agent):** Read the full file + [PRD_Product_Map.md](./PRD_Product_Map.md) for overlaps; summarise conflicts and dependencies in chat.
3. **Wizard-equivalent Q&A (you):** Resolve ambiguities that change scope or GA — e.g. tenancy model, which surfaces gate GA, whether the vendor is locked. Use structured questions (e.g. Cursor Ask) so answers are explicit.
4. **Merge decisions into the PRD** — dated subsection (see **Collaborative pilot** in `AI_Assistant_FAQ.md`) and update Architecture Constraints / WPs / Open questions (strike resolved lines).
5. **Optional four-pass review** — worth it before the **spec gate** (`develop`); overkill for tiny wording tweaks.
6. **Lock:** You confirm the file is the pattern for the next PRDs.

**Keep:** Hybrid blueprint (TBD repos), BDD preservation, honest Metrics when no analytics tool, dated decision tables.  
**Optional / taste:** Vault `grep` checks — useful for CI on markdown; drop if they feel like noise and rely on BDD + human QA only.  
**Avoid:** Implementing “all todos” in one agent run when the plan says **pilot first** — that bypasses step 3.

## Pilot reference

The pilot retrofit is **[AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md)** — structural reference + **collaborative pilot decisions (2026-04-17)** in-file. **Library status:** All 22 feature PRDs include agent-prd retrofit blocks; for **substantive** changes to any file, prefer a short pilot-style Q&A when trade-offs matter.

## Four-pass review (sequential)

1. Technical verification (integrations, cross-PRD links)
2. Agent-readiness (gaps, ambiguities)
3. Measurement audit (binary/numeric criteria)
4. Completeness (no empty placeholders; `TBD` only where allowed above)
