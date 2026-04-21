# Sprint smoke checklists

**Purpose:** short, human-readable steps you can run after a sprint merges (or before a demo) without re-reading the whole PR. They complement **CI** — they do not replace `npm test`, `npm run test:e2e:a11y`, or MoneyPenny’s gauntlet.

**When to run**

- **Optional** on every merge if CI is green and you did not touch user-visible behaviour.
- **Recommended** after merge when the sprint changed UX, lifecycle rules, persistence, or anything Steerco might click.
- **Required** before an internal-host rollout or stakeholder demo (pair with [OPERATIONS.md](../OPERATIONS.md) readiness checks).

**Naming:** one file per shipped sprint: `S<n>-<short-slug>.md` (matches `seeds/s<n>-*.md` in `plans/PDLC_UI/seeds/`).

**Automation map:** each checklist calls out the Playwright spec that already encodes the same path, so you can trust CI for day-to-day and use this doc when you want eyes on the product.

| Sprint | Checklist                                  | Automated mirror                             |
| ------ | ------------------------------------------ | -------------------------------------------- |
| S1     | [S1-idea-capture.md](./S1-idea-capture.md) | `e2e/ideas-crud.spec.ts`, `e2e/a11y.spec.ts` |
| S2     | [S2-swim-lanes.md](./S2-swim-lanes.md)     | `e2e/swim-lanes.spec.ts`, `e2e/a11y.spec.ts` |
