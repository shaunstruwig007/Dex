# Initiative card-state schema — v0.1 (draft)

**Purpose:** Single source of truth for the **shape** of an initiative on the PDLC board. Every skill (`/pdlc-brief-custom`, `/pdlc-idea-gate-custom`, `/agent-prd`, future hosted agents) reads and writes **this shape** — not arbitrary markdown. The `pdlc-ui` renders it. Dex skills consume it.

**Companions:** [plan.md](./plan.md) · [lifecycle-transitions.md](./lifecycle-transitions.md) · [skill-agent-map.md](./skill-agent-map.md) · [PDLC_Orchestration_UI.md](../../04-Projects/PDLC_Orchestration_UI.md).

**Canonical case:** **camelCase** for all fields ([plan R16](./plan.md#engineering-governance-cto--tech-lead--anti-drift)). Snake_case in older prose is legacy — update when touched.

**Update discipline:** Any PR that changes a lifecycle value, transition rule, or initiative field must update **this file** in the same PR (plan R16 guardrail 1).

---

## 1. Why a typed contract, not free-form markdown

The long-term thesis of this plan is **Agent Flywheel** (plan Phase 2): hosted workers run skills against card context **on event**, not only when a PM opens a chat. For that to be safe:

- Skills need a **deterministic input shape** (they cannot guess which headings a prior skill used).
- Skills need a **deterministic output shape** (the next skill, the UI, and the audit log all read the same fields).
- Humans need **confidence + source tags** per field so human-in-loop review collapses to "confirm the low-confidence items" instead of re-reading markdown.
- Backward moves and "Re-run discovery/spec" need **staleness rules** that live with the field, not in skill prose.

**Principle:** Skills conform to the card schema — not the other way around.

---

## 2. Top-level shape

```json
{
  "schemaVersion": 1,
  "revision": 3,
  "id": "uuid-or-slug",
  "handle": "INIT-0042",
  "title": "",
  "body": "",
  "lifecycle": "idea",
  "parkedIntent": null,
  "parkedReason": null,
  "sortOrder": null,
  "createdAt": "2026-04-21T09:15:00Z",
  "updatedAt": "2026-04-21T09:15:00Z",

  "gate": { },
  "brief": { },
  "discovery": { },
  "design": { },
  "spec": { },
  "release": { },

  "sourceRefs": [ ],
  "attachments": [ ],
  "events": [ ],

  "linkedPrdPath": null,
  "strategyPillarIds": [],
  "strategyWarning": null
}
```

**Rules:**

- **`lifecycle`** values: `idea` · `discovery` · `design` · `spec_ready` · `develop` · `uat` · `deployed` · `parked`.
- **`revision`** increments on every write — enables optimistic locking (plan R17, end of S1).
- **`handle`** is the human-readable id; **`id`** is the internal (uuid or generated slug).
- **`sortOrder`** is an integer or `null` (nullable for fresh cards — they land at the top of a lane until a human reorders via drag-to-reorder). Added in S2 ([003_sort_order.sql](../../pdlc-ui/src/storage/migrations/003_sort_order.sql)). Transitioning a card to a new lane clears `sortOrder` back to `null` so it appears at the top of the destination lane.
- **`parkedIntent`** + **`parkedReason`** are mutually required whenever `lifecycle === "parked"` (enforced via `canTransition` — see [`pdlc-ui/src/lib/can-transition.ts`](../../pdlc-ui/src/lib/can-transition.ts)). Un-parking (`parked → idea`) clears both back to `null`.
- Each **stage sub-object** (`gate`, `brief`, `discovery`, `design`, `spec`, `release`) is **owned** by one skill; others may read but should not write.
- **`events[]`** is append-only audit (stage transitions + key field edits).

---

## 3. Field envelope (every skill-written field)

Every field produced by a skill uses this envelope so review, staleness, and agent trust are consistent:

```json
{
  "value": "…any shape…",
  "confidence": "high | med | low",
  "source": "user | agent_draft | meeting_cited | signal_cited | imported",
  "sourceRef": null,
  "reviewedBy": null,
  "reviewedAt": null,
  "updatedAt": "2026-04-21T09:15:00Z"
}
```

**`source` values:**

| Value | Meaning |
|-------|---------|
| `user` | Human typed it directly in the UI or wizard. |
| `agent_draft` | A skill or hosted agent drafted it. Needs human confirmation before `reviewedBy` is set. |
| `meeting_cited` | Extracted from a Granola / meeting note; `sourceRef` points at the meeting path. |
| `signal_cited` | Extracted from `Market_intelligence/` or `Market_and_deal_signals.md`; `sourceRef` points at the signal row or file. |
| `imported` | Legacy import (e.g. from an existing PRD); treat as `user` for review purposes. |

**Review contract:** A field with `source != user` and `reviewedBy == null` is **"awaiting human confirmation"** and the UI should badge it (yellow for `med`, red for `low`, quiet check for `high`).

---

## 4. Stage sub-objects

### 4.1 `gate` — idea gate (`/pdlc-idea-gate-custom` output)

Runs at **`idea → discovery`** as an **optional** nudge (not a hard block in MVP — plan Bar A). Produces a lightweight go/no-go so `/pdlc-brief-custom` doesn't run on things that should never have left the idea column.

```json
"gate": {
  "recommendation": { "value": "do_now | do_next | later | no_go | needs_discovery", "confidence": "med", "source": "agent_draft" },
  "strategicFit": { "value": "high | med | low", "confidence": "med", "source": "agent_draft" },
  "roughEffort": { "value": "s | m | l | xl", "confidence": "low", "source": "agent_draft" },
  "origin": { "value": "customer | internal | competitive | strategic", "confidence": "high", "source": "user" },
  "tradeOff": { "value": "What we're NOT doing if we do this", "confidence": "med", "source": "user" },
  "primaryBeneficiary": { "value": "who", "confidence": "med", "source": "user" },
  "strategyWarning": null
}
```

**Writeable by:** `/pdlc-idea-gate-custom`.
**Read by:** UI (idea card badge), `/pdlc-brief-custom` (skips questions already answered at the gate), `/roadmap`, `/project-health`.

### 4.2 `brief` — discovery brief (`/pdlc-brief-custom` output)

Runs at **`idea → discovery`** as a stepwise popup (plan R4). **Ends at the understanding summary + brief save** — does not generate a PRD (that's `/agent-prd`'s job).

**Shape after 2026-04-21 (S3A.1 brief shrink):** the brief is **three questions** — *why* (`coreValue`), *who* (`targetUsers`), *what* (`problem`) — plus a one-paragraph `understandingSummary`. Scope / assumptions / success metrics moved to **discovery** (`/pdlc-discovery-research-custom`, S3B) and **spec** (`/agent-prd`). Legacy fields remain in the schema as **optional** for backward compat with pre-2026-04-21 cards; new cards leave them empty.

```json
"brief": {
  "problem":       { "value": "", "confidence": "high", "source": "user" },
  "targetUsers":   { "value": "", "confidence": "high", "source": "user" },
  "coreValue":     { "value": "", "confidence": "high", "source": "user" },
  "understandingSummary": { "value": "", "confidence": "med", "source": "agent_draft" },
  "complete": false,
  "reviewedBy": null,
  "reviewedAt": null,

  "scopeIn":           { "value": [], "confidence": "med", "source": "user" },
  "scopeOut":          { "value": [], "confidence": "med", "source": "user" },
  "assumptions":       [
    { "text": "", "validation": "how to test", "confidence": "low", "source": "agent_draft", "reviewedBy": null }
  ],
  "constraints":       { "value": "", "confidence": "med", "source": "user" },
  "successDefinition": { "value": "", "confidence": "med", "source": "user" }
}
```

**`brief.complete`:** when `true`, the PM finished the **`/pdlc-brief-custom` wizard** (or equivalent); `deriveHasBrief` / `canTransition` treat this as the gate for `idea → discovery`. Set only by the atomic `POST /api/initiatives/:id/brief` path (S3) together with full envelope writes and `brief.reviewedAt` / `brief.reviewedBy`.

**Required-for-complete (wizard + server):** `problem`, `targetUsers`, `coreValue`. `understandingSummary` is auto-synthesised by the skill (or a one-line fallback from the three required fields) — it is persisted but not user-typed in a dedicated step. Enforced in **three places:** client wizard validation, runtime Zod `briefSchema` in [`pdlc-ui/src/schema/initiative.ts`](../../pdlc-ui/src/schema/initiative.ts), and `saveBriefAndTransition` in [`pdlc-ui/src/storage/repository.ts`](../../pdlc-ui/src/storage/repository.ts) (`422` with `missing_required_fields` + `fields[]`).

**Legacy-field handling:** `scopeIn`, `scopeOut`, `assumptions[]`, `constraints`, `successDefinition` are **not** surfaced by the S3A.1 wizard and **not** required for `brief.complete`. They remain **optional** in `briefSchema` so existing cards keep validating; `/pdlc-discovery-research-custom` (S3B) writes equivalents to `discovery.*` fields (e.g. `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.openQuestions[]`) rather than to `brief.*`. Do not re-introduce them in the wizard without a same-PR schema-doc + skill-doc update.

**Design rationale (2026-04-21):** see the S3A.1 Progress log entry and the [pdlc-brief-custom SKILL.md](../../.claude/skills/pdlc-brief-custom/SKILL.md) "Design rationale" note. TL;DR: the brief is a **thesis gate**, not a PRD; asking for scope / assumptions / hard success metrics at brief-time produced low-confidence drafts the PM had to unpick.

**Writeable by:** `/pdlc-brief-custom` (UI wizard + server prefill endpoint).
**Read by:** `/pdlc-discovery-research-custom` (reads brief + gate to scope discovery research), `/agent-prd` (mandatory ingest at `spec_ready`), UI card **Brief** tab in the Initiative Modal, discovery export pack.

### 4.3 `discovery` — open questions + research

```json
"discovery": {
  "openQuestions": [
    {
      "id": "oq-1",
      "text": "How do we handle SSO for enterprise?",
      "owner": "shaun",
      "status": "open | resolved | wontfix",
      "answer": null,
      "answeredAt": null,
      "source": "user",
      "sourceRef": null
    }
  ],
  "researchNotes": { "value": "", "confidence": "med", "source": "user" },
  "competitorSnapshot": { "value": [], "confidence": "low", "source": "agent_draft" },
  "customerEvidence": [
    { "quote": "", "person": "", "date": "", "sourceRef": "People/External/..." }
  ],
  "iteration": 1,
  "lastRerunAt": null
}
```

**Writeable by:** UI (open-question CRUD) + **`/pdlc-discovery-research-custom`** (S3B — primary writer: research notes, competitor snapshot, customer evidence, drafts of open questions) + future per-card `/customer-intel --initiative`, `/intelligence-scanning --initiative`.
**Staleness rule:** if any `brief.*` field's `updatedAt` is newer than `discovery.lastRerunAt`, UI should offer "Re-run discovery" (invokes `/pdlc-discovery-research-custom` with the cached brief + gate + fresher sources).

### 4.4 `design`

```json
"design": {
  "figmaLibraryUrl": null,
  "claudeDesignSessionUrl": null,
  "loFiArtifactUrl": null,
  "hiFiRequired": false,
  "hiFiArtifactUrl": null,
  "claudeDesignHandoffPath": null,
  "implementationPolishNote": null,
  "review": {
    "status": "pending | passed | waived",
    "waiverReason": null,
    "by": "shaun",
    "at": null
  }
}
```

**Writeable by:** UI (links), `/anthropic-frontend-design` (sets `implementationPolishNote`), `/design-review-custom` (future — sets `review`).

### 4.5 `spec` — PRD + clarifications

```json
"spec": {
  "prdPath": null,
  "clarifications": [
    { "id": "cl-1", "question": "", "answer": null, "source": "agent_draft", "status": "open | resolved" }
  ],
  "bddRequested": false,
  "specComplete": false,
  "handoffBundlePath": null,
  "swarm": {
    "lastRun": null,
    "findings": []
  }
}
```

**Writeable by:** `/agent-prd` (and future `/pdlc-handoff-bundle-custom`).
**Key change from today:** `clarifications` are **card-level objects**, not chat turns — unlocks the "async card prompts later" option in plan R8 without a skill rewrite.

### 4.6 `release` — post-`develop` (R14)

```json
"release": {
  "userFacingNotes": { "value": "", "confidence": "med", "source": "agent_draft" },
  "metricsCheck": {
    "targets": [],
    "lastCheckedAt": null,
    "status": "not_started | pending | met | missed"
  }
}
```

**Writeable by:** future `/pdlc-release-notes-custom`, future `/metrics-review-custom`.

---

## 5. `sourceRefs[]` — evidence attached to the card

Phase 3+ anchor (plan table, "Intelligence & meeting correlation").

```json
"sourceRefs": [
  { "kind": "meeting", "path": "00-Inbox/Meetings/2026-04-14_Acme_review.md", "note": "SSO pain" },
  { "kind": "signal",  "path": "06-Resources/Market_and_deal_signals.md#row-EV-0087", "note": "competitor move" },
  { "kind": "customer", "path": "People/External/Sarah_Chen_Acme.md", "note": "frontline use case" },
  { "kind": "prd", "path": "06-Resources/PRDs/Feature_X.md", "note": "related" }
]
```

---

## 6. `events[]` — append-only audit

```json
{
  "at": "2026-04-21T09:15:00Z",
  "by": "shaun",
  "kind": "stage_transition | field_edit | skill_run | review",
  "payload": {
    "from": "idea",
    "to": "discovery",
    "note": "optional"
  }
}
```

**Shipped kinds:**

- **S1 —** `create`, `delete`.
- **S2 —** `stage_transition` (lane moves) and `field_edit` (sortOrder reorders; see below).
- **S3 —** `skill_run` (brief wizard — payload `{ skill, iteration }` enforced in Zod).
- **Reserved —** `review` (extend as the need arises; closed enum in [`pdlc-ui/src/schema/initiative.ts`](../../pdlc-ui/src/schema/initiative.ts)).

**Payload shapes (S2 + S3):**

| `kind` | `payload` |
|--------|-----------|
| `create` | `{ "handle": "INIT-0042" }` |
| `delete` | `{ "handle": "INIT-0042", "note"?: string }` (in `deleted_initiative_events`) |
| `stage_transition` | `{ "from": Lifecycle, "to": Lifecycle, "note"?: string, "parkedIntent"?: "revisit" \| "wont_consider", "parkedReason"?: string }` — parked fields are included only on `→ parked` moves. |
| `field_edit` | `{ "field": "sortOrder", "before": number \| null, "after": number }` — S2 scope limits `field_edit` to `sortOrder`. Expanding to other fields requires a schema-doc update + golden-fixture example in the same PR. |
| `skill_run` | `{ "skill": "pdlc-brief-custom", "iteration": number }` — `iteration` is computed **server-side** as `count(prior skill_run events for this (initiativeId, skill)) + 1` and is **monotonic per `(initiativeId, skill)` pair** (starts at `1`; never decrements; never reused). Clients MUST NOT set `iteration` themselves. Runtime Zod rejects missing keys or wrong types (doc ↔ code parity). **Known skill ids:** `pdlc-brief-custom` (S3; three-question shape from S3A.1); `pdlc-brief-prefill-custom` (S3A.2 — prefill for the three brief fields); `discovery-kickoff-custom` (S3A.2 — deterministic-stub kickoff + summary write); **`pdlc-discovery-research-custom`** (S3B — replaces the stub; reads brief + gate + market intelligence + meetings; writes `discovery.*`; designed to re-run on a weekly cadence against all `discovery`-column cards). New skill ids join this list same-PR with the first write. |

**Tombstone trail (S1):** Bar A ships **hard-delete**, so the per-initiative `events` array disappears with the row. The `delete` event is retained in the `deleted_initiative_events` SQLite table (see [`pdlc-ui/src/storage/migrations/002_deleted_events.sql`](../../pdlc-ui/src/storage/migrations/002_deleted_events.sql)).

---

## 7. Staleness rules (declared here, enforced by UI)

| Trigger | Stale object | UI action |
|---------|--------------|-----------|
| `brief.*.updatedAt > discovery.lastRerunAt` | `discovery.researchNotes` | Offer "Re-run discovery" |
| `discovery.openQuestions[].status == resolved` after `spec.*.updatedAt` | `spec.prdPath` | Offer "Re-run spec" |
| `design.*.updatedAt` after `spec.prdPath` generated | `spec.prdPath` | Offer "Regenerate PRD §Design Requirements" |
| `lifecycle == idea` after any `→ idea` wipe transition | everything except `title`, `body` | Hard-wipe per plan lifecycle-transitions |

Skills **read** these rules to decide whether a cached answer is still valid; the UI **renders** them as offers.

---

## 8. Skill I/O contracts (summary)

Each PDLC skill declares what it reads and what it writes. Full detail lives in each skill's `SKILL.md`; this is the index.

| Skill | Reads | Writes | Triggered by |
|-------|-------|--------|--------------|
| `/pdlc-idea-gate-custom` | `title`, `body`, `strategyPillarIds`, recent `sourceRefs` | `gate.*` | `idea` card open (optional) |
| `/pdlc-brief-custom` | `title`, `body`, `gate.*`, `sourceRefs` | `brief.problem`, `brief.targetUsers`, `brief.coreValue`, `brief.understandingSummary`, `brief.complete` | `idea → discovery` column move |
| `/pdlc-discovery-research-custom` *(S3B)* | `brief.*`, `gate.*`, `title`, `body`, `sourceRefs[]`, `06-Resources/Market_intelligence/*`, `Market_and_deal_signals.md`, `company_strategy.md`, `System/icp.md` (once it exists), `People/External/*` meetings | `discovery.researchNotes`, `discovery.competitorSnapshot`, `discovery.customerEvidence[]`, `discovery.openQuestions[]` (draft), `discovery.research.summary`, `discovery.iteration`, `discovery.lastRerunAt` | Kickoff on `idea → discovery` lane move (replaces the S3A.3 `discovery-kickoff-custom` stub); weekly re-run sweep against all `discovery`-column cards; manual "Re-run discovery" from the Initiative Modal's Discovery tab. |
| `/agent-prd` | `brief.*`, `discovery.*`, `design.*`, `strategyPillarIds` | `spec.*`, `linkedPrdPath` | `spec_ready` column entry |
| `/anthropic-frontend-design` | `design.loFiArtifactUrl`, `design.claudeDesignHandoffPath`, brief problem | `design.implementationPolishNote` | Cursor session after Claude Design |
| `/design-review-custom` *(future)* | `design.*` | `design.review.*` | Stage 6 gate |
| `/pdlc-release-notes-custom` *(future)* | `brief.*`, `spec.*` | `release.userFacingNotes` | `develop` column entry |
| `/metrics-review-custom` *(future)* | `spec.prdPath` frontmatter `target_metrics` | `release.metricsCheck.*` | `deployed` + schedule |

---

## 9. Minimal TypeScript (for when code starts)

```ts
type Confidence = "high" | "med" | "low";
type Source = "user" | "agent_draft" | "meeting_cited" | "signal_cited" | "imported";

interface Field<T> {
  value: T;
  confidence: Confidence;
  source: Source;
  sourceRef?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  updatedAt: string;
}

type Lifecycle =
  | "idea" | "discovery" | "design" | "spec_ready"
  | "develop" | "uat" | "deployed" | "parked";

interface Initiative {
  schemaVersion: 1;
  revision: number;
  id: string;
  handle: string;
  title: string;
  body: string;
  lifecycle: Lifecycle;
  parkedIntent: "revisit" | "wont_consider" | null;
  parkedReason: string | null;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;

  gate?: GateState;
  brief?: BriefState;
  discovery?: DiscoveryState;
  design?: DesignState;
  spec?: SpecState;
  release?: ReleaseState;

  sourceRefs: SourceRef[];
  attachments: Attachment[];
  events: Event[];

  linkedPrdPath?: string | null;
  strategyPillarIds?: string[];
  strategyWarning?: string | null;
}
```

Expand each sub-interface in `pdlc-ui/` once Sprint 0 picks the stack.

---

## 10. Open decisions (resolve as sprints approach)

**Sprint 0 runtime contract (Zod + CI golden fixture):** keep **`attachments[]`** and **`sourceRefs[]`** as separate arrays (attachments = user-pasted links; sourceRefs = agent-cited evidence) — revisit only if storage cost bites. **Card-level `updatedAt` only** for MVP JSON/SQLite; field-level `updatedAt` inside skill envelopes remains per-field inside `brief.*`, etc.

- [ ] **Soft-delete** — add `deletedAt` + `deletedBy` to the root shape, or rely on the events log? *(Deferred — decide before Steerco-wide delete UX.)*
- [ ] **`strategyPillarIds`** — reuse `System/pillars.yaml` ids or wait for R12 `company_strategy.md` artefact (plan Phase 5 #12)?

---

*Created 2026-04-21 — v0.1 draft, aligned to plan.md Phase A schema list and Bar A / Phase 2 transition thesis.*
