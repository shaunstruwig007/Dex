/**
 * Atomic persistence helpers — Sprint 0 stub.
 * Sprint 1 implements SQLite WAL + busy_timeout or JSON atomic rename + schemaVersion.
 */

export type WriteResult =
  | { ok: true }
  | { ok: false; reason: "revision_conflict" | "io_error"; detail?: string };

/** Placeholder — replace with real atomic write in Sprint 1. */
export async function writeInitiativeAtomic(
  path: string,
  payload: unknown,
): Promise<WriteResult> {
  void path;
  void payload;
  return {
    ok: false,
    reason: "io_error",
    detail: "Not implemented until Sprint 1",
  };
}
