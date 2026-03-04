import { describe, expect, test } from "vitest";
import {
  buildRecommendationPlan,
  clampDurationScale,
  normalizeSessionLength,
  selectSessionLength
} from "../src/modules/recommendation.js";

describe("recommendation module", () => {
  test("clamps duration scale", () => {
    expect(clampDurationScale(2)).toBe(1.25);
    expect(clampDurationScale(0.3)).toBe(0.75);
    expect(clampDurationScale(1)).toBe(1);
  });

  test("normalizes session length", () => {
    expect(normalizeSessionLength("deep")).toBe("deep");
    expect(normalizeSessionLength("invalid")).toBe("standard");
  });

  test("selects session length from minutes", () => {
    expect(selectSessionLength(2)).toBe("quick");
    expect(selectSessionLength(8)).toBe("standard");
    expect(selectSessionLength(15)).toBe("deep");
    expect(selectSessionLength(25)).toBe("full");
  });

  test("returns recovery plan for high soreness", () => {
    const recommendation = buildRecommendationPlan({
      readiness: { energy: 2, soreness: 5, mood: 2 },
      stats: { weekly: 1, streak: 1, sessionsCompleted: 1 },
      profile: { modeBias: "manual", tempoBias: -0.08 },
      latestReflection: null,
      formAverage: 2,
      highSoreness: true,
      inDeloadWeek: false,
      timeAvailableMin: 25
    });

    expect(recommendation.label).toBe("Recovery");
    expect(recommendation.intensity).toBe("Low");
  });
});
