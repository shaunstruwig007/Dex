# Walkthrough 2 — Critique log

**Walkthrough:** AI Assistant alongside Employee Chat (cross-PRD initiative)
**Date:** 2026-04-29
**Artefacts under critique:**
1. `06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md` (NEW, bond_v1)
2. `06-Resources/PRDs/Employee_Chat_and_Groups.md` (reshaped to bond_v1)
3. `06-Resources/PRDs/AI_Assistant_FAQ.md` (reshaped to bond_v1)

**Skills exercised:** `/critique-product-custom`, `/critique-engineering-custom` (feature-PRD lens for all six runs).

**Pair protocol:** Product first, engineering second, per skill spec. Within each PRD section below, product → engineering.

---

## Run 1 — `AI_Assistant_in_Chat_Surface.md`

### `/critique-product-custom`

```
[Critique — Product on AI_Assistant_in_Chat_Surface.md]

Outcome integrity:    PASS — Slice 1 demo is observable; "user opens chat list, sees AI Assistant, asks a question, gets a reply" is the customer-visible moment.
First-demo risk:      SOFT — In a steerco room the demo requires a pre-loaded FAQ corpus on the demo tenant. Hallucination Risk 4 covers safety; demo-prep is implicit.
Honesty of asks:      SOFT — Metric 1 (40% chat-list discoverability in 90 days) commits to a target without baseline. Note on measurability acknowledges this but the target should phrase as "establish baseline first 30 days; evaluate 40% target at 90."
Cohesion vs craft:    PASS — Cross-PRD references explicit (related_prds:); Slice 4 cross-PRD dependency on Multilingual_Content.md slice 3 named in Depends column; design pointers carry the lesson from multilingual.
Bar discipline:       PASS — `@AI` in groups (slice 5 from discovery candidate list) explicitly killed and out-of-scoped; future cycle flagged.
Out-of-scope hygiene: PASS — 10 rows, all with reasons + future-cycle flags; explicit non-goals separated from "yes, future".
Reversibility:        SOFT — Risk 5 (IA hypothesis disproved) has a kill criterion (<10% in 30 days = revert) but no operational revert plan. If users have learned the chat-list pattern, taking it away is a UX shock.

Must-fix (fold into artefact before Build):
  P1. Add demo-prep deliverable to Slice 1 — minimum N seeded FAQ entries + one rehearsed steerco journey before the slice ships.
  P2. Rephrase metric 1: "Establish baseline open-rate in first 30 days post-tenant-enable; evaluate ≥40% target at 90 days."
  P3. Spell out the IA-revert plan: feature-flagged behind tenant config; per-tenant disable in <4hr SLA; user-facing copy for the transition.

Nice-to-have (track but don't block):
  P-NTH.1. Risk 5 mitigation could mention what successful adoption looks like in qualitative terms (not just open-rate); colour for the 30-day write-up.

Verdict: RETURN TO PLAN
```

### `/critique-engineering-custom` (feature-PRD lens)

```
[Critique — Engineering on AI_Assistant_in_Chat_Surface.md]

(Lens: feature-PRD)

Atomicity:               SOFT — Slice 3 (handoff) implies multi-write: AI session log close + new peer chat thread + notification. Partial failure leaves user dangling.
Idempotence:             SOFT — Slice 1's session-creation + analytics event can double-fire on double-tap or network retry. No dedup key specified.
Schema parity:           SOFT — Slice 4 depends on Multilingual_Content.md slice 3 shipping the profile language-preference field. Cross-PRD sequencing risk; not a hard schema gap because the dependency is named.
Contracts unchanged:     SOFT — Adding the AI Assistant entity to chat list changes the chat-list payload. Consumers (iOS / Android / Mobi web) not enumerated.
Failure modes:           SOFT — What does the user see when tawk.to is unreachable? PRD doesn't specify the degraded state for the AI thread.
A11y first-class:        PASS — Design pointers explicitly call out `lang` attribute on AI replies, keyboard / screen-reader parity, tap-target sizing.
Test shape:              GAP — No test shape per slice. PRD doesn't say "Slice 1 ships with N unit + N integration + 1 e2e + 1 a11y test."
Reversibility / blast:   SOFT — Risk 3 (vendor lock-in compounded) has a mitigation (engine abstracted behind peer-entity contract) but no concrete contract sketched.
Cheaper path:            SOFT — At least one alternative shape always required.

Must-fix (fold into artefact before Build):
  E1. Slice 3 spec: collapse handoff into a single transactional endpoint (`createHandoff(aiSessionId, intent) → peerThreadId`) so partial failure rolls back all three writes.
  E2. Slice 1 spec: client-generated session UUID for both session-create and analytics event; server enforces idempotency.
  E3. Slice 1 PR review gate: enumerate chat-list payload consumers; ship a versioned payload that allows new entity types without breaking existing clients.
  E4. Add a "Test shape per slice" subsection to bond_v1 — Slice 1: ≥3 unit (entity rendering, payload parsing, language fallback), ≥1 integration (tawk.to round-trip), 1 e2e (chat-list → thread → reply), 1 a11y (axe scan + screen-reader smoke).
  E5. Add Failure-modes subsection to Slice 1 design pointers — tawk.to unreachable: AI thread shows "AI Assistant is temporarily unavailable; tap here for HR contact" (leans on Slice 3 handoff).

Alternatives (eng-alt — author picks one or none):
  eng-alt.1. Ship Slice 1 as a deep-link from chat list (tap "AI Assistant" → opens existing tawk.to widget surface) — no new chat-thread surface; reuses AI_Assistant_FAQ.md's Phase 1 directly. Trade-off: less "AI as peer" affordance, less IA-hypothesis test, but ships in a fraction of the time and validates discoverability.
  eng-alt.2. Ship Slice 1 + Slice 5 only (skeleton + disclosure); skip Slice 4 (language) for v1; cuts the Multilingual_Content.md cross-PRD dependency entirely. Trade-off: English-only at v1; localisation deferred to v2 once Multilingual slice 3 ships.

Nice-to-have (track but don't block):
  E-NTH.1. Add an ADR for the engine-abstraction contract sketched in Risk 3 — even a one-page sketch makes future engine swap real.

Verdict: RETURN TO PLAN
```

---

## Run 2 — `Employee_Chat_and_Groups.md` (reshaped)

### `/critique-product-custom`

```
[Critique — Product on Employee_Chat_and_Groups.md]

Outcome integrity:    PASS — Slice 1 (DM happy path) is observable, customer-noticeable.
First-demo risk:      SOFT — Slice 1 demo requires the engineering spike (Q1) to be DONE. PRD names Q1 as a hard gate but doesn't say "what's the demo posture if Q1 isn't resolved by demo time?".
Honesty of asks:      SOFT — Metric 1 (50% chat MAU in 90 days) presumes a tenant-enable-from-zero baseline, but the framing reads like "MAU from launch."
Cohesion vs craft:    PASS — Cross-PRD references explicit; Slice 3 dedicated to cross-surface separation; AI Assistant entity dependency on `AI_Assistant_in_Chat_Surface.md` named in Requirement 8.
Bar discipline:       PASS — Phase-2 work (federation, eDiscovery, voice, read receipts) explicitly out-of-scoped with future flags.
Out-of-scope hygiene: PASS — 7 rows with reasons + future-cycle flags.
Reversibility:        SOFT — Chat backend choice (vendor vs first-party) is the load-bearing reversibility risk. Risk 1 names it; mitigation is "spike-before-build" but doesn't cover "what if we picked CPaaS and want to swap later?".

Must-fix (fold into artefact before Build):
  P1. Add a "Demo posture until Q1 resolved" plan — wireframe walkthrough or paper prototype so steerco doesn't see a stalled product just because the spike hasn't landed.
  P2. Rephrase Metric 1: "% of enabled employees who send ≥1 chat message in a rolling 30-day window, tracked from tenant-enable-date" — removes the 90-day-from-launch ambiguity.
  P3. ADR template for chat-backend choice (Q1) must include a "swap cost" section — what does it take to change vendor / build first-party later.

Nice-to-have (track but don't block):
  P-NTH.1. Risk 7 (AI Assistant entity behaving like a peer) could specify metric thresholds (e.g. `<5% misuse-rate` from cross-PRD spec metric 3) for cross-PRD coordination.

Verdict: RETURN TO PLAN
```

### `/critique-engineering-custom` (feature-PRD lens)

```
[Critique — Engineering on Employee_Chat_and_Groups.md]

(Lens: feature-PRD)

Atomicity:               SOFT — Slice 1 DM flow: message-create + delivery-state + notification-dispatch are 3 writes. Need transactional shape per stack-spike outcome.
Idempotence:             SOFT — DM send on flaky network may retry; need server-side dedup key per message (client-generated UUID).
Schema parity:           PASS — PRD doesn't claim fields exist; everything stack-dependent (TBD pending spike).
Contracts unchanged:     SOFT — Slice 3 (cross-surface separation) implies a chat-list entry-type taxonomy (DM vs group vs bot). Not specified.
Failure modes:           SOFT — Notification dispatch fails: message saved, recipient sees on next open. Acceptable but spec it.
A11y first-class:        PASS — Design pointers call out keyboard, screen-reader, tap-target, sufficient-contrast for outdoor frontline conditions.
Test shape:              GAP — No test shape per slice.
Reversibility / blast:   SOFT — Chat backend choice is a 1-way door. Same trade-off as product Reversibility row.
Cheaper path:            SOFT — alternative shapes always required.

Must-fix (fold into artefact before Build):
  E1. Slice 1 spec: client-generated message UUID; server enforces idempotency on message-create.
  E2. Slice 1 spec: chat-list entry-type taxonomy (`type: "dm" | "group" | "bot"`) — required for Slice 3 separation invariant and for Requirement 8 (AI Assistant entity).
  E3. Slice 1 design pointers: spec notification-dispatch failure path — message saved, next-open delivery, no retry-storm.
  E4. Add "Test shape per slice" — Slice 1: unit (message create / list render), integration (delivery), e2e (DM happy path), a11y (axe + screen-reader).

Alternatives (eng-alt — author picks one or none):
  eng-alt.1. Ship Slice 1 with vendor (CPaaS) as the default chat-backend; ADR captures the build-vs-buy trade-off; first-party migration deferred to Phase 2 if scale or commercial drivers demand. Trade-off: per-message vendor cost over time vs faster-to-ship.
  eng-alt.2. Ship Slice 1 with WhatsApp Business as the chat backend (let users peer-chat via WhatsApp embedded in Wyzetalk Essential). Radically cheaper, leverages existing Smart_HR_Whatsapp.md infrastructure. Trade-off: data path leaves Wyzetalk's control; cross-tenant chat possible (hard to lock down); WhatsApp UX bleed.
  eng-alt.3. Ship Slice 1 + Slice 3 only (DM + cross-surface separation); defer groups to next cycle. Trade-off: violates pilot 2026-04-17 ("DM AND groups same Phase 1 GA"); needs a steerco re-decision.

Nice-to-have (track but don't block):
  E-NTH.1. Slice 5 (retention/moderation): clarify what "report" means at the model layer — flag-only, soft-delete, immediate hard-delete? Each has different blast radius.

Verdict: RETURN TO PLAN
```

---

## Run 3 — `AI_Assistant_FAQ.md` (reshaped)

### `/critique-product-custom`

```
[Critique — Product on AI_Assistant_FAQ.md]

Outcome integrity:    PASS — Slice 1 (FAQ chat in Blue app, 4 Suggested Messages, ≤5s reply) is observable + customer-noticeable.
First-demo risk:      SOFT — Demo requires both the corpus loaded AND tested Suggested Messages. Risk 5 (frontline UX failure) names the symptom but not demo-prep.
Honesty of asks:      SOFT — Metric 3 (hallucination rate target 0%) is hard. The sampled-review method (100 sessions/month) gives evidence but no guarantee 0% is actually achievable. Phrase as "0% in sampled set; investigate any case as defect."
Cohesion vs craft:    SOFT — Visible seam between this PRD's Phase 1 (Blue app embed) and `AI_Assistant_in_Chat_Surface.md` (chat-list peer entity). Both ship to Blue app, both use tawk.to, both touch FAQ. Without explicit coordination, two surfaces could ship that don't share engine config.
Bar discipline:       PASS — WhatsApp Flow explicitly out-of-scoped to Phase 2; preserved verbatim from pilot 2026-04-17.
Out-of-scope hygiene: PASS — 9 rows, all with reasons.
Reversibility:        SOFT — tawk.to engine locked; the chat-list AI PRD has a swap-friendly architecture pattern this PRD doesn't reference.

Must-fix (fold into artefact before Build):
  P1. Add demo-prep deliverable as part of Slice 2 (ingestion playbook) — N rehearsed Suggested Message journeys must pass before slice handoff.
  P2. Rephrase Metric 3: "Target 0% hallucination in sampled set; any case is investigated as a defect; quarterly sampling-adequacy review."
  P3. Add a cross-PRD coordination note to Architecture Constraints: "The chat-list AI entity (per AI_Assistant_in_Chat_Surface.md) uses the same tawk.to workspace, the same Base Prompt, and the same FAQ corpus as this PRD's Blue app embed. Engine config is shared; no divergence permitted."
  P4. Risk 2 (vendor lock-in) — add: "The forward-compatible shape is `AI_Assistant_in_Chat_Surface.md`'s engine-abstraction-behind-peer-entity-contract pattern; future engine swap targets that shape, not direct tawk.to widget references."

Nice-to-have (track but don't block):
  P-NTH.1. Frontmatter `created_date: 2026-03-30` references a meeting file (`00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential`) that does not currently exist. Capture the meeting in vault to close the audit chain.

Verdict: RETURN TO PLAN
```

### `/critique-engineering-custom` (feature-PRD lens)

```
[Critique — Engineering on AI_Assistant_FAQ.md]

(Lens: feature-PRD)

Atomicity:               PASS — Slices are largely single-write surfaces (tawk.to handles its own atomicity per session).
Idempotence:             SOFT — Slice 3 (escalation) creates an HR ticket / opens a peer chat — needs idempotency key.
Schema parity:           SOFT — PRD doesn't define what a "FAQ session" looks like in tawk.to vs in Wyzetalk's escalation tracker. Cross-source reconciliation pipeline (Open Q8) is unowned schema.
Contracts unchanged:     SOFT — Handoff routing (intent → role mapping) is a new contract; not specified at the wire level.
Failure modes:           SOFT — tawk.to API down → user sees what? PRD doesn't specify (cached Suggested Messages? empty state? deep-link to HR contact?).
A11y first-class:        SOFT — Design pointers call out `lang` attribute and a11y baseline; tawk.to widget a11y is vendor-controlled. Need to verify vendor's WCAG compliance level.
Test shape:              GAP — No test shape per slice.
Reversibility / blast:   SOFT — Corpus changes are forward-only (no version control on FAQ content per current PRD). Open Q1 (content ownership ongoing) compounds.
Cheaper path:            SOFT — alternative shapes always required.

Must-fix (fold into artefact before Build):
  E1. Slice 3 spec: idempotency key on escalation-create endpoint (tawk.to session ID + intent → ticket UUID).
  E2. Slice 3 spec: handoff routing contract — intent classification → role lookup → ticket route. Document at the wire level.
  E3. Slice 1 design pointers: spec degraded states for tawk.to outage (cached Suggested Messages on greeting; deep-link to HR contact; "AI is temporarily unavailable" copy).
  E4. Slice 1 a11y deliverable: tawk.to vendor a11y compliance check (WCAG AA minimum); if vendor falls short, document workaround or escalate to vendor.
  E5. Add "Test shape per slice" — Slice 1: unit (message render, Suggested Message tap → reply), integration (tawk.to round-trip), e2e (greeting → tap → reply), a11y (axe + screen-reader; vendor widget specifically).
  E6. Slice 2 spec: corpus version control — every ingestion run produces a versioned snapshot; retention 90 days; rollback supported.

Alternatives (eng-alt — author picks one or none):
  eng-alt.1. Kill Slice 5 (guided shortcut chains) for v1; ship just greeting-level Suggested Messages from Slice 1; treat chained flows as Phase-1.5. Trade-off: less polished UX for low-literacy users at GA, but ships ~30% faster and lets pilot data drive whether chains are needed.
  eng-alt.2. Invert Slices 4 + 5 (audit-and-POPIA before guided chains) — POPIA compliance is gating to GA; UX polish is not. Trade-off: small.
  eng-alt.3. Defer Slice 4 (POPIA + audit) to a v1.1; ship Phase 1 GA with vendor-level audit only (tawk.to dashboard); build Wyzetalk-side audit when first non-Wyzetalk-operated tenant onboards. Trade-off: less tenant-control at GA; faster ship for the first tenant.

Nice-to-have (track but don't block):
  E-NTH.1. Open Q3 (does tawk.to widget support disabling free-text?) has a no-op fallback (Base Prompt covers); but the answer affects UX testing — chase it with vendor.

Verdict: RETURN TO PLAN
```

---

## Cross-cutting findings (across all 6 critique runs)

These are patterns the skill loop surfaced more than once. Worth promoting back into the skill specs.

### 1. **Test shape per slice is a GAP everywhere.** All three PRDs lack it. The bond_v1 spec doesn't currently require a "test shape per slice" subsection. **Skill learning: `/prd-author-custom`'s output shape should add a "Test shape per slice" requirement under Slices** — even if it's table-shaped (slice / unit / integration / e2e / a11y / count). Six runs, three GAPs on the same row = strong signal.

### 2. **First-demo risk is consistently SOFT.** Three PRDs, three "demo prep is implicit, not deliverable." The product critique is doing its job — the row is sharp enough to surface this — but the bond_v1 spec doesn't require demo-prep as a Slice 1 deliverable. **Skill learning: `/prd-author-custom` should require a "Demo readiness" sub-deliverable on Slice 1** (corpus loaded, scripted journey rehearsed, fallback if external dependency unavailable).

### 3. **Reversibility is consistently SOFT for vendor-locked or 1-way-door decisions.** All three PRDs have a 1-way door (tawk.to lock-in, chat backend choice, IA hypothesis bet). The mitigations are real but always softer than ideal because the trade-offs are real. **No skill change needed — this is what the row is for**. The repeated SOFT pattern is informational, not corrective.

### 4. **Cohesion vs craft is the row that does the most work on cross-PRD initiatives.** The seam between AI_Assistant_FAQ.md (Blue app embed) and AI_Assistant_in_Chat_Surface.md (chat-list peer entity) only surfaced because Cohesion-vs-craft asked "is the seam to the next surface clean?". On a single-PRD walkthrough (multilingual), this row was less load-bearing. **Skill learning: the row's row-by-row guidance should explicitly call out cross-PRD seam detection on cross-cutting initiatives.**

### 5. **`eng-alt` is the consistently-highest-yield row.** Across three PRDs, 7 alternatives were produced. Authors won't take all of them but the act of producing them sharpens the choice that ships. The mandatory ≥1 rule (added at end of walkthrough 1) is doing its job — keep it.

### 6. **A11y on chat-shaped surfaces is mostly PASS once design pointers carry the multilingual lesson.** Two of three PRDs hit PASS on a11y because the `lang` attribute lesson and screen-reader / keyboard / tap-target language carried through. The third (`AI_Assistant_FAQ.md`) was SOFT only because of vendor-widget a11y dependence. **No skill change — the lesson is propagating.**

### 7. **The pair protocol (product first, engineering second) worked clean.** No conflicts surfaced; the engineering critique consistently sharpened decisions the product critique had already framed. Order is correct. Keep.

### 8. **Two-lens framing on engineering critique didn't fire because all three were feature-PRDs.** The runtime-plan lens hasn't been exercised yet in either walkthrough. **Skill validation pending — the next walkthrough that critiques a runtime artefact (sprint seed, Cursor Plan output) will exercise the runtime lens.**

---

## Verdict summary

| PRD | Product | Engineering |
|---|---|---|
| AI_Assistant_in_Chat_Surface.md | RETURN TO PLAN (3 must-fixes) | RETURN TO PLAN (5 must-fixes + 2 eng-alts) |
| Employee_Chat_and_Groups.md | RETURN TO PLAN (3 must-fixes) | RETURN TO PLAN (4 must-fixes + 3 eng-alts) |
| AI_Assistant_FAQ.md | RETURN TO PLAN (4 must-fixes) | RETURN TO PLAN (6 must-fixes + 3 eng-alts) |

**All three PRDs return-to-plan as expected for first-draft spec_ready content.** The critique loop's job is to surface these before Build — that's the value.

**Author next step:** fold must-fixes into PRDs (per skill spec, the author re-runs `/prd-author-custom` after applying — idempotence rule applies: PRDs that are edited will not be silently overwritten; the skill will surface a diff and ask before proceeding). For walkthrough 2 we **deferred** applying must-fixes — same pattern as walkthrough 1 — to keep the focus on the skill-shape evidence rather than ship-the-feature work.

---

*Authored 2026-04-29 during walkthrough 2. Validates `/critique-product-custom` + `/critique-engineering-custom` on three PRDs simultaneously, including a NEW PRD and two reshapes. First test of cross-cutting findings synthesis across multiple critique runs. Six findings worth folding back into skill specs (numbered above).*
