# PDLC UI — implementation standard (cross-sprint HOW rules)

> **FROZEN 2026-04-24 — applies when pdlc-ui resumes.** The live plan is [`plans/skill-pipeline/README.md`](../skill-pipeline/README.md). Rules below govern `pdlc-ui` UI-building discipline and do not apply to current skill-refinement work.

**Scope:** Cross-sprint rules for **how** `pdlc-ui` work ships, specifically around UI-building discipline, vertical-slice shape, and the design-system extraction loop. Applies to every sprint unless a sprint explicitly overrides with an ADR.

**Not this file's job:** the UI / token / a11y **spec** itself. That lives in [`tech-stack.md` § 3 "UI primitives (R18)"](./tech-stack.md#3-ui-primitives-r18) — authoritative list of tokens, typography scale, focus/keyboard/motion rules, TipTap toolbar minimum, shadcn primitives, and forbidden "AI slop" patterns. This file **references** that spec; it does not duplicate it.

**Companions:**

- Requirement authority: [`plan.md` R18](./plan.md#requirements)
- Plan-mode enforcement form: [`plan-mode-prelude.md` § UI / UX (R18)](./plan-mode-prelude.md)
- Runtime tokens file (created S0, grown through S6): `pdlc-ui/src/styles/tokens.css`
- Living DS doc (seeded S6 from S5–S6 dogfood): `pdlc-ui/docs/design-system.md`
- Measured contrast logs (from S0): `pdlc-ui/docs/ui-notes.md`

---

## 1. UI-building rule

Every **user-visible** surface of the orchestration app (layout, modals, lanes, forms, checklists, empty states, toasts, tabs) is built with **[`/anthropic-frontend-design`](../../.claude/skills/anthropic-frontend-design/SKILL.md)** in Cursor: **read the skill first**, then implement or refine components so the product is **cohesive, accessible, and non-generic** — not one-off inline styles per screen.

- New surface without reading the skill = reviewer-blockable.
- Reusing an existing surface (already `/anthropic-frontend-design`-derived) is fine — just follow the pattern.

## 2. Accessibility baseline

Target **WCAG 2.1 AA** + **full keyboard navigation** + visible focus states from Sprint 0. Details and contrast targets: [`tech-stack.md` § 3.1 + § 3.3](./tech-stack.md#3-ui-primitives-r18).

- **Bar A (localhost, solo):** keyboard nav + AA contrast enforced via tokens (no ad-hoc hex). Eyeball + manual axe DevTools spot-check per PR. Measured contrast ratios (numbers, not "looks fine") logged in `pdlc-ui/docs/ui-notes.md`.
- **Bar B (internal host):** automated a11y check (`@axe-core/playwright`) required in CI before merge.
- **Scope:** desktop browsers (current Chrome/Edge/Safari). Mobile deferred post-MVP.

## 3. Vertical-slice shape — BE + UI together

Each sprint ships **vertical slices** where sensible: persistence / API (or file-store writes) **and** the components that call them in the **same PR or Plan batch**. Behaviour and visuals stay aligned; reviewers see the full loop, not "backend merged S_N, UI merged S_N+1."

**Exceptions:** an ADR explaining why (e.g. "contract lands S_N to unblock S_N+1 UI build") — never silent decoupling.

## 4. R18 inheritance — every sprint from S0 onward

These non-negotiables apply to **every** sprint and are restated in [`plan-mode-prelude.md` § UI / UX (R18)](./plan-mode-prelude.md) for Plan-mode enforcement:

- **Cards never surface raw markdown.** Every initiative prose field renders through a **content renderer** (TipTap read-only or sanitised HTML).
- Every editable prose field edits through a **TipTap rich-text editor** with the [R18 minimum toolbar](./tech-stack.md#34-rich-text-editor-required-toolbar--tiptap).
- Every colour comes from **`pdlc-ui/src/styles/tokens.css`** — no hardcoded hex, no default Tailwind colour classes on user-visible code.
- Visible **2 px focus ring** on every interactive element; **keyboard-only completion** on every flow.

Full spec + forbidden patterns: [`tech-stack.md` § 3](./tech-stack.md#3-ui-primitives-r18).

## 5. S5 + S6 as design-process dogfood

**Sprints 5 and 6 are the canonical test** of the same pipeline Steerco will use for **product** initiatives (design artefacts + review gate). They are implemented by the same operator, on the same UI, with the same constraints.

**Extraction loop (required after S5–S6 ship):**

1. Review shipped S5–S6 UI (design column form, review checklist, waive flow).
2. Extract a `pdlc-ui` design system from the implemented code — tokens, spacing rhythm, form patterns, checklist row component, waive modal pattern.
3. Land it at **`pdlc-ui/docs/design-system.md v0.1`** + shared CSS variables / primitive components.
4. Refactor **S7+** screens to consume it — so R6 "feeds" the DS for the rest of the app rather than each sprint reinventing the form layout.

Drift without updating the DS doc = R16 guardrail 4 violation (see [`engineering-guardrails.md`](./engineering-guardrails.md)).

---

*Extracted 2026-04-21 from `sprint-backlog.md` so cross-sprint HOW rules live in their own reference file and grow independently of sprint-specific content.*
