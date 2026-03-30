# Feed

---

> Lighter spec derived from the Feed discovery document. Covers feed display, search/filter/sort, post templates, reactions, notifications, and archiving.

**Related PRDs:** [Groups.md](./Groups.md) (**visibility = group membership**; posts are irrelevant to a user if they are not in the target audience), [Posts.md](./Posts.md) (authoring, lifecycle, all templates including Phase 2 PDF/Video/form link), [Notifications.md](./Notifications.md) (new post alerts), [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (pinned urgent module on this surface). **QA / AC:** [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md). **Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md).

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

- [ ] Auto-archive after 3 months unless marked permanent. Archived posts removed from **employee** main feed → admin archive section. Long-term delete (**1 year** from archive, subject to tenant/legal policy) per [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) (ARC-02). **Canonical cross-PRD summary:** [PRD_Product_Map.md](../PRD_Product_Map.md) §4.1.
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
