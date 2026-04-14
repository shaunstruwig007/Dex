# Next — specified post–Essential GA

> **Formal PRDs** for the phase **after Wyzetalk Essential GA**. These are **specified** (stub or draft), not raw exploration — exploration lives in **[../Future/](../Future/)**.

**Essential (launch) specs:** [../Current/](../Current/) · **Pipeline (discovery → dev):** [../Then/](../Then/) · **Pre-PRD themes:** [../Future/README.md](../Future/README.md)

---

## What belongs here

- Capabilities that **extend** Essential (e.g. scheduled **Posts** + operational **Messaging**, two-way WhatsApp HR, analytics, navigation, page builder)
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

> **Current steering — board & sales (2026-04-13, Leon):** the **next development phase** is **#1 WhatsApp integration** → **#2 AI Assistant** (Blue + WhatsApp; **Tawk.to** and similar) → **#3 peer-to-peer chat** (group + DM) → **#4 Remote App extensions** → **#5 FloatPays (EWA)** → **#6 Forms**. **Lower:** migration-specific use cases; **higher:** new sales. **Not** in this board stack: **product analytics**, **notification preferences**, **troublesome tech debt**. Full narrative: **[Wyzetalk_Essential_Launch.md](../../../04-Projects/Wyzetalk_Essential_Launch.md)** (section *Then — board & sales (2026-04-13)*).
>
> **Last steerco-style alignment (2026-03-30, Leon + Merel)** had the **same #1–#4**, but **#5 Product Analytics** and **#6 Scheduled Content** — those two slots are **replaced** in April board messaging by **FloatPays** and **Forms** until steering revisits.

| Priority | PRD | File | Status | Depends on (Essential) |
|----------|-----|------|--------|-------------------------|
| **#1** | WhatsApp — integration (Smart HR + channel / remote-app comms) | [WhatsApp_Smart_HR.md](./WhatsApp_Smart_HR.md) (+ [Current/WhatsApp_Channel.md](../Current/WhatsApp_Channel.md)) | Active stub | WhatsApp Channel · Payslip PDF |
| **#2** | AI Assistant — FAQ & HR (tawk.to) | [Future/AI_Assistant_FAQ.md](../Future/AI_Assistant_FAQ.md) | Active stub | WhatsApp Channel |
| **#3** | Employee Chat (P2P + group) | [Future/Employee_Chat_and_Groups.md](../Future/Employee_Chat_and_Groups.md) | Discovery stub | Notifications |
| **#4** | Remote App Extensions / Elevated Auth | [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md) | Stub | Login · Tenant Management · Payslip PDF |
| **#5** | FloatPays — EWA | [Future/Floatpays_Integration.md](../Future/Floatpays_Integration.md) | Stub | Remote app / payslip narrative |
| **#6** | Forms | [Future/Forms_Authoring.md](../Future/Forms_Authoring.md) | Pre-PRD stub | TBC |
| *Backlog* | Product Analytics | [Product_Analytics.md](./Product_Analytics.md) | Stub | **Not** board #5 for this dev phase (2026-04-13) |
| *Backlog* | Scheduled & recurring publishing | [Scheduled_Content_Extended.md](./Scheduled_Content_Extended.md) | Stub | **Superseded** in April board #6 by Forms until steering revisits |
| TBC | Explorer — Category-Based Navigation | [Explorer.md](./Explorer.md) | Stub — scope under review | Posts · Feed · Page Builder (Next) |
| TBC | Page Builder — Widget-Driven Content | [Page_Builder.md](./Page_Builder.md) | Stub | Posts · Explorer |

**SSO (Enterprise Identity Federation):** formal PRD + AC live under **[../Future/SSO.md](../Future/SSO.md)** (future-phase) until promoted back to **Next** for sequencing.

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

*Last updated: 2026-04-13 — **Board + sales priority stack (Leon)** supersedes #5–#6 from 2026-03-30; Product Analytics + Scheduled Content → backlog for this phase. SSO spec: [../Future/SSO.md](../Future/SSO.md).*
