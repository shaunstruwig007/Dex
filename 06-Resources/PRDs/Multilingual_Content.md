---
prd_shape: bond_v1
prd_id: multilingual-content-2026-04-29
created_date: 2026-04-29
last_bond_run: 2026-04-29 12:25
lifecycle: spec_ready
related_prds:
  - Profile_Users.md
  - Posts.md
  - Feed.md
  - Theming.md
---

# Multilingual Content (Wyzetalk Essential)

**Status:** First draft, ready for M + Q critique.
**Target:** Wyzetalk Essential reader (frontline employee).
**Out of scope intentionally:** comments on posts, images/captions/attachments, SHEQ content, emergency comms, support tickets, per-post translation disable, customer-facing language-registry admin UI, verifier/moderator roles, old-platform parity.

---

## Goal

Wyzetalk Essential readers see post titles and bodies translated automatically into their preferred language, removing the language barrier as a source of disengagement on the frontline.

This is grounded in real sales-pipeline evidence: deals are stalling/pausing on the multi-lang gap, prospects ask about it repeatedly, and the legacy Wyzetalk product has a cumbersome version of this that customers depend on. Wyzetalk Essential is **not** building a copy of legacy — it's building the industry-standard version that makes legacy redundant.

---

## Users

**Reader (primary).** A frontline employee scrolling the Wyzetalk Essential feed. Sets a language preference in their Profile. May be a first-language speaker of English, Afrikaans, Zulu, Xhosa, or other supported languages. Reads posts authored in any other supported language as automatic translations. Has no per-post action to take — translation happens automatically when they open the feed.

**Writer (admin).** Either a customer-side admin (employee of the customer organisation with admin permissions) or a Wyzetalk-side service admin (Wyzetalk staff providing managed-service to the customer). Authors a post once in their source language. Does not choose target languages. The system handles delivery to all enabled-language readers.

**Out of scope (MVP):** verifiers, moderators, post-translation editors. The auto-translate model with community feedback handles cultural and linguistic errors; a verified-translation posture is a separate cycle for content types where the stakes require it (SHEQ, Emergency).

---

## Success metrics

- **Adoption.** % of readers in tenants with multi-lang enabled who set a non-English Profile language preference within 30 days of feature ship. *(Plumbed via Profile_Users analytics.)*
- **Engagement parity.** Post-engagement rate (reactions, dwell time) for readers reading translated posts vs readers reading source-language posts. Target: within 15% of source-language engagement within 60 days post-ship.
- **Sales pipeline impact.** Number of stalled / paused deals re-engaged on the back of multi-lang availability within 90 days. *(Tracked qualitatively from sales notes; baseline: 0.)*

**Note on measurability at slice-1 ship:** two of these need analytics plumbing that arrives across slices 3–4. Slice-1 success criterion is observability (the loop demonstrably works), not statistical proof. Real metric reads happen at the 60–90 day post-ship mark.

---

## Requirements (outcome-shaped, no implementation)

1. A reader sees a post in their preferred language regardless of the language the writer published in, without any reader action per post.
2. A reader can change their preferred language from their Profile, and feed posts re-render in the new language on next view.
3. A writer publishes a post once, in one language. The system handles delivery to all enabled-language readers.
4. The set of supported languages is **configurable** — adding a new language does not require a code release.
5. When a writer edits a published post, readers see the updated translation. If the new translation has not yet been generated, the reader sees a clearly-marked "translation may be outdated" state with the previous translation visible.
6. The platform's UI elements that surround post content (timestamps, author labels, action buttons) honour the reader's language preference using the existing built-in app-translation capability, for any in-scope element.
7. SHEQ-tagged content and Emergency content are explicitly **excluded** from auto-translation in the MVP and follow a separate cycle with a verified-translation posture.

---

## Slices

| # | Name | Walking-skeleton? | Demo outcome (what observer sees) | Layers touched | Depends on |
|---|------|-------------------|-----------------------------------|----------------|------------|
| 1 | **Skeleton: admin posts in English, hardcoded reader sees Afrikaans** | yes | Admin publishes a post (title + body) in English. A reader on a hardcoded test account with language preference = Afrikaans opens the feed, sees the post title and body rendered in Afrikaans within 2 seconds of publish. Single language pair. No preference UX. No persistence. | data, api, ui | none |
| 2 | **Add Zulu, Xhosa, Portuguese; extensible language registry** | no | Configuration change adds a language to the supported set without a code release; same demo as slice 1 succeeds for the newly-added language. Four languages working end-to-end via config. | api, config | 1 |
| 3 | **Profile language-preference UX** | no | Reader opens their Profile, sees the language selector exposed (currently closed in Profile_Users), picks a language from the tenant-enabled list, returns to feed, posts now render in their chosen language. Replaces hardcoded preference with real preference. | data, api, ui | 2 |
| 4 | **Server-side translation cache + edit invalidation** | no | A post translation is computed once and cached server-side per language. When the writer edits the post, cached translations are marked stale; the reader sees a "translation may be outdated" indicator with the previous translation until the new one lands. | data, api, ui | 3 |
| 5 | **Surrounding-UI translation-enablement audit** | no | All in-scope front-end elements that surround feed content (timestamps, author labels, reaction labels, action buttons) honour the reader's preferred language. Any unwired elements get wired against the existing app-translation capability. | ui | 3 |

**Slicing rules applied:** slice 1 is a walking skeleton (smallest end-to-end cut, single language pair, hardcoded preference, no persistence). Each slice spans ≥1 layer. Each slice has a single observable demo outcome callable out loud. Five slices total — no overflow into "out of scope (future slices)" needed for MVP.

---

## Plan mode seed

Copy the block below into Cursor Plan mode. Each line becomes one Plan-mode step.

```plan-mode-seed
Slice 1: Skeleton — admin posts in English; hardcoded reader sees Afrikaans translation in feed within 2s of publish. Single language pair, no preference UX, no persistence. Layers: data + api + ui.
Slice 2: Add Zulu, Xhosa, Portuguese; language registry is config-driven (no code release to add a language). Demo: change config → fourth language renders. Layers: api + config. Depends: 1.
Slice 3: Profile language-preference UX — open up the language selector in Profile_Users; reader picks from tenant-enabled list; feed re-renders in chosen language on next view. Layers: data + api + ui. Depends: 2.
Slice 4: Server-side translation cache + edit-invalidation. Writer edits a post, cached translations marked stale, reader sees "translation may be outdated" indicator until refresh. Layers: data + api + ui. Depends: 3.
Slice 5: UI-element translation-enablement audit — all in-scope feed-surrounding elements honour reader's preferred language; wire any that don't. Layers: ui. Depends: 3.
```

---

## Risks

- **Translation provider cost at production scale.** Google Cloud Translation pricing at 5–11k employees per customer × post volume × 5–10 languages may force the persistence model (slice 4) earlier than slice ordering suggests. **Mitigation:** validate provider pricing before slice 1 closes; if cost is materially steeper than expected, swap slice ordering to put caching ahead of preference UX.
- **Cultural-translation errors on Zulu / Xhosa.** Auto-translate quality on African languages is materially weaker than on European languages. A high-profile mistranslation in a public-facing post is a customer-trust moment. **Mitigation:** ship a "flag a bad translation" affordance alongside the translated rendering; commit to a post-MVP review cycle if flagged-translation volume is material. Note: this is the community-feedback loop the discovery decision relied on.
- **Profile-language preference adoption.** The Profile_Users field exists conceptually but isn't exposed today. If we ship slice 3 and most users never set a language, slice 1's value is invisible. **Mitigation:** include a "set your preferred language" prompt for users who haven't set one when slice 3 ships.
- **UI-element translation gaps.** Built-in app-translation capability exists, but coverage across feed-surrounding elements is unknown until slice 5 audits. Risk: shipping slice 1 with mixed-language UI (translated post, English buttons around it) feels broken. **Mitigation:** gate slice 1 demo on a quick visual sanity-check of the immediate post-card surface.
- **SHEQ / Emergency leakage.** If SHEQ-tagged or Emergency content somehow flows through the same auto-translation path because the content-type check is missed, we ship safety-critical mistranslations. **Mitigation:** explicit allowlist (only "post" content type goes through auto-translate); SHEQ + Emergency content types are blocked at the auto-translation entry point with a logged event.

---

## Out of scope

| Out of scope | Why | Future cycle? |
|--------------|-----|---------------|
| Comments on posts | MVP scope — text body only first | Yes, future |
| Images, image captions, attachments, polls, embedded documents | MVP scope — title + body text only | Yes, separate cycles per content type |
| SHEQ content | Different verification posture required (auto-translate isn't safe for safety) | Yes, separate cycle with verified-translation model |
| Emergency comms | Pre-translated templates needed; real-time auto-translate is irresponsible | Yes, likely tied to existing Emergency Comms PRD work |
| Support tickets in user's native language | Different problem (request/response, not broadcast) | Yes, future |
| Per-post translation disable | No business case for opt-out posts in MVP | No |
| Customer-facing admin UI for language-registry management | Slice 2 makes registry config-driven; admin-editable UI is post-MVP | Yes, post-MVP |
| Verifier / moderator / post-edit-by-language-reviewer roles | Auto-translate + community feedback model in MVP | No (future SHEQ / Emergency cycles will introduce verified-translation roles) |
| Old-platform parity | Essential is industry-standard, not a port of legacy | No — explicit non-goal |

---

## Open questions

| # | Question | Blocks | Owner / next step |
|---|----------|--------|-------------------|
| 1 | Translation-provider pricing at production scale (5–11k × N posts × 5–10 langs). Is Google viable, or does cost force DeepL / Azure / cache-first? | Slice 1 sizing; possibly slice 4 ordering | PM + engineering — 30-min vendor-pricing read |
| 2 | Storage / persistence model for translations (compute-on-read vs server-cache vs DB-stored). Resolves once Q1 lands. | Slice 4 design | Engineering, post-Q1 |
| 3 | Edit-then-translate invalidation behaviour — re-translate immediately, mark stale + re-translate on next read, or always-stale-until-confirmed? | Slice 4 detail | Product call after slice 1 ships |
| 4 | Tenant-bounded language list — does a tenant whitelist which languages are available before users pick from them, or is the language list global per-deployment? | Slice 2 + 3 setup UX | Jan conversation |
| 5 | Jan conversation — what's been deferred on multi-lang historically and why? Likely closes 30–50% of remaining ambiguity. | Discovery completeness | PM, this week |
| 6 | Competitor parity on Zulu / Xhosa specifically (Workvivo / Viva Engage / Workplace). What's the floor we have to clear? | Positioning + sales arming | Felix's next run |

**None of these block the slice-1 build** if we accept stub assumptions: Google as default provider, compute-on-read for slice 1 only, immediate re-translate on edit (slice 4 will refine), tenant-global language list for now (slice 4 will refine).

---

## Design pointers

*This section is paste-ready for Claude Design or for a human designer working from the PRD alone. It references the slice list as the design anchor — design the walking-skeleton screen first, then variants per thickening slice.*

### Context

Wyzetalk Essential is a mobile-first frontline-employee engagement platform. Readers are non-desk workers reading posts authored by admins. The feed is the primary surface in the app. We're adding automatic translation of post content to the reader's preferred language. The language is set in the user's Profile.

### Surfaces in scope

1. **Feed view (primary).** Post cards show title + body. Translation rendering: card content in reader's preferred language. The card chrome (timestamps, author labels, reaction buttons) should also honour the reader's language using the existing built-in app-translation capability where it's wired.
2. **Post detail view.** Same content as a feed-card but expanded. Translation behaviour mirrors the feed-card.
3. **Profile language-preference selector.** Currently the language field exists in Profile but is not exposed to the user. This work opens it up. A single picker, listing tenant-enabled languages, with current selection persisted.
4. **"Translation may be outdated" indicator.** When a writer edits a post, the cached translation is stale until re-generated. While stale, the reader sees a small indicator alongside the translated content.

### Critical UX questions for the designer to answer

- How does a reader know the post they're seeing is translated vs original? Subtle indicator? Show source language? Or invisible (translation-as-default)?
- "Translation may be outdated" indicator placement — embedded in the post card? Toast? Persistent banner?
- Should we expose a "show original" toggle for readers who can read both languages? *Out of MVP scope — but flag if removing it leaves the experience materially worse.*
- Profile language-preference picker — does the picker show language names in the user's *current* language, or in each language's *own* script (English / Afrikaans / isiZulu / isiXhosa / Português / Español)? Recommendation: the latter — easier for readers to recognise their own language.

### Constraints on design

- No new modal, no full-screen workflow — this is a passive feature for the reader.
- Translation cannot be disabled per-post; design should NOT include any "do not translate this post" affordance for writers.
- Preserve the existing post-card rhythm — this is a content change, not a UI redesign.

### What the designer should NOT prescribe

- The translation provider (PM + engineering decide).
- Cache / persistence behaviour (engineering — but design should accommodate <2s rendering on a fresh post).
- The exact list of supported languages (config-driven post-slice 2).

### Design slice ordering (mirrors build slice ordering)

1. Skeleton screen (slice 1) — feed-card with translated content for one language pair. No preference UX, no indicators.
2. Multi-language registry (slice 2) — same as 1 but switch the rendering language via config. Probably no design change.
3. Profile preference selector (slice 3) — single new screen / panel in Profile.
4. "Translation may be outdated" indicator (slice 4) — small visual treatment on the post-card.
5. Surrounding UI elements (slice 5) — audit-driven, design changes only where the existing translation isn't already wired.

---

*Authored 2026-04-29 by Shaun + Cursor agent during a manual walkthrough of the idea→discovery→PRD pipeline. This PRD is the test artefact for the future `/prd-author` skill (formerly Bond) — its existence proves the slice-shaped PRD format is writeable end-to-end without a skill, and its quality vs effort indicates which behaviours the skill should automate.*
