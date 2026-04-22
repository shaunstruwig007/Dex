# Architecture Decision Records (ADRs)

**What:** Short-lived markdown files that capture **irreversible** engineering choices — stack, persistence, auth, hosting, CI host, anything costly to reverse without rework.

**When to write one:** Before merging code that locks a decision. If you can undo in an hour without data loss, a PR comment may suffice.

**Format:** `NNNN-short-slug.md` — use [`0000-template.md`](./0000-template.md).

**Index**

| ADR                                     | Title                                          |
| --------------------------------------- | ---------------------------------------------- |
| [0001](./0001-stack-and-persistence.md)      | Stack + persistence (Next.js + SQLite vs JSON)                      |
| [0002](./0002-git-host-ci-runner.md)         | Git host + CI runner + branch protection                            |
| [0003](./0003-dnd-shape-and-html5-ban.md)    | DnD shape (`@dnd-kit/core` only) + HTML5 `draggable` ban + keyboard sensor deferred |

Governance: [plans/PDLC_UI/plan.md § R16](../../../../plans/PDLC_UI/plan.md).
