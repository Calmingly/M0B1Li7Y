const SESSION_KEY = "m0b1li7y.sessionsCompleted";
const SESSION_DAYS_KEY = "m0b1li7y.sessionDays";
const SESSION_LOG_KEY = "m0b1li7y.sessionLog";
const DAY_PROGRESS_EDITS_KEY = "m0b1li7y.dayProgressEdits";
const PROGRESSION_MODE_KEY = "m0b1li7y.progressionMode";
const SOUND_ENABLED_KEY = "m0b1li7y.soundEnabled";
const HAPTICS_ENABLED_KEY = "m0b1li7y.hapticsEnabled";
const THEME_KEY = "m0b1li7y.theme";
const READINESS_KEY = "m0b1li7y.readiness";
const RECOMMENDATION_KEY = "m0b1li7y.recommendation";
const PROGRAM_TRACK_KEY = "m0b1li7y.programTrack";
const PROGRAM_STATE_KEY = "m0b1li7y.programState";
const CHECKIN_DAYS_KEY = "m0b1li7y.checkinDays";
const SHIELD_TOKENS_KEY = "m0b1li7y.shieldTokens";
const SHIELD_DAYS_KEY = "m0b1li7y.shieldDays";
const SHIELD_MILESTONE_KEY = "m0b1li7y.shieldMilestone";
const BUDDY_PINGS_KEY = "m0b1li7y.buddyPings";
const REFLECTION_LOG_KEY = "m0b1li7y.reflectionLog";

const routineSteps = [
  { name: "Arm Circles", cue: "Smooth shoulder circles.", phase: "Warmup", image: "armcircles.png", durationSec: 30 },
  { name: "Trunk Rotations", cue: "Rotate gently side to side.", phase: "Warmup", image: "trunkrotation.png", durationSec: 30 },
  { name: "Side Bends", cue: "Reach and lengthen each side.", phase: "Warmup", image: "sidebends.png", durationSec: 30 },
  { name: "Leg Swings", cue: "Keep hips stable and controlled.", phase: "Warmup", image: "legswings.png", durationSec: 30 },
  { name: "Overhead Reach", cue: "Stand tall and reach up smoothly.", phase: "Reset", image: "overheadreach.png", durationSec: 30 },
  { name: "Counter Pushups", cue: "Complete 10 to 15 quality reps.", phase: "Strength", image: "counterpushups.png", durationSec: null },
  { name: "Plank", cue: "Brace core and keep a straight line.", phase: "Strength", image: "plank.png", durationSec: 60 },
  { name: "Knees To Chest", cue: "Alternate sides with steady posture.", phase: "Mobility", image: "kneestochest.png", durationSec: 30 },
  { name: "Toe Touch Twist", cue: "Move slowly and avoid bouncing.", phase: "Mobility", image: "toetouchtwist.png", durationSec: 30 },
  { name: "Figure Four", cue: "Switch sides halfway and breathe.", phase: "Mobility", image: "lyingfigurefour.png", durationSec: 40 },
  { name: "Child Pose", cue: "Relax your neck and breathe deeply.", phase: "Cooldown", image: "childspose.png", durationSec: 45 },
  { name: "Brisk Walk", cue: "Walk with intent to finish strong.", phase: "Finish", image: "briskwalk.png", durationSec: 180 }
];

const summary = document.getElementById("summary");
const progressLabel = document.getElementById("progress-label");
const sessionCount = document.getElementById("session-count");
const streakCount = document.getElementById("streak-count");
const weekCount = document.getElementById("week-count");
const sparkToday = document.getElementById("spark-today");
const sparkSessions = document.getElementById("spark-sessions");
const sparkStreak = document.getElementById("spark-streak");
const sparkWeek = document.getElementById("spark-week");
const routineView = document.getElementById("routine-view");
const feedbackBanner = document.getElementById("feedback-banner");
const stepChip = document.getElementById("step-chip");
const phaseProgress = document.getElementById("phase-progress");
const phaseTrack = document.getElementById("phase-track");
const stepName = document.getElementById("step-name");
const stepCue = document.getElementById("step-cue");
const howtoStepName = document.getElementById("howto-step-name");
const howtoText = document.getElementById("howto-text");
const howtoCard = document.querySelector(".coach-card-collapsible");
const stepImage = document.getElementById("step-image");
const nextUpImage = document.getElementById("next-up-image");
const nextUpName = document.getElementById("next-up-name");
const nextUpMeta = document.getElementById("next-up-meta");
const timer = document.getElementById("timer");
const progressRing = document.getElementById("progress-ring");
const stepCard = document.querySelector("#routine-view .step-card");
const readinessScore = document.getElementById("readiness-score");
const readinessHeadline = document.getElementById("readiness-headline");
const recommendationText = document.getElementById("recommendation-text");
const recommendationChips = document.getElementById("recommendation-chips");
const readinessEnergy = document.getElementById("readiness-energy");
const readinessSoreness = document.getElementById("readiness-soreness");
const readinessMood = document.getElementById("readiness-mood");
const readinessEnergyOutput = document.getElementById("readiness-energy-output");
const readinessSorenessOutput = document.getElementById("readiness-soreness-output");
const readinessMoodOutput = document.getElementById("readiness-mood-output");
const saveCheckinBtn = document.getElementById("save-checkin-btn");
const applyRecommendationBtn = document.getElementById("apply-recommendation-btn");
const startRecommendedBtn = document.getElementById("start-recommended-btn");
const startRescueBtn = document.getElementById("start-rescue-btn");
const programTrack = document.getElementById("program-track");
const programMeta = document.getElementById("program-meta");
const consistencyScore = document.getElementById("consistency-score");
const questStatus = document.getElementById("quest-status");
const questProgress = document.getElementById("quest-progress");
const shieldCount = document.getElementById("shield-count");
const useShieldBtn = document.getElementById("use-shield-btn");
const buddyPingBtn = document.getElementById("buddy-ping-btn");
const buddyStatus = document.getElementById("buddy-status");
const reflectionEffort = document.getElementById("reflection-effort");
const reflectionForm = document.getElementById("reflection-form");
const reflectionEffortOutput = document.getElementById("reflection-effort-output");
const reflectionFormOutput = document.getElementById("reflection-form-output");
const saveReflectionBtn = document.getElementById("save-reflection-btn");
const reflectionCoachTip = document.getElementById("reflection-coach-tip");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");

const historyTotalSessions = document.getElementById("history-total-sessions");
const historyStreak = document.getElementById("history-streak");
const historyWeek = document.getElementById("history-week");
const historyActiveMinutes = document.getElementById("history-active-minutes");
const historyList = document.getElementById("history-list");
const historyDays = document.getElementById("history-days");

const progressionMode = document.getElementById("progression-mode");
const soundEnabled = document.getElementById("sound-enabled");
const hapticsEnabled = document.getElementById("haptics-enabled");
const themeSelect = document.getElementById("theme-select");

const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
const views = Array.from(document.querySelectorAll(".view"));

const phaseOrder = ["Warmup", "Reset", "Strength", "Mobility", "Cooldown", "Finish"];

const phaseAccentByName = {
  Warmup: "#38bdf8",
  Reset: "#22d3ee",
  Strength: "#a78bfa",
  Mobility: "#34d399",
  Cooldown: "#f59e0b",
  Finish: "#60a5fa"
};

const programProfiles = {
  beginner: { label: "Beginner Momentum", tempoBias: -0.04, modeBias: "manual" },
  "office-reset": { label: "Office Reset", tempoBias: -0.08, modeBias: "manual" },
  athletic: { label: "Athletic Flow", tempoBias: 0.08, modeBias: "auto" },
  recovery: { label: "Recovery Restore", tempoBias: -0.12, modeBias: "manual" }
};

const state = {
  stepIndex: 0,
  remainingSec: null,
  isRunning: false,
  isPaused: false,
  timerRef: null,
  sessionsCompleted: loadSessionCount(),
  sessionDays: loadSessionDays(),
  sessionLog: loadSessionLog(),
  dayProgressEdits: loadDayProgressEdits(),
  progressionMode: loadProgressionMode(),
  soundEnabled: loadBoolean(SOUND_ENABLED_KEY, true),
  hapticsEnabled: loadBoolean(HAPTICS_ENABLED_KEY, true),
  theme: loadTheme(),
  readiness: loadReadiness(),
  recommendation: loadRecommendation(),
  programTrack: loadProgramTrack(),
  programState: loadProgramState(),
  checkinDays: loadDayKeyArray(CHECKIN_DAYS_KEY),
  shieldTokens: loadNonNegativeInt(SHIELD_TOKENS_KEY, 1, 3),
  shieldDays: loadDayKeyArray(SHIELD_DAYS_KEY),
  shieldMilestone: loadNonNegativeInt(SHIELD_MILESTONE_KEY, 0),
  buddyPings: loadBuddyPings(),
  reflectionLog: loadReflectionLog(),
  sessionPreset: "full",
  durationScale: 1,
  activeView: "routine-view",
  sessionStartedAt: null
};

init();

function init() {
  if (state.recommendation?.durationScale) {
    state.durationScale = clampDurationScale(state.recommendation.durationScale);
  }
  state.remainingSec = getStepDurationSec(0);

  wireEvents();
  wireImageFallback();
  wireButtonPressEffects();
  initMetricSparkSkeletons();
  seedReadinessInputs();
  seedReflectionInputs();
  syncOptionUI();
  syncProgramUI();
  syncReadinessUI();
  syncReflectionUI();
  applyTheme(state.theme);
  renderSummary();
  renderTodayDashboard();
  renderStep();
  renderSessionMetrics();
  renderHistoryView();
  updateControls();
}

function wireImageFallback() {
  if (!stepImage) return;

  stepImage.addEventListener("error", () => {
    const fallback = imageUrl("armcircles.png");
    if (stepImage.src !== fallback) {
      stepImage.src = fallback;
    }
  });
}

function wireEvents() {
  startBtn?.addEventListener("click", startRoutine);
  pauseBtn?.addEventListener("click", togglePause);
  backBtn?.addEventListener("click", () => moveToStep(state.stepIndex - 1));
  nextBtn?.addEventListener("click", onNext);
  resetBtn?.addEventListener("click", resetRoutine);

  progressionMode?.addEventListener("change", () => {
    state.progressionMode = progressionMode.value === "auto" ? "auto" : "manual";
    localStorage.setItem(PROGRESSION_MODE_KEY, state.progressionMode);
    updateControls();
  });

  soundEnabled?.addEventListener("change", () => {
    state.soundEnabled = soundEnabled.checked;
    localStorage.setItem(SOUND_ENABLED_KEY, String(state.soundEnabled));
  });

  hapticsEnabled?.addEventListener("change", () => {
    state.hapticsEnabled = hapticsEnabled.checked;
    localStorage.setItem(HAPTICS_ENABLED_KEY, String(state.hapticsEnabled));
  });

  themeSelect?.addEventListener("change", () => {
    state.theme = themeSelect.value;
    localStorage.setItem(THEME_KEY, state.theme);
    applyTheme(state.theme);
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      switchView(button.dataset.view);
    });
  });

  [readinessEnergy, readinessSoreness, readinessMood].forEach((input) => {
    input?.addEventListener("input", syncReadinessUI);
  });

  saveCheckinBtn?.addEventListener("click", saveReadinessCheckin);
  applyRecommendationBtn?.addEventListener("click", applyRecommendationPlan);
  startRecommendedBtn?.addEventListener("click", startRecommendedSession);
  startRescueBtn?.addEventListener("click", startRescueSession);
  useShieldBtn?.addEventListener("click", useShieldForToday);
  buddyPingBtn?.addEventListener("click", sendBuddyPing);
  saveReflectionBtn?.addEventListener("click", saveSessionReflection);

  programTrack?.addEventListener("change", () => {
    state.programTrack = programTrack.value;
    saveProgramTrack(state.programTrack);
    renderTodayDashboard();
  });

  [reflectionEffort, reflectionForm].forEach((input) => {
    input?.addEventListener("input", syncReflectionUI);
  });

  historyDays?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.dataset.dayProgress === undefined) return;

    const dayKey = target.dataset.dayProgress;
    const output = historyDays.querySelector(`[data-day-output="${dayKey}"]`);
    if (!output) return;
    output.textContent = `${target.value}/${routineSteps.length} pieces`;
  });

  historyDays?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const button = target.closest("button[data-save-day]");
    if (!button) return;

    const dayKey = button.getAttribute("data-save-day");
    if (!dayKey) return;

    const input = historyDays.querySelector(`input[data-day-progress="${dayKey}"]`);
    if (!(input instanceof HTMLInputElement)) return;

    const progress = clampProgress(Number(input.value));
    saveDayProgress(dayKey, progress);
    renderSessionMetrics();
    renderHistoryView();
    triggerFeedback("stepChange");
  });
}

function wireButtonPressEffects() {
  const pressableButtons = [
    startBtn,
    pauseBtn,
    backBtn,
    nextBtn,
    resetBtn,
    saveCheckinBtn,
    applyRecommendationBtn,
    startRecommendedBtn,
    startRescueBtn,
    useShieldBtn,
    buddyPingBtn,
    saveReflectionBtn
  ].filter(Boolean);
  pressableButtons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.remove("btn-press");
      requestAnimationFrame(() => {
        button.classList.add("btn-press");
      });
      window.setTimeout(() => {
        button.classList.remove("btn-press");
      }, 220);
    });
  });
}

function initMetricSparkSkeletons() {
  buildDotSpark(sparkSessions);
  buildDotSpark(sparkStreak);
  buildBarSpark(sparkWeek);
}

function buildDotSpark(container) {
  if (!container) return;
  container.innerHTML = "";
  for (let index = 0; index < 7; index += 1) {
    const dot = document.createElement("span");
    dot.className = "metric-dot";
    container.append(dot);
  }
}

function buildBarSpark(container) {
  if (!container) return;
  container.innerHTML = "";
  for (let index = 0; index < 7; index += 1) {
    const bar = document.createElement("span");
    bar.className = "metric-bar";
    container.append(bar);
  }
}

function syncReadinessUI() {
  if (readinessEnergy && readinessEnergyOutput) {
    readinessEnergyOutput.textContent = String(readinessEnergy.value);
  }

  if (readinessSoreness && readinessSorenessOutput) {
    readinessSorenessOutput.textContent = String(readinessSoreness.value);
  }

  if (readinessMood && readinessMoodOutput) {
    readinessMoodOutput.textContent = String(readinessMood.value);
  }
}

function seedReadinessInputs() {
  if (!state.readiness) return;

  if (readinessEnergy) readinessEnergy.value = String(clampReadiness(state.readiness.energy));
  if (readinessSoreness) readinessSoreness.value = String(clampReadiness(state.readiness.soreness));
  if (readinessMood) readinessMood.value = String(clampReadiness(state.readiness.mood));
}

function seedReflectionInputs() {
  const latest = getLatestReflection();
  const effort = clampReadiness(latest?.effort || 3);
  const form = clampReadiness(latest?.form || 3);

  if (reflectionEffort) reflectionEffort.value = String(effort);
  if (reflectionForm) reflectionForm.value = String(form);
}

function syncReflectionUI() {
  if (reflectionEffort && reflectionEffortOutput) {
    reflectionEffortOutput.textContent = String(reflectionEffort.value);
  }

  if (reflectionForm && reflectionFormOutput) {
    reflectionFormOutput.textContent = String(reflectionForm.value);
  }
}

function syncProgramUI() {
  if (programTrack) {
    programTrack.value = state.programTrack;
  }
}

function startRescueSession() {
  state.sessionPreset = "rescue";
  state.stepIndex = 0;
  state.durationScale = Math.min(state.durationScale, 0.75);
  state.progressionMode = "auto";
  localStorage.setItem(PROGRESSION_MODE_KEY, state.progressionMode);
  syncOptionUI();
  state.remainingSec = getStepDurationSec(0);
  renderStep();
  updateControls();
  startRoutine();
  showFeedbackBanner("2-minute rescue started.");
}

function useShieldForToday() {
  const todayKey = toDayKey(new Date());
  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);

  if (activeDayKeys.includes(todayKey)) {
    showFeedbackBanner("Today is already protected by activity.");
    return;
  }

  if (state.shieldTokens <= 0) {
    showFeedbackBanner("No streak shields available.");
    return;
  }

  state.shieldTokens -= 1;
  state.shieldDays = Array.from(new Set([...state.shieldDays, todayKey])).sort();
  saveShieldState();
  renderSessionMetrics();
  renderTodayDashboard();
  showFeedbackBanner("Streak shield used for today.");
  triggerFeedback("stepDone");
}

function sendBuddyPing() {
  const nowIso = new Date().toISOString();
  state.buddyPings = [nowIso, ...state.buddyPings].slice(0, 40);
  saveBuddyPings(state.buddyPings);
  renderTodayDashboard();
  showFeedbackBanner("Buddy ping sent.");
  triggerFeedback("stepChange");
}

function saveSessionReflection() {
  const effort = clampReadiness(reflectionEffort?.value);
  const form = clampReadiness(reflectionForm?.value);

  const tip = buildReflectionTip({ effort, form });

  const entry = {
    dayKey: toDayKey(new Date()),
    effort,
    form,
    tip,
    createdAt: new Date().toISOString()
  };

  state.reflectionLog = [entry, ...state.reflectionLog].slice(0, 30);
  saveReflectionLog(state.reflectionLog);

  if (reflectionCoachTip) {
    reflectionCoachTip.textContent = tip;
  }

  if (state.recommendation) {
    const adjustment = effort >= 4 && form >= 4 ? 0.04 : effort >= 4 && form <= 2 ? -0.05 : 0;
    state.recommendation.durationScale = clampDurationScale(state.recommendation.durationScale + adjustment);
    state.durationScale = clampDurationScale(state.recommendation.durationScale);
    state.recommendation.description = `${state.recommendation.description.split("Coach note:")[0].trim()} ${tip}`;
    saveRecommendation(state.recommendation);
  }

  if (!state.isRunning) {
    state.remainingSec = getStepDurationSec(state.stepIndex);
    renderStep();
  }

  renderTodayDashboard();
  updateControls();
  showFeedbackBanner("Reflection saved. Coach plan adjusted.");
  triggerFeedback("stepChange");
}

function getLatestReflection() {
  return state.reflectionLog[0] || null;
}

function buildReflectionTip(reflection) {
  if (reflection.form <= 2) {
    return "Coach note: reduce range 10% and prioritize slower reps next session.";
  }

  if (reflection.effort >= 4 && reflection.form >= 4) {
    return "Coach note: add controlled intensity on strength intervals tomorrow.";
  }

  if (reflection.effort <= 2) {
    return "Coach note: use auto mode tomorrow to keep momentum and cadence.";
  }

  return "Coach note: hold this intensity and keep movement quality consistent.";
}

function saveReadinessCheckin() {
  const energy = clampReadiness(readinessEnergy?.value);
  const soreness = clampReadiness(readinessSoreness?.value);
  const mood = clampReadiness(readinessMood?.value);

  state.readiness = {
    dayKey: toDayKey(new Date()),
    energy,
    soreness,
    mood,
    savedAt: new Date().toISOString()
  };

  state.checkinDays = Array.from(new Set([...state.checkinDays, state.readiness.dayKey])).sort();
  saveDayKeyArray(CHECKIN_DAYS_KEY, state.checkinDays);

  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);
  const recommendation = buildRecommendation(state.readiness, {
    streak: computeStreakDays(activeDayKeys),
    weekly: computeLast7DaysSessions(activeDayKeys),
    sessionsCompleted: state.sessionsCompleted
  });

  state.recommendation = recommendation;
  state.durationScale = recommendation.durationScale;

  if (!state.isRunning) {
    state.remainingSec = getStepDurationSec(state.stepIndex);
  }

  saveReadiness(state.readiness);
  saveRecommendation(recommendation);
  renderTodayDashboard();
  renderStep();
  updateControls();
  showFeedbackBanner("Check-in saved. Plan updated.");
  triggerFeedback("stepChange");
}

function applyRecommendationPlan() {
  if (!state.recommendation) {
    showFeedbackBanner("Save a check-in first.");
    return;
  }

  state.progressionMode = state.recommendation.mode;
  state.sessionPreset = "full";
  state.durationScale = clampDurationScale(state.recommendation.durationScale);
  localStorage.setItem(PROGRESSION_MODE_KEY, state.progressionMode);
  saveRecommendation(state.recommendation);
  syncOptionUI();

  if (!state.isRunning) {
    state.remainingSec = getStepDurationSec(state.stepIndex);
  }

  renderTodayDashboard();
  renderStep();
  updateControls();
  showFeedbackBanner(`Applied ${state.recommendation.label} plan.`);
  triggerFeedback("stepChange");
}

function startRecommendedSession() {
  state.sessionPreset = "full";
  if (state.recommendation) {
    applyRecommendationPlan();
  }

  if (!state.isRunning) {
    startRoutine();
  }
}

function renderTodayDashboard() {
  if (!readinessScore || !readinessHeadline || !recommendationText || !recommendationChips) return;

  const fallbackReadiness = state.readiness || {
    dayKey: toDayKey(new Date()),
    energy: 3,
    soreness: 3,
    mood: 3
  };

  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);
  const streak = computeStreakDays(activeDayKeys);
  const weekly = computeLast7DaysSessions(activeDayKeys);
  const fallbackRecommendation = buildRecommendation(fallbackReadiness, {
    streak,
    weekly,
    sessionsCompleted: state.sessionsCompleted
  });

  const recommendation = state.recommendation || fallbackRecommendation;
  const isToday = state.readiness?.dayKey === toDayKey(new Date());

  readinessScore.textContent = `${recommendation.score}`;
  readinessHeadline.textContent = isToday
    ? `${recommendation.label} plan ready. ${recommendation.headline}`
    : "Log today’s check-in to personalize your plan.";
  recommendationText.textContent = recommendation.description;

  if (programMeta) {
    programMeta.textContent = `Week ${state.programState.week} • ${state.programState.sessionsInWeek}/4 sessions in cycle`;
  }

  if (consistencyScore) {
    consistencyScore.textContent = `${computeConsistencyScore(activeDayKeys, state.checkinDays, streak)}%`;
  }

  const quest = computeWeeklyQuest(activeDayKeys, state.checkinDays, state.buddyPings);
  if (questStatus) {
    questStatus.textContent = `${quest.percent}%`;
  }
  if (questProgress) {
    questProgress.textContent = `${quest.done}/${quest.total} checkpoints`;
  }

  if (shieldCount) {
    shieldCount.textContent = String(state.shieldTokens);
  }

  if (useShieldBtn) {
    const todayKey = toDayKey(new Date());
    const canUseShield = state.shieldTokens > 0 && !activeDayKeys.includes(todayKey);
    useShieldBtn.disabled = !canUseShield;
  }

  if (buddyStatus) {
    const buddyWeek = countInCurrentWeek(state.buddyPings.map((value) => toDayKey(value)));
    buddyStatus.textContent = buddyWeek > 0
      ? `${buddyWeek} accountability ping${buddyWeek === 1 ? "" : "s"} this week.`
      : "No buddy pings this week yet.";
  }

  const latestReflection = getLatestReflection();
  if (reflectionCoachTip && latestReflection) {
    reflectionCoachTip.textContent = latestReflection.tip;
  }

  recommendationChips.innerHTML = "";
  [
    `Intensity ${recommendation.intensity}`,
    `Mode ${recommendation.mode === "auto" ? "Auto" : "Manual"}`,
    `Tempo ${Math.round(recommendation.durationScale * 100)}%`,
    `${programProfiles[state.programTrack]?.label || "Program"}`,
    state.sessionPreset === "rescue" ? "Rescue Session" : "Full Session"
  ].forEach((chipText) => {
    const chip = document.createElement("span");
    chip.className = "recommendation-chip";
    chip.textContent = chipText;
    recommendationChips.append(chip);
  });
}

function buildRecommendation(readiness, stats) {
  const energy = clampReadiness(readiness?.energy);
  const soreness = clampReadiness(readiness?.soreness);
  const mood = clampReadiness(readiness?.mood);
  const profile = programProfiles[state.programTrack] || programProfiles.beginner;
  const latestReflection = getLatestReflection();

  const score = Math.round(((energy + mood + (6 - soreness)) / 15) * 100);
  const weeklyBonus = stats.weekly >= 3 ? 4 : 0;
  const consistencyBonus = stats.streak >= 4 ? 4 : 0;
  const reflectionBias = latestReflection?.form <= 2 ? -6 : latestReflection?.effort >= 4 && latestReflection?.form >= 4 ? 4 : 0;
  const adjusted = Math.max(0, Math.min(100, score + weeklyBonus + consistencyBonus + reflectionBias));

  if (adjusted <= 45) {
    return {
      score: adjusted,
      label: "Recovery",
      intensity: "Low",
      mode: profile.modeBias === "auto" ? "manual" : profile.modeBias,
      durationScale: clampDurationScale(0.82 + profile.tempoBias),
      headline: "Focus on quality movement and breath control.",
      description: "Today’s coach call: slower tempo, controlled ranges, and smooth transitions to keep consistency without overload."
    };
  }

  if (adjusted <= 75) {
    return {
      score: adjusted,
      label: "Base Build",
      intensity: "Moderate",
      mode: profile.modeBias === "manual" ? "manual" : stats.weekly >= 2 ? "auto" : "manual",
      durationScale: clampDurationScale(1 + profile.tempoBias),
      headline: "Balanced mobility and strength flow.",
      description: "Today’s coach call: standard durations with strong form cues. Keep rhythm steady and finish with intent."
    };
  }

  return {
    score: adjusted,
    label: "Performance",
    intensity: "High",
    mode: profile.modeBias,
    durationScale: clampDurationScale(1.18 + profile.tempoBias),
    headline: "Push quality and controlled intensity.",
    description: "Today’s coach call: longer holds on timed steps and continuous flow. Stay crisp on posture throughout."
  };
}

function clampReadiness(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 3;
  return Math.max(1, Math.min(5, Math.round(parsed)));
}

function clampDurationScale(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(0.75, Math.min(1.25, parsed));
}

function getStepDurationSec(stepIndex) {
  const base = routineSteps[stepIndex]?.durationSec;
  if (base === null || base === undefined) return null;
  const scaled = Math.round(base * clampDurationScale(state.durationScale));
  return Math.max(15, scaled);
}

function switchView(viewId) {
  state.activeView = viewId;

  views.forEach((view) => {
    const isActive = view.id === viewId;
    view.hidden = !isActive;
    if (isActive) {
      animateViewEntry(view);
    }
  });

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewId);
  });

  if (viewId === "history-view") {
    renderHistoryView();
  }
}

function startRoutine() {
  if (state.isRunning) return;
  state.isRunning = true;
  state.isPaused = false;
  if (!state.sessionStartedAt) {
    state.sessionStartedAt = Date.now();
  }
  setButtonLabel(pauseBtn, "Pause");
  triggerFeedback("start");
  startTimer();
  updateControls();
}

function togglePause() {
  if (!state.isRunning) return;
  state.isPaused = !state.isPaused;
  setButtonLabel(pauseBtn, state.isPaused ? "Resume" : "Pause");
  triggerFeedback(state.isPaused ? "pause" : "resume");
}

function onNext() {
  const stepLimit = getSessionStepLimit();
  if (state.stepIndex >= stepLimit - 1) {
    completeRoutine();
    return;
  }
  moveToStep(state.stepIndex + 1);
}

function moveToStep(nextIndex) {
  const stepLimit = getSessionStepLimit();
  if (nextIndex < 0 || nextIndex >= stepLimit) return;

  stopTimer();
  if (howtoCard) howtoCard.open = false;
  state.stepIndex = nextIndex;
  state.remainingSec = getStepDurationSec(nextIndex);
  state.isRunning = false;
  state.isPaused = false;
  setButtonLabel(pauseBtn, "Pause");
  renderStep();
  triggerFeedback("stepChange");
  updateControls();
}

function startTimer() {
  stopTimer();
  state.timerRef = window.setInterval(() => {
    if (!state.isRunning || state.isPaused) return;

    const stepDuration = getStepDurationSec(state.stepIndex);
    if (stepDuration === null) return;

    state.remainingSec -= 1;
    renderTimer();

    if (state.remainingSec <= 0) {
      handleStepFinished();
    }
  }, 1000);
}

function handleStepFinished() {
  flashRingComplete();
  showFeedbackBanner("Step complete");
  triggerFeedback("stepDone");

  const stepLimit = getSessionStepLimit();
  if (state.stepIndex >= stepLimit - 1) {
    completeRoutine();
    return;
  }

  if (state.progressionMode === "auto") {
    moveToStep(state.stepIndex + 1);
    startRoutine();
    return;
  }

  moveToStep(state.stepIndex + 1);
}

function stopTimer() {
  if (state.timerRef !== null) {
    clearInterval(state.timerRef);
    state.timerRef = null;
  }
}

function completeRoutine() {
  stopTimer();
  const completedPreset = state.sessionPreset;
  state.isRunning = false;
  state.isPaused = false;
  state.sessionsCompleted += 1;

  const durationSec = state.sessionStartedAt
    ? Math.max(60, Math.round((Date.now() - state.sessionStartedAt) / 1000))
    : estimatedRoutineDurationSec();

  state.sessionStartedAt = null;

  const sessionEntry = {
    completedAt: new Date().toISOString(),
    durationSec,
    mode: state.progressionMode,
    preset: state.sessionPreset,
    program: state.programTrack
  };

  state.sessionLog = [sessionEntry, ...state.sessionLog].slice(0, 60);
  saveSessionLog(state.sessionLog);

  recordSessionDay();
  advanceProgramProgress();
  rewardShieldMilestones();
  saveSessionCount(state.sessionsCompleted);
  renderSessionMetrics();
  renderTodayDashboard();
  renderHistoryView();
  resetRoutine(false);
  celebrateRoutineFinish();
  showFeedbackBanner(completedPreset === "rescue" ? "Rescue session complete. Streak protected." : "Routine complete. Great work.");
  triggerFeedback("sessionDone");
}

function resetRoutine(keepSessionCount = true) {
  stopTimer();
  state.isRunning = false;
  state.isPaused = false;
  if (howtoCard) howtoCard.open = false;
  state.sessionPreset = "full";
  state.stepIndex = 0;
  state.remainingSec = getStepDurationSec(0);
  state.sessionStartedAt = null;
  setButtonLabel(pauseBtn, "Pause");
  renderStep();
  updateControls();

  if (!keepSessionCount) {
    renderSessionMetrics();
  }
}

function renderStep() {
  const step = routineSteps[state.stepIndex];
  const stepLimit = getSessionStepLimit();
  progressLabel.textContent = `${state.stepIndex + 1}/${stepLimit}`;
  const percentComplete = Math.round(((state.stepIndex + 1) / stepLimit) * 100);
  const phaseAccent = phaseAccentByName[step.phase] || "#60a5fa";
  document.documentElement.style.setProperty("--phase-accent", phaseAccent);
  stepCard?.classList.remove("phase-warmup", "phase-reset", "phase-strength", "phase-mobility", "phase-cooldown", "phase-finish");
  stepCard?.classList.add(`phase-${step.phase.toLowerCase()}`);
  stepChip.textContent = step.phase;
  phaseProgress.textContent = `${percentComplete}% complete`;
  stepName.textContent = step.name;
  stepCue.textContent = step.cue;
  renderPhaseTrack(step.phase);
  renderStepBackdrop(step.image);
  renderNextUp();
  if (sparkToday) {
    sparkToday.style.width = `${percentComplete}%`;
  }
  if (howtoStepName) howtoStepName.textContent = step.name;
  if (howtoText) howtoText.textContent = getHowToByStep(step.name);
  progressRing?.style.setProperty("--step-progress", String(percentComplete));
  stepImage.src = imageUrl(step.image);
  stepImage.alt = `${step.name} visual`;
  triggerStepVisualRefresh();
  renderTimer();
}

function imageUrl(fileName) {
  return new URL(`../img/${fileName}`, import.meta.url).href;
}

function getHowToByStep(stepNameValue) {
  const byStep = {
    "Arm Circles": "Stand tall, make small circles first, then larger circles in both directions.",
    "Trunk Rotations": "Keep hips forward, rotate your upper body left and right without forcing range.",
    "Side Bends": "Slide one hand down your thigh, switch sides slowly, and keep chest lifted.",
    "Leg Swings": "Hold support, swing one leg front/back with control, then switch legs.",
    "Overhead Reach": "Reach both arms up, keep ribs down, and breathe slowly through each reach.",
    "Counter Pushups": "Hands on counter, body straight, lower chest toward hands, then press back up.",
    "Plank": "Elbows under shoulders, squeeze glutes/core, and keep neck and spine neutral.",
    "Knees To Chest": "Lift one knee toward chest at a time while staying tall and steady.",
    "Toe Touch Twist": "Reach across to opposite foot with a gentle twist; alternate sides smoothly.",
    "Figure Four": "Cross ankle over opposite knee, hinge slightly, then switch sides halfway.",
    "Child Pose": "Sit hips back, arms long, forehead down, and take slow deep breaths.",
    "Brisk Walk": "Walk at a purposeful pace where you can talk, but feel your heart rate rise."
  };

  return byStep[stepNameValue] || "Move with control, stay pain-free, and keep breathing steadily.";
}

function renderTimer() {
  const stepDuration = getStepDurationSec(state.stepIndex);
  if (stepDuration === null) {
    timer.textContent = "REPS";
    timer.classList.remove("timer-warning");
    progressRing?.classList.add("ring-reps");
    progressRing?.classList.remove("ring-running");
    progressRing?.classList.remove("ring-low");
    progressRing?.style.setProperty("--time-progress", "100");
    return;
  }

  const safeRemaining = Math.max(0, Number(state.remainingSec));
  timer.textContent = formatTime(safeRemaining);
  const showWarning = state.isRunning && !state.isPaused && safeRemaining > 0 && safeRemaining <= 5;
  const showRunning = state.isRunning && !state.isPaused && safeRemaining > 5;
  timer.classList.toggle("timer-warning", showWarning);
  progressRing?.classList.remove("ring-reps");
  progressRing?.classList.toggle("ring-running", showRunning);
  progressRing?.classList.toggle("ring-low", showWarning);

  const totalDuration = Number(stepDuration) || 1;
  const timeProgress = Math.max(0, Math.min(100, Math.round((safeRemaining / totalDuration) * 100)));
  progressRing?.style.setProperty("--time-progress", String(timeProgress));
}

function updateControls() {
  startBtn.disabled = state.isRunning;
  setButtonLabel(startBtn, state.isRunning ? "Running" : "Start Activity");
  pauseBtn.disabled = !state.isRunning;
  backBtn.disabled = state.stepIndex === 0;
  nextBtn.disabled = false;
  setButtonLabel(nextBtn, state.stepIndex === getSessionStepLimit() - 1 ? "Finish" : "Next");
  if (applyRecommendationBtn) {
    applyRecommendationBtn.disabled = !state.recommendation;
  }
  if (startRecommendedBtn) {
    startRecommendedBtn.disabled = state.isRunning;
  }
  if (startRescueBtn) {
    startRescueBtn.disabled = state.isRunning;
  }
}

function setButtonLabel(button, label) {
  if (!button) return;
  const labelEl = button.querySelector(".btn-label");
  if (labelEl) {
    labelEl.textContent = label;
    return;
  }
  button.textContent = label;
}

function animateViewEntry(view) {
  view.classList.remove("view-enter");
  requestAnimationFrame(() => {
    view.classList.add("view-enter");
  });
}

function triggerStepVisualRefresh() {
  if (stepCard) {
    stepCard.classList.remove("step-refresh");
    requestAnimationFrame(() => {
      stepCard.classList.add("step-refresh");
    });
  }

  if (stepImage) {
    stepImage.classList.remove("image-refresh");
    requestAnimationFrame(() => {
      stepImage.classList.add("image-refresh");
    });
  }
}

function renderPhaseTrack(activePhase) {
  if (!phaseTrack) return;
  const dots = Array.from(phaseTrack.querySelectorAll(".phase-dot"));
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", phaseOrder[index] === activePhase);
  });
}

function renderStepBackdrop(imageName) {
  if (!routineView) return;
  routineView.style.setProperty("--step-bg-image", `url('${imageUrl(imageName)}')`);
  routineView.classList.add("backdrop-ready");
}

function renderNextUp() {
  const stepLimit = getSessionStepLimit();
  const nextIndex = Math.min(state.stepIndex + 1, stepLimit - 1);
  const nextStep = routineSteps[nextIndex];
  if (!nextUpName || !nextUpMeta || !nextUpImage) return;

  const isLast = state.stepIndex >= stepLimit - 1;
  nextUpName.textContent = isLast ? "Finish" : nextStep.name;
  nextUpMeta.textContent = isLast
    ? "Complete routine"
    : getStepDurationSec(nextIndex) === null
      ? "10-15 reps"
      : formatTime(getStepDurationSec(nextIndex));
  nextUpImage.src = imageUrl(isLast ? routineSteps[state.stepIndex].image : nextStep.image);
}

function flashRingComplete() {
  if (!progressRing) return;
  progressRing.classList.remove("ring-complete");
  requestAnimationFrame(() => {
    progressRing.classList.add("ring-complete");
  });
  window.setTimeout(() => {
    progressRing.classList.remove("ring-complete");
  }, 520);
}

function celebrateRoutineFinish() {
  if (!stepCard) return;
  stepCard.classList.remove("celebrate");
  requestAnimationFrame(() => {
    stepCard.classList.add("celebrate");
  });
  window.setTimeout(() => {
    stepCard.classList.remove("celebrate");
  }, 650);
}

function showFeedbackBanner(message) {
  if (!feedbackBanner) return;
  feedbackBanner.textContent = message;
  feedbackBanner.classList.add("show");
  window.clearTimeout(showFeedbackBanner.hideTimeout);
  showFeedbackBanner.hideTimeout = window.setTimeout(() => {
    feedbackBanner.classList.remove("show");
  }, 1100);
}

function renderSummary() {
  summary.textContent = "Adaptive order: readiness + program track → coached routine (full or rescue) → reflection-based micro-coaching → consistency quests and streak protection.";
}

function renderSessionMetrics() {
  sessionCount.textContent = String(state.sessionsCompleted);
  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);
  const streak = computeStreakDays(activeDayKeys);
  const weekly = computeLast7DaysSessions(activeDayKeys);
  streakCount.textContent = `${streak}d`;
  weekCount.textContent = `${weekly}/7`;
  renderDotSparkState(sparkSessions, Math.max(1, Math.min(7, state.sessionsCompleted || 1)));
  renderDotSparkState(sparkStreak, Math.max(0, Math.min(7, streak)));
  renderWeekBars(activeDayKeys);
  renderTodayDashboard();
}

function renderDotSparkState(container, activeCount) {
  if (!container) return;
  const dots = Array.from(container.querySelectorAll(".metric-dot"));
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index < activeCount);
  });
}

function renderWeekBars(activeDayKeys) {
  if (!sparkWeek) return;
  const bars = Array.from(sparkWeek.querySelectorAll(".metric-bar"));
  const active = new Set(activeDayKeys);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);

  bars.forEach((bar, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const dayKey = toDayKey(day);
    const isActive = active.has(dayKey);
    bar.classList.toggle("active", isActive);
    bar.style.height = isActive ? `${50 + index * 6}%` : "34%";
  });
}

function renderHistoryView() {
  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);
  const streak = computeStreakDays(activeDayKeys);
  const weekly = computeLast7DaysSessions(activeDayKeys);
  const totalMinutes = Math.round(state.sessionLog.reduce((sum, entry) => sum + (entry.durationSec || 0), 0) / 60);

  historyTotalSessions.textContent = String(state.sessionsCompleted);
  historyStreak.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  historyWeek.textContent = `${weekly} session${weekly === 1 ? "" : "s"}`;
  historyActiveMinutes.textContent = `${totalMinutes} min`;

  historyList.innerHTML = "";

  if (state.sessionLog.length === 0) {
    const empty = document.createElement("p");
    empty.className = "history-empty";
    empty.textContent = "No sessions yet. Complete your first routine to start tracking.";
    historyList.append(empty);
  } else {
    state.sessionLog.slice(0, 10).forEach((entry) => {
      const item = document.createElement("li");
      item.className = "history-item";

      const title = document.createElement("p");
      title.className = "history-item-title";
      title.textContent = formatDateTime(entry.completedAt);

      const meta = document.createElement("p");
      meta.className = "history-item-meta";
      const presetLabel = entry.preset === "rescue" ? "Rescue" : "Full";
      meta.textContent = `${Math.max(1, Math.round(entry.durationSec / 60))} min • ${entry.mode === "auto" ? "Auto" : "Manual"} mode • ${presetLabel}`;

      item.append(title, meta);
      historyList.append(item);
    });
  }

  historyDays.innerHTML = "";

  const recentDays = buildRecentDayRows(state.sessionDays, state.sessionLog, state.dayProgressEdits, 14);
  recentDays.forEach((dayRow) => {
    const item = document.createElement("li");
    item.className = "history-day-item";

    const details = document.createElement("details");
    details.className = "history-day-details";

    const summary = document.createElement("summary");
    summary.className = "history-day-summary";

    const title = document.createElement("p");
    title.className = "history-day-title";
    title.textContent = dayRow.label;

    const meta = document.createElement("p");
    meta.className = "history-day-meta";
    meta.textContent = `${dayRow.sessions} session${dayRow.sessions === 1 ? "" : "s"} • ${dayRow.minutes} min • ${dayRow.progress}/${routineSteps.length} pieces`;

    summary.append(title, meta);

    const editor = document.createElement("div");
    editor.className = "history-day-editor";

    const progressRow = document.createElement("div");
    progressRow.className = "history-progress-row";

    const label = document.createElement("label");
    label.textContent = "Adjust progress";
    label.setAttribute("for", `day-progress-${dayRow.dayKey}`);

    const range = document.createElement("input");
    range.id = `day-progress-${dayRow.dayKey}`;
    range.type = "range";
    range.min = "0";
    range.max = String(routineSteps.length);
    range.step = "1";
    range.value = String(dayRow.progress);
    range.dataset.dayProgress = dayRow.dayKey;

    const progressMeta = document.createElement("p");
    progressMeta.className = "history-progress-meta";
    progressMeta.dataset.dayOutput = dayRow.dayKey;
    progressMeta.textContent = `${dayRow.progress}/${routineSteps.length} pieces`;

    progressRow.append(label, range, progressMeta);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "history-save-btn";
    saveButton.dataset.saveDay = dayRow.dayKey;
    saveButton.textContent = "Save day";

    editor.append(progressRow, saveButton);
    details.append(summary, editor);
    item.append(details);
    historyDays.append(item);
  });
}

function formatTime(totalSec) {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatDateTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function buildRecentDayRows(sessionDays, sessionLog, dayProgressEdits, numberOfDays) {
  const rows = [];
  const byDay = new Map();

  sessionLog.forEach((entry) => {
    const dayKey = toDayKey(entry.completedAt);
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, { sessions: 0, minutes: 0 });
    }
    const day = byDay.get(dayKey);
    day.sessions += 1;
    day.minutes += Math.max(1, Math.round((entry.durationSec || 0) / 60));
  });

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (let index = 0; index < numberOfDays; index += 1) {
    const day = new Date(cursor);
    day.setDate(cursor.getDate() - index);
    const dayKey = toDayKey(day);
    const value = byDay.get(dayKey) || { sessions: sessionDays.includes(dayKey) ? 1 : 0, minutes: 0 };
    const defaultProgress = value.sessions > 0 ? routineSteps.length : 0;
    const progress = getDayProgress(dayKey, defaultProgress, dayProgressEdits);
    const effectiveSessions = progress > 0 ? Math.max(1, value.sessions) : 0;

    rows.push({
      dayKey,
      label: day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
      sessions: effectiveSessions,
      minutes: value.minutes,
      progress
    });
  }

  return rows;
}

function loadDayProgressEdits() {
  try {
    const raw = localStorage.getItem(DAY_PROGRESS_EDITS_KEY);
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || typeof parsed !== "object") return {};

    const normalized = {};
    Object.entries(parsed).forEach(([dayKey, value]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return;
      normalized[dayKey] = clampProgress(Number(value));
    });

    return normalized;
  } catch {
    return {};
  }
}

function saveDayProgressEdits(edits) {
  try {
    localStorage.setItem(DAY_PROGRESS_EDITS_KEY, JSON.stringify(edits));
  } catch {
    // Ignore storage errors.
  }
}

function saveDayProgress(dayKey, progress) {
  const current = { ...state.dayProgressEdits };
  current[dayKey] = clampProgress(progress);
  state.dayProgressEdits = current;
  saveDayProgressEdits(state.dayProgressEdits);
}

function clampProgress(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(routineSteps.length, Math.round(value)));
}

function getDayProgress(dayKey, defaultProgress, edits) {
  if (Object.prototype.hasOwnProperty.call(edits, dayKey)) {
    return clampProgress(edits[dayKey]);
  }
  return clampProgress(defaultProgress);
}

function computeActiveDayKeys(sessionDays, dayProgressEdits, shieldDays = state.shieldDays) {
  const active = new Set(sessionDays);

  Object.entries(dayProgressEdits).forEach(([dayKey, progress]) => {
    if (clampProgress(progress) > 0) {
      active.add(dayKey);
    } else {
      active.delete(dayKey);
    }
  });

  shieldDays.forEach((dayKey) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      active.add(dayKey);
    }
  });

  return Array.from(active).sort();
}

function advanceProgramProgress() {
  const nextSessions = state.programState.sessionsInWeek + 1;
  if (nextSessions >= 4) {
    state.programState = {
      week: state.programState.week + 1,
      sessionsInWeek: 0
    };
  } else {
    state.programState = {
      week: state.programState.week,
      sessionsInWeek: nextSessions
    };
  }

  saveProgramState(state.programState);
}

function rewardShieldMilestones() {
  const milestone = Math.floor(state.sessionsCompleted / 5);
  if (milestone <= state.shieldMilestone) return;

  const gain = milestone - state.shieldMilestone;
  state.shieldMilestone = milestone;
  state.shieldTokens = Math.min(3, state.shieldTokens + gain);
  saveShieldState();
}

function saveShieldState() {
  localStorage.setItem(SHIELD_TOKENS_KEY, String(state.shieldTokens));
  localStorage.setItem(SHIELD_MILESTONE_KEY, String(state.shieldMilestone));
  saveDayKeyArray(SHIELD_DAYS_KEY, state.shieldDays);
}

function computeConsistencyScore(activeDayKeys, checkinDays, streak) {
  const active14 = countInLastDays(activeDayKeys, 14);
  const checkins14 = countInLastDays(checkinDays, 14);
  const adherenceScore = (active14 / 14) * 55;
  const checkinScore = (checkins14 / 14) * 25;
  const streakScore = Math.min(1, streak / 10) * 20;
  return Math.round(adherenceScore + checkinScore + streakScore);
}

function computeWeeklyQuest(activeDayKeys, checkinDays, buddyPings) {
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

function countInLastDays(dayKeys, numberOfDays) {
  if (!Array.isArray(dayKeys)) return 0;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (numberOfDays - 1));
  const startKey = toDayKey(start);
  const endKey = toDayKey(end);
  return dayKeys.filter((dayKey) => dayKey >= startKey && dayKey <= endKey).length;
}

function countInCurrentWeek(dayKeys) {
  if (!Array.isArray(dayKeys)) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);
  const mondayKey = toDayKey(monday);
  const todayKey = toDayKey(today);
  return dayKeys.filter((dayKey) => dayKey >= mondayKey && dayKey <= todayKey).length;
}

function estimatedRoutineDurationSec() {
  const stepLimit = getSessionStepLimit();
  return routineSteps.slice(0, stepLimit).reduce((sum, _step, index) => sum + (getStepDurationSec(index) || 45), 0);
}

function getSessionStepLimit() {
  return state.sessionPreset === "rescue" ? 4 : routineSteps.length;
}

function loadSessionCount() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    const parsed = Number(raw);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function saveSessionCount(value) {
  try {
    localStorage.setItem(SESSION_KEY, String(value));
  } catch {
    // Ignore storage errors.
  }
}

function loadSessionLog() {
  try {
    const raw = localStorage.getItem(SESSION_LOG_KEY);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && entry.completedAt);
  } catch {
    return [];
  }
}

function saveSessionLog(entries) {
  try {
    localStorage.setItem(SESSION_LOG_KEY, JSON.stringify(entries));
  } catch {
    // Ignore storage errors.
  }
}

function syncOptionUI() {
  if (progressionMode) progressionMode.value = state.progressionMode;
  if (soundEnabled) soundEnabled.checked = state.soundEnabled;
  if (hapticsEnabled) hapticsEnabled.checked = state.hapticsEnabled;
  if (themeSelect) themeSelect.value = state.theme;
}

function loadProgressionMode() {
  const stored = localStorage.getItem(PROGRESSION_MODE_KEY);
  return stored === "auto" ? "auto" : "manual";
}

function loadProgramTrack() {
  const stored = localStorage.getItem(PROGRAM_TRACK_KEY);
  return Object.prototype.hasOwnProperty.call(programProfiles, stored) ? stored : "beginner";
}

function saveProgramTrack(track) {
  localStorage.setItem(PROGRAM_TRACK_KEY, track);
}

function loadProgramState() {
  try {
    const raw = localStorage.getItem(PROGRAM_STATE_KEY);
    const parsed = JSON.parse(raw || "null");
    if (!parsed || typeof parsed !== "object") {
      return { week: 1, sessionsInWeek: 0 };
    }

    return {
      week: Math.max(1, Number(parsed.week) || 1),
      sessionsInWeek: Math.max(0, Math.min(3, Number(parsed.sessionsInWeek) || 0))
    };
  } catch {
    return { week: 1, sessionsInWeek: 0 };
  }
}

function saveProgramState(programState) {
  localStorage.setItem(PROGRAM_STATE_KEY, JSON.stringify(programState));
}

function loadDayKeyArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)).sort();
  } catch {
    return [];
  }
}

function saveDayKeyArray(key, values) {
  localStorage.setItem(key, JSON.stringify(values));
}

function loadNonNegativeInt(key, fallback, cap = Number.POSITIVE_INFINITY) {
  const parsed = Number(localStorage.getItem(key));
  if (!Number.isFinite(parsed) || parsed < 0) return fallback;
  return Math.min(cap, Math.floor(parsed));
}

function loadBuddyPings() {
  try {
    const raw = localStorage.getItem(BUDDY_PINGS_KEY);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((value) => !Number.isNaN(new Date(value).getTime()));
  } catch {
    return [];
  }
}

function saveBuddyPings(values) {
  localStorage.setItem(BUDDY_PINGS_KEY, JSON.stringify(values));
}

function loadReflectionLog() {
  try {
    const raw = localStorage.getItem(REFLECTION_LOG_KEY);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((entry) => entry && entry.createdAt);
  } catch {
    return [];
  }
}

function saveReflectionLog(values) {
  localStorage.setItem(REFLECTION_LOG_KEY, JSON.stringify(values));
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const allowed = new Set(["default", "cobalt", "emerald", "sunset"]);
  return allowed.has(stored) ? stored : "default";
}

function loadReadiness() {
  try {
    const raw = localStorage.getItem(READINESS_KEY);
    const parsed = JSON.parse(raw || "null");
    if (!parsed || typeof parsed !== "object") return null;

    return {
      dayKey: /^\d{4}-\d{2}-\d{2}$/.test(parsed.dayKey) ? parsed.dayKey : toDayKey(new Date()),
      energy: clampReadiness(parsed.energy),
      soreness: clampReadiness(parsed.soreness),
      mood: clampReadiness(parsed.mood),
      savedAt: parsed.savedAt || null
    };
  } catch {
    return null;
  }
}

function saveReadiness(value) {
  try {
    localStorage.setItem(READINESS_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
}

function loadRecommendation() {
  try {
    const raw = localStorage.getItem(RECOMMENDATION_KEY);
    const parsed = JSON.parse(raw || "null");
    if (!parsed || typeof parsed !== "object") return null;

    const mode = parsed.mode === "auto" ? "auto" : "manual";
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      label: String(parsed.label || "Base Build"),
      intensity: String(parsed.intensity || "Moderate"),
      mode,
      durationScale: clampDurationScale(parsed.durationScale),
      headline: String(parsed.headline || "Balanced mobility and strength flow."),
      description: String(parsed.description || "Today’s coach call: standard durations with strong form cues.")
    };
  } catch {
    return null;
  }
}

function saveRecommendation(value) {
  try {
    localStorage.setItem(RECOMMENDATION_KEY, JSON.stringify(value));
  } catch {
    // Ignore storage errors.
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function loadBoolean(key, defaultValue) {
  const raw = localStorage.getItem(key);
  if (raw === null) return defaultValue;
  return raw === "true";
}

function triggerFeedback(type) {
  if (state.soundEnabled) {
    playTone(type);
  }

  if (state.hapticsEnabled && "vibrate" in navigator) {
    const patterns = {
      start: 20,
      pause: 30,
      resume: 20,
      stepChange: 15,
      stepDone: [30, 30, 30],
      sessionDone: [40, 40, 80]
    };

    navigator.vibrate(patterns[type] || 15);
  }
}

function playTone(type) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const toneMap = {
    start: [660, 0.06],
    pause: [320, 0.06],
    resume: [520, 0.06],
    stepChange: [460, 0.05],
    stepDone: [780, 0.08],
    sessionDone: [920, 0.12]
  };

  const [freq, duration] = toneMap[type] || [460, 0.05];
  const audio = new AudioCtx();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  gain.gain.value = 0.04;

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.start();
  oscillator.stop(audio.currentTime + duration);
}

function loadSessionDays() {
  try {
    const raw = localStorage.getItem(SESSION_DAYS_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value)) : [];
  } catch {
    return [];
  }
}

function saveSessionDays(values) {
  try {
    localStorage.setItem(SESSION_DAYS_KEY, JSON.stringify(values));
  } catch {
    // Ignore storage errors.
  }
}

function recordSessionDay() {
  const dayKey = toDayKey(new Date());
  if (state.sessionDays.includes(dayKey)) return;
  state.sessionDays = [...state.sessionDays, dayKey].sort();
  saveSessionDays(state.sessionDays);
}

function toDayKey(dateValue) {
  return new Date(dateValue).toISOString().slice(0, 10);
}

function computeLast7DaysSessions(dayKeys) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const startKey = toDayKey(start);
  const endKey = toDayKey(today);
  return dayKeys.filter((dayKey) => dayKey >= startKey && dayKey <= endKey).length;
}

function computeStreakDays(dayKeys) {
  if (dayKeys.length === 0) return 0;
  const byDay = new Set(dayKeys);

  let streak = 0;
  const current = new Date();
  current.setHours(0, 0, 0, 0);

  while (true) {
    const key = toDayKey(current);
    if (!byDay.has(key)) break;
    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}
