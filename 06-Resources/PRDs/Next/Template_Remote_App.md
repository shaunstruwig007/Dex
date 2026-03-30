# Discovery Template — Remote App (Federated)

---

> **This is a reusable template, not a feature PRD.** Copy this file and rename it when kicking off discovery for a new capability that is a candidate for the federated remote app model (Air). Fill in each section during discovery. Delete sections that don't apply.

**What is a remote app?** An independently deployed micro-frontend hosted outside the core [[Wyzetalk]] Essential shell. Accessed via a token issued by the core platform (see [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md)). Can be updated, versioned, and scaled independently without core regression cycles. Current examples: PDF payslips (FLM).

---

## Step 1 — Build path decision

Answer these questions before committing to remote app vs core feature. If most answers are (R), this is a remote app candidate. If most are (F), build it inside Essential.

| Question | Remote App (R) | Core Feature (F) | Your answer |
|----------|---------------|-----------------|-------------|
| Does it require an independent deployment/release cycle? | Yes | No | |
| Does it depend on an external data source (HRIS, payroll, ERP)? | Yes | No | |
| Would shipping it require core regression testing across all tenants? | Yes → remote | No → core | |
| Is it sensitive / compliance-critical enough to need isolated security boundary? | Yes | No | |
| Does it need elevated auth / step-up before rendering? | Likely yes | Usually no | |
| Is the audience a subset of tenants (not all)? | Yes | No | |
| Does it share UI chrome / navigation with the core app? | Shared shell, own content | Fully embedded | |
| Will it be maintained by a different team or vendor? | Yes | No | |
| Is it likely to evolve faster than the core product? | Yes | No | |

**Decision:** ☐ Remote App &nbsp;&nbsp; ☐ Core Feature &nbsp;&nbsp; ☐ Needs workshop

---

## Step 2 — Capability brief

**Working title:**

**One-line problem statement:**
> What pain does this solve for which user?

**User(s) affected:**
- Employee:
- Tenant admin:
- HR / IT:

**Trigger / entry point:**
> How does the user reach this capability? (e.g. tile in Explorer, deep link from message, direct URL, post CTA)

**Data sources required:**
> What external systems does this need to read from or write to? (HRIS, payroll, ERP, internal API)

**Estimated tenant coverage:**
> Is this relevant to all tenants, a subset (e.g. SAP clients only), or a specific vertical?

---

## Step 3 — Remote app technical brief

**Host:** Air (existing federated shell) &nbsp;·&nbsp; OR &nbsp;·&nbsp; New remote app host (state reason)

**Auth model:**
- [ ] Elevated auth token required before rendering (see [Elevated_Auth_Remote_App.md](./Elevated_Auth_Remote_App.md))
- [ ] Session token sufficient
- [ ] Public (no auth)

**Deployment:**
- [ ] Independent deploy pipeline (separate from core)
- [ ] Shared component library version: ___
- [ ] Shared header / nav chrome from core shell

**API contracts:**
> List the APIs this remote app will call on the core platform or external systems.

| API / Endpoint | Source | Read / Write | Auth required |
|----------------|--------|-------------|--------------|
| | | | |

**Token claims needed from core:**
> What user/tenant data does the remote app need in the token payload?

---

## Step 4 — Scope indicators

_List what is in scope and what is explicitly not. Be blunt._

**In scope:**

**Out of scope:**

**Open questions before design can start:**

| # | Question | Owner |
|---|----------|-------|
| | | |

---

## Step 5 — Success definition

**How will you know this works?**

| Metric | Target |
|--------|--------|
| | |

**Acceptance signal (binary):**
> What single thing has to be true for this to be considered "done"?

---

## References

- Related PRDs (Phase 1):
- Meeting notes:
- Evidence register IDs:
- Competing / analogous products:

---

*Template version: 2026-03-27. See [Next/README.md](./README.md) for merge instructions when promoted to a full PRD.*
