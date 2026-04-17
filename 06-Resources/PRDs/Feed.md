---
prd_id: feed
lifecycle: done
created_date: 2026-04-17
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Keep BDD in sync with Posts / Messaging urgent pin rules
---

# Feed

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Employees consuming group-targeted business posts with search, reactions, archive rules  
**Estimated Effort:** Ongoing; archive/retention per [PRD_Product_Map.md](./PRD_Product_Map.md)

---

> Lighter spec derived from the Feed discovery document. Covers feed display, search/filter/sort, post templates, reactions, notifications, and archiving.

**Related PRDs:** [Groups.md](./Groups.md) (**visibility = group membership**; posts are irrelevant to a user if they are not in the target audience), [Posts.md](./Posts.md) (authoring, lifecycle, all templates including Phase 2 PDF/Video/form link), [Notifications.md](./Notifications.md) (new post alerts), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (pinned urgent module on this surface). **QA / AC:** [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Employees see a **chronological, group-scoped feed** of business posts they are entitled to — with search/filter, reactions, archiving, and urgent pin behaviour — as the primary post-login surface.

**User value:** Core engagement surface; canonical visibility/archive rules in Product Map §4.1.

---

## Work Packages

### WP-Read: Feed list & templates (P0)

**Priority:** P0  
**Dependencies:** [Posts.md](./Posts.md), [Groups.md](./Groups.md)  
**Files:** Mobile TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 1 | LIFO posts for membership | BDD SF-* |
| 2 | Phase 2 templates render | PDF/Video/Form per Posts |

### WP-Search: Search filter sort (P0)

**Priority:** P0  
**Dependencies:** WP-Read  
**Files:** Index TBD  
**VPS-eligible:** Yes

### WP-Urgent: Pinned urgent module (P0)

**Priority:** P0  
**Dependencies:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)  
**Files:** Client TBD  
**VPS-eligible:** No

### WP-Archive: Retention (P0)

**Priority:** P0  
**Dependencies:** Product Map canonical table  
**Files:** Policy engine TBD  
**VPS-eligible:** Yes

**Dependency graph:**

```text
WP-Read ──> WP-Search
WP-Read ──> WP-Urgent
WP-Read ──> WP-Archive
```

---

## Success Scenarios

- Employee not in group: does not see post (edge case in legacy).  
- Archive: employee search excludes archived posts per BDD ARC-*.

---

## Satisfaction Metric

**Overall Success:** BDD **ARC/SF/PIN** suite pass rate **≥ 95%** in regression (target).

**Measured by:** Automated + manual QA on release.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Feed dwell / views — [Product_Analytics.md](./Product_Analytics.md).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Chronological** feed (no algorithmic ranking Phase 1).  
- **Canonical archive/retention** — Product Map §4.1.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Feed API | TBD |
| Mobile feed UI | TBD |

---

## Validation Protocol

```bash
grep -c "ARC-01" "06-Resources/PRDs/Feed.md"
# PASS: >= 1

grep -c "PIN-" "06-Resources/PRDs/Feed.md"
# PASS: >= 1
```

**Manual:** Visual QA templates.

---

## Notes for Agent Implementation

**Soldier review:** Admin-not-in-audience edge case; sync with Messaging PIN rules.

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- **Algorithmic ranking** Phase 1.  
- **Offline caching** future.

---

# Problem Statement

Employees need a single, reliable place to receive important business-related news. Without a structured feed, information gets lost in email, SMS, or noticeboard clutter — particularly for frontline workers who lack access to traditional channels. The feed is the primary reason employees open the app; if it's cluttered, slow, or hard to navigate, engagement drops and critical business communication fails to land.

---

# Goals

1. **Serve as the primary content surface** — Every employee lands on their feed after login and sees posts targeted to their groups.
1. **Enable content discovery** — Employees can search, filter, and sort to find relevant posts quickly.
1. **Drive engagement** — Reactions give employees a lightweight way to interact with content.
1. **Keep content fresh** — Auto-archiving removes stale posts without admin intervention.
---

# Non-Goals

- **Social posts / user-generated content** — Feed is business-only for Phase 1. Social posts are a later phase.
- **Comments / threaded discussions** — Only reactions (likes) in Phase 1.
- **Algorithmic feed ranking** — Chronological only. No personalisation algorithm.
- **Offline feed caching** — Future consideration.
---

# User Stories

- As an **employee**, I want to see the latest business posts targeted to my groups when I open the app so that I'm always up to date.
- As an **employee**, I want to search posts by title, description, or tag so that I can find specific content.
- As an **employee**, I want to filter posts by category, sub-category, or author so that I can narrow down what I see.
- As an **employee**, I want to react to a post with a "Like" so that I can acknowledge content I find useful.
- As an **admin**, I want to edit or delete posts directly from the feed via a more menu so that I can manage content in context.
**Edge Cases:**

- As an **employee**, I want posts from removed users to show "Previous Employee" so that I understand the content source.
- As an **admin not in the target group**, I understand I won't see a post on my own feed even if I created it.
---

# Requirements

## Must-Have (P0)

### Feed Display

- [ ] Display business posts ordered latest first (LIFO). Posts visible only to users in the associated group.
- [ ] Pagination: lazy loaded in batches of 5 with skeleton loading. Time-stamped pagination limiting.
- [ ] Pull-to-refresh for new posts with loading indicator.
- [ ] Post duration display: min, hr, day, week, month, yr since publish. UTC conversion based on user location.
- [ ] Two FABs: Create post (admin only), Back to top.
### Search, Filter, Sort

- [ ] Search via top nav. Text search weighted: (1) Title, (2) Description, (3) Tags, (4) Categories/sub-categories, (5) Owner.
- [ ] Filter by: Category, Sub-category, Author.
- [ ] Sort: Latest (default), Oldest. Ascending/descending.
### Post Templates on Feed

- [ ] Display: Image, Text, Link post templates.
- [ ] Admin sees more menu (…) on posts with: Delete, Edit.
### Categories

- [ ] Every post requires a category (enforced). Business category only for Phase 1.
- [ ] Sub-categories: Announcements, Health & Wellness, Safety & Security, HR, Leadership, Learning & Growth, Spotlight, Success Stories, Workplace & Events.
### Archiving

- [ ] Auto-archive after 3 months unless marked permanent. Archived posts removed from **employee** main feed → admin archive section. Long-term delete (**1 year** from archive, subject to tenant/legal policy) per [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) (ARC-02). **Canonical cross-PRD summary:** [PRD_Product_Map.md](./PRD_Product_Map.md) §4.1.
### Reactions

- [ ] Like reaction with count. Undo supported. Reaction drawer shows: Avatar, Name, Designation, Position.
### Notifications

- [ ] New business post notification (based on user preference). Clicking opens single post view.
## Nice-to-Have (P1)

- [ ] Social posts and categories (later phase).
- [ ] Richer reaction types beyond Like.
---

# Success Metrics

**Leading:**

- Daily active feed viewers as % of activated users (target: >60%)
- Search/filter usage rate (target: >15% of sessions)
- Reaction rate per post (target: >5% of viewers react)
**Lagging:**

- Employee engagement score (survey-based, quarterly)
- Reduction in missed business communications (qualitative)
---

# Open Questions

- **[Product]** Should archived posts be viewable by employees or admin-only?
- **[Engineering]** What is the performance target for feed load time on low-bandwidth mobile?
- **[Design]** Should the feed support pinned/featured posts beyond urgent alerts?
- **[Product]** When social posts are introduced, do they share the same feed or a separate tab?

---

## Acceptance criteria (BDD)

**Source PRD:** [Feed.md](./Feed.md)  
**Related:** [Groups.md](./Groups.md) (who sees which posts), [Posts.md](./Posts.md) (authoring, lifecycle, publish rules), [Notifications.md](./Notifications.md) (new-post alerts), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) — **pinned urgent alert** on the feed (Phase 1).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md)  
**Use:** Eng / QA / design review — **human-owned**; refine with real APIs and designs.

---

## Scope reminder (from PRD + decisions below)

- **In (Phase 1):** Business posts only, **chronological LIFO** for normal posts, **search/filter/sort**, Like + undo, admin more-menu, categories + sub-categories, auto-archive (**admin-only** visibility for archived content), new-post notification (pref-based), **active urgent alerts pinned to top of feed** (per Messaging spec), **feed load governed by documented SLO** (targets TBD in perf spec).  
- **Out (Phase 1) for *this* feed surface:** **Social / UGC** — **not** mixed into the business feed; **future:** dedicated **Social** experience as a **separate tab** (social-only feeds).  
- **Still out:** Comments/threads on business posts, **algorithmic ranking** of the main post list (chronological; **pinning is not ranking** — fixed slot for urgent alerts only), offline feed caching (unless SLO doc pulls it in).

---

## Acceptance criteria — Feed display & access

| ID | Criterion |
|----|-----------|
| FD-01 | **Given** an authenticated employee in at least one group **when** they open the app landing feed **then** they see **only** business posts targeted to their group(s), **ordered newest first** (LIFO) **below** any **active urgent-alert pinned module** *(see PIN-01–PIN-04)*. |
| FD-02 | **Given** the feed has more than one page of posts **when** the user scrolls toward the end **then** the next batch loads (**lazy load**, batch size **5**) with **skeleton** placeholders until content resolves. |
| FD-03 | **Given** older posts exist beyond the pagination window **when** the user continues scrolling **then** pagination respects **time-stamped / cursor** rules as implemented (no duplicates, no skips — define cursor contract in tech spec). |
| FD-04 | **Given** the user is on the feed **when** they **pull to refresh** **then** a **loading** indicator shows and new posts since last load appear **without** losing scroll position policy *(define: top vs stay — align with design)*. |
| FD-05 | **Given** a post has a published timestamp **when** it is shown **then** relative time displays using **min / hr / day / week / month / yr** labels, computed from **UTC** with conversion for **user locale/timezone**. |
| FD-06 | **Given** a user with **admin** role **when** they view the feed **then** they see **Create post** FAB; **non-admin** does **not**. |
| FD-07 | **Given** a long feed **when** the user taps **Back to top** FAB **then** the list returns to top and newest content is visible *(define animation / refresh-on-top — product call)*. |
| PERF-01 | **Given** defined **feed load SLO** (initial paint / time-to-interactive on reference low-bandwidth profile) **when** QA measures cold open **then** results meet or exceed SLO *(document targets in performance / NFR spec — not in this AC file)*. |

---

## Acceptance criteria — Urgent alert pinned module (Phase 1)

*Aligned with [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (“Pinned Feed”). **Operational** messages remain **never pinned** per Messaging PRD.*

| ID | Criterion |
|----|-----------|
| PIN-01 | **Given** an **active** urgent alert for the user’s audience **when** they view the business feed **then** a **pinned urgent block** appears **above** all regular business posts. |
| PIN-02 | **Given** the pinned urgent block **when** the user lands on the feed **then** it is **expanded by default** and shows content consistent with Messaging (title/body/minimum fields per urgent spec). |
| PIN-03 | **Given** the user **scrolls down** the feed **when** content moves **then** the pinned block **collapses** per design; user can **re-expand** it *(Messaging: “collapses on scroll, re-expandable”)*. |
| PIN-04 | **Given** the urgent alert is **updated** or **resolved** per Messaging states **when** the user returns to the feed **then** the pinned block reflects **Active (Updated)** / **Resolved** / removal as specified *(coordinate with takeover + acknowledgement flows — out of band for feed list ordering)*. |
| PIN-05 | **Given** **no** active urgent alert **when** user opens feed **then** **no** pinned urgent module is shown; feed matches FD-01 ordering only. |
| PIN-06 | **Given** multiple concurrent active urgencies *(if product allows)* **when** displayed **then** **order and stacking** are defined in design *(if only one global active alert, document that)*. |

---

## Acceptance criteria — Search, filter, sort

| ID | Criterion |
|----|-----------|
| SF-01 | **Given** the user opens search from **top nav** **when** they enter text **then** results rank by weighted order: **(1) Title (2) Description (3) Tags (4) Categories/sub-categories (5) Owner** *(engineering: define tie-breakers and fuzzy vs exact)*. |
| SF-02 | **Given** posts exist **when** the user filters by **Category**, **Sub-category**, and/or **Author** **then** the feed shows **only** matching posts (AND across active filters unless spec says OR). |
| SF-03 | **Given** sort is changed **when** user selects **Latest / Oldest** **then** order updates globally for current result set with **ascending/descending** as specified. |
| SF-04 | **Given** search + filters applied **when** user clears search/filters **then** feed returns to default (**Latest** first, group-scoped). |
| SF-05 | **Given** an **active** urgent pinned module **when** the user uses **search or filter** on the business feed **then** the **pinned urgent block remains visible** above search results *(safety: alert is never hidden because the user is searching)*; post list below reflects search/filter only. |

---

## Acceptance criteria — Post templates & admin actions

| ID | Criterion |
|----|-----------|
| PT-01 | **Given** a post uses a supported template **when** rendered in feed **then** **Image**, **Text**, and **Link** templates display per design *(broken image / long text truncation — see edge cases)*. |
| PT-02 | **Given** an **admin** views a post **when** they open **more (⋯)** **then** **Edit** and **Delete** are available and perform the expected navigation / confirmation flows. |
| PT-03 | **Given** a **non-admin** views a post **when** they open menus **then** **no** admin destructive actions appear. |

---

## Acceptance criteria — Categories & archiving

| ID | Criterion |
|----|-----------|
| CAT-01 | **Given** creating or editing a business post **when** saving **then** **category is required**; save blocked with clear validation if missing. |
| CAT-02 | **Given** Phase 1 **when** choosing category **then** only **business** categories apply; sub-category ∈ {Announcements, Health & Wellness, Safety & Security, HR, Leadership, Learning & Growth, Spotlight, Success Stories, Workplace & Events}. |
| ARC-01 | **Given** a post is older than **3 months** and **not** marked **permanent** **when** the archive job runs **then** it **disappears** from the **employee** main feed and is available **only in admin archive** (and similar **admin-only** surfaces) — **employees do not** browse or search archived business posts. |
| ARC-02 | **Given** a post has been archived **when** **12 months** elapse from archive (or defined clock) **then** it is **deleted** per policy *(align legal/retention with tenant settings)*. |
| ARC-03 | **Given** a post marked **permanent** **when** 3 months pass **then** it **remains** on main feed *(unless product overrides)*. |
| ARC-04 | **Given** a **non-admin** employee **when** they use search/filter **then** **archived** posts **never** appear in results. |
| ARC-05 | **Given** an **admin** **when** they open **admin archive** **then** they can find/manage archived posts per admin UX *(same visibility rules as ARC-01)*. |

---

## Acceptance criteria — Reactions & notifications

| ID | Criterion |
|----|-----------|
| RX-01 | **Given** a post **when** user taps **Like** **then** count increments and user’s like is recorded. |
| RX-02 | **Given** user has liked **when** they tap again **then** like is **removed** (undo) and count decrements correctly under concurrency *(define idempotency)*. |
| RX-03 | **Given** reaction count > 0 **when** user opens **reaction drawer** **then** list shows **Avatar, Name, Designation, Position** for each reactor. |
| NT-01 | **Given** user preference allows new business post alerts **when** a new targeted post publishes **then** user receives **notification**; tapping opens **single post** view. |
| NT-02 | **Given** user disabled this notification type **when** a new post publishes **then** **no** push/in-app notification *(still appears in feed per FD-01)*. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Author identity** | Post owner **removed / deactivated** | Display author as **“Previous Employee”** (per user story). |
| **Admin visibility** | Admin **creates** post for group they’re **not** in | They **do not** see it on **their** feed; can still manage via admin paths if product allows *(confirm)*. |
| **Empty states** | User has **no** group assignments | Show **empty feed** + guidance *(copy from design)* — no crash. |
| **Empty states** | **No** posts for group | Same as above. |
| **Permissions** | User deep-links to post they’re **not** entitled to | **403 / not found** UX; no content leak. |
| **Search** | Query **empty** / whitespace | No bogus results; reset or show hint. |
| **Search** | **SQLi / XSS** payloads in search | Treated as literal text; **no** execution; rate-limit *(security)*. |
| **Pagination** | Duplicate posts across pages | **Not allowed** — cursor must be stable. |
| **Pagination** | New post arrives while paginating | Define: insert at top on refresh vs mid-scroll behaviour. |
| **Time** | User changes timezone / travels | Relative labels remain correct after refresh. |
| **Link post** | **Broken / blocked** URL | Safe error state; no app crash *(define fallback UI)*. |
| **Image post** | **Huge** image / slow network | Skeleton → progressive load; timeout UX. |
| **Archive** | Admin marks **permanent** then toggles off | Re-eligible for 3-month rule from **toggle** or **original publish** — **decide and document**. |
| **Reactions** | Same user rapid double-tap | **Single** like state; no negative counts. |
| **Notifications** | Post later **deleted** before open | Deep link shows **removed** state gracefully. |
| **Urgent + feed** | Active urgent + full takeover (Messaging) | Takeover and pinned feed **both** satisfy Messaging PRD; **order of operations** on cold start documented (e.g. takeover first). |
| **Search + urgent** | User searches while urgent pinned | **Pin stays visible** per **SF-05**; no second duplicate urgent strip; results list is only business posts. |

---

## Resolved product decisions *(was “open questions”)*

| Topic | Decision | Notes |
|--------|-----------|--------|
| **Archived posts** | **Admin-only** | Employees: no archive browsing/search; admins: admin archive section. |
| **Feed load time** | **SLO-driven** | Define numeric targets in **performance / NFR** doc; verify with **PERF-01**. |
| **Pinned on feed** | **In Phase 1** | **Urgent alerts** pinned per [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md). **Not** for operational messages. **No** separate “featured business post” pin in this doc unless PRD adds it. |
| **Social / UGC** | **Separate tab later** | **Social-only** feeds in a **dedicated tab**; **not** interleaved with business feed in Phase 1. |
| **Search + urgent pin** | **Pin always visible** | While search/filter is active, urgent pinned module **stays** on screen (**SF-05**). |

---

## Outstanding (non-blocking or owned elsewhere)

- **Legal / retention:** final delete rules for archived posts after 12 months (tenant policy).  
- **Multi-active urgent:** PIN-06 — single vs multiple concurrent; steerco with Messaging.

---

*Generated as AI-in-PDLC experiment A (Feed). Review and own before sign-off. Updated for archive visibility, SLO, urgent pin, social tab strategy.*
