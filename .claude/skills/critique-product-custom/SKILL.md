---
name: critique-product-custom
description: Product / outcome / UX-risk critique pass on a draft plan, PRD, or sprint seed before Build mode starts. Returns a 7-row scorecard (PASS/SOFT/GAP) + concrete must-fixes. Use when an artefact is drafted and the question is "is this product-honest before we build?" Pairs with /critique-engineering-custom.
---

# Critique — Product (custom)

**What this skill does.** Reads a draft product artefact (Plan-mode plan, PRD, sprint seed, brief) and returns a tight scorecard of where it's product-honest and where it'll bite at the first real demo. Does **not** propose code, write the plan, or replace the engineering critique — that's `/critique-engineering-custom`.

**`-custom` suffix** keeps it protected from `/dex-update` overwrites. Edit this file directly.

**Companion:** [`critique-engineering-custom/SKILL.md`](../critique-engineering-custom/SKILL.md) — paired engineering critique, usually run together. See **Pair protocol** below.

---

## When to invoke

- A plan / PRD / seed has been drafted and needs a product critique **before** Build mode.
- The user explicitly says "critique this plan", "run product critique", "M+Q pass", "is this product-ready", or asks for a CPO-style pass.

Invocation shapes:

```
/critique-product-custom                   # critique active artefact / open file
/critique-product-custom <file>            # critique a specific plan / PRD / seed file
/critique-product-custom seed <seed-file>  # critique a sprint seed before plan-creation
```

---

## Repo anchors (always load these before critiquing)

1. **The artefact under review** — read it end-to-end before talking.
2. **PRD context (if a PRD is under review):** any PRDs in `06-Resources/PRDs/` linked via `related_prds:` frontmatter. They define the surface boundaries this artefact crosses or respects.
3. **PDLC context (if a PDLC plan is under review):**
   - [`plans/PDLC_UI/plan.md`](../../../plans/PDLC_UI/plan.md) — north star, R-numbered requirements, Phase 5 decisions, MVP bars.
   - [`plans/PDLC_UI/sprint-backlog.md`](../../../plans/PDLC_UI/sprint-backlog.md) — current sprint shape + DoD + Bar split.
   - [`plans/PDLC_UI/lifecycle-transitions.md`](../../../plans/PDLC_UI/lifecycle-transitions.md) — column rules, gates.
   - [`plans/PDLC_UI/plan-mode-prelude.md`](../../../plans/PDLC_UI/plan-mode-prelude.md) — Plan-mode output contract.
4. **ICP (if a customer / market claim is under review):** [`System/icp.md`](../../../System/icp.md) — strategic-fit anchor.

If a personal-vault file is in scope (weekly priorities, customer evidence, meeting notes), prefer **`qmd query`** over grep per [`.cursor/rules/search-routing.mdc`](../../../.cursor/rules/search-routing.mdc).

---

## What the skill evaluates (the 7-row checklist)

Run **every** artefact against this checklist. Score each row **PASS / SOFT / GAP**. A single GAP blocks a clean handoff to Build.

| # | Row | The skill asks | GAP if… |
|---|-----|----------------|---------|
| 1 | **Outcome integrity** | What user/business outcome shifts when this ships? Will the first real Steerco / dogfood / customer-visible moment notice? | Artefact ships craft without changing an observable user moment. The first slice's "demo" is to engineering, not to a stakeholder, **and** the artefact frames it as customer-noticeable. |
| 2 | **First-demo risk** | If we demoed this on a real initiative tomorrow, what's the most embarrassing thing that could happen **in the room**? Is it covered by demo prep? | Risks section is technical (covered by `/critique-engineering-custom`) but the actual-demo content is unprepared. E.g. "translation quality could embarrass us in front of execs" with no script for which posts to demo on. |
| 3 | **Honesty of asks** | Does the artefact ask the user (PM, Steerco, designer) for evidence they actually have at this stage of the journey? | Artefact asks for data the user doesn't yet have. E.g. "engagement parity within 15% within 60 days" with no baseline measurement in place. |
| 4 | **Cohesion vs craft** | Does the artefact move the journey forward as a **whole**, or just polish one surface while the next is broken? | One screen gets love; the seam to the next column / surface is ignored. Translated post + untranslated comments below it = visible seam. |
| 5 | **Bar discipline** | MVP bar vs next-bar vs Phase 2 — anything bleeding upward in scope? Any vague "audit then wire" that could explode? | Next-bar / Phase-2 work has crept into the current artefact without an ADR or scope-lock. |
| 6 | **Out-of-scope hygiene** | Are out-of-scope items protected? Will any of them get pulled in mid-Build? Does the artefact silently modify a sibling PRD's surface? | Artefact lists items as out-of-scope but the body adds them anyway. Or modifies another PRD's feature surface without a coordination note to that PRD's owner. |
| 7 | **Reversibility** | If this turns out wrong in a week, can we back out cleanly? Or do we own a one-way door? | Artefact introduces irreversible UX habits / data shapes / vendor lock-in without an ADR or mitigation. |

For each **GAP** or **SOFT**, the skill produces **one concrete must-fix** that the artefact author can fold in without redesigning the whole thing.

### Row-by-row guidance

- **Outcome integrity ≠ feasibility.** Whether a slice is *buildable* is engineering's lane. Whether shipping it changes a user moment is product's lane.
- **First-demo risk is room-flavoured.** Translation produces a stilted howler in front of execs → product. Translation API rate-limits at 10rps → engineering.
- **Honesty of asks** is the row that catches aspirational metrics. If a metric requires baseline data the team doesn't have, it's aspirational, not measurable. Force the rewrite to something verifiable at slice ship.
- **Cohesion vs craft** is the row that does the most work. Look for visible seams between this artefact and adjacent surfaces.
- **Out-of-scope hygiene** has a sibling-surface variant: if the plan modifies another PRD's feature surface, flag it. Mid-Build creep into a sibling PRD is the hidden form of this gap.

---

## Anti-patterns the skill flags on sight

- "We'll add the test later" on a flow that's about to be the demo.
- A required field that the user has to lie to answer.
- A summary screen that just lists fields back without synthesis.
- Two buttons whose copy doesn't tell the user what is different.
- A drag affordance with no keyboard story.
- Density / view toggles with no persistence.
- Plans that say "out of scope" but quietly add the scope to a deliverable.
- Re-asking a question the previous skill / step already answered.
- "We'll backfill the docs" — same-PR documentation discipline violation in waiting.
- A success metric whose baseline doesn't exist in the system today.
- Slice 1 framed as customer-noticeable when it's actually engineering-only.

---

## Output format (verdict + recs)

```
[Critique — Product on <artefact name>]

Outcome integrity:    PASS | SOFT | GAP — <one sentence>
First-demo risk:      PASS | SOFT | GAP — <one sentence>
Honesty of asks:      PASS | SOFT | GAP — <one sentence>
Cohesion vs craft:    PASS | SOFT | GAP — <one sentence>
Bar discipline:       PASS | SOFT | GAP — <one sentence>
Out-of-scope hygiene: PASS | SOFT | GAP — <one sentence>
Reversibility:        PASS | SOFT | GAP — <one sentence>

Must-fix (fold into artefact before Build):
  P1. <specific, artefact-shaped change>
  P2. ...

Nice-to-have (track but don't block):
  P-NTH.1. ...

Verdict: READY FOR BUILD | RETURN TO PLAN
```

The skill never ships "mostly ok". One unresolved GAP = RETURN TO PLAN.

---

## Pair protocol (product + engineering critique)

For cross-functional artefacts, **product runs first** (frames *what* we're shipping), then [`/critique-engineering-custom`](../critique-engineering-custom/SKILL.md) runs **second** (tells us if the framing is buildable). The artefact author folds **both** sets of must-fixes in a single edit, under a heading: **"Net product + engineering recommendations applied"**.

**Why this order:** product reframes intent; engineering tells us if the reframe is buildable. If engineering runs first, alternatives sometimes optimise for a thing product would have killed.

**Conflict resolution:** if the two critiques disagree, the artefact author picks one and notes the trade-off in the artefact body. Neither critique skill has a veto.

---

## Conversational style

Tight. Lead with the verdict. One sentence per row. Quote the file + line when blocking. **No platitudes** ("looks good overall"). Direct, opinionated, never operational — the skill decides whether the artefact is product-honest, not how to fix the code.

Good: *"Honesty of asks: GAP — the brief asks for engagement-parity baseline; the team has no baseline measurement in place. Drop the metric or replace with one measurable at slice ship."*

Bad: *"This plan looks pretty solid, but you might want to consider..."*

---

## Refusals

The skill will not:

- Critique an artefact it hasn't read end-to-end (read first, then talk).
- Replace engineering critique (that's `/critique-engineering-custom`'s lane).
- Propose code (that's the build agent's lane).
- Bless an artefact with an open GAP — return it to plan.

---

## Scope (in / out, v1)

**In:** Product / outcome / UX-risk critique of any draft plan, PRD, or sprint seed. Identifying first-demo risk. Pairing with `/critique-engineering-custom`.

**Out (v1):** Authoring the artefact. Implementing fixes. Replacing the sprint backlog (the skill critiques against it). Any Build-mode action.

---

## Loop integration

This skill is part of the idea→discovery→PRD→build pipeline:

1. `/initiative-discovery-custom` produces discovery output (incl. `candidateSlices[]`).
2. `/prd-author-custom` produces a draft PRD.
3. **`/critique-product-custom`** + `/critique-engineering-custom` evaluate the draft.
4. Author folds must-fixes; optionally re-runs critique.
5. PRD ships to Plan mode in Cursor via the `plan-mode-seed` block.

`/critique-product-custom` is the product-side gate at step 3. RETURN TO PLAN sends the author back to step 2.

---

*Replaces `agent-m-cpo-custom` (the M / 007 persona-named version). Same 7-row checklist; persona stripped, job described in the name. Validated 2026-04-29 against `06-Resources/PRDs/Multilingual_Content.md` — surfaced 1 GAP + 5 SOFTs that would have shipped silently.*
