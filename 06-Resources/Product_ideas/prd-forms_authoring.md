---
id: prd-forms_authoring
dex_dashboard_preserve: false
---

# Forms authoring & delivery — discovery

**Idea:** Forms authoring and delivery in the product experience: a form embedded in (or linked from) a post; workers submit responses; admins build forms; consider **branching** and **scoring**.

**PRD stub:** [06-Resources/PRDs/Future/Forms_Authoring.md](../PRDs/Future/Forms_Authoring.md) · **Tier:** Future / P3 — sequence with other post–Essential GA themes.

---

## Problem formulation

- **Who / when:** **Tenant admins and HR/comms** need to run **pulse checks, eNPS, safety attestations, and generic data capture** without pushing workers to a separate tool or browser-only flows that break trust and completion rates. **Frontline employees** hit these flows **from the feed, Explorer-linked pages, or (later) WhatsApp** when the org wants a single channel for reach.
- **Broken today (per vault specs):** The product explicitly plans **“External Form Link”** posts that open **in the device browser** with **no in-app rendering** (`06-Resources/PRDs/Current/Posts.md`). That solves distribution via the feed but **does not** deliver native authoring, branching, scoring, or a unified analytics story inside the platform. **Forms_Authoring.md** frames the gap as needing **privacy, routing, and reporting**, not just a link wrapper.
- **Success looks like…** Admins **author** forms in-product (or integrated builder), **target** them like other content (groups, categories), workers **complete** them in the **app** where possible, submissions are **governed** (PII, retention, consent), and **results** roll up for HR/comms (and optionally **Product Analytics** content-type metrics). **Branching** and **scoring** are available where they differentiate (e.g. assessments, triage flows) without forcing one complex engine for every pulse.

---

## Evidence from the vault

- **Future discovery stub — scope:** `06-Resources/PRDs/Future/Forms_Authoring.md` — Hypothesis: tenants need in-product authoring for **eNPS**, **health/pulse**, **generic capture**; dependencies include **consent, retention, export**; open question: **anonymous pulses vs workforce-identified HR workflows** — same engine or split?
- **Posts Phase 2 — bridge, not full product:** `06-Resources/PRDs/Current/Posts.md` — Phase 2 **External Form Link**: tenant toggle, **Form ID** in link widget, **custom label**, opens **in browser**, **no in-app rendering**; metrics include **external form link click-through rate**. **Non-goals / Phase 2** explicitly exclude **native in-app form rendering** until later.
- **Page Builder — embed intent:** `06-Resources/PRDs/Next/Page_Builder.md` — Proposed **Form Link** widget: “[[Wyzetalk]] Forms widget — embed a form prompt inline” (Phase 2), i.e. durable **Explorer** pages expect a first-class forms surface, not only feed posts.
- **Roadmap / steering:** `06-Resources/PRDs/Next/README.md`, `06-Resources/PRDs/Next/Explorer.md` — Board stack places **Forms** at **#6** (after WhatsApp, AI, P2P chat, remote apps, FloatPays); **Product Analytics** not in the same “six” for the current dev phase — implications for how much **reporting UI** ships with v1 forms.
- **Analytics alignment:** `06-Resources/PRDs/Next/Product_Analytics.md` — Content engagement explicitly includes **Form Link** as a content type for views/click-throughs; full **submission analytics / scoring dashboards** would need schema extensions beyond clicks.
- **WhatsApp future:** `06-Resources/PRDs/Current/WhatsApp_Channel.md` — Phase 2+: **“Forms / surveys via WhatsApp”** (quick-reply / button lists, responses in platform) — same response store could eventually power **multi-surface** forms (app + WA).
- **Internal support / deflection:** `06-Resources/PRDs/Future/Internal_Support_Self_Service.md` — Handoff to forms for ticket-lite; open question **“MVP: forms + routing only vs conversational deflection first?”**
- **Activation / support flows:** `06-Resources/PRDs/Current/Login_Account_Activation.md` — References **QR-linked forms** for pre-launch data collection as a **separate initiative** — shows adjacent demand for **managed forms** outside the feed.
- **Profile:** `06-Resources/PRDs/Current/Profile_Users.md` — **Feedback + Support forms** — pattern of **simple org forms** may share components with the forms engine.
- **Competitive:** `06-Resources/Competitors/profiles/Humand.md` — **Forms** and **surveys** in a broad EX competitor; `06-Resources/Competitors/profiles/Jem.md` — **Polls, surveys** on **WhatsApp** — pressure to match **channel-native** capture, not only in-app.

*Search note: QMD was unavailable in this session (`node .scripts/semantic-search/check-availability.cjs` exited non-zero); evidence gathered via path-targeted grep across PRDs, resources, project launch notes, and competitor profiles. No relevant hits in `00-Inbox/Meetings/` or `05-Areas/Relationships/Key_Accounts/` for forms/survey/pulse terms.*

---

## Solution directions

| Option | Summary | Trade-offs |
|--------|-----------|------------|
| **A — Native authoring + in-app completion** | Full builder, submission API, storage, admin reporting in Blue. | Highest value; largest build (privacy, abuse, mobile UX, offline). |
| **B — Keep external builder, improve integration** | Continue Form ID / deep links; deepen only **telemetry + SSO**. | Matches current Posts spec; **does not** satisfy branching/scoring/in-app experience. |
| **C — Hybrid v1** | **Author** in-product for **simple** fields + pulses; **power** branching/scoring via **limited** logic or export to specialist tool. | Ships faster; risk of two mental models (“simple” vs “advanced”). |

- **Recommendation:** Treat **C → A** as a credible path: **ship native authoring + in-app completion for pulses and short surveys** tied to **Posts/Page Builder** widgets, with a **clear data model** for responses so **WhatsApp** (`WhatsApp_Channel.md` future line) and **analytics** can attach later. Defer **full** survey-studio parity (complex branching, weighted scoring) to a phase that has **reporting** priority or partner integration.

---

## Novel ideas

- **Branching as “routing,” not entertainment:** Use conditional paths to **route** issues (safety, IT, HR) into the right **workflow** — aligns with `Internal_Support_Self_Service.md` and differentiates from “survey for survey’s sake.”
- **Scoring as segmentation, not grades:** Aggregate **risk or sentiment bands** for groups/sites (deskless **site** dimension) rather than individual leaderboards — reduces GDPR/POPIA sensitivity for pulse use cases.
- **Same post, two depths:** A **post** surfaces a **inline “quick pulse”** (3 taps) with optional **“Tell us more”** branching to a longer form — bridges Feed engagement (`Posts.md`) with richer capture.
- **Competitive wedge:** Position **in-app + WhatsApp response sync** (when WA phase lands) vs **Jem**-style WA surveys — **one** admin-authored form, **multi-channel** delivery.

---

## Risks and assumptions

- **Assumption:** Board **#6** slot remains the home for **Forms**; sequencing after **WhatsApp/AI/chat** may delay customer-visible value unless **MVP** is small enough to slot earlier.
- **Assumption:** **Product Analytics** reporting UI may **lag** instrumentation — event schema for **form views, starts, completes, abandon** should be designed **before** GA of forms if possible (`Product_Analytics.md` “instrument at GA” principle).
- **Risk:** **Anonymous vs identified** workflows (`Forms_Authoring.md`) — mixing them in one engine complicates **audit, retention, and HR fairness**; getting this wrong blocks enterprise HR use cases.
- **Risk:** **PII / consent** — submissions may contain health/safety data; **retention/export** promises must match tenant DPA (`Forms_Authoring.md` dependencies).
- **Risk:** **Scope creep** — branching + scoring + multi-language + WA in one release; **explicit** MVP cuts needed.

---

## Open questions

- **Engine split:** One forms engine for **anonymous pulse** and **identified HR**, or **two** products sharing storage? (from `Forms_Authoring.md`.)
- **Rendering:** When does the platform move from **browser** form links (`Posts.md`) to **mandatory in-app** rendering for which form types?
- **Branching depth:** Max complexity in v1 (e.g. skip logic only vs calculated fields)?
- **Scoring:** Is scoring **HR-facing only** (export to HRIS), or **employee-facing** (quiz, training) — different compliance and UX?
- **Page Builder:** Does the **inline form widget** (`Page_Builder.md`) require **embedded** rendering while feed posts stay **link-out**, or one consistent rule?
- **WhatsApp:** Which **subset** of form types maps to **quick-reply** constraints (`WhatsApp_Channel.md` future)?
- **Support product:** Does **Internal_Support_Self_Service** MVP depend on **forms + routing** first — and does that set **must-have** fields for v1?

---

## Prior notes (merged)

- **Dashboard / orchestration:** Move lanes in the product dashboard when ready; export JSON when stable.
- **Design:** Add Figma link when the discovery workshop produces mocks.
