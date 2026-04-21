import { describe, expect, it } from "vitest";
import type { Lifecycle } from "@/schema/initiative";
import {
  canTransition,
  deriveHasBrief,
  type CanTransitionContext,
} from "./can-transition";

const defaultCtx: CanTransitionContext = {
  hasBrief: false,
  parkedIntent: null,
  parkedReason: null,
};

const ALL_LIFECYCLES: Lifecycle[] = [
  "idea",
  "discovery",
  "design",
  "spec_ready",
  "develop",
  "uat",
  "deployed",
  "parked",
];

const LEGAL_FORWARD: Array<[Lifecycle, Lifecycle]> = [
  ["discovery", "design"],
  ["design", "spec_ready"],
  ["spec_ready", "develop"],
  ["develop", "uat"],
  ["uat", "deployed"],
];

describe("canTransition — forward matrix", () => {
  it("allows each legal forward edge", () => {
    for (const [from, to] of LEGAL_FORWARD) {
      const result = canTransition(from, to, { ...defaultCtx, hasBrief: true });
      expect(result, `${from} -> ${to}`).toEqual({ ok: true });
    }
  });

  it("allows idea → discovery only when brief is complete", () => {
    const blocked = canTransition("idea", "discovery", {
      ...defaultCtx,
      hasBrief: false,
    });
    expect(blocked).toEqual({
      ok: false,
      reason: "brief_required",
      message: "Complete the product brief in Sprint 3.",
    });

    const allowed = canTransition("idea", "discovery", {
      ...defaultCtx,
      hasBrief: true,
    });
    expect(allowed).toEqual({ ok: true });
  });

  it("rejects same-lifecycle as same_lifecycle", () => {
    for (const lifecycle of ALL_LIFECYCLES) {
      const result = canTransition(lifecycle, lifecycle, defaultCtx);
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.reason).toBe("same_lifecycle");
    }
  });

  it("rejects skip-forward edges (e.g. idea → design)", () => {
    const result = canTransition("idea", "design", {
      ...defaultCtx,
      hasBrief: true,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("illegal_transition");
  });

  it("rejects every backward edge in Sprint 2", () => {
    const backward: Array<[Lifecycle, Lifecycle]> = [
      ["discovery", "idea"],
      ["design", "discovery"],
      ["spec_ready", "design"],
      ["spec_ready", "discovery"],
      ["develop", "spec_ready"],
      ["uat", "develop"],
      ["deployed", "uat"],
    ];
    for (const [from, to] of backward) {
      const result = canTransition(from, to, {
        ...defaultCtx,
        hasBrief: true,
      });
      expect(result.ok, `${from} -> ${to}`).toBe(false);
      if (!result.ok) expect(result.reason).toBe("illegal_transition");
    }
  });

  it("rejects any forward move out of deployed (other than parked)", () => {
    for (const to of ALL_LIFECYCLES) {
      if (to === "deployed" || to === "parked") continue;
      const result = canTransition("deployed", to, {
        ...defaultCtx,
        hasBrief: true,
      });
      expect(result.ok, `deployed -> ${to}`).toBe(false);
    }
  });
});

describe("canTransition — parked branch", () => {
  const validPark: CanTransitionContext = {
    hasBrief: true,
    parkedIntent: "revisit",
    parkedReason: "Waiting on SSO scoping",
  };

  it("allows parking from any forward lane with intent + reason", () => {
    const parkable: Lifecycle[] = [
      "idea",
      "discovery",
      "design",
      "spec_ready",
      "develop",
      "uat",
      "deployed",
    ];
    for (const from of parkable) {
      const result = canTransition(from, "parked", validPark);
      expect(result, `${from} -> parked`).toEqual({ ok: true });
    }
  });

  it("rejects parked → parked", () => {
    const result = canTransition("parked", "parked", validPark);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("same_lifecycle");
  });

  it("requires non-empty trimmed parkedReason", () => {
    for (const reason of [undefined, null, "", "   ", "\t\n"]) {
      const result = canTransition("idea", "parked", {
        hasBrief: true,
        parkedIntent: "revisit",
        parkedReason: reason as string | null | undefined,
      });
      expect(result.ok, `reason=${JSON.stringify(reason)}`).toBe(false);
      if (!result.ok) {
        expect(result.reason).toBe("parked_requires_intent_and_reason");
      }
    }
  });

  it("requires a valid parkedIntent", () => {
    const result = canTransition("idea", "parked", {
      hasBrief: true,
      parkedIntent: undefined,
      parkedReason: "valid reason",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("parked_requires_intent_and_reason");
    }
  });

  it("allows un-park from parked → idea only", () => {
    const ok = canTransition("parked", "idea", defaultCtx);
    expect(ok).toEqual({ ok: true });

    for (const to of ALL_LIFECYCLES) {
      if (to === "idea" || to === "parked") continue;
      const result = canTransition("parked", to, defaultCtx);
      expect(result.ok, `parked -> ${to}`).toBe(false);
      if (!result.ok) expect(result.reason).toBe("illegal_transition");
    }
  });
});

describe("deriveHasBrief", () => {
  it("is false for an empty brief", () => {
    expect(deriveHasBrief({ brief: {} })).toBe(false);
  });

  it("is true once the brief has any key", () => {
    expect(deriveHasBrief({ brief: { problem: { value: "x" } } })).toBe(true);
  });
});
