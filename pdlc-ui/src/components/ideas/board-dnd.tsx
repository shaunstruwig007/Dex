"use client";

import {
  DndContext,
  KeyboardCode,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DndContextProps,
  type KeyboardCoordinateGetter,
} from "@dnd-kit/core";
import type { ReactNode, RefObject } from "react";
import type { Lifecycle } from "@/schema/initiative";
import { LIFECYCLE_ORDER } from "./lanes";

/**
 * Board DnD plumbing — `@dnd-kit/core` only (Q-alt.1, S3A.1 plan).
 *
 * `@dnd-kit/sortable` is intentionally NOT installed: within-lane reorder
 * keeps its existing pointer + `Alt+↑/↓` keyboard fallback (initiative-card)
 * so the only thing this DnD layer adds is **cross-lane** moves (the menu's
 * "Move to…" path made interactive). See [tech-stack.md §3.5] note.
 *
 * Keyboard coordinate getter is hand-rolled: arrow keys snap to the next
 * lane in the canonical lifecycle order so a screen-reader user can drive
 * the same legality matrix that the menu's submenu surfaces.
 */

const KEY_LANE_STEP = 320;

const laneKeyboardCoordinateGetter: KeyboardCoordinateGetter = (
  event,
  { currentCoordinates },
) => {
  switch (event.code) {
    case KeyboardCode.Right:
      return {
        x: currentCoordinates.x + KEY_LANE_STEP,
        y: currentCoordinates.y,
      };
    case KeyboardCode.Left:
      return {
        x: currentCoordinates.x - KEY_LANE_STEP,
        y: currentCoordinates.y,
      };
    case KeyboardCode.Down:
      return {
        x: currentCoordinates.x,
        y: currentCoordinates.y + 24,
      };
    case KeyboardCode.Up:
      return {
        x: currentCoordinates.x,
        y: currentCoordinates.y - 24,
      };
    default:
      return undefined;
  }
};

export function BoardDndProvider({
  children,
  ...props
}: DndContextProps & { children: ReactNode }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Avoid hijacking interactions on dropdown menus / buttons inside cards.
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: laneKeyboardCoordinateGetter,
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
 * Draggable card wrapper — exposes the dnd-kit ref + listeners so the
 * existing `<InitiativeCard>` LI keeps its native HTML drag handlers for
 * within-lane reorder while we wire dnd-kit for cross-lane moves on top.
 *
 * The two systems do not collide: native HTMl5 drag is the within-lane
 * reorder mechanism; dnd-kit owns the keyboard sensor + the cross-lane
 * pointer drag (with a 6px activation distance so a click on the card
 * still registers as a click).
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
