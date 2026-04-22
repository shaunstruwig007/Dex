"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Card-density toggle — see `pdlc-ui/docs/design/board-layout.md` §4.
 *
 * Three modes ("compact" | "comfortable" | "detailed") swap CSS custom
 * properties (`--card-py`, `--card-gap`, `--card-lines`) by writing
 * `data-board-density="…"` on the document root. Concrete values live in
 * `pdlc-ui/src/styles/tokens.css`; this hook owns the **state**, not the
 * pixel values.
 *
 * Persistence: `localStorage` under `BOARD_DENSITY_STORAGE_KEY`. First-load
 * default = "comfortable". The hook is SSR-safe (it reads storage in an
 * effect, not during render).
 */

export const BOARD_DENSITY_VALUES = [
  "compact",
  "comfortable",
  "detailed",
] as const;
export type BoardDensity = (typeof BOARD_DENSITY_VALUES)[number];
export const BOARD_DENSITY_DEFAULT: BoardDensity = "comfortable";
export const BOARD_DENSITY_STORAGE_KEY = "pdlc.board.density";
export const BOARD_DENSITY_ATTR = "data-board-density";

function isBoardDensity(value: unknown): value is BoardDensity {
  return (
    typeof value === "string" &&
    (BOARD_DENSITY_VALUES as readonly string[]).includes(value)
  );
}

function applyDensityAttr(value: BoardDensity) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute(BOARD_DENSITY_ATTR, value);
}

export function useBoardDensity(): {
  density: BoardDensity;
  setDensity: (next: BoardDensity) => void;
} {
  const [density, setDensityState] = useState<BoardDensity>(
    BOARD_DENSITY_DEFAULT,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(BOARD_DENSITY_STORAGE_KEY);
      if (isBoardDensity(stored)) {
        setDensityState(stored);
        applyDensityAttr(stored);
        return;
      }
    } catch {
      // localStorage may be unavailable (private mode / quota) — fall back
      // silently to the in-memory default.
    }
    applyDensityAttr(BOARD_DENSITY_DEFAULT);
  }, []);

  const setDensity = useCallback((next: BoardDensity) => {
    setDensityState(next);
    applyDensityAttr(next);
    try {
      window.localStorage.setItem(BOARD_DENSITY_STORAGE_KEY, next);
    } catch {
      // ignore — UI state is updated in memory regardless.
    }
  }, []);

  return { density, setDensity };
}

/**
 * Pure helper for tests / SSR — reads the stored value without subscribing
 * to React state. Returns the default when storage is missing or invalid.
 */
export function readBoardDensityFromStorage(
  storage: Pick<Storage, "getItem"> | null | undefined,
): BoardDensity {
  if (!storage) return BOARD_DENSITY_DEFAULT;
  try {
    const value = storage.getItem(BOARD_DENSITY_STORAGE_KEY);
    return isBoardDensity(value) ? value : BOARD_DENSITY_DEFAULT;
  } catch {
    return BOARD_DENSITY_DEFAULT;
  }
}
