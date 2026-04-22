# ADR 0003 — DnD shape (`@dnd-kit/core` + `@dnd-kit/sortable`, distance-activation) + HTML5 `draggable` ban + keyboard sensor deferred

## Status

Accepted (2026-04-22).

## Context

S3A.1 needed accessible cross-lane drag-and-drop on the ideas board. The S3A.1 plan (Q-alt.1) chose **`@dnd-kit/core`** without `@dnd-kit/sortable`, and specified **within-lane reorder** via the existing HTML5 `draggable` API already shipped in S2. Pass-1 (pre-merge) implemented both:

- `@dnd-kit/core` — cross-lane `PointerSensor` (6px activation) + cross-lane `KeyboardSensor` with a hand-rolled lane-step coordinate getter.
- HTML5 `draggable={true}` on the card `<li>` + native `onDragStart` / `onDragEnd` / `onDragOver` / `onDrop` handlers for within-lane reorder.

Two things broke under real-user testing that Playwright did not catch:

1. **Pointer drag was dead.** On real-browser `mousedown` on a card, the browser fires `dragstart` **before** `pointermove`, which consumes the event stream. `PointerSensor` never accumulated the 6px activation distance, so dnd-kit never invoked `onDragEnd`. The card visibly tracked the pointer (HTML5 drag image) but no state changed. Playwright's `page.mouse.*` synthesises pointer/mouse events but never HTML5 `drag*` events, so the entire suite stayed green while the feature was broken for humans.
2. **Keyboard `KeyboardSensor` was theatrical.** `Space` activated drag; `ArrowRight` fired the coordinate getter; the card visually lifted. But dnd-kit's default modifiers clamped `translate3d` to the source lane's bounding rect, so the card never crossed a lane boundary. Space → Arrow → Space dropped the card back into its origin. The Playwright test that should have caught this was written against synthetic DOM state and never observed the visual clamp.

Pass-2 (the merge commit) stripped **all** HTML5 `draggable` plumbing from the card `<li>` and delivered a Playwright regression guard that asserts `draggable="true"` is never present on a `listitem`. The pointer drag then worked. The keyboard sensor was left in place but the test that claimed to exercise it was rewritten to drive the card's `Actions → Move to…` submenu instead — the menu was the real accessible cross-lane surface that shipped. The PR body and R16 docs were amended to call this out ("M1 honesty").

Agent Q's audit on 2026-04-22 (post-merge) flagged the leftover `KeyboardSensor` + `laneKeyboardCoordinateGetter` as demo-dishonest tech debt: live code, tested only indirectly, claiming an accessibility surface it does not deliver. The S3A.1 cleanup PR removed it.

**Pass-3 defect (2026-04-22, post-cleanup, discovered via a user-recorded `dnd.mov`):** the pointer drag that Pass-2 "fixed" was still dead under real-user operation. During the first ≤6px of a slow drag, the browser was free to start a native **text selection** across the card's text nodes — dnd-kit's `PointerSensor` only calls `preventDefault` _after_ the activation constraint is crossed. Once selection started, subsequent `pointermove` events were consumed by the selection-extension engine and dnd-kit never activated. Playwright's `page.mouse.move` generates pointer events faster than a human and doesn't kick off native text selection, so the pointer e2e happily passed while the feature was broken for any real drag ≤ ~200 ms. Pass-3's fix was the canonical dnd-kit idiom: **`user-select: none` on the draggable surface** (non-parked card `<li>`) plus a visible `cursor-grab`/`active:cursor-grabbing` affordance. Text selection was re-enabled via `select-text` inside the opened Brief `<details>` so brief text remained copy-able. A CSS invariant regression guard was added to `e2e/dnd.spec.ts`.

**Pass-4 defect (2026-04-22, discovered via a second user-recorded `DND not working.mov` + `JIRA.mov`):** Pass-3 shipped with `user-select: none` but the user reported the drag STILL did not activate for them AND that `select-none` broke the ability to copy text out of the card. The user also anchored expected behaviour to JIRA's kanban drag.

Pass-4 went through two attempts:

- **Pass-4a (rejected)** tried `{ delay: 120, tolerance: 5 }` delay-based activation. Delay activation makes dnd-kit own the pointerdown for 120ms before any other gesture. It does work in the browser, but it felt sluggish — the perceptible pause before the card lifts is not what JIRA does, and synthesised Playwright pointer events have to hard-wait the delay timer too, which made the e2e brittle. Rejected.

- **Pass-4b (shipped)** switched to **distance-based activation** — `{ distance: 8 }`. This is the activation mode Linear, Trello and Asana's kanban boards use. dnd-kit activates once the pointer has moved ≥8px while a mousedown is held; any movement under 8px is handed back to the browser as a normal click. Drag activation is *immediate* on the first qualifying move, which matches JIRA's tactile feel. `user-select: none` is no longer needed — an 8px movement threshold pre-empts the text-selection race cleanly, because a click without drag never triggers drag (so cursor positioning, double-click word select, triple-click paragraph select, and Cmd+A all work) and once dnd-kit activates it calls `preventDefault` on subsequent pointermoves. The trade-off is that click-and-drag to select a long run of text (>8px) starts a card drag instead — the same trade-off every production kanban board makes; the workaround is double-click / triple-click / Cmd+A.

The sortable primitive + `<DragOverlay>` introduced during Pass-4a are kept: the sortable context gives us within-lane pointer reorder for free (was originally S3A.2 scope), and the DragOverlay lifts the dragged card off the lane container so the drag preview is not clipped by the lane/rail scroll containers — the JIRA-like visual lift the user's validation video showed.

The Pass-3 `user-select: none` regression guard in `e2e/dnd.spec.ts` was inverted to the Pass-4 invariant: non-parked cards MUST allow text selection.

## Decision

**1. `@dnd-kit/core` + `@dnd-kit/sortable` own all pointer drag.**

- `@dnd-kit/core` + `@dnd-kit/sortable` (installed in Pass-4). `@dnd-kit/sortable` gives us within-lane reorder out of the box and uses the same `DndContext` / `PointerSensor` as cross-lane — one drag-end handler dispatches on whether the over-target is a sibling card (within-lane reorder) or a lane container (cross-lane transition). See `src/components/ideas/ideas-board.tsx → handleDragEnd`.
- `PointerSensor` activation constraint = `{ distance: 8 }` (see [`src/components/ideas/board-dnd.tsx`](../../src/components/ideas/board-dnd.tsx) → `POINTER_ACTIVATION_DISTANCE_PX`). dnd-kit activates once the pointer has moved ≥8px while a mousedown is held; any movement under 8px is handed back to the browser as a normal click. This is the same activation Linear/Trello/Asana use and what unblocked real-user drag after `{ delay: 120, tolerance: 5 }` felt sluggish in Pass-4a and `{ distance: 6 }` + `user-select: none` failed in Pass-3.
- A `<DragOverlay>` at the board root (in `ideas-board.tsx`) renders a floating duplicate of the active card that follows the pointer — portalled to `document.body` by dnd-kit so it is never clipped by the lane's horizontal scroll container or the parked rail. The source card fades (`opacity-40`) so sibling cards visibly shuffle around it during within-lane reorder.
- The `DndContext` surface (`BoardDndProvider` in [`src/components/ideas/board-dnd.tsx`](../../src/components/ideas/board-dnd.tsx)) exposes the `useCardSortable` hook that each card `<li>` spreads (ref + listeners + attributes + transform + transition). The `<li>` sets `role="listitem"` **after** the dnd-kit attribute spread to override dnd-kit's default `role="button"` — without this override the card loses its semantic role and `getByRole("listitem")` fails (regression caught + fixed during S3A.1 CI).
- Non-parked card `<li>`s carry `cursor-grab` / `active:cursor-grabbing` as the affordance but **do not** set `user-select: none` — distance activation means a click-without-drag leaves text selection fully native, so cursor positioning, double-click word select, triple-click paragraph select, and Cmd+A all work inside the card. This reverses the Pass-3 CSS shape (see above).

**2. HTML5 `draggable` is banned on card `<li>`s.**

- The card `<li>` does **not** set `draggable="true"` under any condition. Parked, live, any lifecycle — none.
- The S3A.1 Playwright regression guard in [`e2e/dnd.spec.ts`](../../e2e/dnd.spec.ts) asserts `draggable="true"` is never present on a `listitem` and must stay green forever.
- S3A.2 adds a second guard using CDP `Input.dispatchDragEvent` to cover the HTML5-drag-event class directly (the pass-1 defect class): pointer drag must complete **without** any HTML5 `dragstart` being fired.

**3. Keyboard cross-lane DnD ships via the card's `Actions → Move to…` submenu.**

- The ellipsis menu's `Move to…` submenu is the **only** accessible cross-lane surface we claim to ship. It is keyboard-driven (arrow navigation + Enter), screen-reader-friendly (uses the same legality matrix as pointer DnD), and was the path the S3A.1 e2e test actually exercised.
- The dnd-kit `KeyboardSensor` is **deferred to S3A.3**. Reviving it requires either:
  - a `DragOverlay` with a surface that is not bounded to the source lane, **or**
  - a custom modifier that widens `translate3d` bounds to the whole board.
    Both are solvable. Neither is cheap under the S3A.2 surface-area budget (Initiative Modal + chat wizard + within-lane reorder are already three non-trivial deliverables). S3A.3 owns this revival.
- Until the `KeyboardSensor` is correctly wired, no code claims to ship keyboard DnD via `Space → Arrow → Space`. The cleanup PR that accompanies this ADR deletes the dead sensor + coordinate getter so the claim cannot re-emerge in the audit surface.

## Consequences

**Positive**

- Real-user pointer drag works and feels responsive (distance activation triggers on the first qualifying pointer movement — no perceptible hold), and the regression guards make it impossible to silently re-introduce either the HTML5-preempts-PointerSensor defect or the broken `user-select: none`-over-text-copy tradeoff.
- Within-lane pointer reorder ships as a side-effect of `@dnd-kit/sortable` — originally deferred to S3A.2, now delivered in Pass-4 because the infrastructure needed for the pointer-activation fix is the same infrastructure the S3A.2 reorder scope needed.
- A visual lift (`DragOverlay`) that matches the JIRA reference the user validated against, without the lane/rail scroll containers clipping the drag preview.
- Text inside cards (title, problem preview, brief, notes) remains fully copy-able via click-to-position, double-click word, triple-click paragraph, and Cmd+A.
- The "what keyboard DnD ships" question has a single honest answer — the Actions submenu — rather than a sensor that looks live but isn't. M1 honesty holds.

**Negative / deferred**

- Keyboard users cannot drive a true drag animation cross-lane until S3A.3 resolves the `translate3d` clamping. For S3A.1 + S3A.2 they drive the Actions submenu.
- `@dnd-kit/sortable` adds ~15KB gzipped to the client bundle — accepted because the alternative (manual `useDroppable`-per-slot plumbing) would have cost the same or more in source-line complexity, would have still needed a `DragOverlay`, and would not have given us the shuffle animation for free.
- Click-and-drag to highlight a long run of text (>8px travel) will start a card drag instead of extending the text selection. This is the same trade-off Linear/Trello/Asana make; double-click / triple-click / Cmd+A are the documented alternatives. If user feedback surfaces this as a sharp edge, the follow-up is either a dedicated drag-handle region on the card header or a combined `{ distance, delay }` activation (both a separate ADR).

**Test surface**

- [`pdlc-ui/e2e/dnd.spec.ts`](../../e2e/dnd.spec.ts) holds: the HTML5-`draggable` regression guard; the inverted Pass-4 `user-select` regression guard (non-parked cards MUST allow text selection); the pointer cross-lane transition test; the within-lane reorder test (new in Pass-4); the `Actions → Move to…` keyboard-path test. Any change that re-introduces `draggable="true"` on a `listitem`, disables text selection on a non-parked card, or breaks the distance-activation path fails CI.
- S3A.2 adds a CDP `Input.dispatchDragEvent` e2e that asserts pointer drag completes without a single HTML5 `dragstart`.

**R16 co-change surface (same-PR rule)**

- [`pdlc-ui/src/components/ideas/board-dnd.tsx`](../../src/components/ideas/board-dnd.tsx) — `PointerSensor` with `{ distance: 8 }` activation; `useCardSortable` wraps `@dnd-kit/sortable`'s `useSortable`; top-of-file comment block tracks the Pass-1 → Pass-4 history.
- [`pdlc-ui/src/components/ideas/ideas-board.tsx`](../../src/components/ideas/ideas-board.tsx) — `SortableContext` per lane + per rail; `DragOverlay` at board root; `handleDragEnd` branches over-card vs over-lane.
- [`pdlc-ui/src/components/ideas/initiative-card.tsx`](../../src/components/ideas/initiative-card.tsx) — uses `useCardSortable`; carries the `transform`+`transition` from the sortable hook; no `select-none`.
- [`pdlc-ui/docs/design/board-layout.md`](../design/board-layout.md) §9 — a11y claim reads "cross-lane DnD has a keyboard path via the card's Actions → Move to… submenu"; no `Space + arrows + Enter + Esc` claim.
- [`plans/PDLC_UI/lifecycle-transitions.md`](../../../plans/PDLC_UI/lifecycle-transitions.md) — cross-lane DnD note points at the submenu as the keyboard path.
- [`plans/PDLC_UI/tech-stack.md`](../../../plans/PDLC_UI/tech-stack.md) §3.5 — `@dnd-kit/core` + `@dnd-kit/sortable` (Pass-4).

## Supersession

This ADR stands until keyboard DnD via dnd-kit `KeyboardSensor` actually moves a card cross-lane under real user operation. At that point a successor ADR will record the chosen `DragOverlay` / custom-modifier approach and move this one to "Superseded by ADR-NNNN". Until then, any code change that re-introduces a `KeyboardSensor` without the accompanying modifier is a regression against this ADR.
