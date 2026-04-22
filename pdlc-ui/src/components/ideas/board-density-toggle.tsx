"use client";

import { Rows2, Rows3, Rows4 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BOARD_DENSITY_VALUES,
  type BoardDensity,
} from "@/lib/use-board-density";

const ICONS: Record<
  BoardDensity,
  React.ComponentType<{ className?: string }>
> = {
  compact: Rows4,
  comfortable: Rows3,
  detailed: Rows2,
};

const LABELS: Record<BoardDensity, string> = {
  compact: "Compact density",
  comfortable: "Comfortable density",
  detailed: "Detailed density",
};

/**
 * Three-state segmented control for card density. Implemented as native
 * `<button>`s so screen readers + keyboard work without extra ARIA. The
 * visual icons mirror the row-height ramp from the board-layout spec.
 */
export function BoardDensityToggle({
  value,
  onChange,
}: {
  value: BoardDensity;
  onChange: (next: BoardDensity) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Card density"
      className="inline-flex items-center rounded-md border border-border bg-background p-0.5"
    >
      {BOARD_DENSITY_VALUES.map((mode) => {
        const Icon = ICONS[mode];
        const active = value === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-label={LABELS[mode]}
            aria-pressed={active}
            title={LABELS[mode]}
            data-testid={`board-density-${mode}`}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "bg-primary/10 text-foreground"
                : "hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </button>
        );
      })}
    </div>
  );
}
