---
session_date: 2026-04-30
session_type: critique-pass — Smart_HR_Whatsapp.md bond_v1 (post-walkthrough-4)
artefact_under_review: 06-Resources/PRDs/Smart_HR_Whatsapp.md
artefact_shape: bond_v1
critique_pair_protocol: product first, engineering second
related_sessions:
  - plans/skill-pipeline/sessions/2026-04-30-whatsapp-bond-v1.md
  - plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md
  - plans/skill-pipeline/sessions/2026-04-29-walkthrough-3-fold-and-handoff.md
---

# Critique pass — Smart HR WhatsApp (bond_v1)

**Verdicts:**
- `/critique-product-custom`: **READY FOR BUILD with must-fixes** (no GAPs, 4 SOFTs)
- `/critique-engineering-custom`: **READY FOR BUILD with must-fixes** (no GAPs, 7 SOFTs, 2 alts)

**Net state:** PRD has no blocking GAPs but 11 SOFTs across both critiques. Folding the must-fixes is non-trivial — recommend a single edit pass under "Net product + engineering recommendations applied" before next stakeholder share-out. Slice 1 build can begin in parallel on the parts the must-fixes don't touch (Sage integration spike, BSP cost analysis), but Slice 1 *spec_ready* should be re-asserted only after must-fixes are folded.

---

## [Critique — Product on Smart_HR_Whatsapp.md]

| # | Row | Score | One-line |
|---|-----|-------|----------|
| 1 | Outcome integrity | **SOFT** | Slice 1 demo outcome is Steerco-flavoured but user has been clear demo is "for sales conversations." Sales-demo readiness is implicit, not explicit. |
| 2 | First-demo risk | **SOFT** | First-touch trust moment for an employee receiving an unfamiliar WhatsApp identity-proof request is unaddressed — could land as "is this phishing?" in the room. |
| 3 | Honesty of asks | **SOFT** | Metric 2 target (≥ 80% identity-proof completion) has no baseline; Metric 3 (Utility classification rate as %) is wrong-shaped — it's binary, not continuous. |
| 4 | Cohesion vs craft | **SOFT** | Messaging_Ops Part 2 opt-in semantics are one-way-broadcast; whether they cover two-way conversation is unspecified beyond Q8. |
| 5 | Bar discipline | **PASS** | Cross-PRD MVP dependencies (Elevated_Auth Phase 1, AI_Assistant_FAQ Phase 1) are explicitly gated, not silent. |
| 6 | Out-of-scope hygiene | **PASS** | Out-of-scope table has reasons + future-cycle flags; sibling-PRD coordination handled via Build handoff. |
| 7 | Reversibility | **PASS** | System-side reversibility is fine — single-tenant Slice 1, BSP-config-seam pattern, no schema migration. User-habit reversibility is a slice-rollout decision, not a PRD design issue. |

### Must-fix (Product)

**P1. Sales-demo framing** (row 1) — Slice 1 demo readiness item #2 currently says *"Demo journey rehearsed end-to-end on production WABA, not staging."* Add a second clause: *"Demo content tailored to a credible buyer-tenant scenario (real prospect tenant or labelled demo tenant with realistic data), not a Wyzetalk-staff scenario."* Two paths possible — pick at the engineering-capacity conversation.

**P2. First-touch trust moment** (row 2) — Slice 1 demo readiness add a new item: *"First-touch WhatsApp template rehearsed with a non-Wyzetalk demo employee (sender display name, template wording, call-to-action) so it's recognisably-Wyzetalk and not phishy. Capture their unprimed reaction in dry-run #1."* This catches the in-room "wait, is this real?" failure mode.

**P3. Metric 2 baseline** (row 3) — In §3 Success metrics, Metric 2 currently asks for *"≥ 80% on UAT cohort, Slice 1 demo."* Drop the 80% target until UAT-1 establishes a baseline. Replace with: *"Identity-proof completion rate measured at Slice 1 demo; target set at Slice 2 once UAT cohort exists."* Move the 80% to a "to-be-baselined" footnote on the Note-on-measurability subsection.

**P4. Metric 3 reshape** (row 3) — Metric 3 (Utility-classification rate as %) is wrong-shaped — Meta either approves or rejects a template; it's not a continuous metric. Reshape to a binary checklist item in §5c Slice 1 demo readiness: *"Slice 1 templates approved by Meta as Utility (binary)."* Replace Metric 3 in §3 with: *"Per-message cost variance — actual Meta-billed rate vs. Utility ($0.01) target, measured monthly post-launch."* That IS a measurable continuous metric and is the underlying business question.

**P5. Two-way opt-in semantics** (row 4) — Q8 currently asks about WABA tenant-config compatibility. Extend Q8 to include opt-in semantics: *"Does Phase 1 (Messaging_Ops) employee opt-in cover two-way conversation, or is a second opt-in needed? If second, it's a Slice 1 dependency."* If the answer is "second opt-in needed," add as Slice 1 hard gate.

### Nice-to-have (track but don't block)

**P-NTH.1.** Cross-surface seam between Smart HR WhatsApp and Blue app: when an employee asks for payslip via WhatsApp then later opens Blue, does Blue surface the recent activity? Out of scope for bond_v1, but worth a future-PRD note.

**P-NTH.2.** Slice 4 (FAQ handoff) chains to AI_Assistant_FAQ.md Phase 1 shipped. If AI_Assistant_FAQ Phase 1 slips, Slice 4 of Smart HR slips. Worth a single-line risk in §7 noting the chain.

### Verdict

**READY FOR BUILD with must-fixes folded.** No GAPs. P1–P5 should be folded before next stakeholder share-out (especially P1 + P2, which protect the demo).

---

## [Critique — Engineering on Smart_HR_Whatsapp.md]

(Lens: feature-PRD)

| # | Row | Score | One-line |
|---|-----|-------|----------|
| 1 | Atomicity | **SOFT** | Multi-write user-action chain (identity-proof event log + interaction log + Meta dispatch) has no specified atomicity guarantee. |
| 2 | Idempotence | **SOFT** | Webhook dedupe via Meta `message.id` named, but no TTL specified; identity-proof event idempotency-on-replay unstated. |
| 3 | Schema parity | **SOFT** | External schema dependencies (Elevated_Auth audit log, Messaging_Ops tenant config, Sage API) named but not pinned to verified artefacts. Elevated_Auth_Remote_App.md WP-4 confirms an audit log concept exists but as P1 ("Audit pipeline TBD") — Slice 1 inherits a contract that isn't fully specced. |
| 4 | Contracts unchanged | **SOFT** | Slice 1 widens Messaging_Ops WABA tenant config (one-way → two-way), Elevated_Auth (adds WhatsApp entry-point), employee opt-in semantics. Consumer enumeration partial; sibling-PRD doc updates not yet committed. |
| 5 | Failure modes | **SOFT** | §7 covers Sage / Meta / Elevated_Auth unavailable, slow render, timeout, idempotency, vendor lock-in. Three minor failure modes uncovered: employee-network-flaky (delivered-but-unread), identity-proof-expired re-prove flow, tenant-admin failure-surfacing in interaction log. |
| 6 | A11y first-class | **SOFT** | Slice 2 a11y is explicit (`lang`, keyboard, screen-reader, contrast, tap-target). Slice 1 auth-gate a11y deferred to Elevated_Auth Phase 1, which hasn't yet specced a11y. Tenant admin interaction-log a11y unspecified. |
| 7 | Test shape | **PASS** | §5b table present; every slice has at least one entry per column or `n/a` with reason. |
| 8 | Reversibility / blast radius | **PASS** | Single-tenant Slice 1 contains blast radius. BSP swap path named (interface boundary at config seam). No vendor lock-in beyond what spike named. |
| 9 | Cheaper path | **SOFT** (no GAP) | Two `eng-alt`s produced — see below. |

### Must-fix (Engineering)

**E1. Atomicity guarantee** (row 1) — Add to §7 Technical failure modes a sub-bullet: *"Identity-proof event log + interaction log + outbound Meta dispatch chain — specify atomicity guarantee. Recommended: Wyzetalk-side single transaction (identity-proof + interaction log together; outbound dispatch is a side effect with Wyzetalk-side request UUID dedupe). On partial failure (transaction commits but Meta dispatch fails), the next inbound webhook dedupe + retry path replays the dispatch idempotently."*

**E2. Idempotence specifics** (row 2) — Add to §7 Technical failure modes: *"Webhook dedupe cache TTL: 5 minutes (covers Meta retry windows). Identity-proof event idempotency on replay: no-op if employee already proven within session window (session window length to be set by Elevated_Auth Phase 1; recommended 30 min to 4hr depending on tenant config)."*

**E3. Schema parity pinning** (row 3) — Promote two sub-tasks under existing Open Questions:
- **Q1 sub-task:** "Capture Sage data contract in `whatsapp-spike-findings.md`: field names (employee_id, payslip_url, payslip_period), auth model (token, OAuth, basic-auth), rate limits, signed-URL TTL. Required before Slice 1 build entry." (Jan owns.)
- **Q4 sub-task:** "Verify Elevated_Auth Phase 1 spec includes audit-log schema (currently WP-4 P1 in Elevated_Auth_Remote_App.md, marked 'Audit pipeline TBD'). If not specced by Phase 1 close-out, escalate as Smart HR Slice 1 hard gate." (Elevated_Auth PRD owner.)

**E4. Cross-contract impact notes** (row 4) — Add to §11c Build handoff snapshot a new row: *"Sibling-PRD coordination required (PRD-owner notification): Messaging_Ops_Urgent_Alerts.md (one-way → two-way tenant-config widening, opt-in semantics extension), Elevated_Auth_Remote_App.md (WhatsApp added as new entry-point alongside Remote App, audit-log consumer added)."* Each PRD owner gets a one-page diff describing the contract change before Slice 1 build entry.

**E5. Three additional failure modes** (row 5) — Add to §7 Technical failure modes:
- *"Employee on flaky network: outbound delivery succeeded per Meta callback but employee never opens the message. Tenant admin's interaction log shows 'delivered-not-read' state for ≥ 24 hours; tenant admin can opt to re-trigger via the Messaging_Ops broadcast lane (Part 2 cross-PRD)."*
- *"Identity-proof session expired: subsequent payslip request after expiry triggers re-prove flow per Elevated_Auth Phase 1 spec; employee sees Service-window message: 'Please verify your identity again to continue.'"*
- *"Tenant admin failure surfacing: interaction log records event types (payslip-delivered / sage-failed / meta-failed / elevated-auth-failed / opt-in-missing). Schema TBD per Elevated_Auth WP-4 audit-log shape."*

**E6. A11y inheritance and admin log** (row 6) — In §10 Design pointers, A11y requirements:
- Add: *"Slice 1 auth-gate a11y inherits from Elevated_Auth_Remote_App.md Phase 1. Verify Phase 1 spec includes a11y requirements (keyboard, screen-reader, contrast, tap-target, `lang` attribute on tenant-language content) before Slice 1 build entry. If absent, Slice 1 cannot inherit; add to Q4 sub-task."*
- Add: *"Tenant admin interaction-log surface (Wyzetalk admin portal): keyboard-navigable, screen-reader-readable event types, sufficient contrast for normal-light office use. Inherits from existing admin portal a11y baseline."*

### Alternatives (eng-alt — author picks one or none)

**eng-alt.1: Magic Link first, no in-WhatsApp auth for first access.**

Slice 1 = WhatsApp utility template + Magic Link → Blue app handles first-access auth + serves payslip. Current Slice 2 (Magic Link) becomes the new Slice 1; current Slice 1 (in-WhatsApp auth) becomes a later optimisation. Slices 3–5 unchanged.

**Trade-off:**
- *Pro:* Significantly simpler to build — no in-WhatsApp identity-proof UX. Aligns with eng capacity constraint.
- *Pro:* Elevated_Auth Phase 1 audit-log dependency reduced (only Magic Link callback-into-Blue path needs to write an audit event; not in-WhatsApp).
- *Pro:* Sage integration is the same; payslip media-URL pattern is the same; only the auth surface changes.
- *Con:* Breaks the "stay in WhatsApp" thesis for first access. Employees leave WhatsApp for first auth; subsequent access could stay in WhatsApp via session-expiry rules.
- *Con:* Slightly higher abandonment risk on first access (employee taps link → app open → friction).

**Worth considering if:** engineering capacity is the binding constraint (which the user has named explicitly). The eng-alt trades elegance for shippability.

**eng-alt.2: Pre-vetted demo employee with out-of-band auth (demo-only).**

Demo employee is "already elevated-auth'd" out-of-band before the steerco / sales demo. Slice 1 ships payslip-only end-to-end on production WABA. Production rollout still includes the auth gate.

**Trade-off:**
- *Pro:* Fastest path to demo. Slice 1 build collapses to: webhook + Sage + media URL + Meta dispatch.
- *Con:* If execs probe ("what about new employees?"), the answer is "this is the demo version; production includes the auth gate Q4 will spec." Honesty is fine but reveals the demo is a slice of the slice.
- *Con:* Two flows to maintain (demo, production); confusion risk for the engineering team.
- *Cleaner if:* the demo audience is a sales prospect who is asking "can I see it work end-to-end?" rather than an exec asking "is this production-ready?"

**Worth considering if:** the end-April / end-May 2026 demo target is unlikely to slip and engineering capacity is the binding constraint, AND the audience is sales-led not exec-governance.

### Nice-to-have (track but don't block)

**E-NTH.1.** Media-URL-as-payslip-transport is a hardening decision. If a future slice (Slice 2 Magic Link) chooses push instead of pull, codify the swap path — add a one-line ADR-stub: *"If Slice 2+ proves push-based delivery superior, Slice 1's signed-media-URL pattern can be swapped at the BSP-config-seam without re-architecture."*

**E-NTH.2.** BSP-cost-model audit cadence (quarterly) named in §7 as a mitigation for Meta-pricing-shift risk. Should be calendared as a recurring task, not a one-off.

### Verdict

**READY FOR BUILD with must-fixes folded.** No GAPs. E1–E6 should be folded; eng-alt.1 in particular deserves a 30-minute conversation with Jan + Merel before Slice 1 commits — if engineering capacity remains constrained, eng-alt.1 is the cheaper / sturdier path.

---

## Net product + engineering recommendations (for the artefact author to fold)

The 11 must-fixes group into four edit-clusters. Recommend folding in the order below — each cluster is a single section edit.

### Cluster 1 — §3 Success metrics rework

- Drop Metric 2 target (≥ 80%); replace with "to-be-baselined at UAT-1." (P3)
- Reshape Metric 3 from continuous % to binary checklist + replace with per-message cost variance metric. (P4)

### Cluster 2 — §5c Slice 1 demo readiness extension

- Add sales-demo content tailoring item. (P1)
- Add first-touch trust rehearsal item. (P2)

### Cluster 3 — §7 Risks + Technical failure modes extensions

- Atomicity guarantee for the multi-write chain. (E1)
- Idempotence specifics (TTL, identity-proof replay). (E2)
- Three additional failure modes (network-flaky, session-expired re-prove, admin-log surfacing). (E5)

### Cluster 4 — §9 Open questions + §10 Design pointers + §11 Build handoff sub-edits

- Q1 sub-task (Sage data contract). (E3)
- Q4 sub-task (Elevated_Auth audit-log schema verification + a11y inheritance). (E3 + E6)
- Q8 extension (two-way opt-in semantics). (P5)
- §10 a11y inheritance note for Slice 1 auth gate + tenant admin log. (E6)
- §11c Build handoff snapshot adds Sibling-PRD coordination row. (E4)

### Conflict resolution

No direct conflicts between the two critiques. Engineering's eng-alt.1 (Magic Link-first) is a strategic shift the product critique didn't surface — author picks whether to take it or not. If taken, Cluster 2 (demo readiness) and §5 Slices both rework; Cluster 1 + 3 + 4 still apply.

### Decision points for the author

1. **Take eng-alt.1 (Magic Link-first) or hold the current shape?** Conversation with Jan + Merel needed; engineering capacity is the deciding signal.
2. **Sales-demo target tenant: real prospect or labelled demo?** (P1 forces this choice.)
3. **Elevated_Auth audit-log schema — escalate to Phase 1 as a Smart HR dependency or wait for Phase 1 close-out?** (E3 routes to Q4 owner.)

---

## Lessons (worth promoting to skill spec)

### 1. The 4-cluster pattern is reusable.

Eleven must-fixes folded cleanly into 4 edit-clusters (metrics, demo readiness, risks/failure modes, open-questions+design+handoff). This is the same shape walkthrough-3 saw. **Lesson for `/prd-author-custom`:** when re-running with critique findings, surface clusters explicitly in the diff preview, not as a raw list of P/E codes.

### 2. Engineering's `eng-alt` is the highest-yield row when capacity is constrained.

eng-alt.1 (Magic Link-first) is materially smaller to build than the current Slice 1 shape AND addresses the explicitly-named engineering capacity constraint. The current shape was thickened in walkthrough-4 to honour the spike findings (auth + payslip together); the engineering critique flags that the *thickening* may be the wrong response when capacity is the binding constraint. Better response: collapse Slice 1 to Magic Link-first and defer in-WhatsApp auth to Slice 2.

**Lesson for `/critique-engineering-custom`:** the existing `eng-alt` row produces this naturally. The lesson is for the author / parent skill — when capacity is named as a binding constraint in the discovery doc, the bond_v1 author should evaluate eng-alts more aggressively *before* drafting, not just after critique.

### 3. Sibling-PRD coordination is structurally invisible until critique.

E4 (cross-contract impact notes) caught that Smart HR widens contracts in two sibling PRDs (Messaging_Ops, Elevated_Auth) but the bond_v1 spec doesn't enforce a sibling-coordination action. Build handoff snapshot now needs a "Sibling-PRD coordination" row.

**Lesson for `/prd-author-custom`:** add a required sub-row to §11c Build handoff snapshot: *"Sibling-PRD coordination required (PRD-owner notification + diff)."* This forces the author to enumerate which sibling PRDs need the diff before Slice 1 build entry.

### 4. Wrong-shaped metrics are easy to miss when migrating from agent-prd.

Metric 3 (Utility-classification rate as %) was fine in the agent-prd shape ("Overall Success: 95% of UAT scripted HR intents routed correctly") but wrong-shaped when transposed to bond_v1's metrics table — Meta's classification is binary per template, not continuous. The reshape walkthrough should sanity-check metrics against the binary-vs-continuous distinction.

**Lesson for `/prd-author-custom`:** add to the refusal list — *"A metric whose definition is binary or discrete being expressed as a continuous % target."*

---

*Authored 2026-04-30 by /critique-product-custom + /critique-engineering-custom on `06-Resources/PRDs/Smart_HR_Whatsapp.md` (bond_v1, last_bond_run 2026-04-30 16:00). Pair-protocol: product first, engineering second. Outputs net to: 4 product SOFTs + 7 engineering SOFTs + 2 eng-alts; no GAPs; READY FOR BUILD with must-fixes folded. Author should review the 4-cluster fold-plan and decide on eng-alt.1 before re-running `/prd-author-custom`.*
