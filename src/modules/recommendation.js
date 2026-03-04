function clampReadiness(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 3;
  return Math.max(1, Math.min(5, Math.round(parsed)));
}

export function clampDurationScale(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(0.75, Math.min(1.25, parsed));
}

export function normalizeSessionLength(value) {
  const allowed = new Set(["quick", "standard", "deep", "full"]);
  return allowed.has(value) ? value : "standard";
}

export function selectSessionLength(minutes) {
  const safeMinutes = Number(minutes) || 15;
  if (safeMinutes <= 3) return "quick";
  if (safeMinutes <= 10) return "standard";
  if (safeMinutes <= 18) return "deep";
  return "full";
}

export function labelForSessionLength(length) {
  const labels = {
    quick: "Quick",
    standard: "Standard",
    deep: "Deep",
    full: "Full"
  };
  return labels[normalizeSessionLength(length)] || "Standard";
}

export function buildRecommendationPlan({
  readiness,
  stats,
  profile,
  latestReflection,
  formAverage,
  highSoreness,
  inDeloadWeek,
  timeAvailableMin
}) {
  const energy = clampReadiness(readiness?.energy);
  const soreness = clampReadiness(readiness?.soreness);
  const mood = clampReadiness(readiness?.mood);
  const safeProfile = profile || { modeBias: "manual", tempoBias: 0 };
  const suggestedLength = selectSessionLength(timeAvailableMin);

  const score = Math.round(((energy + mood + (6 - soreness)) / 15) * 100);
  const weeklyBonus = stats.weekly >= 3 ? 4 : 0;
  const consistencyBonus = stats.streak >= 4 ? 4 : 0;
  const reflectionBias = latestReflection?.form <= 2 ? -6 : latestReflection?.effort >= 4 && latestReflection?.form >= 4 ? 4 : 0;
  const formBias = formAverage <= 1.7 ? -5 : formAverage >= 2.7 ? 3 : 0;
  const deloadBias = inDeloadWeek ? -8 : 0;
  const sorenessBias = highSoreness ? -12 : 0;
  const adjusted = Math.max(0, Math.min(100, score + weeklyBonus + consistencyBonus + reflectionBias + formBias + deloadBias + sorenessBias));

  if (highSoreness || adjusted <= 45) {
    return {
      score: adjusted,
      label: "Recovery",
      intensity: "Low",
      mode: safeProfile.modeBias === "auto" ? "manual" : safeProfile.modeBias,
      durationScale: clampDurationScale(0.82 + safeProfile.tempoBias),
      suggestedLength: suggestedLength === "full" ? "deep" : suggestedLength,
      headline: highSoreness ? "High soreness detected. Switching to recovery pacing." : "Focus on quality movement and breath control.",
      description: "Today’s coach call: slower tempo, controlled ranges, and smooth transitions to keep consistency without overload."
    };
  }

  if (adjusted <= 75) {
    return {
      score: adjusted,
      label: "Base Build",
      intensity: "Moderate",
      mode: safeProfile.modeBias === "manual" ? "manual" : stats.weekly >= 2 ? "auto" : "manual",
      durationScale: clampDurationScale(1 + safeProfile.tempoBias),
      suggestedLength,
      headline: "Balanced mobility and strength flow.",
      description: "Today’s coach call: standard durations with strong form cues. Keep rhythm steady and finish with intent."
    };
  }

  return {
    score: adjusted,
    label: "Performance",
    intensity: "High",
    mode: safeProfile.modeBias,
    durationScale: clampDurationScale(1.18 + safeProfile.tempoBias),
    suggestedLength: suggestedLength === "quick" ? "standard" : suggestedLength,
    headline: "Push quality and controlled intensity.",
    description: "Today’s coach call: longer holds on timed steps and continuous flow. Stay crisp on posture throughout."
  };
}
