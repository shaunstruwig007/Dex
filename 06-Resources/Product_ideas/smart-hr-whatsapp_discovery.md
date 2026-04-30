---
discovery_id: smart-hr-whatsapp
discovery_shape: discovery_v1
status: draft
created_date: 2026-04-30
last_updated: 2026-04-30  # spike findings paraphrased + capacity constraint added
authored_by: /initiative-discovery-custom (Path B — refine existing PRD into bond_v1)
exec_roadmap_priority: 1
spike_findings_note: 06-Resources/Product_ideas/whatsapp-spike-findings.md  # paraphrased Jan 2026-04-30; pending Jan validation
icp_version_at_run: v1 — 2026-04-29
felix_signal_at_run: 2026-04-20 (10 days old — within freshness window)
related_prds:
  - Smart_HR_Whatsapp.md (lifecycle: spec_ready, agent-prd shape — target of this discovery)
  - Messaging_Ops_Urgent_Alerts.md (foundation; Part 2 wrapping up next week)
  - AI_Assistant_FAQ.md (boundary — FAQ handoff lives there)
  - Elevated_Auth_Remote_App.md (coupled dependency — Magic Link auth)
  - Payslip_PDF.md (data source for Slice 1)
  - Tenant_Management.md (WhatsApp config TC-24 to TC-36)
  - Profile_Users.md (employee opt-in preference)
ready_for_prd: true
ready_for_prd_blockers: []
---

# Discovery — Smart HR on WhatsApp (bond_v1 reshape)

> **Path B discovery.** `Smart_HR_Whatsapp.md` already exists in agent-prd shape (`spec_ready`, elevated to #1 commercial priority on 2026-03-30). This discovery validates its decisions against current state, surfaces what's stale post-2026-03-30, and produces input for `/prd-author-custom --rerun` to bring it into bond_v1 shape (slices, plan-mode-seed, build handoff). **No re-litigation of the proposition** — exco has ratified it (priority #1).

---

## Status

**Sparse-vault honesty.** Customer / CS evidence is not captured in vault. Per the new exec-driven discovery rules (`System/exec_roadmap.md`), this is **expected, not a failure mode**. Discovery cites exco ratification as the proximate evidence source and uses the JEM competitor profile + Friday signal for triangulation. **The discovery is `ready_for_prd: true`** — outstanding open questions are scoped to specific slices, not blocking.

---

## Problem statement

Frontline employees in deskless industries (mining, manufacturing, retail, logistics) primarily live in **WhatsApp**, not in apps. Wyzetalk's existing reach into this audience uses one-way SMS, push, in-app, and (Phase 1, near-shipping) WhatsApp broadcast — all of which are *outbound only*. HR self-service — payslips, leave balances, shift schedules, HR FAQ — currently requires the employee to open the Blue app or use a desktop, which the workforce in question demonstrably does not do at scale.

The competitive frame: **JEM HR** (T0 competitor) and Paymenow have both shipped conversational HR via WhatsApp and are landing the move-upmarket play (Zuko Mdwaba, ex-Workday/Salesforce Africa, joined JEM Jul 2025 as Strategic Enterprise Partner). The pressure on Wyzetalk is to convert the existing one-way WhatsApp broadcast channel into a **two-way self-service surface** with auth and data delivery patterns that comply with POPIA/GDPR — without compromising the privacy guarantees that distinguish Wyzetalk from standard WhatsApp groups.

Sources: `06-Resources/Competitors/profiles/Jem.md` · `06-Resources/Market_intelligence/synthesis/weekly/2026-04-20_friday_signal.md` · `06-Resources/PRDs/Smart_HR_Whatsapp.md` § *Competitive context*.

---

## User segments

**Primary:** Frontline employees in ICP segment 1 (large, distributed frontline workforce) overlapping ICP segment 2 (HR self-service / secure access). They expect to ask and answer in WhatsApp because their non-work life lives there.

**Secondary:** Tenant admins (HR, Comms, Ops) who configure WhatsApp Business Account, manage opt-in campaigns, and own the cost ceiling. These users live in the admin portal, not WhatsApp.

**Out of scope (this initiative):**
- Emergency comms via WhatsApp — owned by `Messaging_Ops_Urgent_Alerts.md` Part 2 (one-way broadcast).
- Open-domain LLM chat over WhatsApp — handed off to `AI_Assistant_FAQ.md`'s tawk.to engine on non-structured-HR intents.
- Peer-to-peer chat over WhatsApp — explicitly out of scope of `Employee_Chat_and_Groups.md` (peer chat lives in Blue app, not WhatsApp; standard WhatsApp groups expose personal data and are non-compliant).

---

## ICP segment match

Maps cleanly to **ICP segment 1 (frontline + multi-channel access)** and **ICP segment 2 (HR self-service / secure employee access for sensitive info use cases)**. Evidence: `System/icp.md` § Variant 2 explicitly lists payslip, leave balance, shift schedule, vacancies as the core HR self-service use cases — these are the same intents Smart HR WhatsApp ships. ICP § "Wyzetalk Essential scope note" excludes USSD; WhatsApp Flow is the closest functional analogue for low-app-affinity workforces.

**No cross-segment disqualifiers.** Segment 4 (Crisis/Emergency Comms via WhatsApp) is adjacent but already owned by `Messaging_Ops_Urgent_Alerts.md` Part 2 — the two co-exist, they don't conflict.

---

## Exec-roadmap match

**Priority 1** in `System/exec_roadmap.md` — *"WhatsApp Integration: Functional integration to support remote app features and communication through WhatsApp."* Discovery's job here is to **scope, slice, and de-risk an already-decided proposition.** No re-litigation.

**Background risks from exec roadmap "Identified gaps":**
- **Product analytics (gap #1)** — without analytics instrumented, the success metrics in any bond_v1 slice (utility-message classification rate, payslip delivery rate, intent classification accuracy) are unmeasurable. Slice 1 demo readiness is achievable without analytics; Slice 2+ scaling decisions are not.
- **Bug debt (gap #2)** — any Smart HR WhatsApp defect lands in a backlog with no triage rule against MVP debt. The bond_v1 PRD should not silently assume defects get resourced.
- **Tech debt + capacity (gap #3) — UPGRADED 2026-04-30.** WABA spike was completed by Jan in a tech-forum meeting (paraphrased findings now captured in `whatsapp-spike-findings.md` 2026-04-30; pending Jan validation). The mid-April demo milestone has slipped to **end-April / end-May 2026**. **Engineering capacity is the binding constraint** — confirmed by user 2026-04-30: *"team is not yet there to do this due to pressure and bug fixes."* The bond_v1 PRD's Slice 1 demo-readiness checklist must explicitly verify engineering capacity for the new target window; otherwise slice 1 will slip again.

---

## Stakeholders (named SMEs to talk to before spec lands)

| Name | Role | Why relevant | Last meeting / page |
|---|---|---|---|
| **Jan Vosloo** | Engineering — WABA + WhatsApp Flow spike owner | Feasibility report exists verbally only (tech-forum meeting; no recording). Bond_v1 PRD will need his findings written down. | No person page yet (vault sparse) |
| **Merel van der Lei** | CEO/CPO | Locked technical baseline 2026-03-30 (WABA + Flow, no Flow Gear default). Raised Magic Link auth question. | Mentioned in `Smart_HR_Whatsapp.md` legacy section + `06-Resources/Meeting_archive/2026-04-29 - Exec session - post-MVP roadmap.md` |
| **Leon Janse van Rensburg** | CTO | Played live Paymenow demo 2026-03-30; clarified "WhatsApp Flow not Flow Gear" 2026-04-29. | Same as above |
| **Anneke Vermeulen** | (role TBC — see person-page gap) | Owned "investigate new WhatsApp one-way pricing" action from 2026-03-30. | Same |
| **Tanya** | (role TBC) | Was co-owner of "organise April discovery workshops (WhatsApp track)" with Shaun. | No person page |

> All stakeholders need person pages — vault is currently sparse. Flagged as evidence gap, not blocker.

---

## Customer evidence

| # | Quote / Signal | Source | Date |
|---|---|---|---|
| 1 | *"The single most common sales objection is lack of WhatsApp. Clients perceive WhatsApp as free and expect it."* | `Smart_HR_Whatsapp.md` § *Detailed product context (legacy)* — captured 2026-03-30 leadership session | 2026-03-30 |
| 2 | "70% of employee–system interactions are shifting to conversational interfaces; 98% SMS read rate. WhatsApp is not just preferred — it is where frontline workers already live." | `Messaging_Ops_Urgent_Alerts.md` § Evidence (EV-2026-03-004) — market signal | 2026-03-XX |
| 3 | "TA vendors now shipping frontline flows on SMS/WhatsApp — same channel employees associate with deskless comms." | `Messaging_Ops_Urgent_Alerts.md` § Evidence (EV-2026-03-002) — market signal | 2026-03-XX |
| — | **Direct customer / CS quotes:** none captured in vault. Off-record context exists per PM. | — | — |

**Severity of customer-evidence gap:** `expected` (per the new sparse-evidence rule for exec-roadmap-matched initiatives). Triangulation is via competitor profile (JEM) + market signals (above) + exco ratification.

---

## Competitor + market signal

| Name | URL / source | Positioning vs Wyzetalk | Last reviewed |
|---|---|---|---|
| **JEM HR** | [Profile](../Competitors/profiles/Jem.md) — T0 watch | WhatsApp-native frontline HR (payslips via Deel/PaySpace; leave; comms). 200,000+ employees, 180+ SA businesses. Direct competitive overlap on payslip + payroll integration. Moving upmarket (enterprise sales motion via Zuko Mdwaba, Jul 2025). | 2026-04-24 |
| **Paymenow** | Referenced in `Smart_HR_Whatsapp.md` § Competitive context (Leon played live demo 2026-03-30) | Financial-inclusion + EWA via WhatsApp; free communication line subsidised by EWA model. **Adjacent to exec priority #5 (EWA: FloatPays).** | 2026-03-30 |

**Friday Signal 2026-04-20 — relevant T0 line:**
> "JEM HR's platform is unchanged: Jem Mobile (device + data via payroll deduction) · SmartWage (EWA) · Deel/PaySpace payroll integration · WhatsApp HR comms. The enterprise sales acceleration via Zuko Mdwaba (ex-Workday/Salesforce Africa, appointed Jul 2025) continues to compound in the background — no public announcement this week."

**Read:** Pressure persists but is not accelerating. JEM did not ship a new product extension in the week of 20–24 April. Wyzetalk has a window — likely 1–2 quarters before JEM's enterprise motion lands at Wyzetalk's ICP accounts.

---

## Solution-pattern survey

How is conversational HR over messaging shipping in the market?

| Pattern | Example | What it does | Applicability for Wyzetalk Smart HR WhatsApp |
|---|---|---|---|
| **Native WhatsApp Flows (Meta)** | Meta Business API + Flow JSON | Secure, branded, in-WhatsApp UX. No data stored in chat. Compliant with POPIA/GDPR if encryption + retention right. | **Binding baseline** per 2026-03-30 leadership session + 2026-04-17 collaborative pilot. |
| **BSP-mediated WABA** | 360dialog · Twilio · MessageBird | Adds markup / MAU pricing on top of Meta. Provides developer ergonomics + template management UX. | **Spike-pending.** BSP selection is an open question in `Smart_HR_Whatsapp.md`. |
| **Magic Link auth → app** | Common in financial-services | WhatsApp message contains short-lived deep-link → app handles auth + serves the sensitive content. | **Coupled with `Elevated_Auth_Remote_App.md`** (Phase 1 workshop pending; task-20260323-008). Slice 2 dependency. |
| **24h Service-window optimisation** | Meta pricing model | User-initiated reply opens free 24h reply window — subsequent messages free. | **Applicable at Slice 1.** Smart HR templates should encourage a user-initiated trigger (e.g. "reply YES to receive payslip"). |
| **Vendor accelerator (Flow Gear)** | South African vendor | Faster Flow setup; pre-built integrations. | **Spike-only, not a binding default.** 2026-04-17 pilot explicitly excluded Flow Gear as a baseline; revisit after spike if needed. |

**Solution thesis:** *Slice 1 ships a WhatsApp Flow utility-template that delivers a payslip on user-initiated trigger, with phone-as-identity (matching the Messaging_Ops Part 2 opt-in model). Slice 2 adds Magic Link auth, coupled to `Elevated_Auth_Remote_App.md`. Slices 3–5 thicken the intent surface and FAQ handoff. BSP selection remains a parallel decision.*

---

## Candidate slices (for `/prd-author-custom --rerun`)

The PRD author may refine, drop, or merge. **Slice 1 is the walking skeleton.**

| # | Slice | Demo outcome | Layers | Depends |
|---|---|---|---|---|
| **1** | **Skeleton — payslip on demand.** Single tenant. Single intent (payslip). Phone-as-identity (no Magic Link). Frontline employee opted-in via Messaging_Ops Part 2 → receives a utility template ("Reply PAYSLIP for your payslip") → replies → receives payslip PDF in-WhatsApp via WhatsApp Flow. | One real frontline employee receives their real payslip in WhatsApp end-to-end, on a real (not staging) WABA, in under 2 minutes from request. | data + api + ui | Messaging_Ops Part 2 live; Payslip_PDF data source; WABA + Flow spike findings written up |
| **2** | **Magic Link auth.** Replace phone-as-identity with deep-link auth to the Blue app for sensitive intents. WhatsApp message contains short-lived link → user taps → Blue auth → action completes (payslip download, leave query, etc.). | Same payslip flow, but auth happens via Magic Link rather than phone-as-identity. POPIA-compliant for stricter tenants. | data + api + ui | Slice 1; **Elevated_Auth_Remote_App Phase 1 workshop complete (task-20260323-008)** |
| **3** | **Leave balance intent.** Add a second intent. Intent classifier (rules-based first; LLM later) routes "leave", "balance", "off-day" → leave handler. | Employee can ask either "payslip" or "leave" via WhatsApp; correct handler responds. | api + intent classifier | Slice 1; HRIS leave-balance feed |
| **4** | **FAQ handoff.** Non-structured-HR intents (policy, "where do I find X") route to `AI_Assistant_FAQ.md`'s tawk.to engine via deep-link or in-WhatsApp-handoff. | Employee asks "what's the leave policy?" → bot offers handoff → tawk.to picks up. | api + ui | Slice 1; AI_Assistant_FAQ Phase 1 (Blue app) shipped |
| **5** | **Roster / shift query.** Third intent — depends on HRIS / scheduling integration. | Employee asks "next shift?" → system returns. | api + HRIS integration | Slices 1, 3; HRIS integration PRD (TBD) |

**Walking-skeleton thesis:** Slice 1 alone is enough to validate the load-bearing technical and commercial claim — that WABA + WhatsApp Flow + payslip data + the 24h Service window economics actually work in production. If Slice 1 doesn't demo cleanly, no later slice matters.

**Out-of-scope candidates (not in slice plan, captured here so they don't sneak in):**
- Multi-tenant rollout — handled at GA, not as a slice. Single-tenant is the bond_v1 scope.
- Granular per-intent opt-in/opt-out preferences — defer to post-Slice-3 once intents exist.
- Full open-domain LLM in WhatsApp — explicitly out of scope; route to AI_Assistant_FAQ.

---

## Open questions (for the PRD author / steerco)

1. **Engineering spike write-up — PARTIALLY CLOSED 2026-04-30.** Jan reported back verbally in a tech forum (no recording). Shaun's paraphrased capture lives in `whatsapp-spike-findings.md` (2026-04-30) — confirms WA Flow + endpoint connection works, names media-URL pattern as the payslip transport (needs stress-test), names **Sage** as the first HRIS, and confirms elevated/validation auth required for first access. **Pending:** Jan to validate the paraphrase before bond_v1 enters `spec_ready`. **Owner:** Jan (validate) + Shaun (capture).
2. **Demo / sales target date.** Mid-April 2026 has slipped to **end-April / end-May 2026**. Which exact date? Slice 1 demo readiness needs a target. **Blocks:** Slice 1 sequencing. **Owner:** Merel + Shaun.
3. **BSP selection.** Smart_HR_Whatsapp's open question still unresolved — affects per-message markup, MAU pricing, developer experience. **Blocks:** Slice 1 cost economics. **Owner:** Anneke (was investigating).
4. **Magic Link auth scope.** Slice 2 depends on `Elevated_Auth_Remote_App.md` Phase 1 workshop (task-20260323-008). Is that workshop scheduled? If not, Slice 2 risks slipping. **Blocks:** Slice 2 entry into spec_ready. **Owner:** Elevated Auth PRD owner.
5. **HRIS systems for leave/roster — PARTIALLY CLOSED 2026-04-30.** Slice 1 payslip target is **Sage** (per spike findings). PaySpace, SAP, custom HRIS landscape for Slices 3 and 5 (leave / roster) remains unresolved. **Blocks:** Slice 3 + 5 spec. **Owner:** Product + Engineering.
6. **POPIA/GDPR retention model.** What gets stored, where, for how long? Open from `Smart_HR_Whatsapp.md`. **Blocks:** GA, not Slice 1. **Owner:** Legal + Product.
7. **Message classification — Utility vs Marketing.** Template wording determines Meta's classification (Utility ~$0.01 vs Marketing ~$0.05). Affects Slice 1 cost and tenant pricing model. **Blocks:** Slice 1 cost economics. **Owner:** Product + the BSP relationship.
8. **One-way → two-way overlap with `Messaging_Ops_Urgent_Alerts.md` Part 2.** That PRD ships next week. Slice 1 of Smart HR depends on the same WABA infrastructure. Are the configurations compatible? Is there a tenant-config seam to manage? **Blocks:** Slice 1 entry into build. **Owner:** Comms_service / Messaging_Ops PRD owner + this PRD's owner.

---

## Evidence gaps (what discovery could not find)

1. **No customer / CS meetings in vault for this initiative.** Severity: **expected** (sparse-vault posture for exec-driven initiatives). Triangulation via JEM profile + Friday signal + exco ratification.
2. **Engineering spike paraphrased, pending validation 2026-04-30.** Captured in `whatsapp-spike-findings.md`. Five findings confirmed (feasibility, media-URL pattern, Sage as first HRIS, elevated auth needed, capacity constrained). Pending Jan to ratify or correct before bond_v1 enters `spec_ready`. Was: verbal-only.
3. **No competitor-parity data on Magic Link auth via WhatsApp.** JEM ships payslip-via-WhatsApp but the auth pattern is not documented in their profile. Worth a refresh on the JEM profile if Slice 2 is committed.
4. **No HRIS-integration coverage in vault.** Affects Slices 3 + 5. The bond_v1 PRD should call this out, not silently assume HRIS data is available.
5. **No analytics / tracking spec for WhatsApp message delivery.** From `System/exec_roadmap.md` "Identified gaps" — analytics is unresourced. Slice success metrics will be observable via WABA delivery callbacks but not via Wyzetalk's own analytics layer (because it doesn't exist yet).
6. **No person pages for any of the named stakeholders.** Vault is currently sparse. Recommended: capture Jan, Merel, Leon, Anneke, Tanya as person pages before bond_v1 PRD authoring so the related_prds + stakeholders fields are anchored.

---

## Recommendation to PRD author

**Action:** `/prd-author-custom --rerun` on `06-Resources/PRDs/Smart_HR_Whatsapp.md`.

The skill will (per its idempotence rule) detect that `Smart_HR_Whatsapp.md` has been edited since the last bond run (it hasn't been bond-run yet — current shape is agent-prd) and ask: Overwrite | Merge | Save-as | Abort. **Recommended response: Save-as** to preserve the legacy agent-prd content as a historical reference, and produce a parallel `Smart_HR_Whatsapp.md` in bond_v1 shape. Reasons:

1. The legacy PRD has rich pricing tables and competitive context that should NOT be lost.
2. Bond_v1 captures these in different sections (Risks, Solution patterns) — Save-as preserves audit trail.
3. The Save-as keeps the legacy PRD discoverable for the engineering team during the transition.

Alternative: **Overwrite** if you're comfortable with `git diff` as the audit trail. (My preference.)

The bond_v1 output will need:
- `goal:` derived from this discovery's problem statement
- `slices:` from the candidate slice table above
- `risks:` including the three exec-roadmap "Identified gaps" + the eight open questions
- `design pointers:` per the bond_v1 spec (this PRD has minimal design surface — it's primarily a WhatsApp Flow + tenant-config decision; design pointers should focus on Flow JSON UX patterns + the Magic Link transition UX in Blue)
- `build handoff:` per the bond_v1 spec (cross-PRD deps: Messaging_Ops, Elevated_Auth, AI_Assistant_FAQ, Payslip_PDF)
- `design_pass_status: not_applicable` (mostly — Slice 2's Magic Link UX in Blue may need a Claude Design pass)

After bond_v1 lands, run `/critique-product-custom` and `/critique-engineering-custom` per the standard pipeline. **Both should run** — the engineering critique especially, given the spike findings are verbal-only.

---

## Steps the discovery skill explicitly DID NOT take

(Honesty rule.)

- **Did not interview Jan** to capture the spike findings. Discovery operates on vault content only. **Risk:** the bond_v1 PRD will be written without the spike output. Mitigation: open question 1 routes the capture to Jan + Shaun before bond authoring.
- **Did not run `/weekly-market-intel-custom`.** Last Friday signal is 2026-04-20 (10 days old, within freshness window — no rerun needed). **Risk:** acceptable.
- **Did not draft the bond_v1 PRD itself.** That's `/prd-author-custom`'s job, not discovery's.
- **Did not validate cost economics** (per-message Utility/Marketing classification, BSP markup). That's a procurement + product-pricing decision, not a discovery decision.
- **Did not name customer/CS evidence sources.** Off-record per PM decision; exco ratification cited as the proximate evidence source.

---

*Authored 2026-04-30 via `/initiative-discovery-custom` (Path B). First run of the new exec-roadmap-aware discovery flow on a real initiative. Lessons should land in `plans/skill-pipeline/lessons-from-skills.md`.*
