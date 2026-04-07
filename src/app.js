import { computeLast7DaysSessions, computeStreakDays, toDayKey } from "./modules/date-utils.js";
import { buildRecommendationPlan, labelForSessionLength, selectSessionLength } from "./modules/recommendation.js";
import { BODY_FOCUS_OPTIONS, filterMovements } from "./modules/library.js";
import { computeConsistencyScore, computeWeeklyQuest } from "./modules/insights.js";
import { addXP, getLevelInfo, loadXP, XP_REWARDS } from "./modules/xp.js";

const APP_KEY = "m0b1li7y.variant.main4";
const DAY_KEY = toDayKey(new Date());

const defaults = {
  readiness: { energy: 3, soreness: 3, mood: 3 },
  timeAvailableMin: 15,
  bodyFocus: "full",
  snapshots: [],
  sessionDays: [],
  checkinDays: [],
  buddyPings: []
};

const el = {
  todayLabel: document.getElementById("today-label"),
  energy: document.getElementById("energy"),
  soreness: document.getElementById("soreness"),
  mood: document.getElementById("mood"),
  energyOut: document.getElementById("energy-out"),
  sorenessOut: document.getElementById("soreness-out"),
  moodOut: document.getElementById("mood-out"),
  timeAvailable: document.getElementById("time-available"),
  focusChips: document.getElementById("focus-chips"),
  generatePlan: document.getElementById("generate-plan"),
  scorePill: document.getElementById("score-pill"),
  planLabel: document.getElementById("plan-label"),
  planHeadline: document.getElementById("plan-headline"),
  planDescription: document.getElementById("plan-description"),
  planTags: document.getElementById("plan-tags"),
  ritualTotal: document.getElementById("ritual-total"),
  ritualList: document.getElementById("ritual-list"),
  levelName: document.getElementById("level-name"),
  levelMeta: document.getElementById("level-meta"),
  xpFill: document.getElementById("xp-fill"),
  streakValue: document.getElementById("streak-value"),
  weekValue: document.getElementById("week-value"),
  consistencyValue: document.getElementById("consistency-value"),
  questValue: document.getElementById("quest-value"),
  questMeta: document.getElementById("quest-meta"),
  completeSession: document.getElementById("complete-session"),
  historyList: document.getElementById("history-list"),
  clearHistory: document.getElementById("clear-history")
};

const state = {
  ...defaults,
  ...loadState(),
  currentPlan: null,
  currentRitual: []
};

init();

function init() {
  el.todayLabel.textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

  hydrateInputs();
  renderFocusChips();
  wireEvents();
  renderDashboard();
  renderHistory();
  generate();
}

function wireEvents() {
  [el.energy, el.soreness, el.mood].forEach((input) => {
    input.addEventListener("input", updateSliderOutputs);
    input.addEventListener("change", syncReadinessFromInputs);
  });

  el.timeAvailable.addEventListener("change", () => {
    state.timeAvailableMin = Number(el.timeAvailable.value) || 15;
    persistState();
  });

  el.generatePlan.addEventListener("click", generate);

  el.completeSession.addEventListener("click", () => {
    completeSession();
    renderDashboard();
    renderHistory();
  });

  el.clearHistory.addEventListener("click", () => {
    state.snapshots = [];
    state.sessionDays = [];
    state.checkinDays = [];
    state.buddyPings = [];
    persistState();
    renderDashboard();
    renderHistory();
  });
}

function hydrateInputs() {
  el.energy.value = String(state.readiness.energy);
  el.soreness.value = String(state.readiness.soreness);
  el.mood.value = String(state.readiness.mood);
  el.timeAvailable.value = String(state.timeAvailableMin);
  updateSliderOutputs();
}

function updateSliderOutputs() {
  el.energyOut.textContent = el.energy.value;
  el.sorenessOut.textContent = el.soreness.value;
  el.moodOut.textContent = el.mood.value;
}

function syncReadinessFromInputs() {
  state.readiness = {
    energy: Number(el.energy.value),
    soreness: Number(el.soreness.value),
    mood: Number(el.mood.value)
  };

  if (!state.checkinDays.includes(DAY_KEY)) {
    state.checkinDays.unshift(DAY_KEY);
  }

  persistState();
}

function renderFocusChips() {
  el.focusChips.innerHTML = "";

  BODY_FOCUS_OPTIONS.forEach((opt) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip ${state.bodyFocus === opt.value ? "active" : ""}`;
    chip.textContent = opt.label;
    chip.addEventListener("click", () => {
      state.bodyFocus = opt.value;
      persistState();
      renderFocusChips();
      generate();
    });
    el.focusChips.appendChild(chip);
  });
}

function generate() {
  syncReadinessFromInputs();

  const weekCount = computeLast7DaysSessions(state.sessionDays);
  const streak = computeStreakDays(state.sessionDays);

  const plan = buildRecommendationPlan({
    readiness: state.readiness,
    stats: {
      weekly: weekCount,
      streak,
      sessionsCompleted: state.sessionDays.length
    },
    profile: {
      modeBias: state.readiness.energy >= 4 ? "auto" : "manual",
      tempoBias: (state.readiness.mood - 3) * 0.03
    },
    latestReflection: null,
    formAverage: 2.5,
    highSoreness: state.readiness.soreness >= 4,
    inDeloadWeek: false,
    timeAvailableMin: Number(el.timeAvailable.value)
  });

  state.currentPlan = plan;
  state.currentRitual = buildRitual(plan);

  renderRecommendation();
  renderRitual();

  // Keep only the latest 8 snapshots for concise history.
  state.snapshots.unshift(snapshotFromPlan(plan));
  state.snapshots = state.snapshots.slice(0, 8);
  persistState();
  renderHistory();
}

function buildRitual(plan) {
  const focus = BODY_FOCUS_OPTIONS.find((opt) => opt.value === state.bodyFocus);
  const muscle = focus && focus.muscles.length ? focus.muscles[0] : "All";
  const pool = filterMovements({ muscle, phase: "All" });

  const targetCount = plan.suggestedLength === "quick" ? 3 : plan.suggestedLength === "standard" ? 4 : 5;
  const selected = pool.slice(0, targetCount);
  const fallback = filterMovements({ muscle: "All", phase: "All" }).slice(0, targetCount);
  const ritual = (selected.length ? selected : fallback).map((movement) => {
    const baseSec = movement.durationSec ?? 40;
    const scaledSec = Math.max(20, Math.round(baseSec * plan.durationScale));
    return { ...movement, scaledSec };
  });

  return ritual;
}

function renderRecommendation() {
  const plan = state.currentPlan;
  if (!plan) return;

  el.scorePill.textContent = `Score ${plan.score}`;
  el.planLabel.textContent = `${plan.label} Blueprint`;
  el.planHeadline.textContent = plan.headline;
  el.planDescription.textContent = plan.description;
  el.planTags.innerHTML = "";

  [
    `Intensity ${plan.intensity}`,
    `Mode ${plan.mode}`,
    `Length ${labelForSessionLength(plan.suggestedLength)}`,
    `Tempo x${plan.durationScale.toFixed(2)}`
  ].forEach((tagText) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    el.planTags.appendChild(tag);
  });
}

function renderRitual() {
  const totalSec = state.currentRitual.reduce((sum, step) => sum + step.scaledSec, 0);
  el.ritualTotal.textContent = `${Math.max(1, Math.round(totalSec / 60))} min`;
  el.ritualList.innerHTML = "";

  state.currentRitual.forEach((step) => {
    const li = document.createElement("li");
    li.className = "ritual-item";
    li.innerHTML = `
      <img src="./img/${step.image}" alt="${step.name}" loading="lazy" decoding="async" />
      <div>
        <p class="ritual-title">${step.name}</p>
        <p class="ritual-meta">${step.phase} | ${step.cue}</p>
      </div>
      <strong>${step.scaledSec}s</strong>
    `;
    el.ritualList.appendChild(li);
  });
}

function completeSession() {
  const day = DAY_KEY;
  if (!state.sessionDays.includes(day)) {
    state.sessionDays.unshift(day);
  }

  if (Math.random() > 0.55) {
    state.buddyPings.unshift(new Date().toISOString());
    state.buddyPings = state.buddyPings.slice(0, 20);
  }

  const minutes = Number(state.timeAvailableMin) || 15;
  addXP(XP_REWARDS.SESSION_COMPLETE + Math.max(2, minutes));
  persistState();
}

function renderDashboard() {
  const xp = loadXP();
  const level = getLevelInfo(xp);
  el.levelName.textContent = level.name;
  el.levelMeta.textContent = `Lv ${level.level} | ${level.xp} XP`;
  el.xpFill.style.width = `${level.progress}%`;

  const streak = computeStreakDays(state.sessionDays);
  const week = computeLast7DaysSessions(state.sessionDays);
  const consistency = computeConsistencyScore(state.sessionDays, state.checkinDays, streak);
  const quest = computeWeeklyQuest(state.sessionDays, state.checkinDays, state.buddyPings);

  el.streakValue.textContent = `${streak} day${streak === 1 ? "" : "s"}`;
  el.weekValue.textContent = `${week}/7 active days`;
  el.consistencyValue.textContent = `Consistency ${consistency}`;
  el.questValue.textContent = `${quest.percent}%`;
  el.questMeta.textContent = `${quest.done}/${quest.total} checkpoints`;
}

function renderHistory() {
  el.historyList.innerHTML = "";

  if (!state.snapshots.length) {
    const empty = document.createElement("li");
    empty.className = "history-item";
    empty.innerHTML = "<h4>No snapshots yet</h4><p>Generate your first flow and complete a session to build your story.</p>";
    el.historyList.appendChild(empty);
    return;
  }

  state.snapshots.forEach((entry) => {
    const li = document.createElement("li");
    li.className = "history-item";
    li.innerHTML = `
      <h4>${entry.label} | ${entry.score}</h4>
      <p>${entry.day} | ${entry.length} | ${entry.focus}</p>
      <p>${entry.headline}</p>
    `;
    el.historyList.appendChild(li);
  });
}

function snapshotFromPlan(plan) {
  return {
    day: new Date().toLocaleString(),
    label: plan.label,
    score: `Score ${plan.score}`,
    length: labelForSessionLength(selectSessionLength(state.timeAvailableMin)),
    focus: BODY_FOCUS_OPTIONS.find((opt) => opt.value === state.bodyFocus)?.label || "Full Body",
    headline: plan.headline
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(APP_KEY);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return {
      readiness: {
        energy: clampRange(parsed?.readiness?.energy),
        soreness: clampRange(parsed?.readiness?.soreness),
        mood: clampRange(parsed?.readiness?.mood)
      },
      timeAvailableMin: Number(parsed?.timeAvailableMin) || 15,
      bodyFocus: BODY_FOCUS_OPTIONS.some((opt) => opt.value === parsed?.bodyFocus) ? parsed.bodyFocus : "full",
      snapshots: Array.isArray(parsed?.snapshots) ? parsed.snapshots : [],
      sessionDays: Array.isArray(parsed?.sessionDays) ? parsed.sessionDays : [],
      checkinDays: Array.isArray(parsed?.checkinDays) ? parsed.checkinDays : [],
      buddyPings: Array.isArray(parsed?.buddyPings) ? parsed.buddyPings : []
    };
  } catch {
    return { ...defaults };
  }
}

function persistState() {
  localStorage.setItem(
    APP_KEY,
    JSON.stringify({
      readiness: state.readiness,
      timeAvailableMin: state.timeAvailableMin,
      bodyFocus: state.bodyFocus,
      snapshots: state.snapshots,
      sessionDays: state.sessionDays,
      checkinDays: state.checkinDays,
      buddyPings: state.buddyPings
    })
  );
}

function clampRange(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 3;
  return Math.max(1, Math.min(5, Math.round(n)));
}
