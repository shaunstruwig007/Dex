# Explorer — Category-Based Content Navigation

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.

**Phase:** Next (post-Essential GA).
**Build path:** Core feature within Essential (use [Template_Feature_Essential.md](./Template_Feature_Essential.md) when promoting to full PRD).

**Related PRDs (Phase 1):**
- [Posts.md](../Current/Posts.md) — Explorer uses the same business category taxonomy as post creation; content displayed in Explorer is authored via Posts
- [Feed.md](../Current/Feed.md) — Feed is chronological (time-based); Explorer is categorical (topic-based, permanent) — they are complementary surfaces
- [Groups.md](../Current/Groups.md) — Explorer tiles may be group-scoped (show only categories relevant to the user's groups)
- [Page_Builder.md](./Page_Builder.md) — Explorer tiles are the primary entry point into Page Builder pages

---

## Problem hypothesis

The Feed is a good surface for time-sensitive content (announcements, alerts, updates) but a poor surface for permanent reference content. Safety procedures, HR policies, onboarding guides, and benefit information get buried by newer posts and disappear from view.

Frontline employees need a stable, navigable "content hub" where they can find information by topic — not by date. Explorer is that surface: a tiled, category-organised navigation layer that gives permanent content a permanent home.

Think of the Feed as a newspaper (today's news) and Explorer as a filing cabinet (reference material by topic). Both are necessary. Neither replaces the other.

---

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

---

## How content appears in Explorer

- **Posts** appear in Explorer when: (a) the post is published with a category, AND (b) the post is marked as **Permanent** (existing flag in Posts PRD, line 84+107)
- **Pages** (from Page Builder) appear in Explorer by default — pages are inherently permanent
- **Non-permanent posts** do NOT appear in Explorer — they live only in the Feed
- Content is ordered within each tile: Pages pinned first, then Posts sorted by publish date (newest first)

This means: authoring a permanent post in the current Posts flow automatically populates Explorer. No separate authoring step.

---

## Scope indicators (to be confirmed in discovery)

- **Explorer home** — Grid or list of category tiles; tenant-branded, respect theming
- **Category view** — Content list when a tile is tapped; shows Pages + permanent Posts
- **Search within Explorer** — Find content by keyword across all Explorer categories
- **Group-scoped tiles** — Only show categories where the user's groups have published content
- **Empty state** — Friendly "no content yet" when a category has no permanent content
- **Pinning** — Tenant admin can pin specific content to the top of a category
- **Tenant tile customisation** — Show/hide categories; custom label (stretch)

---

## Relationship to Page Builder

Explorer is the **navigation surface**. Page Builder creates the **content**. They are distinct but deeply linked:

```
Page Builder  →  creates a Page (article)
Explorer      →  displays that Page under its category tile
Post / Message →  can deep-link to that Page as a CTA
```

A tenant can build an "Onboarding Guide" page in Page Builder → categorise it under HR → it appears in the HR Explorer tile → and link to it from a welcome message.

---

## Open questions (pre-discovery)

- Does Explorer replace or extend the current category/sub-category filter in the Feed? Or is it entirely separate?
- Tile layout: grid (icon + label) vs list (label + description + post count)?
- Do all tenants get Explorer by default, or is it a tenant feature toggle?
- How does Explorer handle multi-language tenants (e.g. English + Afrikaans + Zulu)?
- Are Explorer tiles group-aware? (E.g. a Safety tile only visible to users in the Safety group)
- Analytics: should Explorer page views / tile taps feed into Product Analytics?

---

*Promote to full PRD using [Template_Feature_Essential.md](./Template_Feature_Essential.md). See [Next/README.md](./README.md) for merge instructions.*
