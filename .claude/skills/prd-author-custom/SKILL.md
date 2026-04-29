---
name: prd-author-custom
description: Draft a slice-shaped PRD (bond_v1 output shape) from an /initiative-discovery-custom output. Produces a PRD with frontmatter, Goal, Users, Success metrics, Requirements, Slices table, Test shape per slice, Slice 1 demo readiness, Plan-mode-seed block (1:1 mapping for Cursor Plan mode), Risks (with mitigation per risk + technical-failure-modes subsection), Out of scope (with reasons + future-cycle flags), Open questions, Design pointers (with explicit a11y subsection), and Build handoff (GitHub-vault → codebase-repo pickup contract). Idempotent. Refuses to overwrite an edited PRD silently. Pairs with /critique-product-custom + /critique-engineering-custom.
---

# PRD Author (custom)

**What this skill does.** Takes a discovery output (problem statement, user segments, stakeholders, evidence, candidate slices, open questions) and writes a **slice-shaped PRD** suitable for Cursor Plan mode. The PRD's `plan-mode-seed` fence maps 1:1 to Plan mode steps.

**`-custom` suffix** keeps it protected from `/dex-update` overwrites. Edit this file directly.

**Companions:**
- [`initiative-discovery-custom/SKILL.md`](../initiative-discovery-custom/SKILL.md) — required upstream skill that produces the input this skill consumes.
- [`critique-product-custom/SKILL.md`](../critique-product-custom/SKILL.md) + [`critique-engineering-custom/SKILL.md`](../critique-engineering-custom/SKILL.md) — downstream critique skills, run after this skill produces a draft.

**Coexists with [`agent-prd`](../agent-prd/SKILL.md).** Different output shape. `/agent-prd` produces a wizard-driven, work-package + BDD shape for direct agent implementation. `/prd-author-custom` produces a slice + plan-mode-seed shape for Cursor Plan mode in a discovery→PRD→build pipeline. Pick by loop.

---

## When to invoke

- A discovery output exists (from `/initiative-discovery-custom`) and the question is "draft the PRD."
- The user explicitly says "draft the PRD", "write the spec", "promote this to a PRD", or asks to author a PRD for a feature with a discovery already in place.
- The user is **migrating an existing PRD** to the `bond_v1` shape (provide the existing PRD path; the skill reads it and re-shapes).

Invocation shapes:

```
/prd-author-custom                              # author from active discovery output
/prd-author-custom <discovery-file>             # author from a specific discovery file
/prd-author-custom --reshape <existing-prd>     # migrate an existing PRD to bond_v1 shape
/prd-author-custom --no-discovery               # author without discovery (REQUIRES reason logged in frontmatter)
```

---

## Required input contract

The skill **refuses to draft** without one of the following:

1. **Discovery output** from `/initiative-discovery-custom`. Required fields:
   - `discovery.problemStatement` — one paragraph, evidence-grounded.
   - `discovery.userSegments[]` — each with `role` and an `is_primary` flag.
   - `discovery.stakeholders[]` — SMEs / domain experts identified by name.
   - `discovery.evidenceLog[]` — links to vault evidence (meeting notes, customer pages, ICP, prior PRDs).
   - `discovery.evidenceGaps[]` — what's known to be missing.
   - `discovery.icpSegmentMatch` — which ICP variant this serves (or "cross-cutting" with reason).
   - `discovery.candidateSlices[]` — the discovery skill's first-pass at slicing; this skill refines them.
   - `discovery.openQuestions[]` — each with `blocks` and `owner` fields.

2. **`--no-discovery` override** with a one-line reason (e.g. "migrating legacy PRD; original discovery is the existing PRD body"). The reason gets logged in the PRD's frontmatter as `discovery_skipped_reason:`.

3. **`--reshape <existing-prd>`** — input is the existing PRD file. The skill extracts what it can (Goal, Users, Risks) and asks the user to fill any missing sections inline.

If none of the three apply, the skill **stops** and prompts the user to run `/initiative-discovery-custom` first.

---

## Idempotence rule

Before writing, the skill checks if the target file already exists.

- **File doesn't exist:** write fresh.
- **File exists, last-modified-by-this-skill matches `last_bond_run` frontmatter (no human edits since last run):** safe to overwrite. Write directly.
- **File exists, has been edited since last run (last-modified > `last_bond_run`):** **stop**. Do NOT overwrite. Surface a diff between current file and what would be generated. Ask:
  - **Overwrite** (lose user edits)
  - **Merge** (skill picks the author's edits where they conflict; user reviews each conflict)
  - **Save-as** (write to `<filename>.bond.md`, leave original untouched)
  - **Abort**

Never silently overwrite an edited PRD. The author's edits are signal.

---

## Output shape (bond_v1)

The skill produces a single markdown file under `06-Resources/PRDs/<Feature_Name>.md`. Exact section order, all required, no skips:

### Frontmatter

```yaml
---
prd_shape: bond_v1
prd_id: <slug>-YYYY-MM-DD
created_date: YYYY-MM-DD
last_bond_run: YYYY-MM-DD HH:MM
lifecycle: spec_ready  # idea | discovery | design | spec_ready | develop | uat | deployed | parked
critique_status: pending  # pending | running | must_fixes_pending | must_fixes_folded
critique_log: <path to plans/skill-pipeline/sessions/*.md if a critique pass has run>  # optional; omit if no critique yet
design_pass_status: not_applicable  # not_applicable | pending | scheduled | in_progress | done — only set if the PRD has a Design pointers section that warrants a Claude Design wireframe pass
related_prds:
  - <Sibling_PRD>.md  # PRDs whose surface this PRD touches
discovery_skipped_reason: <one line, only if --no-discovery used>  # otherwise omit
---
```

### Header

```markdown
# <Feature Name>

**Status:** <one-line status that mirrors frontmatter pipeline state. Format: `<lifecycle>` · <critique state> · <design state if applicable> · <human-readable next step>. e.g. "`spec_ready` · critique pass complete · must-fixes folded 2026-04-29 · design pass pending — Claude Design scheduled 2026-05-01." This line MUST be kept in sync with frontmatter `lifecycle` / `critique_status` / `design_pass_status` whenever any of those change. Surfaces pipeline state to readers (incl. external reviewers) without expanding YAML frontmatter.>
**Target:** <primary user, e.g. "Wyzetalk Essential reader (frontline employee).">
**Out of scope intentionally:** <comma-separated headline list of major exclusions>
```

### Required sections (in order)

1. **Goal** — one paragraph: what shifts when this ships. One paragraph: the evidence grounding (sales notes, customer feedback, ICP fit, market signal). No implementation detail.

2. **Users** — primary user described in narrative form (one paragraph), secondary users described in narrative form (one paragraph each), then a paragraph for **Out of scope (MVP)** user roles with reasoning.

3. **Success metrics** — 2–4 metrics. Each metric has: name, definition, target with timeframe, measurement source. **Plus a "Note on measurability"** subsection that names which metrics need analytics plumbing and at which slice they become measurable. Catches aspirational-metric anti-pattern.

4. **Requirements** — outcome-shaped, numbered. No implementation prescription. Each requirement is one sentence describing user-observable behaviour. 5–10 requirements typical.

5. **Slices** — the heart of the PRD. A markdown table with columns:

   | # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |

   Slicing rules (the skill enforces these):
   - **Slice 1 must be the walking skeleton.** Smallest end-to-end cut. Spans all layers needed to demo. Single observable outcome callable in one sentence.
   - **Each subsequent slice thickens or extends** — it adds capability, persistence, secondary users, edge cases, or expansion. Never re-slices what slice 1 covered.
   - **Layers touched** = `data`, `api`, `ui`, `config`, or any combination. Slices that touch zero layers don't exist.
   - **Demo outcome** must be one sentence, observer-eye-level. "User does X, sees Y within Z." If a slice has no observable demo, it isn't a slice — it's a refactor.
   - **Depends on** chains slices linearly or in parallel. Slice 1 has no deps. Most slices depend on the previous one.
   - **3–6 slices typical.** More than 6 = the slicing is too thin or the PRD scope is too broad.
   
   After the table, three required subsections in this order:

   **5a. Slicing rules applied** — explicitly notes which slicing rules apply and any edge cases (cross-PRD dependencies, parallelisable slices, GA-bundle constraints).

   **5b. Test shape per slice** — required subsection (cross-cutting must-fix from `/critique-engineering-custom` walkthrough-2 finding #1). A markdown table:

   | # | Unit | Integration | E2E | A11y | Notes |

   Every slice ships with at least one entry per column (or `n/a` with reason). PR review enforces. The skill refuses to ship a Slices section without this table.

   **5c. Slice 1 demo readiness** — required subsection (cross-cutting must-fix from `/critique-product-custom` walkthrough-2 finding #2). A checklist of slice-1-specific deliverables that protect the first steerco demo. Required items:
   - Pre-vetted demo content / journey rehearsed end-to-end (corpus-backed feature: pre-loaded FAQ; UX feature: pre-vetted user-input examples).
   - External-dependency-failure fallback rehearsed (vendor unreachable, API down, network flaky).
   - Defect / known-bad example prepared off-camera (so steerco understands the operational discipline behind the metric).
   - Where Slice 1 is gated by an upstream decision (engineering spike, ADR, schema migration), a **wireframe walkthrough or paper prototype** prepared so the demo can run on the wireframe until the gate lifts.
   
   Slices later than 1 may also have demo-readiness checklists (e.g. Slice 2 of an ingestion pipeline = "second tenant onboarded successfully"). Add per-slice checklists as their first-demo risk warrants.

6. **Plan mode seed** — a fenced ` ```plan-mode-seed ` block, mechanically generated from the Slices table. One line per slice. Format:
   ```
   Slice <N>: <Name> — <demo outcome>. Layers: <layers>. Depends: <prev>.
   ```
   This is the **direct copy-paste into Cursor Plan mode**. The 1:1 mapping is the load-bearing contract of bond_v1.

7. **Risks** — 4–8 risks. Each risk has:
   - **Risk name** (bolded).
   - **Description** — one sentence on what could go wrong + when.
   - **Mitigation** — one sentence on the defensive move. **Required, not optional.** A risk without a mitigation is incomplete; the skill refuses to ship.

   For PRDs that touch external dependencies (vendors, APIs, realtime stacks, external datasources), add a **Technical failure modes** subsection after the product-risk list. Bullet list of:
   - External-dependency unavailable: what the user sees / what the system does.
   - Idempotency on retry: client-UUID dedup, server-enforced.
   - Cache miss / corruption (where caches exist): behaviour + observability.
   - Slow render / timeout (where SLA-relevant): fallback shape.
   - Vendor lock-in / engine swap: concrete abstraction (interface + call site) shipped from the slice that introduces the dependency.

8. **Out of scope** — markdown table:

   | Out of scope | Why | Future cycle? |

   Each row = one explicit exclusion + its reason + whether it returns in a future cycle (`Yes, future`, `Yes, post-MVP`, `No`, `No — explicit non-goal`).

9. **Open questions** — markdown table:

   | # | Question | Blocks | Owner / next step |

   Each question has: the question, what it blocks (which slice or decision), and who owns it / what the next move is. After the table, a **"None of these block slice-1 build" subsection** with stub assumptions (or a clear "Q<n> blocks slice 1" call-out if some do).

10. **Design pointers** — paste-ready for Claude Design or a human designer, no skill in the loop. Subsections:
    - **Context** — one paragraph platform / surface context.
    - **Surfaces in scope** — numbered list of UI surfaces touched.
    - **Critical UX questions for the designer to answer** — bulleted list of design-decision-shaped questions, each with a recommendation if the PRD author has one.
    - **Failure-mode UX** (required if the PRD has external dependencies) — bulleted list of degraded-state copy + behaviour for each failure mode named in section 7's Technical failure modes subsection.
    - **A11y requirements** (required, non-negotiable — cross-cutting must-fix from `/critique-engineering-custom` walkthrough-1 finding) — bulleted list:
      - **`lang` attribute on translated / localised content** (where applicable). Without this, screen readers mispronounce non-default-language content. Non-negotiable.
      - **Keyboard navigability** of any new interactive element.
      - **Screen-reader announcement** of stateful indicators (`aria-live` where appropriate).
      - **Sufficient contrast** for outdoor / low-light frontline use.
      - **Tap-target sizes** meet platform guidelines.
    - **Constraints on design** — bulleted list of "must / must not".
    - **What the designer should NOT prescribe** — bulleted list of decisions that belong to PM / engineering, not design.
    - **Design slice ordering** — mirrors the build slices, calls out which slices have design changes vs which don't.

11. **Build handoff** — required section (added 2026-04-29 after walkthrough-2; addresses the **GitHub-vault → codebase-repo split**). When the PRD lives in a vault repo (e.g. GitHub) and the production code lives in a separate repo (e.g. Bitbucket), the developer needs a self-contained pickup contract. Subsections:

    **11a. Repo-split callout** — one-line block-quote naming where the PRD lives vs where the code lives, and that there is no auto-sync.

    **11b. How to use this PRD in Cursor Plan mode (in the codebase repo)** — numbered list:
    1. Copy this entire markdown file to the codebase repo at `docs/PRDs/<filename>.md` (or the repo's product-spec convention).
    2. List sibling PRDs that must also be copied (cross-PRD slice dependencies).
    3. Open Cursor with the codebase repo as workspace, with the PRD(s) in context.
    4. Paste the **Plan mode seed** block as the Plan mode prompt — each line maps to one Plan-mode step → one PR / branch.
    5. Reference the Slices, Test shape per slice, demo readiness, Risks, Open questions, and Design pointers sections for full context.

    **11c. Handoff snapshot** — a markdown table:

    | Field | Value |
    |---|---|
    | **Source file (vault)** | `<path>` (`<repo-host>: <repo-name>`) |
    | **bond_v1 last run** | `<timestamp>` |
    | **Lifecycle** | `<lifecycle>` |
    | **Slice 1 demo-readiness deliverables** | `<short list from 5c>` |
    | **Cross-PRD slice dependencies** | `<list>` |
    | **Hard gates before Slice 1 build** | `<list of blocking Open Q's>` |
    | **Hard gates before later slices / GA** | `<list>` |
    | **Sign-off needed before Build** | `<list of approvers — Product / Engineering / Legal / Design / domain-owner>` |

    **11d. Source-of-truth rule** — a numbered list explaining:
    - Edits to the codebase-repo copy do NOT propagate back.
    - For spec changes, edit the source file in the vault and re-run `/prd-author-custom`.
    - The skill's idempotence rule protects the source from accidental overwrites.

### Footer

```markdown
*Authored YYYY-MM-DD by /prd-author-custom from <discovery-file or input source>. Last run: YYYY-MM-DD HH:MM.*
```

---

## What the skill enforces (refusal list)

The skill **stops and asks** before generating, if any of these are true:

- **No discovery output and no `--no-discovery` reason.** → "Run `/initiative-discovery-custom` first, or invoke with `--no-discovery <reason>`."
- **Existing PRD edited since last run.** → Diff + ask before overwriting (per Idempotence rule).
- **A metric with no measurement source.** → "Metric <X> has no measurement source. Either name the source (analytics tool, manual count, customer interview) or drop the metric."
- **A risk with no mitigation.** → "Risk <X> has no mitigation. Add one or remove the risk."
- **A slice with no observable demo outcome.** → "Slice <N> has no observable demo outcome. If it's a refactor, it's not a slice — fold into the slice it supports."
- **Slice 1 is not a walking skeleton (touches < all layers needed for end-to-end demo).** → "Slice 1 must demo end-to-end. Currently touches only <layers>. Either thicken slice 1 or move the missing layer in."
- **Out-of-scope item with no reason.** → "Add a one-line reason for why <X> is out of scope."
- **Test shape per slice missing for any slice.** → "Slice <N> has no test shape entry (unit / integration / e2e / a11y). Either fill it or mark `n/a` with reason. Cross-cutting must-fix from walkthrough-2 critique pass."
- **Slice 1 demo readiness checklist missing.** → "Slice 1 has no demo readiness checklist. First-demo risk is unprotected — add at minimum: pre-vetted demo content, dependency-failure fallback rehearsed, defect/known-bad example off-camera."
- **External-dependency PRD with no Technical failure modes subsection.** → "PRD names <vendor / API> as a dependency but Risks has no Technical failure modes. Spec at minimum: unavailable behaviour, idempotency, vendor lock-in mitigation."
- **Translated / localised content with no `lang` attribute requirement in Design pointers A11y.** → "PRD ships content in non-default languages. The `lang` attribute is non-negotiable for screen readers. Add to Design pointers A11y."
- **Build handoff section missing.** → "Build handoff section required when the PRD will be picked up in a different repo from the vault. Add the repo-split callout, Plan-mode-in-codebase-repo instructions, handoff snapshot table, and source-of-truth rule."
- **Body Status line out of sync with frontmatter pipeline state.** → "Frontmatter says `lifecycle: <X>` / `critique_status: <Y>` / `design_pass_status: <Z>` but body Status line doesn't reflect that. Update the body Status line so external reviewers can see pipeline state without parsing YAML."

---

## Conversational style

Tight. Lead with the file path and what was generated. **No platitudes** ("here's a great PRD!"). The PRD is the artefact; the skill's job is to produce it, not to celebrate it.

Good: *"Drafted to `06-Resources/PRDs/Multilingual_Content.md`. 5 slices, slice 1 walking skeleton (~4hr build), 6 open questions (none block slice 1). Suggest running `/critique-product-custom` + `/critique-engineering-custom` next."*

Bad: *"I've created a comprehensive PRD that captures all the key requirements..."*

---

## Refusals

The skill will not:

- Draft without a discovery output OR `--no-discovery` reason.
- Silently overwrite an edited PRD (Idempotence rule).
- Ship a section in skeleton form ("[TBD]", "[research needed]"). If the skill can't fill a section, it asks the user for the missing info.
- Mix the bond_v1 shape with other shapes. If user wants the WP+BDD shape, redirect to `/agent-prd`.
- Propose code (that's the build agent's lane).
- Replace the critique loop. After authoring, the skill **suggests** running critique skills; it does not run them itself.

---

## Loop integration

This skill is the **third step** in the idea→discovery→PRD→build pipeline:

1. `/initiative-discovery-custom` → produces discovery output (this skill's input).
2. *(optional)* `/critique-product-custom` + `/critique-engineering-custom` on the **discovery** itself, before promotion to PRD.
3. **`/prd-author-custom`** → produces draft PRD.
4. `/critique-product-custom` + `/critique-engineering-custom` → critique the draft PRD.
5. Author folds must-fixes; optionally re-runs `/prd-author-custom` to regenerate. **Idempotence rule applies** — author edits are protected.
6. PRD ships to Cursor Plan mode via the `plan-mode-seed` fence.

The skill does **not** run critique skills automatically. It surfaces the suggestion as a next-step recommendation.

---

## Scope (in / out, v1)

**In:** Producing a `bond_v1` shape PRD from a discovery output. Idempotent rewrites. Reshaping legacy PRDs to `bond_v1`. Refusing on missing input or contract violations.

**Out (v1):** Running discovery itself (that's `/initiative-discovery-custom`). Running critique (that's the critique skills). Implementing the PRD (that's the build agent / Cursor Plan mode). Creating Linear / Jira issues from the PRD (separate skill, future).

---

## Reference examples (canonical bond_v1 references)

Four PRDs in vault are authored in this exact shape and have all bond_v1 must-fixes folded:

1. [`06-Resources/PRDs/Multilingual_Content.md`](../../../06-Resources/PRDs/Multilingual_Content.md) — single-feature PRD; first walkthrough; M + Q surfaced 1 GAP + 5 SOFTs (product), 5 GAPs (engineering); all folded.
2. [`06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md`](../../../06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md) — cross-PRD initiative; Walkthrough 2; demonstrates cross-PRD slice dependencies in the bond_v1 shape.
3. [`06-Resources/PRDs/Employee_Chat_and_Groups.md`](../../../06-Resources/PRDs/Employee_Chat_and_Groups.md) — reshaped from agent-prd shape; demonstrates `--reshape` mode; ADR-gated (slice 1 cannot enter spec_ready until Q1 lands).
4. [`06-Resources/PRDs/AI_Assistant_FAQ.md`](../../../06-Resources/PRDs/AI_Assistant_FAQ.md) — reshaped; demonstrates engine-shared coordination with the chat-surface PRD; vendor-locked engine forcing the forward-compatible-shape pattern in Risks.

The skill's output should match these files' structure exactly — including frontmatter shape, section order, table column structure, and footer line attribution.

---

## Cross-cutting findings — promoted into bond_v1

The bond_v1 shape was extended on 2026-04-29 after walkthrough-2's six critique runs surfaced patterns worth promoting from "fix per PRD" to "required by skill":

- **Test shape per slice** (5b) — was a GAP on every PRD critiqued. Now required.
- **Slice 1 demo readiness** (5c) — was SOFT on every product critique. Now required.
- **Technical failure modes** subsection in Risks (7) — was GAP on engineering-heavy PRDs. Now required for any PRD with external dependencies.
- **A11y subsection** in Design pointers (10) — `lang` attribute on translated content was the original walkthrough-1 catch. Now non-negotiable.
- **Build handoff** (11) — addresses the GitHub-vault → codebase-repo split (e.g. vault on GitHub, code on Bitbucket). Without it, the developer in the codebase-repo Cursor environment has no operational pickup contract. Added 2026-04-29.

Cross-cutting findings ledger: [`plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md`](../../../plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md).

---

*Created 2026-04-29 to replace the persona-named bond / agent-prd-bond proposal. Coexists with `/agent-prd` (different shape, different downstream consumer). bond_v1 spec extended 2026-04-29 with cross-cutting findings from walkthrough-2 (test shape per slice, demo readiness, technical failure modes, a11y, build handoff). Validated against four PRDs in vault — those files are the canonical bond_v1 references.*
