const XP_KEY = "m0b1li7y.xp";

export const XP_REWARDS = {
  SESSION_COMPLETE: 50,
  SESSION_MINUTE: 1,
  CHECKIN_SAVE: 10,
  REFLECTION_SAVE: 15,
  FORM_RATING: 5,
  STREAK_7: 100,
  STREAK_30: 500
};

export const LEVELS = [
  { level: 1, name: "Rookie",     min: 0    },
  { level: 2, name: "Apprentice", min: 200  },
  { level: 3, name: "Athlete",    min: 500  },
  { level: 4, name: "Champion",   min: 1000 },
  { level: 5, name: "Elite",      min: 2000 },
  { level: 6, name: "Master",     min: 4000 }
];

export function loadXP() {
  return Math.max(0, parseInt(localStorage.getItem(XP_KEY) || "0", 10));
}

export function saveXP(xp) {
  localStorage.setItem(XP_KEY, String(Math.max(0, xp)));
}

export function addXP(amount) {
  const current = loadXP();
  const next = current + Math.max(0, amount);
  saveXP(next);
  return next;
}

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1] || null;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const xpInLevel = xp - current.min;
  const xpNeeded = next ? next.min - current.min : null;
  const progress = xpNeeded ? Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)) : 100;
  return {
    level: current.level,
    name: current.name,
    xp,
    progress,
    xpInLevel,
    xpNeeded,
    nextLevelXP: next ? next.min : null
  };
}
