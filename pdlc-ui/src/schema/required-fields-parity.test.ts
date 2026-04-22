import { describe, it, expect } from "vitest";
import { REQUIRED_BRIEF_FIELDS } from "@/content/brief-steps";
import { REQUIRED_FOR_COMPLETE_BRIEF } from "@/schema/initiative";

/**
 * Anti-drift guard for the "required-for-complete brief" contract.
 *
 * The contract is surfaced in two runtime locations:
 *   - `REQUIRED_BRIEF_FIELDS` in `src/content/brief-steps.ts` — drives the
 *     wizard UI + the content-file invariant (`assertRequiredFlagsInContent`).
 *   - `REQUIRED_FOR_COMPLETE_BRIEF` in `src/schema/initiative.ts` — drives
 *     the Zod `superRefine` on `briefSchema` + the `saveBriefAndTransition`
 *     server-side guard in `src/storage/repository.ts`.
 *
 * Both must stay in sync. If they ever diverge the wizard and the server
 * will disagree about what "complete" means, producing a silent 422 loop or
 * accepting an incomplete brief. This test fails the build on drift so the
 * two constants stay a single logical contract.
 *
 * Schema doc of record: `plans/PDLC_UI/schema-initiative-v0.md` §4.2.
 */
describe("required-for-complete-brief contract", () => {
  it("content array and schema constant are the same set", () => {
    expect([...REQUIRED_BRIEF_FIELDS].sort()).toEqual(
      [...REQUIRED_FOR_COMPLETE_BRIEF].sort(),
    );
  });
});
