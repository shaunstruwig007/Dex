"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Right-edge parked rail — `pdlc-ui/docs/design/board-layout.md` §3.
 *
 * Replaces the S2 in-grid parked lane. Two states:
 *   - **collapsed** (40px): vertical "Parked (N)" label + chevron;
 *   - **expanded**  (280px): renders the parked card list (children).
 *
 * The state persists per browser via `localStorage` so the user lands in
 * the same configuration on the next visit. Default = **collapsed** on
 * first visit (board-layout §3 + §10 Q1 default).
 */

const STORAGE_KEY = "pdlc.board.parked-rail";

type RailState = "collapsed" | "expanded";

function readStoredState(): RailState {
  if (typeof window === "undefined") return "collapsed";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === "expanded" ? "expanded" : "collapsed";
  } catch {
    return "collapsed";
  }
}

export function useParkedRail(): {
  state: RailState;
  toggle: () => void;
  setState: (next: RailState) => void;
} {
  const [state, setStateInternal] = useState<RailState>("collapsed");

  useEffect(() => {
    setStateInternal(readStoredState());
  }, []);

  const persist = useCallback((next: RailState) => {
    setStateInternal(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors — UI stays consistent in memory
    }
  }, []);

  const toggle = useCallback(() => {
    setStateInternal((prev) => {
      const next: RailState = prev === "collapsed" ? "expanded" : "collapsed";
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return { state, toggle, setState: persist };
}

export function ParkedRail({
  state,
  onToggle,
  parkedCount,
  children,
}: {
  state: RailState;
  onToggle: () => void;
  parkedCount: number;
  children: ReactNode;
}) {
  const expanded = state === "expanded";
  return (
    <aside
      aria-label="Parked initiatives rail"
      data-state={state}
      className={cn(
        "flex h-full shrink-0 flex-col border-l border-border bg-card transition-[width] duration-200 ease-out",
      )}
      style={{
        width: expanded
          ? "var(--board-rail-expanded)"
          : "var(--board-rail-collapsed)",
      }}
    >
      <header
        className={cn(
          "flex items-center border-b border-border",
          expanded
            ? "h-10 justify-between px-3"
            : "h-full flex-col justify-between gap-2 py-3",
        )}
      >
        {expanded ? (
          <>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Parked
              </h3>
              <span
                aria-label={`${parkedCount} parked initiatives`}
                className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {parkedCount}
              </span>
            </div>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse parked rail"
              data-testid="parked-rail-toggle"
              className="inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Expand parked rail"
              data-testid="parked-rail-toggle"
              className="inline-flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <span
              className="rotate-180 select-none text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
              style={{ writingMode: "vertical-rl" }}
            >
              Parked ({parkedCount})
            </span>
            <span aria-hidden className="size-7" />
          </>
        )}
      </header>
      {expanded ? (
        <div className="flex-1 overflow-y-auto p-3">{children}</div>
      ) : null}
    </aside>
  );
}
