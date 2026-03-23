# Posts — Acceptance criteria & edge cases

**Source PRD:** [Posts.md](./Posts.md)  
**Related:** [Groups.md](./Groups.md) (group **mandatory** before publish), [Feed.md](./Feed.md) + [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) (employee visibility, archive, search — **canonical**), [Notifications.md](./Notifications.md) (notify on publish).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md) §1, §4.1  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Phase 1 templates:** Text, Image, Link — limits, categories, tags, dashboard, lifecycle, concurrent edit lock.  
- **Phase 2:** PDF, Video, External Form Link — same governance unless noted.  
- **Employee-facing feed/search/archive:** defer to **Feed_acceptance_criteria.md** (avoid duplicating ARC/FD rules here).

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
| PO-07 | **Given** publish **when** success **then** post on feed **immediately** for group members; **notify** if toggle on (see [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) **NT-01 / NT-02**). |
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

*Admin authoring AC; **employee** feed AC lives in Feed_acceptance_criteria.*
