const MANILA_TIME_ZONE = "Asia/Manila";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: MANILA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function nowIso() {
  return new Date().toISOString();
}

export function manilaDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
}

export function previousDateKey(key) {
  if (!key) return "";
  const date = new Date(`${key}T00:00:00+08:00`);
  date.setUTCDate(date.getUTCDate() - 1);
  return dateFormatter.format(date);
}

/**
 * Counts consecutive study days ending today or yesterday. A streak stays
 * alive during the current day until it is missed for a full day.
 */
export function calculateStreak(dateKeys, today = manilaDateKey()) {
  const unique = [...new Set(dateKeys.filter(Boolean))].sort().reverse();
  if (unique.length === 0) return 0;

  let cursor = unique[0] === today ? today : previousDateKey(today);
  let streak = 0;
  for (const key of unique) {
    if (key === cursor) {
      streak += 1;
      cursor = previousDateKey(cursor);
    } else if (key < cursor) {
      break;
    }
  }
  return streak;
}

export function levelForPoints(points) {
  return Math.max(1, Math.floor(Math.max(0, Number(points) || 0) / 300) + 1);
}

export function percent(part, total) {
  if (!total) return 0;
  return Math.round((Number(part) / Number(total)) * 100);
}
