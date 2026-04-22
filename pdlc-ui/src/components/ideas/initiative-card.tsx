"use client";

import { useMemo, useState, type KeyboardEvent } from "react";
import { CSS } from "@dnd-kit/utilities";
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
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RichTextRenderer } from "@/components/rich-text/rich-text-renderer";
import { canTransition, type CanTransitionResult } from "@/lib/can-transition";
import type { Initiative, Lifecycle } from "@/schema/initiative";
import { LANE_LABELS, LIFECYCLE_ORDER, NON_PARKED_LANES } from "./lanes";
import { useCardSortable } from "./board-dnd";

export type MoveTarget = Exclude<Lifecycle, "parked">;

export type InitiativeCardProps = {
  initiative: Initiative;
  hasBrief: boolean;
  canReorderUp?: boolean;
  canReorderDown?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onTransition: (to: Lifecycle) => void;
  onRequestPark: () => void;
  onReorderUp?: () => void;
  onReorderDown?: () => void;
  /** When set, `idea → discovery` without a completed brief opens the wizard instead of transitioning. */
  onOpenBriefWizard?: () => void;
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
  canReorderUp,
  canReorderDown,
  onEdit,
  onDelete,
  onTransition,
  onRequestPark,
  onReorderUp,
  onReorderDown,
  onOpenBriefWizard,
}: InitiativeCardProps) {
  const hasBody = initiative.body.trim().length > 0;
  const isParked = initiative.lifecycle === "parked";
  const briefComplete = initiative.brief?.complete === true;
  const showBriefPanel =
    briefComplete &&
    (initiative.lifecycle === "discovery" ||
      initiative.lifecycle === "design" ||
      initiative.lifecycle === "spec_ready" ||
      initiative.lifecycle === "develop" ||
      initiative.lifecycle === "uat" ||
      initiative.lifecycle === "deployed" ||
      initiative.lifecycle === "parked");

  // S3A.1 card preview: when the brief is complete, surface a one-line
  // truncated `problem.value` so the lane can be scanned at a glance.
  // The full BriefPanel `<details>` accordion still renders below.
  const problemPreview = briefComplete
    ? plainFromHtml(initiative.brief?.problem?.value ?? "")
    : "";

  const [briefOpen, setBriefOpen] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // DnD plumbing (S3A.1 Pass-4) — `@dnd-kit/sortable` drives both cross-lane
  // and within-lane drag. The `BoardDndProvider` in `board-dnd.tsx` uses
  // distance-based activation (8px) — the same activation mode Linear,
  // Trello and Asana use. dnd-kit only claims the gesture once the
  // pointer has moved ≥8px; anything under that goes to the browser as a
  // click, which keeps cursor positioning / double-click / triple-click /
  // Cmd+A text selection fully native. See `board-dnd.tsx` header + ADR-0003.
  //
  // `user-select: none` is NOT set on the card — text inside the card
  // (title, problem preview, brief) is copy-able. The `cursor-grab` /
  // `active:cursor-grabbing` affordance stays so users can see the card
  // is draggable.
  //
  // Visual lift (JIRA-style) — `transform`+`transition` values returned by
  // `useSortable` drive both the source-card displacement while sibling
  // cards shuffle around during within-lane reorder, AND the source card's
  // shadow/translate while it's being held. The actual overlay card that
  // follows the cursor during a cross-lane drag is rendered at the board
  // root via `<DragOverlay>` in `ideas-board.tsx`.
  //
  // Keyboard cross-lane still ships via the `Actions → Move to…` submenu
  // (ADR-0003 §3). `Alt+↑/↓` keyboard reorder remains the keyboard
  // within-lane path.
  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
    transform,
    transition,
  } = useCardSortable({
    initiativeId: initiative.id,
    fromLifecycle: initiative.lifecycle,
    disabled: isParked,
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const moveTargets = useMemo(() => {
    const from = initiative.lifecycle;
    return LIFECYCLE_ORDER.filter((lane) => lane !== from).map((lane) => {
      if (from === "idea" && lane === "discovery" && !hasBrief) {
        return {
          lane,
          label: LANE_LABELS[lane],
          ok: true,
          message: undefined as string | undefined,
        };
      }
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
      ref={setNodeRef}
      {...(!isParked ? attributes : {})}
      {...(!isParked ? listeners : {})}
      role="listitem"
      data-initiative-id={initiative.id}
      data-initiative-handle={initiative.handle}
      data-lifecycle={initiative.lifecycle}
      tabIndex={0}
      aria-label={`${initiative.handle} ${initiative.title}`}
      className={cn(
        "group/initiative relative rounded-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        !isParked && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-40",
      )}
      style={{ paddingBlock: "var(--card-py)", ...dragStyle }}
      onKeyDown={handleKeyDown}
    >
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
                              } else if (
                                initiative.lifecycle === "idea" &&
                                target.lane === "discovery" &&
                                !hasBrief
                              ) {
                                onOpenBriefWizard?.();
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
        {problemPreview ? (
          <CardContent className="px-3 pb-1 text-xs">
            <p
              className="line-clamp-1 text-muted-foreground"
              data-testid="card-problem-preview"
              title={problemPreview}
            >
              <span className="font-medium text-foreground">Problem: </span>
              {truncate(problemPreview, 80)}
            </p>
          </CardContent>
        ) : null}
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
        {showBriefPanel && (
          <BriefPanel
            initiative={initiative}
            open={briefOpen}
            onOpenChange={setBriefOpen}
            exportFeedback={exportFeedback}
            onExportFeedback={setExportFeedback}
          />
        )}
      </Card>
    </li>
  );
}

function plainFromHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

function buildCursorExportPrompt(initiative: Initiative): string {
  const b = initiative.brief;
  const discovery = initiative.discovery as {
    openQuestions?: Array<{ text?: string }>;
  };
  const oq = Array.isArray(discovery.openQuestions)
    ? discovery.openQuestions
    : [];
  let s = `# ${initiative.handle} — ${initiative.title}\n\n`;
  s +=
    "Paste into Cursor for /agent-prd or planning. Source: PDLC board brief.\n\n";
  if (b.problem?.value)
    s += `## Problem\n${plainFromHtml(b.problem.value)}\n\n`;
  if (b.targetUsers?.value)
    s += `## Target users\n${plainFromHtml(b.targetUsers.value)}\n\n`;
  if (b.coreValue?.value)
    s += `## Core value\n${plainFromHtml(b.coreValue.value)}\n\n`;
  if (b.successDefinition?.value)
    s += `## Success definition\n${plainFromHtml(b.successDefinition.value)}\n\n`;
  if (b.scopeIn?.value?.length)
    s += `## Scope in\n${b.scopeIn.value.map((x) => `- ${x}`).join("\n")}\n\n`;
  if (b.scopeOut?.value?.length)
    s += `## Scope out\n${b.scopeOut.value.map((x) => `- ${x}`).join("\n")}\n\n`;
  if (b.assumptions?.length) {
    s += "## Assumptions\n";
    for (const a of b.assumptions) {
      s += `- ${a.text}\n`;
    }
    s += "\n";
  }
  if (b.constraints?.value && plainFromHtml(b.constraints.value))
    s += `## Constraints\n${plainFromHtml(b.constraints.value)}\n\n`;
  if (
    b.understandingSummary?.value &&
    plainFromHtml(b.understandingSummary.value)
  ) {
    s += `## Understanding summary\n${plainFromHtml(b.understandingSummary.value)}\n\n`;
  }
  if (oq.length) {
    s += "## Open questions (discovery)\n";
    for (const q of oq) {
      if (q.text?.trim()) s += `- ${q.text.trim()}\n`;
    }
  }
  return s.trim();
}

function BriefPanel({
  initiative,
  open,
  onOpenChange,
  exportFeedback,
  onExportFeedback,
}: {
  initiative: Initiative;
  open: boolean;
  onOpenChange: (next: boolean) => void;
  exportFeedback: string | null;
  onExportFeedback: (msg: string | null) => void;
}) {
  const brief = initiative.brief;
  const lastSkillRun = useMemo(() => {
    for (let i = initiative.events.length - 1; i >= 0; i--) {
      const e = initiative.events[i];
      if (e.kind === "skill_run" && e.payload.skill === "pdlc-brief-custom") {
        return e;
      }
    }
    return null;
  }, [initiative.events]);

  async function handleExport() {
    try {
      await navigator.clipboard.writeText(buildCursorExportPrompt(initiative));
      onExportFeedback("Copied to clipboard.");
      setTimeout(() => onExportFeedback(null), 2500);
    } catch {
      onExportFeedback("Clipboard failed — select and copy manually.");
    }
  }

  return (
    <CardContent className="border-t border-border px-3 py-2">
      <details
        open={open}
        onToggle={(e) => onOpenChange((e.target as HTMLDetailsElement).open)}
        className="group/brief"
      >
        <summary className="cursor-pointer list-none text-xs font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-1">
            Brief
            <span className="text-[10px] font-normal text-muted-foreground">
              ({open ? "hide" : "show"})
            </span>
          </span>
        </summary>
        <div className="mt-3 flex flex-col gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => void handleExport()}
            >
              Export for Cursor
            </Button>
            {exportFeedback ? (
              <span className="text-[11px] text-muted-foreground" role="status">
                {exportFeedback}
              </span>
            ) : null}
          </div>
          <BriefField label="Problem" html={brief.problem?.value ?? ""} />
          <BriefField
            label="Target users"
            html={brief.targetUsers?.value ?? ""}
          />
          <BriefField label="Core value" html={brief.coreValue?.value ?? ""} />
          <BriefField
            label="Success definition"
            html={brief.successDefinition?.value ?? ""}
          />
          {brief.scopeIn?.value?.length ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Scope in</p>
              <ul className="list-inside list-disc text-muted-foreground">
                {brief.scopeIn.value.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {brief.scopeOut?.value?.length ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Scope out</p>
              <ul className="list-inside list-disc text-muted-foreground">
                {brief.scopeOut.value.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {brief.assumptions?.length ? (
            <div>
              <p className="mb-1 font-medium text-foreground">Assumptions</p>
              <ul className="list-inside list-disc text-muted-foreground">
                {brief.assumptions.map((a) => (
                  <li key={a.text}>{a.text}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <BriefField
            label="Constraints"
            html={brief.constraints?.value ?? ""}
          />
          <BriefField
            label="Understanding summary"
            html={brief.understandingSummary?.value ?? ""}
          />
          {lastSkillRun && lastSkillRun.kind === "skill_run" ? (
            <p className="border-t border-border pt-2 text-[10px] text-muted-foreground">
              Last{" "}
              <code className="rounded bg-muted px-1">pdlc-brief-custom</code>{" "}
              run: iteration {lastSkillRun.payload.iteration} at{" "}
              {lastSkillRun.at}
            </p>
          ) : null}
        </div>
      </details>
    </CardContent>
  );
}

function BriefField({ label, html }: { label: string; html: string }) {
  if (!plainFromHtml(html)) return null;
  return (
    <div className="flex flex-col gap-1">
      <p className="font-medium text-foreground">{label}</p>
      <div className="text-muted-foreground">
        <RichTextRenderer html={html} />
      </div>
    </div>
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
