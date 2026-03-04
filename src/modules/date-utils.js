export function toDayKey(dateValue) {
  return new Date(dateValue).toISOString().slice(0, 10);
}

export function computeLast7DaysSessions(dayKeys) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const startKey = toDayKey(start);
  const endKey = toDayKey(today);
  return dayKeys.filter((dayKey) => dayKey >= startKey && dayKey <= endKey).length;
}

export function computeStreakDays(dayKeys) {
  if (!Array.isArray(dayKeys) || dayKeys.length === 0) return 0;
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

export function countInCurrentWeek(dayKeys) {
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

export function countInLastDays(dayKeys, numberOfDays) {
  if (!Array.isArray(dayKeys)) return 0;
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (numberOfDays - 1));
  const startKey = toDayKey(start);
  const endKey = toDayKey(end);
  return dayKeys.filter((dayKey) => dayKey >= startKey && dayKey <= endKey).length;
}

export function countInPreviousWeek(dayKeys) {
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
