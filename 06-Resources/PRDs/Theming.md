# Theming

---

> Lighter spec derived from the Theming discovery document. Covers colour selection, typography, button styles, and preview functionality.

**Related PRDs:** [Tenant_Management.md](./Tenant_Management.md) (login / tenant shell), [Profile_Users.md](./Profile_Users.md) (owner edits theme), [Posts.md](./Posts.md) (themed text template uses tenant palette). **Integration map:** [PRD_Product_Map.md](./PRD_Product_Map.md).

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
