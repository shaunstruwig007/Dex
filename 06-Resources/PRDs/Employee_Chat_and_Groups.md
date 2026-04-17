---
prd_id: employee-chat-and-groups
lifecycle: discovery
created_date: 2026-04-17
last_status_update: 2026-04-17
source: legacy_upgrade
project_mgmt_tool: none
issue_id: null
analytics_tool: none
shipped_date: null
metrics_checked_date: null
follow_up_tasks:
  - Engineering spike: first-party realtime vs CPaaS — record ADR before locking Technical Blueprint
  - Discovery workshop: group creation / membership rules (no PRD default until then)
  - Confirm moderation and retention model with Legal
  - Align event schema with Product Analytics when stack exists
---

# Discovery — Employee chat (1:1 & groups)

**Status:** Discovery — agent-oriented retrofit  
**Target:** Employees needing peer and small-group chat distinct from ops messaging and FAQ bots  
**Estimated Effort:** 40–80 hours agent time (post-discovery sizing)

> **Status:** Pre-PRD discovery stub · **Phase:** Next (post–Essential GA)

### Collaborative pilot (product decisions — 2026-04-17)

| Decision | Shaun’s call |
|----------|----------------|
| **Phase 1 GA scope** | **DM (1:1) and employee group chat** ship in the **same** Phase 1 GA — not DM-only with groups deferred. |
| **Who may create group chats** | **Undecided until discovery** — no default in this PRD (role-gated vs permissive vs other). |
| **Realtime / chat backend** | **Undecided** — **engineering spike** required before committing to first-party vs CPaaS/vendor; PRD must not imply a chosen stack yet. |

---

## The Job to Be Done

Employees can have **peer and group conversations** (1:1 and groups) with clear separation from **organisational/ops messaging**, **urgent alerts**, and **AI/bot** threads, under tenant policy.

**User value:** Matches market expectation for workplace chat without conflating social/team dialogue with system-generated comms.

---

## Work Packages

### WP-1: Domain model & separation of concerns (P0 — No dependencies)

**Priority:** P0  
**Dependencies:** No dependencies  
**Files:** Spec docs (TBD); policy matrix (TBD)  
**VPS-eligible:** Yes

| # | Behavior | Observable |
|---|----------|------------|
| 1a | Chat is distinct from Messaging Ops / Urgent / Standard Message | Architecture doc names channels |
| 1b | Bot vs human threads classified | UX rules documented |

### WP-2: Core chat MVP (P0 — Depends on WP-1)

**Priority:** P0  
**Dependencies:** WP-1; [Notifications.md](./Notifications.md); tenant policy hooks  
**Files:** Mobile: TBD · Backend: TBD  
**VPS-eligible:** No

| # | Behavior | Observable |
|---|----------|------------|
| 2a | **DM** between users allowed by tenant policy | E2E smoke in UAT |
| 2b | **Group** create/join baseline — **creation rules TBD in discovery** (pilot 2026-04-17) | Flow + policy doc after workshop |

### WP-3: Moderation & compliance (P1 — Depends on WP-2)

**Priority:** P1  
**Dependencies:** WP-2  
**Files:** Admin tools TBD  
**VPS-eligible:** Partial

| # | Behavior | Observable |
|---|----------|------------|
| 3a | Retention/export stance per tenant | Legal sign-off path |
| 3b | Basic moderation (report/block TBD) | Scope in discovery |

**Dependency graph:**

```text
WP-1 (P0) ──> WP-2 (P0) ──> WP-3 (P1)
```

---

## Success Scenarios

### Scenario 1: DM happy path

**Setup:** Two employees allowed to chat; notifications enabled.  
**Action:** User A starts DM with B.  
**Observable Outcome:** Thread opens; message delivered; B notified per policy.  
**Success Criteria:** UAT script passes for one tenant configuration.

### Scenario 3: Group happy path (same GA as DM)

**Setup:** Tenant policy allows group action under rules **to be defined in discovery**; notifications enabled.  
**Action:** User creates or joins a group per approved flow.  
**Observable Outcome:** Group thread works end-to-end; members notified per policy.  
**Success Criteria:** UAT passes for one group configuration **after** creation rules are decided (pilot 2026-04-17: **DM + groups** in one GA).

### Scenario 2: Boundary — ops message is not chat

**Setup:** Same user receives ops broadcast.  
**Action:** User opens ops vs chat inbox (exact UX TBD).  
**Observable Outcome:** Surfaces do not merge into one ambiguous thread list.  
**Success Criteria:** Design review sign-off + documented separation rule.

---

## Satisfaction Metric

**Overall Success:** 100% of UAT separation tests pass (ops vs chat routing).

**Measured by:** Scripted UAT + product sign-off.

---

## Metrics Strategy

### Events to Track (none in vault)

`analytics_tool: none`. Defer product events until [Product_Analytics.md](./Product_Analytics.md) / stack decision. Candidate names: `chat_thread_opened`, `chat_message_sent` (TBD).

### Business Outcome Mapping

Supports post–Essential roadmap item **#3 Employee Chat** (steerco ordering — confirm current stack in [Explorer.md](./Explorer.md) priority context if needed).

---

## Architecture Constraints

**Non-Negotiable Decisions:**

- Clear separation from [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (org messaging).  
- Distinct from [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md) (bot).  
- **Phase 1 GA includes both DM and group chat** (pilot 2026-04-17) — not a DM-only launch with groups later.  
- **Group creation / membership rules** are **not** defaulted in this PRD — **discovery workshop** decides (pilot 2026-04-17).  
- **Realtime stack** (build vs vendor) is **not** locked here — **spike first** (pilot 2026-04-17).  
- Tenant policy on **who can chat with whom** remains in scope for discovery.

---

## Technical Blueprint

### System Integration Map

```text
Employee --> chat_client --> chat_backend_TBD --> persistence_TBD
Notifications --> push/email_SMS --> [Notifications PRD]
```

**Stack note (pilot 2026-04-17):** `chat_backend_TBD` — **engineering spike** compares first-party realtime vs CPaaS/vendor; **no default** in this PRD until spike outcome is recorded.

### Implementation repository paths (TBD)

| Layer | Path |
|-------|------|
| Mobile | TBD |
| Realtime / sync | **Spike → ADR** (undecided) |
| Compliance export | TBD |

### Config & Setup

TBD post-discovery — tenant flags for chat enablement, allowed domains, retention, **and group-creation policy** once workshop decides.

---

## Validation Protocol

```bash
# Spec references Notifications PRD
grep -c "Notifications" "06-Resources/PRDs/Employee_Chat_and_Groups.md"
# PASS: >= 1

grep -c "Messaging_Ops_Urgent_Alerts" "06-Resources/PRDs/Employee_Chat_and_Groups.md"
# PASS: >= 1
```

**Manual:** Full chat E2E on device.

### Post-launch metrics

DAU/MAU for chat — requires analytics instrumentation.

---

## Success Rate Target

**2 of 2** static grep checks pass on each doc update.

---

## Notes for Agent Implementation

**Scout priorities:** Matrix vs Slack model; compliance (SA POPIA) for retention.  
**Worker tasks:** Discovery workshop output → revise WPs.  
**Soldier review:** No accidental merge with ops messaging inbox.

---

## Files to Create

```
# TBD
docs/policies/chat-tenant-policy.md
```

## Files to Modify

```
# TBD — mobile shell, notification routing
```

---

## Out of Scope

- Federation with external IM (open question — may become in scope later).  
- Full enterprise eDiscovery (unless Legal mandates — discovery).

---

## Detailed product context (legacy)

## Hypothesis

**Peer and group chat** (employee ↔ employee) is a distinct capability from Phase 1 **Messaging: Ops & Urgent Alerts** and from **AI assistant** threads—needs one coherent model.

## Scope indicators (to validate)

- DM, group create/join, moderation basics  
- Clear separation: **org/ops messaging** vs **social/team chat** vs **bot**

## Related specs

- [Messaging_Ops_Urgent_Alerts.md](./Messaging_Ops_Urgent_Alerts.md) (Phase 1)  
- [AI_Assistant_FAQ.md](./AI_Assistant_FAQ.md)

## Dependencies

- Notifications, presence (if any), tenant policy on “who can chat with whom”

## Open questions

- **Who can create group chats and membership rules** — workshop decision (no PRD default; pilot 2026-04-17).  
- **Realtime architecture** — result of engineering spike (first-party vs vendor).  
- Federation with external IM? Archive/compliance retention per tenant?

---

## Acceptance criteria (BDD)

*To be added when promoting toward `spec_ready`.*

---

*See [README.md](./README.md) for promote path.*

*Retrofit: agent-prd — 2026-04-17 · collaborative pilot decisions merged — 2026-04-17*
