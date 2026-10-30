#!/usr/bin/env node
/**
 * HASA — end-to-end smoke test laban sa TUMATAKBONG API.
 *
 * Gumagawa ito ng tunay na guro, klase, mag-aaral, aralin, at pagsusulit sa
 * database na naka-point sa server, sinusuri ang bawat mahalagang daloy, at
 * naglilista ng pumasa at bigo.
 *
 * HUWAG patakbuhin laban sa production na may tunay na rekord ng mag-aaral:
 * nagdaragdag ito ng data.
 *
 *   HASA_API=http://127.0.0.1:3100 \
 *   HASA_TEACHER_CODE=HASA-E2E \
 *   node server/scripts/smoke.mjs
 */
const API = (process.env.HASA_API || "http://127.0.0.1:3100").replace(/\/$/, "");
const TEACHER_CODE = process.env.HASA_TEACHER_CODE || "";
const PASSWORD = "MatibayNaPassword1";

const passed = [];
const failed = [];

function check(name, condition, detail) {
  if (condition) {
    passed.push(name);
    console.log(`  PASS  ${name}`);
  } else {
    failed.push(name);
    console.log(`  FAIL  ${name}${detail === undefined ? "" : `  → ${JSON.stringify(detail)}`}`);
  }
}

function section(title) {
  console.log(`\n${title}`);
}

/** Simpleng session client: hawak ang Set-Cookie ng isang user. */
function client() {
  let cookie = "";
  return {
    get cookie() {
      return cookie;
    },
    async call(method, path, body) {
      const response = await fetch(API + path, {
        method,
        headers: {
          ...(body === undefined ? {} : { "content-type": "application/json" }),
          ...(cookie ? { cookie } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      const setCookie = (response.headers.getSetCookie?.() ?? [])
        .map((entry) => entry.split(";")[0])
        .find((entry) => entry.startsWith("hasa_session="));
      if (setCookie) cookie = setCookie;
      const text = await response.text();
      return { status: response.status, json: text ? JSON.parse(text) : null };
    },
  };
}

const tag = Date.now().toString(36).slice(-6);
const teacher = client();
const student = client();

if (!TEACHER_CODE) {
  console.error("Kailangan ang HASA_TEACHER_CODE (ang TEACHER_SIGNUP_CODE ng server).");
  process.exit(2);
}

const health = await fetch(`${API}/api/health`).catch(() => null);
if (!health?.ok) {
  console.error(`Walang API sa ${API}. Simulan muna ang server.`);
  process.exit(2);
}

section("1. Guro: rehistro at klase");
const teacherReg = await teacher.call("POST", "/api/auth/register/teacher", {
  schoolCode: TEACHER_CODE,
  username: `guro_smoke_${tag}`,
  password: PASSWORD,
  displayName: "Guro Smoke",
  className: "Grade 8 - Smoke",
});
check("nakagawa ng account ng guro", teacherReg.status === 201, teacherReg.status);
const classCode = teacherReg.json?.user?.class?.joinCode;
check("may kodigo ng klase", Boolean(classCode?.startsWith("HASA-")), classCode);

section("2. Guro: draft na aralin");
const lessonCreated = await teacher.call("POST", "/api/teacher/lessons", {
  title: `Smoke na Aralin ${tag}`,
  unit: "Yunit 9",
  description: "Pansamantalang aralin para sa smoke test.",
  difficulty: "katamtaman",
  estimatedMinutes: 10,
  xp: 12,
  contents: { independent: "A".repeat(120), instructional: "B".repeat(90), frustration: "C".repeat(60) },
  vocabulary: [],
  published: false,
});
check("nakagawa ng draft na aralin", [200, 201].includes(lessonCreated.status), lessonCreated.status);
const lessonId = lessonCreated.json?.lesson?.id;

section("3. Mag-aaral: rehistro at hindi nakikita ang draft");
const studentReg = await student.call("POST", "/api/auth/register/student", {
  username: `siri_smoke_${tag}`,
  password: PASSWORD,
  displayName: "Siri Smoke",
  classCode,
  readingLevel: "instructional",
});
check("nakagawa ng account ng mag-aaral", studentReg.status === 201, studentReg.status);

const draftList = await student.call("GET", "/api/student/lessons");
check(
  "hindi lumalabas ang draft sa mag-aaral",
  !(draftList.json?.lessons ?? []).some((lesson) => lesson.id === lessonId),
);

section("4. Guro: pag-publish");
const publish = await teacher.call("PATCH", `/api/teacher/lessons/${lessonId}`, { published: true });
check("na-publish ang aralin", publish.status === 200, publish.status);
const publishedList = await student.call("GET", "/api/student/lessons");
check(
  "lumalabas na ang aralin sa mag-aaral",
  (publishedList.json?.lessons ?? []).some((lesson) => lesson.id === lessonId),
);

section("5. Mag-aaral: pagbukas at pagkumpleto (XP isang beses)");
const start = await student.call("POST", `/api/student/lessons/${lessonId}/start`, {});
check("naitala ang pagbukas", start.status === 200 && start.json?.status === "in_progress", start.json);

const firstDone = await student.call("POST", `/api/student/lessons/${lessonId}/complete`, {});
check("may XP sa unang pagkumpleto", firstDone.json?.lessonXp === 12, firstDone.json?.lessonXp);
const secondDone = await student.call("POST", `/api/student/lessons/${lessonId}/complete`, {});
check(
  "walang dobleng XP",
  secondDone.json?.lessonXp === 0 &&
    secondDone.json?.stats?.points === firstDone.json?.stats?.points,
  { xp: secondDone.json?.lessonXp, points: secondDone.json?.stats?.points },
);

section("6. Guro: pagsusulit na may tanong");
const quizCreated = await teacher.call("POST", "/api/teacher/activities", {
  title: `Smoke na Pagsusulit ${tag}`,
  description: "Maikling pagsusulit para sa smoke test.",
  kind: "quiz",
  lessonId,
  xp: 20,
  passPercent: 50,
  timerSeconds: null,
  published: true,
  questions: [
    { prompt: "Ano ang 1+1?", options: ["1", "2", "3", "4"], correctIndex: 1, explanation: "Dahil 2." },
    {
      prompt: "Ano ang kabisera ng Pilipinas?",
      options: ["Cebu", "Davao", "Maynila", "Baguio"],
      correctIndex: 2,
      explanation: "Maynila.",
    },
  ],
});
check("nakagawa ng pagsusulit", [200, 201].includes(quizCreated.status), quizCreated.status);
const quizId = quizCreated.json?.activity?.id;

const quizStart = await student.call("POST", `/api/student/activities/${quizId}/start`, {});
check("nagsimula ang pagtatangka", [200, 201].includes(quizStart.status), quizStart.status);
const questions = quizStart.json?.questions ?? [];
check("dalawang tanong ang ibinalik", questions.length === 2, questions.length);
check("walang correctIndex sa payload", questions.every((q) => !("correctIndex" in q)));

const answers = questions.map((q, index) => ({ questionId: q.id, selectedIndex: index === 0 ? 1 : 2 }));
const submitted = await student.call(
  "POST",
  `/api/student/attempts/${quizStart.json?.attemptId}/submit`,
  { answers },
);
check(
  "pumasa sa pagsusulit",
  submitted.status === 200 && submitted.json?.attempt?.passed === true,
  submitted.json?.attempt,
);
const resubmit = await student.call(
  "POST",
  `/api/student/attempts/${quizStart.json?.attemptId}/submit`,
  { answers },
);
check("hindi matanggap ang dobleng submit", resubmit.status === 409, resubmit.status);

section("7. Guro: progreso ng mag-aaral");
const progress = await teacher.call("GET", "/api/teacher/progress");
const row = (progress.json?.students ?? []).find(
  (item) => item.username === `siri_smoke_${tag}`,
);
check("nakikita ang mag-aaral sa progreso", Boolean(row));
check("may natapos na aralin", (row?.lessonsCompleted ?? 0) >= 1, row?.lessonsCompleted);
check("may naipasang aktibidad", (row?.activitiesPassed ?? 0) >= 1, row?.activitiesPassed);
check("may porsyento ng pag-unlad", (row?.completionPercent ?? 0) > 0, row?.completionPercent);
check("may XP", (row?.points ?? 0) > 0, row?.points);

section("8. Guro: i-unpublish ang pagsusulit");
const unpublish = await teacher.call("PATCH", `/api/teacher/activities/${quizId}`, { published: false });
check("na-unpublish ang pagsusulit", unpublish.status === 200, unpublish.status);

section("9. Guro: bagong kodigo ng klase");
const rotated = await teacher.call("POST", "/api/teacher/class/rotate-code", {});
check("napalitan ang kodigo", rotated.status === 200 && rotated.json?.joinCode !== classCode);

section("10. Guro: i-reset ang password ng mag-aaral");
const reset = await teacher.call("POST", `/api/teacher/students/${studentReg.json?.user?.id}/reset-password`, {});
check("may pansamantalang password", reset.status === 200 && Boolean(reset.json?.temporaryPassword));
const relogin = await client().call("POST", "/api/auth/login", {
  username: `siri_smoke_${tag}`,
  password: reset.json?.temporaryPassword ?? "",
});
check("nakakalog-in gamit ang bagong password", relogin.status === 200, relogin.status);

section("11. Pag-logout");
const logout = await student.call("POST", "/api/auth/logout", {});
check("204 sa logout", logout.status === 204, logout.status);
const afterLogout = await student.call("GET", "/api/student/dashboard");
check("invalid na ang session", afterLogout.status === 401, afterLogout.status);

console.log(`\nRESULT: ${passed.length} passed, ${failed.length} failed`);
if (failed.length > 0) {
  console.log("FAILED:", failed.join(", "));
  process.exit(1);
}
