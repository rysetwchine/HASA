import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import App from "../app/App.jsx";
import { READING_LEVELS } from "../utils/readingLevels.js";

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
 * Ang buong UI ng mag-aaral ay Filipino na. Ang mga pamagat dito ang
 * aktwal na H1 ng bawat ruta.
 */
const ROUTES = [
  ["/", "Maligayang pagbabalik, Siri!"],
  ["/mga-aralin", "Mga Aralin sa Araling Panlipunan"],
  ["/mga-aralin/lesson-1-5", "Sanhi ng Rebolusyong Pilipino"],
  ["/pagsasanay", "PAGSASANAY"],
  ["/mga-gantimpala", "MGA GANTIMPALA"],
  ["/login", "HASA: TARA, MATUTO AT MAHASA!"],
  ["/register", "Gumawa ng Account"],
  ["/pasimplehin", "AI Tagapagpasimple"],
  ["/aktibidad", "PAGSASANAY"],
  ["/misyon", "Mga Misyon"],
  ["/mga-nakamit", "MGA GANTIMPALA"],
  ["/pag-unlad", "AKING PAG-UNLAD"],
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

  it("may mensahe kapag wala ang aralin", () => {
    renderAt("/mga-aralin/wala-ito");
    expect(screen.getByText(/Hindi mahanap ang aralin/i)).toBeInTheDocument();
  });
});

describe("antas ng pagbasa", () => {
  it("ipinapakita ang tatlong aprubadong label sa AI Tagapagpasimple", () => {
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

    expect(screen.getAllByText(/Hindi ito gawa ng AI/i).length).toBeGreaterThan(
      0,
    );
  });

  it("sinasabi kung hindi naka-configure ang AI provider", () => {
    renderAt("/pasimplehin");

    expect(
      screen.getByText(/Hindi naka-configure ang AI provider/i),
    ).toBeInTheDocument();
  });

  it("nagbubukas ng totoong activity mula sa Pagsasanay", async () => {
    const user = userEvent.setup();
    renderAt("/aktibidad");

    const playButtons = screen.getAllByRole("button", { name: /^Laruin ang/i });
    // Anim na challenge card + ang tampok na hamon.
    expect(playButtons.length).toBe(7);
    for (const button of playButtons) {
      expect(button).toBeEnabled();
    }

    await user.click(
      screen.getByRole("button", { name: /Laruin ang tampok na hamon/i }),
    );

    expect(
      screen.getByRole("dialog", { name: /MAINIT NA UPUAN SA KASAYSAYAN/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Aling samahan ang nakipaglaban/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByRole("timer")).toBeInTheDocument();
  });

  it("nagsasala ng Pagsusulit at Gawaing Kasanayan", async () => {
    const user = userEvent.setup();
    renderAt("/aktibidad");

    await user.click(
      screen.getByRole("button", { name: "Gawaing Kasanayan" }),
    );
    expect(
      screen.getByRole("heading", { name: "Detektib ng Sanggunian" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Tagabuo ng Oras" }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Pagsusulit" }));
    expect(
      screen.getByRole("heading", { name: "Tagabuo ng Oras" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Detektib ng Sanggunian" }),
    ).not.toBeInTheDocument();
  });
});

describe("dashboard", () => {
  it("ipinapakita ang module card at mga seksyon", () => {
    renderAt("/");

    expect(
      screen.getByRole("heading", { name: "Magpatuloy sa pag-aaral" }),
    ).toBeInTheDocument();
    // Ang CTA ay tumuturo sa tunay na aralin, hindi lamang sa listahan.
    expect(
      screen.getByRole("link", { name: /ang Aralin$/i }),
    ).toHaveAttribute("href", expect.stringMatching(/^\/mga-aralin\/lesson-/));
    expect(
      screen.getByRole("heading", { name: "Mga Nakaraang Nakamit" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Mga Anunsyo" }),
    ).toBeInTheDocument();
  });

  it("ipinapakita ang antas at XP ng halimbawang mag-aaral", () => {
    renderAt("/");

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === "P" &&
          /1,200 \/ 1,500 XP\s*para sa antas 5/.test(
            element.textContent ?? "",
          ),
      ),
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

  it("nagbubukas ng panel ng mga abiso", async () => {
    const user = userEvent.setup();
    renderAt("/");

    const bell = screen.getByRole("button", { name: /Mga Abiso/i });
    expect(bell).toBeEnabled();

    await user.click(bell);

    const panel = screen.getByRole("dialog", { name: /Mga Abiso/i });
    expect(
      within(panel).getByText(/2 halimbawang anunsyo/i),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(/Hamon ng Katapusan ng Linggo!/i),
    ).toBeInTheDocument();
    expect(
      within(panel).getByText(/Walang live na notification system/i),
    ).toBeInTheDocument();
  });

  it("nagbubukas ng listahan ng anunsyo", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(screen.getByRole("button", { name: /^Tingnan lahat$/i }));

    const dialog = screen.getByRole("dialog", { name: "Mga Anunsyo" });
    expect(
      within(dialog).getByText(/Walang live na feed ng anunsyo/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getAllByText(/Hamon ng Katapusan ng Linggo!/i).length,
    ).toBeGreaterThan(0);
  });

  it("nagbubukas ng menu ng profile at bumabalik sa login", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.click(
      screen.getByRole("button", { name: /Menu ng profile ni Siri/i }),
    );

    const menu = screen.getByRole("menu", { name: /Menu ng profile/i });
    expect(
      within(menu).getByRole("menuitem", { name: /Aking Pag-unlad/i }),
    ).toHaveAttribute("href", "/pag-unlad");

    await user.click(within(menu).getByRole("menuitem", { name: /Mag-logout/i }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "HASA: TARA, MATUTO AT MAHASA!",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Naka-log out ka sa prototype/i),
    ).toBeInTheDocument();
  });
});

describe("mga aralin", () => {
  it("hinahanap ang aralin sa search bar", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Maghanap ng Aralin/i }),
      "Pakikidigma",
    );

    expect(
      screen.getByRole("heading", {
        name: /Ang Katipunan at ang Panawagan sa Pakikidigma/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Sanhi ng Rebolusyong Pilipino/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("hinahanap din gamit ang bilang ng aralin", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Maghanap ng Aralin/i }),
      "3.5",
    );

    expect(
      screen.getByRole("heading", { name: /Pagpapahayag ng Kalayaan/i }),
    ).toBeInTheDocument();
  });

  it("hinahanap din ang mga salita sa nilalaman ng aralin", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Maghanap ng Aralin/i }),
      "Kalakalang Galyon",
    );

    expect(
      screen.getByRole("heading", {
        name: /Pagbabalik-aral sa Panahon ng mga Kastila/i,
      }),
    ).toBeInTheDocument();
  });

  it("nagsasala ng natapos na aralin", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.click(screen.getByRole("button", { name: "Natapos Na" }));

    expect(
      screen.getByRole("heading", {
        name: /Sanhi ng Rebolusyong Pilipino/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Ang Katipunan at ang Panawagan sa Pakikidigma/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("nagsasala gamit ang antas ng hirap", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.click(screen.getByRole("button", { name: "Madali" }));

    expect(
      screen.getByRole("heading", {
        name: /Sanhi ng Rebolusyong Pilipino/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: /Ang Labanan sa Look ng Maynila/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("nagpapalit ng grid at list view", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    expect(await screen.findByRole("button", { name: "Grid na Ayos" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    await user.click(screen.getByRole("button", { name: "Listahang Ayos" }));

    expect(
      screen.getByRole("button", { name: "Listahang Ayos" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "Grid na Ayos" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("nagpapakita ng empty state at nagre-reset ng salaan", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.type(
      screen.getByRole("searchbox", { name: /Maghanap ng Aralin/i }),
      "walang ganitong aralin",
    );

    expect(
      screen.getByText(/Walang aralin na tumugma/i),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /I-reset ang mga salaan/i }),
    );

    expect(
      screen.getByRole("heading", {
        name: /Sanhi ng Rebolusyong Pilipino/i,
      }),
    ).toBeInTheDocument();
  });

  it("binubuksan ang tamang aralin mula sa card", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin");

    await user.click(
      screen.getByRole("link", {
        name: /Aralin 2\.3: Ang Katipunan at ang Panawagan sa Pakikidigma/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Ang Katipunan at ang Panawagan sa Pakikidigma/i,
      }),
    ).toBeInTheDocument();
    // May tunay na nilalaman at tanong ang aralin.
    expect(
      screen.getByRole("heading", { name: /Pagtatatag ng Katipunan/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Simulan — Pagsusulit/i }),
    ).toHaveAttribute("href", "/aktibidad?activity=ch6");
  });

  it("ipinapakita ang 'Ipagpatuloy' kapag may nasimulang pagsusulit", () => {
    window.localStorage.setItem(
      "hasa:progress:v1",
      JSON.stringify({
        version: 1,
        startingXp: 1200,
        xp: 1200,
        xpFromActivities: 0,
        xpFromBadges: 0,
        streak: 4,
        lastActivityDate: "2026-10-29",
        completions: {
          "featured-hot-seat": {
            title: "MAINIT NA UPUAN SA KASAYSAYAN",
            attempts: 1,
            bestCorrect: 2,
            bestPercent: 40,
            total: 5,
            completed: false,
            completedAt: null,
            xpAwarded: 0,
            lastAttemptAt: "2026-10-29T09:00:00.000Z",
          },
        },
        badges: {},
        history: [],
        updatedAt: "2026-10-29T09:00:00.000Z",
      }),
    );

    renderAt("/mga-aralin/lesson-1-5");

    expect(
      screen.getByRole("link", { name: /Ipagpatuloy — Pagsusulit/i }),
    ).toHaveAttribute("href", "/aktibidad?activity=featured-hot-seat");
    expect(screen.getAllByText(/Isinasagawa/i).length).toBeGreaterThan(0);
  });

  it("binubuksan ang pagsusulit mula sa aralin", async () => {
    const user = userEvent.setup();
    renderAt("/mga-aralin/lesson-2-3");

    await user.click(
      screen.getByRole("link", { name: /Simulan — Pagsusulit/i }),
    );

    expect(
      screen.getByRole("dialog", {
        name: /Ang Katipunan at ang Panawagan sa Pakikidigma|Hamon ng Katipunan/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Ano ang buong pangalan ng Katipunan/i).length,
    ).toBeGreaterThan(0);
  });

  it("may draft na paalala ang nilalaman ng aralin", () => {
    renderAt("/mga-aralin/lesson-3");

    expect(
      screen.getByText(/Draft na nilalaman ng aralin/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Pamamahala/i }),
    ).toBeInTheDocument();
  });

  it("ipinapakita ang tunay na katayuan pagkatapos ng pagsusulit", () => {
    window.localStorage.setItem(
      "hasa:progress:v1",
      JSON.stringify({
        version: 1,
        startingXp: 1200,
        xp: 1225,
        xpFromActivities: 25,
        xpFromBadges: 0,
        streak: 4,
        lastActivityDate: "2026-10-29",
        completions: {
          "featured-hot-seat": {
            title: "MAINIT NA UPUAN SA KASAYSAYAN",
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
        history: [],
        updatedAt: "2026-10-29T09:00:00.000Z",
      }),
    );

    renderAt("/mga-aralin");

    expect(screen.getAllByText(/Natapos Na/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", {
        name: /Aralin 1\.5: Sanhi ng Rebolusyong Pilipino — Balikan/i,
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

    await user.click(
      screen.getByRole("button", { name: /Mag-log in bilang Mag-aaral/i }),
    );

    expect(
      screen.getByText(/Ilagay ang iyong username o ID ng mag-aaral/i),
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
      screen.getByLabelText(/Username o ID ng Mag-aaral/i),
      "estudyante1",
    );
    await user.type(screen.getByLabelText(/^Password/i), "halimbawa123");
    await user.click(screen.getByRole("checkbox", { name: /Tandaan ako/i }));
    await user.click(
      screen.getByRole("button", { name: /Mag-log in bilang Mag-aaral/i }),
    );

    expect(
      screen.getByText(/Hindi pa aktibo ang pag-log in/i),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("hasa:remembered-username")).toBe(
      "estudyante1",
    );
  });

  it("may hiwalay na tab ng guro at patunay ng guro", async () => {
    const user = userEvent.setup();
    renderAt("/login");

    await user.click(screen.getByRole("tab", { name: /Guro/i }));

    expect(
      screen.getByRole("button", { name: /Mag-log in bilang Guro/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Guro/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("nagpapatunay ng registration at tapat na sinasabing hindi pa aktibo", async () => {
    const user = userEvent.setup();
    renderAt("/register");

    await user.click(
      screen.getByRole("button", { name: /Gumawa ng Account/i }),
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
      screen.getByRole("button", { name: /Gumawa ng Account/i }),
    );

    expect(
      screen.getByText(/Hindi pa aktibo ang pagpaparehistro/i),
    ).toBeInTheDocument();
  });
});

describe("mga gantimpala", () => {
  it("nagpapakita ng tunay na badge state at lokal na pag-save", () => {
    renderAt("/mga-nakamit");

    expect(
      screen.getByRole("heading", { level: 1, name: "MGA GANTIMPALA" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 3 nakamit/i)).toBeInTheDocument();
    expect(screen.getByText("Unang Hakbang")).toBeInTheDocument();
    expect(screen.getAllByText("Nakakandado").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText(/Pansamantalang lokal na pag-save/i).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/Halimbawa lamang ang nilalaman/i),
    ).toBeInTheDocument();
  });
});

describe("pag-unlad", () => {
  it("nagpapakita ng XP, streak, at walang gawa-gawang history", () => {
    renderAt("/pag-unlad");

    expect(
      screen.getByRole("heading", { level: 1, name: "AKING PAG-UNLAD" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Antas 4/i).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Wala pang natapos na aktibidad/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Pansamantalang lokal na pag-save/i).length,
    ).toBeGreaterThan(0);
  });
});

describe("nabigasyon", () => {
  it("may Filipino na pangunahing nabigasyon sa sidebar", () => {
    renderAt("/");

    const nav = screen.getByRole("navigation", {
      name: /Pangunahing nabigasyon/i,
    });
    expect(nav).toBeInTheDocument();

    for (const label of [
      "Pangunahing Pahina",
      "Mga Aralin",
      "AI Tagapagpasimple",
      "Pagsasanay",
      "Mga Gantimpala",
      "Aking Pag-unlad",
    ]) {
      expect(
        within(nav).getAllByRole("link", { name: label }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("may link sa Misyon at Tanawan ng Guro sa sidebar at mobile", () => {
    renderAt("/");

    const desktopNav = screen.getByRole("navigation", {
      name: /Pangunahing nabigasyon/i,
    });
    expect(
      within(desktopNav).getByRole("link", { name: "Misyon" }),
    ).toHaveAttribute("href", "/misyon");
    expect(
      within(desktopNav).getByRole("link", { name: "Tanawan ng Guro" }),
    ).toHaveAttribute("href", "/guro");

    const mobileNav = screen.getByRole("navigation", {
      name: /Nabigasyon sa mobile/i,
    });
    expect(
      within(mobileNav).getByRole("link", { name: "Misyon" }),
    ).toBeInTheDocument();
  });

  it("may gumaganang logout na bumabalik sa login", async () => {
    const user = userEvent.setup();
    renderAt("/guro");

    const nav = screen.getByRole("navigation", {
      name: /Pangunahing nabigasyon/i,
    });

    await user.click(within(nav).getByRole("button", { name: /Mag-logout/i }));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "HASA: TARA, MATUTO AT MAHASA!",
      }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem("hasa:demo-session:v1")).toBe(
      "signed-out",
    );
  });
});
