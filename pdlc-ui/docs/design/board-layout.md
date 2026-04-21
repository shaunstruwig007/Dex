# Board layout — Chief Designer spec v0.1

**Status:** Draft for S3A.1 / S3A.2 implementation (2026-04-21).
**Owner:** PM (interim) · [`plans/PDLC_UI/seeds/s3a1-brief-wizard-interactions.md`](../../../plans/PDLC_UI/seeds/s3a1-brief-wizard-interactions.md) + [`plans/PDLC_UI/seeds/s3a2-discovery-automation.md`](../../../plans/PDLC_UI/seeds/s3a2-discovery-automation.md).
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

## 5. Side panel — non-modal, resizable, drag-aware

Details open in a **right-rail drawer**, not a dialog. Board stays alive behind it.

- **ARIA:** `role="complementary"` with `aria-label="Initiative details"`. **Not** `role="dialog"`. **No focus trap.** Esc closes via a keyboard listener.
- **Default width: 420px.** **Min 320px. Max 600px.** Drag the **left edge** to resize; width persists per user.
- **Drag auto-collapse:** while any card-drag is in progress on the board, the panel collapses to an **80px tab-icons-only rail**; restores to the previous width on drag end. The board gets the width back exactly when the user reaches for a column.
- **Content:** four tabs — **Idea** · **Brief** · **Discovery** · **Activity**. Pin-last-tab per user.
- **Open behaviour:** clicking anywhere on a card (outside drag handle / ellipsis) opens the panel on its last tab; clicking another card swaps content in place; Esc / ✕ closes and preserves horizontal scroll position of the board.
- **Replaces the inline `<details>` BriefPanel** on the card face. The card face keeps a single truncated `problem.value` line + "Open details ›" link.

**Why not a modal:** a modal blocks the board. The user explicitly asked to keep columns interactive while reading card context. A `complementary` landmark is the honest semantic — and the drag auto-collapse resolves the column-stealing tension at the exact moment it would bite.

---

## 6. Focused-column mode

Deep-work escape hatch. Double-click a column header (or Enter on a focused header) to enter focused mode:

- The focused column expands to fill the visible board width (minus panel if open).
- Sibling **main** lanes collapse to **48px rails** showing only the stage icon + card count. Click a rail to swap focus.
- The **parked rail is unaffected** — it retains its current width (collapsed or expanded).
- Esc returns to the default layout.
- State is **ephemeral** — not persisted. Focused mode is an "I'm triaging discovery right now" tool, not a view setting.

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

| Spec section              | Sprint    | Notes                                                         |
| ------------------------- | --------- | ------------------------------------------------------------- |
| §1 Chrome-light shell     | **S3A.1** | Sticky 48px header + board-as-scroll-container                |
| §2 Elastic main lanes     | **S3A.1** | `repeat(auto-fit, minmax(280px, 1fr))` + natural-floor scroll |
| §3 Parked right-edge rail | **S3A.1** | Replace in-grid parked lane with rail                         |
| §4 Density toggle         | **S3A.1** | Three modes + CSS-var swap + `localStorage`                   |
| §5 Side panel             | **S3A.2** | Non-modal, resizable, drag auto-collapse — see S3A.2 seed     |
| §6 Focused column         | **S3A.2** | Double-click header → siblings collapse to rails              |
| §7 Guardrails             | ongoing   | Enforced in PR review + axe smoke                             |

---

## 9. Accessibility acceptance (must hold across sections)

- axe-clean in every density mode and in focused mode.
- Keyboard reaches every interactive (headers, density toggle, rail toggle, cards, panel tabs, panel resize handle); 2px focus ring visible everywhere.
- DnD has a first-class keyboard path (Space + arrows + Enter + Esc) — see S3A.1 seed DoD.
- Side panel does not trap focus; Tab moves into and out of it naturally; Esc closes.
- Reduced-motion respected: drag auto-collapse and focused-mode transitions honour `prefers-reduced-motion`.

---

## 10. Open design questions

1. **Parked rail default:** collapsed (current spec) vs expanded on first load. Default collapsed = cleaner first impression; revisit once Bar A has real parked volume.
2. **Density toggle surface:** icon-only segmented control vs labelled. Default = icon-only with `aria-label`; tooltip on hover/focus.
3. **Focused-column trigger:** double-click vs a dedicated icon on the column header. Double-click is invisible affordance — icon is more discoverable. Default = **both** (the icon is the keyboard path anyway).
4. **Panel tab order:** Idea / Brief / Discovery / Activity (current) vs Brief / Idea / Discovery / Activity. Brief-first matches the user's likely intent post-discovery; Idea-first matches temporal order. Default = **temporal** (Idea first) until user feedback says otherwise.

---

_Created 2026-04-21 alongside the S3A.1 / S3A.2 split. Lives in `pdlc-ui/docs/design/` so it travels with the UI code, not the plan folder — layout is a product of the app, not a process artefact._
