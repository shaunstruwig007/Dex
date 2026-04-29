---
discovery_id: ai-assistant-alongside-chat
discovery_shape: discovery_v1
status: draft
created_date: 2026-04-29
last_updated: 2026-04-29
authored_by: walkthrough-2 (manual; /initiative-discovery-custom shape)
related_prds:
  - Employee_Chat_and_Groups.md (lifecycle: discovery)
  - AI_Assistant_FAQ.md (lifecycle: discovery)
  - Smart_HR_Whatsapp.md (lifecycle: spec_ready)
  - Messaging_Ops_Urgent_Alerts.md (boundary)
  - Notifications.md (dependency)
felix_stale: true
felix_last_run: 2026-04-20
icp_version: v1 (2026-04-29)
---

# Discovery — AI Assistant alongside Employee Chat

> Cross-PRD discovery. Reconciles `Employee_Chat_and_Groups.md` + `AI_Assistant_FAQ.md` + `Smart_HR_Whatsapp.md` on the **IA / surface-parity** question opened during the second skill-pipeline walkthrough (2026-04-29).

---

## Problem statement

Wyzetalk Essential's "Next" roadmap has **three separately-tracked chat-shaped surfaces** for the frontline employee:

1. **Peer & group chat** (`Employee_Chat_and_Groups.md`) — human-to-human messaging, realtime stack TBD, separate from ops/bot.
2. **AI FAQ assistant** (`AI_Assistant_FAQ.md`) — bot-to-human, tawk.to-locked, Blue app first.
3. **Smart HR via WhatsApp** (`Smart_HR_Whatsapp.md`) — structured HR self-service (payslip / leave / roster), WABA + Flow.

The 2026-04-17 collaborative pilot ratified strict separation between the three. **All three have been authored as separate PRDs.** No single PRD owns the question: *"where does each surface sit in the user's mental model and Information Architecture?"*

The naïve question — *"should AI live inside peer chat?"* — re-opens settled separation. The **load-bearing question** is sharper:

> **Does AI Assistant share the chat IA pattern (chat list entry, threaded surface, bot-badged peer entity) without merging data, permissions, or thread state with peer chat?**

This is a cross-PRD design problem. It cannot be answered inside `Employee_Chat_and_Groups.md` (peer-only scope) or `AI_Assistant_FAQ.md` (engine-locked scope) alone.

---

## User segments

| Segment | Primary surface today | Job for this initiative |
|---|---|---|
| **Frontline employee — high-volume FAQ asker** (low-literacy / low-patience subset) | Phone calls to HR, paper forms | Get policy answers without leaving the app; tap-first; no data cost |
| **Frontline employee — chat-native** | Peer chat (PRD pending) | Find AI Assistant where they already live (chat list); not a separate "AI" tab buried in nav |
| **HR-adjacent / supervisor** | Email, calls, in-person | Reduce repetitive HR question volume; trust the answers (escalation when bot uncertain) |
| **Tenant admin (HR/Comms/Ops buyer group)** | Wyzetalk admin console | Control whether AI Assistant is enabled; control content; audit conversations; trust POPIA posture |
| **Wyzetalk implementation / CSM** | Tenant onboarding | Provision tawk.to workspace; ingest client policy docs; document escalation roster |

**Primary user for the walking skeleton:** *frontline employee — high-volume FAQ asker* (the one whose adoption will validate the IA decision).

---

## Stakeholders (extracted from PRD bodies — no people pages exist yet)

| Stakeholder | Role | Source | Decision authority |
|---|---|---|---|
| **Merel** | CEO / CPO | Cited in `AI_Assistant_FAQ.md` legacy section ("leadership session 2026-03-30") | Commercial priority ordering (#1 Smart HR, #2 AI FAQ, #3 Chat) |
| **Leon** | CTO | Same source | Engineering spike scope (chat backend), vendor selection |
| **Discovery workshop** (Chat) | Group rules + creation policy | `Employee_Chat_and_Groups.md` follow-ups | Group creation rules, membership policy |
| **Engineering spike owner** (Chat) | Realtime stack | `Employee_Chat_and_Groups.md` follow-ups | First-party vs CPaaS — output is an ADR |
| **Legal** | Compliance | `Employee_Chat_and_Groups.md`, `AI_Assistant_FAQ.md` | Retention, POPIA data residency, audit |
| **HR / content owners** | Per-tenant FAQ corpus | `AI_Assistant_FAQ.md` open question | Who edits FAQ answers ongoing |
| **Tenant champion** | Per-tenant launch advocate | ICP doc + Wyzetalk playbook | Tenant launch readiness |

**Evidence gap:** None of these stakeholders have a person page in `05-Areas/People/`. Stakeholder list is **inferred from PRD bodies** — not validated against actual decision authority.

---

## Evidence log

### Confirmed by vault content

- **2026-03-30 leadership decision (Merel + Leon):** Commercial priority order → Smart HR (#1), AI FAQ (#2), Chat (#3). Source: `AI_Assistant_FAQ.md`.
- **2026-04-17 collaborative pilot:** Three-way surface separation ratified. Phase 1 GA scopes locked for each PRD. Engine choice for AI = tawk.to (locked). Engine choice for Chat = TBD (engineering spike pending). Source: pilot blocks in all three PRDs.
- **Cross-PRD handoff already documented in Smart_HR_Whatsapp.md WP-4:** "Non-structured HR / policy questions route to FAQ bot path." This is a **behavioural seam**, not a UI seam. The user-visible IA question (does the FAQ bot live "in chat" or "elsewhere"?) is not addressed.
- **AI FAQ explicitly out-of-scopes peer chat** (`AI_Assistant_FAQ.md` Out of Scope: "Peer/team chat — Employee_Chat_and_Groups.md"). The reverse is also true. Both PRDs treat the merge as out-of-scope.

### Inferred from PRD framing (lower confidence)

- **Frontline UX driver (low-literacy / low-patience):** `AI_Assistant_FAQ.md` invests heavily in tap-first guided UX (Suggested Messages, ≤4 buttons, ≤10 words). This implies the same UX constraints apply if AI Assistant lives in the chat list — short labels, clear bot affordance, escalation visible.
- **Tenant-controlled enablement:** Both anchor PRDs assume tenant policy gates feature visibility. Surface parity in chat means AI Assistant must respect tenant policy (i.e. invisible in chat list when disabled).
- **POPIA posture difference:** AI FAQ logs conversations to tawk.to cloud (vendor data residency cited as open question). Peer chat retention/export stance is "per tenant" (Employee_Chat_and_Groups.md WP-3). **A unified inbox UI cannot have unified data treatment.**

---

## Evidence gaps (explicit)

The discovery rule is to surface what's missing rather than gloss over it. The following are NOT in the vault and would tighten this discovery if the PM elects to backfill before spec:

1. **No customer / leadership / sales meeting notes referencing chat or AI in the chat surface.** `00-Inbox/Meetings/` is empty. Decisions are inferred from PRD bodies, not from observed conversations.
2. **No people pages.** `05-Areas/People/` has no Internal pages for Merel, Leon, or HR / Legal / engineering spike owner. Stakeholders are roles, not named decision-makers with context.
3. **No company / tenant pages.** `05-Areas/Companies/` is empty. The "tenant champion" / "buyer group" patterns from the ICP have no concrete instances in the vault.
4. **No competitor profiles for Slack-pattern, Teams Copilot, Workvivo, Beekeeper, Staffbase, Microsoft Viva, or LumApps.** Only `Jem.md` exists. AI-in-chat-IA patterns from horizontal collab tools are the strongest reference point and they're absent.
5. **Friday Signal is stale** (2026-04-20, 9 days). Re-running `/weekly-market-intel-custom` would close this; specifically, the **AI sub-lens for "AI in worker-facing surfaces"** is the relevant cell.
6. **No design / wireframe artefact** for chat IA. Both PRDs treat IA as TBD; no Figma references; no wireframe brief in `plans/PDLC_UI/` for chat surface (pdlc-ui itself is parked).

**PM decision point:** Per skill rule, the next step (`/prd-author-custom`) can either proceed on this discovery as-is OR pause for one or more gaps to be backfilled. **Recommendation:** at least gap 4 (one or two competitor profiles for Slack-pattern AI-in-chat) is high leverage — that's the dominant horizontal pattern this initiative copies.

---

## ICP strategic-fit cross-check

(`System/icp.md` v1, 2026-04-29)

| ICP segment | Fit for "AI alongside chat" | Notes |
|---|---|---|
| **ICP 1 — Core: large distributed frontline workforce, single front door** | **Strong** | Chat is natural fit; AI in chat list reduces tax of finding answers. Reinforces "front door" thesis. |
| **ICP 2 — HR Self-Service & secure employee access** | **Strongest** | AI FAQ on HR policy / leave / payslips is the #2 commercial priority. Co-locating with chat removes friction. |
| **ICP 3 — Safety/operations-led businesses (SHEQ)** | **Mixed — caution** | Chat for safety convos = useful. **AI for SHEQ answers = liability risk** (same posture as multilingual walkthrough's SHEQ-translation-out-of-scope decision). AI Assistant must NOT volunteer SHEQ-critical answers without verification. |
| **ICP 4 — Crisis / Emergency Comms (incl. WhatsApp)** | **Out of scope** | Emergency comms have their own surface (`Messaging_Ops_Urgent_Alerts.md`). AI Assistant should NOT show up in emergency comms thread list — or should be visibly silenced when emergency mode is active. |

**Cross-segment disqualifier:** Tenants who refuse to govern (no client champion, no escalation roster, no opt-in campaign for emergency channels) are bad fits regardless of the chat/AI question. Out of scope here.

**Strategic call:** This initiative aligns most strongly with ICP 2 — exactly the segment whose discovery is already the #2 commercial priority. **Initiative does not require new ICP segments.**

---

## Solution-pattern survey

How do other products solve "AI in a chat-shaped surface"?

| Pattern | Vendor / product | What they do | Applicability for Wyzetalk Essential |
|---|---|---|---|
| **Bot as peer in chat list** | Slack | App bots appear in DM list; clearly badged with app icon; separate threads. Apps install scope-controlled. | **Strong.** This is the model the initiative is copying. |
| **AI as peer in chat list** | Microsoft Teams (Copilot) | Copilot appears as a peer entity; gets its own thread; can be `@`-mentioned in group chats. | **Medium.** `@`-mention in group chats = the merge slice we'd flag as kill-candidate. |
| **Bot inbox separate from peer chat** | Many enterprise messengers (older) | Bots live in a "Bots" tab; peer messages in another tab. | **Anti-pattern for adoption.** ICP 1 (frontline) has low patience for IA hunting. |
| **AI in widget, not in chat list** | tawk.to (current `AI_Assistant_FAQ.md` Phase 1) | tawk.to widget is its own surface in Blue app; users open it explicitly. | **Status quo.** This is what shipping Phase 1 of `AI_Assistant_FAQ.md` looks like as-is. The initiative asks: should we evolve to "bot as peer in chat list" later? |
| **Mixed-mode inbox (humans + bots in same thread list)** | WhatsApp Business + bots | Bots and humans share the inbox. | **Anti-pattern.** Privacy ambiguity — known issue, surfaced in user's own question. |
| **AI on employer side, not worker side** | JEM HR | AI lives in employer dashboard (insights / coaching). Worker side is transactional (payslip, EWA). | **Strategic alternative.** Worth flagging — Wyzetalk could differentiate by NOT putting AI in worker chat. |

**Solution thesis:** *Slack pattern, executed inside Wyzetalk's three-surface separation. AI Assistant becomes a peer entity in the chat list — clearly bot-badged, separate data flow, separate permissions, separate retention. NOT mixed-mode (no AI threads in peer chat, no `@AI` in group chats by default).*

---

## Candidate slices (for `/prd-author-custom`)

The PRD author may refine, drop, or merge. Slice 1 is the walking skeleton.

| # | Slice | Demo outcome | Layers | Depends |
|---|---|---|---|---|
| **1** | **Skeleton:** AI Assistant appears as a single bot-badged peer entity in chat list. Tap → static thread → tawk.to-grounded reply. No realtime, no peer chat involvement, no group chat. **Single tenant, single language.** | Frontline user opens chat list, sees "AI Assistant" badged as bot, taps it, asks a question, gets a tawk.to reply. | data + api + ui | — |
| **2** | **Tenant policy:** AI Assistant visibility in chat is tenant-controlled. When off, doesn't appear in user's chat list at all. | Admin toggles AI Assistant off → user's chat list no longer shows the entity. | api + config | 1 |
| **3** | **"Talk to a human" handoff:** AI thread can transition the user to a peer chat with HR / agent (escalation, not merge). | User asks something AI can't answer → bot offers handoff button → user lands in a separate peer chat thread with HR. | api + ui | 1 |
| **4** | **Context-aware FAQ:** AI Assistant reads user's profile (role, location, language preference from `Profile_Users.md`) for personalised answers. | Two users in different roles ask the same question, get role-appropriate answers. | api + ui | 1 |
| **5 (KILL CANDIDATE)** | **`@AI` invocation in group chats:** user can summon AI Assistant into a peer group thread with `@AI`. **HIGH RISK** — this is the merge scenario. | (Don't ship this until critique skills sign off.) | data + api + ui | 1, 2, 3 |

**Walking-skeleton thesis:** Slice 1 alone is enough to validate the IA decision. If users don't find AI Assistant in the chat list, the rest of the slices don't matter.

**Slice 5 is explicitly flagged as a kill candidate.** It re-introduces the merge that the 2026-04-17 pilot ratified out. The PRD author should NOT include it in the first plan-mode-seed without `/critique-product-custom` Outcome-integrity sign-off and `/critique-engineering-custom` privacy / regulation sign-off.

---

## Open questions (for the PRD author / steerco)

1. **Sequencing relative to the chat realtime spike.** Does Slice 1 ship before or after the chat backend is chosen? If before: AI Assistant lives in a chat-shaped UI that doesn't yet have peer chat behind it. If after: chat backend choice may constrain AI peer-entity model. **Blocks:** Slice 1 entry into spec_ready. **Owner:** Leon (CTO).
2. **POPIA data residency for unified inbox UI.** If users see "AI Assistant" next to "Sarah from HR" in their chat list, are they confused about where their messages go? Does Wyzetalk need an in-app disclosure ("AI Assistant conversations are stored by tawk.to; peer chats are stored by Wyzetalk")? **Blocks:** Slice 2 (tenant policy). **Owner:** Legal + Product.
3. **EU AI Act / workforce-data lens (per `/weekly-market-intel-custom` AI sub-lens 2).** Does AI Assistant in the chat list constitute "workplace AI deployment" requiring transparency disclosure under the EU AI Act? Does South Africa's POPIA + emerging AI guidance require similar? **Blocks:** Phase 1 GA. **Owner:** Legal.
4. **Tenant admin control surface.** Where does the admin enable/disable AI Assistant in the chat list? Is it a separate flag from "enable AI FAQ in Blue app" (the current PRD), or merged? **Blocks:** Slice 2 spec. **Owner:** Tenant_Management.md owner.
5. **Branding of the bot peer entity.** Does it appear as "AI Assistant" generically or as a per-tenant brand name (e.g. "Anglo HR Bot")? **Blocks:** UI design. **Owner:** Product + Marketing.
6. **Surface parity with Smart HR (WhatsApp).** Smart HR is conversational on WhatsApp. Should the chat-list AI Assistant ALSO surface Smart HR intents (payslip / leave) — or hard-route them to the Smart HR surface (which is currently WhatsApp-only)? **Blocks:** Slice 4. **Owner:** Product.
7. **What kills the initiative?** If we shipped Slice 1 and adoption is low, what does that tell us? Is it an IA failure (users don't find it), a content failure (FAQ corpus thin), or a trust failure (users don't trust the bot)? **Blocks:** post-launch metrics design. **Owner:** Product Analytics.

---

## Recommendation to PRD author

The skill author's job, per `/prd-author-custom`'s required-input contract, is to ingest this discovery and produce ONE OR MORE bond_v1 PRDs. The shape this discovery suggests:

**Path A — Single new cross-PRD initiative spec.** Create `06-Resources/PRDs/AI_Assistant_in_Chat_Surface.md` (bond_v1). This new PRD owns the IA / surface-parity question. The two existing PRDs stay focused on their narrow scopes (peer chat backend; tawk.to engine + Blue app embed).

**Path B — Reshape both existing PRDs to bond_v1 and add the IA initiative as a slice in `Employee_Chat_and_Groups.md`.** Initiative rides as Slice N+1 of the chat PRD; AI FAQ PRD remains untouched. Lower scope, less surface area.

**Path C — Path B + a third "Phase 2" slice list capturing the merge slices (current Slice 5).** This is essentially Path A in fragments.

**Skill recommendation:** **Path A** is cleanest. The IA question is genuinely cross-cutting and doesn't fit cleanly inside either anchor PRD's scope. Both existing PRDs already explicitly out-of-scope this question. A new PRD owns it.

But the user's chosen path was **reshape existing PRDs to bond_v1** (per the walkthrough scope question). So the recommended sequence is:
1. Reshape `Employee_Chat_and_Groups.md` to bond_v1 — preserves all 2026-04-17 pilot decisions and TBD sections, just slice-shapes the workpackages.
2. Reshape `AI_Assistant_FAQ.md` to bond_v1 — same.
3. Author the IA cross-PRD initiative as `AI_Assistant_in_Chat_Surface.md` (new, bond_v1) referencing both reshaped PRDs as `related_prds:`. This is where the slices in this discovery live.

That's a three-PRD output. Worth confirming with the PM before invoking `/prd-author-custom` three times.

---

## Steps the discovery skill explicitly DID NOT take

(Honesty rule — list what was skipped, why, and what risk that creates.)

- **Did not run `/weekly-market-intel-custom`** to refresh Friday Signal. Skipped because the user opted to walk through this initiative now. **Risk:** competitor moves in the AI-in-chat space from the last 9 days are not factored. Mitigation: open question 3 explicitly flags EU AI Act lens which Friday Signal monitors.
- **Did not interview stakeholders.** Vault has no stakeholder pages and no recent meeting notes. **Risk:** all decisions in this discovery are inferred from PRD bodies and PRD-pilot blocks. Mitigation: open questions explicitly route decisions back to named role-holders.
- **Did not validate the ICP cross-check against actual customer evidence.** No `05-Areas/Companies/` content. **Risk:** ICP fit is a thesis, not validated against named tenant. Mitigation: evidence-gap log makes this visible.
- **Did not draft technical blueprint.** Per skill spec, that's the PRD author's and engineering critique's job, not discovery's.

---

*Authored 2026-04-29 during the second skill-pipeline walkthrough. Tests `/initiative-discovery-custom` on a cross-PRD initiative with denser vault context than walkthrough 1 (multilingual). Will be deleted or moved to archive once the PRD author run completes and the lessons are captured in `plans/skill-pipeline/lessons-from-skills.md`.*
