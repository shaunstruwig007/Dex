---
prd_shape: bond_v1
prd_id: smart-hr-whatsapp-2026-04-30
created_date: 2026-03-30  # original agent-prd shape; bond_v1 reshape 2026-04-30
last_bond_run: 2026-04-30 16:00
lifecycle: spec_ready
critique_status: pending  # /critique-product-custom + /critique-engineering-custom not yet run on bond_v1 shape
design_pass_status: pending  # Slice 2 (Magic Link / Elevated Auth UX in Blue) needs Claude Design wireframe pass; rest is engineering integration
related_prds:
  - Messaging_Ops_Urgent_Alerts.md  # Part 2 ships next week — same WABA infra; tenant-config seam
  - Elevated_Auth_Remote_App.md  # Slice 1 hard dep — elevated auth required for first access (spike 2026-04-30)
  - AI_Assistant_FAQ.md  # Slice 4 handoff target for non-structured-HR intents
  - Payslip_PDF.md  # data-source PRD for Slice 1
  - Tenant_Management.md  # tenant-config TC-24 to TC-36 for WhatsApp
  - Profile_Users.md  # employee opt-in preference
discovery_source: 06-Resources/Product_ideas/smart-hr-whatsapp_discovery.md
spike_findings_source: 06-Resources/Product_ideas/whatsapp-spike-findings.md  # paraphrased Jan 2026-04-30; pending Jan validation
exec_roadmap_priority: 1
---

# WhatsApp — Smart HR (Conversational)

**Status:** `spec_ready` · critique pass pending (`/critique-product-custom` + `/critique-engineering-custom`) · design pass pending (Slice 2 only) · **Slice 1 hard-gated by:** Jan to validate spike findings in writing + Elevated_Auth Phase 1 workshop scheduled + engineering capacity confirmed for end-April / end-May 2026 demo target.
**Target:** Frontline employees (ICP segment 1 + 2) requesting structured HR self-service — payslip, leave, roster — via WhatsApp, with POPIA/GDPR-compliant identity proof on first access.
**Out of scope intentionally:** Open-domain LLM chat over WhatsApp (handed off to AI_Assistant_FAQ.md), peer-to-peer chat over WhatsApp (out of scope of Employee_Chat_and_Groups.md), emergency comms via WhatsApp (owned by Messaging_Ops_Urgent_Alerts.md Part 2), multi-tenant rollout (defer to GA), full HRIS integration coverage beyond Sage (Slice 1 = Sage only).

---

## 1. Goal

When this ships, frontline employees in deskless industries (mining, manufacturing, retail, logistics) can request and receive their payslip — and later, leave balance and shift schedule — entirely within WhatsApp, where they already live. They prove identity once via an elevated-auth gate on first access, then interact through user-initiated WhatsApp Flow utility messages that fall inside Meta's free 24-hour Service window. Wyzetalk converts its existing one-way WhatsApp broadcast channel (Messaging_Ops_Urgent_Alerts.md Part 2) into a two-way self-service surface without breaking the privacy guarantees that distinguish Wyzetalk from standard WhatsApp groups (1:1 with platform, no employee-number leakage, segment-controlled retention).

The evidence grounding is **exec ratification (priority #1, 2026-03-30)** plus **competitor pressure** — JEM HR (T0 watch) and Paymenow have both shipped conversational HR via WhatsApp; Zuko Mdwaba's appointment at JEM (Jul 2025) is converting the move-upmarket play into Wyzetalk's ICP segments. The 2026-04-20 Friday Signal confirms JEM did not ship a new extension that week, so Wyzetalk has a 1–2 quarter window before the enterprise motion lands in our accounts. The customer / CS evidence layer is sparse in vault by design (sparse-evidence is `expected` for exec-driven priorities per `System/exec_roadmap.md`); triangulation via competitor profile + market signals + exco ratification is the validation path.

---

## 2. Users

**Primary user — frontline employee (Wyzetalk Essential reader).** A non-desk-based worker — miner, picker, retail associate, logistics operator — whose phone is already saturated with WhatsApp. They expect to ask "where's my payslip?" the same way they'd ask a friend for a photo. They are sceptical of new apps, untrusting of unfamiliar logins, and pragmatic about what's worth their data and time. They will use WhatsApp because their non-work life already lives there; they will not download Blue solely for an HR query. They speak the platform's default language, but may also speak Zulu, Xhosa, Sotho, Afrikaans, or another South African language — the bond_v1 first slice ships in English; Multilingual_Content.md feed-translation work is parallel and unblocking.

**Secondary user — tenant admin (HR / Comms / Ops).** Configures the WABA tenant in Wyzetalk's admin portal, manages the opt-in campaign (per Phase 1 WhatsApp channel rules), owns the cost ceiling and the message classification policy. Does not interact with WhatsApp itself for this PRD — lives entirely in admin portal. Cares deeply about: per-message cost forecasting, opt-in/opt-out audit trail, and POPIA/GDPR retention model.

**Out of scope (MVP) — buyer / sales.** Sales conversations are the *demand-generation* loop for this work; they don't need a user-facing flow. The mid-April demo target (slipped to end-April / end-May 2026) lives in the demo-readiness checklist, not as a user role. Buyer/sales reads this PRD second-hand via the cross-PRD slice dependency in `Build handoff`.

**Out of scope (MVP) — open-domain LLM user.** An employee asking "what's the leave policy?" is handed off to AI_Assistant_FAQ.md's tawk.to engine via deep-link or Service-window in-WhatsApp handoff. Smart HR WhatsApp does not invent open-domain answers.

---

## 3. Success metrics

| # | Metric | Definition | Target | Measurement source |
|---|---|---|---|---|
| 1 | **Payslip delivery success rate** | % of user-initiated payslip requests that land a payslip in WhatsApp within 30s, end-to-end | ≥ 95% on staging WABA, Slice 1 demo | WABA delivery callback + Sage retrieval log (manual count for demo; analytics wired-up post-Slice-2) |
| 2 | **Identity-proof completion rate** | % of first-access requests that complete the elevated-auth gate without abandonment | ≥ 80% on UAT cohort, Slice 1 demo | Elevated_Auth event log + WABA inbound webhook count |
| 3 | **Utility-classification rate** | % of Wyzetalk-issued templates Meta classifies as Utility (~$0.01/msg) rather than Marketing (~$0.05/msg) | ≥ 95% of Slice 1 templates approved as Utility | Meta template-review dashboard; manual classification log |
| 4 | **24h Service-window coverage** | % of subsequent messages in a user-initiated thread that fall inside the free Service window | ≥ 90% of Slice 1 demo conversations | WABA inbound/outbound timestamp pair |

**Note on measurability.** Metrics 1 and 2 are observable from WABA + Elevated_Auth logs at Slice 1 — no Wyzetalk-side analytics needed for the demo. Metrics 3 and 4 require either Meta dashboard scrape (manual) or analytics plumbing (deferred). Per `System/exec_roadmap.md` "Identified gaps", product analytics is unresourced — Slice 1 is achievable without it; Slice 2+ scaling decisions (BSP cost model, expansion to leave/roster) are not. Build the analytics plumbing under a separate PRD before Slice 3.

---

## 4. Requirements

1. A frontline employee can initiate a conversation in WhatsApp by sending a Wyzetalk-issued utility template (e.g. "Reply PAYSLIP for your latest payslip") that the tenant has pre-approved with Meta.
2. On first access via WhatsApp, the employee completes an elevated-auth identity-proof step (mechanism per Elevated_Auth_Remote_App.md Phase 1) before any sensitive HR content is delivered.
3. After identity proof, the employee receives their requested payslip as a media URL within Meta's 24-hour Service window — i.e. free of marketing-rate charge.
4. The system delivers the payslip from Sage (Slice 1 HRIS target) via signed, time-limited media URLs that survive month-end concurrent retrieval load (≥ 1,000 concurrent payslip pulls without endpoint timeout).
5. The system handles non-structured-HR intents (policy questions, "where do I find X") by handing off to AI_Assistant_FAQ.md — either via deep-link or in-WhatsApp Service-window handoff — without inventing an open-domain answer.
6. The tenant admin can audit every WhatsApp interaction (template send, employee reply, payslip delivery, identity-proof event) from the admin portal in a single interaction log per employee.
7. Employees who have not opted in via the Phase 1 WhatsApp channel rules (Messaging_Ops_Urgent_Alerts.md) cannot be reached by Smart HR templates — opt-in is the precondition for any utility-template send.
8. The system enforces POPIA/GDPR retention rules — no sensitive HR content is stored in WhatsApp's chat history beyond Meta's transit window; payslip retrieval is per-request, not per-store-and-forward.

---

## 5. Slices

**Slice 1 is the walking skeleton — first-time-auth + payslip on demand from Sage.** The spike findings (2026-04-30) confirmed elevated auth is required for first access; this is not deferrable to Slice 2 if Slice 1 is to be a real end-to-end demo (rather than a pre-baked-auth illusion). The walking skeleton therefore spans data + api + ui + auth in one slice. Subsequent slices thicken intent surface and tenant rollout.

| # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |
|---|---|---|---|---|---|
| **1** | **First-time auth + payslip on demand (Sage, single tenant)** | ✅ Yes | One real frontline employee, opted-in to Wyzetalk WhatsApp via Messaging_Ops Part 2, replies to a Wyzetalk utility template ("Reply PAYSLIP"), completes elevated-auth identity proof on first access (per Elevated_Auth Phase 1), receives their real payslip from Sage as a media URL in WhatsApp — end-to-end on production WABA in under 2 minutes. | data + api + ui + auth | Messaging_Ops Part 2 live; Elevated_Auth Phase 1 spec_ready; Payslip_PDF data source; Sage integration; **Jan's spike findings written up** |
| **2** | **Magic Link auth pattern → Blue app for sensitive intents** | No (thickens) | Same payslip flow, but employee taps a short-lived deep-link in WhatsApp → opens Blue → Blue handles auth + serves the payslip. POPIA-compliant for tenants who require the sensitive content not to leave Wyzetalk's domain. | api + ui | Slice 1; Elevated_Auth Phase 1 implemented |
| **3** | **Leave balance intent (Sage or named HRIS)** | No (extends) | Employee replies "LEAVE" to a Smart HR template; intent classifier (rules-based first) routes to leave handler; system returns balance from Sage (or per-tenant HRIS feed). | api + intent classifier | Slice 1; Sage leave-balance feed (or named HRIS) |
| **4** | **FAQ handoff for non-structured intents** | No (extends) | Employee asks a policy question ("what's the maternity policy?"); Smart HR detects out-of-scope intent and either offers a deep-link to AI_Assistant_FAQ.md tawk.to engine or hands off in-WhatsApp via Service window. | api + ui | Slice 1; AI_Assistant_FAQ Phase 1 (Blue app) shipped |
| **5** | **Roster / shift-schedule query** | No (extends) | Employee replies "SHIFT" or "ROSTER"; system returns next shift from scheduling system. | api + HRIS integration | Slices 1 + 3; HRIS scheduling integration (separate PRD, TBD) |

### 5a. Slicing rules applied

- **Slice 1 spans all four layers needed to demo end-to-end** (data + api + ui + auth). Pre-bond drafts had Slice 1 = phone-as-identity (no Magic Link); the 2026-04-30 spike findings invalidated that — elevated auth is required for first access. The walking-skeleton was therefore thickened to include the auth gate. This is the cost of doing the spike: it sharpens, not relaxes, the slice.
- **Cross-PRD slice dependency.** Slice 1 has a hard dependency on Elevated_Auth_Remote_App.md Phase 1 being `spec_ready`. Until that Phase 1 workshop is scheduled (task-20260323-008), Slice 1 cannot enter build. Build handoff names this gate explicitly.
- **Sage as Slice 1 HRIS target.** Spike confirmed Sage (not PaySpace, not SAP). Slices 3 and 5 do NOT inherit Sage — they are HRIS-vendor-named per tenant; the discovery doc flagged this as Open Q5.
- **Parallelisable: Slice 4 (FAQ handoff)** can run in parallel with Slice 3 once Slice 1 is live.
- **GA bundle constraint:** all five slices must ship before Smart HR WhatsApp can be sold as a complete product line. Slice 1 alone is the demo-able cut; Slices 2–5 are revenue-required.

### 5b. Test shape per slice

| # | Unit | Integration | E2E | A11y | Notes |
|---|---|---|---|---|---|
| 1 | WABA webhook dedupe; signed-media-URL token validation; Sage payslip retrieval mock | WABA → Wyzetalk endpoint → Elevated_Auth → Sage stub → media URL → WABA outbound | One real employee on production WABA receives real payslip; identity proof end-to-end | n/a for WhatsApp UI (Meta-controlled); a11y applies to elevated-auth gate UI in Blue if web-rendered | Media-URL stress test = E2E variant; ≥ 1,000 concurrent retrievals required |
| 2 | Magic Link token generation + expiry | WhatsApp → deep-link → Blue auth → payslip render | Same as Slice 1 but auth via Magic Link | Magic Link landing screen in Blue: keyboard-navigable, screen-reader-announced state changes, sufficient contrast | Cross-PRD: Elevated_Auth Phase 1 owns the auth UX; this PRD owns the Magic Link transport |
| 3 | Intent classifier (rules-based) for "leave" / "balance" / "off-day" | Webhook → classifier → leave handler → Sage leave-feed | Employee asks for leave balance; correct response | n/a (WhatsApp surface) | Rule-based classifier first; LLM only after analytics in place |
| 4 | Out-of-scope intent detection | Webhook → classifier → AI_Assistant_FAQ deep-link | Employee asks policy Q; lands in tawk.to | n/a (WhatsApp surface); a11y inherits from AI_Assistant_FAQ.md | Handoff mechanics = open question 1 |
| 5 | Roster intent classifier extension | Webhook → classifier → roster handler → HRIS scheduling feed | Employee asks for next shift; system returns | n/a (WhatsApp surface) | HRIS scheduling integration = separate PRD |

### 5c. Slice 1 demo readiness

Required for the end-April / end-May 2026 demo target:

- [ ] **Pre-vetted demo employee + tenant** — one real employee (with consent), one real tenant in production WABA, with payslip data already available in Sage staging-or-prod. Employee opted-in via Messaging_Ops Part 2 production rules.
- [ ] **Demo journey rehearsed end-to-end on production WABA**, not staging — minimum 3 dry runs in the 72 hours before steerco; rehearsal log committed to vault.
- [ ] **External-dependency-failure fallback rehearsed** — what happens if Sage is unreachable at demo time? Fallback to a pre-recorded video of the flow + a one-line explanation of the failure mode. Both pre-staged.
- [ ] **Defect / known-bad example prepared off-camera** — one example of "wrong payslip blocked by the system" to show the operational discipline behind metric 1 (95% delivery).
- [ ] **Media-URL stress test passed** — ≥ 1,000 concurrent payslip retrievals against signed-media-URL endpoint without timeout. Required before demo, not after.
- [ ] **Engineering capacity confirmed for the new target window** — current state per Shaun 2026-04-30: *"team is not yet there to do this due to pressure and bug fixes."* Without explicit capacity confirmation, demo will slip again.
- [ ] **Jan's spike findings ratified in writing** — `whatsapp-spike-findings.md` is currently a paraphrase. Jan to either ratify or correct before Slice 1 enters build.
- [ ] **Elevated_Auth Phase 1 workshop scheduled** (task-20260323-008). Without it, Slice 1's auth gate has no spec.
- [ ] **Wireframe / paper prototype prepared for Slice 2 (Magic Link in Blue)** — design pass parked; if buyer asks "what does the Magic Link landing look like?", a wireframe answers without committing engineering.

### 5c.2. Slice 2 demo readiness

- [ ] Magic Link landing screen designed in Blue (Claude Design wireframe pass — `design_pass_status: pending`).
- [ ] Token expiry and re-issue UX rehearsed.
- [ ] POPIA/GDPR review of the auth-redirect flow signed off by Legal.

---

## 6. Plan mode seed

```plan-mode-seed
Slice 1: First-time auth + payslip on demand (Sage, single tenant) — One opted-in frontline employee replies "PAYSLIP" to a Wyzetalk utility template, completes elevated-auth identity proof, and receives their real payslip from Sage as a media URL in WhatsApp end-to-end on production WABA in under 2 minutes. Layers: data + api + ui + auth. Depends: Messaging_Ops Part 2 live; Elevated_Auth Phase 1 spec_ready; Sage integration; Jan's spike findings written up.
Slice 2: Magic Link auth pattern → Blue for sensitive intents — Same payslip flow but auth via short-lived deep-link to Blue. Layers: api + ui. Depends: Slice 1; Elevated_Auth Phase 1 implemented.
Slice 3: Leave balance intent — Employee replies "LEAVE"; intent classifier routes to leave handler; system returns balance from Sage or named tenant HRIS. Layers: api + intent classifier. Depends: Slice 1; Sage leave-balance feed (or named HRIS).
Slice 4: FAQ handoff for non-structured intents — Employee asks a policy question; system hands off to AI_Assistant_FAQ.md tawk.to engine via deep-link or in-WhatsApp Service-window handoff. Layers: api + ui. Depends: Slice 1; AI_Assistant_FAQ Phase 1 shipped.
Slice 5: Roster / shift-schedule query — Employee replies "SHIFT" or "ROSTER"; system returns next shift from scheduling system. Layers: api + HRIS integration. Depends: Slices 1 + 3; HRIS scheduling integration PRD (TBD).
```

---

## 7. Risks

- **Engineering capacity does not materialise.** With the team blocked by MVP pressure and bug-fix backlog (per Shaun 2026-04-30), the end-April / end-May 2026 demo target is at high risk of slipping again. **Mitigation:** Slice 1 demo readiness checklist explicitly verifies engineering capacity before commit; if unconfirmed, surface to exec at next post-MVP review for re-prioritisation against the bug-debt and tech-debt gaps.
- **Media-URL pattern fails under month-end concurrent load.** Payslip retrieval at month-end is the highest-load scenario. If signed-media-URL endpoint times out under ≥ 1,000 concurrent pulls, employees see broken payslip retrieval on payday. **Mitigation:** stress test as a Slice 1 demo-readiness gate; fallback to async push delivery if pull pattern fails.
- **Sage integration vendor-specific quirks.** Sage data contract is not yet documented in vault. Slice 1 ships from Sage; quirks could surface during integration. **Mitigation:** capture Sage data contract (field names, auth model, rate limits) in Build handoff snapshot before Slice 1 enters build.
- **Elevated_Auth Phase 1 workshop unscheduled (task-20260323-008).** Without that workshop, Slice 1's auth gate has no spec — Slice 1 cannot enter build. **Mitigation:** Open question 4 routes the schedule decision to Elevated_Auth PRD owner; Slice 1 entry into build is hard-gated on the workshop landing.
- **Message classification slips from Utility (~$0.01) to Marketing (~$0.05).** Template wording determines Meta's classification. A 5x cost overrun per message materially breaks the cost model. **Mitigation:** Slice 1 demo readiness includes Meta template review with Utility classification approval as the gate; BSP relationship advises on wording.
- **BSP selection unresolved.** No BSP named (Twilio, 360dialog, MessageBird?). Affects per-message markup, MAU pricing, developer ergonomics. **Mitigation:** Open question 3 routes to Anneke (was investigating); decision required before Slice 1 cost economics are signed off, not before build.
- **24h Service-window economics broken by template change.** Meta could shift the Service-window pricing model (precedent: 2026 per-message pricing shift). **Mitigation:** quarterly cost-model audit + BSP relationship as early-warning channel.
- **Cross-PRD config conflict with Messaging_Ops_Urgent_Alerts.md Part 2.** Both PRDs use the same WABA tenant infrastructure; Part 2 ships next week. If tenant-config seam is not designed, Smart HR may break Part 2's broadcast or vice versa. **Mitigation:** Build handoff names this as a hard gate; Comms_service team validates configuration compatibility before Slice 1 build.

### Technical failure modes

- **External dependency unavailable — Sage:** employee receives a graceful "your payslip isn't available right now, please try again in 10 minutes" Service-window reply. Logged as a Sage-unavailable event. Tenant admin sees the event in their interaction log. No retry-loop to avoid hammering Sage.
- **External dependency unavailable — Meta WABA:** outbound message queued for 30 minutes; if Meta still unavailable, employee receives nothing (no in-app notification, since we're WhatsApp-native). Tenant admin alerted via existing Messaging_Ops Part 2 monitoring.
- **External dependency unavailable — Elevated_Auth:** first-access auth fails silently; employee sees "we couldn't verify your identity right now, please try again." No payslip delivered. Tenant admin sees identity-proof failure event.
- **Idempotency on retry:** WABA inbound webhooks are de-duplicated via Meta's `message.id` (server-enforced). Outbound messages use a Wyzetalk-side request UUID. Re-send of the same payslip request in a 60s window returns the cached response, not a new Sage query.
- **Cache miss / corruption:** payslip media URLs are signed and time-limited — no Wyzetalk-side cache. Sage is the source of truth per request. No corruption risk; reliability risk is Sage availability (covered above).
- **Slow render / timeout:** if Sage retrieval takes > 10s, employee receives a "your payslip is on the way, this may take a moment" Service-window message; if > 30s, the request times out and employee receives an apology. SLA target: 95th percentile < 5s for the demo.
- **Vendor lock-in (BSP):** the WhatsApp Flow + WABA contract is at the integration boundary, not the BSP. A BSP swap requires reconfiguring credentials and template approvals, not rewriting handlers. Slice 1's BSP decision should NOT bake the BSP into the handler API surface — interface boundary at the BSP-config seam.

---

## 8. Out of scope

| Out of scope | Why | Future cycle? |
|---|---|---|
| Open-domain LLM chat over WhatsApp | Owned by AI_Assistant_FAQ.md (tawk.to engine for non-structured-HR intents). Smart HR is a structured-HR-self-service surface, not an open assistant. | No — explicit non-goal |
| Peer-to-peer chat over WhatsApp | Owned by Employee_Chat_and_Groups.md (peer chat lives in Blue app). Standard WhatsApp groups expose personal data and are non-compliant for frontline industries. | No — explicit non-goal |
| Emergency comms via WhatsApp | Owned by Messaging_Ops_Urgent_Alerts.md Part 2 (one-way broadcast). Two-way conversation patterns are inappropriate for emergency-comm reliability requirements. | No |
| Multi-tenant rollout in Slice 1 | Single-tenant is the bond_v1 demo scope. Multi-tenant ships at GA after Slice 5. | Yes, post-MVP (GA) |
| HRIS coverage beyond Sage | Slice 1 = Sage only (per spike findings). PaySpace, SAP, custom HRIS are per-tenant decisions handled at Slice 3 spec time. | Yes, future (Slices 3 + 5 per-tenant) |
| Granular per-intent opt-in / opt-out preferences | Tenant admin opt-in (Phase 1 WhatsApp rules) is the only opt-in surface in Slice 1. Per-intent opt-in defers to post-Slice-3 once intents exist. | Yes, post-Slice-3 |
| Wyzetalk-side analytics on WhatsApp interactions | Per `System/exec_roadmap.md` "Identified gaps", product analytics is unresourced. Slice 1 metrics use WABA + Sage logs (manual count for demo). | Yes, future (separate analytics PRD) |
| LLM-based intent classifier in Slice 3 | Rules-based classifier first. LLM upgrade only after analytics is in place to measure classification accuracy. | Yes, post-Slice-3 |
| WhatsApp Flow vendor accelerator (Flow Gear) as a binding default | Pilot 2026-04-17 explicitly excluded Flow Gear as a baseline. Spike-only; revisit post-Slice-1 if needed. | No — non-default by design |

---

## 9. Open questions

| # | Question | Blocks | Owner / next step |
|---|---|---|---|
| 1 | **Spike findings ratification.** `whatsapp-spike-findings.md` is Shaun's paraphrase of Jan's verbal report. Jan to ratify or correct in writing. | Slice 1 entry into build | Jan (validate) + Shaun (capture); next step: 30-minute call before Slice 1 build kickoff |
| 2 | **Demo target date.** End-April or end-May 2026? Sequencing of Slice 1 dry-runs and engineering capacity confirmation depends on the exact date. | Slice 1 demo readiness | Merel + Shaun; next step: confirm at next post-MVP review |
| 3 | **BSP selection.** Twilio, 360dialog, MessageBird, or other? Affects per-message markup, MAU pricing, developer experience. | Slice 1 cost economics sign-off (NOT slice-1 build) | Anneke (was investigating per 2026-03-30 action); next step: surface BSP shortlist + cost comparison |
| 4 | **Elevated_Auth Phase 1 workshop schedule.** task-20260323-008 currently unscheduled. | Slice 1 entry into spec_ready (HARD GATE) | Elevated_Auth_Remote_App.md PRD owner; next step: schedule workshop |
| 5 | **HRIS coverage for Slices 3 + 5 (leave / roster).** Sage handles payslip in Slice 1. Leave + roster per tenant — PaySpace, SAP, custom? | Slice 3 + Slice 5 spec | Product + Engineering; next step: per-tenant HRIS audit at Slice 3 spec time |
| 6 | **POPIA/GDPR retention model.** What gets stored, where, for how long? Carries from legacy PRD. | GA (not Slice 1) | Legal + Product; next step: legal review at Slice 2 sign-off |
| 7 | **Message classification (Utility vs Marketing).** Template wording determines Meta's per-message rate. | Slice 1 cost economics | Product + BSP relationship; next step: Meta template review as Slice 1 demo gate |
| 8 | **Tenant-config seam with Messaging_Ops Part 2.** Both PRDs share WABA tenant infrastructure. Configurations compatible? Seam designed? | Slice 1 entry into build | Comms_service / Messaging_Ops PRD owner + this PRD owner; next step: 30-minute joint review before Slice 1 build kickoff |

**None of these block Slice 1 build except Q1, Q4, and Q8.**
- Q1 (spike ratification) — Jan must ratify before Slice 1 build kickoff.
- Q4 (Elevated_Auth Phase 1 workshop) — workshop must land before Slice 1 enters spec_ready.
- Q8 (Messaging_Ops Part 2 tenant-config seam) — joint review before Slice 1 build kickoff.

Q3 (BSP) and Q7 (message classification) block cost-economics sign-off, not Slice 1 build itself — they can run in parallel.

---

## 10. Design pointers

**Context.** This PRD is primarily an engineering integration — the user-facing surface is WhatsApp, which is Meta-controlled and outside Wyzetalk's design scope. The only Wyzetalk-side design surface in Slice 1 is the **elevated-auth identity-proof UI** (rendered either in Blue or in a web view per Elevated_Auth_Remote_App.md Phase 1 spec — design ownership lives there, not here). Slice 2 introduces a second design surface: the **Magic Link landing in Blue** that handles auth + serves the payslip. That is the warranting case for `design_pass_status: pending`.

**Surfaces in scope (Wyzetalk-controlled):**
1. Slice 1: Elevated-auth identity-proof UI (cross-PRD; design ownership in Elevated_Auth_Remote_App.md).
2. Slice 2: Magic Link landing screen in Blue — payslip render + auth state transition.
3. Slice 4 (parallel): in-WhatsApp handoff copy for AI_Assistant_FAQ.md (Service-window message). Design touch is template wording, not pixels.

**Critical UX questions for the designer to answer (Slice 2):**
- How does the Magic Link landing announce that the link is auth-gated *before* the user taps? (Recommendation: short Service-window message preceding the link, e.g. "Tap below to view your payslip. You'll be asked to verify your identity once.")
- What's the failure-mode UX for a token-expired Magic Link? (Recommendation: a single-screen state in Blue: "this link has expired — reply PAYSLIP in WhatsApp for a new one.")
- How is the payslip rendered in Blue's Magic Link landing — full PDF preview, summary cards, or both? (Recommendation: summary cards as default; full PDF download as a second action.)

**Failure-mode UX (required — covers the technical failure modes named in §7):**
- **Sage unavailable:** Service-window reply: "Your payslip isn't available right now. Please try again in 10 minutes." (Tone: matter-of-fact, not apologetic.)
- **Meta WABA unavailable:** no UX surface (employee sees nothing on their end). Tenant admin sees the event in interaction log.
- **Elevated_Auth unavailable:** Service-window reply: "We couldn't verify your identity right now. Please try again." (Same tone register.)
- **Sage slow render (> 10s):** Service-window message: "Your payslip is on the way — this may take a moment." (Avoid implying Wyzetalk's system is slow; the language should localise the wait to the request, not the platform.)
- **Sage timeout (> 30s):** Service-window message: "Sorry, we couldn't fetch your payslip this time. Please try again." (Apologetic register; signals to user it's a one-off, not systemic.)

**A11y requirements (non-negotiable):**
- **`lang` attribute** on the Magic Link landing screen (Slice 2) — content is in the user's tenant default language, but the platform may render it on devices set to other languages. Without `lang`, screen readers mispronounce. Non-negotiable.
- **Keyboard navigability** of the Magic Link landing — Slice 2 must support keyboard-only operation (some employees use external keyboards; many use voice input).
- **Screen-reader announcement** of state transitions on the Magic Link landing (`aria-live`) — "verifying your identity," "payslip ready," "link expired."
- **Sufficient contrast** for outdoor / low-light frontline use — meet WCAG 2.1 AA minimum on the Magic Link landing.
- **Tap-target sizes** ≥ 44×44 px on Magic Link landing per platform guidelines.

**Constraints on design:**
- Must **not** invent new copy patterns for failure-mode UX — reuse existing Blue + AI_Assistant_FAQ.md tone register where applicable.
- Must **not** introduce a new auth pattern beyond what Elevated_Auth_Remote_App.md Phase 1 specifies — this PRD inherits, doesn't extend.
- Must **not** localise the failure-mode copy in Slice 2 — Multilingual_Content.md ships multilingual feed translation separately; Magic Link landing inherits when that PRD lands.
- Must respect Meta's Service-window economics — every outbound message in a degraded state costs marketing rate ($0.05) unless inside the 24h window.

**What the designer should NOT prescribe:**
- BSP selection (Q3 in §9) — engineering / procurement decision.
- Sage data contract (Q1 spike, Q5 HRIS) — engineering decision.
- Elevated_Auth mechanism (cross-PRD).
- Message classification wording (Q7) — product + BSP relationship decision; designer advises, doesn't decide.

**Design slice ordering:**
- Slice 1: no Wyzetalk-side design surface (auth UX inherited from Elevated_Auth_Remote_App.md).
- Slice 2: **Magic Link landing in Blue — Claude Design wireframe pass scheduled when credit resets.**
- Slice 3: no design surface (intent surface is WhatsApp; classifier is server-side).
- Slice 4: copy-only (Service-window handoff message); no wireframe needed.
- Slice 5: no design surface.

---

## 11. Build handoff

> **Repo split callout.** This PRD lives in the Wyzetalk vault at `06-Resources/PRDs/Smart_HR_Whatsapp.md` (GitHub: `davekilleen/dex-vault` or fork — confirm with the vault owner). The implementation code lives in the Wyzetalk product Bitbucket repo. **There is no automated sync** between vault and codebase — handoff is manual.

### 11b. How to use this PRD in Cursor Plan mode (in the codebase repo)

1. Copy this entire markdown file to the codebase repo at `docs/PRDs/Smart_HR_Whatsapp.md` (or the repo's product-spec convention).
2. Also copy these sibling PRDs that have cross-PRD slice dependencies:
   - `06-Resources/PRDs/Messaging_Ops_Urgent_Alerts.md` — Part 2 owns the WhatsApp tenant infrastructure Slice 1 inherits.
   - `06-Resources/PRDs/Elevated_Auth_Remote_App.md` — Phase 1 owns the elevated-auth gate Slice 1 inherits.
   - `06-Resources/PRDs/Payslip_PDF.md` — data-source PRD for the payslip media URL pattern.
   - `06-Resources/PRDs/AI_Assistant_FAQ.md` — Slice 4 handoff target.
3. Also copy the spike-findings note: `06-Resources/Product_ideas/whatsapp-spike-findings.md` — names the engineering decisions Slice 1 depends on.
4. Open Cursor with the codebase repo as workspace, with all five files in context.
5. Paste the **Plan mode seed** block (§6) as the Plan mode prompt — each line maps to one Plan-mode step → one PR / branch.
6. Reference the Slices (§5), Test shape per slice (§5b), Slice 1 demo readiness (§5c), Risks (§7), Open questions (§9), and Design pointers (§10) for full context.

### 11c. Handoff snapshot

| Field | Value |
|---|---|
| **Source file (vault)** | `06-Resources/PRDs/Smart_HR_Whatsapp.md` (GitHub: Wyzetalk vault repo) |
| **bond_v1 last run** | 2026-04-30 16:00 |
| **Lifecycle** | `spec_ready` (Slice 1 hard-gated by Q1 + Q4 + Q8) |
| **Slice 1 demo-readiness deliverables** | Pre-vetted demo employee + tenant on production WABA · End-to-end rehearsal log · Sage-unavailable fallback rehearsed · Defect example off-camera · Media-URL stress test ≥ 1,000 concurrent retrievals · Engineering capacity confirmed · Spike findings ratified · Elevated_Auth Phase 1 workshop scheduled · Slice-2 wireframe prepared |
| **Cross-PRD slice dependencies** | Messaging_Ops_Urgent_Alerts.md (Part 2 live, wrapping next week) · Elevated_Auth_Remote_App.md (Phase 1 spec_ready, blocked on workshop) · Payslip_PDF.md (data source) · AI_Assistant_FAQ.md (Slice 4 handoff target, Phase 1 must be shipped) |
| **Hard gates before Slice 1 build** | Q1 — Jan ratifies spike findings in writing · Q4 — Elevated_Auth Phase 1 workshop landed · Q8 — Messaging_Ops Part 2 tenant-config seam joint review · engineering capacity confirmed |
| **Hard gates before later slices / GA** | Q3 — BSP decision (Slice 1 cost sign-off; Slice 1 build can proceed before this lands) · Q5 — per-tenant HRIS audit (Slices 3 + 5) · Q6 — POPIA/GDPR retention review (Legal sign-off before GA) · Q7 — Meta template Utility classification approved (Slice 1 cost gate) |
| **Sign-off needed before Build** | Product (Shaun) · Engineering (Jan — spike ratification) · Elevated_Auth PRD owner (workshop scheduled) · Messaging_Ops PRD owner (config seam) |

### 11d. Source-of-truth rule

1. Edits to the codebase-repo copy do **not** propagate back to the vault. The vault is canonical.
2. For spec changes, edit the source file in the Wyzetalk vault and re-run `/prd-author-custom`.
3. The skill's idempotence rule protects the vault source from accidental overwrites — author edits since `last_bond_run` block silent regeneration.
4. Communicate spec changes to the codebase-repo owner via Teams (not Slack) — `@<engineering-lead>` in the appropriate channel — with the diff link.

---

*Authored 2026-04-30 by /prd-author-custom from `06-Resources/Product_ideas/smart-hr-whatsapp_discovery.md` (Path B reshape — overwrites prior agent-prd shape; pre-bond content preserved in git history). Spike findings paraphrase: `06-Resources/Product_ideas/whatsapp-spike-findings.md`. Last run: 2026-04-30 16:00.*
