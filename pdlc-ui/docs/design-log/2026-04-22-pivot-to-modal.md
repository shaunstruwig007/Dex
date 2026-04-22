# 2026-04-22 — Card details: side panel → URL-addressable Initiative Modal

**Status:** Accepted (2026-04-22) · supersedes [`pdlc-ui/docs/design/board-layout.md`](../design/board-layout.md) §5 "Side panel".
**Companion docs:** [`plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md`](../../../plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md) · [ADR-0003 (DnD shape + HTML5 ban)](../adr/0003-dnd-shape-and-html5-ban.md).

## Context

The board-layout spec drafted 2026-04-21 (before S3A.1 shipped) specified a **non-modal right-rail drawer** (`role="complementary"`, 320/420/600px resizable, drag auto-collapse to 80px rail) as the S3A.2 surface for per-initiative details. Its explicit reasoning was:

> _"A modal blocks the board. The user explicitly asked to keep columns interactive while reading card context. A `complementary` landmark is the honest semantic — and the drag auto-collapse resolves the column-stealing tension at the exact moment it would bite."_

Two things changed between the draft and S3A.1's merge:

1. **The card face grew content.** The inline `<details>` BriefPanel, the ellipsis actions menu, and the stage badges made the card face dense; users said they lost context when they expanded details on the card.
2. **The user asked for a single housing surface** for every per-initiative artefact — not just the brief, but the idea text, brief, discovery output, spec, attached Figma / Claude Design files, and an activity feed. A 420px side panel couldn't carry that surface area without becoming a second board.

S3A.1 also shipped a real-user defect (HTML5 `draggable` preempted dnd-kit's `PointerSensor`; pass-2 correction in the merge PR) that revealed how much board-context protection really costs at the implementation layer. The drag-auto-collapse behaviour in the original §5 was non-trivial to get right under a constrained test budget.

## What changed

**S3A.2 pivots from the side panel to a URL-addressable Initiative Modal:**

- **URL-addressable** via Next.js parallel + intercepting routes (`/ideas/@modal/(.)initiative/[id]` + `/initiative/[id]` full-page pair). Refresh-safe, shareable.
- **~70vw × ~85vh** with a blurred black overlay (`bg-black/70 backdrop-blur-sm`). Big enough to hold six tabs of per-initiative content without feeling cramped.
- **Six lifecycle-gated tabs:** Idea · Brief · Discovery · Spec · Design · Activity. Grey dot = pending, lock icon = locked.
- **Card click opens the modal.** The ellipsis menu shrinks to `Move to…`, `Park`, `Delete` — `Edit` moves inside the Idea tab.
- **Content hub:** design assets (Figma / Claude Design) attach to the Design tab; activity feed reads the existing `events` table; chat-style brief wizard lives inside the Brief tab's empty state.

Full deliverable list in the S3A.2 seed.

## Trade-off we accepted

| Side panel (original §5)                                     | Modal (new §5)                                                  |
| ------------------------------------------------------------ | --------------------------------------------------------------- |
| Board stays live and interactive while reading card details. | Board is blocked while the modal is open.                       |
| `role="complementary"` — honest non-modal semantic.          | `role="dialog"` — standard focus trap, ESC + overlay dismissal. |
| 320–600px surface — tight for multi-artefact content.        | ~70vw × ~85vh — room for six tabs' worth of content.            |
| Not URL-addressable without bespoke state plumbing.          | URL-addressable for free via intercepting routes.               |
| Drag auto-collapse needed to avoid stealing columns on drag. | No drag conflict — the modal closes on ESC or overlay click.    |
| Unique implementation — no off-the-shelf primitive.          | Existing shadcn `Dialog` wrapper + Next.js routing primitives.  |

We accepted losing board-liveness in exchange for:

1. A **single content hub** the user explicitly asked for.
2. **URL-addressability** (deep-linkable, meeting-prep-friendly).
3. **Smaller implementation surface** — shadcn `Dialog` + Next.js intercepting routes are both primitives the team already operates; the side panel's drag auto-collapse + per-user width persistence + resize-edge affordance were non-trivial custom work.
4. Fast dismissal (ESC, overlay click, back button) — the modal isn't meant to be lived-in; it's opened, consumed, and closed.

## Consequences

- [`pdlc-ui/docs/design/board-layout.md`](../design/board-layout.md) §5 rewritten as "Initiative Modal".
- §6 "Focused column" (still intended) **deferred from S3A.2 to S3A.3** to keep the S3A.2 surface-area manageable (modal + chat wizard + within-lane reorder is already three non-trivial deliverables).
- Old S3A.2 seed [`plans/PDLC_UI/seeds/s3a2-discovery-automation.md`](../../../plans/PDLC_UI/seeds/s3a2-discovery-automation.md) superseded; moved under `seeds/_superseded/` with a front-matter note.
- Sprint backlog §S3A.2 rewritten; a new §S3A.3 block carries the automation-surface scope (prefill, tick-driven kickoff, `initiative_jobs` table, focused-column mode, edit-existing-brief).

## Re-open triggers

If the following turn out true in the S3A.2 build, **consider pulling the side-panel shape back** for a future revision:

- Users complain the modal blocks the board too aggressively for scan-while-drafting workflows.
- The activity feed + design attachments grow to need a live peek-back-at-board behaviour the modal can't satisfy.
- The tab shell stays narrow enough (e.g. Activity alone, or a single-column Spec view) that the modal feels oversized.

In that case, revive the `role="complementary"` drawer from §5-original as a **view toggle inside the modal** — not as a replacement for the modal itself. The URL-addressability and tab shell stay; only the chrome changes.

## Owner

PM (interim). Next revisit: after S3A.2 ships and a real user has lived in the modal for a sprint.
