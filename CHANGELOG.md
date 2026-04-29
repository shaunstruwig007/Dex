
# Changelog

All notable changes to Dex will be documented in this file.

**For users:** Each entry explains what was frustrating before, what's different now, and why you'll care.

---

## [1.21.0] — Walkthrough 2 (cross-PRD + design-heavy) + persona-name cleanup (2026-04-29)

**Before:** Five renamed skills had been authored against walkthrough-1 evidence (multi-language content translation — content-heavy, single-PRD). The four persona-named precursors (`agent-m-cpo-custom`, `agent-q-cto-custom`, `moneypenny-custom`, `felix-custom`) co-existed on disk pending walkthrough-2 validation. Cursor Plan-mode consumption, cross-PRD discovery, and the `--reshape` flag on `/prd-author-custom` were untested. The kill of `/design-prompt-custom` had been called but not validated against a design-heavy initiative.

**Now:** Walkthrough 2 ran end-to-end on a cross-PRD initiative — *"AI Assistant alongside Employee Chat — IA / surface-parity question"* — reconciling `Employee_Chat_and_Groups.md` and `AI_Assistant_FAQ.md`. ~2.5 hrs end-to-end (30% faster than walkthrough 1 despite producing 3× the artefacts).

**Artefacts produced:**
- Discovery: [`06-Resources/Product_ideas/ai-assistant-alongside-chat_discovery.md`](06-Resources/Product_ideas/ai-assistant-alongside-chat_discovery.md) — first cross-PRD discovery test; surfaced 6 evidence gaps + Path A/B/C scope recommendation to PRD author.
- NEW PRD: [`06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md`](06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md) — bond_v1 shape; 5 slices, 8 risks, 10 out-of-scope, 8 open questions, full Design pointers section. First test of cross-PRD slice dependencies (Slice 4 depends on `Multilingual_Content.md` slice 3).
- Reshaped to bond_v1: [`Employee_Chat_and_Groups.md`](06-Resources/PRDs/Employee_Chat_and_Groups.md) + [`AI_Assistant_FAQ.md`](06-Resources/PRDs/AI_Assistant_FAQ.md) (preserved 2026-04-17 collaborative-pilot decisions verbatim). First test of `/prd-author-custom`'s `--reshape` flag.
- Critique log: [`plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md`](plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md) — 6 critique runs (3 PRDs × product + engineering); all returned RETURN TO PLAN as expected for first-draft spec_ready.

**Validations confirmed:**
- **Kill of `/design-prompt-custom` survives walkthrough 2** (the design-heavy test). Three PRDs with substantial design surfaces (chat IA, bot affordance density, in-thread disclosure) all fit cleanly in `/prd-author-custom`'s Design pointers section.
- **Pair protocol (product → engineering)** worked across 6 runs; no conflicts surfaced.
- **`eng-alt` mandatory rule** is doing its job — 7 alternatives produced across 3 PRDs.
- **A11y `lang` lesson propagates** via design pointers; 2 of 3 PRDs hit PASS automatically.

**Skill-spec gaps surfaced (deferred — apply after walkthrough 3 to avoid over-fitting):**
- `/initiative-discovery-custom` — Phase 7 (skipped-steps log) + Phase 8 (PRD scope recommendation when discovery surfaces multiple-PRD options).
- `/prd-author-custom` — Test-shape-per-slice subsection (GAP across all 3 critiques); Demo-readiness deliverable on Slice 1 (consistently SOFT).
- `/critique-product-custom` — Cross-PRD seam detection guidance on Cohesion-vs-craft row.
- Both critique skills — synthesis/meta-output mode for batch critique runs.

**Persona-name cleanup completed:**
- `.claude/skills/agent-m-cpo-custom/` — DELETED. Replaced by `/critique-product-custom`.
- `.claude/skills/agent-q-cto-custom/` — DELETED. Replaced by `/critique-engineering-custom`.
- `.claude/skills/moneypenny-custom/` — DELETED. Replaced by `/initiative-discovery-custom`.
- `.claude/skills/felix-custom/` — DELETED. Replaced by `/weekly-market-intel-custom`.
- `.claude/skills/README.md` updated to reflect new pipeline-skill catalog.
- `plans/skill-pipeline/README.md` § 8 cleanup note updated (status moved from "Pending deletion" to "Already deleted").
- Provenance preserved in each new skill's footer (`*Replaces <old-name>...*`) and in `lessons-from-skills.md`.

**Out of scope this commit (left for separate review):** `felix-client-signals-custom` (different skill — first-party client activity intelligence; not part of pipeline-rename scope), `weekly-market-discovery` (different skill — market signal source rotation), `Market_intelligence/` ingest output, `create_multilingual_docx.js`, `claude-design-wireframe-brief.md`.

**Still pending (post-walkthrough 3 candidates):**
- Cursor Plan mode consumption test (paste `plan-mode-seed` from any of the 3 PRDs into Plan mode after must-fixes folded).
- Idempotence diff-and-ask flow (re-author after edits).
- Runtime-plan lens on engineering critique (sprint-seed or runtime artefact).

---

## [1.20.0] — Skill pipeline pivot: validate-via-walkthrough + 5 renamed skills (2026-04-29)

**Before:** Skill pipeline was about to author five skills against unvalidated assumptions — `/felix-custom`, `/moneypenny-custom`, `/bond-prd-custom` (TBD), `/agent-m-cpo-custom`, `/agent-q-cto-custom`, and a `/design-prompt-custom` (TBD). Persona-named (007 universe — Felix Leiter, Moneypenny, Bond, M, Q) which required persona knowledge to operate. The 6-sprint build-then-test plan ([`skill-pipeline-bdd-replan`](.cursor/plans/skill-pipeline-bdd-replan_5d961e0d.plan.md)) was active; the tracer-bullet PRD-shape delta plan was layered on top.

**Now:** Cancelled both build plans (status: `paused-2026-04-29`). Ran a **manual walkthrough** of multi-language content translation (idea → discovery → ICP authoring → PRD → critique pair) as a test harness. Used the walkthrough's frictions to define and ship five renamed, job-described skills end-to-end in one session:

- **`/weekly-market-intel-custom`** ([SKILL](.claude/skills/weekly-market-intel-custom/SKILL.md)) — replaces `/felix-custom`. Operational substance preserved; persona stripped; explicitly **NOT** in the idea→PRD pipeline (standalone weekly cadence).
- **`/initiative-discovery-custom`** ([SKILL](.claude/skills/initiative-discovery-custom/SKILL.md)) — replaces `/moneypenny-custom`. Decoupled from parked `pdlc-ui` runtime (markdown-native). New behaviours validated by walkthrough: **Confirm-relevance per grep hit** (catches stale "future phase" references), **Evidence-gap detection** (explicit log when vault is sparse), **`candidateSlices[]`** output for downstream PRD author.
- **`/prd-author-custom`** ([SKILL](.claude/skills/prd-author-custom/SKILL.md)) — new. Coexists with `/agent-prd` (different output shapes for different downstream consumers). Produces **`bond_v1` shape** with `plan-mode-seed` fence (1:1 mapping to Cursor Plan mode). **Required input contract** (refuses without discovery output). **Idempotence rule** (no silent overwrite of edited PRDs). Refusal list catches: aspirational metrics with no baseline, risks with no mitigation, slice 1 candidates that aren't walking skeletons.
- **`/critique-product-custom`** ([SKILL](.claude/skills/critique-product-custom/SKILL.md)) — replaces `/agent-m-cpo-custom`. 7-row checklist preserved; **First-demo risk** sharpened to room-flavoured (Steerco embarrassment, not technical failure — that's engineering's lane).
- **`/critique-engineering-custom`** ([SKILL](.claude/skills/critique-engineering-custom/SKILL.md)) — replaces `/agent-q-cto-custom`. 9-row checklist preserved; new **two-lens framing** (runtime-plan vs feature-PRD); **A11y row** sharpened to call out the `lang` attribute on translated content (the catch that surfaced during the walkthrough); **`eng-alt` mandatory** (≥1 alternative shape always produced — the highest-yield row across both critiques).

**Killed:** `/design-prompt-custom` (never authored). The multi-language walkthrough produced no incremental value from a separate design-step skill — design pointers folded into `/prd-author-custom`'s output. Re-validate on a design-heavy walkthrough; reinstate if proven wrong.

**Test artefacts produced:** [`System/icp.md`](System/icp.md) — first real ICP authored, three segments + cross-segment disqualifiers. [`06-Resources/PRDs/Multilingual_Content.md`](06-Resources/PRDs/Multilingual_Content.md) — canonical `bond_v1` reference PRD; currently RETURN TO PLAN status from M+Q critique (the verdict format and refusal-list discipline are themselves part of the test). [`06-Resources/PRDs/Scheduled_Content.md`](06-Resources/PRDs/Scheduled_Content.md) — stale "future phase" multi-lang reference replaced with explicit scope-boundary note.

**Pipeline operating doc updated:** [`plans/skill-pipeline/README.md`](plans/skill-pipeline/README.md) — new Mermaid diagram, current skill roster table, replaced 6-sprint build cadence with walkthrough-validate-then-author cadence. [`plans/skill-pipeline/lessons-from-skills.md`](plans/skill-pipeline/lessons-from-skills.md) — populated with concrete evidence per skill (S1/S2/S4/S5) + cross-cutting lessons on persona-naming and validate-via-walkthrough. [`plans/skill-pipeline/sessions/2026-04-29.md`](plans/skill-pipeline/sessions/2026-04-29.md) — full session record (decisions, artefacts, time spent).

**Pending cleanup:** the four legacy persona-named precursors (`agent-m-cpo-custom`, `agent-q-cto-custom`, `moneypenny-custom`, `felix-custom`) co-exist on disk under their old names until walkthrough 2 (design-heavy use case) validates the new skills end-to-end. Cleanup is one batch delete after that proof point.

---

## [1.19.59] — PDLC pre-S0 sign-off: cadence, canonical case, kick-off decisions (2026-04-20)

**Before:** Sprint cadence drifted (1w/2w mixed), **Phase 5 row #14 missing**, field case **snake vs camel** drift, and several decisions (human ID, audit events, attachments, backup cadence, timezone, git host, a11y, device scope) were implicit — would cause rework by S2.

**Now:** [plan.md](plans/PDLC_UI/plan.md) Phase 5 adds **row #14** (release notes governance) and a new **“Sprint 0 kick-off decisions”** block (camelCase canonical, `handle` ID, `events[]`, attachments links-only, daily backup + 30-day retention, UTC stored / SAST displayed, git host + CI runner ADR, **WCAG 2.1 AA + keyboard**, desktop-only, PII note, JSON migration stub, no-undo, first real initiative TBC at S7). Schema list gains `handle`, `events[]`, `createdAt`, `updatedAt`. [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) normalises cadence (S0 = 1–2w exception, others = 2w), adds **a11y baseline** to Implementation standard, updates **S0 deliverables** (ADRs for git host + timezone), **S1** adds `events[]` + `handle` to DoD, **S2** Plan seed switches to camelCase and appends to `events[]`.

---

## [1.19.58] — PDLC git: branch-per-cycle + green CI merge gate (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) **R16** did not explicitly forbid **developing on `main`** or require **green CI before merging** to default.

**Now:** **R16** adds §7 (**dedicated branch per cycle**, `main` releasable, PR-only integration) and §8 (**no merge to default without green CI**, branch protection when ICT allows) + **hotfix** rule. [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) guardrails table + **Definition of Ready** + **S0 OPERATIONS** deliverable; sprint ceremony line updated.

---

## [1.19.57] — PDLC R17 ops/DB baseline + S0/S1 split (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) lacked **DB + DevOps** depth (SQLite WAL/migrations, JSON atomicity, health/version, secrets, deploy/rollback, audit/CI security, R13 git conflicts); **Sprint 0** did not spell **what is in S0 vs deferred**.

**Now:** **R17** + **§ Data, DevOps, and operability** (S0 seeds / S1 proves). Phase A adds **`schemaVersion`**, **`revision`**. Sprint **S0** deliverables: `.env.example`, **`OPERATIONS.md`**, **required CI** schema validate, **health + build version**, BACKUP_RUNBOOK **SQLite/JSON** specifics; **Out** lists deferred Docker/staging/gitleaks unless ICT requires. **S1** DoD includes **WAL/migrations or JSON atomic**, **`revision`** on save. Engineering guardrails table adds **R17 split** row.

---

## [1.19.56] — PDLC engineering governance R16 + ADR seed (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) and [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) did not explicitly require **cross-sprint tech patterns** (anti-drift for solo/Plan-mode delivery).

**Now:** Plan adds **R16** and **§ Engineering governance** (contracts+docs same PR, ADRs, CI/schema/tests, DS consumption after S6, PR sprint trace, lockfile policy). Sprint backlog adds **Engineering guardrails** table + **S0 DoD** / Plan seed for **`pdlc-ui/docs/adr/`** and first ADR.

---

## [1.19.55] — PDLC as-is clarifying answers captured (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) listed open clarifying questions without **WT-specific answers**.

**Now:** Plan holds a **Q&A table**: duplicate briefs in **verbal 1:1 / Steerco**; **spec→build→retrofit design** norm; **discovery skipped for time** (core problem the flow solves); **post-Steerco fires + isolated conversations + word of mouth**; drivers **internal deadline + demo**; MVP success = **PRD+design conformance**, **Plan mode**-fed context, **~30% miss / Jira resistance** context. **Product implications** bullets for backlog. [company_strategy.md](plans/PDLC_UI/company_strategy.md) adds **pressure signals** for future R12 copy.

---

## [1.19.54] — PDLC clarifying questions + WT company_strategy draft (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) listed follow-up research in one line; there was no **short company strategy** file for future **R12** checks.

**Now:** Plan includes an explicit **clarifying questions** list (duplicate briefs, design-without-spec, missed gates, Steerco→implementation drift, loud-client drivers, MVP success). New [company_strategy.md](plans/PDLC_UI/company_strategy.md) — working draft: **frontline / blue-collar engagement platform** thesis, in/out examples (e.g. budgeting tool off-strategy), usage notes for post-MVP R12. [lifecycle-transitions.md](plans/PDLC_UI/lifecycle-transitions.md) and [README](plans/PDLC_UI/README.md) link to it.

---

## [1.19.53] — PDLC UI governance: as-is/to-be, gates, solo cadence (2026-04-20)

**Before:** [plan.md](plans/PDLC_UI/plan.md) and [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) did not encode **Wyzetalk Steerco as-is** (reporting / broken telephone / feature-factory pain), **PM as record-of-truth mover**, **parked intent + reason in Sprint 2**, **product-brief before `idea→discovery` (S3 dependency)**, **develop/uat read-only + release notes**, **R6b via export template**, **structured spec wizard**, **vault continuity (R13)** and **deferred company-strategy (R12)** vs Dex pillars, **solo 2-week** cadence, or **wipe-to-idea** mitigation.

**Now:** Plan adds **as-is vs to-be**, Phase 5 governance (**PO/Designer** waive, **Shaun** audit placeholder, **PM** rewind approval), Requirements **R12–R15** (strategy post-MVP, vault thread, release notes, agent phases), canonical **`claudeDesignHandoffPath` / `implementationPolishNote` / `parkedReason`**. [lifecycle-transitions.md](plans/PDLC_UI/lifecycle-transitions.md) updates **parked reason**, **all →`idea` wipes**, **accident mitigation**, **company strategy post-MVP**. Sprint backlog: **S2** blocks **`idea→discovery`** until **S3**, **S9 deferred**, **S8** develop rewind + wipe rules, default **`spec_complete`** checklist, **R13** in optional **S10+**.

---

## [1.19.52] — pdlc-ui build: anthropic-frontend-design + S5–S6 → DS (2026-04-23)

**Before:** [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) did not mandate **`/anthropic-frontend-design`** for orchestration UI or tie **S5–S6** to a **design-system** extract from **R6/R7** work.

**Now:** Sprint backlog adds an **Implementation standard** (all `pdlc-ui` UI via **`anthropic-frontend-design`**, **BE+UI** vertical slices). **S5–S6** are framed as **dogfood** test cases for the Steerco design column + review gate, with **DoD** to add **`pdlc-ui/docs/design-system.md` v0.1** after S6 and **consume** it from **S7+**. [plan.md](plans/PDLC_UI/plan.md) Phase B links the same.

---

## [1.19.51] — PDLC UI sprint backlog for agile delivery (2026-04-23)

**Before:** Implementation steps in [plan.md](plans/PDLC_UI/plan.md) listed stages but not **sprint-sized** goals with **Definition of Done** or **Cursor Plan** entry points.

**Now:** [sprint-backlog.md](plans/PDLC_UI/sprint-backlog.md) defines **Sprints 0–9** (spike + shell through strategy thread), maps each to plan **R#**s, spells **how** technically, **explicitly out** scope, and includes a **Plan mode seed** per sprint. [plan.md](plans/PDLC_UI/plan.md) Phase B and [README](plans/PDLC_UI/README.md) link to it.

---

## [1.19.50] — PDLC `spec_ready` column, rewind rules, strategy thread (2026-04-23)

**Before:** Swim lanes omitted **`spec_ready`**; **`/agent-prd`** was framed only as a gate immediately before **`develop`**; no single doc for **backward moves**, **`parked`** intent, or **strategy non-conformance**.

**Now:** [lifecycle-transitions.md](plans/PDLC_UI/lifecycle-transitions.md) defines **`idea` → `discovery` → `design` → `spec_ready` → `develop` → `uat` → `deployed`**, **product-brief on `idea`→`discovery`**, **rewind** (retain data except **`→ idea`** = title+body only), **`parked_intent`**, and **pillar / strategy** warnings. [PRDs/README.md](06-Resources/PRDs/README.md), [plan.md](plans/PDLC_UI/plan.md), [PDLC_Orchestration_UI.md](04-Projects/PDLC_Orchestration_UI.md), [skill-agent-map.md](plans/PDLC_UI/skill-agent-map.md), **`/product-brief`** and **`/agent-prd`** skills updated. **Clarifying questions** default to **agent-prd wizard** for MVP.

---

## [1.19.49] — PDLC governance: board lifecycle, board wins, optional BDD (2026-04-23)

**Before:** PRD `lifecycle` ladder used `brief`, `spec_ready`, and `done`; **`/agent-prd`** treated PDLC BDD as mandatory; swim-lane docs still described **Brief** / **Ready for spec** columns.

**Now:** [PRDs/README.md](06-Resources/PRDs/README.md) documents **`idea` → `discovery` → `design` → `develop` → `uat` → `deployed`** (+ `parked`), **board wins** stage conflicts, **brief** and **spec** as **subflows**, and a **migration table** from legacy values. **`/agent-prd`** makes **Step 3b BDD optional** with plain-English guidance. **`plans/PDLC_UI/`**, **`04-Projects/PDLC_Orchestration_UI.md`**, and **`plans/PDLC_UI/README.md`** record **Shaun** as interim board owner, **no** MVP user-management, **R8 MVP** vs automated later, **R10 backups**, and **R8** as **spec gate before `develop`**.

---

## [1.19.48] — PDLC orchestration design handoff + agent-prd BDD (2026-04-23)

**Before:** PDLC docs conflated **Claude Design (web)** with **`/anthropic-frontend-design`**, assumed optional **Figma MCP**, and **`/agent-prd`** did not spell out **BDD (Gherkin)** or **PDLC ingest** of design artefacts.

**Now:** **`plans/PDLC_UI/`** and **`04-Projects/PDLC_Orchestration_UI.md`** describe **Claude Design** for visuals, **manual** Figma↔Design DS upkeep, **export `.md`** with **Design system instructions**, a **mandatory Cursor polish** step using **`/anthropic-frontend-design`** on Claude Design **outputs**, **`/agent-prd` starting when a card hits Ready for spec**, and PRDs that include **BDD** for tests and **Cursor Plan mode**. **`agent-prd`** adds **Step 3b**, a **BDD** PRD section, and validation alignment. **`anthropic-frontend-design`** documents the **post–Claude Design handoff** behaviour. **`plans/PDLC_UI/export-pack-template.md`** is the canonical **copy-paste export pack** for Claude Design + Cursor.

---

## [1.19.47] — PRD renames: communication_service, merged messaging+WhatsApp, Smart HR, integrations (2026-04-17)

**Before:** Separate **`Communication.md`**, **`WhatsApp_Channel.md`**, **`AI_Assistant_Conversational.md`**, **`Product_Dashboard_Paper_v1_UI.md`**, and older filenames for Smart HR, scheduled content, and Floatpays.

**Now:** **`communication_service.md`** (renamed from Communication). **`Messaging_Ops_Urgent_Alerts.md`** includes former **WhatsApp Channel** content as Part 2; **`WhatsApp_Channel.md`** removed. **`Smart_HR_Whatsapp.md`**, **`Scheduled_Content.md`**, **`Integrations_floatpays.md`** renamed. **`AI_Assistant_Conversational.md`** and **`Product_Dashboard_Paper_v1_UI.md`** removed; links updated across PRDs, README, and market signals.

---

## [1.19.46] — PRD library flatten, Steerco lifecycle, market signals roll-up (2026-04-17)

**Before:** PRDs lived under **`Current/`**, **`Next/`**, and **`Future/`**, with separate `*_acceptance_criteria.md` files and scattered evidence (`Evidence_register.md`, traceability stubs).

**Now:** All retained feature specs sit as **flat `06-Resources/PRDs/*.md`** files. **BDD acceptance criteria** are merged into each parent PRD. **`PRD_Product_Map.md`** stays at `PRDs/` root and was refreshed for the new layout. Removed: `Evidence_and_traceability.md`, `Evidence_register.md`, `PRD_Cross_cutting_open_questions.md`, `Product_Briefs_Current_and_Next.md`, and non-kept Next/Future stubs. **`06-Resources/Market_and_competitive_signals.md`** holds migrated **`EV-*`** rows; intel skills point there. Each PRD has **YAML frontmatter** (`lifecycle` for Steerco: `idea`→`done`, plus `parked`). **`agent-prd`** and **`product-brief`** skills document the new paths. **`06-Resources/PRDs/README.md`** is the canonical index.

---

## [1.19.45] — Restore `06-Resources/PRDs/` from snapshot; align Cursor MCP with root (2026-04-17)

**Before:** After the template reset, **`06-Resources/PRDs/`** was absent from the live vault (PRDs only in **`07-Archives/Full_vault_snapshot_2026-04-16/`**). **`.cursor/mcp.json`** used a venv Python path, **`qmd`**, and a remote Atlassian entry, diverging from the vault root **`.mcp.json`**.

**Now:** **`PRDs/`** is copied back from the full vault snapshot (**~70** spec files). **`.cursor/mcp.json`** matches the root **`mcp.json`** (same servers and `python3` paths). **`06-Resources/README.md`** lists **PRDs/** under Subfolders.

---

## [1.19.44] — Remove `blueprint/` (product-dashboard, workboard, duplicate guides) (2026-04-16)

**Before:** System guides, product-dashboard, and workboard also lived under **`blueprint/`** at the vault root (parallel to **`06-Resources/Dex_System/`**).

**Now:** The **`blueprint/`** tree is **removed**. Documentation links use **`06-Resources/Dex_System/`** only. **`core/mcp/scripts/calendar_eventkit.py`** points at **`06-Resources/Dex_System/Calendar_Setup.md`**. **`.claude/launch.json`** has no static-file servers for removed UIs. **`/daily-plan`** no longer assumes an embedded workboard under `blueprint/`.

---

## [1.19.43] — Full vault snapshot + template reset for fresh onboarding (2026-04-16)

**Before:** The vault contained fork-specific projects, areas, PRDs, market intelligence, and configured `System/user-profile.yaml` / `pillars.yaml`.

**Now:** A **complete snapshot** of that state lives under **`07-Archives/Full_vault_snapshot_2026-04-16/`** (including `prior_07-Archives/`, full `06-Resources/`, `System/` with profile files, and copies of `CLAUDE.md` / `.mcp.json`). PARA folders (`00-`–`06-`), `07-Archives/` skeleton, and **`06-Resources/`** were reset from **`upstream/release`** (template-only Resources). **`System/user-profile.yaml`** and **`System/pillars.yaml`** were removed so onboarding can run cleanly; **`CLAUDE.md`** matches upstream until you extend it again. Run **`install.sh`** / onboarding MCP and **`/getting-started`** as needed.

---

## [1.19.42] — Orchestration playbook + operational clean slate (2026-04-16)

**Before:** Custom and duplicated agent workflows (e.g. parallel intel skills) mixed with shipped skills; tasks, inbox, and planning files carried legacy state.

**Now:** **[`06-Resources/Product_orchestration_playbook.md`](06-Resources/Product_orchestration_playbook.md)** is the single map for idea → discovery → **`/agent-prd`** → PRD promotion and for the canonical intelligence stack (**`/intelligence-scanning`**, **`/daily-intelligence-brief`**, **`/scrape`**). Prior operational data and a **`daily-plan-workboard.cjs`** backup sit under **`07-Archives/System_Reset_2026-04-16/`**; git tag **`pre-clean-slate-2026-04-16`** supports rollback. **`upstream/release`** was already merged (no new upstream commits at merge time).

---

## [1.19.41] — Vault folder: `Dex_System` → `blueprint` (2026-04-16)

**Before:** System guides, product-dashboard, and workboard lived under **`Dex_System/`** at the vault root.

**Now:** That folder is **`blueprint/`**. All references (skills, hooks, launch configs, product dashboard URLs, `.gitignore`, and **`core/mcp/scripts/calendar_eventkit.py`**) point at **`blueprint/`**. The main user guide file remains **`blueprint/Dex_System_Guide.md`**.

---

## [1.19.40] — Product dashboard: stack tier as pill dropdown (2026-04-15)

**Before:** The ticket toolbar had a full **Now / Next / Future / Backlog** segmented control plus a duplicate **tier pill** in the subhead.

**Now:** The segmented control is removed; **stack status** is a single **`#dlg-tier-select`** in the subhead, styled like the former pill (uppercase, tier colours, chevron) with the same tier tokens (**Now** = Current, etc.). **Save** still maps selection to **`prdTier`** / overrides.

---

## [1.19.39] — Product dashboard: Idea lane = New initiative intake (2026-04-15)

**Before:** Opening an initiative in the **Idea** lane used a mixed Brief tab (read-only brief, extra workflow chrome) that did not match **+ New idea** / **New initiative**, and structured `productBrief` was not saved from the ticket.

**Now:** **Idea** lane tickets mirror the **New initiative** fields (card summary, problem, users, success, optional “more”, priority, intake); dock/size/download chrome is hidden for Idea; **`effectiveProductBrief`** merges vault **`initiatives.json`** `productBrief` with browser overrides; **`initiatives.json`** backfills **`productBrief`** for all Idea-lane cards (WhatsApp Integration exemplar + heuristic defaults). Discovery and later lanes keep the full tabbed ticket.

---

## [1.19.38] — Product dashboard: Paper v1 UI shell + agent PRD (2026-04-15)

**Before:** The orchestration UI did not fully match the **Product UI v1** Paper frames (wordmark row, lane chrome, primary **Create idea**, modal **Create draft** / intake, **Re-run discovery**).

**Now:** **[`06-Resources/PRDs/Current/Product_Dashboard_Paper_v1_UI.md`](06-Resources/PRDs/Current/Product_Dashboard_Paper_v1_UI.md)** is the agent-oriented build spec (OB/WP/VAL, DOM ID inventory, Paper MCP checklist). **`blueprint/product-dashboard/product-dashboard.css`** / **`index.html`** implement teal-forward tokens, **Wyzetalk** + **Product orchestration** header, open swimlane columns with white cards, **+ New idea** primary button, ticket **Save** and format bar **H2**, discovery **Re-run discovery**, new initiative **Create draft** / **Cancel** / **Intake source** / title hint — behaviour and vault **`fetch()`** unchanged.

---

## [1.19.37] — Paper plan: Markdown editing + Requirements = `/agent-prd` (2026-04-15)

**Before:** **`Paper_fresh_orchestration_UI.md`** framed artboard **04** with a thin **Requirements** sample; no explicit **documentation** formatting requirement or tie-in to **`/agent-prd`**.

**Now:** The plan documents **Markdown round-trip** editing (headings, paragraphs, bullet lists, **bold**, *italic*) for long-form ticket content; **Requirements** is defined as the **agent-oriented PRD** screen (Dex **`/agent-prd`**, `06-Resources/PRDs/`). **`ORCHESTRATION.md`** and **`CONCEPTS.md`** updated to match; **README** table line for **`Paper_fresh_orchestration_UI.md`**.

---

## [1.19.36] — Paper plan: Product Orch 01–05 only; Executive & Roadmap separate (2026-04-15)

**Before:** **`Paper_fresh_orchestration_UI.md`** listed six artboards including **06 Executive portfolio** in the same sequence as the board.

**Now:** The plan scopes **Product Orch** to **five** frames: **01** adds explicit **Create idea** (paired with **05** modal), **03** adds **Re-run discovery** when the brief changes, **02** / **04** unchanged in intent. **Executive** and **Roadmap** are documented as **separate full-page designs** (not in this artboard order); **Orchestration** is the landing. **`CONCEPTS.md`** / **`README.md`** updated to match.

---

## [1.19.35] — Product dashboard: Paper frames 06 + 02–04 UI alignment (2026-04-15)

**Before:** **Executive** was a table plus a list-style **Current focus** block with context mixed into the same box; the **ticket** showed lane only as a text row and **Design** was plain fields.

**Now:** **Executive** (`data-paper-ref="06 Executive portfolio"`) has an **Executive** title, optional **`executiveContext`** subtitle, **Current focus** as horizontal **chips** (click opens the ticket), and table headers aligned with the Paper brief (**Lane**, **Priority**). The **initiative dialog** (`02–04`) adds **tier** and **lane** pills, **Last updated** (after **Save**), a **Move lane** control (same rules as drag — **Discovery** still opens the review step), SVG **lock** affordance on gated tabs, and a **Design** **artifact** card with **Open**. Styling is in **`product-dashboard.css`**; vault behaviour unchanged.

---

## [1.19.34] — Product dashboard: Paper frame 01 design-to-code sync (2026-04-15)

**Before:** After reverting the custom Paper skills, the dashboard header was a single compact bar and **steering focus** cards had no **Focus** label.

**Now:** **MCP** `plugin-paper-desktop-paper` **`get_jsx`** / **`get_computed_styles`** on artboard **01 Orchestration board** drove the **app shell** (Newsreader title, subtitle, user row, tab row spacing) and **`main`** canvas padding. Cards with **`steeringFocus: true`** get class **`steering-focus`** plus a **Focus** line per the Paper plan. **`Paper_fresh_orchestration_UI.md`** remains the ordered prompt spec; behaviour (editing, lane gating, four-tab ticket) unchanged.

---

## [1.19.33] — Paper: revert custom workflow; design-to-code only (2026-04-15)

**Before:** Custom **`/paper-orchestration-sync`** skill, **`Paper_code_to_design.md`**, **`design-tokens.md`**, token sync script, and Paper-specific header/exec UI chrome added complexity beyond the Paper plugin’s **design-to-code** flow.

**Now:** Removed those artifacts. **README** / **`CONCEPTS.md`** / **`Paper_fresh_orchestration_UI.md`** document syncing **Paper → vault UI** via the plugin **design-to-code** skill and MCP **`plugin-paper-desktop-paper`**, while **preserving** four-tab ticket, lane gating, and vault behaviour. **Product dashboard** header restored to a single **Orchestration** bar (tabs + toolbar); **Current focus** back to a list.

---

## [1.19.28] — Product dashboard: fresh orchestration UI + four-tab ticket (2026-04-15)

**Before:** The dashboard used a **dark** theme, **Executive** was the default top tab, and the ticket used **Product PRD** vs **Workspace notes** only.

**Now:** **Light** theme (**Inter** + **Newsreader**, teal accent) via **`product-dashboard.css`**; **Orchestration** is the default view; the ticket has **Brief** \| **Discovery** \| **Requirements** \| **Design** with **lane gating**; **Design** adds **Figma**, **Design file URL**, and **Revision** (stored + export). Schema **`2.4.0`** (`designArtifactUrl`, `designRevision`); **`build_initiatives_from_prds.py`** emits **`2.4.0`**. **README** updated.

---

## [1.19.27] — Paper: fresh orchestration UI artboard prompts (2026-04-15)

**Before:** Artboard order and copy-paste prompts for a **fresh** (non–vault-clone) orchestration UI lived only in chat.

**Now:** **`blueprint/product-dashboard/Paper_fresh_orchestration_UI.md`** lists the sequence (board → ticket Idea/Discovery/Design → new initiative modal → executive), prerequisites for Paper Desktop + MCP, and full prompts for Cursor/Paper. Doc updated with **Cursor MCP id** `plugin-paper-desktop-paper` and optional note when frames are pushed to Paper from the agent.

---

## [1.19.26] — Product dashboard: product brief intake modal + `/agent-prd` skill (2026-04-15)

**Before:** **New idea** only asked for heading, description, stack, and priority — no alignment with **`/product-brief`** prompts, and no in-vault skill for **agent-oriented** PRDs ([the-vibe-pm `agent-prd`](https://github.com/davekilleen/the-vibe-pm/tree/main/skills/agent-prd)).

**Now:** The **New idea** dialog lists the same question rounds in a condensed form (required-style fields + **More** for constraints, journey, validation, dependencies), seeds **Workspace notes** with structured markdown, stores answers in **`productBriefById`** (included in **Export JSON**), shows **Product brief (idea intake)** on the ticket, and passes the brief into the **discovery agent prompt**. New **`.claude/skills/agent-prd/`** skill (upstream + Dex paths for `Product_ideas` / `PRDs` and QMD). **`/agent-prd`** listed in **CLAUDE.md**; **`product-brief`** skill documents the dashboard link.

---

## [1.19.25] — Product dashboard: executive + lanes sort by tier and `priority` (2026-04-15)

**Before:** The Executive table listed rows **by PDLC lane** (Idea, then Discovery, …), and saved **drag order** could override **`priority`**, so a **Next / P3** card could sit far down the page.

**Now:** Both the **Executive** table and **orchestration** columns sort by **`compareInitDefault`** — **tier** (Next before Current before Future), then **`priority`** (P1, P2, …), then title — so your **Next P1–P6** stack stays visible at the top. **README** documents that display order follows **`initiatives.json`** priorities.

---

## [1.19.24] — Product dashboard: stable `prd-{slug}` ids, rebuild-safe notes, tier UX (2026-04-14)

**Before:** Initiative ids and `Product_ideas` filenames embedded **Current/Next/Future**, so “Now” in the UI did not match paths; re-running **`build_initiatives_from_prds.py`** could overwrite discovery markdown; card copy did not surface workspace excerpts; discovery viewer showed raw frontmatter.

**Now:** **`prd-{slug}`** ids (slug from PRD filename) with optional collision suffix; **`prdTier`** / optional **YAML frontmatter** carry stack intent; builder **skips overwriting** touched workspace files and merges **frontmatter**; **`migrate_stable_ids.py`** + **`migration_id_map.json`** migrate old ids and rename files; **`index.html`** uses schema **2.3.0**, a **Workspace notes** hint on Idea/Discovery, and **stripFrontmatter** in the discovery viewer. Docs: **README**, **ORCHESTRATION**, **Product_ideas/README**, **initiatives.schema.json**.

---

## [1.19.23] — Product dashboard: `start_product_dashboard.sh --open` + Run Task (2026-04-14)

**Before:** You had to copy the printed URL into the browser after starting the static server.

**Now:** **`./start_product_dashboard.sh --open`** starts **`python3 -m http.server`** from the vault root and opens the dashboard URL (**`open`** on macOS, **`xdg-open`** on Linux when present). **`.vscode/tasks.json`** adds **Product dashboard: serve + open browser** (and a no-browser variant) for Cursor/VS Code.

---

## [1.19.22] — Product ideas folder + product dashboard Executive/orchestration + workboard pairing (2026-04-14)

**Before:** Discovery markdown lived under `product-dashboard/initiatives/` with fragile path logic; the Executive table mixed “Status” with PDLC; **Add idea** used timestamp ids; the Tasks **workboard** README said “deprecated only” with no clear link to the product surface.

**Now:** **`06-Resources/Product_ideas/`** holds pre-PRD workspace files with a README; **`build_initiatives_from_prds.py`** writes stubs there and sets vault-relative **`contextFile`** paths. **`index.html`** resolves `06-Resources/…` for fetch and agent prompts, adds **Current focus** / **`executiveContext`**, **Tier / PDLC / Progress / Next milestone**, link **copy-to-clipboard**, **Workflow status** and **Intake** chips, and **title-derived** ids for new ideas (`idea-{slug}`). **`initiatives.schema.json`** v2.2 documents the new fields. **Workboard** README positions Tasks vs Product dashboard and adds a header link. **`ORCHESTRATION.md`** and **product-dashboard README** updated. Search routing notes **`06-Resources/Product_ideas`** under the resources fallback.

---

## [1.19.21] — RSS fetch: TLS via `certifi` + env CA bundle; `intel_feeds.local.json` / `INTEL_FEEDS_FILE` (2026-04-14)

**Before:** HTTPS RSS could fail with **`CERTIFICATE_VERIFY_FAILED`** on some Python installs; there was no documented, secure pattern for **corporate CAs** or **private feed URLs**.

**Now:** **`fetch_intel_rss.py`** calls **`configure_tls_trust()`** — uses **`SSL_CERT_FILE`** / **`REQUESTS_CA_BUNDLE`** when set, otherwise **`certifi`** (added to **`requirements.txt`**). Verification is never disabled. **`--feeds`** and **`INTEL_FEEDS_FILE`** select the JSON path; **`intel_feeds.local.json`** (gitignored) is merged into **`feeds`**. **README**, **WEEKLY_AUTOMATION**, and **`.gitignore`** document the flow.

---

## [1.19.20] — `/weekly-exec-intel` skill + weekly synthesis folder + scheduled fetch wrapper (2026-04-14)

**Before:** Marketing-led weekly narrative for **Product** and **Executive** had no dedicated skill, no **`synthesis/weekly/`** template, and no documented **one-shot + cron/launchd** path tied to RSS fetch.

**Now:** **`/weekly-exec-intel`** (`.claude/skills/weekly-exec-intel/SKILL.md`, `.agents` stub) runs after **`run-weekly-intel-fetch.sh`** and produces **`YYYY-MM-DD_weekly_exec_brief.md`** from **`synthesis/weekly/_template_weekly_exec_brief.md`**. **`WEEKLY_AUTOMATION.md`** documents scheduling. **`Market_intelligence/README.md`**, **`Market_and_deal_signals.md`**, and **`CLAUDE.md`** link the skill.

---

## [1.19.19] — Market intelligence: RSS fetch pipeline (`fetch_intel_rss.py`) (2026-04-14)

**Before:** Newsletter ingest relied on **manual** paste into `ingest/newsletters/<slug>/`; there was no standard way to pull **RSS** into the vault before `/intelligence-scanning`.

**Now:** **`fetch_intel_rss.py`** reads **`06-Resources/Market_intelligence/intel_feeds.json`**, fetches each feed since the last run (or **`--since-days`**), dedupes by URL, and writes **`YYYY-MM-DD__title-slug__hash.md`** under the right slug folder with YAML frontmatter. **`feedparser`** is listed in **`.scripts/market-intelligence/requirements.txt`**. **`intel_feeds.example.json`** documents the shape; **`WORKFLOW.md`**, **`.scripts/market-intelligence/README.md`**, **`ingest/README.md`**, and **`intelligence-scanning`** include an optional **step 0** to run the script first.

---

## [1.19.18] — Market intelligence: ingest folders documented + `ingest/README.md` (2026-04-13)

**Before:** Slugs existed under `ingest/youtube/` and `ingest/newsletters/` and in **`sources_manifest.yaml`**, but nothing in-vault explained **which folder is for what** (HR, engagement, AI, deskless) or how that ties to scanning.

**Now:** **`06-Resources/Market_intelligence/ingest/README.md`** is the index (tables + “quick pick” by theme). **Newsletter** and **YouTube** ingest READMEs point to it and the manifest. Missing manifest slugs **`hr-leaders`**, **`open-letter`**, **`newsletters/josh-bersin`** now have folders. **`intelligence-scanning`** skill step 1 references the ingest index.

---

## [1.19.17] — Product dashboard: idea vs PRD model (`prdStage`, modal gating) (2026-04-13)

**Before:** Any initiative with a **PRD** link tried to load **`06-Resources/PRDs/...`** in the ticket, even in **Idea** / **Discovery**, conflating a short **card line** with a full spec.

**Now:** **`prdStage`** in schema / export: **`none`** | **`draft`** | **`spec_ready`** (inferred from **lane** if missing: Idea & Discovery → **none**, Design → **draft**, Spec ready+ → **spec_ready**). **Product PRD** tab and **fetch** only when **draft** or **spec_ready**. **Idea / Discovery** use **Workspace notes** + **Card summary (idea)**; footer explains vault PRD path is for **after Spec ready**. **`build_initiatives_from_prds.py`** emits **`prdStage`**. **ORCHESTRATION.md** / **README** updated.

---

## [1.19.16] — Product dashboard: ticket always opens at lg; full height with 10px top/bottom (2026-04-13)

**Before:** **lg** used **`top: 0; bottom: 0`**; ticket **height tier** was **persisted** in **`localStorage`**, so a saved **md**/**sm** could reopen short.

**Now:** **lg** uses **`top: 10px; bottom: 10px`** (`--ticket-inset`). **Every card open** calls **`applyTicketSize("lg")`**. **Ticket size is no longer stored** in the browser — **− / +** only affect the current session until you close or open another card.

---

## [1.19.15] — Product dashboard: full-height ticket (lg), compact card summary (2026-04-13)

**Before:** Expanded ticket used **10px** viewport insets; **Card summary** could grow with resize; the document area did not clearly own “the rest” of the panel.

**Now:** **lg** is **`top: 0; bottom: 0`** (full window height; **width** unchanged). **Card summary** is a **fixed short textarea** (~3–4 lines, **resize off**, scroll if needed); **Product PRD / format / document** + footer use flex with **`#md-wysiwyg`** **`flex: 1`** filling remaining height.

---

## [1.19.14] — Product dashboard: ticket tiers — lg = 10px top/bottom, + / − expand & shrink (2026-04-13)

**Before:** Base styles pinned **all** sizes to full viewport height, so **md** and **lg** were the same and **+** did nothing useful; **default** was **md** (~58% height), not the “10px from top and bottom” layout.

**Now:** **lg** = **`top: 10px; bottom: 10px`** (full usable height). **md** and **sm** = bottom-anchored with **max-height** (~58% / ~38% caps). **Default** size is **lg** (stored preference still respected). **− / +** steps **sm → md → lg**.

---

## [1.19.13] — Product dashboard: `start_product_dashboard.sh` serves vault root (PRD fetch works) (2026-04-13)

**Before:** The helper script **`cd`’d into `product-dashboard/`** and ran `http.server` there. **`initiatives.json`** loaded, but **PRD** `fetch` to `../../PRDs/...` failed (path above the server root), so the ticket showed “could not be loaded from the local server.”

**Now:** The script **`cd`’s to the vault root** (three levels up), validates **`06-Resources/.../index.html`**, prints the **full open URL**, then serves. **README → Run locally** documents **Preferred: `./start_product_dashboard.sh`**.

---

## [1.19.12] — Product dashboard: ticket modal full viewport height (10px top + bottom) (2026-04-13)

**Before:** **Medium / large** ticket sizes used **vh** caps (e.g. ~58%), leaving a large empty band above the panel.

**Now:** **Medium** and **large** use **`top: 10px` and `bottom: 10px`** so the modal fills the viewport between the two gutters. **Small** (−) stays a shorter bottom sheet.

---

## [1.19.11] — Product dashboard: ticket top inset + why PRD fetch needs vault-root server (2026-04-13)

**Before:** The ticket panel had bottom viewport inset but no matching top clearance / inner top padding; README implied any `http.server` folder was fine.

**Now:** **10px** inner padding at the **top** of the ticket panel (matches bottom), and **max-height** caps use **`calc(100vh - 20px)`** so expanded sheets stay **10px** below the viewport top. **README → Run locally** explains serving the **vault root** so `../../PRDs/...` resolves; the ticket editor’s load error text points to **`file://`** and wrong server root.

---

## [1.19.10] — Product dashboard: ticket dialog bottom-anchored, hidden until open, resize (2026-04-13)

**Before:** The ticket panel read as a “top” overlay; some layouts looked always-on; height was fixed.

**Now:** The ticket `<dialog>` is **`display: none` until `[open]`** (only after clicking a card). The panel is **anchored to the bottom** of the viewport (**10px** from the bottom edge), with **10px inner padding** at the bottom of the panel. **Width** and toolbar button styling are unchanged. **− / +** shrink or grow height (**small / medium / large**, remembered in the browser). Dock **◀ ⊙ ▶** unchanged.

---

## [1.19.9] — Product dashboard: ticket panel no longer covers the whole screen (2026-04-13)

**Before:** The ticket editor used the full viewport, hiding the Executive/Orchestration context.

**Now:** Opening a card shows a **large semi-modal** (~76–88% width, shorter than full height) with a **lighter backdrop** so the board stays visible. **◀ ⊙ ▶** dock the panel **left**, **centre**, or **right** (preference saved in the browser). **×** closes the panel and returns to the board.

---

## [1.19.8] — Product dashboard: fullscreen ticket + friendly document editor (2026-04-13)

**Before:** The card editor was a small dialog with a short description only; PRD content lived elsewhere.

**Now:** Opening a card fills the screen. The **Product PRD** tab loads the first linked `06-Resources/PRDs/.../*.md` (e.g. AI Assistant FAQ); **Workspace notes** loads `initiatives/<id>.md`. Content is shown as an editable **rich** area (Markdown in/out via **marked** + **Turndown**), with simple formatting controls. Edits are stored in the browser under **`mdOverrideByVaultPath`** until **Save** or **Export JSON**; **Download .md** saves the current tab for pasting back into the vault.

---

## [1.19.7] — Product dashboard: status bar on card edit (2026-04-13)

**Before:** Stack / tier was only visible as a badge, not editable when opening a card.

**Now:** The **Edit** dialog includes a **Status** bar: **Now** (maps to `Current`), **Next**, **Future**, **Backlog**. Choice is stored in the browser (`prdTierById`) and merged into **`prdTier`** on export; the Executive table column is labelled **Status** and badges show **Now** for current focus.

---

## [1.19.6] — Product dashboard: gated Discovery + agent prompt + file viewer (2026-04-13)

**Before:** Dropping a card on **Discovery** moved it immediately and only copied a short prompt.

**Now:** Dropping **into Discovery** opens a **review** modal (validate heading and description). **Move to Discovery and start** moves the card, copies a **long Cursor-ready agent prompt** (problem formulation, evidence, solution directions, novel ideas, risks, structured `##` sections for the markdown file), and opens a **Discovery file** dialog with the vault path, **Copy path**, **Copy prompt again**, **Refresh** (loads `initiatives/<id>.md` via the local server). Custom ideas get a stable `contextFile` path. Cards already in Discovery show **View file** in the card editor.

---

## [1.19.5] — Product dashboard UI: Idea column +, clean editor, order, discovery kick (2026-04-13)

**Before:** Add-idea lived in a top toolbar; the detail panel mixed markdown preview and extra orchestration copy; entering **Discovery** did not start a workflow automatically.

**Now:** **+** sits in the **Idea** column only. The card editor is plain **heading**, **description**, **Figma**, and **Save**. Cards can be **reordered vertically** within a lane (order + lane moves export together). Default stack in **Idea** is **Next** toward the top and **Future** toward the bottom; manual order wins once you drag. Moving a card **into Discovery** from another lane **copies a discovery prompt** to the clipboard and shows a short status line.

---

## [1.19.4] — Product dashboard: idea-first PDLC orchestration (2026-04-13)

**Before:** The product dashboard could read like a mixed task/doc board; the first lane was **Intake**, and regeneration leaned on legacy workboard JSON.

**Now:** Orchestration is **ideas-only** (feature concepts with PRD homes, not operational tasks). The first lane is **Idea**; **`build_initiatives_from_prds.py`** rebuilds **`initiatives.json`** from **`06-Resources/PRDs/{Current,Next,Future}/`** (Current → mostly **Test/UAT**, WhatsApp + Payslip → **In build**, Next/Future → **Idea**). **`index.html`** adds **Add idea**, tier/priority badges, **Figma** storage, **Copy discovery prompt**, and **`ORCHESTRATION.md`** documents stage expectations. **`migrate_from_workboard.py`** is legacy-only.

---

## [1.19.3] — Product dashboard replaces workboard as primary (2026-04-13)

**Before:** The Dex **workboard** (`work-items.json` + Kanban + optional `workboard_server.py`) mixed tasks, roadmap, and PDLC doc stages in one heavy UI.

**Now:** **`blueprint/product-dashboard/`** — **`initiatives.json`** (schema: `initiatives.schema.json`), per-initiative **`initiatives/*.md`** context stubs, **`index.html`** with **Executive** and **Orchestration** (seven swim lanes). Legacy workboard JSON archived under **`product-dashboard/archive/`**; **`migrate_from_workboard.py`** can regenerate from `../workboard/*.json`. **`workboard/README.md`** points here; `.claude/launch.json` adds **`product-dashboard`** (port **8766**).

---

## [1.19.2] — Calendar MCP AppleScript fallback (2026-04-13)

**Before:** Calendar tools used EventKit only. On some Mac setups (e.g. Python.org `python3` not tied to **Calendars** TCC the same way as **Terminal**), Cursor never appeared under **Privacy & Security → Calendars**, so listing events from Dex inside Cursor failed.

**Now:** The calendar MCP **falls back to AppleScript** (Calendar.app) when EventKit fails, using the same shell helpers as before. Responses may include **`transport": "eventkit"`** or **`"applescript"`**. Grant **Automation → Calendar** for Cursor if macOS prompts.

---

## [1.19.1] — Auto-link people script (2026-04-09)

**Before:** `CLAUDE.md` documented `node .scripts/auto-link-people.cjs` but the script was not shipped in the vault.

**Now:** **`.scripts/auto-link-people.cjs`** loads people from **`05-Areas/People/{Internal,External}`** (skips `README.md`), matches **display names** (from each file’s `#` title) with longest-first priority, links **unambiguous first names**, and skips **frontmatter**, **fenced code**, **existing `[[wiki links]]`**, and **inline `` `code` ``**. **`--today`** processes **`Tasks.md`**, **`Week_Priorities.md`**, and today’s **`00-Inbox/Meetings`** / **`07-Archives/Plans`** files.

**Usage:** `node .scripts/auto-link-people.cjs <path/to/file.md>` or `--today`.

---

## [1.19.0] — Semantic Search Now Covers Your Entire Vault (2026-03-23)

### 🔍 Semantic Search Now Covers Your Entire Vault

**Before:** Smart search only covered 6 folders — meetings, people, projects,
accounts, tasks, and goals. Finding anything in your PRDs, plans, or session
learnings required remembering exact keywords.

**Now:** Semantic search covers 14 collections across your whole vault.
PRDs, implementation plans, session learnings, and resource docs are all
searchable by meaning.

**Result:** Ask "what did we decide about notifications?" or "find past work
on MCP integration" — Dex finds the right content wherever it lives.

**To pick up new collections:** Run `/enable-semantic-search`.

---

## [1.18.19] — Workboard: Page Builder copy + Future roadmap + Then↔Future drag (2026-03-30)

**Roadmap:** **Future phase** is a **collapsible** block **below Then** (above Milestones). **Then** and **Future** share **draggable** cards — move items between phases for prioritisation (**Now** stays fixed). Order persisted in **`localStorage`** (`dex-roadmap-then-future-v2`). **Future** lists **every `PRDs/Future/*.md` theme** (index + `Discovery_backlog` + one card per theme file). **Page Builder** copy + **`Page_Builder.md`** + **`pdlc-doc-items.json`** as before.

**What you need to do:** **`python3 sync_tasks_to_workboard.py`** then **`python3 build_index.py`** in **`blueprint/workboard/`** when **`Tasks.md`** changes without the server.

---

## [1.18.18] — Workboard: swim lanes, roadmap MRR placement, PDLC doc tab (2026-03-26)

**Tasks:** Merged **Daily plan** into **Tasks** — **Today's focus** swim lane on top and **All tasks** below; same four columns in each lane; cards drag **between lanes** and **across columns**. Persisted as `swimLane` (`daily` / `main`) in **`work-items.json`** when using **`workboard_server.py`**.

**Roadmap:** **Est. platform MRR** bar chart moved **below Milestones** and **above** the migration phasing **table**. Bars use **Now** (green) vs **Then** (blue). Milestones **Q3+Q4 2026** condensed to **H2 2026 (Then)**; **2027 Q1+Q2** labelled **H2 2027 (Then)**.

**PDLC doc process:** Replaced **Pipeline** tab with **PDLC doc process** — four stages **Discovery · Design · Develop · Deploy**; draggable cards; **`pdlc-doc-items.json`** + embedded JSON; **`localStorage`** (`dex-pdlc-doc-v1`) for stage moves. Footer note: future **orchestration** on stage change is optional.

**What you need to do:** Run **`python3 build_index.py`** in **`blueprint/workboard/`** after editing **`pdlc-doc-items.json`** or the template. Re-run after **`/daily-plan`** sync as usual.

**Docs:** **`workboard/README.md`** tabs table matches the new layout; **`/daily-plan`** skill Step 9 notes **Today's focus** lives in the **Tasks** swim lane.

---

## [1.18.17] — PRDs: Current / Next / Then / Future layout (2026-03-26)

**Changed:** **`06-Resources/PRDs/`** now uses four feature folders — **`Current/`** (Wyzetalk Essential PRDs + acceptance criteria), **`Next/`** (specified post-GA stubs: SSO, Elevated Auth, scheduled content & messaging, Smart HR, analytics, Explorer, Page Builder, templates), **`Then/`** (README for discovery → design → dev pipeline before a spec joins **Current**), **`Future/`** (pre-PRD theme stubs; renamed from **`discoveries/`**). Cross-cutting files (**product map**, **evidence**, **cross-cutting questions**) stay at **`PRDs/`** root. **`PRDs/README.md`**, **`PRD_Product_Map.md`**, **`Evidence_register.md`**, and internal links were updated for **`Current/`** paths.

**What you need to do:** Link Essential specs from **`Current/`**; use **`Then/`** when a theme leaves exploration; move shipped Next work into **`Current/`** and refresh **`README.md`**.

---

## [1.18.16] — PRDs: Next discovery stubs folder (2026-03-26)

**Added:** **`06-Resources/PRDs/Next/discoveries/`** — one markdown stub per pre-PRD theme (AI assistant, employee chat, notification prefs, IT self-service, onboarding, file manager, localization, polls, forms, billing self-serve, security deep dive, moderation/mentions/celebrations, in-app feedback, rewards, org calendar, shift/roster, feed stance, Page Builder streams). Index: **`discoveries/README.md`**.

**Changed:** **`Next/Discovery_backlog.md`** is now a **short hub** pointing at **`discoveries/`** instead of inline prose for every theme. **`Next/README.md`**, **`PRDs/README.md`**, and **`WhatsApp_Smart_HR.md`** links updated accordingly.

**What you need to do:** Edit the theme file under **`discoveries/`**; when a theme becomes a formal Next PRD, follow the promote steps in **`discoveries/README.md`**.

---

## [1.18.15] — PRDs: Next-phase discovery backlog (2026-03-28)

**Added:** **`06-Resources/PRDs/Next/Discovery_backlog.md`** — pre-PRD themes (AI assistant + chat, notification preferences, IT self-service, onboarding, file manager, dynamic i18n, polls, forms, billing, security deep dive, moderation + mentions + celebrations, in-app feedback, rewards & recognition, org calendar, roster integrations, social feed evolution, Page Builder streams TBD). Linked from **`PRDs/README.md`** and **`Next/README.md`**. **`WhatsApp_Smart_HR.md`** nudged toward policy-grounded answers and the backlog.

**What you need to do:** When discovery starts, promote items from the backlog into **`Next/*.md`** stubs per **Next/README** merge guidance.

---

## [1.18.14] — Daily plan: workboard refresh without auto-opening browser (2026-03-26)

**Before:** The **`daily-plan-workboard.cjs`** Stop hook synced the workboard, could start **`workboard_server.py`**, and **`open`**’d **http://127.0.0.1:8765/** after **`/daily-plan`**.

**Now:** The hook only runs **`sync_tasks_to_workboard.py`** + **`build_index.py`**. **No** server spawn and **no** browser launch — open the board manually when you want it.

**What you need to do:** If you rely on the UI, run **`python3 workboard_server.py`** (or your LaunchAgent) and open **http://127.0.0.1:8765/** yourself.

---

## [1.18.13] — Work dashboard: tabs (Kanban, daily, cascade, Exco) + pillar colours (2026-03-26)

**Before:** Planning panels and the Kanban board were on one long page, and there was no dedicated **Exco-ready** program view.

**Now:** The workboard uses **four tabs**: **Tasks · Kanban** (all cards); **Daily plan** (latest `07-Archives/Plans` brief, **Today’s focus** checkboxes tied to task ids, and the **same** Kanban); **Plan cascade** (quarter outcomes → week Top 3 → task chips, **pillar-coloured** from `System/pillars.yaml`); **Roadmap · Exco** (Essential elevator pitch, **milestone timeline**, migration program, Now/Then). **`index.template.html`** is the editable UI; **`build_index.py`** merges **`work-items.json`** + **`build_dashboard_context`** into **`index.html`**. Any drag or focus checkbox uses the same **`POST /api/save`** path as before.

**What you need to do:** After UI edits, run **`python3 build_index.py`** from `workboard/`. Keep **`workboard_server.py`** running for vault writes.

---

## [1.18.12] — Work dashboard: quarter, week, roadmap, daily plan + Kanban (2026-03-26)

**Before:** The workboard UI was **Kanban-only**, so the quarter → week → task ladder was easy to lose while dragging cards.

**Now:** The same URL embeds **planning context** above the board: **Q1 outcomes** from `01-Quarter_Goals/Quarter_Goals.md`, **this week’s Top 3** from `02-Week_Priorities/Week_Priorities.md` with **`[[^task-…]]` chips** that jump to the matching card, **Q2 roadmap** goals plus Essential launch / Now–Then links, and the latest **`07-Archives/Plans/*.md` TL;DR**. Regenerates whenever **`build_index.py`** runs (after **`sync_tasks_to_workboard.py`** or saving from **`workboard_server.py`**).

**What you need to do:** Refresh **http://127.0.0.1:8765/**. Run **`/daily-plan`** so **`07-Archives/Plans/`** stays current for the daily panel. Optional: **`python3 build_dashboard_context.py`** in `workboard/` writes **`dashboard-context.json`** for inspection.

---

## [1.18.11] — Competitor profiles: **Wyzetalk** prose + Sentiv frontmatter (2026-03-27)

**Vs** sections in **`06-Resources/Competitors/profiles/`** now use bold **Wyzetalk** instead of vault **`[[Wyzetalk]]`** links for readable exports and PDFs. **`Sentiv.md`** frontmatter restored to valid YAML (was corrupted).

**What you need to do:** Nothing — Obsidian wiki-links to **Wyzetalk** elsewhere in the vault are unchanged.

---

## [1.18.10] — Competitors: Sentiv + Teamwire (2026-03-27)

**New profiles:** **[Sentiv](06-Resources/Competitors/profiles/Sentiv.md)** (mission-critical comms, ex–**Altron Nexus** MBO May 2025) and **[Teamwire](06-Resources/Competitors/profiles/Teamwire.md)** (EU **secure business messenger**) with **SA partnership** surfaced on **[LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7440477679377817601)**. Indexed in **[COMPETITOR_INDEX.md](06-Resources/Competitors/COMPETITOR_INDEX.md)**; **`EV-2026-03-006`** in **[Evidence_register.md](06-Resources/PRDs/Evidence_register.md)**; signal row in **[Market_and_deal_signals.md](06-Resources/Market_and_deal_signals.md)**.

**What you need to do:** Use profiles for **government / EMS / municipal / critical-infra** RFPs where **governed messaging** is bundled separately from **employee EX**.

---

## [1.18.9] — Industry research vault summaries (2026-03-26)

**Frontline / deskless PDFs** from your **`Industry research reports`** tree are now **partially extracted into Markdown** under **`06-Resources/Research/Industry_research_reports/summaries/`**, with **`_INDEX.md`**, **`README.md`**, and **`source_pdf`** paths that **keep the same filenames and folders** for a future SharePoint MCP. **PDFs are not in git** (`.gitignore`); canonical files stay in SharePoint. Ingest script: **`.scripts/research-ingest/extract_industry_reports.py`** (`pypdf`).

**What you need to do:** Re-run the script when you add PDFs. Link summaries from **`03-Tasks/Tasks.md`** or planning notes when a task depends on that evidence.

---

## [1.18.8] — Workboard two-way sync + optional always-on server (2026-03-26)

**Vault → board:** New script **`blueprint/workboard/sync_tasks_to_workboard.py`** merges **`03-Tasks/Tasks.md`** (lines with `[[^task-…]]`) into **`work-items.json`**, preserves rich fields on existing cards, then runs **`build_index.py`**. **`daily-plan-workboard.cjs`** runs this before embedding HTML so **`/daily-plan`** picks up assistant/task changes without opening the board first.

**macOS:** **`com.dex.workboard.plist.example`** documents a LaunchAgent so **`workboard_server.py`** can run at login (bookmark **http://127.0.0.1:8765/** — no daily terminal step).

**What you need to do:** After editing tasks only in chat, run `python3 sync_tasks_to_workboard.py` from `workboard/` (or run **`/daily-plan`**). For “always on,” install the LaunchAgent once per README.

---

## [1.18.7] — Daily plan opens workboard (2026-03-24)

**`/daily-plan`** now ends with the **Kanban workboard**: `build_index.py` refreshes embedded `index.html`, `daily-plan-workboard.cjs` (Stop hook) starts `workboard_server.py` if port 8765 is free, and opens **http://127.0.0.1:8765/**. The skill also documents **Step 9** so the assistant runs the same refresh when hooks are not used.

**What you need to do:** Nothing extra — finish `/daily-plan` as usual; the board opens after the plan. If you already keep the server running, only the URL opens again.

---

## [1.18.6] — Fork docs + repo hygiene (2026-03-25)

**Fork clarity:** Added **[FORK_MAINTENANCE.md](FORK_MAINTENANCE.md)** (remotes, `upstream/release` merges, what stays local) and a short pointer from **[README.md](README.md)**. **[06-Resources/README.md](06-Resources/README.md)** now links the legacy **Intel/** path; **[00-Inbox/Daily_Plans/README.md](00-Inbox/Daily_Plans/README.md)** points canonical `/daily-plan` output to **`07-Archives/Plans/`**. **`.gitignore`** ignores `.scripts/market-intelligence/.venv/`.

**What you need to do:** Keep using `origin` for your vault pushes; merge **`upstream/release`** (or `/dex-update`) for Dex core. Drop stale `git stash` entries if you no longer need pre-merge snapshots.

---

## [1.18.5] — Deal won/lost analysis reference (2026-03-20)

HubSpot export **`Deal Won vs Lost Analysis 2025.xlsx`** is now summarized in **`06-Resources/Market_intelligence/synthesis/Deal_Won_Lost_Analysis_Reference.md`**: loss reasons (HubSpot + themes), dated deal table, wins snapshot, and links from **`Market_and_deal_signals.md`** and **`Market_intelligence/README.md`** / **`ARCHITECTURE.md`** for decision context.

**What you need to do:** Open that file when shaping product, pricing, or GTM; re-run extraction when the spreadsheet is refreshed.

---

## [1.18.4] — Work board Kanban syncs to Tasks.md (2026-03-23)

The Kanban in `blueprint/workboard/` could only persist column moves in the browser. **`workboard_server.py`** (run locally) serves the same UI and **`POST /api/save`** writes **`work-items.json`**, regenerates **`03-Tasks/Tasks.md`** from board state (checkboxes: todo / in progress / on hold / done), and runs **`build_index.py`** so the embedded HTML stays aligned.

**What you need to do:** From `workboard/`, run `python3 workboard_server.py` and open http://127.0.0.1:8765/ — drag cards to update the vault without hand-editing `Tasks.md`.

---

## [1.18.3] — Market intelligence skills + evidence traceability (2026-03-20)

Market workflows lived only under `.agents/skills/`, so `/intelligence-scanning` and related commands were easy to miss. **Canonical skills** now live in `.claude/skills/` (same as other slash commands); `.agents/skills/` keeps **short stubs** that point at those files so nothing drifts. `process-meetings` follows the same pattern.

**Also:**

* `06-Resources/Intel/[[README]].md` explains the legacy `Intel/` path vs the active **`Market_intelligence/`** hub; `core/paths.py` adds `MARKET_INTELLIGENCE_DIR`.
* Example **`EV-2026-03-001`** row in `PRDs/Evidence_register.md` with a pointer from `Posts.md` — proof of the discovery → PRD link.
* `06-Resources/Market_intelligence/ARCHITECTURE.md` documents the flow (mermaid) and known gaps.

**What you need to do:** Use `/intelligence-scanning`, `/daily-intelligence-brief`, and `/weekly-market-discovery` like any other skill; optional: read `06-Resources/Market_intelligence/ARCHITECTURE.md`.

---

## Dex core (merged with this update) — Fix Python install + Atlassian MCP (2026-03-21)

**Python/pip fix (affects most macOS users with Homebrew):**

`install.sh` and `/dex-update` used `pip3` to install Python helpers, which fails on modern Macs with Homebrew Python (and recent Linux) due to a Python safety rule called PEP 668 — the system refuses direct pip installs. The `--user` fallback also fails in many setups.

Dex now creates a private sandboxed Python environment (`.venv/`) inside your vault folder and installs all dependencies there. This works on all platforms and never touches your system Python.

**What changed:**
* `install.sh` creates `.venv/` and installs deps via the venv pip — no more PEP 668 errors
* `.mcp.json` now points MCP servers to the venv Python instead of system `python3`
* `/dex-update` uses the venv pip when updating dependencies, creating the venv first if upgrading from an older Dex install
* Windows path handled automatically (`.venv/Scripts/python.exe`)

**Atlassian MCP fix:**

`/atlassian-setup` and `.mcp.json.example` referenced `@anthropic/atlassian-mcp` — a package that doesn't exist on npm. Atlassian's official MCP is a remote server, not an npm package.

**What changed:**
* Atlassian MCP config now uses `mcp-remote@latest` pointing to `https://mcp.atlassian.com/v1/sse`
* No credentials needed in the config — authentication is handled via the OAuth browser flow

**What you need to do:** Run `/dex-update` to get these fixes. If your install previously failed on the Python step, run `./install.sh` again.


---

## [1.18.2] — Fix Background Meeting Sync Installation (2026-03-12)

`install-automation.sh` failed because it referenced two files that no longer exist: `granola-auth.cjs` (deprecated — Granola now stores credentials in `supabase.json` automatically) and `sync-from-granola-v2.cjs` (never shipped — v1 works fine).

**What changed:**

* Plist template now points to `sync-from-granola.cjs` (the script that actually exists)
* Install script checks for `supabase.json` instead of calling the removed `granola-auth.cjs`
* No more interactive browser auth step — Granola handles credentials automatically
* `--auth` flag now checks credential status instead of launching a dead script

**What you need to do:** Run `./install-automation.sh` again — it should complete without errors now.

---

## [1.18.1] — Meeting Sync Now Works Reliably Again (2026-03-05)

In v1.17.0, we switched background meeting sync to use Granola's official MCP server — thinking the "official" route would be more reliable. Turns out, the MCP server sends meeting data back in a format designed for AI to read in conversation, not for code to process in the background. The sync script expected structured data, got free-form text, couldn't make sense of it, and quietly fell back to old cached data. Meetings were going missing with no error message.

We've switched to using Granola's direct API instead. It returns clean structured data, includes mobile recordings, and uses the same credentials Granola already stores on your machine — no separate sign-in needed.

**What this means for you:**

* Meeting sync is reliable again — no more silent failures
* Mobile recordings still sync (that wasn't the problem — the data source was)
* One fewer thing to authenticate: no separate Granola MCP sign-in step
* If you previously ran through the MCP OAuth setup, you don't need to do anything — the new approach uses your existing Granola sign-in automatically

**What changed under the hood:**

* Background sync now uses Granola's direct API (`api.granola.ai`) instead of the MCP server
* Removed `granola-mcp-client.cjs`, `granola-auth.cjs`, and `check-granola-migration.cjs` — no longer needed
* Local cache remains as fallback for offline scenarios

---

## [1.18.0] — Intelligent Model Routing Metadata + Safer Skill Updates (2026-03-02)

Dex skills now carry explicit model-routing metadata so cheap/fast models can be used for simple work while higher-tier models stay reserved for heavier thinking.

**What this means for you:**
- Many built-in skills now declare `model_hint` or `model_routing` in `SKILL.md`
- Routing metadata is now standardized across the core skill catalog
- Update flow now has a skill-aware conflict resolver for routing metadata

**Conflict handling improvement:**
- During `/dex-update`, conflicted skill files can now be auto-resolved by:
  - keeping your local skill instructions/custom edits
  - merging upstream routing metadata (`model_hint`, `model_routing`)
  - skipping `*-custom` skills completely

This reduces update friction for users who customize built-in skills while still letting new model-routing behavior land safely.

---

## [1.17.0] — Mobile Meeting Recordings Now Sync Automatically (2026-03-01)

If you record meetings on your phone with Granola, those recordings now appear in Dex alongside your desktop meetings. No manual import, no extra steps — they just show up.

This is powered by Granola's official integration, which means it's more reliable and officially supported. Dex will prompt you to sign in to Granola in your browser (takes about 10 seconds), and after that, mobile recordings sync automatically in the background.

**What this means for you:**
- Meetings recorded on your phone now appear in Dex alongside desktop recordings
- One-time sign-in: Dex prompts you when it's time, and walks you through it
- Everything keeps working while you set up — your existing meetings aren't affected

**Behind the scenes:**
- Background sync now uses Granola's official MCP server instead of a custom integration
- Automatic fallback to local data if the cloud connection is temporarily unavailable
- Migration detection tells you when the upgrade is available — no guesswork

**If you set up Dex before this update:** Run `/dex-update` and Dex will detect the upgrade opportunity. When you next run `/process-meetings`, it'll offer to connect you to Granola's official API.

---

## [1.16.0] — 🕷️ Scrapling is your default web scraper (2026-03-01)

When you share a URL with Dex — an article, a blog post, a page you want summarized — it now uses **Scrapling** every time. Scrapling is free, runs on your machine, and handles sites that block other tools (including Cloudflare-protected pages).

**What this means for you:**
- Share a URL, get the content. No API keys, no credits, no limits.
- Sites that used to come back empty (anti-bot protection) now work out of the box.
- Your data never leaves your machine — Scrapling fetches locally, not through a cloud service.

**What changed under the hood:** Dex now has a safety guard that enforces Scrapling as the default. If the AI ever tries to use a different scraper, the guard catches it and redirects to Scrapling automatically. You don't need to do anything — it just works.

**If you set up Dex before this update:** Run `/dex-update` and Scrapling will be added to your tools automatically. If it asks you to install it, just run: `pip install "scrapling[ai]" && scrapling install`

---

## [1.15.0] — 🔌 The Integrations Release (2026-02-19)

This is a big one. Dex now connects to 8 tools where your real work happens — and it goes both ways. Complete a task in Dex and it's done in Todoist. Get an email flagged in your morning plan because someone hasn't replied in 3 days. See your Jira sprint status right next to your weekly priorities.

Some of you have already been building your own integrations using `/create-mcp` and `/integrate-mcp` — and honestly, that's impressive. But Dave kept hearing the same thing: "I just want to get up and running without figuring out the plumbing." So it's built in now.

---

### 🔗 8 integrations, ready to go

Each one takes a few minutes to set up. Run the command, answer a couple of questions, and you're connected. Dex tells you exactly what changed — which skills got smarter, what new capabilities unlocked.

**Communication:**
- **Slack** (`/slack-setup`) — Chat context in your daily plan and meeting prep. Unread DMs, mentions, active threads. No admin approval needed — just Slack open in Chrome. 2-minute setup.
- **Google Workspace** (`/google-workspace-setup`) — Gmail, Google Calendar, and Docs in one connection. Email digest in your morning plan. Follow-up detection flags emails waiting for replies: "Sarah hasn't replied to your pricing email from Monday." Meeting prep shows recent email exchanges with attendees. 3-minute setup.
- **Microsoft Teams** (`/ms-teams-setup`) — Same as Slack but for Teams users. Works alongside Slack — both digests appear, clearly labeled. If your company uses both, Dex handles both.

**Task Management:**
- **Todoist** (`/todoist-setup`) — Two-way task sync. Create in Dex, appears in Todoist. Complete on your phone, done in Dex. Your pillars map to Todoist projects. 1-minute setup.
- **Things 3** (`/things-setup`) — Two-way sync for Mac users. No account needed, works offline, pure local sync via AppleScript. Your pillars map to Things Areas, P0/P1 tasks go straight to Today. 30-second setup.
- **Trello** (`/trello-setup`) — Board sync. Cards become tasks. Move a card to "Done" and it's complete in Dex. Your Kanban board and your task list stay in sync.

**Meetings & Knowledge:**
- **Zoom** (`/zoom-setup`) — Access recordings, schedule meetings. Smart enough to know if Granola already handles your meeting capture so they don't step on each other.
- **Jira + Confluence** (`/atlassian-setup`) — Sprint status in your daily plan. Project health from Jira. Confluence docs surfaced during meeting prep.

### 🔄 Two-way task sync

This is the headline feature. Connect Todoist, Things 3, Trello, or Jira and your tasks flow between systems automatically. One task in Todoist maps to one task in Dex — even though Dex shows it in meeting notes, person pages, and project pages. Complete anywhere, done everywhere.

The sync is safe by design — it creates, completes, and archives. It never deletes anything.

### 👋 New users: pick your stack during onboarding

When new users set up Dex, Step 8 now asks what tools they use. Pick Gmail and Todoist? You'll be walked through connecting both, and at the end Dex shows you exactly what changed: "Your daily plan now includes an email digest. Meeting prep shows recent emails with attendees. Tasks sync both ways with Todoist." Each tool connection ends with a clear summary of what just got smarter.

### ⚡ Existing users: add integrations anytime

Already using Dex? Just run the setup command for any tool:

- `/slack-setup` — Slack
- `/google-workspace-setup` — Gmail + Calendar + Docs
- `/ms-teams-setup` — Microsoft Teams
- `/todoist-setup` — Todoist
- `/things-setup` — Things 3
- `/trello-setup` — Trello
- `/zoom-setup` — Zoom
- `/atlassian-setup` — Jira + Confluence

Or run `/dex-level-up` and Dex will suggest which integrations would make the biggest difference based on what you're already doing.

### 🏢 Corporate environments

Some corporate IT policies restrict access for third-party tools. If you hit a wall during setup — a blocked consent screen, a missing permission — just ask Dex about it. There are often creative workarounds: personal API keys that don't need admin approval, local-only integrations like Things 3 that bypass corporate restrictions entirely. Dex generally finds a way if you give it a go.

### 📋 Smarter daily plans and meeting prep

Every skill that touches your day got more useful:

- **`/daily-plan`** now includes email digest, Slack/Teams digest, external task status, Jira sprint progress, and Trello card updates — all in one view.
- **`/meeting-prep`** pulls in recent email exchanges, Slack/Teams messages, Zoom recordings, Confluence docs, and Jira/Trello context for every attendee.
- **`/week-review`** shows email stats, Zoom meeting time, cross-system task completion, and Jira velocity alongside your existing review.
- **`/project-health`** surfaces Trello board status and Jira sprint health for connected projects.
- **`/dex-level-up`** spots unused integration capabilities — "You connected Gmail but haven't enabled email follow-up detection. Try it."

### 🩺 Integration health

Dex checks whether your connected tools are healthy each time you start a session. If something's gone stale — an expired token, a disconnected service — you'll know right away with a friendly nudge to reconnect, instead of discovering it mid-meeting-prep.

---

## [1.14.0] — 🧠 Dex Got a Brain Upgrade (2026-02-19)

This is the biggest single release since semantic search. Dex remembers things now. It gets smarter each day you use it. Sessions stay fast all day. And your skills take care of their own housekeeping instead of leaving it to you.

---

### 🧠 Memory

**Cross-session memory.** When you start a new chat, Dex now opens with context from previous sessions — what you decided, what's been escalating, what commitments are due. No more re-explaining where you left off. Your daily plan opens with "Based on previous sessions: you discussed Acme Corp 3 times last week, decided to move to negotiation, and Sarah committed to send pricing by Friday — that's today." That context was invisible before. Now it's automatic.

**Critical decisions persist.** When you make an important decision in a session — "decided to move Acme to negotiation by March" — it now survives across sessions. Critical decisions appear at every session start for 30 days, so you never lose track of what you committed to.

**Meeting cache.** Every meeting you process now gets stored as a compact summary instead of the full transcript. Meeting prep and daily planning are dramatically faster — same intelligence, fraction of the processing time.

**Memory that compounds.** The six agents that power your morning intelligence — deals, commitments, people, projects, focus, and pillar balance — now remember what they found in previous sessions. First run, they scan everything. Second run, they know what they already told you. Resolved items quietly drop off. New issues are clearly marked. And things you've been ignoring? Dex notices. "I've flagged this three sessions running. Still no action. This is a pattern, not a blip."

**Faster people lookups.** Dex now keeps a lightweight directory of everyone you know. Instead of scanning dozens of files every time you mention someone, it reads one small index. Looking up "Paul" instantly returns the right person with their role, company, and context. The index stays fresh automatically — it rebuilds during your daily plan and self-heals if it goes stale.

**Memory ownership, clarified.** With multiple memory layers now active, Dave has documented exactly what owns what. Claude's built-in memory handles your preferences and communication style. Dex's memory handles your work — who said what in which meeting, what you committed to, which deals need attention. They stack, not compete. See the new Memory Ownership guide in your Dex System docs.

---

### 🔍 Intelligence

**Pattern detection.** After 2+ weeks of use, Dex starts noticing your patterns. "You've prepped for deal calls 8 times this month but checked MEDDPICC gaps only twice." Recurring mistakes get surfaced before you make them. Emerging workflows get noticed so you can turn them into skills.

**Identity snapshot.** Dex now automatically builds a living profile of how you actually work — your goals, priorities, task patterns, learnings, and skill ratings all feed into it. Not self-reported traits — observed patterns. What pillar gets neglected under pressure. Which skills you rate highest. Where your blind spots are. It refreshes during weekly reviews and Dex reads it when making prioritization suggestions. You can also run `/identity-snapshot` anytime to see it on demand.

**Skill quality signals.** After key workflows like daily plans, meeting prep, and reviews, Dex asks one optional question: "Quick rating, 1-5?" Your ratings accumulate over time. During weekly reviews, if a skill has been trending down, Dex surfaces it with context — "Your meeting prep averaged 2.8 this week, common note: missing context from last meeting." If everything's fine, you hear nothing. Ratings also feed into anonymous product analytics so Dave knows which skills to invest in.

---

### ⚡ Performance & Safety

**Sessions that last all day.** Your heaviest skills — daily plan, weekly review, meeting prep, and seven others — now run in their own space instead of loading everything into your main conversation. Previously, running `/daily-plan` then staying in that chat all day meant things got slower and muddier by the afternoon. Now each skill does its work separately and hands back just the result. Stay in one chat from morning planning through end-of-day review without penalty.

**Command safety guard.** A protective layer that silently watches every terminal command and blocks catastrophic ones before they execute. Disk wipes, force pushes to main, repo deletions — all stopped instantly. Normal commands pass through with zero overhead. You never notice it until the one time it saves you.

**Faster startup and routing.** Background services start faster and use less memory. Quick operations like `/triage` and inbox processing are tuned for speed — routing decisions that used to take 8 seconds now feel instant.

---

### 🤖 Skills That Take Care of Themselves

- **Meeting processing** — whenever meetings are processed, every person mentioned gets the meeting added to their page. Their history stays current without you lifting a finger.
- **Career coaching** — when `/career-coach` surfaces achievements with real metrics, it automatically logs them to your Career Evidence file. Come review season, the evidence is already collected.
- **Daily planning** — after your plan generates, a condensed quickref appears with just your top focus items, key meetings, and time blocks. Glanceable during the day.

---

### 📚 New Guides

Named Sessions (resume project conversations with full history), Background Processing (which skills support it and how), Memory Ownership (how Dex's four memory layers work together), and Vault Maintenance (scan for stale files, broken links, orphaned pages).

---

### 🙏 Community

This is the first time Dex has received contributions from the community, and I'm genuinely humbled. Three people independently found things to improve, built the fixes, and shared them back. All four contributions are now live.

**@fonto — Calendar setup now works.** Previously, running `/calendar-setup` didn't do anything — Dex couldn't find it. On top of that, when it tried to ask your Mac for permission to read your calendar, it would fail silently. Both issues are fixed. If you had trouble connecting your calendar before, try `/calendar-setup` again — it should just work now.

**@fonto — Tasks no longer get mixed up.** Every task in Dex gets a short reference number (like the `003` at the end of a task). Previously, that number could accidentally be the same for tasks created on different days — so when you said "mark 003 as done", Dex might match the wrong one. Now every task gets a number that's unique across your entire vault. No more mix-ups.

**@acottrell — "How do I connect my Google Calendar?" answered.** If you use Google Calendar on a Mac, you probably wondered how to get your meetings into Dex. The answer turns out to be surprisingly simple — add your Google account to Apple's Calendar app (the one already on your Mac), then let Cursor access it. Two steps, no accounts to create, no passwords to enter anywhere. @acottrell wrote this up as a clear guide so nobody else has to figure it out from scratch. Even better — your calendar now asks for permission automatically the first time you need it, instead of requiring a separate setup step.

**@mekuhl — Capture tasks from your phone with Siri.** This is the big one. You're in a meeting, someone asks you to do something, and you don't want to open your laptop. Now you can just say:

> **"Hey Siri, add to Dex Inbox: follow up with Sarah about pricing"**

That's it. Siri adds it to a Reminders list on your phone called "Dex Inbox." Next morning when you run `/daily-plan`, Dex finds it and asks you to triage it — assign a pillar, set the priority, and it becomes a proper task in your vault. The Reminder disappears from your phone automatically.

It works the other direction too. After your daily plan generates, your most important focus tasks appear on your phone as Reminders with notifications. Complete something on your phone? Dex picks that up during your evening review. Complete it in Dex? The phone notification clears itself.

Your phone and your vault stay in sync — without opening a laptop, without any new apps, without any setup beyond saying "Hey Siri" for the first time.

If you've made improvements to your Dex setup that could help others, Dave would love to see them. See [CONTRIBUTING.md](CONTRIBUTING.md) for how to share — no technical background required.

---

## [1.10.0] - 2026-02-17

### 🩺 Dex Now Tells You When Something's Wrong

**Before:** When something failed — your calendar couldn't connect, a task couldn't be created, meeting processing hit an error — you'd get a vague message in the conversation and then... nothing. The error disappeared when the chat ended. If something was quietly broken for days, you wouldn't know until you needed it and wondered why it stopped working.

**Now:** Dex watches its own health. Every tool across all 12 background services captures failures the moment they happen — in plain language, not technical jargon. The next time you start a conversation, you'll see anything that went wrong:

```
--- ⚠️ Recent Errors (2) ---
  [Task Manager] Feb 17 09:30 — Task creation failed (×3)
  [Calendar] Feb 16 14:00 — Calendar couldn't connect
Say: 'health check' to investigate
---
```

If everything is fine? Complete silence. No "all systems go" noise.

**Say `/health-check` anytime** to get a full diagnostic: which services are running, what's failed recently, and — for most issues — a suggested fix. Missing something? It tells you the exact command. Config issue? It offers to repair it.

**What this means for you:** Instead of discovering something's been broken for a week, you find out at your next conversation. Instead of a cryptic error, you get "Calendar couldn't connect" with a clear next step. Dex is becoming the kind of system that takes care of itself — and tells you when it needs your help.

**Platform note:** Automatic startup checks work in Claude Code. In Cursor, the error capture still works behind the scenes — just run `/health-check` manually to see the same diagnostic.

---

## [1.9.1] - 2026-02-17

### Automatic Update Notifications

Previously, you had to remember to run `/dex-update` to check for new versions. Now Dex checks once a day automatically and lets you know if there's something new — a quiet one-liner at the end of your first chat, once per day. No nagging, no blocking. Run `/dex-update` when you're ready, or ignore it.

**One catch:** You need to run `/dex-update` manually one time to get this feature. That update pulls in the automatic checking. From that point on, you'll be notified whenever something new is available — no more remembering to check.

---

## [1.9.0] - 2026-02-17

### 🔍 Optional: Smarter Search for Growing Vaults

You might be thinking: "Dex already uses AI — doesn't it search intelligently?" Good question. Here's what's actually happening under the hood.

When you ask Dex something like "what do I know about customer retention?", two things happen:

1. **Finding the files** — Dex searches your vault for relevant notes
2. **Making sense of them** — Claude reads those notes and gives you a smart answer

Step 2 has always been intelligent — that's Claude doing what it does best. But Step 1? Until now, that's been basic keyword matching. Dex literally searches for the word "retention" in your files. If you wrote about the same topic using different words — "churn", "users leaving", "cancellation patterns" — those notes never made it to Claude's desk. It can't reason about things it never sees.

**That's what semantic search fixes.** It upgrades Step 1 — the finding — so the right notes reach Claude even when the words don't match.

It's also significantly faster and lighter. Instead of Claude reading entire files to find what's relevant (thousands of tokens each), the search engine returns just the relevant snippets. One developer measured a 96% reduction in the amount of context needed per search.

**When does this matter?** Honestly, if your vault has fewer than 50 notes, keyword matching works fine. As your vault grows into the hundreds of files, keyword search starts missing things — and that's where this upgrade earns its keep.

---

This is powered by [QMD](https://github.com/tobi/qmd), an open-source local search engine created by Tobi Lütke (founder and CEO of Shopify). Everything runs on your machine — no data leaves your computer.

> "I think QMD is one of my finest tools. I use it every day because it's the foundation of all the other tools I build for myself. A local search engine that lives and executes entirely on your computer. Both for you and agents." — [Tobi Lütke](https://x.com/tobi/status/2013217570912919575)

**Setup required.** Semantic search is available but requires running `/enable-semantic-search` to set it up (5 min, 2.5GB download). New users are offered this during onboarding. Once enabled, all vault searches automatically use semantic matching instead of keyword-only — skills don't change, the AI routing layer gets smarter and uses QMD when available.

**What gets better when you enable it:**

- **Planning & Reviews** — `/daily-plan`, `/week-plan`, `/daily-review`, `/week-review`, and `/quarter-review` all become meaning-aware. Your morning plan surfaces notes related to today's meetings by theme ("onboarding" pulls in "activation rates"). Your weekly review detects which tasks contributed to which goals — even when they weren't explicitly linked. Stale goals get flagged with hidden activity you didn't know about.

- **Meeting Intelligence** — `/meeting-prep` finds past discussions related to the meeting topic, not just meetings with the same people. `/process-meetings` catches implicit commitments like "we should circle back on pricing" — soft language that keyword extraction would miss.

- **Search & People** — All vault searches become meaning-aware. Person lookup finds references by role ("the VP of Sales asked about..."), not just by name.

- **Smarter Dedup** — Task creation detects semantic duplicates ("Review Q1 metrics" matches "Check quarterly pipeline numbers"). Same for improvement ideas in your backlog.

- **Natural Task Completion** — Say "I finished the pricing thing" and Dex matches it to the right task, even when your words don't match the title exactly.

- **Career Tracking** — If you use the career system, skill demonstration is now detected without explicit `# Career:` tags. "Designed the API migration strategy" automatically matches your "System Design" competency.

**If you don't enable it,** nothing changes — everything continues to work with keyword matching, just as it always has.

Part of the philosophy with Dex is to stay on top of the best open-source tools so you don't have to. When something like QMD comes along that genuinely makes the experience better, Dave integrates it — you run one command and your existing workflows get smarter.

**Smart setup, not generic indexing.** When you run `/enable-semantic-search`, Dex scans your vault and recommends purpose-built search collections based on what you've actually built — people pages, meeting notes, projects, goals. Each collection gets semantic context that tells the search engine what the content IS, dramatically improving result relevance. Generic tools dump everything into one index. Dex gives your search engine a mental model of your information architecture.

As your vault grows, Dex notices. Created your first few company pages? Next time you run `/daily-plan`, it'll suggest: "You've got enough accounts for a dedicated collection now — want me to create one?" Your search setup evolves with your vault.

**To enable:** `/enable-semantic-search` (one-time setup, ~5 minutes)

---

## [1.8.0] - 2026-02-16

### 📊 Your Usage Now Shapes What Gets Built Next

**Before:** If you opted in to help improve Dex, your anonymous usage data wasn't being captured consistently across all features. Some areas were tracked, others weren't — so the picture of which features people find most valuable was incomplete.

**Now:** Every Dex feature — all 30 skills and 6 background services — now reports usage when you've opted in. You'll also notice the opt-in prompt appears at the start of each session (instead of only during planning), so you won't miss it. Say "yes" or "no" once and it's settled — if you're not ready to decide, it'll gently ask again next time.

When you run `/dex-update`, any new features automatically appear in your usage log without losing your existing data. And as new capabilities ship in the future, they'll always include tracking from day one.

**Result:** If you've opted in, you're directly influencing which features get priority. The most-used capabilities get more investment — your usage data is the signal.

---

## [1.7.0] - 2026-02-16

### ✨ Smoother Onboarding — Clickable Choices & Cross-Platform Support

**Before:** During setup, picking your role meant scrolling through a wall of 31 numbered options and typing a number. If your Mac's Calendar app was running in the background (but not in the foreground), Dex couldn't detect your calendars — silently skipping calendar optimization. And if you onboarded in Cursor vs Claude Code, the question prompts might not work because each platform has a different tool for presenting clickable options.

**Now:** Role selection, company size, and other choices are presented as clickable lists — just pick from the menu. Dex detects your platform once at the start (Cursor vs Claude Code vs terminal) and uses the right question tool throughout. Calendar detection works regardless of whether Calendar.app is in the foreground or background. QA testing uses dry-run mode so nothing gets overwritten.

**Result:** Onboarding feels polished — fewer things to type, fewer silent failures, works correctly whether you're in Cursor or Claude Code.

---

## [1.6.0] - 2026-02-16

### ✨ Dex Now Discovers Its Own Improvements

**Before:** When new Claude Code features shipped or you had ideas for how Dex could work better, it was up to you to remember them and add them to your backlog. Keeping track of what could be improved meant extra manual work.

**Now:** Dex watches for opportunities to get better and weaves them into your existing routines:

- `/dex-whats-new` spots relevant Claude Code releases and turns them into improvement ideas in your backlog
- `/daily-plan` highlights the most timely idea as an "Innovation Spotlight" when something new is relevant (e.g., "Claude just shipped native memory — here's how that could help")
- `/daily-review` connects today's frustrations to ideas already in your backlog
- `/week-review` shows your top 3 highest-scored improvement ideas
- Say "I wish Dex could..." in conversation and it's captured automatically — no duplicates

**Result:** Your improvement backlog fills itself. Ideas arrive from AI discoveries and your own conversations, get ranked by impact, and surface at the right moment during planning and reviews.

---

## [1.5.0] - 2026-02-15

### 🔧 All Your Granola Meetings Now Show Up

**Before:** Some meetings recorded on mobile or edited in Granola's built-in editor wouldn't appear in Dex — they'd be invisible during meeting prep and search.

**Now:** Dex handles all the ways Granola stores your notes, so every meeting comes through — regardless of how or where you recorded it.

**Result:** If Granola has your notes, Dex will find them. No meetings slip through the cracks.

---

## [1.4.0] - 2026-02-15

### 🔧 Dex Now Always Knows What Day It Is

**Before:** Dex relied entirely on the host platform (Cursor, Claude Code) to tell Claude the current date. If the platform didn't surface it prominently, Claude could lose track of what day it was — especially frustrating during daily planning or scheduling conversations.

**Now:** The session-start hook explicitly outputs today's date at the very top of every session context injection, so it's front-and-center regardless of platform behavior.

**Result:** No more "what day is it?" confusion. Dex always knows the date, every session, every platform.

---

## [1.3.0] - 2026-02-05

### 🎯 Smart Pillar Inference for Task Creation

**What was frustrating:** Every time you asked to create a task ("Remind me to prep for the Acme demo"), Dex would stop and ask: "Which pillar is this for?" This added friction to quick captures and broke your flow.

**What's different now:** Dex analyzes your request and infers the most likely pillar based on keywords:
- "Prep demo for Acme Corp" → **Deal Support** (demo + customer keywords)
- "Write blog post about AI" → **Thought Leadership** (content keywords)
- "Review beta feedback" → **Product Feedback** (feedback keywords)

Then confirms with a quick one-liner:
> "Creating under Product Feedback pillar (looks like data gathering). Sound right, or should it be Deal Support / Thought Leadership?"

**Why you'll care:** Fast task capture with data quality. No more back-and-forth just to add a reminder. But your tasks still have proper strategic alignment.

**Customization options:** Want different behavior? You can customize this in your CLAUDE.md:
- **Less strict:** Remove the pillar requirement entirely and use a default pillar
- **Triage flow:** Route quick captures to `00-Inbox/Quick_Captures.md`, then sort them during `/triage` (skill you can build yourself or request)
- **Your own keywords:** Edit `System/pillars.yaml` to add custom keywords for better inference

**Technical:** Updated task creation behavior in `.claude/CLAUDE.md` to include pillar inference logic. The work-mcp validation still requires a pillar (maintains data integrity), but Dex now handles the inference and confirmation before calling the MCP.

---

### ⚡ Calendar Queries Are Now 30x Faster (30s → <1s)

**Before:** Asking "what meetings do I have today?" meant waiting up to 30 seconds for a response. Old events from weeks ago sometimes appeared in today's results too.

**Now:** Calendar queries respond in under a second and only show events for the dates you asked about. No more waiting, no more ghost events.

**One-time setup:** After updating, run `/calendar-setup` to grant calendar access. This unlocks the faster queries. If you skip this step, everything still works — just slower.

---

### 🐛 Paths Now Work on Any Machine

**Before:** A few features — Obsidian integration and background automations — didn't work correctly on some setups.

**Now:** All paths resolve dynamically based on where your vault lives. Everything works regardless of your username or folder structure.

**How to update:** In Cursor, just type `/dex-update` — that's it!

**Thank you** to the community members who reported this. Your feedback makes Dex better for everyone.

---

### 🔬 X-Ray Vision: Learn AI by Seeing What Just Happened

**What was frustrating:** Dex felt like a black box. You knew it was helping, but you had no idea what was actually happening — which tools were firing, how context was loaded, or how you could customize the system. Learning AI concepts felt abstract and disconnected from your actual experience.

**What's new:** Run `/xray` anytime to understand what just happened in your conversation.

**Default mode (just `/xray`):** Shows the work from THIS conversation:
- What files were read and why
- What tools/MCPs were used
- What context was loaded at session start (and how)
- How each action connects to underlying AI concepts

**Deep-dive modes:**
- `/xray ai` — First principles: context windows, tokens, statelessness, tools
- `/xray dex` — The architecture: CLAUDE.md, hooks, MCPs, skills, vault structure
- `/xray boot` — The session startup sequence in detail
- `/xray today` — ScreenPipe-powered analysis of your day
- `/xray extend` — How to customize: edit CLAUDE.md, create skills, write hooks, build MCPs

**The philosophy:** The best way to learn AI is by examining what just happened, not reading abstract explanations. Every `/xray` session connects specific actions (I read this file because...) to general concepts (...CLAUDE.md tells me where files live).

**Where you'll see it:**
- Run `/xray` after any conversation to see "behind the scenes"
- Educational concepts are tied to YOUR vault and YOUR actions
- End with practical customization opportunities

**The goal:** You're not just a user — you're empowered to extend and personalize your AI system because you understand the underlying mechanics.

---

### 🔌 Productivity Stack Integrations (Notion, Slack, Google Workspace)

**What was frustrating:** Your work context is scattered across Notion, Slack, and Gmail. When prepping for meetings, you manually search each tool. When looking up a person, you don't see your communication history with them.

**What's new:** Connect your productivity tools to Dex for richer context everywhere:

1. **Notion Integration** (`/integrate-notion`)
   - Search your Notion workspace from Dex
   - Meeting prep pulls relevant Notion docs
   - Person pages link to shared Notion content
   - Uses official Notion MCP (`@notionhq/notion-mcp-server`)

2. **Slack Integration** (`/integrate-slack`)
   - "What did Sarah say about the Q1 budget?" → Searches Slack
   - Meeting prep includes recent Slack context with attendees
   - Person pages show communication history
   - Easy cookie auth (no bot setup required) or traditional bot tokens

3. **Google Workspace Integration** (`/integrate-google`)
   - Gmail thread context in person pages
   - Email threads with meeting attendees during prep
   - Calendar event enrichment
   - One-time OAuth setup (~5 min)

**Where you'll see it:**
- `/meeting-prep` — Pulls context from all enabled integrations
- Person pages — Integration Context section with Slack/Notion/Email history
- New users — Onboarding Step 9 offers integration setup
- Existing users — `/dex-update` announces new integrations, detects your existing MCPs

**Smart detection for existing users:**
If you already have Notion/Slack/Google MCPs configured, Dex detects them and offers to:
- Keep your existing setup (it works!)
- Upgrade to Dex recommended packages (better maintained, more features)
- Skip and configure later

**Setup commands:**
- `/integrate-notion` — 2 min setup (just needs a token)
- `/integrate-slack` — 3 min setup (cookie auth or bot token)
- `/integrate-google` — 5 min setup (OAuth through Google Cloud)

---

### 🔔 Ambient Commitment Detection (ScreenPipe Integration) [BETA]

**What was frustrating:** You say "I'll send that over" in Slack or get asked "Can you review this?" in email. These micro-commitments don't become tasks — they fall through the cracks until someone follows up (awkward) or they're forgotten (worse).

**What's new:** Dex now detects uncommitted asks and promises from your screen activity:

1. **Commitment Detection** — Scans apps like Slack, Email, Teams for commitment patterns
   - Inbound asks: "Can you review...", "Need your input...", "@you"
   - Outbound promises: "I'll send...", "Let me follow up...", "Sure, I'll..."
   - Deadline extraction: "by Friday", "by EOD", "ASAP", "tomorrow"

2. **Smart Matching** — Connects commitments to your existing context
   - Matches people mentioned to your People pages
   - Matches topics to your Projects
   - Matches keywords to your Goals

3. **Review Integration** — Surfaces during your rituals
   - `/daily-review` shows today's uncommitted items
   - `/week-review` shows commitment health stats
   - `/commitment-scan` for standalone scanning anytime

**Example during daily review:**
```
🔔 Uncommitted Items Detected

1. Sarah Chen (Slack, 2:34 PM)
   > "Can you review the pricing proposal by Friday?"
   📎 Matches: Q1 Pricing Project
   → [Create task] [Already handled] [Ignore]
```

**Privacy-first:**
- Requires ScreenPipe running locally (all data stays on your machine)
- Sensitive apps excluded by default (1Password, banking, etc.)
- You decide what becomes a task — nothing auto-created

**Beta activation required:**
- Run `/beta-activate DEXSCREENPIPE2026` to unlock ScreenPipe features
- Then asked once during `/daily-plan` or `/daily-review` to enable
- Must explicitly enable before any screen data is accessed
- New users can also run `/screenpipe-setup` after beta activation

**New skills:**
- `/commitment-scan` — Scan for uncommitted items anytime
- `/screenpipe-setup` — Enable/disable ScreenPipe with privacy configuration

**Why you'll care:** Never forget a promise or miss an ask again. The things you commit to in chat apps now surface in your task system automatically.

**Requirements:** ScreenPipe must be installed and opted-in. See `blueprint/ScreenPipe_Setup.md` for setup.

---

### 🤖 AI Model Flexibility: Budget Cloud & Offline Mode

**What was frustrating:** Dex only worked with Claude, which costs money and requires internet. Heavy users faced high API bills, and travelers couldn't use Dex on planes or trains.

**What's new:** Two new ways to use Dex:

1. **Budget Cloud Mode** — Use cheaper AI models like Kimi K2.5 or DeepSeek when online
   - Save 80-97% on API costs for routine tasks
   - Requires ~$5-10 upfront via OpenRouter
   - Quality is great for daily tasks (summaries, planning, task management)

2. **Offline Mode** — Download an AI to run locally on your computer
   - Works on planes, trains, anywhere without internet
   - Completely free forever
   - Requires 8GB+ RAM (16GB+ recommended)

3. **Smart Routing** — Let Dex automatically pick the best model
   - Claude for complex tasks
   - Budget models for simple tasks
   - Local model when offline

**New skills:**
- `/ai-setup` — Guided setup for budget cloud and offline mode
- `/ai-status` — Check your AI configuration and credits

**Why you'll care:** Reduce your AI costs by 80%+ for everyday tasks, or work completely offline during travel — your choice.

**User-friendly:** The setup is fully guided with plain-language explanations. Dex handles the technical parts (starting services, downloading models) automatically.

---

### 📊 Help Dave Improve Dex (Optional Analytics)

**What's this about?**

Dave could use your help making Dex better. This release adds optional, privacy-first analytics that lets you share which Dex features you use — not what you do with them, just that you used them.

**What gets tracked (if you opt in):**
- Which Dex built-in features you use (e.g., "ran /daily-plan")
- Nothing about what you DO with features
- No content, names, notes, or conversations — ever

**What's NOT tracked:**
- Custom skills or MCPs you create
- Any content you write or manage
- Who you meet with or what you discuss

**The ask:**

During onboarding (new users) or your next planning session (existing users), Dex will ask once:

> "Dave could use your help improving Dex. Help improve Dex? [Yes, happy to help] / [No thanks]"

Say yes, and you help Dave understand which features work and which need improvement. Say no, and nothing changes — Dex works exactly the same.

**Technical:**
- Added `analytics_helper.py` in `core/mcp/`
- Consent tracked in `System/usage_log.md`
- Events only fire if `analytics.enabled: true` in user-profile.yaml
- 20+ skills now have analytics hooks

**Beta only:** This feature is currently in beta testing.

---

## [1.2.0] - 2026-02-03

### 🧠 Planning Intelligence: Your System Now Thinks Ahead

**What's this about?**

Until now, daily and weekly planning showed you information — your tasks, calendar, priorities. But you had to connect the dots yourself. 

Now Dex actively thinks ahead and surfaces things you might have missed.

This is the biggest upgrade to Dex's intelligence since launch. Based on feedback from early users, Dave rebuilt the planning skills to be proactive rather than passive. Dex now does the mental work of connecting your calendar to your tasks, tracking your commitments, and warning you when things are slipping — so you can focus on actually doing the work.

---

**Midweek Awareness**

**Before:** You'd set weekly priorities on Monday, then forget about them until Friday's review. By then it's too late — Priority 3 never got touched.

**Now:** When you run `/daily-plan` midweek, Dex knows where you stand:

> "It's Wednesday. You've completed 1 of 3 weekly priorities. Priority 2 is in progress (2 of 5 tasks done). Priority 3 hasn't been touched yet — you have 2 days left."

**Result:** Course-correct while there's still time. No more end-of-week surprises.

---

**Meeting Intelligence**

**Before:** You'd see "Acme call" on your calendar and have to manually check: what's the status of that project? Any outstanding tasks? What did you discuss last time?

**Now:** For each meeting, Dex automatically connects the dots:

> "You have the Acme call Thursday. Looking at that project: the proposal is still in draft, and you owe Sarah the pricing section. Want to block time for prep?"

**Result:** Walk into every meeting prepared. Related tasks and project status surface automatically.

---

**Commitment Tracking**

**Before:** You'd say "I'll get back to you Wednesday" in a meeting, write it in your notes... and forget. It lived in a meeting note you never looked at again.

**Now:** Dex scans your meeting notes for things you said you'd do:

> "You told Mike you'd get back to him by Wednesday. That's today."

**Result:** Keep your promises. Nothing slips through because it was buried in notes.

---

**Smart Scheduling**

**Before:** All tasks were equal. A 3-hour strategy doc and a 5-minute email sat on the same list with no guidance on when to tackle them.

**Now:** Dex classifies tasks by effort and matches them to your calendar:

> "You have a 3-hour block Wednesday morning — perfect for 'Write Q1 strategy doc' (deep work). Thursday is stacked with meetings — good for quick tasks only."

It even warns you when you have more deep work than available focus time.

**Result:** Stop fighting your calendar. Know which tasks fit which days.

---

**Intelligent Priority Suggestions**

**Before:** `/week-plan` asked "What are your priorities?" and waited. You had to figure it out yourself.

**Now:** Dex suggests priorities based on your goals, task backlog, and calendar shape:

> "Based on your goals, tasks, and calendar, I suggest:
> 1. Complete pricing proposal — Goal 1 needs this for milestone 3
> 2. Customer interviews — Goal 2 hasn't had activity in 3 weeks
> 3. Follow up on Acme — You committed to Sarah by Friday"

You still decide. But now you have a thinking partner who's done the analysis.

**Result:** Start each week with intelligent suggestions, not a blank page.

---

**Concrete Progress (Not Fake Percentages)**

**Before:** "Goal X is at 55%." What does that even mean? Percentages feel precise but communicate nothing.

**Now:** "Goal X: 3 of 5 milestones complete. This week you finished the pricing page and scheduled the customer interviews."

**Result:** Weekly reviews that actually show what you accomplished and what's left.

---

**How it works (under the hood):**

Six new capabilities power the intelligence:

| What Dex can now do | Why it matters |
|---------------------|----------------|
| Check your week's progress | Knows which priorities are on track vs slipping |
| Understand meeting context | Connects each meeting to related projects and people |
| Find your commitments | Scans notes for promises you made and when they're due |
| Judge task effort | Knows a strategy doc needs focus time, an email doesn't |
| Read your calendar shape | Sees which days have deep work time vs meeting chaos |
| Match tasks to time | Suggests what to work on based on available blocks |

**What to try:**

- Run `/daily-plan` on a Wednesday — see midweek awareness in action
- Check `/week-plan` — get intelligent priority suggestions instead of a blank page
- Before a big meeting, run `/meeting-prep` — watch it pull together everything relevant

---

## [1.1.0] - 2026-02-03

### 🎉 Personalize Dex Without Losing Your Changes

**What's this about?**

Many of you have been making Dex your own — adding personal instructions, connecting your own tools like Gmail or Notion, tweaking how things work. That's exactly what Dex is designed for.

But until now, there was a tension: when I release updates to Dex with new features and improvements, your personal changes could get overwritten. Some people avoided updating to protect their setup. Others updated and had to redo their customizations.

This release fixes that. Your personalizations and my updates now work together.

---

**What stays protected:**

**Your personal instructions**

If you've added notes to yourself in the CLAUDE.md file — reminders about how you like things done, specific workflows, preferences — those are now protected. Put them between the clearly marked `USER_EXTENSIONS` section, and they'll never be touched by updates.

**Your connected tools**

If you've connected Dex to other apps (like your email, calendar, or note-taking tools), those connections are now protected too. When you add a tool, Dex automatically names it in a way that keeps it safe from updates.

**New command: `/dex-add-mcp`** — When you want to connect a new tool, just run this command. It handles the technical bits and makes sure your connection is protected. No config files to edit.

---

**What happens when there's a conflict?**

Sometimes my updates will change a file that you've also changed. When that happens, Dex now guides you through it with simple choices:

- **"Keep my version"** — Your changes stay, skip this part of the update
- **"Use the new version"** — Take the update, replace your changes
- **"Keep both"** — Dex will keep both versions so nothing is lost

No technical knowledge needed. Dex explains what changed and why, then you decide.

---

**Why this matters**

I want you to make Dex truly yours. And I want to keep improving it with new features you'll find useful. Now both can happen. Update whenever you like, knowing your personal setup is safe.

---

### 🔄 Background Meeting Sync (Granola Users)

**Before:** To get your Granola meetings into Dex, you had to manually run `/process-meetings`. Each time, you'd wait for it to process, then continue your work. Easy to forget, tedious when you remembered.

**Now:** A background job syncs your meetings from Granola every 30 minutes automatically. One-time setup, then it just runs.

**To enable:** Run `.scripts/meeting-intel/install-automation.sh`

**Result:** Your meeting notes are always current. When you run `/daily-plan` or look up a person, their recent meetings are already there — no manual step needed.

---

### ✨ Prompt Improvement Works Everywhere

**Before:** The `/prompt-improver` command required extra configuration. In some setups, it just didn't work.

**Now:** It automatically uses whatever AI is available — no special configuration needed.

**Result:** Prompt improvement just works, regardless of your setup.

---

### 🚀 Easier First-Time Setup

**Before:** New users sometimes hit confusing error messages during setup, with no clear guidance on what to do next.

**Now:**
- Clear error messages explain exactly what's wrong and how to fix it
- Requirements are checked upfront with step-by-step instructions
- Fewer manual steps to get everything working

**Result:** New users get up and running faster with less frustration.

---

## [1.0.0] - 2026-01-25

### 📦 Initial Release

Dex is your AI-powered personal knowledge system. It helps you organize your professional life — meetings, projects, people, ideas, and tasks — with an AI assistant that learns how you work.

**Core features:**
- **Daily planning** (`/daily-plan`) — Start each day with clear priorities
- **Meeting capture** — Extract action items, update person pages automatically
- **Task management** — Track what matters with smart prioritization
- **Person pages** — Remember context about everyone you work with
- **Project tracking** — Keep initiatives moving forward
- **Weekly and quarterly reviews** — Reflect and improve systematically

**Requires:** Cursor IDE with Claude, Python 3.10+, Node.js
