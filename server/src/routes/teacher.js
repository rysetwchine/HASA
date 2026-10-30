import { Router } from "express";
import { getDatabase, transaction } from "../db/database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { publicUser } from "../services/authService.js";
import {
  getStudentAchievements,
  getStudentProgress,
} from "../services/contentService.js";
import { getPoints, getStreak } from "../services/progressService.js";
import { rotateJoinCode } from "../services/authService.js";
import { errors } from "../utils/errors.js";
import { hashPassword, createTemporaryPassword } from "../utils/security.js";
import { levelForPoints, nowIso, percent } from "../utils/time.js";
import * as validate from "../utils/validation.js";

export const teacherRouter = Router();
teacherRouter.use(requireAuth, requireRole("teacher"));

function teacherClass(db, teacherId) {
  const cls = db
    .prepare("SELECT id, name, join_code, created_at FROM classes WHERE teacher_id = ?")
    .get(teacherId);
  if (!cls) {
    throw errors.conflict(
      "Wala pang klase ang account na ito. Gumawa ng klase bago magpatuloy.",
    );
  }
  return cls;
}

function classStudents(db, classId) {
  return db
    .prepare(
      `SELECT id, username, display_name, reading_level, created_at
       FROM users
       WHERE class_id = ? AND role = 'student' AND is_active = 1
       ORDER BY display_name COLLATE NOCASE`,
    )
    .all(classId);
}

function studentSnapshot(db, student) {
  const points = getPoints(db, student.id);
  const attempts = db
    .prepare(
      `SELECT COUNT(*) AS count, AVG(score * 100.0 / total) AS average,
              MAX(completed_at) AS last_attempt
       FROM attempts WHERE student_id = ? AND status = 'completed'`,
    )
    .get(student.id);
  const lessonsCompleted = Number(
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM lesson_progress WHERE student_id = ? AND status = 'completed'",
      )
      .get(student.id).count,
  );
  const lastLesson = db
    .prepare(
      "SELECT MAX(updated_at) AS last_lesson FROM lesson_progress WHERE student_id = ?",
    )
    .get(student.id);
  const badges = Number(
    db
      .prepare("SELECT COUNT(*) AS count FROM student_badges WHERE student_id = ?")
      .get(student.id).count,
  );
  const lastActiveCandidates = [attempts.last_attempt, lastLesson.last_lesson].filter(Boolean);

  return {
    id: Number(student.id),
    username: student.username,
    displayName: student.display_name,
    readingLevel: student.reading_level,
    createdAt: student.created_at,
    points,
    level: levelForPoints(points),
    lessonsCompleted,
    attempts: Number(attempts.count),
    averageScore: attempts.average ? Math.round(Number(attempts.average)) : 0,
    badges,
    streak: getStreak(db, student.id),
    lastActiveAt:
      lastActiveCandidates.length > 0
        ? lastActiveCandidates.sort().at(-1)
        : null,
  };
}

function verifyStudent(db, teacherId, studentId) {
  const student = db
    .prepare(
      `SELECT u.id, c.id AS class_id
       FROM users u JOIN classes c ON c.id = u.class_id
       WHERE u.id = ? AND u.role = 'student' AND c.teacher_id = ?`,
    )
    .get(studentId, teacherId);
  if (!student) throw errors.notFound("Hindi mahanap ang mag-aaral sa iyong klase.");
  return student;
}

teacherRouter.get("/dashboard", (req, res) => {
  const db = getDatabase();
  const cls = teacherClass(db, req.user.id);
  const students = classStudents(db, cls.id);
  const snapshots = students.map((student) => studentSnapshot(db, student));
  const publishedLessons = Number(
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM lessons WHERE published = 1 AND (class_id IS NULL OR class_id = ?)",
      )
      .get(cls.id).count,
  );
  const publishedAssessments = Number(
    db
      .prepare(
        "SELECT COUNT(*) AS count FROM activities WHERE published = 1 AND (class_id IS NULL OR class_id = ?)",
      )
      .get(cls.id).count,
  );
  const totalCompletedLessons = snapshots.reduce(
    (sum, student) => sum + student.lessonsCompleted,
    0,
  );
  const possibleLessons = students.length * Math.max(1, publishedLessons);
  const recentAttempts = db
    .prepare(
      `SELECT at.id, at.score, at.total, at.completed_at, at.timed_out,
              a.title, a.kind, a.pass_percent, u.display_name
       FROM attempts at
       JOIN activities a ON a.id = at.activity_id
       JOIN users u ON u.id = at.student_id
       WHERE at.student_id IN (SELECT id FROM users WHERE class_id = ? AND role = 'student')
         AND at.status = 'completed'
       ORDER BY at.completed_at DESC LIMIT 8`,
    )
    .all(cls.id)
    .map((row) => ({
      id: Number(row.id),
      studentName: row.display_name,
      title: row.title,
      kind: row.kind,
      percent: percent(row.score, row.total),
      passed:
        Number(row.total) > 0 &&
        Number(row.score) * 100 >= Number(row.pass_percent) * Number(row.total),
      completedAt: row.completed_at,
    }));

  const activeSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const activeThisWeek = snapshots.filter(
    (student) => student.lastActiveAt && student.lastActiveAt >= activeSince,
  ).length;

  res.json({
    class: {
      id: Number(cls.id),
      name: cls.name,
      joinCode: cls.join_code,
      createdAt: cls.created_at,
    },
    counts: {
      students: students.length,
      lessons: publishedLessons,
      assessments: publishedAssessments,
      activeThisWeek,
    },
    averages: {
      studentScore:
        snapshots.length > 0
          ? Math.round(
              snapshots.reduce((sum, student) => sum + student.averageScore, 0) /
                snapshots.length,
            )
          : 0,
      lessonCompletion: percent(totalCompletedLessons, possibleLessons),
      points:
        snapshots.length > 0
          ? Math.round(
              snapshots.reduce((sum, student) => sum + student.points, 0) /
                snapshots.length,
            )
          : 0,
    },
    students: snapshots
      .sort((a, b) => b.points - a.points)
      .slice(0, 5),
    recentAttempts,
  });
});

teacherRouter.get("/students", (req, res) => {
  const db = getDatabase();
  const cls = teacherClass(db, req.user.id);
  const students = classStudents(db, cls.id).map((student) =>
    studentSnapshot(db, student),
  );
  res.json({
    class: { id: Number(cls.id), name: cls.name, joinCode: cls.join_code },
    students,
  });
});

teacherRouter.get("/students/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const studentId = validate.id(req.params.id, "mag-aaral");
    verifyStudent(db, req.user.id, studentId);
    const user = publicUser(db, studentId);
    res.json({
      student: user,
      progress: getStudentProgress(db, user),
      achievements: getStudentAchievements(db, user),
    });
  } catch (error) {
    next(error);
  }
});

teacherRouter.post("/students/:id/reset-password", async (req, res, next) => {
  try {
    const db = getDatabase();
    const studentId = validate.id(req.params.id, "mag-aaral");
    verifyStudent(db, req.user.id, studentId);

    const temporaryPassword = createTemporaryPassword();
    const passwordHash = await hashPassword(temporaryPassword);
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(
      passwordHash,
      studentId,
    );
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(studentId);
    res.json({
      temporaryPassword,
      message: "Gumawa ng pansamantalang password. Ibigay ito sa mag-aaral at ipachange agad.",
    });
  } catch (error) {
    next(error);
  }
});

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70) || "aralin";
}

function uniqueSlug(db, title) {
  const base = slugify(title);
  let candidate = base;
  let index = 2;
  while (db.prepare("SELECT 1 FROM lessons WHERE slug = ?").get(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  return candidate;
}

function cleanVocabulary(value) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw errors.validation("Hindi wasto ang talasalitaan.");
  return value.slice(0, 12).map((item) => ({
    word: validate.text(item?.word, "salita", { min: 1, max: 120 }),
    explanation: validate.text(item?.explanation, "paliwanag", {
      min: 1,
      max: 500,
    }),
    example: validate.text(item?.example ?? item?.exampleSentence ?? "", "halimbawa", {
      min: 0,
      max: 300,
    }),
  }));
}

function lessonPayload(db, row, teacherId) {
  return {
    id: Number(row.id),
    slug: row.slug,
    title: row.title,
    unit: row.unit,
    description: row.description,
    difficulty: row.difficulty,
    estimatedMinutes: Number(row.estimated_minutes),
    xp: Number(row.xp),
    contents: {
      independent: row.content_independent,
      instructional: row.content_instructional,
      frustration: row.content_frustration,
    },
    vocabulary: JSON.parse(row.vocabulary_json || "[]"),
    published: Boolean(row.published),
    isClassContent: Boolean(row.class_id),
    editable: Number(row.created_by) === Number(teacherId),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

teacherRouter.get("/lessons", (req, res) => {
  const db = getDatabase();
  const cls = teacherClass(db, req.user.id);
  const rows = db
    .prepare(
      `SELECT * FROM lessons
       WHERE created_by = ? OR class_id IS NULL
       ORDER BY class_id IS NOT NULL DESC, unit, id`,
    )
    .all(req.user.id);
  res.json({ lessons: rows.map((row) => lessonPayload(db, row, req.user.id)) });
});

teacherRouter.post("/lessons", (req, res, next) => {
  try {
    const db = getDatabase();
    const cls = teacherClass(db, req.user.id);
    const title = validate.text(req.body?.title, "pamagat", { min: 3, max: 160 });
    const unit = validate.text(req.body?.unit, "yunit", { min: 3, max: 120 });
    const description = validate.text(req.body?.description, "paglalarawan", {
      min: 10,
      max: 600,
    });
    const difficulty = ["madali", "katamtaman", "mahirap"].includes(req.body?.difficulty)
      ? req.body.difficulty
      : "katamtaman";
    const estimatedMinutes = validate.integer(
      req.body?.estimatedMinutes ?? 10,
      "tagal ng pagbasa",
      { min: 1, max: 180 },
    );
    const xp = validate.integer(req.body?.xp ?? 15, "XP", { min: 0, max: 200 });
    const content = req.body?.contents ?? {};
    const independent = validate.text(content.independent, "teksto para sa Malayang Pagbasa", {
      min: 30,
      max: 30000,
    });
    const instructional = validate.text(
      content.instructional,
      "teksto para sa May Gabay na Pagbasa",
      { min: 30, max: 30000 },
    );
    const frustration = validate.text(
      content.frustration,
      "teksto para sa Nahihirapang Pagbasa",
      { min: 30, max: 30000 },
    );
    const vocabulary = cleanVocabulary(req.body?.vocabulary);
    const published = req.body?.published ? 1 : 0;
    const now = nowIso();
    const slug = uniqueSlug(db, title);

    const result = db
      .prepare(
        `INSERT INTO lessons (
           slug, title, unit, description, difficulty, estimated_minutes, xp,
           content_independent, content_instructional, content_frustration,
           vocabulary_json, published, class_id, created_by, created_at, updated_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        slug,
        title,
        unit,
        description,
        difficulty,
        estimatedMinutes,
        xp,
        independent,
        instructional,
        frustration,
        JSON.stringify(vocabulary),
        published,
        cls.id,
        req.user.id,
        now,
        now,
      );
    const row = db.prepare("SELECT * FROM lessons WHERE id = ?").get(result.lastInsertRowid);
    res.status(201).json({ lesson: lessonPayload(db, row, req.user.id) });
  } catch (error) {
    next(error);
  }
});

teacherRouter.patch("/lessons/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const lessonId = validate.id(req.params.id, "aralin");
    const row = db
      .prepare("SELECT * FROM lessons WHERE id = ? AND created_by = ?")
      .get(lessonId, req.user.id);
    if (!row) throw errors.notFound("Hindi mahanap ang aralin na maaari mong i-edit.");

    const title = req.body?.title !== undefined
      ? validate.text(req.body.title, "pamagat", { min: 3, max: 160 })
      : row.title;
    const unit = req.body?.unit !== undefined
      ? validate.text(req.body.unit, "yunit", { min: 3, max: 120 })
      : row.unit;
    const description = req.body?.description !== undefined
      ? validate.text(req.body.description, "paglalarawan", { min: 10, max: 600 })
      : row.description;
    const difficulty = ["madali", "katamtaman", "mahirap"].includes(req.body?.difficulty)
      ? req.body.difficulty
      : row.difficulty;
    const estimatedMinutes = req.body?.estimatedMinutes !== undefined
      ? validate.integer(req.body.estimatedMinutes, "tagal ng pagbasa", { min: 1, max: 180 })
      : row.estimated_minutes;
    const xp = req.body?.xp !== undefined
      ? validate.integer(req.body.xp, "XP", { min: 0, max: 200 })
      : row.xp;
    const content = req.body?.contents ?? {};
    const independent = content.independent !== undefined
      ? validate.text(content.independent, "teksto para sa Malayang Pagbasa", { min: 30, max: 30000 })
      : row.content_independent;
    const instructional = content.instructional !== undefined
      ? validate.text(content.instructional, "teksto para sa May Gabay na Pagbasa", { min: 30, max: 30000 })
      : row.content_instructional;
    const frustration = content.frustration !== undefined
      ? validate.text(content.frustration, "teksto para sa Nahihirapang Pagbasa", { min: 30, max: 30000 })
      : row.content_frustration;
    const vocabulary = req.body?.vocabulary !== undefined
      ? cleanVocabulary(req.body.vocabulary)
      : JSON.parse(row.vocabulary_json || "[]");
    const published = req.body?.published !== undefined
      ? req.body.published ? 1 : 0
      : row.published;

    db.prepare(
      `UPDATE lessons SET
         title = ?, unit = ?, description = ?, difficulty = ?, estimated_minutes = ?,
         xp = ?, content_independent = ?, content_instructional = ?, content_frustration = ?,
         vocabulary_json = ?, published = ?, updated_at = ?
       WHERE id = ?`,
    ).run(
      title,
      unit,
      description,
      difficulty,
      estimatedMinutes,
      xp,
      independent,
      instructional,
      frustration,
      JSON.stringify(vocabulary),
      published,
      nowIso(),
      lessonId,
    );
    const updated = db.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
    res.json({ lesson: lessonPayload(db, updated, req.user.id) });
  } catch (error) {
    next(error);
  }
});

teacherRouter.delete("/lessons/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const lessonId = validate.id(req.params.id, "aralin");
    const row = db
      .prepare("SELECT id FROM lessons WHERE id = ? AND created_by = ?")
      .get(lessonId, req.user.id);
    if (!row) throw errors.notFound("Hindi mahanap ang aralin.");
    const progress = db
      .prepare("SELECT COUNT(*) AS count FROM lesson_progress WHERE lesson_id = ?")
      .get(lessonId);
    if (Number(progress.count) > 0) {
      throw errors.conflict(
        "May mag-aaral nang nagbukas ng araling ito. I-unpublish na lang ito upang hindi mawala ang rekord.",
      );
    }
    db.prepare("DELETE FROM lessons WHERE id = ?").run(lessonId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

function cleanQuestions(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 50) {
    throw errors.validation("Maglagay ng 1–50 tanong.");
  }
  return value.map((question, index) => {
    const prompt = validate.text(question?.prompt, `tanong ${index + 1}`, {
      min: 5,
      max: 1000,
    });
    if (!Array.isArray(question?.options) || question.options.length < 2 || question.options.length > 4) {
      throw errors.validation(`Kailangan ng 2–4 na pagpipilian sa tanong ${index + 1}.`);
    }
    const options = question.options.map((option, optionIndex) =>
      validate.text(option, `pagpipilian ${optionIndex + 1}`, { min: 1, max: 300 }),
    );
    const correctIndex = Number(question?.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw errors.validation(`Pumili ng tamang sagot sa tanong ${index + 1}.`);
    }
    return {
      prompt,
      options,
      correctIndex,
      explanation: validate.text(question?.explanation ?? "", "paliwanag", {
        min: 0,
        max: 1000,
      }),
    };
  });
}

function activityListPayload(db, row) {
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
    attempts: Number(row.attempt_count),
    published: Boolean(row.published),
    isClassContent: Boolean(row.class_id),
    editable: Boolean(row.editable),
    updatedAt: row.updated_at,
  };
}

teacherRouter.get("/activities", (req, res, next) => {
  try {
    const db = getDatabase();
    const cls = teacherClass(db, req.user.id);
    const kind = req.query.kind === "quiz" ? "quiz" : req.query.kind === "activity" ? "activity" : null;
    if (!kind) throw errors.validation("Ilagay ang uri: activity o quiz.");
    const rows = db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count,
                (SELECT COUNT(*) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed') AS attempt_count,
                a.created_by = ? AS editable
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id
         WHERE a.kind = ? AND (a.created_by = ? OR a.class_id IS NULL)
         ORDER BY a.class_id IS NOT NULL DESC, a.id`,
      )
      .all(req.user.id, kind, req.user.id);
    res.json({ activities: rows.map((row) => activityListPayload(db, row)) });
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/activities/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const activityId = validate.id(req.params.id, "aktibidad");
    const row = db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count,
                (SELECT COUNT(*) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed') AS attempt_count,
                a.created_by = ? AS editable
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id
         WHERE a.id = ?`,
      )
      .get(req.user.id, activityId);
    if (!row) throw errors.notFound("Hindi mahanap ang aktibidad.");
    if (!row.editable && row.class_id !== null) {
      throw errors.forbidden("Hindi mo pagmamay-ari ang aktibidad na ito.");
    }
    const questions = db
      .prepare(
        "SELECT id, position, prompt, options_json, correct_index, explanation FROM questions WHERE activity_id = ? ORDER BY position, id",
      )
      .all(activityId)
      .map((question) => ({
        id: Number(question.id),
        prompt: question.prompt,
        options: JSON.parse(question.options_json || "[]"),
        correctIndex: Number(question.correct_index),
        explanation: question.explanation,
      }));
    res.json({
      activity: { ...activityListPayload(db, row), questions },
    });
  } catch (error) {
    next(error);
  }
});

function activityFields(body) {
  const kind = body?.kind === "quiz" ? "quiz" : body?.kind === "activity" ? "activity" : null;
  if (!kind) throw errors.validation("Pumili kung aktibidad o pagsusulit.");
  const title = validate.text(body?.title, "pamagat", { min: 3, max: 160 });
  const description = validate.text(body?.description, "paglalarawan", { min: 10, max: 800 });
  const xp = validate.integer(body?.xp ?? 25, "XP", { min: 0, max: 300 });
  const passPercent = validate.integer(body?.passPercent ?? 60, "passing score", {
    min: 10,
    max: 100,
  });
  const timerSeconds =
    body?.timerSeconds === null || body?.timerSeconds === "" || body?.timerSeconds === undefined
      ? null
      : validate.integer(body.timerSeconds, "timer", { min: 30, max: 7200 });
  const lessonId =
    body?.lessonId === null || body?.lessonId === "" || body?.lessonId === undefined
      ? null
      : validate.id(body.lessonId, "aralin");
  const published = body?.published ? 1 : 0;
  return { kind, title, description, xp, passPercent, timerSeconds, lessonId, published };
}

teacherRouter.post("/activities", (req, res, next) => {
  try {
    const db = getDatabase();
    const cls = teacherClass(db, req.user.id);
    const fields = activityFields(req.body);
    if (fields.lessonId) {
      const lesson = db
        .prepare(
          "SELECT id FROM lessons WHERE id = ? AND (class_id IS NULL OR class_id = ?)",
        )
        .get(fields.lessonId, cls.id);
      if (!lesson) throw errors.validation("Hindi mahanap ang kaugnay na aralin.");
    }
    const questions = cleanQuestions(req.body?.questions);
    const now = nowIso();

    const createdId = transaction((tx) => {
      const result = tx
        .prepare(
          `INSERT INTO activities
             (title, description, kind, lesson_id, xp, pass_percent, timer_seconds,
              published, class_id, created_by, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          fields.title,
          fields.description,
          fields.kind,
          fields.lessonId,
          fields.xp,
          fields.passPercent,
          fields.timerSeconds,
          fields.published,
          cls.id,
          req.user.id,
          now,
          now,
        );
      const activityId = Number(result.lastInsertRowid);
      const insertQuestion = tx.prepare(
        `INSERT INTO questions (activity_id, position, prompt, options_json, correct_index, explanation)
         VALUES (?, ?, ?, ?, ?, ?)`,
      );
      questions.forEach((question, index) => {
        insertQuestion.run(
          activityId,
          index + 1,
          question.prompt,
          JSON.stringify(question.options),
          question.correctIndex,
          question.explanation,
        );
      });
      return activityId;
    });

    const row = db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count,
                0 AS attempt_count, 1 AS editable
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id WHERE a.id = ?`,
      )
      .get(createdId);
    res.status(201).json({ activity: activityListPayload(db, row) });
  } catch (error) {
    next(error);
  }
});

teacherRouter.patch("/activities/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const activityId = validate.id(req.params.id, "aktibidad");
    const row = db
      .prepare("SELECT * FROM activities WHERE id = ? AND created_by = ?")
      .get(activityId, req.user.id);
    if (!row) throw errors.notFound("Hindi mahanap ang aktibidad na maaari mong i-edit.");
    const completed = Number(
      db
        .prepare(
          "SELECT COUNT(*) AS count FROM attempts WHERE activity_id = ? AND status = 'completed'",
        )
        .get(activityId).count,
    );

    const merged = {
      ...row,
      title: req.body?.title ?? row.title,
      description: req.body?.description ?? row.description,
      kind: req.body?.kind ?? row.kind,
      lessonId: req.body?.lessonId === undefined ? row.lesson_id : req.body.lessonId,
      xp: req.body?.xp ?? row.xp,
      passPercent: req.body?.passPercent ?? row.pass_percent,
      timerSeconds:
        req.body?.timerSeconds === undefined ? row.timer_seconds : req.body.timerSeconds,
      published: req.body?.published === undefined ? Boolean(row.published) : req.body.published,
    };
    const fields = activityFields(merged);

    if (fields.lessonId) {
      const cls = teacherClass(db, req.user.id);
      const lesson = db
        .prepare("SELECT id FROM lessons WHERE id = ? AND (class_id IS NULL OR class_id = ?)")
        .get(fields.lessonId, cls.id);
      if (!lesson) throw errors.validation("Hindi mahanap ang kaugnay na aralin.");
    }

    const questions = req.body?.questions !== undefined ? cleanQuestions(req.body.questions) : null;
    if (questions && completed > 0) {
      throw errors.conflict(
        "May mga naisumite nang sagot sa pagsusulit na ito. Hindi na mababago ang mga tanong; maaari mong i-edit ang pamagat o i-unpublish.",
      );
    }

    transaction((tx) => {
      tx.prepare(
        `UPDATE activities SET
           title = ?, description = ?, kind = ?, lesson_id = ?, xp = ?, pass_percent = ?,
           timer_seconds = ?, published = ?, updated_at = ?
         WHERE id = ?`,
      ).run(
        fields.title,
        fields.description,
        fields.kind,
        fields.lessonId,
        fields.xp,
        fields.passPercent,
        fields.timerSeconds,
        fields.published,
        nowIso(),
        activityId,
      );

      if (questions) {
        tx.prepare("DELETE FROM questions WHERE activity_id = ?").run(activityId);
        const insertQuestion = tx.prepare(
          `INSERT INTO questions (activity_id, position, prompt, options_json, correct_index, explanation)
           VALUES (?, ?, ?, ?, ?, ?)`,
        );
        questions.forEach((question, index) => {
          insertQuestion.run(
            activityId,
            index + 1,
            question.prompt,
            JSON.stringify(question.options),
            question.correctIndex,
            question.explanation,
          );
        });
      }
    });

    const updated = db
      .prepare(
        `SELECT a.*, l.title AS lesson_title,
                (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count,
                (SELECT COUNT(*) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed') AS attempt_count,
                1 AS editable
         FROM activities a LEFT JOIN lessons l ON l.id = a.lesson_id WHERE a.id = ?`,
      )
      .get(activityId);
    res.json({ activity: activityListPayload(db, updated) });
  } catch (error) {
    next(error);
  }
});

teacherRouter.delete("/activities/:id", (req, res, next) => {
  try {
    const db = getDatabase();
    const activityId = validate.id(req.params.id, "aktibidad");
    const row = db
      .prepare("SELECT id FROM activities WHERE id = ? AND created_by = ?")
      .get(activityId, req.user.id);
    if (!row) throw errors.notFound("Hindi mahanap ang aktibidad.");
    const attempts = Number(
      db
        .prepare("SELECT COUNT(*) AS count FROM attempts WHERE activity_id = ?")
        .get(activityId).count,
    );
    if (attempts > 0) {
      throw errors.conflict(
        "May mga pagtatangka na ang aktibidad na ito. I-unpublish na lang ito upang mapanatili ang rekord ng mag-aaral.",
      );
    }
    db.prepare("DELETE FROM activities WHERE id = ?").run(activityId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

teacherRouter.get("/reports", (req, res) => {
  const db = getDatabase();
  const cls = teacherClass(db, req.user.id);
  const students = classStudents(db, cls.id).map((student) =>
    studentSnapshot(db, student),
  );
  const assessments = db
    .prepare(
      `SELECT a.id, a.title, a.kind, a.pass_percent,
              (SELECT COUNT(*) FROM questions q WHERE q.activity_id = a.id) AS question_count,
              (SELECT COUNT(*) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed') AS attempt_count,
              (SELECT COUNT(*) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed' AND at.score * 100.0 / at.total >= a.pass_percent) AS pass_count,
              (SELECT AVG(at.score * 100.0 / at.total) FROM attempts at WHERE at.activity_id = a.id AND at.status = 'completed') AS average
       FROM activities a
       WHERE a.published = 1 AND (a.class_id IS NULL OR a.class_id = ?)
       ORDER BY a.kind, a.id`,
    )
    .all(cls.id)
    .map((row) => ({
      id: Number(row.id),
      title: row.title,
      kind: row.kind,
      questionCount: Number(row.question_count),
      attempts: Number(row.attempt_count),
      passRate: percent(row.pass_count, row.attempt_count),
      average: row.average ? Math.round(Number(row.average)) : 0,
    }));

  const totalAttempts = students.reduce((sum, student) => sum + student.attempts, 0);
  const totalPoints = students.reduce((sum, student) => sum + student.points, 0);
  res.json({
    class: { id: Number(cls.id), name: cls.name, joinCode: cls.join_code },
    summary: {
      students: students.length,
      totalAttempts,
      averageScore:
        totalAttempts > 0
          ? Math.round(
              students.reduce(
                (sum, student) => sum + student.averageScore * student.attempts,
                0,
              ) / totalAttempts,
            )
          : 0,
      averagePoints:
        students.length > 0 ? Math.round(totalPoints / students.length) : 0,
    },
    students,
    assessments,
  });
});

teacherRouter.post("/class/rotate-code", (req, res) => {
  const code = rotateJoinCode(req.user.id);
  if (!code) throw errors.conflict("Hindi magawa ang bagong kodigo. Subukan muli.");
  res.json({ joinCode: code });
});
