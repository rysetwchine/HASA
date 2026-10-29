import {
  demoBadges,
  demoPracticeStreak,
  demoStudent,
  getLevelProgress,
} from "../data/demoData.js";

/**
 * Lokal na pag-unlad para sa prototype.
 *
 * Walang backend o database ang proyekto sa yugtong ito, kaya ang XP,
 * streak, best scores, at badges ay nakasave sa localStorage ng browser.
 * Ito ay TEMPORARY LOCAL PERSISTENCE lamang: hindi ito sumasabay sa ibang
 * device at mawawala kapag nilinis ang storage ng browser.
 */

export const PROGRESS_STORAGE_KEY = "hasa:progress:v1";
export const PASS_PERCENT = 60;
export const MAX_HISTORY = 100;

export const PROGRESS_STORAGE_NOTE =
  "Naka-save lamang ang pag-unlad na ito sa browser na ginagamit mo (localStorage). Walang backend o database, kaya hindi ito sumasabay sa ibang device at mawawala kapag nilinis ang browser storage.";

function getStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

function toDate(value = new Date()) {
  // Kailangang kopyahin ang Date bago ito baguhin ng streak helpers;
  // kung hindi, mababago ang orihinal na petsa ng resulta.
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function asInt(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : fallback;
}

export function localDateKey(value = new Date()) {
  const date = toDate(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function previousLocalDateKey(value = new Date()) {
  const date = toDate(value);
  date.setDate(date.getDate() - 1);
  return localDateKey(date);
}

export function createInitialProgress(now = new Date()) {
  return {
    version: 1,
    startingXp: demoStudent.points,
    xp: demoStudent.points,
    xpFromActivities: 0,
    xpFromBadges: 0,
    // Ang 4 na araw ay halimbawang panimulang streak. Inilagay ang huling
    // araw sa kahapon upang ang unang aktibidad ngayong araw ay magpatuloy
    // sa streak sa halip na i-reset ito.
    streak: demoPracticeStreak.streakDays,
    lastActivityDate: previousLocalDateKey(now),
    completions: {},
    badges: {},
    history: [],
    updatedAt: null,
  };
}

function sanitizeCompletions(raw) {
  const completions = {};

  if (!raw || typeof raw !== "object") return completions;

  for (const [id, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") continue;
    completions[id] = {
      title: typeof value.title === "string" ? value.title : id,
      attempts: Math.max(1, asInt(value.attempts, 1)),
      bestCorrect: Math.max(0, asInt(value.bestCorrect, 0)),
      bestPercent: Math.min(100, Math.max(0, asInt(value.bestPercent, 0))),
      total: Math.max(0, asInt(value.total, 0)),
      completed: Boolean(value.completed),
      completedAt: typeof value.completedAt === "string" ? value.completedAt : null,
      xpAwarded: Math.max(0, asInt(value.xpAwarded, 0)),
      lastAttemptAt:
        typeof value.lastAttemptAt === "string" ? value.lastAttemptAt : null,
    };
  }

  return completions;
}

function sanitizeBadges(raw) {
  const badges = {};

  if (!raw || typeof raw !== "object") return badges;

  for (const [id, value] of Object.entries(raw)) {
    const known = demoBadges.some((badge) => badge.id === id);
    if (!known) continue;
    badges[id] = {
      earnedAt:
        value && typeof value.earnedAt === "string" ? value.earnedAt : null,
    };
  }

  return badges;
}

function sanitizeHistory(raw) {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => ({
      id: typeof entry.id === "string" ? entry.id : null,
      activityId:
        typeof entry.activityId === "string" ? entry.activityId : "unknown",
      title: typeof entry.title === "string" ? entry.title : "Aktibidad",
      correct: Math.max(0, asInt(entry.correct, 0)),
      total: Math.max(0, asInt(entry.total, 0)),
      percent: Math.min(100, Math.max(0, asInt(entry.percent, 0))),
      passed: Boolean(entry.passed),
      timedOut: Boolean(entry.timedOut),
      activityXp: Math.max(0, asInt(entry.activityXp, 0)),
      badgeXp: Math.max(0, asInt(entry.badgeXp, 0)),
      xpAwarded: Math.max(0, asInt(entry.xpAwarded, 0)),
      completedAt:
        typeof entry.completedAt === "string" ? entry.completedAt : null,
    }))
    .slice(-MAX_HISTORY);
}

export function sanitizeProgress(raw, now = new Date()) {
  const base = createInitialProgress(now);

  if (!raw || typeof raw !== "object") return base;

  const startingXp = Math.max(0, asInt(raw.startingXp, demoStudent.points));
  const xpFromActivities = Math.max(0, asInt(raw.xpFromActivities, 0));
  const xpFromBadges = Math.max(0, asInt(raw.xpFromBadges, 0));

  return {
    ...base,
    startingXp,
    xpFromActivities,
    xpFromBadges,
    xp:
      raw.xp === undefined
        ? startingXp + xpFromActivities + xpFromBadges
        : Math.max(0, asInt(raw.xp, startingXp)),
    streak: Math.max(0, asInt(raw.streak, demoPracticeStreak.streakDays)),
    lastActivityDate:
      typeof raw.lastActivityDate === "string"
        ? raw.lastActivityDate
        : base.lastActivityDate,
    completions: sanitizeCompletions(raw.completions),
    badges: sanitizeBadges(raw.badges),
    history: sanitizeHistory(raw.history),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
  };
}

export function loadProgress(now = new Date(), storage = getStorage()) {
  if (!storage) return createInitialProgress(now);

  try {
    const raw = storage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return createInitialProgress(now);
    return sanitizeProgress(JSON.parse(raw), now);
  } catch {
    return createInitialProgress(now);
  }
}

export function saveProgress(state, storage = getStorage()) {
  if (!storage) return false;

  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearStoredProgress(storage = getStorage()) {
  if (!storage) return false;

  try {
    storage.removeItem(PROGRESS_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function countCompleted(state) {
  return Object.values(state?.completions ?? {}).filter(
    (completion) => completion.completed,
  ).length;
}

function criterionValue(state, badge) {
  const criteria = badge.criteria ?? { type: "completed", target: 1 };
  if (criteria.type === "streak") return Math.max(0, asInt(state.streak, 0));
  return countCompleted(state);
}

export function getBadgeStates(state) {
  return demoBadges.map((badge, index) => {
    const target = Math.max(1, asInt(badge.criteria?.target, 1));
    const awarded = state?.badges?.[badge.id];
    const value = criterionValue(state ?? createInitialProgress(), badge);

    return {
      ...badge,
      index,
      target,
      progress: Math.min(value, target),
      earned: Boolean(awarded),
      earnedAt: awarded?.earnedAt ?? null,
    };
  });
}

function evaluateBadges(state, now) {
  const badges = { ...(state.badges ?? {}) };
  const newlyEarned = [];

  for (const badge of demoBadges) {
    if (badges[badge.id]) continue;

    const target = Math.max(1, asInt(badge.criteria?.target, 1));
    if (criterionValue(state, badge) < target) continue;

    badges[badge.id] = { earnedAt: toDate(now).toISOString() };
    newlyEarned.push(badge);
  }

  return { badges, newlyEarned };
}

export function getCompletedActivities(state) {
  return Object.entries(state?.completions ?? {})
    .filter(([, completion]) => completion.completed)
    .map(([id, completion]) => ({ id, ...completion }))
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
}

export function getXpBreakdown(state) {
  return {
    startingXp: Math.max(0, asInt(state?.startingXp, demoStudent.points)),
    activityXp: Math.max(0, asInt(state?.xpFromActivities, 0)),
    badgeXp: Math.max(0, asInt(state?.xpFromBadges, 0)),
    totalXp: Math.max(0, asInt(state?.xp, demoStudent.points)),
  };
}

/**
 * Itinatala ang isang natapos na pagtatangka. Ang XP ay ibinibigay lamang
 * kapag pumasa (>= passPercent) at hindi pa nakumpleto ang aktibidad.
 * Ang retry ay maaaring magpabuti ng best score, pero hindi na muling
 * magbibigay ng XP para sa parehong aktibidad.
 */
export function recordActivityResult(
  state,
  { activity, correct = 0, total = 0, completedAt = new Date(), timedOut = false },
) {
  const now = toDate(completedAt);
  const activityId = activity?.id ?? "unknown";
  const totalQuestions = Math.max(
    1,
    asInt(total, activity?.questions?.length ?? 0),
  );
  const safeCorrect = Math.min(
    totalQuestions,
    Math.max(0, asInt(correct, 0)),
  );
  const percent = Math.round((safeCorrect / totalQuestions) * 100);
  const passPercent = Math.min(
    100,
    Math.max(0, asInt(activity?.passPercent, PASS_PERCENT)),
  );
  const passed = percent >= passPercent;
  const prior = state?.completions?.[activityId] ?? null;
  const alreadyCompleted = Boolean(prior?.completed);
  const firstCompletion = passed && !alreadyCompleted;
  const activityXp = firstCompletion
    ? Math.max(0, asInt(activity?.xp, 0))
    : 0;

  const completion = {
    title: activity?.title ?? activityId,
    attempts: Math.max(1, asInt(prior?.attempts, 0) + 1),
    bestCorrect: Math.max(asInt(prior?.bestCorrect, 0), safeCorrect),
    bestPercent: Math.max(asInt(prior?.bestPercent, 0), percent),
    total: totalQuestions,
    completed: alreadyCompleted || passed,
    completedAt:
      prior?.completedAt ??
      (passed || alreadyCompleted ? now.toISOString() : null),
    xpAwarded:
      Math.max(0, asInt(prior?.xpAwarded, 0)) > 0
        ? prior.xpAwarded
        : activityXp,
    lastAttemptAt: now.toISOString(),
  };

  let streak = Math.max(0, asInt(state?.streak, 0));
  let lastActivityDate = state?.lastActivityDate ?? null;
  let streakIncreased = false;
  let streakReset = false;

  if (passed) {
    const today = localDateKey(now);

    if (lastActivityDate === today) {
      // Isang beses lang binibilang ang streak bawat araw.
    } else if (lastActivityDate === previousLocalDateKey(now)) {
      streak = Math.max(1, streak) + 1;
      streakIncreased = true;
    } else {
      streakReset = streak > 1;
      streak = 1;
    }

    lastActivityDate = today;
  }

  const nextState = {
    ...state,
    version: 1,
    completions: {
      ...(state?.completions ?? {}),
      [activityId]: completion,
    },
    streak,
    lastActivityDate,
    history: [...(state?.history ?? [])],
    updatedAt: now.toISOString(),
  };

  const badgeResult = evaluateBadges(nextState, now);
  const badgeXp = badgeResult.newlyEarned.reduce(
    (sum, badge) => sum + Math.max(0, asInt(badge.xp, 0)),
    0,
  );
  const xpAwarded = activityXp + badgeXp;

  const historyEntry = {
    id: `${activityId}:${now.getTime()}:${nextState.history.length}`,
    activityId,
    title: activity?.title ?? activityId,
    correct: safeCorrect,
    total: totalQuestions,
    percent,
    passed,
    timedOut: Boolean(timedOut),
    activityXp,
    badgeXp,
    xpAwarded,
    completedAt: now.toISOString(),
  };

  nextState.badges = badgeResult.badges;
  nextState.xpFromActivities =
    Math.max(0, asInt(state?.xpFromActivities, 0)) + activityXp;
  nextState.xpFromBadges =
    Math.max(0, asInt(state?.xpFromBadges, 0)) + badgeXp;
  nextState.xp =
    Math.max(0, asInt(state?.startingXp, demoStudent.points)) +
    nextState.xpFromActivities +
    nextState.xpFromBadges;
  nextState.history = [...nextState.history, historyEntry].slice(-MAX_HISTORY);

  const levelBefore = getLevelProgress(state?.xp ?? 0).level;
  const levelAfter = getLevelProgress(nextState.xp).level;

  return {
    state: nextState,
    result: {
      activityId,
      title: activity?.title ?? activityId,
      correct: safeCorrect,
      total: totalQuestions,
      percent,
      passPercent,
      passed,
      timedOut: Boolean(timedOut),
      firstCompletion,
      alreadyCompleted,
      activityXp,
      badgeXp,
      xpAwarded,
      newBadges: badgeResult.newlyEarned,
      bestCorrect: completion.bestCorrect,
      bestPercent: completion.bestPercent,
      attempts: completion.attempts,
      streak: nextState.streak,
      streakIncreased,
      streakReset,
      leveledUp: levelAfter > levelBefore,
      level: levelAfter,
      totalXp: nextState.xp,
    },
  };
}
