import { Router } from "express";
import { getDatabase, transaction } from "../db/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { rateLimit } from "../middleware/security.js";
import {
  accessibleLesson,
  activityStats,
  getStudentAchievements,
  getStudentDashboard,
  getStudentProgress,
  listStudentActivities,
  listStudentLessons,
  serializeActivity,
  serializeLesson,
} from "../services/contentService.js";
import {
  awardPoints,
  evaluateBadges,
  getMetrics,
  getPoints,
  getStreak,
  passedActivityRows,
} from "../services/progressService.js";
import { simplifyForStudent } from "../services/aiService.js";
import { errors } from "../utils/errors.js";
import { levelForPoints, nowIso, percent } from "../utils/time.js";
import * as validate from "../utils/validation.js";
import { parseJson } from "../services/contentService.js";

export const studentRouter = Router();
studentRouter.use(requireAuth, requireRole("student"));

function studentClassId(student) {
  if (!student.class?.id) {
    throw errors.forbidden("Wala kang naka-link na klase. Makipag-ugnayan sa iyong guro.");
  }
  return Number(student.class.id);
}

studentRouter.get("/dashboard", async (req, res) => {
  const db = getDatabase();
  res.json((await getStudentDashboard(db, req.user)));
});

studentRouter.get("/lessons", async (req, res) => {
  const db = getDatabase();
  res.json({ lessons: (await listStudentLessons(db, req.user.id, studentClassId(req.user))) });
});

studentRouter.get("/lessons/:id", async (req, res, next) => {
  try {
    const db = getDatabase();
    const lessonId = validate.id(req.params.id, "aralin");
    const row = (await accessibleLesson(db, lessonId, studentClassId(req.user)));
    if (!row) throw errors.notFound("Hindi mahanap ang aralin.");
    res.json({
      lesson: (await serializeLesson(db, row, req.user.id, req.user.readingLevel)),
    });
  } catch (error) {
    next(error);
  }
});

// Binubuksan ng mag-aaral ang aralin: kung wala pang rekord, itinatala itong
// "in_progress". Walang XP dito — XP ay sa pagkumpleto lamang.
studentRouter.post("/lessons/:id/start", async (req, res, next) => {
  try {
    const db = getDatabase();
    const lessonId = validate.id(req.params.id, "aralin");
    const row = (await accessibleLesson(db, lessonId, studentClassId(req.user)));
    if (!row) throw errors.notFound("Hindi mahanap ang aralin.");

    const existing = (await db
      .prepare("SELECT status FROM lesson_progress WHERE student_id = ? AND lesson_id = ?")
      .get(req.user.id, lessonId));

    if (!existing) {
      (await db.prepare(
        `INSERT INTO lesson_progress (student_id, lesson_id, status, completed_at, updated_at)
         VALUES (?, ?, 'in_progress', NULL, ?)`,
      ).run(req.user.id, lessonId, nowIso()));
    }

    res.json({
      status: existing?.status ?? "in_progress",
      startedAt: nowIso(),
    });
  } catch (error) {
    next(error);
  }
});

studentRouter.post("/lessons/:id/complete", async (req, res, next) => {
  try {
    const db = getDatabase();
    const lessonId = validate.id(req.params.id, "aralin");
    const row = (await accessibleLesson(db, lessonId, studentClassId(req.user)));
    if (!row) throw errors.notFound("Hindi mahanap ang aralin.");

    const existing = (await db
      .prepare(
        "SELECT status FROM lesson_progress WHERE student_id = ? AND lesson_id = ?",
      )
      .get(req.user.id, lessonId));
    const firstCompletion = existing?.status !== "completed";

    await transaction(async (tx) => {
      (await tx.prepare(
        `INSERT INTO lesson_progress (student_id, lesson_id, status, completed_at, updated_at)
         VALUES (?, ?, 'completed', ?, ?)
         ON CONFLICT(student_id, lesson_id) DO UPDATE SET
           status = 'completed',
           completed_at = COALESCE(lesson_progress.completed_at, excluded.completed_at),
           updated_at = excluded.updated_at`,
      ).run(req.user.id, lessonId, nowIso(), nowIso()));

      if (firstCompletion) {
        (await awardPoints(tx, {
          studentId: req.user.id,
          delta: Number(row.xp),
          reasonCode: "lesson_completed",
          refType: "lesson",
          refId: lessonId,
        }));
      }
    });

    const badgeResult = firstCompletion ? (await evaluateBadges(req.user.id)) : { newBadges: [], xpAwarded: 0 };
    const metrics = (await getMetrics(db, req.user.id, studentClassId(req.user)));
    res.json({
      alreadyCompleted: !firstCompletion,
      lessonXp: firstCompletion ? Number(row.xp) : 0,
      badgeXp: badgeResult.xpAwarded,
      newBadges: badgeResult.newBadges,
      stats: {
        ...metrics,
        points: (await getPoints(db, req.user.id)),
        level: levelForPoints((await getPoints(db, req.user.id))),
      },
    });
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/activities", async (req, res, next) => {
  try {
    const kind = req.query.kind === "quiz" ? "quiz" : req.query.kind === "activity" ? "activity" : null;
    if (!kind) throw errors.validation("Ilagay ang uri: activity o quiz.");
    const db = getDatabase();
    res.json({
      activities: (await listStudentActivities(db, req.user.id, studentClassId(req.user), kind)),
    });
  } catch (error) {
    next(error);
  }
});

studentRouter.get("/activities/:id", async (req, res, next) => {
  try {
    const db = getDatabase();
    const activityId = validate.id(req.params.id, "aktibidad");
    const row = (await db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id
         WHERE a.id = ? AND a.published = 1 AND (a.class_id IS NULL OR a.class_id = ?)`,
      )
      .get(activityId, studentClassId(req.user)));
    if (!row) throw errors.notFound("Hindi mahanap ang aktibidad.");
    res.json({ activity: serializeActivity(row, req.user.id, db) });
  } catch (error) {
    next(error);
  }
});

studentRouter.post("/activities/:id/start", async (req, res, next) => {
  try {
    const db = getDatabase();
    const activityId = validate.id(req.params.id, "aktibidad");
    const activity = (await db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id
         WHERE a.id = ? AND a.published = 1 AND (a.class_id IS NULL OR a.class_id = ?)`,
      )
      .get(activityId, studentClassId(req.user)));
    if (!activity) throw errors.notFound("Hindi mahanap ang aktibidad.");
    if (Number(activity.question_count) === 0) {
      throw errors.conflict("Wala pang tanong ang aktibidad na ito.");
    }

    const questions = (await db
      .prepare(
        `SELECT id, prompt, options_json
         FROM questions WHERE activity_id = ? ORDER BY position, id`,
      )
      .all(activityId))
      .map((question) => ({
        id: Number(question.id),
        prompt: question.prompt,
        options: parseJson(question.options_json, []),
      }));

    const startedAt = nowIso();
    const result = (await db
      .prepare(
        `INSERT INTO attempts (activity_id, student_id, started_at, total, status)
         VALUES (?, ?, ?, ?, 'in_progress')`,
      )
      .run(activityId, req.user.id, startedAt, questions.length));

    res.status(201).json({
      attemptId: Number(result.lastInsertRowid),
      startedAt,
      activity: serializeActivity(activity, req.user.id, db),
      questions,
    });
  } catch (error) {
    next(error);
  }
});

studentRouter.post(
  "/attempts/:id/submit",
  rateLimit({ keyPrefix: "quiz-submit", windowMs: 60 * 1000, max: 20 }),
  async (req, res, next) => {
    try {
      const db = getDatabase();
      const attemptId = validate.id(req.params.id, "pagtatangka");
      const attempt = (await db
        .prepare(
          `SELECT at.*, a.title, a.kind, a.pass_percent, a.xp, a.timer_seconds,
                  a.lesson_id, a.class_id
           FROM attempts at JOIN activities a ON a.id = at.activity_id
           WHERE at.id = ? AND at.student_id = ?`,
        )
        .get(attemptId, req.user.id));
      if (!attempt) throw errors.notFound("Hindi mahanap ang pagtatangka.");
      if (attempt.status === "completed") {
        throw errors.conflict("Nasumite na ang pagtatangkang ito.");
      }

      const questions = (await db
        .prepare(
          `SELECT id, prompt, options_json, correct_index, explanation
           FROM questions WHERE activity_id = ? ORDER BY position, id`,
        )
        .all(attempt.activity_id));
      if (questions.length === 0) throw errors.conflict("Wala pang tanong ang aktibidad.");

      const submitted = Array.isArray(req.body?.answers) ? req.body.answers : [];
      const answerMap = new Map();
      for (const answer of submitted) {
        const questionId = Number(answer?.questionId);
        const selectedIndex = Number(answer?.selectedIndex);
        const question = questions.find((item) => Number(item.id) === questionId);
        if (!question) continue;
        const options = parseJson(question.options_json, []);
        if (
          !Number.isInteger(selectedIndex) ||
          selectedIndex < 0 ||
          selectedIndex >= options.length
        ) {
          continue;
        }
        answerMap.set(questionId, selectedIndex);
      }

      const elapsedSeconds = Math.max(
        0,
        Math.floor((Date.now() - new Date(attempt.started_at).getTime()) / 1000),
      );
      const timerExpired =
        attempt.timer_seconds !== null &&
        elapsedSeconds > Number(attempt.timer_seconds) + 30;
      const timedOut = Boolean(req.body?.timedOut) || timerExpired;

      let correct = 0;
      const feedback = questions.map((question) => {
        const selectedIndex = answerMap.has(Number(question.id))
          ? answerMap.get(Number(question.id))
          : null;
        const correctIndex = Number(question.correct_index);
        const isCorrect = selectedIndex === correctIndex;
        if (isCorrect) correct += 1;
        return {
          questionId: Number(question.id),
          selectedIndex,
          correctIndex,
          correct: isCorrect,
          explanation: question.explanation,
        };
      });

      const total = questions.length;
      const scorePercent = percent(correct, total);
      const passed = scorePercent >= Number(attempt.pass_percent);
      const priorPass = (await db
        .prepare(
          `SELECT 1 FROM attempts at JOIN activities a ON a.id = at.activity_id
           WHERE at.student_id = ? AND at.activity_id = ? AND at.status = 'completed'
             AND at.score * 100.0 / at.total >= a.pass_percent
           LIMIT 1`,
        )
        .get(req.user.id, attempt.activity_id));
      const firstPass = passed && !priorPass;

      await transaction(async (tx) => {
        (await tx.prepare(
          `UPDATE attempts SET completed_at = ?, score = ?, total = ?, timed_out = ?, status = 'completed'
           WHERE id = ? AND student_id = ?`,
        ).run(nowIso(), correct, total, timedOut ? 1 : 0, attemptId, req.user.id));

        const insertAnswer = tx.prepare(
          `INSERT OR REPLACE INTO attempt_answers (attempt_id, question_id, selected_index, is_correct)
           VALUES (?, ?, ?, ?)`,
        );
        for (const item of feedback) {
          if (item.selectedIndex === null) continue;
          (await insertAnswer.run(
            attemptId,
            item.questionId,
            item.selectedIndex,
            item.correct ? 1 : 0,
          ));
        }

        if (firstPass) {
          (await awardPoints(tx, {
            studentId: req.user.id,
            delta: Number(attempt.xp),
            reasonCode: "activity_passed",
            refType: "activity",
            refId: Number(attempt.activity_id),
          }));
        }
      });

      const badgeResult = (await evaluateBadges(req.user.id));
      const points = (await getPoints(db, req.user.id));
      const stats = (await activityStats(db, req.user.id, Number(attempt.activity_id)));

      res.json({
        attempt: {
          id: attemptId,
          activityId: Number(attempt.activity_id),
          title: attempt.title,
          kind: attempt.kind,
          score: correct,
          total,
          percent: scorePercent,
          passed,
          timedOut,
          firstPass,
          alreadyPassed: Boolean(priorPass),
          activityXp: firstPass ? Number(attempt.xp) : 0,
          badgeXp: badgeResult.xpAwarded,
          xpAwarded: (firstPass ? Number(attempt.xp) : 0) + badgeResult.xpAwarded,
          bestPercent: stats.bestPercent,
          attempts: stats.attempts,
          completedAt: nowIso(),
        },
        feedback,
        newBadges: badgeResult.newBadges,
        totals: {
          points,
          level: levelForPoints(points),
          streak: (await getStreak(db, req.user.id)),
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

studentRouter.get("/attempts", async (req, res) => {
  const db = getDatabase();
  const rows = (await db
    .prepare(
      `SELECT at.id, at.score, at.total, at.completed_at, at.timed_out,
              a.title, a.kind, a.pass_percent
       FROM attempts at JOIN activities a ON a.id = at.activity_id
       WHERE at.student_id = ? AND at.status = 'completed'
       ORDER BY at.completed_at DESC LIMIT 100`,
    )
    .all(req.user.id));

  res.json({
    attempts: rows.map((row) => ({
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
  });
});

studentRouter.get("/progress", async (req, res) => {
  const db = getDatabase();
  res.json((await getStudentProgress(db, req.user)));
});

studentRouter.get("/achievements", async (req, res) => {
  const db = getDatabase();
  res.json((await getStudentAchievements(db, req.user)));
});

studentRouter.get("/overview", async (req, res) => {
  const db = getDatabase();
  const metrics = (await getMetrics(db, req.user.id, studentClassId(req.user)));
  res.json({
    stats: metrics,
    passedActivities: (await passedActivityRows(db, req.user.id)),
  });
});

studentRouter.post(
  "/simplify",
  rateLimit({ keyPrefix: "ai-simplify", windowMs: 60 * 60 * 1000, max: 20 }),
  async (req, res, next) => {
    try {
      const text = validate.text(req.body?.text, "teksto", { min: 30, max: 20000 });
      const level = validate.readingLevel(req.body?.level);
      const provider =
        req.body?.provider === "openai" || req.body?.provider === "gemini"
          ? req.body.provider
          : undefined;
      const result = await simplifyForStudent({
        studentId: req.user.id,
        text,
        level,
        provider,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
