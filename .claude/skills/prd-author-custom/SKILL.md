---
name: prd-author-custom
description: Draft a slice-shaped PRD (bond_v1 output shape) from an /initiative-discovery-custom output. Produces a PRD with frontmatter, Goal, Users, Success metrics, Requirements, Slices table, Plan-mode-seed block (1:1 mapping for Cursor Plan mode), Risks (with mitigation per risk), Out of scope (with reasons + future-cycle flags), Open questions, and Design pointers. Idempotent. Refuses to overwrite an edited PRD silently. Pairs with /critique-product-custom + /critique-engineering-custom.
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
related_prds:
  - <Sibling_PRD>.md  # PRDs whose surface this PRD touches
discovery_skipped_reason: <one line, only if --no-discovery used>  # otherwise omit
---
```

### Header

```markdown
# <Feature Name>

**Status:** <one-line status — e.g. "First draft, ready for product + engineering critique.">
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
   
   After the table, a **"Slicing rules applied"** subsection explicitly notes which rules were applied and any edge cases.

6. **Plan mode seed** — a fenced ` ```plan-mode-seed ` block, mechanically generated from the Slices table. One line per slice. Format:
   ```
   Slice <N>: <Name> — <demo outcome>. Layers: <layers>. Depends: <prev>.
   ```
   This is the **direct copy-paste into Cursor Plan mode**. The 1:1 mapping is the load-bearing contract of bond_v1.

7. **Risks** — 4–8 risks. Each risk has:
   - **Risk name** (bolded).
   - **Description** — one sentence on what could go wrong + when.
   - **Mitigation** — one sentence on the defensive move. **Required, not optional.** A risk without a mitigation is incomplete; the skill refuses to ship.

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
    - **Constraints on design** — bulleted list of "must / must not".
    - **What the designer should NOT prescribe** — bulleted list of decisions that belong to PM / engineering, not design.
    - **Design slice ordering** — mirrors the build slices, calls out which slices have design changes vs which don't.

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

## Reference example

The first PRD authored in this shape, by hand, is [`06-Resources/PRDs/Multilingual_Content.md`](../../../06-Resources/PRDs/Multilingual_Content.md). It was the test artefact for this skill's authoring; its existence proves the shape is writeable end-to-end without a skill, and its critique-pass output (M + Q surfaced 1 GAP + 5 SOFTs from product, 5 GAPs from engineering) showed which behaviours the skill should automate.

The skill's output should match that file's structure exactly — including the footer line that names the source of the draft.

---

*Created 2026-04-29 to replace the persona-named bond / agent-prd-bond proposal. Coexists with `/agent-prd` (different shape, different downstream consumer). Validated against `Multilingual_Content.md` — that file is the canonical bond_v1 reference shape.*
