import { migrate } from "./migrate";

/**
 * Ensure migrations have been applied. Safe to call repeatedly; caches the
 * result across the process so request handlers pay at most one lookup.
 */
let initialised: Promise<void> | null = null;

export function ensureStorageReady(): Promise<void> {
  if (!initialised) {
    initialised = new Promise<void>((resolve, reject) => {
      try {
        migrate();
        resolve();
      } catch (err) {
        initialised = null;
        reject(err);
      }
    });
  }
  return initialised;
}
