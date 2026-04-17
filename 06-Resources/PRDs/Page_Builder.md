---
prd_id: page-builder
lifecycle: spec_ready
created_date: 2026-04-17
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Discovery: widget MVP set for low-end devices (OQ-01)
---

# Page Builder — Widget-Driven Content Composition

**Status:** Spec-ready stub — agent-oriented retrofit  
**Target:** Tenant admins authoring durable multi-block pages for Explorer and deep links  
**Estimated Effort:** 80–160 hours agent time (Phase 2 authoring)

---

> **Status: Stub** — not yet sized or designed. Placeholder for Next phase scope.

**Phase:** Next (post-Essential GA).
**Build path:** Core feature within Essential (use [Template_Feature_Essential.md](./Template_Feature_Essential.md) when promoting to full PRD).

**Related PRDs (Phase 1):**
- [Posts.md](./Posts.md) — Posts are single-template content (Text OR Image OR Link OR PDF OR Video OR Form Link). Page Builder extends beyond the single-template limit into multi-widget composition.
- [Feed.md](./Feed.md) — A Page Builder page is referenced from the Feed via a post CTA or message link; it does not appear inline in the Feed.
- [Explorer.md](./Explorer.md) — Explorer is the primary navigation surface for pages; pages are categorised and surfaced via Explorer tiles.
- [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) — Messages can deep-link to a Page as a CTA (e.g. "Read the full safety procedure →")

---

## The Job to Be Done

Authors can compose **durable, multi-widget pages** (stable URLs) for reference content, linked from posts and messages — without forcing everything into single-template posts or static PDFs alone.

**User value:** “Post = broadcast; Page = durable surface in Explorer” (legacy mental model).

---

## Work Packages

### WP-1: Widget model & storage (P0)

**Priority:** P0  
**Dependencies:** [Explorer.md](./Explorer.md) category taxonomy  
**Files:** CMS schema TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Ordered widget list persisted | API contract |
| 1b | Stable slug / URL | Routing tests |

### WP-2: Authoring canvas (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Admin UI TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 2a | Add/reorder widgets | UAT |
| 2b | Mobile preview | Design QA |

### WP-3: Read path & Explorer (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** [Explorer.md](./Explorer.md)  
**Files:** Mobile reader TBD  
**VPS-eligible:** No

### WP-4: Analytics hook (P1)

**Priority:** P1  
**Dependencies:** [Product_Analytics.md](./Product_Analytics.md)  
**Files:** Event emit TBD  
**VPS-eligible:** Yes

**Dependency graph:**

```text
WP-1 ──> WP-2
WP-1 ──> WP-3
WP-3 ──> WP-4
```

---

## Success Scenarios

### Scenario 1: Publish page → Explorer

**Setup:** Page published with category.  
**Action:** User opens Explorer tile.  
**Observable Outcome:** Page listed; deep link works.  
**Success Criteria:** UAT pass.

### Scenario 2: Post links to page

**Setup:** Link post CTA to page URL.  
**Action:** Employee taps.  
**Observable Outcome:** Page opens in app/browser per rules.  
**Success Criteria:** BDD-style check in integration tests.

---

## Satisfaction Metric

**Overall Success:** Page load **< 3s** p95 on reference low-end device (target TBD with OQ-01).

**Measured by:** Performance profiling.

---

## Metrics Strategy

### Events to Track (none in vault)

`analytics_tool: none`. OQ-05: page views separate from post views — add to event catalog later.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Block/widget** metaphor (not WYSIWYG Word-style only).  
- **Group targeting** same model as Posts where applicable.  
- **Tenant admin** authoring for Phase 2 per legacy.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Authoring API | TBD |
| Widget renderers | TBD |
| Media library | Shared with Posts per OQ-06 |

---

## Validation Protocol

```bash
grep -c "Explorer.md" "06-Resources/PRDs/Page_Builder.md"
# PASS: >= 1

grep -c "widget" "06-Resources/PRDs/Page_Builder.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** OQ mobile authoring; localisation model.

---

## Files to Create / Modify

```
# TBD — see legacy authoring flow
```

---

## Out of Scope

- Full **version history** Phase 2 stretch.  
- **Urgent Alert** deep-link to long page — discouraged per legacy.

---

## Detailed product context (legacy)

## Problem hypothesis

The current post model is deliberately simple: one template, one piece of content, one group, one category. This works well for time-sensitive communication — but it's the wrong tool for rich, structured reference content.

An HR policy document, an onboarding guide, a product launch announcement with multiple sections, a safety procedure with images and a checklist — none of these fit cleanly into a single-template post. Today, they're either reduced to a PDF attachment (lose interactivity, formatting, search) or broken into multiple posts (lose structure, hard to maintain).

Page Builder gives authors a **widget-driven page composer**: stack widgets (text, image, video, PDF, CTA, form, …) so **static or dynamic** content can live in **Explorer** at stable URLs. **Discovery will split two notions:** (1) **extend Posts** into richer pages linked from the feed or messages, and/or (2) **ship defined templates** authors use to publish structured pages in Explorer (metadata, categories). Not limited to “article” layout — reference hub, policy packs, onboarding journeys, etc.

Pages should:
- Persist permanently (not time-based)
- Be navigable via Explorer
- Be linkable from posts or messages
- Be maintainable in place (edit a page → all links stay valid)

The mental model: **a Post is a broadcast. A Page is a durable surface in Explorer.**

## Concept

Page Builder creates **Pages** (articles). A page is composed of an ordered sequence of **widgets** — discrete content blocks that the author stacks and arranges. This is the core authoring metaphor: drag, add, reorder widgets. Not a WYSIWYG text editor; not a template picker. A block-based builder.

> Think: Notion blocks, not WordPress editor. Gutenberg spirit, but purpose-built for frontline comms.

### Widget library (proposed, to be confirmed in discovery)

| Widget | Description | Phase |
|--------|-------------|-------|
| **Text** | Rich text block — headings, body, bold/italic, bullet/numbered lists | Phase 2 |
| **Image** | Single image with optional caption; same upload model as Posts (PNG, JPG) | Phase 2 |
| **Video** | Embedded video (Cloudflare-hosted or URL) | Phase 2 |
| **Divider** | Visual separator between sections | Phase 2 |
| **CTA Button** | Labelled button linking to a URL, a post, a message, or another page | Phase 2 |
| **PDF Embed** | Inline PDF viewer (same upload model as Posts) | Phase 2 |
| **Form Link** | [[Wyzetalk]] Forms widget — embed a form prompt inline | Phase 2 |
| **Info Card** | Highlighted callout block (tip, warning, info) with icon + text | Phase 2 |
| **Contact Card** | Name, role, contact info — useful for "Who to call" pages | Phase 2 |
| **Table** | Simple data table (no formulas) | Phase 2.1 |
| **Accordion** | Collapsible sections for FAQs, long policies | Phase 2.1 |
| **Map / Location** | Static map embed or address block for site-based content | Phase 2.1 |

## Pages vs Posts — key distinctions

| Dimension | Post | Page (Page Builder) |
|-----------|------|-------------------|
| Template | Single (Text OR Image OR Link OR…) | Multi-widget, composed |
| Lifecycle | Draft → Published → Archived → Deleted | Draft → Published → Updated in place |
| Feed presence | Appears in Feed at publish | Referenced via post CTA or message link only |
| Explorer | Only permanent posts | All published pages (default) |
| Updates | Edit creates a new version in feed | Edit updates the page at its URL silently |
| Length | Short (one-template constraint) | Unlimited (scroll) |
| URL / deep link | No stable URL | Stable slug (e.g. `/pages/safety-procedure-mining`) |

## Authoring flow (concept)

```
1. Admin → "New Page"
2. Enter title, select category (Explorer category taxonomy)
3. Add widgets: click "+" → pick widget type → fill content
4. Reorder widgets by drag
5. Preview (mobile view)
6. Publish → page is live at stable URL, appears in Explorer under selected category
7. Optional: "Share this page" → create a Post or Message with a CTA linking to the page
```

## How posts and messages reference pages

- **Post:** A "Link" post (existing template) can link to a Page URL with a custom CTA label ("Read the full guide →")
- **Message (Standard):** Standard Message CTA button links to a Page URL
- **Urgent Alert:** Not recommended — Urgent Alerts should not require reading a page to understand the alert

This keeps the post model clean. Posts don't embed pages — they link to them.

## Scope indicators (to be confirmed in discovery)

- **Page creation** — Widget canvas with the library above; drag-reorder; mobile preview
- **Page versioning** — Autosave drafts; no full version history for Phase 2 (stretch)
- **Stable page URL / slug** — Each page has a permanent deep-linkable address
- **Category assignment** — Required; determines which Explorer tile the page appears under
- **Group targeting** — Page visible only to users in specified groups (same model as Posts)
- **Page management dashboard** — List of all pages (Draft, Published) with edit/delete/archive
- **Tenant admin only** — Page creation is an admin capability; employees read-only

## Open questions (pre-discovery)

| # | Question | Owner |
|---|----------|-------|
| OQ-01 | Widget rendering on low-end Android devices and slow connections — what is the minimum viable widget set for first ship? | Engineering + Design |
| OQ-02 | Page search: are pages indexed in the platform-wide search, or only discoverable via Explorer? | Product |
| OQ-03 | Localisation: can a page have multiple language variants, or is one page per language? | Product |
| OQ-04 | Permissions: can a non-admin role (e.g. "Content Manager") create pages without full tenant admin access? | Product |
| OQ-05 | Analytics: should Page views feed into Product Analytics separately from Post views? | Product |
| OQ-06 | Does Page Builder share the same media library as Posts, or is media uploaded per-page independently? | Engineering |
| OQ-07 | What is the authoring experience on mobile (admin on phone)? Full canvas or view-only? | Design |

---

## Acceptance criteria (BDD)

*To be added when promoting to full PRD.*

---

*Promote to full PRD using [Template_Feature_Essential.md](./Template_Feature_Essential.md). See [Next/README.md](./README.md) for merge instructions.*

*Retrofit: agent-prd — 2026-04-17*
