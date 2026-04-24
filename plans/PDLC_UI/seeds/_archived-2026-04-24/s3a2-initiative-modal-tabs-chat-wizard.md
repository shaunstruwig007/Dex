Read plans/PDLC_UI/plan-mode-prelude.md first. Then execute Sprint S3A.2 — Initiative Modal + tabs shell + chat-style brief wizard + within-lane reorder restore (Bar A). Branch: feat/s3a2-initiative-modal-tabs.

Sprint 3A.2 is the **second slice of the 3A pass**. It collapses the card's inline `<details>` accordion, the `⋯ → Edit` dialog, and the stand-alone `BriefWizardDialog` into a **single Initiative Modal** that becomes the housing point for all per-initiative content. It restores **within-lane pointer reorder** via dnd-kit (removed in S3A.1 pass-2 to unblock real-user cross-lane drag) and closes the E2E coverage gap that let the HTML5-`draggable` defect escape. **Zero schema change** — same `briefSchema`, same `eventSchema`, same `canTransition`, same atomic `POST /api/initiatives/:id/brief`.

**What moved to S3A.3 (so this sprint stays tight):**
- Tick-driven discovery kickoff + in-progress surface on the Discovery tab (job record, runner, progress bar).
- `initiative_jobs` table.
- Pre-fill brief drafts from the idea description ("Draft from idea" affordances).
- Pixel-perfect dnd-kit Space/Arrow/Space keyboard DnD (focused-column mode).

**Carry-overs from S3A.1 Slice log (2026-04-22) that S3A.2 MUST preserve:**
- `briefSchema`, `REQUIRED_FOR_COMPLETE_BRIEF`, and the `missingForCompleteBrief` helper — unchanged. The chat-style wizard emits the **same** `POST /api/initiatives/:id/brief` body; only the input surface changes.
- `eventSchema` (incl. `skill_run` payload) — unchanged. No new `kind`.
- Atomic `POST /api/initiatives/:id/brief` route + the `missing_required_fields` 422 contract — unchanged.
- `canTransition` matrix + `deriveHasBrief` (`brief.complete === true`) — unchanged.
- Cross-lane DnD legality gate (matrix memo + `same_lifecycle` silent no-op) — unchanged.
- The `Actions → Move to…` submenu as the keyboard cross-lane fallback — unchanged.
- The regression guard: card `<li>` must **never** re-advertise `draggable="true"`.

**Goal:** the initiative card becomes a clickable entry point; clicking it opens a **URL-addressable, ~70vw × ~85vh modal** with six tabs (Idea · Brief · Discovery · Spec · Design · Activity) that progressively unlock as the initiative moves through its lifecycle. The brief capture becomes a **chat-style one-question-per-step flow** with plain-text inputs (no toolbar, no rich-text) — Enter advances, Shift+Enter inserts a newline. Within-lane pointer reorder comes back (dnd-kit, no HTML5). Everything a human or skill writes to the initiative is visible in this one surface.

---

### Deliverables

**1. Initiative Modal — URL-addressable shell**
- **Route shape (Next.js parallel + intercepting):**
  - `/ideas/@modal/(.)initiative/[id]` — intercepting route over the `/ideas` board; renders the modal in a portal over the live board.
  - `/initiative/[id]` — paired full-page route; renders the same tab shell without the board context behind it. Makes deep-linked modal URLs refresh-safe and shareable (Slack, Granola, meeting prep, email).
  - `@modal/default.tsx` returns `null` — the slot fallback when no modal is open.
- **Chrome:** Base-UI `Dialog` via the existing shadcn wrapper ([pdlc-ui/src/components/ui/dialog.tsx](../../pdlc-ui/src/components/ui/dialog.tsx) — wraps `@base-ui/react/dialog`). `DialogOverlay` = `bg-black/70 backdrop-blur-sm`. `DialogContent` = `w-[min(1200px,70vw)] h-[85vh] max-w-none p-0` with a compact header (handle badge + title + lifecycle chip + close) and a tab strip below.
- **Card click opens the modal.** `<li>` becomes the click target for anything **not** the ellipsis button, the grip handle hit-zone, or an interactive child (checkbox, menuitem, link). Keyboard Enter on a focused card opens the modal too.
- **Ellipsis menu shrinks** to `Move to…`, `Park`, `Delete`. `Edit` is removed — editing happens inside the Idea tab.
- **Active tab is a query param:** `?tab=brief` on the modal URL, persisted across refresh/back. Default tab on open = the **"most actionable"** tab for the initiative's current lifecycle (see tab availability below).
- **Close behaviour:** ESC, overlay click, back button, and the explicit close button all pop the modal (on the intercepting route) without losing board scroll position.

**2. Tab shell — six tabs, lifecycle-gated**
- **Canonical set (fixed order):** `Idea` · `Brief` · `Discovery` · `Spec` · `Design` · `Activity`.
- **Tab availability helper** (new): `tabAvailability(lifecycle: Lifecycle, brief: BriefState | null): Record<TabId, "live" | "pending" | "locked">` lives in `pdlc-ui/src/lib/tab-availability.ts`. Pure function, unit-tested in a sibling `.test.ts`. Single source of truth for:
  | Tab | `live` when | `pending` (grey dot) when | `locked` when |
  |---|---|---|---|
  | Idea | always | — | never |
  | Brief | `brief.complete === true` OR wizard is open | brief incomplete | never |
  | Discovery | `lifecycle ∈ {discovery, design, spec_ready, develop, uat, deployed}` | `lifecycle ∈ {idea}` before brief-save | — |
  | Spec | `lifecycle ∈ {spec_ready, develop, uat, deployed}` | `lifecycle ∈ {idea, discovery, design}` | — |
  | Design | never (S4 unlocks) | never | always in S3A.2 |
  | Activity | always | — | never |
- **Visual grammar:** live tab = label only. `pending` = label + `<span className="ml-1 size-1.5 rounded-full bg-muted-foreground/40" />`. `locked` = label + `<LockIcon />`, `aria-disabled=true`, no click target. **No** "unread" primary-colour dot this sprint (reserved for future activity highlight).
- **Tab panes:**
  - **Idea** — current "Edit initiative" form, inlined (title + TipTap body). Save writes the same revision-bumped update today's `⋯ → Edit` dialog writes. Unsaved-changes guard on tab switch / modal close identical to today's dialog.
  - **Brief** — empty-state runs the chat wizard (Deliverable 3). Complete-state renders the existing BriefPanel content (problem / targetUsers / coreValue with source + confidence chips) plus a small "Edit brief" affordance that re-enters the wizard on the same tab.
  - **Discovery** — read-view of `discovery.openQuestions[]` (existing data). Empty state (honest): "Discovery begins after you save the brief. Automated research lands in S3B (`/pdlc-discovery-research-custom`)." **Do not** fake a progress bar.
  - **Spec** — empty state until `lifecycle ∈ {spec_ready, …}`; then read-only render of the existing `spec.*` fields if present. **No editing** this sprint (S4 wires `/agent-prd` output).
  - **Design** — locked empty state. Copy: "Figma + Claude-design assets attach here in S4 after `spec_ready`."
  - **Activity** — append-only event feed sourced from the existing `events` table. Renders one row per event with `occurredAt`, actor, `kind` label, and a terse payload summary. Read from existing `GET /api/initiatives/[id]/events`-style endpoint if present; otherwise add a read-only route **confined to this sprint** (no schema change — just a SELECT on `events` where `initiativeId = ?`).

**3. Chat-style brief wizard (inside the Brief tab's empty state)**
- **One question per step. No headings, no rail, no toolbar.** Step frame: a single `<h2>` with the question (e.g. *"What's the core value?"*), a short helper sentence under it (*"Why are we doing this?"*), a plain `<textarea>` with visible placeholder, a minimal `1 / 3 · 2 / 3 · 3 / 3 · Summary` progress row, and an explicit `Next` button.
- **Input surface:** `<textarea>` only. **No TipTap.** `Enter` on single-line content advances to the next step. `Shift+Enter` inserts a newline. The `Next` button always runs the advance logic so mouse + SR users aren't penalised.
- **Wire shape preserved:** the wizard answers are still typed through the existing `briefWizardAnswersSchema`. On save, plain-text content is serialised as `<p>${escapeHtml(text).replace(/\n/g, "<br/>")}</p>` into the corresponding `brief.*.value` envelope. Existing rich-text viewers render it unchanged. **No new field, no format-version flag.**
- **Summary step:** unchanged composite (3 read-only chips + `Edit` jumps that focus the target textarea). Dual buttons unchanged: `Save brief only` (secondary) + `Save brief & start discovery` (primary). **S3A.2 leaves the kickoff side-effect as-is (still server-identical to S3A.1)** — the real kickoff is **S3A.3** under M1 honesty.
- **No rich text migration.** Existing rich-HTML brief values stay intact; the wizard never rewrites fields it didn't author. If the user re-opens the wizard on an existing brief (via "Edit brief"), the `<textarea>` pre-fills with the plain-text extraction (`plainFromHtml(value)`) — saving writes the plain-wrapped shape back. A warning toast fires the first time a rich-text brief is about to be flattened: *"Re-saving will replace formatting with plain text. Continue?"* Confirm-once-per-initiative in `sessionStorage`.

**4. Card UX changes (reduce friction, one click to everything)**
- **Remove the inline `<details>` BriefPanel accordion** from the card face. One-line truncated `problem.value` preview stays when `brief.complete`.
- **Card click ⇒ open modal.** Implement via `onClick` on the `<li>` with event-target guards so the ellipsis menu, grip handle, and any future affordance remain independently hittable.
- **Ellipsis menu:** remove `Edit`. Keep `Move to…` (submenu), `Park`, `Delete`.
- **Grip handle** gets a dedicated focus ring + `role="button"` + `aria-label="Reorder {handle}"` — it's now the explicit visual affordance for within-lane drag (see Deliverable 5). Still activates dnd-kit via a drag-handle ref (not HTML5).

**5. Within-lane pointer reorder — restored via dnd-kit (S3A.1 carry-over)**
- New pattern: `useDroppable` per card slot + dnd-kit `onDragOver` computes the above/below insertion site relative to the pointer Y; `onDragEnd` fires `computeMidpointSortOrder` + writes `sortOrder` via the existing `POST /api/initiatives/[id]/reorder` endpoint. **Same server contract as S2.**
- **Drag handle is the grip icon only** — `useDraggable` hook is attached to the grip's `ref`, not the whole `<li>`. Card body click → modal; grip drag → within-lane reorder. **Cross-lane drag still works from the card body** (the existing `PointerSensor` 6px activation on the `<li>`).
- **Mutually exclusive activation**: within-lane grip drag uses the same `PointerSensor` but with a dedicated `data` payload (`{ kind: "reorder", lifecycle }`) so the `DndContext` `onDragEnd` handler disambiguates reorder-vs-cross-lane on drop target kind (lane droppable = cross-lane, card-slot droppable = reorder).
- **HTML5 `draggable` remains banned.** The S3A.1 regression guard stays green (same e2e locator). Add a **new** e2e using CDP `Input.dispatchDragEvent` to cover the HTML5-drag-event class and prove the old defect cannot re-emerge.

**6. Activity tab — read-only event feed**
- Renders `events` table rows for the initiative, newest first, with a `kind`-to-label mapping helper (`stage_transition → "Moved from X to Y"`, `brief_saved → "Saved brief (3/3 required)"`, `skill_run → "Ran {skill} (iter {n})"`, `field_edit → "Edited {field}"`, `parked → "Parked: {intent}"`, `unparked → "Un-parked"`).
- Virtualised only if >200 rows (unlikely in S3A.2 — a simple overflow scroll is fine).
- No writes. No filters beyond "only events for this initiative". No event schema change.

**7. R16 same-PR docs**
- `plans/PDLC_UI/lifecycle-transitions.md` — update Cross-lane DnD §: within-lane reorder is back via dnd-kit (not HTML5); Activity tab referenced.
- `plans/PDLC_UI/schema-initiative-v0.md` — confirm **no schema delta** and note the new plain-text wrapping invariant (`<p>${escaped}</p>` for wizard-authored fields; rich HTML still valid on the same envelope).
- `plans/PDLC_UI/tech-stack.md §3.5` — note `useDroppable`-per-slot pattern for within-lane reorder; no new dep.
- `pdlc-ui/docs/design/board-layout.md` — add a §7 "Initiative Modal" section with the modal + tab anatomy and the tab-availability table.
- Post-merge: Slice log in `04-Projects/PDLC_Orchestration_UI.md` + tick S3A.2 Progress in `plans/PDLC_UI/plan.md`.

---

### Technical — how

- **Parallel routes**: scaffold `app/ideas/@modal/`, `app/ideas/@modal/default.tsx` (returns null), `app/ideas/@modal/(.)initiative/[id]/page.tsx`, `app/initiative/[id]/page.tsx`. Shared `<InitiativeModalShell>` component rendered by both the intercepted and full-page routes.
- **Modal state vs URL state**: the modal is a controlled Base-UI `Dialog` whose `open` follows the presence of the intercepting segment. `router.push(...)` / `router.back()` is the only way to open/close. No separate `isOpen` state.
- **Tab param**: `useSearchParams` reads `?tab=...`; `router.replace` updates it without new history entries (so tab switches don't pollute back-stack).
- **Tab availability**: pure helper with ~12 unit-test cases (one per lifecycle × each tab). No component touches the raw rules.
- **Wizard plain-text wrapping**: new helper `wrapPlainAsParagraph(text: string): string` with escape + newline handling. Unit tests: empty input → `<p></p>`, `Hello` → `<p>Hello</p>`, `Line 1\nLine 2` → `<p>Line 1<br/>Line 2</p>`, `<script>` → `<p>&lt;script&gt;</p>`. Round-trip test: `plainFromHtml(wrapPlainAsParagraph(x)) === x` for the set above.
- **Wizard existing-brief pre-fill**: `extractPlainText(brief.<field>.value)` — the existing `plainFromHtml` helper in `initiative-card.tsx` moves to `src/lib/rich-text.ts` and gets a unit test.
- **Within-lane reorder via dnd-kit**:
  - Each card slot renders a `CardSlot` child that is both a `useDroppable({ id: \`slot-\${cardId}\`, data: { kind: "slot", cardId, lifecycle } })` and hosts the `InitiativeCard`.
  - `board-dnd.tsx` adds a `useCardGripDraggable({ cardId, lifecycle })` hook attached to the grip icon's `ref`. `data: { kind: "reorder", cardId, fromLifecycle: lifecycle }`.
  - `onDragOver` (at the board level) updates a new `overSlotId` memo; the hovered `CardSlot` computes above/below from `event.delta.y` vs its bounding rect.
  - `onDragEnd` routes by `active.data.current.kind`: `reorder` → reorder write; `cross-lane` (existing) → transition write. **Same** `PointerSensor`, `KeyboardSensor`, activation distance.
- **CDP HTML5-drag e2e**: add `e2e/dnd-html5-drag.spec.ts` using `page.context().newCDPSession(...)` + `Input.dispatchDragEvent`. Test 1 — a simulated OS-level drag on the grip reorders the card (proves the new dnd-kit path handles real HTML5 drag events without regressing); Test 2 — a simulated OS-level drag on the card body does **not** trigger HTML5 `dragstart` (proves we never reintroduce `draggable="true"`).
- **Activity tab data source**: prefer adding `GET /api/initiatives/[id]/events` (no schema change; single SELECT). If an equivalent route already exists, reuse it.
- **Reuse, don't fork**: `canTransition`, `saveBriefAndTransition`, `briefWizardAnswersSchema`, `briefSchema`, `REQUIRED_FOR_COMPLETE_BRIEF`, `ParkedTransitionDialog`, `InitiativeFormDialog` (inlined, not rewritten), `RichTextRenderer`, `computeMidpointSortOrder`, `neighboursForSwap`, `PointerSensor`, `KeyboardSensor`.

---

### UI

- Read `.claude/skills/anthropic-frontend-design/SKILL.md` before styling the modal, tab strip, grey-dot indicators, chat wizard step, and grip-handle focus states.
- R18 baseline: `tokens.css` only; 2px visible focus ring on modal, tabs, grip, textarea, and each summary-chip Edit affordance; keyboard nav end-to-end; no raw markdown surfaces in the modal.
- Modal animation: honour `prefers-reduced-motion`. Default = a 120ms fade + 4px translate-up; reduced = fade only.

---

### DoD

- [ ] `/ideas/@modal/(.)initiative/[id]` intercepts over the board; `/initiative/[id]` renders the full-page shell; back button closes the modal without navigating away from the board.
- [ ] Overlay = `bg-black/70 backdrop-blur-sm`; content = `~70vw × ~85vh` with graceful min-widths.
- [ ] Card click anywhere outside the ellipsis / grip / interactive chrome opens the modal. Keyboard Enter on a focused card opens it. ESC closes. Overlay click closes.
- [ ] Ellipsis menu contains exactly: `Move to…`, `Park`, `Delete`. **No `Edit`.**
- [ ] Six tabs render in order: Idea · Brief · Discovery · Spec · Design · Activity. Grey-dot / locked states match `tabAvailability(…)` in every lifecycle.
- [ ] Active tab is a query param; refresh preserves it; tab change doesn't pollute back-stack.
- [ ] **Idea tab** edits title + body with the same revision-bumping contract as today's Edit dialog. Unsaved-changes guard on modal close + tab switch.
- [ ] **Brief tab empty state** is the chat wizard. One question per step. Plain `<textarea>` only. Enter advances on single-line; Shift+Enter inserts a newline. Explicit `Next` button present.
- [ ] Wizard saves emit `<p>...</p>`-wrapped plain text into `brief.*.value`. `briefSchema` + `missingForCompleteBrief` accept both legacy rich HTML and new plain wrapping (unit + integration tests).
- [ ] Summary step composite + click-to-edit jump still works. Dual save buttons present; both call the atomic `POST .../brief` route identically this sprint.
- [ ] Brief tab complete-state renders read-only fields with chips + "Edit brief" re-enters the wizard.
- [ ] **Discovery tab** renders `discovery.openQuestions[]` read-only. Empty-state copy explicitly mentions S3B. No fake progress bar.
- [ ] **Spec tab** read-only placeholder until `spec_ready`; no edit affordance.
- [ ] **Design tab** is locked with explicit "S4 unlocks" copy.
- [ ] **Activity tab** renders an append-only feed from the `events` table with terse human labels per event kind.
- [ ] **Within-lane pointer reorder works** via the grip handle (dnd-kit, no HTML5). Cross-lane pointer drag from the card body still works. Same `sortOrder` endpoint + `field_edit` event.
- [ ] **HTML5-drag regression guards green:** existing e2e that the `<li>` never advertises `draggable="true"` + new CDP `Input.dispatchDragEvent` test proving the dnd-kit reorder path tolerates OS-level drag events.
- [ ] Axe smoke: board, modal (each tab), wizard chat step, summary step — all critical/serious = 0.
- [ ] No schema change. `briefSchema`, `eventSchema`, `canTransition`, `deriveHasBrief`, `REQUIRED_FOR_COMPLETE_BRIEF`, `missingForCompleteBrief`, atomic brief route + 422 contract — all unchanged.
- [ ] R16 docs shipped same-PR (lifecycle-transitions, schema doc note, tech-stack §3.5, board-layout §7).

---

### Schema + docs same-PR discipline

- **Zero schema change** — same Zod, same Drizzle, same migrations. The only contract addition is the **plain-text wrapping invariant** on wizard-authored brief fields, documented in `schema-initiative-v0.md` § on brief envelopes (note-only, no type change).
- `lifecycle-transitions.md` change-log entry documents within-lane reorder restoration + Activity tab.
- `tech-stack.md §3.5` notes the `useDroppable`-per-slot pattern; no new dep.
- `pdlc-ui/docs/design/board-layout.md §7` adds Initiative Modal anatomy.
- Post-merge: Slice log + tick S3A.2 Progress in plan.md.

---

### Explicitly OUT

- **S3A.3 scope:** tick-driven discovery kickoff, `initiative_jobs` table, progress bar on Discovery tab, pre-fill brief drafts from idea description, "Draft from idea" affordances, pixel-perfect dnd-kit keyboard DnD (focused-column mode).
- **S3B scope:** real discovery research output (`/pdlc-discovery-research-custom`). The Discovery tab shows existing `openQuestions[]` and an honest "S3B ships automated research" empty-state.
- **S4 scope:** Design tab unlock + Figma / Claude-design asset attachment schema, Spec tab editing, `/agent-prd` wiring.
- Schema changes of any kind (`briefSchema`, `eventSchema`, `canTransition`, `initiativeSchema`, storage schema).
- Removal of legacy optional brief fields (`scopeIn`, `scopeOut`, `assumptions`, `constraints`, `successDefinition`). They remain in `briefSchema` as optional.
- Data migration. No backfill, no in-place rewrite of existing rich-HTML brief values. The flatten-warning toast is the guardrail.
- New event kinds. The Activity tab renders the existing closed discriminator.
- TipTap / rich-text anywhere in the wizard.

---

### Risks

- **Parallel-routes sharp edges** → pair the intercepting route with a full-page route from day one; test refresh-on-modal-URL + direct-to-full-page-route in Playwright.
- **Activation-distance conflict between card-body cross-lane drag and grip within-lane reorder** → both share `PointerSensor` (6px); `data.kind` on each draggable disambiguates `onDragEnd`. Unit-test the dispatcher; Playwright covers both paths.
- **Rich-HTML existing briefs flattened by the new wizard** → explicit first-time warning toast + plain-text pre-fill derived from the existing HTML. No silent data loss.
- **Tab-availability drift vs `canTransition`** → both are pure helpers with unit tests; CI fails if `tabAvailability` contradicts `canTransition`'s lifecycle list.
- **Scope creep into S3A.3** — kickoff wiring, job records, progress bars all **rejected in PR review**.
- **Activity tab perf** → unlikely to bite in S3A.2 volumes; lazy-load + virtualise is an S3A.3 polish if needed.

---

### Open questions to resolve in Plan mode (before Build)

1. **Modal width on sub-1200px viewports** — fix `min(1200px, 70vw)` or switch to `clamp(720px, 70vw, 1200px)`? Default = `min(1200px, 70vw)`; override only if 13" laptops feel cramped.
2. **"Edit brief" re-entry** — does it re-open the wizard at step 1 or at the first required-and-empty step? Default = first required-and-empty; if all three are filled, go straight to Summary so "Edit brief" becomes "review + tweak".
3. **Activity tab actor labels** — do we have a `createdBy` / `actor` on every event shape today? If not, Activity tab labels actors as `"Dex"` for `skill_run` and `"You"` for user-initiated events without changing the schema. Confirm in Plan mode.

---

Post-merge: Slice log line + tick S3A.2 Progress in plan.md. Do **not** modify S4+ sprint blocks, S3A.3 scope, or any S3A.1-locked contract. S3A.3 starts on its own branch after merge.
