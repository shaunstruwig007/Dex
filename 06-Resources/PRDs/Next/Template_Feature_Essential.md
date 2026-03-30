# Discovery Template — Feature within Wyzetalk Essential

---

> **This is a reusable template, not a feature PRD.** Copy this file and rename it when kicking off discovery for a new capability being built directly inside Wyzetalk Essential (core product, not a federated remote app). Fill in each section during discovery. Delete sections that don't apply.

**What is a core feature?** A capability built into the Essential shell — shipped with the core platform, subject to the core release cycle, accessible to all tenants (or behind a tenant feature flag). Shares routing, navigation, auth, and component library with the rest of Essential.

> If you're unsure whether this should be a remote app instead, work through [Template_Remote_App.md](./Template_Remote_App.md) first — specifically Step 1 (build path decision). Come back here when you've confirmed it belongs in core.

---

## Step 1 — Feature placement

**Where does this live in the product?**

| Surface | Examples | This feature? |
|---------|---------|--------------|
| Feed | Posts, reactions, comments | ☐ |
| Explorer | Category tiles, static pages | ☐ |
| Messaging / Ops | Urgent Alerts, Standard Messages | ☐ |
| Profile / Settings | User profile, preferences, opt-ins | ☐ |
| Tenant Admin | Tenant Management, User Importer, Theming | ☐ |
| Notifications | Push, SMS, WhatsApp delivery | ☐ |
| Page Builder | Articles, widgets, linked pages | ☐ |
| New surface (describe below) | | ☐ |

**If new surface — describe the entry point:**

**Pillar:**
- [ ] New product launch (Essential scope)
- [ ] Client migration enablement
- [ ] AI in PDLC

**Feature flag required?** ☐ Yes — tenant opt-in &nbsp;&nbsp; ☐ No — all tenants at GA

---

## Step 2 — Problem statement

**Who has the problem?**
- Primary user:
- Secondary user (if any):

**What is the problem?**
> In 2–3 sentences: what can't they do today, and what is the impact?

**Evidence / signals:**
> Deal losses, support tickets, customer interviews, market signals. Reference Evidence register IDs where applicable.

| Evidence | ID | Signal |
|----------|-----|--------|
| | | |

---

## Step 3 — Goals and non-goals

**Goals:**
1.
2.
3.

**Non-goals (explicitly out of scope):**
-
-

---

## Step 4 — User stories

| ID | As a… | I want to… | So that… |
|----|-------|-----------|---------|
| US-01 | | | |
| US-02 | | | |

---

## Step 5 — Skeleton requirements

> List the must-have requirements (bones of the feature). No flesh yet — that comes in the full PRD.

- [ ]
- [ ]
- [ ]

**Dependencies on existing Phase 1 PRDs:**

| PRD | Dependency |
|-----|-----------|
| | |

**New shared components or services needed:**

---

## Step 6 — Phase 1 vs Phase 2 split

> Be explicit about what ships first and what is deferred. Avoid scope creep by naming the deferred items upfront.

**Ships in Phase 2 (this discovery):**

**Explicitly deferred to Phase 3+:**

---

## Step 7 — Open questions

| # | Question | Owner | Blocks design? |
|---|----------|-------|---------------|
| OQ-01 | | | |

---

## Step 8 — Success definition

| Metric | Target | Measurement method |
|--------|--------|-------------------|
| | | |

**Acceptance signal (binary):**
> What single thing has to be true for this to be considered "done"?

---

## References

- Related Phase 1 PRDs:
- Meeting notes:
- Evidence register IDs:
- Design references / inspiration:

---

*Template version: 2026-03-27. Promote to a full PRD (with ACs) before handing to design. See [Next/README.md](./README.md) for merge instructions.*
