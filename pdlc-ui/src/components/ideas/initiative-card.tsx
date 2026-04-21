"use client";

import { useMemo, type KeyboardEvent } from "react";
import {
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  GripVertical,
  MoreHorizontal,
  Pause,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RichTextRenderer } from "@/components/rich-text/rich-text-renderer";
import { canTransition, type CanTransitionResult } from "@/lib/can-transition";
import type { Initiative, Lifecycle } from "@/schema/initiative";
import { LANE_LABELS, LIFECYCLE_ORDER, NON_PARKED_LANES } from "./lanes";

export type MoveTarget = Exclude<Lifecycle, "parked">;

export type InitiativeCardProps = {
  initiative: Initiative;
  hasBrief: boolean;
  dragging?: boolean;
  dropIndicator?: "above" | "below" | null;
  canReorderUp?: boolean;
  canReorderDown?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTransition: (to: Lifecycle) => void;
  onRequestPark: () => void;
  onReorderUp?: () => void;
  onReorderDown?: () => void;
  onDragStart?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDragEnd?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLLIElement>) => void;
  onDragLeave?: () => void;
};

/**
 * Derives the transition gate for a target lane from the pure `canTransition`.
 * We pass a valid parked stub so the menu can distinguish `brief_required`
 * (S3 gate) from `parked_requires_intent_and_reason` (modal opens) and render
 * accurate tooltips. The real validation still happens in the repository.
 */
function gateFor(
  from: Lifecycle,
  to: Lifecycle,
  hasBrief: boolean,
): CanTransitionResult {
  return canTransition(from, to, {
    hasBrief,
    // Satisfy the parked branch so we only surface non-parked reasons here.
    parkedIntent: "revisit",
    parkedReason: "placeholder",
  });
}

export function InitiativeCard({
  initiative,
  hasBrief,
  dragging,
  dropIndicator,
  canReorderUp,
  canReorderDown,
  onEdit,
  onDelete,
  onTransition,
  onRequestPark,
  onReorderUp,
  onReorderDown,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDragLeave,
}: InitiativeCardProps) {
  const hasBody = initiative.body.trim().length > 0;
  const isParked = initiative.lifecycle === "parked";

  const moveTargets = useMemo(() => {
    const from = initiative.lifecycle;
    return LIFECYCLE_ORDER.filter((lane) => lane !== from).map((lane) => {
      if (lane === "parked") {
        return {
          lane,
          label: LANE_LABELS[lane],
          ok: canTransition(from, "parked", {
            hasBrief,
            parkedIntent: "revisit",
            parkedReason: "__menu",
          }).ok,
          // Parking always goes through the modal when clicked, so we don't
          // compute a tooltip message here — "ok" means "modal can open".
          message: undefined as string | undefined,
        };
      }
      const result = gateFor(from, lane, hasBrief);
      return {
        lane,
        label: LANE_LABELS[lane],
        ok: result.ok,
        message: result.ok ? undefined : result.message,
      };
    });
  }, [initiative.lifecycle, hasBrief]);

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.altKey && event.key === "ArrowUp" && canReorderUp) {
      event.preventDefault();
      onReorderUp?.();
    }
    if (event.altKey && event.key === "ArrowDown" && canReorderDown) {
      event.preventDefault();
      onReorderDown?.();
    }
  }

  return (
    <li
      data-initiative-id={initiative.id}
      data-initiative-handle={initiative.handle}
      data-lifecycle={initiative.lifecycle}
      draggable={!isParked}
      tabIndex={0}
      aria-label={`${initiative.handle} ${initiative.title}`}
      className={cn(
        "group/initiative relative rounded-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        dragging && "opacity-60",
      )}
      onKeyDown={handleKeyDown}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={onDragLeave}
    >
      {dropIndicator === "above" && <DropIndicator position="above" />}
      <Card className="py-3 gap-2">
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 px-3">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-mono text-[10px]">
                {initiative.handle}
              </Badge>
              {isParked && initiative.parkedIntent && (
                <Badge variant="outline" className="text-[10px]">
                  {initiative.parkedIntent === "revisit"
                    ? "Revisit"
                    : "Won't consider"}
                </Badge>
              )}
              <span className="text-[10px] text-muted-foreground">
                rev {initiative.revision}
              </span>
            </div>
            <CardTitle className="truncate text-sm">
              {initiative.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {!isParked && (
              <span
                aria-hidden
                className="hidden cursor-grab text-muted-foreground group-hover/initiative:inline-block group-focus-visible/initiative:inline-block"
              >
                <GripVertical className="size-4" />
              </span>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label={`Actions for ${initiative.handle}`}
                title="Actions"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "h-7 w-7 p-0",
                )}
              >
                <MoreHorizontal className="size-4" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                {!isParked && (canReorderUp || canReorderDown) && (
                  <>
                    <DropdownMenuSeparator />
                    {canReorderUp && onReorderUp && (
                      <DropdownMenuItem onClick={onReorderUp}>
                        <ArrowUp className="size-4" aria-hidden /> Move up
                      </DropdownMenuItem>
                    )}
                    {canReorderDown && onReorderDown && (
                      <DropdownMenuItem onClick={onReorderDown}>
                        <ArrowDown className="size-4" aria-hidden /> Move down
                      </DropdownMenuItem>
                    )}
                  </>
                )}
                <DropdownMenuSeparator />
                {isParked ? (
                  <DropdownMenuItem onClick={() => onTransition("idea")}>
                    <ArchiveRestore className="size-4" aria-hidden /> Un-park →
                    Idea
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>Move to…</DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {moveTargets.map((target) => (
                          <MoveMenuItem
                            key={target.lane}
                            label={target.label}
                            disabled={!target.ok}
                            message={target.message}
                            onSelect={() => {
                              if (!target.ok) return;
                              if (target.lane === "parked") {
                                onRequestPark();
                              } else {
                                onTransition(target.lane);
                              }
                            }}
                          />
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuItem
                      onClick={onRequestPark}
                      disabled={!NON_PARKED_LANES.has(initiative.lifecycle)}
                    >
                      <Pause className="size-4" aria-hidden /> Park…
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-destructive data-[variant=destructive]:text-destructive"
                >
                  Delete…
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        {hasBody && (
          <CardContent className="px-3 pb-2 text-xs">
            <RichTextRenderer html={initiative.body} />
          </CardContent>
        )}
        {isParked && initiative.parkedReason && (
          <CardContent className="px-3 pb-2 pt-0 text-[11px] text-muted-foreground">
            <span className="font-medium">Reason:</span>{" "}
            {initiative.parkedReason}
          </CardContent>
        )}
      </Card>
      {dropIndicator === "below" && <DropIndicator position="below" />}
    </li>
  );
}

function MoveMenuItem({
  label,
  disabled,
  message,
  onSelect,
}: {
  label: string;
  disabled: boolean;
  message?: string;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      disabled={disabled}
      title={disabled ? message : undefined}
      onClick={disabled ? undefined : onSelect}
      data-testid={`move-target-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </DropdownMenuItem>
  );
}

function DropIndicator({ position }: { position: "above" | "below" }) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute left-0 right-0 h-0.5 bg-primary",
        position === "above" ? "-top-1" : "-bottom-1",
      )}
    />
  );
}
