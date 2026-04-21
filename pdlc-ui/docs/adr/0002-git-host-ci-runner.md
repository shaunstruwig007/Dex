# ADR 0002 — Git host + CI runner + branch protection (Sprint 0)

## Status

Accepted

## Context

Steerco-facing `pdlc-ui` ships from this monorepo. [plans/PDLC_UI/plan.md](../../../../plans/PDLC_UI/plan.md) **R16** requires **green CI before merge to default** and **branch-per-cycle** (no feature commits on `main`).

## Decision

1. **Git host:** GitHub (this repository).
2. **CI runner:** **GitHub Actions** — workflow [`.github/workflows/pdlc-ui-ci.yml`](../../../../.github/workflows/pdlc-ui-ci.yml) on `pull_request` + `push` to `main` when `pdlc-ui/**` or the golden fixture path changes.
3. **Branch protection (checklist — apply when repo policy allows):**
   - Require PR before merging to `main`.
   - Require status check **pdlc-ui CI / ci** (job name) green.
   - Disallow force-push to `main`.
   - Include administrators where ICT policy allows.

## Consequences

- Solo flow: open `feat/sN-*` branches; merge via PR; CI must pass.
- If the repo moves to GitLab, supersede this ADR and update workflow paths.
