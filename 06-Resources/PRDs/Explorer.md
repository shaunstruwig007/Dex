---
prd_id: explorer
lifecycle: spec_ready
created_date: 2026-03-30
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - April discovery: confirm priority vs WhatsApp / AI / Remote App
  - Tile analytics events when Product Analytics ships
---

# Explorer — Category-Based Content Navigation

**Status:** Spec-ready stub — agent-oriented retrofit  
**Target:** Frontline employees browsing **durable reference content** by category (complement to chronological Feed)  
**Estimated Effort:** 64–120 hours agent time (post-discovery)

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.
>
> ⚠️ **Scope under review (2026-03-30):** Explorer was listed for April discovery workshops but its relative priority vs WhatsApp, AI Assistant, and Remote App Extensions has not been confirmed. Scope and timing to be validated in discovery week 2–3 April. Explorer is NOT in the top-6 confirmed priority order from the 2026-03-30 leadership session.

**Phase:** Next (post-Essential GA).
**Build path:** Core feature within Essential (use [Template_Feature_Essential.md](./Template_Feature_Essential.md) when promoting to full PRD).

*Updated: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

**Related PRDs (Phase 1):**
- [Posts.md](./Posts.md) — Explorer uses the same business category taxonomy as post creation; content displayed in Explorer is authored via Posts
- [Feed.md](./Feed.md) — Feed is chronological (time-based); Explorer is categorical (topic-based, permanent) — they are complementary surfaces
- [Groups.md](./Groups.md) — Explorer tiles may be group-scoped (show only categories relevant to the user's groups)
- [Page_Builder.md](./Page_Builder.md) — Explorer tiles are the primary entry point into Page Builder pages

---

## The Job to Be Done

Employees can **browse permanent, category-organised reference content** (policies, onboarding, safety) in a stable hub — separate from the time-ordered Feed — so critical information stays findable.

**User value:** Feed = “newspaper”; Explorer = “filing cabinet” (see legacy hypothesis).

---

## Work Packages

### WP-1: Information architecture & taxonomy (P0)

**Priority:** P0  
**Dependencies:** [Posts.md](./Posts.md) category + **Permanent** flag; [Page_Builder.md](./Page_Builder.md) pages  
**Files:** Spec TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Only permanent posts + pages surface | Rules in spec |
| 1b | Category → tile mapping | Tile list agreed |

### WP-2: Explorer home & category views (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1; [Theming.md](./Theming.md)  
**Files:** Mobile: TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 2a | Tile grid/list | UX prototype |
| 2b | Category drill-down lists Pages + permanent posts | UAT |

### WP-3: Search & group scoping (P1)

**Priority:** P1  
**Dependencies:** WP-2; [Groups.md](./Groups.md)  
**Files:** Search index TBD  
**VPS-eligible:** Yes

### WP-4: Pinning & tenant customise (P2)

**Priority:** P2  
**Dependencies:** WP-2  
**Files:** Admin TBD  
**VPS-eligible:** No

**Dependency graph:**

```text
WP-1 ──> WP-2 ──> WP-3
         WP-2 ──> WP-4
```

---

## Success Scenarios

### Scenario 1: Open tile → see permanent content

**Setup:** Published permanent post + page in category.  
**Action:** User opens Explorer → tile → list.  
**Observable Outcome:** Correct items ordered (Pages first rule per legacy).  
**Success Criteria:** UAT passes for one category.

### Scenario 2: Non-permanent post excluded

**Setup:** Ephemeral post published.  
**Action:** Open Explorer.  
**Observable Outcome:** Post not listed.  
**Success Criteria:** Automated test or BDD row.

---

## Satisfaction Metric

**Overall Success:** 100% of seeded permanent items appear in expected Explorer category in UAT.

**Measured by:** QA checklist + BDD pass rate.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Open question: tile taps / Explorer views → [Product_Analytics.md](./Product_Analytics.md) when live.

### Business Outcome Mapping

Improves **reference content discovery** for frontline programmes (safety, HR).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Complements** [Feed.md](./Feed.md); does not replace it.  
- **Permanent** flag and Page Builder pages drive inclusion (see legacy).  
- **Group-aware** tiles — validate in discovery.

---

## Technical Blueprint

### System Integration Map

```text
Posts_Permanent --> Explorer_index --> mobile_Explorer_UI
Page_Builder --> Explorer_index
Groups --> filter_visible_tiles
```

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Mobile | TBD |
| Search index | TBD |

---

## Validation Protocol

```bash
grep -c "Feed.md" "06-Resources/PRDs/Explorer.md"
# PASS: >= 1

grep -c "Permanent" "06-Resources/PRDs/Explorer.md"
# PASS: >= 1
```

**Manual:** UX review on low-end Android (OQ from Page Builder applies analogously).

---

## Success Rate Target

**2 of 2** grep checks on commit.

---

## Notes for Agent Implementation

**Scout priorities:** Feed category filter overlap question (legacy Open questions).  
**Soldier review:** Multi-language tenants (Open question).

---

## Files to Create

```
# TBD
services/explorer-index/README.md
```

## Files to Modify

```
# TBD — mobile nav, Posts flags
```

---

## Out of Scope

- Replacing Feed category filter entirely (open question — discovery).  
- Custom tiles Phase 2 stretch per legacy.

---

## Detailed product context (legacy)

## Problem hypothesis

The Feed is a good surface for time-sensitive content (announcements, alerts, updates) but a poor surface for permanent reference content. Safety procedures, HR policies, onboarding guides, and benefit information get buried by newer posts and disappear from view.

Frontline employees need a stable, navigable "content hub" where they can find information by topic — not by date. Explorer is that surface: a tiled, category-organised navigation layer that gives permanent content a permanent home.

Think of the Feed as a newspaper (today's news) and Explorer as a filing cabinet (reference material by topic). Both are necessary. Neither replaces the other.

## Concept

Explorer is a **tiled menu** surface, accessible from the main navigation. Each tile represents a **business category** drawn from the existing post taxonomy. Tapping a tile opens a filtered view of all permanent/static content in that category.

### Business categories (from post creation taxonomy)

Phase 1 post sub-categories become Explorer top-level tiles:

| Tile | Icon (suggestion) | Content types |
|------|------------------|--------------|
| Announcements | 📢 | Text, Image, Link posts marked permanent |
| Health & Wellness | 💚 | Posts, Pages (page builder articles) |
| Safety & Security | 🦺 | Posts, Pages — safety procedures, emergency contacts |
| HR | 👤 | Posts, Pages — policies, leave info, payslips link |
| Leadership | 🏆 | Posts, Pages — company vision, leadership messages |
| Learning & Growth | 📚 | Posts, Pages, Video posts — training content |
| Spotlight | ⭐ | Posts — recognition, employee stories |
| Success Stories | 🎯 | Posts, Pages |
| Workplace & Events | 🏢 | Posts, Pages — site info, upcoming events |

Custom tiles (tenant-configured) — stretch goal for Phase 2 of Explorer.

## How content appears in Explorer

- **Posts** appear in Explorer when: (a) the post is published with a category, AND (b) the post is marked as **Permanent** (existing flag in Posts PRD, line 84+107)
- **Pages** (from Page Builder) appear in Explorer by default — pages are inherently permanent
- **Non-permanent posts** do NOT appear in Explorer — they live only in the Feed
- Content is ordered within each tile: Pages pinned first, then Posts sorted by publish date (newest first)

This means: authoring a permanent post in the current Posts flow automatically populates Explorer. No separate authoring step.

## Scope indicators (to be confirmed in discovery)

- **Explorer home** — Grid or list of category tiles; tenant-branded, respect theming
- **Category view** — Content list when a tile is tapped; shows Pages + permanent Posts
- **Search within Explorer** — Find content by keyword across all Explorer categories
- **Group-scoped tiles** — Only show categories where the user's groups have published content
- **Empty state** — Friendly "no content yet" when a category has no permanent content
- **Pinning** — Tenant admin can pin specific content to the top of a category
- **Tenant tile customisation** — Show/hide categories; custom label (stretch)

## Relationship to Page Builder

Explorer is the **navigation surface**. Page Builder creates the **content**. They are distinct but deeply linked:

```
Page Builder  →  creates a Page (article)
Explorer      →  displays that Page under its category tile
Post / Message →  can deep-link to that Page as a CTA
```

A tenant can build an "Onboarding Guide" page in Page Builder → categorise it under HR → it appears in the HR Explorer tile → and link to it from a welcome message.

## Open questions (pre-discovery)

- Does Explorer replace or extend the current category/sub-category filter in the Feed? Or is it entirely separate?
- Tile layout: grid (icon + label) vs list (label + description + post count)?
- Do all tenants get Explorer by default, or is it a tenant feature toggle?
- How does Explorer handle multi-language tenants (e.g. English + Afrikaans + Zulu)?
- Are Explorer tiles group-aware? (E.g. a Safety tile only visible to users in the Safety group)
- Analytics: should Explorer page views / tile taps feed into Product Analytics?

---

## Priority context (2026-03-30)

The confirmed post-GA priority order from the 2026-03-30 leadership session is:

1. WhatsApp Smart HR — #1
2. AI Assistant (FAQ/HR) — #2
3. Employee Chat — #3
4. Remote App Extensions — #4
5. Product Analytics — #5
6. Scheduled Content — #6

**Update 2026-04-13 (Leon — sales + board):** the **numbered board stack** is now **#1 WhatsApp** → **#2 AI** → **#3 P2P chat** → **#4 Remote App extensions** → **#5 FloatPays** → **#6 Forms**; **Product Analytics** and **Scheduled Content** are **not** in that six for the **current development phase**. See [Next/README.md](./README.md) and [Wyzetalk_Essential_Launch.md](../../../04-Projects/Wyzetalk_Essential_Launch.md).

Explorer was mentioned for April discovery workshops but was **not placed in the confirmed priority order**. Its scope and priority relative to the above features is to be confirmed during discovery week 2–3 April.

---

## Acceptance criteria (BDD)

*To be added when promoting to full PRD.*

---

*Promote to full PRD using [Template_Feature_Essential.md](./Template_Feature_Essential.md). Confirm scope/priority at April discovery workshop. See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17*
