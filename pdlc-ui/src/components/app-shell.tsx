"use client";

import { Badge } from "@/components/ui/badge";
import { IdeasBoard } from "@/components/ideas/ideas-board";

/**
 * Chrome-light board shell — `pdlc-ui/docs/design/board-layout.md` §1.
 *
 * The board route now collapses the global app shell to a sticky 48px
 * header and lets the board itself become the scroll container
 * (`height: calc(100vh - var(--board-header-height))`). Header copy
 * was refreshed for S3A.1 (M2): the legacy "Sprint 2 — swim lanes"
 * badge is replaced with one that reflects the shipped reality of this
 * sprint (brief shrink + cross-lane DnD + chrome-light shell).
 *
 * The footer is intentionally NOT rendered on the board route per the
 * board-layout spec; build/health metadata still ships at `/api/health`.
 */

export function AppShell() {
  return (
    <div
      className="flex flex-col bg-background text-foreground"
      style={{ minHeight: "100vh" }}
    >
      <header
        className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur"
        style={{ height: "var(--board-header-height)" }}
      >
        <div
          className="flex h-full w-full items-center gap-3"
          style={{ paddingInline: "var(--board-gutter-x)" }}
        >
          <h1 className="text-base font-semibold tracking-tight">
            PDLC Orchestration
          </h1>
          <Badge variant="secondary" className="text-[10px] font-medium">
            Sprint 3A.1 — brief + DnD
          </Badge>
          <div
            id="board-shell-actions"
            className="ml-auto flex items-center gap-2"
          />
        </div>
      </header>

      <main
        aria-label="Board workspace"
        className="flex-1"
        style={{ height: "calc(100vh - var(--board-header-height))" }}
      >
        <IdeasBoard />
      </main>
    </div>
  );
}
