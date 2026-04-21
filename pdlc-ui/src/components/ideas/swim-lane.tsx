"use client";

import type { ReactNode } from "react";
import type { Lifecycle } from "@/schema/initiative";
import { cn } from "@/lib/utils";
import { LANE_DESCRIPTIONS, LANE_LABELS } from "./lanes";

export type SwimLaneProps = {
  lifecycle: Lifecycle;
  count: number;
  children: ReactNode;
  /** Rendered when `count === 0`. */
  emptyHint?: ReactNode;
  /** Drop target for cross-lane DnD is out-of-scope (S2) — we only accept
   *  within-lane drops. Consumers wire onDragOver/onDrop on the <ul> that
   *  hosts the cards; we expose a prop here so layout stays cohesive. */
  onListDragOver?: (event: React.DragEvent<HTMLUListElement>) => void;
  onListDrop?: (event: React.DragEvent<HTMLUListElement>) => void;
};

export function SwimLane({
  lifecycle,
  count,
  children,
  emptyHint,
  onListDragOver,
  onListDrop,
}: SwimLaneProps) {
  const label = LANE_LABELS[lifecycle];
  const hint = LANE_DESCRIPTIONS[lifecycle];
  return (
    <section
      aria-labelledby={`lane-${lifecycle}-heading`}
      data-lane={lifecycle}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-3 rounded-lg border border-border bg-card p-3",
      )}
    >
      <header className="flex flex-col gap-1">
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
        className="flex min-h-16 flex-col gap-2"
        onDragOver={onListDragOver}
        onDrop={onListDrop}
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
