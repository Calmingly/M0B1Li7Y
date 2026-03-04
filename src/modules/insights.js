import { countInCurrentWeek, countInLastDays, toDayKey } from "./date-utils.js";

export function computeConsistencyScore(activeDayKeys, checkinDays, streak) {
  const active14 = countInLastDays(activeDayKeys, 14);
  const checkins14 = countInLastDays(checkinDays, 14);
  const adherenceScore = (active14 / 14) * 55;
  const checkinScore = (checkins14 / 14) * 25;
  const streakScore = Math.min(1, streak / 10) * 20;
  return Math.round(adherenceScore + checkinScore + streakScore);
}

export function computeWeeklyQuest(activeDayKeys, checkinDays, buddyPings) {
  const sessionsDone = Math.min(4, countInCurrentWeek(activeDayKeys));
  const checkinsDone = Math.min(3, countInCurrentWeek(checkinDays));
  const buddyDone = Math.min(2, countInCurrentWeek(buddyPings.map((iso) => toDayKey(iso))));
  const done = sessionsDone + checkinsDone + buddyDone;
  const total = 9;
  return {
    done,
    total,
    percent: Math.round((done / total) * 100)
  };
}

export function computeMonthlyChallenge(sessionLog) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthSessions = sessionLog.filter((entry) => entry.completedAt?.slice(0, 7) === monthKey).length;

  if (monthSessions >= 26) return { level: "Elite", target: 26, sessions: monthSessions, unlock: "Elite Aura Theme" };
  if (monthSessions >= 20) return { level: "Gold", target: 20, sessions: monthSessions, unlock: "Gold Edge Badges" };
  if (monthSessions >= 14) return { level: "Silver", target: 14, sessions: monthSessions, unlock: "Silver Coach Card" };
  return { level: "Bronze", target: 8, sessions: monthSessions, unlock: "Starter Pack" };
}

export function buildCoachTimeline(recommendation, sessionLog, labelForSessionLength, sessionLength) {
  const latestSession = sessionLog[0];
  const yesterday = latestSession
    ? `${Math.max(1, Math.round((latestSession.durationSec || 0) / 60))} min ${latestSession.preset === "rescue" ? "Rescue" : "Flow"}`
    : "No session logged";
  const today = `${recommendation.label} • ${labelForSessionLength(sessionLength)} session`;
  const tomorrow = recommendation.intensity === "High"
    ? "Aim to hold quality under load"
    : recommendation.intensity === "Moderate"
      ? "Build consistency with clean reps"
      : "Prioritize recovery and mobility range";

  return { yesterday, today, tomorrow };
}

export function buildWeeklyWrapup(activeDayKeys, sessionLog) {
  const today = new Date();
  const isSunday = today.getDay() === 0;
  if (!isSunday) return "Weekly wrap-up appears Sunday.";

  const weeklySessions = countInCurrentWeek(activeDayKeys);
  const weeklyMinutes = Math.round(
    sessionLog
      .filter((entry) => toDayKey(entry.completedAt) >= toDayKey(new Date(Date.now() - 6 * 86400000)))
      .reduce((sum, entry) => sum + (entry.durationSec || 0), 0) / 60
  );

  return `Weekly wrap-up: ${weeklySessions} sessions • ${weeklyMinutes} minutes • keep momentum into next week.`;
}

export function computeHistoryInsights({ readiness, sessionLog, dayProgressEdits, routineStepsLength }) {
  const readinessRows = Array.isArray(readiness)
    ? readiness.filter((entry) => entry && entry.dayKey)
    : [];
  const recentReadiness = readinessRows.slice(0, 7);
  const readinessAvg = recentReadiness.length === 0
    ? null
    : recentReadiness.reduce((sum, entry) => sum + Number(entry.score || 0), 0) / recentReadiness.length;

  const sessionsByHour = new Map();
  sessionLog.forEach((entry) => {
    const hour = new Date(entry.completedAt).getHours();
    sessionsByHour.set(hour, (sessionsByHour.get(hour) || 0) + 1);
  });

  let bestHour = null;
  let bestCount = 0;
  sessionsByHour.forEach((count, hour) => {
    if (count > bestCount) {
      bestCount = count;
      bestHour = hour;
    }
  });

  let skippedCount = 0;
  Object.values(dayProgressEdits || {}).forEach((value) => {
    const progress = Number(value);
    if (Number.isFinite(progress) && progress > 0 && progress < routineStepsLength) {
      skippedCount += 1;
    }
  });

  return {
    readinessAvg,
    bestHour,
    bestHourCount: bestCount,
    skippedPattern: skippedCount > 0 ? "Finish phase" : "No clear skip pattern yet"
  };
}
