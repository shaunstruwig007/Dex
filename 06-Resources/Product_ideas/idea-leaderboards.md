# Leaderboards

**Id:** `idea-leaderboards`

## Problem formulation

- **Who / when / broken today:** Employees and people leaders want visible momentum when people complete important work (training, safety acknowledgements, operational tasks) and when peers recognise each other—but the product today centres **broadcast content** (feed, posts, Explorer categories) rather than **individual progress signals**. Profile is framed as **self-service data and settings**, not achievement or social proof ([`06-Resources/PRDs/Current/Profile_Users.md`](../PRDs/Current/Profile_Users.md)). Recognition content can be **authored** (e.g. Spotlight / “Recognitions” tagging in posts) but there is no first-class **systemic** leaderboard or badge surface tied to task completion.
- **Success looks like…** Tenants can optionally surface **fair, auditable** recognition of behaviour that matters (tasks done, milestones, peer nominations)—with **controls against gaming**, clear **POPIA / privacy** posture, and **user opt-in** where celebration touches the social graph—aligned with the stated hypothesis for rewards & recognition ([`06-Resources/PRDs/Future/Rewards_and_Recognition.md`](../PRDs/Future/Rewards_and_Recognition.md)). Employees see “what good looks like” without turning the app into a punitive scoreboard; HR/comms retain trust.

## Evidence from the vault

- **Rewards & recognition (Future stub)** — Explicit scope: peer recognition, lightweight rewards (points, nominations, **milestones**), **nominate / thank / badge flows**, **leaderboards** paired with **“gaming” controls**; fairness, auditability, optionality ([`06-Resources/PRDs/Future/Rewards_and_Recognition.md`](../PRDs/Future/Rewards_and_Recognition.md)).
- **Profile surface** — Current profile PRD covers My Details, Security, Notifications, guides, feedback; **non-goals** include full profile editing and rich notification categories—any leaderboard/badge UI needs a deliberate **new section** or extension, not an implicit fit ([`06-Resources/PRDs/Current/Profile_Users.md`](../PRDs/Current/Profile_Users.md)).
- **Celebrations & badges (cross-cutting)** — Discovery stub calls out **celebration patterns (badges, anniversaries)** with **per-user opt-in / opt-out** ([`06-Resources/PRDs/Future/Content_Moderation_Mentions_Celebrations.md`](../PRDs/Future/Content_Moderation_Mentions_Celebrations.md)).
- **Content-led recognition today** — Posts support sub-categories including **Spotlight** (recognition, employee stories) and suggested tag **Recognitions**; Explorer maps **Spotlight** to a tile—**narrative** recognition, not automated scoring ([`06-Resources/PRDs/Next/Explorer.md`](../PRDs/Next/Explorer.md), [`06-Resources/PRDs/Current/Posts.md`](../PRDs/Current/Posts.md)).
- **Product ideas hub** — `prd-rewards_and_recognition` workspace points at the same Future PRD ([`prd-rewards_and_recognition.md`](./prd-rewards_and_recognition.md)).
- **Search method (this pass):** Workspace QMD check reported unavailable (`node .scripts/semantic-search/check-availability.cjs`); discovery used **grep + PRD reads** across `06-Resources/PRDs/` and related product idea files. No matches in `00-Inbox/Meetings/` or `05-Areas/Relationships/Key_Accounts/` for leaderboard/gamification terms in this vault snapshot.

## Solution directions

- **A — Profile “My achievements” (badges + optional rank)** — Badges for definable events (course complete, policy acknowledged, anniversary); optional **team- or site-scoped** leaderboard (not company-wide by default) to reduce shame dynamics. *Trade-off:* Engineering needs authoritative **task/completion** sources (today Page Builder mentions checklists as content, not a unified task engine—[`06-Resources/PRDs/Next/Page_Builder.md`](../PRDs/Next/Page_Builder.md)).
- **B — Feed/Explorer-first recognition, profile as mirror** — Keep public recognition in **posts** (Spotlight / Recognitions); profile shows **earned badges** and **private** progress. *Trade-off:* Weaker “leaderboard” unless feed surfaces a periodic **top contributors** module (moderation-heavy).
- **C — Partner-first (Achievers-class)** — Defer native leaderboards; integrate specialist R&R. *Trade-off:* Faster parity with enterprise programmes, less product differentiation; still need POPIA and SSO story ([open question in [`Rewards_and_Recognition.md`](../PRDs/Future/Rewards_and_Recognition.md))).

**Recommendation:** Treat **leaderboards + badges** as one slice under the **Future** `Rewards_and_Recognition` theme: start with **badges + opt-in celebration** (ties to Content_Moderation_Mentions_Celebrations) and **scoped** leaderboards (site/team/category) with anti-gaming rules; expand only when completion events are trustworthy and unified.

## Novel ideas

- **Behavioural badges that map to operations** — “First aid refresher done”, “near-miss reported”, “read-through of new SOP”—aligned with deskless reality, not generic “points for opens.”
- **Dual leaderboard:** one **opt-in social** (peer thanks/nominations), one **operational** (compliance/training)—different governance and moderation queues.
- **Negative space:** a **“no public ranking”** mode where users only see self + anonymous cohort percentiles—reduces stack-ranking culture while preserving motivation.

## Risks and assumptions

- **Gaming and fairness** — Called out explicitly in Future R&R stub; leaderboards without guardrails harm trust ([`06-Resources/PRDs/Future/Rewards_and_Recognition.md`](../PRDs/Future/Rewards_and_Recognition.md)).
- **Privacy / POPIA** — Names on walls and visibility of performance-like data need legal/product review (same stub).
- **Dependency:** **Granular notification preferences** for celebration/mention noise ([`06-Resources/PRDs/Future/Content_Moderation_Mentions_Celebrations.md`](../PRDs/Future/Content_Moderation_Mentions_Celebrations.md) → [`Notification_Preferences_Granular.md`](../PRDs/Future/Notification_Preferences_Granular.md)).
- **Assumption:** “Tasks fulfilled” can be defined consistently per tenant; if completion only exists inside bespoke integrations or PDF flows, leaderboard inputs stay thin until **Product Analytics** or unified events mature ([`06-Resources/PRDs/Next/Product_Analytics.md`](../PRDs/Next/Product_Analytics.md) narrative on proof points).

## Open questions

- Native build vs **partner integration** first? ([`06-Resources/PRDs/Future/Rewards_and_Recognition.md`](../PRDs/Future/Rewards_and_Recognition.md))
- Which **completion events** are v1-truthful (imports, Page Builder interactions, remote apps, LMS)—and who **configures** badge rules per tenant?
- Leaderboard **scope** default: company, site, team, or group—and **manager visibility** vs peer-only?
- Moderation: do celebration/leaderboard surfaces share the **same abuse queue** as posts? ([`06-Resources/PRDs/Future/Content_Moderation_Mentions_Celebrations.md`](../PRDs/Future/Content_Moderation_Mentions_Celebrations.md))
- **Profile IA:** new section name and placement vs **Explorer** entry (e.g. “Learning & Growth” vs dedicated “Achievements” tab)?
