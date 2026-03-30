# Messaging: Ops & Urgent Alerts — Acceptance criteria & edge cases

**Source PRD:** [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md)
**Related:** [Groups.md](./Groups.md) (audience), [Communication.md](./Communication.md) (channels), [Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) (PIN-* pinned urgent), [Tenant_Management.md](./Tenant_Management.md) (currency, SMS rates, **WhatsApp config — TC-24 to TC-36**), [Notifications.md](./Notifications.md) (in-app surfaces), [WhatsApp_Channel_acceptance_criteria.md](./WhatsApp_Channel_acceptance_criteria.md) (**WhatsApp delivery ACs — WA-19 to WA-29 — defer to that file; not duplicated here**).
**Integration map:** [PRD_Product_Map.md](../PRD_Product_Map.md)  
**Use:** Eng / QA / design review — **human-owned**.

---

## Scope reminder

- **Urgent:** all enabled channels, **no** channel opt-out for send, **app takeover** (non-dismissable until ack), **pinned feed** block (expanded/collapse), mandatory SMS 160-char, pre-send cost modal, lifecycle states through Resolved/Deleted.  
- **Operational:** never urgent semantics — **no** takeover, **no** pin, **no** silent override, **no** mandatory ack; channel mix admin-selected.  
- **WhatsApp delivery:** now in scope — ACs live in [WhatsApp_Channel_acceptance_criteria.md](./WhatsApp_Channel_acceptance_criteria.md) (WA-19 to WA-29). Not duplicated here.
- **Out Phase 1:** Two-way WhatsApp / chat, PDF attachments, queued time estimates.

---

## Acceptance criteria — Urgent alerts

| ID | Criterion |
|----|-----------|
| URG-01 | **Given** an urgent alert is **Active** **when** an employee opens the app **then** **full-screen takeover** appears before normal navigation; user **cannot** proceed without acknowledgement. |
| URG-02 | **Given** the alert is **updated** **when** the employee next foregrounds the app **then** takeover **re-shows** until acknowledged for the new version *(per PRD “re-triggered if updated”)*. |
| URG-03 | **Given** admin composes urgent content **when** saving/sending **then** required elements are present: sender/company, threat description, location, protective action, timing *(+ PRD “light AI validation” if implemented)*. |
| URG-04 | **Given** SMS leg **when** admin enters body **then** **160 characters** max enforced with validation errors before send. |
| URG-05 | **Given** admin initiates send **when** confirmation opens **then** modal shows **warning copy**, **recipient count**, **estimated cost**; Cancel and Confirm both work. |
| URG-06 | **Given** audience selection **when** configuring **then** options match Groups primitives: **Everyone**, **Saved group**, **Directory**, **New group** — same as Posts/Messaging PRD. |
| URG-07 | **Given** admin **resolves** an alert **when** resolving **then** **compulsory resolution update** is required before state moves to resolved per lifecycle. |

---

## Acceptance criteria — Pinned feed (coordination with Feed AC)

| ID | Criterion |
|----|-----------|
| PIN-XREF-01 | Pinned urgent behaviour on the business feed matches **[Feed_acceptance_criteria.md](./Feed_acceptance_criteria.md) PIN-01–PIN-06** and **SF-05** (pin visible during search). |

---

## Acceptance criteria — Operational messages

| ID | Criterion |
|----|-----------|
| OPS-01 | **Given** operational message **when** delivered **then** it is **never** labelled urgent, **never** pinned to feed, **never** triggers takeover, **never** overrides silent mode, **never** requires acknowledgement. |
| OPS-02 | **Given** admin creates operational send **when** choosing channels **then** allowed combinations include SMS-only, notification-only, SMS+notification, email *(per PRD)*. |
| OPS-03 | **Given** 1:1 or small directory selection **when** sending **then** audience matches Groups/directory behaviour. |

---

## Acceptance criteria — Analytics & cost

| ID | Criterion |
|----|-----------|
| AN-01 | **Given** any send **when** completed **then** statuses include at least: Sent, Delivered, Failed, Pending, channels used, timestamps, unique recipients *(per PRD)*. |
| AN-02 | **Given** urgent **when** reporting **then** acknowledgement status and **time-to-resolve** are available to admins. |
| COST-01 | **Given** pre-send **when** modal shows cost **then** tenant **currency** and **SMS rate** come from tenant config ([Tenant_Management.md](./Tenant_Management.md)). |
| COST-02 | **Given** reporting views **when** admin opens spend **then** urgent vs operational and SMS vs in-app/push are **separable**. |

---

## Edge cases & negative paths

| Area | Edge / negative | Expected behaviour (draft) |
|------|-----------------|----------------------------|
| **Offline** | User offline during urgent | Queue takeover on next open; align with PRD open question on offline. |
| **Concurrent urgencies** | Multiple active | Match Feed AC PIN-06 / product decision single vs multiple. |
| **Cost estimate** | Unknown audience size | Block or show range — **steerco**. |
| **Operational** | Admin selects email only | No push/SMS; respects OPS-01. |

---

## Resolved product decisions *(from Feed AC / map)*

| Topic | Decision | Notes |
|--------|-----------|--------|
| **Operational vs feed** | Operational **not** feed-pinned | Per PRD; business feed stays clean. |

---

## Outstanding

- **Estimated cost in Phase 1** — PRD open question (Steerco).  
- **Legal** mining/safety regulations by jurisdiction — compliance review.  
- **Edit sent operational** — PRD open question.

---

*Review with Feed AC and Communication AC together.*
