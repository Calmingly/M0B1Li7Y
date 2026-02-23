const SESSION_KEY = "m0b1li7y.sessionsCompleted";

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
const stepChip = document.getElementById("step-chip");
const stepName = document.getElementById("step-name");
const stepCue = document.getElementById("step-cue");
const stepImage = document.getElementById("step-image");
const timer = document.getElementById("timer");

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
  sessionsCompleted: loadSessionCount()
};

init();

function init() {
  wireEvents();
  renderSummary();
  renderStep();
  renderSessionCount();
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
  saveSessionCount(state.sessionsCompleted);
  renderSessionCount();
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
    renderSessionCount();
  }
}

function renderStep() {
  const step = routineSteps[state.stepIndex];
  progressLabel.textContent = `Step ${state.stepIndex + 1} of ${routineSteps.length}`;
  stepChip.textContent = step.phase;
  stepName.textContent = step.name;
  stepCue.textContent = step.cue;
  stepImage.src = `./img/${step.image}`;
  stepImage.alt = `${step.name} visual`;
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
  summary.textContent = "Using preserved assets from img/ and icons/.";
}

function renderSessionCount() {
  sessionCount.textContent = `Sessions completed: ${state.sessionsCompleted}`;
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
