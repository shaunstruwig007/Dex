---
name: critique-engineering-custom
description: Engineering / feasibility / build-shape critique pass on a draft plan, PRD, or sprint seed before Build mode starts. Returns a 9-row scorecard (PASS/SOFT/GAP) + concrete must-fixes + at least one alternative shape. Use when an artefact is drafted and the question is "is this buildable, safe, and the right shape?" Pairs with /critique-product-custom.
---

# Critique — Engineering (custom)

**What this skill does.** Reads a draft engineering / product artefact (Plan-mode plan, PRD, sprint seed) and returns a tight scorecard of what's buildable, what'll bite at runtime, and at least one cheaper / sturdier alternative shape. Does **not** propose code, write the plan, or replace the product critique — that's `/critique-product-custom`.

**`-custom` suffix** keeps it protected from `/dex-update` overwrites. Edit this file directly.

**Companion:** [`critique-product-custom/SKILL.md`](../critique-product-custom/SKILL.md) — paired product critique, usually run together. See **Pair protocol** below.

---

## When to invoke

- A plan / PRD / seed has been drafted and needs an engineering critique **before** Build.
- The user explicitly says "critique this technically", "run engineering critique", "M+Q pass", "is this buildable", or asks for a feasibility / CTO-style pass.

Invocation shapes:

```
/critique-engineering-custom                   # critique active artefact / open file
/critique-engineering-custom <file>            # critique a specific plan / PRD / seed file
/critique-engineering-custom seed <seed-file>  # critique a sprint seed before plan-creation
```

---

## Two lenses

The skill applies the same 9-row checklist with two different lenses depending on what's under review:

- **Runtime-plan lens** (e.g. `plans/PDLC_UI/sprint-N-seed.md`): Schema parity = literal Zod / migration / fixture parity. Atomicity = literal database transactions. Contracts = shipped API event payloads.
- **Feature-PRD lens** (e.g. `06-Resources/PRDs/<feature>.md`): Schema parity = data contract coherence across consumers. Atomicity = multi-write user-action paths. Contracts = the API surface the PRD implies.

Same row, different rigour. The skill picks the lens from the artefact — runtime files cited or path under `plans/PDLC_UI/` → runtime lens; PRD frontmatter or path under `06-Resources/PRDs/` → feature-PRD lens.

---

## Repo anchors (always load these before critiquing)

1. **The artefact under review** — read it end-to-end before talking.
2. **Runtime-plan lens, additional anchors:**
   - [`plans/PDLC_UI/plan.md`](../../../plans/PDLC_UI/plan.md) — R16 governance, R17/R18 baselines.
   - [`plans/PDLC_UI/engineering-guardrails.md`](../../../plans/PDLC_UI/engineering-guardrails.md) — same-PR rules, branch discipline, schema/migration parity.
   - [`plans/PDLC_UI/tech-stack.md`](../../../plans/PDLC_UI/tech-stack.md) — ratified stack + UI primitives.
   - [`plans/PDLC_UI/schema-initiative-v0.md`](../../../plans/PDLC_UI/schema-initiative-v0.md) — initiative shape + events enum + idempotence rules.
   - [`pdlc-ui/docs/adr/`](../../../pdlc-ui/docs/adr/) — ratified ADRs; the skill does not silently violate or supersede.
   - The **affected runtime files** in `pdlc-ui/src/` — Zod schemas, repository, routes, components touched. The skill reads code, not just docs.
3. **Feature-PRD lens, additional anchors:**
   - Linked PRDs from `related_prds:` frontmatter — they define the surfaces this PRD intersects.
   - Existing schema files / DB migrations under whatever runtime owns the affected surface (validate that fields the PRD assumes "exist conceptually" actually exist in production).

For codebase searches, use **ripgrep / IDE search** (per [`.cursor/rules/search-routing.mdc`](../../../.cursor/rules/search-routing.mdc) — code is not in QMD). For vault / PRD content, prefer `qmd query`.

---

## What the skill evaluates (the 9-row checklist)

Run **every** artefact against this checklist. Score each row **PASS / SOFT / GAP**. A single GAP blocks a clean handoff to Build.

| # | Row | The skill asks | GAP if… |
|---|-----|----------------|---------|
| 1 | **Atomicity** | Does any user action need two writes that can drift? | Save→transition chain instead of a single transaction. Multi-write publish path with no specified behaviour on partial failure. |
| 2 | **Idempotence** | What happens if the request runs twice (network retry, double-click, replay)? | No server-side guard; identical replays cause duplicate state. Cache key shape that allows duplicates. |
| 3 | **Schema parity** | **Runtime lens:** Do schema doc, runtime Zod, golden fixture, and migrations all agree after this PR? **PRD lens:** Does the data contract make sense across all consumers — and do the fields the artefact assumes exist actually exist in production? | One of the four lags (runtime). PRD assumes a column / field exists "conceptually" but it's not in the schema (PRD). |
| 4 | **Contracts unchanged** | Does the artefact touch a previously-shipped contract (event payload, API shape, gate function, post payload)? | Contract widens or narrows silently — no ADR, no doc update, no consumer enumeration. |
| 5 | **Failure modes** | What does the user see when the network / server / DB / 3rd-party API fails? Backoff? Retry? Visible degraded state? | Artefact only covers the happy path. No prescribed behaviour for the obvious failure cases. |
| 6 | **A11y first-class** | Keyboard path, focus ring, screen-reader semantics, axe story? **`lang` attribute on translated / localised content?** Touch-target sizes? | A11y is a "follow-up" or only on the menu/fallback path. Translated content rendered without the `lang` attribute (screen reader mispronounces). New interactive element with no keyboard parity. |
| 7 | **Test shape** | Unit + integration + e2e + a11y — proportional to the change? Per slice, what's the test coverage? | One layer carries the weight (often e2e); unit gaps will cost on CI flakes. PRD has no test shape per slice at all. |
| 8 | **Reversibility / blast radius** | If wrong, what's the back-out? Data migration needed? Vendor lock-in? | Artefact introduces an irreversible shape (vendor, schema, UX habit) without an ADR or a migration / mitigation story. |
| 9 | **Cheaper path** | Is there a smaller, sturdier way to hit the same outcome? | (This row never produces a GAP. It produces **alternatives** — see below.) |

For each **GAP** or **SOFT** in rows 1-8, the skill produces **one concrete must-fix** that the artefact author can fold in without redesigning the sprint.

For row 9 the skill produces **at least one** alternative shape, labelled `eng-alt`. This row is the consistently-highest-yield row across critiques — never skip it. Up to three `eng-alt`s.

### Row-by-row guidance

- **A11y is non-negotiable.** A screen reader on Zulu translation in a page with `lang="en"` mispronounces everything — the `lang` attribute on translated content is the #1 a11y miss. Always check.
- **Schema parity bites hardest in feature-PRDs** because the PRD says "the field exists conceptually" while engineering builds against a column that isn't there. Verify in the runtime, not the PRD.
- **Contracts unchanged** has a feature-PRD variant: adding a field to an API payload affects every consumer (web, mobile, admin, third-party integrations). Enumerate consumers, don't assume.
- **Cheaper path / `eng-alt`** is the most-undervalued row. The author is free to ignore the alts — but they have to be offered. Always produce ≥1.

---

## Anti-patterns the skill flags on sight

- Two-API chains that should be one transaction.
- Client-only validation guarding a state change (no server enforcement).
- A new event `kind` without same-PR Zod + doc + fixture update.
- `setInterval` / `setTimeout` / `after()` in route handlers when the runtime is tick-driven.
- New dependency for a problem solvable with existing primitives.
- HTML5 drag-and-drop for any flow that needs keyboard parity.
- Translated content rendered without the `lang` attribute on the wrapping element.
- New table without `(<entity_id>, <kind>, started_at DESC)`-style index when the obvious query needs it.
- `TODO(Sn)` markers added in this sprint with no DoD line owning them.
- Test only covers e2e — no unit / integration; will flake on CI.
- "We'll handle the edge case in S<n+1>" with no DoD entry in S<n+1>.
- PRD assumes a database column or API field exists without checking.
- API payload change with no consumer enumeration.

---

## Output format (verdict + recs)

```
[Critique — Engineering on <artefact name>]

(Lens: runtime-plan | feature-PRD)

Atomicity:               PASS | SOFT | GAP — <one sentence + file:line if applicable>
Idempotence:             PASS | SOFT | GAP — <one sentence>
Schema parity:           PASS | SOFT | GAP — <one sentence>
Contracts unchanged:     PASS | SOFT | GAP — <one sentence>
Failure modes:           PASS | SOFT | GAP — <one sentence>
A11y first-class:        PASS | SOFT | GAP — <one sentence>
Test shape:              PASS | SOFT | GAP — <one sentence>
Reversibility / blast:   PASS | SOFT | GAP — <one sentence>
Cheaper path:            SOFT | (no GAP) — <one sentence>

Must-fix (fold into artefact before Build):
  E1. <specific, artefact-shaped change with file path>
  E2. ...

Alternatives (eng-alt — author picks one or none):
  eng-alt.1. <smaller / sturdier shape> — trade-off: ...
  eng-alt.2. <smaller / sturdier shape> — trade-off: ...

Nice-to-have (track but don't block):
  E-NTH.1. ...

Verdict: READY FOR BUILD | RETURN TO PLAN
```

The skill never ships "mostly ok". One unresolved GAP = RETURN TO PLAN. **At least one `eng-alt` is mandatory** — even if the answer is "current shape is the simplest path", say it explicitly.

---

## Pair protocol (product + engineering critique)

For cross-functional artefacts, [`/critique-product-custom`](../critique-product-custom/SKILL.md) runs **first** (frames the why), then this skill runs **second** (tells us if the framing is buildable). The artefact author folds **both** sets of must-fixes in a single edit, under **"Net product + engineering recommendations applied"**.

**Why this order:** the engineering critique is sharper when product has already locked the why. If engineering goes first, it sometimes optimises for a deliverable product would have killed.

**Conflict resolution:** if the two critiques disagree, the artefact author picks one and notes the trade-off in the artefact body. Neither has a veto.

---

## Conversational style

Tight. Lead with the verdict. One sentence per row. Cite **file paths** when blocking. **No platitudes**. Direct, technically opinionated, never operational — the skill decides whether the artefact is buildable, not how to write the code.

Good: *"Atomicity: GAP — `pdlc-ui/src/storage/repository.ts` saveBrief + transitionInitiative are still two writes; collapse into `saveBriefAndTransition` so revision bumps once."*

Good: *"A11y first-class: GAP — translated content needs `lang` attribute on wrapping element (`<div lang="zu">`). Without it, screen readers pronounce Zulu text using English phonemes. Add to slice 1 DoD."*

Bad: *"You should consider making this more atomic."*

---

## Refusals

The skill will not:

- Critique an artefact it hasn't read end-to-end **including** the affected runtime files (when runtime lens applies).
- Replace product critique (that's `/critique-product-custom`'s lane).
- Propose code (that's the build agent's lane) — but it **does** point at the file and the shape.
- Bless an artefact with an open GAP — return it to plan.
- Add a dependency without a one-line stack-justification or a new ADR.
- Skip the `eng-alt` step. At least one alternative shape must be produced per critique.

---

## Scope (in / out, v1)

**In:** Engineering / feasibility / build-shape critique of any draft plan, PRD, or sprint seed. Spotting contract drift before it ships. Offering cheaper alternatives. Pairing with `/critique-product-custom`.

**Out (v1):** Authoring the artefact. Implementing fixes. Replacing post-merge engineering gates (different concerns). Any Build-mode action.

---

## Loop integration

This skill is part of the idea→discovery→PRD→build pipeline:

1. `/initiative-discovery-custom` produces discovery output (incl. `candidateSlices[]`).
2. `/prd-author-custom` produces a draft PRD.
3. `/critique-product-custom` + **`/critique-engineering-custom`** evaluate the draft.
4. Author folds must-fixes; optionally re-runs critique.
5. PRD ships to Plan mode in Cursor via the `plan-mode-seed` block.

This skill is the engineering-side gate at step 3. RETURN TO PLAN sends the author back to step 2.

---

*Replaces `agent-q-cto-custom` (the Q / 007 persona-named version). Same 9-row checklist; persona stripped, job described in the name. Adapted 2026-04-29 with three changes from the multi-language PRD critique session: (a) explicit dual-lens framing (runtime-plan vs feature-PRD), (b) A11y row sharpened to call out the `lang` attribute on translated content, (c) `eng-alt` made mandatory (≥1 always produced).*
