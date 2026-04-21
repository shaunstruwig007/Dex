import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Wipe the e2e SQLite files before the Playwright webServer starts so each
 * CI run (and local rerun) begins from a deterministic empty DB.
 */
export default async function globalSetup() {
  const base = resolve(process.cwd(), "data", "test-pdlc.db");
  for (const suffix of ["", "-wal", "-shm"]) {
    const path = `${base}${suffix}`;
    if (existsSync(path)) rmSync(path, { force: true });
  }
}
