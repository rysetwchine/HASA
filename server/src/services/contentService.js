import { getDatabase } from "../db/database.js";
import { getMetrics, getPoints } from "./progressService.js";
import { levelForPoints, percent } from "../utils/time.js";

export function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export async function accessibleLesson(db, lessonId, classId) {
  return (await db
    .prepare(
      `SELECT * FROM lessons
       WHERE id = ? AND published = 1 AND (class_id IS NULL OR class_id = ?)`,
    )
    .get(lessonId, classId));
}

export async function listStudentLessons(db, studentId, classId) {
  return (await db
    .prepare(
      `SELECT l.id, l.slug, l.title, l.unit, l.description, l.difficulty,
              l.estimated_minutes, l.xp, l.class_id, l.created_by,
              lp.status AS progress_status, lp.completed_at
       FROM lessons l
       LEFT JOIN lesson_progress lp
         ON lp.lesson_id = l.id AND lp.student_id = ?
       WHERE l.published = 1 AND (l.class_id IS NULL OR l.class_id = ?)
       ORDER BY l.unit, l.id`,
    )
    .all(studentId, classId))
    .map((row) => ({
      id: Number(row.id),
      slug: row.slug,
      title: row.title,
      unit: row.unit,
      description: row.description,
      difficulty: row.difficulty,
      estimatedMinutes: Number(row.estimated_minutes),
      xp: Number(row.xp),
      isClassContent: Boolean(row.class_id),
      progress: row.progress_status ?? null,
      completedAt: row.completed_at ?? null,
    }));
}

export async function serializeLesson(db, row, studentId, readingLevel) {
  const progress = (await db
    .prepare(
      "SELECT status, completed_at FROM lesson_progress WHERE student_id = ? AND lesson_id = ?",
    )
    .get(studentId, row.id));

  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    unit: row.unit,
    description: row.description,
    difficulty: row.difficulty,
    estimatedMinutes: Number(row.estimated_minutes),
    xp: Number(row.xp),
    isClassContent: Boolean(row.class_id),
    vocabulary: parseJson(row.vocabulary_json, []),
    contents: {
      independent: row.content_independent,
      instructional: row.content_instructional,
      frustration: row.content_frustration,
    },
    defaultLevel: readingLevel,
    progress: progress
      ? {
          status: progress.status,
          completedAt: progress.completed_at,
        }
      : null,
  };
}

export async function activityStats(db, studentId, activityId) {
  const attempts = (await db
    .prepare(
      `SELECT score, total, completed_at, timed_out
       FROM attempts
       WHERE activity_id = ? AND student_id = ? AND status = 'completed'
       ORDER BY completed_at DESC`,
    )
    .all(activityId, studentId));

  if (attempts.length === 0) {
    return {
      attempts: 0,
      bestPercent: 0,
      bestScore: 0,
      total: 0,
      passed: false,
      lastAttemptAt: null,
    };
  }

  const activity = (await db
    .prepare("SELECT pass_percent FROM activities WHERE id = ?")
    .get(activityId));
  const best = attempts.reduce(
    (current, attempt) =>
      Number(attempt.score) / Number(attempt.total) >
      Number(current.score) / Number(current.total)
        ? attempt
        : current,
    attempts[0],
  );
  const bestPercent = percent(best.score, best.total);
  return {
    attempts: attempts.length,
    bestPercent,
    bestScore: Number(best.score),
    total: Number(best.total),
    passed: bestPercent >= Number(activity?.pass_percent ?? 60),
    lastAttemptAt: attempts[0].completed_at,
  };
}

export async function listStudentActivities(db, studentId, classId, kind) {
  const rows = (await db
    .prepare(
      `SELECT a.*, l.title AS lesson_title,
              (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count
       FROM activities a
       LEFT JOIN lessons l ON l.id = a.lesson_id
       WHERE a.published = 1 AND a.kind = ? AND (a.class_id IS NULL OR a.class_id = ?)
       ORDER BY a.class_id IS NOT NULL, a.id`,
    )
    .all(kind, classId));

  return rows.map((row) => ({
    id: Number(row.id),
    title: row.title,
    description: row.description,
    kind: row.kind,
    lesson: row.lesson_id
      ? { id: Number(row.lesson_id), title: row.lesson_title }
      : null,
    xp: Number(row.xp),
    passPercent: Number(row.pass_percent),
    timerSeconds: row.timer_seconds === null ? null : Number(row.timer_seconds),
    questionCount: Number(row.question_count),
    isClassContent: Boolean(row.class_id),
    ...activityStats(db, studentId, Number(row.id)),
  }));
}

export function serializeActivity(row, studentId, db) {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    kind: row.kind,
    lesson: row.lesson_id
      ? { id: Number(row.lesson_id), title: row.lesson_title ?? "" }
      : null,
    xp: Number(row.xp),
    passPercent: Number(row.pass_percent),
    timerSeconds: row.timer_seconds === null ? null : Number(row.timer_seconds),
    questionCount: Number(row.question_count),
    isClassContent: Boolean(row.class_id),
    ...activityStats(db, studentId, Number(row.id)),
  };
}

export async function getStudentDashboard(db, student) {
  const classId = Number(student.class.id);
  const metrics = (await getMetrics(db, student.id, classId));
  const lessons = (await listStudentLessons(db, student.id, classId));
  const continueLesson =
    lessons.find((lesson) => lesson.progress !== "completed") ?? null;
  const recentRows = (await db
    .prepare(
      `SELECT at.id, at.score, at.total, at.completed_at, at.timed_out,
              a.title, a.kind, a.pass_percent
       FROM attempts at JOIN activities a ON a.id = at.activity_id
       WHERE at.student_id = ? AND at.status = 'completed'
       ORDER BY at.completed_at DESC LIMIT 5`,
    )
    .all(student.id));

  const nextAssessment = (await db
    .prepare(
      `SELECT a.id, a.title, a.kind, a.xp
       FROM activities a
       WHERE a.published = 1 AND (a.class_id IS NULL OR a.class_id = ?)
         AND NOT EXISTS (
           SELECT 1 FROM attempts at
           WHERE at.activity_id = a.id AND at.student_id = ?
             AND at.status = 'completed'
             AND at.score * 100.0 / at.total >= a.pass_percent
         )
       ORDER BY a.kind = 'quiz', a.id LIMIT 1`,
    )
    .get(classId, student.id));

  return {
    stats: {
      ...metrics,
      lessonProgressPercent: percent(metrics.lessonsCompleted, metrics.lessonsTotal),
      xpForNextLevel: metrics.level * 300,
      xpIntoLevel: metrics.points,
    },
    continueLesson,
    recentAttempts: recentRows.map((row) => ({
      id: Number(row.id),
      title: row.title,
      kind: row.kind,
      score: Number(row.score),
      total: Number(row.total),
      percent: percent(row.score, row.total),
      passed:
        Number(row.total) > 0 &&
        Number(row.score) * 100 >= Number(row.pass_percent) * Number(row.total),
      timedOut: Boolean(row.timed_out),
      completedAt: row.completed_at,
    })),
    nextAssessment: nextAssessment
      ? {
          id: Number(nextAssessment.id),
          title: nextAssessment.title,
          kind: nextAssessment.kind,
          xp: Number(nextAssessment.xp),
        }
      : null,
  };
}

export async function getStudentProgress(db, student) {
  const classId = Number(student.class.id);
  const metrics = (await getMetrics(db, student.id, classId));
  const lessons = (await listStudentLessons(db, student.id, classId));
  const activities = [
    ...(await listStudentActivities(db, student.id, classId, "activity")),
    ...(await listStudentActivities(db, student.id, classId, "quiz")),
  ];
  const attemptHistory = (await db
    .prepare(
      `SELECT at.id, at.score, at.total, at.completed_at, at.timed_out,
              a.title, a.kind, a.pass_percent
       FROM attempts at JOIN activities a ON a.id = at.activity_id
       WHERE at.student_id = ? AND at.status = 'completed'
       ORDER BY at.completed_at DESC LIMIT 50`,
    )
    .all(student.id))
    .map((row) => ({
      id: Number(row.id),
      title: row.title,
      kind: row.kind,
      score: Number(row.score),
      total: Number(row.total),
      percent: percent(row.score, row.total),
      passed:
        Number(row.total) > 0 &&
        Number(row.score) * 100 >= Number(row.pass_percent) * Number(row.total),
      timedOut: Boolean(row.timed_out),
      completedAt: row.completed_at,
    }));

  const pointsHistory = (await db
    .prepare(
      `SELECT delta, reason_code, created_at
       FROM points_ledger WHERE student_id = ? ORDER BY created_at DESC LIMIT 20`,
    )
    .all(student.id))
    .map((row) => ({
      delta: Number(row.delta),
      reason: row.reason_code,
      createdAt: row.created_at,
    }));

  const averageScore =
    attemptHistory.length > 0
      ? Math.round(
          attemptHistory.reduce((sum, attempt) => sum + attempt.percent, 0) /
            attemptHistory.length,
        )
      : 0;

  return {
    stats: {
      ...metrics,
      averageScore,
      lessonProgressPercent: percent(metrics.lessonsCompleted, metrics.lessonsTotal),
      xpForNextLevel: metrics.level * 300,
      xpIntoLevel: metrics.points,
    },
    lessons,
    activities,
    attemptHistory,
    pointsHistory,
  };
}

export async function getStudentAchievements(db, student) {
  const metrics = (await getMetrics(db, student.id, Number(student.class.id)));
  const earned = (await db
    .prepare(
      "SELECT badge_id, awarded_at FROM student_badges WHERE student_id = ?",
    )
    .all(student.id));
  const earnedMap = new Map(
    earned.map((row) => [Number(row.badge_id), row.awarded_at]),
  );
  const metricByType = {
    activities_passed: metrics.activitiesPassed,
    lessons_completed: metrics.lessonsCompleted,
    streak: metrics.streak,
    quizzes_passed: metrics.quizzesPassed,
    perfect_quiz: metrics.perfectQuiz,
  };

  const badges = (await db
    .prepare("SELECT * FROM badges ORDER BY sort_order, id")
    .all())
    .map((badge) => {
      const value = Number(metricByType[badge.criteria_type] ?? 0);
      return {
        id: Number(badge.id),
        code: badge.code,
        name: badge.name_tl,
        description: badge.description_tl,
        criteriaType: badge.criteria_type,
        xp: Number(badge.xp),
        target: Number(badge.criteria_target),
        progress: Math.min(value, Number(badge.criteria_target)),
        earned: earnedMap.has(Number(badge.id)),
        earnedAt: earnedMap.get(Number(badge.id)) ?? null,
      };
    });

  return {
    points: metrics.points,
    level: levelForPoints(metrics.points),
    earnedCount: badges.filter((badge) => badge.earned).length,
    badges,
  };
}

export async function pointsForStudent(db, studentId) {
  return (await getPoints(db, studentId));
}

export async function studentAverage(db, studentId) {
  const row = (await db
    .prepare(
      `SELECT AVG(score * 100.0 / total) AS average
       FROM attempts WHERE student_id = ? AND status = 'completed'`,
    )
    .get(studentId));
  return row?.average ? Math.round(Number(row.average)) : 0;
}
