import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../app/App.jsx";
import { PROGRESS_STORAGE_KEY } from "../services/progressStore.js";

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe("nabigasyon sa desktop", () => {
  it("may link sa Misyon at Tanawan ng Guro sa sidebar", () => {
    renderAt("/");

    const nav = screen.getByRole("navigation", {
      name: /Pangunahing nabigasyon/i,
    });

    expect(within(nav).getByRole("link", { name: /^Misyon$/i })).toHaveAttribute(
      "href",
      "/misyon",
    );
    expect(
      within(nav).getByRole("link", { name: /Tanawan ng Guro/i }),
    ).toHaveAttribute("href", "/guro");
  });
});

describe("pag-reset ng lokal na pag-unlad", () => {
  const seeded = {
    version: 1,
    startingXp: 1200,
    xp: 1240,
    xpFromActivities: 40,
    xpFromBadges: 0,
    streak: 5,
    lastActivityDate: "2026-10-29",
    completions: {
      ch1: {
        title: "Tagabuo ng Oras",
        attempts: 1,
        bestCorrect: 5,
        bestPercent: 100,
        total: 5,
        completed: true,
        completedAt: "2026-10-29T09:00:00.000Z",
        xpAwarded: 25,
        lastAttemptAt: "2026-10-29T09:00:00.000Z",
      },
    },
    badges: {},
    history: [
      {
        id: "ch1:1",
        activityId: "ch1",
        title: "Tagabuo ng Oras",
        correct: 5,
        total: 5,
        percent: 100,
        passed: true,
        timedOut: false,
        activityXp: 25,
        badgeXp: 0,
        xpAwarded: 25,
        completedAt: "2026-10-29T09:00:00.000Z",
      },
    ],
    updatedAt: "2026-10-29T09:00:00.000Z",
  };

  it("binubura ang naka-save na progreso pagkatapos ng kumpirmasyon", async () => {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(seeded));
    const user = userEvent.setup();

    renderAt("/pag-unlad");

    expect(screen.getAllByText(/Tagabuo ng Oras/i).length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole("button", { name: /I-reset ang pag-unlad/i }),
    );

    const dialog = screen.getByRole("dialog", {
      name: /I-reset ang pag-unlad\?/i,
    });
    await user.click(
      within(dialog).getByRole("button", { name: /Oo, i-reset/i }),
    );

    expect(
      screen.getByText(/Wala pang naitalang pagtatangka/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Wala pang natapos na aktibidad/i),
    ).toBeInTheDocument();

    const stored = JSON.parse(
      window.localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "null",
    );
    expect(stored?.history ?? []).toHaveLength(0);
  });
});

describe("password visibility", () => {
  it("nagpapalit ng Show/Hide sa login", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    const password = screen.getByLabelText(/^Password$/i);
    const toggle = screen.getByRole("button", { name: /Ipakita ang password/i });

    expect(password).toHaveAttribute("type", "password");

    await user.click(toggle);
    expect(password).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /Itago ang password/i }),
    ).toHaveTextContent(/Hide/i);

    await user.click(
      screen.getByRole("button", { name: /Itago ang password/i }),
    );
    expect(password).toHaveAttribute("type", "password");
  });

  it("lumilipat ng role gamit ang arrow keys", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    const studentTab = screen.getByRole("tab", { name: /Mag-aaral/i });
    studentTab.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: /Guro/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByRole("button", { name: /Mag-log in bilang Guro/i }),
    ).toBeInTheDocument();
  });
});
