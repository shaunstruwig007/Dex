"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import { RichTextRenderer } from "@/components/rich-text/rich-text-renderer";
import {
  assertRequiredFlagsInContent,
  loadBriefSteps,
  REQUIRED_BRIEF_FIELDS,
  type BriefStep,
} from "@/content/brief-steps";
import {
  validateBriefWizardAnswers,
  type BriefWizardAnswersInput,
} from "@/lib/brief-wizard-validation";
import type { Initiative } from "@/schema/initiative";

/**
 * S3A.1 brief wizard — three required content fields (`coreValue` →
 * `targetUsers` → `problem`) + a summary step. Legacy fields and
 * `openQuestions` are not surfaced. The summary step composites the
 * three answers as read-only chips with click-to-edit jumps; both
 * footer buttons call the same atomic `POST /api/initiatives/:id/brief`
 * endpoint (S3 contract — see slice log) and move the card to discovery.
 *
 * Demo honesty (M1): "Save brief only" and "Save brief & start discovery"
 * are server-identical in S3A.1; the kickoff side-effect lands in S3A.2.
 */

type ContentStep = BriefStep & {
  field: "coreValue" | "targetUsers" | "problem";
};
type SummaryStep = BriefStep & { field: "understandingSummary" };

const REQUIRED_SET = new Set<string>(REQUIRED_BRIEF_FIELDS);

function emptyAnswers(): BriefWizardAnswersInput {
  return {
    problem: "<p></p>",
    targetUsers: "<p></p>",
    coreValue: "<p></p>",
  };
}

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isContentField(
  field: string,
): field is "coreValue" | "targetUsers" | "problem" {
  return (
    field === "coreValue" || field === "targetUsers" || field === "problem"
  );
}

function isDirtyAnswers(a: BriefWizardAnswersInput): boolean {
  return (
    textFromHtml(a.problem).length > 0 ||
    textFromHtml(a.targetUsers).length > 0 ||
    textFromHtml(a.coreValue).length > 0
  );
}

function fieldHasContent(
  a: BriefWizardAnswersInput,
  field: "coreValue" | "targetUsers" | "problem",
): boolean {
  return textFromHtml(a[field]).length > 0;
}

async function fetchInitiative(id: string): Promise<Initiative | null> {
  const res = await fetch(`/api/initiatives/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const json = (await res.json()) as { initiative: Initiative };
  return json.initiative;
}

export function BriefWizardDialog({
  open,
  initiative,
  onOpenChange,
  onCompleted,
}: {
  open: boolean;
  initiative: Initiative | null;
  onOpenChange: (next: boolean) => void;
  onCompleted: (initiative: Initiative) => void;
}) {
  const { contentSteps, summaryStep } = useMemo(() => {
    const file = loadBriefSteps();
    assertRequiredFlagsInContent(file.steps);
    const summary = file.steps.find(
      (s) => s.field === "understandingSummary",
    ) as SummaryStep | undefined;
    const content = file.steps.filter((s) =>
      isContentField(s.field),
    ) as ContentStep[];
    if (content.length !== 3) {
      throw new Error(
        `brief-steps: expected exactly 3 content steps, got ${content.length}`,
      );
    }
    return { contentSteps: content, summaryStep: summary ?? null };
  }, []);

  const totalSteps = contentSteps.length + (summaryStep ? 1 : 0);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<BriefWizardAnswersInput>(emptyAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitMode, setSubmitMode] = useState<
    "save_only" | "save_and_start" | null
  >(null);
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAnswers(emptyAnswers());
      setApiError(null);
      setShowDiscard(false);
      setStepError(null);
      setSubmitMode(null);
    }
  }, [open, initiative?.id]);

  useEffect(() => {
    // Focus the active step's editor when it changes — keeps keyboard
    // navigation snappy and supports click-to-edit jumps from the summary.
    if (!open) return;
    const node = editorRef.current?.querySelector<HTMLElement>(
      "[contenteditable], textarea, input",
    );
    node?.focus();
  }, [open, stepIndex]);

  const isSummary = summaryStep != null && stepIndex === contentSteps.length;
  const currentContent = !isSummary ? contentSteps[stepIndex] : null;

  const requestClose = useCallback(() => {
    if (showDiscard) {
      onOpenChange(false);
      return;
    }
    if (isDirtyAnswers(answers)) {
      setShowDiscard(true);
    } else {
      onOpenChange(false);
    }
  }, [answers, onOpenChange, showDiscard]);

  const goNext = useCallback(() => {
    if (currentContent) {
      if (!fieldHasContent(answers, currentContent.field)) {
        setStepError("This field is required.");
        return;
      }
    }
    setStepError(null);
    if (stepIndex < totalSteps - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [currentContent, answers, stepIndex, totalSteps]);

  const goBack = useCallback(() => {
    setStepError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const jumpToField = useCallback(
    (field: string) => {
      const idx = contentSteps.findIndex((s) => s.field === field);
      if (idx >= 0) setStepIndex(idx);
    },
    [contentSteps],
  );

  const submit = useCallback(
    async (mode: "save_only" | "save_and_start") => {
      const inv = initiative;
      if (!inv) return;
      const missing = validateBriefWizardAnswers(answers);
      if (missing.length > 0) {
        jumpToField(missing[0]!);
        setStepError("Please complete the required fields before saving.");
        setApiError(null);
        return;
      }
      setSubmitting(true);
      setSubmitMode(mode);
      setApiError(null);
      setStepError(null);

      const initiativeId = inv.id;
      const initialRevision = inv.revision;
      // Wizard now ships only the 3 required content fields. Legacy fields and
      // `openQuestions` are intentionally omitted — the server payload schema
      // and `mergeDiscoveryDraftQuestions` tolerate the absence (Q1 option b).
      const body = {
        expectedRevision: initialRevision,
        answers: {
          problem: answers.problem,
          targetUsers: answers.targetUsers,
          coreValue: answers.coreValue,
        },
      };

      async function postOnce(rev: number) {
        return fetch(`/api/initiatives/${initiativeId}/brief`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...body, expectedRevision: rev }),
        });
      }

      try {
        let res = await postOnce(initialRevision);
        let json = (await res.json().catch(() => ({}))) as Record<
          string,
          unknown
        >;

        if (res.status === 409) {
          const latest = await fetchInitiative(initiativeId);
          if (!latest) {
            setApiError("Could not reload the initiative. Try again.");
            return;
          }
          if (latest.brief?.complete === true) {
            setApiError(
              "Someone else completed this brief — please close and re-open.",
            );
            return;
          }
          if (
            latest.lifecycle === "idea" &&
            latest.revision !== initialRevision
          ) {
            res = await postOnce(latest.revision);
            json = (await res.json().catch(() => ({}))) as Record<
              string,
              unknown
            >;
          }
        }

        if (
          res.ok &&
          json &&
          typeof json === "object" &&
          "initiative" in json
        ) {
          onCompleted((json as { initiative: Initiative }).initiative);
          onOpenChange(false);
          return;
        }

        if (res.status === 422) {
          const err = json.error as string | undefined;
          if (err === "missing_required_fields" && Array.isArray(json.fields)) {
            const fields = json.fields as string[];
            if (fields[0]) jumpToField(fields[0]);
            setApiError("Some required fields are still empty.");
            return;
          }
        }

        setApiError(
          typeof json.error === "string"
            ? json.error
            : `Request failed (${res.status})`,
        );
      } finally {
        setSubmitting(false);
        setSubmitMode(null);
      }
    },
    [answers, initiative, jumpToField, onCompleted, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogContent className="max-h-[min(90vh,720px)] max-w-2xl overflow-y-auto">
        {showDiscard ? (
          <DiscardPrompt
            onCancel={() => setShowDiscard(false)}
            onDiscard={() => {
              setShowDiscard(false);
              onOpenChange(false);
            }}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Product brief</DialogTitle>
              <DialogDescription>
                {initiative
                  ? `${initiative.handle} — ${initiative.title}. Three honest questions before discovery.`
                  : null}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <StepRail
                contentSteps={contentSteps}
                summaryStep={summaryStep}
                stepIndex={stepIndex}
                answers={answers}
                onJump={(idx) => {
                  setStepError(null);
                  setStepIndex(idx);
                }}
              />
              <p className="text-[11px] text-muted-foreground">
                <span className="text-destructive">*</span> Required field.
              </p>

              {currentContent ? (
                <div className="flex flex-col gap-3" ref={editorRef}>
                  <div>
                    <Label className="text-sm font-medium">
                      {currentContent.label}
                      {REQUIRED_SET.has(currentContent.field) ? (
                        <span
                          aria-label="required"
                          className="ml-1 text-destructive"
                        >
                          *
                        </span>
                      ) : null}
                    </Label>
                    {REQUIRED_SET.has(currentContent.field) ? (
                      <p className="mt-0.5 text-[11px] font-medium text-destructive">
                        Required
                      </p>
                    ) : null}
                    {currentContent.help ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {currentContent.help}
                      </p>
                    ) : null}
                  </div>
                  <RichTextEditor
                    value={answers[currentContent.field]}
                    onChange={(html) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentContent.field]: html,
                      }))
                    }
                    ariaLabel={currentContent.label}
                    className="w-full"
                  />
                </div>
              ) : isSummary && summaryStep ? (
                <SummaryComposite
                  initiative={initiative}
                  contentSteps={contentSteps}
                  answers={answers}
                  onJump={jumpToField}
                />
              ) : null}

              {stepError ? (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {stepError}
                </p>
              ) : null}
              {apiError ? (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  data-testid="brief-wizard-api-error"
                >
                  {apiError}
                </p>
              ) : null}
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={requestClose}
                  disabled={submitting}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Cancel
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goBack}
                  disabled={submitting || stepIndex === 0}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Back
                </Button>
                {!isSummary ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={submitting}
                    className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Next
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => void submit("save_only")}
                      disabled={submitting}
                      data-testid="brief-wizard-save-only"
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {submitting && submitMode === "save_only"
                        ? "Saving…"
                        : "Save brief only"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => void submit("save_and_start")}
                      disabled={submitting}
                      data-testid="brief-wizard-save-and-start"
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      {submitting && submitMode === "save_and_start"
                        ? "Saving…"
                        : "Save brief & start discovery"}
                    </Button>
                  </>
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DiscardPrompt({
  onCancel,
  onDiscard,
}: {
  onCancel: () => void;
  onDiscard: () => void;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Discard changes?</DialogTitle>
        <DialogDescription>
          Your answers are not saved until you finish. Discard everything and
          close the wizard?
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Keep editing
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onDiscard}
          className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Discard
        </Button>
      </DialogFooter>
    </>
  );
}

function StepRail({
  contentSteps,
  summaryStep,
  stepIndex,
  answers,
  onJump,
}: {
  contentSteps: ContentStep[];
  summaryStep: SummaryStep | null;
  stepIndex: number;
  answers: BriefWizardAnswersInput;
  onJump: (idx: number) => void;
}) {
  const total = contentSteps.length + (summaryStep ? 1 : 0);
  return (
    <ol
      aria-label="Wizard steps"
      className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
    >
      {contentSteps.map((s, i) => {
        const active = i === stepIndex;
        const answered = fieldHasContent(answers, s.field);
        const required = REQUIRED_SET.has(s.field);
        const showDot = required && !answered;
        return (
          <li key={s.id} className="flex items-center">
            <button
              type="button"
              onClick={() => onJump(i)}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border hover:bg-muted"
              }`}
            >
              <span aria-hidden className="font-mono text-[10px]">
                {i + 1}
              </span>
              <span>{s.label}</span>
              {showDot ? (
                <span
                  aria-label="Required and unanswered"
                  className="ml-0.5 inline-block size-1.5 rounded-full bg-destructive"
                />
              ) : null}
            </button>
            {i < total - 1 ? (
              <span aria-hidden className="px-1 text-muted-foreground">
                ›
              </span>
            ) : null}
          </li>
        );
      })}
      {summaryStep ? (
        <li className="flex items-center">
          <button
            type="button"
            onClick={() => onJump(contentSteps.length)}
            aria-current={
              stepIndex === contentSteps.length ? "step" : undefined
            }
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              stepIndex === contentSteps.length
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border hover:bg-muted"
            }`}
          >
            <span aria-hidden className="font-mono text-[10px]">
              {contentSteps.length + 1}
            </span>
            <span>Summary</span>
          </button>
        </li>
      ) : null}
    </ol>
  );
}

function SummaryComposite({
  initiative,
  contentSteps,
  answers,
  onJump,
}: {
  initiative: Initiative | null;
  contentSteps: ContentStep[];
  answers: BriefWizardAnswersInput;
  onJump: (field: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-muted-foreground">
        Review what you wrote. Click any answer to edit. Both buttons save the
        brief; the primary also moves the card into Discovery.
      </p>

      {initiative ? (
        <section
          aria-label="Idea"
          className="rounded-md border border-border bg-card px-3 py-2"
        >
          <header className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Idea
            <Badge variant="outline" className="text-[10px]">
              read-only
            </Badge>
          </header>
          <h4 className="text-sm font-semibold">{initiative.title}</h4>
          {initiative.body.trim().length > 0 ? (
            <div className="mt-1 text-xs text-muted-foreground">
              <RichTextRenderer html={initiative.body} />
            </div>
          ) : null}
        </section>
      ) : null}

      {contentSteps.map((step) => {
        const html = answers[step.field];
        const empty = textFromHtml(html).length === 0;
        return (
          <section
            key={step.id}
            aria-label={step.label}
            className="rounded-md border border-border bg-card px-3 py-2"
          >
            <header className="mb-1 flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <span className="flex items-center gap-2">
                {step.label}
                {REQUIRED_SET.has(step.field) ? (
                  <span aria-label="required" className="text-destructive">
                    *
                  </span>
                ) : null}
                {/* Source + confidence chips per S3 envelope contract — wizard
                    answers are user-authored at high confidence. */}
                <Badge variant="outline" className="text-[10px] uppercase">
                  user
                </Badge>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  high
                </Badge>
              </span>
              <button
                type="button"
                onClick={() => onJump(step.field)}
                className="rounded px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                data-testid={`brief-wizard-edit-${step.field}`}
              >
                Edit
              </button>
            </header>
            {empty ? (
              <p className="text-xs italic text-destructive">
                Required — click Edit to add.
              </p>
            ) : (
              <div className="text-xs text-foreground">
                <RichTextRenderer html={html} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
