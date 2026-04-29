---
prd_shape: bond_v1
prd_id: ai-assistant-in-chat-surface-2026-04-29
created_date: 2026-04-29
last_bond_run: 2026-04-29 14:30
lifecycle: spec_ready
related_prds:
  - Employee_Chat_and_Groups.md
  - AI_Assistant_FAQ.md
  - Smart_HR_Whatsapp.md
  - Notifications.md
  - Profile_Users.md
  - Tenant_Management.md
  - Multilingual_Content.md
---

# AI Assistant in Chat Surface

**Status:** First draft, ready for product + engineering critique.
**Target:** Wyzetalk Essential frontline employee — primarily the high-volume FAQ-asker (low-literacy / low-patience subset of ICP segment 1) who already lives in their chat list daily.
**Out of scope intentionally:** mixed-mode peer + AI threads, `@AI` invocation in group chats, peer-chat data merger with AI conversations, replacing AI_Assistant_FAQ.md's tawk.to engine choice, replacing Employee_Chat_and_Groups.md's realtime-stack spike, live HRIS lookups, AI in emergency comms surface.

---

## Goal

Frontline employees in tenants where AI Assistant is enabled find the assistant exactly where they already live every day — in their chat list — clearly badged as a bot, with permissions, retention, and data flow distinct from their peer conversations. The IA tax of "find the bot" disappears. The risk of "AI is hidden in a separate menu" disappears. The risk of "AI conversations bleed into peer chat" never appears, because the data flows are separate from day one.

This PRD owns one decision the existing PRDs cannot own: **the IA / surface-parity question** opened by reconciling `Employee_Chat_and_Groups.md` (peer chat, distinct from bot) and `AI_Assistant_FAQ.md` (tawk.to in Blue app, distinct from peer chat). The 2026-04-17 collaborative pilot ratified the three-way separation between peer chat, AI FAQ, and Smart HR. This PRD does not re-open that — it operationalises it by making AI Assistant *visible* where users already are, without merging the underlying surfaces.

**Evidence grounding.** 2026-03-30 leadership session (Merel CEO/CPO + Leon CTO) ratified AI FAQ as #2 commercial priority and chat as #3. 2026-04-17 collaborative pilot locked tawk.to as the AI engine and committed both PRDs to discovery. ICP v1 (2026-04-29) — strongest fit with segment 2 (HR self-service / secure access). The Slack-pattern "bot as peer in chat list" is the dominant industry pattern for ICP 1 (frontline) deployments, though no competitor profile yet exists in vault (gap flagged in discovery). No customer / tenant / leadership meeting evidence exists yet (`00-Inbox/Meetings/` empty — gap flagged in discovery and tracked as open question). This PRD ships against an evidence base that is largely PRD-derived; the critique skills will pressure-test that.

---

## Users

**Primary user — frontline employee, high-volume FAQ-asker.** A blue-collar / shift-worker in an ICP-1 or ICP-2 tenant. Mobile-first; data-cost sensitive; low patience for IA hunting. Asks the same handful of questions repeatedly: "when is payday?", "what's the leave policy?", "how do I claim PPE?". Today they call HR, ask their supervisor, or ignore the question entirely. Win condition: they open the app, see AI Assistant in their chat list right next to their colleague's name, tap it, type or tap a question, and get an HR-grounded answer in seconds.

**Secondary user — frontline employee, chat-native.** Younger or more digitally literate cohort that lives in the peer chat surface every day. Win condition: they discover AI Assistant naturally because it appears in the place they already use.

**Secondary user — HR-adjacent / supervisor.** Receives fewer repetitive ticket / phone questions because deflection works. Win condition: monthly volume of "where do I find...?" tickets drops measurably.

**Secondary user — tenant admin (HR / Comms / Ops buyer group).** Configures whether AI Assistant is visible in the chat list, who owns the FAQ corpus, and how disclosure is worded. Win condition: clean toggle in admin console, separate from Blue-app-embed flag, with audit visibility.

**Out of scope (MVP) — Wyzetalk implementation / CSM.** Their job is enablement (tawk.to workspace setup, FAQ corpus ingestion, escalation roster). They are users of the admin tooling but not direct UI users in the consumer chat experience this PRD ships.

**Out of scope (MVP) — crisis / emergency-comms users.** Different surface entirely (`Messaging_Ops_Urgent_Alerts.md`). AI Assistant must be silenced when emergency mode is active; this is a non-goal of the PRD's user surface but a constraint on its design.

---

## Success metrics

| # | Metric | Definition | Target | Measurement source |
|---|---|---|---|---|
| 1 | **Chat-list discoverability** | % of tenant-enabled users who open the AI Assistant entity within first 7 days of feature exposure | ≥ 40% in 90 days post-tenant-enable | Product Analytics — `ai_assistant_opened_from_chat_list` event (instrumented at slice 1) |
| 2 | **FAQ deflection rate** | % of opened AI sessions resolved without HR ticket / human handoff | ≥ 70% in 90 days post-launch | tawk.to dashboard `session_resolved_no_handoff` + Wyzetalk escalation tracker (cross-source reconciliation) |
| 3 | **Misuse / merge-attempt rate** | % of users who attempt to chat with AI as if it were a peer (off-topic personal message, "thanks Sarah", emotion-only messages) | < 5% sampled | Manual / sampled review of tawk.to conversation logs in first 30 days; analytics later |
| 4 | **Tenant adoption** | # tenants with AI Assistant enabled in chat list / # tenants eligible | ≥ 50% in 6 months | Tenant_Management.md flags (`ai_assistant_in_chat = true`) |

### Note on measurability

- **Metrics 1, 2, 4** require analytics plumbing not yet in place. Slice 1 build must include `ai_assistant_opened_from_chat_list` event; slices 2 + 3 instrument the rest. Until then, metrics are aspirational. Spec gate at slice 1 PR review: are the events shipped?
- **Metric 3** is qualitative / manual at first. The "AI didn't replace the peer relationship" failure mode is the load-bearing health check — sample 100 conversations weekly for 4 weeks post-launch, log misuse patterns, recalibrate copy if > 5%. This is the failure mode that closes the IA experiment if hit hard.
- **Metric 1** is the kill metric for the IA hypothesis. < 10% in 30 days = the hypothesis "users find AI in chat list" is wrong. Revert to a standalone tab and rewrite the IA section.

---

## Requirements

1. AI Assistant appears as a clearly bot-badged peer entity in the user's chat list when, and only when, tenant policy enables it for that tenant.
2. The user can tap AI Assistant in the chat list to open a thread with the AI, sharing the chat surface's visual structure but distinguishable as a bot conversation at every level (chat list, thread header, message bubbles).
3. AI conversations are stored separately from peer chat conversations, with different vendors, retention policies, and audit treatment, and this separation is visible to the user via in-thread disclosure.
4. Tenant admin can enable / disable AI Assistant visibility in chat, independently of the existing Blue-app-embed flag in `AI_Assistant_FAQ.md`.
5. AI Assistant honours the user's profile language preference (set per `Profile_Users.md` and `Multilingual_Content.md`) when serving replies — at least for the languages tawk.to and the FAQ corpus support.
6. AI Assistant offers an explicit handoff to a human (HR or designated tenant role) when its confidence is low, when the user requests it, or when the intent is outside the FAQ corpus scope.
7. AI Assistant does not appear in group chat threads and does not accept `@AI` invocation in any thread in v1; this is enforced server-side, not just hidden in UI.
8. AI Assistant is silenced (does not surface in chat list, does not respond in any thread) when the tenant is in active emergency-comms mode (per `Messaging_Ops_Urgent_Alerts.md`).
9. AI Assistant declines to answer Smart-HR-owned intents (payslip, leave balance, roster) and instead directs the user to the Smart HR surface (`Smart_HR_Whatsapp.md`) — preserving the cross-PRD boundary already documented in Smart HR's WP-4.
10. The chat surface, the AI thread, and the disclosure modal meet WCAG AA (a11y) including correct `lang` attribute on rendered AI replies, keyboard / screen-reader parity, and tap-target sizing.

---

## Slices

| # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |
|---|---|---|---|---|---|
| **1** | **Skeleton — AI peer entity in chat list** | **Yes** | A frontline user opens chat list, sees "AI Assistant" entry clearly bot-badged at the top of the list, taps it, types a question, gets an HR-grounded reply within 2 seconds. Single tenant, English-only, no peer chat data involved, no admin toggle, no handoff. End-to-end demo of the IA model. | data + api + ui | — |
| **2** | **Tenant policy gate** | No | Admin toggles `ai_assistant_in_chat = false` in tenant management → user's chat list no longer shows the entity on next open. Toggle to `true` → entity reappears. | api + config + ui (admin) | 1 |
| **3** | **Handoff to human HR** | No | User asks AI a question outside the FAQ corpus → bot offers a "Need a person? Tap to message HR" button → tap lands user in a peer-chat thread with the appropriate role (HR or designated). Boundary is visible (new thread, different surface). | api + ui | 1 |
| **4** | **Profile-language honouring** | No | User with Afrikaans set as profile language preference (per Profile_Users.md / Multilingual_Content.md) opens AI Assistant; greeting, suggested messages, and replies arrive in Afrikaans where the corpus supports it; English fallback otherwise with a one-line "[English fallback]" note. | api + ui | 1, Multilingual_Content.md slice 3 |
| **5** | **Disclosure + audit-trail visibility** | No | User taps "i" / info icon on AI thread → sees disclosure: "Stored by tawk.to. Not shared with Wyzetalk peers. Retention: <X> days. Tenant admin can audit." Disclosure copy is tenant-overridable per Open Q2 outcome. | ui | 2 |

### Slicing rules applied

- **Slice 1 is the walking skeleton.** Touches data (FAQ corpus + AI session storage) + api (tawk.to integration + chat-list query) + ui (chat list entry + AI thread). Single end-to-end demo: chat-list discoverability + AI reply.
- **Slice 5 (`@AI` in group chats from discovery candidate-slice list) is NOT in this PRD.** It is explicitly out-of-scoped (see Out of scope table) per the discovery's kill-candidate flag and the 2026-04-17 pilot decision.
- **5 slices total** — fits the 3–6 typical range. Slice 4 has a cross-PRD dependency on `Multilingual_Content.md` slice 3 (profile language preference UX).
- **All slices have observable demo outcomes** that an observer (designer, PM, exec) can witness without reading code.
- **Slice 2 is a thickening, not a refactor** — it adds tenant control over the entity that slice 1 introduces.
- **Slice 4 is parallelisable with slice 2 and slice 3** — depends only on slice 1 and the upstream Multilingual PRD.

---

## Plan mode seed

```plan-mode-seed
Slice 1: Skeleton — AI peer entity in chat list. Frontline user opens chat list, sees "AI Assistant" entry clearly bot-badged, taps it, asks a question, gets an HR-grounded reply within 2s. Single tenant, English only, no peer chat data involved. Layers: data + api + ui.
Slice 2: Tenant policy gate. Admin toggles ai_assistant_in_chat=false in tenant management → user's chat list no longer shows the entity on next open; toggle to true → entity reappears. Layers: api + config + ui. Depends: 1.
Slice 3: Handoff to human HR. User asks AI something outside the FAQ corpus → bot offers "Need a person? Tap to message HR" button → tap lands user in a peer-chat thread with the appropriate role. Layers: api + ui. Depends: 1.
Slice 4: Profile-language honouring. User with Afrikaans profile language opens AI Assistant; greeting + replies arrive in Afrikaans where corpus supports it; English fallback otherwise with [English fallback] note. Layers: api + ui. Depends: 1, Multilingual_Content.md slice 3.
Slice 5: Disclosure + audit-trail visibility. User taps "i" icon on AI thread → sees disclosure: "Stored by tawk.to. Not shared with Wyzetalk peers. Retention: <X> days. Tenant admin can audit." Layers: ui. Depends: 2.
```

---

## Risks

1. **Mixed-mode thread blur (UX).** Users get confused about whether they're talking to a peer or AI; trust collapses; misuse rate spikes. **Mitigation:** Three redundant bot signals at every touchpoint — bot icon in chat list, "Bot" badge on thread header, distinct message-bubble background. Server-side enforcement of "no AI in peer threads" (not just hidden in UI). Sampled review (metric 3) catches drift.

2. **POPIA / EU AI Act exposure.** Workplace AI deployment without transparency triggers regulatory exposure for tenant + Wyzetalk. **Mitigation:** Slice 5 (disclosure) is required for GA — not a nice-to-have. Legal sign-off is a hard gate. Tenant-level audit log is a Wyzetalk obligation per Smart_HR / AI_Assistant PRDs. The workforce-data lens in `/weekly-market-intel-custom` monitors regulatory drift weekly.

3. **tawk.to vendor lock-in compounded.** Locking the AI engine to tawk.to AND locking the chat-list peer-entity model means swapping engines in v2 also requires UI rework. **Mitigation:** Engine is an injected dependency behind the AI Assistant peer-entity contract. The peer-entity model is engine-agnostic — the chat-list entry, thread shell, disclosure, and handoff are Wyzetalk-owned; tawk.to is callable from behind a service-level seam. Validates `Cheaper path` row of `/critique-engineering-custom`: an alternative LLM provider could plug in via the same seam.

4. **Hallucination on policy answers.** AI gives ungrounded HR policy advice; tenant liability event; Wyzetalk reputation damage. **Mitigation:** tawk.to "Revise answer based on context" turned OFF by default; Base Prompt enforces "only use approved sources or escalate"; slice 3 (escalation) is required for GA — there must always be a human-handoff exit. Misuse review (metric 3) flags any drift.

5. **Adoption failure (IA hypothesis disproved).** Frontline users don't open AI Assistant from chat list; the IA model is wrong. **Mitigation:** Slice 1 ships with the discoverability event. Kill criterion: < 10% open rate in 30 days post-tenant-enable triggers reverting to standalone tab and a write-up of why the IA hypothesis didn't hold. This is a controlled-failure path, not a surprise.

6. **Tenant rollout chaos.** Some tenants want chat AI, some don't, some want it but want the disclosure copy reworded. **Mitigation:** Slice 2 makes it a per-tenant flag. Disclosure copy is tenant-overridable (open Q2). Admin docs ship before first non-Wyzetalk tenant enable.

7. **Cross-surface duplication with Smart HR.** User asks AI for payslip; Smart HR PRD says payslip lives on WhatsApp. User confused which surface answers what. **Mitigation:** Requirement 9 — AI Assistant explicitly declines Smart HR intents and provides a "for payslip / leave / roster, open WhatsApp" copy block. Boundary is server-enforced via intent classification, not just FAQ-corpus omission.

8. **Group chat scope creep post-launch.** Stakeholders request `@AI` in group threads after launch traction. **Mitigation:** Out of scope table is explicit; future cycle is gated on its own discovery + critique pass. The Outcome-integrity row of `/critique-product-custom` will flag any future PRD that re-opens the merge without ICP-grounded reasoning.

---

## Out of scope

| Out of scope | Why | Future cycle? |
|---|---|---|
| `@AI` invocation in group chat threads | Re-introduces the merge that the 2026-04-17 pilot ratified out; high privacy + UX risk; needs its own discovery + critique pass | Yes — separate PRD post-MVP |
| Mixed-mode peer + AI threads (humans and AI in same thread) | Conflicts with the data-separation invariant (Requirement 3) and fails the POPIA disclosure model | No — explicit non-goal |
| Replacing `AI_Assistant_FAQ.md` Phase 1 (Blue app embed of tawk.to widget) | This PRD ADDS a chat-list surface; it does not replace the existing widget surface. Both can coexist for tenants that want both. | No — explicit non-goal |
| Replacing `Employee_Chat_and_Groups.md` realtime-stack spike | Chat backend remains the Chat PRD's call; this PRD only adds a peer-entity model on top of whatever stack is chosen | No — explicit non-goal |
| Live HRIS lookups via AI (payslip, leave balance, roster) | Belongs to `Smart_HR_Whatsapp.md` (#1 priority, spec_ready). AI Assistant declines and redirects (Requirement 9) | Yes — post-MVP, via cross-PRD update |
| AI Assistant in emergency-comms surface | `Messaging_Ops_Urgent_Alerts.md` is its own surface; emergency posture forbids AI hallucination on safety-critical info | Yes — future, conditioned on emergency-PRD maturity and verified-AI posture |
| Custom LLM training / fine-tuning on tenant data | Phase 1 is FAQ-grounded only; tawk.to "use sources only" mode; no training pipeline | Yes — future post-Phase-2 |
| WhatsApp Flow as AI entry point | `AI_Assistant_FAQ.md` Phase 2 owns this | Yes — post-MVP, owned by AI FAQ PRD |
| AI replying in languages outside the tawk.to-supported list | Tawk.to language coverage gates this; English fallback covers gaps in slice 4 | Yes — future, expansion-driven |
| Voice-input or voice-reply on AI Assistant thread | Phase 1 is text-only; voice opens new modality + new failure modes | Yes — future, post-Phase-2 |

---

## Open questions

| # | Question | Blocks | Owner / next step |
|---|---|---|---|
| 1 | Sequencing relative to chat realtime spike — does Slice 1 ship before or after the chat backend is chosen? | Slice 1 entry to spec_ready | Leon (CTO) — confirm whether AI peer entity in chat list can be modelled on the chat backend's data primitives, OR can ship as a separate "system thread" surface that does not depend on the spike outcome |
| 2 | Disclosure copy + placement (POPIA + EU AI Act) | Slice 5 spec | Legal + Product — draft initial copy, set tenant-overridable boundaries, legal sign-off |
| 3 | EU AI Act applicability for SA + EU frontline deployments | Phase 1 GA | Legal — assess based on tenant geographies; tracked weekly via the workforce-data lens of `/weekly-market-intel-custom` |
| 4 | Tenant admin toggle: separate flag from "AI FAQ in Blue app" or merged toggle? | Slice 2 spec | Tenant_Management.md owner — design admin flag taxonomy; recommendation: **separate** flag, since the surfaces are distinct |
| 5 | Bot peer-entity branding: generic "AI Assistant" or per-tenant brand name (e.g. "Anglo HR Bot")? | Slice 1 UI design | Product + Marketing — recommendation: generic in v1; per-tenant branding as future option (tracks ICP-2 customer ask frequency) |
| 6 | Cross-surface payslip / leave disambiguation copy — what does "open WhatsApp" look like in-thread? | Slice 1 (Requirement 9 boundary message) | Product — write the disambiguation copy; coordinate with Smart_HR_Whatsapp.md owner |
| 7 | Adoption-failure kill-criteria — what discovery rate threshold triggers IA revert? | Slice 1 build (analytics events) + Risk 5 mitigation | Product Analytics — name the threshold pre-launch (recommendation: < 10% in 30 days post-enable) |
| 8 | Tenant audit-log shape — what does the admin see when reviewing AI Assistant usage? | Slice 2 + Slice 5 | Tenant_Management owner + Legal — minimum viable audit row schema |

### None of these block slice-1 build EXCEPT Q1 (sequencing).

Q1 must be answered before slice 1 builds. Q5, Q6, Q7 are slice-1-time copy / threshold decisions that can be made stub-first and refined in build. Q2, Q3 block GA, not slice-1 build. Q4 blocks slice 2. Q8 blocks slice 2 + 5.

**Build-stub assumptions** for slice 1 if Q5–Q7 are still open at build time:
- Q5 stub: generic "AI Assistant" branding.
- Q6 stub: "For your payslip, leave, or shift schedule, please open WhatsApp and chat with Smart HR." (placeholder; product writes final copy.)
- Q7 stub: < 10% in 30 days post-enable triggers IA revert. (Confirmable post-launch.)

---

## Design pointers

### Context

Wyzetalk Essential's Blue app is mobile-first, frontline-focused, multi-channel (Mobi + App; USSD explicitly out of scope per ICP v1). The chat surface is a top-level navigation entry. AI Assistant in this PRD lives **inside** the chat surface as a peer entity in the chat list, alongside (but visually distinct from) peer DMs and group chats.

The design language must communicate three invariants without ambiguity to a low-literacy frontline user:
1. "This is a bot." (not a peer)
2. "Your conversation here is stored differently." (not visible to colleagues)
3. "If the bot can't help, a real person can." (escalation always available)

### Surfaces in scope

1. **Chat list** — user's home for messaging. AI Assistant appears as a list entry alongside peer / group chats. Bot affordance must be unambiguous at list level (icon, badge, label).
2. **AI Assistant thread** — when user taps the entry, opens a thread that shares peer-thread visual structure (bubbles, input box) but with bot affordances (header badge, distinct bubble style, suggested-message buttons).
3. **Tenant admin console** — toggle for "AI Assistant in chat list" enablement (separate from Blue-app-embed flag).
4. **In-thread disclosure** — "i" / info icon on thread header; opens disclosure modal / sheet with retention + audit + boundary copy.
5. **Handoff thread** (slice 3) — when user taps "Need a person?" they land in a peer-chat thread with HR; this is a regular peer thread, not a hybrid.

### Critical UX questions for the designer to answer

- **Bot affordance density:** badge, color, icon, "Bot" label, all of the above? **Recommendation:** ALL — frontline users have low patience for ambiguity; redundant signals are a feature, not over-design.
- **Chat-list ordering:** AI Assistant pinned to top of list, or interleaved by recency? **Recommendation:** pinned-top in slice 1 (discoverability target); revisit if metric 1 hits ≥ 60%.
- **Reply-while-AI-typing UX:** same indicator as peer chat (typing dots) or different? **Recommendation:** different — explicit "AI is generating…" copy, not the human "typing" pattern. Trust signal.
- **Empty state:** greeting message with Suggested Messages (≤ 4 buttons, ≤ 10 words each per tawk.to vendor docs)? **Recommendation:** yes; copy aligned with HR-approved corpus; localised per slice 4.
- **Handoff button placement:** in-thread inline button, or surfaced via a thread menu? **Recommendation:** in-thread inline button, copy: *"Need a person? Tap to message HR."*
- **Disclosure entry point:** "i" icon on thread header, or first-message disclosure on every new thread? **Recommendation:** "i" on header (always-available); supplement with a one-time first-open onboarding overlay.
- **Cross-surface boundary copy** (Requirement 9): how does "for payslip, open WhatsApp" feel? Banner? Inline reply? **Recommendation:** inline reply from the bot ("I can't fetch your payslip — for that, open WhatsApp and chat with Smart HR. Want me to show you how?") — keeps the user in the trust loop.

### Constraints on design (must / must not)

**Must:**
- Bot-badged in chat list AND in thread header AND in message bubbles (three redundant signals).
- Thread visually distinguishable from peer threads at first glance.
- Disclosure accessible from every AI thread.
- Mobile-first; Mobi + App parity.
- Data-free where Wyzetalk's Datafree pattern applies (zero-rate the AI requests where ICP segment expects it).
- A11y: keyboard navigation on app shell; screen-reader compatible; correct `lang` attribute on AI replies (carries the lesson from `Multilingual_Content.md` / `/critique-engineering-custom` A11y row).
- Tap-target sizes meet platform guidelines.

**Must not:**
- Surface AI in group chat threads.
- Surface AI in emergency-comms threads.
- Use typing indicators or "online" status that imply human presence.
- Mix AI message bubbles with peer message bubbles in the same thread.
- Hide the disclosure / "i" icon in a deep menu.

### What the designer should NOT prescribe

- The AI engine (tawk.to is locked per `AI_Assistant_FAQ.md`; engine swap is a v2+ concern).
- The retention / data residency model (Legal + tenant policy own it).
- The tenant admin enablement schema (`Tenant_Management.md` owns it).
- The handoff routing logic — which role gets the handoff per intent (Product + HR per tenant).
- The escalation roster per tenant (Implementation / CSM).

### Design slice ordering

- **Slice 1 — heaviest design lift.** Chat-list entry, AI thread shell, AI bubble style, empty-state Suggested Messages, "AI is generating" indicator. Mobile-first, English-only, single tenant.
- **Slice 2 — admin-side only.** Tenant admin console toggle UI. User-side: zero new design (entity simply absent on next chat-list open).
- **Slice 3 — small.** In-thread "Need a person?" button; copy for the handoff thread first message.
- **Slice 4 — reuses Multilingual UX.** Language renderer; minimal new design — relies on `Multilingual_Content.md`'s established UI patterns. New work: localised greeting + Suggested Messages copy, "[English fallback]" note style.
- **Slice 5 — small.** "i" / info icon on thread header; disclosure modal / sheet content; tenant-overridable copy slot.

---

*Authored 2026-04-29 by /prd-author-custom from `06-Resources/Product_ideas/ai-assistant-alongside-chat_discovery.md`. Last run: 2026-04-29 14:30. First validation of the bond_v1 shape on a cross-PRD initiative (vs Multilingual_Content.md, which was a single-feature PRD).*
