# Claude Design — wireframe brief (Internal Kanban Orchestration Board)

> **Status:** Paste-ready prompt for a Claude Design **wireframe-mode** session.
> **Created:** 2026-04-24.
> **Context:** `pdlc-ui` implementation is **parked** (per [plans/skill-pipeline/README.md](../skill-pipeline/README.md) and the FROZEN banner on [plan.md](./plan.md)). This brief treats the accumulated planning corpus as a **design thought-experiment** — commission a clean wireframe pass and compare against the code-first direction we shipped through S3A.1.
> **Companion prompt:** [claude-design-orchestration-doc-prompt.md](./claude-design-orchestration-doc-prompt.md) — that one produces a **chat-orchestration one-pager**; this one produces **screen wireframes**. They are not substitutes.

---

## Why this file exists

Shaun asked for a designer-grade wireframe brief for the parked `pdlc-ui` surface so we can (a) test what Claude Design produces on the wireframe setting against what we built and (b) have a permanent, Dex-native reference instead of losing the prompt to chat history after credits ran out. Re-invocation cost = copy-paste, not re-derivation.

---

## How to use

1. Open Claude Design in **wireframe** mode with your design system attached.
2. Paste **everything between the BEGIN / END markers** below as the first message.
3. Optional attachments if Design supports them: [`schema-initiative-v0.md`](./schema-initiative-v0.md), [`plan.md`](./plan.md). The brief is otherwise self-contained.
4. If you want to compare against the chat-orchestration doc instead, use [`claude-design-orchestration-doc-prompt.md`](./claude-design-orchestration-doc-prompt.md).

**Intentionally out of this brief** (so you are not surprised):

- No engineering governance / R16 / branch-per-cycle (irrelevant to wireframes).
- No Phase 2 "Agent Flywheel" or Phase 3+ intelligence surfaces.
- No skill chat transcripts — the wireframe shows the **result** of a skill on the card, not the agent UI.
- No persona names (Felix / Moneypenny / Bond / M / Q) in the visible wireframe — those are orchestration concerns, not design ones.

---

## What is built out here vs the first-pass brief

- **Brand / tone** section so Design does not drift to marketing voice.
- **Information architecture** (top bar · modal nav · no sidebar / no breadcrumbs / no dashboard — stated explicitly).
- **Forward-gate / backward-rule** matrix (what each move requires and what wipes).
- **Field envelope** as a first-class concept with explicit chip rules — every panel inherits the same provenance treatment.
- **Card popup fully specced** — seven tabs (Idea · Brief · Discovery · Design · Spec · Release · Activity), each with sections, empty states, actions, field map.
- **Skill-running indicator** — three places it surfaces.
- **Backward-move + wipe** confirm (the most-fragile path).
- **Move-to dialog** (keyboard cross-lane path).
- **Settings / preferences** minimal panel.
- **Command bar (`Cmd+K`)** as MVP-light.
- **Keyboard map** as explicit help overlay.
- **Microcopy bank** so Design does not invent button labels / placeholders / errors / toasts.
- **Confidence chips called out as the only colour-as-signal** — protects the DS from rainbow-tag drift.

---

## The prompt

```
---BEGIN CLAUDE DESIGN PROMPT (WIREFRAME MODE) — Internal Kanban Orchestration Board---

You are designing **wireframes** for an internal-only product called the **Internal Kanban Orchestration Board** (working name; we will not invent a marketing brand). It is a single-tenant, single-operator desktop tool that lets a Product Manager move an "initiative" through eight lifecycle columns. Every column move triggers a structured chat agent (a "skill") that writes typed answers back onto the card. The board is the **record of truth**. Markdown PRDs are exported at lifecycle milestones; the board itself is the live canvas.

Render screens using the design system already loaded in this Design session. Do not invent tokens, colours, fonts, or icons. Do not invent product copy beyond the microcopy in section 13.

Output expected: a wireframe set covering the screen inventory in section 9, the per-tab card popup spec in section 9.2, the state matrix in section 10, the keyboard map in section 12, and a single end-to-end flow diagram with mermaid appendix (section 15).

---

## 1. One-line thesis

A **kanban-style internal tool** where a PM moves an idea through eight ordered lifecycle columns. Each transition triggers a structured skill (chat agent) that writes typed answers back onto the card. The board is the live record; PRDs and design briefs are exported at milestones.

## 2. Audience and success

**Primary user:** one Product Manager, on a desktop browser, on the company's internal host. Single operator. No multi-user editing in MVP.

**Secondary readers (later):** Steering committee — CEO/CPO, COO, Sales/CS, Product, Design. Read-mostly. The PM still moves cards.

**Success in the wireframe:**
- A PM can take an idea from `idea` → `spec_ready` in **fewer steps and with less context-switching** than today's pattern (Slack 1:1 + verbal Steerco + retrofitted spec doc).
- A Steerco reader can open any card and understand **why we are doing this, who it is for, what we found, and where it stands**, in under 30 seconds.
- An agent's output (e.g. discovery research) is visibly **provenance-marked** so the PM trusts it and reviewers know what is human-authored vs draft.

## 3. Brand voice and tone

**Internal-tool neutral.** No marketing copy. No motivational empty states. No emoji in product chrome. Microcopy is direct, second-person ("Save brief"), and verb-led. Error copy names the thing that's wrong and what to do next, in one sentence.

## 4. Information architecture

**Top-level navigation (left to right in the top bar):**
- **App title** ("Orchestration Board" — text only, no logo).
- **Board view** (default; the only top-level view in MVP).
- **Search** (single text input; full-text across `title`, `body`, `handle`).
- **Filters** menu (chip-style: lifecycle, has open questions, confidence-low fields, parked intent).
- **+ New idea** (primary CTA, right-aligned).
- **Density toggle** (compact / comfortable / detailed — segmented control).
- **User badge** ("Shaun" with quiet user icon — no menu in MVP beyond signout placeholder).

**Secondary navigation:** none. There is one screen (the Board) and one detail surface (the Initiative Modal).

**Modal navigation (inside the Initiative Modal):**
- Header strip (handle, title, lifecycle stepper, primary actions).
- Seven horizontal tabs (one per stage sub-object + activity) — see section 9.2.
- Footer strip (Save state, "version 3" badge for `revision`, last-updated timestamp).

**No** breadcrumbs. **No** sidebar. **No** dashboard. **No** reports view.

## 5. Lifecycle and ground truth (verbatim — do not reword)

**Eight columns, fixed order:**
`idea` → `discovery` → `design` → `spec_ready` → `develop` → `uat` → `deployed`

Plus a separate **`parked`** rail (visually distinct — see 9.1).

**Forward moves require a gate:**
- `idea → discovery` requires `brief.complete === true` (the brief wizard satisfies this).
- `design → spec_ready` requires `design.review.status === "passed" | "waived"`.
- `spec_ready → develop` requires `spec.specComplete === true`.

**Backward moves are allowed but warned:**
- `→ idea` from any later column **wipes** brief / discovery / design / spec back to `title + body` only. Show a hard, two-step confirm (see 9.9).
- `spec_ready → discovery` or `spec_ready → design` retains data.

**`parked` requires** `parkedIntent` (`revisit` | `wont_consider`) **and** `parkedReason` (free text). Un-parking returns the card to `idea` and clears both.

## 6. Card data shape (full)

Every initiative carries:

| Field | Type | Surfaces where it appears |
|-------|------|----------------------------|
| `handle` | string e.g. `INIT-0042` | Card face, modal header, search, exports |
| `title` | plain text | Card face, modal header (editable inline) |
| `body` | rich text | Idea tab |
| `lifecycle` | one of the 8 + parked | Card face dot, modal stepper |
| `revision` | int | Modal footer badge ("v3") — quiet, informational |
| `parkedIntent` / `parkedReason` | enum / string | Parked rail card, modal Idea tab when parked |
| `gate.*` | object | Idea tab (if present) |
| `brief.*` | object — three required fields + synthesis | Brief tab; one-line preview on card face |
| `discovery.*` | object — research, evidence, competitors, solution patterns, open questions, summary | Discovery tab |
| `design.*` | object — Figma + Claude Design + lo-fi + hi-fi + review | Design tab |
| `spec.*` | object — prdPath + clarifications + specComplete + handoffBundlePath | Spec tab |
| `release.*` | object — userFacingNotes + metricsCheck | Release tab (unlocks at `develop`) |
| `events[]` | append-only log | Activity tab |
| `sourceRefs[]` | linked vault paths | Discovery tab "evidence" section, modal footer "linked sources" line |
| `attachments[]` | user-pasted links | Modal footer "Attachments" |

## 7. The field envelope (provenance — render this everywhere)

Every skill-written field carries `{ value, confidence: high | med | low, source: user | agent_draft | user_via_agent | meeting_cited | signal_cited | imported, reviewedBy, reviewedAt }`.

**Visual treatment (the only colour-as-signal in the wireframe):**
- `source = user` OR `reviewedBy` set → quiet check icon, no chip.
- `confidence = med` AND unreviewed → small yellow chip "Med · unreviewed".
- `confidence = low` AND unreviewed → small red chip "Low · review".
- Hovering or focusing the chip reveals the source ("Drafted by /moneypenny-custom · 14 Apr") and a "Mark reviewed" action.

## 8. Skill triggers (the chat agents — render their effect, not the chat itself)

| When | Skill ID | What lands on the card |
|------|----------|--------------------------|
| In `idea` (optional, on demand) | `/pdlc-idea-gate-custom` | `gate.recommendation`, `gate.strategicFit`, `gate.roughEffort`, `gate.origin`, `gate.tradeOff`, `gate.primaryBeneficiary` |
| `idea → discovery` (drop or button) | `/pdlc-brief-custom` (3-question wizard) | `brief.problem`, `brief.targetUsers`, `brief.coreValue`, `brief.understandingSummary`, `brief.complete = true` |
| `discovery` kickoff + Monday sweep + manual re-run | `/moneypenny-custom` | `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.customerEvidence[]`, `discovery.solutionPatterns[]`, `discovery.openQuestions[]` (drafts), `discovery.research.summary`, `discovery.iteration`, `discovery.lastRerunAt` |
| `spec_ready` on column entry | `/agent-prd` (future: `/bond-prd-custom`) | `spec.prdPath`, `spec.clarifications[]`, `linkedPrdPath` |
| Manual critique on the spec | `/agent-q-cto-custom` + `/agent-m-cpo-custom` | Critique notes appended under Spec tab "Critiques" subsection |
| `develop` on entry | `/pdlc-release-notes-custom` (future) | `release.userFacingNotes` |
| `deployed` + schedule | `/pdlc-metrics-check-custom` (future) | `release.metricsCheck.*` |

**The wireframe does not show the chat transcript.** It shows: (a) a non-blocking "skill running" indicator (see 9.5) on the affected card, (b) an Activity-tab entry when the skill finishes, (c) the new fields appearing on the relevant tab with their confidence chip.

## 9. Screen inventory

### 9.1 Board (primary screen)

**Top bar (sticky, 48 px):** as specified in section 4.

**Columns (8 main + parked rail):**
- Eight elastic columns: `repeat(auto-fit, minmax(280px, 1fr))`, horizontal scroll if width insufficient.
- Each column header: lifecycle name + count badge ("Idea · 7"), small "+" affordance for `idea` only.
- Cards stack vertically, sorted by `sortOrder` (PM-reorderable via drag within column), newest at top by default.
- Right-edge **`parked` rail**: collapsible, desaturated treatment, separate from the eight-column flow, persistently visible at the right when expanded; an icon-only collapsed strip when hidden. Parked cards show `parkedIntent` chip.

**Card face (compact density default):**
- Row 1: `handle` badge · lifecycle dot · ••• actions menu.
- Row 2: `title` (truncate to one line at compact, two at comfortable, three at detailed).
- Row 3 (only if `brief.complete`): one-line `problem.value` preview (italic, muted).
- Row 4 (only if relevant): confidence chip (red/yellow), open-questions count chip ("3 open"), skill-running spinner (see 9.5).
- Drag handle: implicit on the whole card; a grip glyph appears on hover at the left edge.

**Density toggle behaviour:**
- **Compact** — 1-line title, no preview, chips visible.
- **Comfortable** — 2-line title, preview row, chips visible.
- **Detailed** — 3-line title, preview, chips, plus `gate.recommendation` chip if present, plus `lastRerunAt` relative time on discovery cards.

**Drag-and-drop:**
- Pointer-only drag (8 px activation distance — text selection inside the card stays native).
- Legal target columns highlight on drag-start; illegal columns dim with a one-line tooltip ("Brief not complete" / "Design review required" / "Spec not complete").
- Drop on `discovery` from `idea` opens the brief wizard (it does not move the card silently).
- Drop on `parked` opens the park dialog.
- Within-lane drag reorders.

**Empty board:** see 9.10.

### 9.2 Initiative Modal — the card popup (this is the main ask)

**Geometry:** URL-addressable (`/initiatives/INIT-0042`), opens over a blurred overlay, ~70 vw × 85 vh (clamped 720 px min, 1280 px max width). Closes on Esc or outside-click (with unsaved-change confirm).

**Header strip:**
- Left: `handle` badge + `title` (click to edit inline; Enter saves; Esc cancels).
- Centre: lifecycle stepper — 8 dots (active dot solid, locked dots hollow); current column name reads under the stepper.
- Right: primary "Move to…" button, secondary ••• menu (Park / Delete / Copy link / Open in Cursor).

**Tab bar (7 tabs, horizontal, lifecycle-gated):**
Locked tabs (those whose stage hasn't been entered) show a small lock glyph and are non-clickable — tooltip "Available after [stage]".

| Tab | Always visible? | Locked until | Owner skill |
|-----|------------------|----------------|-------------|
| Idea | Yes | — | (PM) + `/pdlc-idea-gate-custom` |
| Brief | Yes | — (empty until `idea → discovery` is initiated) | `/pdlc-brief-custom` |
| Discovery | Yes | Brief saved | `/moneypenny-custom` |
| Design | Yes | Discovery has at least one customer evidence OR open question resolved | (PM) + `/anthropic-frontend-design` |
| Spec | Yes | Card has reached `spec_ready` once | `/agent-prd` (future `/bond-prd-custom`) |
| Release | Yes | Card has reached `develop` once | `/pdlc-release-notes-custom` |
| Activity | Yes | — | (system, append-only) |

**Footer strip:** "Saved · 2 min ago" · "v3" (revision badge) · "Linked sources: 4" (clickable, opens a small popover listing `sourceRefs[]`).

---

### 9.2.1 Idea tab

**Sections:**
- **Body** — rich-text editor (R18 toolbar, see 11). Empty state placeholder: "Describe the idea. One paragraph is enough."
- **Idea gate (optional card)** — collapsed by default if `gate.*` empty.
  - Empty state: a single "Run idea gate" button with one-line explainer "Five quick questions to score strategic fit before brief."
  - Filled state: read-only summary cards for each `gate.*` field with confidence chips. "Re-run gate" link in the corner.

---

### 9.2.2 Brief tab

**Empty state (most common when card just arrived in `discovery` or PM clicked drag-on-discovery):**

A **chat-style wizard** rendered inside the tab (not a separate modal):
- Step 0: intro panel — "Let's get the thesis right. Three questions. ~3 minutes."
- Step 1: **Problem** — single textarea, placeholder "What user or job is broken today?"; required indicator (red dot on step rail).
- Step 2: **Target users** — textarea, placeholder "Who experiences this problem? Be specific."; required.
- Step 3: **Core value** — textarea, placeholder "Why this matters — what changes for them when this ships."; required.
- Step 4: **Synthesis** — auto-drafted paragraph stitched from the three above (`brief.understandingSummary`, source `agent_draft`); editable.

**Wizard chrome:**
- Step rail at the top (4 dots; current step highlighted; required-but-empty steps show a red dot).
- "Back" / "Next" navigation.
- Two save buttons at the summary step:
  - **Primary:** "Save brief & start discovery" (writes `brief.*` + `brief.complete = true`, moves card to `discovery` if not already there).
  - **Secondary:** "Save brief only" (writes `brief.*` but leaves the card in `idea`).
- Both save buttons show a one-line audit hint: "Will record: brief saved · skill_run /pdlc-brief-custom".

**Read mode (after first save):**
- Three answer cards (Problem / Target users / Core value), each with the field envelope chip and a "Edit" pencil.
- Synthesis paragraph below, with confidence chip and "Re-synthesise" link.
- Footer: "Reviewed by Shaun · 14 Apr" (only if `reviewedBy` set) + "Re-run brief wizard" link.

**Error state:**
- 422 "Required field missing" — inline message above the save button, listing which of the three is empty.

---

### 9.2.3 Discovery tab

**Header strip:**
- Iteration counter ("Discovery iteration #2").
- `lastRerunAt` ("Last refreshed 6 days ago").
- Stale indicator (red dot + tooltip "Brief edited since last discovery run") triggering "Re-run discovery" CTA.
- "Re-run discovery" button (primary if stale, secondary otherwise) — explicit cost hint "~$0.30 per run" beneath.

**Sections (in this order, each independently collapsible):**

1. **Research summary** — agent-drafted paragraph, confidence chip. Read-only here; PM edits via "Re-synthesise" or by editing the components below.

2. **Open questions** (`discovery.openQuestions[]`)
   - List view; each row shows: status pill (`open` / `resolved` / `wontfix`), question text, owner avatar, optional answer preview, source-link icon if `sourceRef` present.
   - Row actions: Resolve (opens inline answer textarea) / Mark won't fix (with reason) / Edit / Delete.
   - "+ Add open question" button at the bottom.
   - Empty state: "No open questions yet — Moneypenny will draft these on the next run, or add your own."

3. **Customer evidence** (`discovery.customerEvidence[]`)
   - Quote cards: large quote in muted serif (or DS equivalent) + attribution line "— Sarah Chen, Acme · 12 Mar" + "Open source" link to the vault path (`People/External/...`).
   - "+ Add quote" button (manual entry: quote, person, date, sourceRef path).
   - Empty state: "No quotes captured yet."

4. **Competitor snapshot** (`discovery.competitorSnapshot`)
   - Compact table: Vendor · What they do · How we differ · Source.
   - Sortable by vendor; "Open source" link per row.
   - Empty state: "No competitor snapshot yet — Moneypenny populates this from Felix's weekly artefacts and ICP near-neighbours."

5. **Solution patterns** (`discovery.solutionPatterns[]`)
   - Card per pattern: pattern name, `exampleVendors[]` chips, `applicabilityToWT` (one paragraph), source link, confidence chip.
   - Anti-pattern variant: red border, "Anti-pattern" tag.
   - Empty state: "No solution patterns yet."

6. **Research notes** (`discovery.researchNotes`)
   - Rich-text panel; PM-editable. Confidence chip if `agent_draft`.

**Section ordering rule:** Research summary first, then open questions (the most actionable), then evidence/competitors/patterns, then research notes (longest read).

---

### 9.2.4 Design tab

**Sections:**

1. **Reference links**
   - `figmaLibraryUrl` — single URL field, "Open in Figma" button.
   - `claudeDesignSessionUrl` — single URL field, "Open Claude Design session" button.

2. **Lo-fi artefact** (mandatory before `design → spec_ready`)
   - URL field + "Open lo-fi" button. Empty state: red dot + "Lo-fi link required before spec ready."

3. **Hi-fi artefact** (only if `hiFiRequired` toggle is on)
   - Toggle: "Hi-fi required for this initiative" (PM choice; documented in card history).
   - URL field appears when toggle is on.

4. **Implementation polish note** (`implementationPolishNote`)
   - Textarea — captured after `/anthropic-frontend-design` runs in Cursor. Empty state: "Will be filled after the Cursor implementation polish step."

5. **Design review** (`design.review`)
   - Status pill: pending / passed / waived.
   - Two action buttons (PM or Designer):
     - **Mark review passed** (primary when status === pending) — captures `by` + `at`.
     - **Waive review** (secondary) — opens dialog asking `waiverReason` (required free text).
   - If waived: show "Waived by Shaun · 14 Apr · reason: [text]" below.

---

### 9.2.5 Spec tab

**Sections:**

1. **PRD link** (`spec.prdPath`, `linkedPrdPath`)
   - If empty: "No PRD generated yet" + "Generate PRD via /agent-prd" button (this triggers the export pack flow — does not run the agent in-app).
   - If present: file path + "Open PRD" button.

2. **Clarifications** (`spec.clarifications[]`)
   - List view: question, status (open / resolved), answer if resolved, source.
   - Row actions: Resolve / Edit / Delete.
   - "+ Add clarification" button.

3. **Spec readiness checklist** (the nudge for `spec_ready → develop`)
   - Checkbox list (PM-driven; soft block, not hard):
     - [ ] All open questions resolved or marked won't-fix.
     - [ ] Design review passed or waived.
     - [ ] PRD path populated.
     - [ ] All clarifications resolved.
   - When all four ticked, `spec.specComplete` flips to `true` and the "Move to develop" path unlocks (warned, not enforced, in MVP).

4. **Handoff bundle** (`spec.handoffBundlePath`)
   - File path + "Open handoff bundle" button. Empty state: "Bundle not assembled yet — generated when card enters develop."

5. **BDD toggle** (`spec.bddRequested`)
   - Single toggle; if on, shows a placeholder "BDD scenarios live alongside the PRD."

6. **Critiques** (M + Q outputs)
   - Two collapsed panels: "M (CPO) — Product critique", "Q (CTO) — Technical critique".
   - Each shows a 7-row checklist (PASS / SOFT / GAP per row) and a "Must-fix" list. Empty state: "No critique pass yet — run /agent-m-cpo-custom or /agent-q-cto-custom."

---

### 9.2.6 Release tab (unlocks at `develop`)

**Sections:**

1. **User-facing release notes** (`release.userFacingNotes`)
   - Rich-text editor with a strict "non-technical" placeholder: "What does the end user get when this ships? One short paragraph."
   - Confidence chip if `agent_draft`.
   - "Mark reviewed" sets `reviewedBy` + `reviewedAt`.

2. **Metrics check** (`release.metricsCheck`)
   - Status pill: not_started / pending / met / missed.
   - List of `targets[]` from PRD frontmatter (read-only display).
   - "Last checked: 3 days ago" + "Re-check now" button (placeholder for future skill).

---

### 9.2.7 Activity tab

**A read-only events feed.**
- Grouped by day (most recent day at top).
- Each row: timestamp · `by` (avatar + name) · kind icon · payload sentence.
- Payload rendering per `kind`:
  - `create` — "Created INIT-0042."
  - `delete` — "Deleted INIT-0042 — note: …" (only on tombstone view; not normally visible since hard delete removes the row).
  - `stage_transition` — "Moved from idea → discovery."
  - `field_edit` — "Reordered card to position 3 in discovery."
  - `skill_run` — "Ran /moneypenny-custom (mode: headless · iteration 2 · cost $0.27 · wrote: discovery.competitorSnapshot, discovery.openQuestions)."
  - `review` — "Marked design review passed."
- Filter chips at the top: "All / Stage moves / Skill runs / Edits / Reviews".

---

### 9.3 New-idea modal

- Two fields:
  - `title` — single-line input, required, placeholder "Give it a short, recognisable name." Char counter at 80.
  - `body` — rich-text editor (R18 toolbar), optional, placeholder "Describe the idea. You can add more in the Idea tab later."
- Footer: "Cancel" / **"Create idea"** (primary, disabled until title is non-empty).
- On create: card lands at the top of the `idea` column with a brief "INIT-0043 created" toast.

### 9.4 Brief wizard

Lives inside the Brief tab in the Initiative Modal — see 9.2.2 for the full spec.

### 9.5 Skill-running indicator

Skills run **outside** the wireframe (in Cursor / Claude). The board shows progress in three places:

1. **Card face** — small progress chip "Running /moneypenny-custom…" with a spinner; replaced by a quiet check + "Updated 2s ago" on completion.
2. **Initiative Modal — affected tab** — section-level skeleton loaders for the fields the skill is writing (e.g. competitor snapshot rows show as skeleton placeholders during a `/moneypenny-custom` run).
3. **Activity tab** — appended `skill_run` entry on completion (see 9.2.7).

If the skill **fails**, the card shows a red triangle chip "Skill error" with an inline expansion: error code, suggested next step, "Retry" / "Cancel" actions. Errors never block the rest of the card.

### 9.6 Park dialog

- Triggered from the card ••• menu or by drag-to-`parked`.
- Two required inputs:
  - `parkedIntent` — radio group: "Revisit later" / "Won't consider".
  - `parkedReason` — textarea, placeholder "Why now? One sentence is enough."
- Footer: "Cancel" / **"Park initiative"** (primary, disabled until both fields valid).
- On confirm: card moves to the `parked` rail; toast "Parked INIT-0042 — won't consider".

### 9.7 Delete confirm

- Triggered from the card ••• menu.
- Two-step destructive pattern:
  - Step 1 — list what will be lost: "Removes INIT-0042 — <title>, plus brief / discovery / spec / release content. The audit log keeps a tombstone."
  - Step 2 — type the handle to confirm: "Type INIT-0042 to confirm." (input matches the handle).
- Footer: "Cancel" / **"Delete initiative"** (primary destructive, disabled until handle matches).
- On confirm: card disappears, toast "Deleted INIT-0042" with an "Undo (10s)" link.

### 9.8 Move-to dialog (keyboard cross-lane path)

- Opened from the card ••• → "Move to…" or `M` keyboard shortcut while a card is focused.
- A list of legal target columns (illegal columns disabled with a one-line reason).
- Single-select; Enter confirms; Esc cancels.
- Special targets:
  - "discovery" → triggers brief wizard if `brief.complete` is false.
  - "parked" → triggers park dialog.
  - "idea" (backward) → triggers backward-move + wipe confirm (9.9).

### 9.9 Backward-move + wipe confirm

- Triggered when moving any card from a later column back to `idea`.
- Hard, two-step destructive confirm:
  - Step 1 — explicit list: "Moving back to idea will clear: brief, discovery, design, spec, release. Only title and body remain. The audit log keeps the history."
  - Step 2 — single confirm: "Yes, wipe and move to idea."
- Footer: "Cancel" / **"Wipe and move"** (destructive primary).
- Backward moves to a non-`idea` later column (e.g. `spec_ready → discovery`) only need a single one-step confirm — data is retained.

### 9.10 Empty board (first-run)

- Centred panel: "No initiatives yet."
- One CTA: **"+ Add your first idea"** (opens 9.3).
- One quiet helper line: "Initiatives flow left-to-right through eight lifecycle columns."
- No fake illustrations; no mascot; no marketing copy.

### 9.11 Settings / preferences (minimal)

- Accessible via the user badge → "Preferences".
- Single panel:
  - Density default (compact / comfortable / detailed).
  - Show parked rail (on / off).
  - Time zone (UTC stored / SAST displayed — read-only line in MVP).
- "Save" / "Cancel".

### 9.12 Command bar (Cmd+K — optional, MVP-light)

- Invoked with `Cmd+K`.
- Single text input + result list.
- Result types: initiatives (by handle / title), actions ("New idea", "Open card INIT-0042"), tabs ("Open Discovery on INIT-0042").
- Esc closes.

## 10. State matrix (every surface — sketch each)

For every surface in section 9, render:

- **Empty** — no data yet.
- **Loading** — skeleton placeholders, never spinner-only on the board.
- **Error** — inline message; never toast-only on destructive actions.
- **Stale** — discovery panel when `brief.updatedAt > discovery.lastRerunAt`; spec panel when `discovery.openQuestions[].status === resolved` after `spec.*.updatedAt`.
- **Locked** — modal tabs whose stage hasn't been entered; greyed icon + tooltip.
- **Read-only** — every surface when the PM is not signed in (placeholder for future RBAC; in MVP, single operator, but still render the read-only state for Steerco viewers).
- **Skill-running** — see 9.5 for the per-surface treatment.

## 11. Visual + interaction constraints (use the loaded DS)

- **WCAG 2.1 AA** colour contrast on all text and chips (4.5:1 body; 3:1 large/UI/focus ring).
- **2 px focus ring** on every interactive element. Never `outline: none`.
- **Keyboard-complete** flows; the `Actions → Move to…` submenu (or `M` key) is the keyboard cross-lane path.
- **No raw markdown** ever surfaced — body / brief answers / discovery notes / open-question answers / release notes render through a rich-text view. Titles stay plain.
- **Rich-text editor toolbar minimum** (wherever editing exists): Bold · Italic · Underline · H2 · H3 · bulleted list · numbered list · link · inline code · clear formatting. Storage format: markdown (preferred) or sanitised HTML.
- **Paste hygiene:** when pasting from Word / Google Docs / web pages, preserve only toolbar-supported formatting; strip inline styles, custom fonts, coloured text.
- **Forbidden patterns** (do not use): gradient backgrounds without purpose; oversized emoji on every heading; placeholder text duplicating the label; `text-center` on every paragraph; random shadow depths per card; inline coloured text; rainbow tag colours.
- **Density** is the only user-controllable visual variant in MVP.
- **Light theme only.** Dark mode deferred.
- **Desktop only.** Min viewport 1280 × 800.
- **Confidence chips are the only colour-as-signal.** Everywhere else, contrast + spacing + iconography carry meaning.

## 12. Keyboard map (render as a help overlay accessible via `?`)

| Key | Action |
|-----|--------|
| `?` | Open keyboard help overlay |
| `Cmd+K` | Open command bar |
| `N` | New idea (anywhere) |
| `Enter` (card focused) | Open initiative modal |
| `M` (card focused) | Open Move-to dialog |
| `P` (card focused) | Park dialog |
| `Del` (card focused) | Delete confirm |
| `J / K` | Next / previous card in same column |
| `H / L` | Previous / next column |
| `Tab` | Forward focus |
| `Shift+Tab` | Backward focus |
| `Esc` | Close modal / dialog / cancel inline edit |

## 13. Microcopy bank (use these strings — do not invent variants)

**Buttons (primary):** "Create idea" · "Save brief & start discovery" · "Save brief only" · "Park initiative" · "Delete initiative" · "Move to" · "Re-run discovery" · "Mark review passed" · "Waive review" · "Generate PRD via /agent-prd" · "Wipe and move".

**Buttons (secondary):** "Cancel" · "Edit" · "Re-run brief wizard" · "Re-synthesise" · "Add open question" · "Add quote" · "Add clarification" · "Open PRD" · "Open lo-fi" · "Open Figma" · "Open handoff bundle" · "Re-check now" · "Retry" · "Undo".

**Empty states:** "No initiatives yet." · "No open questions yet — Moneypenny will draft these on the next run, or add your own." · "No quotes captured yet." · "No competitor snapshot yet — Moneypenny populates this from Felix's weekly artefacts and ICP near-neighbours." · "No solution patterns yet." · "No PRD generated yet." · "Bundle not assembled yet — generated when card enters develop." · "No critique pass yet — run /agent-m-cpo-custom or /agent-q-cto-custom."

**Tooltips on locked tabs:** "Available after [stage]" (e.g. "Available after discovery").

**Error messages (one sentence each, name + next step):**
- "Brief is missing required fields. Fill Problem, Target users, and Core value to save."
- "Lo-fi link required before moving to spec ready. Add a Claude Design or Figma link in the Design tab."
- "Discovery has unresolved open questions. Resolve or mark won't-fix before spec ready."
- "Card has been edited elsewhere. Refresh to see the latest version."

**Toasts (5s, dismissible):** "INIT-0043 created." · "Brief saved." · "Moved to discovery." · "Parked INIT-0042 — won't consider." · "Deleted INIT-0042. Undo (10s)." · "Skill /moneypenny-custom finished. Updated 4 fields."

**Confirmation copy (destructive):** as in 9.7 and 9.9.

## 14. Designer handoff sidebar (please render)

A small sidebar inside the wireframe set summarising what an implementer needs:
- The eight `lifecycle` values are fixed and ordered. Do not reword.
- The brief is three questions: Problem, Target users, Core value. Do not add scope, assumptions, or success metrics at brief time — those belong in discovery / spec.
- Every skill-written field carries the field envelope (section 7). Confidence chips are the only colour-as-signal.
- Hard delete in MVP (no soft-delete UI). Tombstone only in the audit log.
- Single operator in MVP. Read-only state still rendered for Steerco viewers later.
- All rich-text inputs share one toolbar definition (section 11).

## 15. Out of scope for this wireframe pass

- Mobile / tablet breakpoints (desktop-only MVP).
- Authentication, RBAC, multi-tenant.
- Per-user theming, dark mode (light only).
- Technical surfaces: `/health`, `/ready`, version footer, deploy console.
- Marketing / landing surfaces.
- Phase 2 hosted-runner UI ("Agent Flywheel").
- Phase 3+ surfaces: meeting transcript correlation, signal feed, marketing intel panel.
- The chat agent UIs themselves — assume the skill runs in the user's existing Cursor/Claude session and writes back to the card. Render how the card surfaces that result, not the chat transcript.
- A separate "release notes preview" or print/export view (lives as the Release tab content).

## 16. Mermaid appendix (copy-paste friendly)

End the deliverable with a `flowchart` mirroring the lifecycle — eight columns left-to-right, parked as a side branch reachable from any column, skill icons on the relevant transitions (`/pdlc-brief-custom` on `idea → discovery`, `/moneypenny-custom` on `discovery` kickoff, `/agent-prd` on `spec_ready` entry, `/pdlc-release-notes-custom` on `develop` entry).

---

Now produce the wireframe set, then the state matrix, then the keyboard help overlay, then the flow diagram + mermaid appendix.

---END CLAUDE DESIGN PROMPT---
```

---

## Shorter one-shot variant (if Claude Design hits a length limit)

Paste this alone instead of the long block:

> Wireframe an **internal kanban tool** for a single Product Manager. Eight ordered lifecycle columns — `idea`, `discovery`, `design`, `spec_ready`, `develop`, `uat`, `deployed` — plus a separate `parked` rail. **Card** = `handle` (`INIT-NNNN`) + `title` + one-line `problem` preview when brief is complete + confidence chip. **Detail** = a URL-addressable modal (~70 vw × 85 vh) with seven lifecycle-gated tabs: **Idea, Brief, Discovery, Design, Spec, Release, Activity**; tabs whose stage hasn't been entered show a locked grey-dot. **Brief** is a chat-style wizard with **three** questions only (Problem, Target users, Core value) + auto-synthesised summary; two save buttons (`Save brief & start discovery` / `Save brief only`). **Discovery tab** shows open questions, customer evidence with source links, competitor snapshot, solution patterns, research notes, and a "Re-run discovery" CTA when stale. **Park** requires `parkedIntent` + `parkedReason`. Render every skill-written field with a confidence chip (red = low/unreviewed; yellow = med/unreviewed; quiet check = reviewed). **No raw markdown**; rich-text everywhere with a fixed toolbar (B / I / U / H2 / H3 / UL / OL / link / inline code / clear formatting). **WCAG 2.1 AA**, 2 px focus ring, keyboard-complete (use an `Actions → Move to…` submenu as the cross-lane keyboard path; pointer drag is the mouse path). Use the loaded design system; do not invent tokens. Show empty / loading / error / stale / locked states for each surface, plus a single end-to-end flow diagram and a mermaid appendix.

---

## Source material this brief was synthesised from

| File | What it contributed |
|------|---------------------|
| [plan.md](./plan.md) | Lifecycle values, R1–R18 requirements, Bar A/B scope, MVP decisions |
| [schema-initiative-v0.md](./schema-initiative-v0.md) | Card shape, field envelope, stage sub-objects, `events[]` kinds, skill I/O |
| [sprint-backlog.md](./sprint-backlog.md) | Sprint shape → screen inventory (S0 shell · S1 CRUD · S3A.1 brief shrink · S3A.2 modal · S3B discovery · S4 export · S5-6 design · S7 spec · S8 rewind) |
| [tech-stack.md § 3 UI primitives](./tech-stack.md) | R18 visual constraints, toolbar minimum, forbidden patterns |
| [skill-agent-map.md](./skill-agent-map.md) | Skill triggers on column moves, custom variants |
| [company_strategy.md](./company_strategy.md) | "Internal tool" framing, no marketing voice |
| [System/icp.md](../../System/icp.md) | Audience framing for Moneypenny's discovery output (competitor snapshot, solution patterns) |

---

## Re-invocation — what to do next time you open this

1. Copy the prompt between the `---BEGIN` and `---END` markers above.
2. Paste into a fresh Claude Design wireframe session.
3. Compare output against `pdlc-ui/` code (if you resurrect the branch) or against the shipped S3A.1 behaviour on the `freeze/skills-pipeline-pivot` tag.
4. If Design produces something materially better than the code-first direction, log it as a Phase 2+ design-revisit ticket in [plans/skill-pipeline/README.md](../skill-pipeline/README.md) — do not un-park `pdlc-ui` on design delta alone.

---

*Created 2026-04-24 — paste-ready wireframe brief for the parked `pdlc-ui` surface. Companion to [claude-design-orchestration-doc-prompt.md](./claude-design-orchestration-doc-prompt.md) (chat-orchestration artefact) and the skill-pipeline pivot ([plans/skill-pipeline/README.md](../skill-pipeline/README.md)).*
