# Dex Improvement: PDLC Orchestration UI (Steerco control plane)

**Created:** 2026-04-20  
**Status:** Planning → In Progress  
**Pillar:** AI adoption in processes · Streamlined product launch  
**Workshop:** `/dex-improve` Mode 1  
**Related:** [04-Projects/PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) (north star + slice log)

---

## Phase 1 — Understanding

**Idea (restated):** Build a **thin-sliced orchestration UI** so **PM** (with Steerco input and decisions) runs the **PDLC** as the **record of truth**: **`idea`** (capture; optional **`/pdlc-idea-gate-custom`**) → **`discovery`** (on **`idea` → `discovery`**: completed **`/pdlc-brief-custom`** stepwise flow — typed brief only, not a full PRD; then research / problem / solutions / **open questions**; **re-run discovery** after answers) → **`design`** (export pack → **Claude Design**; attach outputs; **`/anthropic-frontend-design`**) → **`spec_ready`** (**`/agent-prd`** on column entry + structured clarifications) → **`develop`** (handoff: PRD `.md` + design for **Cursor Plan mode**) → **`uat`** → **`deployed`**, with **`parked`**, **backward moves** (not to `idea` without wipe), and **post-MVP** company-strategy conformance (distinct from Dex `pillars.yaml` semantics — see Phase 5). **Transition → skill map:** [lifecycle-transitions.md § Skill triggers](./lifecycle-transitions.md#skill-triggers-on-column-moves-pdlc-ui) · [skill-agent-map.md](./skill-agent-map.md).

**Architecture (clarified 2026-04-21):** The **Wyzetalk UI is a separate product surface** (browser, internal host). **Dex** remains the **knowledge + process OS** — projects, areas, people, PRDs, learnings, and **skills** (`.claude/skills/`). Steerco **does not** use Cursor or Claude Code prompts for day-to-day PDLC moves; they use **`pdlc-ui/`**. Dex capabilities are **consumed** (read/write agreed artefacts, same skill semantics), not replaced by a second prompt wiki — see [skill-agent-map.md](./skill-agent-map.md).

**Product philosophy (2026-04-21):** The UI **steers and guides** what **Dex already does in chat** — same skills, same artefacts, same discipline. The UI does not replace Dex; it **sequences** the skills, **persists** the thread, and **makes the record visible** for non-Cursor users. Dex-native habits (**meeting prep**, **meeting processing**, **transcript ingestion**, signal scanning) continue to run and **feed context into discovery** over time — this is what makes the discovery step **more valuable each cycle**, not a parallel system. See **MVP bars** (below) for how this lands across Bar A → Bar B → Phase 2 → Phase 3+.

**Dex / vault areas involved:**

| Area | How |
|------|-----|
| **Projects** | North star lives in `04-Projects/PDLC_Orchestration_UI.md`; this plan in `plans/PDLC_UI/` |
| **Information retrieval** | UI reads **flat PRDs** + `PRD_Product_Map`; optional `EV-*` / market tabs later |
| **Automation** | **Skills** define behaviour: PDLC board uses **`/pdlc-idea-gate-custom`** (optional), **`/pdlc-brief-custom`** on **`idea` → `discovery`**, **`/agent-prd`** in **`spec_ready`**, plus **design** pipeline skills — see [skill-agent-map.md](./skill-agent-map.md); UI **renders stepwise flows** + optional **agent-config overrides** (`pdlc-ui/agent-config/` — later slice) |
| **Workflows** | Steerco uses **guided UI**; Cursor remains optional for power users |

**Open (remaining):** **Headless** agent execution — **R15** (phase 2 after adoption proof); **design** skill packaging.

### As-is vs to-be (Steerco context — 2026-04-20)

**As-is — org & information flow:** Reporting lines are **misaligned** (e.g. Designer → CEO/CPO; PO → COO with Implementation Manager + SDM; Sales/CS → CEO; **no CTO**). Steerco exists but **information is thin and fragmented**; **broken telephone** is common (e.g. COO + Implementation Manager decide → PO/SDM notified → PO escalates via Designer → CEO/CPO → COO), often **after** a Steerco. Delivery is **heavy timeline / feature-factory** driven: long research, design, and workshops, then **descope for delivery** or **rescope for client/market pressure**.

**As-is — product process failures (focus for this initiative):** **Missed gates**, **design without spec**, **duplicate briefs**.

**To-be — roles:** **PM moves the record of truth** on the board; **Steerco** (CEO/CPO, COO, Sales, CS, Product — and Design where relevant) **inputs and decides**. **PO** owns **`pdlc-brief-custom` / `pdlc-idea-gate-custom` / `agent-prd`** question copy alignment with the shipped skills (see sprint backlog). **Nudge, not enforce** (MVP): the UI surfaces gaps (e.g. handoff hints) without hard-blocking engineering artefact checks until usage proves the flow.

**To-be — later discovery:** Discovery will become **evidence-led** (internet research, competitors, market signals) — **not in MVP**; expand the discovery skill when ready.

**Clarifying questions → captured answers (2026-04-20)** — use for acceptance tests, copy, and **why discovery is non-optional** in the UI flow.

| # | Question | **Answer (WT today)** |
|---|----------|------------------------|
| 1 | **Duplicate briefs — where?** | **Verbal 1:1s** and **Steerco discussions** — second “brief” lives in conversation, not a single named artefact. |
| 2 | **Design without spec — how?** | **Norm is spec → build → retrofit design** (or spec/documentation **after** the fact), not spec-before-build. |
| 3 | **Missed gates — which? why?** | **Discovery is mostly skipped** — **time pressure**, not policy. **This initiative directly targets that** (brief + discovery on rails, visible on the board). |
| 4 | **Steerco → implementation drift** | Steerco can agree, then **next week’s fires** or **delivery pressure** change scope. Work happens **in isolation**; others learn **word of mouth** only — no shared record of truth. |
| 5 | **Late scope pressure — driver?** | **Internal deadline** and **demo** (vs single loud client as primary today). |
| 6 | **MVP success — what “worked”?** | **Dev output conforms to PRD + design**; fewer gaps from **prompt-led dev** missing context. Despite heavy research, docs, design, workshops, and **Jira**, dev still **misses factors** when building (especially **FE catching up to BE**); **~30% of planned items missed**. Devs **resist Jira**. **Success:** faster **idea → develop** with **connected context** fed into **Cursor Plan mode** — **no skipped stages**, **no missing info** → **less back-and-forth**, fewer **quick fixes** and **sophisticated hacks**. |

**Product implications (backlog):** Treat **discovery** as a **first-class, timeboxed** step (not “extra”); strengthen **spec_ready → develop** handoff bundle (PRD + design + explicit checklist) for **Plan mode**; optional later: nudges for **FE/BE dependency** and **parity with planned scope** (without re-building Jira).

**Company strategy (working draft for R12):** [company_strategy.md](./company_strategy.md) — short WT thesis + in/out examples; **not** Dex `pillars.yaml`. *Pressure drivers (deadline, demo) noted above for future warning copy.*

**Board `lifecycle` values (resolved):** `idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed` (+ **`parked`**). **`/pdlc-brief-custom`** ( **`idea` → `discovery`** ) and **`/agent-prd`** ( **`spec_ready`** ) are the **primary subflows** tied to **column moves**; optional **`/pdlc-idea-gate-custom`** while in **idea** — see [lifecycle-transitions.md](./lifecycle-transitions.md) and `06-Resources/PRDs/README.md`.

---

## Phase 2 — Internal scan

| Source | Finding |
|--------|---------|
| [PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) | Stages **0–7** already defined with **Done when** — use as sprint backlog source |
| [Product_orchestration_playbook.md](../../06-Resources/Product_orchestration_playbook.md) | Ladder: idea → brief → discovery → **`/agent-prd`** → flat PRDs — **do not fork** a second schema |
| [PRDs/README.md](../../06-Resources/PRDs/README.md) | **Essential** table = default card catalogue for “launch corpus” |
| `System/pillars.yaml` | Dex **personal** pillars — **not** the same as **company strategy** for WT conformance (post-MVP R12) |
| `06-Resources/Learnings/` | No PDLC-specific patterns yet — add **scope creep** / **vault write** lessons after first slices |

---

## Phase 3 — Capability match (Claude Code / Cursor + product)

| Requirement pattern | Suggested implementation | Feature type | Rationale |
|----------------------|---------------------------|--------------|-----------|
| Repeatable PDLC questions in chat | **`/pdlc-brief-custom`**, **`/agent-prd`** (+ optional **`/pdlc-idea-gate-custom`**) — canonical **`/product-brief`** stays for non-PDLC Dex chat | **Skill** | Source of truth for copy + order; UI embeds or exports same steps — [skill-agent-map.md](./skill-agent-map.md) |
| “After PRD file edit, validate structure” | **PostToolUse** hook or CI grep (vault) | **Hook** / CI | Keeps frontmatter + WP tables consistent |
| “Load north star + pillars at session start” | **SessionStart** or rule pointer to `plans/PDLC_UI/` | **Rule** / doc link | Reduces “which slice are we on?” friction |
| Heavy parallel research (market + competitor) | **Explore** sub-agent | **Sub-agent** | Optional when building **Market** tab (later slice) |
| One-shot “scaffold Stage 0 page” | **Command** e.g. `/pdlc-ui-slice` (future) | **Command** | Only if team repeats same kickoff often |
| DS context for Claude Design | **Manual** Figma ↔ Claude Design sync; **exported `.md`** includes a fixed **“Design system”** section telling the user to apply the **DS already connected in Claude Design** (tokens, themes, components) — no Figma MCP in this plan | **Artefact** | ICT-friendly; single prompt pack for upload to claude.ai/design |

---

## Phase 4 — Adjacent improvements (“while we’re here”)

1. **Single `initiatives.json` schema doc** in app repo (or vault stub) — versioned alongside UI so Dex agents and UI share one shape.  
2. **`/dex-improve` slice template** — copy `plan.md` § Implementation into one file per stage under `plans/PDLC_UI/slices/`.  
3. **Link from `Product_orchestration_playbook`** — one line pointing to `plans/PDLC_UI/` (optional doc hygiene).

---

## Phase 5 — Decisions (**resolved 2026-04-21**, **governance 2026-04-23**)

| # | Question | **Decision** |
|---|----------|--------------|
| 1 | **Where does the UI code live?** | **This repo** (same vault/workspace as specs). Suggested implementation root: **`pdlc-ui/`** at repository root (static site + small local API, or full stack — final stack per Stage 0 spike). Rationale: UI reads/writes **vault-adjacent persistence** and references `06-Resources/PRDs/` without cross-repo sync. |
| 2 | **Persistence v1** | **Full CRUD** on orchestration data (initiatives, open questions, attachments, stage transitions) — **not** read-only. Persist in-repo (e.g. `pdlc-ui/data/*.json` **or** SQLite under `pdlc-ui/` — choose in Stage 1); PRD markdown may still go through **git PR** for auditability, but the board itself is **create / read / update / delete**. |
| 3 | **Who can move cards / gates?** | **PM** moves the **record of truth** on the board (single operator on the host for now); Steerco **decides** in session. **No** per-user RBAC in MVP. **Design → `spec_ready`** and **`spec_ready` → `develop`** use **nudge** + checklists (not hard enforcement of “engineering must have X” until validated). **Backward from `develop` / `uat`** — **PM approves** in MVP. |
| 4 | **Board owner (interim)** | **Shaun** is the single **board / process owner** until handover — Steerco still **decides**; owner controls gates, column moves policy, and **Cursor polish** (`/anthropic-frontend-design`) execution. |
| 4b | **Design review waive** | **PO or Designer** may waive (policy); UI captures **reason + timestamp**; audit **`by`** field uses placeholder **Shaun** until v2 auth. |
| 4c | **`develop` / `uat` / `deployed`** | **Read-only lane semantics for status** in MVP (manual PM update to reflect reality). **User-facing release notes** (non-technical, end-user benefit) on the card when work hits **`develop`** and/or when **`develop`** completes — see **R14** in Requirements. **Jira** out of scope (possible tool change). |
| 5 | **Where do feature PRDs live?** | **`06-Resources/PRDs/*.md`** is the **long-term home** for all product PRDs through the PDLC. A **PRD used only to build `pdlc-ui` itself** is the bootstrap exception for this rollout. |
| 6 | **Board vs PRD file conflict** | **`pdlc-ui` persistence wins** for **stage** / column. When updating flat PRDs, **set `lifecycle` from the board** (do not overwrite board state from stale frontmatter). |
| 7 | **User management MVP** | **None** — single operator (**PM**) expected on host; no per-user RBAC in v1. |
| 8 | **R8 MVP vs later** | **MVP:** build **`spec_ready`** so **`/agent-prd`** is natural (export pack, pre-filled Cursor, clarifications **inside the wizard**); **full in-browser automation** once proven — **org carries cost**. |
| 9 | **BDD in PRDs** | **Optional for MVP** — [`/agent-prd`](../../.claude/skills/agent-prd/SKILL.md) offers **Step 3b (Gherkin)**; teams may use **Success Scenarios** prose only until ready. |
| 10 | **Backward / rework** | **`spec_ready` → `discovery` / `design`** allowed with data retained; **`→ idea`** wipes to **title + description only**. See [lifecycle-transitions.md](./lifecycle-transitions.md). |
| 11 | **`parked`** | Moving to **parked** requires **`parked_intent`**: `revisit` \| `wont_consider` **and** a **short reason** (free text). |
| 12 | **Company strategy conformance** | **Post-MVP:** initiative vs **Wyzetalk company strategy** (e.g. engagement platform for blue-collar workers vs a **budgeting tool** idea) — **automatic non-conformity signal** needs a **company-strategy artefact** (not Dex `pillars.yaml`). **Not in MVP**; optional manual tag later. **Sprint 9** in backlog is **deferred / repurposed** until strategy model exists. |
| 13 | **Vault continuity (to-be)** | Keep **full context** in vault under PRDs: **create** stub on idea; **append/update on save** as brief, discovery, and spec evolve; **tabs** on card (Idea · Brief · Discovery · Spec/PRD · Design links); **history**; **re-run discovery** when brief changes; **re-run spec path** when discovery changes in **`spec_ready`**. User-facing copy: **never** “promote to vault” — use **“Saved to product files”** or similar. **Phased:** after core board MVP or dedicated slices — see **R13** (Requirements). |
| 14 | **Release notes governance** | **PM** drafts **user-facing, non-technical** release notes on the card when work enters `develop`; edits through `uat` / `deployed`. Source for internal comms and end-user messaging — see **R14** (Requirements). |
| 15 | **Agent automation** | **MVP** = human-in-loop export; **headless** execution = **phase 2** after adoption proof — see **R15** (Requirements). |

### Sprint 0 kick-off decisions (park until S0 planning — do **before** coding)

The items below are **not blockers** but must be **chosen** on Day 1 of S0 (README line or ADR). Skipping them means rework by S2.

- **Canonical JSON field case:** **camelCase** (e.g. `parkedIntent`, `parkedReason`). Snake_case in older prose is legacy — update when touched.
- **Initiative human ID:** add a short handle (e.g. `INIT-0042`) **in addition to** internal `id` so Steerco can say “the one I raised last week.” Schema field: `handle` (string, unique).
- **Event / audit log (from S1):** `events[]` on initiative (or sibling table) — at minimum **stage transitions** `{ at, by, from, to, note? }`; extend to key field edits later. Low cost, closes the as-is pain of “nobody knows when X changed.”
- **Attachments policy — MVP:** **links only** (Figma, Claude Design, SharePoint, internal drive). **No binary uploads** in MVP; document an approved external host in OPERATIONS.
- **Backup cadence:** **daily automated snapshot** + **ad-hoc before demos**; retention **30 days** unless ICT says otherwise. Capture in BACKUP_RUNBOOK.
- **Time zone:** **UTC** stored, **SAST** displayed (WT is SA-based). First ADR.
- **Git host + CI runner:** named in **first ADR** (e.g. “GitHub + GitHub Actions” or “internal GitLab + GitLab CI”). Branch protection config follows from this.
- **Accessibility baseline:** **WCAG 2.1 AA + full keyboard navigation** targeted; manual checks per PR until automated tooling exists. Documented in [implementation-standard.md § 2](./implementation-standard.md) (spec in [tech-stack.md § 3](./tech-stack.md#3-ui-primitives-r18)).
- **Scope devices:** **desktop browsers only** for MVP (laptop Steerco flow). Mobile deferred.
- **PII / retention:** initiative content may include **staff and client names**; retention policy = indefinite until a data owner is named (deferred); **delete** path exists via `R9` CRUD.
- **Schema evolution for JSON store:** read old, write new pattern + `schemaVersion` + one-shot migration scripts in `pdlc-ui/scripts/migrations/` (documented even if unused until S3/S5).
- **Undo last move — Out:** backward moves + pre-wipe snapshot cover rework; no dedicated undo stack in MVP.
- **First real initiative post-S8:** PM picks **one low-risk existing feature** to run through the board end-to-end as the **first live Steerco demo**; candidate named during S7.

---

## Requirements

- [ ] **R1:** Ship **Stage 0** (shell page) before any modal or lane logic.  
- [ ] **R2:** **Create idea** (Stage 1) persists at least one **initiative** record with `stage=idea`.  
- [ ] **R3:** **Swim lanes** (Stage 2) render **`idea` \| `discovery` \| `design` \| `spec_ready` \| `develop` \| `uat` \| `deployed`** (+ **`parked`**), aligned to [PRDs/README](../../06-Resources/PRDs/README.md) and [lifecycle-transitions](./lifecycle-transitions.md).  
- [ ] **R4:** On **`idea` → `discovery`**, open **`/pdlc-brief-custom`**-aligned stepwise popup (help text per question; writes `brief.*` / discovery drafts per schema — **not** a full PRD); minimum required fields documented; optional fields skippable; save persists before discovery work continues. **Optional:** while card is in **`idea`**, offer **`/pdlc-idea-gate-custom`** (writes `gate.*`).  
- [ ] **R5:** **Discovery** supports open questions (open → answer → save), **workshop export**, **“Re-run discovery”** after answers change, and **export pack** (prompt + `.md`) for **Claude Design**.  
- [ ] **R6:** **Design (Claude Design — web)** after discovery: **Figma** remains DS source of truth; **maintenance Figma ↔ Claude Design is manual**. **Exported pack** (downloadable `.md`) must include an explicit **Design system instructions** block: tell the reader to use the **DS already set up in Claude Design** (themes, tokens, components) and not to invent a parallel palette. Card stores **Figma library URL** (reference) + **lo-fi artefact** link or embed (mandatory); **hi-fi** only when **`hiFiRequired`** gate is true.  
- [ ] **R6b — Post–Claude Design, in Cursor:** The same export pack ends with a **mandatory “Implementation polish”** subsection: paste **Claude Design outputs** (handoff bundle path, `PROMPT.md` excerpt, HTML export, or key screens) and run **`/anthropic-frontend-design`** so production-oriented UI code **inherits** the Design session — not a separate creative direction. **R6b copy lives in [export-pack-template.md](./export-pack-template.md) from Sprint 4 onward**; a UI CTA to copy that block is **polish only** (S10+ optional).  
- [ ] **R7:** **Design review** blocks **`design` → `spec_ready`** without pass or waiver (lighter path when no hi-fi).  
- [ ] **R8:** Column **`spec_ready`** follows **[`/agent-prd`](../../.claude/skills/agent-prd/SKILL.md)** semantics. **Structured clarifying questions in the spec wizard are required** so the PRD is not incomplete; **iterate** question sets as usage data arrives (PO owns alignment with the skill). **MVP:** export + pre-filled Cursor; questions **inside** the stepwise wizard (async card prompts = later). Ingest brief, discovery, design artefacts. Output: **reviewable** `06-Resources/PRDs/<Feature>.md` (or patch). **BDD** optional. **`spec_ready` → `develop`** after **`specComplete`** (nudge-based checklist — see sprint backlog **spec_complete** defaults). Handoff = **PRD MD + design** for **Plan mode**. **git PR** for markdown.  
- [ ] **R9:** **CRUD** for all board-owned entities (initiatives, questions, artefacts) with **delete** confirming destructive actions (soft-delete optional in v1).  
- [ ] **R10:** **Backups** — `pdlc-ui` data store (JSON/SQLite) is **business-critical**; define **owner, frequency, retention, and restore drill** (same bar as vault git remotes).  
- [ ] **R11:** **Backward moves** per [lifecycle-transitions](./lifecycle-transitions.md); **`→ idea`** = confirm + **wipe** to title + description only.  
- [ ] **R12 (post-MVP):** **Company strategy** conformance (distinct from Dex personal pillars) — e.g. WT “engagement platform for blue-collar workers” vs a **budgeting tool**; automatic signal needs a **company-strategy source file** + rules/ML. **Deferred** until after MVP; backlog **S9** repurposed when R12 is ready.  
- [ ] **R13 (vault continuity — phased, write-capable):** The board **is the live store** for all answers (brief, discovery, open questions, spec clarifications); writes are **first-class**, not read-only — people must be able to **answer questions against specific initiatives** directly in the UI. **Vault markdown** under **`06-Resources/PRDs/`** is **regenerated at lifecycle milestones** (idea stub → brief save → `spec_ready` entry → `develop` entry), **not** via a continuous file watcher in MVP. Card **tabs** (Idea · Brief · Discovery · Spec/PRD · Design attachments); **history**; support **re-run discovery** after brief edits and **re-run spec** after discovery changes in **`spec_ready`**. User-facing copy: **“Saved to product files”** (not “promote to vault”). **Bar A** ships board-side writes + milestone generation; **Bar B** adds board ↔ vault **reconciliation** with explicit conflict rules; **Phase 3+** lets discovery answers cite attached **meeting transcripts** and ingested **signals** so discovery compounds (see **MVP bars § Phase 3+**).  
- [ ] **R14 (release notes):** **User-facing, non-technical** release notes (what the **end user** gets) on the card — editable when the card enters **`develop`** and/or when **`develop`** is marked complete; readable from **card view**. Jira integration **out of scope** for MVP.  
- [ ] **R15 (agent execution phases):** **MVP** = human-in-loop export; **headless** agents / workers = **phase 2** after adoption proof (org carries cost).  
- [ ] **R16 (engineering governance — cross-sprint):** **Patterns, rules, and guardrails** so implementation does not drift between sprints — see **§ Engineering governance** below and [engineering-guardrails.md](./engineering-guardrails.md). Includes: **branch per cycle (no feature dev on `main`)**, **green CI required to merge default**, and **`/moneypenny-custom`** for **`pdlc-ui/`** PR merge discipline ([skill-agent-map](./skill-agent-map.md#engineering--merge-gate-pdlc-ui-repo)).
- [ ] **R17 (operational baseline — data + DevOps):** **SQLite/JSON safety**, **health/version**, **secrets hygiene**, **CI audit hooks**, **deploy/rollback** one-pager, **optimistic `revision`**, **R13 git conflict** rules — see **§ Data, DevOps, and operability** below; **S0 seeds**, **S1 completes** minimum safe writes path.
- [ ] **R18 (UI baseline — content rendering + editor + accessibility + consistency):** Users **never** see raw markdown on cards; every initiative prose field is rendered through a **content renderer** (TipTap read-only or sanitised HTML) and edited through a **rich-text editor** with a defined **toolbar minimum** (**Bold, Italic, Underline, H2, H3, bulleted list, numbered list, link, inline code, clear formatting**). Markdown remains the **storage / export** format (export pack unchanged). **Colour + contrast:** all colours come from **semantic tokens** in `pdlc-ui/src/styles/tokens.css` — pre-validated for **WCAG 2.1 AA** (4.5:1 text; 3:1 large text / UI / focus ring). **No ad-hoc hex or default Tailwind colours** in user-visible code; forbidden clashes (bright-blue links on white, red on blue, etc.) are structurally impossible because components read tokens, not raw values. **Focus ring:** visible 2 px on every interactive element; `outline: none` without a direct replacement is a bug. **Keyboard navigation** end-to-end (no mouse required). **Consistency:** every surface uses **`/anthropic-frontend-design`** + shared primitives (**shadcn/ui** or equivalent per ADR-0001) from Sprint 0; new surfaces consume `tokens.css`; exceptions need a **PR-note ADR** (R16 guardrail 4). Full detail: [tech-stack.md § UI primitives](./tech-stack.md#ui-primitives). S0 seeds tokens + primitives; S5–S6 grow them into `pdlc-ui/docs/design-system.md v0.1`.

### Engineering governance (CTO / tech lead — anti-drift)

**Why:** Solo or small team + **Plan mode** per sprint risks **inconsistent patterns**, **silent schema drift**, and **UI that ignores `design-system.md`** after S6 unless it is mandatory.

**Guardrails (minimum bar):**

1. **Contracts before features** — [schema-initiative-v0.md](./schema-initiative-v0.md) + `canTransition` rules stay aligned with [lifecycle-transitions.md](./lifecycle-transitions.md). **No new `lifecycle` string** or initiative field in code without updating those docs in the **same** PR (or a follow-up PR within 24h with a TODO in slice log — pick one rule and stick to it; default: **same PR**).
2. **ADRs for irreversible choices** — `pdlc-ui/docs/adr/` — one short file per decision (stack, persistence store, auth, deployment). **Sprint 0** seeds `README` + template; any decision that would **embarrass you to reverse** gets an ADR before merge.
3. **Automation** — Lint, format, typecheck on every PR; **validate** at least one **golden `initiative.json`** against schema (CI script from **S0** onward). Add tests for **`canTransition`** when S8 lands (required in S8 DoD already).
4. **UI consistency** — [implementation-standard.md](./implementation-standard.md) + [tech-stack.md § 3](./tech-stack.md#3-ui-primitives-r18) + post-S6 **`pdlc-ui/docs/design-system.md`**: **new** surfaces **reuse** tokens/primitives unless a **one-line ADR** documents an intentional exception.
5. **Sprint boundary discipline** — Each merge references the **Plan mode seed** sprint id in PR description; slice log gets a **tech handoff** line (what the next sprint must not break).
6. **Dependencies** — Lockfile committed; document **upgrade policy** in `pdlc-ui/README.md` (e.g. monthly patch, major needs ADR).
7. **Branch-per-cycle — never develop on `main`** — Each sprint or shippable increment is implemented on a **dedicated branch** (e.g. `feat/s2-swim-lanes`, `sprint/3-brief`); **`main` stays releasable** and only moves via **PR merge**. Solo is not an exception: **no long-lived direct commits to default** for feature work.
8. **Green CI before merge** — **No merge to the default branch** unless **CI is green** (lint, format, typecheck, schema validate; tests as they exist). Configure **branch protection** on the hosting git when ICT allows; until then, treat it as a **manual hard rule**.
9. **MoneyPenny (PR gatekeeper skill)** — For **`pdlc-ui/`** pull requests, invoke **`/moneypenny-custom`** ([`.claude/skills/moneypenny-custom/SKILL.md`](../../.claude/skills/moneypenny-custom/SKILL.md)) before merge: watch **`gh pr checks`**, apply minimal CI fixes, run the **R16 same-PR audit** against the diff, triage review comments, and (after merge) optionally append the **Slice log** + tick **`plan.md` Progress**. Documented in [skill-agent-map.md](./skill-agent-map.md#engineering--merge-gate-pdlc-ui-repo) and [sprint-backlog.md](./sprint-backlog.md#engineering-guardrails-cross-sprint--tech-lead--cto-hat). Requires GitHub CLI (`gh`) authenticated once.

**Hotfix (only exception):** `hotfix/*` from a tagged release, PR + **same CI**; ICT emergency bypass only with **post-hoc ADR** in the slice log.

**Sprint 0 vs later (CTO split — avoid S0 bloat):** **S0** must **install** the **rails** (ADRs, CI, schema + golden JSON **required** in CI, health/version hooks, `.env.example`, backup runbook, operations one-pager). **S0 does not** need full staging, Docker prod, migration history beyond “empty DB”, or advanced security scanning — those land in **S1** (first real writes) and **S2** (multi-entity stress) unless ICT forces earlier. Course-correction is expensive: **get the skeleton and contracts right in S0**; **get data safety and deploy parity right before Steerco sees writes at scale** (latest **end of S1**).

### Data, DevOps, and operability (R17 — DB + ops lens)

**S0 seeds / S1 proves:** Items below are **requirements**, but **timeboxed** — **Sprint 0** establishes **docs + stubs + CI policy**; **Sprint 1** (first durable writes) **must** satisfy **SQLite/JSON write safety** and **migration or schemaVersion** before calling R17 “met” for persistence.

- **Environments:** Document **dev** vs **future staging/prod** (even if prod = single internal host for months); **no secrets in git** — only **`.env.example`** with dummy keys; real secrets in ICT-approved store.  
- **SQLite (if chosen):** **WAL** mode, **busy_timeout**, **single-writer** discipline (API serialises writes); **versioned migrations** (tool + `schema_migrations`); backups via **VACUUM INTO** or **file snapshot** with app quiesce note in runbook — not only “copy file while running” without guidance.  
- **JSON file (if chosen):** **Atomic rename** writes, **`schemaVersion`** (or file header) for forward compatibility, **fsync** policy documented; corruption recovery = restore from backup.  
- **Concurrency (future multi-user):** **`revision`** (integer) on initiative in schema **by end of S1** — enables **optimistic locking** without painful retrofit before S2.  
- **Observability:** **`/health`** (liveness) and **`/ready`** (if deps exist); **build `GIT_SHA` or version** exposed in UI footer or JSON — proves what Steerco is looking at. **Structured logs** (level, request id); **no initiative PII** in client console logs in prod.  
- **Deploy / rollback:** One-page **how to deploy** + **how to roll back** (previous artefact or git tag); internal host still needs a **reversible** story.  
- **CI security:** **`npm audit`** (or `pnpm audit`) on PR with **documented** severities policy; **`gitleaks`** or equivalent when repo is not purely local — align with ICT.  
- **HTTP / host:** **TLS** termination (proxy or host); **CSP** baseline for XSS; if exposed beyond corp VPN → **auth + rate limit** (post-MVP hardening if MVP is VPN-only).  
- **R13 (vault writes):** When implemented, define **git conflict** behaviour (last-write-wins vs block) and **who resolves** — not left implicit.

---

## MVP bars — Bar A (solo) → Bar B (Steerco) → Phase 2 (automation) → Phase 3+ (intel)

**Why this split:** the plan must serve **two very different day-1 realities** — one operator on **localhost** (now) and **Steerco on an internal host** (later) — without inflating MVP ceremony. Phases 2 and 3+ are captured here so they do not silently leak earlier.

### Bar A — Solo dogfood (localhost, one operator, **one real initiative**)

**Goal:** Run **one real feature** end-to-end through the board and produce a **better handoff than today**. Validates the thesis before Steerco sees it.

**In scope (tight):**

- Stages **0–3** (shell, create idea, swim lanes, `idea → discovery` with **`/pdlc-brief-custom`** wizard) + minimal **Stage 5 export pack** (lo-fi link + prompt `.md` for Claude Design / Cursor).
- **Board persistence** for all answers (brief, discovery, open questions, links) — **R13 writes** live here, in the board store.
- **Vault markdown at milestones** (not continuous sync): stub on idea; update at brief save, at `spec_ready` entry, at `develop` entry.
- Schema essentials from day 1: `schemaVersion`, `handle`, `events[]`, **atomic JSON writes**, daily snapshot (`cp -r data/ backups/$(date)`, 30-day retention).
- **`canTransition` pure function** with unit tests; all other gates are **nudges / warnings**, not blockers.
- One **ADR-001** (stack + persistence + why localhost); no wider ADR process.

**Explicitly out of Bar A:**

- Hard gates (**R7** design-review block, **R8** `specComplete` block) — surfaced as **warnings**, not enforced.
- **R9** delete-UX polish — soft-delete only.
- **R10** backup restore **drill** — daily snapshot is enough.
- **R14** user-facing release notes UI.
- **WCAG 2.1 AA** audits — keyboard nav only.
- **`design-system.md v0.1`** — generated in Bar B from real shipped surfaces.
- Any **“Open in Cursor” deep links** — export file + manual paste is the contract.
- All **R17** items tagged `gate: leaving-localhost` (`/health`, `/ready`, CSP, TLS, structured logs, gitleaks, `npm audit`, deploy/rollback, secrets store).

**Success (measurable, on the first real initiative):**

1. **`idea → spec_ready` wall-clock shorter** than the last comparable feature (baseline: recent WT feature chosen in S7).
2. **Zero retro-written PRD sections** — PRD content is **generated from the board thread**, not written after build.
3. At least **one “Re-run discovery”** event fires as a result of brief / open-question edits (proves discovery is load-bearing, not decoration).
4. **No `→ idea` wipes** used in anger (sanity check the rewind rule under real pressure).

**Exit:** When Bar A success lands on a **real** initiative, Bar B unlocks. Not on a calendar.

### Bar B — Steerco-authentic (internal host, many readers, PM writing)

**Goal:** Move the tool from “Shaun’s localhost” to a place **Steerco actually uses to decide**.

**Unlocks on Bar A exit:**

- **R7** hard gate for `design → spec_ready` (with waiver reason + timestamp audit).
- **R9** full CRUD incl. delete confirmation flow.
- **R10** backup **owner + restore drill** for the internal host.
- **R14** user-facing release notes on the card (drafted at `develop`, refined through `uat` / `deployed`).
- **R13 extended:** board ↔ vault markdown **reconciliation** (scheduled or on-save, **not** continuous watcher), with explicit conflict rules.
- **R17** `gate: leaving-localhost` set: `/health`, `/ready`, structured logs, build `GIT_SHA` in footer, TLS termination, CSP baseline, secrets in ICT-approved store, deploy / rollback one-pager, `npm audit` + `gitleaks` in CI.
- **`pdlc-ui/docs/design-system.md v0.1`** extracted from shipped surfaces (dogfooded through S5–S6).
- **WCAG 2.1 AA** + automated audit tooling.

**Still deferred from Bar B** (Phase 2+): headless agent execution (**R15**), company-strategy conformance (**R12**), marketing / competitor / signal intelligence surfaces.

### Phase 2 — Agent Flywheel (hosted automation)

**Thesis:** Once Steerco trusts the board, move from **human-in-loop export** (MVP) to **hosted workers** that run skills against card context on command or on event. Working name: **Agent Flywheel**.

**Candidate capabilities (research list, not committed scope):**

- Server-side **`/pdlc-brief-custom`** runner: card enters `discovery` → agent drafts typed brief from title/body + linked context → PM reviews in-card (same contract as Bar A wizard; not full **`/product-brief`** PRD generation).
- Server-side **`/agent-prd`** runner: brief + discovery + design handoff → draft PRD + structured clarifications → PM resolves → PRD written to vault.
- **Re-run discovery on change:** open-question answer edit triggers re-synthesis without the PM re-prompting.
- Background **design-review checklist** against lo-fi/hi-fi artefacts where tractable.

**Key unknowns to close before committing Phase 2:** hosting (internal VM vs managed runtime), per-card concurrency, cost ceiling, audit / redo semantics, failure UX, and how Phase 2 inherits the **R15** governance contract.

### Phase 3+ — Intelligence & meeting correlation (future research — capture now, do not build)

**Captured in [phase3-research.md](./phase3-research.md).** Four threads: **marketing intelligence**, **competitor analysis**, **signal curation**, **meeting correlation / question-answering**. Each is pinned to the **existing Dex skill / ingest** that already produces the input (`weekly-exec-intel`, `intelligence-scanning`, `meeting-prep`, `process-meetings`, etc.) — the UI's job is eventually to **serve those results back on the relevant card**, not replace the habits that produce them. **Not in Bar A or Bar B scope**; see `phase3-research.md` for promotion criteria.

**Implication for MVP schema (keep in plan so later bars honour it):** keep the initiative schema **extensible** — `attachments[]`, `sourceRefs[]`, `events[]`, `tags[]`, `handle` — so Phase 3+ can attach transcripts and signals without a painful migration. **No Phase 3+ code** in Bar A / Bar B; **shape-compatibility only**.

---

## Recommended approach

1. **Treat `04-Projects/PDLC_Orchestration_UI.md` as the backlog master** — after each slice, append **Slice log** there *and* a one-liner here under **Progress**.  
2. **V1 skill integration:** prefer **“Export prompt”** *and* **“Open in Cursor”** deep links where agent API is not wired — parallel to in-app CRUD, not a substitute for saving board state.  
3. **Essential PRD catalogue (Stage 2b):** can be **read + link** first, then **edit PRD metadata** in a later slice if needed — do not block **initiative CRUD** on PRD write.

**Trade-offs:** In-repo persistence keeps ICT surface area **inside** existing internal hosting; **R10** requires **proven backups** and restore drills for `pdlc-ui/data/` (or DB file) **in addition to** git history for markdown PRDs.

---

## Implementation steps

### Phase A — Foundation (vault + planning only)

1. Keep **`plans/PDLC_UI/plan.md`** updated each retro.  
2. Define **`initiatives` JSON schema** — **camelCase** (canonical) — fields: `schemaVersion?`, `revision?` (optimistic lock), `id`, **`handle`** (human e.g. `INIT-0042`), `title`, `body`, `stage` / `lifecycle`, `brief`, `openQuestions[]`, `discoveryIteration?`, `figmaLibraryUrl`, `claudeDesignSessionUrl?`, `loFiArtifactUrl`, `hiFiArtifactUrl?`, **`claudeDesignHandoffPath`**, **`implementationPolishNote`**, `parkedIntent?`, **`parkedReason?`**, `specComplete?`, `designReview?`, **`events[]?`** (stage transitions + key edits — seeded S1), **`userReleaseNotes?`**, `linkedPrdPath?`, `createdAt`, `updatedAt`, **post-MVP:** `companyStrategyTags?` / `strategyWarning?`. Home: `plans/PDLC_UI/schema-initiative-v0.md` when Stage 1 nears.

### Phase B — **This repo** (`pdlc-ui/` — execution)

1. **Stage 0** — scaffold **`pdlc-ui/`** (README + run instructions + shell page).  
2. **Stage 1** — modal + **CRUD** persistence (create/read/update/delete initiatives).  
3. **Stage 2** — lanes + cards + column moves (**PM** on host for MVP; same trust model as today).  
4. **Stages 3–7** — one sub-milestone per week or per PR, per north star table.

**Sprint execution:** follow **[sprint-backlog.md](./sprint-backlog.md)** — each sprint has **Goal / What / How / DoD** and a **Cursor Plan mode seed**; run Plan before implementation; log slices in `04-Projects/PDLC_Orchestration_UI.md`.

**Orchestration app UI:** implement **`pdlc-ui`** screens with **`/anthropic-frontend-design`** ([skill](../../.claude/skills/anthropic-frontend-design/SKILL.md)); **BE + UI** in vertical slices. **S5 (R6)** and **S6 (R7)** dogfood the Steerco design process and produce **`pdlc-ui/docs/design-system.md` v0.1** from shipped UI for **S7+** (see [implementation-standard.md § 5](./implementation-standard.md)).

---

## Files to create / modify

| File | Action | Purpose |
|------|--------|---------|
| `plans/PDLC_UI/README.md` | Created | Index for PDLC UI plans |
| `plans/PDLC_UI/plan.md` | Created | This `/dex-improve` plan |
| `04-Projects/PDLC_Orchestration_UI.md` | Update (ongoing) | Slice log after each ship |
| `plans/PDLC_UI/schema-initiative-v0.md` | Create when R1–R2 start | Shared contract UI ↔ agents |
| `pdlc-ui/` | Create at Stage 0 | **Canonical UI + persistence root** in this repo |
| `plans/PDLC_UI/skill-agent-map.md` | Created | Stage ↔ skill mapping; **agent-config** direction |
| `plans/PDLC_UI/export-pack-template.md` | Created | Copy-paste **export pack** for Claude Design + Cursor handoff |
| `plans/PDLC_UI/lifecycle-transitions.md` | Created | **`spec_ready`**, rewind rules, **parked**, company strategy (post-MVP) |
| `plans/PDLC_UI/company_strategy.md` | Created | **WT** thesis + in/out examples for future **R12** |
| `pdlc-ui/docs/adr/` | Sprint 0 | **ADRs** — irreversible engineering decisions (see **R16**) |
| `pdlc-ui/docs/OPERATIONS.md` | Sprint 0 | Deploy, rollback, health, logs (**R17**) |
| `plans/PDLC_UI/sprint-backlog.md` | Created | **Agile sprints S0–S8**; **S9** = deferred R12 — goals, R# map, how, DoD, **Plan mode seeds** |
| `plans/PDLC_UI/plan-mode-prelude.md` | Created | **Shared preamble** every sprint Plan mode run reads first — lists all cross-sprint references, enforces R16 / R18 non-negotiables, defines expected backlog sprint shape + Plan-mode output contract |
| `plans/PDLC_UI/tech-stack.md` | Created | **Recommended stack + UI primitives § 3 (tokens, typography, focus/keyboard/motion, TipTap toolbar, shadcn primitives, forbidden "AI slop" patterns)** — ratified or overridden by **ADR-0001** in S0 (R18). Authoritative UI spec. |
| `plans/PDLC_UI/implementation-standard.md` | Created | **Cross-sprint HOW rules** — UI-building rule (read `/anthropic-frontend-design`), a11y baseline, vertical-slice shape, R18 inheritance pointers, S5–S6 design-system dogfood loop |
| `plans/PDLC_UI/engineering-guardrails.md` | Created | **R16 guardrail table** — schema / ADRs / CI / branch-per-cycle / merge gate / S0 vs S1 split / end-of-sprint ceremony / hotfix |
| `plans/PDLC_UI/seeds/` | Created | **Detailed seed file per sprint** (S0–S9) — read by Cursor via backlog's inline Plan-mode seed prompt. Not the paste target. |

---

## Compound opportunities

- [ ] **Steerco demo recording** checklist (5 min Loom per stage).  
- [ ] **Telemetry:** stage transition counts (privacy-reviewed).  
- [ ] **Duplicate detection:** new idea vs existing PRD title fuzzy match.

---

## Acceptance criteria (plan-level)

- [ ] **AC1:** Every **Stage 0–7** row in north star has **one owner** and **one “Done when”** verified before closing slice.  
- [ ] **AC2:** No slice merges **design system** + **full wizard** + **first PRD file generator** in same PR (keep CRUD board work separable from PRD markdown generation).  
- [ ] **AC3:** `plans/PDLC_UI/` is linked from `04-Projects/PDLC_Orchestration_UI.md` (see below).

---

## Questions resolved

| Q | A |
|---|-----|
| Where to store `/dex-improve` output for this initiative? | **`plans/PDLC_UI/`** (this folder). |
| North star vs plan? | **Project** = outcomes & stages; **Plan** = Dex/capability workshop + requirements checklist. |
| Where does UI code live? | **This repo**, suggested root **`pdlc-ui/`**. |
| Persistence v1? | **Full CRUD** (not read-only); store under `pdlc-ui/` (JSON or SQLite — TBD). |
| Who moves cards / uses **`spec_ready`**? | **PM** moves the record; single operator on host; no per-user code lock in MVP. |
| Who owns the board process for now? | **Shaun** (single owner until handover). |
| Board vs PRD `lifecycle` conflict? | **Board wins**; sync YAML from board when updating PRDs. |
| BDD required? | **No** — optional Step 3b in **`/agent-prd`**. |

---

## Progress log

| Date | Note |
|------|------|
| 2026-04-20 | Plan created; north star unchanged. |
| 2026-04-21 | Phase 5 resolved: this repo + `pdlc-ui/`, full CRUD, Steerco-wide moves (internal trust boundary). |
| 2026-04-21 | Architecture + skills | [skill-agent-map.md](./skill-agent-map.md); PDLC doc §0 | WT UI **separate** from Dex; skills as behaviour engine; **agent-config** overrides later |
| 2026-04-22 | Design | [skill-agent-map.md](./skill-agent-map.md); PDLC §2 + Stage 5–6 | **Claude design** + Figma DS; **lo-fi mandatory**; **hi-fi** gated |
| 2026-04-23 | Design, spec, governance, lifecycle | [skill-agent-map](./skill-agent-map.md); [lifecycle-transitions](./lifecycle-transitions.md); [agent-prd](../../.claude/skills/agent-prd/SKILL.md); [PRDs/README](../../06-Resources/PRDs/README.md); north star | **`spec_ready`** column; **`idea`→`discovery`** = **`/product-brief`**; **rewind** / **`parked_intent`**; **R8–R12** (R12 strategy later revised post-MVP); Claude Design → **`/anthropic-frontend-design`** |
| 2026-04-23 | Agile delivery | [sprint-backlog.md](./sprint-backlog.md) | **S0–S9** sprints with **DoD** + **Plan mode** seeds; Phase B pointer (**S9** later **deferred** — see 2026-04-20 log) |
| 2026-04-23 | UI build standard | [implementation-standard.md](./implementation-standard.md) (extracted from sprint-backlog.md on 2026-04-21) | **`/anthropic-frontend-design`** for all `pdlc-ui` UI; **S5–S6** dogfood → **`design-system.md`** for **S7+** |
| 2026-04-20 | Governance + backlog | [plan.md](./plan.md); [sprint-backlog](./sprint-backlog.md); [lifecycle-transitions](./lifecycle-transitions.md) | **As-is/to-be** Steerco context; **PM** record of truth; **parked** intent+reason in **S2**; **`idea→discovery`** blocked until **S3**; **R6b** = template; **R12** post-MVP company strategy; **R13–R14** vault continuity + release notes; **solo 2-week** cadence; wipe mitigation; **develop** rewind MVP |
| 2026-04-20 | As-is validation | [plan.md](./plan.md) clarifying Q&A | Verbal/Steerco duplicate briefs; **retrofit design** pattern; **discovery skipped (time)**; post-Steerco drift + silos; **deadline+demo** pressure; success = **connected handoff to Plan mode**, less **30% miss** / hackery |
| 2026-04-20 | CTO / ops | [plan.md](./plan.md) **R17**; [sprint-backlog](./sprint-backlog.md) S0–S1 | **S0** = guardrail **machinery** (CI, ADR, health, OPERATIONS, .env.example); **S1** = **real** write-safety (WAL/migrations or JSON atomic, **revision**); deferred full Docker/staging unless ICT |
| 2026-04-20 | Sign-off pre-S0 | [plan.md](./plan.md) **Phase 5 #14**, **Kick-off decisions** block; [sprint-backlog](./sprint-backlog.md) cadence + a11y + canonical case | **Cadence normalised** (2-week default; S0 exception); **camelCase canonical**; schema adds **`handle`**, **`events[]`**; S0 kick-off decisions captured (handle/events/attachments links-only/backup daily+30d/UTC+SAST/git host+CI runner ADR/WCAG AA + keyboard/desktop-only/PII/JSON migration stub/no-undo/first real initiative TBC at S7); ready for Sprint 0 |
| 2026-04-21 | MVP bars + future phases | [plan.md](./plan.md) **MVP bars** section; **R13** revised; product philosophy line | **Bar A** (solo / localhost / one real initiative) vs **Bar B** (Steerco-authentic, internal host) split with explicit in/out scope and measurable Bar A success; **Phase 2 Agent Flywheel** (hosted skill runners) captured as future phase with unknowns; **Phase 3+** research list (marketing intel, competitor analysis, signal curation, meeting correlation via transcripts) pinned to Dex-native habits (`meeting-prep`, `process-meetings`, `weekly-exec-intel`); **R13** re-scoped as **write-capable** with **milestone-based vault generation** (no continuous watcher in MVP); product philosophy clarified — **UI steers what Dex already does** |
| 2026-04-21 | Plan/Build mode readiness review | [sprint-backlog.md](./sprint-backlog.md) **Plan mode prelude**; S0 + S1 seeds tightened | Added shared **Plan mode prelude** (mandatory reading, R16 non-negotiables, branch-per-cycle, camelCase, same-PR schema discipline, PR traceability, Bar awareness, Implementation standard). S0 seed rebuilt around **Bar A minimum / Bar B extension** split with explicit ADR list, kick-off decisions block in README, DoD checklist, and **Explicitly OUT**. S1 seed defers persistence to **ADR-0001** (no re-open), mandates `handle` + `revision` + `events[]` seeding, and keeps scope Bar-A-clean. No seed now invites `main` commits or snake_case regression. Ready for Cursor **Plan mode → Build mode** on S0. |
| 2026-04-21 | Prelude as file + tech stack + R18 UI baseline | [plan-mode-prelude.md](./plan-mode-prelude.md); [tech-stack.md](./tech-stack.md); R18 added; sprint-backlog S0/S1 seeds | Extracted **Plan mode prelude** into its own file so each sprint seed's first line is "read the prelude" — one paste into Cursor Plan, not two. Pre-filled **`tech-stack.md`** (Next.js 15 + React 19 + TS strict + Tailwind + tokens.css + shadcn/ui + TipTap + Zod + SQLite via better-sqlite3 + Drizzle + Vitest + Playwright) so ADR-0001 ratifies-or-overrides rather than decides from blank. Added **R18 (UI baseline)** to plan.md: cards **never** surface raw markdown (TipTap read-only or sanitised HTML render); **rich-text editor** with defined minimum toolbar (Bold, Italic, Underline, H2, H3, bulleted list, numbered list, link, inline code, clear formatting); **WCAG 2.1 AA contrast** enforced via **semantic tokens** in `tokens.css` (no hardcoded hex; no clashing bright-blue-on-white or red-on-blue); 2 px focus ring; keyboard-complete flows. S0 seed now installs tokens + shadcn primitives + TipTap build validation; S1 seed wires TipTap to the body field with paste hygiene. Implementation standard carries R18 into every later sprint automatically. |
| 2026-04-21 | Column-move skill contract | [lifecycle-transitions.md](./lifecycle-transitions.md) § Skill triggers; [skill-agent-map.md](./skill-agent-map.md); [pdlc-brief-custom](../../.claude/skills/pdlc-brief-custom/SKILL.md); [pdlc-idea-gate-custom](../../.claude/skills/pdlc-idea-gate-custom/SKILL.md) | **`idea` → `discovery`** invokes **`/pdlc-brief-custom`** (not **`/product-brief`** for board path); optional **`/pdlc-idea-gate-custom`** on **idea**; **`spec_ready`** = **`/agent-prd`**; plan + north star + sprint backlog cross-references updated. |
| 2026-04-21 | Seed files + read-then-plan prompts | [seeds/](./seeds/) (S0–S9 + README); [sprint-backlog.md](./sprint-backlog.md) Rule / Structure / per-sprint seed blocks | Extracted every Plan mode seed into its own file under `plans/PDLC_UI/seeds/s#-<slug>.md` mirroring the branch name (`feat/s#-<slug>`) — these are **detailed reference read by Cursor**, not the paste target. The **pasteable prompt stays inline in the backlog** as a short ~10-line block per sprint telling Cursor which files to read in order (prelude → detailed seed → backlog sprint block → 04-Projects slice log for **previous-sprint actual outcomes** → per-sprint contracts). Rationale: sprint scope drifts based on what the **previous sprint actually shipped** (e.g. ADR-0001 store choice → S1 write path; S5–S6 design-system.md → S7+ consumption); hard-coding context in the paste means rework every sprint, while referencing files means Cursor picks up current state each run. Every per-sprint prompt ends with "Flag any DoD item invalidated [by previous-sprint reality] before Build" so scope conflicts surface in Plan, not Build. S5 prompt includes an explicit **Bar A exit GATE** check. S2–S8 seed files normalised to start with "Read plan-mode-prelude.md first" line for consistency. Backlog DoD remains source of truth for scope; seed updates same-PR with any DoD change (R16 guardrail 1). |
| 2026-04-21 | Cross-sprint references extracted | [implementation-standard.md](./implementation-standard.md); [engineering-guardrails.md](./engineering-guardrails.md); [plan-mode-prelude.md](./plan-mode-prelude.md) § 1 + § 2; [sprint-backlog.md](./sprint-backlog.md) top-of-file Cross-sprint references callout + shrunken per-sprint prompts | Moved generic cross-sprint content out of `sprint-backlog.md` into dedicated reference files so the backlog contains **only what each sprint covers**. **`implementation-standard.md`** now owns the cross-sprint HOW rules (read `/anthropic-frontend-design` before styling, a11y baseline, BE + UI vertical-slice shape, R18 inheritance pointers, S5–S6 design-system dogfood loop); the UI / token / a11y **spec** continues to live in [`tech-stack.md § 3`](./tech-stack.md) (authoritative pre-build reference), and runtime artefacts remain code-side (`pdlc-ui/src/styles/tokens.css`, `pdlc-ui/docs/design-system.md`, `pdlc-ui/docs/ui-notes.md`). **`engineering-guardrails.md`** now owns the R16 guardrail table + hotfix rule + S0 vs S1 split + end-of-sprint ceremony. **`plan-mode-prelude.md`** gained a **Cross-sprint references** block at the top (single source listing every file Cursor must read each Plan-mode run) plus a **Backlog sprint shape** subsection replacing the backlog's "Structure (every sprint)" table. Per-sprint Plan-mode seeds in the backlog shrank from ~10 lines to ~6–8 lines — they no longer re-list schema, lifecycle-transitions, or prelude refs (prelude handles them automatically); they cite only sprint-specific extras (the sprint's detailed seed, backlog § Sprint #, Slice log for previous-sprint reality, relevant skill files, templates, ADRs). Net effect: reference files can grow without touching sprint content; adding a new cross-sprint ref is one edit (prelude) instead of nine (each seed prompt). |
| 2026-04-21 | **Sprint S0 shipped** | [pdlc-ui/README.md](../../pdlc-ui/README.md); [pdlc-ui/docs/adr/0001-stack-and-persistence.md](../../pdlc-ui/docs/adr/0001-stack-and-persistence.md); [`.github/workflows/pdlc-ui-ci.yml`](../../.github/workflows/pdlc-ui-ci.yml); [Slice log](../../04-Projects/PDLC_Orchestration_UI.md) | **`pdlc-ui/`** scaffold: Next.js 15 + React 19 + TS strict + Tailwind v4 + shadcn (Base UI per `shadcn init`) + TipTap read-only `/dev/editor-preview`; R18 `tokens.css` + `docs/ui-notes.md` measured contrast; golden fixture + Zod-generated JSON Schema + `npm run schema:validate`; Vitest + Playwright `@axe-core/playwright` smoke; ADR-0001 (SQLite+Drizzle target, JSON fallback) + ADR-0002 (GitHub Actions); `OPERATIONS.md`, `BACKUP_RUNBOOK.md`, `scripts/backup-daily.sh`, `/api/health` + `/api/ready`. **Sprint 1** starts on `feat/s1-idea-capture` after merge. |
| 2026-04-21 | **Sprint S1 shipped** | [pdlc-ui/src/storage/](../../pdlc-ui/src/storage/); [pdlc-ui/src/app/api/initiatives/](../../pdlc-ui/src/app/api/initiatives/); [pdlc-ui/src/components/ideas/](../../pdlc-ui/src/components/ideas/); [ADR-0001](../../pdlc-ui/docs/adr/0001-stack-and-persistence.md); [Slice log](../../04-Projects/PDLC_Orchestration_UI.md) | **R17 complete for initiatives.** SQLite + WAL + `busy_timeout` per ADR-0001, with a **two-layer split**: **Drizzle ORM** owns the query surface (`src/storage/schema.ts` + `repository.ts`), while migrations stay **raw SQL** (`src/storage/migrations/*.sql` applied by `src/storage/migrate.ts`, tracked in `schema_migrations`, CLI via `npm run db:migrate`). Initiative CRUD route handlers with **optimistic `revision` lock** (Drizzle `update(...).where(and(eq(id),eq(revision)))`, 409 on stale); monotonic `INIT-NNNN` `handle`; **hard-delete + `deleted_initiative_events` tombstone** (soft-delete deferred). **R18:** shared TipTap `RichTextEditor` (Bold / Italic / Underline / H2 / H3 / UL / OL / link / inline code / clear formatting) + `RichTextRenderer` used on list + card (no raw markdown surfaces anywhere); paste hygiene strips styles / fonts / colours / Office + Google Docs wrappers; role=textbox + aria-multiline so axe passes. Zod `events` tightened (`create` \| `delete` \| `stage_transition` \| `field_edit` \| `skill_run` \| `review`); golden fixture updated with `create` event; schema-initiative-v0 §6 + project Slice log + ADR-0001 Consequences updated same-PR (S1 split + HTML body serialization trade-off documented). Playwright covers ideas list + create-dialog axe + end-to-end CRUD smoke. **Tech: next sprint must preserve:** the `initiatives.data` JSON column contract (all non-queryable nested fields live there), the `revision +1` invariant on every write, `events` kinds as a closed Zod enum, any column change edits **both** `migrations/*.sql` **and** `schema.ts` in the same PR, and the hard-delete tombstone pattern (S2 stage transitions add `kind='stage_transition'` to `events[]` on the live row — not the tombstone table). |
| 2026-04-21 | **Sprint S3 shipped** | [pdlc-ui](../../pdlc-ui/) brief wizard + `POST .../brief`; [schema-initiative-v0 §4.2](./schema-initiative-v0.md); [lifecycle-transitions](./lifecycle-transitions.md); [Slice log](../../04-Projects/PDLC_Orchestration_UI.md) | **`/pdlc-brief-custom`-aligned wizard** unlocks `idea → discovery`; **atomic** brief save + lane move (**`revision +1`**); **`brief.complete`** gate; **`skill_run`** audit; tightened **`briefSchema`** / **`eventSchema`**; **Brief** panel + **Export for Cursor**; smoke [S3-brief-wizard.md](../../pdlc-ui/docs/smoke/S3-brief-wizard.md). |
| 2026-04-21 | **S3A planning pass** (post-S3 cohesion) | [seeds/s3a1-brief-wizard-interactions.md](./seeds/s3a1-brief-wizard-interactions.md); [seeds/s3a2-discovery-automation.md](./seeds/s3a2-discovery-automation.md); [sprint-backlog § S3A.1 + § S3A.2](./sprint-backlog.md); [pdlc-ui/docs/design/board-layout.md](../../pdlc-ui/docs/design/board-layout.md); [schema-initiative-v0 §6](./schema-initiative-v0.md#6-events--append-only-audit); [lifecycle-transitions — Cross-lane DnD](./lifecycle-transitions.md) | Split the **S3A** sprint into **S3A.1 (interactions + board layout shell)** and **S3A.2 (automation surface + side panel)** after a CPO/CTO critique (scope was 7 vertical slices for 2 weeks; runner-process question unresolved). **S3A.1:** drag-and-drop with client-side `canTransition` + keyboard DnD first-class; mandatory-field indicators; summary-step composite with click-to-edit + two actions (primary "Save brief & start discovery" / secondary "Save brief only" — identical server behaviour in 3A.1); one-line `problem.value` preview on card face; **chrome-light board shell** + **elastic columns** + **parked right-edge rail** + **density toggle** per [board-layout.md](../../pdlc-ui/docs/design/board-layout.md) §1–§4. **S3A.2:** scoped prefill (`problem` + `targetUsers` only; feature-flag off in prod); **tick-driven discovery kickoff** (client-polled, server-advanced, no background process) with new **`initiative_jobs` table** + startup reconciler; **non-modal resizable side panel** (`role="complementary"`, 320/420/600px, drag auto-collapse to 80px rail) with tabs Idea / Brief / Discovery / Activity; edit-existing-brief (no kickoff re-fire); focused-column mode. Schema tightening: `skill_run.iteration` semantics locked as `count(prior (initiativeId,skill)) + 1` in [§6](./schema-initiative-v0.md#6-events--append-only-audit); known skill ids enumerated (`pdlc-brief-custom`, `pdlc-brief-prefill-custom`, `discovery-kickoff-custom`). [`lifecycle-transitions.md`](./lifecycle-transitions.md) updated: cross-lane DnD is **additive** to the `Move to…` menu (both paths share the same `canTransition`; gate on `idea → discovery` preserved). S4+ sprint blocks untouched; no S3 contract widened. |
| 2026-04-22 | **Sprint S3A.1 shipped** | [PR #3](https://github.com/shaunstruwig007/Dex/pull/3); [pdlc-ui/src/components/ideas/](../../pdlc-ui/src/components/ideas/); [pdlc-ui/src/components/brief/brief-wizard-dialog.tsx](../../pdlc-ui/src/components/brief/brief-wizard-dialog.tsx); [pdlc-ui/content/pdlc-brief-steps.json](../../pdlc-ui/content/pdlc-brief-steps.json); [lifecycle-transitions.md — Cross-lane DnD](./lifecycle-transitions.md); [tech-stack.md §3.5](./tech-stack.md); [plan-mode-prelude.md](./plan-mode-prelude.md); [Slice log](../../04-Projects/PDLC_Orchestration_UI.md) | **Brief wizard + board interaction polish delivered.** Brief shrunk to **3 required fields** (`problem`, `targetUsers`, `coreValue`) via `briefSchema.superRefine` + `missingForCompleteBrief` — server-side guard in `saveBriefAndTransition`; legacy `scopeIn` / `scopeOut` / `assumptions` / `constraints` / `successDefinition` retained as optional for backward compat (no migration). Wizard gains StepRail with red-dot required indicators, asterisks + "Required" copy, summary composite with click-to-edit jumps, and dual save buttons (`Save brief only` + `Save brief & start discovery` — server-identical this sprint; kickoff side-effect deferred to S3A.2 for M1 honesty). **Cross-lane pointer DnD** via `@dnd-kit/core` only (`@dnd-kit/sortable` deliberately not installed — Q-alt.1); `PointerSensor` 6px activation; same `canTransition` matrix evaluated on drag; illegal lanes dim with the existing `humanError` tooltip; `same_lifecycle` drop is silent (Q-P2.1); `idea → discovery` opens the wizard (gate preserved); `→ parked` opens the existing dialog. **Keyboard cross-lane surface** = the `Actions → Move to…` submenu this sprint — pixel-perfect `dnd-kit` Space/Arrow/Space keyboard DnD deferred to S3A.2 under focused-column mode (M1 honesty). **Board layout shell** per [board-layout.md §1–§4](../../pdlc-ui/docs/design/board-layout.md): chrome-light 48px sticky bar, board becomes scroll container, elastic 7-lane grid (`repeat(auto-fit, minmax(280px,1fr))`), collapsible right-edge **parked rail** (localStorage-persisted), compact/comfortable/detailed **density toggle** (CSS vars + localStorage); truncated `problem.value` preview on the card face when `brief.complete`. **Pass-2 correction (`3875475`):** removed native HTML5 `draggable={!isParked}` from the card `<li>` after human validation revealed it preempted dnd-kit's `PointerSensor` on real-browser mousedown (the browser fires `dragstart` before `pointermove`, so dnd-kit never crossed its 6px activation) — Playwright's `page.mouse.*` synthesises pointer/mouse events but not HTML5 `drag*`, so the e2e suite had a blind spot. Within-lane pointer reorder (HTML5 in S2) is an **S3A.2 carry-over** — keyboard `Alt+↑/↓` + menu cover within-lane this sprint. Added an e2e regression guard that fails if the card ever re-advertises `draggable="true"`. **Agents M (CPO) + Q (CTO)** added as plan-mode critique step via [plan-mode-prelude.md](./plan-mode-prelude.md) + new `.claude/skills/agent-m-cpo-custom/`, `agent-q-cto-custom/` skill files (correcting earlier confusion with MoneyPenny + QMD search). R16 same-PR co-change: [lifecycle-transitions.md](./lifecycle-transitions.md) Cross-lane DnD + change-log pass-2 correction; [tech-stack.md §3.5](./tech-stack.md) documents `@dnd-kit/core`-only; [schema-initiative-v0 §4.2](./schema-initiative-v0.md) and `.claude/skills/pdlc-brief-custom/SKILL.md` audited to match runtime. CI green; Vitest 71/71; Playwright 20/20 including the HTML5-draggable regression guard; MoneyPenny Mode B + post-pass-2 audit both clean. **Tech — next sprint (S3A.2) MUST preserve AND deliver:** preserve `briefSchema` + `REQUIRED_FOR_COMPLETE_BRIEF` + `missingForCompleteBrief`, `eventSchema` (incl. `skill_run` payload), atomic `POST /api/initiatives/:id/brief` route + `missing_required_fields` 422 contract, `canTransition` + `deriveHasBrief`, cross-lane DnD legality gate + `same_lifecycle` silent no-op, dual save-button surface, `Actions → Move to…` keyboard cross-lane fallback, the `<li>` must-never-advertise-`draggable="true"` regression guard. Deliver: within-lane pointer reorder via dnd-kit (`useDroppable`-per-slot + `neighboursForSwap` + `computeMidpointSortOrder` — no HTML5 `draggable`) + a CDP `Input.dispatchDragEvent` e2e so the pass-2 defect class cannot escape again. |
| 2026-04-21 | **Brief shrink (CPO pass) + S3B committed + ICP placeholder** | [.claude/skills/pdlc-brief-custom/SKILL.md](../../.claude/skills/pdlc-brief-custom/SKILL.md); [schema-initiative-v0 §4.2 + §4.3 + §6 + §8](./schema-initiative-v0.md); [seeds/s3a1-brief-wizard-interactions.md Deliverable 0](./seeds/s3a1-brief-wizard-interactions.md); [seeds/s3a2-discovery-automation.md Prefill + Provider swap](./seeds/s3a2-discovery-automation.md); [seeds/s3b-discovery-research.md](./seeds/s3b-discovery-research.md); [sprint-backlog — S3A.1 + S3A.2 + S3B blocks](./sprint-backlog.md); `System/icp.md` placeholder (Shaun authors 2026-04-22) | **CPO decision:** the brief is a **thesis gate**, not a PRD. Shrunk to **three questions** — *why* (`coreValue`), *who* (`targetUsers`), *what* (`problem`). Scope / assumptions / success metrics move to **discovery** (S3B) and **spec** (`/agent-prd`). `REQUIRED_BRIEF_FIELDS` narrows; legacy `scopeIn` / `scopeOut` / `assumptions` / `constraints` / `successDefinition` stay **optional** in `briefSchema` for backward compat (no data migration). Lands in **S3A.1 Deliverable 0** (reverses the earlier "defer question copy" call — it's a wizard-UX change). **S3A.2 prefill** expands scope from 2 → 3 fields to match. **S3B committed** as `/pdlc-discovery-research-custom`: replaces the S3A.2 kickoff stub behind the same `DiscoveryResearchProvider` interface (no route / job / UI change); runs on kickoff + manual re-run + **weekly sweep across all `discovery`-column cards** to accumulate customer context over time; composes existing Dex intel (`/customer-intel`, `/intelligence-scanning`, `/weekly-exec-intel`, `/meeting-prep`) — UI consumes what Dex already does. Seed reserves the slot with a locked interface but defers Q1–Q10 (research taxonomy, source storage, confidence scoring, ICP shape, LLM wiring, staleness diffing, observability, partial-failure, `/agent-prd` boundary, re-run-on-brief-edit UX) to a **2026-04-22+ deep-dive with Shaun + PO** before Build. **ICP placeholder:** `System/icp.md` — to be authored by Shaun 2026-04-22 — is a **blocker for the weekly sweep** (scores strategic fit; filters competitor analysis). Schema §4.2 / §4.3 / §6 / §8 updated same-sweep: brief required set narrowed + legacy-fields backward-compat note; `/pdlc-discovery-research-custom` added to §8 I/O table with its full reads / writes; `skill_run` known-ids list extended with the S3B id. Sprint-backlog Bar table gains an S3B row. No S3 / S3A contract widened. |
