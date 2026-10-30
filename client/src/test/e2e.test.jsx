/**
 * End-to-end render test: bawat pahina ng mag-aaral at guro ay binubuksan
 * laban sa TUNAY na API (Express + node:sqlite) at sinusuri na:
 *
 *   1. walang crash at walang console.error,
 *   2. may lumalabas na tunay na nilalaman,
 *   3. hindi nakikita ng isang tungkulin ang pahina ng iba.
 *
 * Kailangang tumakbo ang API bago ang test na ito:
 *
 *   cd server
 *   DATABASE_PATH=/tmp/hasa-e2e/test.sqlite NODE_ENV=development \
 *     TEACHER_SIGNUP_CODE=HASA-E2E PORT=3100 node src/index.js
 *
 * Kung walang API sa localhost:3100, awtomatikong nilalaktawan ang buong
 * suite (hindi ito babagsak sa CI na walang server).
 */
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "../app/AuthProvider.jsx";
import AppRoutes from "../app/router.jsx";

const API_ORIGIN = process.env.HASA_E2E_API || "http://127.0.0.1:3100";
const SIGNUP_CODE = process.env.HASA_E2E_SIGNUP_CODE || "HASA-E2E";

const realFetch = globalThis.fetch;

/** Aktibong session cookie — pinapalitan ng bawat test. */
const session = { cookie: "" };

function installFetchShim() {
  globalThis.fetch = (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("/api")) {
      const headers = new Headers(init.headers || {});
      if (session.cookie) headers.set("cookie", session.cookie);
      return realFetch(API_ORIGIN + url, { ...init, headers });
    }
    return realFetch(input, init);
  };
}

async function api(method, path, body) {
  const response = await realFetch(API_ORIGIN + path, {
    method,
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  const cookie = (response.headers.getSetCookie?.() ?? [])
    .map((entry) => entry.split(";")[0])
    .find((entry) => entry.startsWith("hasa_session="));
  return { status: response.status, json, cookie };
}

let apiAvailable = false;
let studentCookie = "";
let teacherCookie = "";
let classCode = "";

beforeAll(async () => {
  try {
    const health = await realFetch(`${API_ORIGIN}/api/health`, {
      signal: AbortSignal.timeout(1500),
    });
    apiAvailable = health.ok;
  } catch {
    apiAvailable = false;
  }
  if (!apiAvailable) return;

  const suffix = Date.now().toString(36).slice(-5);

  const teacher = await api("POST", "/api/auth/register/teacher", {
    schoolCode: SIGNUP_CODE,
    username: `guro_e2e_${suffix}`,
    password: "MatibayNaPassword1",
    displayName: "Guro Reyes",
    className: "Grade 8 - Bonifacio",
  });
  if (teacher.status !== 201) throw new Error(`teacher register: ${teacher.status}`);
  teacherCookie = teacher.cookie;
  classCode = teacher.json.user.class.joinCode;

  const student = await api("POST", "/api/auth/register/student", {
    username: `siri_e2e_${suffix}`,
    password: "MatibayNaPassword1",
    displayName: "Siri Dela Cruz",
    classCode,
    readingLevel: "instructional",
  });
  if (student.status !== 201) throw new Error(`student register: ${student.status}`);
  studentCookie = student.cookie;

  installFetchShim();
});

afterAll(() => {
  if (apiAvailable) globalThis.fetch = realFetch;
});

afterEach(() => {
  cleanup();
});

let consoleErrors = [];

function renderAs(cookie, path) {
  session.cookie = cookie;
  consoleErrors = [];
  vi.spyOn(console, "error").mockImplementation((...args) => {
    consoleErrors.push(args.map(String).join(" "));
  });
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  );
}

function assertCleanConsole() {
  const real = consoleErrors.filter(
    (message) =>
      !message.includes("not wrapped in act") &&
      !message.includes("Warning: React Router Future Flag"),
  );
  expect(real, `console.error: ${real.join(" | ")}`).toHaveLength(0);
}

describe("mga pahina ng mag-aaral laban sa tunay na API", () => {
  const pages = [
    ["/student/dashboard", /pangunahing pahina/i],
    ["/student/aralin", /mga aralin/i],
    ["/student/aktibidad", /pagsasanay/i],
    ["/student/pagsusulit", /mga pagsusulit/i],
    ["/student/progreso", /aking pag-unlad/i],
    ["/student/mga-gantimpala", /gantimpala/i],
    ["/student/pasimplehin", /tagapagpasimple/i],
    ["/student/profile", /profile|pangalan/i],
  ];

  for (const [path, expectation] of pages) {
    it(`binubuksan ang ${path} nang walang error`, async () => {
      if (!apiAvailable) return;
      renderAs(studentCookie, path);
      await waitFor(() => {
        expect(screen.getAllByText(expectation).length).toBeGreaterThan(0);
      }, { timeout: 4000 });
      assertCleanConsole();
    });
  }

  it("nabubuksan ang aralin at ang tatlong antas ng teksto", async () => {
    if (!apiAvailable) return;
    const response = await realFetch(`${API_ORIGIN}/api/student/lessons`, {
      headers: { cookie: studentCookie },
    });
    expect(response.status).toBe(200);
    const lessons = await response.json();
    expect(lessons.lessons.length).toBeGreaterThan(0);

    const lessonId = lessons.lessons[0].id;
    renderAs(studentCookie, `/student/aralin/${lessonId}`);
    await waitFor(() => {
      expect(screen.getAllByText(/malayang pagbasa/i).length).toBeGreaterThan(0);
    });
    assertCleanConsole();
  });
});

describe("navigasyon ng sidebar", () => {
  const STUDENT_LABELS = [
    "Pangunahing Pahina",
    "Mga Aralin",
    "AI Tagapagpasimple",
    "Pagsasanay",
    "Mga Pagsusulit",
    "Mga Gantimpala",
    "Aking Pag-unlad",
    "Aking Profile",
  ];

  it("tama at kumpleto ang mga link ng mag-aaral", async () => {
    if (!apiAvailable) return;
    renderAs(studentCookie, "/student/dashboard");
    const nav = await screen.findByRole("navigation", { name: "Mga pahina" });
    const labels = [...nav.querySelectorAll("a")].map((link) => link.textContent.trim());
    for (const label of STUDENT_LABELS) {
      expect(labels, `kulang ang "${label}"`).toContain(label);
    }
    expect(labels).not.toContain("Iba Pang Pahina");
    expect(labels.join(" ")).not.toMatch(/tanawan ng guro|misyon/i);
    assertCleanConsole();
  });

  it("isang link lamang ang aktibo at may highlight", async () => {
    if (!apiAvailable) return;
    renderAs(studentCookie, "/student/aralin");
    const nav = await screen.findByRole("navigation", { name: "Mga pahina" });
    const links = [...nav.querySelectorAll("a")];
    const active = links.filter((link) => link.getAttribute("aria-current") === "page");
    expect(active).toHaveLength(1);
    expect(active[0].textContent.trim()).toBe("Mga Aralin");
    expect(active[0].className).toMatch(/bg-white/);
    assertCleanConsole();
  });

  it("hiwalay ang menu ng guro sa menu ng mag-aaral", async () => {
    if (!apiAvailable) return;
    renderAs(teacherCookie, "/teacher/dashboard");
    const nav = await screen.findByRole("navigation", { name: "Mga pahina" });
    const text = nav.textContent;
    expect(text).toContain("Progreso ng Mag-aaral");
    expect(text).toContain("Pamamahala ng Aralin");
    expect(text).not.toContain("AI Tagapagpasimple");
    expect(text).not.toContain("Aking Pag-unlad");
    assertCleanConsole();
  });
});

describe("player ng pagsusulit", () => {
  it("sinisimulan ang pagtatangka at lumalabas ang tanong", async () => {
    if (!apiAvailable) return;
    const response = await realFetch(`${API_ORIGIN}/api/student/activities?kind=quiz`, {
      headers: { cookie: studentCookie },
    });
    const { activities } = await response.json();
    expect(activities.length).toBeGreaterThan(0);

    renderAs(studentCookie, `/student/pagsusulit/${activities[0].id}`);

    await waitFor(
      () => {
        expect(screen.getAllByText(/tanong/i).length).toBeGreaterThan(0);
      },
      { timeout: 6000 },
    );
    assertCleanConsole();
  });
});

describe("mga pahina ng guro laban sa tunay na API", () => {
  const pages = [
    ["/teacher/dashboard", /pangunahing pahina|mag-aaral/i],
    ["/teacher/mga-mag-aaral", /mga mag-aaral/i],
    ["/teacher/mga-aralin", /pamamahala ng aralin/i],
    ["/teacher/mga-aktibidad", /mga aktibidad/i],
    ["/teacher/mga-pagsusulit", /mga pagsusulit/i],
    ["/teacher/progreso", /progreso ng mag-aaral/i],
    ["/teacher/mga-ulat", /ulat/i],
    ["/teacher/profile", /profile|klase/i],
  ];

  for (const [path, expectation] of pages) {
    it(`binubuksan ang ${path} nang walang error`, async () => {
      if (!apiAvailable) return;
      renderAs(teacherCookie, path);
      await waitFor(() => {
        expect(screen.getAllByText(expectation).length).toBeGreaterThan(0);
      }, { timeout: 4000 });
      assertCleanConsole();
    });
  }

  it("nakikita ng guro ang sariling mag-aaral sa listahan", async () => {
    if (!apiAvailable) return;
    renderAs(teacherCookie, "/teacher/mga-mag-aaral");
    await waitFor(() => {
      expect(screen.getAllByText(/siri/i).length).toBeGreaterThan(0);
    }, { timeout: 4000 });
    assertCleanConsole();
  });
});

describe("hindi nagpapalit ng tungkulin ang guard", () => {
  it("hindi mabubuksan ng mag-aaral ang /teacher/mga-ulat", async () => {
    if (!apiAvailable) return;
    renderAs(studentCookie, "/teacher/mga-ulat");
    await waitFor(
      () => {
        expect(screen.queryByText(/ulat ng klase|buong ulat/i)).not.toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  });

  it("hindi mabubuksan ng guro ang /student/aralin", async () => {
    if (!apiAvailable) return;
    renderAs(teacherCookie, "/student/aralin");
    await waitFor(
      () => {
        expect(screen.queryByPlaceholderText(/maghanap ng aralin/i)).not.toBeInTheDocument();
      },
      { timeout: 4000 },
    );
  });
});

describe("progreso na nakatali sa backend", () => {
  it("lumalabas sa guro ang aralin na tinapos ng mag-aaral", async () => {
    if (!apiAvailable) return;

    const listResponse = await realFetch(`${API_ORIGIN}/api/student/lessons`, {
      headers: { cookie: studentCookie },
    });
    const { lessons } = await listResponse.json();

    const completion = await realFetch(
      `${API_ORIGIN}/api/student/lessons/${lessons[0].id}/complete`,
      { method: "POST", headers: { cookie: studentCookie } },
    );
    expect(completion.status).toBe(200);

    // Ang XP ay isang beses lang ibinibigay kahit tapusin muli.
    const again = await realFetch(
      `${API_ORIGIN}/api/student/lessons/${lessons[0].id}/complete`,
      { method: "POST", headers: { cookie: studentCookie } },
    );
    const first = await completion.json();
    const second = await again.json();
    expect(first.alreadyCompleted).toBe(false);
    expect(second.alreadyCompleted).toBe(true);
    expect(second.lessonXp).toBe(0);
    expect(second.stats.points).toBe(first.stats.points);

    renderAs(teacherCookie, "/teacher/progreso");
    await waitFor(
      () => {
        expect(screen.getAllByText(/1\/\d+ aralin/).length).toBeGreaterThan(0);
      },
      { timeout: 5000 },
    );
    assertCleanConsole();
    cleanup();
  });

  it("nakikita ng mag-aaral ang sariling pag-unlad", async () => {
    if (!apiAvailable) return;
    renderAs(studentCookie, "/student/progreso");
    await waitFor(
      () => {
        expect(screen.getAllByText(/aking pag-unlad/i).length).toBeGreaterThan(0);
        expect(screen.queryByText(/^0%$/)).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    assertCleanConsole();
  });
});
