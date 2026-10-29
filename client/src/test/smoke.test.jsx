import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../App.jsx";
import { READING_LEVELS } from "../lib/readingLevels.js";

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

/**
 * Ang mga pamagat ay tugma sa bagong Figma UI (English labels) maliban sa
 * mga pahinang Tagalog pa rin ang nilalaman (Misyon, Guro, 404).
 */
const ROUTES = [
  ["/", "Welcome back, Siri!"],
  ["/mga-aralin", "Araling Panlipunan"],
  ["/pagsasanay", "PRACTICE"],
  ["/mga-gantimpala", "REWARDS"],
  ["/login", "HASA: TARA, MATUTO AT MAHASA!"],
  ["/register", "Create an Account"],
  ["/pasimplehin", "AI Simplifier"],
  ["/aktibidad", "PRACTICE"],
  ["/misyon", "Mga Misyon"],
  ["/mga-nakamit", "REWARDS"],
  ["/pag-unlad", "PROGRESS"],
  ["/guro", "Tanawan ng Guro"],
  ["/hindi-ito-umiiral", "Hindi mahanap ang pahina"],
];

describe("mga ruta", () => {
  it.each(ROUTES)("nagre-render ang %s", (path, heading) => {
    renderAt(path);
    expect(
      screen.getByRole("heading", { level: 1, name: heading }),
    ).toBeInTheDocument();
  });
});

describe("antas ng pagbasa", () => {
  it("ipinapakita ang tatlong aprubadong label sa AI Simplifier", () => {
    renderAt("/pasimplehin");

    for (const level of READING_LEVELS) {
      expect(screen.getAllByText(level.label).length).toBeGreaterThan(0);
    }
  });

  it("nagpapalit ng piniling antas", async () => {
    const user = userEvent.setup();
    renderAt("/pasimplehin");

    const frustration = screen.getByRole("radio", {
      name: /Nahihirapang Pagbasa \(Frustration\)/,
    });

    await user.click(frustration);
    expect(frustration).toBeChecked();
  });

  it("may paalala na hindi sinusukat ng HASA ang kakayahan", () => {
    renderAt("/pasimplehin");

    expect(
      screen.getByText(/Hindi sinusukat ng HASA ang iyong kakayahan sa pagbasa/i),
    ).toBeInTheDocument();
  });
});

describe("katapatan ng prototype", () => {
  it("may paalala na hindi gawa ng AI ang halimbawang teksto", () => {
    renderAt("/pasimplehin");

    expect(
      screen.getAllByText(/Hindi ito gawa ng AI/i).length,
    ).toBeGreaterThan(0);
  });

  it("sinasabi kung hindi naka-configure ang AI provider", () => {
    renderAt("/pasimplehin");

    expect(
      screen.getByText(/Hindi naka-configure ang AI provider/i),
    ).toBeInTheDocument();
  });

  it("hindi nagbibigay ng puntos sa Practice", () => {
    renderAt("/aktibidad");

    // Naka-disable lahat ng laruan sa prototype — walang puntos na
    // ibinibigay at walang laro na talagang nagaganap.
    const playButtons = screen.getAllByRole("button", { name: /Play now/i });
    expect(playButtons.length).toBeGreaterThan(0);
    for (const button of playButtons) {
      expect(button).toBeDisabled();
    }
    expect(
      screen.getByText(/Halimbawa lamang ang nilalaman/i),
    ).toBeInTheDocument();
  });
});

describe("dashboard", () => {
  it("ipinapakita ang module card at mga seksyon", () => {
    renderAt("/");

    expect(
      screen.getByText(/MODULE 3: Rise of Nationalism in the Philippines/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Recent Achievements" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Announcement" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Resume Lesson/i })).toHaveAttribute(
      "href",
      "/mga-aralin",
    );
  });

  it("ipinapakita ang antas at XP ng halimbawang mag-aaral", () => {
    renderAt("/");

    expect(
      screen.getByText(/1,200 \/ 1,500 XP\s+to level 5/),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("progressbar", {
        name: /XP patungo sa susunod na antas/i,
      }).length,
    ).toBeGreaterThan(0);
  });

  it("may malinaw na paalala ng halimbawang datos", () => {
    renderAt("/");

    expect(
      screen.getByText(/Halimbawa lamang ang nilalaman/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Halimbawang mag-aaral/i).length).toBeGreaterThan(
      0,
    );
  });

  it("hindi nagpapanggap na may abiso ang prototype", () => {
    renderAt("/");

    expect(screen.getByRole("button", { name: /Abiso/i })).toBeDisabled();
  });
});

describe("mga aralin", () => {
  it("hinahanap ang aralin sa search bar", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Search lessons/i }),
      "Cause",
    );

    expect(
      screen.getByRole("heading", {
        name: /Cause of the Philippine Revolution/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Katipunan and the Call to Arms/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("nagfi-filter ng natapos na aralin", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.click(screen.getByRole("button", { name: "Completed" }));

    expect(
      screen.getByRole("heading", {
        name: /Cause of the Philippine Revolution/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Katipunan and the Call to Arms/i,
      }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Completed").length).toBeGreaterThan(0);
  });

  it("nagpapalit ng grid at list view", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    const listButton = screen.getByRole("button", { name: "List View" });
    const gridButton = screen.getByRole("button", { name: "Grid View" });

    await user.click(listButton);
    expect(listButton).toHaveAttribute("aria-pressed", "true");
    expect(gridButton).toHaveAttribute("aria-pressed", "false");

    await user.click(gridButton);
    expect(gridButton).toHaveAttribute("aria-pressed", "true");
  });

  it("nagpapakita ng empty state at nagre-reset ng filter", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Search lessons/i }),
      "walang ganitong aralin",
    );

    expect(screen.getByText(/Walang aralin na tugma/i)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /I-reset ang mga filter/i }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Cause of the Philippine Revolution/i,
      }),
    ).toBeInTheDocument();
  });
});

describe("login at registration", () => {
  it("nagpapakita at nagtatago ng password", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    const password = screen.getByLabelText(/^Password/i);
    expect(password).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: /Ipakita ang password/i }),
    );
    expect(password).toHaveAttribute("type", "text");

    await user.click(
      screen.getByRole("button", { name: /Itago ang password/i }),
    );
    expect(password).toHaveAttribute("type", "password");
  });

  it("nagpapatunay ng walang laman na login form", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await user.click(screen.getByRole("button", { name: /Log in as Student/i }));

    expect(
      screen.getByText(/Ilagay ang iyong username o student ID/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Ilagay ang iyong password/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Hindi pa aktibo ang pag-log in/i),
    ).not.toBeInTheDocument();
  });

  it("nagpapatunay ng login at tapat na sinasabing hindi pa aktibo", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await user.type(
      screen.getByLabelText(/Username \/ Student I'D/i),
      "estudyante1",
    );
    await user.type(screen.getByLabelText(/^Password/i), "halimbawa123");
    await user.click(screen.getByRole("checkbox", { name: /Remember me/i }));
    await user.click(screen.getByRole("button", { name: /Log in as Student/i }));

    expect(
      screen.getByText(/Hindi pa aktibo ang pag-log in/i),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("hasa:remembered-username")).toBe(
      "estudyante1",
    );
  });

  it("may hiwalay na teacher tab at patunay ng guro", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await user.click(screen.getByRole("tab", { name: /Teacher/i }));

    expect(
      screen.getByRole("button", { name: /Log in as Teacher/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Teacher/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("nagpapatunay ng registration at tapat na sinasabing hindi pa aktibo", async () => {
    const user = userEvent.setup();
    renderAt("/register");

    await user.click(
      screen.getByRole("button", { name: /Create an Account/i }),
    );

    expect(screen.getByText(/Gumawa ng username/i)).toBeInTheDocument();
    expect(screen.getByText(/Gumawa ng password/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Ilagay ang kodigo ng klase mula sa iyong guro/i),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Username/i), "bagongmag-aaral");
    await user.type(screen.getByLabelText(/^Password/i), "halimbawa123");
    await user.type(screen.getByLabelText(/Palayaw sa HASA/i), "Siri");
    await user.type(screen.getByLabelText(/Kodigo ng Klase/i), "HASA-8A");
    await user.click(
      screen.getByRole("button", { name: /Create an Account/i }),
    );

    expect(
      screen.getByText(/Hindi pa aktibo ang pagpaparehistro/i),
    ).toBeInTheDocument();
  });
});

describe("mga nakamit", () => {
  it("nagpapakita ng placeholder at paalala ng halimbawang datos", () => {
    renderAt("/mga-nakamit");

    expect(
      screen.getByRole("heading", { level: 1, name: "REWARDS" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Mga gantimpala/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Halimbawa lamang ang nilalaman/i),
    ).toBeInTheDocument();
  });
});

describe("nabigasyon", () => {
  it("may pangunahing nabigasyon at mga item sa sidebar", () => {
    renderAt("/");

    const nav = screen.getByRole("navigation", {
      name: /Pangunahing nabigasyon/i,
    });
    expect(nav).toBeInTheDocument();

    for (const label of [
      "Dashboard",
      "Lessons",
      "AI Simplifier",
      "Practice",
      "Rewards",
      "Progress",
    ]) {
      expect(
        screen.getAllByRole("link", { name: label }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("may nabigasyon sa mobile para sa mga pahinang wala sa Figma", () => {
    renderAt("/");

    const mobileNav = screen.getByRole("navigation", {
      name: /Nabigasyon sa mobile/i,
    });
    expect(mobileNav).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: "Misyon" }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: "Tanawan ng Guro" }).length,
    ).toBeGreaterThan(0);
  });

  it("hindi nagpapanggap na available ang log out", () => {
    renderAt("/");

    expect(screen.getByRole("button", { name: /Logout/i })).toBeDisabled();
  });
});
