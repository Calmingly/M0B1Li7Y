import { describe, expect, test } from "vitest";
import { computeStreakDays, toDayKey } from "../src/modules/date-utils.js";
import { computeHistoryInsights, computeWeeklyQuest } from "../src/modules/insights.js";

describe("date and insights modules", () => {
  test("computes streak days from day keys", () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const streak = computeStreakDays([toDayKey(yesterday), toDayKey(today)]);
    expect(streak).toBe(2);
  });

  test("computes weekly quest shape", () => {
    const today = toDayKey(new Date());
    const quest = computeWeeklyQuest([today, today], [today], [new Date().toISOString()]);
    expect(quest.total).toBe(9);
    expect(quest.done).toBeGreaterThan(0);
  });

  test("builds basic history insights", () => {
    const now = new Date();
    const insights = computeHistoryInsights({
      readiness: [{ dayKey: toDayKey(now), score: 72 }],
      sessionLog: [{ completedAt: now.toISOString(), durationSec: 900 }],
      dayProgressEdits: { [toDayKey(now)]: 6 },
      routineStepsLength: 12
    });

    expect(insights.readinessAvg).toBeGreaterThan(0);
    expect(insights.bestHour).not.toBeNull();
  });
});
