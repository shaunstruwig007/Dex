# Next — specified post–Essential GA

> **Formal PRDs** for the phase **after Wyzetalk Essential GA**. These are **specified** (stub or draft), not raw exploration — exploration lives in **[../Future/](../Future/)**.

**Essential (launch) specs:** [../Current/](../Current/) · **Pipeline (discovery → dev):** [../Then/](../Then/) · **Pre-PRD themes:** [../Future/README.md](../Future/README.md)

---

## What belongs here

- Capabilities that **extend** Essential (e.g. SSO, scheduled **Posts** + operational **Messaging**, two-way WhatsApp HR, analytics, navigation, page builder)
- Dependencies on Essential being live or stable
- Items you have already **named and stubbed** — not loose Future themes

## What does NOT belong here

- Essential launch scope → **[../Current/](../Current/)**
- Early exploration only → **[../Future/](../Future/)**
- Active programme before release categorisation → **[../Then/](../Then/)** (optional)
- Market-only notes → `Market_intelligence/`
- Cross-cutting integration questions → [../PRD_Cross_cutting_open_questions.md](../PRD_Cross_cutting_open_questions.md)

---

## Next phase scope

| PRD | File | Status | Depends on (Essential) |
|-----|------|--------|-------------------------|
| SSO — Enterprise Identity Federation | [SSO.md](./SSO.md) | Draft | Login & Account Activation · Tenant Management |
| Content — Scheduled & Recurring Publishing | [Scheduled_Content_Extended.md](./Scheduled_Content_Extended.md) | Stub | Posts · Messaging Ops · Communication · Feed |
| WhatsApp — Smart HR (Conversational) | [WhatsApp_Smart_HR.md](./WhatsApp_Smart_HR.md) | Stub | WhatsApp Channel · Payslip PDF |
| Elevated Auth — Remote App Integration | [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) | Stub | Login · Tenant Management · Payslip PDF |
| Product Analytics | [Product_Analytics.md](./Product_Analytics.md) | Stub | Instrumentation across Essential surfaces |
| Explorer — Category-Based Navigation | [Explorer.md](./Explorer.md) | Stub | Posts · Feed · Page Builder (Next) |
| Page Builder — Widget-Driven Content | [Page_Builder.md](./Page_Builder.md) | Stub | Posts · Explorer |

**Discovery templates**

| Template | File |
|----------|------|
| Remote App | [Template_Remote_App.md](./Template_Remote_App.md) |
| Feature within core product | [Template_Feature_Essential.md](./Template_Feature_Essential.md) |

---

## When a Next feature ships (or joins Essential)

1. Move `Next/[Feature].md` → `Current/[Feature].md` (and `*_acceptance_criteria.md` if present).  
2. Update [../README.md](../README.md) — tables under **Current** and **Next**.  
3. Remove or redirect the stub from **Next/**.  
4. Patch any cross-links in **Future/** or **Current/** PRDs.  
5. Log in `CHANGELOG.md` if the vault is Dex-core.

---

*Last updated: 2026-03-26*
