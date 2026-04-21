# Schema migrations (stub — Sprint 0)

Initiative JSON uses `schemaVersion` at the root. When the contract in
`plans/PDLC_UI/schema-initiative-v0.md` changes:

1. Bump `schemaVersion` in the schema + regenerate `src/schema/initiative.schema.json`
   (`npm run generate:schema`).
2. Add a one-shot script under this directory: `NNN_description.mjs` that reads
   old shape, writes new shape (read-old-write-new).
3. Document the migration in `pdlc-ui/docs/adr/` if the change is non-trivial.

No migration chain ships until Sprint 1 persistence is live.
