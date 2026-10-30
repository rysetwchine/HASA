/**
 * Mga pagsubok para sa route guards at session behaviour.
 *
 * Ang `AuthProvider` ay hindi tumatawag sa tunay na API dito — ang
 * `/auth/me` ay hinaharang at pinapalitan ng pekeng sagot, kaya walang
 * network na kailangan.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthProvider } from "../app/AuthProvider.jsx";
import AppRoutes from "../app/router.jsx";

const STUDENT = {
  user: {
    id: 1,
    username: "mag_aaral",
    role: "student",
    displayName: "Siri",
    readingLevel: "instructional",
    class: { id: 1, name: "Grade 8 - Rizal", joinCode: null, teacherName: "Guro" },
  },
  stats: { points: 120, level: 2, streak: 3 },
};

const TEACHER = {
  user: {
    id: 2,
    username: "guro",
    role: "teacher",
    displayName: "Guro Cruz",
    class: { id: 9, name: "Grade 8 - Rizal", joinCode: "HASA-ABC123", studentCount: 12 },
  },
};

/** Pinapalitan ang global fetch ng scripted na sagot. */
function mockFetch(handler) {
  const fetchMock = vi.fn(async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    const result = handler(url, init);
    return new Response(JSON.stringify(result.body ?? {}), {
      status: result.status ?? 200,
      headers: { "content-type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>,
  );
}

/** Ang pampublikong landing page ay may ganitong pamagat. */
const LANDING_MARKER = /HASA/i;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("guard ng ruta", () => {
  beforeEach(() => {
    mockFetch((url) => {
      if (url.endsWith("/auth/me")) return { status: 401, body: { error: { code: "UNAUTHORIZED" } } };
      return { status: 404, body: { error: { code: "NOT_FOUND" } } };
    });
  });

  it("ipinapadala sa /login ang bisitang pumasok sa /student/dashboard", async () => {
    renderAt("/student/dashboard");
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mag-log in sa hasa/i })).toBeInTheDocument();
    });
    expect(screen.queryByText(/Aking Pag-unlad/i)).not.toBeInTheDocument();
  });

  it("ipinapadala sa /login ang bisitang pumasok sa /teacher/dashboard", async () => {
    renderAt("/teacher/dashboard");
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mag-log in sa hasa/i })).toBeInTheDocument();
    });
  });

  it("hindi pinapasok ang bisita sa /teacher/mga-ulat", async () => {
    renderAt("/teacher/mga-ulat");
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /mag-log in sa hasa/i })).toBeInTheDocument();
    });
  });

  it("ipinapakita ang pampublikong landing page sa /", async () => {
    renderAt("/");
    await waitFor(() => {
      expect(screen.getAllByText(LANDING_MARKER).length).toBeGreaterThan(0);
    });
  });
});

describe("hiwalay na karanasan ng mag-aaral at guro", () => {
  it("hindi makapasok ang mag-aaral sa mga rutang pang-guro", async () => {
    mockFetch((url) => {
      if (url.endsWith("/auth/me")) return { body: STUDENT };
      return { status: 404, body: { error: { code: "NOT_FOUND" } } };
    });

    renderAt("/teacher/mga-mag-aaral");

    // Dapat mapunta siya sa sariling dashboard, hindi sa page ng guro.
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /mga mag-aaral/i })).not.toBeInTheDocument();
    });
  });

  it("hindi makapasok ang guro sa mga rutang pang-mag-aaral", async () => {
    mockFetch((url) => {
      if (url.endsWith("/auth/me")) return { body: TEACHER };
      return { status: 404, body: { error: { code: "NOT_FOUND" } } };
    });

    renderAt("/student/aralin");

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /mga aralin/i })).not.toBeInTheDocument();
    });
  });
});
