# Board layout — Chief Designer spec v0.1

**Status:** Draft for S3A.1 / S3A.2 implementation (2026-04-21; revised 2026-04-22 — §5 pivoted from side panel to URL-addressable Initiative Modal, §6 deferred to S3A.3).
**Owner:** PM (interim) · [`plans/PDLC_UI/seeds/s3a1-brief-wizard-interactions.md`](../../../plans/PDLC_UI/seeds/s3a1-brief-wizard-interactions.md) + [`plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md`](../../../plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md).
**Design-log:** [`pdlc-ui/docs/design-log/2026-04-22-pivot-to-modal.md`](../design-log/2026-04-22-pivot-to-modal.md) preserves the original §5 side-panel reasoning and the trade-off that led to the modal.
**Companion:** [`plans/PDLC_UI/tech-stack.md § 3`](../../../plans/PDLC_UI/tech-stack.md#3-ui-primitives-r18) UI primitives · [`pdlc-ui/src/styles/tokens.css`](../../src/styles/tokens.css) · [`pdlc-ui/docs/ui-notes.md`](../ui-notes.md).

**Read before implementing:** [`.claude/skills/anthropic-frontend-design/SKILL.md`](../../../.claude/skills/anthropic-frontend-design/SKILL.md).

---

## Problem this spec solves

At S3 the board uses narrow fixed-width columns, a global app header eats vertical space, and card details open as an inline `<details>` accordion. A 40vw side panel pattern would steal columns exactly when the user needs them (especially during drag). Users complain they scroll constantly and lose context when they open a card.

**Constraints (from the CPO/CTO review):**

- Use more of the viewport — but not edge-to-edge (keep breathing room around the grid).
- Preserve board context when card details are open (no full-screen take-over).
- Don't lose the S3 craft already shipped (brief wizard, atomic save, gate).
- All colours via `tokens.css` (R18); 2px focus ring on every interactive; keyboard nav end-to-end.

---

## 1. Chrome-light board shell

When on the board route, the global app shell collapses to a **sticky 48px top bar**: app title · route crumbs · filters · **density toggle** · **parked-rail toggle**. Everything below belongs to the board.

- The **board itself** is the scroll container: `height: calc(100vh - 48px)`; no page-level scrollbar when the board is visible.
- 16–24px gutters left/right of the grid — the grid is never edge-to-edge. Drag-over highlights have somewhere to live; content has breath.
- No footer on the board route.

**Why:** reclaims ~80–120px of vertical real estate vs the current page shell and lets column headers stick _inside_ the board rather than fighting the page chrome.

---

## 2. Elastic main lanes

Seven main lanes (`idea` · `discovery` · `design` · `spec_ready` · `develop` · `uat` · `deployed`) use `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` within the board's content area.

- **Natural floor:** 7 × 280px = 1960px. Below this width, the main grid horizontal-scrolls within the board container (not the page).
- **Above the floor:** lanes stretch equally to fill available width. On a typical 1440px laptop (~1350px after gutters + rail) this gives 5 lanes visible at ~270px each with graceful horizontal scroll for the remaining 2 — a meaningful improvement over today's narrow fixed columns.
- **Column header:** sticky within the column, not within the page.

**Why not 7 fixed columns:** fixed-280 means 5 visible on 1440px and cards are 280px regardless of viewport. Elastic keeps the 5-visible default but lets cards grow to meaningfully wider widths on 1920px+ monitors without a layout rewrite.

---

## 3. Parked lane → right-edge rail

`parked` moves **out of the main 7-lane grid** into a dedicated **right-edge rail**:

- Collapsed (default on first load): **40px** wide · vertical "Parked (N)" label · click to expand.
- Expanded: **280px** wide · parked cards render with their intent + reason, un-park affordance, same card primitives as the main lanes.
- State persists per user (`localStorage`).

**Why:** reclaims one column slot from the main grid in the common case where no-one is actively scanning parked cards. The S2 "Show parked" toggle header action becomes the rail's collapse/expand control; the `ParkedTransitionDialog` contract (intent + reason) is unchanged.

---

## 4. Card density toggle

Three modes in the sticky bar. Implemented as a CSS-var swap on a data-attr at the board root (no per-component branches):

| Mode                        | Row height | Shows                                                      | Fits per 900px column |
| --------------------------- | ---------- | ---------------------------------------------------------- | --------------------- |
| **Compact**                 | ~32px      | Title + stage badge                                        | 20+                   |
| **Comfortable** _(default)_ | ~72px      | Title + 1-line body preview + stage badge + lifecycle chip | ~11                   |
| **Detailed**                | ~120px     | Comfortable + brief/discovery chips + last-event time      | ~7                    |

**Persistence:** `localStorage` keyed by user (or anonymous — Bar A). Default = Comfortable.
**Scope:** the toggle changes _card content density_, not column widths. Column widths are governed by §2.

**CSS surface area:**

```css
:root[data-board-density="compact"] {
  --card-py: 6px;
  --card-gap: 8px;
  --card-lines: 1;
}
:root[data-board-density="comfortable"] {
  --card-py: 10px;
  --card-gap: 12px;
  --card-lines: 2;
}
:root[data-board-density="detailed"] {
  --card-py: 14px;
  --card-gap: 16px;
  --card-lines: 4;
}
```

Exact values belong in `tokens.css` (R18) — this spec sets the shape, not the pixel values.

---

## 5. Initiative Modal — URL-addressable, tabbed, ~70vw × ~85vh

Details open in a **URL-addressable modal** over the live board. Sourced from S3A.1 real-user feedback (2026-04-22): the card face was losing context under expand-and-scroll, and users wanted a single housing surface for every per-initiative artefact. The original §5 "non-modal side panel" design is preserved in the design-log (link at top) for historical reference; the trade-off that led to the modal pivot is recorded there.

- **Route shape (Next.js parallel + intercepting):** `/ideas/@modal/(.)initiative/[id]` intercepts over the board; `/initiative/[id]` is the paired full-page route. Modal URLs are refresh-safe and shareable (Slack, Granola, meeting prep).
- **Chrome:** the shadcn `Dialog` wrapper — which in this repo wraps [`@base-ui/react/dialog`](../../src/components/ui/dialog.tsx) (not Radix). Overlay `bg-black/70 backdrop-blur-sm`; content `w-[min(1200px,70vw)] h-[85vh] max-w-none p-0` with a compact header + tab strip.
- **Active tab** is a query param (`?tab=brief`); persists across refresh/back; default-tab logic picks the most actionable tab for the initiative's current lifecycle.
- **Six tabs, lifecycle-gated** (`live` / `pending` grey dot / `locked`): Idea · Brief · Discovery · Spec · Design · Activity. Exact availability matrix lives in the S3A.2 seed; the pure function ships as `pdlc-ui/src/lib/tab-availability.ts`.
- **Open behaviour:** clicking anywhere on a card (outside the ellipsis / grip handle / interactive child) opens the modal on its default tab; Enter on a focused card does the same. Close via ESC, overlay click, back button, or explicit close — board scroll position preserved.
- **Replaces** the inline `<details>` BriefPanel accordion (removed in S3A.2). The card face keeps a single truncated `problem.value` line when `brief.complete === true`.

**Honest trade-off:** the modal blocks the board while open, which the original side-panel design tried to avoid. The trade is intentional — the modal is the content hub for all per-initiative artefacts (idea text, brief, discovery output, spec, design attachments, activity feed) and needs the room. ESC / back / deep-link make dismissal fast, and the URL makes state shareable. Full reasoning: [`design-log/2026-04-22-pivot-to-modal.md`](../design-log/2026-04-22-pivot-to-modal.md).

See [`plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md`](../../../plans/PDLC_UI/seeds/s3a2-initiative-modal-tabs-chat-wizard.md) for the full S3A.2 deliverables — modal chrome, tab shell, chat-style brief wizard, card UX changes, within-lane pointer reorder via dnd-kit, and the read-only Activity feed.

---

## 6. Focused-column mode — deferred to S3A.3

Deep-work escape hatch (double-click / Enter on a column header → siblings collapse to 48px rails, parked rail unaffected, Esc returns, ephemeral state). **Deferred to S3A.3** to keep S3A.2 scoped around the modal + chat wizard + within-lane reorder restore (three non-trivial surfaces already). The design intent below stands; implementation waits.

- The focused column expands to fill the visible board width.
- Sibling **main** lanes collapse to **48px rails** showing only the stage icon + card count. Click a rail to swap focus.
- The **parked rail is unaffected** — it retains its current width (collapsed or expanded).
- Esc returns to the default layout.
- State is **ephemeral** — not persisted.

**Why not persisted:** the default should work; focused mode solves the edge case where you're living in one column for 20 minutes. Persisting it means a new user lands in an expanded view they don't understand.

---

## 7. What the board explicitly does NOT do

- **Not** full-bleed edge-to-edge. Gutters stay. Breathing room is design, not waste.
- **Not** an infinite vertical board. Columns scroll vertically within the board container, never within the page.
- **Not** a mini-map or column navigator. Excess ceremony for the Bar A volume.
- **Not** resizable per-column widths. Elastic grid handles the common case; focused mode handles the rare case. Per-column resize is too much UI for the value.
- **Not** a collapsible per-column setting. Only parked has a rail, and only focused mode temporarily collapses siblings. Everything else stays visible by default.
- **Not** a replacement for the ellipsis "Move to…" menu. Drag is additive; menu stays as the canonical keyboard / screen-reader path.

---

## 8. Implementation sequencing

| Spec section              | Sprint    | Notes                                                                 |
| ------------------------- | --------- | --------------------------------------------------------------------- |
| §1 Chrome-light shell     | **S3A.1** | Sticky 48px header + board-as-scroll-container                        |
| §2 Elastic main lanes     | **S3A.1** | `repeat(auto-fit, minmax(280px, 1fr))` + natural-floor scroll         |
| §3 Parked right-edge rail | **S3A.1** | Replace in-grid parked lane with rail                                 |
| §4 Density toggle         | **S3A.1** | Three modes + CSS-var swap + `localStorage`                           |
| §5 Initiative Modal       | **S3A.2** | URL-addressable modal + six tabs + chat wizard — see S3A.2 seed       |
| §6 Focused column         | **S3A.3** | Deferred from S3A.2; double-click header → siblings collapse to rails |
| §7 Guardrails             | ongoing   | Enforced in PR review + axe smoke                                     |

---

## 9. Accessibility acceptance (must hold across sections)

- axe-clean in every density mode and in focused mode.
- Keyboard reaches every interactive (headers, density toggle, rail toggle, cards, modal tabs, modal close); 2px focus ring visible everywhere.
- Cross-lane DnD has a keyboard path via the card's **Actions → Move to…** submenu (S3A.1 shipped). A pointer-sensor-only dnd-kit surface owns pointer drag; the dnd-kit `KeyboardSensor` is deferred to S3A.3 (see ADR-0003 and `design-log/2026-04-22-pivot-to-modal.md`).
- Modal uses a standard focus trap while open; ESC + overlay click + back button all dismiss.
- Reduced-motion respected: modal fade/scale and focused-mode transitions honour `prefers-reduced-motion`.

---

## 10. Open design questions

1. **Parked rail default:** collapsed (current spec) vs expanded on first load. Default collapsed = cleaner first impression; revisit once Bar A has real parked volume.
2. **Density toggle surface:** icon-only segmented control vs labelled. Default = icon-only with `aria-label`; tooltip on hover/focus.
3. **Focused-column trigger:** double-click vs a dedicated icon on the column header. Double-click is invisible affordance — icon is more discoverable. Default = **both** (the icon is the keyboard path anyway).
4. **Panel tab order:** Idea / Brief / Discovery / Activity (current) vs Brief / Idea / Discovery / Activity. Brief-first matches the user's likely intent post-discovery; Idea-first matches temporal order. Default = **temporal** (Idea first) until user feedback says otherwise.

---

_Created 2026-04-21 alongside the S3A.1 / S3A.2 split. Lives in `pdlc-ui/docs/design/` so it travels with the UI code, not the plan folder — layout is a product of the app, not a process artefact._
