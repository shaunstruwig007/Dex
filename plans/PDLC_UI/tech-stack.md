# PDLC UI — tech stack & UI primitives (recommended)

**Status:** **Recommended default** to be **ratified or overridden** by **ADR-0001** during Sprint 0 spike. Once ADR-0001 lands, this file is **reference / rationale**, not decision.

**Why pre-fill:** Leaving "choose a stack" to a blank S0 spike invites thrash. This file proposes a coherent default so S0 can focus on **validation** (install, run, CI green, render a shell page) rather than comparison shopping.

**Companions:** [plan.md § R18](./plan.md) · [plan-mode-prelude.md](./plan-mode-prelude.md) · [sprint-backlog.md Sprint 0](./sprint-backlog.md#sprint-0--spike--shell--contracts-12-weeks-1-week-ok-per-cadence-exception).

---

## 1. Recommended stack (defaults for ADR-0001)

| Layer | Choice | Why this |
|-------|--------|----------|
| **Framework** | **Next.js 15 (App Router) + React 19** | Single full-stack app, native route handlers for the small API, good a11y primitives, simple `next build` + `node` deploy to an internal host. |
| **Language** | **TypeScript (strict)** | Matches `schema-initiative-v0.md` TS interfaces; catches `camelCase` + optional-field drift at compile time. |
| **Styling** | **TailwindCSS + CSS custom properties (tokens)** | Utility classes stay consistent; tokens in `src/styles/tokens.css` give the DS a single source of truth (R18). |
| **UI components** | **shadcn/ui** (built on Radix primitives) | Accessible by default (keyboard, ARIA, focus management); owned components (pasted into repo) mean no black-box library; pairs naturally with `/anthropic-frontend-design`. |
| **Rich-text editor** | **TipTap v2** (ProseMirror) | Accessible, headless, extensible; maps cleanly to markdown via `@tiptap/extension-markdown` or `turndown` on save / `markdown-it` on load; toolbar is fully code-controlled (R18 minimum toolbar). |
| **Content rendering (read-only)** | **TipTap read-only** (same schema as editor) or **`react-markdown` + `rehype-sanitize` + `rehype-external-links`** | Cards surface rendered HTML, never raw markdown. Sanitiser prevents XSS from pasted content. |
| **Persistence** | **SQLite via `better-sqlite3`** with **WAL** + `busy_timeout` | Synchronous API fits single-writer discipline (R17). `revision` optimistic lock is a one-column update. Migrations via **Drizzle ORM + drizzle-kit** keep schema typed. File backup = copy / `VACUUM INTO`. |
| **ORM / query** | **Drizzle ORM** | TypeScript-first; schema mirrors `schema-initiative-v0.md` TS types; migration files commit alongside code. |
| **Schema validation** | **Zod** + **`zod-to-json-schema`** | One source for TS types + JSON Schema; CI validates golden fixture against the generated JSON Schema (R16 guardrail 3). |
| **Tests** | **Vitest** (unit) + **Playwright** (e2e + a11y via `@axe-core/playwright`) | Playwright covers keyboard-nav + focus flows per R18; axe tests run as Bar B extension. |
| **Lint / format / typecheck** | **ESLint** (flat config) + **Prettier** + `tsc --noEmit` | All three required in CI from S0 (R16 guardrail 3). |
| **CI** | **GitHub Actions** (if GitHub host) or **GitLab CI** — picked in **ADR-0002** | Branch protection + required status checks; same CI for `hotfix/*`. |
| **Deploy (MVP)** | Single Node process on an **internal host** (VM or container) behind ICT-approved TLS proxy | Smallest surface for Bar A; Docker image lands when Bar B rolls out. |
| **Logging** | **Pino** (structured JSON) to stdout; request-id middleware | No initiative PII in client console logs (R17). |
| **Health** | Next.js route handlers `GET /api/health` (liveness) + `GET /api/ready` (stub) exposing `gitSha` or `packageVersion` | R17 seed from S0. |

**Alternatives considered (for ADR-0001 context, not recommended):**

- **Vite + React SPA + Hono / Fastify API** — lighter than Next, but two build chains and no built-in route handlers; extra moving parts for a solo operator.
- **Remix** — similar to Next; drop only if the team has strong prior preference.
- **Plain JSON file persistence** — simpler, but `revision` optimistic lock + `events[]` append are awkward at scale; acceptable fallback if ICT blocks SQLite on the host (document in ADR).
- **Slate / Lexical** as editor — Lexical is promising but newer; TipTap has the larger ecosystem for markdown round-trip today.

---

## 2. Versioning

- **Node:** pin to an **active LTS** in `.nvmrc` (e.g. `20.x`); update policy in `pdlc-ui/README.md`.
- **Lockfile:** committed; `pnpm-lock.yaml` preferred (smaller, deterministic).
- **Dependency upgrades:** patch monthly (Renovate / Dependabot optional); minor + major need an ADR.

---

## 3. UI primitives (R18)

This is the **visual + interaction contract** every screen follows from Sprint 0 onward. It is deliberately small so it fits in a single tokens file + a handful of components.

### 3.1 Design tokens (ship in S0 as `pdlc-ui/src/styles/tokens.css`)

Expose every colour, radius, space, font-size, font-weight, shadow, and z-index as a CSS custom property. Components read tokens — **never** hex. Tokens are pre-validated for WCAG 2.1 AA contrast against the surfaces they sit on.

**Required semantic colour tokens (light theme MVP; dark deferred):**

| Token | Purpose | Contrast target |
|-------|---------|-----------------|
| `--color-surface` | Page background | n/a |
| `--color-surface-raised` | Card / modal background | n/a |
| `--color-border` | Subtle dividers | ≥ 3:1 against surface |
| `--color-text` | Primary text on surface | ≥ 7:1 preferred, **4.5:1 minimum** |
| `--color-text-muted` | Secondary text | ≥ 4.5:1 on surface |
| `--color-link` | Link on surface | ≥ 4.5:1 on surface **and** `--color-surface-raised` |
| `--color-link-hover` | Link hover | ≥ 4.5:1 |
| `--color-focus-ring` | 2 px focus outline | ≥ 3:1 on any surface it can appear over |
| `--color-primary` | Primary action bg | text on it ≥ 4.5:1 |
| `--color-primary-text` | Text on primary bg | ≥ 4.5:1 against `--color-primary` |
| `--color-danger` | Destructive action bg | text on it ≥ 4.5:1 |
| `--color-success` | Success state bg / text | ≥ 4.5:1 where used for text |
| `--color-warning` | Warning state bg / text | ≥ 4.5:1 where used for text |

**Forbidden in component code (lint rule from S1 if feasible):** hardcoded hex, `rgb(...)`, or Tailwind default colour classes that bypass tokens (e.g. `text-blue-500`) on any user-visible surface.

**Contrast verification:** at least one automated check per PR (eyeball OK for Bar A; axe-core Playwright test for Bar B). Document the **measured** contrast ratio for link-on-surface and text-on-primary in `pdlc-ui/docs/ui-notes.md` — no "looks fine" sign-off.

### 3.2 Typography

Single scale (Inter or system stack fallback):

| Token | Use |
|-------|-----|
| `--font-size-xs` | Metadata, timestamps |
| `--font-size-sm` | Secondary UI text |
| `--font-size-base` | Body |
| `--font-size-lg` | Card titles |
| `--font-size-xl` | Page section headings |
| `--font-size-2xl` | Page title |

**Line height** ≥ 1.5 for body; weight tokens `--font-weight-regular` (400), `--font-weight-medium` (500), `--font-weight-semibold` (600). No other weights without an ADR-note.

### 3.3 Focus, keyboard, motion

- **Focus ring:** 2 px solid `--color-focus-ring` + 2 px offset. Every interactive element. Never `outline: none` without a direct replacement.
- **Keyboard:** every flow completable without a mouse; modals trap focus and restore on close; Esc closes modals by default.
- **Motion:** respect `prefers-reduced-motion`; no auto-playing animations on load.

### 3.4 Rich-text editor (required toolbar — TipTap)

**Applies to:** description / body / brief answers / discovery research notes / open-question answers / user-facing release notes. Titles stay plain text.

**Minimum toolbar (S1 onward, wherever the editor ships):**

1. **Bold** (`Cmd/Ctrl+B`)
2. **Italic** (`Cmd/Ctrl+I`)
3. **Underline** (`Cmd/Ctrl+U`)
4. **Heading 2** (`Cmd/Ctrl+Alt+2`)
5. **Heading 3** (`Cmd/Ctrl+Alt+3`)
6. **Bulleted list**
7. **Numbered list**
8. **Link** (with URL validator; external links render with `rel="noopener noreferrer"` and visible affordance)
9. **Inline code**
10. **Clear formatting**

**Storage format:** markdown (preferred) or sanitised HTML if the chosen editor round-trips HTML more reliably — document in ADR-0001. **Export pack** (S4) continues to merge markdown.

**Read-only rendering:** same editor in read-only mode **or** `react-markdown` + `rehype-sanitize`. **Never** show raw markdown to the user on a card view.

**Paste hygiene:** when user pastes rich content (Word, Google Docs, webpage), preserve the toolbar-supported subset and strip the rest. No inline styles, no custom fonts, no coloured text pasted-in.

### 3.5 Component primitives (shadcn/ui — install these in S0)

`Button`, `Input`, `Textarea` (single-line/short only), `Dialog` (modal), `DropdownMenu`, `Toast`, `Tabs`, `Checkbox`, `RadioGroup`, `Label`, `Separator`, `Badge`, `Card`, `Tooltip`. Any new primitive needs a PR-note ADR.

**Drag-and-drop (added S3A.1):** `@dnd-kit/core` only — `PointerSensor` + `KeyboardSensor` with a hand-rolled keyboard coordinate getter. `@dnd-kit/sortable` was deliberately **not** installed (Q-alt.1, [`/agent-q-cto-custom`](../../.claude/skills/agent-q-cto-custom/SKILL.md) verdict on S3A.1) — within-lane reorder keeps the existing pointer + `Alt+↑/↓` keyboard fallback. Re-evaluate if a sortable arrow-key contract becomes a product requirement.

### 3.6 Forbidden "AI slop" patterns

These regress consistency and violate `/anthropic-frontend-design` direction:

- Gradient-heavy backgrounds without purpose.
- Oversized emoji / illustrative icons on every heading.
- Placeholder text that duplicates the label.
- `text-center` on every paragraph.
- Random shadow depths per card.
- Inline `style={{ color: '#...' }}` anywhere in production code.

---

## 4. When to override this file

- **ADR-0001** (S0) may choose any alternative with a documented reason (e.g. "ICT forbids SQLite on the host → JSON file + revision").
- **ADR-00NN** amends UI primitives only with **measured** justification (e.g. "TipTap bundle too large for internal host → switch to Lexical; contrast + toolbar contract unchanged").
- Drift without an ADR = R16 violation.

---

*Created 2026-04-21 — pre-fills Sprint 0 decisions so Plan mode is deterministic.*
