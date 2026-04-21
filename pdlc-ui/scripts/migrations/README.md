# Legacy JSON-migration directory

Superseded by the SQLite migration chain under
[`src/storage/migrations/`](../../src/storage/migrations/). Kept empty to avoid
confusion — if Sprint-1 deployments ever fall back to the JSON atomic-write
path documented in [ADR-0001](../../docs/adr/0001-stack-and-persistence.md),
future one-shot JSON migration scripts can land here.

For the active path:

1. Add the next `NNN_description.sql` file under `src/storage/migrations/`.
2. Run `npm run db:migrate` locally; `/api/ready` applies it on the next boot
   in non-dev environments.
3. Update [`schema-initiative-v0.md`](../../../plans/PDLC_UI/schema-initiative-v0.md)
   - [`initiative.ts`](../../src/schema/initiative.ts) + the golden fixture in
     the **same PR** (R16 guardrail 1).
