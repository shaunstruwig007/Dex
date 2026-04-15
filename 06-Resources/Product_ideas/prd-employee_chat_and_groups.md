---
id: prd-employee_chat_and_groups
# Product idea workspace (dashboard)
dex_dashboard_preserve: false
# Set prdTier: Current | Next | Future | Backlog to override PRD folder on rebuild
# summary: "Short card text"
---

# Employee Chat and Groups

PRD in Future/ — prioritise with Future (P3).

## PRD

- [PRD](06-Resources/PRDs/Future/Employee_Chat_and_Groups.md)

---

## Problem formulation

- **Who / when / broken today:** Frontline employees and teams need **peer-to-peer** coordination (DMs, small groups) that is **not** the same as **admin→employee** operational or urgent messaging, and **not** the same as **AI/bot** Q&A. Today the vault frames **broadcast / admin messaging** as the shipped lane ([`06-Resources/PRDs/Current/Messaging_Ops_Urgent_Alerts.md`](../PRDs/Current/Messaging_Ops_Urgent_Alerts.md)); **two-way employee chat** is explicitly out of that scope. **Employee-created / self-join groups** for comms targeting are also not the current “Groups” product ([`06-Resources/PRDs/Current/Groups.md`](../PRDs/Current/Groups.md) — admin-managed audiences). Without a dedicated model, “chat” risks being confused with ops alerts, feed posts, or the FAQ bot—hurting trust, notification semantics, and compliance story.
- **Success looks like…** A **coherent** employee chat capability (1:1 + groups) with clear **separation**: org/ops messaging vs **social/team chat** vs **bot/AI** (per [`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)); **moderation basics** and tenant policy on who can message whom; **notifications** that fit the channel (steerco lists **Notifications** as an Essential dependency in [`06-Resources/PRDs/Next/README.md`](../PRDs/Next/README.md)). Leadership sequencing treats this as **#3** post–Essential GA (after WhatsApp integration and AI Assistant FAQ)—so success also means **shipping in order** without blocking the faster AI win.

---

## Evidence from the vault

- **Discovery stub (hypothesis & scope):** Peer + group chat is a **distinct capability** from Phase 1 **Messaging: Ops & Urgent Alerts** and from **AI assistant** threads—needs **one coherent model**; scope indicators include DM, group create/join, moderation basics, separation of ops vs social vs bot ([`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)).
- **Admin messaging is not peer chat:** Current messaging PRD is **broadcast**; **two-way messaging / chat** and **WhatsApp two-way / conversational** are **non-goals** there—explicitly **separate initiative** ([`06-Resources/PRDs/Current/Messaging_Ops_Urgent_Alerts.md`](../PRDs/Current/Messaging_Ops_Urgent_Alerts.md) — Non-Goals).
- **AI boundary:** Full **AI assistant & conversational** vision links **Employee Chat** for **product boundary vs bot**; in-app assistant shares intent graph with WhatsApp “where sensible” ([`06-Resources/PRDs/Future/AI_Assistant_Conversational.md`](../PRDs/Future/AI_Assistant_Conversational.md)).
- **FAQ / tawk fast-ship:** **#2** post-GA priority is FAQ HR bot (tawk.to); **Employee chat is #3** — **separate surface**, “peer/team messaging vs bot” ([`06-Resources/PRDs/Future/AI_Assistant_FAQ.md`](../PRDs/Future/AI_Assistant_FAQ.md)).
- **Roadmap / priority:** Future index lists **Employee chat (1:1 & groups)** as **#3 post-GA priority** (2026-03-30) ([`06-Resources/PRDs/Future/README.md`](../PRDs/Future/README.md)).
- **Board sequencing (Apr 2026):** **#1 WhatsApp** → **#2 AI Assistant** (Blue + WhatsApp; tawk.to) → **#3 peer-to-peer chat (group + DM)** → **#4 Remote App** … ([`06-Resources/PRDs/Next/README.md`](../PRDs/Next/README.md)); full narrative referenced at `04-Projects/Wyzetalk_Essential_Launch.md` (file may be absent locally—table still stands in Next README).
- **Dependencies called out in stubs:** Notifications, presence (if any), **tenant policy** on who can chat with whom; open discovery themes: **federation with external IM**, **archive/compliance retention** per tenant ([`06-Resources/PRDs/Future/Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)).
- **Groups primitive today:** “Groups” for **audience targeting** are **admin-managed**; **user-created groups / self-join** are called out as a **future initiative** ([`06-Resources/PRDs/Current/Groups.md`](../PRDs/Current/Groups.md))—overlaps conceptually with employee group chat but is a different product decision (directory-backed vs self-serve communities).
- **Integration map:** Messaging uses **same audience primitives** as posts (Everyone / saved / directory / new group) for **admin** sends; employee peer chat would be a **new** parallel conversation layer ([`06-Resources/PRDs/PRD_Product_Map.md`](../PRDs/PRD_Product_Map.md)).
- **WhatsApp Phase 1:** One-way broadcast; **no** conversational AI in channel PRD—reduces scope creep until Smart HR / Flow ([`06-Resources/PRDs/Current/WhatsApp_Channel.md`](../PRDs/Current/WhatsApp_Channel.md)).
- **Market / competitor colour:** Wyzetalk positioning includes **rights-managed chat** ([`06-Resources/Market_intelligence_Source_Guide.md`](../Market_intelligence_Source_Guide.md)); **Teamwire** profile describes **1:1, group, broadcast** and emergency-adjacent features ([`06-Resources/Competitors/profiles/Teamwire.md`](../Competitors/profiles/Teamwire.md)); **EV-2026-03-006** ties Sentiv/Teamwire narrative to **governance vs WhatsApp** and messaging PRDs ([`06-Resources/PRDs/Evidence_register.md`](../PRDs/Evidence_register.md)).
- **Discovery pass notes:** **QMD** semantic search was **unavailable** in this session (`check-availability` exit 1); **no** meeting-note hits under `00-Inbox/Meetings/` for this topic; **`05-Areas/Relationships/Key_Accounts`** not present in this workspace clone—**accounts** evidence not retrieved.

---

## Solution directions

- **Option A — Unified inbox (“Messages”)** with **tabs or filters**: Ops/system vs Peers vs AI/bot. *Trade-off:* Faster user mental model; **higher** engineering + design cost to unify push rules and read state.
- **Option B — Separate entry points** (e.g. **Chat** for P2P/groups, **Assistant** for bot, existing flows for admin/ops). *Trade-off:* Clearer **trust boundary** (aligns with PRD stubs); risk of **navigation** fragmentation unless notification centre is strong.
- **Option C — Phased: DMs first, groups second** (or vice versa by research). *Trade-off:* Earlier value vs **empty-room** problem for groups.
- **Recommendation (from vault signals):** Preserve **explicit separation** of **peer/team chat vs bot** ([`AI_Assistant_FAQ.md`](../PRDs/Future/AI_Assistant_FAQ.md), [`Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md)); **sequence after** AI FAQ **#2** per board ([`Next/README.md`](../PRDs/Next/README.md)); lean on **Notifications** dependency for the cross-cutting UX. Treat **admin “Groups”** and **employee group chat** as related but **not** the same primitive until discovery proves one directory can serve both.

---

## Novel ideas

- **Thread the AI initiative through Chat UX:** One **component** could mean **bot as a contact** or **“Ask AI” inside a group** (e.g. summarise thread)—**not** collapsing peer and bot into one undifferentiated stream (contradicts stated separation but could be a **later** differentiator).
- **Compliance-forward peer chat:** Lean into **rights-managed**, **exportable**, **tenant-policy** chat as a **differentiator vs shadow WhatsApp** (echoes EV-2026-03-006 and Teamwire/Sentiv narrative in [`Evidence_register.md`](../PRDs/Evidence_register.md) / [`Teamwire.md`](../Competitors/profiles/Teamwire.md)).
- **Bridge from admin messaging:** Optional **“promote to peer thread”** from an operational message (employee-initiated)—only if policy allows; could reduce context switching without blurring **urgent** vs **peer** channels.

---

## Risks and assumptions

- **Assumption:** **#3** sequencing remains valid vs sales pressure to ship chat earlier ([`Next/README.md`](../PRDs/Next/README.md)).
- **Risk:** **Notification fatigue** if peer chat, ops messaging, posts, and AI all compete—needs **priority rules** ([`Communication_acceptance_criteria.md`](../PRDs/Current/Communication_acceptance_criteria.md) cross-cuts with Messaging).
- **Risk:** **Compliance / POPIA** — retention, monitoring, and **tawk.to** / future AI logs must stay **consistent** ([`AI_Assistant_Conversational.md`](../PRDs/Future/AI_Assistant_Conversational.md) open questions).
- **Risk:** **Category competition** (secure messenger RFPs) where buyers compare Wyzetalk to **Teamwire-class** products ([`Teamwire.md`](../Competitors/profiles/Teamwire.md)).

---

## Open questions

- Federation with **external IM** (WhatsApp, Teams) vs **walled garden** — stubbed in [`Employee_Chat_and_Groups.md`](../PRDs/Future/Employee_Chat_and_Groups.md).
- **Archive/compliance retention** per tenant and **legal hold** expectations.
- **Presence** (show online?) — listed as dependency in stub; product and privacy trade-offs.
- How **employee group creation** relates to **admin query-builder Groups** ([`Groups.md`](../PRDs/Current/Groups.md))—single directory or two concepts?
- **Moderation** depth for Phase 1: report/block only vs admin dashboards vs keyword policies?
- Does **AI Assistant FAQ** (tawk.to) **reuse** any **chat infrastructure**, or stay a **parallel** surface until a unified platform exists ([`AI_Assistant_FAQ.md`](../PRDs/Future/AI_Assistant_FAQ.md))?

---

## Design

- Figma: *(add link in dashboard detail or here)*

## Orchestration

Move lanes in the dashboard; export JSON when stable.
