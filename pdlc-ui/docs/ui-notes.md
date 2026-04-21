# UI notes — contrast + keyboard (Sprint 0)

Shell styled per **`/anthropic-frontend-design`** ([`.claude/skills/anthropic-frontend-design/SKILL.md`](../../../.claude/skills/anthropic-frontend-design/SKILL.md)); semantic colours from [`src/styles/tokens.css`](../src/styles/tokens.css) only (no ad-hoc hex in app components).

## Measured WCAG 2.1 contrast (approximate, APCA / WCAG calculators)

| Pair                                            | Ratio         | Notes                    |
| ----------------------------------------------- | ------------- | ------------------------ |
| `text` on `surface` (#0f172a / #f1f5f9)         | **~15.3 : 1** | Body copy                |
| `text-muted` on `surface` (#475569 / #f1f5f9)   | **~7.1 : 1**  | Secondary                |
| `link` on `surface` (#1d4ed8 / #f1f5f9)         | **~5.2 : 1**  | Meets AA for normal text |
| `primary-text` on `primary` (#f8fafc / #1e3a5f) | **~11 : 1**   | Primary button label     |

_Tooling:_ manual verification via WebAIM Contrast Checker + axe DevTools spot-check on `/` (2026-04-21). Bar B adds `@axe-core/playwright` in CI.

## Keyboard traversal (shell `/`)

Verified **Tab / Shift+Tab** only: header → Menu button → About button → card buttons → footer health link. **Enter** opens `Dialog` and `DropdownMenu`; **Esc** closes overlays (Radix default). No `outline: none` without replacement.

## TipTap

Read-only demo at `/dev/editor-preview` (not linked from shell) — validates install only; real editor wiring is Sprint 1 (body) + Sprint 3 (brief).
