# PDLC UI — sprint backlog (implementation)

**Purpose:** Turn [plan.md](./plan.md) and [PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md) into **small, shippable increments** suitable for **agile delivery** and **Cursor Plan mode** before coding.

**Cadence assumption:** **2-week sprints**, **solo** PM/builder default (one demonstrable outcome per sprint to Steerco / board owner). **Exception:** **S0 may be 1 week** if the spike + scaffolding are clean (purely foundation). All other sprints = 2 weeks unless explicitly re-timed during sprint planning.

**Canonical field case:** **camelCase** for all JSON / schema fields (`parkedIntent`, `parkedReason`, `specComplete`, `userReleaseNotes`, `claudeDesignHandoffPath`, `implementationPolishNote`). Snake_case references in older prose are legacy — update when touched ([plan R16](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).

**Governance (aligned with [plan.md](./plan.md)):** **PM** moves the **record of truth**; Steerco **decides**. **PO** owns **product-brief / spec question** copy vs skills. **Design review waive:** **PO or Designer** (policy). Audit **`by`** = **Shaun** placeholder until v2 auth. **Handoff to engineering:** **nudge** not hard-block in MVP. **R6b** satisfied by **export-pack-template** from **S4**; extra UI CTA = polish only.

**Rule:** After **sprint planning**, paste the sprint’s **Plan mode seed** (bottom of each sprint) into Cursor **Plan** so implementation tasks trace to **Definition of Done**.

**Ceremony:** At sprint end, append one line to **Slice log** in `04-Projects/PDLC_Orchestration_UI.md` and tick **Progress** in `plan.md`.

---

## Implementation standard — UI for `pdlc-ui` (all sprints)

**Rule:** Every **user-visible** surface of the orchestration app (layout, modals, lanes, forms, checklists, empty states) is built with **[`/anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md)** in Cursor: read the skill, then implement or refine components so the product is **cohesive, accessible, and non-generic** — not one-off inline styles per screen.

**Accessibility baseline:** target **WCAG 2.1 AA** + **full keyboard navigation** + visible focus states; manual a11y spot-check per PR (axe DevTools or equivalent) until automated checks exist. **Scope:** desktop browsers (Chrome/Edge/Safari current); mobile deferred.

**Backend + UI together:** In each sprint, **ship vertical slices** where sensible — e.g. persistence/API (or file-store writes) **and** the components that call them in the **same** PR or Plan batch, so behaviour and visuals stay aligned.

**S5 (R6) + S6 (R7) as design-process dogfood:** Those sprints are the **canonical test** of the same pipeline Steerco will use for **product** initiatives (design artefacts + review gate). After S5–S6 ship, **extract or document** a **`pdlc-ui` design system** from the implemented UI (tokens, spacing, form patterns, checklist row component) — e.g. `pdlc-ui/docs/design-system.md` + shared CSS variables or component primitives — and **refactor S7+** screens to consume it so R6 “feeds” the DS for the rest of the app.

---

## Engineering guardrails (cross-sprint — tech lead / CTO hat)

**Purpose:** Prevent **pattern drift**, **schema silos**, and **one-off** implementations between sprints. Complements Steerco **product** governance in [plan.md](./plan.md) **R16**.

| Guardrail | Rule |
|-----------|------|
| **Lifecycle & schema** | Code changes to **`lifecycle`** values, transition matrix, or initiative **shape** ship **with** updates to [schema-initiative-v0.md](./schema-initiative-v0.md) and [lifecycle-transitions.md](./lifecycle-transitions.md) in the **same PR** (default). |
| **ADRs** | **`pdlc-ui/docs/adr/`** — numbered markdown (`0001-store-sqlite.md`); **title + context + decision + consequences**. Required for: persistence choice, framework, auth, hosting, anything costly to reverse. |
| **CI** | From **S0**: lint + format + typecheck; **JSON schema validate** golden fixture. From **S8**: **`canTransition`** unit tests in CI (already DoD). |
| **Plan mode traceability** | PR description states **Sprint S#** and pastes or links the **Plan mode seed** used. |
| **Design system after S6** | New UI **consumes** `design-system.md` / shared primitives; exception = **ADR or PR note** with reason. |
| **Sprint handoff** | Slice log +1 line: **“Tech: next sprint must preserve X (API Y, component Z)”** — reduces context loss for solo you. |
| **R17 split (S0 vs S1)** | **S0:** `.env.example`, **`/health`** (+ **`/ready`** stub), **version/build id** wired or documented, **OPERATIONS.md** (deploy/rollback outline), CI **required** (not optional) for lint + schema validate, **audit policy** documented. **S1:** persistence **write path** meets SQLite **WAL/busy_timeout/migrations** or JSON **atomic + schemaVersion**; **`revision`** on initiative; extend runbook for **live** data. |
| **Branch per cycle** | **No feature work committed directly on `main`** (repo default). Each sprint/shippable increment uses a **named branch**; integrate via **PR** only. Solo developer: same rule — protects **`main`** as always integratable. |
| **Merge gate** | **No merge to default** until **CI is green**. Enable **branch protection** (require status checks before merge) on the host when ICT/repo policy allows; document in **OPERATIONS.md** (S0). |

**Ceremony (5 min, end of sprint):** Schema still matches app? Any new magic string? ADR for big choices? **`main`** only advanced by **merged PR** with **green CI** (not direct sprint pushes).

---

## Structure (every sprint)

| Block | Contents |
|-------|----------|
| **Goal** | Outcome + why it matters now |
| **Maps to** | Plan **R#** / north-star **Stage** |
| **Deliverables** | Product-facing “what” |
| **Technical — how** | Stack-agnostic steps (adjust after **Sprint 0 spike**) |
| **Definition of Done (DoD)** | Observable proof |
| **Explicitly out** | Prevents scope creep |
| **Dependencies / risks** | |
| **Plan mode seed** | Copy into Cursor Plan to generate tasks |

---

## Sprint 0 — Spike + shell + contracts *(~1–2 weeks; 1 week OK per cadence exception)*

**Goal:** De-risk **hosting + stack + persistence shape** so later sprints do not thrash; ship an empty **orchestration shell**, **written contracts**, and the **guardrail machinery** (R16 + **R17 seed**) — **not** full production DevOps (see **Out**).

**Maps to:** **R1** (Stage 0), **R10** (runbook doc), **R16**, **R17** (seed), Phase A **schema**; [export-pack-template](./export-pack-template.md) unchanged but referenced.

**Deliverables**

- Runnable **`pdlc-ui/`** app (local `npm`/`pnpm` dev) with **one route**, app title, empty layout.
- **`plans/PDLC_UI/schema-initiative-v0.md`** — JSON schema (or TypeScript types + JSON example) matching fields in [plan.md § Phase A](./plan.md#phase-a--foundation-vault--planning-only), including **`schemaVersion`** and **`revision`** fields (even if unused until S1).
- **`pdlc-ui/README.md`** — how to run, where data lives, **env vars**, **dependency upgrade policy** (R16).
- **`.env.example`** — dummy keys only; **no secrets** in repo (**R17**).
- **`pdlc-ui/docs/BACKUP_RUNBOOK.md`** — owner (Shaun), frequency, retention, **restore drill** steps for `pdlc-ui/data/*` (R10); **SQLite** path must mention **WAL + quiesce / VACUUM INTO** or equivalent; **JSON** path must mention **atomic writes + restore from backup**.
- **`pdlc-ui/docs/OPERATIONS.md`** — **deploy** + **rollback** outline (even “copy `dist/` + restart service” for v1), where logs go, **health** URL (**R17**); **git:** branch-per-cycle, **no merge to default without green CI**, link or checklist for **branch protection** on host (**R16** §7–8).
- **`pdlc-ui/docs/adr/README.md`** — what an ADR is, numbering, when to write one ([plan R16](./plan.md#engineering-governance-cto--tech-lead--anti-drift)); optional **`0000-template.md`**. **First ADR(s) (S0):** stack + persistence; **git host + CI runner**; **UTC stored / SAST displayed**.
- **CI (required):** lint + format + typecheck on **every PR** to default branch; **validate** golden `initiative.json` (or fixture) **against** `schema-initiative-v0.md` — **failing CI = no merge** (R16). Document **`npm audit` / `pnpm audit`** policy (warn vs block) in README or OPERATIONS.
- **Kick-off decisions block in README:** capture all [plan § Sprint 0 kick-off decisions](./plan.md#sprint-0-kick-off-decisions-park-until-s0-planning--do-before-coding) (canonical case, `handle` ID, `events[]`, attachments = links-only, backup cadence, timezone, a11y WCAG AA, desktop-only, PII, JSON schema-evolution stub, undo out of scope, first real initiative TBC at S7).

**Technical — how**

- **Spike (≤1 day):** choose **static+API** vs **full-stack** one framework; **JSON file** vs **SQLite** for v1 persistence (document decision in **first ADR**).
- Scaffold repo: lint, format, **`/health`** (and **`/ready`** stub if applicable); **build-time version** (`GIT_SHA` or `package.json` version) exposed via small **API or static JSON** for “what am I running?”
- **Shell UI:** apply **`/anthropic-frontend-design`** for app chrome (nav, layout shell, typography baseline) per **Implementation standard** above.
- No initiative CRUD yet beyond optional **mock** fixture for layout.

**DoD**

- [ ] Fresh clone: `README` steps → app loads in browser, no console errors.
- [ ] Shell reflects **anthropic-frontend-design** direction (documented in PR or `pdlc-ui/docs/ui-notes.md` one-liner).
- [ ] Schema file committed; at least **one** example `initiative.json` validates; **CI enforces** validation (not optional).
- [ ] Backup runbook exists and names **restore** test date (even “TBD schedule” is OK if owner named).
- [ ] **`pdlc-ui/docs/adr/README.md`** exists; **first ADR** filed for persistence + stack choice (**R16**).
- [ ] **`.env.example`** + **`OPERATIONS.md`** + **health** route live (**R17** seed).

**Out:** Product-brief wizard, swim lanes, PRD generation, **full SQLite migration chain**, **production Docker**, **staging environment**, **gitleaks** in CI — unless ICT mandates, **defer to S1+** and track in slice log.

**Risks:** ICT blocks local SQLite → fall back to JSON early (**ADR**).

**Plan mode seed**

```
Read plans/PDLC_UI/plan.md Phase A, R16–R17, and plans/PDLC_UI/lifecycle-transitions.md.
Implement Sprint 0: scaffold pdlc-ui/ with chosen stack from spike, empty shell page, schema-initiative-v0.md (include schemaVersion + revision per plan Phase A), README + .env.example, pdlc-ui/docs/BACKUP_RUNBOOK.md (R10), pdlc-ui/docs/OPERATIONS.md (deploy/rollback/health), pdlc-ui/docs/adr/README.md + first ADR for stack+persistence (R16). CI: lint, format, typecheck, validate golden initiative JSON against schema — required on PR. /health + build version. Do not implement brief wizard or board moves. anthropic-frontend-design for shell. plans/PDLC_UI/sprint-backlog.md Sprint 0; defer full migrations/Docker/staging unless ICT requires.
```

---

## Sprint 1 — Idea capture + persistence *(~2 weeks)*

**Goal:** Steerco can **create, edit, delete** initiatives with **title + description** and see them stored durably — **R17 persistence path** is real (not only docs).

**Maps to:** **R2**, **R9** (initiative CRUD subset), **R17** (complete write-safety baseline).

**Deliverables**

- **Create idea** modal (validation: title required, body optional/min length if you set one).
- **List** or single-column view of cards in **`idea`** (even if full board not built yet).
- **Persist** to store chosen in Sprint 0; **delete** with confirm.
- **SQLite:** enable **WAL**, set **busy_timeout**, ship **initial migration** + runner; document **single-writer** assumption in OPERATIONS. **JSON:** **atomic rename** write pattern + **`schemaVersion`** on file; **`revision`** on each initiative (increment on successful save).
- **`events[]`** seeded on initiative: record `{ at, by, from, to, note? }` for **stage transitions** and **create/delete**; extensible for field edits later.
- **`handle`** (human ID, e.g. `INIT-0042`) generated on create (monotonic or slug); **unique**; used in URLs / Steerco references.

**Technical — how**

- CRUD API or direct file write with **atomic** writes (avoid corrupt JSON).
- IDs: `uuid` or `nanoid`; `createdAt`, `updatedAt`, `lifecycle: 'idea'`; **`revision`** starts at `1`.
- **UI:** modal + list via **`/anthropic-frontend-design`**; pair **write path** with UI in same slice.

**DoD**

- [ ] Create → appears after refresh; edit → persists; delete → gone.
- [ ] **R17:** Write path meets **SQLite WAL + migrations** or **JSON atomic + schemaVersion**; **`revision`** present and bumped on update (optimistic lock ready for S2+).
- [ ] **`events[]`** recorded for create / delete (stage transitions added in S2).
- [ ] **`handle`** shown on card and in list; unique across initiatives.
- [ ] No other columns required yet (can show stage badge `idea` only).
- [ ] Modal and list meet **anthropic-frontend-design** bar (focus states, spacing, not default “AI slop”).

**Out:** Column moves, product-brief.

**Dependencies:** Sprint 0 complete.

**Plan mode seed**

```
Sprint 1 per plans/PDLC_UI/sprint-backlog.md: Create Idea modal (title + body), persistence with plan R17 — SQLite: WAL, busy_timeout, initial migration; JSON: atomic rename + schemaVersion on file; initiative includes revision (optimistic lock, bump on save). List view idea-stage; update/delete with confirm. schema-initiative-v0.md. No swim lanes unless trivial. anthropic-frontend-design; pair BE and UI. Implementation standard.
```

---

## Sprint 2 — Swim lanes + forward moves *(~2 weeks)*

**Goal:** **Board is visible** — all lifecycle columns + **parked**; user can **move cards forward** with **guardrails**: no **`idea` → `discovery`** until **S3** (product brief is **required**); **parked** always captures **intent + reason**.

**Maps to:** **R3** (Stage 2 scaffold), partial **R11** (forward only; backward in Sprint 8); plan Phase 5 **`parked`**.

**Deliverables**

- Horizontal **swim lanes**: `idea` | `discovery` | `design` | `spec_ready` | `develop` | `uat` | `deployed` + **parked** (lane or toggle).
- **Move** control: drag-drop **or** “Move to…” menu (pick one in sprint planning).
- Cards render **title + snippet** in correct column from `lifecycle`.
- **`idea` → `discovery`:** transition **disabled** or shows **“Complete product brief (Sprint 3)”** — card **cannot** land in `discovery` without brief (see **S3 dependency**).
- **→ `parked`:** modal requires **`parked_intent`** (`revisit` \| `wont_consider`) **and** **`parked_reason`** (non-empty free text).

**Technical — how**

- Single source of truth: `lifecycle` on initiative record.
- Optimistic UI optional; **server/store** is authority.
- **`canTransition`:** enforce blocked `idea→discovery`; enforce parked intent+reason.
- **UI:** lanes + cards + move affordances via **`/anthropic-frontend-design`** (density, column headers, drag/drop or menu styling).

**DoD**

- [ ] Moving card updates column and survives refresh (except blocked transitions).
- [ ] **`idea` → `discovery`** impossible until S3 ships (feature flag or hard block).
- [ ] **Parked** requires intent + reason; card leaves main flow visually (lane or filter).
- [ ] Board UI passes **anthropic-frontend-design** cohesion check (document in PR).

**Out:** Product-brief wizard (S3), gates (design review, spec), backward moves.

**Dependencies:** Sprint 1; **S3** must ship before enabling `idea→discovery` (or ship **S2+S3** in sequence without releasing board-only between them).

**Plan mode seed**

```
Sprint 2: full swim lane UI per plans/PDLC_UI/sprint-backlog.md and PRDs/README lifecycle order. Column layout, card placement by lifecycle, forward-only moves except DISABLE idea→discovery until product-brief exists (block in canTransition; UX message pointing to Sprint 3). Moving to parked REQUIRES parkedIntent plus non-empty parkedReason modal (camelCase per sprint-backlog canonical case). Every move appends to events[]. develop/uat/deployed columns are status-only forward moves (no Jira). Match schema-initiative-v0.md. anthropic-frontend-design for board UI; Implementation standard.
```

---

## Sprint 3 — Product-brief on `idea` → `discovery` *(~2 weeks)*

**Goal:** First **skill-shaped** behaviour: moving **`idea` → `discovery`** opens **stepwise** questions aligned to **`/product-brief`**, with **help text**, persist answers — **unlocks** the transition blocked in **S2**.

**Maps to:** **R4**, Stage 3 north star. **PO** owns question copy alignment with [product-brief skill](../../.claude/skills/product-brief/SKILL.md); **iterate** questions as usage data arrives.

**Deliverables**

- On transition **`idea` → `discovery`**: **modal/stepper** (externalise question copy from `.claude/skills/product-brief/SKILL.md` into `pdlc-ui/content/product-brief-steps.json` or similar — **do not fork** skill logic in duplicate prose long-term).
- **Save** writes `brief` payload on initiative; **minimum required** fields enforced.
- **Cancel** behaviour defined (stay in `idea` — document in UI).
- **Enable** `idea→discovery` in `canTransition` only when brief meets minimum (on wizard **complete**).

**Technical — how**

- Step state machine; partial save if required.
- Optional: “Export prompt for Cursor” button (plain text).
- **UI:** stepper + help text layout via **`/anthropic-frontend-design`** (Steerco-readable, calm density).

**DoD**

- [ ] Incomplete required fields block **finish** and keep card in `idea` (document cancel UX).
- [ ] **Only after** wizard complete may card move to **`discovery`**.
- [ ] Completed brief visible on card detail / discovery column.
- [ ] Wizard screens match **anthropic-frontend-design** quality bar.

**Out:** Discovery open questions, export pack, design review.

**Dependencies:** Sprint 2 (lanes must exist; `idea→discovery` remains blocked until this DoD is met).

**Risks:** Question count too large for one sprint → ship **first N steps + “continue next sprint”** only if unavoidable (prefer thin vertical slice: **all** steps read-only except 2–3 editable first).

**Plan mode seed**

```
Sprint 3: enable idea→discovery only via product-brief wizard completion. Multi-step wizard on transition; source questions from product-brief skill into pdlc-ui/content JSON; PO owns copy drift vs skill. Persist brief on initiative per schema-initiative-v0.md. Remove or gate the S2 hard-block once brief complete path exists. Document cancel UX. anthropic-frontend-design for wizard UI; Implementation standard. plans/PDLC_UI/sprint-backlog.md Sprint 3.
```

---

## Sprint 4 — Discovery: questions, export, re-run, design pack *(~2 weeks)*

**Goal:** **Discovery** is usable in workshops and feeds **Claude Design** via **export pack**.

**Maps to:** **R5**, Stage 4; [export-pack-template](./export-pack-template.md).

**Deliverables**

- **Open questions** CRUD on card (`text`, `owner`, `status`).
- **Export** open questions → Markdown / CSV.
- **“Re-run discovery”** — bumps `discoveryIteration` (or audit log), optional placeholder for future AI regen.
- **“Download export pack”** — fills [export-pack-template.md](./export-pack-template.md) from initiative fields + brief + questions (**includes mandatory R6b “Implementation polish” block** — satisfies plan **R6b**; UI one-click copy = later polish).

**Technical — how**

- Template merge (mustache/handlebars/simple replace `{{}}`).
- File download in browser.
- **UI:** question list, editors, export actions via **`/anthropic-frontend-design`**.

**DoD**

- [ ] User can answer a question, save, export, download pack without Dex.
- [ ] Re-run increments version / timestamp visible on card.
- [ ] Discovery surfaces match design standard.

**Out:** Design artefact fields, design review checklist.

**Dependencies:** Sprint 3.

**Plan mode seed**

```
Sprint 4: discovery open questions list on initiative, workshop export MD/CSV, re-run discovery action with iteration audit, and export pack download using plans/PDLC_UI/export-pack-template.md placeholders. See sprint-backlog Sprint 4 and schema-initiative-v0.md. anthropic-frontend-design for UI; Implementation standard.
```

---

## Sprint 5 — Design column: artefacts + hi-fi gate *(~2 weeks)*

**Goal:** Card in **design** holds **Figma** + **Claude Design** links and **lo-fi / optional hi-fi** metadata; aligns with **R6** (manual DS).

**Maps to:** **R6**, Stage 5 (artefacts); **not** R7 yet if team is tight — can merge Sprint 5+6 with care (**AC2**: avoid same PR as full spec wizard).

**Dogfood / test case (process):** Building this screen **is** the first end-to-end rehearsal of **“design column + artefact fields”** that product teams will use. Capture **screenshots or notes** in the Slice log: what Steerco would upload to Claude Design vs what the **orchestration UI** itself required — close the loop for future copy in export packs.

**Deliverables**

- Form fields (canonical schema names): `figmaLibraryUrl`, `claudeDesignSessionUrl`, `loFiArtifactUrl`, `hiFiRequired`, `hiFiArtifactUrl`, **`claudeDesignHandoffPath`**, **`implementationPolishNote`**.
- Optional: **embed** or link-open in new tab.
- **Hi-fi gate** boolean + rationale text.
- **UI:** entire **design-lane card detail / form** built with **`/anthropic-frontend-design`** (this sprint sets the **visual baseline** for Steerco-heavy forms).

**Technical — how**

- URL validation; optional file upload later (links only in MVP is OK).
- Pair **persisted fields** with form submit paths in the same PR.

**DoD**

- [ ] Design column cards show artefact links; edits persist.
- [ ] Export pack from Sprint 4 still merges design section if populated.
- [ ] **R6 UI** reviewed as **dogfood** entry in Slice log (what worked / what to change in export template).

**Out:** Design review checklist blocking `spec_ready`.

**Dependencies:** Sprint 4.

**Plan mode seed**

```
Sprint 5: design column artefact fields per plan R6 and schema-initiative-v0.md — figmaLibraryUrl, claudeDesignSessionUrl, loFiArtifactUrl, hiFiArtifactUrl, hiFiRequired+rationale, claudeDesignHandoffPath, implementationPolishNote (canonical names). Persist and show on card detail. No design-review gate yet unless already trivial to add. anthropic-frontend-design. Dogfood Steerco design-column process; slice log learnings. Implementation standard + Sprint 5 dogfood.
```

---

## Sprint 6 — Design review gate *(~2 weeks)*

**Goal:** **Cannot** enter **`spec_ready`** from **`design`** without **pass or waiver** on checklist.

**Maps to:** **R7**, Stage 6.

**Dogfood / test case (process):** This is the **second** rehearsal of the Steerco **design review gate** — same checklist patterns you will enforce for product cards. Use it to validate **wording**, **order**, and **waive** flow before Steerco sees it.

**Design system seed (out of R6):** After S5–S6 land, add **`pdlc-ui/docs/design-system.md`** (and optionally **`pdlc-ui/src/styles/tokens.css`** or shared primitives) capturing **colours, type scale, form field pattern, checklist row** extracted from the shipped R6/R7 UI. **Sprint 7+** should **consume** these tokens/components so the DS grows from **R6 implementation**, not a blank Figma file.

**Deliverables**

- Checklist UI (items from north star: contrast, tap targets, DS skim, hi-fi extras when present).
- **Pass / Waive** with **reason** + **timestamp** + **`by`** — MVP uses fixed placeholder **Shaun** (single operator); free-text override optional if product wants.
- **UI:** checklist + audit panel via **`/anthropic-frontend-design`** (consistent with S5 forms).

**Technical — how**

- Persist `designReview` object on initiative: `{ status, waived, reason, at, by }`.
- Implement **design→spec_ready** gate in code; **Sprint 8** generalises into full **`canTransition`** matrix (merge without conflict).

**DoD**

- [ ] UI blocks `design` → `spec_ready` until pass or waiver saved.
- [ ] Audit visible on card detail.
- [ ] **`design-system.md`** (or equivalent) drafted from **actual** S5–S6 components — even a **v0.1** bullet list of tokens is enough to unlock S7 polish.

**Out:** `agent-prd` flow.

**Dependencies:** Sprint 5.

**Plan mode seed**

```
Sprint 6: design review gate blocking transition design→spec_ready. Checklist UI, pass or waive with reason, persisted audit on initiative. See plans/PDLC_UI/sprint-backlog.md Sprint 6 and north star Stage 6. Use anthropic-frontend-design for all checklist UI. After implementation, add pdlc-ui/docs/design-system.md v0.1 extracting tokens/patterns from S5–S6 UI for reuse (R6 → DS). Dogfood: log checklist UX learnings in slice log.
```

---

## Sprint 7 — `spec_ready`: handoff + `/agent-prd` MVP *(~2 weeks)*

**Goal:** **`spec_ready`** produces a **reviewable spec handoff** for engineering (**MD + design pointers**) via **export + Cursor**, and unlocks **`develop`**. **Structured spec-wizard questions are required** (not optional placeholders) so PRDs are complete; **iterate** questions with PO as usage proves gaps.

**Maps to:** **R8**, **R14** (release notes seed), Stage 7; **BDD** remains optional in generated content (skill behaviour, not UI block).

**Default `spec_complete` checklist (MVP — nudge, PO-adjustable):**

- Brief + discovery + design references present on card **or** explicit “N/A + reason”.
- **All required** spec-wizard / clarifying questions answered (mirrors **`/agent-prd`** intent).
- Risks / out-of-scope captured (short fields OK).
- **“Ready for engineering handoff”** acknowledgement checkbox (honour system).

**Deliverables**

- **`spec_ready` experience:** **spec wizard** with **required** structured steps (not shell-only MVP).
- **“Generate handoff bundle”** — concatenated markdown from brief + discovery + design + agent-prd-oriented template; **R6b “Implementation polish”** text comes from **export-pack-template** (S4), not duplicated ad hoc.
- **“Copy for Cursor”** / **deep link** instructions (open repo, paste, run `/agent-prd`).
- **`spec_ready` → `develop`** only when **`specComplete`** satisfied per checklist above (nudge — not hard enforcement of external tools).
- **`userReleaseNotes`** field: **plain language**, **end-user-focused** draft (what customers get); editable from card when entering **`develop`** or when marking develop done — **R14**.

**Technical — how**

- Large string builder from initiative JSON → downloadable `.md`.
- **Vault:** continuous **`06-Resources/PRDs/`** sync + card **tabs** + **history** = **plan R13** — **do not collapse into S7** unless timeboxed; if not in S7, document **“R13 phase 2”** in README and ship download-only MVP.
- **UI:** spec-ready column + wizard via **`/anthropic-frontend-design`**; **reuse** **`pdlc-ui/docs/design-system.md`**.

**DoD**

- [ ] User completes: idea → … → spec_ready → **answer required wizard** → export → **specComplete** → **develop**.
- [ ] README: PRD markdown still goes through **git PR** by human; user-facing language avoids **“promote to vault”** (use **“Saved to product files”** when R13 exists).
- [ ] **Release notes** field visible and saved on card for **develop** path.
- [ ] Spec-ready UI **imports or mirrors** v0.1 DS doc (no visual regression vs S5–S6 unless intentional).

**Out:** Auto PR merge, in-browser agent execution, **R13** full vault threading (unless deferred).

**Dependencies:** Sprint 6.

**Risks:** Scope creep into full agent-prd parity or R13 → **timebox**; ship **export + required wizard + release notes** first; R13 tabs/history as next epic.

**Plan mode seed**

```
Sprint 7: spec_ready per R8+R14 — required structured spec wizard (clarifying questions), handoff MD bundle including R6b block from export-pack-template, specComplete nudge checklist, userReleaseNotes for develop. spec_ready→develop gated. Copy-for-Cursor. R13 vault continuous save is OPTIONAL in this sprint if timeboxed; else document follow-up. anthropic-frontend-design + design-system.md. sprint-backlog Sprint 7.
```

---

## Sprint 8 — Backward moves, wipe-to-idea, develop rewind *(~2 weeks)*

**Goal:** **Rework** without losing history; **`develop` / `uat` → earlier columns** (MVP: **PM approves**); **hard reset** to `idea` per governance with **accident mitigation**.

**Maps to:** **R11**, [lifecycle-transitions](./lifecycle-transitions.md). **Parked** intent+reason already in **S2** — this sprint only adjusts if **edit parked reason** is needed.

**Deliverables**

- Allowed **backward** transitions: `spec_ready`→`design`/`discovery`, `design`→`discovery`, **`develop`/`uat` → earlier columns** (same data-retention defaults as `spec_ready` row — confirm in UI).
- **`→ idea`**: modal **“This wipes all except title and description”** + **high-friction confirm** (e.g. type **title** to confirm) and/or **JSON snapshot** to `pdlc-ui/data/snapshots/` before wipe (per lifecycle-transitions).
- Central **`canTransition(from,to,initiative)`**; tests for matrix; **merge** S6 design→spec_ready gate.

**Technical — how**

- Unit tests for full matrix.
- **UI:** confirm modals via **`/anthropic-frontend-design`** + DS doc.

**DoD**

- [ ] Backward move retains data; wipe leaves only title+body; **wipe confirm** is high-friction.
- [ ] Illegal transitions rejected with clear message.
- [ ] **`develop`/`uat` rewind** works with PM confirmation flow.

**Out:** **R12** company-strategy module (deferred — was old “S9”).

**Dependencies:** Sprint **6**+ (needs design gate in matrix); **after Sprint 7** preferred so rewind is tested on full flow.

**Plan mode seed**

```
Sprint 8: canTransition matrix per lifecycle-transitions.md — backward from spec_ready and design; develop/uat backward with PM confirm; wipe-to-idea for ALL transitions into idea with title-confirm and optional JSON snapshot; integrate S6 design→spec_ready rule. Parked intent+reason already from Sprint 2. Unit tests. anthropic-frontend-design + design-system.md.
```

---

## Sprint 9 — **DEFERRED** — Company strategy “golden thread” *(TBD)*

**Status:** **Not MVP.** [plan.md](./plan.md) **R12** requires a **Wyzetalk company strategy** source (e.g. `company_strategy.md`) and rules / optional ML — **not** Dex `System/pillars.yaml`.

**When un-deferred:** Multi-select strategy tracks, non-conformance warnings (e.g. engagement platform vs budgeting tool), documented heuristics.

**Placeholder Plan mode seed** *(do not run until R12 scoped)*

```
Deferred: company strategy conformance per plan R12 — NOT Dex pillars.yaml; needs company_strategy artefact and PO-approved rules. Revisit after MVP adoption.
```

---

## Optional Sprint 10+ — Hardening & catalogue

- **R13 — Vault continuity:** tabs (Idea · Brief · Discovery · Spec/PRD · Design), **history**, **save-on-sync** to `06-Resources/PRDs/` (no “promote to vault” copy), **re-run discovery** / **re-run spec** flows wired to files.
- **R6b** UI polish: one-click **copy “Implementation polish”** block from pack (template already satisfies R6b from **S4**).
- **Essential PRD read-only catalogue** (Stage 8+ north star).
- **Duplicate detection** ([plan compound](./plan.md#compound-opportunities)).
- **CI:** validate initiative JSON + optional PRD frontmatter grep.
- **Headless agents** — phase 2 after adoption proof ([plan](./plan.md) **R15**).

---

## Velocity & dependency graph (summary)

**Solo default:** linear **S0 → S7**, then **S8** (rewind + wipe). **S9 / R12** deferred.

```text
S0 ──► S1 ──► S2 ──► S3 ──► S4 ──► S5 ──► S6 ──► S7 ──► S8
              │                              ▲
              └── parked intent+reason ─────┘ (in S2)
```

**S9 (R12 company strategy):** unscheduled — revisit after MVP.

---

## Definition of Ready (per sprint, before Plan mode)

- [ ] Previous sprint **DoD** met and merged.
- [ ] **No open** ICT/security blockers for this layer.
- [ ] **Owner** named for sprint (default: Shaun).
- [ ] **Branch created** for this cycle (`feat/…` or `sprint/N-short-name`) — **not** developing on **`main`** ([plan R16 §7](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).
- [ ] Host git: **branch protection** + **required checks** planned or enabled for default branch ([plan R16 §8](./plan.md#engineering-governance-cto--tech-lead--anti-drift)).

---

## After each sprint (retro, 15 min)

1. What shipped vs plan?  
2. Update **Slice log** in `04-Projects/PDLC_Orchestration_UI.md`.  
3. One **learning** line in `System/Session_Learnings/` if something blocked velocity.

---

*Created 2026-04-23 — agile decomposition for `pdlc-ui`; adjust sprint length to team capacity.*
