import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../app/App.jsx";
import { ProgressProvider } from "../app/ProgressProvider.jsx";
import ActivityPlayer from "../components/practice/ActivityPlayer.jsx";

const CORRECT_ANSWERS = [
  /Dahil ginagamit ito sa pag-inom, pagluluto, at paglilinis/i,
  /Nagkakasakit ang mga tao at namamatay ang mga isda/i,
  /Dapat nating alagaan ang mga anyong tubig/i,
];

const WRONG_ANSWERS = [
  /Dahil kulay asul ito/i,
  /Lumalaki ang mga isda/i,
  /Dapat tayong lumipat sa lungsod/i,
];

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

async function answerReadingActivity(user, answers) {
  for (let index = 0; index < answers.length; index += 1) {
    await user.click(screen.getByRole("radio", { name: answers[index] }));
    await user.click(screen.getByRole("button", { name: "Isumite ang sagot" }));

    if (index < answers.length - 1) {
      await user.click(screen.getByRole("button", { name: "Susunod na tanong" }));
    }
  }

  await user.click(screen.getByRole("button", { name: "Tingnan ang resulta" }));
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("activity player", () => {
  it("nagbubukas mula sa card at may timer ang Tagabuo ng Oras", async () => {
    const user = userEvent.setup();
    renderAt("/aktibidad");

    await user.click(
      screen.getByRole("button", { name: "Laruin ang Tagabuo ng Oras" }),
    );

    expect(
      screen.getByRole("dialog", { name: /Tagabuo ng Oras/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("timer")).toHaveTextContent("02:00");
    expect(
      screen.getAllByText(/Aling pangyayari ang nauna/i).length,
    ).toBeGreaterThan(0);
  });

  it("kinokompleto ang reading activity, nagbibigay ng XP, at hindi nagdo-doble sa retry", async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt("/aktibidad?activity=reading-water");

    expect(
      screen.getByRole("dialog", { name: /Ang Kahalagahan ng Tubig/i }),
    ).toBeInTheDocument();

    await answerReadingActivity(user, CORRECT_ANSWERS);

    expect(
      screen.getByRole("heading", { name: "Natapos ang aktibidad!" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 \/ 3 tamang sagot/i)).toBeInTheDocument();
    expect(screen.getByText(/Nakakuha ka ng \+100 XP/i)).toBeInTheDocument();
    expect(screen.getByText("5 araw")).toBeInTheDocument();
    expect(
      screen.getAllByText(/1,300 \/ 1,500 XP/i).length,
    ).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Subukan muli" }));
    await answerReadingActivity(user, CORRECT_ANSWERS);

    expect(screen.getByText(/Walang bagong XP/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/1,300 \/ 1,500 XP/i).length,
    ).toBeGreaterThan(0);

    expect(window.localStorage.getItem("hasa:progress:v1")).toContain(
      "reading-water",
    );

    unmount();
    renderAt("/pag-unlad");

    expect(
      screen.getAllByText(/1,300 \/ 1,500 XP/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Ang Kahalagahan ng Tubig/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/2 pagtatangka/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("100%").length).toBeGreaterThan(0);
  });

  it("nagtatapos at walang XP kapag naubos ang oras", async () => {
    vi.useFakeTimers();

    render(
      <ProgressProvider>
        <ActivityPlayer
          activity={{
            id: "timer-test",
            title: "Timer Test",
            xp: 10,
            passPercent: 60,
            timerSeconds: 2,
            questions: [
              {
                id: "timer-test-q1",
                prompt: "Test question?",
                options: ["Yes", "No"],
                correctIndex: 0,
                explanation: "Test explanation.",
              },
            ],
          }}
          onClose={() => {}}
        />
      </ProgressProvider>,
    );

    expect(screen.getByRole("timer")).toHaveTextContent("00:02");

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(
      screen.getByRole("heading", { name: "Magpatuloy sa pagsasanay" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Naubos ang oras/i)).toBeInTheDocument();
    expect(screen.getByText(/Walang XP ngayon/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 1 tamang sagot/i)).toBeInTheDocument();
  });

  it("hindi nagbibigay ng XP kapag bumagsak sa activity", async () => {
    const user = userEvent.setup();
    renderAt("/aktibidad?activity=reading-water");

    await answerReadingActivity(user, WRONG_ANSWERS);

    expect(
      screen.getByRole("heading", { name: "Magpatuloy sa pagsasanay" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Walang XP ngayon/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/1,200 \/ 1,500 XP/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("0 / 3 tamang sagot")).toBeInTheDocument();
  });
});
