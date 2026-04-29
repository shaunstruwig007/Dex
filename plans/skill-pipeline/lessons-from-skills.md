# Lessons from the skill pipeline

**Status:** TWO ROUNDS SEEDED — walkthrough 1 (2026-04-29 multi-language, content-heavy) + walkthrough 2 (2026-04-29 AI alongside Employee Chat, cross-PRD + design-heavy).
**Purpose:** Capture what worked, what didn't, and what a future `pdlc-ui` would need — based on real walkthrough evidence from the chat+vault pipeline. This file seeds any future UI replan.

**Fill discipline:** After each walkthrough or significant skill iteration, append dated rows. Be specific. Cite the use case + the vault path + the time-cost, not vibes.

**Cross-reference:**
- Walkthrough 1 (multi-language) — [`sessions/2026-04-29.md`](./sessions/2026-04-29.md).
- Walkthrough 2 (AI in chat surface) — critique log at [`sessions/2026-04-29-walkthrough-2-critiques.md`](./sessions/2026-04-29-walkthrough-2-critiques.md).

---

## Walkthrough 1 — 2026-04-29 — multi-language content translation

**Use case:** Multi-language content translation for Wyzetalk Essential frontline employees (South African languages — English, Afrikaans, Zulu, Xhosa, Portuguese).
**Stretch dimension:** content-heavy. Light on design, light on novel engineering.
**Output:** [`06-Resources/PRDs/Multilingual_Content.md`](../../06-Resources/PRDs/Multilingual_Content.md).
**Wall-clock:** ~3.5 hrs (idea → discovery → ICP authoring → PRD draft → M+Q critique).

### Lessons by skill

#### S1 — `/weekly-market-intel-custom` (was Felix)

- **What worked:** the skill itself wasn't run today (no Friday signal needed for the walkthrough). The skill's role as **standalone, NOT in the pipeline** was validated by negative — discovery would have benefited from a fresh Friday Signal but the absence didn't block the walkthrough.
- **What didn't:** the existing felix-custom referenced `/moneypenny-custom` and the deleted `/gatekeeper-custom` in its downstream-handoff section. Stale references — fixed in the rename.
- **What discovery needs from weekly intel that wasn't obvious:** discovery's relevance-confirmation rule depends on the Friday Signal's `last_reviewed` markers on competitor profiles. If the signal is stale or missing, discovery's competitor data ages silently. The new discovery skill's **staleness check** (Phase 0) is now explicit about this — warns + drafts an open question.
- **Cost actual vs ceiling:** N/A this walkthrough.

#### S2 — `/initiative-discovery-custom` (was Moneypenny)

- **What worked:**
  - **Confirm-relevance per grep hit** — caught a stale "future phase — Jan to be involved when ready" reference in `Scheduled_Content.md` that had misled discovery for ~1 hour. Without aggressive pruning of stale references, discovery silently fabricates conviction. **This is now a load-bearing rule in the new skill.**
  - **Evidence-gap detection** — explicit log of what the skill *couldn't* find. Today the vault was sparse (empty Companies/, sparse Meetings/, no ICP); without the gap log, discovery would have read as confidently-incomplete. **Now a mandatory section in the discovery output.**
  - **Stakeholder extraction** — Jan came up repeatedly as the historical multi-lang owner. The skill captures this as a structured field (named SMEs to talk to before spec) rather than burying it in prose.
  - **Candidate slicing** — the discovery skill proposes a first-pass slice list that `/prd-author-custom` refines. The handoff was clean during the manual walkthrough; the candidate-to-final-slice diff was small (5 candidates → 5 final slices).
- **What didn't:**
  - **The runtime/schema-anchored `discovery.*` field complexity** from the old moneypenny skill (field envelope with confidence + source flavour + sourceRef, atomic writes, `skill_run` event emission) was over-engineered for a markdown-native skill. The walkthrough produced markdown by hand; nothing about that needed envelope plumbing. **Stripped entirely** in the new skill.
  - **Cost ceiling enforcement** ($0.50/card/run) — pdlc-ui runtime concern, not a vault-skill concern. **Stripped.**
  - **Mode A / Mode B (headless / interactive deepen) split** — over-engineered. The walkthrough was conversational throughout. New skill has one mode (chat-driven) plus optional `--rerun` and `--deepen` flags.
- **Brief-question ergonomics (why / who / what) in chat vs wizard:** N/A this walkthrough — we skipped the structured brief and went straight to discovery via narrative.
- **How much context did existing PRDs add:** material. Reading [`Profile_Users.md`](../../06-Resources/PRDs/Profile_Users.md), [`Posts.md`](../../06-Resources/PRDs/Posts.md), [`Feed.md`](../../06-Resources/PRDs/Feed.md), [`Scheduled_Content.md`](../../06-Resources/PRDs/Scheduled_Content.md) revealed the language-preference field was already-modelled-but-unexposed in Profile_Users. That single insight reshaped slice 3 of the PRD (preference UX) entirely. **The new skill's Phase 1 explicitly reads related PRDs.**
- **Cost actual vs ceiling:** N/A — manual walkthrough.

#### S3 — `/design-prompt-custom`

- **STATUS: KILLED.** Multi-language was content-heavy, light on novel design. A separate design-prompt skill produced no incremental value over a "Design pointers" section in the PRD itself.
- **Decision rationale:** the walkthrough's design pointers (surfaces in scope, critical UX questions, constraints, what designer should NOT prescribe, design slice ordering) all fit cleanly into a single section of `/prd-author-custom`'s output. A separate skill would have been a context-switch tax with no added value.
- **Risk acknowledged:** if a design-heavy initiative needs more than a paste-ready section, a dedicated skill may be right. **Re-validate on walkthrough 2 (design-heavy use case).** If design-prompt-killed proves wrong on walkthrough 2, resurrect with sharper scope (e.g. produce a Claude Design–consumable prompt only when the design surface is non-trivial).
- **Cost saved:** ~50 lines of skill authoring + 1 step in the pipeline diagram + 1 chat-step for the user.

#### S4 — `/critique-product-custom` + `/critique-engineering-custom` (was M + Q)

- **Were 7 rows (M) enough:** yes. All 7 rows surfaced something on a real PRD. None redundant. None obviously missing. **Cohesion vs craft** did the most work — caught the translated-post / untranslated-comments seam that every other row would have missed.
- **Were 9 rows (Q) enough:** yes. All 9 rows surfaced something. **A11y first-class** caught the `lang` attribute requirement on translated content (screen readers mispronounce Zulu in a `lang="en"` page) — the highest-impact engineering catch of the session. **Cheaper path** consistently produced the highest-yield row across both critiques (3 alternatives offered on the multi-language PRD). **Made `eng-alt` mandatory** in the new engineering critique skill.
- **What critique surfaces did the shrunken versions miss:** N/A — neither critique was shrunk; full row counts preserved. The original plan to compress to 3 rows (M) and 4 rows (Q) was abandoned during today's session as the row counts proved themselves on real evidence.
- **Pair protocol (M → Q):** validated. M locked the why ("slice 1 demos to engineering, not customer — frame the Steerco expectation accordingly"); Q sharpened the how ("translation API failure = silent untranslated post unless we specify"). Reverse order would have produced cheaper alternatives that weren't yet tied to the right outcome.
- **Two-lens framing for `/critique-engineering-custom`:** **NEW behaviour added today.** The same 9 rows apply differently depending on whether the artefact under review is a runtime plan (literal Zod / migration / contract parity) or a feature PRD (data contract coherence + consumer enumeration). Validated on the PRD lens; runtime lens not yet exercised — pending walkthrough 3.

#### S5 — `/prd-author-custom` (was Bond)

- **Did Cursor Plan mode consume the PRD without re-prompting for structure:** N/A — the PRD wasn't pasted into Plan mode this walkthrough (it landed at RETURN TO PLAN status from M+Q). **Pending walkthrough 2.**
- **What sections got re-prompted by Plan mode:** N/A pending.
- **What `/agent-prd` features did the new PRD author need to keep:** none. The two skills are fundamentally different output shapes — `/agent-prd` produces work packages + BDD for direct agent implementation; `/prd-author-custom` produces slices + plan-mode-seed for Cursor Plan mode. **Coexistence, not replacement.**
- **What the walkthrough proved load-bearing in the new skill:**
  - **Required input contract** — refusing to draft without discovery output. The PRD draft was 10× sharper because discovery had already scoped the problem, named stakeholders, and surfaced gaps. Drafting cold would have been opinion dressed up.
  - **Idempotence rule** — author edits are signal. Silently overwriting them is the easiest way for the skill to lose trust. The skill diffs and asks before overwriting.
  - **Refusal list caught real things during the manual draft:**
    - Aspirational metric ("engagement parity within 15%") with no baseline measurement → forced rewrite or downgrade.
    - Risk without mitigation → forced explicit mitigation per risk.
    - Slice 1 candidate that wasn't actually a walking skeleton (touched only api+ui, no data) → forced thickening to span all layers.
  - **`plan-mode-seed` fence as a load-bearing contract** — the 1:1 mapping from slices table to Plan mode steps is what makes the skill earn its keep over `/agent-prd`. Mechanically generated; never hand-written.
- **Cost:** N/A — manual draft.

#### S6 — End-to-end dogfood

- **Total wall-clock:** ~3.5 hrs (target was: <1 working day; achieved). Includes ICP authoring (one-off) + cleanup edits + critique + skill authoring (the meta-output).
- **Total LLM cost:** N/A — manual session, model usage was Cursor agent pair-programming, not skill-driven autonomous run.
- **Number of human re-prompts:** ~6 across the discovery → PRD pass (mostly clarifying scope: comments in/out, content types, customer-naming-convention, language-list-tenant-bounded, etc.). Target was <2 — exceeded. Walkthrough 2 should test if the now-shipped skills reduce this.
- **Cursor Plan mode consumption quality:** **untested.** The PRD landed at RETURN TO PLAN status; folding the M+Q must-fixes and pasting plan-mode-seed into Cursor Plan mode is a future test.
- **Biggest friction point end-to-end:** the vault was sparse (empty Companies/, sparse Meetings/, no ICP at session start). Discovery had to operate against a thin evidence base. Authoring the ICP mid-session unblocked things. **Lesson: a "vault-foundation pass" might be a precursor skill** — populate baseline ICP / customer pages / competitor profiles before any initiative discovery. Capture as a system improvement idea (`/dex-improve`).
- **Cheapest-possible improvement:** kill the design-prompt skill (done). Decouple discovery from pdlc-ui runtime concerns (done). Make critique skills' first-demo-risk row explicitly room-flavoured vs technical (done — split product / engineering lanes).

---

## Cross-cutting lessons (filled 2026-04-29)

### Context / session-hooks discipline

- **Did the session-start hook save measurable tokens per session:** indirectly yes. Loading `System/icp.md` once at session-start meant every subsequent skill could reference it without re-reading. The walkthrough's discovery phase referenced the ICP four times — would have been four full reads otherwise.
- **Which files should be in the preamble vs on-demand:**
  - **Preamble (always):** `System/icp.md`, `plans/skill-pipeline/README.md` excerpt, base Dex CLAUDE.md.
  - **On-demand:** competitor profiles (loaded by discovery skill when invoked), Friday Signal (loaded by discovery), specific PRDs (loaded by discovery when keyword-matched).

### Cost discipline

- **Where did LLM costs actually concentrate:** N/A — manual session. Move cost-tracking conversation to a future walkthrough where skills run autonomously.
- **Any skill that blew its ceiling — why:** N/A.

### Handoff quality (skill → skill)

- **Which output was hardest for the next skill to consume:** N/A — manual walkthrough; no skill→skill handoff exercised end-to-end. Walkthrough 2 should test the discovery → prd-author handoff with the new contract.
- **Which output was cleanest:** the in-PRD `plan-mode-seed` fence is structured for direct paste into Cursor Plan mode — designed for cleanest-possible handoff to the build phase.

### What a UI would need (seed for future pdlc-ui revisit)

_(only fill if walkthroughs 2 + 3 land clean and a UI decision is on the table)_

- **What's the single most valuable view on the vault markdown:** TBD — answer with evidence after walkthrough 3.
- **Which parts of the pipeline would benefit from a UI vs stay in chat:** TBD.
- **What would break if a UI sat on top of this pipeline today:** TBD.

### Persona-named skills

- **Lesson:** persona names (Felix Leiter, Moneypenny, Bond, M, Q from the 007 universe) require persona knowledge to operate. AI agents and new contributors hit a comprehension tax. **Job-described names** (`/critique-product`, `/initiative-discovery`, `/prd-author`) are operable on first read.
- **Cost of the rename:** ~15 minutes per skill of mechanical edits + 5 file renames. Trivial compared to the cumulative cost of explaining personas in every cross-skill reference.
- **Verdict:** rename was right. Don't reintroduce persona naming in future skills.

### Validate-via-walkthrough vs build-then-test

- **Lesson:** the original plan was 6 sprints, build the skills first, dogfood at the end. Cancelled. Replaced with **walkthrough first, author the skills against walkthrough evidence**.
- **Why it worked:** the walkthrough surfaced 3 design decisions that the original plan had wrong (or absent): kill design-prompt, decouple discovery from pdlc-ui runtime, make A11y a hard row in engineering critique. Building first would have shipped 5 skills containing those mistakes; the test pass would have caught them late.
- **Cost of walkthrough:** ~3.5 hrs end-to-end. **Same as the cost of authoring 5 skills wrong + having to revise.**
- **Verdict:** walkthrough-first should be the cadence going forward. Authoring follows evidence, not theory.

---

## Walkthrough 2 — 2026-04-29 — AI Assistant alongside Employee Chat

**Use case:** Cross-PRD initiative reconciling `Employee_Chat_and_Groups.md` + `AI_Assistant_FAQ.md` on the IA / surface-parity question — *"does AI Assistant share the chat IA pattern (chat list entry, threaded surface, bot-badged peer entity) without merging data, permissions, or thread state with peer chat?"*
**Stretch dimension:** cross-PRD + design-heavy. Three artefacts produced: 1 NEW PRD (`AI_Assistant_in_Chat_Surface.md`) + 2 reshapes (chat + AI FAQ to bond_v1).
**Outputs:**
- Discovery: [`06-Resources/Product_ideas/ai-assistant-alongside-chat_discovery.md`](../../06-Resources/Product_ideas/ai-assistant-alongside-chat_discovery.md)
- New PRD: [`06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md`](../../06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md)
- Reshaped: [`06-Resources/PRDs/Employee_Chat_and_Groups.md`](../../06-Resources/PRDs/Employee_Chat_and_Groups.md), [`06-Resources/PRDs/AI_Assistant_FAQ.md`](../../06-Resources/PRDs/AI_Assistant_FAQ.md)
- Critique log: [`sessions/2026-04-29-walkthrough-2-critiques.md`](./sessions/2026-04-29-walkthrough-2-critiques.md)
**Wall-clock:** ~2.5 hrs (discovery → 3 PRDs → 6 critiques + cross-cutting findings).

### Lessons by skill

#### S1 — `/weekly-market-intel-custom`

- **Friday Signal staleness check fired correctly.** Latest signal was 9 days old; skill flagged `felix_stale: true` per spec rule and surfaced the gap as Open Q3 (EU AI Act lens). **Validates:** the staleness check is load-bearing for cross-PRD initiatives where the AI lens specifically matters.
- **Standalone-not-in-pipeline framing held.** Discovery cited the signal but did not invoke the skill mid-flow. Correct posture.

#### S2 — `/initiative-discovery-custom`

- **Confirm-relevance per grep hit fired again** — caught all five related PRDs as current (recent pilot decisions); no stale references on this initiative. Walkthrough 1 caught noise, walkthrough 2 confirmed silence. Both outcomes are useful — the rule produces signal in both directions.
- **Evidence-gap detection earned its keep harder than walkthrough 1.** Six explicit gaps (no meetings, no people pages, no companies, only 1 of N expected competitor profiles, stale Friday Signal, no design artefacts). The rule's value compounds when vault is sparse — without it, discovery would have read as confidently-incomplete.
- **Stakeholder extraction worked but exposed the people-page gap.** Stakeholders inferred from PRD bodies (Merel CEO, Leon CTO, Discovery workshop owner, Legal, HR content owner, etc.). Discovery flagged the gap. **Lesson: the skill's behaviour is right; the vault foundation is the constraint.**
- **Cross-PRD reconciliation behaviour fired naturally.** Discovery had to span three sibling PRDs and reconcile their explicit separation decisions. Walkthrough 1 had only one anchor PRD; this is genuinely new exercise. Worked clean — the skill doesn't require code changes, but the experience surfaced that the **`related_prds` traversal pattern is reusable** for any cross-cutting initiative.
- **NEW behaviour observed (worth promoting back into the skill spec):** the discovery's "Steps the discovery skill explicitly DID NOT take" section. Honesty about skipped steps + risk created. Walkthrough 1 didn't surface this. **Skill learning: add a Phase 7 "Honest skipped-steps log" to the discovery skill's output shape.**
- **NEW behaviour observed (worth promoting):** the discovery's PRD-scope recommendation to the PRD author (Path A vs B vs C). Walkthrough 1 had a single-PRD output; walkthrough 2 had three options for what to author. Discovery surfaced the structural decision rather than dumping candidate slices. **Skill learning: add a Phase 8 "PRD scope recommendation" to the discovery skill's output shape, used when the discovery surfaces multiple-PRD options.**

#### S3 — `/design-prompt-custom`

- **STATUS: KILL CONFIRMED.** Walkthrough 2 was design-heavy (chat IA, bot affordance density, in-thread disclosure, handoff button placement) — exactly the test case where a separate design-prompt skill might have earned its keep. It didn't.
- **Why kill held:** the new cross-PRD spec's Design pointers section ran to 7 critical UX questions (each with PM recommendation), full constraints, what-NOT-to-prescribe list, and slice-by-slice design ordering. **Same depth a separate `/design-prompt-custom` would have produced**, in 30% less context-switching. The single section is paste-ready for Claude Design or a human designer.
- **Verdict:** kill is correct. Walkthrough 2 is the strong evidence; walkthrough 3 (TBD) doesn't need to re-test unless the design surface is materially different.

#### S4 — `/critique-product-custom` + `/critique-engineering-custom`

- **Six critique runs (3 PRDs × 2 skills) — full execution of the pair protocol on multiple artefacts in one session.** First test of cross-PRD critique synthesis.
- **All three PRDs landed RETURN TO PLAN.** Expected for first-draft spec_ready content; the critique loop's job is to surface this before Build.
- **Test shape per slice is a GAP across all three PRDs.** Six runs, three GAPs on the same row. **Skill learning: bond_v1 needs a Test-shape-per-slice subsection requirement** — caught by critique not by author skill.
- **First-demo risk consistently SOFT.** Three "demo prep is implicit, not deliverable." **Skill learning: bond_v1 should require Slice 1 to ship a demo-readiness deliverable** (corpus loaded, scripted journey, fallback for external dependency).
- **Cohesion vs craft did the most work on cross-PRD.** Caught the seam between AI_Assistant_FAQ.md (Blue app embed) and AI_Assistant_in_Chat_Surface.md (chat-list peer entity) — both ship to Blue app, both use tawk.to, both touch FAQ. Without coordination, divergent surfaces would have shipped. **Skill learning: row's row-by-row guidance should explicitly call out cross-PRD seam detection.**
- **`eng-alt` is the highest-yield row.** 7 alternatives produced across three PRDs. Mandatory ≥1 rule (added end of walkthrough 1) is doing its job — keep.
- **Two-lens framing not yet exercised.** All three artefacts were feature-PRDs; runtime-plan lens still pending walkthrough 3 or a sprint-seed test.
- **A11y mostly PASS once the multilingual lesson carries.** Two of three PRDs hit PASS on the row because design pointers carried `lang` attribute, keyboard, screen-reader, tap-target language. The third (`AI_Assistant_FAQ.md`) was SOFT only because of vendor-widget a11y dependence. **Lesson is propagating between walkthroughs — keep the row's sharpening as authored.**
- **Six concrete cross-cutting findings produced from synthesis** (numbered in critique log). **NEW behaviour observed: the synthesis-across-runs output shape isn't in either critique skill's spec.** When run on multiple artefacts, the skills produce per-artefact findings; the cross-cutting synthesis layer is currently authored manually. **Skill learning: add a synthesis/meta-output mode for batch critique runs.**

#### S5 — `/prd-author-custom`

- **Three PRDs authored — fresh + 2× --reshape.** All three landed in valid bond_v1 shape, all linter-clean. No section skipped, no skeleton-form filled.
- **--reshape flag exercised twice.** Both reshapes preserved 2026-04-17 collaborative-pilot decisions verbatim (chat: DM+groups same GA + group rules TBD + realtime stack TBD; AI FAQ: tawk.to + Wyzetalk-operated workspace + Phase 2 decoupling). Mechanical mapping: WPs → slices held with minor restructuring. **Idempotence frontmatter timestamps written for future re-run protection.**
- **Cross-PRD slice dependency syntax tested.** Slice 4 of `AI_Assistant_in_Chat_Surface.md` depends on `Multilingual_Content.md` slice 3; the bond_v1 Slices table accommodated the cross-PRD reference cleanly in the Depends column. **First test of the pattern; works.**
- **Required-input contract exercise.** PRD author refused to author `AI_Assistant_in_Chat_Surface.md` without discovery output (it had one, but the contract pre-flighted). Walkthrough 1 didn't fire this either; the contract is preventative.
- **Refusal list caught real things again** during the manual draft:
  - Risk 5 (IA hypothesis disproved) had no concrete kill criterion → forced explicit `<10% in 30 days` threshold.
  - Metric 1 had a target but no measurement source on first pass → forced "Note on measurability" subsection.
  - Slice 5 (`@AI` in groups, from discovery candidate-slice list) was kill-flagged in discovery → author honoured the flag and out-of-scoped explicitly rather than including it speculatively.
- **Plan-mode-seed fence held up across three PRDs.** Each generated mechanically from its slices table; 1:1 mapping intact. Direct paste-into-Cursor-Plan-mode contract is the load-bearing artefact.
- **Idempotence rule pending direct test.** No PRD edited between runs in this walkthrough; the diff-and-ask flow remains untested. **Pending walkthrough 3 (re-author after must-fixes folded).**

#### S6 — End-to-end dogfood (walkthrough 2)

- **Total wall-clock:** ~2.5 hrs (discovery + 3 PRDs + 6 critiques + cross-cutting findings + lessons update). **30% faster than walkthrough 1**, despite producing 3× the artefacts. Proof that the skill specs reduce friction.
- **Total LLM cost:** N/A — manual session.
- **Number of human re-prompts:** ~3 across the entire session (scope choice for walkthrough, path-A-vs-B-vs-C decision, evidence-gap-backfill decision). Walkthrough 1 was ~6 re-prompts. **Confirms the now-shipped skills reduce re-prompt count.** Target was <2 — exceeded by 1, but trend is right.
- **Cursor Plan mode consumption quality:** still untested. None of the PRDs had must-fixes folded + plan-mode-seed pasted into Cursor Plan mode. **Pending walkthrough 3.**
- **Biggest friction point:** evidence-gap was the same as walkthrough 1 (sparse vault); but walkthrough 2 was BETTER positioned because related PRDs existed. **Lesson: existing PRDs are the highest-leverage vault asset for cross-PRD discovery.**

### Cross-walkthrough patterns (1 + 2)

These appear in **both** walkthroughs:

- **Sparse vault is the binding constraint, not the skills.** Both walkthroughs flagged the same evidence gaps (no meetings, no companies, no people pages). Skills' evidence-gap detection works; the vault foundation is the limiter.
- **`eng-alt` is the highest-yield row of either critique.** Multilingual produced 3; cross-PRD produced 7. Always look for the cheaper path.
- **A11y `lang` attribute is the recurring catch.** Both walkthroughs hit it; the lesson now propagates via design pointers automatically.
- **Refusal list earns its keep.** Same anti-patterns (aspirational metrics, risk without mitigation, slices that don't span layers, kill-candidates included speculatively) caught in both walkthroughs. Refusal list is correctly tuned.

### Skill specs to update (proposed, not yet applied)

Based on walkthrough 2 evidence:

1. **`/initiative-discovery-custom`** — add Phase 7 (Honest skipped-steps log) + Phase 8 (PRD scope recommendation when discovery surfaces multiple-PRD options).
2. **`/prd-author-custom`** — add Test-shape-per-slice subsection requirement; add Demo-readiness deliverable on Slice 1.
3. **`/critique-product-custom`** — add Cross-PRD seam detection guidance to Cohesion-vs-craft row.
4. **`/critique-product-custom` + `/critique-engineering-custom`** — add a synthesis/meta-output mode for batch critique runs across multiple artefacts.

**Apply these only after walkthrough 3** validates the patterns hold on a third initiative — avoids over-fitting to two walkthroughs.

---

*Seeded 2026-04-29 from walkthrough 1; expanded 2026-04-29 with walkthrough 2 evidence (cross-PRD initiative). Next fill: after walkthrough 3 — preferably a runtime-plan / sprint-seed critique to exercise the runtime lens, OR a re-author cycle (must-fixes folded) to test idempotence.*
