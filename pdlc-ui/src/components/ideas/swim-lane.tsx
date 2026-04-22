"use client";

import type { ReactNode } from "react";
import type { Lifecycle } from "@/schema/initiative";
import { cn } from "@/lib/utils";
import { useLaneDroppable } from "./board-dnd";
import { LANE_DESCRIPTIONS, LANE_LABELS } from "./lanes";

export type SwimLaneDropState = "idle" | "legal" | "illegal";

export type SwimLaneProps = {
  lifecycle: Lifecycle;
  count: number;
  children: ReactNode;
  /** Rendered when `count === 0`. */
  emptyHint?: ReactNode;
  /** Cross-lane drop highlight — driven by the parent's dragOver gate. */
  dropState?: SwimLaneDropState;
  /** Tooltip shown on illegal cross-lane targets while a drag is in flight. */
  illegalReason?: string | null;
};

export function SwimLane({
  lifecycle,
  count,
  children,
  emptyHint,
  dropState = "idle",
  illegalReason,
}: SwimLaneProps) {
  const label = LANE_LABELS[lifecycle];
  const hint = LANE_DESCRIPTIONS[lifecycle];
  const { setNodeRef, isOver } = useLaneDroppable(lifecycle);

  return (
    <section
      ref={setNodeRef}
      aria-labelledby={`lane-${lifecycle}-heading`}
      data-lane={lifecycle}
      data-drop-state={dropState}
      title={dropState === "illegal" ? (illegalReason ?? undefined) : undefined}
      className={cn(
        "flex h-full min-w-0 flex-col gap-3 rounded-lg border border-border bg-card p-3 transition-opacity",
        dropState === "illegal" && "opacity-50",
        dropState === "legal" && isOver && "ring-2 ring-primary ring-offset-1",
      )}
    >
      <header className="sticky top-0 z-10 flex flex-col gap-1 bg-card pb-1">
        <div className="flex items-center justify-between gap-2">
          <h3
            id={`lane-${lifecycle}-heading`}
            className="text-sm font-semibold tracking-tight"
          >
            {label}
          </h3>
          <span
            aria-label={`${count} ${count === 1 ? "card" : "cards"}`}
            className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
          >
            {count}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground">{hint}</p>
      </header>
      <ul
        aria-label={`${label} initiatives`}
        className="flex min-h-16 flex-col"
        style={{ gap: "var(--card-gap)" }}
      >
        {count === 0 ? (
          <li className="rounded-md border border-dashed border-border px-2 py-6 text-center text-[11px] text-muted-foreground">
            {emptyHint ?? "No initiatives"}
          </li>
        ) : (
          children
        )}
      </ul>
    </section>
  );
}
