"use client";

import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DndContextProps,
} from "@dnd-kit/core";
import type { ReactNode, RefObject } from "react";
import type { Lifecycle } from "@/schema/initiative";
import { LIFECYCLE_ORDER } from "./lanes";

/**
 * Board DnD plumbing — `@dnd-kit/core` only (Q-alt.1, S3A.1 plan).
 *
 * `@dnd-kit/sortable` is intentionally NOT installed. Cross-lane moves are the
 * only flow this DnD layer handles today: pointer drag via `PointerSensor`
 * (6px activation so card clicks still register), with the card menu's
 * "Actions → Move to…" submenu as the shipped keyboard path.
 *
 * Keyboard DnD deferred (M1 honesty): a dnd-kit `KeyboardSensor` with a
 * hand-rolled lane-step coordinate getter shipped in S3A.1 pass-1 but could
 * not actually move a card — the default modifiers clamp `translate3d` to the
 * source lane's bounds, so Space → Arrow → Space dropped back into origin.
 * Fixing it requires either a `DragOverlay` with an unbounded surface or a
 * custom modifier that widens the bounds to the board. Neither is in S3A.2
 * scope — tracked as an S3A.3 carry-over. Until then, the submenu IS the
 * keyboard cross-lane path and the only one we claim to ship. See ADR-0003.
 *
 * Within-lane pointer reorder is also deferred to S3A.2 (restored via
 * `useDroppable` per slot + grip-handle `useDraggable`) — HTML5 `draggable`
 * is banned on card `<li>`s (ADR-0003, regression guard in `e2e/dnd.spec.ts`).
 */

export function BoardDndProvider({
  children,
  ...props
}: DndContextProps & { children: ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Avoid hijacking interactions on dropdown menus / buttons inside cards.
      activationConstraint: { distance: 6 },
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
 * Draggable card wrapper — exposes the dnd-kit ref + listeners + attributes
 * that `<InitiativeCard>` spreads onto its `<li>`. Cross-lane pointer drag
 * is the ONLY flow this hook owns; within-lane reorder is deferred to
 * S3A.2 (see top-of-file comment and ADR-0003).
 */
export function useCardDraggable(args: {
  initiativeId: string;
  fromLifecycle: Lifecycle;
  disabled?: boolean;
}) {
  const data: DragData = {
    initiativeId: args.initiativeId,
    fromLifecycle: args.fromLifecycle,
  };
  return useDraggable({
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
