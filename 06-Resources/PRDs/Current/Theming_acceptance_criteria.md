# Theming — Acceptance criteria & edge cases

**Source PRD:** [Theming.md](./Theming.md)  
**Related:** [Tenant_Management.md](./Tenant_Management.md) (login branding), [Profile_Users.md](./Profile_Users.md) (owner edits), [Posts.md](./Posts.md) (themed text template).  
**Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md)  
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
