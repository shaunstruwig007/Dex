# Discovery — Floatpays Integration (EWA)

> **Status:** Pre-PRD discovery stub · **Phase:** Future (discovery not yet scheduled)

*Created: 2026-03-30 — [[00-Inbox/Meetings/2026-03-30 - Post Launch Priorities Essential|Post-launch priorities 2026-03-30]]*

---

## Context

**Floatpays** is a South African earned wage access (EWA) provider. Leon introduced the integration opportunity in the 2026-03-30 leadership session after playing a demo of Paymenow — a competitor with a WhatsApp-delivered EWA and financial inclusion product.

The competitive context (JEM, Paymenow) shows EWA bundled into WhatsApp experiences as a free comms subsidy model — clients get the communication line subsidised by the EWA transaction fees. Floatpays could be Wyzetalk's answer to this model.

---

## Hypothesis

Integrating Floatpays into the Blue platform gives frontline employees access to earned wage access alongside their existing comms, safety, and HR tools — potentially subsidising the communication cost and adding a meaningful financial wellness benefit that drives stickiness and differentiates from competitors.

---

## Commercial model (as discussed 2026-03-30)

- **Revenue share:** 50% of revenue from client usage (to be confirmed in discovery).
- Leon to lead the Floatpays relationship and discovery workshops.
- Wyzetalk's UI developer to be involved once integration requirements are clear.

---

## Scope indicators (to validate in discovery)

- EWA transaction initiation from within Blue app or via WhatsApp channel
- Employee-facing: request portion of earned wages before payday
- Admin-facing: employer configuration (eligible employees, limits, policies)
- Integration with payroll / HRIS data source for earned wage calculation
- Compliance: SA regulatory requirements for EWA (NCR, POPIA)
- Revenue share mechanics and reporting for Wyzetalk

---

## Competitive context

| Competitor | EWA / WhatsApp model |
|------------|---------------------|
| **Paymenow** | EWA via WhatsApp; free communication line subsidised by EWA fees. Leon played live demo 2026-03-30. |
| **JEM** | WhatsApp-delivered HR and financial services; active in same market. |

---

## Dependencies

- WhatsApp Smart HR ([WhatsApp_Smart_HR.md](../Next/WhatsApp_Smart_HR.md)) — WhatsApp channel and Flow infrastructure would be the delivery surface for EWA interactions
- Payslip PDF / remote app path — Floatpays may consume the same HRIS data feed
- Legal / compliance review (SA EWA regulations)

---

## Next steps

| Task | Owner | Status |
|------|-------|--------|
| Organise discovery workshops with Floatpays team | Leon | Post-April leave |
| Define integration points and technical hooks | Leon + UI developer | After discovery |
| Scope revenue share mechanics and reporting | Leon + Finance | After discovery |

---

## Open questions

- What data does Floatpays require from Wyzetalk's side (employee roster, payroll data, shifts)?
- Is EWA a Wyzetalk-branded feature or a white-label Floatpays product inside Blue?
- How does Floatpays handle NCR/regulatory compliance — does that burden shift to Wyzetalk?
- Is the 50% revenue share on transaction fees, subscription, or both? (To be confirmed in discovery.)
- Can Floatpays subsidise the WhatsApp messaging cost as Paymenow does — and is that the commercial proposition to clients?

---

*Promote to Next stub when discovery workshops are complete and scope is defined. See [README.md](./README.md) for promote path.*
