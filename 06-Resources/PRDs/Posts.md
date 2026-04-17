---
prd_id: posts
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
  - Phase 2 templates ↔ Cloudflare / Forms dependencies
---

# Posts

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Authors publishing group-targeted posts (Phase 1–2 templates) with lifecycle, governance, and feed/notifications delivery  
**Estimated Effort:** Ongoing; Phase 2 flesh items

---

> Spec for post templates (core + extended), creation flow, lifecycle, categories, tags, governance, and feed delivery. **Phase 1:** Text, Image, Link. **Phase 2:** PDF, Video, External Form Link (same lifecycle and audience rules as Phase 1).

**Related PRDs:** [Groups.md](./Groups.md) (audience — **a group is mandatory before publish**), [Feed.md](./Feed.md) + [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) (what employees see, archive/search rules), [Notifications.md](./Notifications.md) (publish alerts). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Authors create and manage **posts** with mandatory **audience**, correct **template**, and **lifecycle** (draft → published → archived/deleted) so employees see content in the **Feed** and get **notifications** per toggles.

**User value:** Core comms primitive for Essential; drives Feed and Notification volumes.

---

## Work Packages

### WP-Author: Create & edit (P0)

**Priority:** P0  
**Dependencies:** [Groups.md](./Groups.md)  
**Files:** Authoring UI TBD  
**VPS-eligible:** No

### WP-Templates: Phase 1 + Phase 2 (P0/P1)

**Priority:** P0 core; P1 extended  
**Dependencies:** Media pipelines  
**Files:** Template renderers TBD  
**VPS-eligible:** No

### WP-Lifecycle: Draft / publish / archive (P0)

**Priority:** P0  
**Dependencies:** [Feed.md](./Feed.md) archive rules  
**Files:** TBD  
**VPS-eligible:** Yes

### WP-Notify: Publish alerts (P0)

**Priority:** P0  
**Dependencies:** [Notifications.md](./Notifications.md)  
**Files:** TBD  
**VPS-eligible:** Yes

---

## Success Scenarios

- Cannot publish without audience group (cross-PRD).  
- Phase 2 PDF/Video/Form links render per Feed BDD when enabled.

---

## Satisfaction Metric

**Overall Success:** Posts BDD suite pass **≥ 95%** with Feed NT-* alignment.

**Measured by:** QA regression.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Post-level metrics — [Product_Analytics.md](./Product_Analytics.md).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Group mandatory** before publish.  
- **Permanent** flag for Explorer eligibility ([Explorer.md](./Explorer.md)).  
- **Canonical archive** timestamps with Feed/Product Map.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Posts API | TBD |
| Media (Cloudflare etc.) | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Posts.md"
# PASS: >= 1

grep -c "Groups.md" "06-Resources/PRDs/Posts.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Workflow labels vs Feed archive (Product Map §4.1).

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- **Social/UGC** posts Phase 1 per legacy Non-Goals.

---

## Evidence (discovery)

| ID | Relevance |
|----|-----------|
| [EV-2026-03-001](../Market_and_competitive_signals.md) | Market: HRIS vendors embedding AI assistants (e.g. Workday × Sana). Informs positioning of **admin** comms and AI-assisted workflows relative to desk-centric HR suites — positioning input for Phases 1–2, not a standalone Posts requirement. |

---

# Problem Statement

Organisations need a structured way to create and publish targeted business content to employees. Without a proper post creation and management system, content is inconsistent, hard to manage at scale, and lacks basic governance (drafts, archiving, deletion, notifications). Posts are the core content delivery mechanism — if creating and managing them is difficult or error-prone, business communication suffers.

**Extended formats:** Admins also need to share PDFs (policies, safety), video (training, announcements), and [[Wyzetalk]] Forms links without workarounds — all through the same post model, groups, feed, and governance.

---

# Goals

1. **Enable structured content creation** — Admins create posts using clear templates with enforced metadata (Phase 1: Text, Image, Link; Phase 2: PDF, Video, External Form Link).
1. **Ensure targeted delivery** — Every post must be assigned to a group before publishing.
1. **Provide full lifecycle management** — Draft → Published → Archived → Deleted with clear rules at each stage (all templates).
1. **Prevent content chaos** — Categories, tags, concurrent editing protection, and admin-only governance.
1. **Reuse one infrastructure stack for media** — Phase 2 uploads use the existing Cloudflare pipeline (no parallel upload architecture).

---

# Non-Goals

- **Social / user-generated posts** — Future phase. Phase 1 is admin-published business content only.
- **Scheduled publishing** — Posts publish immediately on action. Scheduling is future scope.
- **Rich text / WYSIWYG editor** — Phase 1 uses simple styled text options.
- **Comments on posts** — Phase 1 supports reactions (likes) only.
- **Phase 2 only:** Multiple attachments per post; in-feed PDF rendering; media libraries / reusable assets; native in-app form rendering; advanced video processing beyond Cloudflare capabilities.

---

# User Stories

**Phase 1 (core templates)**

- As an **admin**, I want to choose a post template (Text, Image, or Link) so that I can create the right content format for my message.
- As an **admin**, I want to assign a group and category before publishing so that the post reaches the right audience and is properly classified.
- As an **admin**, I want to save a post as draft so that I can come back and finish it later.
- As an **admin**, I want to edit a published post's text, tags, and style so that I can correct mistakes without recreating the post.
- As an **admin**, I want to mark a post as permanent so that it stays on the feed indefinitely without auto-archiving.
- As an **admin**, I want to see all posts in a dashboard with status tabs (Draft, Published, Archived, Deleted) so that I can manage content at scale.

**Phase 2 (extended templates)**

- As an **admin**, I want to upload a PDF to a post so that employees can access policies and safety documents from the feed.
- As an **admin**, I want to upload a video to a post so that employees can watch training content inline.
- As an **admin**, I want to link to an external [[Wyzetalk]] Form so that employees can complete surveys or data collection from the feed.
- As an **admin**, I want to give the PDF or form link button a custom label so that employees know what to expect when they tap it.

**Edge cases (all templates)**

- As an **admin**, I want a warning when switching post templates during editing so that I know uploaded media will be lost.
- As an **admin**, I want to change a post's group by setting it to draft first so that I understand the implications.
- As an **admin**, I want concurrent editing protection so that two admins don't overwrite each other's changes.

---

# Requirements

## Must-Have (P0) — Phase 1 templates

### Post Templates (Text, Image, Link)

- [ ] **Text:** Title (60 char limit) + Description (550 char limit). Two styling options: neutral (H2 + body) or themed (H1–H4 + background colour from theme).
- [ ] **Image:** Title + Description + 1 image. Formats: PNG, JPG, SVG, GIF. Upload from photos/device/camera. Landscape mask 1080x600 (1.91:1). Click to zoom. Save full + mobile + desktop thumbnails.
- [ ] **Link:** Title + Description + external link. Opens in device browser (not in-app). Custom button label input.
- [ ] Character limits enforced: exceeding disables publish button and highlights overflow in red.

### Categories & Tags

- [ ] Every post requires a category (enforced). Only "Business" category for Phase 1.
- [ ] Sub-categories: Announcements, Health & Wellness, Safety & Security, HR, Leadership, Learning & Growth, Spotlight, Success Stories, Workplace & Events. One per post.
- [ ] Tags: suggested tags (Recognitions, Policies, Events) + custom. Max 5 per post. Usage count tracked; tags at 0 removed.

### Audience & Publishing

- [ ] Every post must have an assigned group. Cannot publish without group + category.
- [ ] On publish: post appears on feed immediately. Users in group notified (based on toggle).
- [ ] Toggle: "Notify all users when publishing post."
- [ ] To change group on published post: set to draft → change group → republish (moves to top of feed).

### Post Lifecycle

Admin dashboard states below; **when content leaves the employee main feed and how search behaves** are defined in [Feed.md](./Feed.md) and [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) — see [PRD_Product_Map.md](./PRD_Product_Map.md) §4.1 (canonical).

- [ ] **Draft:** delete, archive, publish, edit.
- [ ] **Published:** delete, archive, edit (text/template), set to draft (for group change). Appears on the feed only for users in the assigned group(s); republish after group change moves to top of feed per product rules.
- [ ] **Archived:** post is **off the employee main feed** per Feed policy (**3 months** unless **permanent**); remains in **admin archive** surfaces. Restore flows (e.g. to draft) align with admin UX and Feed AC.
- [ ] **Deleted:** admin soft-delete with **recoverable** window (**30 days** to restore to draft unless superseded by tenant/legal policy). Long-term purge of archived content (**12 months** from archive, where applicable) is specified in Feed / Feed AC / tenant policy.
- [ ] Switching post template during edit loses uploaded media — warning displayed.

### Post Dashboard

- [ ] Display: Title, Owner, Template, Category, Sub-categories, Date, Permanent flag, Status.
- [ ] Tabs: All, Draft, Published, Archived, Deleted.
- [ ] Multi-select: bulk archive, restore, delete.

### Governance

- [ ] Concurrent editing protection: lock and release flow when another admin is editing.
- [ ] Admin-only post creation and editing. End users view via feed only.

## Phase 2 (P2) — Extended templates: PDF, Video, External Form Link

*Same group, category, lifecycle, dashboard, and governance rules as Phase 1 unless noted below.*

### General upload rules (PDF & Video)

- [ ] All uploads use existing Cloudflare upload and CDN delivery.
- [ ] One (1) media asset per post. Assets owned by the post, not reusable.
- [ ] Upload progress indicator. Publishing blocked until upload completes. Errors consistent with Image Post patterns.

### PDF template

- [ ] Admin uploads one PDF file (.pdf). File size per Cloudflare config.
- [ ] Admin sets a custom label for the PDF button (file name not shown).
- [ ] Tapping opens in device's default PDF viewer. Delivered via CDN.

### Video template

- [ ] Admin uploads one video file. Formats per Cloudflare config. File size per Cloudflare config.
- [ ] Video displayed inline in feed. Playback controls + fullscreen. Delivered via CDN.

### External Form Link (extends Link pattern)

- [ ] [[Wyzetalk]] Form functionality toggled on per tenant. Admin enters a valid Form ID in the Link Post widget.
- [ ] Custom button label input. Optional helper text: "External Form."
- [ ] Link opens in device browser. No in-app rendering. Form availability managed externally.
- [ ] Cannot publish if Form ID is missing. "Test link" button provided.

### Lifecycle, governance, analytics (Phase 2)

- [ ] Media follows post lifecycle: Draft → Published → Archived → Deleted. Archived posts retain media.
- [ ] External form link config removed when post is deleted. Not stored as CDN assets where not applicable.
- [ ] Switching post template removes existing media/link with confirmation warning (same as Phase 1).
- [ ] Only admin/owner can create, edit, upload. End users view via feed only.
- [ ] Existing lock and release flow for concurrent editing.
- [ ] Link / CTA analytics: track click count (align with existing Link post behaviour).

### Phase 2 — Nice-to-have (Flesh)

- [ ] Video thumbnail preview in the post dashboard.
- [ ] PDF page count displayed before download.

## Nice-to-Have (P1) — Cross-phase

- [ ] Notification toggle for "Notify on update" (separate from publish notification).
- [ ] Post scheduling (publish at a future date/time).

## Future Considerations (beyond Phase 2)

- [ ] Social / user-generated content.
- [ ] Rich text / WYSIWYG editing.
- [ ] Comments and threaded discussions.

---

# Success Metrics

**Leading:**

- Posts created per tenant per week (target: >3 for active tenants)
- % of posts published with targeted groups vs "Everyone" (target: >40%)
- Draft → Published conversion rate (target: >80%)
- *(Phase 2)* PDF and Video post creation rate per tenant per month (adoption)
- *(Phase 2)* External form link click-through rate

**Lagging:**

- Employee feed engagement rate (views + reactions per post)
- Admin satisfaction with post creation flow (survey)
- Reduction in content-related support tickets
- *(Phase 2)* Reduction in out-of-platform document sharing (qualitative)
- *(Phase 2)* Engagement with PDF/Video posts vs Text/Image (comparison)

---

# Open Questions

- **[Product]** Should the **feed archive (3 months)** / **purge (12 months)** / **admin soft-delete (30 days)** windows be configurable per tenant? (See [PRD_Product_Map.md](./PRD_Product_Map.md) §4.1 for current canonical draft.)
- **[Engineering]** What is the max image file size? Is there server-side compression?
- **[Design]** What does the themed text styling look like — full background colour or accent bar?
- **[Product]** When a post is republished after group change, should previously notified users be re-notified?
- **[Engineering / Phase 2]** Does the existing Cloudflare pipeline support non-image uploads (PDF, Video) without modification?
- **[Engineering / Phase 2]** What is the max video file size? Is there server-side transcoding?
- **[Product / Phase 2]** Should Video posts support captions/subtitles?
- **[Product / Phase 2]** Should PDF posts support a preview thumbnail (first page)?

---

# Timeline Considerations

- **Dependency:** [Groups](./Groups.md) must exist — **posts are meaningless for targeting without a resolved audience** (saved group, once-off group, or system “Everyone”).
- **Dependency:** [Feed](./Feed.md) (employee display surface) should ship in the same release train as publish, or immediately after.
- **Dependency:** [Notifications](./Notifications.md) + [communication_service](./communication_service.md) for publish/update alerts (channel + preferences).
- **Suggested phasing — Phase 1:** Text + Image templates + lifecycle (Phase 1a) → Link template + dashboard + governance (Phase 1b).
- **Suggested phasing — Phase 2:** PDF template (2a) → Video template (2b) → External Form Link (2c, tenant toggle required). **Dependency:** Cloudflare pipeline supports non-image files as required.

---

## Acceptance criteria (BDD)

**Source PRD:** [Posts.md](./Posts.md)  
**Related:** [Groups.md](./Groups.md) (group **mandatory** before publish), [Feed.md](./Feed.md) + [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) (employee visibility, archive, search — **canonical**), [Notifications.md](./Notifications.md) (notify on publish).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1, §4.1  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Phase 1 templates:** Text, Image, Link — limits, categories, tags, dashboard, lifecycle, concurrent edit lock.  
- **Phase 2:** PDF, Video, External Form Link — same governance unless noted.  
- **Employee-facing feed/search/archive:** defer to **[Feed.md](./Feed.md#acceptance-criteria-bdd)** (avoid duplicating ARC/FD rules here).

---

## Acceptance criteria — Templates (Phase 1)

| ID | Criterion |
|----|-----------|
| PO-01 | **Text:** Title ≤60 chars, Description ≤550; styles **neutral** vs **themed**; overflow blocks publish with red highlight. |
| PO-02 | **Image:** Title + description + one image; formats PNG/JPG/SVG/GIF; mask **1080×600**; zoom; thumbnails generated. |
| PO-03 | **Link:** Title + description + URL; opens **device browser**; custom button label. |

---

## Acceptance criteria — Categories & tags

| ID | Criterion |
|----|-----------|
| PO-04 | **Given** save/publish **when** category missing **then** blocked; **Business** only Phase 1; one **sub-category** from allowed list. |
| PO-05 | **Given** tags **when** editing **then** max **5**; suggested + custom; zero-use tags removed. |

---

## Acceptance criteria — Audience & publish

| ID | Criterion |
|----|-----------|
| PO-06 | **Given** publish clicked **when** **no** group or **no** category **then** publish **disabled** with validation. |
| PO-07 | **Given** publish **when** success **then** post on feed **immediately** for group members; **notify** if toggle on (see [Feed.md — BDD](./Feed.md#acceptance-criteria-bdd) **NT-01 / NT-02**). |
| PO-08 | **Given** change group on **published** post **when** admin acts **then** must **draft** → change group → **republish**; republish moves to **top** per product rules. |

---

## Acceptance criteria — Lifecycle & dashboard

| ID | Criterion |
|----|-----------|
| PO-09 | **Given** admin dashboard **when** viewing **then** columns include Title, Owner, Template, Category, Sub-category, Date, Permanent, Status; tabs All/Draft/Published/Archived/Deleted. |
| PO-10 | **Given** **Archived** / **Deleted** **when** transitions occur **then** employee feed/search behaviour matches **Feed AC** and **PRD_Product_Map §4.1**. |
| PO-11 | **Given** **soft delete** **when** within **30 days** **then** restore to draft available unless superseded by policy. |
| PO-12 | **Given** multi-select **when** bulk actions **then** bulk archive / restore / delete per PRD. |

---

## Acceptance criteria — Governance

| ID | Criterion |
|----|-----------|
| PO-13 | **Given** two admins **when** concurrent edit **then** lock / request / release flow prevents silent overwrite. |
| PO-14 | **Given** template switch **when** media would be lost **then** **warning** before confirm. |
| PO-15 | **Given** non-admin user **when** accessing app **then** **no** post creation — view feed only. |

---

## Phase 2 — Short pointers

| ID | Criterion |
|----|-----------|
| P2-01 | PDF/Video: **one** asset, Cloudflare pipeline, publish blocked until upload complete. |
| P2-02 | External Form: tenant feature flag + Form ID validation + “Test link”. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Notify** | Republish after group change | Re-notify previous users? — **open in PRD**. |
| **Permanent** | Toggle off | Archive clock start — align Feed AC. |
| **Image** | CDN failure | Error state consistent with Feed edge cases. |

---

## Outstanding

- Tenant-configurable archive/purge windows — **Product_Map §4.1**.  
- Max image size / compression — engineering.  
- Phase 2 Cloudflare limits for PDF/video.

---

*Admin authoring AC; **employee** feed AC lives in [Feed.md](./Feed.md#acceptance-criteria-bdd).*
