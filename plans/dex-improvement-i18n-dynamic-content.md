# Dex Improvement: Multi-language dynamic content (user language preference)

**Created:** 2026-04-17  
**Status:** Draft — pending answers to **Open questions** (Phase 5)  
**Pillar:** TBD (product: likely Deal Support / Product Feedback depending on roadmap owner)

## Overview

End users choose a **language preference**; **dynamic content** (API-driven copy, feeds, policies, bot answers, imported fields, etc.) is shown in that language where available, with a defined **fallback** (tenant default, English, or source language) and a path for **untranslated** strings.

This plan is **product-agnostic** until scope is confirmed: it may target **Wyzetalk Blue / backend**, **tawk.to / FAQ**, **Dex vault** (unlikely for “users”), or multiple layers.

## Understanding (Phase 1)

| Area | Involvement |
|------|-------------|
| **Product / app** | High — preference storage, `Accept-Language` / profile locale, CMS or string pipeline, RTL if needed |
| **Content & HR** | Policy and FAQ source language, legal accuracy per locale, who approves translations |
| **Third-party (e.g. tawk.to)** | Widget language, KB languages, AI Assist base prompt per locale if supported |
| **Dex vault** | Low unless the “users” are vault operators wanting localized templates |

**Ambiguity:** “Dynamic content” spans **static i18n keys**, **HRIS/imported fields**, **UGC**, **search snippets**, and **LLM/bot** output — each needs a different pattern.

## Internal context (Phase 2 — vault scan)

- **[Profile_Users.md](../06-Resources/PRDs/Profile_Users.md):** Users can self-set **language** (P0) — good anchor for **preference source of truth** in-app.
- **[Groups.md](../06-Resources/PRDs/Groups.md):** Import includes `language` on employee keys — may feed **default** suggestion or segmentation, not necessarily UI translation.
- **[Feed.md](../06-Resources/PRDs/Feed.md):** Relative time labels + **user locale/timezone** — pattern exists for **locale-aware display** of *generated* UI strings.
- **No** central `i18n` or `locales/` doc in vault — greenfield at spec level.

## Capability analysis (Phase 3)

| Requirement pattern | Suggested implementation | Feature type | Rationale |
|----------------------|---------------------------|--------------|-----------|
| Every API returns locale-aware labels | Backend **resource bundles** or TMS (Phrase/Lokalise/Crowdin) + **locale** query/header; cache per locale | Product architecture | Single source of truth; testable |
| User switches language mid-session | Persist **profile.language**; invalidate client cache; optional **event** `locale_changed` | Profile + client state | Aligns with Profile PRD |
| Policies / long documents | **Per-locale documents** in CMS or PDF set; avoid MT-only for compliance | Content ops + legal | HR/policy often needs human sign-off |
| Short bot / FAQ answers (tawk.to) | Separate **KB/Shortcuts per language** or vendor multilingual features + **Base Prompt** per agent if needed | Integration | Matches tawk model (KB default language + articles) |
| “Translate anything” via AI on the fly | On-demand MT API on **read path** | Edge service | High cost/latency; risky for regulated copy — usually hybrid |
| Dex personal vault in multiple languages | English-first templates; optional **skill** to translate notes | Skill / command | Only if “users” meant you, not employees |

## Adjacent improvements (Phase 4)

- **RTL** (Arabic, Hebrew): layout audit — not just strings.  
- **Accessibility:** larger tap targets for translated longer strings.  
- **Numbers/dates/currency:** `Intl` + server consistency with Feed’s UTC/locale pattern.  
- **tawk.to:** align widget language with profile locale when embed opens.  
- **Steerco reporting:** % strings covered per locale as a release gate.

## Open questions (Phase 5 — max 3)

1. **Who are “users”?** Employees in **Blue** (and later WhatsApp), **admins** only, or also **Dex** operators?  
2. **What counts as “dynamic”?** Pick the main buckets: *(a)* app UI from code keys, *(b)* tenant/CMS copy, *(c)* HR import fields, *(d)* feed/notifications, *(e)* tawk/FAQ, *(f)* other.  
3. **Quality bar:** Machine translation acceptable for **UI only**, with **human** for policies/legal — or different rule?

---

## Requirements (draft)

- [ ] Language preference is stored, authenticated, and sent on API/widget init (TBD which services).
- [ ] Dynamic content resolves to **requested locale** with **documented fallback** when missing.
- [ ] Untranslated or low-confidence MT does not violate HR/comms rules (TBD with legal).
- [ ] Tests or checks for critical flows in **≥2** pilot locales (TBD which).

## Recommended approach (pre-decision)

1. **Treat profile language as canonical** for employee apps (already in Profile PRD).  
2. **Layered strategy:**  
   - **Tier A:** i18n keys in app (JSON per locale in repo or from CMS).  
   - **Tier B:** Tenant-provided strings versioned by locale in DB.  
   - **Tier C:** Long-form (policies) = discrete assets per locale, not live MT.  
3. **On-demand MT** only for low-risk surfaces (e.g. optional “translate this comment”) if needed later.

## Implementation steps (outline)

### Phase 1 — Foundation

1. Confirm **locale code** standard (`BCP 47`: `en-ZA`, `zu`, etc.).  
2. API contract: `Accept-Language` and/or explicit `locale` from session.  
3. Client: load bundle on login / locale change.

### Phase 2 — Core

1. Migrate or generate **string catalogs** for P0 screens.  
2. **Feed / notifications / errors** use same locale pipeline.  
3. Integrations (tawk): pass visitor language if SDK supports it.

## Files to create / modify (when implementing — outside vault stub)

| Location | Action | Purpose |
|----------|--------|---------|
| Product repo | Create | `locales/*.json` or TMS sync |
| Backend | Modify | User profile read/write language; resolver middleware |
| PRDs | Link | Profile_Users + AI_Assistant_FAQ + any Feed/Notifications |

## Compound opportunities

- [ ] One **design system** pass for string length stress (German, Afrikaans).  
- [ ] **Analytics:** `locale` dimension on support deflection and FAQ success.  
- [ ] **Voice / WhatsApp** later: spoken language vs UI language.

## Acceptance criteria (draft)

- [ ] Switching language in profile updates **all Tier A** screens without restart (or with one refresh — define).  
- [ ] No silent wrong-language **policy** content: show fallback + “not available in your language” if missing.  
- [ ] Documented list of **out-of-scope** for Phase 1 (e.g. peer chat UGC).

## Questions resolved

- *None yet — complete Phase 5 in chat or edit this section.*
