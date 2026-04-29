---
name: initiative-discovery-custom
description: Per-initiative discovery research. Reads the vault (ICP, Felix's weekly intel, competitor profiles, customer-evidence meetings, related PRDs) and produces a discovery package — problem statement, user segments, stakeholders, evidence log, evidence gaps, ICP-segment match, candidate slices, open questions — that /prd-author-custom consumes. Confirms-relevance per grep hit (no stale references). Surfaces evidence gaps explicitly when the vault is sparse. Use when an idea is moving from idea→discovery and you need a defensible research package before drafting a PRD.
---

# Initiative Discovery (custom)

**What this skill does.** Takes a one-line idea or a card-state brief and produces a **discovery package** (markdown file + structured fields) that grounds the upcoming PRD in actual evidence — customer quotes, competitor moves, ICP fit, named stakeholders, known gaps. Output is the required input for `/prd-author-custom`.

**`-custom` suffix** keeps it protected from `/dex-update` overwrites.

**Companions:**
- [`weekly-market-intel-custom/SKILL.md`](../weekly-market-intel-custom/SKILL.md) — upstream weekly producer (formerly Felix). This skill reads its Friday-Signal output.
- [`prd-author-custom/SKILL.md`](../prd-author-custom/SKILL.md) — downstream consumer that takes this skill's output and drafts a PRD.
- [`critique-product-custom/SKILL.md`](../critique-product-custom/SKILL.md) + [`critique-engineering-custom/SKILL.md`](../critique-engineering-custom/SKILL.md) — optional critique passes on the discovery package itself, before promotion to PRD.

---

## Posture (must read before running)

- **Voice:** briefer — *"here's what I found, here's how confident I am, here's what I still don't know."* Never assertive without citation. Always flag confidence on inferred claims.
- **Meta-principle:** the discovery package is what a PM walks into a Steerco room with. If it reads like unsourced opinion, the skill is broken.
- **Hard exclusions:**
  - **Does not author PRDs** — that's `/prd-author-custom`.
  - **Does not run market intel from scratch** — reads the latest Friday Signal from `/weekly-market-intel-custom`. If the signal is stale, it warns + drafts an open question. Does not fall back to ad-hoc scraping.
  - **Does not author the ICP** — reads `System/icp.md` only. ICP authorship is a separate, manual decision.
  - **Does not surface internal client-activity data on any external-facing output** — Wyzetalk client account names / numbers inform reasoning but never echo into outputs.

---

## When to invoke

- An idea is moving from idea → discovery. Run this before `/prd-author-custom`.
- The user explicitly says "run discovery on <idea>", "research this", "build the discovery package", "what do we know about <X>?", or asks for a research pass on a feature concept.
- A weekly sweep on the discovery column (run by `/weekly-market-intel-custom` Friday output → revisit each in-discovery card on Monday).
- Re-run on demand when new evidence has landed (new meeting notes, new customer page, new Felix signal).

Invocation shapes:

```
/initiative-discovery-custom "<one-line idea>"           # cold start from a one-liner
/initiative-discovery-custom <brief-file>                # discovery from an existing brief / card / inbox idea
/initiative-discovery-custom --rerun <discovery-file>    # re-run on existing discovery; preserve user-edited sections
/initiative-discovery-custom --deepen <discovery-file>   # interactive pressure-test: 2-3 targeted questions to refine weakest fields
```

---

## Required reads (before the skill talks)

Always load in this order:

1. **The input** — the one-line idea, brief, or existing discovery file under `--rerun` / `--deepen`.
2. **`System/icp.md`** — ICP segments, cross-segment disqualifiers, near-neighbour competitor list. **Hard-fail if missing** — discovery without an ICP is opinion.
3. **The latest Friday Signal** — `06-Resources/Market_intelligence/synthesis/weekly/<latest>_friday_signal.md`. If mtime > 7 days, flag `felix_stale: true` and queue a warning + open-question.
4. **Related PRDs** — search `06-Resources/PRDs/*.md` for any whose titles/keywords overlap the idea. Read them; capture surface intersections; surface in the related_prds output.
5. **Competitor profiles** — `06-Resources/Competitors/profiles/*.md` filtered to the ICP-segment's near-neighbours.

If a vault file is in scope and **QMD is available**, prefer `qmd query` over grep per [`.cursor/rules/search-routing.mdc`](../../../.cursor/rules/search-routing.mdc). For code (PRDs are not code) the same routing applies.

---

## Process — six phases

### Phase 0 — Load + staleness checks (~10s)

1. Load the input. Extract: idea statement, candidate user segment(s), candidate problem area, any keywords to scan for.
2. Read `System/icp.md` `Version` line. Hard-fail with `error: "icp_missing"` if absent.
3. Check Felix freshness. If stale, queue a warning to embed in the output.
4. If `--rerun` or `--deepen`, load existing discovery file and identify which sections are user-edited (skill must preserve those).

### Phase 1 — Vault scan + relevance confirmation (~30–60s)

The skill greps / queries the vault for keyword overlap with the idea across:

- `00-Inbox/Meetings/` last 90 days
- `05-Areas/People/External/`
- `05-Areas/People/Internal/`
- `05-Areas/Companies/`
- `06-Resources/PRDs/`
- `06-Resources/Product_ideas/`
- `06-Resources/Market_and_deal_signals.md`

**Confirm-relevance per hit.** This is the load-bearing rule. For every grep hit, the skill must answer:

| Question | If yes | If no |
|----------|--------|-------|
| Is this reference still current (last touched < 6mo, or anchored to active PRD/project)? | Keep | **Discard** — note as "stale reference, not used" |
| Does the reference actually speak to this idea, or is it an incidental keyword match? | Keep | **Discard** — log the hit but note it's tangential |
| Is the reference inside an out-of-scope marker (e.g. "Future phase — not for this cycle")? | **Discard** + flag the marker — the cited place may need an update too | n/a |

**This rule was added 2026-04-29 after the multi-language walkthrough surfaced a stale "future phase" reference in `Scheduled_Content.md` that misled discovery for an hour.** Stale references are noise, not signal. The skill aggressively prunes.

### Phase 2 — Customer evidence harvest (~30s)

1. Score top-5 most-relevant meetings from Phase 1.
2. Extract direct quotes that speak to the problem statement. Each quote captured with: text, person (named), date, source path.
3. Cross-check named people against `05-Areas/People/External/` and `Internal/` — if a quote attributes to "the VP of Sales" but no person page exists, flag as evidence gap (we don't know who the VP of Sales is).
4. **Stakeholder extraction.** From the quoted meetings + people pages, identify named SMEs the PM should talk to before spec lands. Each stakeholder captured with: name, role, why they're relevant, last meeting (if any).
5. If no relevant meetings exist in the last 90 days → **evidence gap entry**: "No customer meetings touch this idea in 90d. Either (a) we have no customer evidence yet — fix before spec, or (b) the keyword scan missed; PM to confirm."

### Phase 3 — Competitor + market signal alignment (~20s)

1. Read filtered competitor profiles from `06-Resources/Competitors/profiles/*.md`.
2. For each near-neighbour, capture: name, canonical URL, one-line positioning vs Wyzetalk, whether they ship something in this idea's space, source (profile path + last_reviewed date).
3. Scan Friday Signal § "Tier 0 / 1 / 2" sections for competitor moves touching the idea's keywords.
4. **Confirm-relevance applies** — if a competitor's profile says they ship X but the profile is 8 months old, flag and downgrade confidence.
5. If the idea has no competitor coverage → evidence gap entry: "No tracked competitor ships this. Either (a) genuine whitespace, or (b) competitor research is incomplete on this surface."

### Phase 4 — ICP strategic-fit + segment match (~10s)

1. Compare the idea's user segment(s) and problem against the ICP segments in `System/icp.md`.
2. Identify which segment(s) the idea serves. Cross-segment disqualifiers: any hit produces a `caution:` note + draft open question.
3. Produce a one-sentence ICP-segment-match rationale: *"Maps to <segment(s)> via <evidence>. <Cross-segment notes if any>."*
4. If the idea doesn't map to any ICP segment → flag as a strategic-fit risk in the output. Don't auto-block; the PM may have a reason. Force them to acknowledge.

### Phase 5 — Solution-pattern survey + candidate slicing (~30s)

1. Survey how this class of problem has been solved elsewhere (competitor product lines, industry research in `06-Resources/Research/Industry_reports/<sector>/` if present).
2. Capture 2–4 solution patterns. Each: pattern name, example vendors, applicability-to-Wyzetalk one-liner, source.
3. **Candidate slicing.** Propose a first-pass slice list (`candidateSlices[]`) for the PRD author to refine:
   - **Slice 1 candidate** = walking-skeleton thesis (what's the smallest end-to-end demo?). Single sentence.
   - **Slice 2–N candidates** = thickening / extension slices. Single sentence each.
   - These are *candidates*, not commitments — `/prd-author-custom` refines them with the slicing rules.
   - 3–6 candidates typical.

### Phase 6 — Compose synthesis + open questions + evidence gaps (~15s)

1. Compose the discovery output (see Output shape below).
2. **Evidence-gap log** — explicit list of what the skill could NOT find. Examples: "no customer page for named beneficiary", "no recent meeting on this topic", "no competitor parity data on this feature", "ICP version is N but discovery against vN-1 — re-run after ICP refresh". A discovery package without an evidence-gap log is suspicious.
3. **Open questions** — every `confidence: low` field, every disqualifier hit, every contradiction across sources, every gap that requires a PM decision. Each question captured with: text, what it blocks (which slice / decision), owner, next step.
4. If `felix_stale: true`, prepend a warning to the output and add an open question: "Run `/weekly-market-intel-custom` before next discovery sweep on this card."

### Terminal — write the discovery file

Write to `06-Resources/Product_ideas/<feature-slug>_discovery.md`. Frontmatter + sections per Output shape. Idempotent rewrites — if the file exists, preserve any sections marked `<!-- user-edited -->` between markers; overwrite the rest.

---

## Output shape

```markdown
---
discovery_id: <feature-slug>-YYYY-MM-DD
created_date: YYYY-MM-DD
last_run_at: YYYY-MM-DD HH:MM
iteration: <N>
icp_version_at_run: <icp version line>
felix_signal_at_run: <Friday Signal date or "stale: <N> days">
related_prds: [<PRD>.md, ...]
ready_for_prd: true | false
ready_for_prd_blockers: [<open-question id>, ...]  # only if false
---

# Discovery — <Feature / Idea Name>

**Status:** <one line — e.g. "First-pass discovery; ready for /prd-author-custom" or "Blocked on Q3 (Jan conversation)">

---

## Problem statement

<One paragraph, evidence-grounded. Names the problem in user-observable terms, not solution terms. Cites the strongest 2-3 evidence sources by path.>

---

## User segments

**Primary:** <segment / role>. <one paragraph: who they are, what they care about, where the problem hits them>.

**Secondary:** <segment / role, if any>. <one paragraph each>.

**Out of scope (this initiative):** <segments deliberately not served, with one-line reason each>.

---

## ICP segment match

<One sentence: which ICP segment(s) this serves and via what evidence. Cross-segment disqualifier notes if any.>

---

## Stakeholders (named SMEs to talk to before spec)

| Name | Role | Why relevant | Last meeting / page |
|------|------|--------------|---------------------|
| <Name> | <role> | <one line> | <path or "no meeting"> |

---

## Customer evidence

| # | Quote | Person | Date | Source |
|---|-------|--------|------|--------|
| 1 | "<verbatim quote>" | <Name> | YYYY-MM-DD | <path> |

<If empty: "No customer meetings in 90d touch this directly. See Evidence gaps.">

---

## Competitor + market signal

| Name | URL | Positioning vs Wyzetalk | Source / last reviewed |
|------|-----|--------------------------|-------------------------|

<Plus 2-4 sentences synthesising what the Friday Signal says about competitor moves on this surface.>

---

## Solution patterns (how others have solved this class of problem)

| Pattern | Example vendors | Applicability to Wyzetalk | Source |
|---------|-----------------|----------------------------|--------|

<2-4 entries. Always include at least one build-vs-buy candidate and at least one anti-pattern if industry research surfaces one.>

---

## Candidate slices (first-pass — /prd-author-custom refines)

| # | Candidate slice (one sentence) |
|---|--------------------------------|
| 1 | **Walking skeleton candidate:** <smallest end-to-end demo, one sentence> |
| 2 | <thickening / extension candidate> |
| ... | ... |

**Candidate count:** <3–6>. **Walking-skeleton confidence:** <high / med / low>.

---

## Evidence gaps

Explicit list of what discovery could NOT find. The PM uses this to decide whether to backfill before spec.

- **<Gap title>.** <one sentence: what's missing + why it matters>. **Backfill move:** <how to close — e.g. "Schedule a call with <person>", "Run a customer survey", "Wait for next Felix sweep">.
- ...

---

## Open questions

| # | Question | Blocks | Owner | Next step |
|---|----------|--------|-------|-----------|

<Every low-confidence field, every contradiction, every disqualifier-hit becomes an entry. "None of these block the PRD if X assumed" subsection at the end if applicable.>

---

## Stale references found + discarded

<For full transparency. The skill ran the relevance-confirmation rule and pruned these — listed so a curious PM can audit.>

- `<path>:<line>` — <one-line reason for discard, e.g. "marker says future phase; not used in this cycle">.

---

*Generated by `/initiative-discovery-custom`. ICP version at run: <version>. Felix signal at run: <date>. Run <N>; last run YYYY-MM-DD HH:MM.*
```

---

## What the skill enforces (refusal list)

- **No `System/icp.md`** → hard-fail. Discovery without ICP is opinion.
- **No problem statement supplied** (cold start with no input or unintelligible input) → ask for a one-liner before continuing.
- **`--deepen` on a discovery file with no `confidence: low` fields and no open questions** → "Nothing weak to pressure-test. Either the package is good, or run `--rerun` to refresh against new vault evidence."
- **Stale reference re-confirmed without explicit override** → discard. The PM can mark `<!-- keep-stale -->` in the output if they really want to retain a stale citation; the skill respects that marker on subsequent runs.

---

## `--rerun` semantics

- **User-edited sections** (anything between `<!-- user-edited -->` markers, or anywhere a `reviewedBy:` field is set in metadata) → preserved verbatim.
- **Skill-drafted sections** → overwritten with fresh draft.
- **Open questions** → drafts are dedup'd against existing entries by text. Resolved questions stay resolved.
- **Stale-reference discards** → tracked in the "Stale references found + discarded" section across runs (audit trail).

---

## `--deepen` semantics

Interactive pressure-test session. The skill loads the discovery file, identifies the 2–3 weakest fields (lowest confidence + no source), and asks targeted questions:

- *"Customer evidence is thin for <segment>. Is there a relevant meeting I missed?"*
- *"Solution pattern <X> has thin applicability — does competitor Y's recent move change the shape?"*
- *"Open question Q3 — do you have an answer now, or should it stay open?"*

Conversational, not a wizard. PM-confirmed answers update the discovery file with `reviewedBy: <user>` metadata so subsequent `--rerun`s preserve them.

---

## Conversational style

Tight. Lead with what was found and where. **Cite paths**. Flag confidence. Don't claim what isn't sourced.

Good: *"Discovery written to `06-Resources/Product_ideas/multilingual_content_discovery.md`. 5 candidate slices, slice 1 confidence high (walking skeleton: hardcoded reader sees Afrikaans translation). 6 open questions, 3 evidence gaps. Felix signal current. Suggest `/prd-author-custom` next."*

Bad: *"I've researched this thoroughly and have lots of insights..."*

---

## Refusals

The skill will not:

- Run without `System/icp.md`.
- Author the PRD itself (that's `/prd-author-custom`).
- Run market intel scraping (that's `/weekly-market-intel-custom`'s lane).
- Author the ICP (manual / one-off decision).
- Echo internal client-activity numbers / account names into the output.
- Treat a stale "future phase" reference as live evidence.

---

## Loop integration

This skill is the **first step** in the idea→discovery→PRD→build pipeline:

1. **`/initiative-discovery-custom`** → produces discovery package.
2. *(optional)* `/critique-product-custom` + `/critique-engineering-custom` on the discovery itself, before promotion to PRD.
3. `/prd-author-custom` → drafts the PRD using this skill's output.
4. `/critique-product-custom` + `/critique-engineering-custom` → critique the draft PRD.
5. Author folds must-fixes; iterates.
6. PRD ships to Cursor Plan mode via plan-mode-seed.

---

## Scope (in / out, v1)

**In:** Producing a discovery package from a one-line idea or existing brief. Vault scan + relevance confirmation. ICP cross-check. Customer-evidence + competitor + solution-pattern + candidate-slice synthesis. Evidence-gap log. Open questions. `--rerun` and `--deepen` modes.

**Out (v1):**
- Authoring PRDs (`/prd-author-custom`).
- Running market intel scraping (`/weekly-market-intel-custom`).
- Authoring the ICP (manual decision).
- Persisting to `pdlc-ui` runtime card-state (parked; this skill is markdown-native).
- Multi-card weekly sweep orchestration (separate wrapper if/when revived).

---

## Related

- [`System/icp.md`](../../../System/icp.md) — ICP source of truth.
- [`/weekly-market-intel-custom`](../weekly-market-intel-custom/SKILL.md) — upstream weekly producer.
- [`/prd-author-custom`](../prd-author-custom/SKILL.md) — downstream consumer.
- [`/critique-product-custom`](../critique-product-custom/SKILL.md), [`/critique-engineering-custom`](../critique-engineering-custom/SKILL.md) — critique passes.
- `06-Resources/Competitors/profiles/` — competitor reference.
- `06-Resources/Market_intelligence/synthesis/weekly/` — Friday Signal source.

---

*Replaces `moneypenny-custom` (the Moneypenny / 007 persona-named version). Decoupled from the parked `pdlc-ui` runtime — markdown-native output. Bakes in three behaviours validated 2026-04-29 during the multi-language manual walkthrough: (a) Confirm-relevance per grep hit (catches stale future-phase references), (b) Evidence-gap detection (explicit log when vault is sparse), (c) `candidateSlices[]` output for the downstream PRD author.*
