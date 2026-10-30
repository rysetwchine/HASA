/**
 * HASA API — integration tests.
 *
 * Ang mga pagsubok na ito ay tumatakbo laban sa tunay na Express app at sa
 * `node:sqlite` na `:memory:` database, kaya walang totoong file na
 * nagagalaw at walang natitirang test data sa `server/data/`.
 *
 * Run: cd server && npm test
 */
process.env.NODE_ENV = "test";
process.env.DATABASE_PATH = ":memory:";
process.env.SESSION_SECRET = "test-session-secret-value-32-chars-min";
process.env.TEACHER_SIGNUP_CODE = "HASA-TEST-SIGNUP";

import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

const { createApp } = await import("../src/app.js");
const { getDatabase, closeDatabase } = await import("../src/db/database.js");
const { seedCurriculum } = await import("../src/db/seedContent.js");
const { hashSessionToken } = await import("../src/utils/security.js");

let server;
let baseUrl;

before(async () => {
  const app = createApp();
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server?.close();
  closeDatabase();
});

/** Simpleng fetch na nagbabalik ng status, JSON, at cookie. */
async function call(method, path, { body, cookie } = {}) {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (cookie) headers.cookie = cookie;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const setCookie = response.headers.getSetCookie?.() ?? [];
  const sessionCookie = setCookie
    .map((entry) => entry.split(";")[0])
    .find((entry) => entry.startsWith("hasa_session="));

  const text = await response.text();
  let json = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }
  }

  return { status: response.status, json, cookie: sessionCookie, setCookie };
}

async function registerTeacher(suffix) {
  return call("POST", "/api/auth/register/teacher", {
    body: {
      schoolCode: "HASA-TEST-SIGNUP",
      username: `guro_${suffix}`,
      password: "MatibayNaPassword1",
      displayName: `Guro ${suffix}`,
      className: `Grade 8 - ${suffix}`,
    },
  });
}

async function registerStudent(suffix, classCode, readingLevel = "instructional") {
  return call("POST", "/api/auth/register/student", {
    body: {
      username: `mag_aaral_${suffix}`,
      password: "MatibayNaPassword1",
      displayName: `Mag-aaral ${suffix}`,
      classCode,
      readingLevel,
    },
  });
}

describe("kalusugan ng API", () => {
  it("sumasagot ang /api/health", async () => {
    const response = await call("GET", "/api/health");
    assert.equal(response.status, 200);
    assert.equal(response.json.status, "ok");
  });

  it("ipinapakita ng /api/config ang baitang at kakayahan ng AI", async () => {
    const response = await call("GET", "/api/config");
    assert.equal(response.status, 200);
    assert.equal(response.json.gradeLevel, 8);
    assert.equal(response.json.subject, "Araling Panlipunan");
    assert.equal(response.json.teacherRegistrationEnabled, true);
    assert.equal(typeof response.json.ai.enabled, "boolean");
    assert.equal(response.json.ai.defaultProvider, null);
  });
});

describe("pagpaparehistro at session", () => {
  it("tinatanggihan ang guro kapag mali ang kodigo ng paaralan", async () => {
    const response = await call("POST", "/api/auth/register/teacher", {
      body: {
        schoolCode: "MALING-CODE",
        username: "guro_mali",
        password: "MatibayNaPassword1",
        displayName: "Guro Mali",
        className: "Grade 8 - Mali",
      },
    });
    assert.equal(response.status, 403);
  });

  it("gumagawa ng guro, klase, at session cookie", async () => {
    const response = await registerTeacher("isa");
    assert.equal(response.status, 201);
    assert.equal(response.json.user.role, "teacher");
    assert.match(response.json.user.class.joinCode, /^HASA-[A-Z0-9]{6}$/);
    assert.ok(response.cookie, "dapat may httpOnly session cookie");
    const raw = response.setCookie.join(";");
    assert.match(raw, /HttpOnly/i);
  });

  it("tumatagal ang session cookie nang ayon sa SESSION_DAYS", async () => {
    // Express ay millisecond ang inaasahan sa `maxAge`; noong nakaraan,
    // segundo ang ipinapasa kaya 20 minuto lang ang bisa ng cookie.
    const response = await registerTeacher("bisa");
    const raw = response.setCookie.join(";");
    const match = raw.match(/Max-Age=(\d+)/i);
    assert.ok(match, "dapat may Max-Age ang session cookie");
    const seconds = Number(match[1]);
    assert.ok(
      seconds >= 24 * 60 * 60,
      `masyadong maikli ang bisa ng cookie: ${seconds}s`,
    );
  });

  it("tinatanggihan ang maling kodigo ng klase", async () => {
    const teacher = await registerTeacher("dalawa");
    const response = await registerStudent("mali", "HASA-WRONG1");
    assert.equal(response.status, 400);
    assert.equal(teacher.status, 201);
  });

  it("gumagawa ng mag-aaral sa tamang kodigo", async () => {
    const teacher = await registerTeacher("tatlo");
    const response = await registerStudent("isa", teacher.json.user.class.joinCode);
    assert.equal(response.status, 201);
    assert.equal(response.json.user.role, "student");
    assert.equal(response.json.user.readingLevel, "instructional");
    assert.equal(response.json.stats.points, 0);
  });

  it("nagbabalik ng kasalukuyang user sa /api/auth/me", async () => {
    const teacher = await registerTeacher("apat");
    const me = await call("GET", "/api/auth/me", { cookie: teacher.cookie });
    assert.equal(me.status, 200);
    assert.equal(me.json.user.username, "guro_apat");
  });

  it("hindi tinatanggap ang walang session", async () => {
    const response = await call("GET", "/api/auth/me");
    assert.equal(response.status, 401);
  });

  it("binabalewala ang pekeng session token", async () => {
    const response = await call("GET", "/api/auth/me", {
      cookie: "hasa_session=hindi-tunay-na-token",
    });
    assert.equal(response.status, 401);
  });

  it("inireseta ang session pagkatapos ng logout", async () => {
    const teacher = await registerTeacher("lima");
    const logout = await call("POST", "/api/auth/logout", { cookie: teacher.cookie });
    assert.equal(logout.status, 204);
    const me = await call("GET", "/api/auth/me", { cookie: teacher.cookie });
    assert.equal(me.status, 401);
  });

  it("naiiba ang hash ng session token kapag alam ang secret", async () => {
    // Ang token_hash sa database ay HMAC, hindi plain sha256 ng token.
    const db = getDatabase();
    const row = db.prepare("SELECT token_hash FROM sessions LIMIT 1").get();
    assert.ok(row?.token_hash);
    assert.match(row.token_hash, /^[a-f0-9]{64}$/);
    assert.notEqual(hashSessionToken("token"), row.token_hash);
  });
});

describe("paghihiwalay ng tungkulin", () => {
  it("hindi makapasok ang mag-aaral sa /api/teacher", async () => {
    const teacher = await registerTeacher("anim");
    const student = await registerStudent("dalawa", teacher.json.user.class.joinCode);
    const response = await call("GET", "/api/teacher/dashboard", {
      cookie: student.cookie,
    });
    assert.equal(response.status, 403);
  });

  it("hindi makapasok ang guro sa /api/student", async () => {
    const teacher = await registerTeacher("pito");
    const response = await call("GET", "/api/student/dashboard", {
      cookie: teacher.cookie,
    });
    assert.equal(response.status, 403);
  });

  it("404 sa mag-aaral ng ibang klase", async () => {
    const teacherA = await registerTeacher("walo");
    const studentA = await registerStudent("tatlo", teacherA.json.user.class.joinCode);
    const teacherB = await registerTeacher("siyam");

    const cross = await call(
      `GET`,
      `/api/teacher/students/${studentA.json.user.id}`,
      { cookie: teacherB.cookie },
    );
    assert.equal(cross.status, 404);

    const own = await call(
      `GET`,
      `/api/teacher/students/${studentA.json.user.id}`,
      { cookie: teacherA.cookie },
    );
    assert.equal(own.status, 200);
    assert.equal(own.json.student.username, "mag_aaral_tatlo");
  });
});

describe("nilalaman at antas ng pagbasa", () => {
  it("nagbabalik ng mga aralin na may tatlong antas", async () => {
    const teacher = await registerTeacher("sampu");
    const student = await registerStudent("apat", teacher.json.user.class.joinCode);

    const list = await call("GET", "/api/student/lessons", { cookie: student.cookie });
    assert.equal(list.status, 200);
    assert.ok(list.json.lessons.length >= 6, "dapat may seed na mga aralin");

    const lessonId = list.json.lessons[0].id;
    const detail = await call(`GET`, `/api/student/lessons/${lessonId}`, {
      cookie: student.cookie,
    });
    assert.equal(detail.status, 200);
    const { contents } = detail.json.lesson;
    assert.ok(contents.independent && contents.instructional && contents.frustration);
  });

  it("pinakamayaman ang teksto para sa Malayang Pagbasa", async () => {
    // Ang independent na teksto ay para sa mag-aaral na kaya nang bumasa
    // nang mag-isa, kaya mas mahaba ito kaysa sa instructional at frustration.
    const db = getDatabase();
    const rows = db
      .prepare("SELECT slug, content_independent, content_instructional, content_frustration FROM lessons")
      .all();
    assert.ok(rows.length > 0);

    const avgSentence = (text) => {
      const sentences = text.split(/[.!?]\s+/).filter(Boolean);
      const words = text.split(/\s+/).filter(Boolean);
      return words.length / Math.max(1, sentences.length);
    };

    for (const row of rows) {
      const independent = avgSentence(row.content_independent);
      const instructional = avgSentence(row.content_instructional);
      const frustration = avgSentence(row.content_frustration);
      assert.ok(
        independent > instructional && instructional > frustration,
        `mali ang pagkakasunod-sunod ng antas sa ${row.slug}: ` +
          `${independent.toFixed(1)} / ${instructional.toFixed(1)} / ${frustration.toFixed(1)}`,
      );
    }
  });
});

describe("pagsusulit, iskor, at XP", () => {
  it("hindi ibinubunyag ang tamang sagot sa pagsisimula", async () => {
    const teacher = await registerTeacher("labing-isa");
    const student = await registerStudent("lima", teacher.json.user.class.joinCode);

    const activities = await call("GET", "/api/student/activities?kind=quiz", {
      cookie: student.cookie,
    });
    assert.equal(activities.status, 200);
    const quiz = activities.json.activities.find((item) => item.kind === "quiz");
    assert.ok(quiz, "dapat may seed na pagsusulit");

    const started = await call(`POST`, `/api/student/activities/${quiz.id}/start`, {
      cookie: student.cookie,
    });
    assert.equal(started.status, 201);
    assert.ok(started.json.questions.length > 0);
    for (const question of started.json.questions) {
      assert.equal(question.correctIndex, undefined);
    }
  });

  it("nagbibigay ng XP isang beses lamang sa unang pagpasa", async () => {
    const teacher = await registerTeacher("labindalawa");
    const student = await registerStudent("anim", teacher.json.user.class.joinCode);
    const db = getDatabase();

    const activities = await call("GET", "/api/student/activities?kind=quiz", {
      cookie: student.cookie,
    });
    const quiz = activities.json.activities.find((item) => item.kind === "quiz");

    async function playAll(correct) {
      const started = await call(`POST`, `/api/student/activities/${quiz.id}/start`, {
        cookie: student.cookie,
      });
      const answers = started.json.questions.map((question) => {
        const row = db
          .prepare("SELECT correct_index FROM questions WHERE id = ?")
          .get(question.id);
        const correctIndex = Number(row.correct_index);
        return {
          questionId: question.id,
          selectedIndex: correct ? correctIndex : (correctIndex + 1) % question.options.length,
        };
      });
      return call(`POST`, `/api/student/attempts/${started.json.attemptId}/submit`, {
        cookie: student.cookie,
        body: { answers },
      });
    }

    const failed = await playAll(false);
    assert.equal(failed.status, 200);
    assert.equal(failed.json.attempt.passed, false);
    assert.equal(failed.json.attempt.xpAwarded, 0);

    const passed = await playAll(true);
    assert.equal(passed.status, 200);
    assert.equal(passed.json.attempt.passed, true);
    assert.ok(passed.json.attempt.xpAwarded > 0, "dapat may XP sa unang pagpasa");

    const replay = await playAll(true);
    assert.equal(replay.json.attempt.xpAwarded, 0, "walang dobleng XP sa pag-ulit");

    const me = await call("GET", "/api/auth/me", { cookie: student.cookie });
    assert.ok(me.json.stats.points >= passed.json.attempt.xpAwarded);
  });

  it("hindi maaaring i-submit nang dalawang beses ang isang pagtatangka", async () => {
    const teacher = await registerTeacher("labintatlo");
    const student = await registerStudent("pito", teacher.json.user.class.joinCode);

    const activities = await call("GET", "/api/student/activities?kind=quiz", {
      cookie: student.cookie,
    });
    const quiz = activities.json.activities.find((item) => item.kind === "quiz");
    const started = await call(`POST`, `/api/student/activities/${quiz.id}/start`, {
      cookie: student.cookie,
    });

    const first = await call(
      `POST`,
      `/api/student/attempts/${started.json.attemptId}/submit`,
      { cookie: student.cookie, body: { answers: [] } },
    );
    assert.equal(first.status, 200);

    const second = await call(
      `POST`,
      `/api/student/attempts/${started.json.attemptId}/submit`,
      { cookie: student.cookie, body: { answers: [] } },
    );
    assert.equal(second.status, 409);
  });

  it("hindi mabubuksan ang pagtatangka ng ibang mag-aaral", async () => {
    const teacher = await registerTeacher("labing-apat");
    const studentA = await registerStudent("walo", teacher.json.user.class.joinCode);
    const studentB = await registerStudent("siyam", teacher.json.user.class.joinCode);

    const activities = await call("GET", "/api/student/activities?kind=quiz", {
      cookie: studentA.cookie,
    });
    const quiz = activities.json.activities.find((item) => item.kind === "quiz");
    const started = await call(`POST`, `/api/student/activities/${quiz.id}/start`, {
      cookie: studentA.cookie,
    });

    const stolen = await call(
      `POST`,
      `/api/student/attempts/${started.json.attemptId}/submit`,
      { cookie: studentB.cookie, body: { answers: [] } },
    );
    assert.equal(stolen.status, 404);
  });
});

describe("idempotent na seeding", () => {
  it("hindi nagdodoble at hindi binabago ang mga id", async () => {
    const db = getDatabase();
    const before = db.prepare("SELECT id, slug FROM lessons ORDER BY id").all();
    const activityCountBefore = db
      .prepare("SELECT COUNT(*) AS count FROM activities WHERE class_id IS NULL")
      .get().count;

    seedCurriculum(db);

    const afterRows = db.prepare("SELECT id, slug FROM lessons ORDER BY id").all();
    const activityCountAfter = db
      .prepare("SELECT COUNT(*) AS count FROM activities WHERE class_id IS NULL")
      .get().count;

    assert.deepEqual(
      afterRows.map((row) => [row.id, row.slug]),
      before.map((row) => [row.id, row.slug]),
      "dapat hindi mabago ang mga lesson id o madagdagan ang mga aralin",
    );
    assert.equal(Number(activityCountAfter), Number(activityCountBefore));
  });

  it("ibinabalik ang tamang teksto kapag nabago ito", async () => {
    const db = getDatabase();
    db.prepare(
      "UPDATE lessons SET content_independent = 'sira' WHERE slug = 'heograpiya-at-simula-ng-sibilisasyon'",
    ).run();

    seedCurriculum(db);

    const row = db
      .prepare("SELECT content_independent FROM lessons WHERE slug = 'heograpiya-at-simula-ng-sibilisasyon'")
      .get();
    assert.ok(row.content_independent.length > 300, "dapat naibalik ang orihinal na teksto");
  });

  it("tama ang sagot sa 'Alin ang huling nangyari?' ng Guhit ng Panahon", async () => {
    const db = getDatabase();
    const activity = db
      .prepare("SELECT id FROM activities WHERE title = 'Guhit ng Panahon' AND class_id IS NULL")
      .get();
    assert.ok(activity, "dapat may seed na aktibidad na Guhit ng Panahon");

    const question = db
      .prepare("SELECT options_json, correct_index FROM questions WHERE activity_id = ? AND prompt = ?")
      .get(activity.id, "Alin ang huling nangyari?");
    assert.ok(question);

    const options = JSON.parse(question.options_json);
    assert.equal(
      options[Number(question.correct_index)],
      "Pagdeklara ng kalayaan sa Kawit",
      "1898 ang pinakahuling pangyayari sa mga opsyon",
    );
  });

  it("hindi ginagalaw ang nilalamang ginawa ng guro", async () => {
    const db = getDatabase();
    const teacher = await registerTeacher("labinlima");
    const classId = db
      .prepare("SELECT id FROM classes WHERE join_code = ?")
      .get(teacher.json.user.class.joinCode).id;

    db.prepare(
      `INSERT INTO lessons (
        slug, title, unit, description, difficulty, estimated_minutes, xp,
        content_independent, content_instructional, content_frustration,
        vocabulary_json, published, class_id, created_by, created_at, updated_at
      ) VALUES ('aralin-ng-guro', 'Aralin ng Guro', 'Yunit 1', 'Sariling aralin',
        'madali', 5, 10, 'a', 'b', 'c', '[]', 1, ?, ?, '2026-01-01', '2026-01-01')`,
    ).run(classId, teacher.json.user.id);

    seedCurriculum(db);

    const row = db
      .prepare("SELECT title, content_independent FROM lessons WHERE slug = 'aralin-ng-guro'")
      .get();
    assert.equal(row.title, "Aralin ng Guro");
    assert.equal(row.content_independent, "a");
  });
});
