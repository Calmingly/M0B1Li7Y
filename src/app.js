import { loadRoutineImages } from "./routineImages.js";

const APP_VERSION = "v1";
const SETTINGS_KEY = "m0b1li7y.settings";
const HISTORY_KEY = "m0b1li7y.history";

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  hapticsEnabled: true,
  defaultWalkDuration: 4,
  enableRemoteImageCaching: false
  ,theme: "default"
};

const ROUTINE_STEPS = [
  { id: "armCircles", name: "Arm circles", cue: "Smooth shoulder circles.", durationSec: 30 },
  { id: "trunkRotations", name: "Trunk rotations", cue: "Rotate gently side to side.", durationSec: 30 },
  { id: "sideBends", name: "Side bends", cue: "Reach and lengthen through the side body.", durationSec: 30 },
  { id: "legSwingsLeft", name: "Leg swings left", cue: "Use a wall for balance if needed.", durationSec: 30 },
  { id: "legSwingsRight", name: "Leg swings right", cue: "Control the swing and breathe.", durationSec: 30 },
  { id: "kneesToChest", name: "Knees to chest", cue: "Alternate legs with steady posture.", durationSec: 30 },
  { id: "figureFourLeft", name: "Figure four left", cue: "Keep chest tall and hinge hips back.", durationSec: 30 },
  { id: "figureFourRight", name: "Figure four right", cue: "Move slow and avoid knee pressure.", durationSec: 30 },
  { id: "childPose", name: "Child pose", cue: "Relax neck and breathe deeply.", durationSec: 45 },
  { id: "postureReset", name: "Posture reset", cue: "Stand tall, ribs down, shoulders relaxed.", durationSec: 30 },
  { id: "pushUps", name: "Wall or counter push ups", cue: "Complete 10–15 reps.", durationSec: null },
  { id: "walk", name: "Walk", cue: "Pick 3, 4, or 5 minutes.", durationSec: "walk" }
];

const state = {
  settings: loadSettings(),
  startedAt: null,
  isRunning: false,
  isPaused: false,
  stepIndex: 0,
  remainingSec: ROUTINE_STEPS[0].durationSec,
  timerRef: null,
  imageMap: {}
};

const els = {
  stepProgress: document.getElementById("step-progress"),
  stepName: document.getElementById("step-name"),
  stepCue: document.getElementById("step-cue"),
  timer: document.getElementById("timer"),
  untimedHint: document.getElementById("untimed-hint"),
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
  soundEnabled: document.getElementById("sound-enabled"),
  hapticsEnabled: document.getElementById("haptics-enabled"),
  defaultWalkDuration: document.getElementById("default-walk-duration"),
  remoteImageCaching: document.getElementById("remote-image-caching"),
  themeSelect: document.getElementById("theme-select"),
  navButtons: Array.from(document.querySelectorAll(".nav-btn")),
  views: Array.from(document.querySelectorAll(".view")),
  walkOptions: Array.from(document.querySelectorAll(".walk-options button"))
};

function init() {
  hydrateSettingsUI();
  applyTheme(state.settings.theme);
  wireEvents();
  renderStep();
  renderHistory();
  registerServiceWorker();
  loadRoutineImages().then((imageMap) => {
    state.imageMap = imageMap;
    renderStepImage();
  });
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

  els.navButtons.forEach((btn) => btn.addEventListener("click", () => switchView(btn.dataset.view)));
  els.walkOptions.forEach((btn) =>
    btn.addEventListener("click", () => {
      state.settings.defaultWalkDuration = Number(btn.dataset.mins);
      saveSettings();
      if (currentStep().id === "walk") {
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

  if (els.themeSelect) {
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

  if (step.durationSec === "walk") {
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
  els.nextBtn.disabled = state.stepIndex === ROUTINE_STEPS.length - 1 || isUntimed;

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
  els.untimedHint.hidden = !untimed;
  els.doneBtn.hidden = !untimed;

  els.walkPicker.hidden = step.id !== "walk";
  els.walkOptions.forEach((button) => {
    button.disabled = step.id !== "walk";
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
}

function renderTimer() {
  const step = currentStep();
  if (step.durationSec === null) {
    els.timer.textContent = "—:—";
    return;
  }
  const seconds = Math.max(0, Number(state.remainingSec || 0));
  els.timer.textContent = formatTime(seconds);
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
  els.muteToggle.textContent = state.settings.soundEnabled ? "🔊" : "🔇";
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
  if (els.themeSelect) els.themeSelect.value = state.settings.theme || "default";
  syncMuteIcon();
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.remove("theme-blue", "theme-emerald");
  if (!theme || theme === "default") return;
  if (theme === "blue") html.classList.add("theme-blue");
  if (theme === "emerald") html.classList.add("theme-emerald");
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function renderHistory() {
  const history = loadHistory();
  const threshold = new Date();
  threshold.setDate(threshold.getDate() - 7);

  const recent = history.filter((item) => new Date(item.completedAt) >= threshold);
  els.historyList.innerHTML = "";

  if (recent.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No completions yet.";
    els.historyList.append(li);
  } else {
    recent.forEach((item) => {
      const li = document.createElement("li");
      const date = new Date(item.completedAt);
      li.textContent = `${date.toLocaleDateString()} • ${formatTime(item.durationSec)}`;
      els.historyList.append(li);
    });
  }

  const streak = computeStreak(history);
  els.streak.textContent = `Streak: ${streak} day${streak === 1 ? "" : "s"}`;
}

function computeStreak(history) {
  const byDay = new Set(
    history.map((item) => new Date(item.completedAt).toISOString().slice(0, 10))
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
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => notifyServiceWorkerSettings())
    .catch(() => undefined);
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
