import { describe, expect, it } from "vitest";
import {
  BOARD_DENSITY_ATTR,
  BOARD_DENSITY_DEFAULT,
  BOARD_DENSITY_STORAGE_KEY,
  BOARD_DENSITY_VALUES,
  readBoardDensityFromStorage,
} from "./use-board-density";

/**
 * Q3 (S3A.1 [`/agent-q-cto-custom`](../../../.claude/skills/agent-q-cto-custom/SKILL.md))
 * — pure-helper coverage for the density persistence contract.
 *
 * The React hook (`useBoardDensity`) is a thin wrapper around
 * `readBoardDensityFromStorage` + `localStorage.setItem` + a DOM attribute
 * write. Testing the pure helper + the contract invariants is enough to
 * catch the regressions Q3 cared about (silent fallback on bad storage,
 * stable default, narrowed type guard) without pulling testing-library
 * just for one hook.
 */

function makeStorage(initial: Record<string, string> = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    snapshot: () => Object.fromEntries(store.entries()),
  };
}

describe("BOARD_DENSITY constants", () => {
  it("default is one of the allowed values", () => {
    expect(BOARD_DENSITY_VALUES).toContain(BOARD_DENSITY_DEFAULT);
  });

  it("storage key is namespaced under `pdlc.board.`", () => {
    expect(BOARD_DENSITY_STORAGE_KEY.startsWith("pdlc.board.")).toBe(true);
  });

  it("attribute name is the documented `data-board-density`", () => {
    expect(BOARD_DENSITY_ATTR).toBe("data-board-density");
  });

  it("declares exactly compact / comfortable / detailed (board-layout.md §4)", () => {
    expect([...BOARD_DENSITY_VALUES]).toEqual([
      "compact",
      "comfortable",
      "detailed",
    ]);
  });
});

describe("readBoardDensityFromStorage", () => {
  it("returns the default when storage is missing", () => {
    expect(readBoardDensityFromStorage(null)).toBe(BOARD_DENSITY_DEFAULT);
    expect(readBoardDensityFromStorage(undefined)).toBe(BOARD_DENSITY_DEFAULT);
  });

  it("returns the default when no value is stored", () => {
    const storage = makeStorage();
    expect(readBoardDensityFromStorage(storage)).toBe(BOARD_DENSITY_DEFAULT);
  });

  it("returns each valid stored value as-is", () => {
    for (const v of BOARD_DENSITY_VALUES) {
      const storage = makeStorage({ [BOARD_DENSITY_STORAGE_KEY]: v });
      expect(readBoardDensityFromStorage(storage)).toBe(v);
    }
  });

  it("returns the default when the stored value is an unknown string", () => {
    const storage = makeStorage({ [BOARD_DENSITY_STORAGE_KEY]: "spacious" });
    expect(readBoardDensityFromStorage(storage)).toBe(BOARD_DENSITY_DEFAULT);
  });

  it("returns the default when the stored value is empty", () => {
    const storage = makeStorage({ [BOARD_DENSITY_STORAGE_KEY]: "" });
    expect(readBoardDensityFromStorage(storage)).toBe(BOARD_DENSITY_DEFAULT);
  });

  it("returns the default and never throws when storage.getItem throws", () => {
    const throwing: Pick<Storage, "getItem"> = {
      getItem: () => {
        throw new Error("quota exceeded");
      },
    };
    expect(() => readBoardDensityFromStorage(throwing)).not.toThrow();
    expect(readBoardDensityFromStorage(throwing)).toBe(BOARD_DENSITY_DEFAULT);
  });
});
