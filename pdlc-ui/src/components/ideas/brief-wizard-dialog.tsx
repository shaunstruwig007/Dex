"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/rich-text/rich-text-editor";
import {
  assertRequiredFlagsInContent,
  loadBriefSteps,
  type BriefStep,
} from "@/content/brief-steps";
import {
  validateBriefWizardAnswers,
  type BriefWizardAnswersInput,
} from "@/lib/brief-wizard-validation";
import type { Initiative } from "@/schema/initiative";
import { cn } from "@/lib/utils";

function emptyAnswers(): BriefWizardAnswersInput {
  return {
    problem: "<p></p>",
    targetUsers: "<p></p>",
    coreValue: "<p></p>",
    successDefinition: "<p></p>",
    constraints: "<p></p>",
    scopeIn: [""],
    scopeOut: [""],
    assumptions: [""],
    understandingSummary: "<p></p>",
    openQuestions: [""],
  };
}

function textFromHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isDirtyAnswers(a: BriefWizardAnswersInput): boolean {
  if (
    textFromHtml(a.problem) ||
    textFromHtml(a.targetUsers) ||
    textFromHtml(a.coreValue) ||
    textFromHtml(a.successDefinition) ||
    textFromHtml(a.constraints) ||
    textFromHtml(a.understandingSummary)
  ) {
    return true;
  }
  if (a.scopeIn.some((s) => s.trim())) return true;
  if (a.scopeOut.some((s) => s.trim())) return true;
  if (a.assumptions.some((s) => s.trim())) return true;
  if (a.openQuestions.some((s) => s.trim())) return true;
  return false;
}

function stepFieldError(
  step: BriefStep,
  a: BriefWizardAnswersInput,
): string | null {
  if (!step.required) return null;
  switch (step.field) {
    case "problem":
    case "targetUsers":
    case "coreValue":
    case "successDefinition":
    case "constraints":
    case "understandingSummary":
      return textFromHtml(a[step.field]).length === 0
        ? "This field is required."
        : null;
    case "scopeIn":
    case "scopeOut":
    case "assumptions":
    case "openQuestions": {
      const lines = a[step.field].map((s) => s.trim()).filter(Boolean);
      return lines.length === 0 ? "Add at least one line." : null;
    }
    default:
      return null;
  }
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
  const steps = useMemo(() => {
    const file = loadBriefSteps();
    assertRequiredFlagsInContent(file.steps);
    return file.steps;
  }, []);

  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<BriefWizardAnswersInput>(emptyAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showDiscard, setShowDiscard] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setAnswers(emptyAnswers());
      setApiError(null);
      setShowDiscard(false);
      setStepError(null);
    }
  }, [open, initiative?.id]);

  const step = steps[stepIndex];
  const roundLabel = useMemo(
    () => ["", "Round 1 — Framing", "Round 2 — Scope", "Round 3 — Assumptions"],
    [],
  );

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
    if (!step) return;
    const err = stepFieldError(step, answers);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
    }
  }, [step, stepIndex, steps.length, answers]);

  const goBack = useCallback(() => {
    setStepError(null);
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const jumpToField = useCallback(
    (field: string) => {
      const idx = steps.findIndex((s) => s.field === field);
      if (idx >= 0) setStepIndex(idx);
    },
    [steps],
  );

  const submit = useCallback(async () => {
    const inv = initiative;
    if (!inv) return;
    const missing = validateBriefWizardAnswers(answers);
    if (missing.length > 0) {
      jumpToField(missing[0]!);
      setStepError("Please complete required fields before finishing.");
      setApiError(null);
      return;
    }
    setSubmitting(true);
    setApiError(null);
    setStepError(null);

    const initiativeId = inv.id;
    const initialRevision = inv.revision;
    const body = {
      expectedRevision: initialRevision,
      answers: {
        ...answers,
        scopeIn: answers.scopeIn.map((s) => s.trim()).filter(Boolean),
        scopeOut: answers.scopeOut.map((s) => s.trim()).filter(Boolean),
        assumptions: answers.assumptions.map((s) => s.trim()).filter(Boolean),
        openQuestions: answers.openQuestions
          .map((s) => s.trim())
          .filter(Boolean),
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
            "Someone else edited this brief — please close and re-open.",
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

      if (res.ok && json && typeof json === "object" && "initiative" in json) {
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
    }
  }, [answers, initiative, jumpToField, onCompleted, onOpenChange]);

  const isLast = stepIndex === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogContent className="max-h-[min(90vh,720px)] max-w-2xl overflow-y-auto">
        {showDiscard ? (
          <>
            <DialogHeader>
              <DialogTitle>Discard changes?</DialogTitle>
              <DialogDescription>
                Your answers are not saved until you finish. Discard everything
                and close the wizard?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowDiscard(false)}
                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Keep editing
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  setShowDiscard(false);
                  onOpenChange(false);
                }}
                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Discard
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Product brief</DialogTitle>
              <DialogDescription>
                {initiative
                  ? `${initiative.handle} — ${initiative.title}. Aligned to \`/pdlc-brief-custom\` rounds.`
                  : null}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              <div
                className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
                aria-live="polite"
              >
                <span className="rounded-md border border-border px-2 py-0.5 font-medium text-foreground">
                  Step {stepIndex + 1} / {steps.length}
                </span>
                {step ? (
                  <span className="text-foreground">
                    {roundLabel[step.round]}
                  </span>
                ) : null}
              </div>

              {step ? (
                <div className="flex flex-col gap-3">
                  <div>
                    <Label className="text-sm font-medium">{step.label}</Label>
                    {step.help ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {step.help}
                      </p>
                    ) : null}
                  </div>

                  {step.type === "richtext" ? (
                    <RichTextEditor
                      value={answers[step.field] as string}
                      onChange={(html) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [step.field]: html,
                        }))
                      }
                      ariaLabel={step.label}
                      className="w-full"
                    />
                  ) : (
                    <ListFieldEditor
                      lines={answers[step.field] as string[]}
                      onChange={(lines) => {
                        const f = step.field;
                        if (
                          f === "scopeIn" ||
                          f === "scopeOut" ||
                          f === "assumptions" ||
                          f === "openQuestions"
                        ) {
                          setAnswers((prev) => ({ ...prev, [f]: lines }));
                        }
                      }}
                      ariaLabel={step.label}
                    />
                  )}

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
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goBack}
                  disabled={submitting || stepIndex === 0}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Back
                </Button>
                {!isLast ? (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={submitting}
                    className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => void submit()}
                    disabled={submitting}
                    className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    {submitting ? "Saving…" : "Finish"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function ListFieldEditor({
  lines,
  onChange,
  ariaLabel,
}: {
  lines: string[];
  onChange: (lines: string[]) => void;
  ariaLabel: string;
}) {
  const value = lines.join("\n");
  return (
    <Textarea
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value.split("\n"))}
      rows={6}
      className={cn(
        "text-sm",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      )}
      placeholder="One item per line"
    />
  );
}
