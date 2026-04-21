import { defineConfig, devices } from "@playwright/test";

const TEST_DB = "./data/test-pdlc.db";

export default defineConfig({
  testDir: "./e2e",
  retries: process.env.CI ? 1 : 0,
  // One SQLite file + one Next.js server are shared across specs — parallel
  // workers race on mutations (e.g. CRUD test leaves rows that flip the axe
  // spec's EmptyState → List path mid-run). Keep serial until S2 introduces
  // per-worker DB isolation.
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Isolate e2e from local dev DB; wiped in globalSetup.
      PDLC_DB_PATH: TEST_DB,
      // Unlock the `/api/test/seed-brief` helper so swim-lanes.spec.ts can
      // simulate the S3 brief gate without a real wizard. The route 404s
      // unless this is exactly "1" — see src/app/api/test/seed-brief/route.ts.
      PDLC_ALLOW_TEST_HELPERS: "1",
    },
  },
  globalSetup: "./e2e/global-setup.ts",
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
