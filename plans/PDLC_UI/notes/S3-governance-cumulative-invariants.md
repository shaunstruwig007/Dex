# S3 governance — Cumulative invariants vs product scope

**Decision (Build start, 2026-04-21 plan):** The **Cumulative invariants** block + **ADR-0004** called out in `04-Projects/PDLC_Orchestration_UI.md` Slice log (2026-04-21 row) are **not bundled into the S3 product PR**. They land as a **separate governance PR** when ready so S3 stays scoped to the brief wizard + atomic API + schema tightening.

**Rationale:** R16 guardrail 4 — mixing governance doc/prelude churn with the S3 vertical slice increases review surface and risks conflating “process rails” with “shipping Bar A loop”.

**Follow-up:** When the governance PR merges, append S3’s row to the Cumulative invariants block per north-star § Slice log ceremony.
