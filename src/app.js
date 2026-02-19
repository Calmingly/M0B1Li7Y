import { loadRoutineImages } from "./routineImages.js";

const APP_VERSION = "v1";
const SETTINGS_KEY = "m0b1li7y.settings";
const HISTORY_KEY = "m0b1li7y.history";
const HISTORY_DAY_EDITS_KEY = "m0b1li7y.historyDayEdits";
const HISTORY_SAVE_DEBOUNCE_MS = 400;
const WEEKLY_GOAL = 5;

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticsEnabled: true,
  defaultWalkDuration: 4,
  enableRemoteImageCaching: false
  ,theme: "default"
};

// Developer setting: disable service worker to bypass caching during development/testing
DEFAULT_SETTINGS.disableServiceWorker = false;

// Countdown low-warning threshold (seconds). When remaining time is <= this
// value the UI will visually warn the user.
const LOW_WARNING_SEC = 8;

const ROUTINE_STEPS = [
  { id: "armCircles", name: "Arm Circles", cue: "Smooth shoulder circles.", durationSec: 30 },
  { id: "counterPushups", name: "Counter Pushups", cue: "Complete 10–15 reps.", durationSec: null },
  { id: "legSwings", name: "Leg Swings", cue: "Switch sides halfway and keep control.", durationSec: 30 },
  { id: "trunkRotations", name: "Trunk Rotations", cue: "Rotate gently side to side.", durationSec: 30 },
  { id: "postureReset", name: "Posture Reset", cue: "Stand tall, ribs down, shoulders relaxed.", durationSec: 30 },
  { id: "sideBends", name: "Side Bends", cue: "Reach and lengthen through the side body.", durationSec: 30 },
  { id: "plank", name: "Plank", cue: "Brace core and keep a straight line.", durationSec: 60 },
  { id: "kneesToChest", name: "Knees To Chest", cue: "Alternate legs with steady posture.", durationSec: 30 },
  { id: "figureFour", name: "Figure Four", cue: "Switch sides halfway and avoid knee pressure.", durationSec: 30 },
  { id: "childPose", name: "Child Pose", cue: "Relax neck and breathe deeply.", durationSec: 45 },
  { id: "briskWalk", name: "Brisk Walk", cue: "Pick 3, 4, or 5 minutes.", durationSec: "briskWalk" }
];

const state = {
  settings: loadSettings(),
  startedAt: null,
  isRunning: false,
  isPaused: false,
  stepIndex: 0,
  remainingSec: ROUTINE_STEPS[0].durationSec,
  timerRef: null,
  imageMap: {},
  selectedHistoryDay: null,
  selectedHistoryStepIds: [],
  selectedHistoryStepSet: new Set(),
  historyCache: null,
  historyEditsPending: null,
  historyEditsSaveTimer: null,
  preloadedImageUrls: new Set()
};

const els = {
  stepProgress: document.getElementById("step-progress"),
  stepName: document.getElementById("step-name"),
  stepCue: document.getElementById("step-cue"),
  timer: document.getElementById("timer"),
  startBtn: document.getElementById("start-btn"),
  startControls: document.getElementById("start-controls"),
  runControls: document.getElementById("run-controls"),
  doneControls: document.getElementById("done-controls"),
  pauseBtn: document.getElementById("pause-btn"),
  backBtn: document.getElementById("back-btn"),
  nextBtn: document.getElementById("next-btn"),
  doneBtn: document.getElementById("done-btn"),
  muteToggle: document.getElementById("mute-toggle"),
  walkPicker: document.getElementById("walk-picker"),
  stepImage: document.getElementById("step-image"),
  mediaFrame: document.getElementById("media-frame"),
  imageFallback: document.getElementById("image-fallback"),
  imageCredit: document.getElementById("image-credit"),
  imageCreditLink: document.getElementById("image-credit-link"),
  historyList: document.getElementById("history-list"),
  streak: document.getElementById("streak"),
  streakSummary: document.getElementById("streak-summary"),
  sessionsWeek: document.getElementById("sessions-week"),
  minutesWeek: document.getElementById("minutes-week"),
  goalNudge: document.getElementById("goal-nudge"),
  milestoneProgress: document.getElementById("milestone-progress"),
  historyDayInput: document.getElementById("history-day-input"),
  openDayEdit: document.getElementById("open-day-edit"),
  historyEditor: document.getElementById("history-editor"),
  historyEditorTitle: document.getElementById("history-editor-title"),
  historyPieceList: document.getElementById("history-piece-list"),
  piecesValue: document.getElementById("pieces-value"),
  markAllDayEdit: document.getElementById("mark-all-day-edit"),
  clearAllDayEdit: document.getElementById("clear-all-day-edit"),
  weekdayTemplateDayEdit: document.getElementById("weekday-template-day-edit"),
  saveDayEdit: document.getElementById("save-day-edit"),
  cancelDayEdit: document.getElementById("cancel-day-edit"),
  resetDayEdit: document.getElementById("reset-day-edit"),
  soundEnabled: document.getElementById("sound-enabled"),
  hapticsEnabled: document.getElementById("haptics-enabled"),
  defaultWalkDuration: document.getElementById("default-walk-duration"),
  remoteImageCaching: document.getElementById("remote-image-caching"),
  disableSW: document.getElementById("disable-sw"),
  themeSelect: document.getElementById("theme-select"),
  themeSwatch: document.getElementById("theme-swatch"),
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  views: Array.from(document.querySelectorAll(".view")),
  walkOptions: Array.from(document.querySelectorAll(".walk-options button"))
};

function init() {
  hydrateSettingsUI();
  applyTheme(state.settings.theme);
  attachErrorHandlers();
  initializeHistoryEditorChecklist();
  wireEvents();
  renderStep();
  renderHistory();
  registerServiceWorker();
  // If we previously requested an update and reloaded, show a small confirmation.
  try {
    if (sessionStorage.getItem("m0b1li7y.showUpdateToast") === "1") {
      sessionStorage.removeItem("m0b1li7y.showUpdateToast");
      showToast("App updated");
    }
  } catch {}
  loadRoutineImages().then((imageMap) => {
    state.imageMap = imageMap;
    renderStepImage();
  });

  if (els.historyDayInput && !els.historyDayInput.value) {
    els.historyDayInput.value = toDayKey(new Date());
  }

  window.addEventListener("beforeunload", flushHistoryDayEditsWrite);
}

function wireEvents() {
  els.startBtn.addEventListener("click", startRoutine);
  els.pauseBtn.addEventListener("click", togglePause);

  els.backBtn.addEventListener("click", () => {
    if (state.isRunning && !state.isPaused) transitionCue();
    goToStep(state.stepIndex - 1);
  });

  els.nextBtn.addEventListener("click", () => {
    if (state.isRunning && !state.isPaused) transitionCue();
    goToStep(state.stepIndex + 1);
  });

  els.doneBtn.addEventListener("click", () => {
    if (state.isRunning && !state.isPaused) transitionCue();
    goToStep(state.stepIndex + 1);
  });

  els.muteToggle.addEventListener("click", toggleMute);

  if (els.historyList) {
    els.historyList.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const button = target.closest("button[data-day-key]");
      if (!button) return;
      openHistoryEditor(button.dataset.dayKey);
    });
  }

  if (els.openDayEdit) {
    els.openDayEdit.addEventListener("click", openSelectedDayEditor);
  }

  if (els.markAllDayEdit) {
    els.markAllDayEdit.addEventListener("click", () => {
      state.selectedHistoryStepSet = new Set(ROUTINE_STEPS.map((step) => step.id));
      syncHistoryStepSelectionFromSet();
    });
  }

  if (els.clearAllDayEdit) {
    els.clearAllDayEdit.addEventListener("click", () => {
      state.selectedHistoryStepSet = new Set();
      syncHistoryStepSelectionFromSet();
    });
  }

  if (els.weekdayTemplateDayEdit) {
    els.weekdayTemplateDayEdit.addEventListener("click", applyWeekdayTemplateForSelectedDay);
  }

  if (els.saveDayEdit) {
    els.saveDayEdit.addEventListener("click", saveHistoryDayEdit);
  }

  if (els.cancelDayEdit) {
    els.cancelDayEdit.addEventListener("click", closeHistoryEditor);
  }

  if (els.resetDayEdit) {
    els.resetDayEdit.addEventListener("click", resetHistoryDayEdit);
  }

  els.navButtons.forEach((btn) => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  els.walkOptions.forEach((btn) =>
    btn.addEventListener("click", () => {
      state.settings.defaultWalkDuration = Number(btn.dataset.mins);
      saveSettings();
      if (currentStep().id === "briskWalk") {
        state.remainingSec = state.settings.defaultWalkDuration * 60;
        renderStep();
      }
    })
  );

  els.soundEnabled.addEventListener("change", () => {
    state.settings.soundEnabled = els.soundEnabled.checked;
    saveSettings();
    syncMuteIcon();
  });

  els.hapticsEnabled.addEventListener("change", () => {
    state.settings.hapticsEnabled = els.hapticsEnabled.checked;
    saveSettings();
  });

  els.defaultWalkDuration.addEventListener("change", () => {
    state.settings.defaultWalkDuration = Number(els.defaultWalkDuration.value);
    saveSettings();
  });

  els.remoteImageCaching.addEventListener("change", () => {
    state.settings.enableRemoteImageCaching = els.remoteImageCaching.checked;
    saveSettings();
    notifyServiceWorkerSettings();
  });

  if (els.disableSW) {
    els.disableSW.addEventListener("change", async () => {
      state.settings.disableServiceWorker = els.disableSW.checked;
      saveSettings();
      if (state.settings.disableServiceWorker) {
        await unregisterAllServiceWorkers();
      } else {
        // Re-register the service worker if user re-enables it
        registerServiceWorker();
      }
    });
  }

  if (els.themeSelect) {
    // Live preview as user navigates options, persist on change
    els.themeSelect.addEventListener("input", () => {
      applyTheme(els.themeSelect.value);
    });

    els.themeSelect.addEventListener("change", () => {
      state.settings.theme = els.themeSelect.value;
      saveSettings();
      applyTheme(state.settings.theme);
    });
  }

  els.stepImage.addEventListener("load", () => {
    const info = state.imageMap[currentStep().id];
    if (!info) {
      els.stepImage.hidden = true;
      els.imageFallback.hidden = true;
      els.imageCredit.hidden = true;
      return;
    }
    els.stepImage.hidden = false;
    els.imageFallback.hidden = true;
    els.imageCredit.hidden = true;
  });

  els.stepImage.addEventListener("error", () => {
    els.stepImage.hidden = true;
    els.imageFallback.hidden = true;
    els.imageCredit.hidden = true;
  });
}

function startRoutine() {
  if (!state.startedAt) state.startedAt = Date.now();
  state.isRunning = true;
  state.isPaused = false;
  startTicking();
  renderStep();
  updateControlLayout(currentStep());
}

function startTicking() {
  stopTicking();
  state.timerRef = setInterval(() => {
    if (!state.isRunning || state.isPaused) return;
    if (typeof state.remainingSec !== "number") return;

    state.remainingSec -= 1;
    if (state.remainingSec <= 0) {
      transitionCue();
      goToStep(state.stepIndex + 1);
      return;
    }
    renderTimer();
  }, 1000);
}

function stopTicking() {
  if (state.timerRef) clearInterval(state.timerRef);
}

function togglePause() {
  if (!state.isRunning) return;
  state.isPaused = !state.isPaused;
  updateControlLayout(currentStep());
}

function goToStep(nextIndex) {
  if (nextIndex < 0) return;
  if (nextIndex >= ROUTINE_STEPS.length) {
    finishRoutine();
    return;
  }

  state.stepIndex = nextIndex;
  const step = currentStep();

  if (step.durationSec === "briskWalk") {
    state.remainingSec = state.settings.defaultWalkDuration * 60;
  } else {
    state.remainingSec = step.durationSec;
  }

  renderStep();
}

function currentStep() {
  return ROUTINE_STEPS[state.stepIndex];
}

function updateControlLayout(step) {
  const isUntimed = step.durationSec === null;
  const notStarted = !state.isRunning && !state.startedAt && state.stepIndex === 0;

  els.startControls.hidden = !notStarted;
  els.runControls.hidden = notStarted;

  if (notStarted) {
    els.pauseBtn.textContent = "Pause";
    els.pauseBtn.disabled = true;
    els.backBtn.disabled = true;
    els.nextBtn.disabled = false;
    els.doneControls.hidden = true;
    return;
  }

  els.pauseBtn.disabled = !state.isRunning;
  els.backBtn.disabled = state.stepIndex === 0;
  els.nextBtn.disabled = state.stepIndex === ROUTINE_STEPS.length - 1;

  if (state.isRunning) {
    els.pauseBtn.textContent = state.isPaused ? "Resume" : "Pause";
    els.doneControls.hidden = !isUntimed;
  } else {
    els.pauseBtn.textContent = "Pause";
    els.doneControls.hidden = true;
  }
}

function renderStep() {
  const step = currentStep();
  els.stepProgress.textContent = `Step ${state.stepIndex + 1} of ${ROUTINE_STEPS.length}`;
  els.stepName.textContent = step.name;
  els.stepCue.textContent = step.cue;

  const untimed = step.durationSec === null;
  els.doneBtn.hidden = !untimed;

  els.walkPicker.hidden = step.id !== "briskWalk";
  els.walkOptions.forEach((button) => {
    button.disabled = step.id !== "briskWalk";
  });

  renderTimer();
  renderStepImage();
  updateControlLayout(step);
}

function renderStepImage() {
  const imageInfo = state.imageMap[currentStep().id];
  if (!imageInfo) {
    els.stepImage.removeAttribute("src");
    els.stepImage.hidden = true;
    els.imageFallback.hidden = true;
    els.imageCredit.hidden = true;
    return;
  }

  els.stepImage.alt = imageInfo.alt;
  // Image credit text intentionally hidden in UI.
  els.imageCredit.hidden = true;
  els.imageFallback.hidden = true;
  els.stepImage.hidden = false;
  els.stepImage.src = imageInfo.url;

  preloadNextStepImage();
}

function preloadNextStepImage() {
  const nextStep = ROUTINE_STEPS[state.stepIndex + 1];
  if (!nextStep) return;

  const nextImageInfo = state.imageMap[nextStep.id];
  if (!nextImageInfo?.url) return;
  if (state.preloadedImageUrls.has(nextImageInfo.url)) return;

  const img = new Image();
  img.decoding = "async";
  img.src = nextImageInfo.url;
  state.preloadedImageUrls.add(nextImageInfo.url);
}

function renderTimer() {
  const step = currentStep();
  if (step.durationSec === null) {
    els.timer.textContent = "—:—";
    els.timer.classList.remove("low");
    return;
  }
  const seconds = Math.max(0, Number(state.remainingSec || 0));
  els.timer.textContent = formatTime(seconds);

  const isLow = typeof state.remainingSec === "number" && state.remainingSec > 0 && state.remainingSec <= LOW_WARNING_SEC;
  els.timer.classList.toggle("low", isLow);
}

function formatTime(totalSec) {
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

function transitionCue() {
  if (state.settings.soundEnabled) {
    const ac = new AudioContext();
    const oscillator = ac.createOscillator();
    const gain = ac.createGain();
    oscillator.frequency.value = 880;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(ac.destination);
    oscillator.start();
    oscillator.stop(ac.currentTime + 0.15);
  }
  if (state.settings.hapticsEnabled && "vibrate" in navigator) {
    navigator.vibrate(80);
  }
}

function toggleMute() {
  state.settings.soundEnabled = !state.settings.soundEnabled;
  els.soundEnabled.checked = state.settings.soundEnabled;
  saveSettings();
  syncMuteIcon();
}

function syncMuteIcon() {
  const soundOnIcon = els.muteToggle.querySelector(".sound-icon--on");
  const soundOffIcon = els.muteToggle.querySelector(".sound-icon--off");

  if (soundOnIcon) soundOnIcon.hidden = !state.settings.soundEnabled;
  if (soundOffIcon) soundOffIcon.hidden = state.settings.soundEnabled;

  els.muteToggle.setAttribute("aria-pressed", String(state.settings.soundEnabled));
  els.muteToggle.setAttribute(
    "aria-label",
    state.settings.soundEnabled ? "Sound on" : "Sound off"
  );
}

function finishRoutine() {
  stopTicking();
  state.isRunning = false;
  state.isPaused = false;

  if (state.startedAt) {
    const durationSec = Math.round((Date.now() - state.startedAt) / 1000);
    const history = loadHistory();
    history.unshift({ completedAt: new Date().toISOString(), durationSec });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 100)));
  }

  state.stepIndex = 0;
  state.startedAt = null;
  state.remainingSec = ROUTINE_STEPS[0].durationSec;
  renderStep();
  renderHistory();
  switchView("history-view");
}

function loadSettings() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

function hydrateSettingsUI() {
  els.soundEnabled.checked = state.settings.soundEnabled;
  els.hapticsEnabled.checked = state.settings.hapticsEnabled;
  els.defaultWalkDuration.value = String(state.settings.defaultWalkDuration);
  els.remoteImageCaching.checked = state.settings.enableRemoteImageCaching;
  if (els.disableSW) els.disableSW.checked = state.settings.disableServiceWorker;
  if (els.themeSelect) els.themeSelect.value = state.settings.theme || "default";
  if (els.themeSwatch) updateThemeSwatch();
  syncMuteIcon();
}

function applyTheme(theme) {
  const html = document.documentElement;
  // remove all known theme classes then add the selected one
  html.classList.remove(
    "theme-blue",
    "theme-emerald",
    "theme-rose",
    "theme-sunset",
    "theme-midnight",
    "theme-slate"
  );
  if (theme === "blue") html.classList.add("theme-blue");
  if (theme === "emerald") html.classList.add("theme-emerald");
  if (theme === "rose") html.classList.add("theme-rose");
  if (theme === "sunset") html.classList.add("theme-sunset");
  if (theme === "midnight") html.classList.add("theme-midnight");
  if (theme === "slate") html.classList.add("theme-slate");
  updateThemeSwatch();
}

function updateThemeSwatch() {
  if (!els.themeSwatch) return;
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  // If variable is empty, fallback to transparent
  els.themeSwatch.style.backgroundColor = accent || "transparent";
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function loadHistoryDayEdits() {
  if (state.historyEditsPending) {
    return { ...state.historyEditsPending };
  }
  try {
    return JSON.parse(localStorage.getItem(HISTORY_DAY_EDITS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveHistoryDayEdits(edits) {
  state.historyEditsPending = edits;
  if (state.historyEditsSaveTimer) {
    clearTimeout(state.historyEditsSaveTimer);
  }
  state.historyEditsSaveTimer = setTimeout(() => {
    flushHistoryDayEditsWrite();
  }, HISTORY_SAVE_DEBOUNCE_MS);
  invalidateHistoryCache();
}

function flushHistoryDayEditsWrite() {
  if (state.historyEditsSaveTimer) {
    clearTimeout(state.historyEditsSaveTimer);
    state.historyEditsSaveTimer = null;
  }
  if (!state.historyEditsPending) return;
  localStorage.setItem(HISTORY_DAY_EDITS_KEY, JSON.stringify(state.historyEditsPending));
  state.historyEditsPending = null;
}

function invalidateHistoryCache() {
  state.historyCache = null;
}

function renderHistory() {
  const context = getHistoryContext();
  const {
    now,
    daySummaries,
    recentDays,
    sessionsThisWeekCount,
    totalMinutesLastWeek,
    streak,
    totalSessions
  } = context;

  els.historyList.innerHTML = "";

  if (recentDays.length === 0) {
    const li = document.createElement("li");
    li.className = "history-empty";
    li.textContent = "No days logged yet.";
    els.historyList.append(li);
  } else {
    recentDays.forEach((day) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      const dateText = formatDayLabel(day.dayKey);
      const completionState = day.piecesCompleted >= ROUTINE_STEPS.length
        ? "Complete"
        : day.piecesCompleted === 0
          ? "Not done"
          : "Partial";
      button.type = "button";
      button.className = "history-day-btn";
      button.dataset.dayKey = day.dayKey;
      button.textContent = `${dateText} • ${day.piecesCompleted}/${ROUTINE_STEPS.length} pieces • ${completionState}`;
      li.append(button);
      els.historyList.append(li);
    });
  }

  els.streak.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;
  if (els.streakSummary) {
    els.streakSummary.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  }

  if (els.sessionsWeek) {
    els.sessionsWeek.textContent = `${sessionsThisWeekCount} session${sessionsThisWeekCount === 1 ? "" : "s"}`;
  }

  if (els.minutesWeek) {
    els.minutesWeek.textContent = `${totalMinutesLastWeek} min`;
  }

  if (els.goalNudge) {
    const remainingThisWeek = Math.max(0, WEEKLY_GOAL - sessionsThisWeekCount);
    const weekdaysElapsed = weekdaysElapsedThisWeek(now);
    const weekdaysRemaining = Math.max(0, 5 - weekdaysElapsed);

    if (remainingThisWeek === 0) {
      els.goalNudge.textContent = "Weekly goal reached. Great consistency.";
    } else if (weekdaysRemaining === 0) {
      els.goalNudge.textContent = `${remainingThisWeek} session${remainingThisWeek === 1 ? "" : "s"} short of this week's goal. Weekends are optional.`;
    } else if (remainingThisWeek <= weekdaysRemaining) {
      els.goalNudge.textContent = `On track for Friday: ${remainingThisWeek} session${remainingThisWeek === 1 ? "" : "s"} left (${weekdaysRemaining} weekday${weekdaysRemaining === 1 ? "" : "s"} remaining).`;
    } else {
      els.goalNudge.textContent = `${remainingThisWeek} session${remainingThisWeek === 1 ? "" : "s"} left with ${weekdaysRemaining} weekday${weekdaysRemaining === 1 ? "" : "s"} remaining.`;
    }
  }

  if (els.milestoneProgress) {
    const milestones = [5, 10, 25, 50, 100];
    const nextMilestone = milestones.find((value) => totalSessions < value);
    if (nextMilestone) {
      els.milestoneProgress.textContent = `Next milestone: ${nextMilestone} sessions (${totalSessions}/${nextMilestone})`;
    } else {
      els.milestoneProgress.textContent = `Milestone unlocked: 100+ sessions (${totalSessions} total)`;
    }
  }
}

function getHistoryContext() {
  const historyRaw = localStorage.getItem(HISTORY_KEY) || "[]";
  const dayEditsRaw = JSON.stringify(state.historyEditsPending || loadHistoryDayEdits());

  if (
    state.historyCache &&
    state.historyCache.historyRaw === historyRaw &&
    state.historyCache.dayEditsRaw === dayEditsRaw
  ) {
    return state.historyCache.context;
  }

  let history;
  let dayEdits;
  try {
    history = JSON.parse(historyRaw);
  } catch {
    history = [];
  }
  try {
    dayEdits = JSON.parse(dayEditsRaw);
  } catch {
    dayEdits = {};
  }

  const cleanedEdits = migrateAndCleanHistoryDayEdits(dayEdits);
  const cleanedEditsRaw = JSON.stringify(cleanedEdits);

  if (cleanedEditsRaw !== dayEditsRaw) {
    localStorage.setItem(HISTORY_DAY_EDITS_KEY, cleanedEditsRaw);
    state.historyEditsPending = null;
  }

  const context = buildHistoryContext(history, cleanedEdits);
  state.historyCache = {
    historyRaw,
    dayEditsRaw: cleanedEditsRaw,
    context
  };
  return context;
}

function buildHistoryContext(history, dayEdits) {
  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(threshold.getDate() - 7);
  const thresholdMs = threshold.getTime();
  const weekStart = startOfWeekMonday(now);
  const weekStartKey = toDayKey(weekStart);
  const byDay = new Map();

  let totalSessions = 0;
  let totalSecondsLastWeek = 0;

  history.forEach((item) => {
    if (!item?.completedAt) return;
    const completedMs = Date.parse(item.completedAt);
    if (!Number.isFinite(completedMs)) return;

    totalSessions += 1;
    const durationSec = Number(item.durationSec) || 0;
    if (completedMs >= thresholdMs) {
      totalSecondsLastWeek += durationSec;
    }

    const dayKey = toDayKey(item.completedAt);
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, { dayKey, sessions: 0, durationSec: 0 });
    }
    const existing = byDay.get(dayKey);
    existing.sessions += 1;
    existing.durationSec += durationSec;
  });

  Object.keys(dayEdits).forEach((dayKey) => {
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, { dayKey, sessions: 0, durationSec: 0 });
    }
  });

  const daySummaries = Array.from(byDay.values())
    .map((day) => {
      const edit = dayEdits[day.dayKey] || {};
      const stepIds = resolveStepIdsForDay(day, edit);
      return { ...day, stepIds, piecesCompleted: stepIds.length };
    })
    .sort((a, b) => (a.dayKey < b.dayKey ? 1 : -1));

  const sessionsThisWeekCount = daySummaries.filter(
    (day) => day.dayKey >= weekStartKey && day.piecesCompleted > 0
  ).length;

  return {
    now,
    daySummaries,
    recentDays: daySummaries.slice(0, 7),
    sessionsThisWeekCount,
    totalMinutesLastWeek: Math.round(totalSecondsLastWeek / 60),
    streak: computeStreak(daySummaries),
    totalSessions
  };
}

function migrateAndCleanHistoryDayEdits(dayEdits) {
  const migrated = {};

  Object.entries(dayEdits || {}).forEach(([dayKey, value]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return;
    const edit = value || {};

    if (Array.isArray(edit.stepIds)) {
      const stepIds = normalizeStepIds(edit.stepIds);
      if (stepIds.length > 0) {
        migrated[dayKey] = { stepIds };
      }
      return;
    }

    if (Number.isFinite(edit.piecesCompleted)) {
      const count = clampPieces(edit.piecesCompleted);
      if (count > 0) {
        migrated[dayKey] = {
          stepIds: ROUTINE_STEPS.slice(0, count).map((step) => step.id)
        };
      }
    }
  });

  return migrated;
}

function openHistoryEditor(dayKey) {
  state.selectedHistoryDay = dayKey;
  const { stepIds } = getHistoryDaySummary(dayKey);
  state.selectedHistoryStepIds = [...stepIds];
  state.selectedHistoryStepSet = new Set(stepIds);
  if (els.historyEditorTitle) {
    els.historyEditorTitle.textContent = `Edit ${formatDayLabel(dayKey)}`;
  }
  if (els.historyDayInput) {
    els.historyDayInput.value = dayKey;
  }
  syncHistoryStepSelectionFromSet();
  if (els.historyEditor) {
    els.historyEditor.hidden = false;
  }
}

function closeHistoryEditor() {
  state.selectedHistoryDay = null;
  state.selectedHistoryStepIds = [];
  state.selectedHistoryStepSet = new Set();
  if (els.historyEditor) {
    els.historyEditor.hidden = true;
  }
}

function saveHistoryDayEdit() {
  if (!state.selectedHistoryDay) return;
  const edits = loadHistoryDayEdits();
  const normalizedStepIds = normalizeStepIds(Array.from(state.selectedHistoryStepSet));
  const summary = getHistoryDaySummary(state.selectedHistoryDay);
  const isDefaultCompletion = summary.sessions > 0 && normalizedStepIds.length === ROUTINE_STEPS.length;

  if (isDefaultCompletion) {
    delete edits[state.selectedHistoryDay];
  } else {
    edits[state.selectedHistoryDay] = {
      stepIds: normalizedStepIds
    };
  }

  saveHistoryDayEdits(edits);
  closeHistoryEditor();
  renderHistory();
}

function resetHistoryDayEdit() {
  if (!state.selectedHistoryDay) return;
  const edits = loadHistoryDayEdits();
  delete edits[state.selectedHistoryDay];
  saveHistoryDayEdits(edits);
  closeHistoryEditor();
  renderHistory();
}

function openSelectedDayEditor() {
  if (!els.historyDayInput || !els.historyDayInput.value) return;
  openHistoryEditor(els.historyDayInput.value);
}

function renderHistoryPieceChecklist() {
  if (!els.historyPieceList || els.historyPieceList.childElementCount > 0) return;

  ROUTINE_STEPS.forEach((step) => {
    const label = document.createElement("label");
    label.className = "history-piece-item";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "history-piece-checkbox";
    input.checked = false;
    input.dataset.stepId = step.id;

    const text = document.createElement("span");
    text.textContent = step.name;

    input.addEventListener("change", () => {
      if (input.checked) {
        state.selectedHistoryStepSet.add(step.id);
      } else {
        state.selectedHistoryStepSet.delete(step.id);
      }
      syncHistoryStepSelectionFromSet();
    });

    label.append(input, text);
    els.historyPieceList.append(label);
  });
}

function initializeHistoryEditorChecklist() {
  renderHistoryPieceChecklist();
}

function syncHistoryStepSelectionFromSet() {
  state.selectedHistoryStepIds = normalizeStepIds(Array.from(state.selectedHistoryStepSet));

  if (els.historyPieceList) {
    els.historyPieceList.querySelectorAll("input[data-step-id]").forEach((input) => {
      if (!(input instanceof HTMLInputElement)) return;
      input.checked = state.selectedHistoryStepSet.has(input.dataset.stepId);
    });
  }

  if (els.piecesValue) {
    els.piecesValue.textContent = `${state.selectedHistoryStepIds.length} / ${ROUTINE_STEPS.length} pieces`;
  }
}

function applyWeekdayTemplateForSelectedDay() {
  if (!state.selectedHistoryDay) return;
  const weekend = isWeekendDayKey(state.selectedHistoryDay);
  state.selectedHistoryStepSet = weekend
    ? new Set()
    : new Set(ROUTINE_STEPS.map((step) => step.id));
  syncHistoryStepSelectionFromSet();
}

function getHistoryDaySummary(dayKey) {
  const context = getHistoryContext();
  const existing = context.daySummaries.find((day) => day.dayKey === dayKey);
  if (existing) return existing;

  return {
    dayKey,
    sessions: 0,
    durationSec: 0,
    stepIds: [],
    piecesCompleted: 0
  };
}

function resolveStepIdsForDay(day, edit) {
  if (Array.isArray(edit.stepIds)) {
    return normalizeStepIds(edit.stepIds);
  }

  if (Number.isFinite(edit.piecesCompleted)) {
    const count = clampPieces(edit.piecesCompleted);
    return ROUTINE_STEPS.slice(0, count).map((step) => step.id);
  }

  return day.sessions > 0 ? ROUTINE_STEPS.map((step) => step.id) : [];
}

function normalizeStepIds(stepIds) {
  const valid = new Set(ROUTINE_STEPS.map((step) => step.id));
  return Array.from(new Set(stepIds.filter((stepId) => valid.has(stepId))));
}

function isWeekendDayKey(dayKey) {
  const day = new Date(`${dayKey}T00:00:00`).getDay();
  return day === 0 || day === 6;
}

function clampPieces(value) {
  const numeric = Number(value) || 0;
  return Math.max(0, Math.min(ROUTINE_STEPS.length, Math.round(numeric)));
}

function toDayKey(input) {
  return new Date(input).toISOString().slice(0, 10);
}

function formatDayLabel(dayKey) {
  const date = new Date(`${dayKey}T00:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });
}

function startOfWeekMonday(date) {
  const start = new Date(date);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);
  return start;
}

function weekdaysElapsedThisWeek(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return 5;
  return day;
}

function computeStreak(daySummaries) {
  const byDay = new Set(
    daySummaries
      .filter((day) => day.piecesCompleted > 0)
      .map((day) => day.dayKey)
  );
  let streak = 0;
  const date = new Date();

  while (true) {
    const key = date.toISOString().slice(0, 10);
    if (!byDay.has(key)) break;
    streak += 1;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

function switchView(viewId) {
  els.views.forEach((view) => {
    view.hidden = view.id !== viewId;
    view.classList.toggle("active", view.id === viewId);
  });
  els.navButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.view === viewId));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (state.settings.disableServiceWorker) {
    // If user opted to disable SW, ensure any registrations are removed and skip registration
    unregisterAllServiceWorkers();
    return;
  }

  navigator.serviceWorker
    .register("./sw.js")
    .then((registration) => {
      notifyServiceWorkerSettings();

      // Listen for updates found (new SW installing).
      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is ready in the background.
          }
        });
      });

      // When the new SW becomes active, reload to use the new assets.
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    })
    .catch(() => undefined);
}

async function unregisterAllServiceWorkers() {
  if (!("serviceWorker" in navigator)) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    // Also try to clear controller so pages don't continue to use a controller
    if (navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({ type: "CLIENT_UNREGISTER" });
      } catch {}
    }
  } catch (e) {
    console.warn("Failed to unregister service workers:", e);
  }
}

function attachErrorHandlers() {
  // Capture global errors and unhandled rejections and persist a recent list in localStorage
  window.addEventListener("error", (ev) => {
    try {
      const entry = { type: "error", message: ev.message, filename: ev.filename, lineno: ev.lineno, colno: ev.colno, stack: ev.error?.stack || null, time: new Date().toISOString() };
      persistError(entry);
    } catch {}
  });

  window.addEventListener("unhandledrejection", (ev) => {
    try {
      const reason = ev.reason;
      const entry = { type: "unhandledrejection", message: reason?.message || String(reason), stack: reason?.stack || null, time: new Date().toISOString() };
      persistError(entry);
    } catch {}
  });
}

function persistError(entry) {
  try {
    const raw = localStorage.getItem("m0b1li7y.errors") || "[]";
    const arr = JSON.parse(raw);
    arr.unshift(entry);
    // keep recent 50
    localStorage.setItem("m0b1li7y.errors", JSON.stringify(arr.slice(0, 50)));
    console.error("Captured app error:", entry);
  } catch (e) {
    // ignore
  }
}

function notifyServiceWorkerSettings() {
  if (!navigator.serviceWorker?.controller) return;
  navigator.serviceWorker.controller.postMessage({
    type: "SETTINGS_UPDATE",
    payload: {
      appVersion: APP_VERSION,
      enableRemoteImageCaching: state.settings.enableRemoteImageCaching
    }
  });
}

init();
