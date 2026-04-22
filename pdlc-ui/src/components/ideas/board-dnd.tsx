"use client";

import {
  DndContext,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
  type DndContextProps,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import type { ReactNode, RefObject } from "react";
import type { Lifecycle } from "@/schema/initiative";
import { LIFECYCLE_ORDER } from "./lanes";

/**
 * Board DnD plumbing — `@dnd-kit/core` + `@dnd-kit/sortable`
 * ---------------------------------------------------------
 *
 * History (S3A.1):
 *
 * - Pass-1 shipped `@dnd-kit/core` + HTML5 `draggable` on the card `<li>`.
 *   HTML5 `dragstart` preempted dnd-kit's `PointerSensor` so real-user drag
 *   never activated. Playwright's synthetic pointer events don't dispatch
 *   HTML5 drag*, so the e2e stayed green.
 *
 * - Pass-2 banned HTML5 `draggable` on card `<li>`s (regression guard in
 *   `e2e/dnd.spec.ts`) and kept `{ distance: 6 }` activation on the
 *   PointerSensor. This unblocked the synthetic pointer e2e but not real
 *   users — the first ≤6px of pointermove let the browser start a native
 *   text-selection gesture which consumed subsequent events.
 *
 * - Pass-3 added `user-select: none` on the card `<li>`. That killed user
 *   text-copy on the card (complaint) AND still didn't activate real-user
 *   drag (server log confirmed zero `POST /api/initiatives/:id/transition`
 *   during a 54-second user recording).
 *
 * - Pass-4 first tried delay-based activation (120ms) with sortable +
 *   DragOverlay. Delay activation is finicky with synthetic pointer events
 *   (e2e) and, more importantly, felt sluggish to real users — a 120ms
 *   hold before the card "takes" is perceptibly slower than JIRA/Linear.
 *
 * - Pass-4 FINAL: switched to **distance-based activation** on the
 *   PointerSensor, identical to how Trello / Linear / Asana kanban boards
 *   behave. dnd-kit activates after the pointer has moved `distance` px
 *   while a mousedown is held. Any movement under `distance` is handed
 *   back to the browser as a normal click — which keeps double-click
 *   word-select, triple-click paragraph-select, and keyboard shortcuts
 *   (Cmd+A, Shift+arrows) working inside the card. It also means the
 *   pointer drag activates *immediately* on the first qualifying move,
 *   giving the JIRA-like responsive feel the user asked for in their
 *   reference video.
 *
 *   Trade-off: click-and-drag to select a long run of text (>`distance` px)
 *   will start a card drag instead. The workarounds are standard:
 *     - Double-click a word to select it (no drag)
 *     - Triple-click for a paragraph (no drag)
 *     - Cmd+A to select all then copy
 *   Same trade-off every production kanban board makes.
 *
 *   Sortable + DragOverlay + no `select-none` on the card are all kept
 *   from the earlier attempts: the sortable context gives us within-lane
 *   reorder for free (side-effect: S3A.2 scope note at top of
 *   `ideas-board.tsx`'s `handleDragEnd`), and DragOverlay gives the lift
 *   animation that matches JIRA's reference.
 *
 * Keyboard DnD still ships via the card's `Actions → Move to…` submenu.
 * dnd-kit `KeyboardSensor` remains deferred (ADR-0003 §3 — translate3d
 * clamping; S3A.3 owns the revival if needed).
 */

/**
 * Activation threshold for pointer drag. 8px is the sweet spot:
 * - Small enough that the drag feels immediate on both trackpad + mouse.
 * - Large enough that accidental cursor jitter on mousedown doesn't
 *   activate drag (trackpads report ~1-3px of rest noise).
 * This is the same number Linear uses; Trello + Asana sit at 5-10px.
 */
export const POINTER_ACTIVATION_DISTANCE_PX = 8;

export function BoardDndProvider({
  children,
  ...props
}: DndContextProps & { children: ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: POINTER_ACTIVATION_DISTANCE_PX,
      },
    }),
  );

  return (
    <DndContext sensors={sensors} {...props}>
      {children}
    </DndContext>
  );
}

export type DragData = {
  initiativeId: string;
  fromLifecycle: Lifecycle;
};

export type LaneDropData = {
  laneId: Lifecycle | "parked-rail";
};

export function isLaneDropData(value: unknown): value is LaneDropData {
  if (!value || typeof value !== "object") return false;
  const v = value as { laneId?: unknown };
  if (typeof v.laneId !== "string") return false;
  return (
    v.laneId === "parked-rail" ||
    (LIFECYCLE_ORDER as readonly string[]).includes(v.laneId)
  );
}

export function isDragData(value: unknown): value is DragData {
  if (!value || typeof value !== "object") return false;
  const v = value as { initiativeId?: unknown; fromLifecycle?: unknown };
  return (
    typeof v.initiativeId === "string" && typeof v.fromLifecycle === "string"
  );
}

/**
 * Sortable card wrapper — returns the dnd-kit-sortable hook surface that
 * `<InitiativeCard>` spreads onto its `<li>`, plus CSS transform/transition
 * values that drive the shuffle animation during within-lane reorder and
 * the source-slot fade during cross-lane drag.
 *
 * All drop targets (both lanes and other cards) live inside the same
 * `DndContext`, so a single `handleDragEnd` in `IdeasBoard` dispatches on
 * whether the over-target is a sibling card (reorder) or a lane/rail
 * (cross-lane transition). See `ideas-board.tsx`.
 */
export function useCardSortable(args: {
  initiativeId: string;
  fromLifecycle: Lifecycle;
  disabled?: boolean;
}) {
  const data: DragData = {
    initiativeId: args.initiativeId,
    fromLifecycle: args.fromLifecycle,
  };
  return useSortable({
    id: `card-${args.initiativeId}`,
    data,
    disabled: args.disabled,
  });
}

export function useLaneDroppable(
  laneId: Lifecycle | "parked-rail",
  ref?: RefObject<HTMLElement | null>,
) {
  const data: LaneDropData = { laneId };
  const droppable = useDroppable({ id: `lane-${laneId}`, data });
  // The droppable hook already sets a ref on its node; consumers can layer
  // their own ref via the returned `setNodeRef`. The `ref` arg is here to
  // document intent — most consumers will not pass it.
  void ref;
  return droppable;
}
