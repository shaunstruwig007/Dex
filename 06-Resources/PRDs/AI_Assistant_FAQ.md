---
prd_shape: bond_v1
prd_id: ai-assistant-faq
created_date: 2026-03-30
last_bond_run: 2026-04-29 16:00
lifecycle: discovery
critique_status: must_fixes_folded
critique_log: plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md (Run 3)
source: legacy_upgrade
reshaped_from: agent-prd shape (2026-04-17)
reshaped_on: 2026-04-29
related_prds:
  - AI_Assistant_in_Chat_Surface.md
  - Employee_Chat_and_Groups.md
  - Smart_HR_Whatsapp.md
  - Messaging_Ops_Urgent_Alerts.md
  - Notifications.md
  - Multilingual_Content.md
follow_up_tasks:
  - Define analytics events when Product Analytics stack is chosen
  - Phase 2 (this PRD): revisit when tawk.to ↔ WhatsApp Flow integration is validated (WhatsApp / Flow program work proceeds elsewhere)
  - Pilot tawk.to Shortcuts + Suggested Message chains on one tenant; measure tap-through vs free-text for frontline cohort
---

# AI Assistant — FAQ & HR Queries

**Status:** Reshaped from agent-prd to bond_v1 on 2026-04-29. **Phase 1 GA = Blue app + tawk.to (engine locked).** **FAQ-on-WhatsApp-Flow is Phase 2 of this PRD (out of scope here).** 2026-04-17 collaborative-pilot decisions preserved verbatim.
**Target:** Frontline (blue-collar) employees and HR-adjacent teams needing fast, HR-grounded answers to recurring policy / FAQ questions, via the Blue app FAQ surface.
**Out of scope intentionally:** FAQ-on-WhatsApp-Flow (Phase 2 of this PRD), live HRIS lookups, custom LLM training, full conversational AI platform, peer / team chat, AI as peer entity in chat list, voice / video.

> **Steerco priority:** #2 commercial (confirmed 2026-03-30). Smart HR is #1; Chat is #3.
>
> **Program clarity:** WhatsApp + WhatsApp Flow remain **high portfolio priorities** (`Smart_HR_Whatsapp.md`, `Messaging_Ops_Urgent_Alerts.md`). What is **decoupled** is only **this PRD's Phase 1 scope**: ship FAQ/policy via tawk.to in Blue first, **without** making tawk.to GA depend on building the **FAQ-on-WhatsApp-Flow** integration.
>
> **Cross-PRD architecture coordination (P3 must-fix).** The chat-list AI entity (per `AI_Assistant_in_Chat_Surface.md`) **uses the same tawk.to workspace**, the **same Base Prompt**, and the **same FAQ corpus** as this PRD's Blue-app embed. Engine config is **shared**; **no divergence permitted** between the two surfaces. Two surfaces, one source of truth. Any per-tenant Base Prompt or corpus customisation here propagates to the chat-list surface automatically.

> **2026-04-17 collaborative-pilot decisions** (preserved):
>
> | Decision | Shaun's call |
> |----------|----------------|
> | **tawk.to tenancy (Phase 1)** | **Wyzetalk-operated** workspaces/properties per tenant — not client-owned tawk.to accounts for GA. |
> | **Phase 1 GA scope** | **Blue app + tawk.to.** **FAQ-on-WhatsApp-Flow** is **Phase 2 in this PRD** (out of scope here; not in the same delivery slice as tawk.to depth work). **WhatsApp / Flow remain program priorities**; they are NOT deprioritized — only **ungated** from this FAQ milestone. |
> | **FAQ engine** | **tawk.to stays locked** — leadership choice stands; only integration patterns may change in discovery. |

*Created 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]] (note: meeting file does not currently exist in vault; reference preserved from original PRD).*

---

## Goal

Frontline employees in Wyzetalk Essential tenants get accurate, HR-approved answers to recurring policy / FAQ questions via a chat experience in the Blue app — without waiting for a human, with tap-first guided paths designed for low-literacy / low-patience users, and clear escalation when the bot cannot answer. The HR ticket queue gets shorter; the perception of "AI value" in the product gets sharper; the next chat-list iteration (`AI_Assistant_in_Chat_Surface.md`) inherits a working FAQ engine.

This PRD is intentionally narrow — it ships a quick-win FAQ surface, not a full conversational platform. A fuller assistant roadmap may follow in later phases.

**Evidence grounding.** 2026-03-30 leadership session (Merel CEO/CPO + Leon CTO) ratified #2 commercial priority + tawk.to as engine. 2026-04-17 collaborative pilot ratified Wyzetalk-operated workspaces + Blue-app-first GA + FAQ-on-Flow as Phase 2 (out of GA scope here). ICP v1 (2026-04-29) — strongest fit with ICP segment 2 (HR self-service). Competitive frame: JEM / Paymenow ship AI + WhatsApp HR narratives; Wyzetalk needs a credible AI-quick-win that does not require months of LLM platform work. No customer / leadership meeting evidence in vault yet (`00-Inbox/Meetings/` empty — gap flagged).

---

## Users

**Primary user — frontline employee, high-volume FAQ asker.** Low-literacy / low-patience subset of ICP segment 1 + 2. Asks the same questions repeatedly: leave policy, payslip query (redirected — see Smart HR boundary), safety procedures, conduct policy, onboarding info. Win condition: opens FAQ chat in Blue app, taps a Suggested Message or types a question, gets an HR-grounded reply within seconds.

**Secondary user — HR-adjacent / supervisor.** Receives fewer repetitive questions because the bot deflects. Win condition: monthly volume of "where do I find...?" tickets / phone calls drops measurably.

**Secondary user — tenant content owner.** Owns the FAQ corpus per tenant (who exactly, on an ongoing basis, is open Q1). Win condition: a documented ingestion playbook + clear updating workflow.

**Out of scope (MVP) — Wyzetalk implementation / CSM.** They provision the tawk.to workspace + ingest the corpus (per Slice 2 runbook) but are not direct UI users of the consumer chat experience.

**Out of scope (MVP) — peer-chat-only users.** They have their own surface (`Employee_Chat_and_Groups.md`); the FAQ surface is not for peer conversation.

---

## Success metrics

| # | Metric | Definition | Target | Measurement source |
|---|---|---|---|---|
| 1 | **FAQ session adoption** | % of tenant-enabled employees with ≥ 1 FAQ session in a 30-day window | ≥ 40% in 90 days post-tenant-enable | tawk.to dashboard (sessions / unique users) |
| 2 | **Deflection rate** | % of FAQ sessions resolved without escalation to human / HR ticket | ≥ 70% in 90 days | tawk.to + Wyzetalk escalation tracker (cross-source) |
| 3 | **Hallucination rate (sampled)** | % of replies containing ungrounded HR information | **Target 0% in sampled set; any case is investigated as a defect; quarterly sampling-adequacy review** (does 100/month catch what we'd catch at 500/month? if the gap is material, increase sampling). | HR-sampled review of 100 sessions/month, with quarterly statistical adequacy check |
| 4 | **Time-to-first-answer (median)** | Seconds from question submitted to first reply | < 5s | tawk.to session metrics |

### Note on measurability

- **Metrics 1, 2, 4** are measurable from tawk.to dashboard at slice 1; no Wyzetalk analytics plumbing required pre-launch.
- **Metric 3 is the load-bearing safety signal.** Hallucinations are tenant-liability events. Sampled HR review starts at slice 1; a defect (any non-zero hallucination case) blocks GA expansion to next tenant.
- **Metric 2** has a cross-source reconciliation requirement — tawk.to "session resolved without handoff" must align with Wyzetalk's escalation log. Spec gate at slice 3 PR review: is the reconciliation pipeline shipped?

---

## Requirements

1. User can open a FAQ chat surface inside the Blue app and immediately see a greeting with up to 4 Suggested Messages mapped to top intents.
2. tawk.to AI Assist is configured per-tenant from a Wyzetalk-operated workspace; tenant FAQ content (PDFs, KB articles, Q/A pairs, plain text) is ingested per a documented Wyzetalk playbook.
3. Replies are grounded in approved sources only; the tawk.to "Revise answer based on context" toggle is OFF by default; the Base Prompt enforces "use sources or escalate".
4. When the bot cannot answer with confidence (or the user requests it), escalation to HR inbox or human agent is offered and routed.
5. AI conversations are stored by tawk.to per its data-residency policy; tenant admin has audit visibility and the POPIA / GDPR posture is documented per tenant.
6. Live HRIS lookups (payslip, leave balance, roster) are NOT in this PRD; user is redirected to the Smart HR surface (`Smart_HR_Whatsapp.md`).
7. The FAQ surface meets a11y baseline — keyboard / screen-reader parity, correct `lang` attribute on rendered AI replies, sufficient contrast, tap-target sizes.
8. Top intents are reachable in 2–3 taps via guided Shortcut chains with localised, ≤ 10-word labels (per tawk.to vendor docs: `Suggested Messages and AI Questions`).

---

## Slices

| # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |
|---|---|---|---|---|---|
| **1** | **Skeleton — FAQ chat in Blue app** | **Yes** | User opens FAQ entry in Blue app on a single configured tenant; sees a greeting with 4 Suggested Messages (top intents); taps one or types a free-text question; gets an HR-grounded reply within 5 seconds. | data + api + ui + config | tawk.to workspace provisioned for the tenant |
| **2** | **Wyzetalk-operated tenancy + ingestion playbook + corpus versioning** | No | Wyzetalk implementation provisions a tawk.to workspace for a new tenant, ingests their policy PDFs into Documents + KB articles + FAQ rows, configures the Base Prompt — handoff to GA happens in a documented N-hour cycle. **Corpus version control (E6 must-fix):** every ingestion run produces a versioned snapshot (`<tenant_id>_<corpus_version>_<ingestion_timestamp>`); retention 90 days minimum; rollback to a previous version is supported (single-command). When a regression hits production (wrong policy answer surfaces), CSM can roll back to the prior corpus version while the content owner fixes forward. | api + config (no user UI) | 1 |
| **3** | **Escalation path (transactional + routed)** | No | User asks something outside the FAQ corpus → bot offers escalation → handoff routes to the HR inbox or a live agent (per tenant configuration); user lands in the receiving surface end-to-end. **Idempotency key (E1 must-fix):** escalation-create endpoint uses `<tawk.to_session_id, intent>` as the idempotency key → ticket UUID. Double-tap or retry never opens duplicate tickets. **Handoff routing contract (E2 must-fix):** intent classification → role lookup → ticket route, documented at the wire level. Roles are tenant-configured (HR vs Ops vs Operations Manager); intent → role mapping is admin-editable. | api + ui | 1 |
| **4** | **POPIA + tenant audit posture** | No | Tenant admin opens an audit view → sees session log entries with source attribution + retention period; POPIA / GDPR data-residency stance is documented per tenant; subprocessor list reviewed. | api + ui (admin) + config | 1 |
| **5** | **Guided shortcut chains for top intents** | No | User taps the "Leave" Suggested Message → next-step Suggested Messages appear (Annual / Sick / Family / Compassionate); chained Shortcut returns the final HR-approved answer in 2–3 taps total. | api + config + ui | 1 |

### Slicing rules applied

- **Slice 1 is the walking skeleton.** Touches data (FAQ corpus storage in tawk.to) + api (tawk.to widget integration in Blue app) + ui (chat surface, Suggested Messages on greeting) + config (tenant property + workspace credentials). Single end-to-end demo.
- **Slice 2 is non-user-facing** but earns its own slice — tenancy provisioning for a new tenant is a repeatable operational pattern that defines tenant onboarding. Without it, slice 1 only demos for the seed tenant.
- **WhatsApp Flow as a slice is out-of-scope.** That's Phase 2 of this PRD per pilot 2026-04-17. It does not appear in the slice list.
- **5 slices** — fits 3–6 typical range.
- **All slices have observable demo outcomes**; slice 4's demo is admin-side (audit view) rather than employee-side, but is observable.

### Test shape per slice

Cross-cutting must-fix from `/critique-engineering-custom` (E5). Every slice ships with the test coverage below; PR review enforces.

| # | Unit | Integration | E2E | A11y | Notes |
|---|---|---|---|---|---|
| 1 | Message render; Suggested Message tap → reply mapping; degraded-state copy load | tawk.to widget round-trip (mocked + live in staging); cached-Suggested-Messages fallback when API unreachable | Greeting → tap Suggested Message → reply ≤ 5s; offline path → cached greeting + escalation deep-link visible | axe scan on full FAQ surface; **vendor-widget a11y compliance check (E4 must-fix)** — confirm tawk.to widget meets WCAG AA; document any vendor gaps; escalate to vendor or workaround | Vendor a11y is partly outside our control; document explicitly if widget falls short |
| 2 | Corpus ingestion (PDF → Documents + KB + FAQ); version snapshot writer; rollback path | Ingestion run produces versioned snapshot; rollback restores prior version | New tenant onboarding: PDFs → ingestion → Base Prompt configured → demo question → grounded reply, all within documented N-hour cycle | n/a (admin operational slice) | Versioned-snapshot test must include rollback verification (E6) |
| 3 | Idempotency key dedup on escalation-create; intent-classifier → role lookup | Escalation handoff routes to correct role per tenant config; ticket UUID dedups on retry | User asks off-corpus → escalation offered → tap → lands in receiving surface (HR inbox or live-agent) | Escalation button keyboard-reachable; new-thread / new-ticket announced via screen reader | Failure-injection test: double-tap escalation, assert single ticket |
| 4 | Audit-row write per session; retention-period tagging | tawk.to session log → Wyzetalk audit view; cross-source reconciliation pipeline | Tenant admin opens audit view → sees session log entries with source attribution + retention period | Admin audit view keyboard-navigable; row-level details screen-reader accessible | Cross-source reconciliation pipeline (Open Q8) is the load-bearing test |
| 5 | Suggested Message chain step transitions; final-answer load | Chained Shortcut returns final HR-approved answer in 2–3 taps | User taps "Leave" → next-step buttons (Annual / Sick / Family / Compassionate) → final answer | Each step keyboard-navigable; ≤ 4 buttons per step honoured by render; ≤ 10-word labels | Vendor doc constraint enforced by render-time validator |

### Slice 1 demo readiness

Cross-cutting must-fix from `/critique-product-custom` (P1). Slice 1's first-demo risk is a steerco moment where Suggested Messages return stilted or wrong answers because the corpus isn't ready.

- [ ] **30+ pre-vetted Suggested Message journeys** rehearsed end-to-end on the demo tenant. Each journey: greeting → tap a Suggested Message → confirm reply ≤ 5s → confirm reply is HR-approved (matched to a corpus entry).
- [ ] **Free-text variant rehearsed** for 5 of the 30 journeys: ask the same intent in free-text instead of tapping the button → confirm same HR-grounded answer.
- [ ] **Hallucination defect example prepared (off-camera)** showing the sampled-review process catching one drift case → CSM logs it as a metric-3 defect → corpus is updated → defect closes. Steerco sees the operational discipline.
- [ ] **Vendor-outage fallback rehearsed (E3 must-fix).** If tawk.to is unreachable mid-demo, the Blue app embed shows: greeting (cached) + Suggested Messages (cached) + a deep-link "If I can't help, message HR directly" → land in HR-contact surface. 30-second simulation.

### Slice 2 demo readiness

P1 for slice 2 specifically: the demo of the ingestion playbook is *another tenant onboarded successfully*.

- [ ] **Second tenant pre-prepared** (could be a second seed tenant, mocked) with their own policy PDFs ready for ingestion.
- [ ] **Ingestion playbook walked through live** — implementation team runs the playbook on the second tenant in front of steerco; documented N-hour cycle proven (or revised).
- [ ] **Corpus rollback rehearsed** — ingestion mistake intentionally introduced (e.g. swap a leave-policy PDF for a wrong tenant's), one-command rollback restores prior version, demo proceeds.

```plan-mode-seed
Slice 1: Skeleton — FAQ chat in Blue app. User opens FAQ entry in Blue app on a single configured tenant; sees greeting with 4 Suggested Messages (top intents); taps one or types free-text; gets HR-grounded reply within 5s. Layers: data + api + ui + config. Depends: tawk.to workspace provisioned for the tenant.
Slice 2: Wyzetalk-operated tenancy + ingestion playbook. Wyzetalk implementation provisions tawk.to workspace for new tenant, ingests policy PDFs into Documents + KB articles + FAQ rows, configures Base Prompt; handoff to GA in documented N-hour cycle. Layers: api + config. Depends: 1.
Slice 3: Escalation path. User asks something outside corpus → bot offers escalation → handoff routes to HR inbox or live agent per tenant config; user lands in receiving surface end-to-end. Layers: api + ui. Depends: 1.
Slice 4: POPIA + tenant audit posture. Tenant admin opens audit view → sees session log entries with source attribution + retention period; POPIA / GDPR data-residency stance documented per tenant. Layers: api + ui (admin) + config. Depends: 1.
Slice 5: Guided shortcut chains for top intents. User taps "Leave" Suggested Message → next-step Suggested Messages appear (Annual / Sick / Family / Compassionate); chained Shortcut returns final HR-approved answer in 2–3 taps. Layers: api + config + ui. Depends: 1.
```

---

## Risks

1. **Hallucination on policy answers.** Bot generates ungrounded HR advice; tenant liability event. **Mitigation:** "Revise answer based on context" OFF; Base Prompt = "use sources or escalate"; HR-sampled review (metric 3); slice 3 escalation always available; defect blocks GA expansion.
2. **tawk.to vendor lock-in compounded.** Engine + UX both lock to tawk.to; v2 swap is heavy. **Mitigation:** documented as accepted Phase 1 trade-off. **Forward-compatible shape (P4 must-fix):** future engine swaps target the **engine-abstraction-behind-peer-entity-contract** pattern in `AI_Assistant_in_Chat_Surface.md` (Risk 3 mitigation), **not** direct tawk.to widget references. New code that touches the FAQ engine should call through that abstraction wherever feasible — even if Phase 1 ships embedding the widget directly. When the swap happens (Phase 2+), the chat-list surface migrates first; this PRD's Blue-app embed migrates by replacing the widget with a thin shim that calls the same engine-abstraction. This is a soft mitigation — direct widget embedding is unavoidable in Phase 1 — but the call path inside our code respects the abstraction so future-Wyzetalk has somewhere to swap.
3. **Content management ownership ambiguity.** Who updates the FAQ corpus on an ongoing basis is unresolved. **Mitigation:** Slice 2 ships with a role definition (Wyzetalk vs client content owner); Open Q1 captures the tradeoff; workshop decides.
4. **POPIA / data residency exposure.** tawk.to is a subprocessor; data-residency posture not yet validated for SA / EU tenants. **Mitigation:** legal sign-off pre-GA per tenant; tenant audit view (slice 4); contractual / DPA review with vendor before each new tenant onboards.
5. **Frontline UX failure on free-text.** Users ignore Suggested Messages and type free-text the AI fumbles. **Mitigation:** slice 5 guided chains tested with frontline pilot; short Base Prompt; escalation always one tap away; Suggested Message labels ≤ 10 words per vendor docs.
6. **AI Assist quotas / billing surprises.** tawk.to AI Assist quotas / overages can spike unexpectedly. **Mitigation:** vendor monitoring; per-tenant quota; alerting before tenant hits cap; quota review in monthly tenant check-ins.
7. **Cross-PRD boundary leak.** Bot answers Smart-HR-owned intents (payslip, leave balance, roster). **Mitigation:** Requirement 6 + corpus exclusion; intent-classifier rejects Smart HR-owned intents; out-of-scope reply directs user to Smart HR surface.
8. **Phase-2 confusion** — stakeholders interpret "FAQ-on-WhatsApp-Flow is Phase 2" as "WhatsApp is deprioritised". **Mitigation:** explicit clarity blocks (preserved in this PRD's status); WhatsApp / Flow program priority is unchanged on `Smart_HR_Whatsapp.md` and `Messaging_Ops_Urgent_Alerts.md`.

---

## Out of scope

| Out of scope | Why | Future cycle? |
|---|---|---|
| **FAQ-on-WhatsApp-Flow** integration | Phase 2 of THIS PRD per pilot 2026-04-17; depends on Messaging / Smart HR Flow infrastructure being ready (those tracks proceed independently) | Yes — Phase 2 of this PRD |
| Live HRIS lookups (payslip / leave / roster) | `Smart_HR_Whatsapp.md` owns; cross-PRD boundary | Yes — separate PRD (Smart HR is #1 priority) |
| Custom LLM training / fine-tuning on tenant data | Phase 1 is FAQ-grounded only; quick-win scope | Yes — future post-Phase-2 |
| Full conversational AI platform (multi-turn reasoning, agentic flows) | Quick-win scope; explicit non-goal | Yes — future, separate PRD |
| Peer / team chat | `Employee_Chat_and_Groups.md` owns | No — explicit non-goal |
| AI as peer entity in chat list | `AI_Assistant_in_Chat_Surface.md` owns; this PRD remains the Blue-app-embed surface | No — explicit non-goal (separate PRD covers) |
| Voice input / output | Phase 1 is text-only; voice opens new modality + new failure modes | Yes — future, post-Phase-2 |
| Per-tenant model fine-tuning | Out of "fast ship" scope | Yes — future |
| Multi-language outside tawk.to-supported list | Vendor language coverage gates this; `Multilingual_Content.md` patterns apply where supported | Yes — future, expansion-driven |

---

## Open questions

| # | Question | Blocks | Owner / next step |
|---|---|---|---|
| 1 | Content ownership ongoing — Wyzetalk-operated content vs client content owner | Slice 2 (role definition) | Workshop + Implementation team |
| 2 | tawk.to data residency for SA tenants (and EU if any) | Slice 4 + Phase 1 GA | Legal — vendor docs review + DPA |
| 3 | Does tawk.to widget support disabling / de-emphasising free-text input for frontline-only UX? | Slice 1 design | Vendor docs check; if no, Base Prompt covers |
| 4 | Reusable when broader AI platform matures? | Future cycle | Future — re-evaluate at Phase-3 boundary |
| 5 | Suggested Messages copy localisation alignment with `Multilingual_Content.md` | Slices 1 + 5 | Cross-PRD coordination |
| 6 | Per-tenant Base Prompt customisation — extent + governance | Slice 2 spec | Implementation team + Product |
| 7 | tawk.to AI Assist quota tier per tenant — Wyzetalk-paid or pass-through? | Slice 2 (commercial model) | Commercial + vendor |
| 8 | Cross-source reconciliation pipeline for metric 2 (tawk.to + Wyzetalk escalation tracker) | Slice 3 PR review | Engineering + Product Analytics |

### None of these block slice-1 build EXCEPT Q3 (free-text-disabling) which has a no-op fallback (Base Prompt covers).

Q1 blocks slice 2. Q2 blocks GA. Q5 is a slice-1-time copy decision. Q6, Q7 block slice 2. Q8 blocks slice 3.

**Build-stub assumptions** for slice 1 if Q3, Q5 are still open at build time:
- Q3 stub: tawk.to default UX (free-text + Suggested Messages both available); Base Prompt enforces grounding.
- Q5 stub: English-only Suggested Messages in slice 1; localisation in slice 5 + 4 (Multilingual cross-PRD).

---

## Design pointers

### Context

The FAQ surface is the tawk.to widget embedded inside the Blue app. Mobile-first, frontline-targeted (~ 90% blue-collar per legacy framing), low-literacy mitigations are explicit design constraints. The surface is one of three Wyzetalk Essential AI / chat surfaces; it is the **only** one that uses tawk.to as the engine.

### Surfaces in scope

1. **Blue app FAQ entry point** — how the user enters the FAQ surface from the app shell.
2. **FAQ chat surface (tawk.to widget)** — greeting, Suggested Messages, message bubbles, free-text input, escalation button.
3. **Escalation handoff** — within the widget (live agent transfer) OR routed out (HR inbox).
4. **Wyzetalk-side ingestion runbook** (Slice 2) — implementation team's playbook for a new tenant.
5. **Tenant audit view** (Slice 4) — admin-facing view of session logs + retention.

### Critical UX questions for the designer to answer

- **Greeting layout** — Suggested Messages prominent vs free-text prominent? **Recommendation:** Suggested Messages above the fold; free-text below; make the bot's "I can also answer typed questions" affordance visible.
- **Bot affordance** — clear "AI Assistant" labelling on every screen? **Recommendation:** yes — redundant signals (per `AI_Assistant_in_Chat_Surface.md` design pointer carry-over); this is a Phase-1 design decision worth carrying.
- **Escalation copy** — neutral or apologetic? **Recommendation:** neutral, clear: *"I can't answer this confidently. Tap to message HR directly."*
- **Out-of-scope handling (Smart HR intents)** — bot reply when user asks for payslip? **Recommendation:** *"I can't fetch your payslip — open WhatsApp and chat with Smart HR for that. Tap here for instructions."*
- **Long-answer handling** — long PDF excerpts vs chunked replies? **Recommendation:** chunked + "more" buttons (per vendor doc tap-first guidance — long PDF dumps fail for frontline).
- **Empty state for first-time user** — onboarding copy? **Recommendation:** one-liner above the Suggested Messages explaining what the bot can / cannot help with.

### Failure-mode UX (E3 must-fix)

Spec the degraded states explicitly — these are not nice-to-haves, they are the difference between "AI is broken" and "AI is having a moment".

- **tawk.to API unreachable on greeting.** Show: greeting (cached locally on last successful load) + Suggested Messages (cached) + a one-line note: *"AI Assistant is having a moment. If I can't help, [message HR directly]."* The "message HR directly" link uses the same handoff surface as Slice 3 (deep-link, not a new flow).
- **tawk.to API unreachable mid-conversation.** Show: existing message bubbles preserved client-side; input box accepts a message but on send, message queues with "sending…" indicator; on reconnect, message dispatches; if reconnect doesn't happen within 30s, pivot to *"I can't reach the AI right now. [Message HR directly]?"*
- **Suggested Message tap returns no reply within 10s.** Show: typing indicator → after 10s, fallback copy: *"That's taking longer than usual. Try again, or [message HR directly]."*
- **Reply contains source-attribution that fails to resolve** (PDF link broken, KB article deleted). Show: reply with a graceful caveat: *"Based on our HR policy. If you'd like the full document, [contact HR]."* — never show a broken link.

### Constraints on design (must / must not)

**Must:**
- tawk.to widget embedded in Blue app context.
- HR-grounded replies only.
- Escalation always one tap away.
- A11y: correct `lang` attribute on AI replies (carries the lesson from `Multilingual_Content.md` + critique-engineering A11y row); keyboard / screen-reader parity; tap-target sizes; sufficient contrast.
- Suggested Message labels ≤ 10 words each, ≤ 4 buttons per step (vendor doc constraint).
- Base Prompt configured per pilot 2026-04-17 (sources-only mode).

**Must not:**
- Fabricate policy / HR information (any incident is a metric-3 defect).
- Expose live HRIS data (cross-PRD boundary).
- Render outside Blue app context (Phase 1 = Blue-only).
- Merge with peer chat (out-of-scope; `Employee_Chat_and_Groups.md` ownership).

### What the designer should NOT prescribe

- tawk.to engine config (vendor docs are the source of truth).
- Tenant policy / audit schema (`Tenant_Management.md`).
- WhatsApp Flow surface (Phase 2, out of scope).
- HR-content / corpus structure (HR / content owners — Open Q1).
- Cross-PRD chat-list IA (`AI_Assistant_in_Chat_Surface.md` covers).

### Design slice ordering

- **Slice 1** — heaviest visual lift. Chat surface, greeting, Suggested Messages style, message bubbles, free-text input.
- **Slice 2** — minimal UI design; ingestion runbook is documentation.
- **Slice 3** — escalation button + handoff copy + receiving-surface continuity.
- **Slice 4** — admin audit view (new admin UI surface).
- **Slice 5** — chained Suggested Messages flow design — each "step" replaces the previous button set rather than stacking.

---

## Build handoff

> **Repo split.** This PRD lives in the GitHub vault (`Documents/Blueprint/Dex`). Production code lives in **Bitbucket**. There is no auto-sync between the two. This section is the developer's pickup contract for taking the PRD across the repo boundary.

### How to use this PRD in Cursor Plan mode (in the Bitbucket repo)

1. Copy this entire markdown file to your codebase repo at `docs/PRDs/AI_Assistant_FAQ.md`.
2. **Also copy `AI_Assistant_in_Chat_Surface.md`** — engine config, Base Prompt, and FAQ corpus are shared between the two surfaces (Architecture coordination block above).
3. Open Cursor with the codebase repo as the workspace, with both files in context.
4. Paste the **Plan mode seed** block (above) as the Plan mode prompt. Each line maps to one Plan-mode step → one PR / branch.
5. Reference the Slices, Test shape per slice, Slice 1 + Slice 2 demo readiness, Risks (especially Risk 2 forward-compatible shape), Failure-mode UX, Open questions, and Design pointers sections for the full context Plan mode needs.

### Handoff snapshot

| Field | Value |
|---|---|
| **Source file (vault)** | `06-Resources/PRDs/AI_Assistant_FAQ.md` (GitHub: `Documents/Blueprint/Dex`) |
| **bond_v1 last run** | `2026-04-29 16:00` |
| **Lifecycle** | `discovery` (must-fixes folded; **slice 4 + GA gated by Q2 Legal sign-off**) |
| **Slice 1 demo-readiness deliverables** | 30+ pre-vetted Suggested Message journeys · 5 free-text variants · hallucination-defect example off-camera · vendor-outage fallback rehearsed |
| **Slice 2 demo-readiness deliverables** | Second tenant pre-prepared · ingestion playbook walked through live · corpus rollback rehearsed |
| **Cross-PRD slice dependencies** | Engine config + Base Prompt + corpus shared with `AI_Assistant_in_Chat_Surface.md` (architecture coordination block); `Smart_HR_Whatsapp.md` boundary (Requirement 6); `Multilingual_Content.md` (Open Q5) |
| **Hard gates before Slice 1 build** | tawk.to workspace provisioned · Q3 (free-text disabling) — **stub-able**, no-op fallback |
| **Hard gates before Slice 2 build** | Q1 (content ownership ongoing) · Q6 (per-tenant Base Prompt customisation) · Q7 (commercial model — Wyzetalk-paid vs pass-through) |
| **Hard gates before Slice 3 build** | Q8 (cross-source reconciliation pipeline for metric 2) |
| **Hard gates before GA** | Q2 (tawk.to data residency for SA / EU tenants) — **Legal sign-off blocking** |
| **Sign-off needed before Build** | Product (PM) · Engineering (CTO) · Legal (data residency + DPA review with vendor) · Design (FAQ surface + degraded-state copy) · HR-content owner (corpus + escalation roster per tenant) |

### Source-of-truth rule

This PRD is generated from the GitHub vault by `/prd-author-custom`. **If you edit this file in the codebase repo, those edits do NOT propagate back.** Treat the codebase copy as a read-only snapshot. For spec changes:

1. Open the GitHub vault.
2. Edit the source file at `06-Resources/PRDs/AI_Assistant_FAQ.md`.
3. Re-run `/prd-author-custom` to regenerate this PRD's bond_v1 shape.
4. Re-copy to the codebase repo.

The skill's idempotence rule protects the source from accidental overwrites — if the source file has been edited since the last `last_bond_run`, the skill surfaces a diff and asks before proceeding.

---

*Reshaped 2026-04-29 by /prd-author-custom (--reshape) from agent-prd shape (2026-04-17). Original WP-1, WP-2, WP-3 (Phase 2), WP-4 mapped to Slices 1–5 with WP-3 explicitly out-of-scoped per the pilot decoupling. tawk.to vendor analysis preserved as Design pointer constraints. Critique pass run 2026-04-29 (Walkthrough 2, Run 3); must-fixes folded 2026-04-29 16:00 (P1–P4, E1–E6 + cross-cutting test-shape, demo-readiness, build-handoff additions). Last run: 2026-04-29 16:00.*
