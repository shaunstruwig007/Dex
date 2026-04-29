---
prd_shape: bond_v1
prd_id: employee-chat-and-groups
created_date: 2026-04-17
last_bond_run: 2026-04-29 15:55
lifecycle: discovery
critique_status: must_fixes_folded
critique_log: plans/skill-pipeline/sessions/2026-04-29-walkthrough-2-critiques.md (Run 2)
source: legacy_upgrade
reshaped_from: agent-prd shape (2026-04-17)
reshaped_on: 2026-04-29
related_prds:
  - AI_Assistant_in_Chat_Surface.md
  - AI_Assistant_FAQ.md
  - Messaging_Ops_Urgent_Alerts.md
  - Notifications.md
  - Tenant_Management.md
follow_up_tasks:
  - Engineering spike — first-party realtime vs CPaaS; record ADR before locking Slice 1 build
  - Discovery workshop — group creation / membership rules (no PRD default until then)
  - Confirm moderation + retention model with Legal
  - Align event schema with Product Analytics when stack exists
---

# Employee Chat & Groups

**Status:** `discovery` · reshaped to bond_v1 on 2026-04-29 · critique pass complete · must-fixes folded 2026-04-29 · **slice 1 cannot enter `spec_ready` until engineering spike (Q1) lands ADR**. Group creation rules pending workshop (Q2). **2026-04-17 collaborative-pilot decisions preserved verbatim.** Currently shared with software development manager for review (2026-04-29).
**Target:** Wyzetalk Essential frontline employee needing peer + group chat distinct from ops messaging, urgent alerts, and AI bot threads.
**Out of scope intentionally:** federation with external IM, full enterprise eDiscovery, AI in peer threads (owned by `AI_Assistant_in_Chat_Surface.md`), USSD chat path, voice / video, read receipts.

> **2026-04-17 collaborative-pilot decisions** (preserved):
>
> | Decision | Shaun's call |
> |----------|----------------|
> | **Phase 1 GA scope** | **DM (1:1) AND employee group chat** ship in the **same** Phase 1 GA — not DM-only with groups deferred. |
> | **Who may create group chats** | **Undecided until discovery workshop** — no default in this PRD (role-gated vs permissive vs other). |
> | **Realtime / chat backend** | **Undecided** — **engineering spike** required before committing to first-party vs CPaaS/vendor; PRD must not imply a chosen stack yet. |

---

## Goal

Frontline employees in Wyzetalk Essential can have peer (1:1) and group conversations under tenant policy, with chat as its own surface — visibly and behaviourally separate from organisational / ops messaging, urgent alerts, and AI bot threads. The "front door" thesis (single app for frontline employees) gains its peer-conversation surface, completing the IA story alongside ops broadcast (`Messaging_Ops_Urgent_Alerts.md`), AI FAQ (`AI_Assistant_FAQ.md` + `AI_Assistant_in_Chat_Surface.md`), and structured HR (`Smart_HR_Whatsapp.md`).

**Evidence grounding.** 2026-03-30 leadership session ratified Chat as #3 commercial priority. 2026-04-17 collaborative pilot ratified DM + groups in same Phase 1 GA, deferred group creation rules to workshop, deferred realtime stack to engineering spike. ICP v1 (2026-04-29) — strongest fit with ICP segment 1 (large distributed frontline workforce; "single front door" thesis explicitly names peer chat as part of the engagement / inclusion outcome). No customer / tenant meeting evidence in vault yet (`00-Inbox/Meetings/` empty — gap flagged in companion discovery and tracked as Open Q).

---

## Users

**Primary user — peer-chat-native frontline employee.** Lives in messaging apps (WhatsApp / SMS today). Wants the same conversational pattern inside Wyzetalk Essential — talk to a colleague directly, without writing a broadcast or sending an email. Win condition: opens chat, picks colleague, sends a message, gets a reply, all inside the app.

**Secondary user — HR / supervisor.** Needs a direct conversational channel with employees that isn't an email and isn't a broadcast. Win condition: 1:1 with an employee on a question or issue, with notifications and retention behaving sensibly.

**Secondary user — tenant admin (HR / Comms / Ops).** Configures who can chat with whom under tenant policy. Win condition: clear admin console for chat policy, separate from broadcast / AI / Smart HR controls.

**Out of scope (MVP) — Wyzetalk implementation / CSM.** Their job is enablement; they configure but do not chat in the consumer surface this PRD ships.

**Out of scope (MVP) — cross-tenant employees** (e.g. contractors with parent-company access). Single-tenant scope only.

---

## Success metrics

| # | Metric | Definition | Target | Measurement source |
|---|---|---|---|---|
| 1 | **Chat MAU (rolling 30-day)** | % of enabled employees who send ≥ 1 chat message in a **rolling 30-day window**, tracked **from each tenant's enable-date** (not from launch). | ≥ 50% in 90 days post-tenant-enable | Chat-stack analytics events (deferred — pending engineering spike outcome) |
| 2 | **Group adoption** | Active groups per 1000 employees per tenant | ≥ 5 active groups per 1000 employees in 90 days | Chat-stack metrics |
| 3 | **Cross-surface confusion rate** | % of users who attempt to use peer chat for ops broadcast or vice versa (sampled) | < 5% sampled in first 30 days | Manual / sampled review of session logs |
| 4 | **Surface-separation compliance** | % of UAT separation tests passing (ops vs chat routing) | 100% on each release | Scripted UAT + product sign-off |

### Note on measurability

- **Metrics 1 + 2** require chat-stack analytics. The stack itself is an open question (engineering spike). Metrics are aspirational until both ship; spec gate at slice 1 PR review: are the events shipped?
- **Metric 3** is the load-bearing health signal for the "chat is distinct from ops" promise. Manual / sampled in first 30 days; instrument later if pattern recurs.
- **Metric 4** is measurable from slice 1 — UAT scripts can be authored before the stack is chosen.

---

## Requirements

1. Two users in the same tenant can have a 1:1 (DM) conversation when tenant policy permits.
2. Users (or admins, per discovery-workshop policy — TBD) can create and join groups; group threads support multi-party messaging.
3. The chat surface is visually and behaviourally distinct from `Messaging_Ops_Urgent_Alerts.md` (ops broadcast) and from AI bot threads (`AI_Assistant_FAQ.md`, `AI_Assistant_in_Chat_Surface.md`).
4. Tenant policy controls "who can chat with whom" (e.g. role / location / department gates).
5. New-message notifications route per `Notifications.md` patterns; per-tenant + per-user notification preferences are honoured.
6. Retention / export stance is per-tenant configurable (POPIA + tenant policy compliant).
7. Basic moderation (report; block / mute scope TBD in discovery) is available to users; reported messages are flagged in admin view.
8. AI Assistant threads from `AI_Assistant_in_Chat_Surface.md` appear in the same chat list but use a different vendor / data-flow / retention model — peer-chat retention rules do NOT apply to AI threads, and vice versa.
9. The chat surface meets a11y baseline — keyboard / screen-reader parity, tap-target sizes, sufficient contrast.

---

## Slices

| # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |
|---|---|---|---|---|---|
| **1** | **Skeleton — DM happy path** | **Yes** | User A opens chat, taps colleague B, types "hello", sends. B gets push notification, opens app, sees the message in their chat list, taps in, sees the thread, types a reply. End-to-end DM in single tenant, single config, single device class. **Idempotency invariant (E1):** message-create uses a **client-generated message UUID**; server enforces idempotency. Flaky-network retries never duplicate messages. **Chat-list entry-type taxonomy (E2):** `type: "dm" \| "group" \| "bot"` is part of the chat-list payload from slice 1, not retrofitted later — required for Slice 3 separation invariant and for Requirement 8 (AI Assistant entity per `AI_Assistant_in_Chat_Surface.md`). | data + api + ui | Engineering spike outcome (ADR — chat backend chosen, see P3 below) |
| **2** | **Group chat — discovery-workshop rules applied** | No | Whoever the workshop nominates (admin, or role-gated user, or permissive user) creates a group with N members; members get notified; can post in the group thread; group appears in members' chat list. | data + api + ui | 1, discovery workshop output |
| **3** | **Cross-surface separation enforcement** | No | Ops broadcast lands in ops inbox; peer chats land in chat inbox; surfaces never merge into one ambiguous list. UAT separation script passes. | api + ui | 1 |
| **4** | **Tenant policy on chat permissions** | No | Admin configures "who can chat with whom" (e.g. per role / location); user's chat-target list reflects policy on next refresh. | api + config + ui | 1 |
| **5** | **Retention + moderation baseline** | No | Admin configures retention period and moderation tools (report — block / mute scope TBD); users see report option in thread; reported messages flagged in admin view; retention applied at configured interval. | data + api + ui | 1 |

### Slicing rules applied

- **Slice 1 is the walking skeleton.** Touches data (message storage) + api (realtime delivery) + ui (chat list, thread). Single end-to-end demo. **Depends on engineering spike output** — Slice 1 cannot enter spec_ready until the ADR is recorded.
- **Slice 2 depends on the discovery workshop output.** Group creation rules are workshop-decided — Slice 2 will not ship without resolved policy. (Pilot 2026-04-17 explicitly declined a PRD default.)
- **5 slices** — fits 3–6 typical range.
- **All slices have observable demo outcomes**; UAT script for Slice 3 explicitly counts as the demo.
- **Slice 1 + Slice 2 must ship same Phase 1 GA** per pilot 2026-04-17 — they are not separate releases. Slicing them is a planning device, not a release sequence.

### Test shape per slice

Cross-cutting must-fix from `/critique-engineering-custom` (E4). Every slice ships with the test coverage below; PR review enforces.

| # | Unit | Integration | E2E | A11y | Notes |
|---|---|---|---|---|---|
| 1 | Message create / list render; client-UUID dedup; chat-list entry-type taxonomy parser | Realtime delivery (stack-dependent — pending ADR); push notification dispatch | DM happy path: A → message → B receives push → opens → reads → replies | axe scan on chat list + DM thread; screen-reader smoke; tap-target audit | Stack-dependent integration test list locks once ADR lands |
| 2 | Group-thread membership read/write; member-list render | Group-create → member notify → group appears in members' chat list | Workshop-nominated user creates group with N members; members receive notification; can post; group thread renders | Group thread keyboard-navigable; member list screen-reader friendly | Locked by Q2 workshop output |
| 3 | Surface routing logic (ops vs chat vs AI taxonomy) | Cross-surface separation enforcement at API + UI | UAT separation script: ops broadcast lands in ops inbox; peer chats land in chat inbox; AI threads in AI list | n/a (taxonomy-level test) | UAT script doubles as the demo per Slice 3 design |
| 4 | Tenant-policy read; chat-target filter | Admin policy write → user's chat-target list refreshes | Admin sets "shift workers can chat with shift workers only"; user's target list reflects on next refresh | Admin policy console keyboard-navigable | — |
| 5 | Report payload write; retention-job logic | Report → admin moderation queue; retention applied at configured interval | User reports message → flagged in admin view; retention deletes per interval | Report affordance reachable via long-press AND three-dot menu (mobile a11y) | Q3 (block / mute) and Q4 (retention defaults) refine |

### Slice 1 demo readiness

Cross-cutting must-fix from `/critique-product-custom` (P1 — demo-posture-until-Q1-resolved). Slice 1 cannot enter Build until the chat-backend ADR lands (Q1). The risk is steerco sees a stalled product. **Demo posture covers the gap.**

- [ ] **Wireframe walkthrough or paper prototype** prepared for steerco demos taking place between PRD-spec_ready and ADR-decided. Walk through the DM happy path on the wireframe, narrate the realtime behaviour, surface the spike question explicitly. Stakeholders see the product is moving even when code isn't shipping yet.
- [ ] **Spike-completion-trigger** prepared: when the ADR lands, swap the wireframe demo for the live-stack demo within one steerco cycle.
- [ ] **One known-bad-network simulation** prepared (slice 1 build): toggle airplane mode mid-message; assert the message queues client-side, retries on reconnect, dedups via client UUID, never duplicates. Demo-able in 30 seconds; carries the idempotency invariant.
- [ ] **Cross-surface confusion sample** prepared: 3 mocked-up screenshots showing the wrong-surface-routing failure mode (ops broadcast in chat inbox, etc.) so steerco understands what metric 3 is catching.

```plan-mode-seed
Slice 1: Skeleton — DM happy path. User A opens chat, taps colleague B, types "hello", sends. B gets push notification, opens app, sees message in chat list, taps in, sees thread, types reply. End-to-end DM in single tenant. Layers: data + api + ui. Depends: engineering spike outcome (ADR — chat backend chosen).
Slice 2: Group chat — discovery-workshop rules applied. Whoever workshop nominates creates a group with N members; members notified; can post in group thread; group appears in members' chat list. Layers: data + api + ui. Depends: 1, discovery workshop output.
Slice 3: Cross-surface separation enforcement. Ops broadcast lands in ops inbox; peer chats land in chat inbox; surfaces never merge into one ambiguous list. UAT separation script passes. Layers: api + ui. Depends: 1.
Slice 4: Tenant policy on chat permissions. Admin configures "who can chat with whom"; user's chat-target list reflects policy on next refresh. Layers: api + config + ui. Depends: 1.
Slice 5: Retention + moderation baseline. Admin configures retention period and moderation tools (report; block/mute scope TBD); users see report option in thread; reported messages flagged in admin view; retention applied at configured interval. Layers: data + api + ui. Depends: 1.
```

---

## Risks

1. **Chat backend choice locks Wyzetalk into a build / vendor trade-off.** First-party realtime is heavy build effort; CPaaS / vendor introduces lock-in + per-message cost. **Mitigation:** spike-before-build (per pilot 2026-04-17); ADR records both options + criteria; commit only after ADR. **ADR template must include a "Swap cost" section (P3 must-fix):** what it takes to change vendor (CPaaS → CPaaS), what it takes to swap from CPaaS to first-party post-MVP, what migration looks like for in-flight messages and users mid-conversation. Without this section the ADR is a snapshot of preference, not a decision artefact.
2. **Group creation rules without consensus = adoption noise OR strangulation.** Permissive defaults flood users with low-value groups; restrictive defaults slow adoption to admin pace. **Mitigation:** discovery workshop is the gate, not the PRD. Slice 2 cannot ship without workshop output. Decision-tree captured as workshop output deliverable.
3. **Cross-surface bleed (chat ↔ ops broadcast).** Even if technically separated, users mentally merge them and lose trust in either surface. **Mitigation:** Slice 3 (separation enforcement) is required for GA; metric 3 (sampled confusion rate) catches drift.
4. **POPIA retention / data residency exposure.** Inadequate retention period or wrong jurisdiction storage exposes tenant + Wyzetalk. **Mitigation:** tenant-configurable retention; legal sign-off pre-GA; default retention floor set conservatively.
5. **Notification storm.** Chat creates new notification load — frontline users disable notifications and lose value across the app. **Mitigation:** align routing per `Notifications.md`; per-conversation mute; sensible defaults (e.g. group threshold at N members triggers digest mode).
6. **Federation pressure post-launch.** Tenants ask to federate with their existing IM (Slack, Teams). **Mitigation:** explicit out-of-scope v1; collect customer evidence in `05-Areas/Companies/`; future cycle gated on evidence volume.
7. **AI Assistant entity behaving like a peer.** AI thread (per `AI_Assistant_in_Chat_Surface.md`) sits in the same chat list — risk: users mentally model it as another colleague. **Mitigation:** Requirement 8 enforces server-side that AI ≠ peer; visual / behavioural distinction enforced by the AI PRD's design pointers. Cross-PRD coordination metric (`AI_Assistant_in_Chat_Surface.md` metric 3, "misuse / merge-attempt rate") flags drift; threshold `< 5%` sampled.

### Technical failure modes (E3 must-fix)

- **Notification dispatch failure on DM send.** **Behaviour:** message is saved server-side immediately; recipient sees the message on their next chat-open even if the push notification was lost. **No retry-storm** — one push attempt per message; if it fails, fall back to silent delivery (the message exists in the recipient's chat list either way). The user-facing promise is "your message was delivered"; the push is an attention-affordance, not the delivery itself.
- **Realtime stack unavailable mid-conversation.** **Behaviour:** queue messages client-side with their client-UUID; retry on reconnect; dedup via UUID idempotency. User sees a "sending…" indicator until ack. No silent drops.
- **Recipient session expired / device offline.** **Behaviour:** message persists in chat list; recipient sees it on next session-open. (No read-receipt feedback to sender per pilot 2026-04-17 scope — read receipts out of scope.)
- **Group notification storm (slice 2).** **Behaviour:** notification routing per `Notifications.md`; default group threshold (TBD per Q5) triggers digest mode; user can mute per-conversation.

---

## Out of scope

| Out of scope | Why | Future cycle? |
|---|---|---|
| Federation with external IM (Slack, Teams, WhatsApp) | Out-of-scope per pilot 2026-04-17; customer-evidence-driven decision | Yes — future cycle |
| Full enterprise eDiscovery | Legal mandate not yet established for Wyzetalk Essential tenants | Yes — future, conditioned on Legal + tenant ask |
| AI Assistant in peer threads | Owned by `AI_Assistant_in_Chat_Surface.md`; 2026-04-17 pilot ratified the separation | No — explicit non-goal |
| USSD chat path | ICP scope note v1 — Wyzetalk Essential is Mobi + App; chat does not extend to USSD | No — explicit non-goal |
| Voice / video calls | Phase 1 is text-only | Yes — future |
| Read receipts / typing indicators | Not in pilot 2026-04-17 scope; lighter UX with fewer privacy questions | Yes — post-MVP |
| Cross-tenant chat (contractor + parent-co employee) | Tenant-isolation invariant in Wyzetalk Essential v1 | Yes — future, demand-driven |

---

## Open questions

| # | Question | Blocks | Owner / next step |
|---|---|---|---|
| 1 | **Realtime stack — first-party vs CPaaS/vendor?** | Slice 1 build (cannot ship without ADR) | Leon (CTO) — engineering spike + ADR (pending) |
| 2 | **Group creation / membership rules** — who may create, member-cap, invite model | Slice 2 spec | Discovery workshop (pending) |
| 3 | Moderation scope — report-only? block? mute? auto-flag? | Slice 5 spec | Discovery + Legal |
| 4 | POPIA retention period defaults — 30 days? 90? tenant-pickable? | Slice 5 + tenant config | Legal + Product |
| 5 | Notification routing for groups — every-message vs digest threshold | Slice 1 + Notifications.md | Product + Notifications owner |
| 6 | Cross-tenant chat | Future scope | `Tenant_Management.md` owner |
| 7 | Federation with external IM | Future scope | Future cycle when customer evidence demands |
| 8 | Surface parity with AI Assistant entity (chat list ordering, badges) | Slice 1 design | Product + AI_Assistant_in_Chat_Surface.md cross-PRD coordination |

### None of these block slice-1 build EXCEPT Q1 (realtime stack ADR).

Q1 is a hard gate. Q2 blocks slice 2. Q5 + Q8 block slice-1 design but allow stub-first build. Q3, Q4 block slice 5.

**Build-stub assumptions** if Q5, Q8 are still open at slice-1 build:
- Q5 stub: every-message notification for DMs; threshold-based digest for groups (TBD threshold).
- Q8 stub: AI Assistant entity pinned-top in chat list (per `AI_Assistant_in_Chat_Surface.md` Slice 1 design recommendation).

---

## Design pointers

### Context

Chat surface in Wyzetalk Essential's Blue app. Mobile-first, frontline-targeted, multi-channel (Mobi + App; USSD out of scope). Datafree applies where Wyzetalk's pattern is configured.

### Surfaces in scope

1. **Chat list** — top-level navigation entry; lists DMs, groups, and the AI Assistant entity (per `AI_Assistant_in_Chat_Surface.md`).
2. **DM thread** — 1:1 conversation surface.
3. **Group thread** — multi-party conversation surface.
4. **New-chat / new-group flow** — entry into starting a conversation; gated by tenant policy (Slice 4).
5. **Tenant admin chat-policy console** — admin-side toggle and policy configuration.
6. **Moderation flow** (Slice 5) — user report path; admin moderation review screen.

### Critical UX questions for the designer to answer

- **Chat list density** — flat list, segmented (DMs / groups / bots), or grouped-by-recency? **Recommendation:** segmented in v1 — three explicit sections (1:1, Groups, AI Assistant) makes the surface boundary visible.
- **Group creation entry** — FAB, in-list "+ new group", admin-only path? **Recommendation:** depends on Q2 workshop outcome; until then, in-list + admin-toggle is the safest stub.
- **Notifications visual styling** — same as ops inbox or distinct? **Recommendation:** distinct — the cross-surface confusion risk (metric 3) is mitigated by visual separation at every touchpoint, including notifications.
- **"Report" affordance placement** — long-press, three-dot menu, both? **Recommendation:** long-press (mobile-native) + three-dot fallback (a11y).
- **Empty state for chat list** — onboarding hint, blank, or curated suggestions? **Recommendation:** curated suggestions ("Start a conversation with your supervisor", "Join the X group") in v1 — frontline users benefit from explicit invitations.
- **Chat-list ordering relative to AI Assistant entity** — pinned, interleaved? **Recommendation:** AI Assistant pinned-top per cross-PRD design (`AI_Assistant_in_Chat_Surface.md` Slice 1).

### Constraints on design (must / must not)

**Must:**
- Distinct visual surface from ops broadcast inbox (`Messaging_Ops_Urgent_Alerts.md`).
- Mobile-first; Mobi + App parity.
- A11y: keyboard / screen-reader parity, tap-target sizing, sufficient contrast for outdoor / low-light frontline conditions.
- AI Assistant entity (per cross-PRD spec) renders in same chat list with bot affordances — chat surface must accept third-party-rendered entries.

**Must not:**
- Conflate ops broadcast with peer chat.
- Render AI Assistant as a peer (no "online" status, no peer-style typing indicator).
- Hide moderation / report path in a deep menu.

### What the designer should NOT prescribe

- Realtime stack choice (engineering spike — Q1).
- Tenant policy schema (`Tenant_Management.md`).
- Notification routing logic (`Notifications.md`).
- Group creation rules (workshop — Q2).
- AI Assistant entity behaviour (`AI_Assistant_in_Chat_Surface.md`).

### Design slice ordering

- **Slice 1** — heaviest. Chat list, DM thread, send/receive UX, push notification copy.
- **Slice 2** — group thread shell, member-list view, group-create flow.
- **Slice 3** — visual cue distinguishing chat from ops; UAT script (no new design — design baseline must already differentiate).
- **Slice 4** — admin policy UI; user-side: target-list filtering (minimal).
- **Slice 5** — Report / moderation UI; admin moderation review screen.

---

## Build handoff

> **Repo split.** This PRD lives in the GitHub vault (`Documents/Blueprint/Dex`). Production code lives in **Bitbucket**. There is no auto-sync between the two. This section is the developer's pickup contract for taking the PRD across the repo boundary.

### How to use this PRD in Cursor Plan mode (in the Bitbucket repo)

1. Copy this entire markdown file to your codebase repo at `docs/PRDs/Employee_Chat_and_Groups.md`.
2. **Also copy `AI_Assistant_in_Chat_Surface.md`** — Requirement 8 binds the chat-list payload to the AI peer-entity model; both PRDs need to be in Plan-mode context for slice 1.
3. Open Cursor with the codebase repo as the workspace, with both files in context.
4. Paste the **Plan mode seed** block (above) as the Plan mode prompt. Each line maps to one Plan-mode step → one PR / branch.
5. Reference the Slices, Test shape per slice, Slice 1 demo readiness (especially the wireframe walkthrough until ADR lands), Risks (technical failure modes), Open questions, and Design pointers sections for the full context Plan mode needs.

### Handoff snapshot

| Field | Value |
|---|---|
| **Source file (vault)** | `06-Resources/PRDs/Employee_Chat_and_Groups.md` (GitHub: `Documents/Blueprint/Dex`) |
| **bond_v1 last run** | `2026-04-29 15:55` |
| **Lifecycle** | `discovery` (must-fixes folded; **slice 1 cannot enter spec_ready until Q1 ADR lands**) |
| **Slice 1 demo-readiness deliverables** | Wireframe walkthrough or paper prototype (until ADR) · spike-completion-trigger prepared · airplane-mode network simulation · cross-surface confusion screenshots |
| **Cross-PRD slice dependencies** | Requirement 8 / chat-list entry-type taxonomy ↔ `AI_Assistant_in_Chat_Surface.md` slice 1; Notifications routing ↔ `Notifications.md` |
| **Hard gates before Slice 1 build** | Q1 (realtime stack ADR) — **blocking** · Q5 (notification routing for groups — stub-able) · Q8 (chat-list ordering with AI entity — stub-able) |
| **Hard gates before Slice 2 build** | Q2 (group creation rules workshop) |
| **Hard gates before Slice 5 build** | Q3 (moderation scope) · Q4 (POPIA retention defaults) |
| **Sign-off needed before Build** | Product (PM) · Engineering (CTO — ADR sign-off) · Legal (POPIA + retention) · Design (chat-list segmentation + moderation UI) |

### Source-of-truth rule

This PRD is generated from the GitHub vault by `/prd-author-custom`. **If you edit this file in the codebase repo, those edits do NOT propagate back.** Treat the codebase copy as a read-only snapshot. For spec changes:

1. Open the GitHub vault.
2. Edit the source file at `06-Resources/PRDs/Employee_Chat_and_Groups.md`.
3. Re-run `/prd-author-custom` to regenerate this PRD's bond_v1 shape.
4. Re-copy to the codebase repo.

The skill's idempotence rule protects the source from accidental overwrites — if the source file has been edited since the last `last_bond_run`, the skill surfaces a diff and asks before proceeding.

---

*Reshaped 2026-04-29 by /prd-author-custom (--reshape) from agent-prd shape (2026-04-17). Original WP-1, WP-2, WP-3 mapped to Slices 1–5; 2026-04-17 collaborative-pilot decisions preserved verbatim. Critique pass run 2026-04-29 (Walkthrough 2, Run 2); must-fixes folded 2026-04-29 15:55 (P1–P3, E1–E4 + cross-cutting test-shape, demo-readiness, build-handoff additions). Last run: 2026-04-29 15:55.*
