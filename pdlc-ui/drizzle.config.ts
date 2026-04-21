import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration — used only by CLI introspection tools today.
 *
 * Runtime migrations live in `src/storage/migrations/*.sql` and are applied
 * by `src/storage/migrate.ts`. We do **not** use `drizzle-kit push` or the
 * generator for S1: the schema is small, raw SQL is easier to review, and we
 * keep one migration story. Re-evaluate once we pass ~3 tables (ADR-0001
 * Consequences).
 */
export default defineConfig({
  schema: "./src/storage/schema.ts",
  out: "./src/storage/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.PDLC_DB_PATH ?? "./data/pdlc.db",
  },
  verbose: true,
  strict: true,
});
