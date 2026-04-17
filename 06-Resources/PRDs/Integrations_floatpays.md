---
prd_id: integrations-floatpays
lifecycle: discovery
created_date: 2026-03-30
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Workshop outcomes → elevate lifecycle
  - Revenue share terms in Finance-approved doc
---

# Discovery — Floatpays Integration (EWA)

**Status:** Discovery stub — agent-oriented retrofit  
**Target:** Frontline employees and employers needing earned wage access alongside Wyzetalk surfaces  
**Estimated Effort:** TBD post-discovery (large integration)

> **Status:** Pre-PRD discovery stub · **Phase:** Future (discovery not yet scheduled)

*Created: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

---

## The Job to Be Done

Employees can access **Floatpays earned wage access** through Wyzetalk surfaces (Blue app and/or WhatsApp) with employer configuration, compliant data handling, and a clear commercial model for Wyzetalk.

**User value:** Competitive parity with Paymenow/JEM-style EWA + comms bundles; potential subsidy of messaging costs via EWA economics.

---

## Work Packages

### WP-1: Discovery & commercial terms (P0)

**Priority:** P0  
**Dependencies:** No dependencies  
**Files:** Workshop notes; term sheet (TBD)  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Floatpays API/data requirements documented | Written integration brief |
| 1b | Revenue share model confirmed | Finance + Legal alignment |

### WP-2: HRIS / payroll data boundary (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1  
**Files:** Data contract TBD  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 2a | Employee eligibility inputs defined | Field list agreed |
| 2b | POPIA/NCR obligations assigned | Legal memo |

### WP-3: Surfaces — Blue + WhatsApp (P1 — Depends on WP-2)

**Priority:** P1  
**Dependencies:** WP-2; [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md)  
**Files:** Mobile: TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 3a | EWA initiation path from approved entry points | UX prototype |
| 3b | Employer admin configuration | Admin UI spec TBD |

**Dependency graph:**

```text
WP-1 ──> WP-2 ──> WP-3
```

---

## Success Scenarios

### Scenario 1: Workshop complete

**Setup:** Floatpays stakeholders engaged.  
**Action:** Run discovery workshops.  
**Observable Outcome:** Integration scope and commercial path documented.  
**Success Criteria:** Written go/no-go recommendation.

### Scenario 2: Compliance gate

**Setup:** Draft data flows.  
**Action:** Legal review.  
**Observable Outcome:** NCR/POPIA checklist signed or issues listed.  
**Success Criteria:** No unresolved high-severity legal blockers before build.

---

## Satisfaction Metric

**Overall Success:** Discovery produces a **single integration brief** approved by Leon + Finance + Legal.

**Measured by:** Sign-off minutes / email.

---

## Metrics Strategy

### Events to Track (none)

`analytics_tool: none`. Future: EWA initiation counts, transaction funnel — ties to [Product_Analytics.md](./Product_Analytics.md).

### Business Outcome Mapping

**50% revenue share** hypothesis (to confirm); strategic response to Paymenow demo / JEM positioning.

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- **Regulatory:** SA EWA / NCR / POPIA must be explicitly owned (see Open questions).  
- **Dependency:** WhatsApp / Smart HR channel assumptions per [Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md).  
- **Data:** Payroll/roster inputs — overlap with [Payslip_PDF.md](./Payslip_PDF.md) data feeds.

---

## Technical Blueprint

### System Integration Map

```text
Employee --> Wyzetalk_surface --> Floatpays_API_TBD
HRIS --> Wyzetalk_backend --> eligibility_engine_TBD
```

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Integration service | TBD |
| Mobile | TBD |
| Floatpays SDK/API | TBD |

---

## Validation Protocol

```bash
grep -c "Floatpays" "06-Resources/PRDs/Integrations_floatpays.md"
# PASS: >= 1

grep -c "Smart_HR_Whatsapp" "06-Resources/PRDs/Integrations_floatpays.md"
# PASS: >= 1
```

**Manual:** Workshop completion; legal review.

---

## Success Rate Target

**2 of 2** grep checks pass for doc consistency.

---

## Notes for Agent Implementation

**Scout priorities:** Floatpays API docs; Paymenow economics benchmark.  
**Worker tasks:** Data minimisation matrix for HRIS fields.

---

## Files to Create

```
# TBD
docs/integrations/floatpays-brief.md
```

## Files to Modify

```
# TBD — Blue app, WhatsApp flows, billing
```

---

## Out of Scope

- Full pricing calculator for tenants (until commercial model locked).  
- Non-SA regulatory regimes (unless Floatpays expands).

---

## Detailed product context (legacy)

## Context

**Floatpays** is a South African earned wage access (EWA) provider. Leon introduced the integration opportunity in the 2026-03-30 leadership session after playing a demo of Paymenow — a competitor with a WhatsApp-delivered EWA and financial inclusion product.

The competitive context (JEM, Paymenow) shows EWA bundled into WhatsApp experiences as a free comms subsidy model — clients get the communication line subsidised by the EWA transaction fees. Floatpays could be Wyzetalk's answer to this model.

## Hypothesis

Integrating Floatpays into the Blue platform gives frontline employees access to earned wage access alongside their existing comms, safety, and HR tools — potentially subsidising the communication cost and adding a meaningful financial wellness benefit that drives stickiness and differentiates from competitors.

## Commercial model (as discussed 2026-03-30)

- **Revenue share:** 50% of revenue from client usage (to be confirmed in discovery).
- Leon to lead the Floatpays relationship and discovery workshops.
- Wyzetalk's UI developer to be involved once integration requirements are clear.

## Scope indicators (to validate in discovery)

- EWA transaction initiation from within Blue app or via WhatsApp channel
- Employee-facing: request portion of earned wages before payday
- Admin-facing: employer configuration (eligible employees, limits, policies)
- Integration with payroll / HRIS data source for earned wage calculation
- Compliance: SA regulatory requirements for EWA (NCR, POPIA)
- Revenue share mechanics and reporting for Wyzetalk

## Competitive context

| Competitor | EWA / WhatsApp model |
|------------|---------------------|
| **Paymenow** | EWA via WhatsApp; free communication line subsidised by EWA fees. Leon played live demo 2026-03-30. |
| **JEM** | WhatsApp-delivered HR and financial services; active in same market. |

## Dependencies

- WhatsApp Smart HR ([Smart_HR_Whatsapp.md](./Smart_HR_Whatsapp.md)) — WhatsApp channel and Flow infrastructure would be the delivery surface for EWA interactions
- Payslip PDF / remote app path — Floatpays may consume the same HRIS data feed
- Legal / compliance review (SA EWA regulations)

## Next steps

| Task | Owner | Status |
|------|-------|--------|
| Organise discovery workshops with Floatpays team | Leon | Post-April leave |
| Define integration points and technical hooks | Leon + UI developer | After discovery |
| Scope revenue share mechanics and reporting | Leon + Finance | After discovery |

## Open questions

- What data does Floatpays require from Wyzetalk's side (employee roster, payroll data, shifts)?
- Is EWA a Wyzetalk-branded feature or a white-label Floatpays product inside Blue?
- How does Floatpays handle NCR/regulatory compliance — does that burden shift to Wyzetalk?
- Is the 50% revenue share on transaction fees, subscription, or both? (To be confirmed in discovery.)
- Can Floatpays subsidise the WhatsApp messaging cost as Paymenow does — and is that the commercial proposition to clients?

---

## Acceptance criteria (BDD)

*To be added when promoting toward `spec_ready`.*

---

*Promote to Next stub when discovery workshops are complete and scope is defined. See [README.md](./README.md) for promote path.*

*Retrofit: agent-prd — 2026-04-17*
