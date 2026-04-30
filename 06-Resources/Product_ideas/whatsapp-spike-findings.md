---
note_type: engineering-spike-findings
related_initiative: smart-hr-whatsapp
captured_date: 2026-04-30
captured_by: Shaun (paraphrasing Jan Vosloo's verbal report from internal tech-forum meeting; no recording exists)
status: paraphrased — Jan to validate before bond_v1 PRD enters spec_ready
related:
  - 06-Resources/Product_ideas/smart-hr-whatsapp_discovery.md
  - 06-Resources/PRDs/Smart_HR_Whatsapp.md
  - 06-Resources/PRDs/Elevated_Auth_Remote_App.md
  - 06-Resources/PRDs/Payslip_PDF.md
---

# WhatsApp Smart HR — engineering spike findings (paraphrased)

> **Provenance:** Jan Vosloo reported back informally in an internal tech-forum meeting after the 2026-03-30 leadership session prioritised this work. **No recording exists.** This note is Shaun's paraphrase, captured 2026-04-30. Jan should validate before the bond_v1 PRD enters `spec_ready`.

---

## What the spike confirmed

| # | Finding | Confidence |
|---|---|---|
| 1 | **WhatsApp Flow + endpoint connection: feasible.** The integration approach works — WhatsApp Flow can call into Wyzetalk's backend endpoints and exchange the structured data needed for HR self-service (payslip, leave, roster). | high (Jan reported feasible) |
| 2 | **Media URL pattern is the proposed payslip transport.** Payslip PDFs would be served via a media URL approach (likely signed, time-limited URLs) consumed by WhatsApp Flow / WABA. **Needs stress testing.** Concurrent payslip pulls at month-end (when ~1,000s of employees fetch simultaneously) is the load profile to validate. | medium — needs load test before commit |
| 3 | **Sage is the first HRIS integration target.** Payslip data for the first slice will be pulled from Sage. This answers Open Question 5 from the discovery doc (PaySpace? SAP? Sage? Custom?) — **Sage is the answer for Slice 1.** PaySpace / SAP / custom remain TBD for later slices. | high |
| 4 | **Elevated / validation auth required for first access.** First time an employee accesses sensitive HR content via WhatsApp must include a step-up identity proof. Cannot rely on phone-as-identity alone for first access. This couples to `Elevated_Auth_Remote_App.md` Phase 1. | high |
| 5 | **Engineering capacity constrained.** Team is not yet free to do this. Pressure from the Wyzetalk Essential MVP and bug-fix backlog is consuming the capacity. The bond_v1 PRD slice plan needs to assume a delayed start, not a "ready next week" start. | high (organisational reality) |

---

## What the spike did NOT determine

(Carrying forward from the discovery doc's Open Questions.)

- **BSP selection** — no decision yet. Affects per-message markup, MAU pricing.
- **Concrete media URL signing model** — JWT-style? Signed S3? WABA-native attachment? Affects security review.
- **Concurrent load behaviour at month-end** — must be stress-tested before Slice 1 enters production. Failure mode: media URL endpoint times out, employees see broken payslip retrieval at the worst possible moment (payday).
- **Magic Link auth implementation timing** — depends on `Elevated_Auth_Remote_App.md` Phase 1 workshop (task-20260323-008) which has not been scheduled.
- **Tenant-config seam with `Messaging_Ops_Urgent_Alerts.md` Part 2** — Part 2 ships next week. Slice 1 needs to confirm WABA tenant-config compatibility with Part 2's broadcast use of the same WABA infrastructure.

---

## Risks surfaced by the spike

| # | Risk | Severity | Mitigation owner |
|---|---|---|---|
| R1 | Media URL pattern fails under month-end concurrent load → broken payslip retrieval on payday | High | Engineering — stress test in Slice 1 demo readiness; fallback to async push instead of pull |
| R2 | Sage integration introduces vendor-specific quirks not yet in vault | Medium | Engineering — capture Sage data contract in bond_v1 PRD's Build Handoff |
| R3 | Capacity constraint pushes Slice 1 demo target beyond end-May 2026 | High | Product (Shaun → Design Manager handoff) — escalate at next exec session if MVP bug-fix burn-down isn't on a known glide path |
| R4 | Elevated Auth Phase 1 workshop unscheduled → Slice 2 Magic Link timing unknown | Medium | Elevated Auth PRD owner |

---

## Open follow-ups for the bond_v1 PRD

1. Slice 1 demo-readiness checklist must include: **media URL stress test passed at month-end concurrency level** (named numerically — ≥1,000 concurrent retrievals).
2. Slice 1 build-handoff snapshot must include: **Sage data contract** (field names, auth model, rate limits).
3. Risks section must include all four risks above (R1–R4) under "Technical failure modes" subsection.
4. Capacity constraint should appear in the Status line on Smart_HR_Whatsapp.md so the design manager and stakeholders see it without reading the whole PRD.

---

*This note exists because the discovery doc flagged "engineering spike verbal-only" as the highest-priority evidence gap (gap #2). Capturing the paraphrase closes the gap to "paraphrased — pending Jan validation." Jan should review and either ratify or correct before the bond_v1 PRD enters `spec_ready`.*
