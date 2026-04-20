# Dex Improvement: PDLC Orchestration UI (Steerco control plane)

**Created:** 2026-04-20  
**Status:** Planning → In Progress  
**Pillar:** AI adoption in processes · Streamlined product launch  
**Workshop:** `/dex-improve` Mode 1  
**Related:** [04-Projects/PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) (north star + slice log)

---

## Phase 1 — Understanding

**Idea (restated):** Build a **thin-sliced orchestration UI** so **PM** (with Steerco input and decisions) runs the **PDLC** as the **record of truth**: **`idea`** (capture) → **`discovery`** (on column entry: **`/product-brief`** stepwise popup, then research / problem / solutions / **open questions**; **re-run discovery** after answers) → **`design`** (export pack → **Claude Design**; attach outputs; **`/anthropic-frontend-design`**) → **`spec_ready`** (**`/agent-prd`** + structured clarifications) → **`develop`** (handoff: PRD `.md` + design for **Cursor Plan mode**) → **`uat`** → **`deployed`**, with **`parked`**, **backward moves** (not to `idea` without wipe), and **post-MVP** company-strategy conformance (distinct from Dex `pillars.yaml` semantics — see Phase 5). See [lifecycle-transitions.md](./lifecycle-transitions.md).

**Architecture (clarified 2026-04-21):** The **Wyzetalk UI is a separate product surface** (browser, internal host). **Dex** remains the **knowledge + process OS** — projects, areas, people, PRDs, learnings, and **skills** (`.claude/skills/`). Steerco **does not** use Cursor or Claude Code prompts for day-to-day PDLC moves; they use **`pdlc-ui/`**. Dex capabilities are **consumed** (read/write agreed artefacts, same skill semantics), not replaced by a second prompt wiki — see [skill-agent-map.md](./skill-agent-map.md).

**Dex / vault areas involved:**

| Area | How |
|------|-----|
| **Projects** | North star lives in `04-Projects/PDLC_Orchestration_UI.md`; this plan in `plans/PDLC_UI/` |
| **Information retrieval** | UI reads **flat PRDs** + `PRD_Product_Map`; optional `EV-*` / market tabs later |
| **Automation** | **Skills** (`/product-brief`, `/agent-prd`, future **design** pipeline) define behaviour; UI **renders stepwise flows** + optional **agent-config overrides** (`pdlc-ui/agent-config/` — later slice) |
| **Workflows** | Steerco uses **guided UI**; Cursor remains optional for power users |

**Open (remaining):** **Headless** agent execution — **R15** (phase 2 after adoption proof); **design** skill packaging.

### As-is vs to-be (Steerco context — 2026-04-20)

**As-is — org & information flow:** Reporting lines are **misaligned** (e.g. Designer → CEO/CPO; PO → COO with Implementation Manager + SDM; Sales/CS → CEO; **no CTO**). Steerco exists but **information is thin and fragmented**; **broken telephone** is common (e.g. COO + Implementation Manager decide → PO/SDM notified → PO escalates via Designer → CEO/CPO → COO), often **after** a Steerco. Delivery is **heavy timeline / feature-factory** driven: long research, design, and workshops, then **descope for delivery** or **rescope for client/market pressure**.

**As-is — product process failures (focus for this initiative):** **Missed gates**, **design without spec**, **duplicate briefs**.

**To-be — roles:** **PM moves the record of truth** on the board; **Steerco** (CEO/CPO, COO, Sales, CS, Product — and Design where relevant) **inputs and decides**. **PO** owns **product-brief / agent-prd question copy** alignment with skills (see sprint backlog). **Nudge, not enforce** (MVP): the UI surfaces gaps (e.g. handoff hints) without hard-blocking engineering artefact checks until usage proves the flow.

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

**Board `lifecycle` values (resolved):** `idea` → `discovery` → `design` → **`spec_ready`** → `develop` → `uat` → `deployed` (+ **`parked`**). **`/product-brief`** and **`/agent-prd`** are **subflows** tied to **column transitions** — see [lifecycle-transitions.md](./lifecycle-transitions.md) and `06-Resources/PRDs/README.md`.

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
| Repeatable PDLC questions in chat | Existing **`/product-brief`**, **`/agent-prd`** skills | **Skill** | Source of truth for copy + order; UI embeds or exports same steps |
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
- **Accessibility baseline:** **WCAG 2.1 AA + full keyboard navigation** targeted; manual checks per PR until automated tooling exists. Add to Implementation standard during S0.
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
- [ ] **R4:** On **`idea` → `discovery`**, open **`/product-brief`** stepwise popup (help text per question); minimum required fields documented; optional fields skippable; save persists before discovery work continues.  
- [ ] **R5:** **Discovery** supports open questions (open → answer → save), **workshop export**, **“Re-run discovery”** after answers change, and **export pack** (prompt + `.md`) for **Claude Design**.  
- [ ] **R6:** **Design (Claude Design — web)** after discovery: **Figma** remains DS source of truth; **maintenance Figma ↔ Claude Design is manual**. **Exported pack** (downloadable `.md`) must include an explicit **Design system instructions** block: tell the reader to use the **DS already set up in Claude Design** (themes, tokens, components) and not to invent a parallel palette. Card stores **Figma library URL** (reference) + **lo-fi artefact** link or embed (mandatory); **hi-fi** only when **`hiFiRequired`** gate is true.  
- [ ] **R6b — Post–Claude Design, in Cursor:** The same export pack ends with a **mandatory “Implementation polish”** subsection: paste **Claude Design outputs** (handoff bundle path, `PROMPT.md` excerpt, HTML export, or key screens) and run **`/anthropic-frontend-design`** so production-oriented UI code **inherits** the Design session — not a separate creative direction. **R6b copy lives in [export-pack-template.md](./export-pack-template.md) from Sprint 4 onward**; a UI CTA to copy that block is **polish only** (S10+ optional).  
- [ ] **R7:** **Design review** blocks **`design` → `spec_ready`** without pass or waiver (lighter path when no hi-fi).  
- [ ] **R8:** Column **`spec_ready`** follows **[`/agent-prd`](../../.claude/skills/agent-prd/SKILL.md)** semantics. **Structured clarifying questions in the spec wizard are required** so the PRD is not incomplete; **iterate** question sets as usage data arrives (PO owns alignment with the skill). **MVP:** export + pre-filled Cursor; questions **inside** the stepwise wizard (async card prompts = later). Ingest brief, discovery, design artefacts. Output: **reviewable** `06-Resources/PRDs/<Feature>.md` (or patch). **BDD** optional. **`spec_ready` → `develop`** after **`specComplete`** (nudge-based checklist — see sprint backlog **spec_complete** defaults). Handoff = **PRD MD + design** for **Plan mode**. **git PR** for markdown.  
- [ ] **R9:** **CRUD** for all board-owned entities (initiatives, questions, artefacts) with **delete** confirming destructive actions (soft-delete optional in v1).  
- [ ] **R10:** **Backups** — `pdlc-ui` data store (JSON/SQLite) is **business-critical**; define **owner, frequency, retention, and restore drill** (same bar as vault git remotes).  
- [ ] **R11:** **Backward moves** per [lifecycle-transitions](./lifecycle-transitions.md); **`→ idea`** = confirm + **wipe** to title + description only.  
- [ ] **R12 (post-MVP):** **Company strategy** conformance (distinct from Dex personal pillars) — e.g. WT “engagement platform for blue-collar workers” vs a **budgeting tool**; automatic signal needs a **company-strategy source file** + rules/ML. **Deferred** until after MVP; backlog **S9** repurposed when R12 is ready.  
- [ ] **R13 (vault continuity — phased):** Vault under **`06-Resources/PRDs/`** holds a **durable thread** per initiative: stub on idea; **update on save** through brief, discovery, spec; card **tabs** (Idea · Brief · Discovery · Spec/PRD · Design attachments); **history**; support **re-run discovery** after brief edits and **re-run spec** after discovery changes in **`spec_ready`**. No user-facing **“promote to vault”** — use **“Saved to product files”** (or equivalent). **Ship after** core board + export path, or as dedicated slices.  
- [ ] **R14 (release notes):** **User-facing, non-technical** release notes (what the **end user** gets) on the card — editable when the card enters **`develop`** and/or when **`develop`** is marked complete; readable from **card view**. Jira integration **out of scope** for MVP.  
- [ ] **R15 (agent execution phases):** **MVP** = human-in-loop export; **headless** agents / workers = **phase 2** after adoption proof (org carries cost).  
- [ ] **R16 (engineering governance — cross-sprint):** **Patterns, rules, and guardrails** so implementation does not drift between sprints — see **§ Engineering governance** below and [sprint-backlog.md](./sprint-backlog.md) **Engineering guardrails**. Includes: **branch per cycle (no feature dev on `main`)**, **green CI required to merge default**.  
- [ ] **R17 (operational baseline — data + DevOps):** **SQLite/JSON safety**, **health/version**, **secrets hygiene**, **CI audit hooks**, **deploy/rollback** one-pager, **optimistic `revision`**, **R13 git conflict** rules — see **§ Data, DevOps, and operability** below; **S0 seeds**, **S1 completes** minimum safe writes path.

### Engineering governance (CTO / tech lead — anti-drift)

**Why:** Solo or small team + **Plan mode** per sprint risks **inconsistent patterns**, **silent schema drift**, and **UI that ignores `design-system.md`** after S6 unless it is mandatory.

**Guardrails (minimum bar):**

1. **Contracts before features** — [schema-initiative-v0.md](./schema-initiative-v0.md) + `canTransition` rules stay aligned with [lifecycle-transitions.md](./lifecycle-transitions.md). **No new `lifecycle` string** or initiative field in code without updating those docs in the **same** PR (or a follow-up PR within 24h with a TODO in slice log — pick one rule and stick to it; default: **same PR**).
2. **ADRs for irreversible choices** — `pdlc-ui/docs/adr/` — one short file per decision (stack, persistence store, auth, deployment). **Sprint 0** seeds `README` + template; any decision that would **embarrass you to reverse** gets an ADR before merge.
3. **Automation** — Lint, format, typecheck on every PR; **validate** at least one **golden `initiative.json`** against schema (CI script from **S0** onward). Add tests for **`canTransition`** when S8 lands (required in S8 DoD already).
4. **UI consistency** — [Implementation standard](./sprint-backlog.md#implementation-standard--ui-for-pdlc-ui-all-sprints) + post-S6 **`design-system.md`**: **new** surfaces **reuse** tokens/primitives unless a **one-line ADR** documents an intentional exception.
5. **Sprint boundary discipline** — Each merge references the **Plan mode seed** sprint id in PR description; slice log gets a **tech handoff** line (what the next sprint must not break).
6. **Dependencies** — Lockfile committed; document **upgrade policy** in `pdlc-ui/README.md` (e.g. monthly patch, major needs ADR).
7. **Branch-per-cycle — never develop on `main`** — Each sprint or shippable increment is implemented on a **dedicated branch** (e.g. `feat/s2-swim-lanes`, `sprint/3-brief`); **`main` stays releasable** and only moves via **PR merge**. Solo is not an exception: **no long-lived direct commits to default** for feature work.
8. **Green CI before merge** — **No merge to the default branch** unless **CI is green** (lint, format, typecheck, schema validate; tests as they exist). Configure **branch protection** on the hosting git when ICT allows; until then, treat it as a **manual hard rule**.

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

**Orchestration app UI:** implement **`pdlc-ui`** screens with **`/anthropic-frontend-design`** ([skill](../../.claude/skills/anthropic-frontend-design/SKILL.md)); **BE + UI** in vertical slices. **S5 (R6)** and **S6 (R7)** dogfood the Steerco design process and produce **`pdlc-ui/docs/design-system.md` v0.1** from shipped UI for **S7+** (see sprint-backlog **Implementation standard**).

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
| 2026-04-23 | UI build standard | [sprint-backlog.md](./sprint-backlog.md) § Implementation standard | **`/anthropic-frontend-design`** for all `pdlc-ui` UI; **S5–S6** dogfood → **`design-system.md`** for **S7+** |
| 2026-04-20 | Governance + backlog | [plan.md](./plan.md); [sprint-backlog](./sprint-backlog.md); [lifecycle-transitions](./lifecycle-transitions.md) | **As-is/to-be** Steerco context; **PM** record of truth; **parked** intent+reason in **S2**; **`idea→discovery`** blocked until **S3**; **R6b** = template; **R12** post-MVP company strategy; **R13–R14** vault continuity + release notes; **solo 2-week** cadence; wipe mitigation; **develop** rewind MVP |
| 2026-04-20 | As-is validation | [plan.md](./plan.md) clarifying Q&A | Verbal/Steerco duplicate briefs; **retrofit design** pattern; **discovery skipped (time)**; post-Steerco drift + silos; **deadline+demo** pressure; success = **connected handoff to Plan mode**, less **30% miss** / hackery |
| 2026-04-20 | CTO / ops | [plan.md](./plan.md) **R17**; [sprint-backlog](./sprint-backlog.md) S0–S1 | **S0** = guardrail **machinery** (CI, ADR, health, OPERATIONS, .env.example); **S1** = **real** write-safety (WAL/migrations or JSON atomic, **revision**); deferred full Docker/staging unless ICT |
| 2026-04-20 | Sign-off pre-S0 | [plan.md](./plan.md) **Phase 5 #14**, **Kick-off decisions** block; [sprint-backlog](./sprint-backlog.md) cadence + a11y + canonical case | **Cadence normalised** (2-week default; S0 exception); **camelCase canonical**; schema adds **`handle`**, **`events[]`**; S0 kick-off decisions captured (handle/events/attachments links-only/backup daily+30d/UTC+SAST/git host+CI runner ADR/WCAG AA + keyboard/desktop-only/PII/JSON migration stub/no-undo/first real initiative TBC at S7); ready for Sprint 0 |
