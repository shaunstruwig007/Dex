# UI notes — contrast + keyboard (Sprint 0)

Shell styled per **`/anthropic-frontend-design`** ([`.claude/skills/anthropic-frontend-design/SKILL.md`](../../../.claude/skills/anthropic-frontend-design/SKILL.md)); semantic colours from [`src/styles/tokens.css`](../src/styles/tokens.css) only (no ad-hoc hex in app components).

## Palette — Cabin (Ember / River / Cedar)

- **Ember** (primary / CTAs / focus ring accent) — burnt orange
- **River** (secondary / links / info) — slate blue
- **Cedar** (neutrals — surfaces, borders, text) — warm earth

Fonts: `Poppins` (sans, 400/500/600/700) + `JetBrains Mono` (mono), loaded via `next/font/google` in `src/app/layout.tsx`.

Dark mode is intentionally **not** enabled for the MVP (R18 § 1). When the team decides to ship it, re-add the `@media (prefers-color-scheme: dark)` override block and re-run contrast + a11y checks in an ADR.

## Measured WCAG 2.1 contrast

Computed from sRGB → relative-luminance per WCAG 2.x. AA thresholds: **4.5 : 1** normal text, **3 : 1** large text / non-text UI (focus ring).

| Pair                                                 | Ratio         | AA?         | Notes                                    |
| ---------------------------------------------------- | ------------- | ----------- | ---------------------------------------- |
| `text` (cedar-800) on `surface` (cedar-50)           | **~11.7 : 1** | ✅ AAA      | Body + heading copy                      |
| `text-muted` (cedar-600) on `surface` (cedar-50)     | **~6.4 : 1**  | ✅ AA       | cedar-400 was promoted (was 3.5 → fails) |
| `text-muted` (cedar-600) on `bg-surface` (cedar-100) | **~5.5 : 1**  | ✅ AA       | Card surfaces                            |
| `link` (river-600) on `surface` (cedar-50)           | **~7.5 : 1**  | ✅ AAA      | Links + info text                        |
| `primary-text` (ember-50) on `primary` (ember-600)   | **~5.5 : 1**  | ✅ AA       | Primary button label                     |
| white on `secondary-action` (river-600)              | **~8.4 : 1**  | ✅ AAA      | Secondary button label                   |
| `status-danger` (#B83A4A) on `surface` (cedar-50)    | **~5.0 : 1**  | ✅ AA       | Danger icon/text                         |
| `status-success` (#2E6B1E) on `surface` (cedar-50)   | **~5.8 : 1**  | ✅ AA       | Darkened from original #3A8C2F (4.2:1)   |
| `focus-ring` (ember-400) on `surface` (cedar-50)     | **~3.3 : 1**  | ✅ non-text | Meets WCAG 1.4.11                        |

**Promotions vs the raw Cabin spec** (to hold AA on every user-visible pairing):

- `--color-primary` → `ember-600` (was `ember-400`, 3.3:1 fails for button labels)
- `--color-secondary-action` → `river-600` (was `river-400`, 4.2:1 fails)
- `--color-text-muted` → `cedar-600` (was `cedar-400`, 3.0:1 fails on cedar-100)
- `--color-status-success` → `#2E6B1E` (was `#3A8C2F`, 4.2:1 fails)

`ember-400` and `river-400` remain available as `--color-primary-accent` / `--color-secondary-accent` for badges, tints, and non-text decoration.

_Tooling:_ ratios computed manually (WCAG relative-luminance), to be spot-checked via WebAIM Contrast Checker + `@axe-core/playwright` (Bar B CI on `/`). Re-measure when we add dark mode or new surfaces.

## Keyboard traversal (shell `/`)

Verified **Tab / Shift+Tab** only: header → Menu button → About button → card buttons → footer health link. **Enter** opens `Dialog` and `DropdownMenu`; **Esc** closes overlays (Radix default). No `outline: none` without replacement — global `*:focus-visible` rule in `globals.css` applies a 2 px ember-400 ring with 2 px offset.

## TipTap

Read-only demo at `/dev/editor-preview` (not linked from shell) — validates install only; real editor wiring is Sprint 1 (body) + Sprint 3 (brief).
