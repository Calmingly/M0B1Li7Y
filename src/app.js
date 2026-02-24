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
const SESSION_LENGTH_KEY = "m0b1li7y.sessionLength";
const TIME_AVAILABLE_KEY = "m0b1li7y.timeAvailableMin";
const SORENESS_LOG_KEY = "m0b1li7y.sorenessLog";
const FORM_RATINGS_KEY = "m0b1li7y.formRatings";
const BADGES_KEY = "m0b1li7y.badges";
const LAST_BADGE_KEY = "m0b1li7y.lastBadge";
const REMINDERS_KEY = "m0b1li7y.reminders";
const VOICE_CUES_KEY = "m0b1li7y.voiceCues";
const MISSION_TEXT_KEY = "m0b1li7y.missionText";
const LEGACY_FOCUS_PROMPT_KEY = "m0b1li7y.focusPrompt";

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
const timeAvailable = document.getElementById("time-available");
const lengthQuick = document.getElementById("length-quick");
const lengthStandard = document.getElementById("length-standard");
const lengthDeep = document.getElementById("length-deep");
const lengthFull = document.getElementById("length-full");
const timelineYesterday = document.getElementById("timeline-yesterday");
const timelineToday = document.getElementById("timeline-today");
const timelineTomorrow = document.getElementById("timeline-tomorrow");
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
const generateMissionBtn = document.getElementById("generate-mission-btn");
const copyMissionBtn = document.getElementById("copy-mission-btn");
const missionText = document.getElementById("mission-text");
const reflectionEffort = document.getElementById("reflection-effort");
const reflectionForm = document.getElementById("reflection-form");
const reflectionEffortOutput = document.getElementById("reflection-effort-output");
const reflectionFormOutput = document.getElementById("reflection-form-output");
const saveReflectionBtn = document.getElementById("save-reflection-btn");
const reflectionCoachTip = document.getElementById("reflection-coach-tip");
const monthLevel = document.getElementById("month-level");
const monthProgress = document.getElementById("month-progress");
const monthUnlock = document.getElementById("month-unlock");
const badgeUnlock = document.getElementById("badge-unlock");
const weeklyWrapup = document.getElementById("weekly-wrapup");
const formQualityNote = document.getElementById("form-quality-note");
const formQualitySection = document.querySelector(".form-quality");

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
const voiceCuesEnabled = document.getElementById("voice-cues-enabled");
const remindersEnabled = document.getElementById("reminders-enabled");
const morningReminderTime = document.getElementById("morning-reminder-time");
const eveningReminderTime = document.getElementById("evening-reminder-time");
const ifthenReminder = document.getElementById("ifthen-reminder");
const requestNotificationBtn = document.getElementById("request-notification-btn");
const exportDataBtn = document.getElementById("export-data-btn");
const importDataBtn = document.getElementById("import-data-btn");
const importDataFile = document.getElementById("import-data-file");
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
  sessionLength: loadSessionLength(),
  timeAvailableMin: loadNonNegativeInt(TIME_AVAILABLE_KEY, 15, 25),
  sorenessLog: loadSorenessLog(),
  formRatings: loadFormRatings(),
  badges: loadBadges(),
  lastBadge: localStorage.getItem(LAST_BADGE_KEY) || "",
  reminders: loadReminders(),
  voiceCuesEnabled: loadBoolean(VOICE_CUES_KEY, false),
  missionText: localStorage.getItem(MISSION_TEXT_KEY) || localStorage.getItem(LEGACY_FOCUS_PROMPT_KEY) || "",
  sessionPreset: "full",
  durationScale: 1,
  activeView: "today-view",
  sessionStartedAt: null
};

init();

function init() {
  if (!localStorage.getItem(MISSION_TEXT_KEY)) {
    const legacyMission = localStorage.getItem(LEGACY_FOCUS_PROMPT_KEY);
    if (legacyMission) {
      localStorage.setItem(MISSION_TEXT_KEY, legacyMission);
    }
  }

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
  seedPlanningInputs();
  syncOptionUI();
  syncProgramUI();
  syncReadinessUI();
  syncReflectionUI();
  syncLengthChips();
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
  generateMissionBtn?.addEventListener("click", generateTodaysMission);
  copyMissionBtn?.addEventListener("click", copyTodaysMission);
  requestNotificationBtn?.addEventListener("click", requestNotificationPermission);
  exportDataBtn?.addEventListener("click", exportProgressData);
  importDataBtn?.addEventListener("click", () => importDataFile?.click());
  importDataFile?.addEventListener("change", importProgressData);

  [lengthQuick, lengthStandard, lengthDeep, lengthFull].forEach((button) => {
    button?.addEventListener("click", () => {
      const lengthValue = button.getAttribute("data-length");
      if (!lengthValue) return;
      state.sessionLength = normalizeSessionLength(lengthValue);
      localStorage.setItem(SESSION_LENGTH_KEY, state.sessionLength);
      if (state.sessionPreset !== "rescue" && !state.isRunning) {
        state.remainingSec = getStepDurationSec(state.stepIndex);
      }
      syncLengthChips();
      renderTodayDashboard();
      renderStep();
    });
  });

  timeAvailable?.addEventListener("change", () => {
    state.timeAvailableMin = Math.max(2, Math.min(25, Number(timeAvailable.value) || 15));
    localStorage.setItem(TIME_AVAILABLE_KEY, String(state.timeAvailableMin));
    renderTodayDashboard();
  });

  formQualitySection?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-form-rating]");
    if (!button) return;
    const rating = Number(button.getAttribute("data-form-rating"));
    if (!Number.isFinite(rating)) return;
    saveStepFormRating(state.stepIndex, rating);
    Array.from(formQualitySection.querySelectorAll("button[data-form-rating]")).forEach((chip) => {
      chip.classList.toggle("active", chip === button);
    });
  });

  programTrack?.addEventListener("change", () => {
    state.programTrack = programTrack.value;
    saveProgramTrack(state.programTrack);
    renderTodayDashboard();
  });

  [reflectionEffort, reflectionForm].forEach((input) => {
    input?.addEventListener("input", syncReflectionUI);
  });

  voiceCuesEnabled?.addEventListener("change", () => {
    state.voiceCuesEnabled = Boolean(voiceCuesEnabled.checked);
    localStorage.setItem(VOICE_CUES_KEY, String(state.voiceCuesEnabled));
  });

  [remindersEnabled, morningReminderTime, eveningReminderTime, ifthenReminder].forEach((input) => {
    input?.addEventListener("change", saveReminderSettings);
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
    saveReflectionBtn,
    generatePromptBtn,
    copyPromptBtn,
    requestNotificationBtn,
    exportDataBtn,
    importDataBtn
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

function seedPlanningInputs() {
  if (timeAvailable) {
    timeAvailable.value = String(state.timeAvailableMin);
  }

  if (state.reminders) {
    if (remindersEnabled) remindersEnabled.checked = state.reminders.enabled;
    if (morningReminderTime) morningReminderTime.value = state.reminders.morning;
    if (eveningReminderTime) eveningReminderTime.value = state.reminders.evening;
    if (ifthenReminder) ifthenReminder.checked = state.reminders.ifThen;
  }
}

function syncLengthChips() {
  const chips = [lengthQuick, lengthStandard, lengthDeep, lengthFull].filter(Boolean);
  chips.forEach((chip) => {
    const isActive = chip.getAttribute("data-length") === state.sessionLength;
    chip.classList.toggle("active", isActive);
  });
}

function saveReminderSettings() {
  state.reminders = {
    enabled: Boolean(remindersEnabled?.checked),
    morning: morningReminderTime?.value || "08:00",
    evening: eveningReminderTime?.value || "18:00",
    ifThen: Boolean(ifthenReminder?.checked)
  };

  localStorage.setItem(REMINDERS_KEY, JSON.stringify(state.reminders));
  renderTodayDashboard();
}

function saveStepFormRating(stepIndex, rating) {
  const step = routineSteps[stepIndex];
  if (!step) return;

  const current = state.formRatings[step.name] || { total: 0, count: 0, last: 2 };
  const updated = {
    total: current.total + rating,
    count: current.count + 1,
    last: rating
  };

  state.formRatings = {
    ...state.formRatings,
    [step.name]: updated
  };

  localStorage.setItem(FORM_RATINGS_KEY, JSON.stringify(state.formRatings));

  if (formQualityNote) {
    const quality = rating === 1 ? "needs smoother control" : rating === 2 ? "looks solid" : "looks sharp";
    formQualityNote.textContent = `${step.name} ${quality}. This will tune your next recommendation.`;
  }

  triggerFeedback("stepChange");
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

function generateTodaysMission() {
  const prompts = [
    "Mission: complete one clean session before noon.",
    "Mission: move with control and finish every transition.",
    "Mission: protect your streak with at least a quick flow.",
    "Mission: prioritize form quality over speed today.",
    "Mission: own your breathing cadence through each step.",
    "Mission: finish strong with perfect posture on the last movement."
  ];

  state.missionText = prompts[Math.floor(Math.random() * prompts.length)];
  localStorage.setItem(MISSION_TEXT_KEY, state.missionText);
  renderTodayDashboard();
  showFeedbackBanner("Today's mission generated.");
}

async function copyTodaysMission() {
  const prompt = state.missionText || "Generate a mission first.";
  try {
    await navigator.clipboard.writeText(prompt);
    showFeedbackBanner("Today's mission copied.");
  } catch {
    showFeedbackBanner("Copy unavailable. Select and copy manually.");
  }
}

async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    showFeedbackBanner("Notifications are not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    showFeedbackBanner("Notifications enabled.");
  } else {
    showFeedbackBanner("Notification permission not granted.");
  }
}

function exportProgressData() {
  const payload = {};
  Object.keys(localStorage)
    .filter((key) => key.startsWith("m0b1li7y."))
    .forEach((key) => {
      payload[key] = localStorage.getItem(key);
    });

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `m0b1li7y-progress-${toDayKey(new Date())}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showFeedbackBanner("Progress exported.");
}

function importProgressData(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || !target.files?.[0]) return;

  const file = target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      Object.entries(parsed).forEach(([key, value]) => {
        if (!key.startsWith("m0b1li7y.")) return;
        localStorage.setItem(key, String(value));
      });
      showFeedbackBanner("Progress imported. Reloading...");
      window.setTimeout(() => window.location.reload(), 650);
    } catch {
      showFeedbackBanner("Import failed. Invalid JSON file.");
    }
  };

  reader.readAsText(file);
  target.value = "";
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

  state.sorenessLog = recordSoreness(state.sorenessLog, state.readiness.dayKey, soreness);
  localStorage.setItem(SORENESS_LOG_KEY, JSON.stringify(state.sorenessLog));

  maybeAutoSwitchProgramTrack();

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
  state.sessionLength = normalizeSessionLength(recommendation.suggestedLength || state.sessionLength);
  localStorage.setItem(SESSION_LENGTH_KEY, state.sessionLength);

  if (!state.isRunning) {
    state.remainingSec = getStepDurationSec(state.stepIndex);
  }

  saveReadiness(state.readiness);
  saveRecommendation(recommendation);
  syncLengthChips();
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
  state.sessionLength = normalizeSessionLength(state.recommendation.suggestedLength || state.sessionLength);
  localStorage.setItem(SESSION_LENGTH_KEY, state.sessionLength);
  localStorage.setItem(PROGRESSION_MODE_KEY, state.progressionMode);
  saveRecommendation(state.recommendation);
  syncOptionUI();
  syncLengthChips();

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
  const monthly = computeMonthlyChallenge(state.sessionLog);
  const timeline = buildCoachTimeline(recommendation, state.sessionLog);

  readinessScore.textContent = `${recommendation.score}`;
  readinessHeadline.textContent = isToday
    ? `${recommendation.label} plan ready. ${recommendation.headline}`
    : "Log today’s check-in to personalize your plan.";
  recommendationText.textContent = recommendation.description;

  if (timelineYesterday) timelineYesterday.textContent = `Yesterday: ${timeline.yesterday}`;
  if (timelineToday) timelineToday.textContent = `Today: ${timeline.today}`;
  if (timelineTomorrow) timelineTomorrow.textContent = `Tomorrow: ${timeline.tomorrow}`;

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

  if (missionText) {
    missionText.textContent = state.missionText
      ? `Mission: ${state.missionText}`
      : "Mission: generate today's objective.";
  }

  if (monthLevel) {
    monthLevel.textContent = monthly.level;
  }

  if (monthProgress) {
    monthProgress.textContent = `${monthly.sessions}/${monthly.target} sessions`;
  }

  if (monthUnlock) {
    monthUnlock.textContent = monthly.unlock;
  }

  if (badgeUnlock) {
    badgeUnlock.textContent = state.lastBadge || "None yet";
  }

  if (weeklyWrapup) {
    weeklyWrapup.textContent = buildWeeklyWrapup(activeDayKeys, state.sessionLog);
  }

  maybeShowReminderNudge(activeDayKeys);

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
    state.sessionPreset === "rescue" ? "Rescue Session" : `${labelForSessionLength(state.sessionLength)} Session`
  ].forEach((chipText) => {
    const chip = document.createElement("span");
    chip.className = "recommendation-chip";
    chip.textContent = chipText;
    recommendationChips.append(chip);
  });
}

function maybeShowReminderNudge(activeDayKeys) {
  if (!state.reminders.enabled) return;
  const todayKey = toDayKey(new Date());
  if (activeDayKeys.includes(todayKey)) return;

  const now = new Date();
  const current = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (state.reminders.ifThen && current >= state.reminders.evening) {
    const marker = `${todayKey}:evening`;
    if (maybeShowReminderNudge.lastMarker !== marker) {
      maybeShowReminderNudge.lastMarker = marker;
      showFeedbackBanner("Evening plan: run a quick or rescue session to keep your streak alive.");
    }
  } else if (current >= state.reminders.morning) {
    const marker = `${todayKey}:morning`;
    if (maybeShowReminderNudge.lastMarker !== marker) {
      maybeShowReminderNudge.lastMarker = marker;
      showFeedbackBanner("Morning check-in reminder: log readiness to get your daily plan.");
    }
  }
}

function buildRecommendation(readiness, stats) {
  const energy = clampReadiness(readiness?.energy);
  const soreness = clampReadiness(readiness?.soreness);
  const mood = clampReadiness(readiness?.mood);
  const profile = programProfiles[state.programTrack] || programProfiles.beginner;
  const latestReflection = getLatestReflection();
  const formAverage = computeRecentFormAverage();
  const highSoreness = hasConsecutiveHighSoreness(state.sorenessLog, 2, 4);
  const inDeloadWeek = state.programState.week % 4 === 0;
  const suggestedLength = selectSessionLength(state.timeAvailableMin);

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
      mode: profile.modeBias === "auto" ? "manual" : profile.modeBias,
      durationScale: clampDurationScale(0.82 + profile.tempoBias),
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
      mode: profile.modeBias === "manual" ? "manual" : stats.weekly >= 2 ? "auto" : "manual",
      durationScale: clampDurationScale(1 + profile.tempoBias),
      suggestedLength,
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
    suggestedLength: suggestedLength === "quick" ? "standard" : suggestedLength,
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
    preset: state.sessionPreset === "rescue" ? "rescue" : state.sessionLength,
    program: state.programTrack
  };

  state.sessionLog = [sessionEntry, ...state.sessionLog].slice(0, 60);
  saveSessionLog(state.sessionLog);

  recordSessionDay();
  advanceProgramProgress();
  rewardShieldMilestones();
  maybeUnlockBadges();
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

  if (formQualitySection) {
    const lastRating = state.formRatings[step.name]?.last;
    Array.from(formQualitySection.querySelectorAll("button[data-form-rating]")).forEach((chip) => {
      chip.classList.toggle("active", Number(chip.getAttribute("data-form-rating")) === lastRating);
    });
  }
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
  summary.textContent = "Adaptive order: readiness + time-aware session length → coached routine + form quality scoring → monthly levels, weekly wrap-up, and challenge unlocks.";
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
      const presetLabel = entry.preset === "rescue" ? "Rescue" : labelForSessionLength(entry.preset || "full");
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

  if (state.programState.week % 4 === 0 && state.programState.sessionsInWeek === 0) {
    showFeedbackBanner("Deload week activated. Keep intensity controlled.");
  }
}

function maybeUnlockBadges() {
  const activeDayKeys = computeActiveDayKeys(state.sessionDays, state.dayProgressEdits);
  const streak = computeStreakDays(activeDayKeys);
  const badges = new Set(state.badges);

  const unlocks = [
    { id: "First Win", check: state.sessionsCompleted >= 1 },
    { id: "Consistency 7", check: streak >= 7 },
    { id: "Quest Closer", check: computeWeeklyQuest(activeDayKeys, state.checkinDays, state.buddyPings).percent >= 80 },
    { id: "Monthly Silver", check: computeMonthlyChallenge(state.sessionLog).level === "Silver" || computeMonthlyChallenge(state.sessionLog).level === "Gold" || computeMonthlyChallenge(state.sessionLog).level === "Elite" }
  ];

  let newest = "";
  unlocks.forEach((unlock) => {
    if (!unlock.check || badges.has(unlock.id)) return;
    badges.add(unlock.id);
    newest = unlock.id;
  });

  state.badges = Array.from(badges);
  localStorage.setItem(BADGES_KEY, JSON.stringify(state.badges));

  if (newest) {
    state.lastBadge = newest;
    localStorage.setItem(LAST_BADGE_KEY, newest);
    showFeedbackBanner(`Badge unlocked: ${newest}`);
  }
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

function normalizeSessionLength(value) {
  const allowed = new Set(["quick", "standard", "deep", "full"]);
  return allowed.has(value) ? value : "standard";
}

function selectSessionLength(minutes) {
  const safeMinutes = Number(minutes) || 15;
  if (safeMinutes <= 3) return "quick";
  if (safeMinutes <= 10) return "standard";
  if (safeMinutes <= 18) return "deep";
  return "full";
}

function labelForSessionLength(length) {
  const labels = {
    quick: "Quick",
    standard: "Standard",
    deep: "Deep",
    full: "Full"
  };
  return labels[normalizeSessionLength(length)] || "Standard";
}

function recordSoreness(sorenessLog, dayKey, soreness) {
  const withoutToday = sorenessLog.filter((entry) => entry.dayKey !== dayKey);
  return [{ dayKey, soreness }, ...withoutToday].slice(0, 10);
}

function hasConsecutiveHighSoreness(sorenessLog, requiredDays, threshold) {
  const sorted = [...sorenessLog]
    .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.dayKey))
    .sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));

  if (sorted.length < requiredDays) return false;
  return sorted.slice(0, requiredDays).every((entry) => Number(entry.soreness) >= threshold);
}

function computeRecentFormAverage() {
  const rows = Object.values(state.formRatings || {});
  if (rows.length === 0) return 2;
  const total = rows.reduce((sum, row) => sum + (row.total || 0), 0);
  const count = rows.reduce((sum, row) => sum + (row.count || 0), 0);
  return count === 0 ? 2 : total / count;
}

function maybeAutoSwitchProgramTrack() {
  const previousWeekSessions = countInPreviousWeek(computeActiveDayKeys(state.sessionDays, state.dayProgressEdits));
  if (previousWeekSessions <= 1 && state.programTrack !== "recovery") {
    state.programTrack = "recovery";
    saveProgramTrack(state.programTrack);
    syncProgramUI();
  }
}

function countInPreviousWeek(dayKeys) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() - dayOfWeek);
  const previousSunday = new Date(currentMonday);
  previousSunday.setDate(currentMonday.getDate() - 1);
  const previousMonday = new Date(previousSunday);
  previousMonday.setDate(previousSunday.getDate() - 6);
  const startKey = toDayKey(previousMonday);
  const endKey = toDayKey(previousSunday);
  return dayKeys.filter((dayKey) => dayKey >= startKey && dayKey <= endKey).length;
}

function buildCoachTimeline(recommendation, sessionLog) {
  const latestSession = sessionLog[0];
  const yesterday = latestSession
    ? `${Math.max(1, Math.round((latestSession.durationSec || 0) / 60))} min ${latestSession.preset === "rescue" ? "Rescue" : "Flow"}`
    : "No session logged";
  const today = `${recommendation.label} • ${labelForSessionLength(state.sessionLength)} session`;
  const tomorrow = recommendation.intensity === "High"
    ? "Aim to hold quality under load"
    : recommendation.intensity === "Moderate"
      ? "Build consistency with clean reps"
      : "Prioritize recovery and mobility range";

  return { yesterday, today, tomorrow };
}

function computeMonthlyChallenge(sessionLog) {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthSessions = sessionLog.filter((entry) => entry.completedAt?.slice(0, 7) === monthKey).length;

  if (monthSessions >= 26) return { level: "Elite", target: 26, sessions: monthSessions, unlock: "Elite Aura Theme" };
  if (monthSessions >= 20) return { level: "Gold", target: 20, sessions: monthSessions, unlock: "Gold Edge Badges" };
  if (monthSessions >= 14) return { level: "Silver", target: 14, sessions: monthSessions, unlock: "Silver Coach Card" };
  return { level: "Bronze", target: 8, sessions: monthSessions, unlock: "Starter Pack" };
}

function buildWeeklyWrapup(activeDayKeys, sessionLog) {
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
  if (state.sessionPreset === "rescue") return 4;

  const limits = {
    quick: 4,
    standard: 8,
    deep: 10,
    full: routineSteps.length
  };

  return limits[normalizeSessionLength(state.sessionLength)] || routineSteps.length;
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
  if (voiceCuesEnabled) voiceCuesEnabled.checked = state.voiceCuesEnabled;
  if (remindersEnabled) remindersEnabled.checked = state.reminders.enabled;
  if (morningReminderTime) morningReminderTime.value = state.reminders.morning;
  if (eveningReminderTime) eveningReminderTime.value = state.reminders.evening;
  if (ifthenReminder) ifthenReminder.checked = state.reminders.ifThen;
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

function loadSessionLength() {
  return normalizeSessionLength(localStorage.getItem(SESSION_LENGTH_KEY) || "standard");
}

function loadSorenessLog() {
  try {
    const raw = localStorage.getItem(SORENESS_LOG_KEY);
    const parsed = JSON.parse(raw || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((entry) => entry && /^\d{4}-\d{2}-\d{2}$/.test(entry.dayKey))
      .map((entry) => ({ dayKey: entry.dayKey, soreness: clampReadiness(entry.soreness) }));
  } catch {
    return [];
  }
}

function loadFormRatings() {
  try {
    const raw = localStorage.getItem(FORM_RATINGS_KEY);
    const parsed = JSON.parse(raw || "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function loadBadges() {
  try {
    const raw = localStorage.getItem(BADGES_KEY);
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.map((value) => String(value)) : [];
  } catch {
    return [];
  }
}

function loadReminders() {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    const parsed = JSON.parse(raw || "null");
    if (!parsed || typeof parsed !== "object") {
      return {
        enabled: false,
        morning: "08:00",
        evening: "18:00",
        ifThen: false
      };
    }

    return {
      enabled: Boolean(parsed.enabled),
      morning: String(parsed.morning || "08:00"),
      evening: String(parsed.evening || "18:00"),
      ifThen: Boolean(parsed.ifThen)
    };
  } catch {
    return {
      enabled: false,
      morning: "08:00",
      evening: "18:00",
      ifThen: false
    };
  }
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  const allowed = new Set(["default", "cobalt", "emerald", "sunset", "neon", "voltage", "inferno", "aurora"]);
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

  if (state.voiceCuesEnabled) {
    const cueMap = {
      start: `Starting ${routineSteps[state.stepIndex]?.name || "session"}.`,
      pause: "Session paused.",
      resume: "Session resumed.",
      stepChange: `${routineSteps[state.stepIndex]?.name || "Next step"}.`,
      stepDone: "Step complete.",
      sessionDone: "Session complete. Great work."
    };
    speakCue(cueMap[type] || "");
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

function speakCue(text) {
  if (!text || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 0.85;
  window.speechSynthesis.speak(utterance);
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
