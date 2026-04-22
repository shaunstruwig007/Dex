# ADR 0003 — DnD shape (`@dnd-kit/core` only) + HTML5 `draggable` ban + keyboard sensor deferred

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

**Pass-3 defect (2026-04-22, post-cleanup, discovered via a user-recorded `dnd.mov`):** the pointer drag that Pass-2 "fixed" was still dead under real-user operation. During the first ≤6px of a slow drag, the browser was free to start a native **text selection** across the card's text nodes — dnd-kit's `PointerSensor` only calls `preventDefault` _after_ the activation constraint is crossed. Once selection started, subsequent `pointermove` events were consumed by the selection-extension engine and dnd-kit never activated. Playwright's `page.mouse.move` generates pointer events faster than a human and doesn't kick off native text selection, so the pointer e2e happily passed while the feature was broken for any real drag ≤ ~200 ms. The fix — applied in this pass — is the canonical dnd-kit idiom: **`user-select: none` on the draggable surface** (non-parked card `<li>`) plus a visible `cursor-grab`/`active:cursor-grabbing` affordance. Text selection is re-enabled via `select-text` inside the opened Brief `<details>` so brief text is still copy-able. A CSS invariant regression guard was added to `e2e/dnd.spec.ts` (computed `user-select: none` on a freshly-created card).

## Decision

**1. `@dnd-kit/core` owns all pointer drag.**

- `@dnd-kit/core` only. **`@dnd-kit/sortable` is not installed** and will not be installed without a follow-up ADR. Within-lane pointer reorder (deferred to S3A.2) is built from `useDroppable` per slot + `useDraggable` on the grip handle + `computeMidpointSortOrder` from the S2 `initiative-card.reorder` helpers — not `@dnd-kit/sortable`.
- `PointerSensor` activation constraint = `{ distance: 6 }` so a click on the card still registers as a click.
- The `DndContext` surface (`BoardDndProvider` in [`src/components/ideas/board-dnd.tsx`](../../src/components/ideas/board-dnd.tsx)) exposes the ref + listeners + attributes that the card `<li>` spreads. The `<li>` sets `role="listitem"` **after** the dnd-kit attribute spread to override dnd-kit's default `role="button"` — without this override the card loses its semantic role and `getByRole("listitem")` fails (regression caught + fixed during S3A.1 CI).
- Non-parked card `<li>`s carry `user-select: none` (Tailwind `select-none`) so a real-user slow drag cannot lose its first ≤6px pointermoves to a native text-selection gesture before dnd-kit crosses its activation distance (Pass-3 defect, above). `cursor-grab` / `active:cursor-grabbing` signal the affordance. Text selection is re-enabled with `select-text` inside the opened Brief `<details>` so brief text remains copy-able.

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

- Real-user pointer drag works, and the regression guard makes it impossible to silently re-introduce the HTML5-preempts-PointerSensor defect.
- The "what keyboard DnD ships" question has a single honest answer — the Actions submenu — rather than a sensor that looks live but isn't. M1 honesty holds.
- Within-lane reorder can be restored in S3A.2 using dnd-kit primitives without conflicting with cross-lane drag, because both share a single dnd-kit `DndContext` and dispatch on `DragData.kind`.

**Negative / deferred**

- Keyboard users cannot drive a true drag animation cross-lane until S3A.3 resolves the `translate3d` clamping. For S3A.1 + S3A.2 they drive the Actions submenu.
- The within-lane reorder feature is absent on main between S3A.1 merge and S3A.2 ship. It was HTML5-based in S2 and was taken out with the `draggable` ban. The S2 `POST /api/initiatives/[id]/reorder` endpoint stays in place and unchanged — only the UI path is temporarily missing.
- `@dnd-kit/sortable` uninstalled means within-lane reorder is manually composed. If future work needs multi-axis sortable lists (e.g. drag-to-reorder inside a scrollable tab inside the Initiative Modal), a separate ADR will evaluate installing it then.

**Test surface**

- [`pdlc-ui/e2e/dnd.spec.ts`](../../e2e/dnd.spec.ts) holds the HTML5-`draggable` regression guard and the `Actions → Move to…` keyboard-path test. Any change that re-introduces `draggable="true"` on a `listitem` fails CI.
- S3A.2 adds a CDP `Input.dispatchDragEvent` e2e that asserts pointer drag completes without a single HTML5 `dragstart`.

**R16 co-change surface (same-PR rule)**

- [`pdlc-ui/src/components/ideas/board-dnd.tsx`](../../src/components/ideas/board-dnd.tsx) — no `KeyboardSensor`; only `PointerSensor`; comments at top-of-file + on `useCardDraggable` reflect this ADR.
- [`pdlc-ui/docs/design/board-layout.md`](../design/board-layout.md) §9 — a11y claim reads "cross-lane DnD has a keyboard path via the card's Actions → Move to… submenu"; no `Space + arrows + Enter + Esc` claim.
- [`plans/PDLC_UI/lifecycle-transitions.md`](../../../plans/PDLC_UI/lifecycle-transitions.md) — cross-lane DnD note points at the submenu as the keyboard path.
- [`plans/PDLC_UI/tech-stack.md`](../../../plans/PDLC_UI/tech-stack.md) §3.5 — `@dnd-kit/core`-only, sortable not installed.

## Supersession

This ADR stands until keyboard DnD via dnd-kit `KeyboardSensor` actually moves a card cross-lane under real user operation. At that point a successor ADR will record the chosen `DragOverlay` / custom-modifier approach and move this one to "Superseded by ADR-NNNN". Until then, any code change that re-introduces a `KeyboardSensor` without the accompanying modifier is a regression against this ADR.
