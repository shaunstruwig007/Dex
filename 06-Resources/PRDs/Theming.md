---
prd_id: theming
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
  - Token naming for design system alignment
---

# Theming

**Status:** Done (Essential) — agent-oriented retrofit  
**Target:** Owners applying limited brand theming (colours, type, buttons) with preview  
**Estimated Effort:** Ongoing

---

> Lighter spec derived from the Theming discovery document. Covers colour selection, typography, button styles, and preview functionality.

**Related PRDs:** [Tenant_Management.md](./Tenant_Management.md) (login / tenant shell), [Profile_Users.md](./Profile_Users.md) (owner edits theme), [Posts.md](./Posts.md) (themed text template uses tenant palette). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

---

## The Job to Be Done

Owners configure a **branded but constrained** theme so the app feels like their organisation — applied to shell, posts templates, and previews — without full white-label complexity.

**User value:** Brand trust; consistent employee experience.

---

## Work Packages

### WP-Tokens: Palette & typography (P0)

**Priority:** P0  
**Dependencies:** Design tokens  
**Files:** Theme config TBD  
**VPS-eligible:** Yes

### WP-Preview: Live preview (P0)

**Priority:** P0  
**Dependencies:** WP-Tokens  
**Files:** Admin UI TBD  
**VPS-eligible:** No

### WP-Posts: Template consumption (P0)

**Priority:** P0  
**Dependencies:** [Posts.md](./Posts.md)  
**Files:** Renderer TBD  
**VPS-eligible:** No

---

## Success Scenarios

- Theme saves; employees see updated colours on next load.  
- Themed text post uses tenant palette per BDD.

---

## Satisfaction Metric

**Overall Success:** BDD Theming suite pass **≥ 95%** (target).

**Measured by:** QA visual + snapshot tests if available.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Slimmed-down** theming only (not full white-label per legacy).  
- Owner-only editing via Profile path.

---

## Technical Blueprint

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Theme JSON | TBD |

---

## Validation Protocol

```bash
grep -c "Acceptance criteria (BDD)" "06-Resources/PRDs/Theming.md"
# PASS: >= 1

grep -c "Posts.md" "06-Resources/PRDs/Theming.md"
# PASS: >= 1
```

---

## Notes for Agent Implementation

**Scout priorities:** Contrast/accessibility for custom colours.

---

## Files to Create / Modify

```
# TBD
```

---

## Out of Scope

- Arbitrary CSS injection.

---

# Problem Statement

Clients want employees to see a branded experience when using the app. Without theming, all tenants share the same default look — reducing brand recognition and trust. Full white-labelling is out of scope, but a slimmed-down theming system is needed so that each organisation's app feels like their own.

---

# Goals

1. **Enable brand alignment** — Owners can select colours, fonts, and button styles that match their company brand.
1. **Ensure accessibility** — All colour options are accessibility-considered (contrast ratios, colour-blind friendly).
1. **Provide preview before applying** — Owners can see how their choices look before committing.
1. **Keep it simple** — A constrained set of options that produces consistently good results.
---

# Non-Goals

- **Full white-labelling** — Custom logos on splash screens, custom app icons, etc. are out of scope.
- **Custom colour input (hex picker)** — Only pre-defined, accessibility-tested palettes.
- **Custom icon sets** — Default icon library only.
- **Per-page theming** — Theme applies globally to the entire tenant app.
---

# User Stories

- As an **owner**, I want to choose a secondary colour that matches my brand so that the app feels like our own.
- As an **owner**, I want to select a font for the app so that it aligns with our brand typography.
- As an **owner**, I want to preview my theme choices before applying so that I can be confident in the result.
- As an **employee**, I want to see my company's brand colours and logo when I use the app so that I trust it's an official company tool.
---

# Requirements

## Must-Have (P0)

### Colour Selection

- [ ] **Primary (neutral):** One standard neutral palette for text and backgrounds. Scale: 50 (F9FAFB) → 950 (030712), 11 steps.
- [ ] **Secondary (brand):** Five pre-defined, accessibility-tested colour options: Indigo, Azure/Blue, Magenta, Emerald/Green, Rose/Red. Each with full scale (50–950).
- [ ] **System colours (fixed):** Success (green), Warning (yellow), Error (red), Info (cyan). Not configurable.
### Typography

- [ ] Four font options: Work Sans, Poppins, Source Sans Pro, Lora.
### Button Styles

- [ ] Two options: Square, Rounded.
### Icons

- [ ] Default icon library. No custom selection.
### Preview

- [ ] Desktop: inline preview when selecting colours (SVG-based, not live).
- [ ] Mobile: separate preview mode.
## Nice-to-Have (P1)

- [ ] Custom hex colour input with accessibility validation (contrast checker).
- [ ] Additional font options.
- [ ] Theme applied to login screen and OTP screen (dependency on Tenant Management).
---

# Success Metrics

**Leading:**

- % of active tenants with a custom theme applied (target: >70% within 6 months)
- Theme setup completion rate during onboarding (target: >80%)
**Lagging:**

- Employee trust/recognition scores (survey: "Does the app feel like an official company tool?")
---

# Open Questions

- **[Design]** Should there be a "reset to default" option?
- **[Product]** Can admins also change the theme, or owner-only?
- **[Engineering]** How is the theme delivered to the client — CSS variables, a theme config API?
- **[Product]** When the theme is changed, does it apply immediately to all active sessions or on next app load?

---

## Acceptance criteria (BDD)

**Source PRD:** [Theming.md](./Theming.md)  
**Related:** [Tenant_Management.md](./Tenant_Management.md) (login branding), [Profile_Users.md](./Profile_Users.md) (owner edits), [Posts.md](./Posts.md) (themed text template).  
**Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md)  
**Use:** Eng / QA — **human-owned**.

---

## Scope reminder

- **Configurable:** neutral scale, **one** of five **secondary** brand palettes, **four** fonts, **two** button shapes; **system** colours fixed.  
- **Out:** Full white-label, hex picker Phase 1, custom icons, per-page themes.

---

## Acceptance criteria — Tokens & application

| ID | Criterion |
|----|-----------|
| TH-01 | **Given** owner selects **secondary** colour **when** from five options **then** full **50–950** scale available; **primary** neutral scale fixed per PRD. |
| TH-02 | **Given** typography choice **when** saved **then** only **Work Sans, Poppins, Source Sans Pro, Lora** selectable. |
| TH-03 | **Given** button style **when** chosen **then** **Square** or **Rounded** applies globally. |
| TH-04 | **Given** system status colours **when** displayed **then** Success/Warning/Error/Info **not** overridable by tenant. |

---

## Acceptance criteria — Preview & rollout

| ID | Criterion |
|----|-----------|
| TH-05 | **Given** owner edits theme **when** on desktop **then** **inline SVG preview** on selection; mobile: **preview mode** per PRD. |
| TH-06 | **Given** theme saved **when** applied **then** employees see branded shell — **immediate vs next load** *(product/engineering — see cross-cutting)*. |

---

## Acceptance criteria — Downstream consistency

| ID | Criterion |
|----|-----------|
| TH-07 | **Given** **themed text post** **when** rendered on feed **then** uses tenant **secondary** palette per Posts PRD. |
| TH-08 | **Given** **login/OTP** screens **when** tenant has branding **then** logo/theme from Tenant + Theming *(Nice-to-have P1 explicit in PRD — mark if Phase 1)*. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Accessibility** | Low contrast combo | Only curated palettes — blocked combinations N/A by design. |
| **Session** | Theme changes mid-session | TH-06 decision. |

---

## Outstanding

- **Admin** can edit theme or **owner-only**?  
- **Reset to default** control — design.  
- Delivery mechanism: CSS variables vs API — engineering.

---

*Align TH-08 with Tenant “branding on login” skeleton.*
