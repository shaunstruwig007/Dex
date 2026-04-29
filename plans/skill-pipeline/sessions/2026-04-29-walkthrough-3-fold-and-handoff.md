---
session_date: 2026-04-29
session_lead: Shaun + Cursor agent
session_duration: ~1.5 hours
status: COMPLETE
linked_artefacts:
  - 06-Resources/PRDs/Multilingual_Content.md
  - 06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md
  - 06-Resources/PRDs/Employee_Chat_and_Groups.md
  - 06-Resources/PRDs/AI_Assistant_FAQ.md
  - .claude/skills/prd-author-custom/SKILL.md
---

# Walkthrough 3 — Fold critique must-fixes + design Build-handoff for repo-split

## One-line

Folded all deferred M + Q critique must-fixes into the four bond_v1 PRDs, designed and added a "Build handoff" section addressing the GitHub-vault → Bitbucket-code repo split, and promoted the cross-cutting findings into the bond_v1 spec so future PRDs ship with these properties by default.

---

## What we set out to do

After Walkthroughs 1 and 2, four PRDs sat at `RETURN TO PLAN` from M + Q critique passes — must-fixes deferred. Walkthrough 3's job: fold them.

Mid-session, the user surfaced a real-world constraint: the GitHub vault holds the PRDs but the code lives in Bitbucket, with no plan to migrate. The standard "paste plan-mode-seed into Cursor Plan mode" handoff doesn't work cleanly across repos. Walkthrough 3 expanded scope to design + ship a Build-handoff section that travels with the PRD across the boundary.

---

## What we did

### 1. Folded per-PRD must-fixes

Reconstructed Walkthrough 1's M + Q output for `Multilingual_Content.md` from the chat transcript (it wasn't saved to a session file at the time — itself a process learning). Walkthrough 2's three PRDs had their critiques already logged in [`2026-04-29-walkthrough-2-critiques.md`](./2026-04-29-walkthrough-2-critiques.md).

| PRD | Per-PRD must-fixes folded | Cross-cutting must-fixes added |
|---|---|---|
| `Multilingual_Content.md` | M1–M6 (Steerco framing, demo prep, metric reframe, cohesion seam, slice-5 enumeration, slice-3 coordination) + Q1–Q8 (translation-failure behaviour, cache key, schema parity, contract changes, technical failure modes, a11y `lang` attribute, test shape, provider abstraction) | Test shape per slice; Slice 1 demo readiness; Build handoff |
| `AI_Assistant_in_Chat_Surface.md` | P1 (demo prep), P2 (metric baseline-then-evaluate), P3 (operational IA-revert plan); E1 (transactional handoff), E2 (client-UUID idempotency), E3 (chat-list payload versioning), E4 (test shape), E5 (failure-mode UX) | Test shape per slice; Slice 1 demo readiness; Build handoff |
| `Employee_Chat_and_Groups.md` | P1 (wireframe-walkthrough demo posture until ADR), P2 (rolling-30-day metric), P3 (ADR swap-cost section); E1 (client-UUID), E2 (entry-type taxonomy), E3 (notification-dispatch failure), E4 (test shape) | Test shape per slice; Slice 1 demo readiness; Build handoff |
| `AI_Assistant_FAQ.md` | P1 (Slice 1 + Slice 2 demo prep), P2 (hallucination-rate sampling-adequacy framing), P3 (cross-PRD architecture coordination block), P4 (forward-compatible engine-abstraction shape); E1 (escalation idempotency key), E2 (handoff routing contract), E3 (degraded-state UX), E4 (vendor a11y compliance check), E5 (test shape), E6 (corpus version control) | Test shape per slice; Slice 1 + Slice 2 demo readiness; Build handoff |

Each PRD's frontmatter now carries:
- `last_bond_run: 2026-04-29 15:45–16:00` (per-PRD timestamp).
- `critique_status: must_fixes_folded`.
- `critique_log: <path to session file>` for traceability.

### 2. Designed the Build-handoff section

Real constraint: vault on GitHub, code on Bitbucket, no auto-sync. The PRD's `plan-mode-seed` block needs to travel with the developer to the codebase-repo Cursor environment.

The section has four subsections:

- **Repo-split callout** — explicit blockquote naming where the PRD lives vs where code lives.
- **How to use this PRD in Cursor Plan mode (in the codebase repo)** — numbered list:
  1. Copy the markdown to `docs/PRDs/<filename>.md` (or repo's product-spec path).
  2. Also copy any sibling PRDs named in cross-PRD slice dependencies.
  3. Open Cursor in the codebase repo with the PRD(s) in context.
  4. Paste the plan-mode-seed block as the Plan-mode prompt.
  5. Reference Slices, Test shape, demo readiness, Risks, Open Q's, Design pointers.
- **Handoff snapshot** — a per-PRD table with: source path, last_bond_run, lifecycle, demo-readiness deliverables, cross-PRD deps, hard gates, sign-off owners.
- **Source-of-truth rule** — explicit: edits to the codebase-repo copy do NOT propagate back. Spec changes happen in vault, then re-run `/prd-author-custom` and re-copy.

Added to all four PRDs.

### 3. Promoted cross-cutting findings into the bond_v1 spec

Updated [`/prd-author-custom`](../../.claude/skills/prd-author-custom/SKILL.md) so future PRDs ship with these by default:

- **Test shape per slice** — required subsection with `slice / unit / integration / e2e / a11y / notes` columns.
- **Slice 1 demo readiness** — required checklist with at minimum: pre-vetted demo content, dependency-failure fallback rehearsed, defect example off-camera, wireframe walkthrough where Slice 1 is gated.
- **Technical failure modes** subsection in Risks — required for PRDs with external dependencies.
- **A11y subsection** in Design pointers — required, with `lang` attribute on translated content as non-negotiable (carries the walkthrough-1 finding).
- **Build handoff** — required section. Repo-split callout + Plan-mode-in-codebase-repo instructions + handoff snapshot table + source-of-truth rule.
- **Frontmatter additions** — `critique_status` (pending / running / must_fixes_pending / must_fixes_folded), `critique_log` (path to critique session file).

Refusal list updated to enforce all of the above. Reference examples updated to point at all four canonical bond_v1 PRDs.

---

## What we learned

### Process

- **Critique outputs need a session file from the start.** Walkthrough 1's M + Q critique was ephemeral — captured only in the chat transcript. Reconstructing it took a transcript dive. Walkthrough 2's critique-log file pattern is the right one; back-fill should be enforced.
- **Idempotence rule earned its keep on this session.** Each PRD has a `last_bond_run` timestamp that the skill checks before regenerating. The fact that all four PRDs were edited substantially (must-fix folds) means a future re-author would surface a diff and ask before overwriting — author edits are protected by design.
- **Frontmatter as audit trail.** The `critique_status` + `critique_log` fields make a PRD's pipeline state inspectable without grepping body text. Cheap to maintain, high-yield for "where is this PRD at?".

### Skill spec evolution

- **bond_v1 is now a real spec, not aspirational.** Walkthrough 1 produced one PRD against an unwritten spec; Walkthrough 2 produced three PRDs against an emerging spec; Walkthrough 3 promoted the patterns into a hard spec the skill now refuses without. Three iterations to lock the shape.
- **Build handoff is the load-bearing addition.** The other cross-cutting findings (test shape, demo readiness) are quality improvements; Build handoff is the difference between a PRD that lives in a vault and a PRD that ships software. Without it, the GitHub→Bitbucket split breaks the pipeline entirely.

### Validation

- **The pipeline is now end-to-end testable.** Idea → discovery → PRD → critique → fold-fixes → Plan-mode handoff → Build (in Bitbucket-Cursor) is a complete loop. The only validation step remaining is whether `plan-mode-seed` actually produces sensible Plan-mode steps in the codebase-repo Cursor environment.

---

## What's pending

- **Plan-mode consumption test.** Pick one PRD (likely `Multilingual_Content.md` — simplest), copy to a Bitbucket-codebase-repo Cursor session, paste the plan-mode-seed block, capture what Plan mode produces. Validates the load-bearing claim of the whole pipeline.
- **Design pass on `AI_Assistant_in_Chat_Surface.md`.** User flagged they may have run out of Claude Design credits but plan to attempt the wireframe pass anyway. If credits hold, this validates whether `Design pointers` + the new `Failure-mode UX` + `A11y` subsections give a designer enough to work with.
- **Idempotence flow test.** Re-author one of the folded PRDs through `/prd-author-custom` and confirm the diff-and-ask flow surfaces the author's edits cleanly.
- **Walkthrough 4 candidate.** A runtime-plan critique pass (sprint seed or actual Cursor Plan output) to exercise `/critique-engineering-custom`'s runtime-lens — not yet validated. Cross-cutting finding #8 from walkthrough-2.

---

## Decisions made

| # | Decision | Reason |
|---|----------|--------|
| 1 | Reconstruct walkthrough-1 critique from transcript rather than re-running | Faster; the substantive must-fixes are unchanged; learning logged about session-file discipline. |
| 2 | Single `Build handoff` section per PRD, not per-slice | Whole-PRD pickup is the realistic developer flow; per-slice handoff would fragment the contract. |
| 3 | Promote test-shape, demo-readiness, build-handoff into bond_v1 spec | All three were GAPs / SOFTs on every PRD critiqued — the pattern is universal, not per-PRD. Promoting is the right move. |
| 4 | A11y `lang` attribute requirement is non-negotiable | Screen-reader correctness on multi-language content is a correctness invariant, not a quality bar. The skill's refusal list enforces. |
| 5 | Frontmatter gets `critique_status` + `critique_log` | Cheap audit trail; enables future skills to scan PRD pipeline state without grepping body text. |
| 6 | Defer plan-mode consumption test to a future session | Requires the user to run a Bitbucket-codebase-repo Cursor session — outside the vault repo's reach. |

---

## Time spent (rough)

| Stage | Time |
|---|---|
| Transcript dive for walkthrough-1 critique | ~10 min |
| Read all 4 PRDs + walkthrough-2 critique log | ~10 min |
| Fold Multilingual must-fixes (M1–M6, Q1–Q8 + cross-cutting) | ~25 min |
| Fold AI_Assistant_in_Chat_Surface must-fixes (P1–P3, E1–E5 + cross-cutting) | ~15 min |
| Fold Employee_Chat_and_Groups must-fixes (P1–P3, E1–E4 + cross-cutting) | ~15 min |
| Fold AI_Assistant_FAQ must-fixes (P1–P4, E1–E6 + cross-cutting) | ~20 min |
| Update `/prd-author-custom` SKILL.md (promote findings) | ~10 min |
| Session log + commit prep | ~10 min |
| **Total** | **~1h 55min** |

---

## Reference index

**Live artefacts modified or produced:**
- [`06-Resources/PRDs/Multilingual_Content.md`](../../../06-Resources/PRDs/Multilingual_Content.md)
- [`06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md`](../../../06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md)
- [`06-Resources/PRDs/Employee_Chat_and_Groups.md`](../../../06-Resources/PRDs/Employee_Chat_and_Groups.md)
- [`06-Resources/PRDs/AI_Assistant_FAQ.md`](../../../06-Resources/PRDs/AI_Assistant_FAQ.md)
- [`.claude/skills/prd-author-custom/SKILL.md`](../../../.claude/skills/prd-author-custom/SKILL.md)

**Critique sources consumed:**
- [`plans/skill-pipeline/sessions/2026-04-29.md`](./2026-04-29.md) — walkthrough 1 session summary.
- [`plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md`](./2026-04-29-walkthrough-2-critiques.md) — walkthrough 2 critique log.
- Chat transcript — walkthrough 1 M + Q critique on Multilingual (reconstructed).

---

*Session captured 2026-04-29 (walkthrough 3). Next session: plan-mode consumption test in a codebase-repo Cursor environment, OR design pass on `AI_Assistant_in_Chat_Surface.md` via Claude Design wireframe mode (subject to credit availability).*
