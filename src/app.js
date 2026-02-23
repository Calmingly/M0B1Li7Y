const SESSION_KEY = "m0b1li7y.sessionsCompleted";
const SESSION_DAYS_KEY = "m0b1li7y.sessionDays";

const routineSteps = [
  { name: "Arm Circles", cue: "Smooth shoulder circles.", phase: "Warmup", image: "armcircles.png", durationSec: 30 },
  { name: "Leg Swings", cue: "Keep hips stable and controlled.", phase: "Warmup", image: "legswings.png", durationSec: 30 },
  { name: "Trunk Rotations", cue: "Rotate gently side to side.", phase: "Warmup", image: "trunkrotation.png", durationSec: 30 },
  { name: "Side Bends", cue: "Reach and lengthen each side.", phase: "Warmup", image: "sidebends.png", durationSec: 30 },
  { name: "Counter Pushups", cue: "Complete 10 to 15 quality reps.", phase: "Strength", image: "counterpushups.png", durationSec: null },
  { name: "Plank", cue: "Brace core and keep a straight line.", phase: "Strength", image: "plank.png", durationSec: 45 },
  { name: "Knees To Chest", cue: "Alternate sides with steady posture.", phase: "Mobility", image: "kneestochest.png", durationSec: 30 },
  { name: "Figure Four", cue: "Switch sides halfway and breathe.", phase: "Mobility", image: "lyingfigurefour.png", durationSec: 40 },
  { name: "Toe Touch Twist", cue: "Move slowly and avoid bouncing.", phase: "Mobility", image: "toetouchtwist.png", durationSec: 30 },
  { name: "Overhead Reach", cue: "Stand tall and reach up smoothly.", phase: "Reset", image: "overheadreach.png", durationSec: 30 },
  { name: "Child Pose", cue: "Relax your neck and breathe deeply.", phase: "Cooldown", image: "childspose.png", durationSec: 45 },
  { name: "Brisk Walk", cue: "Walk with intent to finish strong.", phase: "Finish", image: "briskwalk.png", durationSec: 180 }
];

const summary = document.getElementById("summary");
const progressLabel = document.getElementById("progress-label");
const sessionCount = document.getElementById("session-count");
const streakCount = document.getElementById("streak-count");
const weekCount = document.getElementById("week-count");
const stepChip = document.getElementById("step-chip");
const phaseProgress = document.getElementById("phase-progress");
const stepName = document.getElementById("step-name");
const stepCue = document.getElementById("step-cue");
const coachTip = document.getElementById("coach-tip");
const stepImage = document.getElementById("step-image");
const timer = document.getElementById("timer");
const progressRing = document.getElementById("progress-ring");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const backBtn = document.getElementById("back-btn");
const nextBtn = document.getElementById("next-btn");
const resetBtn = document.getElementById("reset-btn");

const state = {
  stepIndex: 0,
  remainingSec: routineSteps[0].durationSec,
  isRunning: false,
  isPaused: false,
  timerRef: null,
  sessionsCompleted: loadSessionCount(),
  sessionDays: loadSessionDays()
};

init();

function init() {
  wireEvents();
  renderSummary();
  renderStep();
  renderSessionMetrics();
  updateControls();
}

function wireEvents() {
  startBtn?.addEventListener("click", startRoutine);
  pauseBtn?.addEventListener("click", togglePause);
  backBtn?.addEventListener("click", () => moveToStep(state.stepIndex - 1));
  nextBtn?.addEventListener("click", onNext);
  resetBtn?.addEventListener("click", resetRoutine);
}

function startRoutine() {
  state.isRunning = true;
  state.isPaused = false;
  startTimer();
  updateControls();
}

function togglePause() {
  if (!state.isRunning) return;
  state.isPaused = !state.isPaused;
  pauseBtn.textContent = state.isPaused ? "Resume" : "Pause";
}

function onNext() {
  if (state.stepIndex >= routineSteps.length - 1) {
    completeRoutine();
    return;
  }
  moveToStep(state.stepIndex + 1);
}

function moveToStep(nextIndex) {
  if (nextIndex < 0 || nextIndex >= routineSteps.length) return;

  state.stepIndex = nextIndex;
  state.remainingSec = routineSteps[nextIndex].durationSec;
  renderStep();

  if (state.isRunning) {
    state.isPaused = false;
    pauseBtn.textContent = "Pause";
  }

  updateControls();
}

function startTimer() {
  stopTimer();
  state.timerRef = window.setInterval(() => {
    if (!state.isRunning || state.isPaused) return;

    const step = routineSteps[state.stepIndex];
    if (step.durationSec === null) return;

    state.remainingSec -= 1;
    renderTimer();

    if (state.remainingSec <= 0) {
      onNext();
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerRef !== null) {
    clearInterval(state.timerRef);
    state.timerRef = null;
  }
}

function completeRoutine() {
  stopTimer();
  state.isRunning = false;
  state.isPaused = false;
  state.sessionsCompleted += 1;
  recordSessionDay();
  saveSessionCount(state.sessionsCompleted);
  renderSessionMetrics();
  resetRoutine(false);
  alert("Routine complete. Great work.");
}

function resetRoutine(keepSessionCount = true) {
  stopTimer();
  state.isRunning = false;
  state.isPaused = false;
  state.stepIndex = 0;
  state.remainingSec = routineSteps[0].durationSec;
  pauseBtn.textContent = "Pause";
  renderStep();
  updateControls();

  if (!keepSessionCount) {
    renderSessionMetrics();
  }
}

function renderStep() {
  const step = routineSteps[state.stepIndex];
  progressLabel.textContent = `Step ${state.stepIndex + 1} of ${routineSteps.length}`;
  const percentComplete = Math.round(((state.stepIndex + 1) / routineSteps.length) * 100);
  stepChip.textContent = step.phase;
  phaseProgress.textContent = `${percentComplete}% complete`;
  stepName.textContent = step.name;
  stepCue.textContent = step.cue;
  coachTip.textContent = getCoachTip(step);
  stepImage.src = `./img/${step.image}`;
  stepImage.alt = `${step.name} visual`;
  progressRing?.style.setProperty("--progress", `${percentComplete}%`);
  renderTimer();
}

function renderTimer() {
  const step = routineSteps[state.stepIndex];
  if (step.durationSec === null) {
    timer.textContent = "REPS";
    return;
  }

  timer.textContent = formatTime(Math.max(0, Number(state.remainingSec)));
}

function updateControls() {
  startBtn.disabled = state.isRunning;
  pauseBtn.disabled = !state.isRunning;
  backBtn.disabled = state.stepIndex === 0;
  nextBtn.disabled = !state.isRunning;
  nextBtn.textContent = state.stepIndex === routineSteps.length - 1 ? "Finish" : "Next";
}

function renderSummary() {
  summary.textContent = "Guided-first flow + fitness-tech metrics using your preserved routine and icon assets.";
}

function renderSessionMetrics() {
  sessionCount.textContent = String(state.sessionsCompleted);
  const streak = computeStreakDays(state.sessionDays);
  const weekly = computeLast7DaysSessions(state.sessionDays);
  streakCount.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  weekCount.textContent = `${weekly} session${weekly === 1 ? "" : "s"}`;
}

function formatTime(totalSec) {
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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
    // Ignore storage errors in private/restricted modes.
  }
}

function getCoachTip(step) {
  const tipsByPhase = {
    Warmup: "Move slowly, stay below pain, and find smooth control first.",
    Strength: "Keep form clean. Stop with 2 reps left in the tank.",
    Mobility: "Use a gentle range and pair each movement with slow breaths.",
    Reset: "Stand tall and relax your shoulders before the next move.",
    Cooldown: "Let your breathing slow down naturally and avoid forcing stretch depth.",
    Finish: "Hold steady pace and finish feeling better than you started."
  };

  return tipsByPhase[step.phase] || "Move with control and keep breathing naturally.";
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
