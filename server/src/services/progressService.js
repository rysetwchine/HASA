import { getDatabase, transaction } from "../db/database.js";
import { calculateStreak, levelForPoints, manilaDateKey, nowIso, percent } from "../utils/time.js";

export function getPoints(db, studentId) {
  const row = db
    .prepare("SELECT COALESCE(SUM(delta), 0) AS points FROM points_ledger WHERE student_id = ?")
    .get(studentId);
  return Number(row.points) || 0;
}

export function getStreak(db, studentId, today = manilaDateKey()) {
  const rows = db
    .prepare(
      `SELECT completed_at AS date FROM attempts
       WHERE student_id = ? AND status = 'completed' AND completed_at IS NOT NULL
       UNION ALL
       SELECT completed_at AS date FROM lesson_progress
       WHERE student_id = ? AND status = 'completed' AND completed_at IS NOT NULL`,
    )
    .all(studentId, studentId);

  return calculateStreak(
    rows.map((row) => manilaDateKey(row.date)),
    today,
  );
}

export function totalLessonsForStudent(db, classId) {
  return Number(
    db
      .prepare(
        `SELECT COUNT(*) AS count FROM lessons
         WHERE published = 1 AND (class_id IS NULL OR class_id = ?)`,
      )
      .get(classId).count,
  );
}

export function totalActivitiesForStudent(db, classId, kind) {
  return Number(
    db
      .prepare(
        `SELECT COUNT(*) AS count FROM activities
         WHERE published = 1 AND kind = ? AND (class_id IS NULL OR class_id = ?)`,
      )
      .get(kind, classId).count,
  );
}

export function passedActivityRows(db, studentId) {
  return db
    .prepare(
      `SELECT a.id, a.kind, a.title, MAX(CASE WHEN at.score * 100.0 / at.total >= a.pass_percent THEN 1 ELSE 0 END) AS passed,
              MAX(CASE WHEN at.score = at.total THEN 1 ELSE 0 END) AS perfect,
              MAX(at.score * 100.0 / at.total) AS best_percent
       FROM attempts at
       JOIN activities a ON a.id = at.activity_id
       WHERE at.student_id = ? AND at.status = 'completed'
       GROUP BY a.id`,
    )
    .all(studentId);
}

export function getMetrics(db, studentId, classId) {
  const points = getPoints(db, studentId);
  const lessonsCompleted = Number(
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM lesson_progress WHERE student_id = ? AND status = 'completed'",
      )
      .get(studentId).count,
  );
  const passed = passedActivityRows(db, studentId);
  const activitiesPassed = passed.filter((row) => Number(row.passed) === 1).length;
  const quizzesPassed = passed.filter(
    (row) => Number(row.passed) === 1 && row.kind === "quiz",
  ).length;
  const perfectQuiz = passed.some(
    (row) => Number(row.perfect) === 1 && row.kind === "quiz",
  )
    ? 1
    : 0;

  return {
    points,
    level: levelForPoints(points),
    streak: getStreak(db, studentId),
    lessonsCompleted,
    lessonsTotal: totalLessonsForStudent(db, classId),
    activitiesPassed,
    quizzesPassed,
    perfectQuiz,
    badgesEarned: Number(
      db
        .prepare("SELECT COUNT(*) AS count FROM student_badges WHERE student_id = ?")
        .get(studentId).count,
    ),
  };
}

export function awardPoints(db, { studentId, delta, reasonCode, refType, refId }) {
  if (delta <= 0) return 0;
  const result = db
    .prepare(
      `INSERT OR IGNORE INTO points_ledger
       (student_id, delta, reason_code, ref_type, ref_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(studentId, delta, reasonCode, refType, refId, nowIso());
  return Number(result.changes) > 0 ? delta : 0;
}

const BADGE_METRIC = {
  activities_passed: "activitiesPassed",
  lessons_completed: "lessonsCompleted",
  streak: "streak",
  quizzes_passed: "quizzesPassed",
  perfect_quiz: "perfectQuiz",
};

/**
 * Awards every badge whose rule is now met. Runs in one transaction so a
 * badge and its one-time XP cannot be granted twice.
 */
export function evaluateBadges(studentId) {
  const db = getDatabase();
  const student = db
    .prepare("SELECT id, class_id FROM users WHERE id = ? AND role = 'student'")
    .get(studentId);
  if (!student) return { newBadges: [], xpAwarded: 0 };

  const metrics = getMetrics(db, studentId, Number(student.class_id));
  const badges = db.prepare("SELECT * FROM badges ORDER BY sort_order, id").all();
  const awarded = new Set(
    db
      .prepare("SELECT badge_id FROM student_badges WHERE student_id = ?")
      .all(studentId)
      .map((row) => Number(row.badge_id)),
  );

  const newBadges = [];
  let xpAwarded = 0;

  transaction((tx) => {
    for (const badge of badges) {
      if (awarded.has(Number(badge.id))) continue;
      const metricKey = BADGE_METRIC[badge.criteria_type];
      const value = metricKey ? Number(metrics[metricKey]) || 0 : 0;
      if (value < Number(badge.criteria_target)) continue;

      const insert = tx
        .prepare(
          "INSERT OR IGNORE INTO student_badges (student_id, badge_id, awarded_at) VALUES (?, ?, ?)",
        )
        .run(studentId, badge.id, nowIso());
      if (Number(insert.changes) === 0) continue;

      const bonus = Number(badge.xp) || 0;
      if (bonus > 0) {
        awardPoints(tx, {
          studentId,
          delta: bonus,
          reasonCode: "badge_awarded",
          refType: "badge",
          refId: Number(badge.id),
        });
      }
      xpAwarded += bonus;
      newBadges.push({
        id: Number(badge.id),
        code: badge.code,
        name: badge.name_tl,
        description: badge.description_tl,
        xp: bonus,
      });
    }
  });

  return { newBadges, xpAwarded, points: getPoints(db, studentId) };
}

export function serializeAttemptScore(row) {
  const score = Number(row.score) || 0;
  const total = Number(row.total) || 0;
  return {
    id: Number(row.id),
    activityId: Number(row.activity_id),
    title: row.title,
    kind: row.kind,
    score,
    total,
    percent: percent(score, total),
    passed: total > 0 && score * 100 >= Number(row.pass_percent) * total,
    timedOut: Boolean(row.timed_out),
    completedAt: row.completed_at,
  };
}
